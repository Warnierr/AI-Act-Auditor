"""
Custom exceptions for AI Act Auditor
"""

class AIActAuditorException(Exception):
    """Base exception for AI Act Auditor"""
    pass

class ValidationError(AIActAuditorException):
    """Input validation error"""
    pass

class ClassificationError(AIActAuditorException):
    """Classification error"""
    pass

class PDFGenerationError(AIActAuditorException):
    """PDF generation error"""
    pass

class TemplateNotFoundError(AIActAuditorException):
    """Template file not found"""
    pass
