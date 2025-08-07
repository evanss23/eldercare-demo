// hooks/useOptimisticUpdate.ts
import { useState, useCallback, useRef } from 'react';

interface OptimisticUpdateOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error, rollbackData: T) => void;
  retryAttempts?: number;
  retryDelay?: number;
}

export function useOptimisticUpdate<T>(
  initialData: T,
  updateFn: (data: T) => Promise<T>,
  options: OptimisticUpdateOptions<T> = {}
) {
  const [data, setData] = useState<T>(initialData);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const rollbackDataRef = useRef<T>(initialData);

  const update = useCallback(async (optimisticData: T | ((prev: T) => T)) => {
    // Store current state for rollback
    const previousData = data;
    rollbackDataRef.current = previousData;
    
    // Apply optimistic update immediately
    const newData = typeof optimisticData === 'function' 
      ? (optimisticData as (prev: T) => T)(data)
      : optimisticData;
    
    setData(newData);
    setIsUpdating(true);
    setError(null);

    try {
      // Perform actual update
      const result = await updateFn(newData);
      
      // Update with server response
      setData(result);
      
      if (options.onSuccess) {
        options.onSuccess(result);
      }
    } catch (err) {
      // Rollback on error
      setData(previousData);
      const error = err instanceof Error ? err : new Error('Update failed');
      setError(error);
      
      if (options.onError) {
        options.onError(error, previousData);
      }
    } finally {
      setIsUpdating(false);
    }
  }, [data, updateFn, options]);

  const reset = useCallback(() => {
    setData(rollbackDataRef.current);
    setError(null);
    setIsUpdating(false);
  }, []);

  return {
    data,
    update,
    isUpdating,
    error,
    reset
  };
}