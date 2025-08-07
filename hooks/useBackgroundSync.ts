// hooks/useBackgroundSync.ts
import { useEffect, useRef, useCallback, useState } from 'react';

interface SyncTask {
  id: string;
  data: any;
  action: string;
  timestamp: number;
  retries: number;
}

interface UseBackgroundSyncOptions {
  enabled?: boolean;
  syncInterval?: number;
  maxRetries?: number;
  onSync?: (task: SyncTask) => Promise<void>;
  onError?: (task: SyncTask, error: Error) => void;
  onSuccess?: (task: SyncTask) => void;
}

const SYNC_QUEUE_KEY = 'eldercare_sync_queue';

export function useBackgroundSync(options: UseBackgroundSyncOptions = {}) {
  const {
    enabled = true,
    syncInterval = 30000, // 30 seconds
    maxRetries = 3,
    onSync,
    onError,
    onSuccess
  } = options;

  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncQueue, setSyncQueue] = useState<SyncTask[]>([]);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load queue from storage
  const loadQueue = useCallback(() => {
    try {
      const stored = localStorage.getItem(SYNC_QUEUE_KEY);
      if (stored) {
        setSyncQueue(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load sync queue:', error);
    }
  }, []);

  // Save queue to storage
  const saveQueue = useCallback((queue: SyncTask[]) => {
    try {
      localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
      setSyncQueue(queue);
    } catch (error) {
      console.error('Failed to save sync queue:', error);
    }
  }, []);

  // Add task to queue
  const addToQueue = useCallback((action: string, data: any) => {
    const task: SyncTask = {
      id: `${Date.now()}-${Math.random()}`,
      action,
      data,
      timestamp: Date.now(),
      retries: 0
    };

    setSyncQueue(prev => {
      const updated = [...prev, task];
      saveQueue(updated);
      return updated;
    });

    // Trigger immediate sync if online
    if (isOnline) {
      performSync();
    }
  }, [isOnline, saveQueue]);

  // Remove task from queue
  const removeFromQueue = useCallback((taskId: string) => {
    setSyncQueue(prev => {
      const updated = prev.filter(task => task.id !== taskId);
      saveQueue(updated);
      return updated;
    });
  }, [saveQueue]);

  // Perform sync
  const performSync = useCallback(async () => {
    if (!isOnline || isSyncing || syncQueue.length === 0 || !onSync) {
      return;
    }

    setIsSyncing(true);
    const queue = [...syncQueue];

    for (const task of queue) {
      try {
        await onSync(task);
        removeFromQueue(task.id);
        if (onSuccess) {
          onSuccess(task);
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Sync failed');
        
        if (task.retries < maxRetries) {
          // Update retry count
          setSyncQueue(prev => {
            const updated = prev.map(t => 
              t.id === task.id 
                ? { ...t, retries: t.retries + 1 }
                : t
            );
            saveQueue(updated);
            return updated;
          });
        } else {
          // Max retries reached, remove from queue
          removeFromQueue(task.id);
          if (onError) {
            onError(task, err);
          }
        }
      }
    }

    setIsSyncing(false);
  }, [isOnline, isSyncing, syncQueue, onSync, onSuccess, onError, maxRetries, removeFromQueue, saveQueue]);

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      performSync();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [performSync]);

  // Set up periodic sync
  useEffect(() => {
    if (enabled && isOnline) {
      syncIntervalRef.current = setInterval(performSync, syncInterval);
    }

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [enabled, isOnline, syncInterval, performSync]);

  // Load queue on mount
  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  return {
    isOnline,
    isSyncing,
    syncQueue,
    addToQueue,
    removeFromQueue,
    performSync,
    queueLength: syncQueue.length
  };
}