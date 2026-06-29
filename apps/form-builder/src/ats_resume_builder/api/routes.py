from uuid import uuid4

from fastapi import Depends, FastAPI, Response, status

from ats_resume_builder.api.dependencies import (
    get_resume_builder_service,
    require_internal_service_key,
)
from ats_resume_builder.schemas.resume import ResumeBuildRequest
from ats_resume_builder.services.resume_builder import ResumeBuilderService


def register_routes(app: FastAPI) -> None:
    @app.post(
        "/v1/resumes/pdf",
        tags=["resume-builder"],
        responses={
            status.HTTP_200_OK: {"content": {"application/pdf": {}}},
            status.HTTP_401_UNAUTHORIZED: {
                "description": "Invalid internal service key"
            },
            422: {"description": "Invalid resume"},
            status.HTTP_502_BAD_GATEWAY: {"description": "AI provider failure"},
            status.HTTP_503_SERVICE_UNAVAILABLE: {"description": "Compilation failure"},
            status.HTTP_504_GATEWAY_TIMEOUT: {"description": "Compilation timeout"},
        },
    )
    async def build_resume_pdf(
        payload: ResumeBuildRequest,
        _: None = Depends(require_internal_service_key),
        service: ResumeBuilderService = Depends(get_resume_builder_service),
    ) -> Response:
        request_id = str(uuid4())
        pdf = await service.build_pdf(payload, request_id=request_id)
        headers = {
            "Content-Disposition": 'attachment; filename="resume.pdf"',
            "X-Resume-Id": payload.resume_id,
            "X-AI-Optimized": "true",
            "X-Request-Id": request_id,
        }
        return Response(content=pdf, media_type="application/pdf", headers=headers)
