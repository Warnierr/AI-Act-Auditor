"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Shield } from "lucide-react"

export default function AdminLogin() {
    const router = useRouter()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        // Simulating a login check - Hardcoded for demo/user request
        setTimeout(() => {
            if (username === "admin" && (password === "admin123" || password === "admin")) {
                // Set a mock session cookie or local storage
                localStorage.setItem("admin_session", "true")
                router.push("/admin/dashboard")
            } else {
                setError("Identifiants incorrects")
                setLoading(false)
            }
        }, 800)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 mesh-gradient">
            <Card className="w-full max-w-md glass-card shadow-xl">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                        <Lock className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Administration</CardTitle>
                    <CardDescription>Entrez vos identifiants sécurisés</CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Utilisateur</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="admin"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Mot de passe</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                {error}
                            </div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white" disabled={loading}>
                            {loading ? "Connexion..." : "Se connecter"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
