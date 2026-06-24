"""
Resume Upload + ATS Analysis routes (Flow B).

POST /resume/upload             — accepts a PDF, extracts text, runs the
                                   lightweight analyzer, encrypts + stores
                                   the file, persists the analysis record.
GET  /resume/upload             — lists all previously uploaded + analyzed resumes.
GET  /resume/upload/{resume_id} — retrieves a previously analyzed record.

CHANGES vs. original:
  • upload_resume is now `async def` + `await file.read()` so the request
    body is read on the async event loop instead of blocking a threadpool thread.
  • The stored file `path` is never sent to the client (security fix) — only
    `id` and `filename` are exposed via the response schema.
  • Added GET /resume/upload list endpoint that uses `list_uploaded_resumes`.
"""

from fastapi import APIRouter, File, HTTPException, UploadFile

from src.core.logging import get_logger
from src.models.mock_db import (
    find_uploaded_resume,
    list_uploaded_resumes,
    save_uploaded_resume,
)
from src.schemas.resume_upload import (
    FileInfo,
    ParsedResume,
    ResumeUploadListResponse,
    ResumeUploadRecord,
    ResumeUploadResponse,
)
from src.services.file_storage import FileStorageService
from src.services.resume_analysis import ResumeAnalysisService
from src.services.resume_parser import ResumeParserService
from src.utils.file_validator import validate_file, validate_file_size

router = APIRouter()
logger = get_logger(__name__)
storage = FileStorageService()
parser = ResumeParserService()
analysis = ResumeAnalysisService()


@router.post(
    "/upload",
    response_model=ResumeUploadResponse,
    summary="Upload a resume PDF for ATS analysis",
)
async def upload_resume(file: UploadFile = File(...)):
    content = await file.read()

    validate_file_size(content)

    validate_file(file)

    text = parser.extract_text(content)
    if not text.strip():
        logger.warning("No text extracted from '%s' — likely a scanned PDF", file.filename)

    parsed_resume = analysis.analyze(text)

    if "projects" not in parsed_resume:
        parsed_resume["projects"] = []
    if "experience" not in parsed_resume:
        parsed_resume["experience"] = []
    if "education" not in parsed_resume:
        parsed_resume["education"] = []
    if "skills" not in parsed_resume:
        parsed_resume["skills"] = []
    if "full_name" not in parsed_resume:
        parsed_resume["full_name"] = None
    if "email" not in parsed_resume:
        parsed_resume["email"] = None

    filename = file.filename or "upload.pdf"
    try:
        saved_file = storage.save_file(filename, content)
    except OSError as exc:
        logger.exception("Failed to save uploaded file '%s'", filename)
        raise HTTPException(status_code=500, detail="Could not store uploaded file") from exc

    logger.info(
        "Stored uploaded resume id=%s filename=%s",
        saved_file["id"],
        saved_file["filename"],
    )

    record = {
        "resume_id": saved_file["id"],
        "file": saved_file,
        "parsed": parsed_resume,
    }
    save_uploaded_resume(record)
    logger.info("Saved ATS analysis record for resume_id=%s", saved_file["id"])

    response_data = ResumeUploadRecord(
        resume_id=record["resume_id"],
        file=FileInfo(
            id=record["file"]["id"],
            filename=record["file"]["filename"],
        ),
        parsed=ParsedResume(**record["parsed"]),
    )

    return {"status": "success", "data": response_data}


@router.get(
    "/upload",
    response_model=ResumeUploadListResponse,
    summary="List all previously uploaded + analyzed resumes",
)
def get_uploaded_resumes():
    records = list_uploaded_resumes()

    response_data = []
    for record in records:
        parsed_data = record.get("parsed", {})
        parsed_data = {
            "full_name": parsed_data.get("full_name"),
            "email": parsed_data.get("email"),
            "skills": parsed_data.get("skills", []),
            "experience": parsed_data.get("experience", []),
            "education": parsed_data.get("education", []),
            "projects": parsed_data.get("projects", []),
        }

        response_data.append(
            ResumeUploadRecord(
                resume_id=record["resume_id"],
                file=FileInfo(
                    id=record["file"]["id"],
                    filename=record["file"]["filename"],
                ),
                parsed=ParsedResume(**parsed_data),
            )
        )

    return {"status": "success", "data": response_data}


@router.get(
    "/upload/{resume_id}",
    response_model=ResumeUploadResponse,
    summary="Retrieve a previously analyzed resume by ID",
)
def get_uploaded_resume(resume_id: str):
    record = find_uploaded_resume(resume_id)

    if record is None:
        raise HTTPException(status_code=404, detail="Uploaded resume not found")

    parsed_data = record.get("parsed", {})
    parsed_data = {
        "full_name": parsed_data.get("full_name"),
        "email": parsed_data.get("email"),
        "skills": parsed_data.get("skills", []),
        "experience": parsed_data.get("experience", []),
        "education": parsed_data.get("education", []),
        "projects": parsed_data.get("projects", []),
    }

    response_data = ResumeUploadRecord(
        resume_id=record["resume_id"],
        file=FileInfo(
            id=record["file"]["id"],
            filename=record["file"]["filename"],
        ),
        parsed=ParsedResume(**parsed_data),
    )

    return {"status": "success", "data": response_data}
