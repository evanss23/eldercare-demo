// components/LoadingScreen.tsx
import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 
                    flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        {/* Logo */}
        <motion.div
          className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-6"
          animate={{ 
            boxShadow: [
              "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
            ]
          }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 
                         bg-clip-text text-transparent">
            EC
          </span>
        </motion.div>

        {/* Loading dots */}
        <div className="flex items-center justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-purple-600 rounded-full"
              animate={{ 
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                delay: i * 0.2
              }}
            />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-gray-600"
        >
          Loading...
        </motion.p>
      </motion.div>
    </div>
  );
}