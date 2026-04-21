'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ReadingProvider, useReading } from '@/context/ReadingContext';
import { useReadingBehavior } from '@/hooks/useReadingBehavior';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useVoiceControl } from '@/hooks/useVoiceControl';
import { useEyeTracking } from '@/hooks/useEyeTracking';
import { usePersonalization } from '@/hooks/usePersonalization';
import { useKeyboardControls } from '@/hooks/useKeyboardControls';
import { useGestureControl } from '@/hooks/useGestureControl';
import Reader from '@/components/Reader';
import Controls from '@/components/Controls';
import AudioControls from '@/components/AudioControls';
import FocusControls from '@/components/FocusControls';
import SuggestionPopup from '@/components/SuggestionPopup';
import StatusBar from '@/components/StatusBar';
import VoiceIndicator from '@/components/VoiceIndicator';
import CalibrationOverlay from '@/components/CalibrationOverlay';
import sampleContent from '@/data/sampleContent';

function AppContent() {
  const { state, dispatch, toggleMode, clearSuggestion, setMode } = useReading();
  const { acceptSuggestion, dismissSuggestion } = useReadingBehavior();
  const { speak, pause, resume, stop, setRate } = useTextToSpeech();
  const { initialize: initEyeTracking, setCalibrated, needsCalibration } = useEyeTracking();
  const [showCalibration, setShowCalibration] = useState(false);
  const suggestionTimerRef = useRef(null);

  // Personalization — auto-saves/restores
  usePersonalization();

  // Get all sentences flat for TTS
  const allSentences = sampleContent.paragraphs.flatMap(p => p.sentences);

  // --- Audio handlers ---
  const handlePlay = useCallback(() => {
    speak(allSentences);
  }, [speak, allSentences]);

  const handlePause = useCallback(() => {
    pause();
  }, [pause]);

  const handleResume = useCallback(() => {
    resume();
  }, [resume]);

  const handleStop = useCallback(() => {
    stop();
  }, [stop]);

  const handleRateChange = useCallback((rate) => {
    setRate(rate);
  }, [setRate]);

  // --- Toggle audio mode ---
  const handleToggleAudio = useCallback(() => {
    if (state.audioMode) {
      // Turning off — stop audio
      stop();
      toggleMode('audioMode');
    } else {
      toggleMode('audioMode');
    }
  }, [state.audioMode, stop, toggleMode]);

  // --- Voice command handler ---
  const handleVoiceCommand = useCallback((command) => {
    switch (command) {
      case 'next':
        if (!state.focusMode) {
          setMode('focusMode', true);
        }
        dispatch({
          type: 'SET_PARAGRAPH_INDEX',
          payload: Math.min(state.currentParagraphIndex + 1, state.totalParagraphs - 1),
        });
        break;
      case 'previous':
        dispatch({
          type: 'SET_PARAGRAPH_INDEX',
          payload: Math.max(state.currentParagraphIndex - 1, 0),
        });
        break;
      case 'simplify':
        if (!state.simplifyMode) toggleMode('simplifyMode');
        break;
      case 'readAloud':
        if (!state.audioMode) {
          toggleMode('audioMode');
          setTimeout(() => handlePlay(), 100);
        }
        break;
      case 'stop':
        if (state.isAudioPlaying) handleStop();
        break;
      case 'focus':
        toggleMode('focusMode');
        break;
    }
  }, [state, toggleMode, setMode, dispatch, handlePlay, handleStop]);

  // Voice control setup
  const { supported: voiceSupported, startListening, stopListening } = useVoiceControl(handleVoiceCommand);

  // Watch voice control toggle
  useEffect(() => {
    if (state.voiceControl && voiceSupported) {
      startListening();
    } else {
      stopListening();
    }
  }, [state.voiceControl, voiceSupported, startListening, stopListening]);

  // --- Eye tracking toggle ---
  useEffect(() => {
    if (state.eyeTracking) {
      initEyeTracking().then((success) => {
        if (success && needsCalibration) {
          setShowCalibration(true);
        }
      });
    }
  }, [state.eyeTracking]); // eslint-disable-line react-hooks/exhaustive-deps

  // --- Suggestion auto-dismiss (10 seconds) ---
  useEffect(() => {
    if (state.activeSuggestion) {
      if (suggestionTimerRef.current) clearTimeout(suggestionTimerRef.current);
      suggestionTimerRef.current = setTimeout(() => {
        dismissSuggestion();
        clearSuggestion();
      }, 10000);
    }
    return () => {
      if (suggestionTimerRef.current) clearTimeout(suggestionTimerRef.current);
    };
  }, [state.activeSuggestion, dismissSuggestion, clearSuggestion]);

  // --- Suggestion handlers ---
  const handleAcceptSuggestion = useCallback(() => {
    const suggestion = acceptSuggestion();
    if (suggestion && suggestion.mode) {
      setMode(suggestion.mode, true);
    }
    clearSuggestion();
  }, [acceptSuggestion, setMode, clearSuggestion]);

  const handleDismissSuggestion = useCallback(() => {
    dismissSuggestion();
    clearSuggestion();
  }, [dismissSuggestion, clearSuggestion]);

  // Keyboard controls
  useKeyboardControls({
    onToggleAudio: handleToggleAudio,
    onDismissSuggestion: handleDismissSuggestion,
  });

  // Gesture controls
  useGestureControl();

  // Apply high contrast class to html
  useEffect(() => {
    const html = document.documentElement;
    if (state.highContrastMode) {
      html.classList.add('high-contrast');
    } else {
      html.classList.remove('high-contrast');
    }
  }, [state.highContrastMode]);

  // Apply dyslexia class to body
  useEffect(() => {
    const body = document.body;
    if (state.dyslexiaMode) {
      body.classList.add('dyslexia-mode');
    } else {
      body.classList.remove('dyslexia-mode');
    }
  }, [state.dyslexiaMode]);

  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* Sidebar Controls */}
      <Controls />

      {/* Main Content */}
      <main className="ml-64 transition-[margin] duration-300 pb-10">
        <Reader />
      </main>

      {/* Floating UI */}
      <AnimatePresence>
        {state.audioMode && (
          <AudioControls
            onPlay={handlePlay}
            onPause={handlePause}
            onResume={handleResume}
            onStop={handleStop}
            onRateChange={handleRateChange}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        <FocusControls />
      </AnimatePresence>

      <SuggestionPopup
        suggestion={state.activeSuggestion}
        onAccept={handleAcceptSuggestion}
        onDismiss={handleDismissSuggestion}
      />

      <VoiceIndicator />
      <StatusBar />

      {/* Eye Tracking Calibration */}
      <AnimatePresence>
        {showCalibration && (
          <CalibrationOverlay
            onComplete={() => {
              setCalibrated();
              setShowCalibration(false);
            }}
            onSkip={() => {
              setCalibrated();
              setShowCalibration(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  return (
    <ReadingProvider>
      <AppContent />
    </ReadingProvider>
  );
}
