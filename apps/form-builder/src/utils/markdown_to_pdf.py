"""
Markdown -> HTML -> PDF. Used by the "Convert output" step of flow A.
"""

from markdown import markdown
from weasyprint import HTML

from src.core.logging import get_logger

logger = get_logger(__name__)


def convert_markdown_to_pdf(md_text: str, output_path: str) -> str:
    """
    Renders `md_text` to a PDF file at `output_path`.

    Raises RuntimeError on failure so the API layer can return a clean
    error response instead of leaking a weasyprint stack trace.
    """
    try:
        html = markdown(md_text)
        HTML(string=html).write_pdf(output_path)
    except Exception as exc:
        logger.exception("Failed to convert markdown to PDF")
        raise RuntimeError("Could not generate PDF from resume content") from exc

    return output_path
