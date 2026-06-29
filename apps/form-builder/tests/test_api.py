from fastapi.testclient import TestClient

from ats_resume_builder.api.app import create_app
from ats_resume_builder.api.dependencies import get_resume_builder_service
from ats_resume_builder.schemas.resume import ResumeBuildRequest


class FakeResumeBuilderService:
    async def build_pdf(self, request: ResumeBuildRequest, *, request_id: str) -> bytes:
        assert request.resume_id == "resume-123"
        assert request_id
        return b"%PDF-1.7 fake"


def valid_payload() -> dict[str, object]:
    return {
        "resumeId": "resume-123",
        "resume": {
            "personalInformation": {
                "fullName": "Ada Lovelace",
                "email": "ada@example.com",
            },
            "skills": [{"name": "Python"}],
        },
    }


def test_health_endpoint_does_not_require_service_key() -> None:
    client = TestClient(create_app())

    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_build_resume_pdf_returns_binary_response() -> None:
    app = create_app()
    app.dependency_overrides[get_resume_builder_service] = lambda: (
        FakeResumeBuilderService()
    )
    client = TestClient(app)

    response = client.post(
        "/v1/resumes/pdf",
        json=valid_payload(),
        headers={"X-Internal-Service-Key": "development-secret"},
    )

    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    assert (
        response.headers["content-disposition"] == 'attachment; filename="resume.pdf"'
    )
    assert response.headers["x-resume-id"] == "resume-123"
    assert response.headers["x-ai-optimized"] == "true"
    assert response.content == b"%PDF-1.7 fake"


def test_build_resume_pdf_rejects_invalid_internal_service_key() -> None:
    app = create_app()
    app.dependency_overrides[get_resume_builder_service] = lambda: (
        FakeResumeBuilderService()
    )
    client = TestClient(app)

    response = client.post(
        "/v1/resumes/pdf",
        json=valid_payload(),
        headers={"X-Internal-Service-Key": "wrong"},
    )

    assert response.status_code == 401
    assert response.json()["error"]["code"] == "invalid_internal_service_key"


def test_build_resume_pdf_invalid_request_returns_validation_error() -> None:
    client = TestClient(create_app())

    response = client.post(
        "/v1/resumes/pdf",
        json={"resumeId": "resume-123", "resume": {"unknown": True}},
        headers={"X-Internal-Service-Key": "development-secret"},
    )

    assert response.status_code == 422
    assert response.json()["error"]["code"] == "invalid_resume"


def test_main_app_import_registers_routes() -> None:
    from main import app

    paths = {route.path for route in app.routes if hasattr(route, "path")}
    assert "/health" in paths
    assert "/v1/resumes/pdf" in paths
