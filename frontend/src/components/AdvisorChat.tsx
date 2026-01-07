"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AlertCircle, Bot, ExternalLink, Loader2, Send, Sparkles } from "lucide-react"
import { askAdvisorStream, ChatMessage } from "@/lib/chat-api"
import Link from "next/link"

const createId = () => `msg-${Math.random().toString(36).slice(2)}`

const formatModelName = (model?: string) => {
    if (!model) return "Claude 3.5 Sonnet"
    const normalized = model.toLowerCase()
    if (normalized.includes("claude")) return "Claude 3.5 Sonnet"
    if (normalized.includes("gpt")) return "GPT-series model"
    return model
}

const getSuggestedQuestions = (riskLevel: string, locale: string) => {
    const riskLevelUpper = riskLevel?.toUpperCase() || ""
    if (locale === 'fr') {
        if (riskLevelUpper.includes("HIGH") || riskLevelUpper.includes("HAUT")) {
            return [
                "Quelles sont les exigences de l'Article 9 sur la gestion des risques ?",
                "Comment préparer la documentation technique (Art. 11) ?",
                "Quels sont les critères pour la surveillance humaine (Art. 14) ?",
                "Comment se déroule l'évaluation de conformité (Art. 43) ?",
                "Quelles données dois-je enregistrer automatiquement (Art. 12) ?",
                "Quelle est la date limite de mise en conformité ?"
            ]
        }
        if (riskLevelUpper.includes("PROHIBITED") || riskLevelUpper.includes("INTERDIT")) {
            return [
                "Pourquoi mon système est-il classé comme interdit ?",
                "Existe-t-il des exceptions à l'Article 5 ?",
                "Quelles sont les sanctions encourues ?",
                "Comment modifier mon système pour qu'il soit conforme ?",
                "Puis-je déployer dans un cadre de recherche ?"
            ]
        }
        if (riskLevelUpper.includes("LIMITED")) {
            return [
                "Quelles sont mes obligations de transparence (Art. 50-52) ?",
                "Comment informer les utilisateurs qu'ils interagissent avec une IA ?",
                "Dois-je obtenir un marquage CE ?",
                "Quelles sont les exigences pour l'IA générative ?",
                "Comment gérer les contenus deepfakes ?"
            ]
        }
        return [
            "Quelles sont mes obligations même en risque minimal ?",
            "Comment appliquer le RGPD à mon système IA ?",
            "Dois-je documenter quelque chose ?",
            "Quand dois-je réévaluer la classification ?",
            "Quelles bonnes pratiques volontaires puis-je adopter ?"
        ]
    }
    if (riskLevelUpper.includes("HIGH")) {
        return [
            "What are the Article 9 risk management requirements?",
            "How to prepare technical documentation (Art. 11)?",
            "What criteria for human oversight (Art. 14)?",
            "How does conformity assessment work (Art. 43)?",
            "What data must be automatically logged (Art. 12)?",
            "What is the compliance deadline?"
        ]
    }
    if (riskLevelUpper.includes("PROHIBITED")) {
        return [
            "Why is my system classified as prohibited?",
            "Are there exceptions to Article 5?",
            "What penalties could I face?",
            "How can I modify my system to comply?",
            "Can I deploy in a research context?"
        ]
    }
    if (riskLevelUpper.includes("LIMITED")) {
        return [
            "What are my transparency obligations (Art. 50-52)?",
            "How to inform users they're interacting with AI?",
            "Do I need CE marking?",
            "What requirements for generative AI?",
            "How to handle deepfake content?"
        ]
    }
    return [
        "What obligations apply even for minimal risk?",
        "How to apply GDPR to my AI system?",
        "Do I need to document anything?",
        "When should I reassess classification?",
        "What voluntary best practices can I adopt?"
    ]
}

