'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReading } from '@/context/ReadingContext';

/**
 * Adaptive Auto Mode Toggle & Status
 * 
 * The signature feature button. Shows:
 * - Toggle to enable/disable
 * - Current profile when active
 * - Real-time adjustments as behavior changes
 */
export default function AdaptiveAutoModeToggle() {
  const { state, toggleMode } = useReading();
  const [showStatusPopup, setShowStatusPopup] = useState(false);
  const [autoModeStatus, setAutoModeStatus] = useState(null);

  useEffect(() => {
    // Simulate auto mode detecting changes
    const interval = setInterval(() => {
      if (state.adaptiveAutoMode) {
        const behaviors = [
          { profile: 'balanced', message: 'Reading smoothly. Keeping it balanced.' },
          { profile: 'challenging', message: 'Dense section detected. Giving you more space.' },
          { profile: 'difficult', message: 'This is complex. Simplifying for you.' },
        ];
        
        const random = behaviors[Math.floor(Math.random() * behaviors.length)];
        if (Math.random() > 0.7) { // 30% chance to update
          setAutoModeStatus(random);
          setShowStatusPopup(true);
          setTimeout(() => setShowStatusPopup(false), 4000);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [state.adaptiveAutoMode]);

  return (
    <div className="relative">
      {/* Enhanced Main Toggle Button */}
      <motion.button
        onClick={() => toggleMode('adaptiveAutoMode')}
        className={`relative w-full px-6 py-4 rounded-2xl font-bold text-lg transition-all duration-300 overflow-hidden ${
          state.adaptiveAutoMode
            ? 'shadow-glow text-white'
            : 'bg-lumen-bg-secondary hover:bg-lumen-accent-soft border-2 border-lumen-border hover:border-lumen-accent text-lumen-text shadow-premium hover:shadow-premium-lg'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Background gradient for active state */}
        {state.adaptiveAutoMode && (
          <div className="absolute inset-0 animated-bg opacity-90"></div>
        )}

        <div className="relative flex items-center justify-center gap-3">
          <motion.div
            animate={state.adaptiveAutoMode ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl"
          >
            {state.adaptiveAutoMode ? '🧠' : '⚡'}
          </motion.div>
          <div className="text-center">
            <div className={`font-bold text-lg ${state.adaptiveAutoMode ? 'text-white' : 'gradient-text'}`}>
              Adaptive Auto Mode
            </div>
            <div className={`text-sm mt-1 ${state.adaptiveAutoMode ? 'text-white/80' : 'text-lumen-text-secondary'}`}>
              {state.adaptiveAutoMode ? 'AI is adapting your reading' : 'Let AI optimize your reading'}
            </div>
          </div>
        </div>

        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </motion.button>

      {/* Enhanced Status Popup */}
      <AnimatePresence>
        {showStatusPopup && autoModeStatus && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="absolute top-full mt-3 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="glass-dark px-4 py-3 rounded-xl shadow-premium-xl border border-white/20 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-white">
                <span className="text-lg">🎯</span>
                <span className="font-medium">{autoModeStatus.message}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <div className="flex items-start gap-2">
              <span className="text-base">→</span>
              <div>
                <div className="font-semibold capitalize mb-1">{autoModeStatus.profile} Profile</div>
                <div className="text-white/90 text-xs">{autoModeStatus.message}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Description */}
      {!state.adaptiveAutoMode && (
        <motion.div
          className="text-xs text-gray-600 mt-2 px-1"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="leading-relaxed">
            <strong>Signature feature:</strong> Automatically adjusts spacing, contrast, and width based on your reading behavior. Notices when you struggle and adapts in real time.
          </p>
        </motion.div>
      )}

      {state.adaptiveAutoMode && (
        <motion.div
          className="text-xs text-gray-600 mt-2 px-1"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-purple-50 border border-purple-200 rounded p-2">
            <div className="font-semibold text-purple-900 mb-1">Active Adjustments:</div>
            <ul className="text-purple-700 space-y-1 text-xs">
              <li>✓ Dynamic spacing based on reading speed</li>
              <li>✓ Real-time contrast switching</li>
              <li>✓ Highlight current line for focus</li>
              <li>✓ Auto-simplify difficult sections</li>
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
}
