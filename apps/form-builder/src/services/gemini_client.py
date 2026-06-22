from google import genai

from src.services.exceptions import GeminiError


class GeminiClient:
    def __init__(self, api_key: str):
        if not api_key:
            raise ValueError("API key is required for GeminiClient")

        self.api_key = api_key

    def generate(self, model: str, prompt: str) -> str:
        try:
            client = genai.Client(api_key=self.api_key)
            response = client.models.generate_content(
                model=model,
                contents=[
                    {
                        "role": "user",
                        "parts": [{"text": prompt}],
                    }
                ],
            )
        except Exception as exc:  # pragma: no cover
            raise GeminiError(str(exc)) from exc

        text = getattr(response, "text", None)
        if not text:
            raise GeminiError("Empty response from Gemini API")

        return text
