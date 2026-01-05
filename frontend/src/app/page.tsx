"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Shield,
    FileText,
    CheckCircle2,
    Zap,
    ArrowRight,
    Github,
    Languages,
    Star,
    Users,
    Building2,
    ShieldCheck,
    Sparkles,
    Clock,
    ChevronRight
} from "lucide-react"
import { useTranslation } from "@/lib/LanguageContext"
import { ThemeSelector } from "@/components/ThemeSelector"

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
}

const stagger = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
}

export default function Home() {
    const { t, locale, setLocale } = useTranslation();

    return (
        <div className="flex flex-col min-h-screen">
            {/* Announcement Bar */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-2 px-4 text-center text-sm font-medium">
                <span className="inline-flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    {locale === 'fr' ? 'Nouveau : Support complet de l\'Annexe III et génération de rapports PDF' : 'New: Full Annex III support and PDF report generation'}
                    <ChevronRight className="h-4 w-4" />
                </span>
            </div>

            {/* Header */}
            <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-[var(--glass-bg)] backdrop-blur-xl sticky top-0 z-50 border-[var(--glass-border)]">
                <div className="container mx-auto flex items-center justify-between">
                    <Link className="flex items-center justify-center space-x-3" href="/">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent blur-lg opacity-40"></div>
                            <div className="relative bg-gradient-to-br from-primary to-accent p-2 rounded-xl shadow-lg">
                                <Shield className="h-5 w-5 text-primary-foreground" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-lg tracking-tight leading-none text-foreground">AI Act Auditor</span>
                            <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">Compliance Tool</span>
                        </div>
                    </Link>
                    <nav className="flex gap-1 sm:gap-2 items-center">
                        <ThemeSelector />
                        <button
                            onClick={() => setLocale(locale === 'en' ? 'fr' : 'en')}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-xs font-bold text-[rgb(var(--text-primary))] border border-white/20"
                        >
                            <span className={locale === 'en' ? 'text-accent-primary' : 'text-[rgb(var(--text-secondary))]'}>EN</span>
                            <span className="text-white/30">|</span>
                            <span className={locale === 'fr' ? 'text-accent-primary' : 'text-[rgb(var(--text-secondary))]'}>FR</span>
                        </button>
                        <Link className="text-sm font-medium text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] transition-colors px-3 py-2 rounded-lg hover:bg-white/10 hidden md:block" href="#features">
                            {t.common.features}
                        </Link>
                        <Link className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-2 rounded-lg hover:bg-slate-100 hidden md:block" href="#how-it-works">
                            {locale === 'fr' ? 'Fonctionnement' : 'How it works'}
                        </Link>
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 btn-premium" asChild>
                            <Link href="/assess">
                                {t.common.startAudit}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </nav>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative w-full py-20 md:py-28 lg:py-36 overflow-hidden mesh-gradient noise-overlay">
                    {/* Decorative elements */}
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-[100px] float"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-[120px] float" style={{ animationDelay: '-3s' }}></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-400/10 rounded-full blur-[150px]"></div>

                    <div className="container mx-auto px-4 md:px-6 relative z-10">
                        <motion.div
                            className="flex flex-col items-center space-y-8 text-center max-w-4xl mx-auto"
                            initial="initial"
                            animate="animate"
                            variants={stagger}
                        >
                            {/* Trust badges */}
                            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-3">
                                <div className="trust-badge">
                                    <ShieldCheck className="h-4 w-4" />
                                    {locale === 'fr' ? 'Conforme RGPD' : 'GDPR Compliant'}
                                </div>
                                <div className="trust-badge">
                                    <Clock className="h-4 w-4" />
                                    {locale === 'fr' ? 'Prêt pour 2026' : 'Ready for 2026'}
                                </div>
                            </motion.div>

                            <motion.div variants={fadeInUp} className="space-y-6">
                                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-foreground">
                                    {t.hero.title}{" "}
                                    <span className="gradient-text">{t.hero.titleAccent}</span>
                                </h1>
                                <p className="mx-auto max-w-2xl text-muted-foreground text-lg md:text-xl leading-relaxed">
                                    {t.hero.subtitle}
                                </p>
                            </motion.div>

                            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                                <Button size="lg" className="h-14 px-8 text-base bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground shadow-xl shadow-primary/20 btn-premium group" asChild>
                                    <Link href="/assess">
                                        {t.common.startAudit}
                                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                                <Button variant="outline" size="lg" className="h-14 px-8 text-base bg-background/50 backdrop-blur border-border hover:bg-muted/50 shadow-lg" asChild>
                                    <Link href="https://github.com/Warnierr" target="_blank">
                                        <Github className="mr-2 h-5 w-5" />
                                        {t.common.openSource}
                                    </Link>
                                </Button>
                            </motion.div>

                            {/* Social proof */}
                            <motion.div variants={fadeInUp} className="flex flex-col items-center gap-4 pt-8">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="w-10 h-10 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-bold text-muted-foreground shadow-sm">
                                            {String.fromCharCode(64 + i)}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-0.5">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                    <span className="font-semibold text-foreground">500+</span>
                                    <span>{locale === 'fr' ? 'audits réalisés' : 'audits completed'}</span>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-16 bg-card border-y border-border">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { value: "2min", label: locale === 'fr' ? "Temps moyen d'audit" : "Average audit time", icon: Clock },
                                { value: "100%", label: locale === 'fr' ? "Annexe III couverte" : "Annex III covered", icon: FileText },
                                { value: "500+", label: locale === 'fr' ? "Audits réalisés" : "Audits completed", icon: Users },
                                { value: "FR/EU", label: locale === 'fr' ? "Conformité locale" : "Local compliance", icon: Building2 },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    className="flex flex-col items-center text-center"
                                >
                                    <div className="mb-3 p-3 rounded-2xl bg-secondary text-primary">
                                        <stat.icon className="h-6 w-6" />
                                    </div>
                                    <div className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{stat.value}</div>
                                    <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="w-full py-24 md:py-32 bg-secondary/30">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="text-center mb-16">
                            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">{locale === 'fr' ? 'Fonctionnalités' : 'Features'}</Badge>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">
                                {locale === 'fr' ? 'Tout pour votre conformité IA Act' : 'Everything for your AI Act compliance'}
                            </h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                {locale === 'fr'
                                    ? 'Un outil complet construit sur la logique déterministe de l\'Annexe III pour une classification juridique fiable.'
                                    : 'A complete tool built on the deterministic logic of Annex III for reliable legal classification.'}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: Shield,
                                    title: t.features.deterministic.title,
                                    desc: t.features.deterministic.desc
                                },
                                {
                                    icon: FileText,
                                    title: t.features.reports.title,
                                    desc: t.features.reports.desc
                                },
                                {
                                    icon: CheckCircle2,
                                    title: t.features.checklists.title,
                                    desc: t.features.checklists.desc
                                }
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    className="group"
                                >
                                    <div className="h-full p-8 rounded-3xl glass-card hover-lift bg-card/60">
                                        <div className={`w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                            <feature.icon className={`h-7 w-7 text-primary`} />
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                                        <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="w-full py-24 md:py-32 bg-background">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="text-center mb-16">
                            <Badge className="mb-4 bg-accent text-accent-foreground border-accent-foreground/10">{locale === 'fr' ? 'Comment ça marche' : 'How it works'}</Badge>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">
                                {locale === 'fr' ? 'Trois étapes simples' : 'Three simple steps'}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                            {/* Connecting line */}
                            <div className="hidden md:block absolute top-24 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20"></div>

                            {[
                                { step: "01", title: locale === 'fr' ? "Décrivez votre système" : "Describe your system", desc: locale === 'fr' ? "Remplissez un formulaire simple sur votre système d'IA en quelques minutes." : "Fill out a simple form about your AI system in minutes." },
                                { step: "02", title: locale === 'fr' ? "Analyse automatique" : "Automatic analysis", desc: locale === 'fr' ? "Notre moteur de règles analyse votre système selon l'Annexe III de l'IA Act." : "Our rule engine analyzes your system according to Annex III of the AI Act." },
                                { step: "03", title: locale === 'fr' ? "Obtenez votre rapport" : "Get your report", desc: locale === 'fr' ? "Téléchargez un rapport PDF détaillé avec votre niveau de risque et vos obligations." : "Download a detailed PDF report with your risk level and obligations." }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.15 }}
                                    viewport={{ once: true }}
                                    className="relative text-center"
                                >
                                    <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-muted-foreground relative z-10 border-4 border-background shadow-lg">
                                        {item.step}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-foreground">{item.title}</h3>
                                    <p className="text-muted-foreground">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="w-full py-24 relative overflow-hidden bg-foreground">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,hsl(var(--primary)/0.15),transparent_50%)]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,hsl(var(--accent)/0.15),transparent_50%)]"></div>

                    <div className="container mx-auto px-4 md:px-6 relative z-10">
                        <div className="max-w-3xl mx-auto text-center">
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-background mb-6">
                                {locale === 'fr' ? 'Prêt à auditer votre système IA ?' : 'Ready to audit your AI system?'}
                            </h2>
                            <p className="text-background/70 text-lg mb-10">
                                {locale === 'fr'
                                    ? 'Commencez gratuitement. Aucun compte requis. Résultats en 2 minutes.'
                                    : 'Start for free. No account required. Results in 2 minutes.'}
                            </p>
                            <Button size="lg" className="h-14 px-10 text-lg bg-background text-foreground hover:bg-background/90 shadow-2xl btn-premium" asChild>
                                <Link href="/assess">
                                    {t.common.startAudit}
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="w-full py-12 border-t border-border bg-card">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center space-x-3">
                            <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-xl">
                                <Shield className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <div>
                                <span className="font-bold text-lg text-foreground">AI Act Auditor</span>
                                <p className="text-xs text-muted-foreground">© 2025 • MIT License</p>
                            </div>
                        </div>
                        <div className="flex gap-6 text-sm text-muted-foreground">
                            <Link className="hover:text-foreground transition-colors" href="https://eur-lex.europa.eu/eli/reg/2024/1689/oj" target="_blank">
                                {locale === 'fr' ? 'Texte Officiel IA Act' : 'EU AI Act Official Text'}
                            </Link>
                            <Link className="hover:text-foreground transition-colors" href="#">
                                {locale === 'fr' ? 'Confidentialité' : 'Privacy'}
                            </Link>
                            <Link className="hover:text-foreground transition-colors" href="https://github.com/Warnierr" target="_blank">
                                GitHub
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
