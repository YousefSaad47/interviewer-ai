from pydantic import BaseModel, Field


class ATSRuleSet(BaseModel):
    version: str
    rules: tuple[str, ...] = Field(default_factory=tuple)


class ATSRulesRepository:
    """Versioned ATS guidance isolated from prompts and services."""

    def get(self, version: str) -> ATSRuleSet:
        rules = (
            "Use a single-column layout.",
            "Improve wording without inventing metrics or achievements.",
            "Avoid tables, images, icons, graphics, and text boxes.",
            "Use standard section names and plain text bullets.",
            "Keep all output as structured JSON matching the schema.",
        )
        return ATSRuleSet(version=version, rules=rules)
