"""
Local disk storage for uploaded resumes — Flow B / Secure File Manager.

Files are encrypted at rest with Fernet (AES-128-CBC + HMAC) using
settings.FILE_ENCRYPTION_KEY, satisfying the "encryption, secure storage"
requirement from the Secure File Manager module.
"""

import os
import uuid

from cryptography.fernet import Fernet

from src.core.config import settings
from src.core.logging import get_logger
from src.utils.file_validator import sanitize_filename

logger = get_logger(__name__)

_fernet = Fernet(settings.FILE_ENCRYPTION_KEY.encode())


class FileStorageService:
    def save_file(self, filename: str, content: bytes) -> dict:
        upload_dir = settings.UPLOAD_DIR
        os.makedirs(upload_dir, exist_ok=True)

        safe_filename = sanitize_filename(filename)
        file_id = str(uuid.uuid4())
        path = os.path.join(upload_dir, f"{file_id}_{safe_filename}.enc")

        encrypted = _fernet.encrypt(content)
        with open(path, "wb") as buffer:
            buffer.write(encrypted)

        logger.debug(
            "FileStorageService: wrote encrypted file id=%s path=%s (%d bytes)",
            file_id,
            path,
            len(encrypted),
        )

        return {"id": file_id, "path": path, "filename": safe_filename}

    def read_file(self, path: str) -> bytes:
        with open(path, "rb") as buffer:
            encrypted = buffer.read()
        return _fernet.decrypt(encrypted)
