import json
import logging
from collections import defaultdict
from typing import Any

from src.core.config import get_settings
from src.prompts.resume_prompt import RESUME_GENERATION_PROMPT
from src.schemas.resume_schema import ResumeCreate
from src.services.gemini_client import GeminiClient

logger = logging.getLogger(__name__)


class ResumeServiceError(Exception):
    """Raised when resume generation fails in the service layer."""


def _safe_format_prompt(template: str, data: dict[str, Any]) -> str:
    safe_data = defaultdict(str, data)
    return template.format_map(safe_data)


def _stringify_optional(value: Any) -> str:
    return "" if value is None else str(value).strip()


def _sanitize_resume_data(data: dict[str, Any]) -> dict[str, Any]:
    personal = data.get("personal_info") or {}

    return {
        "personal_info": {
            "full_name": _stringify_optional(personal.get("full_name")),
            "email": _stringify_optional(personal.get("email")),
            "phone": _stringify_optional(personal.get("phone")),
            "location": _stringify_optional(personal.get("location")),
            "linkedin": _stringify_optional(personal.get("linkedin")),
            "github": _stringify_optional(personal.get("github")),
            "portfolio": _stringify_optional(personal.get("portfolio")),
            "summary": _stringify_optional(personal.get("summary")),
        },
        "skills": data.get("skills") or [],
        "experience": data.get("experience") or [],
        "projects": data.get("projects") or [],
        "education": data.get("education") or [],
        "certifications": data.get("certifications") or [],
        "languages": data.get("languages") or [],
        "job_role": _stringify_optional(data.get("job_role")),
    }


def generate_resume(resume_create: ResumeCreate) -> dict[str, str]:
    settings = get_settings()
    if not settings.gemini_api_key:
        raise ResumeServiceError("GEMINI_API_KEY is not configured")

    try:
        raw_data = resume_create.model_dump(mode="json")
        cleaned_data = _sanitize_resume_data(raw_data)
        structured_input = json.dumps(cleaned_data, ensure_ascii=False, indent=2)
        prompt = _safe_format_prompt(
            RESUME_GENERATION_PROMPT,
            {"resume_json": structured_input},
        )
        response_text = GeminiClient(settings.gemini_api_key).generate(
            model=settings.gemini_model,
            prompt=prompt,
        )
    except ResumeServiceError:
        raise
    except Exception as exc:
        logger.exception("Resume generation failed")
        raise ResumeServiceError("Resume generation failed") from exc

    return {"status": "success", "resume": response_text}
