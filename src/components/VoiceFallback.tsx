// components/VoiceFallback.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaMicrophone, 
  FaMicrophoneSlash, 
  FaKeyboard,
  FaChrome,
  FaFirefoxBrowser,
  FaEdge,
  FaSafari,
  FaQuestionCircle
} from 'react-icons/fa';

interface VoiceFallbackProps {
  onTextInput?: (text: string) => void;
  message?: string;
}

export const VoiceFallback: React.FC<VoiceFallbackProps> = ({ 
  onTextInput,
  message = "Voice input is not available" 
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [showTextArea, setShowTextArea] = useState(false);

  const handleSubmit = () => {
    if (textInput.trim() && onTextInput) {
      onTextInput(textInput);
      setTextInput('');
      setShowTextArea(false);
    }
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
      {/* Main Alert */}
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <FaMicrophoneSlash className="text-yellow-600" size={24} />
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            {message}
          </h3>
          
          <p className="text-yellow-700 mb-4">
            Your browser doesn't support voice input, but you can still use text input instead.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowTextArea(!showTextArea)}
              className="bg-white hover:bg-yellow-50 text-yellow-700 px-4 py-2 
                       rounded-lg font-medium border border-yellow-300 
                       flex items-center space-x-2"
            >
              <FaKeyboard size={16} />
              <span>Use Text Input</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowDetails(!showDetails)}
              className="text-yellow-700 hover:text-yellow-800 px-4 py-2 
                       rounded-lg font-medium flex items-center space-x-2"
            >
              <FaQuestionCircle size={16} />
              <span>{showDetails ? 'Hide' : 'Show'} Details</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Text Input Area */}
      <AnimatePresence>
        {showTextArea && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-yellow-200"
          >
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type your message here..."
              className="w-full px-4 py-3 border border-yellow-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-yellow-400
                       focus:border-transparent resize-none"
              rows={3}
              autoFocus
            />
            <div className="flex justify-end mt-3 space-x-3">
              <button
                onClick={() => {
                  setTextInput('');
                  setShowTextArea(false);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={!textInput.trim()}
                className={`px-6 py-2 rounded-lg font-medium ${
                  textInput.trim()
                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Send
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Browser Support Details */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-yellow-200"
          >
            <h4 className="font-medium text-yellow-800 mb-3">
              Voice input is supported in:
            </h4>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <BrowserItem icon={FaChrome} name="Chrome" supported={true} />
              <BrowserItem icon={FaEdge} name="Edge" supported={true} />
              <BrowserItem icon={FaSafari} name="Safari" supported={true} version="14.1+" />
              <BrowserItem icon={FaFirefoxBrowser} name="Firefox" supported={false} />
            </div>

            <div className="bg-white rounded-lg p-4">
              <h5 className="font-medium text-gray-700 mb-2">To enable voice input:</h5>
              <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                <li>Use a supported browser (Chrome recommended)</li>
                <li>Allow microphone permissions when prompted</li>
                <li>Ensure your microphone is connected and working</li>
                <li>Check your browser settings for microphone access</li>
              </ol>
            </div>

            <div className="mt-4 text-center">
              <a
                href="https://www.google.com/chrome/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 
                         font-medium text-sm"
              >
                <FaChrome size={16} />
                <span>Download Chrome for best experience</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Browser support item
const BrowserItem: React.FC<{
  icon: React.ElementType;
  name: string;
  supported: boolean;
  version?: string;
}> = ({ icon: Icon, name, supported, version }) => (
  <div className={`flex items-center space-x-2 p-2 rounded-lg ${
    supported ? 'bg-green-50' : 'bg-red-50'
  }`}>
    <Icon className={supported ? 'text-green-600' : 'text-red-600'} size={20} />
    <div className="text-sm">
      <span className={`font-medium ${supported ? 'text-green-700' : 'text-red-700'}`}>
        {name}
      </span>
      {version && (
        <span className="text-gray-500 text-xs ml-1">({version})</span>
      )}
    </div>
  </div>
);

// Microphone permission helper
export const MicrophonePermissionHelper: React.FC = () => {
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt');

  React.useEffect(() => {
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'microphone' as PermissionName })
        .then(result => {
          setPermissionStatus(result.state as 'prompt' | 'granted' | 'denied');
          result.addEventListener('change', () => {
            setPermissionStatus(result.state as 'prompt' | 'granted' | 'denied');
          });
        })
        .catch(() => {
          // Permissions API not supported
        });
    }
  }, []);

  if (permissionStatus === 'granted') return null;

  return (
    <div className={`rounded-lg p-4 mb-4 ${
      permissionStatus === 'denied' 
        ? 'bg-red-50 border border-red-200' 
        : 'bg-blue-50 border border-blue-200'
    }`}>
      <div className="flex items-start space-x-3">
        <FaMicrophone 
          className={permissionStatus === 'denied' ? 'text-red-600' : 'text-blue-600'} 
          size={20} 
        />
        <div className="flex-1">
          <h4 className={`font-medium mb-1 ${
            permissionStatus === 'denied' ? 'text-red-800' : 'text-blue-800'
          }`}>
            {permissionStatus === 'denied' 
              ? 'Microphone Access Blocked' 
              : 'Microphone Permission Required'}
          </h4>
          <p className={`text-sm ${
            permissionStatus === 'denied' ? 'text-red-700' : 'text-blue-700'
          }`}>
            {permissionStatus === 'denied'
              ? 'Please enable microphone access in your browser settings to use voice input.'
              : 'Click the microphone button and allow access when prompted.'}
          </p>
        </div>
      </div>
    </div>
  );
};