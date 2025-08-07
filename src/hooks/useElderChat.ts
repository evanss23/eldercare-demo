import { useState, useEffect, useCallback } from 'react';
import { useElderCareAPI } from '@/lib/api';
import { useSpeechRecognition } from '@/../../hooks/useSpeechRecognition';
import { useSpeechSynthesis, findElderlyFriendlyVoice } from '@/../../hooks/useSpeechSynthesis';
import { useAPIError } from '@/components/APIErrorHandler';

export const useElderChat = () => {
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
    rate: 0.9,
    volume: 1.0,
    pitch: 1.0,
    onError: (error) => {
      console.error('TTS Error:', error);
    }
  });

  // Set elderly-friendly voice on load
  useEffect(() => {
    if (voices.length > 0 && !selectedVoice) {
      const friendlyVoice = findElderlyFriendlyVoice(voices);
      if (friendlyVoice) {
        setVoice(friendlyVoice);
      }
    }
  }, [voices, selectedVoice, setVoice]);

  // Speak API response
  useEffect(() => {
    if (apiResponse && voiceEnabled && ttsSupported) {
      speak(apiResponse);
    }
    return () => {
      cancel();
    };
  }, [apiResponse, voiceEnabled, ttsSupported, speak, cancel]);

  const handleSendText = useCallback(async () => {
    if (!message.trim()) return;

    try {
      const response = await sendMessage(message);
      setApiResponse(response.ai_response);
      setMessage("");
      setShowTextInput(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setApiResponse("");
      }, 5000);
    } catch (err) {
      handleAPIError(err);
    }
  }, [message, sendMessage, handleAPIError]);

  const handleStartRecording = useCallback(() => {
    setShowTextInput(false);
    resetTranscript();
    startListening();
  }, [resetTranscript, startListening]);

  const handleStopRecording = useCallback(() => {
    stopListening();
    if (transcript) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setApiResponse("");
      }, 5000);
    }
  }, [stopListening, transcript]);

  const resetToInitialState = useCallback(() => {
    setShowTextInput(false);
    setShowSuccess(false);
    setMessage("");
    resetTranscript();
  }, [resetTranscript]);

  return {
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
    pause: pause,
    resume,
    setVoice,
    setPitch,
    setRate,
    setVolume,
  };
};