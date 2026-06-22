import time
from collections import defaultdict, deque
from collections.abc import Awaitable, Callable

from fastapi import HTTPException, Request, Response, status


class RateLimiter:
    def __init__(self, max_requests: int, window_seconds: int) -> None:
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self._requests: dict[str, deque[float]] = defaultdict(deque)

    def check(self, client_id: str) -> None:
        now = time.monotonic()
        requests = self._requests[client_id]

        while requests and now - requests[0] > self.window_seconds:
            requests.popleft()

        if len(requests) >= self.max_requests:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests. Please try again later.",
            )

        requests.append(now)


def get_client_id(request: Request) -> str:
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        return forwarded_for.split(",", maxsplit=1)[0].strip()

    if request.client:
        return request.client.host

    return "unknown"


def add_security_headers(response: Response) -> None:
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "no-referrer"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"


def create_security_middleware(
    limiter: RateLimiter,
    max_request_bytes: int,
) -> Callable[[Request, Callable[[Request], Awaitable[Response]]], Awaitable[Response]]:
    async def security_middleware(
        request: Request,
        call_next: Callable[[Request], Awaitable[Response]],
    ) -> Response:
        if request.url.path.startswith("/resume"):
            content_length = request.headers.get("content-length")
            if (
                content_length
                and content_length.isdigit()
                and int(content_length) > max_request_bytes
            ):
                raise HTTPException(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    detail="Request body is too large.",
                )

            limiter.check(get_client_id(request))

        response = await call_next(request)
        add_security_headers(response)
        return response

    return security_middleware
