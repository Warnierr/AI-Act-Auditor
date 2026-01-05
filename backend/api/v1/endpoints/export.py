from fastapi import APIRouter, HTTPException, Response
from core.models import AISystemInput, AnalysisResult
from core.reporting import PDFGenerator
from core.rules import RuleEngine
from pydantic import BaseModel

class ExportRequest(BaseModel):
    system: AISystemInput
    # In a real app we might re-run analysis or pass the result. 
    # For fail-safety, let's re-run analysis to ensure data consistency or accept result.
    # To keep payload small, let's accept just system input and re-calculate.

router = APIRouter()

@router.post("/pdf")
async def export_pdf(system: AISystemInput):
    """
    Generate a PDF report for the given system configuration.
    """
    try:
        # Re-run strict analysis to ensure validity
        result = RuleEngine.classify(system)
        
        generator = PDFGenerator()
        pdf_file = generator.generate_report(system, result)
        
        headers = {
            'Content-Disposition': f'attachment; filename="AI_Act_Audit_{system.name.replace(" ", "_")}.pdf"'
        }
        
        return Response(content=pdf_file.getvalue(), media_type="application/pdf", headers=headers)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
