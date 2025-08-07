"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMusic, FaComments, FaHeart, FaClock, FaPills, FaExclamationCircle, FaExpand, FaSparkles } from "react-icons/fa";
import { mockMemories, mockProfile } from "../mockData";
import Link from "next/link";
import { usePolling } from "@/../../hooks/usePolling";
import { useToast } from "@/../../hooks/useToast";
import { ToastContainer } from "@/components/Toast";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { APIErrorHandler, useAPIError } from "@/components/APIErrorHandler";

function ElderHomeScreenContent() {
  const [currentMemoryIndex, setCurrentMemoryIndex] = useState(0);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const [showMedicationModal, setShowMedicationModal] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [memories, setMemories] = useState(mockMemories);
  const [hasNewMemory, setHasNewMemory] = useState(false);
  
  const photoMemories = memories.filter(m => m.type === 'photo');
  const musicMemories = memories.filter(m => m.type === 'music');
  const lastMemoryCount = useRef(memories.length);
  
  const { toasts, removeToast, notification } = useToast();

  // Simulate fetching new memories from API
  const fetchMemories = async () => {
    // In real app, this would call the API
    // For demo, we'll simulate new memories occasionally
    if (Math.random() > 0.7) {
      const newMemory = {
        id: `new-${Date.now()}`,
        type: 'photo' as const,
        url: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000000)}?w=800&h=600&fit=crop`,
        caption: `New memory from ${['Sarah', 'Michael', 'Emma', 'David'][Math.floor(Math.random() * 4)]}! 💕`,
        date: 'Just now',
        category: 'family',
        createdBy: 'family'
      };
      
      setMemories(prev => {
        const updated = [newMemory, ...prev];
        return updated;
      });
      
      setHasNewMemory(true);
      
      // Show notification
      notification(
        `New memory from your family! 💝`,
        4000,
        {
          label: 'View now',
          onClick: () => {
            setCurrentMemoryIndex(0);
            setHasNewMemory(false);
          }
        }
      );
    }
  };

  // Poll for new memories
  usePolling(fetchMemories, {
    enabled: true,
    interval: 15000, // 15 seconds
    immediate: false
  });

  // Auto-advance slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      if (!hasNewMemory) {
        setCurrentMemoryIndex((prev) => (prev + 1) % photoMemories.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [photoMemories.length, hasNewMemory]);

  const currentMemory = photoMemories[currentMemoryIndex];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Bar */}
      <div className="bg-white shadow-sm p-4 z-20">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-gray-800 text-2xl font-bold">Hello, {mockProfile.name}!</h1>
            <p className="text-gray-600 text-sm">
              Saturday, January 20
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-600 hover:bg-red-700 text-white rounded-full p-3 shadow-lg"
          >
            <FaExclamationCircle size={24} />
          </motion.button>
        </div>
      </div>

      {/* Photo Slideshow - Smaller with clickable fullscreen */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMemoryIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="h-full relative cursor-pointer"
            onClick={() => setShowFullscreen(true)}
          >
            <ImageWithFallback
              src={currentMemory.url}
              alt={currentMemory.caption}
              className="w-full h-full"
              fallbackSrc="/images/memory-placeholder.jpg"
              onError={() => {
                console.error('Failed to load memory image:', currentMemory.url);
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            
            {/* Progress Indicators */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 px-6">
              {photoMemories.map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index === currentMemoryIndex ? 'w-8 bg-white' : 'w-1 bg-white/50'
                  }`}
                />
              ))}
            </div>

            {/* Tap to fullscreen hint */}
            <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs flex items-center space-x-1">
              <FaExpand size={10} />
              <span>Tap for fullscreen</span>
            </div>

            {/* New Memory Indicator */}
            <AnimatePresence>
              {hasNewMemory && currentMemoryIndex === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2"
                >
                  <motion.div
                    animate={{ rotate: [0, 180, 360] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <FaSparkles size={16} />
                  </motion.div>
                  <span className="font-medium">New Memory!</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Memory Caption - Smaller */}
      <div className="bg-white p-4 shadow-lg">
        <div className="flex items-start justify-between mb-1">
          <div className="text-xs text-purple-600 font-medium bg-purple-100 px-2 py-1 rounded-full">
            From your family ❤️
          </div>
        </div>
        <p className="text-gray-800 text-lg font-medium">{currentMemory.caption}</p>
        <div className="flex items-center space-x-4 mt-2">
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="text-red-500"
          >
            <FaHeart size={24} />
          </motion.button>
          <span className="text-gray-600 text-sm">{currentMemory.date}</span>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 p-4">
        {/* Chat with Vera Button - Bigger and on top */}
        <div className="mb-4">
          <Link href="/elder/chat">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-2xl py-5 shadow-xl transition-all"
            >
              <div className="flex items-center justify-center space-x-3">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <FaComments size={32} />
                </motion.div>
                <div>
                  <div className="text-xl font-bold">Chat with Vera</div>
                  <div className="text-sm opacity-90">Talk to your AI companion</div>
                </div>
              </div>
            </motion.button>
          </Link>
        </div>

        {/* Secondary Actions */}
        <div className="grid grid-cols-3 gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMusicPlayer(true)}
            className="bg-purple-500 hover:bg-purple-600 text-white rounded-xl py-3 flex flex-col items-center space-y-1 shadow-lg transition-colors"
          >
            <FaMusic size={20} />
            <span className="text-xs font-medium">Music</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMedicationModal(true)}
            className="bg-green-500 hover:bg-green-600 text-white rounded-xl py-3 flex flex-col items-center space-y-1 shadow-lg transition-colors"
          >
            <FaPills size={20} />
            <span className="text-xs font-medium">Medicine</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-500 hover:bg-red-600 text-white rounded-xl py-3 flex flex-col items-center space-y-1 shadow-lg transition-colors"
          >
            <FaExclamationCircle size={20} />
            <span className="text-xs font-medium">Emergency</span>
          </motion.button>
        </div>
      </div>

      {/* Music Player Modal */}
      <AnimatePresence>
        {showMusicPlayer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 z-40 flex items-center justify-center p-6"
            onClick={() => setShowMusicPlayer(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Your Music</h2>
              <div className="space-y-4">
                {musicMemories.map((music) => (
                  <motion.button
                    key={music.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 text-left hover:from-purple-200 hover:to-pink-200 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-800">{music.title}</h3>
                    <p className="text-gray-600 text-sm">{music.artist}</p>
                    <p className="text-purple-600 text-xs mt-1">{music.caption}</p>
                  </motion.button>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowMusicPlayer(false)}
                className="w-full mt-6 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl py-3 font-medium transition-colors"
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Medication Modal */}
      <AnimatePresence>
        {showMedicationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 z-40 flex items-center justify-center p-6"
            onClick={() => setShowMedicationModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Your Medications</h2>
              <div className="space-y-4">
                {mockProfile.medications.map((medication, index) => (
                  <div key={index} className={`p-4 rounded-xl border-2 ${
                    medication.taken ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{medication.name}</h3>
                        <p className="text-gray-600">{medication.time}</p>
                      </div>
                      <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                        medication.taken 
                          ? 'bg-green-200 text-green-800' 
                          : 'bg-orange-200 text-orange-800'
                      }`}>
                        {medication.taken ? '✓ Taken' : 'Take Now'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowMedicationModal(false)}
                className="w-full mt-6 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl py-4 text-xl font-medium transition-colors"
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {showFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
            onClick={() => setShowFullscreen(false)}
          >
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={currentMemory.url}
              alt={currentMemory.caption}
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setShowFullscreen(false)}
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <ToastContainer 
        toasts={toasts} 
        onClose={removeToast} 
        position="top-center" 
      />
    </div>
  );
}

// Export with ErrorBoundary wrapper
export default function ElderHomeScreen() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('ElderHomeScreen Error:', error, errorInfo);
        // Send to error tracking service in production
      }}
    >
      <ElderHomeScreenContent />
    </ErrorBoundary>
  );
}