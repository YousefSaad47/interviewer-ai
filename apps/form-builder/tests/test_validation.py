from typing import Any, cast

import pytest
from pydantic import ValidationError

from ats_resume_builder.schemas.resume import ResumeBuildRequest


def valid_payload() -> dict[str, Any]:
    return {
        "resumeId": "resume-123",
        "resume": {
            "personal_information": {
                "full_name": "Ada Lovelace",
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


def test_rejects_invalid_email() -> None:
    payload = valid_payload()
    resume = cast(dict[str, Any], payload["resume"])
    assert isinstance(resume, dict)
    personal = cast(dict[str, Any], resume["personal_information"])
    assert isinstance(personal, dict)
    personal["email"] = "not-an-email"

    with pytest.raises(ValidationError):
        ResumeBuildRequest.model_validate(payload)


def test_rejects_empty_resume_body() -> None:
    payload = valid_payload()
    resume = cast(dict[str, Any], payload["resume"])
    assert isinstance(resume, dict)
    resume["skills"] = []

    with pytest.raises(ValidationError, match="at least one"):
        ResumeBuildRequest.model_validate(payload)
