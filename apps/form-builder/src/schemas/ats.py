"""
ATS Matching Schemas.

Job Description Matching
"""

from datetime import datetime
from enum import Enum
from typing import Any, List, Optional

from pydantic import BaseModel, Field


class MatchStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class ATSRequest(BaseModel):
    resume_id: str = Field(..., description="ID of the uploaded resume")
    job_id: str = Field(..., description="ID of the job description")


class ATSBatchRequest(BaseModel):
    resume_ids: List[str] = Field(..., description="List of resume IDs")
    job_id: str = Field(..., description="ID of the job description")


class TailoredResumeResponse(BaseModel):
    summary: str = Field(..., description="Summary of the tailored resume")
    suggestions: List[str] = Field(default_factory=list, description="Suggestions for improvement")
    optimized_skills: List[str] = Field(default_factory=list, description="Optimized skill list")
    tailored_content: Optional[str] = Field(None, description="Full tailored resume content")


class MatchResult(BaseModel):
    id: str = Field(..., description="Match ID")
    resume_id: str = Field(..., description="Resume ID")
    job_id: str = Field(..., description="Job ID")
    match_pct: float = Field(..., description="Match percentage (0-100)")
    matched_keywords: List[str] = Field(default_factory=list, description="Keywords that matched")
    missing_keywords: List[str] = Field(
        default_factory=list, description="Keywords that are missing"
    )
    tailored_resume: Optional[TailoredResumeResponse] = Field(
        None, description="Tailored resume suggestions"
    )
    status: MatchStatus = Field(default=MatchStatus.COMPLETED, description="Match status")
    created_at: Optional[datetime] = Field(None, description="Creation timestamp")
    updated_at: Optional[datetime] = Field(None, description="Last update timestamp")


class ATSResponse(BaseModel):
    success: bool = Field(..., description="Whether the operation succeeded")
    data: Any = Field(..., description="Response data")
    message: Optional[str] = Field(None, description="Response message")
    errors: Optional[List[str]] = Field(default_factory=list, description="Error messages if any")


class KeywordExtractionRequest(BaseModel):
    text: str = Field(..., description="Text to extract keywords from")


class KeywordExtractionResponse(BaseModel):
    keywords: List[str] = Field(..., description="Extracted keywords")
    count: int = Field(..., description="Number of keywords extracted")


class JobDescriptionCreate(BaseModel):
    title: str = Field(..., description="Job title")
    company: str = Field(..., description="Company name")
    raw_text: str = Field(..., description="Raw job description text")
    keywords: Optional[List[str]] = Field(
        default_factory=list, description="Pre-extracted keywords (optional)"
    )
