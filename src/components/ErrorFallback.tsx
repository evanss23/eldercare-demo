// components/ErrorFallback.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaExclamationCircle, 
  FaWifi, 
  FaImage, 
  FaMicrophone,
  FaRedo,
  FaQuestionCircle,
  FaPhoneAlt
} from 'react-icons/fa';

interface ErrorFallbackProps {
  error: 'api' | 'image' | 'voice' | 'network' | 'generic';
  message?: string;
  onRetry?: () => void;
  onReport?: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  message,
  onRetry,
  onReport
}) => {
  const errorConfigs = {
    api: {
      icon: FaWifi,
      title: 'Connection Problem',
      defaultMessage: 'We\'re having trouble connecting to our servers. Please check your internet connection and try again.',
      bgColor: 'from-blue-50 to-cyan-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    image: {
      icon: FaImage,
      title: 'Image Not Available',
      defaultMessage: 'This image couldn\'t be loaded. It might have been moved or deleted.',
      bgColor: 'from-purple-50 to-pink-50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    voice: {
      icon: FaMicrophone,
      title: 'Voice Feature Unavailable',
      defaultMessage: 'Voice features are not supported in your browser. Try using Chrome, Safari, or Edge for the best experience.',
      bgColor: 'from-green-50 to-emerald-50',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    network: {
      icon: FaWifi,
      title: 'No Internet Connection',
      defaultMessage: 'You\'re currently offline. Some features may be limited until you reconnect.',
      bgColor: 'from-yellow-50 to-orange-50',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    },
    generic: {
      icon: FaExclamationCircle,
      title: 'Something Went Wrong',
      defaultMessage: 'We encountered an unexpected error. Please try again or contact support if the problem persists.',
      bgColor: 'from-red-50 to-pink-50',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600'
    }
  };

  const config = errorConfigs[error];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br ${config.bgColor} rounded-xl p-6 shadow-lg`}
    >
      {/* Icon */}
      <div className={`w-16 h-16 ${config.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
        <Icon className={config.iconColor} size={32} />
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-800 text-center mb-3">
        {config.title}
      </h3>

      {/* Message */}
      <p className="text-gray-600 text-center mb-6">
        {message || config.defaultMessage}
      </p>

      {/* Actions */}
      <div className="space-y-3">
        {onRetry && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRetry}
            className="w-full bg-white hover:bg-gray-50 text-gray-800 py-3 rounded-lg
                     font-medium flex items-center justify-center space-x-2 
                     border border-gray-200 shadow-sm"
          >
            <FaRedo size={16} />
            <span>Try Again</span>
          </motion.button>
        )}

        {error === 'voice' && (
          <a
            href="https://www.google.com/chrome/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg
                     font-medium flex items-center justify-center space-x-2 block"
          >
            <span>Download Chrome Browser</span>
          </a>
        )}

        {onReport && (
          <button
            onClick={onReport}
            className="w-full text-gray-600 hover:text-gray-800 py-2 text-sm
                     flex items-center justify-center space-x-1"
          >
            <FaQuestionCircle size={14} />
            <span>Report This Issue</span>
          </button>
        )}
      </div>

      {/* Help Contact */}
      {(error === 'api' || error === 'generic') && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500 mb-2">
            Need help?
          </p>
          <a
            href="tel:1-800-ELDERCARE"
            className="flex items-center justify-center space-x-2 text-green-600 
                     hover:text-green-700 font-medium text-sm"
          >
            <FaPhoneAlt size={14} />
            <span>Call Support</span>
          </a>
        </div>
      )}
    </motion.div>
  );
};

// Specific error components
export const APIErrorFallback: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <ErrorFallback error="api" onRetry={onRetry} />
);

export const ImageErrorFallback: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <ErrorFallback error="image" onRetry={onRetry} />
);

export const VoiceErrorFallback: React.FC<{}> = () => (
  <ErrorFallback error="voice" />
);

export const NetworkErrorFallback: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <ErrorFallback error="network" onRetry={onRetry} />
);