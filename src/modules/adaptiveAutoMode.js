/**
 * Adaptive Auto Mode System
 * 
 * The signature "wow" feature: automatically adapts reading parameters
 * in real time based on behavior detection.
 * 
 * Adjusts:
 * - Font spacing (increases if slow reading detected)
 * - Line highlighting (current line focus)
 * - Reading width (narrows to reduce visual load)
 * - Contrast (switches dark/light based on comfort)
 * - Suggests summaries after difficult paragraphs
 */

export function createAdaptiveAutoMode() {
  let state = {
    isActive: false,
    currentProfile: 'balanced',
    spacing: 1.85,           // line-height
    letterSpacing: 0.01,    // em
    readingWidth: 680,      // px
    contrast: 'light',
    highlightCurrentLine: false,
    autoSimplify: false,
    autoNarration: false,

    // Behavioral thresholds
    slowReadingThreshold: 120,
    fastReadingThreshold: 280,
  };

  const profiles = {
    balanced: {
      spacing: 1.85,
      letterSpacing: 0.01,
      readingWidth: 680,
      contrast: 'light',
      highlightCurrentLine: true,
      autoSimplify: false,
      autoNarration: false,
    },
    challenging: {
      spacing: 2.2,
      letterSpacing: 0.05,
      readingWidth: 580,
      contrast: 'light',
      highlightCurrentLine: true,
      autoSimplify: true,
      autoNarration: false,
    },
    difficult: {
      spacing: 2.5,
      letterSpacing: 0.08,
      readingWidth: 500,
      contrast: 'dark',
      highlightCurrentLine: true,
      autoSimplify: true,
      autoNarration: true,
    },
    fast: {
      spacing: 1.65,
      letterSpacing: 0,
      readingWidth: 750,
      contrast: 'light',
      highlightCurrentLine: false,
      autoSimplify: false,
      autoNarration: false,
    },
  };

  function activate() {
    state.isActive = true;
  }

  function deactivate() {
    state.isActive = false;
  }

  function updateBasedOnBehavior(wpm, isPaused, isSlowReading, isReReading) {
    if (!state.isActive) return null;

    let newProfile = 'balanced';

    // Determine profile based on behavior
    if (isReReading && isSlowReading) {
      newProfile = 'difficult';
    } else if (isSlowReading || isPaused) {
      newProfile = 'challenging';
    } else if (wpm > state.fastReadingThreshold) {
      newProfile = 'fast';
    }

    if (newProfile !== state.currentProfile) {
      applyProfile(newProfile);
      return {
        message: getProfileMessage(newProfile),
        profile: newProfile,
        change: true,
      };
    }

    return null;
  }

  function applyProfile(profileName) {
    state.currentProfile = profileName;
    const profile = profiles[profileName];

    if (!profile) return;

    state.spacing = profile.spacing;
    state.letterSpacing = profile.letterSpacing;
    state.readingWidth = profile.readingWidth;
    state.contrast = profile.contrast;
    state.highlightCurrentLine = profile.highlightCurrentLine;
    state.autoSimplify = profile.autoSimplify;
    state.autoNarration = profile.autoNarration;
  }

  function getProfileMessage(profileName) {
    const messages = {
      balanced: "Reading smoothly. Keeping it balanced.",
      challenging: "Dense section detected. Giving you more space.",
      difficult: "This is complex. Simplifying and highlighting for you.",
      fast: "You're flying through this. Giving you more room.",
    };
    return messages[profileName] || null;
  }

  function getCSS() {
    return {
      '--lumen-reading-line-height': state.spacing,
      '--lumen-reading-letter-spacing': `${state.letterSpacing}em`,
      '--lumen-content-width': `${state.readingWidth}px`,
    };
  }

  function getConfig() {
    return {
      spacing: state.spacing,
      letterSpacing: state.letterSpacing,
      readingWidth: state.readingWidth,
      contrast: state.contrast,
      highlightCurrentLine: state.highlightCurrentLine,
      autoSimplify: state.autoSimplify,
      autoNarration: state.autoNarration,
      profile: state.currentProfile,
      isActive: state.isActive,
    };
  }

  return {
    activate,
    deactivate,
    updateBasedOnBehavior,
    applyProfile,
    getProfileMessage,
    getConfig,
    getCSS,
  };
}
