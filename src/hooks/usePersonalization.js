'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useReading } from '@/context/ReadingContext';

const STORAGE_KEY = 'lumen-read-preferences';
const SAVE_DEBOUNCE_MS = 500;

/**
 * Hook: usePersonalization
 * 
 * Persists user preferences to localStorage.
 * Restores on mount (before first render via useLayoutEffect-like pattern).
 * Debounced saves.
 */
export function usePersonalization() {
  const { state, dispatch } = useReading();
  const saveTimerRef = useRef(null);
  const initializedRef = useRef(false);

  // Restore preferences on mount
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const prefs = JSON.parse(saved);
        dispatch({
          type: 'RESTORE_STATE',
          payload: {
            dyslexiaMode: prefs.dyslexiaMode || false,
            focusMode: prefs.focusMode || false,
            simplifyMode: prefs.simplifyMode || false,
            highContrastMode: prefs.highContrastMode || false,
            audioRate: prefs.audioRate || 1,
            currentParagraphIndex: prefs.currentParagraphIndex || 0,
            lastReadPosition: prefs.lastReadPosition || null,
          },
        });
      }
    } catch (e) {
      // localStorage unavailable or corrupted
    }
  }, [dispatch]);

  // Save preferences when state changes (debounced)
  useEffect(() => {
    if (!initializedRef.current) return;

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      try {
        const prefs = {
          dyslexiaMode: state.dyslexiaMode,
          focusMode: state.focusMode,
          simplifyMode: state.simplifyMode,
          highContrastMode: state.highContrastMode,
          audioRate: state.audioRate,
          currentParagraphIndex: state.currentParagraphIndex,
          lastReadPosition: state.currentParagraphIndex,
          wpmBaseline: state.wpm,
          savedAt: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
      } catch (e) {
        // localStorage full or unavailable
      }
    }, SAVE_DEBOUNCE_MS);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [
    state.dyslexiaMode,
    state.focusMode,
    state.simplifyMode,
    state.highContrastMode,
    state.audioRate,
    state.currentParagraphIndex,
    state.wpm,
  ]);

  const clearPreferences = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // Ignore
    }
  }, []);

  return { clearPreferences };
}
