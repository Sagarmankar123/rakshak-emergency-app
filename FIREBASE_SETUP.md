# 🔥 Firebase Integration Guide - Rakshak

Complete guide to set up Firebase for the Rakshak Emergency Help App.

---

## 🎯 What Firebase Provides

### Services Used:
1. **Firebase Authentication** - Phone number OTP login
2. **Cloud Firestore** - Real-time database for user data
3. **Cloud Storage** - Store audio recordings & media
4. **Firebase Analytics** - Track app usage & events
5. **Firebase Hosting** - Host the web app (optional)
6. **Cloud Functions** - Send SMS, push notifications (optional)

---

## 📋 Prerequisites

- Google Account
- Firebase project (free tier is sufficient for starting)
- Node.js installed (v18+)

---

## 🚀 Step-by-Step Setup

### Step 1: Create Firebase Project

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Click "Add project"

2. **Create Project**
   ```
   Project name: Rakshak
   Enable Google Analytics: Yes (recommended)
   Select Analytics location: India
   ```

3. **Wait for project creation** (~30 seconds)

### Step 2: Enable Firebase Services

#### A. Authentication Setup

1. In Firebase Console, go to **Build → Authentication**
2. Click **Get started**
3. Go to **Sign-in method** tab
4. Enable **Phone** authentication
   - Click on "Phone"
   - Toggle to **Enable**
   - Click **Save**

5. **Test phone numbers** (for development):
   - Scroll down to "Phone numbers for testing"
   - Add test number: `+919876543210`
   - Add test code: `123456`
   - This lets you test without real SMS

#### B. Firestore Database Setup

1. Go to **Build → Firestore Database**
2. Click **Create database**
3. Select **Start in test mode** (for now)
   ```
   Location: asia-south1 (Mumbai)
   ```
4. Click **Enable**

5. **Security Rules** (Update after setup):
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can only read/write their own data
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       match /contacts/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       match /emergencyLogs/{logId} {
         allow create: if request.auth != null;
         allow read, update: if request.auth != null && 
           resource.data.userId == request.auth.uid;
       }
       
       match /settings/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

#### C. Storage Setup (for audio recordings)

1. Go to **Build → Storage**
2. Click **Get started**
3. Start in **test mode**
4. Select location: **asia-south1 (Mumbai)**
5. Click **Done**

6. **Security Rules**:
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /recordings/{userId}/{fileName} {
         allow read, write: if request.auth != null && 
           request.auth.uid == userId;
       }
     }
   }
   ```

### Step 3: Register Web App

1. In Firebase Console, click the **Web icon** (</> symbol)
2. Register app:
   ```
   App nickname: Rakshak Web
   ✅ Also set up Firebase Hosting
   ```
3. Click **Register app**

4. **Copy Firebase Config** - You'll get something like:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
     authDomain: "rakshak-xxxxx.firebaseapp.com",
     projectId: "rakshak-xxxxx",
     storageBucket: "rakshak-xxxxx.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdefghijklmnop",
     measurementId: "G-XXXXXXXXXX"
   };
   ```

### Step 4: Configure Environment Variables

