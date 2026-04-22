'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';

const ConfidenceDisplay = memo(function ConfidenceDisplay({
  metrics,
  message,
  animated = true,
}) {
  if (!metrics) return null;

  const confidence = metrics.confidence || 0;
  const getColor = () => {
    if (confidence >= 85) return 'from-green-400 to-emerald-600';
    if (confidence >= 70) return 'from-blue-400 to-blue-600';
    if (confidence >= 55) return 'from-yellow-400 to-orange-600';
    return 'from-orange-400 to-red-600';
  };

  const Wrapper = animated ? motion.div : 'div';
  const wrapperProps = animated
    ? {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 },
      }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Reading Confidence</h3>
        <div className="flex gap-1">
          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
            Session
          </span>
        </div>
      </div>

      {/* Main Score */}
      <div className="mb-4">
        <div className="flex items-end gap-2 mb-2">
          <div className={`text-3xl font-bold bg-gradient-to-r ${getColor()} bg-clip-text text-transparent`}>
            {confidence}%
          </div>
          <div className="text-xs text-gray-500 mb-1">
            {confidence >= 85 && '🎯 Excellent'}
            {confidence < 85 && confidence >= 70 && '✨ Good'}
            {confidence < 70 && confidence >= 55 && '📈 Improving'}
            {confidence < 55 && '💪 Keep trying'}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${getColor()}`}
            initial={{ width: 0 }}
            animate={{ width: `${confidence}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <MetricItem
          label="Focus"
          value={metrics.focusConsistency}
          icon="🧠"
        />
        <MetricItem
          label="Speed"
          value={metrics.speedRecovery}
          icon="⚡"
        />
        <MetricItem
          label="Progress"
          value={metrics.completionRate}
          icon="📖"
        />
        <MetricItem
          label="Distraction"
          value={metrics.distractionReduction}
          icon="✨"
        />
      </div>

      {/* Message */}
      {message && (
        <motion.div
          className="text-sm text-gray-700 italic border-t pt-3 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          &quot;{message}&quot;
        </motion.div>
      )}
    </Wrapper>
  );
});

function MetricItem({ label, value, icon }) {
  return (
    <div className="bg-gray-50 rounded-lg p-2 text-center">
      <div className="text-lg mb-1">{icon}</div>
      <div className="text-xs text-gray-600">{label}</div>
      <div className="font-bold text-gray-900">{Math.round(value)}%</div>
    </div>
  );
}

export default ConfidenceDisplay;
