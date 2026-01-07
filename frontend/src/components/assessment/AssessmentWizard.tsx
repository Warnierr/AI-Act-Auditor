"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
    ArrowLeft,
    Check,
    CheckCircle2,
    Laptop,
    Shield,
    ArrowRight,
    Loader2,
    Languages,
    Sparkles,
    AlertCircle,
    AlertTriangle,
    Info,
    ShieldAlert,
    Scale
} from "lucide-react"
import { toast } from "sonner"
import { assessSystem } from "@/lib/api"
import { AISystemInput } from "@/types"
import { useTranslation } from "@/lib/LanguageContext"
import { validateStep1, validateStep2, validateStep3, validateAll } from "@/lib/validation"
import { FormError } from "@/components/ui/form-error"
import { DecisionTree } from "@/components/DecisionTree"

const steps = [
    { id: 1, icon: Laptop },
    { id: 2, icon: Shield },
    { id: 3, icon: Sparkles }
]

export default function AssessmentWizard() {
    const router = useRouter()
    const { t, locale, setLocale } = useTranslation()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [suspiciousTerms, setSuspiciousTerms] = useState<string[]>([])
    const [showDecisionTree, setShowDecisionTree] = useState(false)
    const [formData, setFormData] = useState<AISystemInput>({
        name: "",
        description: "",
        intended_purpose: "",
        domain: "",
        is_biometric: false,
        is_critical_infrastructure: false,
        is_safety_component: false,
        biometrics: false,
        infrastructure: false,
        education: false,
        employment: false,
        services: false,
        law_enforcement: false,
        migration: false,
        justice: false,
        is_gen_ai: false,
        // Health Domain (Annex III, 5)
        health_domain: false,
        influences_diagnosis: false,
        is_administrative_only: false,
        // Synthetic Content (Article 50)
        generates_synthetic_content: false,
        content_types: [],
        // Other fields
        user_type: "general_public",
        data_types: [],
        affects_rights: false,
        automation_level: "partial",
        output_type: "recommendations",
        additional_context: "",
        deployment_phase: "Development",
        language: locale,
        sectors: []
    })

    const handleDecisionComplete = (risk: string, payload?: Partial<AISystemInput>) => {
        setShowDecisionTree(false)

        // Merge payloads if provided
        if (payload) {
            setFormData(prev => ({ ...prev, ...payload }))
        }

        // Map risk to some form defaults to help the user
        const riskPresets: Record<string, Partial<AISystemInput>> = {
            "PROHIBITED": { affects_rights: true },
            "HIGH_RISK": { affects_rights: true },
            "LIMITED": { is_gen_ai: true },
            "MINIMAL": {}
        }

        if (riskPresets[risk]) {
            setFormData(prev => ({ ...prev, ...riskPresets[risk] }))
        }

        toast.info(
            locale === 'fr'
                ? `Analyse terminée : Votre système est suggéré comme ${risk}. Nous avons pré-rempli certains champs.`
                : `Analysis complete: Your system is suggested as ${risk}. We've pre-filled some fields.`
        )
    }

    useEffect(() => {
        setFormData(prev => ({ ...prev, language: locale }))
    }, [locale])

    // Detect suspicious terms that may indicate prohibited practices (Article 5)
    useEffect(() => {
        const detectSuspiciousTerms = (text: string, locale: string): string[] => {
            const textLower = text.toLowerCase()
            const suspiciousPatterns = locale === 'fr' ? [
                'notation sociale', 'crédit social', 'score citoyen', 'notation comportement',
                'manipulation subliminale', 'manipulation inconsciente', 'subliminal',
                'exploiter vulnérabilités', 'groupes vulnérables', 'police prédictive',
                'prédiction crime', 'profilage risque', 'système réputation'
            ] : [
                'social scoring', 'social credit', 'citizen scoring', 'behavior scoring',
                'subliminal', 'subconscious manipulation', 'hidden manipulation',
                'exploit vulnerabilities', 'vulnerable groups', 'predictive policing',
                'crime prediction', 'risk profiling', 'reputation system'
            ]

            return suspiciousPatterns.filter(pattern => textLower.includes(pattern))
        }

        const fullText = `${formData.description} ${formData.intended_purpose}`
        const detected = detectSuspiciousTerms(fullText, locale)
        setSuspiciousTerms(detected)
    }, [formData.description, formData.intended_purpose, locale])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleCheckboxChange = (name: string, checked: boolean) => {
        setFormData(prev => ({ ...prev, [name]: checked }))
    }

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const finalData = { ...formData, language: locale }
            const result = await assessSystem(finalData)
            localStorage.setItem("auditResult", JSON.stringify(result))
            localStorage.setItem("auditInput", JSON.stringify(finalData))
            router.push("/results")
        } catch (error) {
            console.error(error)
            alert(locale === 'fr' ? "Erreur lors de l'audit. Vérifiez la console." : "Error submitting assessment.")
            setLoading(false)
        }
    }

    const nextStep = () => setStep(s => Math.min(s + 1, 3))
    const prevStep = () => setStep(s => Math.max(s - 1, 1))

    const isStep1Valid = formData.name.trim().length > 0 && formData.description.trim().length > 10
    const isStep2Valid = formData.domain.trim().length > 0

    const userTypeOptions = [
        { value: "general_public", labelFr: "Grand public", labelEn: "General public" },
        { value: "professionals", labelFr: "Professionnels", labelEn: "Professionals" },
        { value: "vulnerable_groups", labelFr: "Groupes vulnérables", labelEn: "Vulnerable groups" },
        { value: "mixed", labelFr: "Mixte", labelEn: "Mixed groups" }
    ]

    const dataTypeOptions = [
        { value: "personal", labelFr: "Personnelles", labelEn: "Personal" },
        { value: "sensitive", labelFr: "Sensibles", labelEn: "Sensitive" },
        { value: "biometric", labelFr: "Biométriques", labelEn: "Biometric" },
        { value: "financial", labelFr: "Financières", labelEn: "Financial" },
        { value: "health", labelFr: "Santé", labelEn: "Health" },
        { value: "none", labelFr: "Aucune", labelEn: "None" }
    ] as const

    const automationOptions = [
        { value: "full", labelFr: "Décision complète", labelEn: "Full decision" },
        { value: "partial", labelFr: "Décision partielle", labelEn: "Partial decision" },
        { value: "advisory", labelFr: "Recommandation / Support", labelEn: "Advisory support" }
    ] as const

    const outputOptions = [
        { value: "recommendations", labelFr: "Recommandations", labelEn: "Recommendations" },
        { value: "decisions", labelFr: "Décisions", labelEn: "Decisions" },
        { value: "content", labelFr: "Contenu généré", labelEn: "Generated content" },
        { value: "predictions", labelFr: "Prédictions", labelEn: "Predictions" },
        { value: "classifications", labelFr: "Classifications", labelEn: "Classifications" }
    ] as const

    // Sector template presets for quick audits
    const SECTOR_TEMPLATES = [
        {
            id: "medical_chatbot",
            icon: "🏥",
            labelFr: "Chatbot Médical",
            labelEn: "Medical Chatbot",
            risk: "HIGH",
            preset: {
                health_domain: true,
                influences_diagnosis: true,
                domain: "Healthcare",
                data_types: ["health", "personal", "sensitive"],
                sectors: ["health"]
            }
        },
        {
            id: "cv_screening",
            icon: "💼",
            labelFr: "Tri de CV / RH",
            labelEn: "CV Screening / HR",
            risk: "HIGH",
            preset: {
                employment: true,
                domain: "Employment / HR",
                output_type: "classifications",
                affects_rights: true,
                sectors: ["employment"]
            }
        },
        {
            id: "credit_scoring",
            icon: "💳",
            labelFr: "Scoring Crédit",
            labelEn: "Credit Scoring",
            risk: "HIGH",
            preset: {
                services: true,
                domain: "Financial Services",
                output_type: "predictions",
                affects_rights: true,
                data_types: ["financial", "personal"],
                sectors: ["financial"]
            }
        },
        {
            id: "deepfake",
            icon: "🎭",
            labelFr: "Générateur Deepfake",
            labelEn: "Deepfake Generator",
            risk: "LIMITED",
            preset: {
                generates_synthetic_content: true,
                content_types: ["image", "video", "audio"],
                is_gen_ai: true,
                domain: "Content Generation"
            }
        },
        {
            id: "student_admission",
            icon: "🎓",
            labelFr: "Admission Étudiants",
            labelEn: "Student Admission",
            risk: "HIGH",
            preset: {
                education: true,
                domain: "Education",
                output_type: "decisions",
                affects_rights: true,
                user_type: "general_public",
                sectors: ["education"]
            }
        },
        {
            id: "customer_chatbot",
            icon: "💬",
            labelFr: "Chatbot Client",
            labelEn: "Customer Chatbot",
            risk: "LIMITED",
            preset: {
                is_gen_ai: true,
                domain: "Customer Service",
                user_type: "general_public" as const
            }
        },
        {
            id: "fraud_detection",
            icon: "🔍",
            labelFr: "Détection Fraude",
            labelEn: "Fraud Detection",
            risk: "HIGH",
            preset: {
                services: true,
                domain: "Financial Services",
                output_type: "classifications",
                data_types: ["financial", "personal"],
                sectors: ["financial"]
            }
        },
        {
            id: "custom",
            icon: "✏️",
            labelFr: "Audit Personnalisé",
            labelEn: "Custom Audit",
            risk: null,
            preset: {}
        }
    ]

    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

    const applyTemplate = (template: typeof SECTOR_TEMPLATES[0]) => {
        setSelectedTemplate(template.id)
        if (template.id !== "custom") {
            const preset = { ...template.preset }
            setFormData(prev => ({
                ...prev,
                ...preset,
                data_types: preset.data_types ? [...preset.data_types] as any : prev.data_types,
                content_types: preset.content_types ? [...preset.content_types] as any : prev.content_types,
                sectors: preset.sectors ? [...preset.sectors] as any : []
            }) as AISystemInput)
        }
    }

    const getOptionLabel = (option: { labelFr: string; labelEn: string }) =>
        locale === 'fr' ? option.labelFr : option.labelEn

    const toggleDataType = (type: "personal" | "sensitive" | "biometric" | "financial" | "health" | "none") => {
        setFormData(prev => {
            const existing = prev.data_types || []
            const next = existing.includes(type)
                ? existing.filter(t => t !== type)
                : [...existing, type]
            return { ...prev, data_types: next }
        })
    }

    return (
        <div className="min-h-screen mesh-gradient noise-overlay">
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
                        <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                            <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
                        </div>
                        <span className="font-bold text-base sm:text-lg text-foreground">AI Act Auditor</span>
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <button
                            onClick={() => setLocale(locale === 'en' ? 'fr' : 'en')}
                            className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-full border border-border bg-card hover:bg-muted transition-all text-xs font-bold shadow-sm"
                        >
                            <Languages className="h-3.5 w-3.5 text-primary" />
                            {locale === 'en' ? 'FR' : 'EN'}
                        </button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12 max-w-4xl">
                {/* Progress Steps */}
                <div className="mb-8 sm:mb-12">
                    <div className="flex items-center justify-center gap-1 sm:gap-2 mb-4 sm:mb-6">
                        {steps.map((s, i) => (
                            <div key={s.id} className="flex items-center">
                                <motion.div
                                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 ${step >= s.id
                                        ? 'bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg shadow-primary/30'
                                        : 'bg-secondary text-muted-foreground'
                                        }`}
                                    animate={step === s.id ? { scale: [1, 1.05, 1] } : {}}
                                    transition={{ duration: 0.3 }}
                                >
                                    {step > s.id ? <Check className="h-4 w-4 sm:h-5 sm:w-5" /> : <s.icon className="h-4 w-4 sm:h-5 sm:w-5" />}
                                </motion.div>
                                {i < steps.length - 1 && (
                                    <div className={`w-8 sm:w-16 h-1 mx-1 sm:mx-2 rounded-full transition-colors ${step > s.id ? 'bg-primary' : 'bg-border'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="text-center">
                        <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                            {locale === 'fr' ? 'Étape' : 'Step'} {step} / 3 — {[t.wizard.step1Title, t.wizard.step2Title, t.wizard.step3Title][step - 1]}
                        </p>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        {step === 1 && (
                            showDecisionTree ? (
                                <DecisionTree
                                    locale={locale}
                                    onComplete={handleDecisionComplete}
                                    onCancel={() => setShowDecisionTree(false)}
                                />
                            ) : (
                                <Card className="glass-card border-0 shadow-2xl overflow-hidden">
                                    <CardHeader className="bg-gradient-to-r from-secondary/50 to-card border-b border-border pb-4 sm:pb-6">
                                        <div className="flex items-center gap-2 sm:gap-3 mb-2">
                                            <div className="p-2 rounded-xl bg-primary/10">
                                                <Laptop className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                            </div>
                                            <Badge variant="secondary" className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                                                {t.wizard.step1Title}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">{t.wizard.identity}</CardTitle>
                                        <CardDescription className="text-sm sm:text-base">{t.wizard.identityDesc}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4 sm:space-y-6 pt-6 sm:pt-8 pb-4">
                                        {/* Template Selector */}
                                        <div className="space-y-4 mb-6">
                                            <div className="flex items-center justify-between gap-2">
                                                <Label className="text-xs sm:text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                                    <Sparkles className="h-4 w-4 text-primary" />
                                                    {locale === 'fr' ? 'SÉLECTIONNEZ UN MODÈLE (OPTIONNEL)' : 'SELECT A TEMPLATE (OPTIONAL)'}
                                                </Label>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowDecisionTree(true)}
                                                    className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1 bg-primary/5 px-2 py-1 rounded-lg"
                                                >
                                                    <Scale className="h-3 w-3" />
                                                    {locale === 'fr' ? 'Aidez-moi à classer' : 'Help me classify'}
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                {SECTOR_TEMPLATES.map((template) => (
                                                    <button
                                                        key={template.id}
                                                        type="button"
                                                        onClick={() => applyTemplate(template)}
                                                        className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 text-center group relative ${selectedTemplate === template.id
                                                            ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20 ring-2 ring-primary/20 scale-[1.02]'
                                                            : 'border-border bg-card hover:border-primary/30 hover:bg-secondary/50'
                                                            }`}
                                                    >
                                                        {selectedTemplate === template.id && (
                                                            <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1 shadow-md">
                                                                <CheckCircle2 className="h-4 w-4" />
                                                            </div>
                                                        )}
                                                        <span className="text-2xl group-hover:scale-110 transition-transform">{template.icon}</span>
                                                        <div className="space-y-0.5">
                                                            <span className="text-[10px] sm:text-xs font-bold block leading-tight text-foreground line-clamp-1">
                                                                {locale === 'fr' ? template.labelFr : template.labelEn}
                                                            </span>
                                                            {template.risk && (
                                                                <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full ${template.risk === 'HIGH' ? 'bg-red-500/10 text-red-600' : 'bg-blue-500/10 text-blue-600'
                                                                    }`}>
                                                                    {template.risk}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid gap-3">
                                            <Label htmlFor="name" className="text-xs sm:text-sm font-semibold flex items-center gap-2 text-foreground">
                                                {t.wizard.productName} <span className="text-destructive">*</span>
                                                {formData.name.trim().length > 0 && <Check className="h-4 w-4 text-emerald-500" />}
                                            </Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                placeholder={t.wizard.productPlaceholder}
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="h-11 sm:h-12 text-sm sm:text-base border-border focus:border-primary focus:ring-primary/20 text-foreground bg-background placeholder:text-muted-foreground"
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="description" className="text-xs sm:text-sm font-semibold flex items-center gap-2 text-foreground">
                                                {t.wizard.overview} <span className="text-destructive">*</span>
                                                {formData.description.trim().length > 10 && <Check className="h-4 w-4 text-emerald-500" />}
                                            </Label>
                                            <Textarea
                                                id="description"
                                                name="description"
                                                placeholder={t.wizard.overviewPlaceholder}
                                                className="min-h-[100px] sm:min-h-[120px] resize-none text-sm sm:text-base border-border focus:border-primary text-foreground bg-background placeholder:text-muted-foreground"
                                                value={formData.description}
                                                onChange={handleChange}
                                            />
                                            {formData.description.length > 0 && formData.description.trim().length <= 10 && (
                                                <p className="text-xs text-destructive font-medium">
                                                    {locale === 'fr' ? 'La description doit contenir au moins 10 caractères.' : 'Description must be at least 10 characters.'}
                                                </p>
                                            )}

                                            {/* Suspicious terms alert (Article 5) */}
                                            {suspiciousTerms.length > 0 && (
                                                <Alert variant="destructive" className="mt-3 border-orange-500 bg-orange-50 dark:bg-orange-950/20">
                                                    <AlertTriangle className="h-4 w-4" />
                                                    <AlertTitle className="text-orange-900 dark:text-orange-200 font-bold">
                                                        {locale === 'fr' ? '⚠️ Attention : Termes Suspects Détectés' : '⚠️ Warning: Suspicious Terms Detected'}
                                                    </AlertTitle>
                                                    <AlertDescription className="text-orange-800 dark:text-orange-300 text-xs sm:text-sm">
                                                        {locale === 'fr'
                                                            ? `Votre description contient des termes qui pourraient indiquer un système interdit selon l'Article 5 de l'AI Act (${suspiciousTerms.slice(0, 2).join(', ')}${suspiciousTerms.length > 2 ? '...' : ''}). Veuillez vérifier la conformité avec un expert juridique avant de continuer.`
                                                            : `Your description contains terms that may indicate a prohibited system under Article 5 of the AI Act (${suspiciousTerms.slice(0, 2).join(', ')}${suspiciousTerms.length > 2 ? '...' : ''}). Please verify compliance with a legal expert before proceeding.`
                                                        }
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="intended_purpose" className="text-xs sm:text-sm font-semibold text-foreground">{t.wizard.purpose}</Label>
                                            <Textarea
                                                id="intended_purpose"
                                                name="intended_purpose"
                                                placeholder={t.wizard.purposePlaceholder}
                                                className="min-h-[80px] sm:min-h-[100px] resize-none text-sm sm:text-base border-border focus:border-primary text-foreground bg-background placeholder:text-muted-foreground"
                                                value={formData.intended_purpose}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 p-4 sm:p-6 bg-secondary/50 border-t border-border">
                                        <Button variant="ghost" onClick={() => router.push('/')} className="text-muted-foreground w-full sm:w-auto">
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            {t.common.home}
                                        </Button>
                                        <Button
                                            onClick={nextStep}
                                            disabled={!isStep1Valid}
                                            className="bg-foreground hover:bg-foreground/90 text-background shadow-lg btn-premium h-11 px-6 w-full sm:w-auto"
                                        >
                                            {t.common.next}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            )
                        )}

                        {step === 2 && (
                            <Card className="glass-card border-0 shadow-2xl overflow-hidden">
                                <CardHeader className="bg-gradient-to-r from-secondary/50 to-card border-b border-border pb-4 sm:pb-6">
                                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                                        <div className="p-2 rounded-xl bg-primary/10">
                                            <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                        </div>
                                        <Badge variant="secondary" className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                                            {t.wizard.step2Title}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">{t.wizard.drivers}</CardTitle>
                                    <CardDescription className="text-sm sm:text-base">{t.wizard.driversDesc}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 sm:space-y-6 pt-6 sm:pt-8 pb-4">
                                    <div className="grid gap-3">
                                        <Label htmlFor="domain" className="text-xs sm:text-sm font-semibold flex items-center gap-2 text-foreground">
                                            {t.wizard.domain} <span className="text-destructive">*</span>
                                            {formData.domain.trim().length > 0 && <Check className="h-4 w-4 text-emerald-500" />}
                                        </Label>
                                        <Input
                                            id="domain"
                                            name="domain"
                                            placeholder={t.wizard.domainPlaceholder}
                                            value={formData.domain}
                                            onChange={handleChange}
                                            className="h-11 sm:h-12 text-sm sm:text-base border-border focus:border-primary text-foreground bg-background placeholder:text-muted-foreground"
                                        />
                                        <div className="flex items-start gap-2 bg-primary/10 p-3 rounded-lg text-xs text-foreground">
                                            <Info className="h-4 w-4 shrink-0 mt-0.5" />
                                            {locale === 'fr'
                                                ? "Le domaine opérationnel (ex: RH, Santé, Transport) est un facteur clé pour la classification de risque selon l'Annexe III."
                                                : "The operational domain (e.g., HR, Health, Transport) is a key factor for risk classification under Annex III."}
                                        </div>
                                    </div>

                                    <div className="space-y-4 sm:space-y-6">
                                        {/* High Risk Categories */}
                                        <div className="space-y-3 sm:space-y-4">
                                            <div className="flex items-center gap-2">
                                                <ShieldAlert className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                                                <h3 className="text-sm sm:text-base font-bold text-foreground">
                                                    {locale === 'fr' ? 'Systèmes à Haut Risque (Annexe III)' : 'High-Risk Systems (Annex III)'}
                                                </h3>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                                                {[
                                                    { id: "biometrics", label: locale === 'fr' ? "Biométrie" : "Biometrics", desc: locale === 'fr' ? "Identification à distance, détection d'émotions" : "Remote identification, emotion detection" },
                                                    { id: "infrastructure", label: locale === 'fr' ? "Infrastructures Critiques" : "Critical Infrastructure", desc: locale === 'fr' ? "Énergie, eau, transport" : "Energy, water, transport" },
                                                    { id: "education", label: locale === 'fr' ? "Éducation" : "Education", desc: locale === 'fr' ? "Admission, notation, évaluation" : "Access, grading, evaluation" },
                                                    { id: "employment", label: locale === 'fr' ? "Emploi & RH" : "Employment & HR", desc: locale === 'fr' ? "Recrutement, gestion, surveillance" : "Recruitment, management, monitoring" },
                                                    { id: "services", label: locale === 'fr' ? "Services Essentiels" : "Essential Services", desc: locale === 'fr' ? "Crédit, assurance, urgences" : "Credit, insurance, emergency" },
                                                    { id: "law_enforcement", label: locale === 'fr' ? "Forces de l'Ordre" : "Law Enforcement", desc: locale === 'fr' ? "Polygraphe, deepfake, risque" : "Polygraph, deepfake, risk" },
                                                    { id: "migration", label: locale === 'fr' ? "Migration & Asile" : "Migration & Asylum", desc: locale === 'fr' ? "Visas, contrôle aux frontières" : "Visas, border control" },
                                                    { id: "justice", label: locale === 'fr' ? "Justice" : "Justice", desc: locale === 'fr' ? "Tribunaux, interprétation légale" : "Courts, legal interpretation" },
                                                ].map((cat) => (
                                                    <div
                                                        key={cat.id}
                                                        onClick={() => handleCheckboxChange(cat.id, !formData[cat.id as keyof AISystemInput])}
                                                        className={`cursor-pointer p-3 sm:p-4 rounded-xl border-2 transition-all hover:shadow-md ${formData[cat.id as keyof AISystemInput]
                                                            ? 'bg-orange-50 dark:bg-orange-950/30 border-orange-300 dark:border-orange-800 shadow-orange-100 dark:shadow-none'
                                                            : 'bg-card border-border hover:border-orange-200 dark:hover:border-orange-900'
                                                            }`}
                                                    >
                                                        <div className="flex items-start gap-2 sm:gap-3">
                                                            <Checkbox
                                                                checked={formData[cat.id as keyof AISystemInput] as boolean}
                                                                className={formData[cat.id as keyof AISystemInput] ? "data-[state=checked]:bg-orange-500 border-orange-500" : ""}
                                                            />
                                                            <div className="flex-1">
                                                                <div className="font-bold text-xs sm:text-sm text-foreground">{cat.label}</div>
                                                                <div className="text-[10px] sm:text-xs text-muted-foreground leading-tight mt-0.5 sm:mt-1">{cat.desc}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Limited Risk */}
                                        <div className="space-y-3 sm:space-y-4 pt-2">
                                            <div className="flex items-center gap-2">
                                                <Info className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                                <h3 className="text-sm sm:text-base font-bold text-foreground">
                                                    {locale === 'fr' ? 'Risque Limité (Transparence)' : 'Limited Risk (Transparency)'}
                                                </h3>
                                            </div>
                                            <div
                                                onClick={() => handleCheckboxChange('is_gen_ai', !formData.is_gen_ai)}
                                                className={`cursor-pointer p-3 sm:p-4 rounded-xl border-2 transition-all hover:shadow-md ${formData.is_gen_ai
                                                    ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800 shadow-blue-100 dark:shadow-none'
                                                    : 'bg-card border-border hover:border-blue-200 dark:hover:border-blue-900'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-2 sm:gap-3">
                                                    <Checkbox
                                                        checked={formData.is_gen_ai}
                                                        className={formData.is_gen_ai ? "data-[state=checked]:bg-primary border-primary" : ""}
                                                    />
                                                    <div className="flex-1">
                                                        <div className="font-bold text-xs sm:text-sm text-foreground">
                                                            {locale === 'fr' ? "IA Générative (Chatbot, Création de contenu, Deepfake)" : "Generative AI (Chatbot, Content Creation, Deepfake)"}
                                                        </div>
                                                        <div className="text-[10px] sm:text-xs text-muted-foreground leading-tight mt-0.5 sm:mt-1">
                                                            {locale === 'fr'
                                                                ? "Systèmes interagissant avec des humains ou générant du contenu (texte, image, vidéo, audio)."
                                                                : "Systems interacting with humans or generating content (text, image, video, audio)."}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Health Domain Section */}
                                        <div className="space-y-3 sm:space-y-4 pt-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl">🏥</span>
                                                <h3 className="text-sm sm:text-base font-bold text-foreground">
                                                    {locale === 'fr' ? 'Domaine Santé (Annexe III, 5)' : 'Health Domain (Annex III, 5)'}
                                                </h3>
                                            </div>
                                            <div
                                                onClick={() => handleCheckboxChange('health_domain', !formData.health_domain)}
                                                className={`cursor-pointer p-3 sm:p-4 rounded-xl border-2 transition-all hover:shadow-md ${formData.health_domain
                                                    ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 shadow-rose-100 dark:shadow-none'
                                                    : 'bg-card border-border hover:border-rose-200 dark:hover:border-rose-900'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-2 sm:gap-3">
                                                    <Checkbox
                                                        checked={formData.health_domain}
                                                        className={formData.health_domain ? "data-[state=checked]:bg-rose-500 border-rose-500" : ""}
                                                    />
                                                    <div className="flex-1">
                                                        <div className="font-bold text-xs sm:text-sm text-foreground">
                                                            {locale === 'fr' ? "Système opérant dans le domaine de la santé/médical" : "System operates in health/medical domain"}
                                                        </div>
                                                        <div className="text-[10px] sm:text-xs text-muted-foreground leading-tight mt-0.5 sm:mt-1">
                                                            {locale === 'fr'
                                                                ? "Chatbots médicaux, analyse de symptômes, aide au diagnostic, recommandations de traitement."
                                                                : "Medical chatbots, symptom analysis, diagnosis assistance, treatment recommendations."}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Conditional health questions */}
                                            {formData.health_domain && (
                                                <div className="ml-4 space-y-2 border-l-2 border-rose-200 pl-4">
                                                    <div
                                                        onClick={() => handleCheckboxChange('influences_diagnosis', !formData.influences_diagnosis)}
                                                        className={`cursor-pointer p-3 rounded-lg border transition-all ${formData.influences_diagnosis
                                                            ? 'bg-red-50 dark:bg-red-950/30 border-red-400 dark:border-red-900'
                                                            : 'bg-card border-border dark:border-border/50'
                                                            }`}
                                                    >
                                                        <div className="flex items-start gap-2">
                                                            <Checkbox checked={formData.influences_diagnosis} />
                                                            <div>
                                                                <div className="font-semibold text-xs text-foreground">
                                                                    {locale === 'fr' ? "⚠️ Influence les décisions de diagnostic ou traitement" : "⚠️ Influences diagnosis or treatment decisions"}
                                                                </div>
                                                                <div className="text-[10px] text-muted-foreground">
                                                                    {locale === 'fr' ? "Directement ou via recommandations → Classement HIGH RISK" : "Directly or via recommendations → HIGH RISK classification"}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div
                                                        onClick={() => handleCheckboxChange('is_administrative_only', !formData.is_administrative_only)}
                                                        className={`cursor-pointer p-3 rounded-lg border transition-all ${formData.is_administrative_only
                                                            ? 'bg-green-50 dark:bg-green-950/30 border-green-400 dark:border-green-900'
                                                            : 'bg-card border-border dark:border-border/50'
                                                            }`}
                                                    >
                                                        <div className="flex items-start gap-2">
                                                            <Checkbox checked={formData.is_administrative_only} />
                                                            <div>
                                                                <div className="font-semibold text-xs text-foreground">
                                                                    {locale === 'fr' ? "✅ Tâches purement administratives" : "✅ Purely administrative tasks"}
                                                                </div>
                                                                <div className="text-[10px] text-muted-foreground">
                                                                    {locale === 'fr' ? "Codage CIM-10, structuration de documents, planification (exemption Art. 6(3) possible)" : "ICD-10 coding, document structuring, scheduling (Art. 6(3) exemption possible)"}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Synthetic Content / Deepfake Section */}
                                        <div className="space-y-3 sm:space-y-4 pt-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl">🎭</span>
                                                <h3 className="text-sm sm:text-base font-bold text-foreground">
                                                    {locale === 'fr' ? 'Contenu Synthétique / Deepfake (Article 50)' : 'Synthetic Content / Deepfake (Article 50)'}
                                                </h3>
                                            </div>
                                            <div
                                                onClick={() => handleCheckboxChange('generates_synthetic_content', !formData.generates_synthetic_content)}
                                                className={`cursor-pointer p-3 sm:p-4 rounded-xl border-2 transition-all hover:shadow-md ${formData.generates_synthetic_content
                                                    ? 'bg-purple-50 dark:bg-purple-950/30 border-purple-300 dark:border-purple-800 shadow-purple-100 dark:shadow-none'
                                                    : 'bg-card border-border hover:border-purple-200 dark:hover:border-purple-900'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-2 sm:gap-3">
                                                    <Checkbox
                                                        checked={formData.generates_synthetic_content}
                                                        className={formData.generates_synthetic_content ? "data-[state=checked]:bg-purple-500 border-purple-500" : ""}
                                                    />
                                                    <div className="flex-1">
                                                        <div className="font-bold text-xs sm:text-sm text-foreground">
                                                            {locale === 'fr' ? "Génère du contenu synthétique réaliste" : "Generates realistic synthetic content"}
                                                        </div>
                                                        <div className="text-[10px] sm:text-xs text-muted-foreground leading-tight mt-0.5 sm:mt-1">
                                                            {locale === 'fr'
                                                                ? "Images, vidéos, audio, avatars qui pourraient être confondus avec du contenu réel."
                                                                : "Images, videos, audio, avatars that could be mistaken for real content."}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Conditional content type selection */}
                                            {formData.generates_synthetic_content && (
                                                <div className="ml-4 border-l-2 border-purple-200 pl-4">
                                                    <p className="text-xs font-semibold text-muted-foreground mb-2">
                                                        {locale === 'fr' ? 'Types de contenu générés :' : 'Types of generated content:'}
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {[
                                                            { value: "image", labelFr: "🖼️ Images", labelEn: "🖼️ Images" },
                                                            { value: "video", labelFr: "🎬 Vidéos", labelEn: "🎬 Videos" },
                                                            { value: "audio", labelFr: "🔊 Audio", labelEn: "🔊 Audio" },
                                                            { value: "avatar", labelFr: "👤 Avatars", labelEn: "👤 Avatars" },
                                                            { value: "text", labelFr: "📝 Texte", labelEn: "📝 Text" }
                                                        ].map(type => {
                                                            const isSelected = formData.content_types?.includes(type.value as any)
                                                            return (
                                                                <button
                                                                    key={type.value}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const current = formData.content_types || []
                                                                        const next = isSelected
                                                                            ? current.filter(t => t !== type.value)
                                                                            : [...current, type.value as any]
                                                                        setFormData(prev => ({ ...prev, content_types: next }))
                                                                    }}
                                                                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${isSelected
                                                                        ? 'bg-purple-500 text-white border-purple-500'
                                                                        : 'bg-card border-border text-foreground hover:border-purple-300'
                                                                        }`}
                                                                >
                                                                    {locale === 'fr' ? type.labelFr : type.labelEn}
                                                                </button>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 p-4 sm:p-6 bg-secondary/50 border-t border-border">
                                    <Button variant="outline" onClick={prevStep} className="h-11 w-full sm:w-auto">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        {t.common.back}
                                    </Button>
                                    <Button
                                        onClick={nextStep}
                                        disabled={!isStep2Valid}
                                        className="bg-foreground hover:bg-foreground/90 text-background shadow-lg btn-premium h-11 px-6 w-full sm:w-auto"
                                    >
                                        {t.wizard.step3Title}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        )}

                        {step === 3 && (
                            <Card className="glass-card border-0 shadow-2xl overflow-hidden bg-card/90">
                                <CardHeader className="bg-gradient-to-r from-secondary/50 to-card border-b border-border pb-4 sm:pb-6">
                                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                                        <div className="p-2 rounded-xl bg-primary/10">
                                            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                        </div>
                                        <Badge variant="secondary" className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                                            {t.wizard.step3Title}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">{t.wizard.readyAnalyze}</CardTitle>
                                    <CardDescription className="text-sm sm:text-base text-muted-foreground">{t.wizard.reviewDesc}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6 sm:space-y-8 pt-6 sm:pt-8 pb-4">
                                    <div className="rounded-3xl border border-border bg-gradient-to-br from-secondary/40 to-card/80 p-4 sm:p-5 shadow-lg space-y-3">
                                        <div className="flex flex-col gap-1">
                                            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                                                {t.wizard.productName}
                                            </p>
                                            <p className="text-2xl font-bold text-foreground">{formData.name || "—"}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {formData.domain || (locale === 'fr' ? "Domaine à préciser" : "Specify domain")}
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge
                                                variant={formData.is_biometric ? "default" : "outline"}
                                                className={formData.is_biometric ? "bg-purple-600" : ""}
                                            >
                                                {locale === 'fr' ? 'Biométrie' : 'Biometric'}
                                            </Badge>
                                            <Badge
                                                variant={formData.is_critical_infrastructure ? "default" : "outline"}
                                                className={formData.is_critical_infrastructure ? "bg-orange-600" : ""}
                                            >
                                                {locale === 'fr' ? 'Infrastructure critique' : 'Critical infrastructure'}
                                            </Badge>
                                            <Badge
                                                variant={formData.is_safety_component ? "default" : "outline"}
                                                className={formData.is_safety_component ? "bg-emerald-600" : ""}
                                            >
                                                {locale === 'fr' ? 'Composant sécurité' : 'Safety component'}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {locale === 'fr'
                                                ? "Ces données aident à générer une analyse plus précise. Plus vous fournissez de contexte, plus l'IA pourra anticiper les obligations."
                                                : "This context helps deliver sharper analysis. The more you explain, the better the AI can surface obligations."}
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-sm font-semibold text-foreground">
                                            {locale === 'fr'
                                                ? "Donnez plus de détails sur les utilisateurs et les décisions automatiques"
                                                : "Provide extra detail on users and decision-making"}
                                        </p>
                                        <div className="grid gap-3 sm:grid-cols-3">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                    {locale === 'fr' ? 'Public cible' : 'User audience'}
                                                </Label>
                                                <Select
                                                    value={formData.user_type}
                                                    onValueChange={(value) =>
                                                        setFormData(prev => ({ ...prev, user_type: value as AISystemInput['user_type'] }))
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={locale === 'fr' ? 'Choisissez un profil' : 'Select a profile'} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {userTypeOptions.map(option => (
                                                            <SelectItem key={option.value} value={option.value}>
                                                                {getOptionLabel(option)}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                    {locale === 'fr' ? 'Automatisation' : 'Automation level'}
                                                </Label>
                                                <Select
                                                    value={formData.automation_level}
                                                    onValueChange={(value) =>
                                                        setFormData(prev => ({ ...prev, automation_level: value as AISystemInput['automation_level'] }))
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={locale === 'fr' ? 'Niveau' : 'Select level'} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {automationOptions.map(option => (
                                                            <SelectItem key={option.value} value={option.value}>
                                                                {getOptionLabel(option)}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                    {locale === 'fr' ? 'Type de sortie' : 'Output type'}
                                                </Label>
                                                <Select
                                                    value={formData.output_type}
                                                    onValueChange={(value) =>
                                                        setFormData(prev => ({ ...prev, output_type: value as AISystemInput['output_type'] }))
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={locale === 'fr' ? 'Choisissez' : 'Select output'} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {outputOptions.map(option => (
                                                            <SelectItem key={option.value} value={option.value}>
                                                                {getOptionLabel(option)}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-sm font-semibold text-foreground">
                                            {locale === 'fr' ? 'Types de données traitées' : 'Data types involved'}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {dataTypeOptions.map(option => {
                                                const active = formData.data_types?.includes(option.value)
                                                return (
                                                    <button
                                                        key={option.value}
                                                        type="button"
                                                        onClick={() => toggleDataType(option.value)}
                                                        aria-pressed={active}
                                                        className={`rounded-full px-3 py-1 text-xs font-semibold transition border ${active
                                                            ? 'bg-primary text-primary-foreground border-primary'
                                                            : 'bg-card border-border text-foreground hover:border-primary hover:bg-primary/5'
                                                            }`}
                                                    >
                                                        {getOptionLabel(option)}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-border bg-secondary/40 p-4 space-y-2 text-sm text-foreground">
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                checked={formData.affects_rights}
                                                onCheckedChange={(checked) => handleCheckboxChange('affects_rights', Boolean(checked))}
                                            />
                                            <p className="font-semibold">
                                                {locale === 'fr'
                                                    ? 'Affecte-t-il les droits fondamentaux (liberté d’expression, égalité, etc.) ?'
                                                    : 'Does it affect fundamental rights (expression, equality, etc.)?'}
                                            </p>
                                        </div>
                                        <p className="text-[11px] text-muted-foreground">
                                            {locale === 'fr'
                                                ? "Si oui, notez les droits impactés pour orienter la classification vers Annex III."
                                                : "If yes, specify impacted rights so the AI can safely flag Annex III exposures."}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            {locale === 'fr' ? 'Précisions supplémentaires' : 'Additional notes'}
                                        </Label>
                                        <Textarea
                                            name="additional_context"
                                            placeholder={locale === 'fr'
                                                ? "Ajoutez des enjeux, des exemples d'usages ou des zones d'incertitude."
                                                : "Add stakes, usage examples, or points of uncertainty."}
                                            className="min-h-[100px] text-sm border-border focus:border-primary focus:ring-primary/20 bg-background text-foreground placeholder:text-muted-foreground"
                                            value={formData.additional_context}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="rounded-2xl border border-dashed border-border bg-secondary/30 px-4 py-3 text-xs text-muted-foreground">
                                        {locale === 'fr'
                                            ? "Ce formulaire prépare un rapport préliminaire. Pour la certification, rencontrez un expert en IA Act ou contactez contact@kenshu.dev."
                                            : "This form feeds a preliminary report. For certified compliance, meet an AI Act expert or email contact@kenshu.dev."}
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 p-4 sm:p-6 bg-secondary/50 border-t border-border">
                                    <Button variant="outline" onClick={prevStep} className="h-11 w-full sm:w-auto">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        {t.common.back}
                                    </Button>
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-xl shadow-primary/30 btn-premium h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base w-full sm:w-auto"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                                                {t.common.analyzing}
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                                                {t.common.runAudit}
                                            </>
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        )}
                    </motion.div>
                </AnimatePresence>

                <p className="text-center text-xs text-muted-foreground mt-8 sm:mt-12 bg-card/60 backdrop-blur py-3 px-4 sm:px-6 rounded-full border border-border inline-block mx-auto max-w-full">
                    🔐 {t.common.privacyNote}
                </p>
            </main>
        </div>
    )
}
