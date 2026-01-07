export enum RiskLevel {
    UNACCEPTABLE = "Prohibited",
    HIGH = "High Risk",
    LIMITED = "Limited Risk",
    MINIMAL = "Minimal Risk"
}

export interface AISystemInput {
    name: string;
    description: string;
    intended_purpose: string;
    domain: string;

    // Annex III High-Risk Categories
    is_biometric: boolean;
    is_critical_infrastructure: boolean;
    is_safety_component: boolean;
    biometrics: boolean;          // Remote biometric identification
    infrastructure: boolean;       // Critical infrastructure (energy, water, transport)
    education: boolean;            // Education & vocational training
    employment: boolean;           // Employment, HR, and worker management
    services: boolean;             // Essential public & private services (credit, insurance, emergency)
    law_enforcement: boolean;      // Law enforcement (polygraphs, risk assessment, deepfakes)
    migration: boolean;            // Migration, asylum, and border control
    justice: boolean;              // Justice administration & democratic processes

    // Limited Risk (Transparency obligations)
    is_gen_ai: boolean;            // Generative AI (chatbots, content generation)

    // Health Domain fields (Annex III, 5)
    health_domain?: boolean;       // System operates in health/medical domain
    influences_diagnosis?: boolean; // Influences diagnostic or treatment decisions
    is_administrative_only?: boolean; // Purely administrative tasks (ICD-10, scheduling)

    // Synthetic Content / Deepfake fields (Article 50)
    generates_synthetic_content?: boolean; // Generates realistic images/video/audio/avatars
    content_types?: ("image" | "video" | "audio" | "avatar" | "text")[];

    // NEW: Enhanced audit questions
    user_type?: "general_public" | "professionals" | "vulnerable_groups" | "mixed";
    data_types?: ("personal" | "sensitive" | "biometric" | "financial" | "health" | "none")[];
    affects_rights?: boolean;       // Does it affect fundamental rights?
    automation_level?: "full" | "partial" | "advisory";  // Level of automation in decisions
    output_type?: "recommendations" | "decisions" | "content" | "predictions" | "classifications";

    additional_context?: string;

    deployment_phase: "On Market" | "In Service" | "Development";
    language?: string;
    sectors?: Sector[];
}

export interface MatchedRule {
    rule_id: string;
    category: string;
    reason: string;
    reference: string;
}

export interface AnalysisResult {
    risk_level: RiskLevel;
    risk_score: number;
    justification: string[];
    matched_rules: MatchedRule[];
    obligations: string[];
    next_steps: string[];
}

export interface AuditHistory {
    id: string;
    timestamp: number;
    input: AISystemInput;
    result: AnalysisResult;
    savedDate: string;
}

// Sector template for quick audit presets
export interface SectorTemplate {
    id: string;
    name_en: string;
    name_fr: string;
    icon: string;
    expected_risk: "HIGH" | "LIMITED" | "MINIMAL" | null;
    preset: Partial<AISystemInput>;
}

// Available sectors for multi-tagging
export type Sector =
    | "health"
    | "biometric"
    | "infrastructure"
    | "education"
    | "employment"
    | "public_services"
    | "law_enforcement"
    | "migration"
    | "financial"
    | "justice";
