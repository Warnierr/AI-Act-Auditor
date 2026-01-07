import yaml
import os
from typing import List, Dict
from core.models import AISystemInput, AnalysisResult, RiskLevel, MatchedRule

TRANSLATIONS = {
    "en": {
        "risk_levels": {
            RiskLevel.UNACCEPTABLE: "Prohibited",
            RiskLevel.HIGH: "High Risk",
            RiskLevel.LIMITED: "Limited Risk",
            RiskLevel.MINIMAL: "Minimal Risk"
        },
        "prohibited_justification": "Detected keyword '{kw}' related to prohibited practices (Article 5).",
        "high_risk_justification": "System classified as High Risk due to matches in: {refs}.",
        "limited_justification": "System involves interaction or content generation ('{kw}'). Transparency obligations apply.",
        "minimal_justification": "No specific high-risk or prohibited triggers found.",
        "obligations": {
            RiskLevel.HIGH: [
                "Establish a Risk Management System (Art. 9)",
                "Ensure Data Governance & Quality (Art. 10)",
                "Create Technical Documentation (Art. 11 & Annex IV)",
                "Enable Automatic Record Keeping / Logging (Art. 12)",
                "Ensure Transparency & User Instructions (Art. 13)",
                "Implement Human Oversight measures (Art. 14)",
                "Ensure Accuracy, Robustness & Cybersecurity (Art. 15)"
            ],
            RiskLevel.LIMITED: ["Transparency: Inform natural persons they are interacting with an AI system."],
            RiskLevel.MINIMAL: ["General Product Safety regulations apply.", "Voluntary Code of Conduct recommended."],
            RiskLevel.UNACCEPTABLE: ["Prohibited: Do not put on market."]
        },
        "next_steps": {
            RiskLevel.HIGH: ["Begin FRIA (Fundamental Rights Impact Assessment)", "Prepare Technical Documentation"],
            RiskLevel.LIMITED: ["Implement user notifications in the UI"],
            RiskLevel.MINIMAL: ["Review standard safety compliance"],
            RiskLevel.UNACCEPTABLE: ["Stop development immediately and consult legal counsel."]
        }
    },
    "fr": {
        "risk_levels": {
            RiskLevel.UNACCEPTABLE: "Prohibé",
            RiskLevel.HIGH: "Haut Risque",
            RiskLevel.LIMITED: "Risque Limité",
            RiskLevel.MINIMAL: "Risque Minimal"
        },
        "prohibited_justification": "Mot-clé détecté '{kw}' lié à des pratiques prohibées (Article 5).",
        "high_risk_justification": "Système classé à Haut Risque en raison de correspondances dans : {refs}.",
        "limited_justification": "Le système implique une interaction ou une génération de contenu ('{kw}'). Des obligations de transparence s'appliquent.",
        "minimal_justification": "Aucun déclencheur spécifique de haut risque ou d'interdiction n'a été trouvé.",
        "obligations": {
            RiskLevel.HIGH: [
                "Établir un système de gestion des risques (Art. 9)",
                "Assurer la gouvernance et la qualité des données (Art. 10)",
                "Créer une documentation technique (Art. 11 & Annexe IV)",
                "Permettre la journalisation automatique / enregistrement (Art. 12)",
                "Assurer la transparence et les instructions aux utilisateurs (Art. 13)",
                "Mettre en œuvre des mesures de surveillance humaine (Art. 14)",
                "Assurer la précision, la robustesse et la cybersécurité (Art. 15)"
            ],
            RiskLevel.LIMITED: ["Transparence : Informer les personnes physiques qu'elles interagissent avec un système d'IA."],
            RiskLevel.MINIMAL: ["Les réglementations générales sur la sécurité des produits s'appliquent.", "Code de conduite volontaire recommandé."],
            RiskLevel.UNACCEPTABLE: ["Interdit : Ne pas mettre sur le marché."]
        },
        "next_steps": {
            RiskLevel.HIGH: ["Commencer l'EIDD (Évaluation d'Impact sur les Droits Fondamentaux)", "Préparer la documentation technique"],
            RiskLevel.LIMITED: ["Mettre en œuvre les notifications utilisateur dans l'UI"],
            RiskLevel.MINIMAL: ["Réviser la conformité standard à la sécurité"],
            RiskLevel.UNACCEPTABLE: ["Arrêter immédiatement le développement et consulter un conseiller juridique."]
        }
    }
}

