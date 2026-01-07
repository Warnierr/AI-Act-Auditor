/**
 * Detailed Compliance Checklists by Risk Level
 * Provides actionable items with article references
 */

import { RiskLevel } from "@/types";

export interface ChecklistItem {
    id: string;
    title: string;
    description: string;
    article: string;
    link: string;
    category: string;
    priority: "critical" | "high" | "medium" | "low";
}

const PROHIBITED_CHECKLIST: ChecklistItem[] = [
    {
        id: "proh-1",
        title: "Cease Prohibited Activities Immediately",
        description: "Stop any deployment or development of systems that manipulate behavior, exploit vulnerabilities, perform social scoring, or conduct real-time biometric identification in public spaces",
        article: "Article 5",
        link: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category: "Legal Compliance",
        priority: "critical"
    },
    {
        id: "proh-2",
        title: "Consult Legal Expert Urgently",
        description: "Contact a specialized AI Act lawyer to discuss potential exemptions, transition periods, or system modifications",
        article: "Article 5, 113",
        link: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category: "Legal Compliance",
        priority: "critical"
    },
    {
        id: "proh-3",
        title: "Assess Potential Penalties",
        description: "Understand that prohibited practices can lead to fines up to €35M or 7% of global turnover",
        article: "Article 99",
        link: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category: "Risk Management",
        priority: "critical"
    },
    {
        id: "proh-4",
        title: "Document System Shutdown",
        description: "Create detailed records of when the system was disabled and why, for regulatory compliance",
        article: "Article 72",
        link: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category: "Documentation",
        priority: "high"
    },
];

const HIGH_RISK_CHECKLIST: ChecklistItem[] = [
    {
        id: "high-1",
        title: "Establish Risk Management System",
        description: "Implement continuous risk identification, analysis, estimation, evaluation, and mitigation processes throughout the AI lifecycle",
        article: "Article 9",
        link: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category: "Risk Management",
        priority: "critical"
    },
    {
        id: "high-2",
        title: "Implement Data Governance",
        description: "Ensure training, validation, and testing datasets are relevant, representative, free of errors, and complete",
        article: "Article 10",
        link: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category: "Data Management",
        priority: "critical"
    },
    {
        id: "high-3",
        title: "Prepare Technical Documentation",
        description: "Create comprehensive documentation covering system design, development, testing, and performance",
        article: "Article 11, Annex IV",
        link: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category: "Documentation",
        priority: "critical"
    },
    {
        id: "high-4",
        title: "Implement Automatic Logging",
        description: "Design system to automatically record events, decisions, and interactions for traceability",
        article: "Article 12",
        link: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category: "Technical Compliance",
        priority: "high"
    },
    {
        id: "high-5",
        title: "Ensure Transparency to Users",
        description: "Provide clear, concise instructions for deployers in an appropriate format (user manual)",
        article: "Article 13",
        link: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category: "Transparency",
        priority: "high"
    },
    {
        id: "high-6",
        title: "Enable Human Oversight",
        description: "Design system to be effectively overseen by natural persons, with ability to override, interrupt, or stop",
        article: "Article 14",
        link: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category: "Safety",
        priority: "critical"
    },
    {
        id: "high-7",
        title: "Achieve Appropriate Accuracy",
        description: "Ensure system achieves appropriate levels of accuracy, robustness, and cybersecurity",
        article: "Article 15",
        link: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category: "Technical Compliance",
        priority: "high"
    },
    {
        id: "high-8",
        title: "Establish Quality Management System",
        description: "Implement processes for compliance monitoring, incident handling, and continuous improvement",
        article: "Article 17",
        link: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category: "Quality Management",
        priority: "high"
    },
    {
        id: "high-9",
        title: "Register System in EU Database",
        description: "Register high-risk AI system in the EU database before market placement",
        article: "Article 71",
        link: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category: "Legal Compliance",
        priority: "critical"
    },
    {
        id: "high-10",
        title: "Conduct Conformity Assessment",
        description: "Complete either internal control or third-party assessment depending on Annex III category",
        article: "Article 43",
        link: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category: "Certification",
        priority: "critical"
    },
    {
        id: "high-11",
        title: "Affix CE Marking",
        description: "Apply CE marking once conformity assessment is successful",
        article: "Article 48",
        link: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category: "Certification",
        priority: "high"
    },
    {
        id: "high-12",
        title: "Draft EU Declaration of Conformity",
        description: "Prepare formal declaration that system complies with all AI Act requirements",
        article: "Article 47",
        link: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category: "Certification",
        priority: "high"
    },
    {
        id: "high-13",
        title: "Implement Post-Market Monitoring",
        description: "Establish systematic procedures to monitor system performance in real-world conditions",
        article: "Article 72",
        link: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category: "Monitoring",
        priority: "high"
    },
    {
        id: "high-14",
        title: "Set Up Incident Reporting",
        description: "Create process to report serious incidents and malfunctions to national authorities",
        article: "Article 73",
        link: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category: "Risk Management",
        priority: "critical"
    },
    {
        id: "high-15",
        title: "Appoint EU Authorized Representative",
        description: "If provider is outside EU, designate authorized representative in Member State",
        article: "Article 22",
        link: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category: "Legal Compliance",
        priority: "high"
    },
];

