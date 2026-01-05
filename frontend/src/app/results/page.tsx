"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AnalysisResult, RiskLevel, AISystemInput } from "@/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
    AlertTriangle,
    CheckCircle2,
    Check,
    Info,
    Ban,
    Download,
    ArrowLeft,
    FileCheck,
    ShieldAlert,
    ChevronRight,
    GanttChart,
    Languages,
    Shield,
    Sparkles,
    ExternalLink,
    Printer,
    Share2,
    Bot
} from "lucide-react"
import { exportReport } from "@/lib/api"
import { useTranslation } from "@/lib/LanguageContext"
import { AdvisorChat } from "@/components/AdvisorChat"

export default function ResultsPage() {
    const { t, locale, setLocale } = useTranslation()
    const [result, setResult] = useState<AnalysisResult | null>(null)
    const [inputData, setInputData] = useState<AISystemInput | null>(null)
    const [downloading, setDownloading] = useState(false)
    const router = useRouter()
    const advisorRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const storedResult = localStorage.getItem("auditResult")
        const storedInput = localStorage.getItem("auditInput")

        if (storedResult && storedInput) {
            setResult(JSON.parse(storedResult))
            setInputData(JSON.parse(storedInput))
        } else {
            router.push("/assess")
        }
    }, [router])

    // Auto-scroll to advisor after results are displayed (strategic UX)
    useEffect(() => {
        if (result && advisorRef.current) {
            const timer = setTimeout(() => {
                advisorRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                })
            }, 2500) // Wait 2.5s for user to see results first

            return () => clearTimeout(timer)
        }
    }, [result])

    const handleDownload = async () => {
        if (!inputData) return;
        setDownloading(true);
        try {
            const blob = await exportReport(inputData);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `AI_Risk_Report_${inputData.name.replace(/\s+/g, '_')}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (e) {
            console.error(e);
            alert(locale === 'fr' ? "Erreur lors du téléchargement." : "Failed to download PDF");
        } finally {
            setDownloading(false);
        }
    }

    const handleShare = async () => {
        const shareData = {
            title: 'AI Act Auditor Assessment',
            text: `Risk Assessment for ${inputData?.name}: ${result?.risk_level}`,
            url: window.location.href,
        }

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Share canceled');
            }
        } else {
            // Fallback
            navigator.clipboard.writeText(window.location.href);
            alert(locale === 'fr' ? 'Lien copié dans le presse-papier !' : 'Link copied to clipboard!');
        }
    }

    if (!result) return (
        <div className="flex items-center justify-center min-h-screen mesh-gradient">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 animate-pulse"></div>
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-white" />
                </div>
                <p className="text-slate-500 font-medium">{t.common.analyzing}</p>
            </div>
        </div>
    )

    const getRiskConfig = (level: RiskLevel) => {
        const lvl = level.toLowerCase();
        if (lvl.includes("prohibit") || lvl.includes("prohibé")) {
            return {
                gradient: "from-red-500 to-rose-600",
                bg: "bg-red-50",
                border: "border-red-200",
                text: "text-red-700",
                icon: <Ban className="h-10 w-10 text-white" />,
                description: locale === 'fr' ? "Ce système est probablement interdit en vertu de l'article 5 de l'IA Act." : "This system is likely prohibited under Article 5 of the EU AI Act."
            }
        }
        if (lvl.includes("high") || lvl.includes("haut")) {
            return {
                gradient: "from-orange-500 to-amber-600",
                bg: "bg-orange-50",
                border: "border-orange-200",
                text: "text-orange-700",
                icon: <AlertTriangle className="h-10 w-10 text-white" />,
                description: locale === 'fr' ? "Ce système relève de l'Annexe III et nécessite un effort de conformité important." : "This system falls under Annex III and requires significant compliance effort."
            }
        }
        if (lvl.includes("limited") || lvl.includes("limité")) {
            return {
                gradient: "from-blue-500 to-cyan-600",
                bg: "bg-blue-50",
                border: "border-blue-200",
                text: "text-blue-700",
                icon: <Info className="h-10 w-10 text-white" />,
                description: locale === 'fr' ? "Des obligations de transparence s'appliquent." : "Transparency obligations apply."
            }
        }
        return {
            gradient: "from-emerald-500 to-teal-600",
            bg: "bg-emerald-50",
            border: "border-emerald-200",
            text: "text-emerald-700",
            icon: <CheckCircle2 className="h-10 w-10 text-white" />,
            description: locale === 'fr' ? "Aucune obligation spécifique sous l'IA Act." : "No specific obligations under the AI Act."
        }
    }

    const config = getRiskConfig(result.risk_level)

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-40 backdrop-blur-xl bg-white/80">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl shadow-lg">
                                <Shield className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-bold text-lg hidden sm:block text-slate-900">AI Act Auditor</span>
                        </Link>
                        <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
                        <Badge variant="secondary" className="hidden sm:flex">
                            {locale === 'fr' ? 'Rapport d\'audit' : 'Audit Report'}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setLocale(locale === 'en' ? 'fr' : 'en')}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-white hover:bg-slate-50 transition-all text-xs font-bold shadow-sm text-slate-700"
                        >
                            <Languages className="h-3.5 w-3.5 text-blue-600" />
                            {locale === 'en' ? 'FR' : 'EN'}
                        </button>
                        <Button variant="outline" size="sm" onClick={() => router.push("/assess")} className="hidden sm:flex">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {t.common.editData}
                        </Button>
                        <Button
                            onClick={handleDownload}
                            disabled={downloading}
                            className="bg-slate-900 hover:bg-slate-800 shadow-lg"
                        >
                            <Download className="mr-2 h-4 w-4" />
                            {downloading ? t.common.generating : t.common.exportPdf}
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12 max-w-6xl">
                {/* Risk Score Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${config.gradient} p-8 md:p-12 text-white shadow-2xl`}>
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                            <div className="shrink-0">
                                <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center shadow-xl">
                                    {config.icon}
                                </div>
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <p className="text-white/80 text-sm font-medium uppercase tracking-wider mb-2">
                                    {t.common.riskLevel}
                                </p>
                                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
                                    {result.risk_level}
                                </h1>
                                <p className="text-white/90 text-lg max-w-xl">
                                    {config.description}
                                </p>
                            </div>
                            <div className="shrink-0 text-center md:text-right">
                                <p className="text-white/60 text-xs uppercase tracking-widest mb-1">{t.common.confidence}</p>
                                <div className="text-5xl font-mono font-black">{(result.risk_score * 100).toFixed(0)}%</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: System Profile */}
                    <div className="lg:col-span-1 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card className="glass-card border-0 shadow-xl overflow-hidden">
                                <CardHeader className="border-b bg-white/50 pb-4">
                                    <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
                                        <GanttChart className="h-5 w-5 text-blue-600" />
                                        {t.common.systemProfile}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-5">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{locale === 'fr' ? 'Projet' : 'Project'}</label>
                                        <p className="font-semibold text-lg text-slate-900">{inputData?.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{locale === 'fr' ? 'Domaine' : 'Domain'}</label>
                                        <p className="font-semibold text-blue-600">{inputData?.domain}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{locale === 'fr' ? 'Finalité' : 'Purpose'}</label>
                                        <p className="text-sm text-slate-600 line-clamp-3">{inputData?.intended_purpose}</p>
                                    </div>
                                    <div className="pt-4 border-t">
                                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2 block">{locale === 'fr' ? 'Indicateurs' : 'Indicators'}</label>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant={inputData?.is_biometric ? "default" : "outline"} className={inputData?.is_biometric ? "bg-purple-600" : "text-slate-400"}>
                                                Bio
                                            </Badge>
                                            <Badge variant={inputData?.is_critical_infrastructure ? "default" : "outline"} className={inputData?.is_critical_infrastructure ? "bg-orange-600" : "text-slate-400"}>
                                                Infra
                                            </Badge>
                                            <Badge variant={inputData?.is_safety_component ? "default" : "outline"} className={inputData?.is_safety_component ? "bg-emerald-600" : "text-slate-400"}>
                                                Safety
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-3"
                        >
                            <Button variant="outline" className="w-full justify-start h-12 text-slate-700 border-slate-200 bg-white hover:bg-slate-50" onClick={() => window.print()}>
                                <Printer className="mr-3 h-4 w-4" />
                                {locale === 'fr' ? 'Imprimer la page' : 'Print page'}
                            </Button>
                            <Button variant="outline" className="w-full justify-start h-12 text-slate-700 border-slate-200 bg-white hover:bg-slate-50" onClick={handleShare}>
                                <Share2 className="mr-3 h-4 w-4" />
                                {locale === 'fr' ? 'Partager' : 'Share'}
                            </Button>
                            <Button variant="outline" className="w-full justify-start h-12 text-slate-700 border-slate-200 bg-white hover:bg-slate-50" asChild>
                                <Link href="https://eur-lex.europa.eu/eli/reg/2024/1689/oj" target="_blank">
                                    <ExternalLink className="mr-3 h-4 w-4" />
                                    {locale === 'fr' ? 'Texte officiel IA Act' : 'Official AI Act text'}
                                </Link>
                            </Button>
                        </motion.div>
                    </div>

                    {/* Right: Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Justification */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                        >
                            <Card className="glass-card border-0 shadow-xl overflow-hidden">
                                <CardHeader className="border-b bg-white/50">
                                    <CardTitle className="flex items-center gap-2 text-xl text-slate-900">
                                        <Info className="h-6 w-6 text-indigo-500" />
                                        {t.common.legalJustification}
                                    </CardTitle>
                                    <CardDescription>{locale === 'fr' ? 'Pourquoi nous avons classé votre système ainsi' : 'Why we classified your system this way'}</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-4">
                                    {result.justification.map((justif, i) => (
                                        <div key={i} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 items-start hover:bg-white hover:shadow-md transition-all">
                                            <div className="bg-white p-2 rounded-xl shadow-sm shrink-0 border">
                                                <ChevronRight className="h-4 w-4 text-slate-400" />
                                            </div>
                                            <p className="text-slate-700 leading-relaxed">{justif}</p>
                                        </div>
                                    ))}

                                    {result.matched_rules.length > 0 && (
                                        <div className="pt-6 mt-6 border-t">
                                            <h4 className="text-xs font-bold uppercase text-slate-400 mb-4 tracking-widest">
                                                {locale === 'fr' ? 'Dispositions légales' : 'Legal provisions'}
                                            </h4>
                                            <div className="space-y-3">
                                                {result.matched_rules.map((rule, i) => (
                                                    <div key={i} className="p-4 rounded-2xl border-2 border-dashed border-slate-150 flex justify-between items-center hover:border-blue-200 hover:bg-blue-50/50 transition-all group">
                                                        <div>
                                                            <span className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{rule.category}</span>
                                                            <span className="text-xs text-slate-500 block mt-0.5">{rule.reason}</span>
                                                        </div>
                                                        <Badge variant="outline" className="font-mono text-[10px] bg-white shrink-0 ml-4">{rule.reference}</Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Obligations Checklist */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                        >
                            <Card className="border-0 shadow-xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
                                <CardHeader className="border-b border-white/10 pb-6">
                                    <CardTitle className="flex items-center gap-2 text-xl text-white">
                                        <FileCheck className="h-6 w-6 text-emerald-400" />
                                        {t.common.complianceChecklist}
                                    </CardTitle>
                                    <CardDescription className="text-slate-400">
                                        {locale === 'fr' ? `Actions requises pour un niveau ${result.risk_level}` : `Required actions for ${result.risk_level}`}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <ul className="grid grid-cols-1 gap-3">
                                        {result.obligations.map((obit, i) => {
                                            // Extract Article number to create a link
                                            const match = obit.match(/Art\.\s*(\d+)/);
                                            const articleNum = match ? match[1] : null;
                                            const link = articleNum
                                                ? `https://artificialintelligenceact.eu/article/${articleNum}/`
                                                : "https://eur-lex.europa.eu/eli/reg/2024/1689/oj";

                                            return (
                                                <motion.li
                                                    key={i}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.3 + i * 0.05 }}
                                                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group"
                                                >
                                                    <div className="mt-0.5 bg-emerald-500/20 p-1.5 rounded-full text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors shrink-0">
                                                        <CheckCircle2 className="h-4 w-4" />
                                                    </div>
                                                    <span className="text-white/90 leading-relaxed flex-1">{obit}</span>
                                                    {articleNum && (
                                                        <Button variant="ghost" size="sm" asChild className="shrink-0 text-slate-400 hover:text-white hover:bg-white/10 h-8 w-8 p-0 rounded-full">
                                                            <Link href={link} target="_blank" title={locale === 'fr' ? "Lire l'article" : "Read article"}>
                                                                <ExternalLink className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                    )}
                                                </motion.li>
                                            )
                                        })}
                                    </ul>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                        >
                            <Alert className="rounded-3xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                    <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
                                        <ShieldAlert className="h-8 w-8 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <AlertTitle className="text-xl font-bold text-slate-900 mb-2">{t.common.needPremium}</AlertTitle>
                                        <AlertDescription className="text-slate-600 leading-relaxed">
                                            {locale === 'fr'
                                                ? "Notre outil fournit une évaluation préliminaire. Pour un accompagnement complet et certifié, contactez nos experts."
                                                : "Our tool provides a preliminary assessment. For certified compliance support, connect with our experts."}
                                        </AlertDescription>
                                    </div>
                                    <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shrink-0">
                                        {t.common.requestPremium}
                                    </Button>
                                </div>
                            </Alert>
                        </motion.div>

                        {/* Strategic CTA for AI Advisor */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.38 }}
                        >
                            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 text-white shadow-2xl">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                <div className="relative z-10 flex items-start gap-4">
                                    <div className="shrink-0 p-3 bg-white/20 backdrop-blur rounded-2xl">
                                        <Bot className="h-8 w-8 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-black mb-2">
                                            💬 {locale === 'fr' ? 'Des questions sur votre conformité ?' : 'Questions about compliance?'}
                                        </h3>
                                        <p className="text-blue-100 mb-3">
                                            {locale === 'fr'
                                                ? "Conseiller IA • Réponses sourcées • Données anonymisées"
                                                : "AI Advisor • Sourced answers • Anonymized data"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* AI Advisor Chat */}
                        <motion.div
                            ref={advisorRef}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <AdvisorChat
                                systemData={inputData}
                                riskLevel={result.risk_level}
                                locale={locale}
                            />
                        </motion.div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-20 pt-8 border-t text-center space-y-4">
                    <p className="text-xs text-slate-400 uppercase tracking-widest">AI Act Auditor 2025 • Alpha v0.1</p>
                    <p className="text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        {t.common.disclaimer}
                    </p>
                </div>
            </main>
        </div>
    )
}
