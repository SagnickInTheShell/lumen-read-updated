'use client';

import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * SuggestionPopup — Floating contextual suggestion.
 * Slide-in from bottom-right with reasoning.
 * Auto-dismiss after 10 seconds.
 */
function SuggestionPopup({ suggestion, onAccept, onDismiss }) {
  return (
    <AnimatePresence>
      {suggestion && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20, x: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed bottom-20 right-6 z-50 max-w-sm suggestion-glow"
        >
          <div className="bg-lumen-bg/98 backdrop-blur-md border border-lumen-border rounded-2xl 
            shadow-xl p-4 space-y-3">
            {/* Icon + Message */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-lumen-accent-soft flex items-center 
                justify-center text-lg flex-shrink-0">
                💡
              </div>
              <div>
                <p className="text-sm font-medium text-lumen-text leading-snug">
                  {suggestion.message}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pl-12">
              <button
                onClick={onAccept}
                className="px-3.5 py-1.5 bg-lumen-accent text-white text-xs font-semibold 
                  rounded-lg hover:bg-lumen-accent-hover transition-colors"
              >
                Try it
              </button>
              <button
                onClick={onDismiss}
                className="px-3.5 py-1.5 text-lumen-text-secondary text-xs font-medium 
                  rounded-lg hover:bg-lumen-bg-secondary transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default memo(SuggestionPopup);
