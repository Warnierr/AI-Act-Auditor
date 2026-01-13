from xhtml2pdf import pisa
from io import BytesIO
from jinja2 import Environment, FileSystemLoader
import os
from datetime import datetime
from core.models import AISystemInput, AnalysisResult
from core.logging import get_logger
from core.exceptions import PDFGenerationError, TemplateNotFoundError

logger = get_logger(__name__)

class PDFGenerator:
    def __init__(self):
        template_dir = os.path.join(os.path.dirname(__file__), 'templates')
        if not os.path.exists(template_dir):
            raise TemplateNotFoundError(f"Template directory not found: {template_dir}")
        self.env = Environment(loader=FileSystemLoader(template_dir))
        logger.info(f"PDFGenerator initialized with template dir: {template_dir}")

    def generate_report(self, system: AISystemInput, result: AnalysisResult, professional: bool = True) -> BytesIO:
        """
        Generate a PDF compliance report
        
        Args:
            system: AI system information
            result: Analysis result
            professional: Use professional template (default: True)
        
        Returns:
            BytesIO: PDF file buffer
        
        Raises:
            FileNotFoundError: If template file not found
            Exception: If PDF generation fails
        """
        try:
            template_name = 'report_professional.html' if professional else 'report.html'
            logger.info(f"Loading template: {template_name}")
            
            template = self.env.get_template(template_name)
            
            # Prepare context with safe defaults
            context = {
                "system": system,
                "result": result,
                "date": datetime.now().strftime("%d %B %Y at %H:%M")
            }
            
            logger.info("Rendering HTML template")
            html_content = template.render(context)
            
            if not html_content or len(html_content) < 100:
                raise Exception("Generated HTML content is too short or empty")
            
            logger.info(f"HTML content generated: {len(html_content)} characters")
            
            # Generate PDF
            pdf_buffer = BytesIO()
            logger.info("Creating PDF from HTML")
            
            pisa_status = pisa.CreatePDF(
                html_content, 
                dest=pdf_buffer,
                encoding='utf-8'
            )
            
            if pisa_status.err:
                error_msg = f"PDF generation failed with {len(pisa_status.err)} errors"
                logger.error(f"{error_msg}: {pisa_status.err}")
                raise PDFGenerationError(f"{error_msg}. First error: {pisa_status.err[0] if pisa_status.err else 'Unknown'}")
            
            pdf_size = pdf_buffer.tell()
            if pdf_size == 0:
                raise PDFGenerationError("Generated PDF is empty")
            
            logger.info(f"PDF generated successfully: {pdf_size} bytes")
            pdf_buffer.seek(0)
            return pdf_buffer
            
        except TemplateNotFoundError:
            raise
        except PDFGenerationError:
            raise
        except Exception as e:
            logger.error(f"PDF generation error: {str(e)}", exc_info=True)
            raise PDFGenerationError(f"PDF generation failed: {str(e)}")
