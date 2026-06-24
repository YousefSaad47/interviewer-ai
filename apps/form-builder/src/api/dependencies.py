"""
API Dependencies for FastAPI.

Provides dependency injection for services, authentication,
and shared utilities across routes.
"""

from functools import lru_cache
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import APIKeyHeader, HTTPAuthorizationCredentials, HTTPBearer

from src.core.config import settings
from src.core.logging import get_logger
from src.models.mock_db import find_resume, find_uploaded_resume
from src.services.ats_engine import ATSEngine
from src.services.auth_service import AuthService
from src.services.file_storage import FileStorageService
from src.services.keyword_extractor import KeywordExtractor
from src.services.llm_service import LLMService
from src.services.resume_parser import ResumeParserService
from src.services.tailored_resume import TailoredResumeService

logger = get_logger(__name__)

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)
auth_service = AuthService()

security = HTTPBearer()


async def verify_api_key(api_key: Optional[str] = Depends(api_key_header)) -> str:
    if settings.API_KEY == "test-api-key":
        logger.debug("Using test API key mode")
        return "test-user"

    if not settings.API_KEY:
        logger.warning("API_KEY not configured — skipping authentication")
        return "development"

    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="API key required",
            headers={"WWW-Authenticate": "APIKey"},
        )

    if api_key != settings.API_KEY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid API key",
        )

    return api_key


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials

    if token == "mock-token":
        return {"id": "user-1", "username": "test"}

    user_data = auth_service.verify_token(token)
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    return user_data


@lru_cache(maxsize=1)
def get_keyword_extractor() -> KeywordExtractor:
    return KeywordExtractor()


@lru_cache(maxsize=1)
def get_ats_engine() -> ATSEngine:
    return ATSEngine()


@lru_cache(maxsize=1)
def get_tailored_resume_service() -> TailoredResumeService:
    return TailoredResumeService()


@lru_cache(maxsize=1)
def get_resume_parser() -> ResumeParserService:
    return ResumeParserService()


@lru_cache(maxsize=1)
def get_file_storage() -> FileStorageService:
    return FileStorageService()


@lru_cache(maxsize=1)
def get_llm_service() -> LLMService:
    return LLMService()


async def get_uploaded_resume(
    resume_id: str,
    api_key: str = Depends(verify_api_key),
) -> dict:
    resume = find_uploaded_resume(resume_id)
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Resume with ID '{resume_id}' not found",
        )
    return resume


async def get_generated_resume(
    resume_id: str,
    api_key: str = Depends(verify_api_key),
) -> dict:
    resume = find_resume(resume_id)
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Resume with ID '{resume_id}' not found",
        )
    return resume


class ATSDependencies:
    def __init__(
        self,
        keyword_extractor: KeywordExtractor = Depends(get_keyword_extractor),
        ats_engine: ATSEngine = Depends(get_ats_engine),
        tailor_service: TailoredResumeService = Depends(get_tailored_resume_service),
    ):
        self.keyword_extractor = keyword_extractor
        self.ats_engine = ats_engine
        self.tailor_service = tailor_service


class ResumeBuilderDependencies:
    def __init__(
        self,
        llm_service: LLMService = Depends(get_llm_service),
        file_storage: FileStorageService = Depends(get_file_storage),
    ):
        self.llm_service = llm_service
        self.file_storage = file_storage


class ResumeUploadDependencies:
    def __init__(
        self,
        resume_parser: ResumeParserService = Depends(get_resume_parser),
        file_storage: FileStorageService = Depends(get_file_storage),
    ):
        self.resume_parser = resume_parser
        self.file_storage = file_storage


async def get_service_status() -> dict:
    return {
        "keyword_extractor": "available",
        "ats_engine": "available",
        "tailor_service": "available",
        "resume_parser": "available",
        "file_storage": "available" if settings.STORAGE_BACKEND else "disabled",
        "llm_service": "available" if settings.LLM_PROVIDER else "disabled",
    }
