'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { createVoiceControl } from '@/modules/voiceControl';
import { useReading } from '@/context/ReadingContext';

/**
 * Hook: useVoiceControl
 * 
 * Wraps voice control module with React state.
 * Returns status, last command, supported flag.
 */
export function useVoiceControl(onCommand) {
  const { setVoiceStatus } = useReading();
  const controlRef = useRef(null);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    controlRef.current = createVoiceControl();
    
    const result = controlRef.current.initialize(
      (command) => {
        if (onCommand) onCommand(command);
      },
      (status, lastCommand) => {
        setVoiceStatus(status, lastCommand);
      }
    );

    setSupported(result.supported);

    return () => {
      if (controlRef.current) {
        controlRef.current.destroy();
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const startListening = useCallback(() => {
    if (controlRef.current) {
      return controlRef.current.startListening();
    }
    return false;
  }, []);

  const stopListening = useCallback(() => {
    if (controlRef.current) {
      controlRef.current.stopListening();
    }
  }, []);

  return {
    supported,
    startListening,
    stopListening,
  };
}
