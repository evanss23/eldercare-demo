// components/APIErrorHandler.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaExclamationTriangle,
  FaWifi,
  FaServer,
  FaClock,
  FaRedo,
  FaCheckCircle
} from 'react-icons/fa';

interface APIError {
  code?: string;
  message: string;
  status?: number;
  timestamp: Date;
  endpoint?: string;
}

interface APIErrorHandlerProps {
  error: APIError | null;
  onRetry?: () => void;
  onDismiss?: () => void;
  autoRetry?: boolean;
  maxRetries?: number;
}

export const APIErrorHandler: React.FC<APIErrorHandlerProps> = ({
  error,
  onRetry,
  onDismiss,
  autoRetry = true,
  maxRetries = 3
}) => {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (error && autoRetry && retryCount < maxRetries && onRetry) {
      // Start countdown for auto-retry
      setCountdown(5);
    }
  }, [error, retryCount]);

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      handleRetry();
    }
  }, [countdown]);

  const handleRetry = async () => {
    if (!onRetry) return;
    
    setIsRetrying(true);
    setCountdown(null);
    setRetryCount(prev => prev + 1);
    
    // Simulate retry delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onRetry();
    setIsRetrying(false);
  };

  const getErrorInfo = () => {
    if (!error) return null;

    const status = error.status;
    
    if (status === 404) {
      return {
        icon: FaExclamationTriangle,
        title: 'Not Found',
        message: 'The requested information could not be found.',
        severity: 'warning' as const
      };
    } else if (status === 500 || status === 503) {
      return {
        icon: FaServer,
        title: 'Server Error',
        message: 'Our servers are experiencing issues. Please try again later.',
        severity: 'error' as const
      };
    } else if (status === 408 || error.code === 'TIMEOUT') {
      return {
        icon: FaClock,
        title: 'Request Timeout',
        message: 'The request took too long. Please check your connection.',
        severity: 'warning' as const
      };
    } else if (!navigator.onLine || error.code === 'NETWORK_ERROR') {
      return {
        icon: FaWifi,
        title: 'No Internet Connection',
        message: 'Please check your internet connection and try again.',
        severity: 'error' as const
      };
    } else {
      return {
        icon: FaExclamationTriangle,
        title: 'Something Went Wrong',
        message: error.message || 'An unexpected error occurred.',
        severity: 'error' as const
      };
    }
  };

  if (!error) return null;

  const errorInfo = getErrorInfo();
  if (!errorInfo) return null;

  const { icon: Icon, title, message, severity } = errorInfo;

  const severityStyles = {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const iconStyles = {
    error: 'bg-red-100 text-red-600',
    warning: 'bg-yellow-100 text-yellow-600',
    info: 'bg-blue-100 text-blue-600'
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`rounded-xl border p-4 ${severityStyles[severity]}`}
      >
        <div className="flex items-start space-x-4">
          {/* Icon */}
          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${iconStyles[severity]}`}>
            {isRetrying ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <FaRedo size={20} />
              </motion.div>
            ) : (
              <Icon size={20} />
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{title}</h3>
            <p className="text-sm mb-3">{message}</p>

            {/* Auto-retry countdown */}
            {countdown !== null && (
              <p className="text-sm mb-3">
                Retrying in {countdown} seconds...
              </p>
            )}

            {/* Retry attempts */}
            {retryCount > 0 && (
              <p className="text-xs mb-3 opacity-75">
                Retry attempt {retryCount} of {maxRetries}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {onRetry && retryCount < maxRetries && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setCountdown(null);
                    handleRetry();
                  }}
                  disabled={isRetrying}
                  className="text-sm font-medium hover:underline disabled:opacity-50"
                >
                  {isRetrying ? 'Retrying...' : 'Retry Now'}
                </motion.button>
              )}

              {countdown !== null && (
                <button
                  onClick={() => setCountdown(null)}
                  className="text-sm hover:underline"
                >
                  Cancel
                </button>
              )}

              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="text-sm hover:underline"
                >
                  Dismiss
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Debug info in development */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 pt-4 border-t border-current opacity-50">
            <summary className="text-xs cursor-pointer">Debug Info</summary>
            <pre className="text-xs mt-2 overflow-auto">
              {JSON.stringify({
                endpoint: error.endpoint,
                status: error.status,
                code: error.code,
                timestamp: error.timestamp
              }, null, 2)}
            </pre>
          </details>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

// Hook for API error handling
export function useAPIError() {
  const [error, setError] = useState<APIError | null>(null);

  const handleError = (err: any, endpoint?: string) => {
    const apiError: APIError = {
      message: err.message || 'An error occurred',
      status: err.status || err.response?.status,
      code: err.code,
      timestamp: new Date(),
      endpoint
    };
    
    setError(apiError);
    
    // Log to error tracking in production
    if (process.env.NODE_ENV === 'production') {
      // logToErrorTracking(apiError);
    }
  };

  const clearError = () => setError(null);

  return { error, handleError, clearError };
}

// Retry utility with exponential backoff
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    factor?: number;
    onRetry?: (attempt: number, delay: number) => void;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    factor = 2,
    onRetry
  } = options;

  let lastError: any;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries - 1) {
        const delay = Math.min(initialDelay * Math.pow(factor, attempt), maxDelay);
        
        if (onRetry) {
          onRetry(attempt + 1, delay);
        }
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}