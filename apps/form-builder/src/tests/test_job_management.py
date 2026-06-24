"""
Jobs CRUD Tests

Coverage:
  • POST /jobs/ — create a job
  • GET /jobs/ — list all jobs
  • GET /jobs/{job_id} — get job by ID
  • GET /jobs/{job_id} — job not found → 404

"""

from fastapi.testclient import TestClient

from src.main import app

client = TestClient(app)


def get_auth_token():
    response = client.post(
        "/auth/login",
        json={"username": "test", "password": "123456"},
    )
    return response.json()["access_token"]


class TestJobs:
    def test_create_job(self):
        token = get_auth_token()
        job_data = {
            "title": "Senior Backend Developer",
            "company": "Tech Innovations Inc",
            "raw_text": """
            Senior Backend Developer needed.
            Requirements:
            - Python
            - FastAPI
            - PostgreSQL
            - Docker
            - AWS
            """,
            "keywords": ["python", "fastapi", "postgresql", "docker", "aws"],
        }
        response = client.post(
            "/jobs/",
            json=job_data,
            headers={"Authorization": f"Bearer {token}"},
        )
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert data["title"] == job_data["title"]
        assert data["company"] == job_data["company"]
        assert data["keywords"] == job_data["keywords"]

    def test_create_job_unauthorized(self):
        job_data = {
            "title": "Test Job",
            "company": "Test Company",
            "raw_text": "Test description",
            "keywords": ["test"],
        }
        response = client.post("/jobs/", json=job_data)
        assert response.status_code == 401

    def test_create_job_missing_fields(self):
        token = get_auth_token()
        job_data = {
            "title": "Test Job",
        }
        response = client.post(
            "/jobs/",
            json=job_data,
            headers={"Authorization": f"Bearer {token}"},
        )
        assert response.status_code == 422

    def test_get_jobs(self):
        token = get_auth_token()
        response = client.get(
            "/jobs/",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    def test_get_jobs_unauthorized(self):
        response = client.get("/jobs/")
        assert response.status_code == 401

    def test_get_job_by_id(self):
        token = get_auth_token()
        job_data = {
            "title": "Test Job",
            "company": "Test Company",
            "raw_text": "Test description",
            "keywords": ["test"],
        }
        create_response = client.post(
            "/jobs/",
            json=job_data,
            headers={"Authorization": f"Bearer {token}"},
        )
        job_id = create_response.json()["id"]

        response = client.get(
            f"/jobs/{job_id}",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == job_id
        assert data["title"] == job_data["title"]

    def test_get_job_not_found(self):
        token = get_auth_token()
        response = client.get(
            "/jobs/non-existent-id",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert response.status_code == 404
        assert "Job not found" in response.json()["detail"]

    def test_get_job_unauthorized(self):
        response = client.get("/jobs/job-1")
        assert response.status_code == 401
