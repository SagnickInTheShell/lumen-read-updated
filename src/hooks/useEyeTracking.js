'use client';

import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { createEyeTracking } from '@/modules/eyeTracking';
import { useReading } from '@/context/ReadingContext';

/**
 * Hook: useEyeTracking
 * 
 * Wraps eye tracking module. Lazy-loads WebGazer only when enabled.
 * Fires distraction events: auto-pauses audio on look-away.
 */
export function useEyeTracking() {
  const { state, setGaze, dispatch, setAudioState } = useReading();
  const trackerRef = useRef(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    trackerRef.current = createEyeTracking();

    return () => {
      if (trackerRef.current) {
        trackerRef.current.destroy();
      }
    };
  }, []);

  const initialize = useCallback(async () => {
    if (!trackerRef.current) return false;

    setIsInitializing(true);
    setError(null);

    const result = await trackerRef.current.initialize(
      // onGaze
      (paragraphId) => {
        setGaze({ paragraphId, isLookingAway: false });
      },
      // onLookAway
      (lookingAway) => {
        setGaze({ isLookingAway: lookingAway });
        // Auto-pause audio when looking away
        if (lookingAway && state.isAudioPlaying) {
          if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.pause();
          }
          setAudioState({ isPlaying: false });
        }
      }
    );

    setIsInitializing(false);

    if (!result.success) {
      setError(result.error);
      return false;
    }
    return true;
  }, [setGaze, setAudioState, state.isAudioPlaying]);

  const registerParagraph = useCallback((id, element) => {
    if (trackerRef.current) {
      trackerRef.current.registerParagraph(id, element);
    }
  }, []);

  const unregisterParagraph = useCallback((id) => {
    if (trackerRef.current) {
      trackerRef.current.unregisterParagraph(id);
    }
  }, []);

  const stop = useCallback(() => {
    if (trackerRef.current) {
      trackerRef.current.stop();
    }
  }, []);

  const setCalibrated = useCallback(() => {
    if (trackerRef.current) {
      trackerRef.current.setCalibrated();
      dispatch({ type: 'SET_EYE_CALIBRATED' });
    }
  }, [dispatch]);

  const needsCalibration = !state.eyeTrackingCalibrated;

  return {
    initialize,
    registerParagraph,
    unregisterParagraph,
    stop,
    setCalibrated,
    needsCalibration,
    isInitializing,
    error,
  };
}
