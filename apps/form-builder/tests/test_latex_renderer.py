from ats_resume_builder.renderer.latex_renderer import LatexResumeRenderer
from ats_resume_builder.schemas.resume import Resume
from ats_resume_builder.utils.latex import escape_latex


def test_escape_latex_special_characters() -> None:
    assert escape_latex(r"A&B%$_{}~^\\") == (
        r"A\&B\%\$\_\{\}\textasciitilde{}\textasciicircum{}"
        r"\textbackslash{}\textbackslash{}"
    )


def test_renderer_escapes_resume_content() -> None:
    resume = Resume.model_validate(
        {
            "personal_information": {
                "full_name": "Ada & Co",
                "email": "ada@example.com",
            },
            "professional_summary": "Built 50% faster systems",
            "skills": [{"name": "Python_Engineering"}],
        }
    )

    latex = LatexResumeRenderer().render(resume)

    assert r"Ada \& Co" in latex
    assert r"50\% faster" in latex
    assert r"Python\_Engineering" in latex


def test_renderer_omits_empty_sections_and_renders_contact_links() -> None:
    resume = Resume.model_validate(
        {
            "personal_information": {
                "full_name": "Ada Lovelace",
                "email": "ada@example.com",
                "phone": "+1 (555) 123-4567",
                "location": "London, UK",
                "links": [
                    {"label": "linkedin", "url": "https://linkedin.com/in/ada"},
                    {"label": "github", "url": "https://github.com/ada"},
                    {"label": "website", "url": "https://ada.dev"},
                ],
            },
            "skills": [{"name": "Python", "keywords": ["FastAPI", "Jinja2"]}],
        }
    )

    latex = LatexResumeRenderer().render(resume)

    assert "ada@example.com" in latex
    assert r"\begin{tabularx}{\textwidth}{@{} X X @{}}" in latex
    assert r"\faLinkedinIn" in latex
    assert r"\href{https://linkedin.com/in/ada}" in latex
    assert r"\faGithub" in latex
    assert r"\href{https://github.com/ada}" in latex
    assert r"\faCode" in latex
    assert r"\href{https://ada.dev/}" in latex
    assert r"\section{Work Experience}" not in latex
    assert r"\section{Projects}" not in latex
    assert r"\section{Education}" not in latex


def test_renderer_sorts_experience_reverse_chronologically() -> None:
    resume = Resume.model_validate(
        {
            "personal_information": {
                "full_name": "Ada Lovelace",
                "email": "ada@example.com",
            },
            "experience": [
                {
                    "company": "Earlier Co",
                    "title": "Engineer",
                    "date_range": {"start": "2020-01-01", "end": "2021-01-01"},
                    "highlights": ["Built reliable services."],
                },
                {
                    "company": "Current Co",
                    "title": "Senior Engineer",
                    "date_range": {"start": "2022-02-01", "current": True},
                    "highlights": ["Led platform modernization."],
                },
            ],
        }
    )

    latex = LatexResumeRenderer().render(resume)

    assert latex.index("Current Co") < latex.index("Earlier Co")
    assert "Feb 2022 -- Present" in latex


def test_renderer_supports_education_description() -> None:
    resume = Resume.model_validate(
        {
            "personal_information": {
                "full_name": "Ada Lovelace",
                "email": "ada@example.com",
            },
            "education": [
                {
                    "institution": "University of London",
                    "degree": "BSc Computer Science",
                    "date_range": {"start": "2017-09-01", "end": "2020-06-01"},
                    "description": "Focused on algorithms and distributed systems.",
                }
            ],
        }
    )

    latex = LatexResumeRenderer().render(resume)

    assert "Focused on algorithms and distributed systems." in latex
    assert "Sep 2017 -- Jun 2020" in latex
