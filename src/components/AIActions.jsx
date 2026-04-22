'use client';

import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Smart AI Micro-Actions
 * 
 * One-click inline actions:
 * - Simplify this paragraph
 * - Summarize section
 * - Explain word
 * - Translate sentence
 */
const AIActions = memo(function AIActions({ text, onAction }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const actions = [
    {
      id: 'simplify',
      icon: '📝',
      label: 'Simplify',
      hint: 'Make text easier to understand',
      action: 'simplify',
    },
    {
      id: 'summarize',
      icon: '📖',
      label: 'Summarize',
      hint: 'Get the key points',
      action: 'summarize',
    },
    {
      id: 'explain',
      icon: '💡',
      label: 'Explain',
      hint: 'Define difficult words',
      action: 'explain',
    },
    {
      id: 'translate',
      icon: '🌍',
      label: 'Translate',
      hint: 'Change language clarity',
      action: 'translate',
    },
  ];

  const handleAction = async (action) => {
    setIsProcessing(true);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 800));
    onAction?.(action, text);
    setIsProcessing(false);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all text-sm font-medium"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="AI-assisted actions for this text"
      >
        ✨ AI
      </motion.button>

      {/* Actions Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-20"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            {/* Actions */}
            <div className="space-y-1 p-2 min-w-[200px]">
              {actions.map((action) => (
                <motion.button
                  key={action.id}
                  onClick={() => handleAction(action.action)}
                  disabled={isProcessing}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                    isProcessing
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'hover:bg-purple-100 text-gray-700'
                  }`}
                  whileHover={!isProcessing ? { x: 4 } : {}}
                >
                  <span className="text-lg">{action.icon}</span>
                  <div>
                    <div className="font-semibold text-sm">{action.label}</div>
                    <div className="text-xs text-gray-500">{action.hint}</div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Processing State */}
            {isProcessing && (
              <motion.div
                className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex flex-col items-center gap-2">
                  <motion.div
                    className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  <div className="text-xs font-semibold text-gray-700">Processing...</div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default AIActions;
