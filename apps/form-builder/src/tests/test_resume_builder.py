"""
Integration Tests (Resume Generation)

Coverage:
  • mock_db helpers — generated resumes (save_resume / find_resume)
  • GET  /resume/
  • POST /resume/generate   (mock provider, no API key needed)
  • GET  /resume/{id}/download — happy path
  • GET  /resume/{id}/download — 404 (unknown id)
  • GET  /resume/{id}/download — 410 (record exists but file deleted)

"""

import uuid
from unittest.mock import patch

from fastapi.testclient import TestClient

from src.main import app
from tests.conftest import FULL_PAYLOAD, MINIMAL_PAYLOAD

client = TestClient(app)


class TestMockDbGenerated:
    def test_save_and_find_resume(self, tmp_path, monkeypatch):
        import src.models.mock_db as db

        db_file = str(tmp_path / "test_generated.json")
        monkeypatch.setattr(db, "_GENERATED_DB_FILE", db_file)
        monkeypatch.setattr(db, "RESUMES", [])

        record = {"id": "abc-123", "full_name": "Test User", "pdf_path": "/tmp/abc.pdf"}
        db.save_resume(record)

        found = db.find_resume("abc-123")
        assert found is not None
        assert found["full_name"] == "Test User"

    def test_find_returns_none_for_unknown_id(self, monkeypatch):
        import src.models.mock_db as db

        monkeypatch.setattr(db, "RESUMES", [])
        assert db.find_resume("does-not-exist") is None

    def test_persistence_across_reload(self, tmp_path, monkeypatch):
        import src.models.mock_db as db

        db_file = str(tmp_path / "test_generated.json")
        monkeypatch.setattr(db, "_GENERATED_DB_FILE", db_file)
        monkeypatch.setattr(db, "RESUMES", [])

        db.save_resume({"id": "xyz", "full_name": "Persist Me", "pdf_path": "/x.pdf"})

        reloaded = db._load(db_file)
        assert any(r["id"] == "xyz" for r in reloaded)

    def test_save_resume_writes_to_generated_file_not_alias(self, tmp_path, monkeypatch):
        import src.models.mock_db as db

        real_file = str(tmp_path / "real.json")
        alias_file = str(tmp_path / "alias.json")

        monkeypatch.setattr(db, "_GENERATED_DB_FILE", real_file)
        monkeypatch.setattr(db, "_DB_FILE", alias_file)
        monkeypatch.setattr(db, "RESUMES", [])

        db.save_resume({"id": "test-fix", "full_name": "Fix Test", "pdf_path": "/p.pdf"})

        reloaded_real = db._load(real_file)
        reloaded_alias = db._load(alias_file)

        assert any(r["id"] == "test-fix" for r in reloaded_real)
        assert not any(r["id"] == "test-fix" for r in reloaded_alias)


class TestResumeBuilderRoutes:
    def test_welcome_endpoint(self):
        resp = client.get("/resume/")
        assert resp.status_code == 200
        body = resp.json()
        assert body["status"] == "online"
        assert "generate" in body["endpoints"]

    @patch("src.services.resume_generator.convert_markdown_to_pdf")
    @patch("src.services.resume_generator.save_resume")
    @patch("src.services.llm_service.LLMService._call_gemini")
    def test_generate_returns_resume_id(self, mock_gemini, mock_save, mock_pdf):
        mock_gemini.return_value = "# Test Resume\n\nThis is a mock resume."
        mock_pdf.return_value = "/tmp/fake.pdf"
        mock_save.return_value = None

        resp = client.post("/resume/generate", json=MINIMAL_PAYLOAD)
        assert resp.status_code == 200
        body = resp.json()
        assert body["status"] == "success"
        assert "resume_id" in body["data"]
        assert body["data"]["download_url"].startswith("/resume/")
        assert "markdown" in body["data"]

    @patch("src.services.resume_generator.convert_markdown_to_pdf")
    @patch("src.services.resume_generator.save_resume")
    @patch("src.services.llm_service.LLMService._call_gemini")
    def test_generate_full_payload(self, mock_gemini, mock_save, mock_pdf):
        mock_gemini.return_value = "# Test Resume\n\nThis is a mock resume."
        mock_pdf.return_value = "/tmp/fake.pdf"
        mock_save.return_value = None

        resp = client.post(
            "/resume/generate",
            json={
                **FULL_PAYLOAD,
                "experience": [
                    {
                        **FULL_PAYLOAD["experience"][0],
                        "start_date": "2021-01-01",
                        "end_date": "2023-06-30",
                    }
                ],
                "education": [
                    {
                        **FULL_PAYLOAD["education"][0],
                        "start_date": "2016-09-01",
                        "end_date": "2020-06-01",
                    }
                ],
                "certifications": [
                    {**FULL_PAYLOAD["certifications"][0], "issue_date": "2022-03-01"}
                ],
            },
        )
        assert resp.status_code == 200

    def test_generate_missing_required_field_returns_422(self):
        bad = {k: v for k, v in MINIMAL_PAYLOAD.items() if k != "email"}
        resp = client.post("/resume/generate", json=bad)
        assert resp.status_code == 422

    def test_generate_invalid_email_returns_422(self):
        bad = {**MINIMAL_PAYLOAD, "email": "not-an-email"}
        resp = client.post("/resume/generate", json=bad)
        assert resp.status_code == 422

    def test_download_unknown_id_returns_404(self):
        resp = client.get("/resume/00000000-0000-0000-0000-000000000000/download")
        assert resp.status_code == 404

    def test_download_missing_file_returns_410(self, tmp_path, monkeypatch):
        import src.models.mock_db as db

        fake_id = str(uuid.uuid4())
        fake_path = str(tmp_path / "gone.pdf")

        monkeypatch.setattr(
            db, "RESUMES", [{"id": fake_id, "full_name": "Test", "pdf_path": fake_path}]
        )

        resp = client.get(f"/resume/{fake_id}/download")
        assert resp.status_code == 410

    def test_download_happy_path(self, tmp_path, monkeypatch):
        import src.models.mock_db as db

        fake_id = str(uuid.uuid4())
        pdf_file = tmp_path / "resume.pdf"
        pdf_file.write_bytes(b"%PDF-1.4 fake content")

        monkeypatch.setattr(
            db,
            "RESUMES",
            [{"id": fake_id, "full_name": "Test User", "pdf_path": str(pdf_file)}],
        )

        resp = client.get(f"/resume/{fake_id}/download")
        assert resp.status_code == 200
        assert resp.headers["content-type"] == "application/pdf"
