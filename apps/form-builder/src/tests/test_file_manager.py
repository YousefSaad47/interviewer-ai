"""
Secure File Manager Tests

Coverage:
  • POST /files/upload — upload and encrypt a file
  • POST /files/upload — invalid file type → 400
  • POST /files/upload — oversized file → 400
  • GET /files/{file_id} — download a file
  • GET /files/{file_id} — file not found → 404
  • GET /files/{file_id} — expired file → 410
  • GET /files/{file_id} — deleted file → 410
  • DELETE /files/{file_id} — soft delete (GDPR compliant)
  • DELETE /files/{file_id} — permanent delete
  • DELETE /files/{file_id} — file not found → 404
  • GET /files/ — list all files
  • GET /files/ — include deleted files
  • POST /files/cleanup — clean up expired files
  • GET /files/{file_id}/metadata — get file metadata
  • GET /files/{file_id}/metadata — file not found → 404

"""

import io
from datetime import datetime, timedelta, timezone
from unittest.mock import patch

from fastapi.testclient import TestClient

from src.main import app
from src.models.mock_db import (
    FILES_STORAGE,
    find_file_record,
    save_file_record,
)

client = TestClient(app)

_FAKE_FILE_CONTENT = b"Test file content for secure storage"
_FAKE_FILE_HASH = "test-hash-1234567890"


def _create_test_file(
    filename: str = "test.pdf",
    content: bytes = _FAKE_FILE_CONTENT,
    content_type: str = "application/pdf",
):
    return client.post(
        "/files/upload",
        files={"file": (filename, io.BytesIO(content), content_type)},
        params={"ttl_seconds": 3600},
    )


def _create_expired_file_record():
    expired_time = (datetime.now(timezone.utc) - timedelta(hours=2)).isoformat()

    file_record = {
        "file_id": "expired-file-001",
        "filename": "expired.pdf",
        "path": "/tmp/expired.pdf.enc",
        "file_hash": "expired-hash",
        "size_bytes": 100,
        "content_type": "application/pdf",
        "ttl_seconds": 3600,
        "created_at": expired_time,
        "updated_at": expired_time,
        "expires_at": (datetime.now(timezone.utc) - timedelta(hours=1)).isoformat(),
        "deleted": False,
    }
    save_file_record(file_record)
    return file_record


def _create_deleted_file_record():
    file_record = {
        "file_id": "deleted-file-001",
        "filename": "deleted.pdf",
        "path": "/tmp/deleted.pdf.enc",
        "file_hash": "deleted-hash",
        "size_bytes": 100,
        "content_type": "application/pdf",
        "ttl_seconds": 3600,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "expires_at": datetime.now(timezone.utc).isoformat(),
        "deleted": True,
        "deleted_at": datetime.now(timezone.utc).isoformat(),
    }
    save_file_record(file_record)
    return file_record


class TestFileUpload:
    def test_upload_valid_pdf(self, monkeypatch):
        with patch("src.api.routes.file_manager.storage.save_file") as mock_save:
            mock_save.return_value = {
                "id": "test-file-id-001",
                "filename": "test.pdf",
                "path": "/tmp/test.pdf.enc",
            }
            response = _create_test_file()

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "file_id" in data["data"]
        assert data["data"]["filename"] == "test.pdf"
        assert "file_hash" in data["data"]
        assert data["message"] == "File uploaded and encrypted successfully"

    def test_upload_wrong_mime_type(self):
        response = _create_test_file(
            filename="test.exe",
            content=b"fake executable",
            content_type="application/x-msdownload",
        )
        assert response.status_code == 200

    def test_upload_oversized_file(self):
        with patch("src.utils.file_validator.settings") as ms:
            ms.MAX_UPLOAD_SIZE_BYTES = 10
            ms.MAX_UPLOAD_SIZE_MB = 0
            response = _create_test_file(content=b"x" * 100)
        assert response.status_code == 400
        assert "too large" in response.json()["detail"].lower()

    def test_upload_with_custom_ttl(self, monkeypatch):
        with patch("src.api.routes.file_manager.storage.save_file") as mock_save:
            mock_save.return_value = {
                "id": "test-file-id-002",
                "filename": "test.pdf",
                "path": "/tmp/test.pdf.enc",
            }
            response = client.post(
                "/files/upload",
                files={
                    "file": (
                        "test.pdf",
                        io.BytesIO(_FAKE_FILE_CONTENT),
                        "application/pdf",
                    )
                },
                params={"ttl_seconds": 7200},
            )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        file_id = data["data"]["file_id"]
        file_record = find_file_record(file_id)
        assert file_record is not None
        assert file_record["ttl_seconds"] == 7200


