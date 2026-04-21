'use client';

import { useEffect, useRef } from 'react';
import { createGestureControl } from '@/modules/gestureControl';
import { useReading } from '@/context/ReadingContext';

/**
 * Hook: useGestureControl
 * 
 * Wraps gesture control module with React state.
 * Triggers context actions on swipe.
 */
export function useGestureControl() {
  const { state, setParagraphIndex } = useReading();
  const controlsRef = useRef(null);

  useEffect(() => {
    controlsRef.current = createGestureControl();

    controlsRef.current.initialize((gesture) => {
      // Only process navigate gestures if focus mode is active, 
      // otherwise fallback to normal scroll or logic
      if (state.gestureControl) {
        if (gesture === 'swipe_left') {
          // Next
          if (state.focusMode) {
             setParagraphIndex(Math.min(state.currentParagraphIndex + 1, state.totalParagraphs - 1));
          } else {
             window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
          }
        } else if (gesture === 'swipe_right') {
          // Previous
          if (state.focusMode) {
             setParagraphIndex(Math.max(state.currentParagraphIndex - 1, 0));
          } else {
             window.scrollBy({ top: -window.innerHeight * 0.8, behavior: 'smooth' });
          }
        } else if (gesture === 'swipe_up') {
          window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
        } else if (gesture === 'swipe_down') {
          window.scrollBy({ top: -window.innerHeight * 0.8, behavior: 'smooth' });
        }
      }
    });

    return () => {
      if (controlsRef.current) {
        controlsRef.current.destroy();
      }
    };
  }, [state.gestureControl, state.focusMode, state.currentParagraphIndex, state.totalParagraphs, setParagraphIndex]);

  // We want to attach to document or main element
  useEffect(() => {
    if (state.gestureControl && controlsRef.current) {
      const stop = controlsRef.current.start(document.documentElement);
      return () => {
        if (stop) stop();
      };
    }
  }, [state.gestureControl]);

  return null;
}
