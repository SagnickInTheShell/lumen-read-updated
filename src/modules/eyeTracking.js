/**
 * Eye Tracking Module
 * 
 * WebGazer.js wrapper for paragraph-level gaze tracking.
 * Dynamically loads WebGazer only when enabled.
 * Paragraph-level mapping (not line-level) for reliability.
 */

const WEBGAZER_CDN = 'https://webgazer.cs.brown.edu/webgazer.js';
const LOOK_AWAY_THRESHOLD_MS = 3000; // 3 seconds

export function createEyeTracking() {
  let webgazer = null;
  let isActive = false;
  let isCalibrated = false;
  let gazeY = null;
  let nearestParagraphId = null;
  let isLookingAway = false;
  let lookAwayTimer = null;
  let paragraphElements = new Map(); // id → element
  let onGazeCallback = null;
  let onLookAwayCallback = null;
  let scriptLoaded = false;

  /**
   * Dynamically load WebGazer.js
   */
  async function loadWebGazer() {
    if (scriptLoaded || typeof window === 'undefined') return false;

    return new Promise((resolve) => {
      // Check if already loaded
      if (window.webgazer) {
        scriptLoaded = true;
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = WEBGAZER_CDN;
      script.async = true;
      script.onload = () => {
        scriptLoaded = true;
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.head.appendChild(script);
    });
  }

  /**
   * Initialize eye tracking.
   */
  async function initialize(onGaze, onLookAway) {
    onGazeCallback = onGaze;
    onLookAwayCallback = onLookAway;

    const loaded = await loadWebGazer();
    if (!loaded || !window.webgazer) {
      return { success: false, error: 'WebGazer failed to load' };
    }

    try {
      webgazer = window.webgazer;
      
      await webgazer
        .setGazeListener((data) => {
          if (!data || !isActive) return;

          gazeY = data.y;
          const x = data.x;

          // Check if looking away (outside viewport)
          const inViewport = (
            x >= 0 && x <= window.innerWidth &&
            data.y >= 0 && data.y <= window.innerHeight
          );

          if (!inViewport) {
            if (!lookAwayTimer) {
              lookAwayTimer = setTimeout(() => {
                isLookingAway = true;
                if (onLookAwayCallback) onLookAwayCallback(true);
              }, LOOK_AWAY_THRESHOLD_MS);
            }
          } else {
            if (lookAwayTimer) {
              clearTimeout(lookAwayTimer);
              lookAwayTimer = null;
            }
            if (isLookingAway) {
              isLookingAway = false;
              if (onLookAwayCallback) onLookAwayCallback(false);
            }

            // Map gaze to nearest paragraph
            updateNearestParagraph(data.y);
          }
        })
        .saveDataAcrossSessions(false)
        .begin();

      // Hide default video feed (we'll handle UI ourselves)
      const videoEl = document.getElementById('webgazerVideoFeed');
      if (videoEl) videoEl.style.display = 'none';
      const faceOverlay = document.getElementById('webgazerFaceOverlay');
      if (faceOverlay) faceOverlay.style.display = 'none';
      const faceFeedback = document.getElementById('webgazerFaceFeedbackBox');
      if (faceFeedback) faceFeedback.style.display = 'none';
      const gazeDot = document.getElementById('webgazerGazeDot');
      if (gazeDot) gazeDot.style.display = 'none';

      isActive = true;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Camera access denied' };
    }
  }

  /**
   * Map Y coordinate to nearest paragraph element.
   */
  function updateNearestParagraph(y) {
    let closest = null;
    let closestDist = Infinity;

    for (const [id, element] of paragraphElements) {
      const rect = element.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      const dist = Math.abs(y - centerY);

      if (dist < closestDist) {
        closestDist = dist;
        closest = id;
      }
    }

    if (closest && closest !== nearestParagraphId) {
      nearestParagraphId = closest;
      if (onGazeCallback) onGazeCallback(closest);
    }
  }

  /**
   * Register a paragraph element for gaze mapping.
   */
  function registerParagraph(id, element) {
    paragraphElements.set(id, element);
  }

  /**
   * Unregister a paragraph element.
   */
  function unregisterParagraph(id) {
    paragraphElements.delete(id);
  }

  /**
   * Mark calibration as done.
   */
  function setCalibrated() {
    isCalibrated = true;
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('lumen-eye-calibrated', 'true');
    }
  }

  /**
   * Check if calibration was done this session.
   */
  function wasCalibrated() {
    if (isCalibrated) return true;
    if (typeof sessionStorage !== 'undefined') {
      return sessionStorage.getItem('lumen-eye-calibrated') === 'true';
    }
    return false;
  }

  /**
   * Stop tracking.
   */
  function stop() {
    isActive = false;
    if (lookAwayTimer) {
      clearTimeout(lookAwayTimer);
      lookAwayTimer = null;
    }
    if (webgazer) {
      try {
        webgazer.pause();
      } catch (e) {
        // Ignore
      }
    }
  }

  /**
   * Resume tracking.
   */
  function resume() {
    if (webgazer) {
      try {
        webgazer.resume();
        isActive = true;
      } catch (e) {
        // Ignore
      }
    }
  }

  /**
   * Fully destroy and clean up.
   */
  function destroy() {
    stop();
    if (webgazer) {
      try {
        webgazer.end();
      } catch (e) {
        // Ignore
      }
    }
    paragraphElements.clear();
    webgazer = null;
  }

  function getState() {
    return {
      isActive,
      isCalibrated: wasCalibrated(),
      gazeY,
      nearestParagraphId,
      isLookingAway,
    };
  }

  return {
    initialize,
    registerParagraph,
    unregisterParagraph,
    setCalibrated,
    wasCalibrated,
    stop,
    resume,
    destroy,
    getState,
  };
}
