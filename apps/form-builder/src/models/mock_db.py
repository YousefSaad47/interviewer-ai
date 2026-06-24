"""
Mock database backed by local JSON files so records survive server restarts.

Collections:
  - generated_resumes  → Flow A (resume_builder)
  - uploaded_resumes   → Flow B (resume_upload / ATS analysis)
  - job_descriptions   → Flow C (job matching)
  - resume_matches     → Flow C (ATS results)
  - secure_files       → Flow D (Secure File Manager)
  - users              → Auth

Swap the load / save functions for real DB calls (SQLAlchemy, Motor, …)
when you move to production — the rest of the codebase stays unchanged.
"""

import json
import os
import threading
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

import bcrypt

from src.core.config import settings
from src.core.logging import get_logger

logger = get_logger(__name__)


def _resolve_tmp_dir() -> str:
    """
    Mirrors services/resume_generator.py's path resolution: a relative
    TMP_DIR is resolved against the project root, not the current working
    directory — so PDFs (Flow A) and these JSON files always land in the
    same place no matter where `uvicorn` was launched from.
    """
    if os.path.isabs(settings.TMP_DIR):
        return settings.TMP_DIR
    project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    return os.path.join(project_root, settings.TMP_DIR)


_TMP_DIR = _resolve_tmp_dir()

_GENERATED_DB_FILE = os.path.join(_TMP_DIR, "mock_db_generated.json")
_UPLOADED_DB_FILE = os.path.join(_TMP_DIR, "mock_db_uploaded.json")
_JOBS_DB_FILE = os.path.join(_TMP_DIR, "mock_db_jobs.json")
_MATCHES_DB_FILE = os.path.join(_TMP_DIR, "mock_db_matches.json")
_FILES_DB_FILE = os.path.join(_TMP_DIR, "mock_db_files.json")
_USERS_DB_FILE = os.path.join(_TMP_DIR, "mock_db_users.json")

_DB_FILE = _GENERATED_DB_FILE

_generated_lock = threading.Lock()
_uploaded_lock = threading.Lock()
_jobs_lock = threading.Lock()
_matches_lock = threading.Lock()
_files_lock = threading.Lock()
_users_lock = threading.Lock()


def _load(path: str) -> List[Dict[str, Any]]:
    if not os.path.exists(path):
        return []
    try:
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
            if isinstance(data, list):
                return data
            logger.warning("%s has unexpected format — resetting", path)
            return []
    except (json.JSONDecodeError, OSError) as exc:
        logger.error("Could not read %s: %s — starting fresh", path, exc)
        return []


def _save(path: str, records: List[Dict[str, Any]]) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    tmp_path = path + ".tmp"
    try:
        with open(tmp_path, "w", encoding="utf-8") as f:
            json.dump(records, f, ensure_ascii=False, indent=2, default=str)
        os.replace(tmp_path, path)
    except OSError as exc:
        logger.error("Could not persist %s: %s", path, exc)


RESUMES: List[Dict[str, Any]] = _load(_GENERATED_DB_FILE)


def save_resume(record: Dict[str, Any]) -> None:
    with _generated_lock:
        RESUMES.append(record)
        _save(_GENERATED_DB_FILE, RESUMES)
    logger.debug("mock_db: saved generated resume id=%s", record.get("id"))


def find_resume(resume_id: str) -> Optional[Dict[str, Any]]:
    return next((r for r in RESUMES if r.get("id") == resume_id), None)


def list_generated_resumes() -> List[Dict[str, Any]]:
    return list(RESUMES)


def delete_resume(resume_id: str) -> bool:
    with _generated_lock:
        for i, r in enumerate(RESUMES):
            if r.get("id") == resume_id:
                RESUMES.pop(i)
                _save(_GENERATED_DB_FILE, RESUMES)
                return True
    return False


UPLOADED_RESUMES: List[Dict[str, Any]] = _load(_UPLOADED_DB_FILE)


def save_uploaded_resume(record: Dict[str, Any]) -> None:
    with _uploaded_lock:
        UPLOADED_RESUMES.append(record)
        _save(_UPLOADED_DB_FILE, UPLOADED_RESUMES)
    logger.debug("mock_db: saved uploaded resume id=%s", record.get("resume_id"))


def find_uploaded_resume(resume_id: str) -> Optional[Dict[str, Any]]:
    return next((r for r in UPLOADED_RESUMES if r.get("resume_id") == resume_id), None)


def list_uploaded_resumes() -> List[Dict[str, Any]]:
    return list(UPLOADED_RESUMES)


def delete_uploaded_resume(resume_id: str) -> bool:
    with _uploaded_lock:
        for i, r in enumerate(UPLOADED_RESUMES):
            if r.get("resume_id") == resume_id:
                UPLOADED_RESUMES.pop(i)
                _save(_UPLOADED_DB_FILE, UPLOADED_RESUMES)
                return True
    return False


JOB_DESCRIPTIONS: List[Dict[str, Any]] = _load(_JOBS_DB_FILE)


def save_job_description(record: Dict[str, Any]) -> None:
    with _jobs_lock:
        JOB_DESCRIPTIONS.append(record)
        _save(_JOBS_DB_FILE, JOB_DESCRIPTIONS)
    logger.debug("mock_db: saved job description id=%s", record.get("id"))


