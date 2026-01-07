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
    @classmethod
    def load_use_cases(cls) -> Dict:
        yaml_path = os.path.join(os.path.dirname(__file__), "data", "use_cases.yaml")
        try:
            with open(yaml_path, 'r', encoding='utf-8') as f:
                return yaml.safe_load(f)
        except Exception as e:
            print(f"Error loading use cases: {e}")
            return {}

    @staticmethod
    def classify(system: AISystemInput) -> AnalysisResult:
        use_cases_data = RuleEngine.load_use_cases()
        lang = system.language if system.language in TRANSLATIONS else "en"
        t = TRANSLATIONS[lang]
        
        justification = []
        matched_rules = []
        risk_level = RiskLevel.MINIMAL
        
        text_corpus = (system.description + " " + system.intended_purpose + " " + (system.domain or "")).lower()

        # 0. Check Article 6(1) triggers (Products covered by Annex I legislation)
        ARTICLE_6_PATTERNS = {
            "medical_device": ["medical device", "dispositif médical", "ivdr", "mdr 2017/745", "ce marking medical", "diagnostic aid", "aide au diagnostic"],
            "safety_component": ["safety component", "composant de sécurité", "embedded safety"],
            "machinery": ["machinery safety", "sécurité des machines", "industrial robot"],
        }
        for category, kws in ARTICLE_6_PATTERNS.items():
            for kw in kws:
                if kw in text_corpus:
                    matched_rules.append(MatchedRule(
                        rule_id=f"ART_6_{category.upper()}",
                        category="Article 6(1) - Regulated Product" if lang=="en" else "Article 6(1) - Produit Réglementé",
                        reason=f"Matched: {kw}",
                        reference="Article 6(1) / Annex I"
                    ))
                    break

        # 1. Check Prohibited Practices (Article 5)
        for practice in use_cases_data.get("prohibited_practices", []):
            keywords = practice.get(f"keywords_{lang}", practice.get("keywords_en", []))
            for kw in keywords:
                if kw.lower() in text_corpus:
                    return AnalysisResult(
                        risk_level=RiskLevel.UNACCEPTABLE,
                        risk_score=1.0,
                        justification=[t["prohibited_justification"].format(kw=kw) + f" ({practice['article']})"],
                        matched_rules=[MatchedRule(
                            rule_id=practice['id'], 
                            category="Prohibited Practice" if lang=="en" else "Pratique Interdite", 
                            reason=f"Keyword match: {kw}", 
                            reference=practice['article']
                        )],
                        obligations=t["obligations"][RiskLevel.UNACCEPTABLE],
                        next_steps=t["next_steps"][RiskLevel.UNACCEPTABLE]
                    )

        # 2. Check High-Risk Sectors (Annex III)
        sectors_data = use_cases_data.get("high_risk_sectors", {})
        keyword_matches = []
        
        # Check by keywords in all sectors
        for sector_id, sector_info in sectors_data.items():
            for uc in sector_info.get("use_cases", []):
                for kw in uc.get("keywords", []):
                    if kw.lower() in text_corpus:
                        matched_rules.append(MatchedRule(
                            rule_id=uc['id'],
                            category=sector_info[f'name_{lang}'],
                            reason=f"Detected: {uc[f'name_{lang}']}" if lang=="en" else f"Détecté : {uc[f'name_{lang}']}",
                            reference=sector_info['annex_ref']
                        ))
                        keyword_matches.append(kw)

        # Check explicit sector flags from user
        user_flags_count = 0
        explicit_sector_mapping = {
            "biometrics": ("biometric", "Annex III, 1"),
            "infrastructure": ("critical_infrastructure", "Annex III, 2"),
            "education": ("education", "Annex III, 3"),
            "employment": ("employment", "Annex III, 4"),
            "services": ("public_services", "Annex III, 5"),
            "health_domain": ("health", "Article 6(1) / Annex III, 5.a"),
            "law_enforcement": ("law_enforcement", "Annex III, 6"),
            "migration": ("migration", "Annex III, 7"),
            "justice": ("justice", "Annex III, 8")
        }

        for field, (sector_id, ref) in explicit_sector_mapping.items():
            if getattr(system, field, False):
                sector_info = sectors_data.get(sector_id, {})
                matched_rules.append(MatchedRule(
                    rule_id=f"MANUAL_{sector_id.upper()}", 
                    category=sector_info.get(f'name_{lang}', sector_id.capitalize()), 
                    reason="User-declared sector" if lang=="en" else "Secteur déclaré par l'utilisateur", 
                    reference=ref
                ))
                user_flags_count += 1

        # Check multi-tag sectors
        if hasattr(system, 'sectors') and system.sectors:
            for s_id in system.sectors:
                if s_id in sectors_data:
                    sector_info = sectors_data[s_id]
                    # Avoid duplicates
                    if not any(r.rule_id == f"TAG_{s_id.upper()}" for r in matched_rules):
                        matched_rules.append(MatchedRule(
                            rule_id=f"TAG_{s_id.upper()}",
                            category=sector_info[f'name_{lang}'],
                            reason="Tagged sector" if lang=="en" else "Secteur tagué",
                            reference=sector_info['annex_ref']
                        ))
                        user_flags_count += 1
        
        # Health Domain Specifics (Double-check for Article 6.3 exemption)
        if getattr(system, 'health_domain', False):
            if getattr(system, 'influences_diagnosis', False):
                # We already likely matched MANUAL_HEALTH, but we add more specific detail
                if not any(r.rule_id == "HEALTH_DIAGNOSIS" for r in matched_rules):
                    matched_rules.append(MatchedRule(
                        rule_id="HEALTH_DIAGNOSIS", 
                        category="Health / Medical" if lang=="en" else "Santé / Médical", 
                        reason="Influences diagnosis/treatment" if lang=="en" else "Influence diagnostic/traitement", 
                        reference="Annex III, 5.a / MDR"
                    ))
                    user_flags_count += 1
            elif getattr(system, 'is_administrative_only', False):
                justification.append(
                    "Exemption under Art. 6(3) may apply for purely administrative health tasks." 
                    if lang=="en" else 
                    "L'exemption de l'Art. 6(3) peut s'appliquer pour les tâches administratives de santé."
                )

        # Synthetic Content / Deepfake (Article 50)
        article_50_triggered = False
        if getattr(system, 'generates_synthetic_content', False):
            article_50_triggered = True
            content_desc = ", ".join(system.content_types) if system.content_types else "synthetic content"
            matched_rules.append(MatchedRule(
                rule_id="ART_50_DEEPFAKE", 
                category="Deepfake / Synthetic Content" if lang=="en" else "Deepfake / Contenu Synthétique", 
                reason=f"Generates {content_desc}" if lang=="en" else f"Génère : {content_desc}", 
                reference="Article 50(2-4)"
            ))

        if matched_rules:
            risk_level = RiskLevel.HIGH
            unique_refs = list(set([m.reference for m in matched_rules]))
            justification.append(t["high_risk_justification"].format(refs=', '.join(unique_refs)))

        # 3. Check Limited Risk
        if risk_level == RiskLevel.MINIMAL:
            limited_uc = use_cases_data.get("limited_risk", [])
            for luc in limited_uc:
                for kw in luc.get("keywords", []):
                    if kw.lower() in text_corpus:
                        risk_level = RiskLevel.LIMITED
                        justification.append(t["limited_justification"].format(kw=kw))
                        matched_rules.append(MatchedRule(
                            rule_id=luc['id'], 
                            category="Transparency" if lang=="en" else "Transparence", 
                            reason=f"Match: {kw}", 
                            reference=luc.get('article', 'Article 50')
                        ))
                        break
                if risk_level == RiskLevel.LIMITED: break
        
        if article_50_triggered and risk_level == RiskLevel.MINIMAL:
            risk_level = RiskLevel.LIMITED

        # 4. Check GPAI (General Purpose AI)
        gpai_data = use_cases_data.get("gpai", {})
        is_gpai = False
        
        # Check standard GPAI
        for kw in gpai_data.get("standard", {}).get("keywords", []):
            if kw.lower() in text_corpus:
                is_gpai = True
                break
        for ex in gpai_data.get("standard", {}).get("examples", []):
            if ex.lower() in text_corpus:
                is_gpai = True
                break
                
        if is_gpai:
            # Check Systemic Risk
            is_systemic = False
            for kw in gpai_data.get("systemic_risk", {}).get("keywords", []):
                if kw.lower() in text_corpus:
                    is_systemic = True
                    break
            for ex in gpai_data.get("systemic_risk", {}).get("examples", []):
                if ex.lower() in text_corpus:
                    is_systemic = True
                    break
            
            # Simple FLOPS check in text
            if "10^25" in text_corpus or "10**25" in text_corpus or "flops" in text_corpus:
                is_systemic = True
                
            matched_rules.append(MatchedRule(
                rule_id="GPAI_SYSTEMIC" if is_systemic else "GPAI_STANDARD",
                category="GPAI and Systemic Risk" if lang=="en" else "GPAI et Risque Systémique",
                reason="Systemic Risk Model (>10^25 FLOPS)" if is_systemic else "General Purpose AI Model",
                reference="Article 51" if is_systemic else "Article 53"
            ))
            if risk_level != RiskLevel.UNACCEPTABLE:
                risk_level = RiskLevel.HIGH # GPAI with systemic risk or used in HR contexts

        # 5. Final results
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
