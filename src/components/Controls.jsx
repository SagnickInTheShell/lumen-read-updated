'use client';

import { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReading } from '@/context/ReadingContext';
import ModeToggle from './ModeToggle';
import AdaptiveAutoModeToggle from './AdaptiveAutoModeToggle';
import ConfidenceDisplay from './ConfidenceDisplay';
import AccessibilityModes from './AccessibilityModes';

/**
 * Controls — Left sidebar with mode toggles.
 * Collapsible. Groups: Reading, Audio, Experimental.
 * 
 * Browser API checks deferred to useEffect to avoid SSR hydration mismatch.
 */
function Controls() {
  const { state, toggleMode } = useReading();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Defer browser API checks to client-side only to avoid hydration mismatch
  const [speechSupported, setSpeechSupported] = useState(() => 
    typeof window !== 'undefined' ? 'speechSynthesis' in window : true
  );
  const [recognitionSupported, setRecognitionSupported] = useState(() => 
    typeof window !== 'undefined' ? !!(window.SpeechRecognition || window.webkitSpeechRecognition) : true
  );

  return (
    <motion.aside
      className={`
        fixed left-0 top-0 h-full z-40
        glass backdrop-blur-xl border-r border-lumen-border/50
        flex flex-col
        transition-all duration-300
        ${isCollapsed ? 'w-16' : 'w-80'}
        shadow-premium-xl
      `}
      initial={false}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-lumen-border">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <span className="text-xl">📖</span>
            <h1 className="text-base font-bold text-lumen-text tracking-tight">Lumen Read</h1>
          </motion.div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-lumen-accent-soft text-lumen-text-secondary 
            hover:text-lumen-text transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? '▸' : '◂'}
        </button>
      </div>

      {/* Toggles */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex-1 overflow-y-auto p-3 space-y-5"
          >
            {/* Adaptive Auto Mode - Signature Feature */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-3">
              <AdaptiveAutoModeToggle />
            </div>

            {/* Reading Confidence Display */}
            {state.confidenceMetrics && (
              <ConfidenceDisplay 
                metrics={state.confidenceMetrics}
                message={state.improvementMessage}
              />
            )}

            {/* Premium Accessibility Modes */}
            <div>
              <h3 className="text-[0.65rem] font-semibold uppercase tracking-widest text-lumen-text-secondary mb-2 px-1">
                Accessibility Modes
              </h3>
              <div className="space-y-1">
                <ModeToggle
                  label="Dyslexia Mode"
                  icon="🧬"
                  isActive={state.dyslexiaMode}
                  onToggle={() => toggleMode('dyslexiaMode')}
                  description="OpenDyslexic font + extra spacing"
                />
                <ModeToggle
                  label="ADHD Focus Tunnel"
                  icon="🎯"
                  isActive={state.focusMode}
                  onToggle={() => toggleMode('focusMode')}
                  description="Isolate one paragraph at a time"
                />
                <ModeToggle
                  label="High Contrast"
                  icon="🌗"
                  isActive={state.highContrastMode}
                  onToggle={() => toggleMode('highContrastMode')}
                  description="Max contrast for low vision"
                />
              </div>
            </div>

            {/* Reading Modes */}
            <div>
              <h3 className="text-[0.65rem] font-semibold uppercase tracking-widest text-lumen-text-secondary mb-2 px-1">
                Reading Tools
              </h3>
              <div className="space-y-1">
                <ModeToggle
                  label="Simplify Text"
                  icon="📚"
                  isActive={state.simplifyMode}
                  onToggle={() => toggleMode('simplifyMode')}
                />
              </div>
            </div>

            {/* Audio & Voice */}
            <div>
              <h3 className="text-[0.65rem] font-semibold uppercase tracking-widest text-lumen-text-secondary mb-2 px-1">
                Audio & Voice
              </h3>
              <div className="space-y-1">
                <ModeToggle
                  label="Audio Mode"
                  icon="🔊"
                  isActive={state.audioMode}
                  onToggle={() => toggleMode('audioMode')}
                  disabled={!speechSupported}
                  tooltip={!speechSupported ? 'Speech not supported in this browser' : ''}
                />
                <ModeToggle
                  label="Voice Control"
                  icon="🎤"
                  isActive={state.voiceControl}
                  onToggle={() => toggleMode('voiceControl')}
                  disabled={!recognitionSupported}
                  tooltip={!recognitionSupported ? 'Speech recognition not supported' : ''}
                />
                <ModeToggle
                  label="Hands-Free"
                  icon="🎛️"
                  isActive={state.handsFreeMode}
                  onToggle={() => toggleMode('handsFreeMode')}
                  disabled={!speechSupported}
                  tooltip={!speechSupported ? 'Requires speech support' : ''}
                />
              </div>
            </div>

            {/* Experimental */}
            <div>
              <h3 className="text-[0.65rem] font-semibold uppercase tracking-widest text-lumen-text-secondary mb-2 px-1">
                Experimental
              </h3>
              <div className="space-y-1">
                <ModeToggle
                  label="Eye Tracking"
                  icon="👁️"
                  isActive={state.eyeTracking}
                  onToggle={() => toggleMode('eyeTracking')}
                />
                <ModeToggle
                  label="Gestures"
                  icon="✋"
                  isActive={state.gestureControl}
                  onToggle={() => toggleMode('gestureControl')}
                />
                <ModeToggle
                  label="Translation"
                  icon="🌐"
                  isActive={false}
                  onToggle={() => {}}
                  disabled={true}
                  tooltip="Coming soon"
                />
              </div>
            </div>

            {/* Keyboard Shortcuts Legend */}
            <div>
              <h3 className="text-[0.65rem] font-semibold uppercase tracking-widest text-lumen-text-secondary mb-2 px-1">
                Shortcuts
              </h3>
              <div className="text-xs text-lumen-text-secondary space-y-1 px-1">
                <div className="flex justify-between"><span>Focus</span><kbd className="px-1.5 py-0.5 bg-lumen-bg-secondary rounded text-[0.6rem]">F</kbd></div>
                <div className="flex justify-between"><span>Dyslexia</span><kbd className="px-1.5 py-0.5 bg-lumen-bg-secondary rounded text-[0.6rem]">D</kbd></div>
                <div className="flex justify-between"><span>Simplify</span><kbd className="px-1.5 py-0.5 bg-lumen-bg-secondary rounded text-[0.6rem]">S</kbd></div>
                <div className="flex justify-between"><span>Contrast</span><kbd className="px-1.5 py-0.5 bg-lumen-bg-secondary rounded text-[0.6rem]">H</kbd></div>
                <div className="flex justify-between"><span>Audio</span><kbd className="px-1.5 py-0.5 bg-lumen-bg-secondary rounded text-[0.6rem]">Space</kbd></div>
                <div className="flex justify-between"><span>Navigate</span><kbd className="px-1.5 py-0.5 bg-lumen-bg-secondary rounded text-[0.6rem]">← →</kbd></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed icons */}
      {isCollapsed && (
        <div className="flex-1 flex flex-col items-center py-3 gap-2">
          {[
            { icon: '🧠', active: state.focusMode, mode: 'focusMode' },
            { icon: '🧬', active: state.dyslexiaMode, mode: 'dyslexiaMode' },
            { icon: '📚', active: state.simplifyMode, mode: 'simplifyMode' },
            { icon: '🌗', active: state.highContrastMode, mode: 'highContrastMode' },
            { icon: '🔊', active: state.audioMode, mode: 'audioMode' },
            { icon: '🎤', active: state.voiceControl, mode: 'voiceControl' },
            { icon: '👁️', active: state.eyeTracking, mode: 'eyeTracking' },
          ].map(({ icon, active, mode }) => (
            <button
              key={mode}
              onClick={() => toggleMode(mode)}
              className={`p-1.5 rounded-lg text-base transition-all
                ${active ? 'bg-lumen-accent-soft scale-110' : 'opacity-50 hover:opacity-100'}
              `}
              title={mode}
            >
              {icon}
            </button>
          ))}
        </div>
      )}
    </motion.aside>
  );
}

export default memo(Controls);
