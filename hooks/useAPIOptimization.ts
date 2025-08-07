// hooks/useAPIOptimization.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { useCache } from './useCache';

interface RequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  cache?: {
    enabled?: boolean;
    ttl?: number;
    key?: string;
  };
  dedupe?: boolean;
  debounce?: number;
  throttle?: number;
}

interface APIOptimizationOptions {
  baseURL?: string;
  defaultCacheTTL?: number;
  enableRequestDeduplication?: boolean;
  enableBatching?: boolean;
  batchInterval?: number;
  maxBatchSize?: number;
}

// Request deduplication
const pendingRequests = new Map<string, Promise<any>>();

// Request batching queue
const batchQueue = new Map<string, Array<{ resolve: Function; reject: Function; config: RequestConfig }>>();

export function useAPIOptimization(options: APIOptimizationOptions = {}) {
  const {
    baseURL = '',
    defaultCacheTTL = 5 * 60 * 1000, // 5 minutes
    enableRequestDeduplication = true,
    enableBatching = true,
    batchInterval = 50,
    maxBatchSize = 10
  } = options;

  const batchTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Create request key for deduplication
  const getRequestKey = (config: RequestConfig): string => {
    return `${config.method || 'GET'}-${config.url}-${JSON.stringify(config.body || {})}`;
  };

  // Process batch requests
  const processBatch = useCallback(async () => {
    if (!enableBatching || batchQueue.size === 0) return;

    // Group requests by endpoint
    const groupedRequests = new Map<string, typeof batchQueue>();
    
    batchQueue.forEach((requests, key) => {
      const endpoint = requests[0].config.url.split('?')[0];
      if (!groupedRequests.has(endpoint)) {
        groupedRequests.set(endpoint, new Map());
      }
      groupedRequests.get(endpoint)!.set(key, requests);
    });

    // Process each group
    for (const [endpoint, group] of groupedRequests) {
      try {
        // Create batch request
        const batchBody = Array.from(group.values()).map(requests => 
          requests.map(r => ({
            method: r.config.method,
            url: r.config.url,
            body: r.config.body
          }))
        ).flat();

        // Send batch request
        const response = await fetch(`${baseURL}/api/batch`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ requests: batchBody })
        });

        if (response.ok) {
          const results = await response.json();
          
          // Resolve individual requests
          let resultIndex = 0;
          group.forEach((requests) => {
            requests.forEach(({ resolve, reject }) => {
              const result = results[resultIndex++];
              if (result.error) {
                reject(new Error(result.error));
              } else {
                resolve(result.data);
              }
            });
          });
        } else {
          // Fallback to individual requests
          group.forEach((requests) => {
            requests.forEach(async ({ resolve, reject, config }) => {
              try {
                const result = await makeRequest(config);
                resolve(result);
              } catch (error) {
                reject(error);
              }
            });
          });
        }
      } catch (error) {
        // Fallback to individual requests
        group.forEach((requests) => {
          requests.forEach(({ reject }) => reject(error));
        });
      }
    }

    batchQueue.clear();
  }, [baseURL, enableBatching]);

  // Make individual request
  const makeRequest = async (config: RequestConfig) => {
    const url = config.url.startsWith('http') ? config.url : `${baseURL}${config.url}`;
    
    const response = await fetch(url, {
      method: config.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...config.headers
      },
      body: config.body ? JSON.stringify(config.body) : undefined
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  };

  // Optimized request function
  const request = useCallback(async <T = any>(config: RequestConfig): Promise<T> => {
    const requestKey = getRequestKey(config);

    // Check cache first
    if (config.cache?.enabled !== false && config.method === 'GET') {
      const cacheKey = config.cache?.key || requestKey;
      const cached = localStorage.getItem(`api-cache-${cacheKey}`);
      
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const ttl = config.cache?.ttl || defaultCacheTTL;
        
        if (Date.now() - timestamp < ttl) {
          return data;
        }
      }
    }

    // Request deduplication
    if (enableRequestDeduplication && config.dedupe !== false) {
      const pending = pendingRequests.get(requestKey);
      if (pending) {
        return pending;
      }
    }

    // Debouncing
    if (config.debounce) {
      await new Promise(resolve => setTimeout(resolve, config.debounce));
    }

    // Create request promise
    const requestPromise = new Promise<T>(async (resolve, reject) => {
      try {
        // Check if should batch
        if (enableBatching && config.method === 'GET' && !config.url.includes('urgent')) {
          // Add to batch queue
          const requests = batchQueue.get(requestKey) || [];
          requests.push({ resolve, reject, config });
          batchQueue.set(requestKey, requests);

          // Schedule batch processing
          if (!batchTimerRef.current) {
            batchTimerRef.current = setTimeout(() => {
              processBatch();
              batchTimerRef.current = null;
            }, batchInterval);
          }

          return;
        }

        // Make individual request
        const data = await makeRequest(config);

        // Cache successful GET requests
        if (config.cache?.enabled !== false && config.method === 'GET') {
          const cacheKey = config.cache?.key || requestKey;
          localStorage.setItem(`api-cache-${cacheKey}`, JSON.stringify({
            data,
            timestamp: Date.now()
          }));
        }

        resolve(data);
      } catch (error) {
        reject(error);
      } finally {
        // Clean up deduplication
        if (enableRequestDeduplication) {
          pendingRequests.delete(requestKey);
        }
      }
    });

    // Store for deduplication
    if (enableRequestDeduplication && config.dedupe !== false) {
      pendingRequests.set(requestKey, requestPromise);
    }

    return requestPromise;
  }, [baseURL, defaultCacheTTL, enableRequestDeduplication, enableBatching, batchInterval, processBatch]);

  // Prefetch data
  const prefetch = useCallback(async (urls: string[]) => {
    const promises = urls.map(url => 
      request({ 
        url, 
        cache: { enabled: true, ttl: 10 * 60 * 1000 } // 10 minutes
      }).catch(() => null) // Ignore errors
    );
    
    await Promise.all(promises);
  }, [request]);

  // Clear cache
  const clearCache = useCallback((pattern?: RegExp) => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('api-cache-')) {
        if (!pattern || pattern.test(key)) {
          localStorage.removeItem(key);
        }
      }
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (batchTimerRef.current) {
        clearTimeout(batchTimerRef.current);
      }
    };
  }, []);

  return {
    request,
    prefetch,
    clearCache
  };
}

// Convenience hooks for common API calls
export function useOptimizedAPI<T = any>(
  url: string,
  options?: Partial<RequestConfig> & { enabled?: boolean }
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const { request } = useAPIOptimization();

  const fetchData = useCallback(async () => {
    if (!options?.enabled ?? true) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await request<T>({
        url,
        ...options
      });
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('API Error'));
    } finally {
      setLoading(false);
    }
  }, [url, options, request]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}