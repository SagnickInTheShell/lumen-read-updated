/**
 * Gesture Control Module (MediaPipe Hands)
 * 
 * Uses the webcam to detect hand movements:
 * - Swipe Left (Index finger moves left across screen)
 * - Swipe Right (Index finger moves right across screen)
 * - Pinch (Index and Thumb tips meet)
 */

const MEDIAPIPE_HANDS = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js';
const MEDIAPIPE_CAMERA = 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js';

export function createGestureControl() {
  let isActive = false;
  let gestureCallback = null;
  let handsModel = null;
  let camera = null;
  let videoElement = null;
  let scriptLoaded = false;
  let lastGestureTime = 0;
  const GESTURE_COOLDOWN = 1000; // 1s cooldown between gestures

  // Swipe tracking
  let pointerHistory = [];
  const HISTORY_SIZE = 10;
  const SWIPE_VELOCITY_THRESHOLD = 0.05; // Normalized screen distance / frame

  async function loadScripts() {
    if (scriptLoaded || typeof window === 'undefined') return true;

    return new Promise((resolve) => {
      if (window.Hands && window.Camera) {
        scriptLoaded = true;
        return resolve(true);
      }

      const loadScript = (src) => new Promise((res, rej) => {
        const s = document.createElement('script');
        s.src = src;
        s.crossOrigin = 'anonymous';
        s.onload = res;
        s.onerror = rej;
        document.head.appendChild(s);
      });

      Promise.all([loadScript(MEDIAPIPE_CAMERA), loadScript(MEDIAPIPE_HANDS)])
        .then(() => {
          scriptLoaded = true;
          resolve(true);
        })
        .catch(() => resolve(false));
    });
  }

  async function initialize(onGesture) {
    gestureCallback = onGesture;
    const loaded = await loadScripts();
    if (!loaded) return { success: false, error: 'Failed to load MediaPipe' };
    return { success: true };
  }

  async function start() {
    if (isActive || !window.Hands || !window.Camera) return;

    try {
      videoElement = document.createElement('video');
      videoElement.style.display = 'none';
      document.body.appendChild(videoElement);

      handsModel = new window.Hands({locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }});

      handsModel.setOptions({
        maxNumHands: 1,
        modelComplexity: 0,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.5
      });

      handsModel.onResults(onResults);

      camera = new window.Camera(videoElement, {
        onFrame: async () => {
          if (isActive && handsModel) {
            await handsModel.send({image: videoElement});
          }
        },
        width: 640,
        height: 480
      });

      isActive = true;
      camera.start();
    } catch (err) {
      console.error('Gesture Camera Error:', err);
    }

    return stop;
  }

  function onResults(results) {
    if (!isActive || !results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      pointerHistory = [];
      return;
    }

    const landmarks = results.multiHandLandmarks[0];
    const indexTip = landmarks[8];
    const thumbTip = landmarks[4];
    const now = Date.now();

    // 1. Detect Pinch (Toggle Focus Mode)
    const pinchDist = Math.hypot(indexTip.x - thumbTip.x, indexTip.y - thumbTip.y);
    if (pinchDist < 0.05 && (now - lastGestureTime) > GESTURE_COOLDOWN) {
      lastGestureTime = now;
      if (gestureCallback) gestureCallback('pinch');
      pointerHistory = [];
      return;
    }

    // 2. Track Index Tip for swipes
    pointerHistory.push(indexTip);
    if (pointerHistory.length > HISTORY_SIZE) {
      pointerHistory.shift();
    }

    if (pointerHistory.length === HISTORY_SIZE && (now - lastGestureTime) > GESTURE_COOLDOWN) {
      const first = pointerHistory[0];
      const last = pointerHistory[HISTORY_SIZE - 1];

      const dx = last.x - first.x;
      const dy = last.y - first.y;

      if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe
        // Note: Camera feed is usually mirrored. x increases to the right of the image, 
        // which means the user moving their hand to their right.
        if (dx < -SWIPE_VELOCITY_THRESHOLD) {
          lastGestureTime = now;
          if (gestureCallback) gestureCallback('swipe_left');
        } else if (dx > SWIPE_VELOCITY_THRESHOLD) {
          lastGestureTime = now;
          if (gestureCallback) gestureCallback('swipe_right');
        }
      } else {
        // Vertical Swipe (Scrolling)
        if (dy < -SWIPE_VELOCITY_THRESHOLD) {
          lastGestureTime = now;
          if (gestureCallback) gestureCallback('swipe_up');
        } else if (dy > SWIPE_VELOCITY_THRESHOLD) {
          lastGestureTime = now;
          if (gestureCallback) gestureCallback('swipe_down');
        }
      }
    }
  }

  function stop() {
    isActive = false;
    if (camera) {
      camera.stop();
      camera = null;
    }
    if (handsModel) {
      handsModel.close();
      handsModel = null;
    }
    if (videoElement) {
      videoElement.remove();
      videoElement = null;
    }
    pointerHistory = [];
  }

  function destroy() {
    stop();
    gestureCallback = null;
  }

  return { initialize, start, stop, destroy, isSupported: () => true };
}
