'use client';

import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CALIBRATION_POINTS = [
  { x: '10%', y: '10%' },
  { x: '90%', y: '10%' },
  { x: '50%', y: '50%' },
  { x: '10%', y: '90%' },
  { x: '90%', y: '90%' },
];

/**
 * CalibrationOverlay — 5-point calibration for eye tracking.
 */
function CalibrationOverlay({ onComplete, onSkip }) {
  const [currentPoint, setCurrentPoint] = useState(0);
  const [clicks, setClicks] = useState(0);

  const CLICKS_PER_POINT = 3;

  const handleClick = (index) => {
    if (index !== currentPoint) return;

    const newClicks = clicks + 1;
    setClicks(newClicks);

    if (newClicks >= CLICKS_PER_POINT) {
      if (currentPoint >= CALIBRATION_POINTS.length - 1) {
        // Done
        onComplete();
      } else {
        setCurrentPoint(currentPoint + 1);
        setClicks(0);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center"
    >
      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-8 left-1/2 -translate-x-1/2 text-center"
      >
        <h2 className="text-white text-lg font-semibold mb-1">Eye Tracking Calibration</h2>
        <p className="text-white/60 text-sm">
          Click each dot {CLICKS_PER_POINT} times while looking at it
        </p>
        <p className="text-white/40 text-xs mt-1">
          Point {currentPoint + 1} of {CALIBRATION_POINTS.length}
        </p>
      </motion.div>

      {/* Calibration points */}
      {CALIBRATION_POINTS.map((point, index) => (
        <motion.button
          key={index}
          onClick={() => handleClick(index)}
          className={`absolute w-8 h-8 rounded-full transition-all duration-300 
            ${index === currentPoint
              ? 'bg-lumen-accent scale-100 cursor-pointer'
              : index < currentPoint
              ? 'bg-lumen-success scale-75 opacity-50'
              : 'bg-white/20 scale-75 opacity-30'
            }
          `}
          style={{ left: point.x, top: point.y, transform: 'translate(-50%, -50%)' }}
          animate={index === currentPoint ? {
            scale: [1, 1.2, 1],
          } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {index === currentPoint && (
            <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
              {CLICKS_PER_POINT - clicks}
            </span>
          )}
        </motion.button>
      ))}

      {/* Skip button */}
      <button
        onClick={onSkip}
        className="absolute bottom-8 left-1/2 -translate-x-1/2
          text-white/50 text-sm hover:text-white/80 transition-colors"
      >
        Skip Calibration →
      </button>
    </motion.div>
  );
}

export default memo(CalibrationOverlay);
