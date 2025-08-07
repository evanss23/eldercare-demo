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

// Component imports
import { ChatHeader } from "./chat/ChatHeader";
import { VoiceRecordingSection } from "./chat/VoiceRecordingSection";
import { TextInputSection } from "./chat/TextInputSection";
import { SuccessMessage } from "./chat/SuccessMessage";

// Lazy load heavy components
const VoiceControls = lazy(() => import("@/components/VoiceControls").then(module => ({ default: module.VoiceControls })));

function ElderChatScreenContent() {
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
          {!showTextInput && !isListening && !showSuccess && (
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
                      onClick={handleStartRecording}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-12 py-8 text-2xl font-semibold shadow-lg transition-all inline-flex items-center space-x-4"
                    >
                      <FaMicrophone size={32} />
                      <span>Voice Message</span>
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

          {/* Voice Recording Screen */}
          {isListening && (
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