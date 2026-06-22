import os
from html import escape
from pathlib import Path
from uuid import uuid4

from markdown import markdown
from weasyprint import HTML

from src.core.config import get_settings

ATS_SAFE_CSS = """
@page {
    size: A4;
    margin: 0.7in;
}

body {
    font-family: Arial, sans-serif;
    font-size: 11pt;
    color: #111;
    line-height: 1.45;
}

h1 {
    font-size: 18pt;
    text-align: center;
}

h2 {
    font-size: 13pt;
    border-bottom: 1px solid #222;
    padding-bottom: 3px;
}

a {
    color: inherit;
    text-decoration: none;
}
"""


class PDFGenerationError(Exception):
    """Raised when PDF rendering fails."""


def configure_weasyprint() -> None:
    for directory in get_settings().weasyprint_dll_directories:
        path = Path(directory)
        if path.exists():
            os.add_dll_directory(str(path))


def build_html(markdown_text: str) -> str:
    settings = get_settings()
    if len(markdown_text) > settings.max_markdown_chars:
        raise PDFGenerationError("PDF content is too large")

    escaped_markdown = escape(markdown_text, quote=False)
    html_body = markdown(escaped_markdown, extensions=["extra", "sane_lists"])

    return f"""
    <!doctype html>
    <html>
        <head>
            <meta charset="utf-8">
            <style>{ATS_SAFE_CSS}</style>
        </head>
        <body>
            {html_body}
        </body>
    </html>
    """


def generate_pdf_to_file(markdown_text: str, output_dir: str | None = None) -> Path:
    try:
        configure_weasyprint()
        html = build_html(markdown_text)

        output_path = Path(output_dir or get_settings().generated_pdf_dir)
        output_path.mkdir(parents=True, exist_ok=True)

        file_path = output_path / f"{uuid4()}.pdf"
        HTML(string=html).write_pdf(str(file_path))
    except Exception as exc:
        raise PDFGenerationError(f"PDF generation failed: {exc}") from exc

    return file_path