const getClarifyingQuestions = (systemData: any, locale: string) => {
    const domain = systemData?.domain || (locale === 'fr' ? "ce domaine" : "this domain")
    const purpose = systemData?.intended_purpose || (locale === 'fr' ? "cette finalité" : "this purpose")
    if (locale === 'fr') {
        return [
            `Quel est un cas d'usage concret lié à ${purpose} ?`,
            `Quelles mesures de surveillance humaine sont prévues pour ${domain} ?`,
            `Y a-t-il des enjeux juridiques prioritaires sur ${domain} ?`,
            `Des données sensibles ou biométriques interviennent-elles dans ${purpose} ?`
        ]
    }
    return [
        `Can you describe a concrete scenario for ${purpose}?`,
        `What human oversight layers are planned for ${domain}?`,
        `What legal concerns are you trying to avoid within ${domain}?`,
        `Are sensitive or biometric data involved in ${purpose}?`
    ]
}

// Sector-specific questions for Health and Deepfake use cases
const getSectorSpecificQuestions = (systemData: any, locale: string) => {
    const questions: string[] = []

    // Health domain questions
    if (systemData?.health_domain) {
        if (locale === 'fr') {
            questions.push(
                "🏥 Comment implémenter la redirection d'urgence vers le 15/112 ?",
                "🏥 Quels disclaimers médicaux sont obligatoires ?",
                "🏥 Quelle supervision humaine pour un chatbot médical ?",
                "🏥 Mon système peut-il bénéficier de l'exemption Article 6(3) ?"
            )
        } else {
            questions.push(
                "🏥 How to implement emergency redirect to emergency services?",
                "🏥 What medical disclaimers are mandatory?",
                "🏥 What human oversight for a medical chatbot?",
                "🏥 Can my system qualify for Article 6(3) exemption?"
            )
        }
    }

    // Synthetic content / Deepfake questions
    if (systemData?.generates_synthetic_content) {
        if (locale === 'fr') {
            questions.push(
                "🎭 Comment watermarker le contenu généré (Article 50) ?",
                "🎭 Quel registre de traçabilité pour les deepfakes ?",
                "🎭 Comment labelliser 'IA-generated' sur mes images/vidéos ?",
                "🎭 Quelles métadonnées logger pour la conformité ?"
            )
        } else {
            questions.push(
                "🎭 How to watermark generated content (Article 50)?",
                "🎭 What traceability registry for deepfakes?",
                "🎭 How to label 'AI-generated' on my images/videos?",
                "🎭 What metadata to log for compliance?"
            )
        }
    }

    return questions
}

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
    const [modelLabel, setModelLabel] = useState("Claude 3.5 Sonnet")
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [])

    useEffect(() => {
        scrollToBottom()
    }, [messages, scrollToBottom])

    const sendStreamingMessage = useCallback(async (question: string, options?: { reset?: boolean }) => {
        if (!systemData || !riskLevel) return
        setError(null)
        setLoading(true)

        const userMessage: ChatMessage = {
            id: createId(),
            role: "user",
            content: question
        }
        const assistantId = createId()
        const assistantMessage: ChatMessage = {
            id: assistantId,
            role: "assistant",
            content: "",
            sources: [],
            model: ""
        }

        setMessages(prev => {
            const base = options?.reset ? [] : prev
            return [...base, userMessage, assistantMessage]
        })

        try {
            await askAdvisorStream({
                question,
                system_data: systemData,
                risk_level: riskLevel,
                language: locale
            }, (event) => {
                if (event.type === "token") {
                    setMessages(prev => prev.map(msg => msg.id === assistantId ? { ...msg, content: msg.content + event.content } : msg))
                } else if (event.type === "done") {
                    setMessages(prev => prev.map(msg => msg.id === assistantId ? { ...msg, sources: event.sources, model: event.model } : msg))
                    setModelLabel(formatModelName(event.model))
                }
            })
        } catch (err: any) {
            console.error("Streaming error:", err)
            const fallback = locale === 'fr'
                ? "❌ Désolé, je ne peux pas répondre pour le moment."
                : "❌ Sorry, I cannot respond right now."

            setMessages(prev => {
                const filtered = prev.filter(msg => msg.id !== assistantId)
                return [...filtered, { id: createId(), role: "assistant", content: fallback, sources: [], model: "" }]
            })
            setError(err.message || fallback)
        } finally {
            setLoading(false)
        }
    }, [systemData, riskLevel, locale])

    useEffect(() => {
        if (!systemData || !riskLevel) return
        const summaryQuestion = locale === 'fr'
            ? `Voici le résumé de mon audit AI Act :
- Domaine : ${systemData.domain || 'Non spécifié'}
- Finalité : ${systemData.intended_purpose || 'Non spécifiée'}
- Niveau de risque détecté : ${riskLevel}
- Biométrie : ${systemData.is_biometric ? 'Oui' : 'Non'}
- Infrastructure critique : ${systemData.is_critical_infrastructure ? 'Oui' : 'Non'}
- Composant de sécurité : ${systemData.is_safety_component ? 'Oui' : 'Non'}

Peux-tu me donner des conseils personnalisés et les prochaines étapes ?`
            : `Here is my AI Act audit summary:
- Domain: ${systemData.domain || 'Not specified'}
- Purpose: ${systemData.intended_purpose || 'Not specified'}
- Detected risk level: ${riskLevel}
- Biometrics: ${systemData.is_biometric ? 'Yes' : 'No'}
- Critical infrastructure: ${systemData.is_critical_infrastructure ? 'Yes' : 'No'}
- Safety component: ${systemData.is_safety_component ? 'Yes' : 'No'}

Can you give me targeted advice and next steps?`

        void sendStreamingMessage(summaryQuestion, { reset: true })
    }, [systemData, riskLevel, locale, sendStreamingMessage])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || loading) return
        const question = input.trim()
        setInput("")
        void sendStreamingMessage(question)
    }

    const suggestedQuestions = getSuggestedQuestions(riskLevel, locale)
    const clarifyingQuestions = getClarifyingQuestions(systemData, locale)
    const sectorQuestions = getSectorSpecificQuestions(systemData, locale)
    const upgradeHint = locale === 'fr'
        ? "Pour aller plus loin, envisagez Claude 4 ou GPT-4.1 via OpenRouter (option payante)."
        : "For deeper insights, consider Claude 4 or GPT-4.1 via OpenRouter (paid option)."

    return (
        <Card className="border-0 shadow-2xl overflow-hidden bg-gradient-to-br from-card to-card/90">
            <CardHeader className="border-b border-border bg-gradient-to-r from-primary/10 to-accent/10 pb-4">
                <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
                            <Bot className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div className="flex-1 space-y-1">
                            <CardTitle className="text-base sm:text-xl font-bold text-foreground flex items-center gap-2">
                                {locale === 'fr' ? 'Conseiller IA' : 'AI Advisor'}
                                <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">streaming</span>
                            </CardTitle>
                            <CardDescription className="text-[11px] sm:text-sm text-muted-foreground">
                                {locale === 'fr'
                                    ? "Réponses basées sur l'AI Act avec références. Ne remplace pas un conseil juridique."
                                    : "Answers grounded in the AI Act with sourced references. Not legal advice."}
                            </CardDescription>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Model</p>
                            <p className="text-sm font-semibold text-foreground">{modelLabel}</p>
                            <p className="text-[11px] text-muted-foreground">{upgradeHint}</p>
                        </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                        {locale === 'fr'
                            ? "Flux token par token pour un rendu fluide • Voir kenshu.dev pour les options."
                            : "Token-by-token stream for a smooth read • Visit kenshu.dev for options."}
                    </p>
                </div>
            </CardHeader>

            <CardContent className="p-0 space-y-0">
                <div className="h-[400px] sm:h-[560px] overflow-y-auto p-4 sm:p-6 space-y-3 scrollbar-thin bg-card/70">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex gap-2 sm:gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {msg.role === 'assistant' && (
                                <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                    <Bot className="h-4 w-4 text-primary-foreground" />
                                </div>
                            )}

                            <div className={`max-w-[85%] sm:max-w-[80%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                                <div className={`rounded-2xl px-3 py-2 sm:px-4 sm:py-3 ${msg.role === 'user'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-card border border-border text-foreground shadow-sm'
                                    }`}>
                                    <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                                        {msg.content || (loading ? (locale === 'fr' ? "Streaming en cours…" : "Streaming…") : "…")}
                                    </p>
                                </div>

                                {msg.sources && msg.sources.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] text-muted-foreground">
                                        <span className="font-semibold">{locale === 'fr' ? 'Articles :' : 'Sources:'}</span>
                                        {msg.sources.map((article, idx) => (
                                            <Link
                                                key={`${msg.id}-${idx}`}
                                                href={`https://artificialintelligenceact.eu/article/${article}/`}
                                                target="_blank"
                                                className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-primary transition-colors hover:bg-primary/20"
                                            >
                                                {locale === 'fr' ? 'Art.' : 'Art.'} {article}
                                                <ExternalLink className="h-3 w-3" />
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {msg.role === 'user' && (
                                <div className="shrink-0 w-8 h-8 rounded-full bg-foreground flex items-center justify-center text-background font-bold">
                                    U
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                    {loading && (
                        <div className="flex gap-2 sm:gap-3">
                            <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                <Loader2 className="h-4 w-4 text-primary-foreground animate-spin" />
                            </div>
                            <div className="bg-secondary rounded-2xl px-3 py-2 border border-border">
                                <div className="flex gap-1">
                                    <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
                                    <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '120ms' }} />
                                    <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '240ms' }} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="px-4 sm:px-6 py-3 border-t border-border bg-secondary/50">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                        {locale === 'fr' ? 'Questions suggérées' : 'Suggested questions'}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        {suggestedQuestions.map((question, idx) => (
                            <button
                                key={`suggested-${idx}`}
                                type="button"
                                onClick={() => setInput(question)}
                                className="text-left text-[11px] px-3 py-2 rounded-xl border border-border bg-card hover:border-primary hover:bg-primary/5 transition-colors text-foreground"
                            >
                                {question}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="px-4 sm:px-6 py-3 border-t border-border bg-secondary/40">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                        {locale === 'fr' ? 'Questions de clarification' : 'Clarifying questions'}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        {clarifyingQuestions.map((question, idx) => (
                            <button
                                key={`clarify-${idx}`}
                                type="button"
                                onClick={() => setInput(question)}
                                className="text-left text-[11px] px-3 py-2 rounded-xl border border-border bg-card hover:border-primary hover:bg-primary/5 transition-colors text-foreground"
                            >
                                {question}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sector-specific questions (Health / Deepfake) */}
                {sectorQuestions.length > 0 && (
                    <div className="px-4 sm:px-6 py-3 border-t border-border bg-gradient-to-r from-rose-500/10 to-purple-500/10">
                        <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                            {locale === 'fr' ? '🎯 Questions sectorielles (Santé / Deepfake)' : '🎯 Sector Questions (Health / Deepfake)'}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                            {sectorQuestions.map((question, idx) => (
                                <button
                                    key={`sector-${idx}`}
                                    type="button"
                                    onClick={() => setInput(question)}
                                    className="text-left text-[11px] px-3 py-2 rounded-xl border border-rose-200 bg-card hover:border-purple-400 hover:bg-purple-50 transition-colors text-foreground"
                                >
                                    {question}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-4 border-t border-border bg-card">
                    {error && (
                        <div className="mb-3 flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-[11px] text-destructive">
                            <AlertCircle className="h-3 w-3" />
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
                            className="h-11 px-4 bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                    <p className="mt-2 text-[11px] text-muted-foreground">
                        {locale === 'fr'
                            ? "🔒 Vos échanges restent anonymes. Ce n'est pas un conseil juridique."
                            : "🔒 Your chats remain anonymous. This is not legal advice."}
                    </p>
                </form>

                <div className="px-4 sm:px-6 py-3 border-t border-border bg-secondary/30 text-[11px] text-muted-foreground space-y-1">
                    <p>
                        {locale === 'fr'
                            ? "📞 Pour un accompagnement expert, contactez contact@kenshu.dev ou visitez kenshu.dev."
                            : "📞 For expert support, email contact@kenshu.dev or visit kenshu.dev."}
                    </p>
                    <p>
                        {locale === 'fr'
                            ? "⚠️ Ce conseiller fournit une évaluation préliminaire. Consultez un spécialiste IA Act pour valider."
                            : "⚠️ The advisor delivers a preliminary assessment. Consult an AI Act expert for validation."}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
