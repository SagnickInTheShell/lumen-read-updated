/**
 * Keyboard Controls Module
 * 
 * Handles keyboard shortcuts for the reading app.
 * Prevents firing when input/textarea is focused.
 */

const SHORTCUTS = {
  'ArrowRight': 'next',
  'ArrowLeft': 'previous',
  ' ': 'toggleAudio',         // Space
  's': 'toggleSimplify',
  'S': 'toggleSimplify',
  'd': 'toggleDyslexia',
  'D': 'toggleDyslexia',
  'f': 'toggleFocus',
  'F': 'toggleFocus',
  'h': 'toggleHighContrast',
  'H': 'toggleHighContrast',
  'Escape': 'dismissSuggestion',
};

export function createKeyboardControls() {
  let handler = null;
  let actionCallback = null;

  function initialize(onAction) {
    actionCallback = onAction;

    handler = (e) => {
      // Don't fire in input fields
      const tag = e.target.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable) {
        return;
      }

      const action = SHORTCUTS[e.key];
      if (action) {
        e.preventDefault();
        if (actionCallback) actionCallback(action);
      }
    };

    document.addEventListener('keydown', handler);
  }

  function destroy() {
    if (handler) {
      document.removeEventListener('keydown', handler);
      handler = null;
    }
    actionCallback = null;
  }

  return { initialize, destroy };
}
