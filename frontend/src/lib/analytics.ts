/**
 * Analytics Utilities
 * Calculate statistics from audit history
 */

import { getAudits } from "./storage";
import { RiskLevel } from "@/types";

export interface AnalyticsData {
    totalAudits: number;
    riskDistribution: { name: string; value: number; color: string }[];
    domainDistribution: { name: string; value: number }[];
    recentTrend: { date: string; count: number }[];
    topObligations: { obligation: string; count: number }[];
}

const RISK_COLORS = {
    [RiskLevel.UNACCEPTABLE]: "#dc2626", // red-600
    [RiskLevel.HIGH]: "#ea580c", // orange-600
    [RiskLevel.LIMITED]: "#d97706", // amber-600
    [RiskLevel.MINIMAL]: "#16a34a", // green-600
};

export function calculateAnalytics(): AnalyticsData {
    const audits = getAudits();
    
    // Risk distribution
    const riskCounts: Record<string, number> = {};
    audits.forEach(audit => {
        const level = audit.result.risk_level;
        riskCounts[level] = (riskCounts[level] || 0) + 1;
    });
    
    const riskDistribution = Object.entries(riskCounts).map(([name, value]) => ({
        name,
        value,
        color: RISK_COLORS[name as RiskLevel] || "#64748b"
    }));
    
    // Domain distribution
    const domainCounts: Record<string, number> = {};
    audits.forEach(audit => {
        const domain = audit.input.domain || "Unknown";
        domainCounts[domain] = (domainCounts[domain] || 0) + 1;
    });
    
    const domainDistribution = Object.entries(domainCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10); // Top 10 domains
    
    // Recent trend (last 30 days)
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const recentAudits = audits.filter(audit => audit.timestamp >= thirtyDaysAgo);
    
    const dateCounts: Record<string, number> = {};
    recentAudits.forEach(audit => {
        const date = new Date(audit.timestamp).toISOString().split('T')[0];
        dateCounts[date] = (dateCounts[date] || 0) + 1;
    });
    
    const recentTrend = Object.entries(dateCounts)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));
    
    // Top obligations
    const obligationCounts: Record<string, number> = {};
    audits.forEach(audit => {
        audit.result.obligations.forEach(obligation => {
            // Extract article number
            const match = obligation.match(/Art\.\s*(\d+)/);
            if (match) {
                const key = `Article ${match[1]}`;
                obligationCounts[key] = (obligationCounts[key] || 0) + 1;
            }
        });
    });
    
    const topObligations = Object.entries(obligationCounts)
        .map(([obligation, count]) => ({ obligation, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5); // Top 5
    
    return {
        totalAudits: audits.length,
        riskDistribution,
        domainDistribution,
        recentTrend,
        topObligations
    };
}

export function exportAnalyticsCSV(): void {
    const analytics = calculateAnalytics();
    const audits = getAudits();
    
    // Create CSV content
    const headers = ["Date", "System Name", "Domain", "Risk Level", "Confidence Score"];
    const rows = audits.map(audit => [
        new Date(audit.timestamp).toISOString(),
        audit.input.name,
        audit.input.domain || "Unknown",
        audit.result.risk_level,
        (audit.result.risk_score * 100).toFixed(0) + "%"
    ]);
    
    const csvContent = [
        headers.join(","),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");
    
    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI_Act_Analytics_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
}
