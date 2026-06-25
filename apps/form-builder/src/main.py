"""
Application entry point.

Lifespan handles startup / shutdown hooks — ready for DB connections,
Celery workers, or any other resource you add later.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.security import HTTPBearer

from src.api.routes import (
    ats_match,
    auth,
    file_manager,
    jobs,
    resume_builder,
    resume_upload,
)
from src.core.config import Settings
from src.core.logging import get_logger

logger = get_logger(__name__)

settings = Settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(
        "Starting %s v%s  |  LLM_PROVIDER=%s",
        settings.APP_NAME,
        settings.APP_VERSION,
        settings.LLM_PROVIDER,
    )
    yield
    logger.info("Shutting down %s", settings.APP_NAME)


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    lifespan=lifespan,
    swagger_ui_parameters={
        "persistAuthorization": True,
    },
)

security = HTTPBearer()

app.include_router(resume_builder.router, prefix="/resume", tags=["Resume Builder"])
app.include_router(resume_upload.router, prefix="/resume", tags=["Resume Upload"])
app.include_router(ats_match.router, prefix="/ats", tags=["ATS"])
app.include_router(file_manager.router, prefix="/files", tags=["Secure Files"])
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(jobs.router, prefix="/jobs", tags=["Jobs"])
