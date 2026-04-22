'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Silent Mode Coach
 * 
 * Post-session feedback showing personalized coaching:
 * "You paused often in dense paragraphs. Try Focus Mode next time."
 */
export default function SilentModeCoach({ metrics, onDismiss }) {
  const [isVisible, setIsVisible] = useState(true);

  const feedback = useMemo(() => {
    if (!metrics) return null;

    // Generate coaching message
    const messages = [];

    if (metrics.pauseCount > 5) {
      messages.push({
        type: 'pause',
        icon: '⏸️',
        message: 'You paused often in dense paragraphs. Try Focus Mode next time.',
      });
    }

    if (metrics.distractionCount > 3) {
      messages.push({
        type: 'distraction',
        icon: '🎯',
        message: 'We noticed frequent distractions. Consider full-screen reading mode.',
      });
    }

    if (metrics.focusConsistency < 70) {
      messages.push({
        type: 'focus',
        icon: '🔍',
        message: 'Simplify Mode helped users like you read 40% smoother.',
      });
    }

    if (metrics.speedRecovery > 80) {
      messages.push({
        type: 'success',
        icon: '⚡',
        message: 'Excellent! You recovered from difficult sections quickly.',
      });
    }

    if (metrics.completionRate > 90) {
      messages.push({
        type: 'completion',
        icon: '✅',
        message: 'You stayed focused and completed 90% of the session.',
      });
    }

    // Return most relevant message
    return messages.length > 0 ? messages[0] : null;
  }, [metrics]);

  if (!feedback || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-6 right-6 max-w-sm z-40"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          {/* Color bar */}
          <div
            className={`h-1 ${
              feedback.type === 'success'
                ? 'bg-green-500'
                : feedback.type === 'completion'
                ? 'bg-blue-500'
                : feedback.type === 'pause'
                ? 'bg-orange-500'
                : 'bg-purple-500'
            }`}
          />

          {/* Content */}
          <div className="p-4">
            <div className="flex gap-3">
              <div className="text-2xl flex-shrink-0">{feedback.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Session Insight</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{feedback.message}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setIsVisible(false);
                  onDismiss?.();
                }}
                className="flex-1 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Got it
              </button>
              <button
                onClick={() => {
                  setIsVisible(false);
                  onDismiss?.();
                }}
                className="flex-1 px-3 py-2 rounded-lg bg-purple-100 text-purple-700 text-sm font-medium hover:bg-purple-200 transition-colors"
              >
                Try it
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
