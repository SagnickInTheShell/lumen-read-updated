'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * AI Micro-Actions
 * 
 * One-click AI features integrated into reading flow:
 * - Simplify paragraph
 * - Summarize section
 * - Explain difficult word
 * - Translate sentence
 */
export default function AIMicroActions({ selectedText, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeAction, setActiveAction] = useState(null);

  if (!selectedText) return null;

  const actions = [
    {
      id: 'simplify',
      icon: '✏️',
      label: 'Simplify',
      description: 'Make it easier to understand',
      prompt: `Simplify this text to be understandable by a 10-year-old: "${selectedText}"`,
    },
    {
      id: 'summarize',
      icon: '📝',
      label: 'Summarize',
      description: 'Get the key points',
      prompt: `Summarize this in 1-2 sentences: "${selectedText}"`,
    },
    {
      id: 'explain',
      icon: '🔍',
      label: 'Explain',
      description: 'Break it down',
      prompt: `Explain what this means in simple terms: "${selectedText}"`,
    },
    {
      id: 'translate',
      icon: '🌍',
      label: 'Translate',
      description: 'Simpler language',
      prompt: `Rephrase this using simpler, more common words: "${selectedText}"`,
    },
  ];

  const handleAction = async (action) => {
    setActiveAction(action.id);
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock results (in real app, call API)
    const mockResults = {
      simplify: 'This text has been made simpler and easier to understand.',
      summarize: 'The main idea is: [simplified key point].',
      explain: 'This word means... [explanation in simple terms].',
      translate: 'Here\'s another way to say it: [rephrased version].',
    };
    
    setResult({
      action: action.label,
      content: mockResults[action.id],
    });
    
    setIsLoading(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 max-w-md z-50"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
          {!result ? (
            <>
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white text-sm">AI Assist</h3>
                  <button
                    onClick={onClose}
                    className="text-white hover:bg-white/20 p-1 rounded transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Selected Text Preview */}
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Selected text:</p>
                <p className="text-sm text-gray-900 line-clamp-2">{selectedText}</p>
              </div>

              {/* Actions Grid */}
              <div className="grid grid-cols-2 gap-2 p-3">
                {actions.map((action) => (
                  <motion.button
                    key={action.id}
                    onClick={() => handleAction(action)}
                    disabled={isLoading}
                    className={`p-3 rounded-lg text-center transition-all ${
                      isLoading
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700'
                    }`}
                    whileHover={{ scale: isLoading ? 1 : 1.05 }}
                    whileTap={{ scale: isLoading ? 1 : 0.95 }}
                  >
                    <div className="text-xl mb-1">{action.icon}</div>
                    <div className="text-xs font-semibold">{action.label}</div>
                    <div className="text-[10px] text-gray-600">{action.description}</div>
                  </motion.button>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Result */}
              <div className="px-4 py-3">
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200">
                  <div className="text-lg">✨</div>
                  <h3 className="font-semibold text-gray-900">{result.action} Result</h3>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">{result.content}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setResult(null)}
                    className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
