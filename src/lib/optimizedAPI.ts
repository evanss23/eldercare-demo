// lib/optimizedAPI.ts
import { retryWithBackoff } from '@/components/APIErrorHandler';

interface APIClientConfig {
  baseURL: string;
  timeout?: number;
  retries?: number;
  cache?: {
    ttl?: number;
    storage?: 'memory' | 'localStorage' | 'sessionStorage';
  };
}

class OptimizedAPIClient {
  private baseURL: string;
  private timeout: number;
  private retries: number;
  private cache: Map<string, { data: any; timestamp: number }>;
  private cacheTTL: number;
  private abortControllers: Map<string, AbortController>;
  private requestQueue: Map<string, Promise<any>>;

  constructor(config: APIClientConfig) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout || 15000;
    this.retries = config.retries || 3;
    this.cache = new Map();
    this.cacheTTL = config.cache?.ttl || 5 * 60 * 1000; // 5 minutes
    this.abortControllers = new Map();
    this.requestQueue = new Map();
  }

  private getCacheKey(endpoint: string, params?: any): string {
    return `${endpoint}-${JSON.stringify(params || {})}`;
  }

  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
    
    // Limit cache size
    if (this.cache.size > 100) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }

  // Cancel ongoing requests
  public cancelRequest(endpoint: string): void {
    const controller = this.abortControllers.get(endpoint);
    if (controller) {
      controller.abort();
      this.abortControllers.delete(endpoint);
    }
  }

  // Batch multiple GET requests
  public async batchGet(endpoints: string[]): Promise<any[]> {
    const promises = endpoints.map(endpoint => this.get(endpoint));
    return Promise.all(promises);
  }

  // GET request with caching and deduplication
  public async get<T = any>(endpoint: string, params?: any): Promise<T> {
    const cacheKey = this.getCacheKey(endpoint, params);
    
    // Check cache first
    const cached = this.getFromCache(cacheKey);
    if (cached !== null) {
      return cached;
    }

    // Check if request is already in progress (deduplication)
    const existingRequest = this.requestQueue.get(cacheKey);
    if (existingRequest) {
      return existingRequest;
    }

    // Create abort controller
    const controller = new AbortController();
    this.abortControllers.set(endpoint, controller);

    // Create request promise
    const requestPromise = retryWithBackoff(
      async () => {
        const url = new URL(`${this.baseURL}${endpoint}`);
        if (params) {
          Object.keys(params).forEach(key => 
            url.searchParams.append(key, params[key])
          );
        }

        const response = await fetch(url.toString(), {
          method: 'GET',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        
        // Cache successful response
        this.setCache(cacheKey, data);
        
        return data;
      },
      {
        maxRetries: this.retries,
        initialDelay: 1000,
        onRetry: (attempt, delay) => {
          console.log(`Retrying ${endpoint} (attempt ${attempt}) after ${delay}ms`);
        }
      }
    ).finally(() => {
      this.abortControllers.delete(endpoint);
      this.requestQueue.delete(cacheKey);
    });

    // Store in request queue
    this.requestQueue.set(cacheKey, requestPromise);

    return requestPromise;
  }

  // POST request
  public async post<T = any>(endpoint: string, data?: any): Promise<T> {
    const controller = new AbortController();
    
    return retryWithBackoff(
      async () => {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        return response.json();
      },
      {
        maxRetries: this.retries,
        initialDelay: 1000
      }
    );
  }

  // Prefetch endpoints
  public async prefetch(endpoints: string[]): Promise<void> {
    const promises = endpoints.map(async endpoint => {
      try {
        await this.get(endpoint);
      } catch (error) {
        console.warn(`Failed to prefetch ${endpoint}:`, error);
      }
    });
    
    await Promise.all(promises);
  }

  // Clear cache
  public clearCache(pattern?: RegExp): void {
    if (pattern) {
      Array.from(this.cache.keys()).forEach(key => {
        if (pattern.test(key)) {
          this.cache.delete(key);
        }
      });
    } else {
      this.cache.clear();
    }
  }

  // Get cache stats
  public getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.entries()).map(([key, value]) => ({
        key,
        age: Date.now() - value.timestamp,
        size: JSON.stringify(value.data).length
      }))
    };
  }
}

// Create singleton instance
export const apiClient = new OptimizedAPIClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://flycycy-eldercareai.hf.space',
  timeout: 15000,
  retries: 3,
  cache: {
    ttl: 5 * 60 * 1000 // 5 minutes
  }
});

// Prefetch critical data on app load
if (typeof window !== 'undefined') {
  // Prefetch after initial render
  setTimeout(() => {
    apiClient.prefetch([
      '/api/profile',
      '/api/memories/recent',
      '/api/wellness/status'
    ]);
  }, 1000);
}

// Export convenience functions
export const api = {
  get: apiClient.get.bind(apiClient),
  post: apiClient.post.bind(apiClient),
  batchGet: apiClient.batchGet.bind(apiClient),
  prefetch: apiClient.prefetch.bind(apiClient),
  clearCache: apiClient.clearCache.bind(apiClient),
  cancelRequest: apiClient.cancelRequest.bind(apiClient),
};