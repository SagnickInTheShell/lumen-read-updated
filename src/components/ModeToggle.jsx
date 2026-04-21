'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';

/**
 * ModeToggle — Reusable toggle button with icon, label, and active state.
 */
function ModeToggle({ label, icon, isActive, onToggle, disabled = false, tooltip = '' }) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      title={tooltip || label}
      className={`
        group relative flex items-center gap-3 w-full px-3 py-2.5 rounded-xl
        text-sm font-medium transition-all duration-250
        ${disabled
          ? 'opacity-40 cursor-not-allowed'
          : 'cursor-pointer hover:bg-lumen-accent-soft'
        }
        ${isActive
          ? 'bg-lumen-accent-soft text-lumen-accent'
          : 'text-lumen-text-secondary hover:text-lumen-text'
        }
      `}
    >
      <span className="text-lg flex-shrink-0">{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      
      {/* Toggle indicator */}
      <div className={`
        relative w-9 h-5 rounded-full transition-colors duration-250 flex-shrink-0
        ${isActive ? 'bg-lumen-accent' : 'bg-lumen-border'}
        ${disabled ? '' : ''}
      `}>
        <motion.div
          className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
          animate={{ left: isActive ? '1.1rem' : '0.15rem' }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </div>

      {/* Disabled tooltip */}
      {disabled && tooltip && (
        <span className="absolute left-full ml-2 px-2 py-1 text-xs bg-lumen-text text-white rounded
          opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
          {tooltip}
        </span>
      )}
    </button>
  );
}

export default memo(ModeToggle);
