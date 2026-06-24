"""
Integration Tests (Resume Upload + ATS Analysis)

Coverage:
  • POST /resume/upload — valid PDF
  • POST /resume/upload — wrong MIME type → 400
  • POST /resume/upload — oversized PDF → 400
  • POST /resume/upload — scanned PDF (no extractable text) → still 200
  • POST /resume/upload — response does NOT contain disk path (security)
  • POST /resume/upload — storage failure → 500
  • GET  /resume/upload — list all uploaded resumes
  • GET  /resume/upload/{id} — found
  • GET  /resume/upload/{id} — 404 (unknown id)

All tests mock out:
  • ResumeParserService.extract_text  (avoids real pdfplumber)
  • FileStorageService.save_file      (avoids real disk writes / crypto)
  • save_uploaded_resume              (avoids real JSON writes)

"""

import io
from unittest.mock import patch

from fastapi.testclient import TestClient

from src.main import app
from tests.conftest import make_fake_pdf

client = TestClient(app)

_FAKE_FILE_META = {
    "id": "file-uuid-001",
    "filename": "cv.pdf",
    "path": "/uploads/file-uuid-001_cv.pdf.enc",
}

_FAKE_PARSED = {
    "full_name": "Jane Doe",
    "email": "jane@example.com",
    "skills": ["Python"],
    "experience": [{"raw": "Did stuff"}],
    "education": [],
}

_FAKE_RESUME_RECORD = {
    "resume_id": "r-001",
    "file": {"id": "r-001", "filename": "a.pdf", "path": "/x.enc"},
    "parsed": {
        "full_name": "Alice",
        "email": "alice@x.com",
        "skills": [],
        "experience": [],
        "education": [],
    },
}


def _upload(content: bytes | None = None, content_type: str = "application/pdf"):
    content = content or make_fake_pdf()
    return client.post(
        "/resume/upload",
        files={"file": ("cv.pdf", io.BytesIO(content), content_type)},
    )


class TestUploadHappyPath:
    @patch("src.api.routes.resume_upload.save_uploaded_resume")
    @patch("src.api.routes.resume_upload.storage.save_file", return_value=_FAKE_FILE_META)
    @patch(
        "src.api.routes.resume_upload.parser.extract_text",
        return_value="Jane Doe\njane@example.com\nPython",
    )
    def test_valid_pdf_returns_200(self, mock_extract, mock_save_file, mock_db):
        resp = _upload()
        assert resp.status_code == 200
        body = resp.json()
        assert body["status"] == "success"
        assert body["data"]["resume_id"] == "file-uuid-001"

    @patch("src.api.routes.resume_upload.save_uploaded_resume")
    @patch("src.api.routes.resume_upload.storage.save_file", return_value=_FAKE_FILE_META)
    @patch(
        "src.api.routes.resume_upload.parser.extract_text",
        return_value="Jane Doe\njane@example.com\nPython",
    )
    def test_response_contains_all_parsed_fields(self, mock_extract, mock_save_file, mock_db):
        resp = _upload()
        parsed = resp.json()["data"]["parsed"]
        assert "full_name" in parsed
        assert "email" in parsed
        assert "skills" in parsed
        assert "experience" in parsed
        assert "education" in parsed

    @patch("src.api.routes.resume_upload.save_uploaded_resume")
    @patch("src.api.routes.resume_upload.storage.save_file", return_value=_FAKE_FILE_META)
    @patch(
        "src.api.routes.resume_upload.parser.extract_text",
        return_value="Jane Doe\njane@example.com\nPython",
    )
    def test_response_does_not_expose_disk_path(self, mock_extract, mock_save_file, mock_db):
        resp = _upload()
        body_str = resp.text
        assert ".enc" not in body_str
        assert "/uploads/" not in body_str


class TestUploadScannedPdf:
    @patch("src.api.routes.resume_upload.save_uploaded_resume")
    @patch("src.api.routes.resume_upload.storage.save_file", return_value=_FAKE_FILE_META)
    @patch("src.api.routes.resume_upload.parser.extract_text", return_value="")
    def test_scanned_pdf_still_returns_200(self, mock_extract, mock_save_file, mock_db):
        resp = _upload()
        assert resp.status_code == 200
        parsed = resp.json()["data"]["parsed"]
        assert parsed["skills"] == []
        assert parsed["full_name"] is None


class TestUploadValidationErrors:
    def test_wrong_mime_type_returns_400(self):
        resp = _upload(content_type="application/msword")
        assert resp.status_code == 400
        assert "Unsupported file type" in resp.json()["detail"]

    def test_oversized_file_returns_400(self):
        with patch("src.utils.file_validator.settings") as ms:
            ms.MAX_UPLOAD_SIZE_BYTES = 5
            ms.MAX_UPLOAD_SIZE_MB = 0
            resp = _upload(content=b"x" * 10)
        assert resp.status_code == 400
        assert "too large" in resp.json()["detail"].lower()


class TestUploadStorageFailure:
    @patch(
        "src.api.routes.resume_upload.parser.extract_text",
        return_value="Jane Doe\njane@example.com",
    )
    @patch(
        "src.api.routes.resume_upload.storage.save_file",
        side_effect=OSError("disk full"),
    )
    def test_storage_failure_returns_500(self, mock_save_file, mock_extract):
        resp = _upload()
        assert resp.status_code == 500
        assert "Could not store" in resp.json()["detail"]


class TestListUploadedResumes:
    @patch(
        "src.api.routes.resume_upload.list_uploaded_resumes",
        return_value=[_FAKE_RESUME_RECORD],
    )
    def test_returns_200_with_records(self, mock_list):
        resp = client.get("/resume/upload")
        assert resp.status_code == 200
        body = resp.json()
        assert body["status"] == "success"
        assert len(body["data"]) == 1
        assert body["data"][0]["resume_id"] == "r-001"

    @patch("src.api.routes.resume_upload.list_uploaded_resumes", return_value=[])
    def test_empty_list_returns_empty_array(self, mock_list):
        resp = client.get("/resume/upload")
        assert resp.status_code == 200
        assert resp.json()["data"] == []


class TestGetUploadedResumeById:
    @patch(
        "src.api.routes.resume_upload.find_uploaded_resume",
        return_value={
            "resume_id": "r-abc",
            "file": {"id": "r-abc", "filename": "cv.pdf", "path": "/cv.enc"},
            "parsed": {
                "full_name": "Bob",
                "email": "bob@x.com",
                "skills": ["Docker"],
                "experience": [],
                "education": [],
            },
        },
    )
    def test_found_returns_200(self, mock_find):
        resp = client.get("/resume/upload/r-abc")
        assert resp.status_code == 200
        assert resp.json()["data"]["resume_id"] == "r-abc"

    @patch("src.api.routes.resume_upload.find_uploaded_resume", return_value=None)
    def test_not_found_returns_404(self, mock_find):
        resp = client.get("/resume/upload/ghost-id")
        assert resp.status_code == 404
        assert "not found" in resp.json()["detail"].lower()
