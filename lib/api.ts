// lib/api.ts - ElderCare API Client

import { API_CONFIG, API_ENDPOINTS } from './api/config';

// TypeScript types for API responses
export interface SafetyStatus {
  level: 'green' | 'yellow' | 'red';
  message: string;
}

export interface ChatResponse {
  ai_response: string;
  emotion: 'calm' | 'happy' | 'sad' | 'anxious' | 'confused' | 'angry';
  wellness_score: number;
  safety_status: SafetyStatus;
  chat_history: Array<{
    timestamp: string;
    user: string;
    ai: string;
  }>;
}

export interface ApiResponse<T> {
  data: T[];
}

export interface ApiError {
  error: string;
  status?: number;
}

// Loading state management
export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

// Cache configuration
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class ElderCareAPI {
  private baseUrl: string;
  private cache: Map<string, CacheEntry<any>>;
  private cacheTimeout: number;
  private maxRetries: number;
  private retryDelay: number;

  constructor() {
    this.baseUrl = API_CONFIG.baseURL;
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    this.maxRetries = API_CONFIG.retries;
    this.retryDelay = API_CONFIG.retryDelay;
  }

  // Generic fetch with retry logic
  private async fetchWithRetry<T>(
    url: string,
    options: RequestInit,
    retries = 0
  ): Promise<T> {
    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - Please check if the backend is running');
      }
      
      if (retries < this.maxRetries) {
        console.warn(`Retry attempt ${retries + 1}/${this.maxRetries} after error:`, error);
        await this.delay(this.retryDelay * (retries + 1));
        return this.fetchWithRetry<T>(url, options, retries + 1);
      }
      throw error;
    }
  }

  // Utility delay function
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Cache management
  private getCached<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > this.cacheTimeout;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  // Clear cache
  public clearCache(): void {
    this.cache.clear();
  }

  // Main chat endpoint
  public async sendMessage(message: string): Promise<ChatResponse> {
    const cacheKey = `chat:${message}`;
    
    // Check cache first
    const cached = this.getCached<ApiResponse<ChatResponse>>(cacheKey);
    if (cached) {
      return cached.data[0];
    }

    try {
      const response = await this.fetchWithRetry<ApiResponse<ChatResponse>>(
        `${this.baseUrl}${API_ENDPOINTS.chat}`,
        {
          method: 'POST',
          body: JSON.stringify({ data: [message] }),
        }
      );

      // Cache the response
      this.setCache(cacheKey, response);

      return response.data[0];
    } catch (error) {
      console.error('Failed to send message:', error);
      throw new Error('Failed to communicate with the AI assistant. Please try again.');
    }
  }

  // Voice message endpoint (for future use)
  public async sendVoiceMessage(audioBlob: Blob): Promise<ChatResponse> {
    // Convert audio to base64 for sending
    const base64Audio = await this.blobToBase64(audioBlob);
    
    try {
      const response = await this.fetchWithRetry<ApiResponse<ChatResponse>>(
        `${this.baseUrl}${API_ENDPOINTS.chat}`,
        {
          method: 'POST',
          body: JSON.stringify({ 
            data: ['[Voice Message]'],
            audio: base64Audio 
          }),
        }
      );

      return response.data[0];
    } catch (error) {
      console.error('Failed to send voice message:', error);
      throw new Error('Failed to send voice message. Please try again.');
    }
  }

  // Utility function to convert blob to base64
  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Health check endpoint
  public async checkHealth(): Promise<boolean> {
    try {
      await this.fetchWithRetry<any>(
        this.baseUrl.replace('/chat', '/health'),
        { method: 'GET' }
      );
      return true;
    } catch {
      return false;
    }
  }

  // Memories endpoint
  public async getMemories(): Promise<any> {
    try {
      const response = await this.fetchWithRetry<ApiResponse<any>>(
        `${this.baseUrl}${API_ENDPOINTS.memories}`,
        { method: 'GET' }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch memories:', error);
      throw new Error('Failed to retrieve memories.');
    }
  }

  // Wellness check endpoint
  public async getWellnessStatus(): Promise<any> {
    const cached = this.getCached<any>('wellness:status');
    if (cached) return cached;

    try {
      const response = await this.fetchWithRetry<ApiResponse<any>>(
        `${this.baseUrl}${API_ENDPOINTS.wellness}`,
        { method: 'GET' }
      );
      this.setCache('wellness:status', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch wellness status:', error);
      throw new Error('Failed to retrieve wellness status.');
    }
  }

  // Emergency check endpoint
  public async checkEmergency(data: any): Promise<boolean> {
    try {
      const response = await this.fetchWithRetry<ApiResponse<{emergency: boolean}>>(
        `${this.baseUrl}${API_ENDPOINTS.emergency}`,
        {
          method: 'POST',
          body: JSON.stringify({ data }),
        }
      );
      return response.data[0]?.emergency || false;
    } catch (error) {
      console.error('Emergency check failed:', error);
      // In case of emergency check failure, err on side of caution
      return true;
    }
  }
}

// Create singleton instance
export const elderCareAPI = new ElderCareAPI();

// React hook for API calls with loading states
import { useState, useCallback } from 'react';

export function useElderCareAPI() {
  const [state, setState] = useState<ApiState<ChatResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const sendMessage = useCallback(async (message: string) => {
    setState({ data: null, loading: true, error: null });
    
    try {
      const response = await elderCareAPI.sendMessage(message);
      setState({ data: response, loading: false, error: null });
      return response;
    } catch (error) {
      setState({ 
        data: null, 
        loading: false, 
        error: error instanceof Error ? error : new Error('Unknown error') 
      });
      throw error;
    }
  }, []);

  const sendVoiceMessage = useCallback(async (audioBlob: Blob) => {
    setState({ data: null, loading: true, error: null });
    
    try {
      const response = await elderCareAPI.sendVoiceMessage(audioBlob);
      setState({ data: response, loading: false, error: null });
      return response;
    } catch (error) {
      setState({ 
        data: null, 
        loading: false, 
        error: error instanceof Error ? error : new Error('Unknown error') 
      });
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    sendMessage,
    sendVoiceMessage,
    clearError,
    clearCache: elderCareAPI.clearCache.bind(elderCareAPI),
  };
}