// hooks/useCache.ts
import { useState, useEffect, useCallback } from 'react';

interface CacheOptions {
  key: string;
  ttl?: number; // Time to live in milliseconds
  storage?: 'memory' | 'localStorage' | 'sessionStorage';
  fallbackData?: any;
}

// In-memory cache
const memoryCache = new Map<string, { data: any; timestamp: number }>();

export function useCache<T>(options: CacheOptions) {
  const { key, ttl = 5 * 60 * 1000, storage = 'localStorage', fallbackData } = options;
  const [cachedData, setCachedData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get storage based on option
  const getStorage = useCallback(() => {
    if (storage === 'memory') return null;
    if (storage === 'sessionStorage' && typeof window !== 'undefined') return window.sessionStorage;
    if (storage === 'localStorage' && typeof window !== 'undefined') return window.localStorage;
    return null;
  }, [storage]);

  // Read from cache
  const getFromCache = useCallback((): T | null => {
    try {
      if (storage === 'memory') {
        const cached = memoryCache.get(key);
        if (cached) {
          const isExpired = Date.now() - cached.timestamp > ttl;
          if (!isExpired) {
            return cached.data;
          }
          memoryCache.delete(key);
        }
      } else {
        const storageApi = getStorage();
        if (storageApi) {
          const item = storageApi.getItem(key);
          if (item) {
            const parsed = JSON.parse(item);
            const isExpired = Date.now() - parsed.timestamp > ttl;
            if (!isExpired) {
              return parsed.data;
            }
            storageApi.removeItem(key);
          }
        }
      }
    } catch (error) {
      console.error('Cache read error:', error);
    }
    return null;
  }, [key, ttl, storage, getStorage]);

  // Write to cache
  const setCache = useCallback((data: T) => {
    try {
      const cacheEntry = {
        data,
        timestamp: Date.now()
      };

      if (storage === 'memory') {
        memoryCache.set(key, cacheEntry);
      } else {
        const storageApi = getStorage();
        if (storageApi) {
          storageApi.setItem(key, JSON.stringify(cacheEntry));
        }
      }
      setCachedData(data);
    } catch (error) {
      console.error('Cache write error:', error);
    }
  }, [key, storage, getStorage]);

  // Clear cache
  const clearCache = useCallback(() => {
    try {
      if (storage === 'memory') {
        memoryCache.delete(key);
      } else {
        const storageApi = getStorage();
        if (storageApi) {
          storageApi.removeItem(key);
        }
      }
      setCachedData(null);
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }, [key, storage, getStorage]);

  // Load from cache on mount
  useEffect(() => {
    const cached = getFromCache();
    if (cached) {
      setCachedData(cached);
    } else if (fallbackData) {
      setCachedData(fallbackData);
    }
    setIsLoading(false);
  }, [getFromCache, fallbackData]);

  return {
    data: cachedData,
    setCache,
    clearCache,
    isLoading,
    isCached: cachedData !== null
  };
}

// Global cache utilities
export const cacheUtils = {
  clearAll: () => {
    memoryCache.clear();
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
      window.sessionStorage.clear();
    }
  },
  
  clearByPattern: (pattern: RegExp) => {
    // Clear memory cache
    Array.from(memoryCache.keys()).forEach(key => {
      if (pattern.test(key)) {
        memoryCache.delete(key);
      }
    });
    
    // Clear storage
    if (typeof window !== 'undefined') {
      ['localStorage', 'sessionStorage'].forEach(storageType => {
        const storage = window[storageType as 'localStorage' | 'sessionStorage'];
        const keys = Object.keys(storage);
        keys.forEach(key => {
          if (pattern.test(key)) {
            storage.removeItem(key);
          }
        });
      });
    }
  }
};