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
  const { state, setParagraphIndex, toggleMode } = useReading();
  const controlsRef = useRef(null);

  useEffect(() => {
    controlsRef.current = createGestureControl();

    controlsRef.current.initialize((gesture) => {
      if (!state.gestureControl) return;

      if (gesture === 'pinch') {
        toggleMode('focusMode');
      } else if (gesture === 'swipe_left') {
        if (state.focusMode) {
           setParagraphIndex(Math.min(state.currentParagraphIndex + 1, state.totalParagraphs - 1));
        } else {
           window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
        }
      } else if (gesture === 'swipe_right') {
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
    });

    return () => {
      if (controlsRef.current) {
        controlsRef.current.destroy();
      }
    };
  }, [state.gestureControl, state.focusMode, state.currentParagraphIndex, state.totalParagraphs, setParagraphIndex, toggleMode]);

  // Handle start/stop and camera lifecycle
  useEffect(() => {
    let stopFn = null;
    if (state.gestureControl && controlsRef.current) {
      controlsRef.current.start().then((stopCallback) => {
        stopFn = stopCallback;
      });
    }

    return () => {
      if (stopFn) stopFn();
      else if (controlsRef.current) controlsRef.current.stop();
    };
  }, [state.gestureControl]);

  return null;
}
