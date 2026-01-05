import { AISystemInput, AnalysisResult } from "@/types";

const API_URL = "/api/v1";

export async function assessSystem(data: AISystemInput): Promise<AnalysisResult> {
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

    return response.json();
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
