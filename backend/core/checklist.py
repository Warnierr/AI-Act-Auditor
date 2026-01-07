"""
Detailed Compliance Checklists by Risk Level
Provides actionable items with article references for each AI Act risk category
"""

from typing import List, Dict
from enum import Enum


class RiskLevel(str, Enum):
    PROHIBITED = "Prohibited"
    HIGH = "High Risk"
    LIMITED = "Limited Risk"
    MINIMAL = "Minimal Risk"


class ChecklistItem:
    def __init__(
        self,
        title: str,
        description: str,
        article: str,
        link: str,
        category: str,
        priority: str = "high"
    ):
        self.title = title
        self.description = description
        self.article = article
        self.link = link
        self.category = category
        self.priority = priority

    def to_dict(self) -> dict:
        return {
            "title": self.title,
            "description": self.description,
            "article": self.article,
            "link": self.link,
            "category": self.category,
            "priority": self.priority
        }


# Prohibited Practices Checklist
PROHIBITED_CHECKLIST = [
    ChecklistItem(
        title="Cease Prohibited Activities Immediately",
        description="Stop any deployment or development of systems that manipulate behavior, exploit vulnerabilities, perform social scoring, or conduct real-time biometric identification in public spaces",
        article="Article 5",
        link="https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category="Legal Compliance",
        priority="critical"
    ),
    ChecklistItem(
        title="Consult Legal Expert Urgently",
        description="Contact a specialized AI Act lawyer to discuss potential exemptions, transition periods, or system modifications",
        article="Article 5, 113",
        link="https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category="Legal Compliance",
        priority="critical"
    ),
    ChecklistItem(
        title="Assess Potential Penalties",
        description="Understand that prohibited practices can lead to fines up to €35M or 7% of global turnover",
        article="Article 99",
        link="https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category="Risk Management",
        priority="critical"
    ),
    ChecklistItem(
        title="Document System Shutdown",
        description="Create detailed records of when the system was disabled and why, for regulatory compliance",
        article="Article 72",
        link="https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category="Documentation",
        priority="high"
    ),
]


# High-Risk Systems Checklist
HIGH_RISK_CHECKLIST = [
    ChecklistItem(
        title="Establish Risk Management System",
        description="Implement continuous risk identification, analysis, estimation, evaluation, and mitigation processes throughout the AI lifecycle",
        article="Article 9",
        link="https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category="Risk Management",
        priority="critical"
    ),
    ChecklistItem(
        title="Implement Data Governance",
        description="Ensure training, validation, and testing datasets are relevant, representative, free of errors, and complete",
        article="Article 10",
        link="https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category="Data Management",
        priority="critical"
    ),
    ChecklistItem(
        title="Prepare Technical Documentation",
        description="Create comprehensive documentation covering system design, development, testing, and performance",
        article="Article 11, Annex IV",
        link="https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category="Documentation",
        priority="critical"
    ),
    ChecklistItem(
        title="Implement Automatic Logging",
        description="Design system to automatically record events, decisions, and interactions for traceability",
        article="Article 12",
        link="https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category="Technical Compliance",
        priority="high"
    ),
    ChecklistItem(
        title="Ensure Transparency to Users",
        description="Provide clear, concise instructions for deployers in an appropriate format (user manual)",
        article="Article 13",
        link="https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category="Transparency",
        priority="high"
    ),
    ChecklistItem(
        title="Enable Human Oversight",
        description="Design system to be effectively overseen by natural persons, with ability to override, interrupt, or stop",
        article="Article 14",
        link="https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category="Safety",
        priority="critical"
    ),
    ChecklistItem(
        title="Achieve Appropriate Accuracy",
        description="Ensure system achieves appropriate levels of accuracy, robustness, and cybersecurity",
        article="Article 15",
        link="https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category="Technical Compliance",
        priority="high"
    ),
    ChecklistItem(
        title="Establish Quality Management System",
        description="Implement processes for compliance monitoring, incident handling, and continuous improvement",
        article="Article 17",
        link="https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category="Quality Management",
        priority="high"
    ),
    ChecklistItem(
        title="Register System in EU Database",
        description="Register high-risk AI system in the EU database before market placement",
        article="Article 71",
        link="https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category="Legal Compliance",
        priority="critical"
    ),
    ChecklistItem(
        title="Conduct Conformity Assessment",
        description="Complete either internal control or third-party assessment depending on Annex III category",
        article="Article 43",
        link="https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category="Certification",
        priority="critical"
    ),
    ChecklistItem(
        title="Affix CE Marking",
        description="Apply CE marking once conformity assessment is successful",
        article="Article 48",
        link="https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category="Certification",
        priority="high"
    ),
    ChecklistItem(
        title="Draft EU Declaration of Conformity",
        description="Prepare formal declaration that system complies with all AI Act requirements",
        article="Article 47",
        link="https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category="Certification",
        priority="high"
    ),
    ChecklistItem(
        title="Implement Post-Market Monitoring",
        description="Establish systematic procedures to monitor system performance in real-world conditions",
        article="Article 72",
        link="https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category="Monitoring",
        priority="high"
    ),
    ChecklistItem(
        title="Set Up Incident Reporting",
        description="Create process to report serious incidents and malfunctions to national authorities",
        article="Article 73",
        link="https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category="Risk Management",
        priority="critical"
    ),
    ChecklistItem(
        title="Appoint EU Authorized Representative",
        description="If provider is outside EU, designate authorized representative in Member State",
        article="Article 22",
        link="https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category="Legal Compliance",
        priority="high"
    ),
]


