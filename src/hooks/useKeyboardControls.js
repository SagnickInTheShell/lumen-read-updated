'use client';

import { useEffect, useRef } from 'react';
import { createKeyboardControls } from '@/modules/keyboardControls';
import { useReading } from '@/context/ReadingContext';

/**
 * Hook: useKeyboardControls
 * 
 * Binds keyboard shortcuts to reading context actions.
 */
export function useKeyboardControls({ onToggleAudio, onDismissSuggestion }) {
  const { state, toggleMode, setParagraphIndex } = useReading();
  const controlsRef = useRef(null);

  useEffect(() => {
    controlsRef.current = createKeyboardControls();

    controlsRef.current.initialize((action) => {
      switch (action) {
        case 'next':
          if (state.focusMode) {
            setParagraphIndex(Math.min(state.currentParagraphIndex + 1, state.totalParagraphs - 1));
          }
          break;
        case 'previous':
          if (state.focusMode) {
            setParagraphIndex(Math.max(state.currentParagraphIndex - 1, 0));
          }
          break;
        case 'toggleAudio':
          if (onToggleAudio) onToggleAudio();
          break;
        case 'toggleSimplify':
          toggleMode('simplifyMode');
          break;
        case 'toggleDyslexia':
          toggleMode('dyslexiaMode');
          break;
        case 'toggleFocus':
          toggleMode('focusMode');
          break;
        case 'toggleHighContrast':
          toggleMode('highContrastMode');
          break;
        case 'dismissSuggestion':
          if (onDismissSuggestion) onDismissSuggestion();
          break;
      }
    });

    return () => {
      if (controlsRef.current) {
        controlsRef.current.destroy();
      }
    };
  }, [state.focusMode, state.currentParagraphIndex, state.totalParagraphs]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
