'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Message {
    role: 'user' | 'model';
    parts: string[];
}

export function ChatAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', parts: ['Hello! I am your AI Act Assistant. Ask me anything about EU AI Regulation compliance.'] }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMsg: Message = { role: 'user', parts: [inputValue] };
        setMessages((prev) => [...prev, userMsg]);
        setInputValue('');
        setIsLoading(true);

        try {
            // Prepare history for API
            // We send the entire history or just the new message? 
            // The backend expects 'history' list.
            // We should exclude the very last user message from history param if we want to follow strict Gemini logic of chat.send_message(msg),
            // but my backend logic is `chat = model.start_chat(history=...)` then `chat.send_message(request.message)`.
            // So 'history' should contain everything BEFORE the current message.

            const historyPayload = messages.map(m => ({
                role: m.role,
                parts: m.parts
            }));

            const res = await fetch('http://localhost:8000/api/v1/chat/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMsg.parts[0],
                    history: historyPayload
                }),
            });

            if (!res.ok) {
                throw new Error('Failed to fetch response');
            }

            const data = await res.json();
            const botMsg: Message = { role: 'model', parts: [data.response] };
            setMessages((prev) => [...prev, botMsg]);

        } catch (error) {
            console.error(error);
            setMessages((prev) => [...prev, { role: 'model', parts: ['Sorry, I encountered an error. Please check your connection or API key.'] }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="fixed bottom-20 right-6 z-50 w-96 shadow-2xl"
                    >
                        <Card className="border-primary/20 bg-background/95 check-backdrop-blur">
                            <CardHeader className="flex flex-row items-center justify-between border-b p-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                        <Bot className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm">AI Act Assistant</h3>
                                        <p className="text-xs text-muted-foreground">Powered by Gemini</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
                                    <X className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="h-[400px] overflow-y-auto p-4 space-y-4">
                                {messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={cn(
                                            "flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                                            msg.role === 'user'
                                                ? "ml-auto bg-primary text-primary-foreground"
                                                : "bg-muted"
                                        )}
                                    >
                                        {msg.parts.map((part, partIdx) => (
                                            <p key={partIdx}>{part}</p>
                                        ))}
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-muted">
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span>Thinking...</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </CardContent>
                            <CardFooter className="p-4 border-t">
                                <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
                                    <Input
                                        placeholder="Ask about AI Act..."
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        className="flex-1"
                                    />
                                    <Button type="submit" size="icon" disabled={isLoading}>
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </form>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl"
            >
                {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
            </motion.button>
        </>
    );
}
