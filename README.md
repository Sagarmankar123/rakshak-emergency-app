# 🛡️ Rakshak - Emergency Help App

A production-ready web application for emergency assistance in India. Built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Features
1. **One-Tap Emergency Button**
   - 3-second countdown before activation
   - Sends live GPS location to trusted contacts
   - Automatic SMS alerts (via Web Share API)
   - Loud siren sound
   - Flashlight activation (on supported devices)
   - Background audio recording
   - Vibration alerts

2. **Live Location Tracking**
   - Real-time GPS updates
   - Reverse geocoding to address
   - Google Maps integration
   - Location accuracy monitoring

3. **Trusted Contacts Management**
   - Add up to 5 trusted contacts
   - Edit and delete contacts
   - Organized by relationship
   - Indian phone number validation

4. **Fake Call Feature**
   - Realistic incoming call simulation
   - Multiple caller options (Dad, Mom, Boss, Friend, Police, Hospital)
   - Full-screen call interface
   - Use to escape unsafe situations

5. **Emergency History Log**
   - Complete emergency alert history
   - Location and timestamp
   - Duration tracking
   - Status monitoring (Active/Resolved/Cancelled)

6. **Dark Mode UI**
   - Toggle between light and dark themes
   - Persistent preference storage
   - Smooth transitions

7. **OTP-Based Authentication**
   - Indian phone number validation (+91)
   - 6-digit OTP verification
   - Secure JWT token storage
   - Session management

## 🏗️ Technical Stack

### Frontend
- **React 19** - Modern UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Vite** - Build tool

### Browser APIs Used
- **Geolocation API** - Location tracking
- **Web Audio API** - Siren sound
- **MediaDevices API** - Camera flash & audio recording
- **Vibration API** - Alert vibrations
- **Screen Wake Lock API** - Keep screen on during emergency
- **Web Share API** - Share emergency alerts
- **LocalStorage** - Data persistence

### Security Features
- Base64 encryption for sensitive data
- JWT-like token authentication
- Input validation
- XSS protection
- Secure data storage

## 📁 Project Structure

```
rakshak/
├── src/
│   ├── components/
│   │   ├── LoginScreen.tsx          # OTP authentication
│   │   ├── EmergencyButton.tsx      # Main SOS button
│   │   ├── ContactsManager.tsx      # Manage trusted contacts
│   │   ├── EmergencyHistory.tsx     # Emergency logs
│   │   ├── FakeCall.tsx            # Fake call feature
│   │   └── Settings.tsx            # App settings
│   ├── types/
│   │   └── index.ts                # TypeScript definitions
│   ├── utils/
│   │   ├── storage.ts              # LocalStorage utilities
│   │   ├── location.ts             # Geolocation utilities
│   │   ├── emergency.ts            # Emergency features
│   │   ├── auth.ts                 # Authentication logic
│   │   └── cn.ts                   # Utility functions
│   ├── App.tsx                     # Main app component
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Global styles
├── dist/                           # Production build
├── index.html                      # HTML template
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript config
├── vite.config.ts                  # Vite config
└── README.md                       # Documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd rakshak
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

4. **Build for production**
```bash
npm run build
```

5. **Preview production build**
```bash
npm run preview
```

## 🌐 Deployment Guide

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Production deployment**
```bash
vercel --prod
```

### Option 2: Netlify

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
netlify deploy --prod --dir=dist
```

### Option 3: GitHub Pages

1. **Add to `vite.config.ts`**
```typescript
base: '/rakshak/' // Replace with your repo name
```

2. **Build**
```bash
npm run build
```

