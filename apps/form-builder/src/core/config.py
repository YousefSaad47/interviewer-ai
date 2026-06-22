import os
from functools import lru_cache

from dotenv import load_dotenv
from pydantic import BaseModel, Field

load_dotenv()


class Settings(BaseModel):
    app_name: str = "Resume Builder API"
    allowed_origins: list[str] = Field(default_factory=lambda: ["*"])
    allowed_hosts: list[str] = Field(default_factory=lambda: ["*"])
    gemini_api_key: str | None = None
    gemini_model: str = "gemini-2.5-flash"
    weasyprint_dll_directories: list[str] = Field(default_factory=list)
    generated_pdf_dir: str = "generated_pdfs"
    rate_limit_requests: int = 20
    rate_limit_window_seconds: int = 60
    max_request_bytes: int = 64_000
    max_markdown_chars: int = 30_000


def _parse_csv(value: str | None) -> list[str]:
    if not value:
        return []
    return [item.strip() for item in value.split(",") if item.strip()]


def _parse_path_list(value: str | None) -> list[str]:
    if not value:
        return []
    return [item.strip() for item in value.split(";") if item.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings(
        allowed_origins=_parse_csv(os.getenv("ALLOWED_ORIGINS")) or ["*"],
        allowed_hosts=_parse_csv(os.getenv("ALLOWED_HOSTS")) or ["*"],
        gemini_api_key=os.getenv("GEMINI_API_KEY"),
        gemini_model=os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
        weasyprint_dll_directories=_parse_path_list(
            os.getenv("WEASYPRINT_DLL_DIRECTORIES")
        ),
        generated_pdf_dir=os.getenv("GENERATED_PDF_DIR", "generated_pdfs"),
        rate_limit_requests=int(os.getenv("RATE_LIMIT_REQUESTS", "20")),
        rate_limit_window_seconds=int(os.getenv("RATE_LIMIT_WINDOW_SECONDS", "60")),
        max_request_bytes=int(os.getenv("MAX_REQUEST_BYTES", "64000")),
        max_markdown_chars=int(os.getenv("MAX_MARKDOWN_CHARS", "30000")),
    )
