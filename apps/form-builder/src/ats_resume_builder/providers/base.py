from abc import ABC, abstractmethod


class AIProvider(ABC):
    """Contract implemented by all AI providers."""

    name: str

    @abstractmethod
    async def generate_json(self, prompt: str, *, request_id: str) -> str:
        """Return raw provider text expected to contain JSON."""
