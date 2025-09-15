"use client";

import React, { lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMicrophone, FaKeyboard } from "react-icons/fa";
import { useElderChat } from "@/hooks/useElderChat";
import { Float } from "@/components/MicroInteractions";
import { APIErrorHandler } from "@/components/APIErrorHandler";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { VoiceFallback, MicrophonePermissionHelper } from "@/components/VoiceFallback";
import { TextShimmer } from "@/components/Shimmer";
import { VapiIntegration, useVapi } from "@/components/VapiIntegration";

// Component imports
import { ChatHeader } from "./chat/ChatHeader";
import { VoiceRecordingSection } from "./chat/VoiceRecordingSection";
import { TextInputSection } from "./chat/TextInputSection";
import { SuccessMessage } from "./chat/SuccessMessage";

// Lazy load heavy components
const VoiceControls = lazy(() => import("@/components/VoiceControls").then(module => ({ default: module.VoiceControls })));

function ElderChatScreenContent() {
  const [vapiTranscript, setVapiTranscript] = React.useState<Array<{role: string, text: string, id: string}>>([]);
  const [vapiCallActive, setVapiCallActive] = React.useState(false);
  const { isReady: vapiReady, startCall: startVapiCall, stopCall: stopVapiCall } = useVapi();

  // Add keyboard shortcut for ending call
  const {
    // State
    showTextInput,
    message,
    showSuccess,
    apiResponse,
    showError,
    errorMessage,
    showVoiceSettings,
    voiceEnabled,
    loading,
    apiError,

    // Speech recognition
    isListening,
    isSupported,
    transcript,
    interimTranscript,

    // Speech synthesis
    speaking,
    paused,
    ttsSupported,
    voices,
    selectedVoice,
    pitch,
    rate,
    volume,

    // Actions
    setShowTextInput,
    setMessage,
    setShowVoiceSettings,
    setVoiceEnabled,
    handleSendText,
    handleStartRecording,
    handleStopRecording,
    resetToInitialState,
    clearAPIError,

    // Speech synthesis actions
    speak,
    cancel,
    pause: pauseSpeech,
    resume,
    setVoice,
    setPitch,
    setRate,
    setVolume,
  } = useElderChat();

  const handleVoiceButtonClick = () => {
    if (vapiReady) {
      console.log("Attempting to start Vapi call...");
      startVapiCall();
      setVapiCallActive(true);
    } else {
      console.log("Vapi not ready, using regular voice recording...");
      handleStartRecording();
    }
  };

  const handleStopVapiCall = React.useCallback(() => {
    console.log("End Call button clicked");

    // Try to stop the actual Vapi call first
    try {
      stopVapiCall();
      console.log("Vapi stop call initiated");

      // Wait a moment for Vapi to process the stop command
      setTimeout(() => {
        console.log("Setting call as inactive after Vapi processing");
        setVapiCallActive(false);
      }, 100);

    } catch (error) {
      console.error("Error stopping Vapi call:", error);
      // If error, immediately set to inactive
      setVapiCallActive(false);
    }

    // Force UI to return to initial state after a longer delay as fallback
    setTimeout(() => {
      console.log("Fallback: Forcing return to initial state");
      setVapiCallActive(false);
    }, 1000);
  }, [stopVapiCall, setVapiCallActive]);

  // Add keyboard shortcut for ending call
  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && vapiCallActive) {
        console.log("Escape key pressed - ending call");
        handleStopVapiCall();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [vapiCallActive, handleStopVapiCall]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 relative">
      <ChatHeader
        voiceEnabled={voiceEnabled}
        onToggleVoice={() => setVoiceEnabled(!voiceEnabled)}
        onToggleSettings={() => setShowVoiceSettings(!showVoiceSettings)}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* API Error Handler */}
        {apiError && (
          <div className="mb-6">
            <APIErrorHandler
              error={apiError}
              onRetry={() => clearAPIError()}
              onDismiss={clearAPIError}
            />
          </div>
        )}

        {/* Voice Permission Helper */}
        {!isSupported && (
          <div className="mb-6">
            <MicrophonePermissionHelper />
          </div>
        )}

        {/* Voice Settings Panel */}
        <AnimatePresence>
          {showVoiceSettings && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <Suspense fallback={<TextShimmer lines={3} />}>
                <VoiceControls
                  voices={voices}
                  selectedVoice={selectedVoice}
                  onVoiceChange={setVoice}
                  pitch={pitch}
                  onPitchChange={setPitch}
                  rate={rate}
                  onRateChange={setRate}
                  volume={volume}
                  onVolumeChange={setVolume}
                  speaking={speaking}
                  paused={paused}
                  onSpeak={() => speak("Hello! I'm Vera, your caring companion. How can I help you today?")}
                  onPause={pauseSpeech}
                  onResume={resume}
                  onStop={cancel}
                />
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <AnimatePresence mode="wait">
          {/* Initial Options */}
          {!showTextInput && !isListening && !showSuccess && !vapiCallActive && (
            <motion.div
              key="options"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-8">
                How would you like to talk to me?
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8">
                {isSupported ? (
                  <Float>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleVoiceButtonClick}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-12 py-8 text-2xl font-semibold shadow-lg transition-all inline-flex items-center space-x-4"
                    >
                      <FaMicrophone size={32} />
                      <span>{vapiReady ? "Voice Chat" : "Voice Message"}</span>
                    </motion.button>
                  </Float>
                ) : (
                  <VoiceFallback />
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowTextInput(true)}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-full px-12 py-8 text-2xl font-semibold shadow-lg transition-all inline-flex items-center space-x-4"
                >
                  <FaKeyboard size={32} />
                  <span>Type Message</span>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Vapi Call Active Screen */}
          {vapiCallActive && (
            <motion.div
              key="vapi-call"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-2">
                Talking with Emma
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Your AI Care Companion is listening...
              </p>

              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-32 h-32 bg-purple-500 rounded-full animate-pulse flex items-center justify-center">
                    <FaMicrophone size={48} className="text-white" />
                  </div>
                  <div className="absolute inset-0 bg-purple-400 rounded-full animate-ping" />
                </div>
              </div>

              {/* Transcript Display */}
              <div className="max-w-3xl mx-auto mb-8 bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Conversation Transcript
                </h3>
                <div className="max-h-64 overflow-y-auto space-y-3">
                  {vapiTranscript.length === 0 ? (
                    <p className="text-gray-400 italic">Start speaking to see the conversation...</p>
                  ) : (
                    vapiTranscript.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-2' : ''}`}>
                          <div className={`text-xs font-semibold mb-1 ${
                            msg.role === 'user' ? 'text-right text-purple-600' : 'text-left text-gray-600'
                          }`}>
                            {msg.role === 'user' ? 'You' : 'Emma'}
                          </div>
                          <div className={`inline-block px-4 py-2 rounded-lg ${
                            msg.role === 'user'
                              ? 'bg-purple-500 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#dc2626" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStopVapiCall}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full px-16 py-8 text-2xl font-bold shadow-2xl transition-all duration-200 border-2 border-red-300 focus:outline-none focus:ring-4 focus:ring-red-300"
                style={{ minWidth: '200px' }}
              >
                📞 End Call
              </motion.button>

              {/* Helper text */}
              <p className="text-sm text-gray-500 mt-4">
                Press Escape key or click the button above to end the call
              </p>
            </motion.div>
          )}

          {/* Voice Recording Screen */}
          {isListening && !vapiCallActive && (
            <VoiceRecordingSection
              key="recording"
              transcript={transcript}
              interimTranscript={interimTranscript}
              onStop={handleStopRecording}
            />
          )}

          {/* Text Input Screen */}
          {showTextInput && (
            <TextInputSection
              key="text-input"
              message={message}
              loading={loading}
              isVoiceSupported={isSupported}
              onMessageChange={setMessage}
              onSendText={handleSendText}
              onCancel={() => setShowTextInput(false)}
              onStartRecording={handleStartRecording}
            />
          )}

          {/* Success Message */}
          {showSuccess && (
            <SuccessMessage
              key="success"
              show={showSuccess}
              apiResponse={apiResponse}
              speaking={speaking}
              voiceEnabled={voiceEnabled}
              onReturn={resetToInitialState}
            />
          )}
        </AnimatePresence>

        {/* Error Toast */}
        <AnimatePresence>
          {showError && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg"
            >
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Vapi Integration */}
      <VapiIntegration
        onCallStart={() => {
          console.log("Vapi call started");
          setVapiCallActive(true);
          setVapiTranscript([]);
        }}
        onCallEnd={() => {
          console.log("Vapi call ended");
          setVapiCallActive(false);
        }}
        onTranscript={(role, transcript) => {
          setVapiTranscript(prev => {
            // Create unique ID for this message
            const messageId = `${role}-${transcript}-${Date.now()}`;

            // Check if we already have this exact message
            const existingMessage = prev.find(msg =>
              msg.role === role && msg.text === transcript
            );

            if (existingMessage) {
              return prev; // Don't add duplicate
            }

            // For same role consecutive messages, replace if text is longer (streaming update)
            const lastMessage = prev[prev.length - 1];
            if (lastMessage && lastMessage.role === role &&
                transcript.includes(lastMessage.text) &&
                transcript.length > lastMessage.text.length) {
              // Replace the last message with the longer version
              return [...prev.slice(0, -1), { role, text: transcript, id: messageId }];
            }

            // Add new message
            return [...prev, { role, text: transcript, id: messageId }];
          });
        }}
        onError={(error) => {
          console.error("Vapi error:", error);
          setVapiCallActive(false);
        }}
      />
    </div>
  );
}

export default function ElderChatScreenOptimized() {
  return (
    <ErrorBoundary>
      <ElderChatScreenContent />
    </ErrorBoundary>
  );
}