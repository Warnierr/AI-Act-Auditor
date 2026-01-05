"use client"

import { useTheme } from "@/contexts/ThemeContext"
import { Palette, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

const themes = [
    { id: 'dark-purple' as const, name: 'Purple Night', gradient: 'from-purple-600 to-indigo-600', preview: 'bg-gradient-to-br from-purple-600 to-indigo-600' },
    { id: 'dark-blue' as const, name: 'Ocean Blue', gradient: 'from-blue-600 to-sky-500', preview: 'bg-gradient-to-br from-blue-600 to-sky-500' },
    { id: 'light' as const, name: 'Light Mode', gradient: 'from-slate-100 to-white', preview: 'bg-gradient-to-br from-slate-100 to-white border border-slate-300' },
    { id: 'minimal' as const, name: 'Minimal', gradient: 'from-gray-100 to-gray-50', preview: 'bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-400' },
]

export function ThemeSelector() {
    const { theme, setTheme } = useTheme()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="relative">
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all text-white"
            >
                <Palette className="h-4 w-4" />
                <span className="text-sm font-medium hidden sm:inline">Theme</span>
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full right-0 mt-2 w-64 rounded-2xl bg-card/80 backdrop-blur-xl border border-border shadow-2xl overflow-hidden z-50"
                    >
                        <div className="p-3">
                            <h3 className="text-sm font-bold text-foreground mb-3 px-2">Choose Theme</h3>
                            <div className="grid gap-2">
                                {themes.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => {
                                            setTheme(t.id)
                                            setIsOpen(false)
                                        }}
                                        className={`flex items-center gap-3 p-3 rounded-xl transition-all ${theme === t.id
                                            ? 'bg-primary/20 border-2 border-primary shadow-lg'
                                            : 'bg-muted/50 border-2 border-transparent hover:bg-muted hover:border-border'
                                            }`}
                                    >
                                        {/* Preview */}
                                        <div className={`w-10 h-10 rounded-lg ${t.preview} shrink-0 shadow-md`} />

                                        {/* Name */}
                                        <span className="flex-1 text-left text-sm font-medium text-foreground">
                                            {t.name}
                                        </span>

                                        {/* Check */}
                                        {theme === t.id && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="w-5 h-5 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center"
                                            >
                                                <Check className="h-3 w-3 text-white" />
                                            </motion.div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Backdrop */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 z-40"
                />
            )}
        </div>
    )
}
