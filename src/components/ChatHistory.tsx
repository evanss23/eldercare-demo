"use client";

import { motion } from "framer-motion";
import { FaMicrophone, FaKeyboard, FaArrowLeft, FaPlay } from "react-icons/fa";
import { mockChatHistory, mockProfile } from "../mockData";
import Link from "next/link";
import { useState } from "react";

export default function ChatHistory() {
  const [playingId, setPlayingId] = useState<number | null>(null);

  const handlePlayVoice = (id: number) => {
    setPlayingId(id);
    // Simulate playing
    setTimeout(() => setPlayingId(null), 2000);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/caregiver">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <FaArrowLeft className="text-gray-600" size={20} />
                </motion.button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">Chat with {mockProfile.name}</h1>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Active now</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Chat Messages */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4 mb-20"
        >
          {mockChatHistory.map((message) => (
            <motion.div
              key={message.id}
              variants={item}
              className={`flex ${message.from === 'caretaker' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-lg ${message.from === 'caretaker' ? 'order-2' : 'order-1'}`}>
                <div className="flex items-start space-x-3">
                  {message.from === 'elder' && (
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      G
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className={`rounded-2xl p-4 ${
                      message.from === 'caretaker'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white shadow-md'
                    }`}>
                      {message.type === 'voice' ? (
                        <div className="flex items-center space-x-3">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handlePlayVoice(message.id)}
                            className={`p-3 rounded-full ${
                              message.from === 'caretaker'
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'bg-purple-100 hover:bg-purple-200'
                            }`}
                          >
                            {playingId === message.id ? (
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 1 }}
                              >
                                <FaMicrophone className={message.from === 'caretaker' ? 'text-white' : 'text-purple-600'} size={16} />
                              </motion.div>
                            ) : (
                              <FaPlay className={message.from === 'caretaker' ? 'text-white' : 'text-purple-600'} size={16} />
                            )}
                          </motion.button>
                          <div className="flex-1">
                            <p className={message.from === 'caretaker' ? 'text-white' : 'text-gray-800'}>
                              {message.message}
                            </p>
                            <p className={`text-sm mt-1 ${
                              message.from === 'caretaker' ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              Voice message • {message.duration}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className={message.from === 'caretaker' ? 'text-white' : 'text-gray-800'}>
                          {message.message}
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 px-2">
                      {message.timestamp}
                    </p>
                  </div>

                  {message.from === 'caretaker' && (
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      C
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Message Actions */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="max-w-4xl mx-auto flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white rounded-lg py-3 flex items-center justify-center space-x-2 transition-colors"
            >
              <FaMicrophone size={20} />
              <span>Send Voice Message</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-3 flex items-center justify-center space-x-2 transition-colors"
            >
              <FaKeyboard size={20} />
              <span>Type Message</span>
            </motion.button>
          </div>
        </div>

        {/* Message Templates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-32 mt-8"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Messages</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              "How are you feeling today?",
              "Did you take your medication?",
              "I love you!",
              "Call me when you can"
            ].map((template, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg p-3 text-sm transition-colors"
              >
                {template}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}