// hooks/useToast.ts
import { useState, useCallback } from 'react';
import { ToastType } from '@/components/Toast';

export interface ToastItem {
  id: string;
  message: string;
  type?: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((
    message: string,
    type?: ToastType,
    duration?: number,
    action?: { label: string; onClick: () => void }
  ) => {
    const id = Date.now().toString();
    const newToast: ToastItem = {
      id,
      message,
      type,
      duration,
      action,
    };
    
    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const success = useCallback((message: string, duration?: number) => {
    return addToast(message, 'success', duration);
  }, [addToast]);

  const error = useCallback((message: string, duration?: number) => {
    return addToast(message, 'error', duration || 7000); // Errors stay longer
  }, [addToast]);

  const info = useCallback((message: string, duration?: number) => {
    return addToast(message, 'info', duration);
  }, [addToast]);

  const warning = useCallback((message: string, duration?: number) => {
    return addToast(message, 'warning', duration || 6000);
  }, [addToast]);

  const notification = useCallback((message: string, duration?: number, action?: { label: string; onClick: () => void }) => {
    return addToast(message, 'notification', duration, action);
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    success,
    error,
    info,
    warning,
    notification,
  };
};