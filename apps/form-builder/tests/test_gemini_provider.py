import httpx
import pytest
from pydantic import SecretStr

from ats_resume_builder.config.settings import Settings
from ats_resume_builder.exceptions import AIProviderError
from ats_resume_builder.providers.gemini import GeminiProvider


@pytest.mark.asyncio
async def test_gemini_provider_retries_transient_status_and_uses_header_key() -> None:
    requests: list[httpx.Request] = []

    def handler(request: httpx.Request) -> httpx.Response:
        requests.append(request)
        if len(requests) == 1:
            return httpx.Response(503, request=request, json={"error": "busy"})
        return httpx.Response(
            200,
            request=request,
            json={"candidates": [{"content": {"parts": [{"text": '{"skills": []}'}]}}]},
        )

    settings = Settings(gemini_api_key=SecretStr("test-key"), ai_retry_limit=1)
    async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
        provider = GeminiProvider(settings, client)

        result = await provider.generate_json("prompt", request_id="request-1")

    assert result == '{"skills": []}'
    assert len(requests) == 2
    assert all("key=" not in str(request.url) for request in requests)
    assert all(request.headers["x-goog-api-key"] == "test-key" for request in requests)


@pytest.mark.asyncio
async def test_gemini_provider_does_not_retry_non_transient_status() -> None:
    requests: list[httpx.Request] = []

    def handler(request: httpx.Request) -> httpx.Response:
        requests.append(request)
        return httpx.Response(400, request=request, json={"error": "bad request"})

    settings = Settings(gemini_api_key=SecretStr("test-key"), ai_retry_limit=2)
    async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
        provider = GeminiProvider(settings, client)

        with pytest.raises(AIProviderError):
            await provider.generate_json("prompt", request_id="request-1")

    assert len(requests) == 1
