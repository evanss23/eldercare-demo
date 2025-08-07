// components/VoiceControls.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaVolumeUp, 
  FaPlay, 
  FaPause, 
  FaStop,
  FaTachometerAlt,
  FaSlidersH
} from 'react-icons/fa';

interface VoiceControlsProps {
  voices: Array<{ name: string; lang: string; voiceURI: string }>;
  selectedVoice: { name: string; lang: string; voiceURI: string } | null;
  onVoiceChange: (voiceId: string) => void;
  pitch: number;
  onPitchChange: (pitch: number) => void;
  rate: number;
  onRateChange: (rate: number) => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  speaking: boolean;
  paused: boolean;
  onSpeak?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onStop?: () => void;
  compact?: boolean;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  voices,
  selectedVoice,
  onVoiceChange,
  pitch,
  onPitchChange,
  rate,
  onRateChange,
  volume,
  onVolumeChange,
  speaking,
  paused,
  onSpeak,
  onPause,
  onResume,
  onStop,
  compact = false,
}) => {
  // Group voices by language
  const voicesByLang = voices.reduce((acc, voice) => {
    const lang = voice.lang.split('-')[0];
    if (!acc[lang]) acc[lang] = [];
    acc[lang].push(voice);
    return acc;
  }, {} as Record<string, typeof voices>);

  // Get user-friendly language names
  const getLanguageName = (code: string) => {
    const names: Record<string, string> = {
      en: 'English',
      es: 'Spanish',
      fr: 'French',
      de: 'German',
      it: 'Italian',
      pt: 'Portuguese',
      zh: 'Chinese',
      ja: 'Japanese',
      ko: 'Korean',
    };
    return names[code] || code.toUpperCase();
  };

  if (compact) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <FaVolumeUp className="mr-2 text-blue-500" />
            Voice Settings
          </h3>
          {speaking && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-3 h-3 bg-green-500 rounded-full"
            />
          )}
        </div>

        {/* Quick Controls */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600">Speed</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={rate}
              onChange={(e) => onRateChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-gray-500">{rate.toFixed(1)}x</span>
          </div>
          <div>
            <label className="text-sm text-gray-600">Volume</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-gray-500">{Math.round(volume * 100)}%</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center">
          <FaSlidersH className="mr-3 text-purple-500" />
          Voice Output Settings
        </h3>
        
        {/* Playback Controls */}
        <div className="flex items-center space-x-2">
          {!speaking && onSpeak && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSpeak}
              className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-full"
              title="Test voice"
            >
              <FaPlay size={16} />
            </motion.button>
          )}
          
          {speaking && !paused && onPause && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPause}
              className="p-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full"
              title="Pause"
            >
              <FaPause size={16} />
            </motion.button>
          )}
          
          {speaking && paused && onResume && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onResume}
              className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-full"
              title="Resume"
            >
              <FaPlay size={16} />
            </motion.button>
          )}
          
          {speaking && onStop && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStop}
              className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full"
              title="Stop"
            >
              <FaStop size={16} />
            </motion.button>
          )}
        </div>
      </div>

      {/* Voice Selection */}
      <div className="mb-6">
        <label className="block text-lg font-medium text-gray-700 mb-3">
          Voice Selection
        </label>
        <select
          value={selectedVoice?.voiceURI || ''}
          onChange={(e) => onVoiceChange(e.target.value)}
          className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl 
                     focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="">Select a voice...</option>
          {Object.entries(voicesByLang).map(([lang, langVoices]) => (
            <optgroup key={lang} label={getLanguageName(lang)}>
              {langVoices.map((voice) => (
                <option key={voice.voiceURI} value={voice.voiceURI}>
                  {voice.name} {voice.lang === selectedVoice?.lang && '✓'}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Speed Control */}
      <div className="mb-6">
        <label className="block text-lg font-medium text-gray-700 mb-3">
          <FaTachometerAlt className="inline mr-2 text-blue-500" />
          Speaking Speed
        </label>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">Slow</span>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={(e) => onRateChange(parseFloat(e.target.value))}
            className="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer 
                       accent-blue-500"
          />
          <span className="text-sm text-gray-500">Fast</span>
          <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg font-medium">
            {rate.toFixed(1)}x
          </span>
        </div>
      </div>

      {/* Pitch Control */}
      <div className="mb-6">
        <label className="block text-lg font-medium text-gray-700 mb-3">
          Voice Pitch
        </label>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">Low</span>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={pitch}
            onChange={(e) => onPitchChange(parseFloat(e.target.value))}
            className="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer 
                       accent-purple-500"
          />
          <span className="text-sm text-gray-500">High</span>
          <span className="ml-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-lg font-medium">
            {pitch.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Volume Control */}
      <div className="mb-6">
        <label className="block text-lg font-medium text-gray-700 mb-3">
          <FaVolumeUp className="inline mr-2 text-green-500" />
          Volume
        </label>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">Quiet</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer 
                       accent-green-500"
          />
          <span className="text-sm text-gray-500">Loud</span>
          <span className="ml-2 px-3 py-1 bg-green-100 text-green-700 rounded-lg font-medium">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>

      {/* Presets for Elderly Users */}
      <div className="border-t pt-6">
        <h4 className="text-lg font-medium text-gray-700 mb-3">Quick Presets</h4>
        <div className="grid grid-cols-3 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onRateChange(0.8);
              onPitchChange(1.0);
              onVolumeChange(0.9);
            }}
            className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg 
                       font-medium transition-colors"
          >
            Clear & Slow
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onRateChange(1.0);
              onPitchChange(1.0);
              onVolumeChange(1.0);
            }}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg 
                       font-medium transition-colors"
          >
            Normal
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onRateChange(0.7);
              onPitchChange(1.1);
              onVolumeChange(1.0);
            }}
            className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg 
                       font-medium transition-colors"
          >
            Extra Clear
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};