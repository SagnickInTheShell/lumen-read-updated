# Lumen Read - Adaptive Reading App for Accessibility

**"The reading app that notices struggle and adapts itself in real time."**

A hackathon-winning accessibility app that automatically detects when users are struggling while reading and transforms the interface to help them.

## 🎯 The Wow Factor

### Adaptive Auto Mode
When enabled, Lumen Read **automatically**:
- Detects struggle patterns (pauses, re-reading, slow speed)
- Adjusts font spacing, contrast, and reading width in real time
- Measures improvement with a confidence score
- Provides personalized coaching after each session

No settings. No manual toggles. Just intelligent adaptation.

## ✨ Key Features

### 1. **Real-Time Struggle Detection**
- Long pauses (10+ seconds)
- Re-reading patterns (upward scrolling)
- Slow reading speed (<120 WPM)
- Distraction events (tab switches)

### 2. **Automatic Adaptation**
Four behavioral profiles:
- **Balanced**: Normal reading speed
- **Challenging**: Slow reading → increase spacing 2.2x
- **Difficult**: Re-reading + slow → aggressive spacing, auto-simplify, narration
- **Fast**: High speed → expand width, reduce clutter

### 3. **Reading Confidence Score**
- Focus Consistency (0-100%)
- Speed Recovery metrics
- Completion Progress
- Distraction Reduction

Displays emotional, powerful messaging: *"You read 28% smoother today."*

### 4. **Premium Accessibility Modes**

#### Dyslexia Mode
- OpenDyslexic font
- 2.2x line height
- 0.08em letter spacing
- Warm pastel background

#### ADHD Focus Tunnel
- One paragraph at a time
- Blur surrounding content
- Animated progress bar

#### Low Vision Mode
- High contrast (dark mode)
- Text zoom (150%+)
- Voice narration sync

### 5. **Adaptive Persona Profiles**
Onboarding asks: "How do you struggle most?"
- I lose focus
- Words blur together
- I read slowly
- I forget what I read
- English is hard

UI personalizes based on selection.

### 6. **Silent Mode Coach**
Post-session personalized feedback:
- "You paused often in dense paragraphs. Try Focus Mode."
- "Simplify Mode helped users like you read 40% faster."
- "Excellent! You recovered from difficult sections quickly."

### 7. **Smart AI Micro-Actions**
One-click inline helpers (no chatbot):
- 📝 Simplify paragraph
- 📖 Summarize section
- 💡 Explain word
- 🌍 Translate sentence

### 8. **Premium UI**
- Apple + Notion + Duolingo aesthetic
- Smooth Framer Motion animations
- Accessible color contrasts
- Minimal, beautiful controls

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
# http://localhost:3000
```

### First Time
1. Select a book from the library
2. Click "Read"
3. Choose your reading struggle profile
4. Enable "Adaptive Auto Mode"
5. See the magic happen

## 📁 Project Structure

```
src/
├── app/                          # Next.js app
│   ├── layout.js
│   ├── page.js                   # Book library
│   └── read/[id]/page.js         # Reader interface
├── components/                   # React components
│   ├── AdaptiveAutoModeToggle.jsx   # Signature feature
│   ├── ConfidenceDisplay.jsx        # Metrics visualization
│   ├── AccessibilityModes.jsx       # 3 premium modes
│   ├── Onboarding.jsx              # Persona selection
│   ├── SilentModeCoach.jsx          # Post-session feedback
│   ├── AIActions.jsx                # Smart micro-actions
│   ├── DemoBanner.jsx               # First-run experience
│   ├── Reader.jsx                   # Main reading engine
│   ├── Controls.jsx                 # Sidebar controls
│   └── ...other components
├── context/
│   └── ReadingContext.jsx        # State management
├── hooks/
│   ├── useReadingBehavior.js     # Behavior tracking
│   ├── useEyeTracking.js
│   ├── useTextToSpeech.js
│   └── ...other hooks
├── modules/
│   ├── adaptiveAutoMode.js           # ⭐ Signature system
│   ├── confidenceTracker.js          # ⭐ Metrics system
│   ├── behaviorTracker.js            # Struggle detection
│   └── ...other modules
└── lib/
    ├── storage.js                # LocalStorage
    └── epubParser.js
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16 + React 19
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS 4
- **Storage**: LocalStorage (no backend)
- **APIs**: Browser (IntersectionObserver, SpeechSynthesis)
- **Fonts**: OpenDyslexic

## 📚 Documentation

- **[HACKATHON.md](HACKATHON.md)** - Product brief & why it wins
- **[FEATURES.md](FEATURES.md)** - Complete feature breakdown
- **[IMPLEMENTATION.md](IMPLEMENTATION.md)** - Technical guide
- **[PITCH.md](PITCH.md)** - Pitch guide for judges

## ⚡ Performance

- ✅ GPU-accelerated animations (Framer Motion)
- ✅ Client-side processing (no API latency)
- ✅ LocalStorage persistence (no database)
- ✅ Efficient scroll tracking (debounced)
- ✅ Memoized components (no wasted renders)

## ♿ Accessibility First

- WCAG AA color contrast ratios
- Keyboard navigation support
- Screen reader compatible
- Font scaling support
- Voice control integration

## 🎬 Demo Walkthrough

1. **Enable Adaptive Auto Mode** - Toggle lights up
2. **Scroll backward** - Triggers re-reading detection
3. **Watch text transform** - Spacing increases visibly
4. **See confidence update** - Score changes in sidebar
5. **Read message** - "Dense section detected..."
6. **Continue reading** - App adapts seamlessly

Total time: 2 minutes. Total impact: Judges will say "Whoa."

## 🔮 Why This Wins

| Criteria | Score |
|----------|-------|
| Uniqueness | ⭐⭐⭐⭐⭐ (No competitor has Adaptive Auto) |
| Problem-Solving | ⭐⭐⭐⭐⭐ (15% dyslexic + ADHD + ESL users) |
| Polish | ⭐⭐⭐⭐⭐ (Premium UI, smooth animations) |
| Demo Value | ⭐⭐⭐⭐⭐ (Visible impact in 60 seconds) |
| Startup Potential | ⭐⭐⭐⭐⭐ (Clear B2B path) |

## 💡 The Vision

> "Accessibility should adapt automatically. 
> 
> Most people struggle silently while reading. 
> 
> Lumen Read doesn't ask them to configure settings. 
> 
> It notices. It understands. It adapts.
> 
> This is the future of accessible technology."

## 📞 Support

See **[IMPLEMENTATION.md](IMPLEMENTATION.md)** for technical questions.

See **[PITCH.md](PITCH.md)** for demo guidance.

---

**Built for hackathons. Built to win. Built for accessibility.**
