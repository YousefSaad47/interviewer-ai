from ats_resume_builder.config.settings import Settings
from ats_resume_builder.exceptions import AIProviderError
from ats_resume_builder.providers.base import AIProvider
from ats_resume_builder.providers.gemini import GeminiProvider


def create_ai_provider(settings: Settings) -> AIProvider:
    if settings.ai_provider == "gemini":
        return GeminiProvider(settings)
    msg = f"AI provider '{settings.ai_provider}' is not implemented"
    raise AIProviderError(msg, details={"provider": settings.ai_provider})
