from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field

class RiskLevel(str, Enum):
    UNACCEPTABLE = "Prohibited"
    HIGH = "High Risk"
    LIMITED = "Limited Risk"
    MINIMAL = "Minimal Risk"

class DeploymentPhase(str, Enum):
    ON_MARKET = "On Market"
    IN_SERVICE = "In Service"
    DEVELOPMENT = "Development"

class AISystemInput(BaseModel):
    name: str = Field(..., description="Name of the AI System")
    description: str = Field(..., description="Detailed description of the AI System")
    intended_purpose: str = Field(..., description="The specific purpose the AI system is intended for")
    domain: Optional[str] = Field(None, description="General domain (e.g., HR, Healthcare)")
    
    # Explicit User Certifications (Checkboxes)
    is_biometric: bool = False
    is_critical_infrastructure: bool = False
    is_safety_component: bool = False
    
    deployment_phase: DeploymentPhase = DeploymentPhase.DEVELOPMENT
    language: str = "en"  # "en" or "fr"

class MatchedRule(BaseModel):
    rule_id: str
    category: str
    reason: str
    reference: str

class AnalysisResult(BaseModel):
    risk_level: RiskLevel
    risk_score: float = Field(0.0, description="Confidence score 0-1")
    justification: List[str]
    matched_rules: List[MatchedRule]
    obligations: List[str]
    next_steps: List[str]
