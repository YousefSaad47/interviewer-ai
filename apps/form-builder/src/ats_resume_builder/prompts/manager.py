from ats_resume_builder.ats.rules import ATSRuleSet
from ats_resume_builder.schemas.resume import Resume


class PromptManager:
    """Builds provider prompts without coupling prompt text to services."""

    def build_resume_optimization_prompt(
        self,
        resume: Resume,
        *,
        prompt_version: str,
        ats_rules: ATSRuleSet,
    ) -> str:
        schema_hint = Resume.model_json_schema()
        resume_json = resume.model_dump_json(by_alias=True)
        return (
            f"Prompt version: {prompt_version}\n"
            "Optimize this resume for ATS parsing and relevance.\n"
            "Do not invent employers, roles, dates, degrees, certifications, skills, projects, "
            "metrics, achievements, or personal details.\n"
            "Only improve clarity, wording, structure, and ATS compatibility using facts already "
            "present in the input.\n"
            "Do not change personal information.\n"
            "Do not add fake measurable achievements.\n"
            "Do not remove truthful information unless it is duplicated.\n"
            "Return only valid JSON matching the supplied schema. "
            "Do not return markdown, LaTeX, comments, or explanations.\n"
            f"ATS rules version: {ats_rules.version}\n"
            f"ATS rules: {list(ats_rules.rules)}\n"
            f"Schema: {schema_hint}\n"
            f"Resume JSON: {resume_json}"
        )
