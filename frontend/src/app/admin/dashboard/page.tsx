"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    Users,
    ShieldAlert,
    FileText,
    LogOut,
    BarChart,
    Search,
    Bell
} from "lucide-react"

export default function AdminDashboard() {
    const router = useRouter()

    useEffect(() => {
        const session = localStorage.getItem("admin_session")
        if (!session) {
            router.push("/admin")
        }
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem("admin_session")
        router.push("/admin")
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Topbar */}
            <header className="bg-card border-b sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <div className="bg-slate-900 text-white p-1.5 rounded-lg">
                            <ShieldAlert className="h-5 w-5" />
                        </div>
                        Admin Console
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon">
                            <Search className="h-5 w-5 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Bell className="h-5 w-5 text-muted-foreground" />
                        </Button>
                        <Button onClick={handleLogout} variant="outline" size="sm" className="ml-2 gap-2">
                            <LogOut className="h-4 w-4" />
                            Déconnexion
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Vue d'ensemble</h1>
                    <p className="text-muted-foreground mt-1">Bienvenue sur le tableau de bord administrateur.</p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[
                        { title: "Audits Totaux", value: "1,248", change: "+12.5%", icon: FileText, color: "blue" },
                        { title: "Systèmes à Haut Risque", value: "86", change: "+4.2%", icon: ShieldAlert, color: "orange" },
                        { title: "Nouveaux Utilisateurs", value: "342", change: "+18.2%", icon: Users, color: "emerald" },
                        { title: "Taux de Conformité", value: "94%", change: "+1.2%", icon: BarChart, color: "indigo" },
                    ].map((kpi, i) => (
                        <Card key={i} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between space-y-0 pb-2">
                                    <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                                    <kpi.icon className={`h-4 w-4 text-${kpi.color}-500`} />
                                </div>
                                <div className="flex items-end justify-between pt-4">
                                    <div className="text-2xl font-bold">{kpi.value}</div>
                                    <div className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{kpi.change}</div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Recent Activity Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Audits Récents</CardTitle>
                        <CardDescription>Les derniers systèmes évalués par la plateforme.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border hover:bg-muted/80 transition-all cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                                            #{1000 + i}
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">Système IA Alpha-{i}</p>
                                            <p className="text-sm text-muted-foreground">Analysé il y a {i * 15} minutes</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${i % 2 === 0 ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                            {i % 2 === 0 ? 'Haut Risque' : 'Risque Limité'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
