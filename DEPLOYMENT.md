# Lumen Read - Deployment & Testing Guide

## Local Development

### Setup
```bash
# Clone or navigate to project
cd lumenread

# Install dependencies
npm install

# Start dev server
npm run dev

# Open browser
open http://localhost:3000
```

### Hot Reload
Changes auto-reload. Modify any file and see changes instantly.

### Testing Locally

#### 1. First Run Experience
- [ ] Open http://localhost:3000
- [ ] Demo banner shows (can skip/navigate)
- [ ] Click a book to read
- [ ] Onboarding shows persona options
- [ ] Can select any persona

#### 2. Adaptive Auto Mode Testing
- [ ] Controls sidebar visible on left
- [ ] "Enable Adaptive Auto" button highlighted
- [ ] Click to enable
- [ ] Status shows "Adaptive Mode Active"
- [ ] Read normally for 30 seconds
- [ ] Scroll backward (triggers re-reading detection)
- [ ] Watch text spacing increase
- [ ] Confidence score updates

#### 3. Accessibility Modes
- [ ] Dyslexia Mode toggles (OpenDyslexic font loads)
- [ ] ADHD Focus Tunnel narrows reading area
- [ ] Low Vision Mode switches to dark theme
- [ ] Can combine modes (e.g., Dyslexia + Low Vision)

#### 4. AI Actions
- [ ] Hover over text shows AI button
- [ ] Click to open actions menu
- [ ] All 4 actions (Simplify, Summarize, Explain, Translate) clickable
- [ ] Hover shows descriptions

#### 5. Metrics & Feedback
- [ ] Confidence score displays in sidebar
- [ ] Metrics show percentages (0-100%)
- [ ] Color changes with improvement level
- [ ] Progress bar animates
- [ ] Message updates emotionally

## Production Deployment

### Vercel (Recommended)

Vercel is the creator of Next.js and optimizes for it automatically.

#### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Lumen Read hackathon product"
git remote add origin https://github.com/YOUR_USERNAME/lumenread.git
git push -u origin main
```

#### Step 2: Connect to Vercel
1. Go to https://vercel.com
2. Click "New Project"
3. Select "Import Git Repository"
4. Find your `lumenread` repo
5. Click "Import"
6. Keep default settings
7. Click "Deploy"

#### Step 3: Done
Your app is live at `https://lumenread.vercel.app` (auto-generated domain)

Or add custom domain:
1. Project Settings → Domains
2. Add your domain
3. Follow DNS instructions

### Netlify (Alternative)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod --dir=.next
```

### Self-Hosted (Advanced)

```bash
# Build for production
npm run build

# Start production server
npm run start
```

Server runs on `http://localhost:3000` by default.

