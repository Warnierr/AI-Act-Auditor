"""
Test suite for PDF report generation
"""

import pytest
from io import BytesIO
from core.models import AISystemInput, AnalysisResult, RiskLevel, MatchedRule
from core.reporting import PDFGenerator
from core.exceptions import PDFGenerationError, TemplateNotFoundError


class TestPDFGeneration:
    """Test PDF report generation"""
    
    def test_pdf_generation_success(self):
        """Test PDF generation with valid data"""
        system = AISystemInput(
            name="Test System",
            description="A test AI system for compliance assessment",
            intended_purpose="Testing purposes",
            domain="Testing",
            language="en"
        )
        
        result = AnalysisResult(
            risk_level=RiskLevel.HIGH,
            risk_score=0.85,
            justification=["System falls under Annex III"],
            matched_rules=[
                MatchedRule(
                    rule_id="TEST_001",
                    category="Test Category",
                    reason="Test reason",
                    reference="Annex III, 1"
                )
            ],
            obligations=["Test obligation"],
            next_steps=["Test next step"]
        )
        
        generator = PDFGenerator()
        pdf_file = generator.generate_report(system, result)
        
        assert pdf_file is not None
        assert isinstance(pdf_file, BytesIO)
        assert pdf_file.tell() > 0  # PDF should have content
        
        # Verify PDF header (PDF files start with %PDF)
        pdf_content = pdf_file.getvalue()
        assert pdf_content.startswith(b'%PDF')
    
    def test_pdf_generation_with_special_chars(self):
        """Test PDF handles special characters in system name"""
        system = AISystemInput(
            name="Test System <>&\"'",
            description="A test system with special characters: <>&\"'",
            intended_purpose="Testing",
            domain="Testing",
            language="en"
        )
        
        result = AnalysisResult(
            risk_level=RiskLevel.MINIMAL,
            risk_score=0.50,
            justification=["No high risk indicators"],
            matched_rules=[],
            obligations=["General compliance"],
            next_steps=["Continue monitoring"]
        )
        
        generator = PDFGenerator()
        pdf_file = generator.generate_report(system, result)
        
        assert pdf_file is not None
        pdf_content = pdf_file.getvalue()
        assert len(pdf_content) > 0
    
    def test_pdf_professional_template(self):
        """Test professional template rendering"""
        system = AISystemInput(
            name="Professional Test",
            description="Professional system description",
            intended_purpose="Professional purpose",
            domain="Professional",
            language="en"
        )
        
        result = AnalysisResult(
            risk_level=RiskLevel.HIGH,
            risk_score=0.90,
            justification=["High risk classification"],
            matched_rules=[],
            obligations=["Multiple obligations"],
            next_steps=["Immediate actions"]
        )
        
        generator = PDFGenerator()
        pdf_file = generator.generate_report(system, result, professional=True)
        
        assert pdf_file is not None
        pdf_content = pdf_file.getvalue()
        assert len(pdf_content) > 1000  # Professional template should be substantial
    
    def test_pdf_with_empty_result(self):
        """Test PDF generation with minimal result data"""
        system = AISystemInput(
            name="Minimal System",
            description="Minimal description",
            intended_purpose="Minimal purpose",
            domain="Minimal",
            language="en"
        )
        
        result = AnalysisResult(
            risk_level=RiskLevel.MINIMAL,
            risk_score=0.50,
            justification=[],
            matched_rules=[],
            obligations=[],
            next_steps=[]
        )
        
        generator = PDFGenerator()
        pdf_file = generator.generate_report(system, result)
        
        assert pdf_file is not None
        pdf_content = pdf_file.getvalue()
        assert len(pdf_content) > 0


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
