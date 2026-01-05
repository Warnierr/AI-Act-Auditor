from fastapi import APIRouter
from backend.api.v1.endpoints import assess, export, chat

api_router = APIRouter()
api_router.include_router(assess.router, tags=["assess"])
api_router.include_router(export.router, prefix="/export", tags=["export"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
