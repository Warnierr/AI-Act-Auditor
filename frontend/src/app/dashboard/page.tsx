"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    ArrowLeft,
    BarChart3,
    Download,
    Shield,
    TrendingUp,
    FileText,
    Languages
} from "lucide-react"
import { calculateAnalytics, exportAnalyticsCSV } from "@/lib/analytics"
import { useTranslation } from "@/lib/LanguageContext"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

export default function DashboardPage() {
    const { t, locale, setLocale } = useTranslation()
    const [analytics, setAnalytics] = useState<ReturnType<typeof calculateAnalytics> | null>(null)

    useEffect(() => {
        const data = calculateAnalytics()
        setAnalytics(data)
    }, [])

    if (!analytics) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen mesh-gradient noise-overlay">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-xl shadow-lg">
                            <Shield className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="font-bold text-lg sm:text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            AI Act Auditor
                        </span>
                    </Link>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setLocale(locale === 'fr' ? 'en' : 'fr')}
                        className="gap-2"
                    >
                        <Languages className="h-4 w-4" />
                        {locale === 'fr' ? 'EN' : 'FR'}
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 sm:py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-7xl mx-auto"
                >
                    {/* Page Header */}
                    <div className="mb-8">
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="mb-4 gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                {locale === 'fr' ? 'Retour' : 'Back'}
                            </Button>
                        </Link>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center gap-3">
                                    <BarChart3 className="h-8 w-8 text-primary" />
                                    {locale === 'fr' ? 'Tableau de Bord' : 'Analytics Dashboard'}
                                </h1>
                                <p className="text-muted-foreground">
                                    {locale === 'fr'
                                        ? 'Statistiques et tendances de vos audits'
                                        : 'Statistics and trends from your audits'}
                                </p>
                            </div>

                            <Button onClick={exportAnalyticsCSV} className="gap-2">
                                <Download className="h-4 w-4" />
                                {locale === 'fr' ? 'Exporter CSV' : 'Export CSV'}
                            </Button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {locale === 'fr' ? 'Total Audits' : 'Total Audits'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{analytics.totalAudits}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {locale === 'fr' ? 'Domaines Audités' : 'Domains Audited'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{analytics.domainDistribution.length}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {locale === 'fr' ? 'Tendance' : 'Trend'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-green-600" />
                                    <span className="text-3xl font-bold">{analytics.recentTrend.length}</span>
                                    <span className="text-sm text-muted-foreground">
                                        {locale === 'fr' ? 'jours actifs' : 'active days'}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Risk Distribution */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {locale === 'fr' ? 'Répartition par Niveau de Risque' : 'Risk Level Distribution'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={analytics.riskDistribution}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} (${percent ? (percent * 100).toFixed(0) : 0}%)`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {analytics.riskDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Domain Distribution */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {locale === 'fr' ? 'Top Domaines' : 'Top Domains'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={analytics.domainDistribution}>
                                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="hsl(var(--primary))" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Recent Trend */}
                        {analytics.recentTrend.length > 0 && (
                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <CardTitle>
                                        {locale === 'fr' ? 'Tendance (30 derniers jours)' : 'Trend (Last 30 Days)'}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={analytics.recentTrend}>
                                            <XAxis dataKey="date" />
                                            <YAxis />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        )}

                        {/* Top Obligations */}
                        {analytics.topObligations.length > 0 && (
                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <CardTitle>
                                        {locale === 'fr' ? 'Articles les Plus Fréquents' : 'Most Frequent Articles'}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {analytics.topObligations.map((item, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <Badge variant="outline">{index + 1}</Badge>
                                                    <span className="font-medium">{item.obligation}</span>
                                                </div>
                                                <Badge>{item.count} {locale === 'fr' ? 'fois' : 'times'}</Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </motion.div>
            </main>
        </div>
    )
}
