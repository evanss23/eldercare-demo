// components/VoiceOutputIndicator.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaVolumeUp, FaVolumeMute, FaPause, FaPlay } from 'react-icons/fa';

interface VoiceOutputIndicatorProps {
  isEnabled: boolean;
  isSpeaking: boolean;
  isPaused: boolean;
  onToggle: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onStop?: () => void;
  compact?: boolean;
}

export const VoiceOutputIndicator: React.FC<VoiceOutputIndicatorProps> = ({
  isEnabled,
  isSpeaking,
  isPaused,
  onToggle,
  onPause,
  onResume,
  onStop,
  compact = false,
}) => {
  if (compact) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggle}
        className={`relative p-2 rounded-lg transition-colors ${
          isEnabled 
            ? 'bg-blue-100 text-blue-600' 
            : 'bg-gray-100 text-gray-400'
        }`}
        title={isEnabled ? "Voice output on" : "Voice output off"}
      >
        {isEnabled ? <FaVolumeUp size={16} /> : <FaVolumeMute size={16} />}
        
        {/* Speaking Indicator */}
        <AnimatePresence>
          {isEnabled && isSpeaking && (
            <motion.div
              className="absolute -top-1 -right-1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <motion.div
                className="w-3 h-3 bg-green-500 rounded-full"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    );
  }

  return (
    <div className="flex items-center space-x-2 bg-white rounded-xl shadow-md p-3">
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggle}
        className={`p-3 rounded-lg transition-colors ${
          isEnabled 
            ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
        }`}
        title={isEnabled ? "Disable voice output" : "Enable voice output"}
      >
        {isEnabled ? <FaVolumeUp size={20} /> : <FaVolumeMute size={20} />}
      </motion.button>

      {/* Controls when speaking */}
      <AnimatePresence>
        {isEnabled && isSpeaking && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex items-center space-x-2"
          >
            <div className="w-px h-8 bg-gray-300" />
            
            {!isPaused ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onPause}
                className="p-2 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                title="Pause speaking"
              >
                <FaPause size={16} />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onResume}
                className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200"
                title="Resume speaking"
              >
                <FaPlay size={16} />
              </motion.button>
            )}
            
            {onStop && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onStop}
                className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                title="Stop speaking"
              >
                <div className="w-3 h-3 bg-red-600 rounded-sm" />
              </motion.button>
            )}

            {/* Visual Indicator */}
            <div className="flex items-center space-x-1 ml-2">
              <motion.div
                className="w-1 h-4 bg-blue-500 rounded-full"
                animate={{ scaleY: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              />
              <motion.div
                className="w-1 h-6 bg-blue-500 rounded-full"
                animate={{ scaleY: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }}
              />
              <motion.div
                className="w-1 h-4 bg-blue-500 rounded-full"
                animate={{ scaleY: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Text */}
      {isEnabled && (
        <AnimatePresence mode="wait">
          {isSpeaking ? (
            <motion.span
              key="speaking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-blue-600 font-medium"
            >
              {isPaused ? 'Paused' : 'Speaking...'}
            </motion.span>
          ) : (
            <motion.span
              key="ready"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-gray-500"
            >
              Voice ready
            </motion.span>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};