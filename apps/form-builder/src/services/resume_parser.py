"""
Text extraction — Flow B, step 3 ("Resume parsing: text extraction").

PDF only — DOCX support was dropped per product decision (uploads now
only accept application/pdf, see core/config.py).

Works directly on in-memory bytes: the route extracts text from the raw
upload *before* the file is encrypted and written to disk, so this
service never needs to touch the filesystem or decrypt anything.
"""

import io

import pdfplumber

from src.core.logging import get_logger

logger = get_logger(__name__)


class ResumeParserService:
    def extract_text(self, content: bytes) -> str:
        try:
            text = self._extract_pdf(content)
        except Exception:
            logger.exception("Failed to extract text from uploaded PDF")
            return ""

        if not text.strip():
            logger.warning("No extractable text found in PDF (scanned image?)")

        return text

    def _extract_pdf(self, content: bytes) -> str:
        text = ""
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""
        return text
