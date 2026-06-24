"""
Orchestrates the four steps of Flow A:
  1. Normalize raw input data
  2. LLM → Markdown resume
  3. Markdown → PDF
  4. Persist record (mock DB for now)
"""

import os
import uuid

from src.core.config import settings
from src.core.logging import get_logger
from src.models.mock_db import save_resume
from src.services.llm_service import LLMService
from src.utils.markdown_to_pdf import convert_markdown_to_pdf
from src.utils.text_cleaner import normalize_resume_data

logger = get_logger(__name__)


class ResumeGeneratorService:
    def __init__(self) -> None:
        self.llm = LLMService()

    def generate(self, data: dict) -> dict:
        full_name = data.get("full_name", "Unknown")
        logger.info("Normalizing resume data for '%s'", full_name)
        normalized = normalize_resume_data(data)

        logger.info("Generating resume Markdown via provider='%s'", settings.LLM_PROVIDER)
        markdown = self.llm.generate_resume_markdown(normalized)

        file_id = str(uuid.uuid4())
        pdf_path = self._pdf_path(file_id)
        logger.info("Converting Markdown → PDF at %s", pdf_path)
        convert_markdown_to_pdf(markdown, pdf_path)

        record = {
            "id": file_id,
            "full_name": full_name,
            "role_target": data.get("role_target", ""),
            "pdf_path": pdf_path,
            "markdown": markdown,
        }
        save_resume(record)
        logger.info("Resume record saved with id=%s", file_id)

        return {
            "resume_id": file_id,
            "pdf_path": pdf_path,
            "markdown": markdown,
        }

    def _pdf_path(self, file_id: str) -> str:
        tmp_dir = (
            settings.TMP_DIR
            if os.path.isabs(settings.TMP_DIR)
            else os.path.join(
                os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
                settings.TMP_DIR,
            )
        )
        os.makedirs(tmp_dir, exist_ok=True)
        return os.path.join(tmp_dir, f"{file_id}.pdf")
