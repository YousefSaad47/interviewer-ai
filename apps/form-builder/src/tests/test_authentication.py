"""
Authentication Tests

Coverage:
  • POST /auth/login — successful login
  • POST /auth/login — invalid credentials
  • POST /auth/login — missing fields
  • GET /jobs/ — unauthorized (no token)
  • GET /jobs/ — authorized (valid token)

"""

from fastapi.testclient import TestClient

from src.main import app

client = TestClient(app)


class TestAuth:
    def test_login_successful(self):
        response = client.post(
            "/auth/login",
            json={"username": "test", "password": "123456"},
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert len(data["access_token"]) > 10
        assert data["user"]["username"] == "test"

    def test_login_invalid_credentials(self):
        response = client.post(
            "/auth/login",
            json={"username": "test", "password": "wrong"},
        )
        assert response.status_code == 422

    def test_login_missing_username(self):
        response = client.post(
            "/auth/login",
            json={"password": "123456"},
        )
        assert response.status_code == 422

    def test_login_missing_password(self):
        response = client.post(
            "/auth/login",
            json={"username": "test"},
        )
        assert response.status_code == 422

    def test_protected_endpoint_unauthorized(self):
        response = client.get("/jobs/")
        assert response.status_code == 401
        assert "Not authenticated" in response.json()["detail"]

    def test_protected_endpoint_authorized(self):
        login_response = client.post(
            "/auth/login",
            json={"username": "test", "password": "123456"},
        )
        token = login_response.json()["access_token"]

        response = client.get(
            "/jobs/",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_protected_endpoint_invalid_token(self):
        response = client.get(
            "/jobs/",
            headers={"Authorization": "Bearer invalid-token"},
        )
        assert response.status_code == 401
        assert "Invalid or expired token" in response.json()["detail"]

    def test_protected_endpoint_malformed_header(self):
        response = client.get(
            "/jobs/",
            headers={"Authorization": "InvalidFormat"},
        )
        assert response.status_code == 401
        assert "Not authenticated" in response.json()["detail"]
