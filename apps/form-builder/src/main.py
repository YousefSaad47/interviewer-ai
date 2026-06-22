from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from src.core.config import get_settings
from src.core.security import RateLimiter, create_security_middleware
from src.routes.resume import router as resume_router
from src.services.pdf_service import configure_weasyprint

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    configure_weasyprint()
    yield


settings = get_settings()
app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.middleware("http")(
    create_security_middleware(
        RateLimiter(
            max_requests=settings.rate_limit_requests,
            window_seconds=settings.rate_limit_window_seconds,
        ),
        max_request_bytes=settings.max_request_bytes,
    )
)

if settings.allowed_hosts != ["*"]:
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=settings.allowed_hosts)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=settings.allowed_origins != ["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Resume Builder Application"}


app.include_router(resume_router)


def main() -> None:
    import uvicorn

    uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=True)
