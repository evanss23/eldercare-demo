import React from 'react';
import { motion } from 'framer-motion';
import { FaStop } from 'react-icons/fa';
import { RippleButton } from '@/components/MicroInteractions';

interface VoiceRecordingSectionProps {
  transcript: string;
  interimTranscript: string;
  onStop: () => void;
}

export const VoiceRecordingSection = React.memo<VoiceRecordingSectionProps>(({
  transcript,
  interimTranscript,
  onStop
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="text-center"
    >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-48 h-48 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-8"
      >
        <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-purple-600"
          >
            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          </motion.div>
        </div>
      </motion.div>

      <h3 className="text-3xl font-bold text-gray-800 mb-4">I'm Listening...</h3>

      {(transcript || interimTranscript) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 mb-6 shadow-lg max-w-2xl mx-auto"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-2">What I heard:</h3>
          <p className="text-xl text-gray-800">
            {transcript}
            {interimTranscript && (
              <span className="text-gray-500 italic"> {interimTranscript}</span>
            )}
          </p>
        </motion.div>
      )}

      <RippleButton
        onClick={onStop}
        variant="primary"
        size="lg"
        className="bg-red-600 hover:bg-red-700 px-12 py-6 text-2xl"
      >
        <span className="flex items-center space-x-4">
          <FaStop size={28} />
          <span>Stop Listening</span>
        </span>
      </RippleButton>

      <p className="text-gray-500 mt-4 text-lg">
        I'll send your message automatically when you pause
      </p>
    </motion.div>
  );
});

VoiceRecordingSection.displayName = 'VoiceRecordingSection';