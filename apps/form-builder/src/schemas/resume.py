from datetime import date
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field


class Experience(BaseModel):
    company: str = Field(..., min_length=1)
    role: str = Field(..., min_length=1)
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_current: bool = False
    location: Optional[str] = None
    description: str
    technologies: List[str] = Field(default_factory=list)
    achievements: List[str] = Field(default_factory=list)


class Project(BaseModel):
    name: str
    description: str
    technologies: List[str] = Field(default_factory=list)
    link: Optional[str] = None


class Education(BaseModel):
    institution: str
    degree: str
    field_of_study: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    gpa: Optional[str] = None


class Certification(BaseModel):
    name: str
    issuer: Optional[str] = None
    issue_date: Optional[date] = None
    expiry_date: Optional[date] = None
    credential_id: Optional[str] = None


class ResumeRequest(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    location: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio: Optional[str] = None
    role_target: str
    seniority_level: Optional[str] = None
    industry_target: Optional[str] = None
    skills: List[str] = Field(default_factory=list)
    experience: List[Experience] = Field(default_factory=list)
    projects: List[Project] = Field(default_factory=list)
    education: List[Education] = Field(default_factory=list)
    certifications: List[Certification] = Field(default_factory=list)
    keywords: Optional[List[str]] = Field(default_factory=list)
    languages: Optional[List[str]] = Field(default_factory=list)
    tone: Optional[str] = "professional"
    ats_optimized: bool = True
