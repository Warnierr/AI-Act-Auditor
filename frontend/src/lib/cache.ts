/**
 * Client-side Cache Manager
 * Provides caching for API requests to reduce redundant calls
 */

export interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number; // Time to live in milliseconds
}

class CacheManager {
    private cache: Map<string, CacheEntry<any>> = new Map();
    private readonly DEFAULT_TTL = 30 * 60 * 1000; // 30 minutes

    /**
     * Get data from cache if valid
     */
    get<T>(key: string): T | null {
        const entry = this.cache.get(key);
        
        if (!entry) {
            return null;
        }

        // Check if expired
        const now = Date.now();
        if (now - entry.timestamp > entry.ttl) {
            this.cache.delete(key);
            return null;
        }

        return entry.data as T;
    }

    /**
     * Set data in cache
     */
    set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl
        });
    }

    /**
     * Clear specific cache entry
     */
    clear(key: string): void {
        this.cache.delete(key);
    }

    /**
     * Clear all cache
     */
    clearAll(): void {
        this.cache.clear();
    }

    /**
     * Get cache size
     */
    size(): number {
        return this.cache.size;
    }

    /**
     * Clean expired entries
     */
    cleanExpired(): void {
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp > entry.ttl) {
                this.cache.delete(key);
            }
        }
    }
}

// Singleton instance
const cacheManager = new CacheManager();

// Clean expired entries every 5 minutes
if (typeof window !== 'undefined') {
    setInterval(() => {
        cacheManager.cleanExpired();
    }, 5 * 60 * 1000);
}

export default cacheManager;

/**
 * Generate cache key from object
 */
export function generateCacheKey(prefix: string, data: any): string {
    const jsonString = JSON.stringify(data, Object.keys(data).sort());
    return `${prefix}_${hashString(jsonString)}`;
}

/**
 * Simple string hash function
 */
function hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
}
