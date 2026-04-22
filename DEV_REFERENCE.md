# Lumen Read - Developer Quick Reference

## File Structure at a Glance

```
lumenread/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── globals.css         # Design system, colors, fonts
│   │   ├── layout.js
│   │   ├── page.js             # Home / library
│   │   └── read/[id]/page.js   # Main reader
│   │
│   ├── components/             # React components
│   │   ├── Reader.jsx                 # Main content area
│   │   ├── Controls.jsx                # Left sidebar
│   │   ├── AudioControls.jsx
│   │   ├── FocusControls.jsx
│   │   ├── StatusBar.jsx
│   │   ├── SuggestionPopup.jsx
│   │   ├── VoiceIndicator.jsx
│   │   ├── CalibrationOverlay.jsx
│   │   │
│   │   ├── ⭐ NEW FEATURES:
│   │   ├── AdaptiveAutoModeToggle.jsx  # Signature feature
│   │   ├── ConfidenceDisplay.jsx       # Metrics
│   │   ├── AccessibilityModes.jsx      # 3 premium modes
│   │   ├── Onboarding.jsx              # Persona selection
│   │   ├── SilentModeCoach.jsx         # Post-session feedback
│   │   ├── AIActions.jsx               # Smart micro-actions
│   │   └── DemoBanner.jsx              # First-run experience
│   │
│   ├── context/
│   │   └── ReadingContext.jsx   # Global state (+ new fields)
│   │
│   ├── hooks/
│   │   ├── useReadingBehavior.js       # Behavior tracking
│   │   ├── useEyeTracking.js
│   │   ├── useTextToSpeech.js
│   │   ├── useVoiceControl.js
│   │   ├── useGestureControl.js
│   │   ├── useKeyboardControls.js
│   │   └── usePersonalization.js
│   │
│   ├── modules/
│   │   ├── ⭐ adaptiveAutoMode.js      # NEW: Signature system
│   │   ├── ⭐ confidenceTracker.js     # NEW: Metrics system
│   │   ├── adaptationEngine.js         # Suggestions
│   │   ├── behaviorTracker.js          # Behavior detection
│   │   ├── simplifier.js
│   │   ├── translation.js
│   │   ├── aiLayer.js
│   │   └── ...others
│   │
│   ├── lib/
│   │   ├── storage.js           # LocalStorage interface
│   │   ├── epubParser.js        # EPUB parsing
│   │   └── ...others
│   │
│   └── data/
│       └── sampleContent.js     # Sample reading material
│
├── public/                       # Static assets
├── HACKATHON.md                  # 📋 Product brief
├── FEATURES.md                   # 📋 Feature breakdown
├── IMPLEMENTATION.md             # 📋 Technical guide
├── PITCH.md                      # 📋 Judge pitch
├── LAUNCH_CHECKLIST.md           # 📋 Demo prep
├── DEPLOYMENT.md                 # 📋 Deploy guide
└── README.md                     # Product overview
```

## Key State Management

### ReadingContext
```jsx
// Access context
const { state, dispatch, toggleMode, setMode, updateConfidenceMetrics, setUserProfile } = useReading();

// Key state properties
state.adaptiveAutoMode           // boolean
state.userProfile                // 'focus-loss' | 'blur' | 'slow-speed' | 'retention' | 'language'
state.confidenceMetrics          // { confidence, focusConsistency, speedRecovery, ... }
state.improvementMessage         // string for UI display
state.dyslexiaMode, .focusMode, .audioMode, .simplifyMode, etc.
```

### Updating State
```jsx
// Toggle a mode
toggleMode('adaptiveAutoMode');          // flips boolean
toggleMode('dyslexiaMode');

// Set specific value
setMode('focusMode', true);
setMode('focusMode', false);

// Update metrics
updateConfidenceMetrics(metrics, message);

// Set user profile
setUserProfile('focus-loss');             // saves persona
```

## Component Integration

### Using Adaptive Auto Mode
```jsx
import { createAdaptiveAutoMode } from '@/modules/adaptiveAutoMode';

const autoMode = createAdaptiveAutoMode();
autoMode.activate();

// On behavior change
const change = autoMode.updateBasedOnBehavior(wpm, isPaused, isSlowReading, isReReading);
if (change) {
  console.log(change.message);     // "Dense section detected..."
  console.log(change.profile);     // "difficult"
}

// Get current config
const config = autoMode.getConfig();
```

### Using Confidence Tracker
```jsx
import { createConfidenceTracker } from '@/modules/confidenceTracker';

const tracker = createConfidenceTracker();

// Update metrics
tracker.updateWPM(150);
tracker.updateCompletionRate(5, 20);          // 5 of 20 paragraphs
tracker.recordPauseEvent(15000);              // 15 second pause

// Get display data
const metrics = tracker.getConfidenceMetrics();
const message = tracker.getImprovementMessage();
```

## CSS Custom Properties

### Reading Adjustments (updated by Adaptive Auto)
```css
--lumen-reading-line-height: 1.85 to 2.5   /* font spacing */
--lumen-reading-letter-spacing: 0.01em to 0.08em
--lumen-content-width: 500px to 750px       /* reading width */
```

### Colors (theme variables)
```css
--lumen-bg: #faf8f5                         /* background */
--lumen-text: #2c2c2c                       /* text */
--lumen-accent: #7c6aef                     /* brand color */
--lumen-hc-bg: #1a1a2e                      /* high contrast bg */
--lumen-hc-text: #f0f0f0                    /* high contrast text */
```

