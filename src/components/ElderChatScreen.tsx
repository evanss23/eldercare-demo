"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMicrophone, FaKeyboard, FaArrowLeft, FaStop, FaSpinner, FaVolumeUp, FaCog } from "react-icons/fa";
import Link from "next/link";
import { useElderCareAPI } from "@/lib/api";
import { useSpeechRecognition } from "@/../../hooks/useSpeechRecognition";
import { useSpeechSynthesis, findElderlyFriendlyVoice } from "@/../../hooks/useSpeechSynthesis";
import { VoiceInputButton } from "@/components/VoiceInputButton";
import { VoiceControls } from "@/components/VoiceControls";
import { VoiceFallback, MicrophonePermissionHelper } from "@/components/VoiceFallback";
import { APIErrorHandler, useAPIError } from "@/components/APIErrorHandler";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { TextShimmer } from "@/components/Shimmer";
import { RippleButton, TapScale, Float, SmoothReveal } from "@/components/MicroInteractions";

function ElderChatScreenContent() {
  const [showTextInput, setShowTextInput] = useState(false);
  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [apiResponse, setApiResponse] = useState<string>("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  const { loading, error, sendMessage, clearError } = useElderCareAPI();
  const { error: apiError, handleError: handleAPIError, clearError: clearAPIError } = useAPIError();
  
  // Speech recognition hook
  const {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    error: speechError
  } = useSpeechRecognition({
    continuous: true,
    interimResults: true,
    language: 'en-US',
    autoSendAfterPause: true,
    pauseDuration: 2000,
    onResult: async (finalTranscript, isFinal) => {
      // Auto-send after pause detection
      if (isFinal && finalTranscript.trim()) {
        try {
          const response = await sendMessage(finalTranscript);
          setApiResponse(response.ai_response);
          setShowSuccess(true);
          resetTranscript();
          stopListening();
          setTimeout(() => {
            setShowSuccess(false);
            setApiResponse("");
          }, 5000);
        } catch (err) {
          setErrorMessage("Unable to process voice message. Please try again.");
          setShowError(true);
          setTimeout(() => setShowError(false), 3000);
        }
      }
    },
    onError: (error) => {
      setErrorMessage(`Voice recognition error: ${error}`);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  });

  // Speech synthesis hook
  const {
    speak,
    cancel,
    pause,
    resume,
    speaking,
    paused,
    supported: ttsSupported,
    voices,
    selectedVoice,
    setVoice,
    setPitch,
    setRate,
    setVolume,
    pitch,
    rate,
    volume,
    error: ttsError
  } = useSpeechSynthesis({
    rate: 0.9, // Slightly slower for elderly
    volume: 1.0,
    pitch: 1.0,
    onError: (error) => {
      console.error('TTS Error:', error);
    }
  });

  // Set elderly-friendly voice on load
  useEffect(() => {
    if (voices.length > 0 && !selectedVoice) {
      const elderlyVoice = findElderlyFriendlyVoice(voices);
      if (elderlyVoice) {
        setVoice(elderlyVoice.voiceURI);
      }
    }
  }, [voices, selectedVoice, setVoice]);

  // Auto-speak AI responses
  useEffect(() => {
    if (apiResponse && voiceEnabled && ttsSupported) {
      speak(apiResponse);
    }
  }, [apiResponse, voiceEnabled, ttsSupported, speak]);

  const handleStartRecording = () => {
    clearError();
    resetTranscript();
    startListening();
  };

  const handleStopRecording = () => {
    stopListening();
  };

  const handleSendText = async () => {
    if (message.trim()) {
      const userMessage = message;
      setMessage("");
      setShowTextInput(false);
      
      try {
        const response = await sendMessage(userMessage);
        setApiResponse(response.ai_response);
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setApiResponse("");
        }, 5000);
      } catch (err) {
        setErrorMessage("Unable to send message. Please try again.");
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 relative">
      {/* Header */}
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
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
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
                  onClick={() => setShowVoiceSettings(!showVoiceSettings)}
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* API Error Handler */}
        {apiError && (
          <div className="mb-6">
            <APIErrorHandler
              error={apiError}
              onRetry={() => {
                clearAPIError();
                // Retry last action
              }}
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
                onPause={pause}
                onResume={resume}
                onStop={cancel}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!showTextInput && !isListening && !showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">
                  Chat with Vera
                </h2>
                <p className="text-xl text-gray-600">How would you like to communicate?</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Voice Call Button */}
                {isSupported ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStartRecording}
                    className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl p-12 shadow-xl hover:shadow-2xl transition-all"
                  >
                    <div className="flex flex-col items-center space-y-6">
                      <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                        <FaMicrophone className="text-white" size={60} />
                      </div>
                      <div className="text-white">
                        <h3 className="text-3xl font-bold mb-2">Voice Call</h3>
                        <p className="text-lg opacity-90">Talk to Vera directly</p>
                      </div>
                    </div>
                  </motion.button>
                ) : (
                  <div className="bg-gray-100 rounded-3xl p-8 shadow-inner">
                    <VoiceFallback
                      onTextInput={(text) => {
                        setMessage(text);
                        setShowTextInput(true);
                      }}
                      message="Voice calls not available"
                    />
                  </div>
                )}

                {/* Text Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowTextInput(true)}
                  className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl p-12 shadow-xl hover:shadow-2xl transition-all"
                >
                  <div className="flex flex-col items-center space-y-6">
                    <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                      <FaKeyboard className="text-white" size={60} />
                    </div>
                    <div className="text-white">
                      <h3 className="text-3xl font-bold mb-2">Message</h3>
                      <p className="text-lg opacity-90">Send voice memo or text</p>
                    </div>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Recording Screen */}
          {isListening && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <div className="mb-12">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Listening...</h2>
                <p className="text-xl text-gray-600">Speak your message clearly</p>
              </div>

              {/* Voice Input Button with visual feedback */}
              <div className="flex justify-center mb-8">
                <VoiceInputButton
                  isListening={isListening}
                  isSupported={isSupported}
                  onStart={handleStartRecording}
                  onStop={handleStopRecording}
                  error={speechError}
                  transcript={transcript}
                  interimTranscript={interimTranscript}
                />
              </div>

              {/* Live Transcript Display */}
              {(transcript || interimTranscript) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-lg p-6 max-w-2xl mx-auto mb-8"
                >
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">What I heard:</h3>
                  <p className="text-xl text-gray-800">
                    {transcript}
                    {interimTranscript && (
                      <span className="text-gray-500 italic"> {interimTranscript}</span>
                    )}
                  </p>
                </motion.div>
              )}

              <RippleButton
                onClick={handleStopRecording}
                variant="primary"
                size="lg"
                className="bg-red-600 hover:bg-red-700 px-12 py-6 text-2xl"
              >
                <span className="flex items-center space-x-4">
                  <FaStop size={28} />
                  <span>Stop Listening</span>
                </span>
              </RippleButton>

              <p className="text-gray-500 mt-4 text-lg">
                I'll send your message automatically when you pause
              </p>
            </motion.div>
          )}

          {/* Message Input Screen */}
          {showTextInput && (
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

              <div className="bg-white rounded-2xl shadow-xl p-8">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-6 py-4 text-2xl border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-transparent"
                  rows={6}
                  placeholder="Type your message here..."
                  autoFocus
                />

                <div className="flex items-center justify-between mt-6">
                  <div className="flex space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowTextInput(false)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl px-6 py-3 text-lg font-semibold transition-colors"
                    >
                      Cancel
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSendText}
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
                  {isSupported ? (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleStartRecording}
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
              </div>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  💡 Tap the microphone button to send a voice memo instead
                </p>
              </div>
            </motion.div>
          )}

          {/* Success Message */}
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="w-48 h-48 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-green-600"
                >
                  <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              </motion.div>
              <h3 className="text-4xl font-bold text-gray-800 mb-4">Message Sent!</h3>
              <p className="text-xl text-gray-600 mb-4">Your family will receive it soon</p>
              {apiResponse && (
                <div className="mt-6 bg-blue-50 rounded-xl p-6 max-w-2xl mx-auto">
                  <div className="flex items-start justify-between">
                    <p className="text-lg text-gray-700 flex-1">
                      <span className="font-semibold">Vera says:</span> {apiResponse}
                    </p>
                    {speaking && voiceEnabled && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="ml-4 flex items-center space-x-2"
                      >
                        <FaVolumeUp className="text-blue-500" size={20} />
                        <span className="text-sm text-blue-600">Speaking...</span>
                      </motion.div>
                    )}
                  </div>
                  {voiceEnabled && ttsSupported && (
                    <div className="mt-4 flex items-center justify-center space-x-3">
                      {speaking && !paused && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={pause}
                          className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 
                                     rounded-lg font-medium transition-colors"
                        >
                          Pause
                        </motion.button>
                      )}
                      {speaking && paused && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={resume}
                          className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 
                                     rounded-lg font-medium transition-colors"
                        >
                          Resume
                        </motion.button>
                      )}
                      {speaking && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={cancel}
                          className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 
                                     rounded-lg font-medium transition-colors"
                        >
                          Stop
                        </motion.button>
                      )}
                      {!speaking && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => speak(apiResponse)}
                          className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 
                                     rounded-lg font-medium transition-colors"
                        >
                          Replay
                        </motion.button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* Error Message */}
          {showError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-4 right-4 bg-red-500 text-white rounded-xl p-6 shadow-lg max-w-sm"
            >
              <p className="text-lg font-semibold">{errorMessage}</p>
            </motion.div>
          )}

          {/* Loading Overlay */}
          {loading && (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <FaSpinner className="animate-spin text-blue-500 mx-auto mb-4" size={48} />
                <p className="text-xl text-gray-700">Sending your message...</p>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Quick Tips */}
        {!showTextInput && !isListening && !showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Tips</h3>
            <ul className="space-y-3 text-lg text-gray-700">
              <li className="flex items-start">
                <span className="text-purple-500 mr-3">•</span>
                <span>For voice messages, speak clearly and slowly</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-3">•</span>
                <span>Text messages are great for quick updates</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3">•</span>
                <span>Your family loves hearing from you!</span>
              </li>
            </ul>
            
            {/* Accessibility Info */}
            {(!isSupported || !ttsSupported) && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <span className="font-semibold">Note:</span> Some voice features may not be available in your browser. 
                  Text input will always work!
                </p>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}

// Export with ErrorBoundary wrapper
export default function ElderChatScreen() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('ElderChatScreen Error:', error, errorInfo);
        // Send to error tracking service in production
      }}
    >
      <ElderChatScreenContent />
    </ErrorBoundary>
  );
}