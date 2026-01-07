/**
 * Local Storage Manager for Audit History
 * Manages saving, retrieving, and exporting audit results
 */

import { AISystemInput, AnalysisResult, AuditHistory } from "@/types";

const STORAGE_KEY = "ai_act_auditor_history";
const MAX_AUDITS = 50; // Limit storage to prevent localStorage overflow

/**
 * Generate a unique ID for an audit
 */
function generateId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get all audits from localStorage
 */
export function getAudits(): AuditHistory[] {
    if (typeof window === 'undefined') return [];
    
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];
        
        const audits = JSON.parse(stored) as AuditHistory[];
        // Sort by timestamp descending (newest first)
        return audits.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
        console.error('Failed to load audit history:', error);
        return [];
    }
}

/**
 * Get a specific audit by ID
 */
export function getAudit(id: string): AuditHistory | null {
    const audits = getAudits();
    return audits.find(audit => audit.id === id) || null;
}

/**
 * Save a new audit to localStorage
 * @returns The ID of the saved audit
 */
export function saveAudit(input: AISystemInput, result: AnalysisResult): string {
    if (typeof window === 'undefined') return '';
    
    try {
        const audits = getAudits();
        const id = generateId();
        const timestamp = Date.now();
        const savedDate = new Date(timestamp).toISOString();
        
        const newAudit: AuditHistory = {
            id,
            timestamp,
            input,
            result,
            savedDate
        };
        
        // Add new audit at the beginning
        audits.unshift(newAudit);
        
        // Keep only the last MAX_AUDITS
        const trimmedAudits = audits.slice(0, MAX_AUDITS);
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedAudits));
        return id;
    } catch (error) {
        console.error('Failed to save audit:', error);
        throw new Error('Failed to save audit to local storage');
    }
}

/**
 * Delete an audit by ID
 */
export function deleteAudit(id: string): void {
    if (typeof window === 'undefined') return;
    
    try {
        const audits = getAudits();
        const filtered = audits.filter(audit => audit.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
        console.error('Failed to delete audit:', error);
        throw new Error('Failed to delete audit');
    }
}

/**
 * Delete all audits
 */
export function clearAllAudits(): void {
    if (typeof window === 'undefined') return;
    
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Failed to clear audit history:', error);
        throw new Error('Failed to clear audit history');
    }
}

/**
 * Export a single audit as JSON
 */
export function exportAuditJSON(id: string): void {
    const audit = getAudit(id);
    if (!audit) {
        throw new Error('Audit not found');
    }
    
    const jsonString = JSON.stringify(audit, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI_Act_Audit_${audit.input.name.replace(/\s+/g, '_')}_${new Date(audit.timestamp).toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
}

/**
 * Export all audits as JSON
 */
export function exportAllAuditsJSON(): void {
    const audits = getAudits();
    if (audits.length === 0) {
        throw new Error('No audits to export');
    }
    
    const jsonString = JSON.stringify(audits, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI_Act_Auditor_History_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
}

/**
 * Import audits from a JSON file
 */
export function importAuditsJSON(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const imported = JSON.parse(content);
                
                // Validate format
                const audits = Array.isArray(imported) ? imported : [imported];
                let importedCount = 0;
                
                for (const audit of audits) {
                    if (audit.input && audit.result) {
                        // Generate new ID and timestamp for imported audits
                        saveAudit(audit.input, audit.result);
                        importedCount++;
                    }
                }
                
                resolve(importedCount);
            } catch (error) {
                reject(new Error('Invalid JSON format'));
            }
        };
        
        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };
        
        reader.readAsText(file);
    });
}

/**
 * Get audit statistics
 */
export interface AuditStats {
    total: number;
    byRiskLevel: Record<string, number>;
    byDomain: Record<string, number>;
    recentCount: number; // Last 7 days
}

export function getAuditStats(): AuditStats {
    const audits = getAudits();
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    const stats: AuditStats = {
        total: audits.length,
        byRiskLevel: {},
        byDomain: {},
        recentCount: 0
    };
    
    audits.forEach(audit => {
        // Count by risk level
        const riskLevel = audit.result.risk_level;
        stats.byRiskLevel[riskLevel] = (stats.byRiskLevel[riskLevel] || 0) + 1;
        
        // Count by domain
        const domain = audit.input.domain || 'Unknown';
        stats.byDomain[domain] = (stats.byDomain[domain] || 0) + 1;
        
        // Count recent
        if (audit.timestamp >= sevenDaysAgo) {
            stats.recentCount++;
        }
    });
    
    return stats;
}
