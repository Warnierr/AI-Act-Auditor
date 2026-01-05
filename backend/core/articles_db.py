# AI Act Articles Knowledge Base for RAG
# This database contains key excerpts from the EU AI Act for contextual retrieval

ARTICLES_DB = {
    "5": {
        "title": "Prohibited AI practices",
        "summary": "Article 5 lists AI systems that are prohibited in the EU",
        "content": """
        The following artificial intelligence practices shall be prohibited:
        (a) placing on the market, putting into service or using AI systems that deploy subliminal techniques 
        beyond a person's consciousness to materially distort their behavior in a manner that causes harm;
        (b) placing on the market, putting into service or using AI systems that exploit vulnerabilities 
        of specific groups of persons due to their age, disability or social or economic situation;
        (c) placing on the market, putting into service or using AI systems for social scoring;
        (d) placing on the market, putting into service or using 'real-time' remote biometric identification 
        systems in publicly accessible spaces for law enforcement (with limited exceptions).
        """,
        "reference": "Article 5, EU AI Act (Regulation 2024/1689)"
    },
    "6": {
        "title": "Classification rules for high-risk AI systems",
        "summary": "Article 6 defines when an AI system is considered high-risk",
        "content": """
        An AI system shall be considered high-risk where both of the following conditions are fulfilled:
        (a) the AI system is intended to be used as a safety component of a product, or the AI system is itself a product,
        covered by the Union harmonization legislation listed in Annex I;
        (b) the product whose safety component is the AI system is required to undergo a third-party conformity assessment.
        
        Additionally, AI systems referred to in Annex III shall be considered high-risk.
        """,
        "reference": "Article 6, EU AI Act (Regulation 2024/1689)"
    },
    "9": {
        "title": "Risk management system",
        "summary": "Obligations for high-risk AI: establish risk management",
        "content": """
        A risk management system shall be established, implemented, documented and maintained in relation to high-risk AI systems.
        The risk management system shall consist of a continuous iterative process throughout the entire lifecycle,
        requiring regular systematic review and updates. It shall comprise the following steps:
        (a) identification and analysis of known and reasonably foreseeable risks;
        (b) estimation and evaluation of risks that may emerge when the AI system is used as intended;
        (c) evaluation of other risks based on analysis of data gathered from post-market monitoring;
        (d) adoption of appropriate risk management measures.
        """,
        "reference": "Article 9, EU AI Act (Regulation 2024/1689)"
    },
    "10": {
        "title": "Data and data governance",
        "summary": "Requirements for training, validation and testing datasets",
        "content": """
        High-risk AI systems shall be developed on the basis of training, validation and testing data sets that meet quality criteria.
        Training, validation and testing data sets shall be subject to data governance and management practices appropriate for the intended purpose.
        These practices shall concern in particular:
        (a) relevant design choices;
        (b) data collection processes and the origin of data;
        (c) relevant data preparation processing operations (annotation, labeling, cleaning, updating);
        (d) formulation of assumptions, notably with respect to the information that the data are supposed to measure and represent;
        (e) assessment of the availability, quantity and suitability of the data sets;
        (f) examination in view of possible biases.
        """,
        "reference": "Article 10, EU AI Act (Regulation 2024/1689)"
    },
    "11": {
        "title": "Technical documentation",
        "summary": "Requirement to prepare technical documentation",
        "content": """
        Technical documentation for high-risk AI systems shall be drawn up before the system is placed on the market or put into service.
        The documentation shall demonstrate that the AI system complies with the requirements set out in this Section and provide
        authorities with all necessary information to assess compliance. The documentation shall be kept up to date.
        
        The technical documentation shall be drawn up in such a way as to demonstrate compliance with Annex IV
        and contain, at a minimum, the elements set out in that Annex.
        """,
        "reference": "Article 11, EU AI Act (Regulation 2024/1689)"
    },
    "12": {
        "title": "Record-keeping",
        "summary": "Automatic logging of events (logs)",
        "content": """
        High-risk AI systems shall technically allow for the automatic recording of events (logs) over their lifetime.
        Logging capabilities shall ensure a level of traceability of the AI system's functioning proportionate to the system's intended purpose.
        Logging capabilities shall include:
        (a) recording of the period of each use;
        (b) reference database against which input data has been checked;
        (c) input data for which the search has led to a match;
        (d) identification of natural persons involved in verification.
        """,
        "reference": "Article 12, EU AI Act (Regulation 2024/1689)"
    },
    "13": {
        "title": "Transparency and provision of information to users",
        "summary": "Users must be informed about AI usage",
        "content": """
        High-risk AI systems shall be designed and developed to ensure that their operation is sufficiently transparent
        to enable users to interpret the system's output and use it appropriately.
        
        An appropriate type and degree of transparency shall be ensured with a view to achieving compliance with the
        relevant obligations of the provider and user. Instructions for use shall include:
        (a) identity and contact details of the provider;
        (b) characteristics, capabilities and limitations of performance;
        (c) changes to the AI system and its performance which have been pre-determined by the provider;
        (d) human oversight measures;
        (e) expected lifetime and maintenance requirements.
        """,
        "reference": "Article 13, EU AI Act (Regulation 2024/1689)"
    },
    "14": {
        "title": "Human oversight",
        "summary": "High-risk AI must have human oversight mechanisms",
        "content": """
        High-risk AI systems shall be designed and developed in such a way that they can be effectively overseen by natural persons.
        Human oversight shall aim to prevent or minimize risks to health, safety or fundamental rights.
        
        Human oversight shall be ensured through one or more of the following measures:
        (a) identified and built into the system by the provider;
        (b) identified by the provider and built into the system by the user.
        
        Natural persons to whom human oversight is assigned shall have necessary competence, training and authority.
        """,
        "reference": "Article 14, EU AI Act (Regulation 2024/1689)"
    },
    "15": {
        "title": "Accuracy, robustness and cybersecurity",
        "summary": "Technical resilience requirements",
        "content": """
        High-risk AI systems shall be designed and developed to achieve appropriate levels of accuracy, robustness,
        cybersecurity and performance throughout their lifecycle.
        
        Systems shall be resilient against errors, faults, inconsistencies and attempts to manipulate the system,
        including from unauthorized third parties.
        
        Technical solutions to address AI-specific vulnerabilities shall include measures against data poisoning,
        model evasion, model poisoning and adversarial examples.
        """,
        "reference": "Article 15, EU AI Act (Regulation 2024/1689)"
    },
    "50": {
        "title": "Transparency obligations for certain AI systems",
        "summary": "Limited risk AI (e.g., chatbots) must inform users",
        "content": """
        Providers shall ensure that AI systems intended to interact directly with natural persons are designed and developed
        in such a way that they inform natural persons that they are interacting with an AI system, unless obvious from the context.
        
        This includes:
        - Chatbots and conversational agents
        - Emotion recognition systems  
        - Biometric categorization systems
        - AI systems that generate or manipulate content (deepfakes)
        
        For AI-generated content, providers must ensure it is detectable through technical means (e.g., watermarking).
        """,
        "reference": "Article 50, EU AI Act (Regulation 2024/1689)"
    },
    "52": {
        "title": "General purpose AI models",
        "summary": "Obligations for GPAI providers (e.g., LLMs)",
        "content": """
        Providers of general-purpose AI models shall:
        (a) draw up and keep up to date technical documentation including training and testing processes;
        (b) draw up, keep up to date and make available information and documentation to providers of AI systems;
        (c) put in place a policy to comply with Union copyright law;
        (d) publish a sufficiently detailed summary of the content used for training.
        
        For models with systemic risk (e.g., very large models), additional requirements apply including model evaluations,
        adversarial testing, tracking and reporting serious incidents.
        """,
        "reference": "Article 52, EU AI Act (Regulation 2024/1689)"
    }
}

