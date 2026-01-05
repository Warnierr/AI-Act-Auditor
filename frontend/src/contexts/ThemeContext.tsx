ww"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'dark-purple' | 'dark-blue' | 'light' | 'minimal'

interface ThemeContextType {
    theme: Theme
    setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const themeStyles: Record<Theme, { [key: string]: string }> = {
    'dark-purple': {
        '--bg-primary': '15 15 35',
        '--bg-secondary': '25 20 50',
        '--accent-primary': '139 92 246', // purple
        '--accent-secondary': '99 102 241', // indigo
        '--text-primary': '255 255 255',
        '--text-secondary': '203 213 225',
        '--text-muted': '148 163 184',
        '--glass-bg': 'rgba(30, 25, 60, 0.7)',
        '--glass-border': 'rgba(139, 92, 246, 0.2)',
        '--card-bg': 'rgba(30, 25, 60, 0.5)',
    },
    'dark-blue': {
        '--bg-primary': '15 23 42',
        '--bg-secondary': '30 41 59',
        '--accent-primary': '59 130 246', // blue
        '--accent-secondary': '14 165 233', // sky
        '--text-primary': '255 255 255',
        '--text-secondary': '203 213 225',
        '--text-muted': '148 163 184',
        '--glass-bg': 'rgba(30, 41, 80, 0.7)',
        '--glass-border': 'rgba(59, 130, 246, 0.2)',
        '--card-bg': 'rgba(30, 41, 59, 0.5)',
    },
    'light': {
        '--bg-primary': '248 250 252',
        '--bg-secondary': '241 245 249',
        '--accent-primary': '79 70 229', // indigo-600
        '--accent-secondary': '124 58 237', // violet-600
        '--text-primary': '15 23 42', // slate-900
        '--text-secondary': '51 65 85', // slate-700
        '--text-muted': '100 116 139', // slate-500
        '--glass-bg': 'rgba(255, 255, 255, 0.8)',
        '--glass-border': 'rgba(99, 102, 241, 0.15)',
        '--card-bg': 'rgba(255, 255, 255, 0.6)',
    },
    'minimal': {
        '--bg-primary': '255 255 255',
        '--bg-secondary': '250 250 250',
        '--accent-primary': '0 0 0',
        '--accent-secondary': '64 64 64',
        '--text-primary': '0 0 0',
        '--text-secondary': '64 64 64',
        '--text-muted': '115 115 115',
        '--glass-bg': 'rgba(250, 250, 250, 0.9)',
        '--glass-border': 'rgba(0, 0, 0, 0.1)',
        '--card-bg': 'rgba(250, 250, 250, 0.7)',
    },
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('dark-purple')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        // Load theme from localStorage
        const savedTheme = localStorage.getItem('ai-act-theme') as Theme
        if (savedTheme && themeStyles[savedTheme]) {
            setThemeState(savedTheme)
        }
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return

        // Apply theme styles to root
        const root = document.documentElement
        const styles = themeStyles[theme]

        Object.entries(styles).forEach(([key, value]) => {
            root.style.setProperty(key, value)
        })

        // Save to localStorage
        localStorage.setItem('ai-act-theme', theme)

        // Update data-theme attribute for CSS
        root.setAttribute('data-theme', theme)
    }, [theme, mounted])

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme)
    }

    // Prevent flash of unstyled content
    if (!mounted) {
        return null
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}
