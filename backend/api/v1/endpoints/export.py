from fastapi import APIRouter, HTTPException, Response
from core.models import AISystemInput, AnalysisResult
from core.reporting import PDFGenerator
from core.rules import RuleEngine
from core.logging import get_logger
from core.exceptions import PDFGenerationError, TemplateNotFoundError
from pydantic import BaseModel
import re

logger = get_logger(__name__)

class ExportRequest(BaseModel):
    system: AISystemInput
    # In a real app we might re-run analysis or pass the result. 
    # For fail-safety, let's re-run analysis to ensure data consistency or accept result.
    # To keep payload small, let's accept just system input and re-calculate.

router = APIRouter()

def sanitize_filename(name: str) -> str:
    """Sanitize filename to remove invalid characters"""
    # Remove or replace invalid filename characters
    sanitized = re.sub(r'[<>:"/\\|?*]', '_', name)
    # Limit length
    return sanitized[:100]

@router.post("/pdf")
async def export_pdf(system: AISystemInput):
    """
    Generate a PDF report for the given system configuration.
    """
    try:
        logger.info(f"PDF generation requested for system: {system.name}")
        
        # Re-run strict analysis to ensure validity
        result = RuleEngine.classify(system)
        logger.info(f"Classification completed: {result.risk_level}")
        
        generator = PDFGenerator()
        pdf_file = generator.generate_report(system, result)
        
        # Sanitize filename
        safe_name = sanitize_filename(system.name)
        filename = f"AI_Act_Audit_{safe_name}.pdf"
        
        headers = {
            'Content-Disposition': f'attachment; filename="{filename}"',
            'Content-Type': 'application/pdf'
        }
        
        pdf_content = pdf_file.getvalue()
        logger.info(f"PDF generated successfully, size: {len(pdf_content)} bytes")
        
        return Response(content=pdf_content, media_type="application/pdf", headers=headers)
    except (PDFGenerationError, TemplateNotFoundError) as e:
        logger.error(f"PDF generation failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500, 
            detail=f"PDF generation failed: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error during PDF generation: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500, 
            detail=f"An unexpected error occurred: {str(e)}. Please check the server logs for more details."
        )
