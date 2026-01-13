import os
from dotenv import load_dotenv

# Load environment variables from .env for local development
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from core.logging import setup_logging, get_logger
from api.v1 import router as api_router

# Setup logging
log_level = os.getenv("LOG_LEVEL", "INFO")
setup_logging(level=log_level)
logger = get_logger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="AI Act Compliance Auditor API - Powered by Gemini"
)

# Set all CORS enabled origins
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in allowed_origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router.api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    logger.info("Root endpoint accessed")
    return {
        "message": "Welcome to AI Act Auditor API",
        "status": "active",
        "docs": "/docs"
    }