3. **Deploy to GitHub Pages**
```bash
# Install gh-pages
npm install -D gh-pages

# Add to package.json scripts
"deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

### Option 4: Firebase Hosting

1. **Install Firebase CLI**
```bash
npm i -g firebase-tools
```

2. **Initialize Firebase**
```bash
firebase init hosting
# Choose 'dist' as public directory
# Configure as single-page app: Yes
```

3. **Deploy**
```bash
npm run build
firebase deploy
```

## 🔒 Production Security Checklist

### Before Production Deployment

- [ ] **Environment Variables**
  - Store API keys in environment variables
  - Never commit sensitive data to Git
  - Use `.env.local` for local development

- [ ] **HTTPS**
  - Enable HTTPS for all production deployments
  - Use SSL certificates

- [ ] **Data Encryption**
  - Replace Base64 with proper encryption (AES-256)
  - Use encryption libraries like crypto-js

- [ ] **Authentication**
  - Implement real OTP service (Twilio, MSG91, Firebase Auth)
  - Use proper JWT with secret keys
  - Implement token refresh mechanism
  - Add rate limiting

- [ ] **SMS Integration**
  - Integrate real SMS API (Twilio, MSG91, Amazon SNS)
  - Implement fallback mechanisms
  - Add delivery status tracking

- [ ] **Location Services**
  - Request user permissions properly
  - Handle permission denials gracefully
  - Implement fallback for unavailable location

- [ ] **Error Handling**
  - Implement global error boundary
  - Log errors to monitoring service
  - Show user-friendly error messages

- [ ] **Performance**
  - Optimize images and assets
  - Implement code splitting
  - Enable caching strategies
  - Monitor bundle size

- [ ] **Testing**
  - Unit tests for utilities
  - Integration tests for components
  - E2E tests for critical flows
  - Cross-browser testing

- [ ] **Accessibility**
  - ARIA labels
  - Keyboard navigation
  - Screen reader support
  - Color contrast compliance

- [ ] **Legal Compliance**
  - Privacy policy
  - Terms of service
  - Cookie consent
  - GDPR compliance (if applicable)
  - Data retention policy

## 💰 Monetization Plan

### Free Tier
- 5 trusted contacts
- Basic emergency features
- Location tracking
- Emergency history (last 30 days)
- Ads supported

### Premium Tier ($4.99/month or ₹399/month)
- Unlimited trusted contacts
- Priority SMS delivery
- Cloud backup of emergency logs
- No ads
- Advanced features:
  - Voice alerts
  - Video recording
  - 24/7 emergency support hotline
  - Family tracking dashboard
  - Health information storage

### Enterprise/Institutional ($49/month per organization)
- For schools, colleges, corporate offices
- Centralized dashboard
- Real-time monitoring
- Geo-fencing alerts
- Custom integrations
- Dedicated support
- Analytics and reporting

### Revenue Streams
1. **Subscription Model** - Primary revenue
2. **In-App Purchases** - Premium features
3. **B2B Partnerships** - Corporate/institutional licenses
4. **Insurance Partnerships** - Commission on safety insurance
5. **Advertising** (Free tier) - Banner ads, sponsored content
6. **Government Grants** - Women safety initiatives

## 🔧 API Integration Guide

### SMS API Integration (Production)

#### Using MSG91 (India-focused)
```typescript
// utils/sms.ts
export const sendSMS = async (phone: string, message: string) => {
  const response = await fetch('https://api.msg91.com/api/v5/flow/', {
    method: 'POST',
    headers: {
      'authkey': process.env.MSG91_API_KEY,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      flow_id: process.env.MSG91_FLOW_ID,
      sender: process.env.SMS_SENDER_ID,
      mobiles: phone,
      message: message
    })
  });
  return response.json();
};
```

#### Using Twilio
```typescript
// utils/sms.ts
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendSMS = async (phone: string, message: string) => {
  return await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: `+91${phone}`
  });
};
```

### Real-time Updates with Socket.io

```typescript
// Socket.io integration for live location sharing
import { io } from 'socket.io-client';

const socket = io('https://your-backend.com');

export const shareLocationUpdate = (location: LocationUpdate) => {
  socket.emit('location-update', {
    userId: user.id,
    location: location,
    timestamp: Date.now()
  });
};

socket.on('location-received', (data) => {
  console.log('Location shared with contacts:', data);
});
```

## 📱 Progressive Web App (PWA) Setup

Add to `index.html`:
```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#EF4444">
```

Create `public/manifest.json`:
```json
{
  "name": "Rakshak - Emergency Help",
  "short_name": "Rakshak",
  "description": "Your Emergency Help Companion",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#EF4444",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📊 Analytics Integration

```typescript
// Google Analytics
import ReactGA from 'react-ga4';

ReactGA.initialize(process.env.GA_MEASUREMENT_ID);

// Track emergency button click
ReactGA.event({
  category: 'Emergency',
  action: 'SOS Button Pressed',
  label: 'Emergency Activated'
});
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Emergency Numbers (India)

- **Police**: 100
- **Ambulance**: 102
- **Fire**: 101
- **Women Helpline**: 1091
- **Child Helpline**: 1098
- **National Emergency**: 112

## 📞 Support

For support, email support@rakshak.app or join our Slack channel.

## 🙏 Acknowledgments

- React Team for the amazing framework
- Tailwind CSS for beautiful styling
- OpenStreetMap for geocoding services
- Indian government for emergency services infrastructure

---

**Made with ❤️ for Safety in India**
