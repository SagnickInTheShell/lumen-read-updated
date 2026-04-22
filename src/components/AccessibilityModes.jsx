'use client';

import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReading } from '@/context/ReadingContext';

/**
 * Premium Accessibility Modes
 * 
 * Three signature modes for accessibility:
 * - Dyslexia Mode: OpenDyslexic font + extra spacing
 * - ADHD Focus Tunnel: Isolate paragraphs, one at a time
 * - Low Vision Mode: High contrast + zoom
 */
const AccessibilityModes = memo(function AccessibilityModes() {
  const { state, setMode } = useReading();
  const [selectedMode, setSelectedMode] = useState(null);

  const modes = [
    {
      id: 'dyslexia',
      icon: '🧬',
      name: 'Dyslexia Mode',
      description: 'OpenDyslexic font with enhanced spacing and pastel backgrounds',
      features: ['OpenDyslexic Font', 'Extra Letter Spacing', 'Pastel Background', 'Reduced Glare'],
      color: 'from-blue-400 to-blue-600',
      onClick: () => setMode('dyslexiaMode', !state.dyslexiaMode),
      isActive: state.dyslexiaMode,
    },
    {
      id: 'adhd',
      icon: '🎯',
      name: 'ADHD Focus Tunnel',
      description: 'Read one paragraph at a time with guided focus',
      features: ['One Paragraph Focus', 'Animated Progress', 'Blur Surroundings', 'Clear Navigation'],
      color: 'from-purple-400 to-purple-600',
      onClick: () => setMode('focusMode', !state.focusMode),
      isActive: state.focusMode,
    },
    {
      id: 'low-vision',
      icon: '👁️',
      name: 'Low Vision Mode',
      description: 'High contrast with text zoom and voice narration',
      features: ['High Contrast', 'Text Zoom', 'Voice Sync', 'Large Cursor'],
      color: 'from-yellow-400 to-orange-600',
      onClick: () => setMode('highContrastMode', !state.highContrastMode),
      isActive: state.highContrastMode,
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Premium Accessibility</h3>
        <div className="grid grid-cols-1 gap-3">
          {modes.map((mode) => (
            <motion.button
              key={mode.id}
              onClick={mode.onClick}
              className={`text-left p-3 rounded-lg border-2 transition-all ${
                mode.isActive
                  ? `border-${mode.id === 'dyslexia' ? 'blue-500' : mode.id === 'adhd' ? 'purple-500' : 'orange-500'} bg-${mode.id === 'dyslexia' ? 'blue-50' : mode.id === 'adhd' ? 'purple-50' : 'orange-50'} shadow-md`
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{mode.icon}</span>
                  <div>
                    <div className="font-semibold text-gray-900">{mode.name}</div>
                    <div className="text-xs text-gray-600">{mode.description}</div>
                  </div>
                </div>
                <motion.div
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                    mode.isActive ? 'bg-gradient-to-br ' + mode.color + ' border-current text-white' : 'border-gray-300'
                  }`}
                  animate={mode.isActive ? { rotate: 360 } : {}}
                  transition={mode.isActive ? { duration: 20, repeat: Infinity, ease: 'linear' } : {}}
                >
                  {mode.isActive && <span className="text-xs">✓</span>}
                </motion.div>
              </div>

              {/* Features */}
              <AnimatePresence>
                {mode.isActive && (
                  <motion.div
                    className="mt-2 pt-2 border-t border-gray-200/50"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {mode.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-center gap-1 text-gray-700"
                        >
                          <span className="text-[10px]">•</span> {feature}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Info */}
      <motion.div
        className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Premium modes automatically customize the reading experience. Mix and match for your needs.
      </motion.div>
    </div>
  );
});

export default AccessibilityModes;
