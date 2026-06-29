from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

AIProviderName = Literal["gemini", "openai", "ollama", "local"]


class Settings(BaseSettings):
    """Runtime configuration sourced from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="ATS_",
        extra="ignore",
        case_sensitive=False,
    )

    app_name: str = "ATS Resume Builder"
    environment: Literal["development", "production", "test"] = "development"
    log_level: str = "INFO"

    ai_provider: AIProviderName = "gemini"
    gemini_api_key: SecretStr | None = None
    gemini_model: str = "gemini-2.5-flash"
    gemini_base_url: str = "https://generativelanguage.googleapis.com/v1beta"
    ai_timeout_seconds: float = Field(default=30.0, gt=0)
    ai_retry_limit: int = Field(default=2, ge=0, le=5)

    prompt_version: str = "v1"
    ats_rules_version: str = "v1"

    compiler_path: str = "xelatex"
    compiler_timeout_seconds: float = Field(default=300.0, gt=0)
    temporary_directory: Path = Path("/tmp/resume-generation")


@lru_cache
def get_settings() -> Settings:
    return Settings()