def find_job_description(job_id: str) -> Optional[Dict[str, Any]]:
    return next((j for j in JOB_DESCRIPTIONS if j.get("id") == job_id), None)


def list_job_descriptions() -> List[Dict[str, Any]]:
    return list(JOB_DESCRIPTIONS)


def update_job_description(job_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    with _jobs_lock:
        for i, job in enumerate(JOB_DESCRIPTIONS):
            if job.get("id") == job_id:
                job.update(update_data)
                _save(_JOBS_DB_FILE, JOB_DESCRIPTIONS)
                return job
    return None


def delete_job_description(job_id: str) -> bool:
    with _jobs_lock:
        for i, job in enumerate(JOB_DESCRIPTIONS):
            if job.get("id") == job_id:
                JOB_DESCRIPTIONS.pop(i)
                _save(_JOBS_DB_FILE, JOB_DESCRIPTIONS)
                return True
    return False


RESUME_MATCHES: List[Dict[str, Any]] = _load(_MATCHES_DB_FILE)


def save_resume_match(record: Dict[str, Any]) -> None:
    with _matches_lock:
        RESUME_MATCHES.append(record)
        _save(_MATCHES_DB_FILE, RESUME_MATCHES)
    logger.debug("mock_db: saved resume match id=%s", record.get("id"))


def find_resume_match(match_id: str) -> Optional[Dict[str, Any]]:
    return next((m for m in RESUME_MATCHES if m.get("id") == match_id), None)


def find_matches_by_resume(resume_id: str) -> List[Dict[str, Any]]:
    return [m for m in RESUME_MATCHES if m.get("resume_id") == resume_id]


def find_matches_by_job(job_id: str) -> List[Dict[str, Any]]:
    return [m for m in RESUME_MATCHES if m.get("job_id") == job_id]


def list_resume_matches() -> List[Dict[str, Any]]:
    return list(RESUME_MATCHES)


def delete_resume_match(match_id: str) -> bool:
    with _matches_lock:
        for i, match in enumerate(RESUME_MATCHES):
            if match.get("id") == match_id:
                RESUME_MATCHES.pop(i)
                _save(_MATCHES_DB_FILE, RESUME_MATCHES)
                return True
    return False


FILES_STORAGE: List[Dict[str, Any]] = _load(_FILES_DB_FILE)


def save_file_record(record: Dict[str, Any]) -> None:
    with _files_lock:
        FILES_STORAGE.append(record)
        _save(_FILES_DB_FILE, FILES_STORAGE)
    logger.debug("mock_db: saved file record id=%s", record.get("file_id"))


def find_file_record(file_id: str) -> Optional[Dict[str, Any]]:
    return next((f for f in FILES_STORAGE if f.get("file_id") == file_id), None)


def list_file_records() -> List[Dict[str, Any]]:
    return list(FILES_STORAGE)


def update_file_record(file_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    with _files_lock:
        for i, file_record in enumerate(FILES_STORAGE):
            if file_record.get("file_id") == file_id:
                file_record.update(update_data)
                _save(_FILES_DB_FILE, FILES_STORAGE)
                return file_record
    return None


def delete_file_record(file_id: str) -> bool:
    with _files_lock:
        for i, file_record in enumerate(FILES_STORAGE):
            if file_record.get("file_id") == file_id:
                FILES_STORAGE.pop(i)
                _save(_FILES_DB_FILE, FILES_STORAGE)
                return True
    return False


def find_expired_files(ttl_seconds: int) -> List[Dict[str, Any]]:
    now = datetime.now(timezone.utc)
    expired = []
    for file_record in FILES_STORAGE:
        created_at = file_record.get("created_at")
        if created_at:
            created = datetime.fromisoformat(created_at)
            age = (now - created).total_seconds()
            if age > ttl_seconds:
                expired.append(file_record)
    return expired


USERS: List[Dict[str, Any]] = _load(_USERS_DB_FILE)


def save_user(record: Dict[str, Any]) -> None:
    with _users_lock:
        USERS.append(record)
        _save(_USERS_DB_FILE, USERS)
    logger.debug("mock_db: saved user id=%s", record.get("id"))


def find_user_by_username(username: str) -> Optional[Dict[str, Any]]:
    return next((u for u in USERS if u.get("username") == username), None)


def find_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
    return next((u for u in USERS if u.get("id") == user_id), None)


def list_users() -> List[Dict[str, Any]]:
    return list(USERS)


def _seed_initial_data() -> None:
    if not JOB_DESCRIPTIONS:
        initial_jobs = [
            {
                "id": "job-1",
                "title": "Backend Developer",
                "company": "Tech Company",
                "raw_text": """
                We need Backend Developer.

                Requirements:
                Python
                FastAPI
                PostgreSQL
                Docker
                REST APIs

                Experience:
                2 years backend development
                """,
                "keywords": [],
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat(),
            },
        ]
        for job in initial_jobs:
            save_job_description(job)
        logger.info("Seeded %d initial job descriptions", len(initial_jobs))

    if not USERS:
        hashed_password = bcrypt.hashpw("123456".encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

        initial_users = [
            {
                "id": "user-1",
                "username": "test",
                "password": hashed_password,
                "email": "test@example.com",
                "full_name": "Test User",
                "created_at": datetime.now(timezone.utc).isoformat(),
            }
        ]
        for user in initial_users:
            save_user(user)
        logger.info("Seeded %d initial users", len(initial_users))


_seed_initial_data()
