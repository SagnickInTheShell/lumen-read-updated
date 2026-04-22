'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReading } from '@/context/ReadingContext';

const PROFILE_OPTIONS = [
  {
    id: 'focus-loss',
    emoji: '🧠',
    title: 'I lose focus easily',
    description: 'Help me stay concentrated and minimize distractions.',
    color: 'from-blue-400 to-blue-600',
  },
  {
    id: 'blur',
    emoji: '👀',
    title: 'Words blur together',
    description: 'Give me more space and clarity between letters.',
    color: 'from-purple-400 to-purple-600',
  },
  {
    id: 'slow-speed',
    emoji: '⚡',
    title: 'I read slowly',
    description: 'Simplify text and reduce cognitive load.',
    color: 'from-orange-400 to-orange-600',
  },
  {
    id: 'retention',
    emoji: '💾',
    title: 'I forget what I read',
    description: 'Summarize sections and track progress.',
    color: 'from-green-400 to-green-600',
  },
  {
    id: 'language',
    emoji: '🌍',
    title: 'English is hard for me',
    description: 'Simplify language and explain difficult words.',
    color: 'from-pink-400 to-pink-600',
  },
];

export default function Onboarding({ onComplete }) {
  const { state, setUserProfile } = useReading();
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Skip if already completed
    if (state.hasCompletedOnboarding) {
      onComplete?.();
    }
  }, [state.hasCompletedOnboarding, onComplete]);

  const handleSubmit = async () => {
    if (!selectedProfile) return;

    setIsSubmitting(true);
    
    // Store preference
    setUserProfile(selectedProfile);
    
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setIsSubmitting(false);
    onComplete?.();
  };

  if (state.hasCompletedOnboarding) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 px-8 py-8 text-white">
            <motion.h1
              className="text-3xl font-bold mb-2"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Welcome to Lumen Read
            </motion.h1>
            <motion.p
              className="text-white/90 text-lg"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              How do you struggle most while reading?
            </motion.p>
          </div>

          {/* Profile Options */}
          <div className="p-8">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, staggerChildren: 0.05 }}
            >
              {PROFILE_OPTIONS.map((option) => (
                <motion.button
                  key={option.id}
                  onClick={() => setSelectedProfile(option.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                    selectedProfile === option.id
                      ? 'border-purple-500 bg-purple-50 shadow-lg scale-105'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: 'spring', damping: 20 }}
                >
                  <div className="text-3xl mb-2">{option.emoji}</div>
                  <div className="font-semibold text-gray-900">{option.title}</div>
                  <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                </motion.button>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              className="flex gap-4"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={handleSubmit}
                disabled={!selectedProfile || isSubmitting}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                  selectedProfile && !isSubmitting
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? "Setting up..." : "Let's Go"}
              </button>
              <button
                onClick={onComplete}
                className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
              >
                Skip
              </button>
            </motion.div>

            {/* Info */}
            <motion.p
              className="text-xs text-gray-500 text-center mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              We&apos;ll adapt the app to help you read better. You can change this anytime.
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
