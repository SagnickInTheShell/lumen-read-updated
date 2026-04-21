/**
 * Behavior Tracker Module
 * 
 * Tracks reading behavior using IntersectionObserver-based visibility,
 * scroll analysis, and active reading detection.
 * 
 * All thresholds tuned for realistic demo behavior.
 */

const BASELINE_WPM = 200;
const SLOW_READING_THRESHOLD = 120;
const PAUSE_THRESHOLD_MS = 10000; // 10 seconds
const SCROLL_SPIKE_THRESHOLD = 5000; // px/s — ignore faster scrolls
const REREADING_SCROLL_PX = 200; // upward scroll threshold
const WPM_ROLLING_WINDOW = 3; // paragraphs for averaging

export function createBehaviorTracker() {
  let state = {
    visibleParagraphs: new Set(),
    paragraphTimers: {},       // { paragraphId: { startTime, totalTime, wordCount } }
    scrollHistory: [],         // [{ position, timestamp }]
    wpmHistory: [],            // rolling WPM values
    lastInteractionTime: Date.now(),
    isPaused: false,
    isReReading: false,
    isSlowReading: false,
    wpm: BASELINE_WPM,
    scrollDirection: 'idle',
    scrollVelocity: 0,
    activeReadingTime: 0,
    isTabVisible: true,
  };

  // --- Visibility tracking ---
  function onParagraphVisible(paragraphId, wordCount) {
    if (!state.isTabVisible) return;
    state.visibleParagraphs.add(paragraphId);
    if (!state.paragraphTimers[paragraphId]) {
      state.paragraphTimers[paragraphId] = {
        startTime: Date.now(),
        totalTime: 0,
        wordCount,
      };
    } else {
      state.paragraphTimers[paragraphId].startTime = Date.now();
    }
  }

  function onParagraphHidden(paragraphId) {
    const timer = state.paragraphTimers[paragraphId];
    if (timer && timer.startTime) {
      const elapsed = Date.now() - timer.startTime;
      timer.totalTime += elapsed;
      timer.startTime = null;

      // Calculate WPM for this paragraph
      const minutes = timer.totalTime / 60000;
      if (minutes > 0.01) { // at least ~0.6 seconds
        const paragraphWPM = Math.round(timer.wordCount / minutes);
        if (paragraphWPM > 0 && paragraphWPM < 1000) { // filter unrealistic values
          state.wpmHistory.push(paragraphWPM);
          if (state.wpmHistory.length > WPM_ROLLING_WINDOW) {
            state.wpmHistory.shift();
          }
          // Rolling average
          state.wpm = Math.round(
            state.wpmHistory.reduce((a, b) => a + b, 0) / state.wpmHistory.length
          );
        }
      }
    }
    state.visibleParagraphs.delete(paragraphId);
  }

  // --- Scroll tracking (throttled externally) ---
  function trackScroll(scrollY) {
    const now = Date.now();
    state.lastInteractionTime = now;
    state.isPaused = false;

    state.scrollHistory.push({ position: scrollY, timestamp: now });
    // Keep last 5 entries
    if (state.scrollHistory.length > 5) {
      state.scrollHistory.shift();
    }

    // Compute direction and velocity from last 2 entries
    if (state.scrollHistory.length >= 2) {
      const prev = state.scrollHistory[state.scrollHistory.length - 2];
      const curr = state.scrollHistory[state.scrollHistory.length - 1];
      const deltaY = curr.position - prev.position;
      const deltaT = (curr.timestamp - prev.timestamp) / 1000; // seconds

      if (deltaT > 0) {
        state.scrollVelocity = Math.abs(deltaY / deltaT);

        // If scroll is too fast, ignore (spike)
        if (state.scrollVelocity > SCROLL_SPIKE_THRESHOLD) {
          return getState();
        }

        state.scrollDirection = deltaY > 5 ? 'down' : deltaY < -5 ? 'up' : 'idle';
      }
    }

    // Re-reading detection: significant upward scroll
    if (state.scrollHistory.length >= 3) {
      const recent = state.scrollHistory.slice(-3);
      const totalUpward = recent.reduce((sum, entry, i) => {
        if (i === 0) return 0;
        const delta = entry.position - recent[i - 1].position;
        return delta < 0 ? sum + Math.abs(delta) : sum;
      }, 0);
      
      const timeSpan = (recent[recent.length - 1].timestamp - recent[0].timestamp) / 1000;
      state.isReReading = totalUpward >= REREADING_SCROLL_PX && timeSpan < 2;
    }

    // Slow reading detection
    state.isSlowReading = state.wpm < SLOW_READING_THRESHOLD && state.wpmHistory.length >= 2;

    return getState();
  }

  // --- Pause detection (called on interval) ---
  function checkPause() {
    const elapsed = Date.now() - state.lastInteractionTime;
    state.isPaused = elapsed >= PAUSE_THRESHOLD_MS;
    return state.isPaused;
  }

  // --- Tab visibility ---
  function setTabVisible(visible) {
    state.isTabVisible = visible;
    if (!visible) {
      // Pause all active paragraph timers
      for (const id of state.visibleParagraphs) {
        const timer = state.paragraphTimers[id];
        if (timer && timer.startTime) {
          timer.totalTime += Date.now() - timer.startTime;
          timer.startTime = null;
        }
      }
    } else {
      // Resume timers
      for (const id of state.visibleParagraphs) {
        const timer = state.paragraphTimers[id];
        if (timer) {
          timer.startTime = Date.now();
        }
      }
      state.lastInteractionTime = Date.now();
    }
  }

  // --- Register interaction (any user action resets pause) ---
  function registerInteraction() {
    state.lastInteractionTime = Date.now();
    state.isPaused = false;
  }

  // --- Get current state snapshot ---
  function getState() {
    return {
      wpm: state.wpm,
      isPaused: state.isPaused,
      isReReading: state.isReReading,
      isSlowReading: state.isSlowReading,
      scrollDirection: state.scrollDirection,
      scrollVelocity: state.scrollVelocity,
      activeReadingTime: state.activeReadingTime,
      visibleParagraphCount: state.visibleParagraphs.size,
    };
  }

  // --- Reset ---
  function reset() {
    state.wpmHistory = [];
    state.scrollHistory = [];
    state.paragraphTimers = {};
    state.visibleParagraphs.clear();
    state.wpm = BASELINE_WPM;
    state.isPaused = false;
    state.isReReading = false;
    state.isSlowReading = false;
  }

  return {
    onParagraphVisible,
    onParagraphHidden,
    trackScroll,
    checkPause,
    setTabVisible,
    registerInteraction,
    getState,
    reset,
    PAUSE_THRESHOLD_MS,
  };
}
