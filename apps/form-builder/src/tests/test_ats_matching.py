"""
Integration Tests (ATS Matching)

Coverage:
  • POST /ats/match — successful match
  • POST /ats/match — resume not found → 404
  • POST /ats/match — job not found → 404
  • POST /ats/match — empty job description → 400
  • GET /ats/matches/{resume_id} — get all matches
  • GET /ats/matches/{resume_id} — no matches → empty list
  • GET /ats/match/{match_id} — get specific match
  • GET /ats/match/{match_id} — match not found → 404
  • POST /ats/re-match/{match_id} — re-run matching
  • POST /ats/re-match/{match_id} — match not found → 404

"""

from typing import Optional
from unittest.mock import patch

from fastapi.testclient import TestClient

from src.main import app
from src.models.mock_db import (
    RESUME_MATCHES,
    find_job_description,
    find_resume_match,
    save_job_description,
    save_resume_match,
    save_uploaded_resume,
)
from tests.conftest import (
    SAMPLE_JOB_DESCRIPTION,
    SAMPLE_RESUME_FOR_ATS,
)

client = TestClient(app)


def _post_with_auth(url: str, params: Optional[dict] = None, **kwargs):
    headers = kwargs.pop("headers", {})
    headers["X-API-Key"] = "test-api-key"
    return client.post(url, params=params, headers=headers, **kwargs)


def _get_with_auth(url: str, **kwargs):
    headers = kwargs.pop("headers", {})
    headers["X-API-Key"] = "test-api-key"
    return client.get(url, headers=headers, **kwargs)


MOCK_MATCH_RESULT = {
    "match_pct": 71.43,
    "matched_keywords": ["python", "fastapi", "postgresql", "docker", "aws"],
    "missing_keywords": ["ci/cd", "microservices"],
}

MOCK_TAILORED_RESUME = {
    "summary": "Resume optimized for target job",
    "suggestions": [
        "Add experience with ci/cd",
        "Add experience with microservices",
    ],
    "optimized_skills": [
        "Python",
        "FastAPI",
        "Docker",
        "PostgreSQL",
        "REST API",
        "ci/cd",
        "microservices",
    ],
    "tailored_content": "Tailored resume content here...",
}


