/**
 * Chat functions to interact with the AI Advisor API
 */

const API_URL = "/api/v1";

export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
    sources?: string[];
}

export interface ChatRequest {
    question: string;
    system_data: any;
    risk_level: string;
    language?: string;
}

export interface ChatResponse {
    answer: string;
    sources: string[];
    model: string;
}

export async function askAdvisor(request: ChatRequest): Promise<ChatResponse> {
    const response = await fetch(`${API_URL}/chat/ask`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to get AI advice');
    }

    return await response.json();
}

export async function checkAdvisorHealth(): Promise<{ status: string; model: string; provider: string }> {
    const response = await fetch(`${API_URL}/chat/health`);

    if (!response.ok) {
        throw new Error('Failed to check advisor status');
    }

    return await response.json();
}
