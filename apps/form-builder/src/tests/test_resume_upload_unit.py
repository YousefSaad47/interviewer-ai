"""
Unit Tests (Resume Upload + ATS Analysis)

Coverage:
  • ResumeParserService.extract_text    — happy path + scanned PDF + multi-page
  • ResumeAnalysisService.analyze       — all five fields
  • ResumeAnalysisService.extract_name  — skips headers, handles Arabic
  • ResumeAnalysisService.extract_email — valid / invalid
  • ResumeAnalysisService.extract_skills — case-insensitive match
  • ResumeAnalysisService.extract_education — keyword matching
  • FileStorageService.save_file / read_file — encrypt / decrypt round-trip
  • validate_file     — wrong MIME type raises 400
  • validate_file_size — oversized content raises 400
  • sanitize_filename — path traversal prevention
  • mock_db helpers   — uploaded resumes (save / find / list)

"""

import uuid
from unittest.mock import MagicMock, patch

import pytest


class TestResumeParserService:
    def test_extract_text_returns_string_for_valid_pdf(self):
        from src.services.resume_parser import ResumeParserService

        svc = ResumeParserService()
        mock_page = MagicMock()
        mock_page.extract_text.return_value = "Jane Doe\njane@example.com"

        with patch("src.services.resume_parser.pdfplumber") as mock_plumber:
            mock_plumber.open.return_value.__enter__.return_value.pages = [mock_page]
            result = svc.extract_text(b"%PDF fake")

        assert "Jane Doe" in result
        assert "jane@example.com" in result

    def test_extract_text_returns_empty_string_on_scanned_pdf(self):
        from src.services.resume_parser import ResumeParserService

        svc = ResumeParserService()
        mock_page = MagicMock()
        mock_page.extract_text.return_value = None

        with patch("src.services.resume_parser.pdfplumber") as mock_plumber:
            mock_plumber.open.return_value.__enter__.return_value.pages = [mock_page]
            result = svc.extract_text(b"%PDF fake")

        assert result == ""

    def test_extract_text_returns_empty_string_on_exception(self):
        from src.services.resume_parser import ResumeParserService

        svc = ResumeParserService()
        with patch("src.services.resume_parser.pdfplumber") as mock_plumber:
            mock_plumber.open.side_effect = Exception("corrupt PDF")
            result = svc.extract_text(b"not a pdf")

        assert result == ""

    def test_extract_text_concatenates_multiple_pages(self):
        from src.services.resume_parser import ResumeParserService

        svc = ResumeParserService()
        page1 = MagicMock()
        page1.extract_text.return_value = "Page one text"
        page2 = MagicMock()
        page2.extract_text.return_value = "Page two text"

        with patch("src.services.resume_parser.pdfplumber") as mock_plumber:
            mock_plumber.open.return_value.__enter__.return_value.pages = [page1, page2]
            result = svc.extract_text(b"%PDF fake")

        assert "Page one text" in result
        assert "Page two text" in result


