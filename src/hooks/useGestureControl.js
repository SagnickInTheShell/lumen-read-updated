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
  
  // Use a mutable ref.current to store fresh state values
  // so we don't have to recreate the MediaPipe instance when state changes
  const stateRef = useRef({ state, setParagraphIndex, toggleMode });
  useEffect(() => {
    stateRef.current = { state, setParagraphIndex, toggleMode };
  }, [state, setParagraphIndex, toggleMode]);

  // Init gesture control ONLY ONCE
  useEffect(() => {
    controlsRef.current = createGestureControl();

    controlsRef.current.initialize((gesture) => {
      const current = stateRef.current;
      if (!current.state.gestureControl) return;

      if (gesture === 'swipe_left') {
        if (current.state.focusMode) {
           current.setParagraphIndex(Math.min(current.state.currentParagraphIndex + 1, current.state.totalParagraphs - 1));
        } else {
           window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
        }
      } else if (gesture === 'swipe_right') {
        if (current.state.focusMode) {
           current.setParagraphIndex(Math.max(current.state.currentParagraphIndex - 1, 0));
        } else {
           window.scrollBy({ top: -window.innerHeight * 0.8, behavior: 'smooth' });
        }
      } else if (gesture === 'scroll_up') {
        // Continuous, smooth scroll up
        window.scrollBy({ top: -15 });
      } else if (gesture === 'scroll_down') {
        // Continuous, smooth scroll down
        window.scrollBy({ top: 15 });
      }
    });

    return () => {
      if (controlsRef.current) {
        controlsRef.current.destroy();
      }
    };
  }, []); // Empty dependency array ensures we only initialize ONCE

  // Handle start/stop when toggle mode changes
  useEffect(() => {
    let stopFn = null;
    if (state.gestureControl && controlsRef.current) {
      controlsRef.current.start().then((stopCallback) => {
        stopFn = stopCallback;
      });
    }

    return () => {
      if (stopFn) {
        stopFn();
      } else if (controlsRef.current) {
        controlsRef.current.stop();
      }
    };
  }, [state.gestureControl]);

  return null;
}
