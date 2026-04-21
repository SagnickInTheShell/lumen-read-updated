'use client';

import { memo } from 'react';
import { useReading } from '@/context/ReadingContext';

/**
 * StatusBar — Bottom bar showing WPM, progress, active modes.
 * Subtle, non-intrusive. Throttled updates handled by context.
 */
function StatusBar() {
  const { state } = useReading();

  const activeModes = [];
  if (state.focusMode) activeModes.push({ label: 'Focus', icon: '🧠' });
  if (state.dyslexiaMode) activeModes.push({ label: 'Dyslexia', icon: '🧬' });
  if (state.simplifyMode) activeModes.push({ label: 'Simplified', icon: '📚' });
  if (state.highContrastMode) activeModes.push({ label: 'Contrast', icon: '🌗' });
  if (state.audioMode) activeModes.push({ label: 'Audio', icon: '🔊' });
  if (state.voiceControl) activeModes.push({ label: 'Voice', icon: '🎤' });
  if (state.eyeTracking) activeModes.push({ label: 'Eye', icon: '👁️' });
  if (state.handsFreeMode) activeModes.push({ label: 'Hands-Free', icon: '🎛️' });

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 h-10
      bg-lumen-bg/90 backdrop-blur-sm border-t border-lumen-border
      flex items-center justify-between px-6 text-xs text-lumen-text-secondary">
      
      {/* Left: WPM */}
      <div className="flex items-center gap-3">
        <span className="font-medium">
          {state.wpm} <span className="opacity-60">WPM</span>
        </span>
        <div className="w-px h-4 bg-lumen-border" />
        <span>
          {state.readingProgress}% <span className="opacity-60">read</span>
        </span>
      </div>

      {/* Center: Active mode badges */}
      <div className="flex items-center gap-1.5">
        {activeModes.map(({ label, icon }) => (
          <span
            key={label}
            className="mode-badge mode-badge-active"
          >
            <span className="text-[0.6rem]">{icon}</span>
            {label}
          </span>
        ))}
        {activeModes.length === 0 && (
          <span className="opacity-50">Normal reading</span>
        )}
      </div>

      {/* Right: paragraph count */}
      <span className="opacity-60">
        §{state.currentParagraphIndex + 1}/{state.totalParagraphs}
      </span>
    </div>
  );
}

export default memo(StatusBar);
