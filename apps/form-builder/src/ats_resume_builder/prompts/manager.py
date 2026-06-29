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
        return (
            f"Prompt version: {prompt_version}\n"
            "Optimize this resume for ATS parsing and relevance.\n"
            "Return only valid JSON matching the supplied schema. "
            "Do not return markdown, LaTeX, comments, or explanations.\n"
            f"ATS rules version: {ats_rules.version}\n"
            f"ATS rules: {list(ats_rules.rules)}\n"
            f"Schema: {schema_hint}\n"
            f"Resume JSON: {resume.model_dump_json()}"
        )
