from xhtml2pdf import pisa
from io import BytesIO
from jinja2 import Environment, FileSystemLoader
import os
from datetime import datetime
from core.models import AISystemInput, AnalysisResult

class PDFGenerator:
    def __init__(self):
        template_dir = os.path.join(os.path.dirname(__file__), 'templates')
        self.env = Environment(loader=FileSystemLoader(template_dir))

    def generate_report(self, system: AISystemInput, result: AnalysisResult, professional: bool = True) -> BytesIO:
        """
        Generate a PDF compliance report
        
        Args:
            system: AI system information
            result: Analysis result
            professional: Use professional template (default: True)
        """
        template_name = 'report_professional.html' if professional else 'report.html'
        template = self.env.get_template(template_name)
        
        # Prepare context
        context = {
            "system": system,
            "result": result,
            "date": datetime.now().strftime("%d %B %Y at %H:%M")
        }
        
        html_content = template.render(context)
        
        # Generate PDF
        pdf_buffer = BytesIO()
        pisa_status = pisa.CreatePDF(html_content, dest=pdf_buffer)
        
        if pisa_status.err:
            raise Exception("PDF Generation Failed")
            
        pdf_buffer.seek(0)
        return pdf_buffer
