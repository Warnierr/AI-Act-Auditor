"""
Test suite for Article 5 prohibited practices detection and risk classification accuracy
"""

import pytest
from core.models import AISystemInput, RiskLevel
from core.rules import RuleEngine


class TestProhibitedPracticesDetection:
    """Test detection of prohibited practices (Article 5)"""
    
    def test_social_scoring_fr(self):
        """Test detection of social scoring in French"""
        system = AISystemInput(
            name="Système de Notation Sociale",
            description="Système qui évalue et note les citoyens en fonction de leur comportement social",
            intended_purpose="Attribuer un score de fiabilité aux citoyens",
            domain="Services publics",
            language="fr"
        )
        
        result = RuleEngine.classify(system)
        
        assert result.risk_level == RiskLevel.UNACCEPTABLE, f"Expected PROHIBITED but got {result.risk_level}"
        assert result.risk_score == 1.0, f"Expected confidence 1.0 but got {result.risk_score}"
        assert any("notation sociale" in j.lower() or "score citoyen" in j.lower() for j in result.justification)
    
    def test_social_scoring_en(self):
        """Test detection of social scoring in English"""
        system = AISystemInput(
            name="Social Credit System",
            description="AI system that assigns social credit scores to citizens based on their behavior and activities",
            intended_purpose="Evaluate trustworthiness of citizens",
            domain="Public services",
            language="en"
        )
        
        result = RuleEngine.classify(system)
        
        assert result.risk_level == RiskLevel.UNACCEPTABLE
        assert result.risk_score == 1.0
        assert any("social" in j.lower() for j in result.justification)
    
    def test_behavior_scoring(self):
        """Test detection of behavior scoring variant"""
        system = AISystemInput(
            name="Citizen Behavior Rating",
            description="System that monitors and rates citizen behavior to determine access to services",
            intended_purpose="Behavior scoring for service eligibility",
            domain="Government",
            language="en"
        )
        
        result = RuleEngine.classify(system)
        
        assert result.risk_level == RiskLevel.UNACCEPTABLE
        assert result.risk_score >= 0.95
    
    def test_subliminal_manipulation_en(self):
        """Test detection of subliminal manipulation"""
        system = AISystemInput(
            name="Persuasion Engine",
            description="Uses subliminal techniques to influence user purchasing decisions through imperceptible signals",
            intended_purpose="Increase conversion rates",
            domain="Marketing",
            language="en"
        )
        
        result = RuleEngine.classify(system)
        
        assert result.risk_level == RiskLevel.UNACCEPTABLE
        assert result.risk_score >= 0.95
        assert any("subliminal" in j.lower() for j in result.justification)
    
    def test_vulnerability_exploitation(self):
        """Test detection of vulnerability exploitation"""
        system = AISystemInput(
            name="Targeted Ads for Children",
            description="AI that exploits vulnerabilities of children to promote unhealthy products",
            intended_purpose="Maximize ad engagement with vulnerable groups",
            domain="Advertising",
            language="en"
        )
        
        result = RuleEngine.classify(system)
        
        assert result.risk_level == RiskLevel.UNACCEPTABLE
        assert result.risk_score >= 0.95
    
    def test_predictive_policing_fr(self):
        """Test detection of predictive policing (French)"""
        system = AISystemInput(
            name="Police Prédictive",
            description="Système de police prédictive pour identifier les zones à risque criminel",
            intended_purpose="Prédiction de crime et profilage de risque",
            domain="Forces de l'ordre",
            language="fr"
        )
        
        result = RuleEngine.classify(system)
        
        assert result.risk_level == RiskLevel.UNACCEPTABLE
        assert result.risk_score == 1.0


class TestHighRiskDetection:
    """Test detection of high-risk systems (Annex III)"""
    
    def test_facial_recognition_high_risk(self):
        """Test facial recognition is correctly classified as high risk"""
        system = AISystemInput(
            name="FaceRecog Pro",
            description="Real-time facial recognition for public surveillance using biometric identification",
            intended_purpose="Identify individuals in public spaces",
            domain="Security",
            is_biometric=True,
            language="en"
        )
        
        result = RuleEngine.classify(system)
        
        assert result.risk_level == RiskLevel.HIGH
        assert result.risk_score >= 0.85, f"Expected confidence >= 0.85 but got {result.risk_score}"
        assert len(result.matched_rules) >= 1
    
    def test_recruitment_ai_high_risk(self):
        """Test recruitment AI is high risk"""
        system = AISystemInput(
            name="HR AutoSelect",
            description="Automated recruitment system that screens resumes and ranks candidates for hiring",
            intended_purpose="Automate candidate selection and hiring decisions",
            domain="Employment",
            language="en"
        )
        
        result = RuleEngine.classify(system)
        
        assert result.risk_level == RiskLevel.HIGH
        assert result.risk_score >= 0.70
        assert any("employment" in r.category.lower() or "recruitment" in r.reason.lower() for r in result.matched_rules)
    
    def test_education_admission_high_risk(self):
        """Test education admission system is high risk"""
        system = AISystemInput(
            name="University Admission AI",
            description="AI system for student admission and enrollment decisions in educational institutions",
            intended_purpose="Automate university admission process",
            domain="Education",
            language="en"
        )
        
        result = RuleEngine.classify(system)
        
        assert result.risk_level == RiskLevel.HIGH
        assert result.risk_score >= 0.70
    
    def test_high_risk_with_multiple_flags(self):
        """Test high confidence when multiple indicators"""
        system = AISystemInput(
            name="Multi-Risk System",
            description="Biometric facial recognition for employee monitoring and performance evaluation",
            intended_purpose="Monitor and evaluate employees using biometrics",
            domain="Employment",
            is_biometric=True,
            language="en"
        )
        
        result = RuleEngine.classify(system)
        
        assert result.risk_level == RiskLevel.HIGH
        assert result.risk_score >= 0.90, f"Expected high confidence (>=0.90) with multiple matches but got {result.risk_score}"


