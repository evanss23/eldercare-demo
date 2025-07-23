"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMusic, FaComments, FaHeart, FaClock, FaPills, FaExclamationCircle } from "react-icons/fa";
import { mockMemories, mockProfile } from "../mockData";
import Link from "next/link";

export default function ElderHomeScreen() {
  const [currentMemoryIndex, setCurrentMemoryIndex] = useState(0);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const photoMemories = mockMemories.filter(m => m.type === 'photo');
  const musicMemories = mockMemories.filter(m => m.type === 'music');

  // Auto-advance slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMemoryIndex((prev) => (prev + 1) % photoMemories.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [photoMemories.length]);

  const currentMemory = photoMemories[currentMemoryIndex];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Instagram-like Photo Slideshow */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMemoryIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <img
            src={currentMemory.url}
            alt={currentMemory.caption}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-6 z-20">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-white text-3xl font-bold">Hello, {mockProfile.name}!</h1>
            <p className="text-white/80 text-lg mt-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 shadow-lg"
          >
            <FaExclamationCircle size={32} />
          </motion.button>
        </div>
      </div>

      {/* Memory Caption */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-40 left-0 right-0 px-6 z-20"
      >
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl">
          <p className="text-gray-800 text-xl font-medium">{currentMemory.caption}</p>
          <div className="flex items-center space-x-4 mt-3">
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="text-red-500"
            >
              <FaHeart size={28} />
            </motion.button>
            <span className="text-gray-600">{currentMemory.date}</span>
          </div>
        </div>
      </motion.div>

      {/* Progress Indicators */}
      <div className="absolute bottom-32 left-0 right-0 flex justify-center space-x-2 px-6 z-20">
        {photoMemories.map((_, index) => (
          <motion.div
            key={index}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === currentMemoryIndex ? 'w-8 bg-white' : 'w-1 bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md p-4 z-30">
        <div className="grid grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMusicPlayer(true)}
            className="bg-purple-500 hover:bg-purple-600 text-white rounded-2xl py-4 flex flex-col items-center space-y-2 shadow-lg transition-colors"
          >
            <FaMusic size={28} />
            <span className="text-sm font-medium">Music</span>
          </motion.button>

          <Link href="/elder/chat">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl py-4 flex flex-col items-center space-y-2 shadow-lg transition-colors w-full"
            >
              <FaComments size={28} />
              <span className="text-sm font-medium">Chat</span>
            </motion.button>
          </Link>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-500 hover:bg-green-600 text-white rounded-2xl py-4 flex flex-col items-center space-y-2 shadow-lg transition-colors"
          >
            <FaPills size={28} />
            <span className="text-sm font-medium">Medicine</span>
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

      {/* Medication Reminder (appears periodically) */}
      <AnimatePresence>
        {mockProfile.medications.some(m => !m.taken) && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="absolute top-32 left-6 bg-yellow-500 text-white rounded-2xl p-4 shadow-lg z-30 max-w-xs"
          >
            <div className="flex items-center space-x-3">
              <FaClock size={24} />
              <div>
                <p className="font-semibold">Medicine Reminder</p>
                <p className="text-sm">Time for your {mockProfile.medications.find(m => !m.taken)?.name}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}