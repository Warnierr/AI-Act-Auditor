"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale, translations } from './translations';

type LanguageContextType = {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: typeof translations.en;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocale] = useState<Locale>('en');

    useEffect(() => {
        const saved = localStorage.getItem('language') as Locale;
        if (saved && (saved === 'en' || saved === 'fr')) {
            setLocale(saved);
        }
    }, []);

    const handleSetLocale = (newLocale: Locale) => {
        setLocale(newLocale);
        localStorage.setItem('language', newLocale);
    };

    const value = {
        locale,
        setLocale: handleSetLocale,
        t: translations[locale],
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useTranslation() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }
    return context;
}