class TestLimitedRiskDetection:
    """Test detection of limited risk systems (transparency obligations)"""
    
    def test_chatbot_limited_risk(self):
        """Test chatbot is classified as limited risk"""
        system = AISystemInput(
            name="Customer Support Bot",
            description="Customer service chatbot powered by GPT to answer questions",
            intended_purpose="Provide automated customer support",
            domain="Customer Service",
            is_gen_ai=True,
            language="en"
        )
        
        result = RuleEngine.classify(system)
        
        assert result.risk_level == RiskLevel.LIMITED
        assert result.risk_score >= 0.60
        assert any("chatbot" in j.lower() for j in result.justification)
    
    def test_deepfake_limited_risk(self):
        """Test deepfake detection triggers limited risk"""
        system = AISystemInput(
            name="Video Generator",
            description="AI that creates deep fake videos for entertainment",
            intended_purpose="Generate synthetic video content",
            domain="Media",
            language="en"
        )
        
        result = RuleEngine.classify(system)
        
        assert result.risk_level == RiskLevel.LIMITED
        assert result.risk_score >= 0.60


class TestMinimalRiskDetection:
    """Test detection of minimal risk systems"""
    
    def test_spam_filter_minimal_risk(self):
        """Test spam filter is minimal risk"""
        system = AISystemInput(
            name="Email Spam Filter",
            description="AI-powered spam detection for email filtering",
            intended_purpose="Block spam emails",
            domain="Email",
            language="en"
        )
        
        result = RuleEngine.classify(system)
        
        assert result.risk_level == RiskLevel.MINIMAL
        assert result.risk_score == 0.50
    
    def test_recommendation_system_minimal(self):
        """Test product recommendation is minimal risk"""
        system = AISystemInput(
            name="Product Recommender",
            description="AI that suggests products based on browsing history",
            intended_purpose="Recommend relevant products",
            domain="E-commerce",
            language="en"
        )
        
        result = RuleEngine.classify(system)
        
        assert result.risk_level == RiskLevel.MINIMAL
        assert result.risk_score == 0.50


class TestMultilingualDetection:
    """Test multilingual detection works correctly"""
    
    def test_french_keywords_detection(self):
        """Test French keywords are properly detected"""
        system_fr = AISystemInput(
            name="Système RH",
            description="Système de recrutement automatisé pour l'embauche et la sélection de candidats",
            intended_purpose="Automatiser le processus de recrutement",
            domain="Ressources Humaines",
            language="fr"
        )
        
        result = RuleEngine.classify(system_fr)
        
        assert result.risk_level == RiskLevel.HIGH
        assert result.risk_score >= 0.70
    
    def test_mixed_language_fallback(self):
        """Test fallback to English when language not supported"""
        system = AISystemInput(
            name="Sistema de Puntuación",
            description="Social scoring system for citizens",
            intended_purpose="Evaluate citizen behavior",
            domain="Government",
            language="es"  # Spanish not supported, should fallback to EN
        )
        
        result = RuleEngine.classify(system)
        
        assert result.risk_level == RiskLevel.UNACCEPTABLE  # Should still detect "social scoring"


class TestConfidenceScoring:
    """Test confidence score calculation"""
    
    def test_prohibited_has_perfect_confidence(self):
        """Prohibited systems should have 1.0 confidence"""
        system = AISystemInput(
            name="Social Credit",
            description="Citizen social credit scoring system",
            intended_purpose="Rate citizens",
            domain="Government",
            language="en"
        )
        
        result = RuleEngine.classify(system)
        
        assert result.risk_score == 1.0
    
    def test_high_risk_with_flags_has_high_confidence(self):
        """High risk with user flags should have 0.75+ confidence"""
        system = AISystemInput(
            name="Biometric System",
            description="Biometric identification system",
            intended_purpose="Identify people",
            domain="Security",
            is_biometric=True,
            language="en"
        )
        
        result = RuleEngine.classify(system)
        
        assert result.risk_level == RiskLevel.HIGH
        assert result.risk_score >= 0.75
    
    def test_minimal_risk_has_low_confidence(self):
        """Minimal risk should have 0.5 confidence"""
        system = AISystemInput(
            name="Simple Filter",
            description="Content filter for spam",
            intended_purpose="Filter spam",
            domain="Email",
            language="en"
        )
        
        result = RuleEngine.classify(system)
        
        assert result.risk_score == 0.50


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
