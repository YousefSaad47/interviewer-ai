"""
Job Schemas.

Defines request/response models for job management.
"""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class JobCreate(BaseModel):
    title: str = Field(..., description="Job title", min_length=1)
    company: str = Field(..., description="Company name", min_length=1)
    raw_text: str = Field(..., description="Raw job description", min_length=1)
    keywords: List[str] = Field(default_factory=list, description="Extracted keywords")


class JobUpdate(BaseModel):
    title: Optional[str] = Field(None, description="Job title")
    company: Optional[str] = Field(None, description="Company name")
    raw_text: Optional[str] = Field(None, description="Raw job description")
    keywords: Optional[List[str]] = Field(None, description="Extracted keywords")


class JobResponse(BaseModel):
    id: str = Field(..., description="Job ID")
    title: str = Field(..., description="Job title")
    company: str = Field(..., description="Company name")
    raw_text: str = Field(..., description="Raw job description")
    keywords: List[str] = Field(default_factory=list, description="Extracted keywords")
    created_at: Optional[datetime] = Field(None, description="Creation timestamp")
    updated_at: Optional[datetime] = Field(None, description="Last update timestamp")
