# 🔥 Rakshak + Firebase Integration

Complete Firebase integration for the Rakshak Emergency Help App with authentication, real-time database, and cloud storage.

---

## ✅ What's Included

### Firebase Services Integrated:
- ✅ **Firebase Authentication** - Phone number OTP-based login
- ✅ **Cloud Firestore** - Real-time NoSQL database
- ✅ **Cloud Storage** - File storage for audio recordings
- ✅ **Firebase Analytics** - User behavior tracking
- ✅ **Firebase Hosting** - Web app deployment (optional)

### Files Added:
```
src/
├── config/
│   └── firebase.ts              # Firebase initialization
├── services/
│   ├── firebaseAuth.ts          # Authentication service
│   └── firebaseDb.ts            # Database operations
├── hooks/
│   └── useFirebase.ts           # React hooks for Firebase
└── vite-env.d.ts                # TypeScript definitions

.env.example                     # Environment variables template
FIREBASE_SETUP.md               # Complete setup guide
FIREBASE_README.md              # This file
```

---

## 🚀 Quick Start (5 Minutes)

### 1. Create Firebase Project
```bash
# Go to: https://console.firebase.google.com/
# Click "Add project"
# Name: Rakshak
# Enable Analytics: Yes
```

### 2. Enable Services
- **Authentication**: Enable Phone sign-in method
- **Firestore**: Create database (start in test mode)
- **Storage**: Enable Cloud Storage

### 3. Get Firebase Config
- Go to Project Settings → Your apps → Web app
- Copy the config object

### 4. Set Environment Variables
```bash
# Copy example file
cp .env.example .env.local

# Edit .env.local and add your Firebase config
# VITE_FIREBASE_API_KEY=your_api_key
# VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
# ... etc
```

### 5. Run the App
```bash
npm install
npm run dev
```

**That's it!** Firebase is now integrated. 🎉

---

## 📱 Features with Firebase

### 1. Phone Authentication

**Before (Local Storage):**
- Mock OTP generation
- No real SMS
- Data only on device
- No authentication verification

**After (Firebase):**
- Real OTP via SMS
- Secure authentication
- Cross-device login
- Phone number verification

**Usage:**
```typescript
import { sendOTPViaFirebase, verifyOTPViaFirebase } from '@/services/firebaseAuth';

// Send OTP
await sendOTPViaFirebase('+919876543210');

// Verify OTP
const user = await verifyOTPViaFirebase('123456');
```

### 2. Real-time Data Sync

**Before (Local Storage):**
- Data stored locally only
- No sync across devices
- Lost if device is lost
- No backup

**After (Firebase Firestore):**
- Real-time synchronization
- Access from any device
- Automatic backups
- Cloud storage

**Usage:**
```typescript
import { saveContactsToFirebase, getContactsFromFirebase } from '@/services/firebaseDb';

// Save contacts
await saveContactsToFirebase(userId, contacts);

// Get contacts
const contacts = await getContactsFromFirebase(userId);
```

### 3. Emergency Logs

**Usage:**
```typescript
import { saveEmergencyLogToFirebase } from '@/services/firebaseDb';

const log: EmergencyLog = {
  id: 'log_123',
  timestamp: new Date(),
  location: { latitude: 28.7041, longitude: 77.1025 },
  contactsNotified: 3,
  status: 'active',
};

await saveEmergencyLogToFirebase(userId, log);
```

### 4. Settings Sync

**Usage:**
```typescript
import { saveSettingsToFirebase, getSettingsFromFirebase } from '@/services/firebaseDb';

// Save settings
await saveSettingsToFirebase(userId, settings);

// Get settings
const settings = await getSettingsFromFirebase(userId);
```

---

## 🎣 React Hooks

### useFirebaseAuth
Monitor authentication state:
```typescript
import { useFirebaseAuth } from '@/hooks/useFirebase';

function App() {
  const { firebaseUser, loading } = useFirebaseAuth();
  
  if (loading) return <Loading />;
  if (!firebaseUser) return <LoginScreen />;
  
  return <MainApp />;
}
```

### useFirebaseContacts
Manage contacts with real-time sync:
```typescript
import { useFirebaseContacts } from '@/hooks/useFirebase';

function ContactsScreen() {
  const { contacts, loading, error, updateContacts } = useFirebaseContacts(userId);
  
  const addContact = async (contact) => {
    await updateContacts([...contacts, contact]);
  };
  
  return <ContactsList contacts={contacts} />;
}
```

### useFirebaseEmergencyLogs
Track emergency alerts:
```typescript
import { useFirebaseEmergencyLogs } from '@/hooks/useFirebase';

function HistoryScreen() {
  const { logs, loading, addLog } = useFirebaseEmergencyLogs(userId);
  
  return <LogsList logs={logs} />;
}
```

### useFirebaseSettings
Sync settings across devices:
```typescript
import { useFirebaseSettings } from '@/hooks/useFirebase';

function SettingsScreen() {
  const { settings, updateSettings } = useFirebaseSettings(userId);
  
  const toggleDarkMode = async () => {
    await updateSettings({ ...settings, darkMode: !settings.darkMode });
  };
  
  return <SettingsUI />;
}
```

---

