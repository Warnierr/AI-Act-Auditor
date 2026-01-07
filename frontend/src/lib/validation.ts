/**
 * Form Validation Utilities
 * Provides real-time validation for the assessment wizard
 */

import { AISystemInput } from "@/types";

export interface ValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
    completedFields: number;
    totalFields: number;
}

/**
 * Validate Step 1: Project Details
 */
export function validateStep1(data: Partial<AISystemInput>): ValidationResult {
    const errors: Record<string, string> = {};
    let completed = 0;
    const total = 3;

    if (!data.name || data.name.trim().length === 0) {
        errors.name = "Product name is required";
    } else if (data.name.trim().length < 3) {
        errors.name = "Product name must be at least 3 characters";
    } else {
        completed++;
    }

    if (!data.description || data.description.trim().length === 0) {
        errors.description = "Description is required";
    } else if (data.description.trim().length < 20) {
        errors.description = "Description must be at least 20 characters";
    } else {
        completed++;
    }

    if (!data.intended_purpose || data.intended_purpose.trim().length === 0) {
        errors.intended_purpose = "Intended purpose is required";
    } else if (data.intended_purpose.trim().length < 10) {
        errors.intended_purpose = "Intended purpose must be at least 10 characters";
    } else {
        completed++;
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        completedFields: completed,
        totalFields: total
    };
}

/**
 * Validate Step 2: Risk Assessment
 */
export function validateStep2(data: Partial<AISystemInput>): ValidationResult {
    const errors: Record<string, string> = {};
    let completed = 0;
    const total = 2;

    if (!data.domain || data.domain.trim().length === 0) {
        errors.domain = "Domain selection is required";
    } else {
        completed++;
    }

    // Check if at least one category is selected
    const categories = [
        data.biometrics,
        data.infrastructure,
        data.education,
        data.employment,
        data.services,
        data.law_enforcement,
        data.migration,
        data.justice,
        data.is_gen_ai
    ];

    const hasSelection = categories.some(cat => cat === true);
    if (!hasSelection) {
        errors.categories = "Select at least one category or 'None of the above'";
    } else {
        completed++;
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        completedFields: completed,
        totalFields: total
    };
}

/**
 * Validate Step 3: Review & Context
 */
export function validateStep3(data: Partial<AISystemInput>): ValidationResult {
    const errors: Record<string, string> = {};
    let completed = 0;
    const total = 5;

    // user_type
    if (data.user_type) {
        completed++;
    }

    // data_types
    if (data.data_types && data.data_types.length > 0) {
        completed++;
    }

    // affects_rights
    if (typeof data.affects_rights === 'boolean') {
        completed++;
    }

    // automation_level
    if (data.automation_level) {
        completed++;
    }

    // output_type
    if (data.output_type) {
        completed++;
    }

    // No strict validation errors for step 3, but track completion
    return {
        isValid: true, // Step 3 is always valid (optional context)
        errors,
        completedFields: completed,
        totalFields: total
    };
}

/**
 * Get overall validation for all steps
 */
export function validateAll(data: Partial<AISystemInput>): {
    step1: ValidationResult;
    step2: ValidationResult;
    step3: ValidationResult;
    isAllValid: boolean;
    totalCompleted: number;
    totalFields: number;
} {
    const step1 = validateStep1(data);
    const step2 = validateStep2(data);
    const step3 = validateStep3(data);

    return {
        step1,
        step2,
        step3,
        isAllValid: step1.isValid && step2.isValid,
        totalCompleted: step1.completedFields + step2.completedFields + step3.completedFields,
        totalFields: step1.totalFields + step2.totalFields + step3.totalFields
    };
}
