// lib/api/config.ts
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://flycycy-eldercaregamma3n.hf.space',
  fallbackURL: 'http://localhost:7860', // Local fallback
  timeout: 30000, // 30 seconds to allow for model loading
  retries: 3,
  retryDelay: 1000,
};

export const API_ENDPOINTS = {
  chat: '/chat',
  memories: '/memories',
  wellness: '/wellness',
  emergency: '/emergency',
  health: '/health',
};