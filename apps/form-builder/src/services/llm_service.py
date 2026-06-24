"""
LLM layer — Node 3 of the resume-generation pipeline.

Supported providers
-------------------
mock   (default) — offline template, zero API calls, great for local dev/tests
gemini           — Google Gemini via google-generativeai

Switch provider via LLM_PROVIDER in .env.
GEMINI_API_KEY is required only when LLM_PROVIDER=gemini.
"""

from typing import Any, Dict

from src.core.config import settings
from src.core.logging import get_logger
from src.services.prompt_builder import build_resume_prompt

logger = get_logger(__name__)


class LLMService:
    def __init__(self) -> None:
        self.provider = settings.LLM_PROVIDER
        logger.info("LLMService initialised with provider=%s", self.provider)

    def generate_resume_markdown(self, data: Dict[str, Any]) -> str:
        prompt = build_resume_prompt(data)

        if self.provider == "gemini":
            return self._call_gemini(prompt)

        return self._mock_template(data)

    def _call_gemini(self, prompt: str) -> str:
        if not settings.GEMINI_API_KEY:
            raise RuntimeError(
                "GEMINI_API_KEY is not set. "
                "Add it to your .env file or set LLM_PROVIDER=mock to run offline."
            )

        try:
            import google.generativeai as genai
        except ImportError as exc:
            raise RuntimeError(
                "google-generativeai is not installed. Run: pip install google-generativeai"
            ) from exc

        logger.info("Calling Gemini model=%s", settings.GEMINI_MODEL)
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel(settings.GEMINI_MODEL)
        result = model.generate_content(prompt)
        return result.text

    def _mock_template(self, data: Dict[str, Any]) -> str:
        logger.info("LLMService: using offline mock template (no API call)")

        contact_parts = [data["email"]]
        if data.get("phone"):
            contact_parts.append(data["phone"])
        contact_row = " | ".join(contact_parts)

        social_parts = []
        if data.get("linkedin"):
            social_parts.append(f'<a href="{data["linkedin"]}">LinkedIn</a>')
        if data.get("github"):
            social_parts.append(f'<a href="{data["github"]}">GitHub</a>')
        if data.get("portfolio"):
            social_parts.append(f'<a href="{data["portfolio"]}">Portfolio</a>')
        social_row = " | ".join(social_parts)

        social_html = f"\n<p>{social_row}</p>" if social_row else ""
        header = (
            '<div style="text-align:center">\n'
            f"<h1>{data['full_name']}</h1>\n"
            f"<p>{contact_row}</p>"
            f"{social_html}\n"
            f"</div>\n\n"
        )

        return (
            f"{header}"
            f"---\n\n"
            f"## Summary\n"
            f"Experienced {data.get('seniority_level') or ''} {data['role_target']} "
            f"seeking to leverage skills in {', '.join(data.get('skills', [])[:3]) or 'various technologies'}.\n\n"
            f"---\n\n"
            f"## Skills\n"
            f"{', '.join(data.get('skills', [])) or 'N/A'}\n\n"
            f"---\n\n"
            f"## Experience\n"
            f"{self._format_experience(data.get('experience', []))}\n\n"
            f"---\n\n"
            f"## Projects\n"
            f"{self._format_projects(data.get('projects', []))}\n\n"
            f"---\n\n"
            f"## Education\n"
            f"{self._format_education(data.get('education', []))}\n\n"
            f"---\n\n"
            f"## Certifications\n"
            f"{self._format_certifications(data.get('certifications', []))}\n"
        )

    def _format_experience(self, experience: list) -> str:
        if not experience:
            return "No experience provided."
        blocks = []
        for e in experience:
            techs = (
                f"\n**Technologies:** {', '.join(e['technologies'])}"
                if e.get("technologies")
                else ""
            )
            achievements = (
                "\n" + "\n".join(f"- {a}" for a in e["achievements"])
                if e.get("achievements")
                else ""
            )
            blocks.append(
                f"### {e['role']} @ {e['company']}\n"
                f"*{e['start_date']} – {e['end_date']}*"
                f"{'  |  ' + e['location'] if e.get('location') else ''}\n\n"
                f"{e['description']}"
                f"{techs}"
                f"{achievements}"
            )
        return "\n\n".join(blocks)

    def _format_projects(self, projects: list) -> str:
        if not projects:
            return "No projects listed."
        lines = []
        for p in projects:
            tech = f" *({', '.join(p['technologies'])})*" if p.get("technologies") else ""
            link = f" — [{p['link']}]({p['link']})" if p.get("link") else ""
            lines.append(f"- **{p['name']}**{tech}: {p['description']}{link}")
        return "\n".join(lines)

    def _format_education(self, education: list) -> str:
        if not education:
            return "No education provided."
        lines = []
        for e in education:
            field = f" in {e['field_of_study']}" if e.get("field_of_study") else ""
            dates = f" ({e['start_date']} – {e['end_date']})" if e.get("start_date") else ""
            gpa = f" | GPA: {e['gpa']}" if e.get("gpa") else ""
            lines.append(f"- **{e['degree']}{field}** @ {e['institution']}{dates}{gpa}")
        return "\n".join(lines)

    def _format_certifications(self, certs: list) -> str:
        if not certs:
            return "N/A"
        lines = []
        for c in certs:
            issuer = f" — {c.get('issuer')}" if c.get("issuer") else ""
            lines.append(f"- **{c['name']}**{issuer}")
        return "\n".join(lines)
