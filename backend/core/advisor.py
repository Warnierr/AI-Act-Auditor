"""
AI Act Advisor Service - LLM-powered advisory with RAG
Uses Claude via OpenRouter (OpenAI-compatible API)
"""

import os
import re
from openai import OpenAI
from core.articles_db import get_relevant_context, search_articles

# Initialize OpenAI client (for OpenRouter)
client = None

def get_openai_client():
    """Get or create OpenAI client configured for OpenRouter"""
    global client
    if client is None:
        openrouter_key = os.getenv("OPENROUTER_API_KEY")
        
        if openrouter_key:
            client = OpenAI(
                api_key=openrouter_key,
                base_url="https://openrouter.ai/api/v1"
            )
            print("✓ Using OpenRouter for AI Advisor")
        else:
            # Fallback to direct Anthropic (if ANTHROPIC_API_KEY is set)
            anthropic_key = os.getenv("ANTHROPIC_API_KEY")
            if anthropic_key:
                # Use Anthropic directly via their SDK
                from anthropic import Anthropic
                client = Anthropic(api_key=anthropic_key)
                print("✓ Using Anthropic Direct for AI Advisor")
            else:
                raise ValueError("Neither OPENROUTER_API_KEY nor ANTHROPIC_API_KEY is set in environment")
    
    return client


def anonymize_system_data(system_data: dict) -> dict:
    """
    Anonymize system data for privacy (RGPD compliant)
    Remove company/product names, keep only technical details
    """
    return {
        "domain": system_data.get('domain', 'Unknown'),
        "intended_purpose": system_data.get('intended_purpose', 'Not specified'),
        "deployment_phase": system_data.get('deployment_phase', 'Unknown'),
        "risk_categories": {
            "biometrics": system_data.get('biometrics', False),
            "infrastructure": system_data.get('infrastructure', False),
            "education": system_data.get('education', False),
            "employment": system_data.get('employment', False),
            "services": system_data.get('services', False),
            "law_enforcement": system_data.get('law_enforcement', False),
            "migration": system_data.get('migration', False),
            "justice": system_data.get('justice', False),
            "is_gen_ai": system_data.get('is_gen_ai', False),
        }
    }


async def get_ai_advice(
    question: str,
    system_data: dict,
    risk_level: str,
    language: str = "en"
) -> dict:
    """
    Get AI-powered advice using Claude with RAG
    
    Args:
        question: User's question
        system_data: The AI system's assessment data (will be anonymized)
        risk_level: Assessed risk level
        language: 'en' or 'fr'
    
    Returns:
        dict with 'answer' and 'sources'
    """
    
    # Anonymize data for privacy
    anon_data = anonymize_system_data(system_data)
    
    # Get relevant articles based on risk level
    context = get_relevant_context(risk_level, [])
    
    # Build system prompt avec nuances et disclaimers
    disclaimers = {
        "fr": """
⚠️ IMPORTANT - Disclaimers légaux:
- Cet outil fournit une ÉVALUATION PRÉLIMINAIRE, pas un conseil juridique
- Les réponses sont basées sur l'AI Act mais ne remplacent PAS un avocat spécialisé
- L'évaluation automatique peut manquer de nuances dans des cas complexes
- Pour une conformité certifiée, consultez un expert juridique
- Aucune garantie n'est fournie quant à l'exactitude absolue
""",
        "en": """
⚠️ IMPORTANT - Legal Disclaimers:
- This tool provides a PRELIMINARY ASSESSMENT, not legal advice
- Answers are based on the AI Act but do NOT replace a specialized lawyer
- Automated assessment may lack nuance in complex cases
- For certified compliance, consult a legal expert
- No guarantee is provided regarding absolute accuracy
"""
    }
    
    system_prompt = f"""You are an expert AI Act compliance advisor. You help organizations understand and comply with the EU AI Act (Regulation 2024/1689).

{disclaimers.get(language, disclaimers['en'])}

CRITICAL: You must be NUANCED and STRICTER in your analysis. Many edge cases exist:
- LinkedIn scraping for HR purposes = HIGH RISK (employment category, Annex III)
- Automated recruitment tools = HIGH RISK
- Emotion detection in any context = Often HIGH RISK or PROHIBITED
- Biometric categorization = Often PROHIBITED unless specific exceptions
- Credit scoring = HIGH RISK (essential private services)

When in doubt, err on the side of HIGHER risk classification and recommend expert consultation.

You have access to the official text of the EU AI Act. When answering questions:
1. Base your answers on the actual regulation text provided in the context
2. Be specific and cite article numbers when relevant
3. Provide actionable, practical guidance
4. ALWAYS mention if the initial classification might be too lenient
5. Suggest potential risks the user might have overlooked
6. If you don't know something, say so clearly
7. Answer in {"French" if language == "fr" else "English"}

Context from EU AI Act:
{context}

System being assessed (ANONYMIZED - no company/product names):
- Domain: {anon_data.get('domain', 'Unknown')}
- Purpose: {anon_data.get('intended_purpose', 'Not specified')}
- Current Risk Assessment: {risk_level}
- Selected Categories: {', '.join([k for k, v in anon_data.get('risk_categories', {}).items() if v])}

Your role: Provide nuanced, critical analysis. Question the initial assessment if needed. Be helpful but rigorous.
"""

    try:
        openai_client = get_openai_client()
        
        # Check if we're using OpenAI SDK (OpenRouter) or Anthropic SDK
        if isinstance(openai_client, OpenAI):
            # OpenRouter via OpenAI SDK
            response = openai_client.chat.completions.create(
                model="anthropic/claude-3.5-sonnet",  # OpenRouter model name
                max_tokens=2000,
                temperature=0.2,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": question}
                ],
                extra_headers={
                    "HTTP-Referer": "https://ai-act-auditor.vercel.app",
                    "X-Title": "AI Act Auditor"
                }
            )
            answer = response.choices[0].message.content
        else:
            # Anthropic SDK directly
            message = openai_client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=2000,
                temperature=0.2,
                system=system_prompt,
                messages=[
                    {"role": "user", "content": question}
                ]
            )
            answer = message.content[0].text
        
        # Extract article references from the answer
        article_refs = re.findall(r'Article (\d+)', answer)
        sources = list(set(article_refs))  # Remove duplicates
        
        return {
            "answer": answer,
            "sources": sources,
            "model": "claude-3.5-sonnet"
        }
        
    except Exception as e:
        error_msg = "Je ne peux pas répondre pour le moment. Erreur technique." if language == "fr" else "I cannot answer right now. Technical error."
        return {
            "answer": f"{error_msg}\n\nError: {str(e)}",
            "sources": [],
            "model": "error"
        }


async def get_compliance_checklist_explanation(
    obligation: str,
    system_data: dict,
    language: str = "en"
) -> str:
    """
    Get detailed explanation for a specific compliance obligation
    """
    
    question = f"Can you explain in detail what '{obligation}' means and how to implement it for my AI system?"
    result = await get_ai_advice(question, system_data, system_data.get('risk_level', 'Unknown'), language)
    return result['answer']
