from dataclasses import dataclass

from pydantic import ValidationError

from ats_resume_builder.ats.rules import ATSRulesRepository
from ats_resume_builder.config.settings import Settings
from ats_resume_builder.exceptions import InvalidAIResponseError
from ats_resume_builder.prompts.manager import PromptManager
from ats_resume_builder.providers.base import AIProvider
from ats_resume_builder.schemas.resume import Resume
from ats_resume_builder.utils.json_repair import repair_json


@dataclass(slots=True)
class ResumeOptimizationWorkflow:
    provider: AIProvider
    prompt_manager: PromptManager
    ats_rules_repository: ATSRulesRepository
    settings: Settings

    async def optimize(self, resume: Resume, *, request_id: str) -> tuple[Resume, int]:
        ats_rules = self.ats_rules_repository.get(self.settings.ats_rules_version)
        prompt = self.prompt_manager.build_resume_optimization_prompt(
            resume,
            prompt_version=self.settings.prompt_version,
            ats_rules=ats_rules,
        )

        last_error: Exception | None = None
        for attempt in range(self.settings.ai_retry_limit + 1):
            raw = await self.provider.generate_json(prompt, request_id=request_id)
            try:
                repaired = repair_json(raw)
                return Resume.model_validate(repaired), attempt
            except (ValueError, ValidationError) as exc:
                last_error = exc

        msg = "AI response could not be repaired or validated"
        raise InvalidAIResponseError(msg, details={"error": str(last_error)})