def get_article(article_number: str) -> dict:
    """Retrieve a specific article from the knowledge base"""
    return ARTICLES_DB.get(str(article_number), None)

def search_articles(query: str) -> list:
    """Simple keyword search across all articles"""
    query_lower = query.lower()
    results = []
    
    for article_id, article_data in ARTICLES_DB.items():
        # Search in title, summary, and content
        searchable_text = (
            article_data["title"] + " " + 
            article_data["summary"] + " " + 
            article_data["content"]
        ).lower()
        
        if query_lower in searchable_text:
            results.append({
                "article": article_id,
                **article_data
            })
    
    return results

def get_relevant_context(risk_level: str, categories: list) -> str:
    """Get relevant articles based on assessment results"""
    relevant_articles = []
    
    # Always include fundamental articles
    if risk_level in ["High Risk", "Haut Risque"]:
        relevant_articles.extend(["6", "9", "10", "11", "12", "13", "14", "15"])
    elif risk_level in ["Limited Risk", "Risque Limité"]:
        relevant_articles.append("50")
    elif "Prohibited" in risk_level or "Prohibé" in risk_level:
        relevant_articles.append("5")
    
    # Build context string
    context_parts = []
    for art_id in relevant_articles:
        article = get_article(art_id)
        if article:
            context_parts.append(
                f"Article {art_id}: {article['title']}\n{article['content']}\n"
            )
    
    return "\n---\n".join(context_parts)
