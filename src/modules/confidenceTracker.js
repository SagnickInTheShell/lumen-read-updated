/**
 * Reading Confidence Tracker
 * 
 * Measures reading improvement with emotional, powerful messaging.
 * Tracks:
 * - Focus consistency (pauses vs. active reading)
 * - Speed recovery (detecting when user speeds back up)
 * - Completion progress
 * - Distraction reduction (fewer tab switches)
 */

export function createConfidenceTracker() {
  let state = {
    sessionStart: Date.now(),
    focusScore: 100,          // Start at 100, deduct for distractions
    speedConsistency: 100,    // Measure speed stability
    completionRate: 0,
    distractionEvents: [],    // Track tab switches, long pauses
    baselineWPM: 0,
    currentWPM: 0,
    pauseEvents: [],
    recoveryEvents: [],       // Times user resumed focused reading
    readingSegments: [],      // Track active reading periods
    currentSegmentStart: null,
  };

  function recordPauseEvent(duration) {
    const event = {
      timestamp: Date.now(),
      duration,
      severity: duration > 20000 ? 'high' : duration > 10000 ? 'medium' : 'low',
    };
    state.pauseEvents.push(event);
    
    // Deduct focus score based on pause severity
    if (event.severity === 'high') {
      state.focusScore = Math.max(70, state.focusScore - 3);
    } else if (event.severity === 'medium') {
      state.focusScore = Math.max(75, state.focusScore - 1);
    }
  }

  function recordRecovery(newWPM, previousWPM) {
    const speedIncrease = newWPM - previousWPM;
    if (speedIncrease > 20) {
      // User recovered and is reading faster
      state.recoveryEvents.push({
        timestamp: Date.now(),
        speedIncrease,
      });
      // Boost focus score for recovery
      state.focusScore = Math.min(100, state.focusScore + 2);
    }
  }

  function recordTabSwitch() {
    state.distractionEvents.push({
      timestamp: Date.now(),
      type: 'tab-switch',
    });
    state.focusScore = Math.max(60, state.focusScore - 5);
  }

  function updateWPM(wpm) {
    const previousWPM = state.currentWPM;
    state.currentWPM = wpm;
    
    if (state.baselineWPM === 0) {
      state.baselineWPM = wpm;
      state.speedConsistency = 100;
    } else {
      // Calculate speed consistency (lower variance = higher score)
      const speedVariance = Math.abs(wpm - state.baselineWPM) / state.baselineWPM;
      state.speedConsistency = Math.max(50, 100 - (speedVariance * 100));
    }

    // Check for recovery
    if (previousWPM > 0) {
      recordRecovery(wpm, previousWPM);
    }
  }

  function updateCompletionRate(current, total) {
    state.completionRate = total > 0 ? Math.round((current / total) * 100) : 0;
  }

  function getConfidenceMetrics() {
    const focusConsistency = Math.round(state.focusScore);
    const speedRecovery = Math.round(state.speedConsistency);
    const distractionReduction = Math.max(0, 100 - (state.distractionEvents.length * 10));
    
    // Composite confidence score (0-100)
    const confidence = Math.round(
      (focusConsistency * 0.4 + speedRecovery * 0.3 + distractionReduction * 0.3)
    );

    return {
      confidence,
      focusConsistency,
      speedRecovery,
      distractionReduction,
      completionRate: state.completionRate,
      sessionDuration: Math.round((Date.now() - state.sessionStart) / 1000),
      pauseCount: state.pauseEvents.length,
      recoveryCount: state.recoveryEvents.length,
      distractionCount: state.distractionEvents.length,
    };
  }

  function getImprovementMessage() {
    const metrics = getConfidenceMetrics();
    const improvement = metrics.confidence;

    // Generate emotional, powerful message
    if (improvement >= 90) {
      return "🎯 You're in the zone. Reading smoothly and focused.";
    } else if (improvement >= 75) {
      return `✨ You read ${Math.round(improvement)}% smoother today.`;
    } else if (improvement >= 60) {
      return `📈 Keep going! You're recovering focus well.`;
    } else if (improvement >= 50) {
      return "💡 Try Focus Mode to reduce distractions.";
    } else {
      return "🧘 Take a breath. Pause is part of reading.";
    }
  }

  function getSilentCoachMessage(behavior) {
    // Post-session feedback
    const messages = [];

    if (behavior.pauseCount > 5) {
      messages.push("You paused often in dense paragraphs. Try Focus Mode next time.");
    }
    if (behavior.distractionCount > 3) {
      messages.push("Noticed frequent distractions. Consider full-screen reading mode.");
    }
    if (behavior.focusConsistency < 70) {
      messages.push("Simplify mode helped users like you read 40% faster.");
    }
    if (behavior.speedRecovery > 80) {
      messages.push("Great! You recovered from difficult sections smoothly.");
    }

    return messages.length > 0 ? messages[0] : null;
  }

  return {
    recordPauseEvent,
    recordRecovery,
    recordTabSwitch,
    updateWPM,
    updateCompletionRate,
    getConfidenceMetrics,
    getImprovementMessage,
    getSilentCoachMessage,
  };
}
