"""
ATS Match Routes.

Flow C: Job Description Matching
- Match uploaded resume against job descriptions
- Calculate match scores
- Generate tailored resume variations
"""

from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query, status

from src.api.dependencies import ATSDependencies
from src.core.logging import get_logger
from src.models.mock_db import (
    RESUME_MATCHES,
    delete_resume_match,
    find_job_description,
    find_matches_by_resume,
    find_resume_match,
    find_uploaded_resume,
    save_resume_match,
    update_job_description,
)
from src.schemas.ats import (
    ATSResponse,
    MatchResult,
    MatchStatus,
    TailoredResumeResponse,
)

logger = get_logger(__name__)

router = APIRouter()


@router.post("/match", response_model=ATSResponse)
def match_resume(
    resume_id: str = Query(..., description="ID of the uploaded resume"),
    job_id: str = Query(..., description="ID of the job description"),
    deps: ATSDependencies = Depends(),
):
    logger.info(
        "Processing match request: resume_id=%s, job_id=%s",
        resume_id,
        job_id,
    )

    resume = find_uploaded_resume(resume_id)
    if resume is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Resume with ID '{resume_id}' not found",
        )

    job = find_job_description(job_id)
    if job is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job with ID '{job_id}' not found",
        )

    job_keywords = job.get("keywords")

    if not isinstance(job_keywords, list) or not job_keywords:
        raw_text = job.get("raw_text", "")

        if not isinstance(raw_text, str) or not raw_text.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Job description is empty or invalid",
            )

        job_keywords = deps.keyword_extractor.extract(raw_text)

        update_job_description(
            job_id,
            {"keywords": job_keywords},
        )

        logger.debug(
            "Extracted %d keywords from job %s",
            len(job_keywords),
            job_id,
        )

    match_result = deps.ats_engine.calculate(
        resume=resume,
        job_keywords=job_keywords,
    )

    logger.info(
        "Match result for resume %s: %d%% match",
        resume_id,
        match_result["match_pct"],
    )

    tailored_resume = deps.tailor_service.generate(
        resume=resume,
        missing_keywords=match_result["missing_keywords"],
    )

    match_id = f"match-{len(RESUME_MATCHES) + 1}"
    current_time = datetime.now(timezone.utc).isoformat()

    match_record = {
        "id": match_id,
        "resume_id": resume_id,
        "job_id": job_id,
        "job_title": job.get("title"),
        "company": job.get("company"),
        "match_pct": match_result["match_pct"],
        "matched_keywords": match_result["matched_keywords"],
        "missing_keywords": match_result["missing_keywords"],
        "tailored_resume": tailored_resume,
        "status": MatchStatus.COMPLETED.value,
        "created_at": current_time,
        "updated_at": current_time,
    }

    save_resume_match(match_record)

    response = ATSResponse(
        success=True,
        data=MatchResult(
            id=match_id,
            resume_id=resume_id,
            job_id=job_id,
            match_pct=match_result["match_pct"],
            matched_keywords=match_result["matched_keywords"],
            missing_keywords=match_result["missing_keywords"],
            tailored_resume=TailoredResumeResponse(
                summary=tailored_resume.get("summary", ""),
                suggestions=tailored_resume.get("suggestions", []),
                optimized_skills=tailored_resume.get("optimized_skills", []),
                tailored_content=tailored_resume.get("tailored_content", ""),
            ),
            status=MatchStatus.COMPLETED,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        ),
        message="Resume matched successfully",
    )

    return response


@router.get("/matches/{resume_id}", response_model=ATSResponse)
def get_resume_matches(resume_id: str):
    logger.info("Fetching all matches for resume: %s", resume_id)

    matches = find_matches_by_resume(resume_id)

    if not matches:
        return ATSResponse(
            success=True,
            data=[],
            message=f"No matches found for resume '{resume_id}'",
        )

    return ATSResponse(
        success=True,
        data=matches,
        message=f"Found {len(matches)} matches for resume",
    )


@router.get("/match/{match_id}", response_model=ATSResponse)
def get_match_details(match_id: str):
    logger.info("Fetching match details: %s", match_id)

    match = find_resume_match(match_id)

    if not match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Match with ID '{match_id}' not found",
        )

    return ATSResponse(
        success=True,
        data=match,
        message="Match details retrieved successfully",
    )


@router.post("/batch-match", response_model=ATSResponse)
def batch_match_resumes(
    resume_ids: List[str] = Query(..., description="List of resume IDs"),
    job_id: str = Query(..., description="ID of the job description"),
    deps: ATSDependencies = Depends(),
):
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Batch matching not yet implemented",
    )


@router.post("/re-match/{match_id}")
def re_match_resume(
    match_id: str,
    deps: ATSDependencies = Depends(),
):
    existing_match = find_resume_match(match_id)

    if not existing_match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Match with ID '{match_id}' not found",
        )

    delete_resume_match(match_id)

    return match_resume(
        resume_id=existing_match["resume_id"],
        job_id=existing_match["job_id"],
        deps=deps,
    )
