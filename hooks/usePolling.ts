// hooks/usePolling.ts
import { useEffect, useRef, useCallback } from 'react';

interface UsePollingOptions {
  enabled?: boolean;
  interval?: number;
  onError?: (error: Error) => void;
  immediate?: boolean;
}

export const usePolling = (
  callback: () => void | Promise<void>,
  {
    enabled = true,
    interval = 15000, // 15 seconds default
    onError,
    immediate = true,
  }: UsePollingOptions = {}
) => {
  const savedCallback = useRef(callback);
  const intervalId = useRef<NodeJS.Timeout | null>(null);

  // Update callback ref when it changes
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const executeCallback = useCallback(async () => {
    try {
      await savedCallback.current();
    } catch (error) {
      if (onError) {
        onError(error instanceof Error ? error : new Error('Polling error'));
      }
    }
  }, [onError]);

  // Start polling
  const start = useCallback(() => {
    if (intervalId.current) return; // Already running

    // Execute immediately if requested
    if (immediate) {
      executeCallback();
    }

    intervalId.current = setInterval(executeCallback, interval);
  }, [interval, immediate, executeCallback]);

  // Stop polling
  const stop = useCallback(() => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
  }, []);

  // Manual refresh
  const refresh = useCallback(() => {
    executeCallback();
  }, [executeCallback]);

  // Setup and cleanup
  useEffect(() => {
    if (enabled) {
      start();
    } else {
      stop();
    }

    return () => {
      stop();
    };
  }, [enabled, start, stop]);

  return {
    start,
    stop,
    refresh,
    isPolling: !!intervalId.current,
  };
};