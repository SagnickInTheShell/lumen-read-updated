'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Demo Banner
 * 
 * Appears on first load to showcase the product's power.
 * Guides user through the experience quickly.
 */
export default function DemoBanner({ onDismiss }) {
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('lumenReadBannerSeen');
    }
    return true;
  });

  const handleDismiss = () => {
    localStorage.setItem('lumenReadBannerSeen', 'true');
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  const steps = [
    {
      icon: '👁️',
      title: 'We notice struggle.',
      description: 'Pause detection. Slow reading. Distraction tracking.',
      color: 'from-blue-400 to-blue-600',
    },
    {
      icon: '✨',
      title: 'We adapt in real time.',
      description: 'Font spacing, contrast, width. All automatic.',
      color: 'from-purple-400 to-purple-600',
    },
    {
      icon: '📈',
      title: 'You improve faster.',
      description: 'See your confidence score. Session feedback.',
      color: 'from-green-400 to-emerald-600',
    },
  ];

  const current = steps[step];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-6">
          {/* Content */}
          <motion.div
            key={step}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4 }}
            className="flex-1 flex items-center gap-4"
          >
            <div className={`text-4xl`}>{current.icon}</div>
            <div>
              <h3 className="font-bold text-lg">{current.title}</h3>
              <p className="text-slate-300 text-sm">{current.description}</p>
            </div>
          </motion.div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Step Indicators */}
            <div className="flex gap-1">
              {steps.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setStep(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === step ? 'bg-white w-6' : 'bg-slate-500 hover:bg-slate-400'
                  }`}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>

            {/* Navigation */}
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="px-2 py-1 text-sm text-slate-300 hover:text-white disabled:text-slate-600 transition-colors"
            >
              ←
            </button>

            <button
              onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
              disabled={step === steps.length - 1}
              className="px-2 py-1 text-sm text-slate-300 hover:text-white disabled:text-slate-600 transition-colors"
            >
              →
            </button>

            {/* Close */}
            <button
              onClick={handleDismiss}
              className="ml-4 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 font-medium text-sm transition-colors"
            >
              {step === steps.length - 1 ? "Let's Go" : 'Skip'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Spacer */}
      <div className="h-16" />
    </AnimatePresence>
  );
}
