"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Bot, Send, Sparkles, ExternalLink, AlertCircle, Loader2 } from "lucide-react"
import { askAdvisor, ChatMessage } from "@/lib/chat-api"
import Link from "next/link"

interface AdvisorChatProps {
    systemData: any
    riskLevel: string
    locale: string
}

export function AdvisorChat({ systemData, riskLevel, locale }: AdvisorChatProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        // Welcome message
        setMessages([{
            role: "assistant",
            content: locale === 'fr'
                ? "👋 Bonjour ! Je suis votre conseiller IA Act. Je peux vous aider à comprendre vos obligations et répondre à vos questions sur la conformité. Posez-moi n'importe quelle question !"
                : "👋 Hello! I'm your AI Act advisor. I can help you understand your obligations and answer questions about compliance. Ask me anything!",
            sources: []
        }])
    }, [locale])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || loading) return

        const userMessage: ChatMessage = {
            role: "user",
            content: input
        }

        setMessages(prev => [...prev, userMessage])
        setInput("")
        setLoading(true)
        setError(null)

        try {
            const response = await askAdvisor({
                question: input,
                system_data: systemData,
                risk_level: riskLevel,
                language: locale
            })

            const assistantMessage: ChatMessage = {
                role: "assistant",
                content: response.answer,
                sources: response.sources
            }

            setMessages(prev => [...prev, assistantMessage])
        } catch (err: any) {
            console.error("Chat error:", err)
            setError(err.message || "Une erreur s'est produite")

            // Add error message in chat
            const errorMessage: ChatMessage = {
                role: "assistant",
                content: locale === 'fr'
                    ? "❌ Désolé, je ne peux pas répondre pour le moment. Le service pourrait ne pas être configuré."
                    : "❌ Sorry, I cannot answer right now. The service might not be configured.",
                sources: []
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setLoading(false)
        }
    }

    const suggestedQuestions = locale === 'fr' ? [
        "Quelles sont mes obligations principales ?",
        "Comment mettre en place la surveillance humaine ?",
        "Que dois-je documenter exactement ?",
        "Quels sont les délais de conformité ?"
    ] : [
        "What are my main obligations?",
        "How to implement human oversight?",
        "What exactly should I document?",
        "What are the compliance deadlines?"
    ]

    return (
        <Card className="border-0 shadow-xl overflow-hidden bg-gradient-to-br from-slate-50 to-white">
            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
                        <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <CardTitle className="text-xl flex items-center gap-2">
                            {locale === 'fr' ? 'Conseiller IA' : 'AI Advisor'}
                            <Badge variant="secondary" className="text-xs">
                                <Sparkles className="h-3 w-3 mr-1" />
                                Claude 3.5
                            </Badge>
                        </CardTitle>
                        <CardDescription className="text-sm">
                            {locale === 'fr'
                                ? 'Posez vos questions sur la conformité AI Act'
                                : 'Ask questions about AI Act compliance'}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                {/* Messages */}
                <div className="h-96 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {msg.role === 'assistant' && (
                                <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                    <Bot className="h-4 w-4 text-white" />
                                </div>
                            )}

                            <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                                <div className={`rounded-2xl px-4 py-3 ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-100 text-slate-800 border border-slate-200'
                                    }`}>
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                </div>

                                {/* Sources */}
                                {msg.sources && msg.sources.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                        <span className="text-xs text-slate-500">Sources:</span>
                                        {msg.sources.map((article, i) => (
                                            <Link
                                                key={i}
                                                href={`https://artificialintelligenceact.eu/article/${article}/`}
                                                target="_blank"
                                                className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors inline-flex items-center gap-1"
                                            >
                                                Art. {article}
                                                <ExternalLink className="h-2.5 w-2.5" />
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {msg.role === 'user' && (
                                <div className="shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-sm font-bold">
                                    U
                                </div>
                            )}
                        </div>
                    ))}

                    {loading && (
                        <div className="flex gap-3">
                            <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                <Loader2 className="h-4 w-4 text-white animate-spin" />
                            </div>
                            <div className="bg-slate-100 rounded-2xl px-4 py-3 border border-slate-200">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Suggested Questions (show only if no messages yet) */}
                {messages.length === 1 && (
                    <div className="px-6 py-4 border-t bg-slate-50/50">
                        <p className="text-xs text-slate-500 mb-2 font-medium">
                            {locale === 'fr' ? 'Questions suggérées :' : 'Suggested questions:'}
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            {suggestedQuestions.map((q, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setInput(q)}
                                    className="text-left text-xs p-2 rounded-lg bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input */}
                <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
                    {error && (
                        <div className="mb-3 p-2 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            {error}
                        </div>
                    )}
                    <div className="flex gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={locale === 'fr' ? "Posez votre question..." : "Ask your question..."}
                            className="flex-1 h-11 text-sm"
                            disabled={loading}
                        />
                        <Button
                            type="submit"
                            disabled={!input.trim() || loading}
                            className="h-11 px-4 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                        {locale === 'fr'
                            ? '🔒 Vos questions ne sont pas enregistrées. Réponses basées sur l\'AI Act officiel.'
                            : '🔒 Your questions are not stored. Answers based on the official AI Act.'}
                    </p>
                </form>
            </CardContent>
        </Card>
    )
}
