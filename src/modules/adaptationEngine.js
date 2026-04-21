/**
 * Adaptation Engine Module
 * 
 * Priority-based rule engine for contextual suggestions.
 * Only one suggestion at a time. Cooldown enforced.
 * Contextual messages with reasoning.
 */

const COOLDOWN_MS = 45000;                // 45 seconds between any suggestion
const PER_SUGGESTION_COOLDOWN_MS = 120000; // 2 minutes for same type
const SESSION_SUGGESTION_LIMIT = 3;
const SESSION_RESET_MS = 600000;           // 10 minutes resets counter

const SUGGESTIONS = {
  longPause: {
    id: 'suggest-focus',
    mode: 'focusMode',
    message: "You seem to be pausing often. Try Focus Mode to reduce distractions.",
    reason: 'longPause',
    priority: 1,
  },
  slowReading: {
    id: 'suggest-simplify',
    mode: 'simplifyMode',
    message: "This section might be complex. Would you like to simplify the text?",
    reason: 'slowReading',
    priority: 2,
  },
  reReading: {
    id: 'suggest-audio',
    mode: 'audioMode',
    message: "You're re-reading this section. Listening along might help — try Audio Mode.",
    reason: 'reReading',
    priority: 3,
  },
};

export function createAdaptationEngine() {
  let state = {
    lastSuggestionTime: 0,
    suggestionCountThisSession: 0,
    lastSuggestionByType: {},  // { reason: timestamp }
    sessionStartTime: Date.now(),
    activeSuggestion: null,
    dismissed: new Set(),
  };

  /**
   * Evaluate behavior flags and return a suggestion (or null).
   * @param {Object} behavior - from behaviorTracker.getState()
   * @param {Object} activeModes - currently active modes { focusMode, simplifyMode, audioMode, ... }
   * @returns {{ suggestion: Object|null, canSuggest: boolean }}
   */
  function evaluate(behavior, activeModes = {}) {
    const now = Date.now();

    // Check session reset
    if (now - state.sessionStartTime > SESSION_RESET_MS) {
      state.suggestionCountThisSession = 0;
      state.sessionStartTime = now;
      state.dismissed.clear();
    }

    // Check if we can suggest at all
    const timeSinceLastSuggestion = now - state.lastSuggestionTime;
    const canSuggest = (
      timeSinceLastSuggestion >= COOLDOWN_MS &&
      state.suggestionCountThisSession < SESSION_SUGGESTION_LIMIT &&
      state.activeSuggestion === null
    );

    if (!canSuggest) {
      return { suggestion: state.activeSuggestion, canSuggest: false };
    }

    // Priority-ordered checks
    const triggers = [
      { condition: behavior.isPaused, key: 'longPause' },
      { condition: behavior.isSlowReading, key: 'slowReading' },
      { condition: behavior.isReReading, key: 'reReading' },
    ];

    for (const trigger of triggers) {
      if (!trigger.condition) continue;

      const suggestion = SUGGESTIONS[trigger.key];

      // Skip if target mode already active
      if (activeModes[suggestion.mode]) continue;

      // Skip if this type was suggested recently
      const lastTime = state.lastSuggestionByType[trigger.key] || 0;
      if (now - lastTime < PER_SUGGESTION_COOLDOWN_MS) continue;

      // Skip if previously dismissed this type in this session
      if (state.dismissed.has(trigger.key)) continue;

      // Fire suggestion
      state.activeSuggestion = { ...suggestion };
      state.lastSuggestionTime = now;
      state.lastSuggestionByType[trigger.key] = now;
      state.suggestionCountThisSession++;

      return { suggestion: state.activeSuggestion, canSuggest: true };
    }

    return { suggestion: null, canSuggest: true };
  }

  /**
   * Called when user accepts the suggestion.
   */
  function acceptSuggestion() {
    const accepted = state.activeSuggestion;
    state.activeSuggestion = null;
    return accepted;
  }

  /**
   * Called when user dismisses the suggestion.
   */
  function dismissSuggestion() {
    if (state.activeSuggestion) {
      state.dismissed.add(state.activeSuggestion.reason);
    }
    state.activeSuggestion = null;
  }

  /**
   * Auto-dismiss (e.g., after timeout).
   */
  function clearSuggestion() {
    state.activeSuggestion = null;
  }

  function getState() {
    return {
      activeSuggestion: state.activeSuggestion,
      suggestionCount: state.suggestionCountThisSession,
      canSuggest: state.activeSuggestion === null && state.suggestionCountThisSession < SESSION_SUGGESTION_LIMIT,
    };
  }

  function reset() {
    state = {
      lastSuggestionTime: 0,
      suggestionCountThisSession: 0,
      lastSuggestionByType: {},
      sessionStartTime: Date.now(),
      activeSuggestion: null,
      dismissed: new Set(),
    };
  }

  return {
    evaluate,
    acceptSuggestion,
    dismissSuggestion,
    clearSuggestion,
    getState,
    reset,
  };
}
