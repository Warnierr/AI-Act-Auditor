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

    const handlePrint = () => {
        // Prepare document title for print
        const originalTitle = document.title;
        document.title = `AI_Act_Compliance_Report_${inputData?.name?.replace(/\s+/g, '_') || 'System'}`;
        
        // Add print-specific classes
        document.body.classList.add('printing');
        
        // Trigger print
        window.print();
        
        // Restore original title and cleanup
        document.title = originalTitle;
        document.body.classList.remove('printing');
    };
    
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
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-card border-b border-border sticky top-0 z-40 backdrop-blur-xl bg-card/80">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <Link href="/" className="flex items-center gap-2 sm:gap-3">
                            <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-xl shadow-lg">
                                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
                            </div>
                            <span className="font-bold text-base sm:text-lg hidden sm:block text-foreground">AI Act Auditor</span>
                        </Link>
                        <div className="h-6 w-px bg-border hidden sm:block"></div>
                        <Badge variant="secondary" className="hidden sm:flex text-xs">
                            {locale === 'fr' ? 'Rapport d\'audit' : 'Audit Report'}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2">
                        <button
                            onClick={() => setLocale(locale === 'en' ? 'fr' : 'en')}
                            className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-full border border-border bg-card hover:bg-muted transition-all text-xs font-bold shadow-sm text-foreground"
                        >
                            <Languages className="h-3.5 w-3.5 text-primary" />
                            {locale === 'en' ? 'FR' : 'EN'}
                        </button>
                        <Button variant="outline" size="sm" onClick={() => router.push("/assess")} className="hidden md:flex">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {t.common.editData}
                        </Button>
                        <Button
                            onClick={handleDownload}
                            disabled={downloading}
                            size="sm"
                            className="bg-foreground hover:bg-foreground/90 text-background shadow-lg"
                        >
                            <Download className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">{downloading ? t.common.generating : t.common.exportPdf}</span>
                            <span className="sm:hidden">PDF</span>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 sm:py-12 max-w-6xl">
                {/* Risk Score Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 sm:mb-12"
                >
                    <div className={`relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br ${config.gradient} p-6 sm:p-8 md:p-12 text-white shadow-2xl`}>
                        <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-8">
                            <div className="shrink-0">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl sm:rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center shadow-xl">
                                    {config.icon}
                                </div>
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <p className="text-white/80 text-xs sm:text-sm font-medium uppercase tracking-wider mb-2">
                                    {t.common.riskLevel}
                                </p>
                                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight mb-2 sm:mb-4">
                                    {result.risk_level}
                                </h1>
                                <p className="text-white/90 text-sm sm:text-base md:text-lg max-w-xl">
                                    {config.description}
                                </p>
                            </div>
                            <div className="shrink-0 text-center md:text-right">
                                <p className="text-white/60 text-xs uppercase tracking-widest mb-1">{t.common.confidence}</p>
                                <div className="text-3xl sm:text-4xl md:text-5xl font-mono font-black">{(result.risk_score * 100).toFixed(0)}%</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Left: System Profile */}
                    <div className="lg:col-span-1 space-y-4 sm:space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card className="glass-card border-0 shadow-xl overflow-hidden">
                                <CardHeader className="border-b border-border bg-card/50 pb-4">
                                    <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-foreground">
                                        <GanttChart className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                        {t.common.systemProfile}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4 sm:pt-6 space-y-4 sm:space-y-5">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">{locale === 'fr' ? 'Projet' : 'Project'}</label>
                                        <p className="font-semibold text-base sm:text-lg text-foreground">{inputData?.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">{locale === 'fr' ? 'Domaine' : 'Domain'}</label>
                                        <p className="font-semibold text-primary">{inputData?.domain}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">{locale === 'fr' ? 'Finalité' : 'Purpose'}</label>
                                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3">{inputData?.intended_purpose}</p>
                                    </div>
                                    <div className="pt-4 border-t border-border">
                                        <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider mb-2 block">{locale === 'fr' ? 'Indicateurs' : 'Indicators'}</label>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant={inputData?.is_biometric ? "default" : "outline"} className={inputData?.is_biometric ? "bg-purple-600" : ""}>
                                                Bio
                                            </Badge>
                                            <Badge variant={inputData?.is_critical_infrastructure ? "default" : "outline"} className={inputData?.is_critical_infrastructure ? "bg-orange-600" : ""}>
                                                Infra
                                            </Badge>
                                            <Badge variant={inputData?.is_safety_component ? "default" : "outline"} className={inputData?.is_safety_component ? "bg-emerald-600" : ""}>
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
                            className="space-y-2 sm:space-y-3"
                        >
                            <Button variant="outline" className="w-full justify-start h-10 sm:h-12 text-xs sm:text-sm text-foreground border-border bg-card hover:bg-muted" onClick={handlePrint}>
                                <Printer className="mr-2 sm:mr-3 h-3 w-3 sm:h-4 sm:w-4" />
                                {locale === 'fr' ? 'Imprimer le rapport' : 'Print report'}
                            </Button>
                            <Button variant="outline" className="w-full justify-start h-10 sm:h-12 text-xs sm:text-sm text-foreground border-border bg-card hover:bg-muted" onClick={handleShare}>
                                <Share2 className="mr-2 sm:mr-3 h-3 w-3 sm:h-4 sm:w-4" />
                                {locale === 'fr' ? 'Partager' : 'Share'}
                            </Button>
                            <Button variant="outline" className="w-full justify-start h-10 sm:h-12 text-xs sm:text-sm text-foreground border-border bg-card hover:bg-muted" asChild>
                                <Link href="https://eur-lex.europa.eu/eli/reg/2024/1689/oj" target="_blank">
                                    <ExternalLink className="mr-2 sm:mr-3 h-3 w-3 sm:h-4 sm:w-4" />
                                    {locale === 'fr' ? 'Texte officiel IA Act' : 'Official AI Act text'}
                                </Link>
                            </Button>
                        </motion.div>
                    </div>

                    {/* Right: Details */}
                    <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                        {/* Justification */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                        >
                            <Card className="glass-card border-0 shadow-xl overflow-hidden">
                                <CardHeader className="border-b border-border bg-card/50">
                                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-foreground">
                                        <Info className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                                        {t.common.legalJustification}
                                    </CardTitle>
                                    <CardDescription className="text-xs sm:text-sm">{locale === 'fr' ? 'Pourquoi nous avons classé votre système ainsi' : 'Why we classified your system this way'}</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-4 sm:pt-6 space-y-3 sm:space-y-4">
                                    {result.justification.map((justif, i) => (
                                        <div key={i} className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-secondary border border-border items-start hover:bg-card hover:shadow-md transition-all">
                                            <div className="bg-card p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-sm shrink-0 border border-border">
                                                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                                            </div>
                                            <p className="text-xs sm:text-sm text-foreground leading-relaxed">{justif}</p>
                                        </div>
                                    ))}

                                    {result.matched_rules.length > 0 && (
                                        <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-border">
                                            <h4 className="text-[10px] sm:text-xs font-bold uppercase text-muted-foreground mb-3 sm:mb-4 tracking-widest">
                                                {locale === 'fr' ? 'Dispositions légales' : 'Legal provisions'}
                                            </h4>
                                            <div className="space-y-2 sm:space-y-3">
                                                {result.matched_rules.map((rule, i) => (
                                                    <div key={i} className="p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 border-dashed border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 hover:border-primary hover:bg-primary/5 transition-all group">
                                                        <div className="flex-1">
                                                            <span className="font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors">{rule.category}</span>
                                                            <span className="text-[10px] sm:text-xs text-muted-foreground block mt-0.5">{rule.reason}</span>
                                                        </div>
                                                        <Badge variant="outline" className="font-mono text-[10px] bg-card shrink-0">{rule.reference}</Badge>
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
                            <Card className="border-0 shadow-xl overflow-hidden bg-gradient-to-br from-foreground to-foreground/90">
                                <CardHeader className="border-b border-white/10 pb-4 sm:pb-6">
                                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-background">
                                        <FileCheck className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400" />
                                        {t.common.complianceChecklist}
                                    </CardTitle>
                                    <CardDescription className="text-background/70 text-xs sm:text-sm">
                                        {locale === 'fr' ? `Actions requises pour un niveau ${result.risk_level}` : `Required actions for ${result.risk_level}`}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-4 sm:pt-6">
                                    <ul className="grid grid-cols-1 gap-2 sm:gap-3">
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
                                                    className="flex items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group"
                                                >
                                                    <div className="mt-0.5 bg-emerald-500/20 p-1 sm:p-1.5 rounded-full text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors shrink-0">
                                                        <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                                    </div>
                                                    <span className="text-xs sm:text-sm text-white/90 leading-relaxed flex-1">{obit}</span>
                                                    {articleNum && (
                                                        <Button variant="ghost" size="sm" asChild className="shrink-0 text-white/60 hover:text-white hover:bg-white/10 h-7 w-7 sm:h-8 sm:w-8 p-0 rounded-full">
                                                            <Link href={link} target="_blank" title={locale === 'fr' ? "Lire l'article" : "Read article"}>
                                                                <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
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
                            <Alert className="rounded-2xl sm:rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10 p-4 sm:p-8">
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-6">
                                    <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg">
                                        <ShieldAlert className="h-6 w-6 sm:h-8 sm:w-8 text-primary-foreground" />
                                    </div>
                                    <div className="flex-1">
                                        <AlertTitle className="text-lg sm:text-xl font-bold text-foreground mb-2">{t.common.needPremium}</AlertTitle>
                                        <AlertDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                            {locale === 'fr'
                                                ? "Notre outil fournit une évaluation préliminaire. Pour un accompagnement complet et certifié, contactez nos experts."
                                                : "Our tool provides a preliminary assessment. For certified compliance support, connect with our experts."}
                                        </AlertDescription>
                                    </div>
                                    <Button size="sm" className="bg-primary hover:bg-primary/90 shadow-lg shrink-0 w-full md:w-auto">
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
                            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary via-accent to-primary/80 p-4 sm:p-8 text-primary-foreground shadow-2xl">
                                <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                <div className="relative z-10 flex items-start gap-3 sm:gap-4">
                                    <div className="shrink-0 p-2 sm:p-3 bg-white/20 backdrop-blur rounded-xl sm:rounded-2xl">
                                        <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-primary-foreground" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg sm:text-2xl font-black mb-1 sm:mb-2">
                                            💬 {locale === 'fr' ? 'Des questions sur votre conformité ?' : 'Questions about compliance?'}
                                        </h3>
                                        <p className="text-xs sm:text-base text-primary-foreground/80 mb-2 sm:mb-3">
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

                {/* Print-Only Content: Professional Report Sections */}
                <div className="hidden print:block mt-12 space-y-8 page-break-before">
                    {/* Cover Page Info for Print */}
                    <div className="print-header text-center space-y-4">
                        <h1 className="text-4xl font-bold text-primary">EU AI Act Compliance Audit</h1>
                        <div className="text-2xl font-semibold">{inputData?.name}</div>
                        <div className="text-sm text-muted-foreground print-date">
                            Report Generated: {new Date().toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { 
                                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                            })}
                        </div>
                        <div className="text-lg">
                            <strong>Reference:</strong> Regulation (EU) 2024/1689
                        </div>
                    </div>
                    
                    {/* Legal References Section */}
                    <div className="print-keep-together">
                        <h2 className="text-2xl font-bold mb-4">Legal Framework</h2>
                        <div className="legal-ref">
                            <strong>Primary Legislation:</strong> Regulation (EU) 2024/1689 of the European Parliament and of the Council on laying down harmonised rules on artificial intelligence (Artificial Intelligence Act)
                        </div>
                        <div className="legal-ref">
                            <strong>Official Text:</strong> eur-lex.europa.eu/eli/reg/2024/1689/oj
                        </div>
                        <div className="legal-ref">
                            <strong>Annotated Version:</strong> artificialintelligenceact.eu
                        </div>
                    </div>
                    
                    {/* Key Articles Reference Table */}
                    {result.risk_level.toLowerCase().includes('high') && (
                        <div className="print-keep-together">
                            <h2 className="text-2xl font-bold mb-4">Key Regulatory Articles</h2>
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="border p-2 bg-primary text-white">Article</th>
                                        <th className="border p-2 bg-primary text-white">Title</th>
                                        <th className="border p-2 bg-primary text-white">Key Requirement</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border p-2">Art. 9</td>
                                        <td className="border p-2">Risk Management System</td>
                                        <td className="border p-2">Establish continuous risk management throughout lifecycle</td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">Art. 10</td>
                                        <td className="border p-2">Data Governance</td>
                                        <td className="border p-2">Ensure data quality, relevance, and representativeness</td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">Art. 11</td>
                                        <td className="border p-2">Technical Documentation</td>
                                        <td className="border p-2">Maintain comprehensive technical documentation</td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">Art. 12</td>
                                        <td className="border p-2">Record-Keeping</td>
                                        <td className="border p-2">Implement automatic logging of events</td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">Art. 13</td>
                                        <td className="border p-2">Transparency & Information</td>
                                        <td className="border p-2">Provide clear information to deployers and users</td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">Art. 14</td>
                                        <td className="border p-2">Human Oversight</td>
                                        <td className="border p-2">Enable effective human oversight measures</td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">Art. 15</td>
                                        <td className="border p-2">Accuracy & Robustness</td>
                                        <td className="border p-2">Achieve appropriate levels of accuracy and resilience</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                    
                    {/* Implementation Timeline */}
                    <div className="print-keep-together">
                        <h2 className="text-2xl font-bold mb-4">Implementation Timeline</h2>
                        <div className="timeline-print space-y-3">
                            <div className="timeline-item">
                                <div className="timeline-date">2 February 2025</div>
                                <div>Prohibition of AI practices (Article 5) enters into force</div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-date">2 August 2025</div>
                                <div>Obligations for general-purpose AI models (Chapter V)</div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-date">2 August 2026</div>
                                <div>High-risk AI systems (Annex III) - Full compliance required</div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-date">2 August 2027</div>
                                <div>Obligations for high-risk AI systems already on market</div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Key Definitions */}
                    <div className="print-keep-together">
                        <h2 className="text-2xl font-bold mb-4">Key Definitions</h2>
                        <div className="info-box">
                            <p className="mb-2"><strong>AI System:</strong> Machine-based system that is designed to operate with varying levels of autonomy and that may exhibit adaptiveness after deployment (Article 3(1))</p>
                            <p className="mb-2"><strong>Provider:</strong> Natural or legal person that develops an AI system or has an AI system developed with a view to placing it on the market (Article 3(3))</p>
                            <p className="mb-2"><strong>Deployer:</strong> Natural or legal person using an AI system under its authority (Article 3(4))</p>
                            <p><strong>High-Risk AI System:</strong> AI system listed in Annex III or subject to product safety legislation listed in Annex I (Article 6)</p>
                        </div>
                    </div>
                    
                    {/* Legal Disclaimer */}
                    <div className="print-keep-together">
                        <h2 className="text-2xl font-bold mb-4">⚖️ Legal Disclaimer</h2>
                        <div className="warning-box">
                            <p className="mb-2">This report is automatically generated based on the information provided during the assessment process. While we strive for accuracy, this tool:</p>
                            <ul className="list-disc ml-5 mb-2 space-y-1">
                                <li>Does not constitute legal advice</li>
                                <li>Should not replace consultation with qualified legal counsel</li>
                                <li>Reflects the regulatory landscape as of the generation date</li>
                                <li>May require updates as guidance and standards evolve</li>
                            </ul>
                            <p><strong>Recommendation:</strong> Engage with legal experts, conformity assessment bodies, and your national AI authority for definitive guidance specific to your use case.</p>
                        </div>
                    </div>
                    
                    {/* Resources */}
                    <div className="print-keep-together">
                        <h2 className="text-2xl font-bold mb-4">Additional Resources</h2>
                        <ul className="space-y-2">
                            <li><strong>European AI Office:</strong> digital-strategy.ec.europa.eu/en/policies/ai-office</li>
                            <li><strong>AI Pact (Voluntary Commitments):</strong> digital-strategy.ec.europa.eu/en/policies/ai-pact</li>
                            <li><strong>Standardization:</strong> CEN-CENELEC JTC 21</li>
                            <li><strong>AI Act Auditor (Open Source):</strong> github.com/Warnierr/AI-Act-Auditor</li>
                            <li><strong>Contact for Support:</strong> kenshu.dev - contact@kenshu.dev</li>
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 sm:mt-20 pt-6 sm:pt-8 border-t border-border text-center space-y-3 sm:space-y-4 px-4 print-footer">
                    <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest">AI Act Auditor 2025 • Alpha v0.1 • Open Source</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        {t.common.disclaimer}
                    </p>
                    <p className="text-[10px] text-muted-foreground hidden print:block">
                        Generated by AI Act Auditor | License: MIT | github.com/Warnierr/AI-Act-Auditor
                    </p>
                </div>
            </main>
        </div>
    )
}
