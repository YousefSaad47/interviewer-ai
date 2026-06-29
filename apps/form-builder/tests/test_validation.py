from typing import Any, cast

import pytest
from pydantic import ValidationError

from ats_resume_builder.schemas.resume import ResumeBuildRequest


def valid_payload() -> dict[str, Any]:
    return {
        "resumeId": "resume-123",
        "resume": {
            "personalInformation": {
                "fullName": "Ada Lovelace",
                "email": "ada@example.com",
                "phone": "+1 (555) 123-4567",
            },
            "skills": [{"name": "Python", "level": "expert"}],
        },
    }


def test_valid_resume_payload() -> None:
    payload = ResumeBuildRequest.model_validate(valid_payload())

    assert payload.resume_id == "resume-123"
    assert payload.resume.personal_information.email == "ada@example.com"


def test_camel_case_payload_accepted() -> None:
    payload = ResumeBuildRequest.model_validate(
        {
            "resumeId": "resume-123",
            "resume": {
                "personalInformation": {
                    "fullName": "Ada Lovelace",
                    "email": "ada@example.com",
                },
                "professionalSummary": "Backend developer.",
                "education": [
                    {
                        "institution": "University of London",
                        "degree": "BSc",
                        "fieldOfStudy": "Computer Science",
                        "dateRange": {"start": "2017-09-01", "end": "2020-06-01"},
                    }
                ],
            },
        }
    )

    assert payload.resume.personal_information.full_name == "Ada Lovelace"
    assert payload.resume.education[0].field_of_study == "Computer Science"


def test_rejects_invalid_email() -> None:
    payload = valid_payload()
    resume = cast(dict[str, Any], payload["resume"])
    personal = cast(dict[str, Any], resume["personalInformation"])
    personal["email"] = "not-an-email"

    with pytest.raises(ValidationError):
        ResumeBuildRequest.model_validate(payload)


def test_rejects_invalid_phone() -> None:
    payload = valid_payload()
    resume = cast(dict[str, Any], payload["resume"])
    personal = cast(dict[str, Any], resume["personalInformation"])
    personal["phone"] = "call-me"

    with pytest.raises(ValidationError):
        ResumeBuildRequest.model_validate(payload)


def test_rejects_invalid_date_range() -> None:
    payload = valid_payload()
    resume = cast(dict[str, Any], payload["resume"])
    resume["experience"] = [
        {
            "company": "Later Co",
            "title": "Engineer",
            "dateRange": {"start": "2024-01-01", "end": "2023-01-01"},
            "highlights": ["Built services."],
        }
    ]

    with pytest.raises(ValidationError):
        ResumeBuildRequest.model_validate(payload)


def test_rejects_current_job_with_end_date() -> None:
    payload = valid_payload()
    resume = cast(dict[str, Any], payload["resume"])
    resume["experience"] = [
        {
            "company": "Current Co",
            "title": "Engineer",
            "dateRange": {"start": "2024-01-01", "end": "2025-01-01", "current": True},
            "highlights": ["Built services."],
        }
    ]

    with pytest.raises(ValidationError):
        ResumeBuildRequest.model_validate(payload)


def test_rejects_unknown_fields() -> None:
    payload = valid_payload()
    payload["templateKey"] = "classic"

    with pytest.raises(ValidationError):
        ResumeBuildRequest.model_validate(payload)


def test_rejects_empty_resume_body() -> None:
    payload = valid_payload()
    resume = cast(dict[str, Any], payload["resume"])
    resume["skills"] = []

    with pytest.raises(ValidationError, match="at least one"):
        ResumeBuildRequest.model_validate(payload)
