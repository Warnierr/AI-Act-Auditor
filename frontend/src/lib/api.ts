import { AISystemInput, AnalysisResult } from "@/types";
import cacheManager, { generateCacheKey } from "./cache";

const API_URL = "/api/v1";

export async function assessSystem(data: AISystemInput): Promise<AnalysisResult> {
    // Check cache first
    const cacheKey = generateCacheKey('assess', data);
    const cached = cacheManager.get<AnalysisResult>(cacheKey);
    
    if (cached) {
        console.log('Returning cached assessment result');
        return cached;
    }
    
    const response = await fetch(`${API_URL}/assess`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to assess system");
    }

    const result = await response.json();
    
    // Cache the result
    cacheManager.set(cacheKey, result, 30 * 60 * 1000); // 30 minutes
    
    return result;
}

export async function exportReport(data: AISystemInput): Promise<Blob> {
    const response = await fetch(`${API_URL}/export/pdf`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to export report");
    }

    return response.blob();
}
