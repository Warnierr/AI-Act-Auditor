import yaml
import os
from typing import List, Dict
from backend.core.models import AISystemInput, AnalysisResult, RiskLevel, MatchedRule

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

        # 1. Check Prohibited Practices
        prohibited_keywords = ["social scoring", "subliminal", "manipulative", "exploit vulnerabilities"]
        for kw in prohibited_keywords:
            if kw in text_corpus:
                return AnalysisResult(
                    risk_level=RiskLevel.UNACCEPTABLE,
                    risk_score=1.0,
                    justification=[t["prohibited_justification"].format(kw=kw)],
                    matched_rules=[MatchedRule(rule_id="ART_5", category="Prohibited" if lang=="en" else "Prohibé", reason=f"Keyword match: {kw}", reference="Article 5")],
                    obligations=t["obligations"][RiskLevel.UNACCEPTABLE],
                    next_steps=t["next_steps"][RiskLevel.UNACCEPTABLE]
                )

        # 2. Check High-Risk (Annex III)
        for rule in RuleEngine._annex_iii_rules:
            for kw in rule.get("keywords", []):
                if kw in text_corpus:
                    matched_rules.append(MatchedRule(
                        rule_id=rule['id'],
                        category=rule['category'],
                        reason=f"Detected match: {kw}" if lang=="en" else f"Correspondance détectée : {kw}",
                        reference=rule['article_ref']
                    ))

        if system.is_biometric:
            matched_rules.append(MatchedRule(rule_id="MANUAL_BIO", category="Biometrics", reason="User flagged biometrics", reference="Annex III, 1"))
        if system.is_critical_infrastructure:
            matched_rules.append(MatchedRule(rule_id="MANUAL_CRIT", category="Critical Infrastructure", reason="User flagged critical infrastructure", reference="Annex III, 2"))
        if system.is_safety_component:
            matched_rules.append(MatchedRule(rule_id="MANUAL_SAFE", category="Safety", reason="User flagged safety component", reference="Annex II"))

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

        # 4. Final results
        if risk_level == RiskLevel.MINIMAL:
            justification.append(t["minimal_justification"])

        return AnalysisResult(
            risk_level=risk_level,
            risk_score=1.0 if risk_level in [RiskLevel.UNACCEPTABLE, RiskLevel.HIGH] else 0.5,
            justification=justification,
            matched_rules=matched_rules,
            obligations=t["obligations"][risk_level],
            next_steps=t["next_steps"][risk_level]
        )
