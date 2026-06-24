"""
Job Service.

Handles CRUD operations for job descriptions.
"""

import uuid
from datetime import datetime, timezone
from typing import Optional

from src.models.mock_db import (
    JOB_DESCRIPTIONS,
    delete_job_description,
    find_job_description,
    update_job_description,
)


class JobService:
    def create_job(self, data: dict) -> dict:
        job = {
            "id": str(uuid.uuid4()),
            "title": data.get("title"),
            "company": data.get("company"),
            "raw_text": data.get("raw_text"),
            "keywords": data.get("keywords", []),
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }

        from src.models.mock_db import save_job_description

        save_job_description(job)
        return job

    def get_jobs(self) -> list:
        return JOB_DESCRIPTIONS

    def get_job(self, job_id: str) -> Optional[dict]:
        return find_job_description(job_id)

    def update_job(self, job_id: str, update_data: dict) -> Optional[dict]:
        job = find_job_description(job_id)

        if not job:
            return None

        for key, value in update_data.items():
            if value is not None:
                job[key] = value

        job["updated_at"] = datetime.now(timezone.utc).isoformat()

        return update_job_description(job_id, job)

    def delete_job(self, job_id: str) -> bool:
        return delete_job_description(job_id)
