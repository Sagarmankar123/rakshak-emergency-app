# 🚀 Deployment Guide - Rakshak

Complete guide for deploying Rakshak Emergency Help App to production.

## Quick Deploy Options

### 1. Vercel (Recommended - Easiest)

**Why Vercel?**
- Zero configuration
- Automatic HTTPS
- Global CDN
- Automatic deployments from Git
- Free tier available

**Steps:**

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
# First deployment (will ask configuration questions)
vercel

# Production deployment
vercel --prod
```

4. **Configure Custom Domain** (Optional)
```bash
vercel domains add yourdomain.com
```

**Environment Variables in Vercel:**
- Go to Project Settings → Environment Variables
- Add production API keys
- Redeploy for changes to take effect

---

### 2. Netlify

**Why Netlify?**
- Great for static sites
- Form handling
- Serverless functions
- Free SSL

**Steps:**

1. **Install Netlify CLI**
```bash
npm i -g netlify-cli
```

2. **Build the project**
```bash
npm run build
```

3. **Deploy**
```bash
# Login
netlify login

# Deploy to draft URL
netlify deploy

# Deploy to production
netlify deploy --prod --dir=dist
```

4. **Configure `netlify.toml`**
```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### 3. Firebase Hosting

**Why Firebase?**
- Google infrastructure
- Easy integration with other Firebase services
- Good for real-time features

**Steps:**

1. **Install Firebase CLI**
```bash
npm install -g firebase-tools
```

2. **Login to Firebase**
```bash
firebase login
```

3. **Initialize Firebase**
```bash
firebase init hosting
```
Select:
- Public directory: `dist`
- Configure as SPA: `Yes`
- Set up automatic builds: `No` (for now)

4. **Build and Deploy**
```bash
npm run build
firebase deploy --only hosting
```

5. **Configure `firebase.json`**
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

---

### 4. GitHub Pages

**Why GitHub Pages?**
- Free hosting
- Direct from GitHub repo
- Easy for open-source projects

**Steps:**

1. **Update `vite.config.ts`**
```typescript
export default defineConfig({
  base: '/rakshak/', // Replace with your repo name
  // ... rest of config
});
```

2. **Install gh-pages**
```bash
npm install -D gh-pages
```

3. **Add script to `package.json`**
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

4. **Deploy**
```bash
npm run deploy
```

5. **Enable GitHub Pages**
- Go to repository Settings
- Scroll to GitHub Pages section
- Select `gh-pages` branch
- Your site will be at: `https://username.github.io/rakshak/`

---

### 5. AWS S3 + CloudFront

**Why AWS?**
- Enterprise-grade
- Highly scalable
- Full control

**Steps:**

1. **Build the project**
```bash
npm run build
```

2. **Create S3 Bucket**
```bash
aws s3 mb s3://rakshak-app
```

3. **Upload files**
```bash
aws s3 sync dist/ s3://rakshak-app --acl public-read
```

4. **Enable Static Website Hosting**
```bash
aws s3 website s3://rakshak-app --index-document index.html --error-document index.html
```

5. **Create CloudFront Distribution**
- Go to CloudFront Console
- Create distribution
- Set S3 bucket as origin
- Configure custom domain
- Enable HTTPS

---

### 6. Railway

**Why Railway?**
- Full-stack deployments
- Built-in database
- Environment variables

**Steps:**

1. **Install Railway CLI**
```bash
npm i -g @railway/cli
```

2. **Login**
```bash
railway login
```

3. **Initialize project**
```bash
railway init
```

4. **Deploy**
```bash
railway up
```

---

## Production Checklist

### Before Deployment

- [ ] Build succeeds without errors
- [ ] All environment variables configured
- [ ] Update API endpoints to production URLs
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Compress images and assets
- [ ] Remove console.logs
- [ ] Enable analytics
- [ ] Configure SEO meta tags
- [ ] Set up error monitoring (Sentry)

### Post Deployment

- [ ] Test all features on production
- [ ] Verify HTTPS is working
- [ ] Check mobile responsiveness
- [ ] Test emergency button
- [ ] Verify location permissions
- [ ] Test fake call feature
- [ ] Check contact management
- [ ] Verify dark mode
- [ ] Test authentication flow
- [ ] Monitor error logs
- [ ] Set up uptime monitoring
- [ ] Configure custom domain
- [ ] Add to search engines

---

## Environment Variables

Create `.env.production` file:

```env
# App
VITE_APP_NAME=Rakshak
VITE_APP_VERSION=1.0.0

# API Endpoints
VITE_API_URL=https://api.rakshak.app
VITE_SOCKET_URL=wss://api.rakshak.app

# SMS Service (MSG91)
VITE_MSG91_API_KEY=your_api_key
VITE_MSG91_SENDER_ID=RAKSHK

# SMS Service (Twilio) - Alternative
VITE_TWILIO_ACCOUNT_SID=your_account_sid
VITE_TWILIO_AUTH_TOKEN=your_auth_token
VITE_TWILIO_PHONE=+1234567890

# Maps
VITE_GOOGLE_MAPS_API_KEY=your_api_key

# Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Error Monitoring
VITE_SENTRY_DSN=your_sentry_dsn

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_SENTRY=true
```

---

## Custom Domain Setup

### Vercel

1. Add domain in Vercel dashboard
2. Update DNS records:
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Netlify

1. Add domain in Netlify dashboard
2. Update DNS records:
```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: your-site.netlify.app
```

### Firebase

1. Add custom domain in Firebase Console
2. Verify ownership
3. Update DNS:
```
Type: A
Name: @
Value: (provided by Firebase)

Type: A
Name: @
Value: (provided by Firebase)
```

---

## CI/CD Setup

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.API_URL }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## Monitoring & Analytics

### 1. Google Analytics

```typescript
// src/utils/analytics.ts
import ReactGA from 'react-ga4';

export const initGA = () => {
  ReactGA.initialize(import.meta.env.VITE_GA_MEASUREMENT_ID);
};

export const logPageView = () => {
  ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
};

export const logEvent = (category: string, action: string, label?: string) => {
  ReactGA.event({ category, action, label });
};
```

### 2. Sentry Error Monitoring

```bash
npm install @sentry/react
```

```typescript
// src/main.tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

### 3. Uptime Monitoring

Use services like:
- UptimeRobot (Free)
- Pingdom
- StatusCake
- Better Uptime

---

## Performance Optimization

### 1. Code Splitting

```typescript
// Lazy load components
import { lazy, Suspense } from 'react';

const FakeCall = lazy(() => import('./components/FakeCall'));

// Use with Suspense
<Suspense fallback={<Loading />}>
  <FakeCall />
</Suspense>
```

### 2. Image Optimization

```bash
# Install image optimization plugin
npm install -D vite-plugin-imagemin
```

### 3. Bundle Analysis

```bash
npm run build -- --mode=analyze
```

---

## Security Headers

Add to your hosting provider:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(self), microphone=(self), camera=(self)
```

---

## Rollback Strategy

### Vercel
```bash
# List deployments
vercel list

# Rollback to specific deployment
vercel rollback [deployment-url]
```

### Netlify
```bash
# List deploys
netlify deploy:list

# Restore deploy
netlify deploy:restore [deploy-id]
```

---

## Support

For deployment issues:
- Check deployment logs
- Verify environment variables
- Test locally with production build
- Check browser console for errors
- Review security headers
- Verify API endpoints

---

**Good luck with your deployment! 🚀**
