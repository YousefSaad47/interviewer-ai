import asyncio
from collections.abc import Mapping

import httpx

from ats_resume_builder.config.settings import Settings
from ats_resume_builder.exceptions import AIProviderError
from ats_resume_builder.providers.base import AIProvider


class GeminiProvider(AIProvider):
    name = "gemini"
    _retryable_status_codes = frozenset({429, 500, 502, 503, 504})

    def __init__(
        self, settings: Settings, client: httpx.AsyncClient | None = None
    ) -> None:
        self._settings = settings
        self._client = client

    async def generate_json(self, prompt: str, *, request_id: str) -> str:
        if self._settings.gemini_api_key is None:
            msg = "Gemini API key is not configured"
            raise AIProviderError(
                msg, details={"provider": self.name, "request_id": request_id}
            )

        endpoint = (
            f"{self._settings.gemini_base_url}/models/"
            f"{self._settings.gemini_model}:generateContent"
        )
        headers = {"x-goog-api-key": self._settings.gemini_api_key.get_secret_value()}
        payload = {
            "contents": [{"role": "user", "parts": [{"text": prompt}]}],
            "generationConfig": {"responseMimeType": "application/json"},
        }
        timeout = httpx.Timeout(self._settings.ai_timeout_seconds)

        last_error: httpx.HTTPError | None = None
        try:
            if self._client is not None:
                response = await self._post_with_retries(
                    self._client,
                    endpoint,
                    headers=headers,
                    payload=payload,
                    timeout=timeout,
                )
            else:
                async with httpx.AsyncClient() as client:
                    response = await self._post_with_retries(
                        client,
                        endpoint,
                        headers=headers,
                        payload=payload,
                        timeout=timeout,
                    )
        except httpx.HTTPError as exc:
            last_error = exc

        if last_error is not None:
            msg = "AI provider request failed"
            raise AIProviderError(msg, details={"provider": self.name}) from last_error

        data = response.json()
        try:
            return data["candidates"][0]["content"]["parts"][0]["text"]
        except (KeyError, IndexError, TypeError) as exc:
            msg = "AI provider response did not include JSON text"
            raise AIProviderError(msg, details={"provider": self.name}) from exc

    async def _post_with_retries(
        self,
        client: httpx.AsyncClient,
        endpoint: str,
        *,
        headers: dict[str, str],
        payload: Mapping[str, object],
        timeout: httpx.Timeout,
    ) -> httpx.Response:
        last_error: httpx.HTTPError | None = None
        for attempt in range(self._settings.ai_retry_limit + 1):
            try:
                response = await client.post(
                    endpoint, headers=headers, json=payload, timeout=timeout
                )
                response.raise_for_status()
                return response
            except httpx.HTTPStatusError as exc:
                last_error = exc
                if not self._should_retry_status(exc.response.status_code, attempt):
                    raise
            except (httpx.TimeoutException, httpx.TransportError) as exc:
                last_error = exc
                if attempt >= self._settings.ai_retry_limit:
                    raise
            await self._sleep_before_retry(attempt)

        if last_error is not None:
            raise last_error
        msg = "AI provider request failed without a response"
        raise AIProviderError(msg, details={"provider": self.name})

    def _should_retry_status(self, status_code: int, attempt: int) -> bool:
        return (
            status_code in self._retryable_status_codes
            and attempt < self._settings.ai_retry_limit
        )

    async def _sleep_before_retry(self, attempt: int) -> None:
        await asyncio.sleep(min(0.25 * (2**attempt), 2.0))
