from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from ats_resume_builder.api.routes import router
from ats_resume_builder.config.settings import get_settings
from ats_resume_builder.exceptions import AppError
from ats_resume_builder.logging.setup import configure_logging


def create_app() -> FastAPI:
    settings = get_settings()
    configure_logging(settings.log_level)
    app = FastAPI(title=settings.app_name)
    app.include_router(router)

    @app.get("/health", tags=["health"])
    async def health() -> dict[str, str]:
        return {"status": "ok"}

    @app.exception_handler(AppError)
    async def app_error_handler(_: Request, exc: AppError) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": {
                    "code": exc.code,
                    "message": exc.message,
                    "details": exc.details,
                }
            },
        )

    @app.exception_handler(RequestValidationError)
    async def validation_error_handler(_: Request, exc: RequestValidationError) -> JSONResponse:
        status_code = (
            422 if any(error["loc"][1:2] == ("resume",) for error in exc.errors()) else 400
        )
        return JSONResponse(
            status_code=status_code,
            content={
                "error": {
                    "code": "invalid_resume" if status_code == 422 else "validation_error",
                    "message": "Request validation failed",
                    "details": {"errors": exc.errors()},
                }
            },
        )

    return app