class TestResumeAnalysisService:
    def _svc(self):
        from src.services.resume_analysis import ResumeAnalysisService

        return ResumeAnalysisService()

    def test_extract_name_returns_name_not_header(self):
        svc = self._svc()
        text = "RESUME\nCurriculum Vitae\nJane Doe\njane@example.com"
        assert svc.extract_name(text) == "Jane Doe"

    def test_extract_name_skips_cv_header(self):
        svc = self._svc()
        text = "Curriculum Vitae\nAhmed Hassan\nahmed@example.com"
        assert svc.extract_name(text) == "Ahmed Hassan"

    def test_extract_name_returns_none_for_empty_text(self):
        svc = self._svc()
        assert svc.extract_name("") is None

    def test_extract_name_handles_arabic_name(self):
        svc = self._svc()
        text = "أحمد حسن\nahmed@example.com\nPython"
        result = svc.extract_name(text)
        assert result == "أحمد حسن"

    def test_extract_name_skips_all_caps_section_heading(self):
        svc = self._svc()
        text = "WORK EXPERIENCE\nJane Doe\njane@example.com"
        assert svc.extract_name(text) == "Jane Doe"

    def test_extract_email_valid(self):
        svc = self._svc()
        assert svc.extract_email("Contact: jane@example.com please") == "jane@example.com"

    def test_extract_email_returns_none_when_absent(self):
        svc = self._svc()
        assert svc.extract_email("No email here") is None

    def test_extract_email_does_not_match_leading_dot(self):
        svc = self._svc()
        result = svc.extract_email("Send to .invalid@example.com")
        assert result is None or not result.startswith(".")

    def test_extract_skills_case_insensitive(self):
        svc = self._svc()
        skills = svc.extract_skills("I know PYTHON and fastapi and docker")
        skill_lower = [s.lower() for s in skills]
        assert "python" in skill_lower
        assert "fastapi" in skill_lower
        assert "docker" in skill_lower

    def test_extract_skills_returns_empty_for_blank_text(self):
        svc = self._svc()
        assert svc.extract_skills("") == []

    def test_extract_skills_no_false_positives(self):
        svc = self._svc()
        skills = svc.extract_skills("I enjoy cooking and hiking")
        assert skills == []

    def test_extract_education_finds_bsc(self):
        svc = self._svc()
        text = "BSc Computer Science, Cairo University, 2020"
        edu = svc.extract_education(text)
        assert len(edu) >= 1
        assert "bsc" in edu[0].lower() or "computer science" in edu[0].lower()

    def test_extract_education_finds_arabic_degree(self):
        svc = self._svc()
        text = "بكالوريوس علوم حاسب، جامعة القاهرة"
        edu = svc.extract_education(text)
        assert len(edu) >= 1

    def test_extract_education_returns_empty_for_blank(self):
        svc = self._svc()
        assert svc.extract_education("") == []

    def test_analyze_returns_all_fields(self):
        svc = self._svc()
        result = svc.analyze(
            "Jane Doe\njane@example.com\nPython FastAPI Docker\nBSc Computer Science, MIT, 2020"
        )
        assert set(result.keys()) == {
            "full_name",
            "email",
            "skills",
            "experience",
            "education",
            "projects",
        }

    def test_analyze_empty_text_does_not_raise(self):
        svc = self._svc()
        result = svc.analyze("")
        assert result["full_name"] is None
        assert result["email"] is None
        assert result["skills"] == []
        assert result["experience"] == []
        assert result["education"] == []


class TestFileStorageService:
    def _setup(self, tmp_path, monkeypatch):
        from cryptography.fernet import Fernet

        import src.services.file_storage as fs_module
        from src.services.file_storage import FileStorageService

        key = Fernet.generate_key()
        fernet = Fernet(key)
        monkeypatch.setattr(fs_module, "_fernet", fernet)
        return FileStorageService, fernet, fs_module

    def test_save_file_creates_encrypted_file(self, tmp_path, monkeypatch):
        FileStorageService, _, _ = self._setup(tmp_path, monkeypatch)

        with patch("src.services.file_storage.settings") as ms:
            ms.UPLOAD_DIR = str(tmp_path)
            svc = FileStorageService()
            meta = svc.save_file("cv.pdf", b"raw content")

        assert meta["id"]
        assert meta["filename"] == "cv.pdf"
        assert meta["path"].endswith(".enc")
        assert (tmp_path / meta["path"].split("/")[-1]).exists()

    def test_save_file_content_is_encrypted(self, tmp_path, monkeypatch):
        FileStorageService, fernet, _ = self._setup(tmp_path, monkeypatch)

        with patch("src.services.file_storage.settings") as ms:
            ms.UPLOAD_DIR = str(tmp_path)
            svc = FileStorageService()
            meta = svc.save_file("cv.pdf", b"secret bytes")

        raw = (tmp_path / meta["path"].split("/")[-1]).read_bytes()
        assert raw != b"secret bytes"
        assert fernet.decrypt(raw) == b"secret bytes"

    def test_read_file_roundtrip(self, tmp_path, monkeypatch):
        FileStorageService, _, _ = self._setup(tmp_path, monkeypatch)

        with patch("src.services.file_storage.settings") as ms:
            ms.UPLOAD_DIR = str(tmp_path)
            svc = FileStorageService()
            meta = svc.save_file("cv.pdf", b"round trip data")
            recovered = svc.read_file(meta["path"])

        assert recovered == b"round trip data"

    def test_unique_ids_per_upload(self, tmp_path, monkeypatch):
        FileStorageService, _, fs_module = self._setup(tmp_path, monkeypatch)

        with patch("src.services.file_storage.settings") as ms:
            ms.UPLOAD_DIR = str(tmp_path)
            svc = FileStorageService()
            id1 = svc.save_file("a.pdf", b"aaa")["id"]
            id2 = svc.save_file("b.pdf", b"bbb")["id"]

        assert id1 != id2


