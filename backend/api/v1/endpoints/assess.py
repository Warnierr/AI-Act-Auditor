from fastapi import APIRouter, HTTPException
from core.models import AISystemInput, AnalysisResult
from core.rules import RuleEngine
from core.logging import get_logger

logger = get_logger(__name__)
router = APIRouter()

@router.post("/assess", response_model=AnalysisResult)
async def assess_system(system: AISystemInput):
    """
    Assess an AI System description and return its Risk Category, Justification, and Obligations.
    This is the primary endpoint for the audit wizard.
    """
    try:
        logger.info(f"Assessment requested for system: {system.name}", extra={
            "system_name": system.name,
            "domain": system.domain,
            "language": system.language
        })
        
        # 1. Deterministic Rule Engine
        result = RuleEngine.classify(system)
        
        logger.info(f"Assessment completed: {result.risk_level} (confidence: {result.risk_score:.2f})", extra={
            "risk_level": result.risk_level,
            "risk_score": result.risk_score,
            "matched_rules_count": len(result.matched_rules)
        })
        
        return result
    except Exception as e:
        logger.error(f"Assessment failed: {str(e)}", exc_info=True, extra={
            "system_name": system.name if system else "unknown"
        })
        raise HTTPException(status_code=500, detail=f"Assessment failed: {str(e)}")
