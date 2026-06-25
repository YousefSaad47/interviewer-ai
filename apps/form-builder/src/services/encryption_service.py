"""
Encryption Service for Secure File Manager (Flow D).

Handles encryption and decryption of files at rest.
Uses Fernet symmetric encryption (AES-128 in CBC mode).
"""

from cryptography.fernet import Fernet

from src.core.config import settings
from src.core.logging import get_logger

logger = get_logger(__name__)


class EncryptionService:
    def __init__(self):
        if settings.FILE_ENCRYPTION_KEY:
            self.key = settings.FILE_ENCRYPTION_KEY.encode()
        else:
            self.key = Fernet.generate_key()
            logger.warning("Using generated encryption key (development mode)")

        self.cipher = Fernet(self.key)
        logger.debug("EncryptionService initialized")

    def encrypt(self, data: bytes) -> bytes:
        if not data:
            return b""

        try:
            encrypted = self.cipher.encrypt(data)
            logger.debug(f"Encrypted {len(data)} bytes")
            return encrypted
        except Exception as e:
            logger.error(f"Encryption failed: {str(e)}")
            raise

    def decrypt(self, encrypted_data: bytes) -> bytes:
        if not encrypted_data:
            return b""

        try:
            decrypted = self.cipher.decrypt(encrypted_data)
            logger.debug(f"Decrypted {len(encrypted_data)} bytes")
            return decrypted
        except Exception as e:
            logger.error(f"Decryption failed: {str(e)}")
            raise

    def rotate_key(self, new_key: bytes) -> None:
        self.key = new_key
        self.cipher = Fernet(new_key)
        logger.info("Encryption key rotated")