# Limited Risk Systems Checklist
LIMITED_RISK_CHECKLIST = [
    ChecklistItem(
        title="Inform Users About AI Interaction",
        description="Clearly disclose when users are interacting with an AI system, unless obvious from context",
        article="Article 50",
        link="https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category="Transparency",
        priority="high"
    ),
    ChecklistItem(
        title="Label AI-Generated Content",
        description="Mark synthetic audio, image, video, or text content as artificially generated or manipulated",
        article="Article 50(2)",
        link="https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category="Transparency",
        priority="high"
    ),
    ChecklistItem(
        title="Detect Deepfakes",
        description="If generating deepfakes, ensure they are detectable and labeled appropriately",
        article="Article 50(4)",
        link="https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category="Safety",
        priority="critical"
    ),
    ChecklistItem(
        title="Implement GPAI Transparency Requirements",
        description="For general-purpose AI: publish documentation, copyright compliance, and technical summary",
        article="Article 53",
        link="https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category="Transparency",
        priority="high"
    ),
    ChecklistItem(
        title="Consider Voluntary Codes of Conduct",
        description="Adopt voluntary codes of conduct going beyond minimum transparency obligations",
        article="Article 95",
        link="https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category="Best Practices",
        priority="medium"
    ),
]


# Minimal Risk Systems Checklist
MINIMAL_RISK_CHECKLIST = [
    ChecklistItem(
        title="Ensure GDPR Compliance",
        description="Even minimal-risk AI must comply with GDPR if processing personal data",
        article="GDPR",
        link="https://gdpr-info.eu/",
        category="Data Protection",
        priority="high"
    ),
    ChecklistItem(
        title="Document System Purpose and Design",
        description="Maintain internal documentation as good practice for future audits or reclassification",
        article="Best Practice",
        link="https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category="Documentation",
        priority="medium"
    ),
    ChecklistItem(
        title="Monitor for Classification Changes",
        description="Periodically reassess whether system usage or features could shift it to higher risk category",
        article="Annex III",
        link="https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category="Risk Management",
        priority="medium"
    ),
    ChecklistItem(
        title="Adopt Voluntary Standards",
        description="Consider implementing voluntary AI ethics guidelines and technical standards (e.g., ISO/IEC 42001)",
        article="Article 96",
        link="https://www.iso.org/standard/81230.html",
        category="Best Practices",
        priority="low"
    ),
]


def get_checklist(risk_level: str) -> List[Dict]:
    """
    Get the appropriate checklist for a given risk level
    
    Args:
        risk_level: One of 'Prohibited', 'High Risk', 'Limited Risk', 'Minimal Risk'
    
    Returns:
        List of checklist items as dictionaries
    """
    if "prohib" in risk_level.lower() or "unacceptable" in risk_level.lower():
        checklist = PROHIBITED_CHECKLIST
    elif "high" in risk_level.lower():
        checklist = HIGH_RISK_CHECKLIST
    elif "limited" in risk_level.lower():
        checklist = LIMITED_CHECKLIST
    else:  # Minimal or unknown
        checklist = MINIMAL_RISK_CHECKLIST
    
    return [item.to_dict() for item in checklist]


def get_checklist_summary(risk_level: str) -> Dict:
    """
    Get a summary of the checklist including total items and categories
    """
    checklist = get_checklist(risk_level)
    
    categories = {}
    for item in checklist:
        cat = item["category"]
        categories[cat] = categories.get(cat, 0) + 1
    
    return {
        "total_items": len(checklist),
        "categories": categories,
        "critical_count": sum(1 for item in checklist if item["priority"] == "critical")
    }
