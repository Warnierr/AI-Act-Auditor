from typing import List, Union, Optional
from pydantic import AnyHttpUrl, validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Act Auditor"
    API_V1_STR: str = "/api/v1"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = [
        "http://localhost:3000",  # Next.js localhost
        "http://localhost:8000",  # FastAPI localhost
    ]

    # API Keys
    GOOGLE_API_KEY: str = ""
    ANTHROPIC_API_KEY: Optional[str] = None  # Optional - for AI Advisor feature

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "allow"  # Allow extra fields from .env

settings = Settings()
