'use client';

import { createContext, useContext, useReducer, useCallback } from 'react';

const ReadingContext = createContext(null);

const initialState = {
  // Modes
  dyslexiaMode: false,
  focusMode: false,
  audioMode: false,
  simplifyMode: false,
  voiceControl: false,
  eyeTracking: false,
  highContrastMode: false,
  handsFreeMode: false,

  // Reading state
  currentParagraphIndex: 0,
  totalParagraphs: 0,
  readingProgress: 0,

  // Behavior
  wpm: 200,
  isPaused: false,
  isReReading: false,
  isSlowReading: false,

  // Suggestion
  activeSuggestion: null,

  // Audio
  isAudioPlaying: false,
  audioRate: 1,
  currentSentenceIndex: -1,

  // Voice
  voiceStatus: 'idle', // idle | listening | recognized | error
  lastVoiceCommand: null,

  // Eye tracking
  gazeNearestParagraph: null,
  isLookingAway: false,
  eyeTrackingCalibrated: false,

  // Personalization
  lastReadPosition: null,
};

function readingReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_MODE': {
      const mode = action.payload;
      const newValue = !state[mode];
      
      // Handle hands-free mode toggling multiple modes
      if (mode === 'handsFreeMode') {
        if (newValue) {
          return {
            ...state,
            handsFreeMode: true,
            audioMode: true,
            voiceControl: true,
            focusMode: true,
            _preHandsFree: {
              audioMode: state.audioMode,
              voiceControl: state.voiceControl,
              focusMode: state.focusMode,
            },
          };
        } else {
          const prev = state._preHandsFree || {};
          return {
            ...state,
            handsFreeMode: false,
            audioMode: prev.audioMode || false,
            voiceControl: prev.voiceControl || false,
            focusMode: prev.focusMode || false,
            _preHandsFree: null,
          };
        }
      }

      return { ...state, [mode]: newValue };
    }

    case 'SET_MODE':
      return { ...state, [action.payload.mode]: action.payload.value };

    case 'SET_PARAGRAPH_INDEX':
      return {
        ...state,
        currentParagraphIndex: action.payload,
        readingProgress: state.totalParagraphs > 0
          ? Math.round(((action.payload + 1) / state.totalParagraphs) * 100)
          : 0,
      };

    case 'SET_TOTAL_PARAGRAPHS':
      return { ...state, totalParagraphs: action.payload };

    case 'UPDATE_BEHAVIOR':
      return {
        ...state,
        wpm: action.payload.wpm ?? state.wpm,
        isPaused: action.payload.isPaused ?? state.isPaused,
        isReReading: action.payload.isReReading ?? state.isReReading,
        isSlowReading: action.payload.isSlowReading ?? state.isSlowReading,
      };

    case 'SET_SUGGESTION':
      return { ...state, activeSuggestion: action.payload };

    case 'CLEAR_SUGGESTION':
      return { ...state, activeSuggestion: null };

    case 'SET_AUDIO_STATE':
      return {
        ...state,
        isAudioPlaying: action.payload.isPlaying ?? state.isAudioPlaying,
        audioRate: action.payload.rate ?? state.audioRate,
        currentSentenceIndex: action.payload.sentenceIndex ?? state.currentSentenceIndex,
      };

    case 'SET_VOICE_STATUS':
      return {
        ...state,
        voiceStatus: action.payload.status ?? state.voiceStatus,
        lastVoiceCommand: action.payload.command ?? state.lastVoiceCommand,
      };

    case 'SET_GAZE':
      return {
        ...state,
        gazeNearestParagraph: action.payload.paragraphId ?? state.gazeNearestParagraph,
        isLookingAway: action.payload.isLookingAway ?? state.isLookingAway,
      };

    case 'SET_EYE_CALIBRATED':
      return { ...state, eyeTrackingCalibrated: true };

    case 'SET_LAST_READ_POSITION':
      return { ...state, lastReadPosition: action.payload };

    case 'RESTORE_STATE':
      return { ...state, ...action.payload };

    default:
      return state;
  }
}

export function ReadingProvider({ children }) {
  const [state, dispatch] = useReducer(readingReducer, initialState);

  const toggleMode = useCallback((mode) => {
    dispatch({ type: 'TOGGLE_MODE', payload: mode });
  }, []);

  const setMode = useCallback((mode, value) => {
    dispatch({ type: 'SET_MODE', payload: { mode, value } });
  }, []);

  const setParagraphIndex = useCallback((index) => {
    dispatch({ type: 'SET_PARAGRAPH_INDEX', payload: index });
  }, []);

  const updateBehavior = useCallback((behavior) => {
    dispatch({ type: 'UPDATE_BEHAVIOR', payload: behavior });
  }, []);

  const setSuggestion = useCallback((suggestion) => {
    dispatch({ type: 'SET_SUGGESTION', payload: suggestion });
  }, []);

  const clearSuggestion = useCallback(() => {
    dispatch({ type: 'CLEAR_SUGGESTION' });
  }, []);

  const setAudioState = useCallback((audioState) => {
    dispatch({ type: 'SET_AUDIO_STATE', payload: audioState });
  }, []);

  const setVoiceStatus = useCallback((status, command) => {
    dispatch({ type: 'SET_VOICE_STATUS', payload: { status, command } });
  }, []);

  const setGaze = useCallback((gazeData) => {
    dispatch({ type: 'SET_GAZE', payload: gazeData });
  }, []);

  const value = {
    state,
    dispatch,
    toggleMode,
    setMode,
    setParagraphIndex,
    updateBehavior,
    setSuggestion,
    clearSuggestion,
    setAudioState,
    setVoiceStatus,
    setGaze,
  };

  return (
    <ReadingContext.Provider value={value}>
      {children}
    </ReadingContext.Provider>
  );
}

export function useReading() {
  const context = useContext(ReadingContext);
  if (!context) {
    throw new Error('useReading must be used within a ReadingProvider');
  }
  return context;
}

export default ReadingContext;
