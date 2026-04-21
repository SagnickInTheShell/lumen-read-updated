'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { useReading } from '@/context/ReadingContext';

/**
 * FocusControls — Previous/Next paragraph controls for focus mode.
 */
function FocusControls() {
  const { state, setParagraphIndex } = useReading();

  if (!state.focusMode) return null;

  const canGoPrev = state.currentParagraphIndex > 0;
  const canGoNext = state.currentParagraphIndex < state.totalParagraphs - 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.25 }}
      className="fixed bottom-28 left-1/2 -translate-x-1/2 z-30
        bg-lumen-bg/95 backdrop-blur-md border border-lumen-border rounded-2xl
        shadow-lg px-4 py-2.5 flex items-center gap-3"
    >
      <button
        onClick={() => setParagraphIndex(Math.max(0, state.currentParagraphIndex - 1))}
        disabled={!canGoPrev}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all
          ${canGoPrev
            ? 'bg-lumen-bg-secondary text-lumen-text hover:bg-lumen-accent-soft hover:text-lumen-accent'
            : 'opacity-30 cursor-not-allowed text-lumen-text-secondary'
          }
        `}
      >
        ← Prev
      </button>

      <div className="px-3 py-1 rounded-lg bg-lumen-accent-soft">
        <span className="text-xs font-semibold text-lumen-accent">
          {state.currentParagraphIndex + 1} / {state.totalParagraphs}
        </span>
      </div>

      <button
        onClick={() => setParagraphIndex(Math.min(state.totalParagraphs - 1, state.currentParagraphIndex + 1))}
        disabled={!canGoNext}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all
          ${canGoNext
            ? 'bg-lumen-bg-secondary text-lumen-text hover:bg-lumen-accent-soft hover:text-lumen-accent'
            : 'opacity-30 cursor-not-allowed text-lumen-text-secondary'
          }
        `}
      >
        Next →
      </button>
    </motion.div>
  );
}

export default memo(FocusControls);
