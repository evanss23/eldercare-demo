// hooks/useSpeechSynthesis.ts
import { useState, useEffect, useCallback, useRef } from 'react';

export interface Voice {
  name: string;
  lang: string;
  voiceURI: string;
  localService: boolean;
  default: boolean;
}

export interface UseSpeechSynthesisProps {
  onEnd?: () => void;
  onError?: (error: string) => void;
  onPause?: () => void;
  onResume?: () => void;
  onStart?: () => void;
  pitch?: number;
  rate?: number;
  volume?: number;
  voice?: string; // Voice name or URI
}

export interface UseSpeechSynthesisReturn {
  speak: (text: string) => void;
  cancel: () => void;
  pause: () => void;
  resume: () => void;
  speaking: boolean;
  paused: boolean;
  supported: boolean;
  voices: Voice[];
  selectedVoice: Voice | null;
  setVoice: (voice: string) => void;
  setPitch: (pitch: number) => void;
  setRate: (rate: number) => void;
  setVolume: (volume: number) => void;
  pitch: number;
  rate: number;
  volume: number;
  error: string | null;
}

export const useSpeechSynthesis = ({
  onEnd,
  onError,
  onPause,
  onResume,
  onStart,
  pitch: initialPitch = 1,
  rate: initialRate = 1,
  volume: initialVolume = 1,
  voice: initialVoice,
}: UseSpeechSynthesisProps = {}): UseSpeechSynthesisReturn => {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [pitch, setPitch] = useState(initialPitch);
  const [rate, setRate] = useState(initialRate);
  const [volume, setVolume] = useState(initialVolume);
  const [error, setError] = useState<string | null>(null);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check browser support
  const supported = typeof window !== 'undefined' && 
    'speechSynthesis' in window && 
    'SpeechSynthesisUtterance' in window;

  // Load available voices
  useEffect(() => {
    if (!supported) return;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      const mappedVoices: Voice[] = availableVoices.map(voice => ({
        name: voice.name,
        lang: voice.lang,
        voiceURI: voice.voiceURI,
        localService: voice.localService,
        default: voice.default,
      }));
      
      setVoices(mappedVoices);
      
      // Set initial voice
      if (initialVoice) {
        const foundVoice = mappedVoices.find(
          v => v.name === initialVoice || v.voiceURI === initialVoice
        );
        if (foundVoice) {
          setSelectedVoice(foundVoice);
        }
      } else {
        // Select default voice or first English voice
        const defaultVoice = mappedVoices.find(v => v.default) ||
                           mappedVoices.find(v => v.lang.startsWith('en')) ||
                           mappedVoices[0];
        setSelectedVoice(defaultVoice || null);
      }
    };

    // Load voices immediately
    loadVoices();

    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [supported, initialVoice]);

  // Speak function
  const speak = useCallback((text: string) => {
    if (!supported) {
      setError('Speech synthesis is not supported in this browser');
      if (onError) onError('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set voice
      if (selectedVoice) {
        const systemVoice = window.speechSynthesis.getVoices().find(
          v => v.voiceURI === selectedVoice.voiceURI
        );
        if (systemVoice) {
          utterance.voice = systemVoice;
        }
      }

      // Set speech parameters
      utterance.pitch = pitch;
      utterance.rate = rate;
      utterance.volume = volume;

      // Event handlers
      utterance.onstart = () => {
        setSpeaking(true);
        setPaused(false);
        setError(null);
        if (onStart) onStart();
      };

      utterance.onend = () => {
        setSpeaking(false);
        setPaused(false);
        if (onEnd) onEnd();
      };

      utterance.onerror = (event) => {
        setSpeaking(false);
        setPaused(false);
        const errorMessage = `Speech synthesis error: ${event.error}`;
        setError(errorMessage);
        if (onError) onError(errorMessage);
      };

      utterance.onpause = () => {
        setPaused(true);
        if (onPause) onPause();
      };

      utterance.onresume = () => {
        setPaused(false);
        if (onResume) onResume();
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to speak';
      setError(errorMessage);
      if (onError) onError(errorMessage);
    }
  }, [supported, selectedVoice, pitch, rate, volume, onStart, onEnd, onError, onPause, onResume]);

  // Cancel function
  const cancel = useCallback(() => {
    if (!supported) return;
    
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
    utteranceRef.current = null;
  }, [supported]);

  // Pause function
  const pause = useCallback(() => {
    if (!supported || !speaking || paused) return;
    
    window.speechSynthesis.pause();
  }, [supported, speaking, paused]);

  // Resume function
  const resume = useCallback(() => {
    if (!supported || !speaking || !paused) return;
    
    window.speechSynthesis.resume();
  }, [supported, speaking, paused]);

  // Set voice by name or URI
  const setVoice = useCallback((voiceId: string) => {
    const foundVoice = voices.find(
      v => v.name === voiceId || v.voiceURI === voiceId
    );
    if (foundVoice) {
      setSelectedVoice(foundVoice);
    }
  }, [voices]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (supported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [supported]);

  return {
    speak,
    cancel,
    pause,
    resume,
    speaking,
    paused,
    supported,
    voices,
    selectedVoice,
    setVoice,
    setPitch,
    setRate,
    setVolume,
    pitch,
    rate,
    volume,
    error,
  };
};

// Helper hook for auto-speaking messages
export const useAutoSpeak = (
  text: string,
  enabled: boolean = true,
  options?: UseSpeechSynthesisProps
) => {
  const speechSynthesis = useSpeechSynthesis(options);

  useEffect(() => {
    if (enabled && text && speechSynthesis.supported) {
      speechSynthesis.speak(text);
    }

    return () => {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
    };
  }, [text, enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  return speechSynthesis;
};

// Helper to find best voice for elderly users
export const findElderlyFriendlyVoice = (voices: Voice[], preferredLang: string = 'en') => {
  // Prefer natural-sounding voices
  const naturalVoices = voices.filter(v => 
    v.name.toLowerCase().includes('natural') ||
    v.name.toLowerCase().includes('enhanced') ||
    v.name.toLowerCase().includes('premium')
  );

  // Prefer female voices (often clearer for elderly)
  const femaleVoices = voices.filter(v => 
    v.name.toLowerCase().includes('female') ||
    v.name.toLowerCase().includes('woman') ||
    v.name.toLowerCase().includes('samantha') ||
    v.name.toLowerCase().includes('victoria') ||
    v.name.toLowerCase().includes('karen') ||
    v.name.toLowerCase().includes('susan')
  );

  // Find voices in preferred language
  const langVoices = voices.filter(v => v.lang.startsWith(preferredLang));

  // Priority: Natural + Female + Lang > Natural + Lang > Female + Lang > Lang > Default
  const idealVoice = naturalVoices.find(v => femaleVoices.includes(v) && langVoices.includes(v)) ||
                     naturalVoices.find(v => langVoices.includes(v)) ||
                     femaleVoices.find(v => langVoices.includes(v)) ||
                     langVoices[0] ||
                     voices.find(v => v.default) ||
                     voices[0];

  return idealVoice;
};