import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
// Values are read from Vite env variables, and fall back to your provided Firebase config.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBrmUXDxwScI5oJqBpetx7SOEsZVRrynIw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "rakshak-640ba.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "rakshak-640ba",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "rakshak-640ba.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "36413583630",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:36413583630:web:80a5097995a635f1f9a75f",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || undefined,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (only in production and browser environment)
export let analytics: any = null;
if (typeof window !== 'undefined' && import.meta.env.PROD) {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Analytics initialization failed:', error);
  }
}
