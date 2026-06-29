from functools import lru_cache

from ats_resume_builder.ats.rules import ATSRulesRepository
from ats_resume_builder.compiler.pdf_compiler import PDFCompiler
from ats_resume_builder.config.settings import Settings, get_settings
from ats_resume_builder.graph.workflow import ResumeOptimizationWorkflow
from ats_resume_builder.prompts.manager import PromptManager
from ats_resume_builder.providers.factory import create_ai_provider
from ats_resume_builder.renderer.latex_renderer import LatexResumeRenderer
from ats_resume_builder.services.resume_builder import ResumeBuilderService


@lru_cache
def get_resume_builder_service() -> ResumeBuilderService:
    settings: Settings = get_settings()
    provider = create_ai_provider(settings)
    workflow = ResumeOptimizationWorkflow(
        provider=provider,
        prompt_manager=PromptManager(),
        ats_rules_repository=ATSRulesRepository(),
        settings=settings,
    )
    return ResumeBuilderService(
        workflow=workflow,
        renderer=LatexResumeRenderer(),
        compiler=PDFCompiler(settings),
    )
