/**
 * Voice Control Module
 * 
 * Wraps Web Speech API SpeechRecognition with:
 * - Clear state machine (idle → listening → recognized/error)
 * - 8-second timeout
 * - Graceful browser fallback
 */

const COMMANDS = {
  'next': 'next',
  'next paragraph': 'next',
  'previous': 'previous',
  'go back': 'previous',
  'simplify': 'simplify',
  'simple': 'simplify',
  'read aloud': 'readAloud',
  'read': 'readAloud',
  'stop': 'stop',
  'pause': 'stop',
  'focus': 'focus',
  'focus mode': 'focus',
};

const TIMEOUT_MS = 8000;

export function createVoiceControl() {
  let recognition = null;
  let status = 'idle'; // idle | listening | processing | recognized | error
  let lastCommand = null;
  let commandCallback = null;
  let statusCallback = null;
  let timeoutTimer = null;
  let supported = false;

  // Check browser support
  const SpeechRecognition = typeof window !== 'undefined'
    ? (window.SpeechRecognition || window.webkitSpeechRecognition)
    : null;

  supported = !!SpeechRecognition;

  function initialize(onCommand, onStatusChange) {
    commandCallback = onCommand;
    statusCallback = onStatusChange;

    if (!SpeechRecognition) {
      supported = false;
      return { supported: false };
    }

    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 3;

    recognition.onresult = (event) => {
      clearTimeout(timeoutTimer);
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      
      setStatus('processing');

      // Match command
      const matched = matchCommand(transcript);
      if (matched) {
        lastCommand = matched;
        setStatus('recognized');
        if (commandCallback) commandCallback(matched);
        
        // Clear "recognized" status after 2 seconds
        setTimeout(() => {
          if (status === 'recognized') {
            setStatus('idle');
          }
        }, 2000);
      } else {
        setStatus('error');
        setTimeout(() => {
          if (status === 'error') {
            setStatus('idle');
          }
        }, 2000);
      }
    };

    recognition.onerror = (event) => {
      clearTimeout(timeoutTimer);
      if (event.error !== 'aborted') {
        setStatus('error');
        setTimeout(() => {
          if (status === 'error') setStatus('idle');
        }, 2000);
      }
    };

    recognition.onend = () => {
      clearTimeout(timeoutTimer);
      // Auto-restart if we're still in listening mode
      if (status === 'listening') {
        try {
          recognition.start();
        } catch (e) {
          // Already started, ignore
        }
      }
    };

    return { supported: true };
  }

  function matchCommand(transcript) {
    // Direct match
    if (COMMANDS[transcript]) return COMMANDS[transcript];

    // Partial match
    for (const [phrase, command] of Object.entries(COMMANDS)) {
      if (transcript.includes(phrase)) return command;
    }

    return null;
  }

  function startListening() {
    if (!recognition || !supported) return false;

    try {
      recognition.start();
      setStatus('listening');
      
      // Timeout after 8 seconds of no input
      timeoutTimer = setTimeout(() => {
        if (status === 'listening') {
          stopListening();
          setStatus('idle');
        }
      }, TIMEOUT_MS);

      return true;
    } catch (e) {
      return false;
    }
  }

  function stopListening() {
    clearTimeout(timeoutTimer);
    if (recognition) {
      try {
        status = 'idle'; // Set before abort to prevent auto-restart
        recognition.abort();
      } catch (e) {
        // Ignore
      }
    }
    setStatus('idle');
  }

  function setStatus(newStatus) {
    status = newStatus;
    if (statusCallback) statusCallback(newStatus, lastCommand);
  }

  function getStatus() {
    return { status, lastCommand, supported };
  }

  function destroy() {
    stopListening();
    recognition = null;
    commandCallback = null;
    statusCallback = null;
  }

  return {
    initialize,
    startListening,
    stopListening,
    getStatus,
    destroy,
    isSupported: () => supported,
  };
}
