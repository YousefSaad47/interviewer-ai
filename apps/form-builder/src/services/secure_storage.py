import os
import uuid

from src.services.encryption_service import EncryptionService


class SecureStorageService:
    def __init__(self):

        self.encryptor = EncryptionService()

    def save(self, file):

        storage_dir = "secure_storage"

        os.makedirs(storage_dir, exist_ok=True)

        file_id = str(uuid.uuid4())

        path = os.path.join(storage_dir, f"{file_id}.enc")

        content = file.file.read()

        encrypted_content = self.encryptor.encrypt(content)

        with open(path, "wb") as buffer:
            buffer.write(encrypted_content)

        return {"file_id": file_id, "path": path, "original_name": file.filename}
