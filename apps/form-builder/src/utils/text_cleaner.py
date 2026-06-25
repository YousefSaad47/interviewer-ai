"""
Normalization helpers — Node 1 ("Clean & normalize data") of the
resume-generation LangGraph pipeline.

Fixes vs. the original draft:
- dates are formatted to readable strings instead of leaking raw `date`
  objects or printing "None" when a field is missing.
- every nested list (experience/projects/education) is normalized, not
  just `skills`.
"""

from datetime import date
from typing import Any, Dict, List, Optional


def _clean_str(value: Optional[str]) -> str:
    if not value:
        return ""
    return " ".join(value.strip().split())


def _format_date(value: Optional[date]) -> str:
    if value is None:
        return ""
    return value.strftime("%b %Y")


def normalize_skills(skills: List[str]) -> List[str]:
    seen = set()
    cleaned: List[str] = []
    for skill in skills:
        s = _clean_str(skill).lower()
        if s and s not in seen:
            seen.add(s)
            cleaned.append(s)
    return cleaned


def normalize_experience(experience: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    normalized = []
    for exp in experience:
        normalized.append(
            {
                "company": _clean_str(exp.get("company")),
                "role": _clean_str(exp.get("role")),
                "start_date": _format_date(exp.get("start_date")),
                "end_date": "Present"
                if exp.get("is_current")
                else _format_date(exp.get("end_date")),
                "location": _clean_str(exp.get("location")),
                "description": _clean_str(exp.get("description")),
                "technologies": [t.strip() for t in exp.get("technologies", []) if t.strip()],
                "achievements": [a.strip() for a in exp.get("achievements", []) if a.strip()],
            }
        )
    return normalized


def normalize_projects(projects: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    normalized = []
    for p in projects:
        normalized.append(
            {
                "name": _clean_str(p.get("name")),
                "description": _clean_str(p.get("description")),
                "technologies": [t.strip() for t in p.get("technologies", []) if t.strip()],
                "link": p.get("link"),
            }
        )
    return normalized


def normalize_education(education: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    normalized = []
    for e in education:
        normalized.append(
            {
                "institution": _clean_str(e.get("institution")),
                "degree": _clean_str(e.get("degree")),
                "field_of_study": _clean_str(e.get("field_of_study")),
                "start_date": _format_date(e.get("start_date")),
                "end_date": _format_date(e.get("end_date")),
                "gpa": e.get("gpa"),
            }
        )
    return normalized


def normalize_resume_data(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Entry point used by the pipeline's 'normalize' node. Produces a clean,
    predictable dict ready for prompt building / LLM generation.
    """
    return {
        "full_name": _clean_str(data.get("full_name")),
        "email": data.get("email"),
        "phone": data.get("phone"),
        "location": _clean_str(data.get("location")),
        "linkedin": data.get("linkedin"),
        "github": data.get("github"),
        "portfolio": data.get("portfolio"),
        "role_target": _clean_str(data.get("role_target")),
        "seniority_level": data.get("seniority_level"),
        "industry_target": data.get("industry_target"),
        "skills": normalize_skills(data.get("skills", [])),
        "experience": normalize_experience(data.get("experience", [])),
        "projects": normalize_projects(data.get("projects", [])),
        "education": normalize_education(data.get("education", [])),
        "certifications": data.get("certifications", []),
        "keywords": data.get("keywords", []),
        "languages": data.get("languages", []),
        "tone": data.get("tone") or "professional",
        "ats_optimized": data.get("ats_optimized", True),
    }
