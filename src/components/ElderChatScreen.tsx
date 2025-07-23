"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMicrophone, FaKeyboard, FaArrowLeft, FaStop } from "react-icons/fa";
import Link from "next/link";

export default function ElderChatScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleSendText = () => {
    if (message.trim()) {
      setShowSuccess(true);
      setMessage("");
      setShowTextInput(false);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 relative">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link href="/elder">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-xl hover:bg-gray-100"
              >
                <FaArrowLeft className="text-gray-600" size={24} />
              </motion.button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Chat with Family</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {!showTextInput && !isRecording && !showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">
                  How would you like to send a message?
                </h2>
                <p className="text-xl text-gray-600">Choose voice or text</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Voice Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStartRecording}
                  className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-12 shadow-xl hover:shadow-2xl transition-all"
                >
                  <div className="flex flex-col items-center space-y-6">
                    <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                      <FaMicrophone className="text-white" size={60} />
                    </div>
                    <div className="text-white">
                      <h3 className="text-3xl font-bold mb-2">Voice Message</h3>
                      <p className="text-lg opacity-90">Tap to start recording</p>
                    </div>
                  </div>
                </motion.button>

                {/* Text Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowTextInput(true)}
                  className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl p-12 shadow-xl hover:shadow-2xl transition-all"
                >
                  <div className="flex flex-col items-center space-y-6">
                    <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                      <FaKeyboard className="text-white" size={60} />
                    </div>
                    <div className="text-white">
                      <h3 className="text-3xl font-bold mb-2">Text Message</h3>
                      <p className="text-lg opacity-90">Tap to type a message</p>
                    </div>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Recording Screen */}
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <div className="mb-12">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Recording...</h2>
                <p className="text-xl text-gray-600">Speak your message clearly</p>
              </div>

              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="inline-block mb-12"
              >
                <div className="w-48 h-48 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
                  <FaMicrophone className="text-white" size={80} />
                </div>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStopRecording}
                className="bg-red-600 hover:bg-red-700 text-white rounded-full px-12 py-6 text-2xl font-semibold shadow-lg transition-colors inline-flex items-center space-x-4"
              >
                <FaStop size={28} />
                <span>Stop Recording</span>
              </motion.button>
            </motion.div>
          )}

          {/* Text Input Screen */}
          {showTextInput && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Type Your Message</h2>
                <p className="text-lg text-gray-600">Write what you want to say</p>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-6 py-4 text-2xl border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-transparent"
                  rows={6}
                  placeholder="Type your message here..."
                  autoFocus
                />

                <div className="flex space-x-4 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowTextInput(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl py-4 text-xl font-semibold transition-colors"
                  >
                    Cancel
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSendText}
                    disabled={!message.trim()}
                    className={`flex-1 rounded-xl py-4 text-xl font-semibold transition-colors ${
                      message.trim()
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Send Message
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Success Message */}
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="w-48 h-48 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-green-600"
                >
                  <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              </motion.div>
              <h3 className="text-4xl font-bold text-gray-800 mb-4">Message Sent!</h3>
              <p className="text-xl text-gray-600">Your family will receive it soon</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Tips */}
        {!showTextInput && !isRecording && !showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Tips</h3>
            <ul className="space-y-3 text-lg text-gray-700">
              <li className="flex items-start">
                <span className="text-purple-500 mr-3">•</span>
                <span>For voice messages, speak clearly and slowly</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-3">•</span>
                <span>Text messages are great for quick updates</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3">•</span>
                <span>Your family loves hearing from you!</span>
              </li>
            </ul>
          </motion.div>
        )}
      </main>
    </div>
  );
}