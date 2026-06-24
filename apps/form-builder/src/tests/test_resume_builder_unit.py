"""
Unit Tests (Resume Generation)

Coverage:
  • normalize_resume_data   (text_cleaner)
  • build_resume_prompt     (prompt_builder)
  • LLMService mock         (llm_service)
  • convert_markdown_to_pdf (markdown_to_pdf)

"""

from datetime import date
from unittest.mock import patch

import pytest

from tests.conftest import FULL_PAYLOAD, MINIMAL_PAYLOAD


class TestNormalizeResumeData:
    def test_deduplicates_skills(self):
        from src.utils.text_cleaner import normalize_resume_data

        data = {
            **MINIMAL_PAYLOAD,
            "skills": ["Python", "python", "  PYTHON  ", "Docker"],
        }
        result = normalize_resume_data(data)
        assert result["skills"].count("python") == 1
        assert "docker" in result["skills"]

    def test_strips_whitespace_from_name(self):
        from src.utils.text_cleaner import normalize_resume_data

        data = {**MINIMAL_PAYLOAD, "full_name": "  Jane   Doe  "}
        result = normalize_resume_data(data)
        assert result["full_name"] == "Jane Doe"

    def test_formats_experience_dates(self):
        from src.utils.text_cleaner import normalize_resume_data

        data = {
            **MINIMAL_PAYLOAD,
            "experience": [
                {
                    "company": "Corp",
                    "role": "Dev",
                    "start_date": date(2020, 1, 1),
                    "end_date": date(2022, 6, 1),
                    "is_current": False,
                    "description": "Did stuff",
                    "technologies": [],
                    "achievements": [],
                }
            ],
        }
        result = normalize_resume_data(data)
        exp = result["experience"][0]
        assert exp["start_date"] == "Jan 2020"
        assert exp["end_date"] == "Jun 2022"

    def test_current_job_end_date_is_present(self):
        from src.utils.text_cleaner import normalize_resume_data

        data = {
            **MINIMAL_PAYLOAD,
            "experience": [
                {
                    "company": "Corp",
                    "role": "Dev",
                    "start_date": date(2022, 3, 1),
                    "end_date": None,
                    "is_current": True,
                    "description": "Still here",
                    "technologies": [],
                    "achievements": [],
                }
            ],
        }
        result = normalize_resume_data(data)
        assert result["experience"][0]["end_date"] == "Present"

    def test_missing_optional_fields_dont_crash(self):
        from src.utils.text_cleaner import normalize_resume_data

        data = {"full_name": "X", "email": "x@x.com", "role_target": "Dev"}
        result = normalize_resume_data(data)
        assert result["skills"] == []
        assert result["experience"] == []

    def test_default_tone_is_professional(self):
        from src.utils.text_cleaner import normalize_resume_data

        data = {**MINIMAL_PAYLOAD}
        data.pop("tone", None)
        result = normalize_resume_data(data)
        assert result["tone"] == "professional"

    def test_education_gpa_preserved(self):
        from src.utils.text_cleaner import normalize_resume_data

        data = {
            **MINIMAL_PAYLOAD,
            "education": [
                {
                    "institution": "MIT",
                    "degree": "BSc",
                    "field_of_study": "CS",
                    "start_date": date(2018, 9, 1),
                    "end_date": date(2022, 6, 1),
                    "gpa": "3.9",
                }
            ],
        }
        result = normalize_resume_data(data)
        assert result["education"][0]["gpa"] == "3.9"


class TestBuildResumePrompt:
    def _normalized(self, overrides=None):
        from src.utils.text_cleaner import normalize_resume_data

        data = {**FULL_PAYLOAD, **(overrides or {})}
        return normalize_resume_data(data)

    def test_prompt_contains_candidate_name(self):
        from src.services.prompt_builder import build_resume_prompt

        assert "Ahmed Hassan" in build_resume_prompt(self._normalized())

    def test_prompt_contains_role_target(self):
        from src.services.prompt_builder import build_resume_prompt

        assert "Senior Software Engineer" in build_resume_prompt(self._normalized())

    def test_prompt_contains_skills(self):
        from src.services.prompt_builder import build_resume_prompt

        assert "python" in build_resume_prompt(self._normalized()).lower()

    def test_prompt_contains_linkedin_link(self):
        from src.services.prompt_builder import build_resume_prompt

        assert "linkedin.com/in/ahmed" in build_resume_prompt(self._normalized())

    def test_prompt_no_footer_instruction_present(self):
        from src.services.prompt_builder import build_resume_prompt

        prompt = build_resume_prompt(self._normalized())
        assert "No preamble" in prompt or "no footer" in prompt.lower()


class TestLLMServiceMock:
    def _normalized(self):
        from src.utils.text_cleaner import normalize_resume_data

        return normalize_resume_data(FULL_PAYLOAD)

    def test_mock_returns_string(self):
        from src.services.llm_service import LLMService

        svc = LLMService()
        svc.provider = "mock"
        result = svc.generate_resume_markdown(self._normalized())
        assert isinstance(result, str) and len(result) > 100

    def test_mock_contains_name_header(self):
        from src.services.llm_service import LLMService

        svc = LLMService()
        svc.provider = "mock"
        assert "Ahmed Hassan" in svc.generate_resume_markdown(self._normalized())

    def test_mock_contains_skills_section(self):
        from src.services.llm_service import LLMService

        svc = LLMService()
        svc.provider = "mock"
        assert "## Skills" in svc.generate_resume_markdown(self._normalized())

    def test_mock_contains_experience_section(self):
        from src.services.llm_service import LLMService

        svc = LLMService()
        svc.provider = "mock"
        assert "## Experience" in svc.generate_resume_markdown(self._normalized())

    def test_gemini_raises_if_no_api_key(self):
        from src.services.llm_service import LLMService

        svc = LLMService()
        svc.provider = "gemini"
        with patch("src.services.llm_service.settings") as ms:
            ms.GEMINI_API_KEY = ""
            ms.GEMINI_MODEL = "gemini-1.5-flash"
            with pytest.raises(RuntimeError, match="GEMINI_API_KEY"):
                svc._call_gemini("some prompt")


class TestMarkdownToPdf:
    def test_raises_runtime_error_on_failure(self, tmp_path):
        from src.utils.markdown_to_pdf import convert_markdown_to_pdf

        output = str(tmp_path / "out.pdf")
        with patch("src.utils.markdown_to_pdf.HTML") as mock_html:
            mock_html.return_value.write_pdf.side_effect = Exception("render fail")
            with pytest.raises(RuntimeError, match="Could not generate PDF"):
                convert_markdown_to_pdf("# Hello", output)

    def test_returns_output_path_on_success(self, tmp_path):
        from src.utils.markdown_to_pdf import convert_markdown_to_pdf

        output = str(tmp_path / "out.pdf")
        with patch("src.utils.markdown_to_pdf.HTML") as mock_html:
            mock_html.return_value.write_pdf.return_value = None
            result = convert_markdown_to_pdf("# Hello", output)
        assert result == output
