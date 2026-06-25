"""
Authentication Routes.

POST /auth/login      — Login and get access token
POST /auth/register   — Register a new user
"""

from fastapi import APIRouter, HTTPException, status

from src.schemas.auth import LoginRequest, LoginResponse, UserCreate, UserResponse
from src.services.auth_service import AuthService

router = APIRouter()
service = AuthService()


@router.post("/login", response_model=LoginResponse)
def login(data: LoginRequest):
    result = service.login(data.username, data.password)

    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    return result


@router.post("/register", response_model=UserResponse)
def register(data: UserCreate):
    try:
        result = service.register(data.model_dump())
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}",
        )
