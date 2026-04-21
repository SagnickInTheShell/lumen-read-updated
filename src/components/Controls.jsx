'use client';

import { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReading } from '@/context/ReadingContext';
import ModeToggle from './ModeToggle';

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
  const [speechSupported, setSpeechSupported] = useState(true);
  const [recognitionSupported, setRecognitionSupported] = useState(true);

  useEffect(() => {
    setSpeechSupported('speechSynthesis' in window);
    setRecognitionSupported(!!(window.SpeechRecognition || window.webkitSpeechRecognition));
  }, []);

  return (
    <motion.aside
      className={`
        fixed left-0 top-0 h-full z-40
        bg-lumen-bg/95 backdrop-blur-sm border-r border-lumen-border
        flex flex-col
        transition-all duration-300
        ${isCollapsed ? 'w-14' : 'w-64'}
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
            {/* Reading Modes */}
            <div>
              <h3 className="text-[0.65rem] font-semibold uppercase tracking-widest text-lumen-text-secondary mb-2 px-1">
                Reading Modes
              </h3>
              <div className="space-y-1">
                <ModeToggle
                  label="Focus Mode"
                  icon="🧠"
                  isActive={state.focusMode}
                  onToggle={() => toggleMode('focusMode')}
                />
                <ModeToggle
                  label="Dyslexia Mode"
                  icon="🧬"
                  isActive={state.dyslexiaMode}
                  onToggle={() => toggleMode('dyslexiaMode')}
                />
                <ModeToggle
                  label="Simplify Text"
                  icon="📚"
                  isActive={state.simplifyMode}
                  onToggle={() => toggleMode('simplifyMode')}
                />
                <ModeToggle
                  label="High Contrast"
                  icon="🌗"
                  isActive={state.highContrastMode}
                  onToggle={() => toggleMode('highContrastMode')}
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
