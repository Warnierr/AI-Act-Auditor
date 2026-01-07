/**
 * Chat functions to interact with the AI Advisor API
 */

const API_URL = "/api/v1";

export interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    sources?: string[];
    model?: string;
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

export interface ChatStreamEventToken {
    type: "token";
    content: string;
}

export interface ChatStreamEventDone {
    type: "done";
    sources: string[];
    model: string;
}

export type ChatStreamEvent = ChatStreamEventToken | ChatStreamEventDone;

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

export async function askAdvisorStream(
    request: ChatRequest,
    onEvent: (event: ChatStreamEvent) => void
): Promise<void> {
    const response = await fetch(`${API_URL}/chat/stream`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to stream AI advice');
    }

    if (!response.body) {
        throw new Error('Streaming not supported');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split("\n\n");
        buffer = events.pop() || "";

        for (const chunk of events) {
            const trimmed = chunk.trim();
            if (!trimmed) continue;
            const payload = trimmed.replace(/^data:\s*/, "");
            try {
                const parsed = JSON.parse(payload);
                onEvent(parsed as ChatStreamEvent);
            } catch (error) {
                console.error("Failed to parse stream payload", error, payload);
            }
        }
    }

    if (buffer.trim()) {
        const payload = buffer.trim().replace(/^data:\s*/, "");
        try {
            const parsed = JSON.parse(payload);
            onEvent(parsed as ChatStreamEvent);
        } catch (error) {
            console.error("Failed to parse trailing stream payload", error, payload);
        }
    }
}

export async function checkAdvisorHealth(): Promise<{ status: string; model: string; provider: string }> {
    const response = await fetch(`${API_URL}/chat/health`);

    if (!response.ok) {
        throw new Error('Failed to check advisor status');
    }

    return await response.json();
}
