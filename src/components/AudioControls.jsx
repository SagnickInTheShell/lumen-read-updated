'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { useReading } from '@/context/ReadingContext';

/**
 * AudioControls — Play/pause, speed slider.
 * Appears when audio mode is active.
 */
function AudioControls({ onPlay, onPause, onResume, onStop, onRateChange }) {
  const { state } = useReading();

  if (!state.audioMode) return null;

  const speedLabels = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.25 }}
      className="fixed bottom-16 left-1/2 -translate-x-1/2 z-30
        bg-lumen-bg/95 backdrop-blur-md border border-lumen-border rounded-2xl
        shadow-lg px-5 py-3 flex items-center gap-4"
    >
      {/* Play/Pause */}
      <button
        onClick={() => {
          if (state.isAudioPlaying) {
            onPause();
          } else if (state.currentSentenceIndex >= 0) {
            onResume();
          } else {
            onPlay();
          }
        }}
        className="w-10 h-10 rounded-full bg-lumen-accent text-white flex items-center 
          justify-center hover:bg-lumen-accent-hover transition-colors text-lg"
        title={state.isAudioPlaying ? 'Pause' : 'Play'}
      >
        {state.isAudioPlaying ? '⏸' : '▶'}
      </button>

      {/* Stop */}
      <button
        onClick={onStop}
        className="w-8 h-8 rounded-full bg-lumen-bg-secondary text-lumen-text-secondary 
          flex items-center justify-center hover:bg-lumen-border transition-colors text-sm"
        title="Stop"
      >
        ⏹
      </button>

      {/* Divider */}
      <div className="w-px h-6 bg-lumen-border" />

      {/* Speed controls */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-lumen-text-secondary font-medium">Speed</span>
        <div className="flex gap-1">
          {speedLabels.map((speed) => (
            <button
              key={speed}
              onClick={() => onRateChange(speed)}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-all
                ${Math.abs(state.audioRate - speed) < 0.01
                  ? 'bg-lumen-accent text-white'
                  : 'bg-lumen-bg-secondary text-lumen-text-secondary hover:text-lumen-text'
                }
              `}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>

      {/* Currently playing indicator */}
      {state.isAudioPlaying && (
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5 items-end h-4">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-0.5 bg-lumen-accent rounded-full"
                animate={{ height: ['4px', '16px', '4px'] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default memo(AudioControls);
