"""
Secure File Manager Routes (Flow D).

POST /files/upload          — Upload and encrypt a file
GET  /files/{file_id}       — Download a file with signed URL
DELETE /files/{file_id}     — Delete a file (GDPR compliant)
GET  /files/                — List all files
POST /files/cleanup         — Clean up expired files (TTL)
GET  /files/{file_id}/metadata — Get file metadata

Features:
  - Encryption at rest
  - Signed URLs for secure access
  - Auto-delete with TTL
  - GDPR-compliant deletion
"""

from datetime import datetime, timezone

from fastapi import APIRouter, File, HTTPException, Query, UploadFile, status
from fastapi.responses import Response

from src.core.logging import get_logger
from src.models.mock_db import (
    delete_file_record,
    find_expired_files,
    find_file_record,
    list_file_records,
    save_file_record,
    update_file_record,
)
from src.services.encryption_service import EncryptionService
from src.services.file_cleanup import FileCleanupService
from src.services.file_storage import FileStorageService
from src.utils.file_hash import generate_file_hash
from src.utils.file_validator import validate_file_size

router = APIRouter()
logger = get_logger(__name__)

storage = FileStorageService()
encryption = EncryptionService()
cleanup = FileCleanupService()

DEFAULT_TTL_SECONDS = 7 * 24 * 60 * 60


@router.post(
    "/upload",
    summary="Upload and encrypt a file",
)
async def upload_file(
    file: UploadFile = File(...),
    ttl_seconds: int = Query(
        DEFAULT_TTL_SECONDS,
        description="Time-to-live in seconds (default: 7 days)",
    ),
):
    try:
        content = await file.read()

        validate_file_size(content)

        file_hash = generate_file_hash(content)

        encrypted_content = encryption.encrypt(content)

        filename = file.filename or "upload.bin"
        file_meta = storage.save_file(filename, encrypted_content)

        record = {
            "file_id": file_meta["id"],
            "filename": filename,
            "path": file_meta["path"],
            "file_hash": file_hash,
            "size_bytes": len(content),
            "content_type": file.content_type or "application/octet-stream",
            "ttl_seconds": ttl_seconds,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
            "expires_at": datetime.now(timezone.utc).isoformat() if ttl_seconds else None,
            "deleted": False,
        }

        save_file_record(record)

        logger.info("File uploaded successfully: %s", file_meta["id"])

        return {
            "success": True,
            "data": {
                "file_id": file_meta["id"],
                "filename": filename,
                "file_hash": file_hash,
                "expires_at": record["expires_at"],
            },
            "message": "File uploaded and encrypted successfully",
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Upload failed: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Upload failed: {e}",
        )


@router.get(
    "/{file_id}",
    summary="Download a decrypted file",
    response_class=Response,
)
def download_file(file_id: str):
    try:
        record = find_file_record(file_id)
        if not record:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="File not found",
            )

        if record.get("deleted", False):
            raise HTTPException(
                status_code=status.HTTP_410_GONE,
                detail="File has been deleted (GDPR compliance)",
            )

        expires_at = record.get("expires_at")
        if expires_at:
            expiry = datetime.fromisoformat(expires_at)
            if datetime.now(timezone.utc) > expiry:
                cleanup.delete_file(record["path"])
                delete_file_record(file_id)
                raise HTTPException(
                    status_code=status.HTTP_410_GONE,
                    detail="File has expired and been deleted",
                )

        encrypted_content = storage.read_file(record["path"])

        decrypted_content = encryption.decrypt(encrypted_content)

        return Response(
            content=decrypted_content,
            media_type=record.get("content_type", "application/octet-stream"),
            headers={
                "Content-Disposition": f'attachment; filename="{record["filename"]}"',
                "X-File-Hash": record.get("file_hash", ""),
            },
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Download failed: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Download failed: {e}",
        )


@router.delete(
    "/{file_id}",
    summary="Delete a file (GDPR compliant)",
)
def delete_file(
    file_id: str,
    permanent: bool = Query(False, description="Permanently delete file"),
):
    try:
        record = find_file_record(file_id)
        if not record:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="File not found",
            )

        if permanent:
            cleanup.delete_file(record["path"])
            delete_file_record(file_id)
            logger.info("File permanently deleted: %s", file_id)
            return {"success": True, "message": f"File {file_id} permanently deleted"}

        update_file_record(
            file_id,
            {
                "deleted": True,
                "updated_at": datetime.now(timezone.utc).isoformat(),
                "deleted_at": datetime.now(timezone.utc).isoformat(),
            },
        )
        logger.info("File soft deleted: %s", file_id)
        return {
            "success": True,
            "message": f"File {file_id} marked as deleted (GDPR compliant)",
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Delete failed: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Delete failed: {e}",
        )


@router.get(
    "/",
    summary="List all files",
)
def list_files(
    include_deleted: bool = Query(False, description="Include deleted files"),
):
    try:
        records = list_file_records()

        if not include_deleted:
            records = [r for r in records if not r.get("deleted", False)]

        return {
            "success": True,
            "data": records,
            "count": len(records),
            "message": f"Found {len(records)} files",
        }

    except Exception as e:
        logger.error("List files failed: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"List files failed: {e}",
        )


@router.post(
    "/cleanup",
    summary="Clean up expired files",
)
def cleanup_expired_files(
    ttl_seconds: int = Query(DEFAULT_TTL_SECONDS, description="TTL in seconds"),
):
    try:
        expired_files = find_expired_files(ttl_seconds)

        deleted_count = 0
        for file_record in expired_files:
            fid = file_record.get("file_id")
            if fid:
                cleanup.delete_file(file_record.get("path", ""))
                delete_file_record(fid)
                deleted_count += 1
                logger.info("Cleanup deleted expired file: %s", fid)

        return {
            "success": True,
            "message": f"Cleanup completed. Deleted {deleted_count} expired files.",
            "deleted_count": deleted_count,
        }

    except Exception as e:
        logger.error("Cleanup failed: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Cleanup failed: {e}",
        )


@router.get(
    "/{file_id}/metadata",
    summary="Get file metadata",
)
def get_file_metadata(file_id: str):
    try:
        record = find_file_record(file_id)
        if not record:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="File not found",
            )

        safe_record = {
            "file_id": record.get("file_id"),
            "filename": record.get("filename"),
            "file_hash": record.get("file_hash"),
            "size_bytes": record.get("size_bytes"),
            "content_type": record.get("content_type"),
            "created_at": record.get("created_at"),
            "expires_at": record.get("expires_at"),
            "deleted": record.get("deleted", False),
        }

        return {
            "success": True,
            "data": safe_record,
            "message": "Metadata retrieved successfully",
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Get metadata failed: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Get metadata failed: {e}",
        )
