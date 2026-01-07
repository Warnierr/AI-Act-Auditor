"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    AlertTriangle,
    CheckCircle2,
    XCircle,
    ChevronRight,
    ArrowLeft,
    ShieldAlert,
    Info,
    Scale
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface DecisionNode {
    id: string;
    questionFr: string;
    questionEn: string;
    yesPath: string; // ID of next node or "PROHIBITED" | "HIGH_RISK"
    noPath: string;  // ID of next node or "LIMITED" | "MINIMAL"
    category?: string;
}

const NODES: Record<string, DecisionNode> = {
    start: {
        id: "start",
        questionFr: "Votre IA utilise-t-elle des techniques de manipulation subliminale ou exploite-t-elle des vulnérabilités ?",
        questionEn: "Does your AI use subliminal techniques or exploit vulnerabilities of specific groups?",
        yesPath: "PROHIBITED",
        noPath: "scoring",
        category: "Article 5"
    },
    scoring: {
        id: "scoring",
        questionFr: "Est-ce un système de scoring social utilisé par une autorité publique ?",
        questionEn: "Is it a social scoring system used by a public authority?",
        yesPath: "PROHIBITED",
        noPath: "biometric_live",
        category: "Article 5"
    },
    biometric_live: {
        id: "biometric_live",
        questionFr: "Utilisez-vous l'identification biométrique en temps réel dans des espaces publics ?",
        questionEn: "Do you use real-time remote biometric identification in public spaces?",
        yesPath: "PROHIBITED",
        noPath: "health_diagnosis",
        category: "Article 5"
    },
    health_diagnosis: {
        id: "health_diagnosis",
        questionFr: "S'agit-il d'un système de santé influençant les décisions de diagnostic ou de traitement ?",
        questionEn: "Is it a health system influencing diagnosis or treatment decisions?",
        yesPath: "HIGH_RISK",
        noPath: "critical_infra",
        category: "Health (Annex III)"
    },
    critical_infra: {
        id: "critical_infra",
        questionFr: "Le système gère-t-il une infrastructure critique (énergie, transport, eau, telecom) ?",
        questionEn: "Does the system manage critical infrastructure (energy, transport, water, telecom)?",
        yesPath: "HIGH_RISK",
        noPath: "hr_education",
        category: "Infrastructure (Annex III)"
    },
    hr_education: {
        id: "hr_education",
        questionFr: "Est-ce un système lié au recrutement, à la promotion ou à l'admission scolaire ?",
        questionEn: "Is it a system related to recruitment, promotion, or school admission?",
        yesPath: "HIGH_RISK",
        noPath: "gen_ai",
        category: "HR/Education (Annex III)"
    },
    gen_ai: {
        id: "gen_ai",
        questionFr: "S'agit-il d'un système d'IA générative ou d'un chatbot ?",
        questionEn: "Is it a generative AI system or a chatbot?",
        yesPath: "LIMITED",
        noPath: "MINIMAL"
    }
}

interface DecisionTreeProps {
    locale: string;
    onComplete: (risk: string) => void;
    onCancel?: () => void;
}

export function DecisionTree({ locale, onComplete, onCancel }: DecisionTreeProps) {
    const [currentNodeId, setCurrentNodeId] = useState<string>("start")
    const [history, setHistory] = useState<string[]>([])

    const currentNode = NODES[currentNodeId]

    const handleChoice = (choice: 'yes' | 'no') => {
        const nextId = choice === 'yes' ? currentNode.yesPath : currentNode.noPath

        if (["PROHIBITED", "HIGH_RISK", "LIMITED", "MINIMAL"].includes(nextId)) {
            onComplete(nextId)
        } else {
            setHistory([...history, currentNodeId])
            setCurrentNodeId(nextId)
        }
    }

    const goBack = () => {
        if (history.length > 0) {
            const prevId = history[history.length - 1]
            setCurrentNodeId(prevId)
            setHistory(history.slice(0, -1))
        }
    }

    return (
        <div className="bg-card/50 backdrop-blur-md border border-border rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Scale className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-lg sm:text-xl text-foreground">
                        {locale === 'fr' ? 'Arbre de Décision Interactif' : 'Interactive Decision Tree'}
                    </h3>
                </div>
                {currentNode.category && (
                    <Badge variant="outline" className="text-[10px] uppercase tracking-widest border-primary/20 bg-primary/5 text-primary">
                        {currentNode.category}
                    </Badge>
                )}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentNodeId}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    className="min-h-[160px] flex flex-col justify-center items-center text-center space-y-8"
                >
                    <p className="text-xl sm:text-2xl font-medium text-foreground leading-relaxed max-w-lg">
                        {locale === 'fr' ? currentNode.questionFr : currentNode.questionEn}
                    </p>

                    <div className="flex gap-4 w-full max-w-sm">
                        <Button
                            onClick={() => handleChoice('yes')}
                            className="flex-1 h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg shadow-lg shadow-primary/20"
                        >
                            {locale === 'fr' ? 'OUI' : 'YES'}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => handleChoice('no')}
                            className="flex-1 h-14 rounded-2xl bg-secondary hover:bg-secondary/90 text-foreground font-bold text-lg border border-border"
                        >
                            {locale === 'fr' ? 'NON' : 'NO'}
                        </Button>
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="mt-8 pt-6 border-t border-border flex justify-between items-center">
                <div className="flex gap-4">
                    <button
                        onClick={goBack}
                        disabled={history.length === 0}
                        className={`flex items-center gap-2 text-sm font-medium transition-colors ${history.length === 0 ? 'text-muted-foreground opacity-50 cursor-not-allowed' : 'text-primary hover:text-primary/80'
                            }`}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {locale === 'fr' ? 'Retour' : 'Back'}
                    </button>

                    {onCancel && (
                        <button
                            onClick={onCancel}
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {locale === 'fr' ? 'Annuler' : 'Cancel'}
                        </button>
                    )}
                </div>

                <div className="flex gap-1">
                    {Object.keys(NODES).map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-1.5 w-1.5 rounded-full ${history.length > idx ? 'bg-primary' : history.length === idx ? 'bg-primary/40' : 'bg-border'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
