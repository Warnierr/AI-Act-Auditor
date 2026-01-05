from fastapi import APIRouter, HTTPException
from core.models import AISystemInput, AnalysisResult
from core.rules import RuleEngine

router = APIRouter()

@router.post("/assess", response_model=AnalysisResult)
async def assess_system(system: AISystemInput):
    """
    Assess an AI System description and return its Risk Category, Justification, and Obligations.
    This is the primary endpoint for the audit wizard.
    """
    try:
        # 1. Deterministic Rule Engine
        result = RuleEngine.classify(system)
        
        return result
    except Exception as e:
        # In production, we would log this error properly
        raise HTTPException(status_code=500, detail=str(e))
