"""
File validation utilities for uploaded files.

Handles:
  - MIME type validation (PDF only)
  - File size validation
  - Filename sanitization
"""

from typing import Optional

from fastapi import HTTPException, UploadFile, status

from src.core.config import settings


def validate_file(file: UploadFile) -> None:
    """
    Validate file type.

    Args:
        file: The uploaded file to validate

    Raises:
        HTTPException: If file type is not allowed
    """
    if file.content_type not in settings.ALLOWED_UPLOAD_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type '{file.content_type}'. Allowed: {', '.join(settings.ALLOWED_UPLOAD_TYPES)}",
        )


def validate_file_size(content: bytes) -> None:
    """
    Validate file size.

    Args:
        content: The file content as bytes

    Raises:
        HTTPException: If file size exceeds the maximum allowed
    """
    if len(content) > settings.MAX_UPLOAD_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Max size: {settings.MAX_UPLOAD_SIZE_MB}MB",
        )


def validate_file_content(file: UploadFile, content: bytes) -> None:
    """
    Validate both file type and size in one call.

    Args:
        file: The uploaded file to validate
        content: The file content as bytes

    Raises:
        HTTPException: If file type is not allowed or file size exceeds limit
    """
    validate_file_size(content)
    validate_file(file)


def sanitize_filename(filename: Optional[str]) -> str:
    """
    Sanitize filename to prevent path traversal attacks.

    Args:
        filename: The original filename (can be None)

    Returns:
        Sanitized filename or default 'upload.pdf' if empty/None
    """
    if filename is None:
        return "upload.pdf"

    if not filename.strip():
        return "upload.pdf"

    filename = filename.replace("/", "").replace("\\", "").replace("..", "")

    filename = filename.strip()

    return filename or "upload.pdf"