For production use (AWS, DigitalOcean, etc.):
- Use process manager (PM2, systemd)
- Add reverse proxy (Nginx)
- Enable HTTPS (Let's Encrypt)

## Performance Optimization

### Already Optimized
- ✅ Framer Motion uses GPU acceleration
- ✅ Components memoized to prevent re-renders
- ✅ Scroll events debounced
- ✅ Images optimized via Next.js Image component
- ✅ CSS purged automatically by Tailwind

### Check Performance
```bash
# Run Lighthouse audit
npm install -g lighthouse
lighthouse https://lumenread.vercel.app
```

Expected scores: 90+ (Performance, Accessibility, Best Practices)

### Monitor in Production
- Use Vercel Analytics (built-in)
- Set up Google Analytics (optional)
- Monitor Core Web Vitals

## Testing Checklist

### Functional Testing
- [ ] All buttons clickable
- [ ] No console errors
- [ ] Local storage persists data
- [ ] No unhandled exceptions
- [ ] Forms submit correctly

### Cross-Browser Testing
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Accessibility Testing
- [ ] Tab navigation works
- [ ] Keyboard shortcuts work
- [ ] Screen reader compatible
- [ ] Color contrast passes (WCAG AA)
- [ ] Focus indicators visible

### Performance Testing
- [ ] First Contentful Paint < 1s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Time to Interactive < 3.5s

### Device Testing
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

## Debugging

### Browser DevTools

#### Console
```
// Check localStorage
localStorage.getItem('lumenProfile')
localStorage.getItem('lumenReadBannerSeen')

// Clear all data
localStorage.clear()

// Check context state
// (Add debug logging in components)
```

#### Network Tab
- Check API calls (should be none)
- Check asset loading
- Check LocalStorage usage

#### Performance Tab
- Record CPU usage while reading
- Check for jank/dropped frames
- Analyze component render times

### React DevTools
```bash
# Install Chrome extension
# Open React tab in DevTools
# Check component tree
# Track state changes
# Profile render performance
```

## Troubleshooting

### Issue: Page doesn't load
**Solution**:
1. Clear browser cache (Cmd+Shift+Delete)
2. Hard refresh (Cmd+Shift+R)
3. Check console for errors
4. Restart dev server

### Issue: Adaptive Auto Mode not working
**Solution**:
1. Scroll backward on a paragraph
2. Wait 10+ seconds without scrolling
3. Check console: should log behavior events
4. Verify profile is active

### Issue: Confidence score not updating
**Solution**:
1. Ensure metrics module is loaded
2. Check that behavior is being tracked
3. Verify updateConfidenceMetrics is called
4. Check localStorage isn't disabled

### Issue: Animations are choppy
**Solution**:
1. Check browser GPU acceleration enabled
2. Close other heavy tabs
3. Restart browser
4. Check system resources

### Issue: Fonts not loading
**Solution**:
1. Check network tab for OpenDyslexic
2. Verify CDN link is accessible
3. Clear cache and retry
4. Check font-face declaration in CSS

## Environment Variables

Create `.env.local` if needed:
```
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Lumen Read"
```

Restart dev server after changes.

## Building for Production

```bash
# Full build with optimization
npm run build

# Check build output
du -sh .next

# Test production build locally
npm run start
```

Expected build size: ~500KB-1MB (gzip)

## Monitoring & Analytics

### Basic Analytics (Free)
Add to `_document.js`:
```jsx
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

### Error Tracking (Optional)
```bash
npm install @sentry/nextjs
# Configure in pages/_app.js
```

### Performance Monitoring
Vercel includes:
- Core Web Vitals
- Real User Monitoring (RUM)
- API Analytics

## Rollback Plan

If deployment breaks:

```bash
# Vercel: Click "Deployments" → Find last working build → Click "Promote to Production"

# GitHub: Revert commit
git revert HEAD
git push

# Manual rebuild
npm run build
npm run start
```

## Security Considerations

### Already Secure
- ✅ No server-side computation (client-only)
- ✅ No external API calls
- ✅ LocalStorage used for persistence (user-only)
- ✅ No authentication needed
- ✅ No sensitive data sent

### Best Practices
- ✅ Keep dependencies updated: `npm audit fix`
- ✅ No console.logs with sensitive data in production
- ✅ Use HTTPS (auto on Vercel)
- ✅ Add Content Security Policy (if hosting own server)

## Post-Deployment Checklist

After deploying to production:

- [ ] Test all features work
- [ ] Check performance metrics
- [ ] Monitor error logs
- [ ] Verify analytics tracking
- [ ] Test on multiple devices
- [ ] Test accessibility
- [ ] Set up monitoring alerts
- [ ] Document deployment process
- [ ] Backup database/data
- [ ] Plan maintenance windows

## Continuous Deployment

### GitHub Actions (Auto-deploy on push)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

Then every push to `main` auto-deploys.

## Performance Budget

Keep these metrics in mind:

| Metric | Budget | Current |
|--------|--------|---------|
| JS Bundle | <200KB | ~150KB |
| CSS Bundle | <50KB | ~30KB |
| Lighthouse Performance | >90 | TBD |
| First Contentful Paint | <1s | TBD |
| Time to Interactive | <3s | TBD |

Monitor with `npm run analyze` (if webpack-bundle-analyzer installed).

## Questions?

See:
- **Technical**: [IMPLEMENTATION.md](IMPLEMENTATION.md)
- **Features**: [FEATURES.md](FEATURES.md)
- **Pitch**: [PITCH.md](PITCH.md)

---

**Ship it with confidence.**
