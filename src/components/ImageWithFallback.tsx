// components/ImageWithFallback.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaImage, FaRedo } from 'react-icons/fa';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  onError?: () => void;
  showRetry?: boolean;
  aspectRatio?: '1:1' | '4:3' | '16:9' | 'auto';
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackSrc = '/images/placeholder.jpg',
  className = '',
  onError,
  showRetry = true,
  aspectRatio = 'auto'
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    setImageSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    
    if (imageSrc === src && fallbackSrc && imageSrc !== fallbackSrc) {
      // Try fallback image
      setImageSrc(fallbackSrc);
    } else {
      // Fallback also failed or no fallback provided
      setHasError(true);
      if (onError) {
        onError();
      }
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setImageSrc(src);
    setIsLoading(true);
    setHasError(false);
  };

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case '1:1': return 'aspect-square';
      case '4:3': return 'aspect-4/3';
      case '16:9': return 'aspect-video';
      default: return '';
    }
  };

  return (
    <div className={`relative overflow-hidden ${getAspectRatioClass()} ${className}`}>
      <AnimatePresence mode="wait">
        {/* Loading State */}
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-100 flex items-center justify-center"
          >
            <div className="space-y-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-12 h-12 border-3 border-gray-300 border-t-purple-600 rounded-full mx-auto"
              />
              <p className="text-sm text-gray-500">Loading image...</p>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {hasError && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 bg-gray-100 flex items-center justify-center"
          >
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaImage className="text-gray-400" size={32} />
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {retryCount > 2 ? 'Image unavailable' : 'Failed to load image'}
              </p>
              {showRetry && retryCount <= 2 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRetry}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium
                           flex items-center space-x-1 mx-auto"
                >
                  <FaRedo size={12} />
                  <span>Try again</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

        {/* Image */}
        {!hasError && (
          <motion.img
            key={imageSrc}
            src={imageSrc}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            className={`w-full h-full object-cover ${isLoading ? 'invisible' : 'visible'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoading ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Memory-specific image component
export const MemoryImage: React.FC<{
  memory: { url: string; caption: string };
  className?: string;
}> = ({ memory, className }) => {
  const [showCaption, setShowCaption] = useState(false);

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setShowCaption(true)}
      onMouseLeave={() => setShowCaption(false)}
    >
      <ImageWithFallback
        src={memory.url}
        alt={memory.caption}
        fallbackSrc="/images/memory-placeholder.jpg"
        className={className}
        aspectRatio="4:3"
      />
      
      {/* Caption Overlay */}
      <AnimatePresence>
        {showCaption && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4"
          >
            <p className="text-white text-sm">{memory.caption}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};