1. **Create `.env.local` file** in project root:
   ```bash
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   VITE_FIREBASE_AUTH_DOMAIN=rakshak-xxxxx.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=rakshak-xxxxx
   VITE_FIREBASE_STORAGE_BUCKET=rakshak-xxxxx.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:abcdefghijklmnop
   VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

2. **Add to `.gitignore`** (to keep secrets safe):
   ```
   .env.local
   .env.*.local
   ```

### Step 5: Initialize Firebase in Your App

The Firebase configuration is already set up in:
- `src/config/firebase.ts` - Firebase initialization
- `src/services/firebaseAuth.ts` - Authentication service
- `src/services/firebaseDb.ts` - Database operations

### Step 6: Update LoginScreen Component

Update `src/components/LoginScreen.tsx` to use Firebase authentication instead of mock OTP.

Replace these imports:
```typescript
import { sendOTP, verifyOTP, validateIndianPhone, authenticateUser } from '@/utils/auth';
```

With:
```typescript
import { validateIndianPhone } from '@/utils/auth';
import { sendOTPViaFirebase, verifyOTPViaFirebase, initializeRecaptcha } from '@/services/firebaseAuth';
import { saveUserToFirebase } from '@/services/firebaseDb';
```

### Step 7: Test Firebase Integration

1. **Start development server**:
   ```bash
   npm run dev
   ```

2. **Test phone authentication**:
   - Use test number: +919876543210
   - Enter test OTP: 123456
   - Should sign in successfully

3. **Check Firestore**:
   - Go to Firebase Console → Firestore Database
   - You should see collections created: `users`, `contacts`, etc.

---

## 📊 Database Schema

### Collections Structure:

#### 1. **users** collection
```javascript
{
  id: "user_uid",
  phone: "9876543210",
  name: "John Doe",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### 2. **contacts** collection
```javascript
{
  userId: "user_uid",
  contacts: [
    {
      id: "contact_1",
      name: "Emergency Contact",
      phone: "9876543210",
      relationship: "Parent",
      priority: "primary",
      notifyWhatsApp: true,
      addedAt: Timestamp
    }
  ],
  updatedAt: Timestamp
}
```

#### 3. **emergencyLogs** collection
```javascript
{
  id: "log_id",
  userId: "user_uid",
  timestamp: Timestamp,
  location: {
    latitude: 28.7041,
    longitude: 77.1025,
    address: "New Delhi, India"
  },
  contactsNotified: 3,
  status: "resolved",
  duration: 120,
  createdAt: Timestamp
}
```

#### 4. **settings** collection
```javascript
{
  userId: "user_uid",
  countdownDuration: 3,
  shakeToActivate: false,
  autoSendLocation: true,
  recordAudio: true,
  vibrateOnActivate: true,
  updatedAt: Timestamp
}
```

---

## 🔐 Security Best Practices

### 1. Environment Variables
Never commit Firebase config to Git:
```bash
# .gitignore
.env
.env.local
.env.production
.env.*.local
```

### 2. Firestore Security Rules
Update to production rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    // Users
    match /users/{userId} {
      allow read: if isAuthenticated() && isOwner(userId);
      allow create: if isAuthenticated() && isOwner(userId);
      allow update: if isAuthenticated() && isOwner(userId);
      allow delete: if isAuthenticated() && isOwner(userId);
    }
    
    // Contacts
    match /contacts/{userId} {
      allow read, write: if isAuthenticated() && isOwner(userId);
    }
    
    // Emergency Logs
    match /emergencyLogs/{logId} {
      allow create: if isAuthenticated();
      allow read: if isAuthenticated() && 
        resource.data.userId == request.auth.uid;
      allow update: if isAuthenticated() && 
        resource.data.userId == request.auth.uid;
    }
    
    // Settings
    match /settings/{userId} {
      allow read, write: if isAuthenticated() && isOwner(userId);
    }
  }
}
```

### 3. Storage Security Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Audio recordings
    match /recordings/{userId}/{fileName} {
      allow read, write: if request.auth != null && 
        request.auth.uid == userId;
      allow delete: if request.auth != null && 
        request.auth.uid == userId;
    }
  }
}
```

---

## 💰 Firebase Pricing

### Free Tier (Spark Plan) - Sufficient for starting

**Authentication:**
- Phone Auth: 10,000 verifications/month (free)

**Firestore:**
- 1 GB storage
- 50,000 reads/day
- 20,000 writes/day
- 20,000 deletes/day

**Storage:**
- 5 GB storage
- 1 GB/day downloads

**Hosting:**
- 10 GB storage
- 360 MB/day bandwidth

### Paid Tier (Blaze Plan) - Pay as you go

Only pay when you exceed free limits.

