class GeminiError(Exception):
    """Raised when Gemini API generation fails."""


class ResumeGenerationError(Exception):
    """Raised when resume generation fails at a high level."""