const LIMITED_RISK_CHECKLIST: ChecklistItem[] = [
    {
        id: "lim-1",
        title: "Inform Users About AI Interaction",
        description: "Clearly disclose when users are interacting with an AI system, unless obvious from context",
        article: "Article 50",
        link: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category: "Transparency",
        priority: "high"
    },
    {
        id: "lim-2",
        title: "Label AI-Generated Content",
        description: "Mark synthetic audio, image, video, or text content as artificially generated or manipulated",
        article: "Article 50(2)",
        link: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category: "Transparency",
        priority: "high"
    },
    {
        id: "lim-3",
        title: "Detect Deepfakes",
        description: "If generating deepfakes, ensure they are detectable and labeled appropriately",
        article: "Article 50(4)",
        link: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category: "Safety",
        priority: "critical"
    },
    {
        id: "lim-4",
        title: "Implement GPAI Transparency Requirements",
        description: "For general-purpose AI: publish documentation, copyright compliance, and technical summary",
        article: "Article 53",
        link: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category: "Transparency",
        priority: "high"
    },
    {
        id: "lim-5",
        title: "Consider Voluntary Codes of Conduct",
        description: "Adopt voluntary codes of conduct going beyond minimum transparency obligations",
        article: "Article 95",
        link: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category: "Best Practices",
        priority: "medium"
    },
];

const MINIMAL_RISK_CHECKLIST: ChecklistItem[] = [
    {
        id: "min-1",
        title: "Ensure GDPR Compliance",
        description: "Even minimal-risk AI must comply with GDPR if processing personal data",
        article: "GDPR",
        link: "https://gdpr-info.eu/",
        category: "Data Protection",
        priority: "high"
    },
    {
        id: "min-2",
        title: "Document System Purpose and Design",
        description: "Maintain internal documentation as good practice for future audits or reclassification",
        article: "Best Practice",
        link: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category: "Documentation",
        priority: "medium"
    },
    {
        id: "min-3",
        title: "Monitor for Classification Changes",
        description: "Periodically reassess whether system usage or features could shift it to higher risk category",
        article: "Annex III",
        link: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        category: "Risk Management",
        priority: "medium"
    },
    {
        id: "min-4",
        title: "Adopt Voluntary Standards",
        description: "Consider implementing voluntary AI ethics guidelines and technical standards (e.g., ISO/IEC 42001)",
        article: "Article 96",
        link: "https://www.iso.org/standard/81230.html",
        category: "Best Practices",
        priority: "low"
    },
];

export function getChecklist(riskLevel: RiskLevel | string): ChecklistItem[] {
    const levelStr = riskLevel.toString().toLowerCase();
    
    if (levelStr.includes("prohib") || levelStr.includes("unacceptable")) {
        return PROHIBITED_CHECKLIST;
    } else if (levelStr.includes("high")) {
        return HIGH_RISK_CHECKLIST;
    } else if (levelStr.includes("limited")) {
        return LIMITED_RISK_CHECKLIST;
    } else {
        return MINIMAL_RISK_CHECKLIST;
    }
}

export function getChecklistStats(riskLevel: RiskLevel | string) {
    const checklist = getChecklist(riskLevel);
    
    const categories: Record<string, number> = {};
    checklist.forEach(item => {
        categories[item.category] = (categories[item.category] || 0) + 1;
    });
    
    const criticalCount = checklist.filter(item => item.priority === "critical").length;
    
    return {
        total: checklist.length,
        categories,
        critical: criticalCount
    };
}