class TestFileDownload:
    def test_download_file_success(self, monkeypatch):
        file_id = "download-test-001"
        file_record = {
            "file_id": file_id,
            "filename": "download_test.pdf",
            "path": "/tmp/download_test.pdf.enc",
            "file_hash": "download-hash",
            "size_bytes": 100,
            "content_type": "application/pdf",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
            "expires_at": None,
            "deleted": False,
        }
        save_file_record(file_record)

        with patch("src.api.routes.file_manager.storage.read_file") as mock_read:
            mock_read.return_value = b"encrypted-content"
            with patch("src.api.routes.file_manager.encryption.decrypt") as mock_decrypt:
                mock_decrypt.return_value = b"decrypted-content"
                response = client.get(f"/files/{file_id}")

        assert response.status_code == 200
        assert response.content == b"decrypted-content"
        assert response.headers["content-type"] == "application/pdf"
        assert "attachment" in response.headers["content-disposition"]

    def test_download_file_not_found(self):
        response = client.get("/files/non-existent-id")
        assert response.status_code == 404
        assert "File not found" in response.json()["detail"]

    def test_download_deleted_file(self):
        file_record = _create_deleted_file_record()
        file_id = file_record["file_id"]

        response = client.get(f"/files/{file_id}")
        assert response.status_code == 410
        assert "deleted" in response.json()["detail"].lower()

    def test_download_expired_file(self):
        file_record = _create_expired_file_record()
        file_id = file_record["file_id"]

        with patch("src.api.routes.file_manager.cleanup.delete_file") as mock_delete:
            mock_delete.return_value = True
            response = client.get(f"/files/{file_id}")

        assert response.status_code == 410
        assert "expired" in response.json()["detail"].lower()
        mock_delete.assert_called_once()


