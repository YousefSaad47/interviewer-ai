import json
import re
from typing import Any


def repair_json(raw: str) -> dict[str, Any]:
    """Lightly repair common LLM JSON wrapper mistakes."""

    text = raw.strip()
    fenced = re.fullmatch(r"```(?:json)?\s*(.*?)\s*```", text, flags=re.DOTALL | re.IGNORECASE)
    if fenced:
        text = fenced.group(1).strip()

    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        text = text[start : end + 1]

    text = re.sub(r",(\s*[}\]])", r"\1", text)
    parsed = json.loads(text)
    if not isinstance(parsed, dict):
        msg = "AI JSON response must be an object"
        raise ValueError(msg)
    return parsed
