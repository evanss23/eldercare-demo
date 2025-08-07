// hooks/useSpeechRecognition.ts
import { useState, useEffect, useCallback, useRef } from 'react';

// TypeScript declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

// Browser compatibility interface
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export interface UseSpeechRecognitionProps {
  continuous?: boolean;
  interimResults?: boolean;
  language?: string;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  autoSendAfterPause?: boolean;
  pauseDuration?: number; // milliseconds
}

export interface UseSpeechRecognitionReturn {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  interimTranscript: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  error: string | null;
}

export const useSpeechRecognition = ({
  continuous = true,
  interimResults = true,
  language = 'en-US',
  onResult,
  onError,
  autoSendAfterPause = true,
  pauseDuration = 2000, // 2 seconds
}: UseSpeechRecognitionProps = {}): UseSpeechRecognitionReturn => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTranscriptRef = useRef('');

  // Check browser support
  const isSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  // Initialize speech recognition
  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognition = (window as IWindow).SpeechRecognition || 
                             (window as IWindow).webkitSpeechRecognition;
    
    const recognition = new SpeechRecognition();
    
    // Configure recognition
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.language = language;
    recognition.maxAlternatives = 1;

    // Handle results
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      // Process all results
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript + ' ';
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      // Update transcripts
      if (finalTranscript) {
        setTranscript(prev => prev + finalTranscript);
        setInterimTranscript('');
        
        // Trigger callback
        if (onResult) {
          onResult(finalTranscript.trim(), true);
        }

        // Handle auto-send after pause
        if (autoSendAfterPause) {
          // Clear existing timer
          if (pauseTimerRef.current) {
            clearTimeout(pauseTimerRef.current);
          }

          // Set new timer
          pauseTimerRef.current = setTimeout(() => {
            const fullTranscript = transcript + finalTranscript;
            if (fullTranscript.trim() && fullTranscript !== lastTranscriptRef.current) {
              lastTranscriptRef.current = fullTranscript;
              if (onResult) {
                onResult(fullTranscript.trim(), true);
              }
              // Reset transcript after sending
              setTranscript('');
            }
          }, pauseDuration);
        }
      } else {
        setInterimTranscript(interimTranscript);
        if (onResult) {
          onResult(interimTranscript, false);
        }
      }
    };

    // Handle errors
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      const errorMessage = event.error || 'Unknown error occurred';
      setError(errorMessage);
      setIsListening(false);
      
      if (onError) {
        onError(errorMessage);
      }

      // Common error handling
      switch (event.error) {
        case 'no-speech':
          console.log('No speech detected. Please try again.');
          break;
        case 'audio-capture':
          console.error('No microphone found or microphone access denied.');
          break;
        case 'not-allowed':
          console.error('Microphone permission denied.');
          break;
        default:
          console.error('Speech recognition error:', event.error);
      }
    };

    // Handle end
    recognition.onend = () => {
      setIsListening(false);
      
      // Clear pause timer
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
      }
    };

    // Handle start
    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognitionRef.current = recognition;

    // Cleanup
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
      }
    };
  }, [isSupported, continuous, interimResults, language, onResult, onError, autoSendAfterPause, pauseDuration, transcript]);

  // Start listening
  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Speech recognition is not supported in this browser');
      return;
    }

    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setError(null);
      } catch (err) {
        // Handle error if already started
        console.error('Error starting speech recognition:', err);
        setError('Failed to start speech recognition');
      }
    }
  }, [isSupported, isListening]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      
      // Clear pause timer
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
      }
    }
  }, [isListening]);

  // Reset transcript
  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    lastTranscriptRef.current = '';
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    error,
  };
};