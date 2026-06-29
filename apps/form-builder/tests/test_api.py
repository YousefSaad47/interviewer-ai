from fastapi.testclient import TestClient

from ats_resume_builder.api.app import create_app
from ats_resume_builder.api.dependencies import get_resume_builder_service
from ats_resume_builder.schemas.resume import ResumeBuildRequest


class FakeResumeBuilderService:
    async def build_pdf(self, request: ResumeBuildRequest, *, request_id: str) -> bytes:
        assert request.resume_id == "resume-123"
        assert request_id
        return b"%PDF-1.7 fake"


def test_build_resume_pdf_returns_binary_response() -> None:
    app = create_app()
    app.dependency_overrides[get_resume_builder_service] = lambda: (
        FakeResumeBuilderService()
    )
    client = TestClient(app)

    response = client.post(
        "/v1/resumes/pdf",
        json={
            "resumeId": "resume-123",
            "resume": {
                "personal_information": {
                    "full_name": "Ada Lovelace",
                    "email": "ada@example.com",
                },
                "skills": [{"name": "Python"}],
            },
        },
    )

    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    assert response.headers["x-resume-id"] == "resume-123"
    assert response.headers["x-ai-optimized"] == "true"
    assert response.content == b"%PDF-1.7 fake"