class RuleEngine:
    _annex_iii_rules: List[Dict] = []

    @classmethod
    def load_rules(cls):
        if not cls._annex_iii_rules:
            yaml_path = os.path.join(os.path.dirname(__file__), "data", "annex_iii.yaml")
            try:
                with open(yaml_path, 'r', encoding='utf-8') as f:
                    data = yaml.safe_load(f)
                    cls._annex_iii_rules = data.get("high_risk_systems", [])
            except FileNotFoundError:
                print(f"Warning: Rules file not found at {yaml_path}")

    @staticmethod
    def classify(system: AISystemInput) -> AnalysisResult:
        RuleEngine.load_rules()
        lang = system.language if system.language in TRANSLATIONS else "en"
        t = TRANSLATIONS[lang]
        
        justification = []
        matched_rules = []
        risk_level = RiskLevel.MINIMAL
        
        text_corpus = (system.description + " " + system.intended_purpose + " " + (system.domain or "")).lower()

        # 1. Check Prohibited Practices (Article 5)
        PROHIBITED_PATTERNS = {
            "5.1.a_subliminal": {
                "keywords_en": ["subliminal", "subconscious manipulation", "hidden manipulation", "imperceptible techniques", "subliminal technique"],
                "keywords_fr": ["subliminal", "manipulation subliminale", "manipulation inconsciente", "techniques imperceptibles", "technique subliminale"],
                "confidence": 1.0,
                "article": "Article 5.1.a"
            },
            "5.1.b_vulnerability": {
                "keywords_en": ["exploit vulnerabilities", "vulnerable groups", "children exploitation", "disability exploitation", "economic vulnerability", "exploit vulnerability", "exploiting vulnerable"],
                "keywords_fr": ["exploiter vulnérabilités", "groupes vulnérables", "exploitation enfants", "exploitation handicap", "vulnérabilité économique", "exploiter vulnérabilité", "exploiter personnes vulnérables"],
                "confidence": 1.0,
                "article": "Article 5.1.b"
            },
            "5.1.c_social_scoring": {
                "keywords_en": ["social scoring", "social credit", "citizen scoring", "behavior scoring", "social rating", "trustworthiness score", "reputation system", "citizen score", "social score", "behavior rating"],
                "keywords_fr": ["notation sociale", "crédit social", "score citoyen", "notation comportement", "évaluation sociale", "score fiabilité", "système réputation", "score comportement", "notation citoyenne"],
                "confidence": 1.0,
                "article": "Article 5.1.c"
            },
            "5.1.d_predictive_risk": {
                "keywords_en": ["predictive policing", "crime prediction", "risk profiling", "recidivism prediction", "pre-crime", "predict crime", "criminal risk assessment"],
                "keywords_fr": ["police prédictive", "prédiction crime", "profilage risque", "prédiction récidive", "prédire crime", "évaluation risque criminel"],
                "confidence": 1.0,
                "article": "Article 5.1.d"
            },
            "5_manipulative": {
                "keywords_en": ["manipulative", "manipulation technique", "coercive", "deceptive ai"],
                "keywords_fr": ["manipulatif", "technique manipulation", "coercitif", "ia trompeuse"],
                "confidence": 0.95,
                "article": "Article 5"
            }
        }
        
        # Check prohibited patterns with language-aware keywords
        for pattern_id, pattern in PROHIBITED_PATTERNS.items():
            keywords = pattern[f"keywords_{lang}"] if lang in ["en", "fr"] else pattern["keywords_en"]
            for kw in keywords:
                if kw in text_corpus:
                    article_ref = pattern["article"]
                    return AnalysisResult(
                        risk_level=RiskLevel.UNACCEPTABLE,
                        risk_score=pattern["confidence"],
                        justification=[t["prohibited_justification"].format(kw=kw) + f" ({article_ref})"],
                        matched_rules=[MatchedRule(
                            rule_id=pattern_id, 
                            category="Prohibited Practice" if lang=="en" else "Pratique Interdite", 
                            reason=f"Keyword match: {kw}", 
                            reference=article_ref
                        )],
                        obligations=t["obligations"][RiskLevel.UNACCEPTABLE],
                        next_steps=t["next_steps"][RiskLevel.UNACCEPTABLE]
                    )

        # 2. Check High-Risk (Annex III)
        keyword_matches = []
        for rule in RuleEngine._annex_iii_rules:
            for kw in rule.get("keywords", []):
                if kw in text_corpus:
                    matched_rules.append(MatchedRule(
                        rule_id=rule['id'],
                        category=rule['category'],
                        reason=f"Detected match: {kw}" if lang=="en" else f"Correspondance détectée : {kw}",
                        reference=rule['article_ref']
                    ))
                    keyword_matches.append(kw)

        # Count user-provided flags
        user_flags_count = 0
        if system.is_biometric:
            matched_rules.append(MatchedRule(rule_id="MANUAL_BIO", category="Biometrics", reason="User flagged biometrics" if lang=="en" else "Utilisateur a signalé biométrie", reference="Annex III, 1"))
            user_flags_count += 1
        if system.is_critical_infrastructure:
            matched_rules.append(MatchedRule(rule_id="MANUAL_CRIT", category="Critical Infrastructure", reason="User flagged critical infrastructure" if lang=="en" else "Utilisateur a signalé infrastructure critique", reference="Annex III, 2"))
            user_flags_count += 1
        if system.is_safety_component:
            matched_rules.append(MatchedRule(rule_id="MANUAL_SAFE", category="Safety", reason="User flagged safety component" if lang=="en" else "Utilisateur a signalé composant de sécurité", reference="Annex II"))
            user_flags_count += 1
        
        # Health Domain Classification (Annex III, 5)
        if hasattr(system, 'health_domain') and system.health_domain:
            if hasattr(system, 'influences_diagnosis') and system.influences_diagnosis:
                # Health system that influences diagnosis/treatment = HIGH RISK
                matched_rules.append(MatchedRule(
                    rule_id="HEALTH_DIAGNOSIS", 
                    category="Health / Medical" if lang=="en" else "Santé / Médical", 
                    reason="System influences diagnosis or treatment decisions" if lang=="en" else "Le système influence les décisions de diagnostic ou de traitement", 
                    reference="Annex III, 5.a"
                ))
                user_flags_count += 1
            elif hasattr(system, 'is_administrative_only') and system.is_administrative_only:
                # Purely administrative health task - exemption under Art. 6(3)
                justification.append(
                    "Health system performing purely administrative tasks (ICD-10 coding, scheduling). Article 6(3) exemption may apply if the task is narrow, does not replace human evaluation, and has no direct impact on patient care." 
                    if lang=="en" else 
                    "Système de santé effectuant des tâches purement administratives (codage CIM-10, planification). L'exemption de l'article 6(3) peut s'appliquer si la tâche est étroite, ne remplace pas l'évaluation humaine et n'a pas d'impact direct sur les soins aux patients."
                )
        
        # Synthetic Content / Deepfake Detection (Article 50)
        article_50_triggered = False
        if hasattr(system, 'generates_synthetic_content') and system.generates_synthetic_content:
            article_50_triggered = True
            content_desc = ", ".join(system.content_types) if system.content_types else "synthetic content"
            matched_rules.append(MatchedRule(
                rule_id="ART_50_DEEPFAKE", 
                category="Deepfake / Synthetic Content" if lang=="en" else "Deepfake / Contenu Synthétique", 
                reason=f"Generates realistic {content_desc}" if lang=="en" else f"Génère du contenu réaliste : {content_desc}", 
                reference="Article 50(2-4)"
            ))
            justification.append(
                f"System generates synthetic content ({content_desc}). Article 50 transparency obligations apply: labeling, watermarking, and traceability required."
                if lang=="en" else
                f"Le système génère du contenu synthétique ({content_desc}). Les obligations de transparence de l'article 50 s'appliquent : étiquetage, filigrane et traçabilité requis."
            )
        
        # Check additional context fields if provided
        if hasattr(system, 'user_type') and system.user_type == 'vulnerable_groups':
            keyword_matches.append('vulnerable_groups')
        if hasattr(system, 'affects_rights') and system.affects_rights:
            keyword_matches.append('affects_rights')

        if matched_rules:
            risk_level = RiskLevel.HIGH
            unique_refs = list(set([m.reference for m in matched_rules]))
            justification.append(t["high_risk_justification"].format(refs=', '.join(unique_refs)))

        # 3. Check Limited Risk
        if risk_level == RiskLevel.MINIMAL:
            transparency_keywords = ["chatbot", "deep fake", "emotion recognition", "biometric categorization", "synthetic content"]
            for kw in transparency_keywords:
                if kw in text_corpus:
                    risk_level = RiskLevel.LIMITED
                    justification.append(t["limited_justification"].format(kw=kw))
                    matched_rules.append(MatchedRule(rule_id="ART_50", category="Transparency", reason=f"Keyword match: {kw}", reference="Article 50"))
                    break
        
        # If Article 50 triggered but no other High Risk, ensure Limited Risk minimum
        if article_50_triggered and risk_level == RiskLevel.MINIMAL:
            risk_level = RiskLevel.LIMITED

        # 4. Final results
        if risk_level == RiskLevel.MINIMAL:
            justification.append(t["minimal_justification"])

        # Calculate confidence score based on evidence quality
        def calculate_confidence(risk_level: RiskLevel, matched_rules_count: int, user_flags_count: int, keyword_matches_count: int) -> float:
            if risk_level == RiskLevel.UNACCEPTABLE:
                return 1.0  # Always 100% for prohibited practices
            elif risk_level == RiskLevel.HIGH:
                # High confidence if multiple sources of evidence
                if keyword_matches_count >= 2 and user_flags_count >= 1:
                    return 0.95
                elif keyword_matches_count >= 1 and user_flags_count >= 1:
                    return 0.85
                elif user_flags_count >= 2:
                    return 0.80
                elif user_flags_count >= 1:
                    return 0.75
                else:
                    return 0.70
            elif risk_level == RiskLevel.LIMITED:
                # Medium confidence for transparency obligations
                return 0.70 if matched_rules_count > 0 else 0.60
            else:
                # Low confidence for minimal risk (default)
                return 0.50
        
        confidence_score = calculate_confidence(
            risk_level, 
            len(matched_rules), 
            user_flags_count, 
            len(set(keyword_matches))
        )

        return AnalysisResult(
            risk_level=risk_level,
            risk_score=confidence_score,
            justification=justification,
            matched_rules=matched_rules,
            obligations=t["obligations"][risk_level],
            next_steps=t["next_steps"][risk_level]
        )
