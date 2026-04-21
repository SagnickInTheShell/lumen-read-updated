'use client';

import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReading } from '@/context/ReadingContext';

/**
 * VoiceIndicator — Shows voice control status and last command.
 */
function VoiceIndicator() {
  const { state } = useReading();

  if (!state.voiceControl) return null;

  const statusMessages = {
    idle: null,
    listening: 'Listening...',
    processing: 'Processing...',
    recognized: `Command: ${state.lastVoiceCommand || '...'}`,
    error: "Didn't catch that",
  };

  const message = statusMessages[state.voiceStatus];

  return (
    <AnimatePresence>
      {state.voiceControl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed top-4 right-4 z-50 flex items-center gap-2
            bg-lumen-bg/95 backdrop-blur-md border border-lumen-border 
            rounded-xl shadow-lg px-3 py-2"
        >
          {/* Mic icon with pulse */}
          <div className={`text-lg ${state.voiceStatus === 'listening' ? 'mic-pulse' : ''}`}>
            🎤
          </div>

          {/* Status text */}
          {message && (
            <motion.span
              key={message}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className={`text-xs font-medium ${
                state.voiceStatus === 'recognized'
                  ? 'text-lumen-success'
                  : state.voiceStatus === 'error'
                  ? 'text-red-400'
                  : 'text-lumen-text-secondary'
              }`}
            >
              {message}
            </motion.span>
          )}

          {/* Active dot */}
          <div className={`w-2 h-2 rounded-full ${
            state.voiceStatus === 'listening'
              ? 'bg-lumen-success animate-pulse'
              : state.voiceStatus === 'error'
              ? 'bg-red-400'
              : 'bg-lumen-text-secondary'
          }`} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default memo(VoiceIndicator);
