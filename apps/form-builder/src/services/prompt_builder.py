"""
Node 2 of the resume-generation pipeline: builds the LLM prompt from
already-normalized data.
"""

from typing import Any, Dict


def build_resume_prompt(data: Dict[str, Any]) -> str:
    experience_block = (
        "\n".join(
            f"- {e['role']} at {e['company']} ({e['start_date']} - {e['end_date']}): "
            f"{e['description']}"
            for e in data.get("experience", [])
        )
        or "No experience provided."
    )

    projects_block = (
        "\n".join(f"- {p['name']}: {p['description']}" for p in data.get("projects", []))
        or "No projects listed."
    )

    education_block = (
        "\n".join(
            f"- {e['degree']} in {e.get('field_of_study') or 'N/A'} @ {e['institution']}"
            for e in data.get("education", [])
        )
        or "No education provided."
    )

    contact_parts = [f"Email: {data['email']}"]
    if data.get("phone"):
        contact_parts.append(f"Phone: {data['phone']}")

    contact_row = " | ".join(contact_parts)

    social_links = " | ".join(
        f'<a href="{url}">{label}</a>'
        for label, url in [
            ("LinkedIn", data.get("linkedin")),
            ("GitHub", data.get("github")),
            ("Portfolio", data.get("portfolio")),
        ]
        if url
    )

    return f"""You are an ATS resume-writing assistant. Generate an ATS-optimized resume in Markdown for the candidate below. Tone: {data.get("tone", "professional")}.

STRICT FORMATTING RULES for the header — follow exactly:
1. Candidate name inside a centered HTML div as an h1 tag: <div style="text-align:center"><h1>Name</h1>
2. Next line inside the same div: contact details in a <p> tag — <p>{contact_row}</p>
3. Next line inside the same div (only if social links exist): <p>{social_links}</p>
4. Close the div: </div>
5. Do NOT add any footer, tagline, or generator credit at the end of the resume.

Example header output:
<div style="text-align:center">
<h1>Ahmed Hassan</h1>
<p>ahmed@email.com | +20 100 123 4567</p>
<p><a href="https://linkedin.com/in/ahmed">LinkedIn</a> | <a href="https://github.com/ahmed">GitHub</a></p>
</div>

Candidate: {data["full_name"]}
Target role: {data["role_target"]} ({data.get("seniority_level") or "N/A"})
Industry: {data.get("industry_target") or "N/A"}

Skills: {", ".join(data.get("skills", [])) or "N/A"}

Experience:
{experience_block}

Projects:
{projects_block}

Education:
{education_block}

Keywords to emphasize for ATS matching: {", ".join(data.get("keywords", [])) or "N/A"}

Return only the resume in Markdown, with clear section headings (Summary, Skills, Experience, Projects, Education). No preamble, no explanation, no footer."""
