/**
 * Gesture Control Module
 * 
 * Detects swipe gestures on the reading area using touch/mouse events.
 * Supports: swipe-left (next), swipe-right (previous), swipe-up (scroll up), swipe-down.
 */

const SWIPE_THRESHOLD = 80;  // minimum px for a swipe
const SWIPE_TIMEOUT = 300;   // max ms for a swipe gesture

export function createGestureControl() {
  let isActive = false;
  let gestureCallback = null;
  let startX = 0;
  let startY = 0;
  let startTime = 0;
  let touchMoveHandler = null;
  let touchStartHandler = null;
  let touchEndHandler = null;
  let mouseMoveHandler = null;
  let mouseDownHandler = null;
  let mouseUpHandler = null;
  let isMouseDown = false;

  function initialize(onGesture) {
    gestureCallback = onGesture;
    return { supported: true };
  }

  function start(element) {
    if (!element || isActive) return;
    isActive = true;

    // --- Touch events ---
    touchStartHandler = (e) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      startTime = Date.now();
    };

    touchEndHandler = (e) => {
      if (!startTime) return;
      const touch = e.changedTouches[0];
      detectSwipe(touch.clientX, touch.clientY);
    };

    // --- Mouse events (trackpad swipe simulation) ---
    mouseDownHandler = (e) => {
      isMouseDown = true;
      startX = e.clientX;
      startY = e.clientY;
      startTime = Date.now();
    };

    mouseUpHandler = (e) => {
      if (!isMouseDown) return;
      isMouseDown = false;
      detectSwipe(e.clientX, e.clientY);
    };

    element.addEventListener('touchstart', touchStartHandler, { passive: true });
    element.addEventListener('touchend', touchEndHandler, { passive: true });
    element.addEventListener('mousedown', mouseDownHandler);
    element.addEventListener('mouseup', mouseUpHandler);

    return () => stop(element);
  }

  function detectSwipe(endX, endY) {
    const elapsed = Date.now() - startTime;
    if (elapsed > SWIPE_TIMEOUT) return;

    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Determine primary direction
    if (absX > absY && absX > SWIPE_THRESHOLD) {
      const gesture = deltaX > 0 ? 'swipe_right' : 'swipe_left';
      if (gestureCallback) gestureCallback(gesture);
    } else if (absY > absX && absY > SWIPE_THRESHOLD) {
      const gesture = deltaY > 0 ? 'swipe_down' : 'swipe_up';
      if (gestureCallback) gestureCallback(gesture);
    }

    startTime = 0;
  }

  function stop(element) {
    isActive = false;
    if (element) {
      if (touchStartHandler) element.removeEventListener('touchstart', touchStartHandler);
      if (touchEndHandler) element.removeEventListener('touchend', touchEndHandler);
      if (mouseDownHandler) element.removeEventListener('mousedown', mouseDownHandler);
      if (mouseUpHandler) element.removeEventListener('mouseup', mouseUpHandler);
    }
  }

  function destroy() {
    isActive = false;
    gestureCallback = null;
  }

  return { initialize, start, stop, destroy, isSupported: () => true };
}
