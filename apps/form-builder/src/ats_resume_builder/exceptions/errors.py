from http import HTTPStatus


class AppError(Exception):
    """Base application exception with an HTTP mapping."""

    status_code: int = HTTPStatus.INTERNAL_SERVER_ERROR
    code: str = "internal_error"

    def __init__(
        self, message: str, *, details: dict[str, object] | None = None
    ) -> None:
        super().__init__(message)
        self.message = message
        self.details = details or {}


class InvalidResumeError(AppError):
    status_code = HTTPStatus.UNPROCESSABLE_ENTITY
    code = "invalid_resume"


class AIProviderError(AppError):
    status_code = HTTPStatus.BAD_GATEWAY
    code = "ai_provider_failure"


class InvalidAIResponseError(AppError):
    status_code = HTTPStatus.BAD_GATEWAY
    code = "invalid_ai_response"


class CompilationError(AppError):
    status_code = HTTPStatus.SERVICE_UNAVAILABLE
    code = "compilation_failure"


class PDFCompilationTimeoutError(CompilationError):
    status_code = HTTPStatus.GATEWAY_TIMEOUT
    code = "compilation_timeout"
