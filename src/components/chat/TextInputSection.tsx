import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaMicrophone, FaSpinner } from 'react-icons/fa';

interface TextInputSectionProps {
  message: string;
  loading: boolean;
  isVoiceSupported: boolean;
  onMessageChange: (message: string) => void;
  onSendText: () => void;
  onCancel: () => void;
  onStartRecording: () => void;
}

export const TextInputSection = React.memo<TextInputSectionProps>(({
  message,
  loading,
  isVoiceSupported,
  onMessageChange,
  onSendText,
  onCancel,
  onStartRecording
}) => {
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !loading) {
      onSendText();
    }
  }, [message, loading, onSendText]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Send a Message</h2>
        <p className="text-lg text-gray-600">Type or record your message to Vera</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
        <textarea
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          className="w-full px-6 py-4 text-2xl border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-transparent"
          rows={6}
          placeholder="Type your message here..."
          autoFocus
        />

        <div className="flex items-center justify-between mt-6">
          <div className="flex space-x-4">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCancel}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl px-6 py-3 text-lg font-semibold transition-colors"
            >
              Cancel
            </motion.button>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!message.trim() || loading}
              className={`rounded-xl px-8 py-3 text-lg font-semibold transition-colors flex items-center space-x-2 ${
                message.trim() && !loading
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <span>Send Text</span>
              )}
            </motion.button>
          </div>

          {/* Voice Memo Button */}
          {isVoiceSupported ? (
            <motion.button
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStartRecording}
              className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all"
              title="Record voice memo"
            >
              <FaMicrophone size={24} />
            </motion.button>
          ) : (
            <div className="text-gray-400 text-sm">
              <FaMicrophone size={24} className="opacity-50" />
            </div>
          )}
        </div>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          💡 Tap the microphone button to send a voice memo instead
        </p>
      </div>
    </motion.div>
  );
});

TextInputSection.displayName = 'TextInputSection';