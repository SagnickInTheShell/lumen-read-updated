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

  let canvasElement = null;
  let canvasCtx = null;

  async function start() {
    if (isActive || !window.Hands || !window.Camera) return;

    try {
      videoElement = document.createElement('video');
      videoElement.style.position = 'absolute';
      videoElement.style.opacity = '0'; // keep it playing but hidden
      videoElement.style.width = '320px';
      videoElement.style.height = '240px';
      videoElement.playsInline = true;
      document.body.appendChild(videoElement);

      // Create a small feedback canvas in the corner
      canvasElement = document.createElement('canvas');
      canvasElement.width = 320;
      canvasElement.height = 240;
      canvasElement.style.position = 'fixed';
      canvasElement.style.bottom = '20px';
      canvasElement.style.right = '20px';
      canvasElement.style.zIndex = '9999';
      canvasElement.style.borderRadius = '12px';
      canvasElement.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      canvasElement.style.backgroundColor = '#000';
      canvasElement.style.transform = 'scaleX(-1)'; // mirror user
      document.body.appendChild(canvasElement);
      canvasCtx = canvasElement.getContext('2d');

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
        width: 320,
        height: 240
      });

      isActive = true;
      camera.start();
    } catch (err) {
      console.error('Gesture Camera Error:', err);
    }

    return stop;
  }

  function onResults(results) {
    if (!isActive) return;

    // Draw visual feedback
    if (canvasCtx && canvasElement) {
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      if (results.image) {
        canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
      }
      
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        for (const landmarks of results.multiHandLandmarks) {
          // Draw points with small colored circles
          for (const point of landmarks) {
            canvasCtx.beginPath();
            canvasCtx.arc(point.x * canvasElement.width, point.y * canvasElement.height, 4, 0, 2 * Math.PI);
            canvasCtx.fillStyle = '#ffc107'; // lumen accent
            canvasCtx.fill();
            canvasCtx.closePath();
          }
        }
      }
      canvasCtx.restore();
    }

    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      pointerHistory = [];
      return;
    }

    const landmarks = results.multiHandLandmarks[0];
    const indexTip = landmarks[8];
    const thumbTip = landmarks[4];
    const now = Date.now();

    // Remove pinch tracking

    // Helper to detect if hand is open (all fingers extended upwards)
    const isOpenPalm = (lm) => {
      const fingers = [
        { tip: 8, joint: 6 },   // Index
        { tip: 12, joint: 10 }, // Middle
        { tip: 16, joint: 14 }, // Ring
        { tip: 20, joint: 18 }  // Pinky
      ];
      return fingers.every(f => lm[f.tip].y < lm[f.joint].y);
    };

    // Calculate pinch between thumb and index
    const pinchDist = Math.hypot(indexTip.x - thumbTip.x, indexTip.y - thumbTip.y);
    const isPinched = pinchDist < 0.06; // slightly forgiving pinch threshold

    // Continuous Joystick Scrolling for Y axis
    // ONLY when thumb and index are pinched together!
    // Top 40% = scroll up, Bottom 40% = scroll down (expanded grab zones)
    if (isPinched && (now - lastGestureTime) > 300) {
      // Map based on the center of the pinch
      const pinchY = (indexTip.y + thumbTip.y) / 2;
      if (pinchY < 0.4) {
        if (gestureCallback) gestureCallback('scroll_up');
      } else if (pinchY > 0.6) {
        if (gestureCallback) gestureCallback('scroll_down');
      }
    }

    // 2. Track Index Tip for horizontal swipes ONLY if palm is open
    if (isOpenPalm(landmarks)) {
      pointerHistory.push(indexTip);
      if (pointerHistory.length > HISTORY_SIZE) {
        pointerHistory.shift();
      }

      if (pointerHistory.length === HISTORY_SIZE && (now - lastGestureTime) > GESTURE_COOLDOWN) {
        const first = pointerHistory[0];
        const last = pointerHistory[HISTORY_SIZE - 1];

        const dx = last.x - first.x;
        const dy = last.y - first.y;

        // Ensure movement is mostly horizontal, not a messy diagonal
        if (Math.abs(dx) > Math.abs(dy) * 1.5) {
          if (dx < -SWIPE_VELOCITY_THRESHOLD) {
            lastGestureTime = now;
            if (gestureCallback) gestureCallback('swipe_left');
            pointerHistory = []; // Reset to prevent multiple rapid triggers
          } else if (dx > SWIPE_VELOCITY_THRESHOLD) {
            lastGestureTime = now;
            if (gestureCallback) gestureCallback('swipe_right');
            pointerHistory = []; // Reset
          }
        }
      }
    } else {
      // If hand closes or relaxes, clear swipe history to prevent accidental triggers
      pointerHistory = [];
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
    if (canvasElement) {
      canvasElement.remove();
      canvasElement = null;
      canvasCtx = null;
    }
    pointerHistory = [];
  }

  function destroy() {
    stop();
    gestureCallback = null;
  }

  return { initialize, start, stop, destroy, isSupported: () => true };
}
