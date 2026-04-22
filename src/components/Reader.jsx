'use client';

import { memo, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReading } from '@/context/ReadingContext';
import { useReadingBehavior } from '@/hooks/useReadingBehavior';
import { useEyeTracking } from '@/hooks/useEyeTracking';
import { simplifyText } from '@/modules/simplifier';
import sampleContent from '@/data/sampleContent';

/**
 * Paragraph — Single paragraph block with IntersectionObserver tracking.
 */
const Paragraph = memo(function Paragraph({
  paragraph,
  index,
  isActive,
  isAudioHighlight,
  isGazeHighlight,
  showSimplified,
  onVisible,
  onHidden,
  registerEyeTracking,
}) {
  const ref = useRef(null);
  const observerRef = useRef(null);

  // IntersectionObserver for visibility tracking
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          onVisible(paragraph.id, paragraph.wordCount);
        } else {
          onHidden(paragraph.id);
        }
      },
      { threshold: 0.5 }
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [paragraph.id, paragraph.wordCount, onVisible, onHidden]);

  // Register with eye tracking
  useEffect(() => {
    const element = ref.current;
    if (element && registerEyeTracking) {
      registerEyeTracking(paragraph.id, element);
    }
  }, [paragraph.id, registerEyeTracking]);

  // Compute display text
  const displayText = useMemo(() => {
    if (showSimplified) {
      return simplifyText(paragraph.text);
    }
    return paragraph.text;
  }, [paragraph.text, showSimplified]);

  const classNames = [
    'reading-paragraph',
    isActive ? 'focus-active' : '',
    isAudioHighlight ? 'audio-highlight' : '',
    isGazeHighlight ? 'gaze-highlight' : '',
  ].filter(Boolean).join(' ');

  return (
    <motion.div
      ref={ref}
      id={`paragraph-${paragraph.id}`}
      className={classNames}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
    >
      {showSimplified && (
        <div className="simplified-badge">
          <span>✦</span> Simplified View
        </div>
      )}
      <p className="reading-text">{displayText}</p>
    </motion.div>
  );
});

/**
 * Reader — Main reading engine component.
 */
function Reader() {
  const { state, dispatch, setParagraphIndex } = useReading();
  const contentRef = useRef(null);
  const { onParagraphVisible, onParagraphHidden } = useReadingBehavior();
  const { registerParagraph } = useEyeTracking();

  const paragraphs = sampleContent.paragraphs;

  // Set total paragraphs on mount
  useEffect(() => {
    dispatch({ type: 'SET_TOTAL_PARAGRAPHS', payload: paragraphs.length });
  }, [paragraphs.length, dispatch]);

  // Restore scroll position on mount
  useEffect(() => {
    if (state.lastReadPosition != null && state.lastReadPosition > 0) {
      const targetId = paragraphs[state.lastReadPosition]?.id;
      if (targetId) {
        setTimeout(() => {
          const el = document.getElementById(`paragraph-${targetId}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 500);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update current paragraph based on scroll (non-focus mode)
  useEffect(() => {
    if (state.focusMode) return;

    const handleScroll = () => {
      const viewportCenter = window.innerHeight / 2;
      let closestIndex = 0;
      let closestDist = Infinity;

      paragraphs.forEach((p, i) => {
        const el = document.getElementById(`paragraph-${p.id}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          const dist = Math.abs(rect.top + rect.height / 2 - viewportCenter);
          if (dist < closestDist) {
            closestDist = dist;
            closestIndex = i;
          }
        }
      });

      setParagraphIndex(closestIndex);
    };

    const throttled = throttle(handleScroll, 300);
    window.addEventListener('scroll', throttled, { passive: true });
    return () => window.removeEventListener('scroll', throttled);
  }, [state.focusMode, paragraphs, setParagraphIndex]);

  // Scroll to active paragraph in focus mode
  useEffect(() => {
    if (state.focusMode) {
      const targetId = paragraphs[state.currentParagraphIndex]?.id;
      if (targetId) {
        const el = document.getElementById(`paragraph-${targetId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }, [state.focusMode, state.currentParagraphIndex, paragraphs]);

  const registerEyeTrackingCallback = useCallback((id, element) => {
    if (state.eyeTracking) {
      registerParagraph(id, element);
    }
  }, [state.eyeTracking, registerParagraph]);

  // Determine audio highlight — which paragraph contains the current sentence
  const audioHighlightIndex = useMemo(() => {
    if (!state.audioMode || state.currentSentenceIndex < 0) return -1;

    let sentenceCount = 0;
    for (let i = 0; i < paragraphs.length; i++) {
      sentenceCount += paragraphs[i].sentences.length;
      if (state.currentSentenceIndex < sentenceCount) {
        return i;
      }
    }
    return -1;
  }, [state.audioMode, state.currentSentenceIndex, paragraphs]);

  // Gaze highlight index
  const gazeHighlightIndex = useMemo(() => {
    if (!state.eyeTracking || !state.gazeNearestParagraph) return -1;
    return paragraphs.findIndex(p => p.id === state.gazeNearestParagraph);
  }, [state.eyeTracking, state.gazeNearestParagraph, paragraphs]);

  return (
    <div
      ref={contentRef}
      className={`reading-content transition-colors duration-300 min-h-screen ${
        state.focusMode ? 'focus-mode' : ''
      }`}
    >
      {/* Title */}
      <div className="reading-column pt-8 pb-2">
        <motion.h1
          className="text-2xl md:text-3xl font-bold text-lumen-text mb-2 leading-tight"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {sampleContent.title}
        </motion.h1>
        <motion.p
          className="text-sm text-lumen-text-secondary mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          By {sampleContent.author} · {paragraphs.reduce((s, p) => s + p.wordCount, 0)} words · 
          ~{Math.ceil(paragraphs.reduce((s, p) => s + p.estimatedReadingTime, 0) / 60)} min read
        </motion.p>
      </div>

      {/* Paragraphs */}
      <div className="reading-column pb-24">
        <AnimatePresence mode="sync">
          {paragraphs.map((paragraph, index) => (
            <Paragraph
              key={paragraph.id}
              paragraph={paragraph}
              index={index}
              isActive={state.focusMode && index === state.currentParagraphIndex}
              isAudioHighlight={index === audioHighlightIndex}
              isGazeHighlight={index === gazeHighlightIndex}
              showSimplified={state.simplifyMode}
              onVisible={onParagraphVisible}
              onHidden={onParagraphHidden}
              registerEyeTracking={registerEyeTrackingCallback}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Utility: throttle
function throttle(fn, ms) {
  let timer = null;
  return function (...args) {
    if (timer) return;
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, ms);
  };
}

export default memo(Reader);
