import React from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaVolumeUp, FaCog } from 'react-icons/fa';
import { TapScale } from '@/components/MicroInteractions';

interface ChatHeaderProps {
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  onToggleSettings: () => void;
}

export const ChatHeader = React.memo<ChatHeaderProps>(({
  voiceEnabled,
  onToggleVoice,
  onToggleSettings
}) => {
  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/elder">
              <TapScale>
                <button className="p-3 rounded-xl hover:bg-gray-100">
                  <FaArrowLeft className="text-gray-600" size={24} />
                </button>
              </TapScale>
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Chat with Vera</h1>
          </div>
          
          {/* Voice Controls */}
          <div className="flex items-center space-x-3">
            {/* Voice Toggle */}
            <TapScale>
              <button
                onClick={onToggleVoice}
                className={`p-3 rounded-xl transition-colors ${
                  voiceEnabled 
                    ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
                title={voiceEnabled ? "Voice output enabled" : "Voice output disabled"}
              >
                <FaVolumeUp size={20} />
              </button>
            </TapScale>
            
            {/* Settings Button */}
            <TapScale>
              <button
                onClick={onToggleSettings}
                className="p-3 rounded-xl bg-purple-100 text-purple-600 hover:bg-purple-200"
                title="Voice settings"
              >
                <FaCog size={20} />
              </button>
            </TapScale>
          </div>
        </div>
      </div>
    </header>
  );
});

ChatHeader.displayName = 'ChatHeader';