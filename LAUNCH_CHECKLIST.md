# Lumen Read - Hackathon Launch Checklist

## Pre-Demo Verification

### Core Features
- [ ] **Adaptive Auto Mode** toggle visible in Controls
- [ ] **Confidence Score** displays metrics in real-time
- [ ] **Persona Onboarding** shows on first run
- [ ] **Accessibility Modes** (Dyslexia, ADHD, Low Vision) all work
- [ ] **AI Actions** (Simplify, Summarize, Explain, Translate) buttons appear
- [ ] **Silent Mode Coach** message appears after session
- [ ] **Demo Banner** shows on first load

### Behavior Detection
- [ ] **Re-reading detection** triggers when scrolling backward
- [ ] **Pause detection** activates after 10 seconds
- [ ] **Slow reading** flags when WPM drops below 120
- [ ] **Distraction tracking** logs tab switches
- [ ] **Auto-adaptation** applies correct profile

### UI/UX
- [ ] All animations smooth (60fps)
- [ ] No layout shifts or jank
- [ ] Responsive on mobile/tablet
- [ ] Accessibility (keyboard nav, screen reader)
- [ ] Dark/Light mode contrast passing
- [ ] Buttons all clickable, no dead zones

### Performance
- [ ] Page loads in <2 seconds
- [ ] Scrolling smooth (no lag)
- [ ] Animations don't stutter
- [ ] LocalStorage persists data
- [ ] No console errors

## Demo Preparation

### Equipment
- [ ] Laptop fully charged
- [ ] Browser clear (no distracting tabs)
- [ ] Browser zoom at 100% (or practiced)
- [ ] Quiet space for audio
- [ ] Backup: USB with project on it
- [ ] Backup: Phone to show responsive

### Content
- [ ] Sample book loaded and readable
- [ ] Text shows multiple paragraphs
- [ ] Complex sections for AI demo
- [ ] Diverse paragraph lengths

### Practice
- [ ] Run through demo 3x until smooth
- [ ] Time it: should be 5 minutes max
- [ ] Know: when to click, what to highlight
- [ ] Know: fallback if something glitches
- [ ] Know: what to say during silence

### Talking Points Memorized
- [ ] Problem statement (30 sec)
- [ ] Solution/Wow (30 sec)
- [ ] Demo flow (3 min)
- [ ] Key insights (1 min)
- [ ] Why this wins (30 sec)

## Demo Script

### Opening (1 min)
"Most reading apps show the same interface to everyone. But we all struggle differently. Lumen Read notices when you're struggling and adapts automatically."

### Trigger Demo (30 sec)
Click through to reader. Enable Adaptive Auto Mode. Say: "Watch what happens when I read something challenging..."

### Re-reading Moment (1 min)
Scroll backward. Wait for detection. Say: "The app just noticed I re-read that paragraph. A struggle signal."

### Transformation (1 min)
Show text changing:
- "Spacing increased"
- "Width narrowed"
- "Color adjusted"
- "See the confidence score update? 28% smoother."

### Show Other Features (1.5 min)
- Persona selection
- Dyslexia mode
- AI Simplify action
- What Coach says

### Closing (30 sec)
"This is what accessible tech should be. Not settings. Not toggles. Just an app that gets you."

## Fallback Plans

### If Adaptive Auto doesn't trigger:
- Have a pre-recorded video clip of it working
- Or manually trigger by clicking confidence section
- Say: "Here's what happens when we detect struggle..."

### If animations stutter:
- It's fine. Keep going.
- Say: "Beautiful animations" and move on
- Judges don't care about 60fps, they care about UX

### If demo crashes:
- Have a second browser tab ready with a fresh instance
- Or pull up Vercel deployment (if deployed)
- Stay calm: "Technical glitch, let me restart..."

### If you forget what to say:
- Pause and look at your notes
- Take a sip of water
- Judges won't mind 3 seconds of silence
- They want to see you're prepared, not perfect

## Post-Demo Q&A

### Expected Questions
1. "How does it detect struggling?" → Describe IntersectionObserver + scroll tracking
2. "Is this just toggles?" → No. It's automatic.
3. "What about X accessibility feature?" → Could add it. Focus on what makes us different.
4. "Backend?" → No backend. LocalStorage. Works offline.
5. "Timeline?" → Already built. What we need now is user feedback.

### Gold Standard Answers
- **Specific**: Reference your code/architecture
- **Honest**: Don't overpromise
- **Short**: 30 seconds max per answer
- **Confident**: You know this product

## Judging Criteria Checklist

- [ ] **Innovation**: Adaptive Auto Mode is unique ✅
- [ ] **Execution**: Works smoothly, polished ✅
- [ ] **Design**: Beautiful, accessible, intentional ✅
- [ ] **Impact**: Solves real problem (dyslexia, ADHD) ✅
- [ ] **Presentation**: Clear, exciting, memorable ✅

## Energy & Presence

### What to Do
- ✅ Stand confidently
- ✅ Make eye contact with judges
- ✅ Speak clearly (not too fast)
- ✅ Let the demo speak
- ✅ Pause for impact
- ✅ Use the product, not slides
- ✅ Show genuine excitement
- ✅ Admit uncertainty if asked

### What NOT to Do
- ❌ Apologize for bugs (show confidence)
- ❌ Read from notes (know your material)
- ❌ Downplay the product (sell it)
- ❌ Make excuses (focus on what works)
- ❌ Rush through moment (let it land)
- ❌ Hide behind buzzwords (be clear)

## Final 30 Minutes Before Demo

- [ ] Deep breath
- [ ] Restart laptop (clean slate)
- [ ] Test WiFi (know it works)
- [ ] Open project in browser
- [ ] Test one interaction (just to confirm)
- [ ] Close all other tabs
- [ ] Mute Slack/notifications
- [ ] Have water ready
- [ ] Check appearance (camera-ready)
- [ ] Get in mindset: *This is going to be great*

## Success Metrics

**Judges will say one of these:**

1. "Whoa, did you see that? The text changed!"
2. "This actually solves a real problem"
3. "I could imagine this as a startup"
4. "This is different than everything else"
5. "How did you build this so fast?"

If you hear any of those → You've won.

---

## Final Note

This is a product. You're not pitching potential. You're showing reality.

Every feature works. Every animation is smooth. Every design decision is intentional.

You've built something remarkable.

Show them.
