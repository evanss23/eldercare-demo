import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaVolumeUp } from 'react-icons/fa';
import { SmoothReveal } from '@/components/MicroInteractions';

interface SuccessMessageProps {
  show: boolean;
  apiResponse: string;
  speaking: boolean;
  voiceEnabled: boolean;
  onReturn: () => void;
}

export const SuccessMessage = React.memo<SuccessMessageProps>(({
  show,
  apiResponse,
  speaking,
  voiceEnabled,
  onReturn
}) => {
  if (!show) return null;

  return (
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
      <p className="text-xl text-gray-600 mb-4">Your family will receive it soon</p>
      
      {apiResponse && (
        <SmoothReveal>
          <div className="mt-6 bg-blue-50 rounded-xl p-6 max-w-2xl mx-auto">
            <div className="flex items-start justify-between">
              <p className="text-lg text-gray-700 flex-1">
                <span className="font-semibold">Vera says:</span> {apiResponse}
              </p>
              {speaking && voiceEnabled && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="ml-4 flex items-center space-x-2"
                >
                  <FaVolumeUp className="text-blue-500" size={20} />
                  <span className="text-sm text-blue-600">Speaking...</span>
                </motion.div>
              )}
            </div>
          </div>
        </SmoothReveal>
      )}
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onReturn}
        className="mt-8 bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-8 py-3 text-lg font-semibold transition-colors"
      >
        Send Another Message
      </motion.button>
    </motion.div>
  );
});

SuccessMessage.displayName = 'SuccessMessage';