class TestATSMatch:
    @patch("src.models.mock_db.find_uploaded_resume")
    @patch("src.models.mock_db.find_job_description")
    @patch("src.models.mock_db.update_job_description")
    @patch("src.services.ats_engine.ATSEngine.calculate")
    @patch("src.services.tailored_resume.TailoredResumeService.generate")
    @patch("src.models.mock_db.save_resume_match")
    def test_match_successful(
        self,
        mock_save_match,
        mock_tailor,
        mock_ats_engine,
        mock_update_job,
        mock_find_job,
        mock_find_resume,
    ):
        save_uploaded_resume(SAMPLE_RESUME_FOR_ATS)
        save_job_description(SAMPLE_JOB_DESCRIPTION)

        mock_find_resume.return_value = SAMPLE_RESUME_FOR_ATS
        mock_find_job.return_value = SAMPLE_JOB_DESCRIPTION
        mock_ats_engine.return_value = MOCK_MATCH_RESULT
        mock_tailor.return_value = MOCK_TAILORED_RESUME
        mock_save_match.return_value = None

        response = _post_with_auth(
            "/ats/match",
            params={"resume_id": "ats-resume-001", "job_id": "job-test-001"},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["match_pct"] == 71.43
        assert "matched_keywords" in data["data"]
        assert "missing_keywords" in data["data"]
        assert "tailored_resume" in data["data"]

    def test_match_resume_not_found(self):
        response = _post_with_auth(
            "/ats/match",
            params={"resume_id": "non-existent", "job_id": "job-test-001"},
        )

        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()

    def test_match_job_not_found(self):
        save_uploaded_resume(SAMPLE_RESUME_FOR_ATS)

        response = _post_with_auth(
            "/ats/match",
            params={"resume_id": "ats-resume-001", "job_id": "non-existent-job"},
        )

        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()

    def test_match_empty_job_description(self):
        save_uploaded_resume(SAMPLE_RESUME_FOR_ATS)

        empty_job = {
            "id": "job-empty",
            "title": "Empty Job",
            "company": "Test",
            "raw_text": "",
            "keywords": [],
        }
        save_job_description(empty_job)

        response = _post_with_auth(
            "/ats/match",
            params={"resume_id": "ats-resume-001", "job_id": "job-empty"},
        )

        assert response.status_code == 400
        assert "empty" in response.json()["detail"].lower()

    def test_match_extracts_keywords_automatically(self):
        save_uploaded_resume(SAMPLE_RESUME_FOR_ATS)

        job_no_keywords = {**SAMPLE_JOB_DESCRIPTION, "keywords": []}
        save_job_description(job_no_keywords)

        response = _post_with_auth(
            "/ats/match",
            params={"resume_id": "ats-resume-001", "job_id": "job-test-001"},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True

        updated_job = find_job_description("job-test-001")
        assert updated_job is not None
        assert len(updated_job.get("keywords", [])) > 0


class TestGetResumeMatches:
    @patch("src.api.routes.ats_match.find_matches_by_resume")
    def test_get_matches_success(self, mock_find_matches):
        mock_find_matches.return_value = [
            {
                "id": "match-1",
                "resume_id": "resume-001",
                "job_id": "job-001",
                "match_pct": 85.0,
                "matched_keywords": ["python", "fastapi"],
                "missing_keywords": ["aws"],
            }
        ]

        response = _get_with_auth("/ats/matches/resume-001")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert len(data["data"]) == 1
        assert data["data"][0]["resume_id"] == "resume-001"

    @patch("src.api.routes.ats_match.find_matches_by_resume")
    def test_get_matches_empty(self, mock_find_matches):
        mock_find_matches.return_value = []

        response = _get_with_auth("/ats/matches/resume-no-matches")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"] == []
        assert "no matches found" in data["message"].lower()


class TestGetMatchDetails:
    def test_get_match_details_success(self):
        import uuid

        match_id = f"match-{uuid.uuid4().hex[:8]}"

        match_data = {
            "id": match_id,
            "resume_id": "resume-001",
            "job_id": "job-001",
            "match_pct": 90.0,
            "matched_keywords": ["python", "fastapi", "docker"],
            "missing_keywords": ["aws"],
            "tailored_resume": MOCK_TAILORED_RESUME,
        }
        save_resume_match(match_data)

        response = _get_with_auth(f"/ats/match/{match_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["id"] == match_id
        assert data["data"]["match_pct"] == 90.0
        assert data["data"]["matched_keywords"] == ["python", "fastapi", "docker"]
        assert data["data"]["missing_keywords"] == ["aws"]

    def test_get_match_details_not_found(self):
        response = _get_with_auth("/ats/match/non-existent")
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()


class TestReMatchResume:
    def test_re_match_successful(self):
        save_uploaded_resume(SAMPLE_RESUME_FOR_ATS)
        save_job_description(SAMPLE_JOB_DESCRIPTION)

        import uuid

        match_id = f"match-{uuid.uuid4().hex[:8]}"

        match_data = {
            "id": match_id,
            "resume_id": "ats-resume-001",
            "job_id": "job-test-001",
        }
        save_resume_match(match_data)

        old_match = find_resume_match(match_id)
        assert old_match is not None
        assert old_match["resume_id"] == "ats-resume-001"

        response = _post_with_auth(f"/ats/re-match/{match_id}")
        assert response.status_code == 200

        old_match = find_resume_match(match_id)
        assert old_match is None

        if RESUME_MATCHES:
            new_match = RESUME_MATCHES[-1]
            assert new_match["id"] != match_id
            assert new_match["resume_id"] == "ats-resume-001"
            assert new_match["job_id"] == "job-test-001"

    def test_re_match_not_found(self):
        response = _post_with_auth("/ats/re-match/non-existent")
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()


class TestBatchMatch:
    def test_batch_match_not_implemented(self):
        response = _post_with_auth(
            "/ats/batch-match",
            params={"resume_ids": ["resume-001"], "job_id": "job-001"},
        )
        assert response.status_code == 501
