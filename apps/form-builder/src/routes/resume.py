import logging
from pathlib import Path

from fastapi import APIRouter, HTTPException, status
from fastapi.responses import FileResponse
from starlette.background import BackgroundTask

from src.schemas.resume_schema import ResumeCreate
from src.services.pdf_service import PDFGenerationError, generate_pdf_to_file
from src.services.resume_service import ResumeServiceError, generate_resume

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/resume", tags=["resume"])


def _cleanup_file(path: Path) -> None:
    try:
        path.unlink(missing_ok=True)
    except OSError:
        logger.warning("Failed to remove generated PDF: %s", path)


@router.post("/generate", status_code=status.HTTP_200_OK)
def create_resume(payload: ResumeCreate) -> dict[str, str]:
    try:
        return generate_resume(payload)
    except ResumeServiceError as exc:
        logger.warning("Resume generation request failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Resume generation failed. Please try again later.",
        ) from exc


@router.post("/generate-pdf", status_code=status.HTTP_201_CREATED)
def create_resume_pdf(payload: ResumeCreate) -> FileResponse:
    try:
        resume = generate_resume(payload)
        file_path = generate_pdf_to_file(resume["resume"])
    except ResumeServiceError as exc:
        logger.warning("Resume PDF generation request failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Resume generation failed. Please try again later.",
        ) from exc
    except PDFGenerationError as exc:
        logger.warning("PDF rendering failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="PDF generation failed. Please try again later.",
        ) from exc

    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        filename="resume.pdf",
        background=BackgroundTask(_cleanup_file, file_path),
    )
