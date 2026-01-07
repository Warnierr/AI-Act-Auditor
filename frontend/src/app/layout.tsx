import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ChatAssistant } from "@/components/chat/ChatAssistant";
import { Toaster } from "@/components/ui/sonner";
import { SkipToContent } from "@/components/SkipToContent";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"] });

export const metadata: Metadata = {
    title: "AI Act Auditor | EU AI Act Compliance Tool",
    description: "Assess your AI system compliance with the EU AI Act Annex III. Free open-source tool for startups and SMEs.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className={`${inter.className} antialiased bg-[rgb(var(--bg-primary))] text-[rgb(var(--text-primary))] selection:bg-accent-primary/20 selection:text-accent-primary transition-colors duration-300`}>
                <SkipToContent />
                <ThemeProvider>
                    <LanguageProvider>
                        {children}
                        <ChatAssistant />
                        <Toaster position="top-right" expand={false} richColors />
                    </LanguageProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
