"""
Resume Builder routes.

GET  /resume/              — welcome / health-check for this router
POST /resume/generate      — runs the full Flow-A pipeline, returns JSON metadata
GET  /resume/{id}/download — streams the generated PDF back to the client
"""

import os

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from src.core.logging import get_logger
from src.models.mock_db import find_resume
from src.schemas.resume import ResumeRequest
from src.services.resume_generator import ResumeGeneratorService

router = APIRouter()
service = ResumeGeneratorService()
logger = get_logger(__name__)


@router.get("/", summary="Resume module — welcome")
def resume_welcome():
    return {
        "module": "Resume Builder",
        "status": "online",
        "endpoints": {
            "generate": "POST /resume/generate",
            "download": "GET  /resume/{resume_id}/download",
        },
    }


@router.post("/generate", summary="Generate an ATS-optimised resume")
def generate_resume(payload: ResumeRequest):
    try:
        result = service.generate(payload.model_dump())
        return {
            "status": "success",
            "data": {
                "resume_id": result["resume_id"],
                "download_url": f"/resume/{result['resume_id']}/download",
                "markdown": result["markdown"],
            },
        }
    except RuntimeError as exc:
        logger.error("Resume generation failed: %s", exc)
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("Unexpected error during resume generation")
        raise HTTPException(status_code=500, detail="Internal server error") from exc


@router.get("/{resume_id}/download", summary="Download a generated resume PDF")
def download_resume(resume_id: str):
    record = find_resume(resume_id)

    if record is None:
        raise HTTPException(status_code=404, detail="Resume not found")

    pdf_path = record["pdf_path"]

    if not os.path.exists(pdf_path):
        logger.error("PDF file missing on disk for resume_id=%s path=%s", resume_id, pdf_path)
        raise HTTPException(status_code=410, detail="Resume file no longer available")

    full_name = record.get("full_name", "resume")
    filename = f"resume_{full_name.replace(' ', '_')}.pdf"
    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename=filename,
    )
