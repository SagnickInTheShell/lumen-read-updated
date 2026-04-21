'use client';

import { useEffect, useRef, useCallback } from 'react';
import { createBehaviorTracker } from '@/modules/behaviorTracker';
import { useReading } from '@/context/ReadingContext';

/**
 * Hook: useReadingBehavior
 * 
 * Wraps behaviorTracker for WPM/scroll tracking.
 * Suggestion popup removed per user request — behavior data is still tracked
 * and displayed in the status bar (WPM, progress).
 */
export function useReadingBehavior() {
  const { updateBehavior } = useReading();
  const trackerRef = useRef(null);
  const intervalRef = useRef(null);
  const throttleRef = useRef(null);

  // Initialize on mount
  useEffect(() => {
    trackerRef.current = createBehaviorTracker();

    // Visibility change handler
    const onVisibilityChange = () => {
      if (trackerRef.current) {
        trackerRef.current.setTabVisible(!document.hidden);
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Periodic pause check (every 2 seconds)
    intervalRef.current = setInterval(() => {
      if (trackerRef.current) {
        trackerRef.current.checkPause();
        const behavior = trackerRef.current.getState();
        updateBehavior(behavior);
      }
    }, 2000);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll handler (throttled to 200ms)
  const handleScroll = useCallback(() => {
    if (throttleRef.current) return;

    throttleRef.current = setTimeout(() => {
      throttleRef.current = null;
      if (trackerRef.current) {
        trackerRef.current.trackScroll(window.scrollY);
      }
    }, 200);
  }, []);

  // Register scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Paragraph visibility callbacks
  const onParagraphVisible = useCallback((id, wordCount) => {
    if (trackerRef.current) {
      trackerRef.current.onParagraphVisible(id, wordCount);
    }
  }, []);

  const onParagraphHidden = useCallback((id) => {
    if (trackerRef.current) {
      trackerRef.current.onParagraphHidden(id);
    }
  }, []);

  return {
    onParagraphVisible,
    onParagraphHidden,
  };
}
