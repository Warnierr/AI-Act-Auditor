"""
AI Advisor Chat Endpoint
Provides LLM-powered advice with RAG for EU AI Act compliance
"""

import asyncio
import json
import re

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
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


def _tokenize_answer(answer: str) -> list[str]:
    # Keep whitespace separated tokens to preserve formatting
    return re.findall(r'\S+\s*', answer)


@router.post("/stream")
async def stream_advisor(request: ChatRequest):
    """
    Stream AI advice token by token to mimic GPT-like streaming.
    """
    try:
        result = await get_ai_advice(
            question=request.question,
            system_data=request.system_data,
            risk_level=request.risk_level,
            language=request.language
        )

        tokens = _tokenize_answer(result["answer"])

        async def event_generator():
            for token in tokens:
                payload = {"type": "token", "content": token}
                yield f"data: {json.dumps(payload)}\n\n"
                await asyncio.sleep(0)

            done_payload = {
                "type": "done",
                "sources": result["sources"],
                "model": result["model"]
            }
            yield f"data: {json.dumps(done_payload)}\n\n"

        return StreamingResponse(event_generator(), media_type="text/event-stream")

    except ValueError as e:
        raise HTTPException(
            status_code=503,
            detail=f"AI Advisor not configured: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error streaming AI advice: {str(e)}"
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
