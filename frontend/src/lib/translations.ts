export type Locale = "en" | "fr";

export const translations = {
    en: {
        common: {
            startAudit: "Start Free Audit",
            learnMore: "Learn More",
            readyFor: "Ready for EU AI Act 2026",
            back: "Back",
            next: "Next Section",
            runAudit: "Run Complete Audit",
            analyzing: "Analyzing...",
            home: "Home",
            features: "Features",
            openSource: "Open Source",
            privacyNote: "Your responses are processed client-side. No sensitive data is stored.",
            confidence: "Confidence Score",
            riskLevel: "Risk Level",
            legalJustification: "Legal Justification",
            complianceChecklist: "Compliance Checklist",
            systemProfile: "System Profile",
            editData: "Edit Data",
            exportPdf: "Export PDF",
            generating: "Generating...",
            needPremium: "Need a full Compliance Audit?",
            requestPremium: "Request Premium Audit",
            disclaimer: "Disclaimer: This report is for informational purposes only and does not constitute legal advice. Compliance with the EU AI Act (Regulation 2024/1689) requires comprehensive legal and technical review.",
        },
        hero: {
            title: "Audit your AI for",
            titleAccent: "EU Compliance",
            subtitle: "Open source tool for SMEs and startups to assess compliance with the EU AI Act. Get a detailed risk report in minutes.",
        },
        features: {
            deterministic: {
                title: "Deterministic Logic",
                desc: "Built on strict Annex III rules. No AI hallucinations for legal classification."
            },
            reports: {
                title: "PDF Reports",
                desc: "Export professional compliance summaries ready for stakeholders and investors."
            },
            checklists: {
                title: "Actionable Checklist",
                desc: "Get a custom list of obligations based on your system's risk level."
            }
        },
        wizard: {
            step1Title: "Project Details",
            step2Title: "Risk Assessment",
            step3Title: "Review",
            identity: "System Identity",
            identityDesc: "Tell us about the AI system you are building or deploying.",
            productName: "Product Name",
            productPlaceholder: "e.g. RecruitAI, HeartScan, etc.",
            overview: "Overview",
            overviewPlaceholder: "Briefly describe how it works and what data it processes...",
            purpose: "Intended Purpose",
            purposePlaceholder: "What is the objective? Who is the intended user?",
            domain: "Operational Domain",
            domainPlaceholder: "e.g. HR, Health, Finance, Law Enforcement",
            domainDesc: "Domains like HR, Healthcare, or Infrastructure are highly regulated under Annex III.",
            drivers: "Domain & Sensitivity",
            driversDesc: "We need to identify if your system falls into regulated categories.",
            biometric: "Biometric Identification",
            biometricDesc: "Recognition, categorization, or emotion detection based on physical traits.",
            infrastructure: "Critical Infrastructure",
            infrastructureDesc: "Management of traffic, water, electricity, or other vital services.",
            safety: "Safety Component",
            safetyDesc: "Your AI is integrated as a safety feature in a physical product.",
            readyAnalyze: "Ready to Analyze",
            reviewDesc: "Confirm your details before running the compliance engine.",
        }
    },
    fr: {
        common: {
            startAudit: "Lancer l'Audit Gratuit",
            learnMore: "En savoir plus",
            readyFor: "Prêt pour l'EU AI Act 2026",
            back: "Retour",
            next: "Section Suivante",
            runAudit: "Lancer l'Audit Complet",
            analyzing: "Analyse en cours...",
            home: "Accueil",
            features: "Fonctionnalités",
            openSource: "Open Source",
            privacyNote: "Vos réponses sont traitées localement. Aucune donnée sensible n'est stockée.",
            confidence: "Indice de Confiance",
            riskLevel: "Niveau de Risque",
            legalJustification: "Justification Juridique",
            complianceChecklist: "Checklist de Conformité",
            systemProfile: "Profil du Système",
            editData: "Modifier les données",
            exportPdf: "Exporter en PDF",
            generating: "Génération...",
            needPremium: "Besoin d'un Audit de Conformité complet ?",
            requestPremium: "Demander un Audit Premium",
            disclaimer: "Avertissement : Ce rapport est fourni à titre informatif uniquement et ne constitue pas un conseil juridique. La conformité à l'IA Act de l'UE (Règlement 2024/1689) nécessite un examen juridique et technique complet.",
        },
        hero: {
            title: "Auditez votre IA pour la",
            titleAccent: "Conformité Européenne",
            subtitle: "Outil open source pour les PME et startups pour évaluer la conformité à l'IA Act de l'UE. Obtenez un rapport de risque détaillé en quelques minutes.",
        },
        features: {
            deterministic: {
                title: "Logique Déterministe",
                desc: "Basé sur les règles strictes de l'Annexe III. Pas d'hallucinations d'IA pour la classification juridique."
            },
            reports: {
                title: "Rapports PDF",
                desc: "Exportez des résumés de conformité professionnels prêts pour vos investisseurs."
            },
            checklists: {
                title: "Checklist Actionnable",
                desc: "Obtenez une liste personnalisée d'obligations basée sur le niveau de risque de votre système."
            }
        },
        wizard: {
            step1Title: "Détails du Projet",
            step2Title: "Évaluation des Risques",
            step3Title: "Révision",
            identity: "Identité du Système",
            identityDesc: "Parlez-nous du système d'IA que vous développez ou déployez.",
            productName: "Nom du Produit",
            productPlaceholder: "ex: RecruitAI, HeartScan, etc.",
            overview: "Aperçu",
            overviewPlaceholder: "Décrivez brièvement comment cela fonctionne et quelles données sont traitées...",
            purpose: "Finalité Prévue",
            purposePlaceholder: "Quel est l'objectif ? Qui est l'utilisateur final ?",
            domain: "Domaine Opérationnel",
            domainPlaceholder: "ex: RH, Santé, Finance, Police",
            domainDesc: "Les domaines comme les RH, la Santé ou les Infrastructures sont fortement régulés par l'Annexe III.",
            drivers: "Domaine & Sensibilité",
            driversDesc: "Nous devons identifier si votre système entre dans des catégories régulées.",
            biometric: "Identification Biométrique",
            biometricDesc: "Reconnaissance, catégorisation ou détection d'émotions basée sur des traits physiques.",
            infrastructure: "Infrastructures Critiques",
            infrastructureDesc: "Gestion du trafic, de l'eau, de l'électricité ou d'autres services vitaux.",
            safety: "Composant de Sécurité",
            safetyDesc: "Votre IA est intégrée comme fonction de sécurité dans un produit physique.",
            readyAnalyze: "Prêt à Analyser",
            reviewDesc: "Confirmez vos informations avant de lancer le moteur de conformité.",
        }
    }
};
