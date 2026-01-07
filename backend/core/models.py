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
    
    # Health domain fields (Annex III, 5)
    health_domain: bool = False
    influences_diagnosis: bool = False
    is_administrative_only: bool = False
    
    # Synthetic content / Deepfake fields (Article 50)
    generates_synthetic_content: bool = False
    content_types: Optional[List[str]] = Field(None, description="Types of synthetic content: image, video, audio, avatar, text")
    
    # Enhanced audit metadata
    user_type: Optional[str] = Field(None, description="Primary user profile (public, professionals, etc.)")
    data_types: Optional[List[str]] = Field(None, description="Types of data processed by the system")
    affects_rights: bool = False
    automation_level: Optional[str] = Field(None, description="Level of automation for decision-making")
    output_type: Optional[str] = Field(None, description="Type of output produced by the AI system")
    additional_context: Optional[str] = Field(None, description="Additional context to help the advisor or reviewer")

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
