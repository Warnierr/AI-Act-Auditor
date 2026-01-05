"""
AI Advisor Chat Endpoint
Provides LLM-powered advice with RAG for EU AI Act compliance
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from core.advisor import get_ai_advice

router = APIRouter()


class ChatRequest(BaseModel):
    question: str
    system_data: dict
    risk_level: str
    language: Optional[str] = "en"


class ChatResponse(BaseModel):
    answer: str
    sources: list[str]
    model: str


@router.post("/ask", response_model=ChatResponse)
async def ask_advisor(request: ChatRequest):
    """
    Ask the AI Act advisor a question with context from your audit
    
    This endpoint uses Claude 3.5 Sonnet with RAG (Retrieval-Augmented Generation)
    to provide accurate, source-based answers about EU AI Act compliance.
    
    The system is privacy-friendly: questions are not stored, and the AI has no memory
    between conversations.
    """
    try:
        result = await get_ai_advice(
            question=request.question,
            system_data=request.system_data,
            risk_level=request.risk_level,
            language=request.language
        )
        
        return ChatResponse(
            answer=result["answer"],
            sources=result["sources"],
            model=result["model"]
        )
        
    except ValueError as e:
        # API key not configured
        raise HTTPException(
            status_code=503,
            detail=f"AI Advisor not configured: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting AI advice: {str(e)}"
        )


@router.get("/health")
async def advisor_health():
    """Check if the advisor service is operational"""
    import os
    has_key = bool(os.getenv("ANTHROPIC_API_KEY"))
    
    return {
        "status": "configured" if has_key else "not_configured",
        "model": "claude-3.5-sonnet",
        "provider": "Anthropic"
    }
