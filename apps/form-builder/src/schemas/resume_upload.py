"""
Schemas for resume upload (Flow B).

Defines request/response models for uploading and retrieving resumes.
"""

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field, field_validator


class FileInfo(BaseModel):
    id: str = Field(..., description="Unique file identifier")
    filename: str = Field(..., description="Original filename")


class ParsedResume(BaseModel):
    full_name: Optional[str] = Field(None, description="Candidate's full name")
    email: Optional[str] = Field(None, description="Candidate's email")
    skills: List[str] = Field(default_factory=list, description="Extracted skills")
    experience: List[Dict[str, Any]] = Field(
        default_factory=list, description="Work experience entries"
    )
    education: List[str] = Field(default_factory=list, description="Education entries")
    projects: List[Dict[str, Any]] = Field(default_factory=list, description="Project entries")

    @field_validator("skills", "experience", "education", "projects", mode="before")
    @classmethod
    def validate_list_fields(cls, v):
        if v is None:
            return []
        return v


class ResumeUploadRecord(BaseModel):
    resume_id: str = Field(..., description="Resume identifier")
    file: FileInfo = Field(..., description="File information")
    parsed: ParsedResume = Field(..., description="Parsed resume data")

    @field_validator("parsed", mode="before")
    @classmethod
    def validate_parsed(cls, v):
        if isinstance(v, dict):
            return {
                "full_name": v.get("full_name"),
                "email": v.get("email"),
                "skills": v.get("skills", []),
                "experience": v.get("experience", []),
                "education": v.get("education", []),
                "projects": v.get("projects", []),
            }
        return v


class ResumeUploadResponse(BaseModel):
    status: str = Field(..., description="Response status")
    data: ResumeUploadRecord = Field(..., description="Resume data")


class ResumeUploadListResponse(BaseModel):
    status: str = Field(..., description="Response status")
    data: List[ResumeUploadRecord] = Field(
        default_factory=list, description="List of resume records"
    )
