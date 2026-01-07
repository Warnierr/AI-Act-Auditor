"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    ArrowLeft,
    Download,
    Trash2,
    Eye,
    FileJson,
    History as HistoryIcon,
    Upload,
    AlertCircle,
    Shield,
    Languages
} from "lucide-react"
import { getAudits, deleteAudit, exportAuditJSON, exportAllAuditsJSON, importAuditsJSON, clearAllAudits } from "@/lib/storage"
import { AuditHistory, RiskLevel } from "@/types"
import { useTranslation } from "@/lib/LanguageContext"
import { toast } from "sonner"

export default function HistoryPage() {
    const { t, locale, setLocale } = useTranslation()
    const [audits, setAudits] = useState<AuditHistory[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    const loadAudits = () => {
        try {
            const loadedAudits = getAudits()
            setAudits(loadedAudits)
        } catch (error) {
            console.error('Failed to load audits:', error)
            toast.error(
                locale === 'fr'
                    ? 'Erreur lors du chargement de l\'historique'
                    : 'Failed to load audit history'
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadAudits()
    }, [])

    const handleDelete = (id: string, name: string) => {
        if (confirm(
            locale === 'fr'
                ? `Supprimer l'audit "${name}" ?`
                : `Delete audit "${name}"?`
        )) {
            try {
                deleteAudit(id)
                loadAudits()
                toast.success(
                    locale === 'fr'
                        ? 'Audit supprimé'
                        : 'Audit deleted'
                )
            } catch (error) {
                toast.error(
                    locale === 'fr'
                        ? 'Erreur lors de la suppression'
                        : 'Failed to delete audit'
                )
            }
        }
    }

    const handleExportOne = (id: string) => {
        try {
            exportAuditJSON(id)
            toast.success(
                locale === 'fr'
                    ? 'Audit exporté en JSON'
                    : 'Audit exported as JSON'
            )
        } catch (error) {
            toast.error(
                locale === 'fr'
                    ? 'Erreur lors de l\'export'
                    : 'Failed to export audit'
            )
        }
    }

    const handleExportAll = () => {
        try {
            exportAllAuditsJSON()
            toast.success(
                locale === 'fr'
                    ? `${audits.length} audits exportés`
                    : `${audits.length} audits exported`
            )
        } catch (error) {
            toast.error(
                locale === 'fr'
                    ? 'Erreur lors de l\'export'
                    : 'Failed to export audits'
            )
        }
    }

    const handleImport = () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = '.json'
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (!file) return

            try {
                const count = await importAuditsJSON(file)
                loadAudits()
                toast.success(
                    locale === 'fr'
                        ? `${count} audit(s) importé(s)`
                        : `${count} audit(s) imported`
                )
            } catch (error) {
                toast.error(
                    locale === 'fr'
                        ? 'Erreur lors de l\'import'
                        : 'Failed to import audits'
                )
            }
        }
        input.click()
    }

    const handleClearAll = () => {
        if (confirm(
            locale === 'fr'
                ? `Supprimer tous les ${audits.length} audits ?`
                : `Delete all ${audits.length} audits?`
        )) {
            try {
                clearAllAudits()
                loadAudits()
                toast.success(
                    locale === 'fr'
                        ? 'Historique effacé'
                        : 'History cleared'
                )
            } catch (error) {
                toast.error(
                    locale === 'fr'
                        ? 'Erreur lors de la suppression'
                        : 'Failed to clear history'
                )
            }
        }
    }

    const handleViewAudit = (audit: AuditHistory) => {
        // Store in localStorage and navigate to results
        localStorage.setItem("auditResult", JSON.stringify(audit.result))
        localStorage.setItem("auditInput", JSON.stringify(audit.input))
        router.push("/results")
    }

    const getRiskBadgeColor = (level: RiskLevel) => {
        switch (level) {
            case RiskLevel.UNACCEPTABLE:
                return "bg-red-600 text-white"
            case RiskLevel.HIGH:
                return "bg-orange-600 text-white"
            case RiskLevel.LIMITED:
                return "bg-amber-600 text-white"
            case RiskLevel.MINIMAL:
                return "bg-green-600 text-white"
            default:
                return "bg-slate-600 text-white"
        }
    }

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp)
        return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date)
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
                    className="max-w-6xl mx-auto"
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
                                    <HistoryIcon className="h-8 w-8 text-primary" />
                                    {locale === 'fr' ? 'Historique des Audits' : 'Audit History'}
                                </h1>
                                <p className="text-muted-foreground">
                                    {locale === 'fr'
                                        ? `${audits.length} audit(s) sauvegardé(s)`
                                        : `${audits.length} saved audit(s)`}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleImport}
                                    className="gap-2"
                                >
                                    <Upload className="h-4 w-4" />
                                    {locale === 'fr' ? 'Importer' : 'Import'}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleExportAll}
                                    disabled={audits.length === 0}
                                    className="gap-2"
                                >
                                    <FileJson className="h-4 w-4" />
                                    {locale === 'fr' ? 'Tout Exporter' : 'Export All'}
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleClearAll}
                                    disabled={audits.length === 0}
                                    className="gap-2"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    {locale === 'fr' ? 'Tout Effacer' : 'Clear All'}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Empty State */}
                    {audits.length === 0 && !loading && (
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                {locale === 'fr'
                                    ? 'Aucun audit sauvegardé. Effectuez votre premier audit pour commencer.'
                                    : 'No saved audits. Complete your first audit to get started.'}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Audits List */}
                    <div className="grid gap-4">
                        {audits.map((audit, index) => (
                            <motion.div
                                key={audit.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                            <div className="flex-1">
                                                <CardTitle className="text-xl mb-2">
                                                    {audit.input.name}
                                                </CardTitle>
                                                <CardDescription className="line-clamp-2">
                                                    {audit.input.description}
                                                </CardDescription>
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    <Badge className={getRiskBadgeColor(audit.result.risk_level)}>
                                                        {audit.result.risk_level}
                                                    </Badge>
                                                    <Badge variant="outline">
                                                        {audit.input.domain || 'Unknown'}
                                                    </Badge>
                                                    <Badge variant="outline">
                                                        {formatDate(audit.timestamp)}
                                                    </Badge>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex flex-wrap gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleViewAudit(audit)}
                                                    className="gap-2"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    {locale === 'fr' ? 'Voir' : 'View'}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleExportOne(audit.id)}
                                                    className="gap-2"
                                                >
                                                    <FileJson className="h-4 w-4" />
                                                    {locale === 'fr' ? 'JSON' : 'JSON'}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDelete(audit.id, audit.input.name)}
                                                    className="gap-2"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </main>
        </div>
    )
}
