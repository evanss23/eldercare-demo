// components/VoiceInputButton.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceInputButtonProps {
  isListening: boolean;
  isSupported: boolean;
  onStart: () => void;
  onStop: () => void;
  error?: string | null;
  transcript?: string;
  interimTranscript?: string;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  isListening,
  isSupported,
  onStart,
  onStop,
  error,
  transcript,
  interimTranscript,
}) => {
  if (!isSupported) {
    return (
      <div className="text-gray-500 text-sm p-2">
        <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
        Voice input not supported in this browser
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Microphone Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={isListening ? onStop : onStart}
        className={`
          relative p-4 rounded-full transition-all duration-300 
          ${isListening 
            ? 'bg-red-500 hover:bg-red-600 shadow-lg' 
            : 'bg-blue-500 hover:bg-blue-600'
          }
          ${error ? 'bg-gray-400' : ''}
          text-white focus:outline-none focus:ring-4 
          ${isListening ? 'focus:ring-red-300' : 'focus:ring-blue-300'}
        `}
        disabled={!!error}
        aria-label={isListening ? 'Stop recording' : 'Start recording'}
      >
        {/* Microphone Icon */}
        <svg 
          className={`w-6 h-6 ${isListening ? 'animate-pulse' : ''}`} 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" 
                d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" 
                clipRule="evenodd" />
        </svg>

        {/* Listening Animation */}
        <AnimatePresence>
          {isListening && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full bg-red-400"
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 rounded-full bg-red-400"
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 1.3, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              />
            </>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Status Text */}
      <div className="mt-2 text-center">
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-500 font-medium"
          >
            Listening...
          </motion.div>
        )}
        
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-600 text-sm mt-1"
          >
            {error}
          </motion.div>
        )}
      </div>

      {/* Transcript Display */}
      <AnimatePresence>
        {(transcript || interimTranscript) && isListening && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2 
                       bg-white rounded-lg shadow-lg p-3 max-w-xs w-64 
                       border border-gray-200"
          >
            <div className="text-sm text-gray-700">
              {transcript && <span className="font-medium">{transcript}</span>}
              {interimTranscript && (
                <span className="text-gray-500 italic"> {interimTranscript}</span>
              )}
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
              <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 
                            border-l-transparent border-r-transparent border-t-white"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};