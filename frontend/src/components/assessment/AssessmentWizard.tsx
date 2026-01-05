"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
    Shield,
    Brain,
    Laptop,
    Activity,
    ArrowLeft,
    ArrowRight,
    Loader2,
    Languages,
    Sparkles,
    Check,
    AlertCircle,
    Info,
    ShieldAlert
} from "lucide-react"
import { assessSystem } from "@/lib/api"
import { AISystemInput } from "@/types"
import { useTranslation } from "@/lib/LanguageContext"

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
        deployment_phase: "Development",
        language: locale
    })

    useEffect(() => {
        setFormData(prev => ({ ...prev, language: locale }))
    }, [locale])

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

    return (
        <div className="min-h-screen mesh-gradient noise-overlay">
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                            <Shield className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold text-lg text-slate-900">AI Act Auditor</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setLocale(locale === 'en' ? 'fr' : 'en')}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-white hover:bg-slate-50 transition-all text-xs font-bold shadow-sm"
                        >
                            <Languages className="h-3.5 w-3.5 text-blue-600" />
                            {locale === 'en' ? 'FR' : 'EN'}
                        </button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12 max-w-4xl">
                {/* Progress Steps */}
                <div className="mb-12">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        {steps.map((s, i) => (
                            <div key={s.id} className="flex items-center">
                                <motion.div
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${step >= s.id
                                        ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30'
                                        : 'bg-slate-100 text-slate-400'
                                        }`}
                                    animate={step === s.id ? { scale: [1, 1.05, 1] } : {}}
                                    transition={{ duration: 0.3 }}
                                >
                                    {step > s.id ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
                                </motion.div>
                                {i < steps.length - 1 && (
                                    <div className={`w-16 h-1 mx-2 rounded-full transition-colors ${step > s.id ? 'bg-blue-600' : 'bg-slate-200'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium text-slate-500">
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
                            <Card className="glass-card border-0 shadow-2xl shadow-slate-200/50 overflow-hidden">
                                <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b pb-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 rounded-xl bg-blue-100">
                                            <Laptop className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <Badge variant="secondary" className="text-xs font-bold uppercase tracking-wider">
                                            {t.wizard.step1Title}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-2xl font-bold text-slate-900">{t.wizard.identity}</CardTitle>
                                    <CardDescription className="text-base">{t.wizard.identityDesc}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6 pt-8 pb-4">
                                    <div className="grid gap-3">
                                        <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                                            {t.wizard.productName} <span className="text-red-500">*</span>
                                            {formData.name.trim().length > 0 && <Check className="h-4 w-4 text-emerald-500" />}
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            placeholder={t.wizard.productPlaceholder}
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="h-12 text-base border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 text-slate-900 bg-white placeholder:text-slate-400"
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="description" className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                                            {t.wizard.overview} <span className="text-red-500">*</span>
                                            {formData.description.trim().length > 10 && <Check className="h-4 w-4 text-emerald-500" />}
                                        </Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            placeholder={t.wizard.overviewPlaceholder}
                                            className="min-h-[120px] resize-none text-base border-slate-200 focus:border-blue-500 text-slate-900 bg-white placeholder:text-slate-400"
                                            value={formData.description}
                                            onChange={handleChange}
                                        />
                                        {formData.description.length > 0 && formData.description.trim().length <= 10 && (
                                            <p className="text-xs text-red-500 font-medium">
                                                {locale === 'fr' ? 'La description doit contenir au moins 10 caractères.' : 'Description must be at least 10 characters.'}
                                            </p>
                                        )}
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="intended_purpose" className="text-sm font-semibold text-slate-700">{t.wizard.purpose}</Label>
                                        <Textarea
                                            id="intended_purpose"
                                            name="intended_purpose"
                                            placeholder={t.wizard.purposePlaceholder}
                                            className="min-h-[100px] resize-none text-base border-slate-200 focus:border-blue-500 text-slate-900 bg-white placeholder:text-slate-400"
                                            value={formData.intended_purpose}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between p-6 bg-slate-50/50 border-t">
                                    <Button variant="ghost" onClick={() => router.push('/')} className="text-slate-500">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        {t.common.home}
                                    </Button>
                                    <Button
                                        onClick={nextStep}
                                        disabled={!isStep1Valid}
                                        className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg btn-premium h-11 px-6"
                                    >
                                        {t.common.next}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        )}

                        {step === 2 && (
                            <Card className="glass-card border-0 shadow-2xl shadow-slate-200/50 overflow-hidden">
                                <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b pb-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 rounded-xl bg-indigo-100">
                                            <Shield className="h-5 w-5 text-indigo-600" />
                                        </div>
                                        <Badge variant="secondary" className="text-xs font-bold uppercase tracking-wider">
                                            {t.wizard.step2Title}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-2xl font-bold text-slate-900">{t.wizard.drivers}</CardTitle>
                                    <CardDescription className="text-base">{t.wizard.driversDesc}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6 pt-8 pb-4">
                                    <div className="grid gap-3">
                                        <Label htmlFor="domain" className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                                            {t.wizard.domain} <span className="text-red-500">*</span>
                                            {formData.domain.trim().length > 0 && <Check className="h-4 w-4 text-emerald-500" />}
                                        </Label>
                                        <Input
                                            id="domain"
                                            name="domain"
                                            placeholder={t.wizard.domainPlaceholder}
                                            value={formData.domain}
                                            onChange={handleChange}
                                            className="h-12 text-base border-slate-200 focus:border-blue-500 text-slate-900 bg-white placeholder:text-slate-400"
                                        />
                                        <div className="flex items-start gap-2 bg-blue-50 p-3 rounded-lg text-xs text-blue-700">
                                            <Info className="h-4 w-4 shrink-0 mt-0.5" />
                                            {locale === 'fr'
                                                ? "Le domaine opérationnel (ex: RH, Santé, Transport) est un facteur clé pour la classification de risque selon l'Annexe III."
                                                : "The operational domain (e.g., HR, Health, Transport) is a key factor for risk classification under Annex III."}
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {/* High Risk Categories */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <ShieldAlert className="h-5 w-5 text-orange-500" />
                                                <h3 className="text-base font-bold text-slate-800">
                                                    {locale === 'fr' ? 'Systèmes à Haut Risque (Annexe III)' : 'High-Risk Systems (Annex III)'}
                                                </h3>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                                                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all hover:shadow-md ${formData[cat.id as keyof AISystemInput]
                                                            ? 'bg-orange-50 border-orange-300 shadow-orange-100'
                                                            : 'bg-white border-slate-200 hover:border-orange-200'
                                                            }`}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <Checkbox
                                                                checked={formData[cat.id as keyof AISystemInput] as boolean}
                                                                className={formData[cat.id as keyof AISystemInput] ? "data-[state=checked]:bg-orange-500 border-orange-500" : ""}
                                                            />
                                                            <div className="flex-1">
                                                                <div className="font-bold text-sm text-slate-800">{cat.label}</div>
                                                                <div className="text-xs text-slate-500 leading-tight mt-1">{cat.desc}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Limited Risk */}
                                        <div className="space-y-4 pt-2">
                                            <div className="flex items-center gap-2">
                                                <Info className="h-5 w-5 text-blue-500" />
                                                <h3 className="text-base font-bold text-slate-800">
                                                    {locale === 'fr' ? 'Risque Limité (Transparence)' : 'Limited Risk (Transparency)'}
                                                </h3>
                                            </div>
                                            <div
                                                onClick={() => handleCheckboxChange('is_gen_ai', !formData.is_gen_ai)}
                                                className={`cursor-pointer p-4 rounded-xl border-2 transition-all hover:shadow-md ${formData.is_gen_ai
                                                    ? 'bg-blue-50 border-blue-300 shadow-blue-100'
                                                    : 'bg-white border-slate-200 hover:border-blue-200'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <Checkbox
                                                        checked={formData.is_gen_ai}
                                                        className={formData.is_gen_ai ? "data-[state=checked]:bg-blue-600 border-blue-600" : ""}
                                                    />
                                                    <div className="flex-1">
                                                        <div className="font-bold text-sm text-slate-800">
                                                            {locale === 'fr' ? "IA Générative (Chatbot, Création de contenu, Deepfake)" : "Generative AI (Chatbot, Content Creation, Deepfake)"}
                                                        </div>
                                                        <div className="text-xs text-slate-500 leading-tight mt-1">
                                                            {locale === 'fr'
                                                                ? "Systèmes interagissant avec des humains ou générant du contenu (texte, image, vidéo, audio)."
                                                                : "Systems interacting with humans or generating content (text, image, video, audio)."}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between p-6 bg-slate-50/50 border-t">
                                    <Button variant="outline" onClick={prevStep} className="h-11">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        {t.common.back}
                                    </Button>
                                    <Button
                                        onClick={nextStep}
                                        disabled={!isStep2Valid}
                                        className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg btn-premium h-11 px-6"
                                    >
                                        {t.wizard.step3Title}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        )}

                        {step === 3 && (
                            <Card className="glass-card border-0 shadow-2xl shadow-slate-200/50 overflow-hidden">
                                <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b pb-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 rounded-xl bg-purple-100">
                                            <Sparkles className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <Badge variant="secondary" className="text-xs font-bold uppercase tracking-wider">
                                            {t.wizard.step3Title}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-2xl font-bold text-slate-900">{t.wizard.readyAnalyze}</CardTitle>
                                    <CardDescription className="text-base">{t.wizard.reviewDesc}</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-8 pb-4">
                                    <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 space-y-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <p className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">{t.wizard.productName}</p>
                                                <p className="font-semibold text-lg text-slate-900">{formData.name || "—"}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">{t.wizard.domain}</p>
                                                <p className="font-semibold text-lg text-blue-600">{formData.domain || "—"}</p>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-slate-200">
                                            <p className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">
                                                {locale === 'fr' ? 'Indicateurs de risque' : 'Risk indicators'}
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                <Badge variant={formData.is_biometric ? "default" : "outline"} className={formData.is_biometric ? "bg-purple-600" : ""}>
                                                    {locale === 'fr' ? 'Biométrique' : 'Biometric'}
                                                </Badge>
                                                <Badge variant={formData.is_critical_infrastructure ? "default" : "outline"} className={formData.is_critical_infrastructure ? "bg-orange-600" : ""}>
                                                    Infrastructure
                                                </Badge>
                                                <Badge variant={formData.is_safety_component ? "default" : "outline"} className={formData.is_safety_component ? "bg-emerald-600" : ""}>
                                                    Safety
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between p-6 bg-slate-50/50 border-t">
                                    <Button variant="outline" onClick={prevStep} className="h-11">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        {t.common.back}
                                    </Button>
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-600/30 btn-premium h-12 px-8 text-base"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                {t.common.analyzing}
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="mr-2 h-5 w-5" />
                                                {t.common.runAudit}
                                            </>
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        )}
                    </motion.div>
                </AnimatePresence>

                <p className="text-center text-xs text-slate-400 mt-12 bg-white/60 backdrop-blur py-3 px-6 rounded-full border inline-block mx-auto">
                    🔐 {t.common.privacyNote}
                </p>
            </main>
        </div>
    )
}
