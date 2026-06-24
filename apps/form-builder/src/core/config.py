"""
Application settings loaded from environment variables (or a .env file).

Usage anywhere in the project:
    from src.core.config import settings
    print(settings.LLM_API_KEY)

Only Gemini is supported as a real LLM provider right now.
Set LLM_PROVIDER=mock (default) to run fully offline without any API key.
"""

import logging as _logging
from typing import List

from cryptography.fernet import Fernet
from pydantic import Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    APP_NAME: str = "Form Builder - Resume Module"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    API_KEY: str = Field(default="test-api-key")

    SECRET_KEY: str = Field(default="dev-secret-key-change-in-production")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    LLM_PROVIDER: str = Field(default="mock", pattern="^(mock|gemini)$")
    GEMINI_API_KEY: str = Field(default="")
    GEMINI_MODEL: str = "gemini-1.5-flash"

    TMP_DIR: str = "tmp"
    UPLOAD_DIR: str = "uploads"
    STORAGE_BACKEND: str = Field(default="local")
    ALLOWED_UPLOAD_TYPES: List[str] = ["application/pdf"]
    MAX_UPLOAD_SIZE_MB: int = 5

    @property
    def MAX_UPLOAD_SIZE_BYTES(self) -> int:
        return self.MAX_UPLOAD_SIZE_MB * 1024 * 1024

    FILE_ENCRYPTION_KEY: str = Field(default="")

    @model_validator(mode="after")
    def _ensure_encryption_key(self) -> "Settings":
        if not self.FILE_ENCRYPTION_KEY:
            generated = Fernet.generate_key().decode()
            object.__setattr__(self, "FILE_ENCRYPTION_KEY", generated)
            _logging.getLogger(__name__).warning(
                "FILE_ENCRYPTION_KEY not set — generated an ephemeral key "
                "for this run. Set FILE_ENCRYPTION_KEY in .env for "
                "production, otherwise uploaded files become unreadable "
                "after every restart."
            )
        return self


settings = Settings()
