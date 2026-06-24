"""
Authentication Service.

Handles user authentication, registration, and JWT token management.
"""

import uuid
from datetime import datetime, timedelta, timezone

import bcrypt
from jose import jwt
from jose.exceptions import ExpiredSignatureError, JWTError

from src.core.config import settings
from src.core.logging import get_logger
from src.models.mock_db import find_user_by_username, save_user

logger = get_logger(__name__)


class AuthService:
    def __init__(self):
        self.secret_key = settings.SECRET_KEY
        self.algorithm = settings.JWT_ALGORITHM
        self.expire_minutes = settings.ACCESS_TOKEN_EXPIRE_MINUTES
        logger.debug("AuthService initialized")

    def _truncate_password(self, password: str) -> str:
        if len(password.encode("utf-8")) > 72:
            logger.warning(f"Password truncated from {len(password)} to 72 bytes")
            return password[:72]
        return password

    def hash_password(self, password: str) -> str:
        truncated = self._truncate_password(password)
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(truncated.encode("utf-8"), salt)
        return hashed.decode("utf-8")

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        truncated = self._truncate_password(plain_password)
        try:
            return bcrypt.checkpw(truncated.encode("utf-8"), hashed_password.encode("utf-8"))
        except ValueError:
            return False

    def create_access_token(self, user_id: str, username: str) -> str:
        expire = datetime.now(timezone.utc) + timedelta(minutes=self.expire_minutes)
        payload = {
            "sub": user_id,
            "username": username,
            "exp": expire,
            "iat": datetime.now(timezone.utc),
        }
        token = jwt.encode(payload, self.secret_key, algorithm=self.algorithm)
        logger.debug(f"Created access token for user: {username}")
        return token

    def verify_token(self, token: str) -> dict | None:
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return {
                "user_id": payload.get("sub"),
                "username": payload.get("username"),
            }
        except ExpiredSignatureError:
            logger.warning("Token expired")
            return None
        except JWTError as e:
            logger.warning(f"Invalid token: {e}")
            return None

    def login(self, username: str, password: str) -> dict | None:
        user = find_user_by_username(username)

        if not user:
            logger.warning(f"Login failed: User not found - {username}")
            return None

        if not self.verify_password(password, user.get("password", "")):
            logger.warning(f"Login failed: Invalid password for {username}")
            return None

        access_token = self.create_access_token(user["id"], user["username"])

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user["id"],
                "username": user["username"],
                "email": user.get("email"),
                "full_name": user.get("full_name"),
            },
        }

    def register(self, data: dict) -> dict:
        if find_user_by_username(data["username"]):
            raise ValueError("Username already exists")

        data["password"] = self.hash_password(data["password"])
        data["id"] = str(uuid.uuid4())
        data["created_at"] = datetime.now(timezone.utc).isoformat()

        save_user(data)
        logger.info(f"User registered: {data['username']}")

        return {
            "id": data["id"],
            "username": data["username"],
            "email": data.get("email"),
            "full_name": data.get("full_name"),
            "created_at": data["created_at"],
            "message": "User registered successfully",
        }
