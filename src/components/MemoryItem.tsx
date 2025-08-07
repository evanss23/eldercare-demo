// components/MemoryItem.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCheckCircle, 
  FaExclamationCircle, 
  FaCloudUploadAlt,
  FaClock,
  FaRedo
} from 'react-icons/fa';

interface MemoryItemProps {
  memory: {
    id: string;
    type: 'photo' | 'music';
    url: string;
    caption: string;
    date: string;
    uploadStatus?: 'pending' | 'uploading' | 'completed' | 'error';
    uploadProgress?: number;
  };
  onRetry?: () => void;
}

export const MemoryItem: React.FC<MemoryItemProps> = ({ memory, onRetry }) => {
  const getStatusIcon = () => {
    switch (memory.uploadStatus) {
      case 'pending':
        return <FaClock className="text-yellow-500" size={16} />;
      case 'uploading':
        return <FaCloudUploadAlt className="text-blue-500 animate-pulse" size={16} />;
      case 'completed':
        return <FaCheckCircle className="text-green-500" size={16} />;
      case 'error':
        return <FaExclamationCircle className="text-red-500" size={16} />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (memory.uploadStatus) {
      case 'pending':
        return 'Waiting to upload';
      case 'uploading':
        return `Uploading ${memory.uploadProgress || 0}%`;
      case 'completed':
        return 'Uploaded';
      case 'error':
        return 'Upload failed';
      default:
        return '';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative bg-white rounded-xl shadow-md overflow-hidden"
    >
      {/* Image/Content */}
      <div className="relative">
        {memory.type === 'photo' && (
          <img
            src={memory.url}
            alt={memory.caption}
            className={`w-full h-48 object-cover ${
              memory.uploadStatus === 'uploading' || memory.uploadStatus === 'error'
                ? 'opacity-70'
                : ''
            }`}
          />
        )}

        {/* Upload Progress Overlay */}
        {memory.uploadStatus === 'uploading' && memory.uploadProgress !== undefined && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <div className="w-48">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Uploading...</span>
                  <span className="text-sm text-gray-600">{memory.uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${memory.uploadProgress}%` }}
                    className="bg-blue-500 h-2 rounded-full"
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Overlay */}
        {memory.uploadStatus === 'error' && (
          <div className="absolute inset-0 bg-red-500/10 flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRetry}
              className="bg-white text-red-600 px-4 py-2 rounded-lg shadow-lg
                       flex items-center space-x-2 hover:bg-red-50"
            >
              <FaRedo size={16} />
              <span>Retry Upload</span>
            </motion.button>
          </div>
        )}
      </div>

      {/* Caption and Status */}
      <div className="p-4">
        <p className="text-gray-800 mb-2">{memory.caption}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">{memory.date}</span>
          
          {memory.uploadStatus && (
            <div className="flex items-center space-x-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={memory.uploadStatus}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center space-x-1"
                >
                  {getStatusIcon()}
                  <span className={`text-xs font-medium ${
                    memory.uploadStatus === 'completed' ? 'text-green-600' :
                    memory.uploadStatus === 'error' ? 'text-red-600' :
                    memory.uploadStatus === 'uploading' ? 'text-blue-600' :
                    'text-yellow-600'
                  }`}>
                    {getStatusText()}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Offline Indicator */}
      {memory.uploadStatus === 'pending' && (
        <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-700 
                      px-2 py-1 rounded-full text-xs font-medium">
          Offline
        </div>
      )}
    </motion.div>
  );
};