**Estimate for 10,000 users:**
- Phone Auth: ₹300-500/month
- Firestore: ₹500-1000/month
- Storage: ₹200-400/month
- **Total: ~₹1000-2000/month**

---

## 🚀 Deployment to Firebase Hosting

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Initialize Firebase Hosting
```bash
firebase init hosting
```

Select:
- Use existing project: Rakshak
- Public directory: `dist`
- Configure as SPA: `Yes`
- Set up automatic builds: `No`

### 4. Build and Deploy
```bash
# Build the app
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

Your app will be live at:
```
https://rakshak-xxxxx.web.app
```

---

## 🔔 Optional: Firebase Cloud Messaging (Push Notifications)

### 1. Enable Cloud Messaging
1. Go to **Project Settings → Cloud Messaging**
2. Generate **Web Push certificates**
3. Copy VAPID key

### 2. Add to environment
```bash
VITE_FIREBASE_VAPID_KEY=your_vapid_key
```

### 3. Request permission
```typescript
import { getMessaging, getToken } from 'firebase/messaging';

const messaging = getMessaging();
const token = await getToken(messaging, { 
  vapidKey: 'YOUR_VAPID_KEY' 
});
```

---

## 📧 Optional: Cloud Functions for SMS

### 1. Install Firebase Functions
```bash
firebase init functions
```

### 2. Create SMS function
```javascript
// functions/src/index.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const sendEmergencySMS = functions.firestore
  .document('emergencyLogs/{logId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    
    // Get user's contacts
    const contactsSnap = await admin.firestore()
      .collection('contacts')
      .doc(data.userId)
      .get();
    
    const contacts = contactsSnap.data()?.contacts || [];
    
    // Send SMS to each contact
    // Use Twilio, MSG91, or other SMS service
    
    return null;
  });
```

### 3. Deploy functions
```bash
firebase deploy --only functions
```

---

## 🧪 Testing

### Test Authentication
```typescript
// In browser console
import { sendOTPViaFirebase, verifyOTPViaFirebase } from './services/firebaseAuth';

// Send OTP
await sendOTPViaFirebase('+919876543210');

// Verify (use test code 123456)
await verifyOTPViaFirebase('123456');
```

### Test Database
```typescript
import { saveContactsToFirebase, getContactsFromFirebase } from './services/firebaseDb';

// Save contacts
await saveContactsToFirebase('user_id', contacts);

// Get contacts
const contacts = await getContactsFromFirebase('user_id');
```

---

## 📚 Resources

### Official Documentation
- [Firebase Docs](https://firebase.google.com/docs)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Cloud Firestore](https://firebase.google.com/docs/firestore)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)

### Video Tutorials
- [Firebase Crash Course](https://www.youtube.com/watch?v=q5J5ho7YUhA)
- [Phone Authentication](https://www.youtube.com/watch?v=1r-F3FIONl8)

### Community
- [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase)
- [Firebase Community](https://firebase.google.com/community)

---

## ⚠️ Troubleshooting

### Common Issues:

**1. reCAPTCHA not showing**
- Add `<div id="recaptcha-container"></div>` to your HTML
- Check if domain is authorized in Firebase Console

**2. Phone auth not working**
- Verify phone number format: +91XXXXXXXXXX
- Check Firebase Authentication is enabled
- Verify quota limits

**3. Firestore permission denied**
- Update security rules
- Check user is authenticated
- Verify userId matches

**4. CORS errors**
- Add your domain to authorized domains in Firebase Console
- Check authentication redirect URIs

---

## 🎉 You're All Set!

Your Rakshak app is now connected to Firebase with:
- ✅ Phone authentication
- ✅ Real-time database
- ✅ Cloud storage
- ✅ Analytics
- ✅ Hosting ready

**Next steps:**
1. Test authentication flow
2. Verify data is saving to Firestore
3. Deploy to Firebase Hosting
4. Monitor usage in Firebase Console

---

**Need help?** Check the [Firebase Status Dashboard](https://status.firebase.google.com/)

**Made with ❤️ for Safety**