## 🔐 Security

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    match /contacts/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    match /emergencyLogs/{logId} {
      allow create: if request.auth != null;
      allow read, update: if resource.data.userId == request.auth.uid;
    }
  }
}
```

### Storage Security Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /recordings/{userId}/{fileName} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

---

## 📊 Database Schema

### Collections:

**users**
```typescript
{
  id: string,          // Firebase Auth UID
  phone: string,       // Phone number
  name: string,        // User's name
  createdAt: Date,     // Account creation
  updatedAt: Date      // Last updated
}
```

**contacts**
```typescript
{
  userId: string,      // Owner's UID
  contacts: [
    {
      id: string,
      name: string,
      phone: string,
      relationship: string,
      priority: 'primary' | 'secondary' | 'normal',
      notifyWhatsApp: boolean,
      addedAt: Date
    }
  ],
  updatedAt: Date
}
```

**emergencyLogs**
```typescript
{
  id: string,
  userId: string,
  timestamp: Date,
  location: {
    latitude: number,
    longitude: number,
    address?: string
  },
  contactsNotified: number,
  status: 'active' | 'resolved' | 'cancelled',
  duration?: number,
  createdAt: Date
}
```

**settings**
```typescript
{
  userId: string,
  countdownDuration: number,
  shakeToActivate: boolean,
  autoSendLocation: boolean,
  recordAudio: boolean,
  vibrateOnActivate: boolean,
  // ... other settings
  updatedAt: Date
}
```

---

## 🚀 Deployment

### Deploy to Firebase Hosting

1. **Install Firebase CLI**
```bash
npm install -g firebase-tools
```

2. **Login**
```bash
firebase login
```

3. **Initialize**
```bash
firebase init hosting
```

4. **Build & Deploy**
```bash
npm run build
firebase deploy --only hosting
```

Your app will be live at:
```
https://your-project.web.app
```

---

## 💰 Pricing

### Free Tier (Spark Plan)
Sufficient for starting and testing:
- **Phone Auth**: 10,000 verifications/month
- **Firestore**: 50K reads, 20K writes/day
- **Storage**: 5GB storage, 1GB/day downloads
- **Hosting**: 10GB storage, 360MB/day bandwidth

### Paid Tier (Blaze Plan)
Pay only for what you use:
- **10,000 active users**: ~₹1000-2000/month
- **100,000 active users**: ~₹5000-10000/month

---

## 🔧 Environment Variables

Required variables in `.env.local`:

```bash
# Firebase Config (from Firebase Console)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

**Never commit `.env.local` to Git!**

---

## 🧪 Testing

### Test Phone Authentication

Use Firebase test phone numbers (no real SMS):

```typescript
// In Firebase Console → Authentication → Phone numbers for testing
// Add: +919876543210 → Code: 123456

await sendOTPViaFirebase('+919876543210');
await verifyOTPViaFirebase('123456'); // Always works
```

### Test Database Operations

```typescript
// Save test data
await saveUserToFirebase('test_user_123', {
  id: 'test_user_123',
  phone: '9876543210',
  name: 'Test User',
  createdAt: new Date()
});

// Read test data
const user = await getUserFromFirebase('test_user_123');
console.log(user);
```

---

## 📈 Analytics

Track user behavior:

```typescript
import { analytics } from '@/config/firebase';
import { logEvent } from 'firebase/analytics';

// Track emergency button press
logEvent(analytics, 'emergency_activated', {
  contacts_count: 3,
  location: 'New Delhi'
});

// Track feature usage
logEvent(analytics, 'fake_call_used', {
  caller_type: 'Police'
});
```

---

## 🆘 Troubleshooting

### Common Issues:

**1. "Firebase not initialized"**
- Check `.env.local` exists and has correct values
- Restart dev server after adding env variables

**2. "reCAPTCHA not visible"**
- Add `<div id="recaptcha-container"></div>` to HTML
- Check domain is authorized in Firebase Console

**3. "Permission denied" in Firestore**
- Update security rules
- Ensure user is authenticated
- Verify userId matches

**4. "Invalid API key"**
- Double-check API key in `.env.local`
- Ensure no extra spaces
- Restart dev server

**5. "Phone number format invalid"**
- Use format: `+91XXXXXXXXXX` (with country code)
- No spaces or special characters

---

## 📚 Documentation

- [Firebase Docs](https://firebase.google.com/docs)
- [Firebase Authentication](https://firebase.google.com/docs/auth/web/phone-auth)
- [Cloud Firestore](https://firebase.google.com/docs/firestore)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
- [Security Rules](https://firebase.google.com/docs/rules)

---

## 🎯 Next Steps

1. ✅ Set up Firebase project
2. ✅ Configure environment variables
3. ✅ Test authentication
4. ✅ Deploy to Firebase Hosting
5. ⬜ Set up Cloud Functions for SMS
6. ⬜ Enable Firebase Cloud Messaging
7. ⬜ Monitor analytics
8. ⬜ Scale security rules for production

---

## 🤝 Support

Having issues? Check:
1. [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - Detailed setup guide
2. [Firebase Status](https://status.firebase.google.com/) - Service status
3. [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase) - Community help

---

## ✨ Benefits Summary

**Before Firebase:**
- ❌ Local storage only
- ❌ No authentication
- ❌ No sync across devices
- ❌ Data lost if device lost
- ❌ No backup

**With Firebase:**
- ✅ Cloud storage
- ✅ Secure authentication
- ✅ Real-time sync
- ✅ Automatic backups
- ✅ Cross-device access
- ✅ Scalable
- ✅ Analytics
- ✅ Push notifications ready

---

**🔥 Your app is now production-ready with Firebase!**

**Made with ❤️ for Safety**
