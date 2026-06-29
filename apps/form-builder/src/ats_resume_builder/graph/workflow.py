from dataclasses import dataclass
from typing import Any, TypedDict, cast

from pydantic import ValidationError

from ats_resume_builder.ats.rules import ATSRulesRepository
from ats_resume_builder.config.settings import Settings
from ats_resume_builder.exceptions import InvalidAIResponseError
from ats_resume_builder.prompts.manager import PromptManager
from ats_resume_builder.providers.base import AIProvider
from ats_resume_builder.schemas.resume import Resume
from ats_resume_builder.utils.json_repair import repair_json


class WorkflowState(TypedDict):
    request_id: str
    resume: Resume
    optimized_resume: Resume | None
    retry_count: int
    raw_ai_response: str | None


@dataclass(slots=True)
class ResumeOptimizationWorkflow:
    provider: AIProvider
    prompt_manager: PromptManager
    ats_rules_repository: ATSRulesRepository
    settings: Settings

    async def optimize(self, resume: Resume, *, request_id: str) -> tuple[Resume, int]:
        state: WorkflowState = {
            "request_id": request_id,
            "resume": resume,
            "optimized_resume": None,
            "retry_count": 0,
            "raw_ai_response": None,
        }
        try:
            from langgraph.graph import END, StateGraph

            graph = StateGraph(cast(Any, WorkflowState))
            graph.add_node("optimize_resume", self._optimize_node)
            graph.set_entry_point("optimize_resume")
            graph.add_edge("optimize_resume", END)
            compiled = graph.compile()
            result = cast(dict[str, Any], await compiled.ainvoke(cast(Any, state)))
            optimized = result.get("optimized_resume")
            if not isinstance(optimized, Resume):
                msg = "AI workflow completed without a valid resume"
                raise InvalidAIResponseError(msg)
            return optimized, int(result.get("retry_count", 0))
        except ImportError:
            result: WorkflowState = await self._optimize_node(state)
            optimized = result["optimized_resume"]
            if optimized is None:
                msg = "AI workflow completed without a valid resume"
                raise InvalidAIResponseError(msg)
            return optimized, result["retry_count"]

    async def _optimize_node(self, state: WorkflowState) -> WorkflowState:
        ats_rules = self.ats_rules_repository.get(self.settings.ats_rules_version)
        prompt = self.prompt_manager.build_resume_optimization_prompt(
            state["resume"],
            prompt_version=self.settings.prompt_version,
            ats_rules=ats_rules,
        )

        last_error: Exception | None = None
        for attempt in range(self.settings.ai_retry_limit + 1):
            raw = await self.provider.generate_json(prompt, request_id=state["request_id"])
            state["raw_ai_response"] = raw
            state["retry_count"] = attempt
            try:
                repaired = repair_json(raw)
                state["optimized_resume"] = Resume.model_validate(repaired)
                return state
            except (ValueError, ValidationError) as exc:
                last_error = exc

        msg = "AI response could not be repaired or validated"
        raise InvalidAIResponseError(msg, details={"error": str(last_error)})
