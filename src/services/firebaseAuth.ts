import { 
  signInWithPhoneNumber, 
  RecaptchaVerifier, 
  ConfirmationResult,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '@/config/firebase';

let recaptchaVerifier: RecaptchaVerifier | null = null;
let confirmationResult: ConfirmationResult | null = null;

/**
 * Initialize reCAPTCHA verifier for phone authentication
 */
export const initializeRecaptcha = (containerId: string): any => {
  if (recaptchaVerifier) {
    return recaptchaVerifier;
  }

  recaptchaVerifier = new (RecaptchaVerifier as any)(
    containerId,
    {
      size: 'invisible',
      callback: () => {
        console.log('reCAPTCHA verified');
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired');
      }
    },
    auth
  );

  return recaptchaVerifier;
};

// Check if Firebase is properly configured
export const isFirebaseConfigured = (): boolean => {
  try {
    return !!(
      auth.app.options.apiKey &&
      auth.app.options.authDomain &&
      auth.app.options.projectId
    );
  } catch {
    return false;
  }
};

/**
 * Send OTP to phone number using Firebase Phone Authentication
 */
export const sendOTPViaFirebase = async (phoneNumber: string): Promise<boolean> => {
  try {
    // Ensure phone number has country code
    const formattedPhone = phoneNumber.startsWith('+91') 
      ? phoneNumber 
      : `+91${phoneNumber}`;

    // Initialize reCAPTCHA if not already done
    if (!recaptchaVerifier) {
      initializeRecaptcha('recaptcha-container');
    }

    // Send OTP
    if (!recaptchaVerifier) {
      throw new Error('reCAPTCHA not initialized');
    }
    
    confirmationResult = await signInWithPhoneNumber(
      auth, 
      formattedPhone, 
      recaptchaVerifier as any
    );

    console.log('OTP sent successfully');
    return true;
  } catch (error: any) {
    console.error('Error sending OTP:', error);
    
    // Reset reCAPTCHA on error
    if (recaptchaVerifier) {
      recaptchaVerifier.clear();
      recaptchaVerifier = null;
    }
    
    throw new Error(error.message || 'Failed to send OTP');
  }
};

/**
 * Verify OTP code
 */
export const verifyOTPViaFirebase = async (code: string): Promise<FirebaseUser | null> => {
  try {
    if (!confirmationResult) {
      throw new Error('No confirmation result. Please request OTP first.');
    }

    const result = await confirmationResult.confirm(code);
    console.log('User signed in successfully:', result.user);
    
    return result.user;
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    throw new Error(error.message || 'Invalid OTP code');
  }
};

/**
 * Sign out current user
 */
export const signOutFirebase = async (): Promise<void> => {
  try {
    await signOut(auth);
    console.log('User signed out successfully');
  } catch (error: any) {
    console.error('Error signing out:', error);
    throw new Error(error.message || 'Failed to sign out');
  }
};

/**
 * Listen to authentication state changes
 */
export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Get current user
 */
export const getCurrentFirebaseUser = (): FirebaseUser | null => {
  return auth.currentUser;
};