## Common Tasks

### Add a new mode
```jsx
// 1. Add to initialState in ReadingContext
newMode: false,

// 2. Add toggle case in reducer
case 'TOGGLE_MODE': {
  const mode = action.payload;
  return { ...state, [mode]: !state[mode] };
}

// 3. Use in component
const { state, toggleMode } = useReading();
<button onClick={() => toggleMode('newMode')}>
  Enable New Mode
</button>
```

### Update confidence score
```jsx
import { createConfidenceTracker } from '@/modules/confidenceTracker';

const tracker = createConfidenceTracker();
tracker.updateWPM(currentWPM);
tracker.updateCompletionRate(currentIndex, totalParagraphs);

const metrics = tracker.getConfidenceMetrics();
const message = tracker.getImprovementMessage();

updateConfidenceMetrics(metrics, message);
```

### Display new metric
```jsx
// In component
import ConfidenceDisplay from '@/components/ConfidenceDisplay';

<ConfidenceDisplay 
  metrics={state.confidenceMetrics}
  message={state.improvementMessage}
/>
```

### Create accessibility mode
```jsx
// In Controls.jsx or new component
<button onClick={() => setMode('newAccessibilityMode', true)}>
  Enable Mode
</button>

// In globals.css
.accessibility-mode-active {
  /* Apply CSS changes */
}
```

## Animation Patterns

### Framer Motion Basics
```jsx
import { motion, AnimatePresence } from 'framer-motion';

// Animate component in
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 10 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>

// Loop animation
<motion.div
  animate={{ rotate: 360 }}
  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
/>

// Conditional animation
<AnimatePresence>
  {isVisible && <motion.div>...</motion.div>}
</AnimatePresence>
```

## Performance Tips

### Memoization
```jsx
import { memo } from 'react';

const MyComponent = memo(function MyComponent({ prop1, prop2 }) {
  return <div>{prop1}</div>;
});
```

### Debouncing Scroll
```jsx
import { useEffect, useRef } from 'react';

const debounce = (fn, ms) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), ms);
  };
};

const handleScroll = debounce(() => {
  // Scroll logic
}, 200);
```

### Conditional Rendering
```jsx
// Good (won't render if not needed)
{state.audioMode && <AudioControls />}

// With lazy import (code splitting)
const AudioControls = lazy(() => import('./AudioControls'));
```

## Debugging Tools

### Console Logging
```jsx
// In development
if (process.env.NODE_ENV === 'development') {
  console.log('Debug:', state);
}

// Remove with build optimization
```

### React DevTools
- Inspect component tree
- Track state changes
- Profile render performance
- Check props/state values

### Browser DevTools
- Check localStorage: `localStorage.getItem('key')`
- Clear all: `localStorage.clear()`
- Network tab: check asset loading
- Performance tab: profile rendering

## Quick Commands

```bash
# Development
npm run dev                    # Start dev server

# Production
npm run build                  # Build for production
npm run start                  # Start prod server

# Linting
npm run lint                   # Check code quality

# Debugging
NODE_ENV=development npm run dev  # Verbose logging
```

## Files to Modify for New Features

| Feature Type | Modify |
|--------------|--------|
| New mode | ReadingContext.jsx, Controls.jsx, globals.css |
| New metric | confidenceTracker.js, ConfidenceDisplay.jsx |
| New AI action | AIActions.jsx, modules/aiLayer.js |
| New accessibility | AccessibilityModes.jsx, globals.css |
| New behavior | behaviorTracker.js, adaptationEngine.js |

## Browser APIs Used

```jsx
// Visibility tracking
new IntersectionObserver(callback, { threshold: 0.5 })

// Audio/Speech
window.speechSynthesis.speak(utterance)
new SpeechRecognition()

// Storage
localStorage.setItem(key, value)
localStorage.getItem(key)

// Timing
setTimeout, setInterval, requestAnimationFrame

// Keyboard
window.addEventListener('keydown', handler)
```

## Component Props Reference

### AdaptiveAutoModeToggle
```jsx
// No props - reads from context
<AdaptiveAutoModeToggle />
```

### ConfidenceDisplay
```jsx
<ConfidenceDisplay 
  metrics={{                    // required
    confidence: 78,
    focusConsistency: 85,
    speedRecovery: 72,
    distractionReduction: 80,
    completionRate: 45
  }}
  message="You read 28% smoother today"  // required
  animated={true}               // optional
/>
```

### AccessibilityModes
```jsx
// No props - reads from context
<AccessibilityModes />
```

### Onboarding
```jsx
<Onboarding 
  onComplete={() => setOnboardingComplete(true)}  // required
/>
```

### SilentModeCoach
```jsx
<SilentModeCoach 
  metrics={{                    // required
    pauseCount: 3,
    distractionCount: 2,
    focusConsistency: 75,
    speedRecovery: 80,
    completionRate: 90
  }}
  onDismiss={() => closeCoach()}  // required
/>
```

### AIActions
```jsx
<AIActions 
  text="Complex paragraph text..."  // required
  onAction={(action, text) => {     // required
    console.log(action);             // 'simplify' | 'summarize' | 'explain' | 'translate'
    console.log(text);               // The selected text
  }}
/>
```

---

**Keep this handy. Reference it frequently.**
