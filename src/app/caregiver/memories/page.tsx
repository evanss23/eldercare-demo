"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlus, 
  FaArrowLeft, 
  FaImage, 
  FaMusic,
  FaCloudUploadAlt,
  FaWifi,
  FaExclamationCircle
} from 'react-icons/fa';
import Link from 'next/link';
import { MemoryUpload } from '@/components/MemoryUpload';
import { MemoryItem } from '@/components/MemoryItem';
import { useCache } from '@/../../hooks/useCache';
import { useBackgroundSync } from '@/../../hooks/useBackgroundSync';
import { useToast } from '@/../../hooks/useToast';
import { ToastContainer } from '@/components/Toast';
import { MemoryCardShimmer } from '@/components/Shimmer';
import { MemoriesEmpty, MusicEmpty } from '@/components/EmptyStates';
import { StaggerChildren, RippleButton, HoverLift, TapScale } from '@/components/MicroInteractions';

interface Memory {
  id: string;
  type: 'photo' | 'music';
  url: string;
  caption: string;
  date: string;
  uploadStatus?: 'pending' | 'uploading' | 'completed' | 'error';
  uploadProgress?: number;
}

// Initial memories
const initialMemories: Memory[] = [
  {
    id: '1',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa',
    caption: 'Grammy at her 80th birthday party! She was so happy 🎂',
    date: '2 days ago',
    uploadStatus: 'completed'
  },
  {
    id: '2',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4',
    caption: 'Family dinner last Sunday. Everyone was there!',
    date: '5 days ago',
    uploadStatus: 'completed'
  }
];

export default function CaregiverMemoriesPage() {
  const [showUpload, setShowUpload] = useState(false);
  const [memories, setMemories] = useState<Memory[]>(initialMemories);
  const [filter, setFilter] = useState<'all' | 'photo' | 'music'>('all');
  const [isLoading, setIsLoading] = useState(true);
  
  const { toasts, removeToast, success, error } = useToast();
  
  // Cache memories
  const { data: cachedMemories, setCache } = useCache<Memory[]>({
    key: 'caregiver_memories',
    ttl: 10 * 60 * 1000, // 10 minutes
    fallbackData: initialMemories
  });

  // Background sync
  const { isOnline, isSyncing, syncQueue, performSync } = useBackgroundSync({
    onSync: async (task) => {
      if (task.action === 'upload_memory') {
        // Simulate API call
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            if (Math.random() > 0.1) {
              resolve(true);
            } else {
              reject(new Error('Network error'));
            }
          }, 2000);
        });
      }
    },
    onSuccess: (task) => {
      // Update memory status
      setMemories(prev => prev.map(m => 
        m.id === task.data.memory.id
          ? { ...m, uploadStatus: 'completed', uploadProgress: 100 }
          : m
      ));
      success('Memory synced successfully!');
    },
    onError: (task, err) => {
      // Mark as error
      setMemories(prev => prev.map(m => 
        m.id === task.data.memory.id
          ? { ...m, uploadStatus: 'error', uploadProgress: 0 }
          : m
      ));
      error(`Failed to sync memory: ${err.message}`);
    }
  });

  // Load cached memories on mount
  useEffect(() => {
    if (cachedMemories && cachedMemories.length > 0) {
      setMemories(cachedMemories);
    }
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [cachedMemories]);

  // Update cache when memories change
  useEffect(() => {
    setCache(memories);
  }, [memories, setCache]);

  const handleUpload = (memory: Memory) => {
    setMemories(prev => {
      const existing = prev.find(m => m.id === memory.id);
      if (existing) {
        // Update existing
        return prev.map(m => m.id === memory.id ? memory : m);
      } else {
        // Add new
        return [memory, ...prev];
      }
    });
  };

  const handleRetry = (memoryId: string) => {
    const memory = memories.find(m => m.id === memoryId);
    if (memory) {
      // Reset status and trigger upload
      handleUpload({
        ...memory,
        uploadStatus: 'uploading',
        uploadProgress: 0
      });
      
      // Re-trigger sync
      performSync();
    }
  };

  const filteredMemories = memories.filter(m => 
    filter === 'all' || m.type === filter
  );

  const pendingCount = memories.filter(m => 
    m.uploadStatus === 'pending' || m.uploadStatus === 'uploading'
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/caregiver/dashboard">
                <TapScale>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <FaArrowLeft className="text-gray-600" size={20} />
                  </button>
                </TapScale>
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">Memory Collection</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Connection Status */}
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                isOnline ? 'bg-green-100' : 'bg-yellow-100'
              }`}>
                {isOnline ? (
                  <FaWifi className="text-green-600" size={16} />
                ) : (
                  <FaExclamationCircle className="text-yellow-600" size={16} />
                )}
                <span className={`text-sm font-medium ${
                  isOnline ? 'text-green-700' : 'text-yellow-700'
                }`}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>

              {/* Sync Status */}
              {(isSyncing || pendingCount > 0) && (
                <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100">
                  <FaCloudUploadAlt className="text-blue-600 animate-pulse" size={16} />
                  <span className="text-sm font-medium text-blue-700">
                    {isSyncing ? 'Syncing...' : `${pendingCount} pending`}
                  </span>
                </div>
              )}

              {/* Upload Button */}
              <RippleButton
                onClick={() => setShowUpload(true)}
                variant="primary"
                size="md"
              >
                <span className="flex items-center space-x-2">
                  <FaPlus size={16} />
                  <span>Upload Memory</span>
                </span>
              </RippleButton>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            All Memories
          </button>
          <button
            onClick={() => setFilter('photo')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'photo'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FaImage size={16} />
            <span>Photos</span>
          </button>
          <button
            onClick={() => setFilter('music')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'music'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FaMusic size={16} />
            <span>Music</span>
          </button>
        </div>

        {/* Memories Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <MemoryCardShimmer key={i} />
            ))}
          </div>
        ) : filteredMemories.length > 0 ? (
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMemories.map((memory) => (
              <HoverLift key={memory.id}>
                <MemoryItem
                  memory={memory}
                  onRetry={() => handleRetry(memory.id)}
                />
              </HoverLift>
            ))}
          </StaggerChildren>
        ) : null}

        {/* Empty State */}
        {!isLoading && filteredMemories.length === 0 && (
          filter === 'music' ? (
            <MusicEmpty onAdd={() => setShowUpload(true)} />
          ) : (
            <MemoriesEmpty onUpload={() => setShowUpload(true)} />
          )
        )}
      </main>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <MemoryUpload
            onUpload={handleUpload}
            onClose={() => setShowUpload(false)}
          />
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <ToastContainer 
        toasts={toasts} 
        onClose={removeToast} 
        position="bottom-right" 
      />
    </div>
  );
}