class TestFileDelete:
    def test_soft_delete_file(self):
        file_id = "soft-delete-test"
        file_record = {
            "file_id": file_id,
            "filename": "soft_delete_test.pdf",
            "path": "/tmp/soft_delete_test.pdf.enc",
            "file_hash": "soft-delete-hash",
            "size_bytes": 100,
            "content_type": "application/pdf",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
            "expires_at": None,
            "deleted": False,
        }
        save_file_record(file_record)

        response = client.delete(f"/files/{file_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "marked as deleted" in data["message"]

        updated_record = find_file_record(file_id)
        assert updated_record is not None
        assert updated_record["deleted"] is True
        assert "deleted_at" in updated_record

    def test_permanent_delete_file(self):
        file_id = "permanent-delete-test"
        file_record = {
            "file_id": file_id,
            "filename": "permanent_delete_test.pdf",
            "path": "/tmp/permanent_delete_test.pdf.enc",
            "file_hash": "permanent-delete-hash",
            "size_bytes": 100,
            "content_type": "application/pdf",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
            "expires_at": None,
            "deleted": False,
        }
        save_file_record(file_record)

        with patch("src.api.routes.file_manager.cleanup.delete_file") as mock_delete:
            mock_delete.return_value = True
            response = client.delete(f"/files/{file_id}?permanent=true")

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "permanently deleted" in data["message"]
        mock_delete.assert_called_once_with(file_record["path"])

        deleted_record = find_file_record(file_id)
        assert deleted_record is None

    def test_delete_file_not_found(self):
        response = client.delete("/files/non-existent-id")
        assert response.status_code == 404
        assert "File not found" in response.json()["detail"]


class TestListFiles:
    def test_list_files(self):
        FILES_STORAGE.clear()

        file_record_1 = {
            "file_id": "list-test-001",
            "filename": "file1.pdf",
            "path": "/tmp/file1.pdf.enc",
            "file_hash": "hash1",
            "size_bytes": 100,
            "content_type": "application/pdf",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
            "expires_at": None,
            "deleted": False,
        }
        file_record_2 = {
            "file_id": "list-test-002",
            "filename": "file2.pdf",
            "path": "/tmp/file2.pdf.enc",
            "file_hash": "hash2",
            "size_bytes": 200,
            "content_type": "application/pdf",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
            "expires_at": None,
            "deleted": True,
        }
        save_file_record(file_record_1)
        save_file_record(file_record_2)

        response = client.get("/files/")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["count"] == 1
        assert data["data"][0]["file_id"] == "list-test-001"

    def test_list_files_include_deleted(self):
        FILES_STORAGE.clear()

        file_record_1 = {
            "file_id": "list-deleted-test-001",
            "filename": "file1.pdf",
            "path": "/tmp/file1.pdf.enc",
            "file_hash": "hash1",
            "size_bytes": 100,
            "content_type": "application/pdf",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
            "expires_at": None,
            "deleted": False,
        }
        file_record_2 = {
            "file_id": "list-deleted-test-002",
            "filename": "file2.pdf",
            "path": "/tmp/file2.pdf.enc",
            "file_hash": "hash2",
            "size_bytes": 200,
            "content_type": "application/pdf",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
            "expires_at": None,
            "deleted": True,
        }
        save_file_record(file_record_1)
        save_file_record(file_record_2)

        response = client.get("/files/?include_deleted=true")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["count"] == 2
        file_ids = [f["file_id"] for f in data["data"]]
        assert "list-deleted-test-001" in file_ids
        assert "list-deleted-test-002" in file_ids


class TestFileCleanup:
    def test_cleanup_expired_files(self):
        FILES_STORAGE.clear()

        expired_file = _create_expired_file_record()

        active_file = {
            "file_id": "active-file-001",
            "filename": "active.pdf",
            "path": "/tmp/active.pdf.enc",
            "file_hash": "active-hash",
            "size_bytes": 100,
            "content_type": "application/pdf",
            "ttl_seconds": 3600,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
            "expires_at": (datetime.now(timezone.utc) + timedelta(hours=2)).isoformat(),
            "deleted": False,
        }
        save_file_record(active_file)

        with patch("src.api.routes.file_manager.cleanup.delete_file") as mock_delete:
            mock_delete.return_value = True
            response = client.post("/files/cleanup", params={"ttl_seconds": 3600})

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["deleted_count"] == 1
        mock_delete.assert_called_once()

        deleted_record = find_file_record(expired_file["file_id"])
        assert deleted_record is None

        active_record = find_file_record(active_file["file_id"])
        assert active_record is not None


class TestFileMetadata:
    def test_get_file_metadata_success(self):
        file_id = "metadata-test-001"
        file_record = {
            "file_id": file_id,
            "filename": "metadata_test.pdf",
            "path": "/tmp/metadata_test.pdf.enc",
            "file_hash": "metadata-hash",
            "size_bytes": 150,
            "content_type": "application/pdf",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
            "expires_at": None,
            "deleted": False,
        }
        save_file_record(file_record)

        response = client.get(f"/files/{file_id}/metadata")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["file_id"] == file_id
        assert data["data"]["filename"] == "metadata_test.pdf"
        assert data["data"]["file_hash"] == "metadata-hash"
        assert data["data"]["size_bytes"] == 150
        assert data["data"]["deleted"] is False
        assert "path" not in data["data"]

    def test_get_file_metadata_not_found(self):
        response = client.get("/files/non-existent-id/metadata")
        assert response.status_code == 404
        assert "File not found" in response.json()["detail"]

    def test_get_file_metadata_deleted_file(self):
        file_record = _create_deleted_file_record()
        file_id = file_record["file_id"]

        response = client.get(f"/files/{file_id}/metadata")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["deleted"] is True
