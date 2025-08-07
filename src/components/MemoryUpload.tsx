// components/MemoryUpload.tsx
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCloudUploadAlt, 
  FaImage, 
  FaMusic, 
  FaTimes, 
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner
} from 'react-icons/fa';
import { useOptimisticUpdate } from '@/../../hooks/useOptimisticUpdate';
import { useBackgroundSync } from '@/../../hooks/useBackgroundSync';
import { useToast } from '@/../../hooks/useToast';

interface Memory {
  id: string;
  type: 'photo' | 'music';
  url: string;
  title?: string;
  artist?: string;
  caption: string;
  date: string;
  uploadStatus?: 'pending' | 'uploading' | 'completed' | 'error';
  uploadProgress?: number;
}

interface MemoryUploadProps {
  onUpload: (memory: Memory) => void;
  onClose: () => void;
}

export const MemoryUpload: React.FC<MemoryUploadProps> = ({ onUpload, onClose }) => {
  const [memoryType, setMemoryType] = useState<'photo' | 'music'>('photo');
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { success, error } = useToast();
  const { addToQueue, isOnline } = useBackgroundSync({
    onSync: async (task) => {
      // In real app, this would upload to server
      console.log('Syncing memory:', task);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
    },
    onSuccess: (task) => {
      success(`Memory uploaded successfully!`);
    },
    onError: (task, err) => {
      error(`Failed to upload memory: ${err.message}`);
    }
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !caption) return;

    // Create optimistic memory
    const newMemory: Memory = {
      id: `temp-${Date.now()}`,
      type: memoryType,
      url: previewUrl || '',
      caption,
      date: 'Just now',
      uploadStatus: 'uploading',
      uploadProgress: 0
    };

    // Add to UI immediately
    onUpload(newMemory);

    // Simulate upload progress
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 10;
      if (progress <= 90) {
        onUpload({
          ...newMemory,
          uploadProgress: progress
        });
      }
    }, 200);

    try {
      // Add to sync queue for background upload
      if (!isOnline) {
        addToQueue('upload_memory', {
          memory: newMemory,
          file: file.name // In real app, store file data
        });
        
        clearInterval(progressInterval);
        onUpload({
          ...newMemory,
          uploadStatus: 'pending',
          uploadProgress: 0
        });
        
        success('Memory saved! Will upload when online.');
      } else {
        // Simulate API upload
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            if (Math.random() > 0.1) { // 90% success rate
              resolve(true);
            } else {
              reject(new Error('Upload failed'));
            }
          }, 2000);
        });

        clearInterval(progressInterval);
        
        // Update with final status
        onUpload({
          ...newMemory,
          id: `uploaded-${Date.now()}`, // Real ID from server
          uploadStatus: 'completed',
          uploadProgress: 100
        });
        
        success('Memory uploaded successfully!');
      }
      
      // Reset form
      setCaption('');
      setFile(null);
      setPreviewUrl(null);
      onClose();
    } catch (err) {
      clearInterval(progressInterval);
      
      // Mark as error
      onUpload({
        ...newMemory,
        uploadStatus: 'error',
        uploadProgress: 0
      });
      
      error('Failed to upload memory. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Upload Memory</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaTimes className="text-gray-500" size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Memory Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Memory Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setMemoryType('photo')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  memoryType === 'photo'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <FaImage 
                  className={`mx-auto mb-2 ${
                    memoryType === 'photo' ? 'text-purple-600' : 'text-gray-400'
                  }`} 
                  size={24} 
                />
                <span className={`text-sm font-medium ${
                  memoryType === 'photo' ? 'text-purple-700' : 'text-gray-600'
                }`}>
                  Photo
                </span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setMemoryType('music')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  memoryType === 'music'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <FaMusic 
                  className={`mx-auto mb-2 ${
                    memoryType === 'music' ? 'text-purple-600' : 'text-gray-400'
                  }`} 
                  size={24} 
                />
                <span className={`text-sm font-medium ${
                  memoryType === 'music' ? 'text-purple-700' : 'text-gray-600'
                }`}>
                  Music
                </span>
              </motion.button>
            </div>
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select {memoryType === 'photo' ? 'Photo' : 'Audio File'}
            </label>
            
            <input
              ref={fileInputRef}
              type="file"
              accept={memoryType === 'photo' ? 'image/*' : 'audio/*'}
              onChange={handleFileSelect}
              className="hidden"
            />

            {!file ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-8 border-2 border-dashed border-gray-300 rounded-xl
                         hover:border-purple-400 transition-colors"
              >
                <FaCloudUploadAlt className="mx-auto text-gray-400 mb-3" size={48} />
                <p className="text-gray-600">Click to select file</p>
                <p className="text-sm text-gray-400 mt-1">
                  {memoryType === 'photo' ? 'JPG, PNG up to 10MB' : 'MP3, WAV up to 20MB'}
                </p>
              </motion.button>
            ) : (
              <div className="relative">
                {memoryType === 'photo' && previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                )}
                {memoryType === 'music' && (
                  <div className="p-6 bg-purple-50 rounded-xl">
                    <FaMusic className="mx-auto text-purple-600 mb-2" size={32} />
                    <p className="text-center text-gray-700 font-medium">{file.name}</p>
                  </div>
                )}
                <button
                  onClick={() => {
                    setFile(null);
                    setPreviewUrl(null);
                  }}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg
                           hover:bg-gray-100 transition-colors"
                >
                  <FaTimes className="text-gray-600" size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Caption */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Add a message
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a loving message..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl
                       focus:outline-none focus:ring-2 focus:ring-purple-500
                       focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          {/* Connection Status */}
          <div className={`p-3 rounded-lg mb-6 flex items-center space-x-2 ${
            isOnline ? 'bg-green-50' : 'bg-yellow-50'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isOnline ? 'bg-green-500' : 'bg-yellow-500'
            }`} />
            <span className={`text-sm ${
              isOnline ? 'text-green-700' : 'text-yellow-700'
            }`}>
              {isOnline ? 'Online - Upload immediately' : 'Offline - Will sync when connected'}
            </span>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-xl
                       hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUpload}
              disabled={!file || !caption}
              className={`flex-1 px-6 py-3 rounded-xl font-medium transition-colors
                        flex items-center justify-center space-x-2 ${
                file && caption
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <FaCloudUploadAlt size={20} />
              <span>Upload Memory</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};