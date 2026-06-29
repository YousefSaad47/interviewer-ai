from datetime import date
from enum import Enum
from pathlib import Path
from typing import Any

from jinja2 import Environment, FileSystemLoader, StrictUndefined, select_autoescape

from ats_resume_builder.schemas.resume import DateRange, Resume
from ats_resume_builder.utils.latex import escape_latex


class LatexResumeRenderer:
    _template_name = "resume.tex.j2"

    def __init__(self, template_dir: Path | None = None) -> None:
        root = Path(__file__).resolve().parents[1]
        self._template_dir = template_dir or root / "templates"
        self._environment = Environment(
            loader=FileSystemLoader(self._template_dir),
            autoescape=select_autoescape(default_for_string=False, default=False),
            trim_blocks=True,
            lstrip_blocks=True,
            undefined=StrictUndefined,
        )

    def render(self, resume: Resume) -> str:
        template = self._environment.get_template(self._template_name)
        context = self._build_context(resume)
        return template.render(**context)

    def _build_context(self, resume: Resume) -> dict[str, Any]:
        resume_data = self._sanitize(self._prepare_resume_data(resume))
        personal = resume_data["personal_information"]
        return {
            "resume": resume_data,
            "personal": personal,
            "contact_items": self._build_contact_items(personal),
            "metadata_title": f"{personal['full_name']}'s CV",
            "metadata_author": personal["full_name"],
        }

    def _prepare_resume_data(self, resume: Resume) -> dict[str, Any]:
        data = resume.model_dump(mode="python")
        data["experience"] = sorted(
            data["experience"],
            key=self._date_range_sort_key,
            reverse=True,
        )
        return data

    def _build_contact_items(self, personal: dict[str, Any]) -> list[dict[str, str]]:
        items: list[dict[str, str]] = []
        for field, label in (
            ("email", "Email"),
            ("phone", "Phone"),
            ("location", "Location"),
        ):
            if personal.get(field):
                items.append({"label": label, "text": str(personal[field]), "url": ""})

        for link in personal.get("links", []):
            items.append(
                {
                    "label": self._display_link_label(str(link["label"])),
                    "text": self._display_url(str(link["url"])),
                    "url": str(link["url"]),
                }
            )
        return items

    def _sanitize(self, value: Any) -> Any:
        if isinstance(value, str):
            return escape_latex(value)
        if isinstance(value, Enum):
            return escape_latex(value.value)
        if isinstance(value, date):
            return self._format_date(value)
        if isinstance(value, DateRange):
            return self._format_date_range(value)
        if isinstance(value, dict):
            if set(value).issuperset({"start", "end", "current"}):
                return self._format_date_range(DateRange.model_validate(value))
            return {key: self._sanitize(item) for key, item in value.items()}
        if isinstance(value, list):
            return [self._sanitize(item) for item in value]
        if value is not None and not isinstance(value, bool | int | float):
            return escape_latex(value)
        return value

    def _display_link_label(self, label: str) -> str:
        normalized = label.lower().replace(" ", "").replace("-", "")
        known_labels = {
            "linkedin": "LinkedIn",
            "github": "GitHub",
            "portfolio": "Portfolio",
            "website": "Portfolio",
            "personalwebsite": "Portfolio",
        }
        return known_labels.get(normalized, label)

    def _display_url(self, url: str) -> str:
        return url.removeprefix("https://").removeprefix("http://").removesuffix("/")

    def _date_range_sort_key(self, item: dict[str, Any]) -> date:
        date_range = item.get("date_range")
        if not isinstance(date_range, dict):
            return date.min
        start = date_range.get("start")
        return start if isinstance(start, date) else date.min

    def _format_date_range(self, value: DateRange) -> str:
        start = self._format_date(value.start)
        end = "Present" if value.current else self._format_date(value.end)
        if start and end:
            return f"{start} -- {end}"
        return start or end

    def _format_date(self, value: date | None) -> str:
        return value.strftime("%b %Y") if value else ""
