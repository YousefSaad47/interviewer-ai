"""
Shared fixtures and helpers tests.

Imported automatically by pytest for all files in this folder.
"""

from datetime import date
from typing import List, Optional

import pytest
from fastapi.testclient import TestClient

from src.main import app


@pytest.fixture(scope="session")
def client() -> TestClient:
    return TestClient(app)


MINIMAL_PAYLOAD: dict = {
    "full_name": "Jane Doe",
    "email": "jane@example.com",
    "role_target": "Backend Engineer",
    "skills": ["Python", "FastAPI", "Docker"],
    "experience": [],
    "projects": [],
    "education": [],
    "certifications": [],
}

FULL_PAYLOAD: dict = {
    "full_name": "Ahmed Hassan",
    "email": "ahmed@example.com",
    "phone": "+20 100 123 4567",
    "location": "Cairo, Egypt",
    "linkedin": "https://linkedin.com/in/ahmed",
    "github": "https://github.com/ahmed",
    "portfolio": "https://ahmed.dev",
    "role_target": "Senior Software Engineer",
    "seniority_level": "senior",
    "industry_target": "FinTech",
    "skills": ["Python", "FastAPI", "PostgreSQL", "Docker", "  Python  "],
    "experience": [
        {
            "company": "Acme Corp",
            "role": "Backend Developer",
            "start_date": date(2021, 1, 1),
            "end_date": date(2023, 6, 30),
            "is_current": False,
            "location": "Remote",
            "description": "Built REST APIs",
            "technologies": ["Python", "Django"],
            "achievements": ["Reduced latency by 40%"],
        }
    ],
    "projects": [
        {
            "name": "ResumeBot",
            "description": "AI resume generator",
            "technologies": ["FastAPI", "LangGraph"],
            "link": "https://github.com/ahmed/resumebot",
        }
    ],
    "education": [
        {
            "institution": "Cairo University",
            "degree": "BSc",
            "field_of_study": "Computer Science",
            "start_date": date(2016, 9, 1),
            "end_date": date(2020, 6, 1),
            "gpa": "3.8",
        }
    ],
    "certifications": [
        {
            "name": "AWS Solutions Architect",
            "issuer": "Amazon",
            "issue_date": date(2022, 3, 1),
        }
    ],
    "keywords": ["microservices", "CI/CD"],
    "languages": ["Arabic", "English"],
    "tone": "professional",
    "ats_optimized": True,
}

SAMPLE_RESUME_FOR_ATS: dict = {
    "resume_id": "ats-resume-001",
    "file": {
        "id": "ats-resume-001",
        "filename": "ats_cv.pdf",
        "path": "/uploads/ats_cv.pdf.enc",
    },
    "parsed": {
        "full_name": "John Developer",
        "email": "john@dev.com",
        "skills": ["Python", "FastAPI", "Docker", "PostgreSQL", "REST API"],
        "experience": [{"company": "Tech Corp", "role": "Backend Developer", "years": 3}],
        "education": [{"degree": "BSc Computer Science", "institution": "MIT"}],
        "projects": [],
    },
}

SAMPLE_JOB_DESCRIPTION: dict = {
    "id": "job-test-001",
    "title": "Senior Backend Developer",
    "company": "Tech Innovations Inc",
    "raw_text": """
    Senior Backend Developer needed.
    
    Requirements:
    - Python
    - FastAPI
    - PostgreSQL
    - Docker
    - AWS
    - CI/CD
    - Microservices
    
    Experience:
    5+ years backend development
    """,
    "keywords": [
        "python",
        "fastapi",
        "postgresql",
        "docker",
        "aws",
        "ci/cd",
        "microservices",
    ],
}


def make_fake_pdf(
    text: str = "Jane Doe\njane@example.com\nPython FastAPI Docker",
) -> bytes:
    return b"%PDF-1.4\n%Fake PDF content for testing\n" + text.encode()


def create_mock_resume_record(
    resume_id: Optional[str] = None, skills: Optional[List[str]] = None
) -> dict:
    resume_id = resume_id or "test-resume-001"
    skills = skills or ["Python", "FastAPI", "Docker"]

    return {
        "resume_id": resume_id,
        "file": {
            "id": resume_id,
            "filename": "test.pdf",
            "path": f"/uploads/{resume_id}.pdf.enc",
        },
        "parsed": {
            "full_name": "Test Candidate",
            "email": "test@example.com",
            "skills": skills,
            "experience": [{"company": "Test Corp", "role": "Developer", "years": 2}],
            "education": [{"degree": "BSc", "institution": "Test University"}],
            "projects": [],
        },
    }


def create_mock_job_record(
    job_id: Optional[str] = None, keywords: Optional[List[str]] = None
) -> dict:
    job_id = job_id or "job-test-001"
    keywords = keywords or ["python", "fastapi", "docker"]

    return {
        "id": job_id,
        "title": "Test Job",
        "company": "Test Company",
        "raw_text": "Test job description with required skills.",
        "keywords": keywords,
        "created_at": date.today().isoformat(),
        "updated_at": date.today().isoformat(),
    }