class TestFileValidator:
    def test_validate_file_wrong_mime_raises_400(self):
        from fastapi import HTTPException, UploadFile

        from src.utils.file_validator import validate_file

        mock_file = MagicMock(spec=UploadFile)
        mock_file.content_type = "application/msword"

        with pytest.raises(HTTPException) as exc_info:
            validate_file(mock_file)
        assert exc_info.value.status_code == 400

    def test_validate_file_pdf_passes(self):
        from fastapi import UploadFile

        from src.utils.file_validator import validate_file

        mock_file = MagicMock(spec=UploadFile)
        mock_file.content_type = "application/pdf"
        validate_file(mock_file)

    def test_validate_file_size_oversized_raises_400(self):
        from fastapi import HTTPException

        from src.utils.file_validator import validate_file_size

        with patch("src.utils.file_validator.settings") as ms:
            ms.MAX_UPLOAD_SIZE_BYTES = 10
            ms.MAX_UPLOAD_SIZE_MB = 0
            with pytest.raises(HTTPException) as exc_info:
                validate_file_size(b"x" * 11)
        assert exc_info.value.status_code == 400

    def test_validate_file_size_within_limit_passes(self):
        from src.utils.file_validator import validate_file_size

        with patch("src.utils.file_validator.settings") as ms:
            ms.MAX_UPLOAD_SIZE_BYTES = 100
            ms.MAX_UPLOAD_SIZE_MB = 1
            validate_file_size(b"x" * 50)

    def test_sanitize_filename_strips_path_traversal(self):
        from src.utils.file_validator import sanitize_filename

        result = sanitize_filename("../../etc/passwd")
        assert "/" not in result
        assert ".." not in result

    def test_sanitize_filename_preserves_normal_name(self):
        from src.utils.file_validator import sanitize_filename

        assert sanitize_filename("my_resume.pdf") == "my_resume.pdf"

    def test_sanitize_filename_empty_returns_default(self):
        from src.utils.file_validator import sanitize_filename

        assert sanitize_filename("") == "upload.pdf"
        assert sanitize_filename(None) == "upload.pdf"


class TestMockDbUploaded:
    def _record(self, rid=None):
        rid = rid or str(uuid.uuid4())
        return {
            "resume_id": rid,
            "file": {"id": rid, "filename": "cv.pdf", "path": "/uploads/cv.enc"},
            "parsed": {
                "full_name": "Jane",
                "email": "jane@example.com",
                "skills": ["Python"],
                "experience": [],
                "education": [],
            },
        }

    def test_save_and_find_uploaded_resume(self, tmp_path, monkeypatch):
        import src.models.mock_db as db

        db_file = str(tmp_path / "uploaded.json")
        monkeypatch.setattr(db, "_UPLOADED_DB_FILE", db_file)
        monkeypatch.setattr(db, "UPLOADED_RESUMES", [])

        rec = self._record("u-001")
        db.save_uploaded_resume(rec)

        found = db.find_uploaded_resume("u-001")
        assert found is not None
        assert found["resume_id"] == "u-001"

    def test_find_returns_none_for_unknown_id(self, monkeypatch):
        import src.models.mock_db as db

        monkeypatch.setattr(db, "UPLOADED_RESUMES", [])
        assert db.find_uploaded_resume("ghost") is None

    def test_list_uploaded_resumes_returns_all(self, tmp_path, monkeypatch):
        import src.models.mock_db as db

        db_file = str(tmp_path / "uploaded.json")
        monkeypatch.setattr(db, "_UPLOADED_DB_FILE", db_file)
        monkeypatch.setattr(db, "UPLOADED_RESUMES", [])

        db.save_uploaded_resume(self._record("u-001"))
        db.save_uploaded_resume(self._record("u-002"))

        all_records = db.list_uploaded_resumes()
        ids = [r["resume_id"] for r in all_records]
        assert "u-001" in ids
        assert "u-002" in ids

    def test_uploaded_persistence_across_reload(self, tmp_path, monkeypatch):
        import src.models.mock_db as db

        db_file = str(tmp_path / "uploaded.json")
        monkeypatch.setattr(db, "_UPLOADED_DB_FILE", db_file)
        monkeypatch.setattr(db, "UPLOADED_RESUMES", [])

        db.save_uploaded_resume(self._record("u-persist"))

        reloaded = db._load(db_file)
        assert any(r["resume_id"] == "u-persist" for r in reloaded)
