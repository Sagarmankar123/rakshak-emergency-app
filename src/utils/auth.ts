import { User } from '@/types';
import { storage } from './storage';

// Simple password hash simulation (use a secure hash like bcrypt in production)
const hashPassword = (password: string): string => {
  // Basic reversible hash using btoa – NOT for real production use
  return btoa(password.split('').reverse().join(''));
};

export const verifyPassword = (password: string, hash: string): boolean => {
  return hash === hashPassword(password);
};

// Simulate OTP generation (used as a fallback when Firebase is not available)
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Simulate sending OTP (kept for backward compatibility / non-Firebase flows)
export const sendOTP = async (phone: string): Promise<{ success: boolean; otp?: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const otp = generateOTP();
      console.log(`OTP for ${phone}: ${otp}`);
      // In production, send via SMS API
      resolve({ success: true, otp });
    }, 1000);
  });
};

// Validate phone number (Indian format)
export const validateIndianPhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

// Verify OTP (legacy helper kept for non-Firebase flows)
export const verifyOTP = async (_phone: string, otp: string, sentOTP: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(otp === sentOTP);
    }, 500);
  });
};

// Generate JWT token (simulated)
export const generateToken = (userId: string): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ 
    userId, 
    iat: Date.now(),
    exp: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
  }));
  const signature = btoa(`${header}.${payload}.secret`);
  return `${header}.${payload}.${signature}`;
};

// Local user registration with phone, password and OTP already verified
export const registerUser = async (phone: string, password: string, name: string): Promise<User> => {
  // In a real app, you would check a database. 
  // For this local simulation, we'll allow multiple registrations or overwrite.
  // But let's check if the phone is already in use by the currently "stored" user if we want to be strict.
  const existing = storage.getUser();
  if (existing && existing.phone === phone) {
    throw new Error('User already registered with this phone number');
  }

  const newUser: User = {
    id: `user_${Date.now()}`,
    phone,
    name,
    createdAt: new Date(),
    passwordHash: hashPassword(password),
    isVerified: true, // No longer requiring OTP verification
    lastLoginAt: new Date(),
  };

  storage.setUser(newUser);
  const token = generateToken(newUser.id);
  storage.setAuthToken(token);
  return newUser;
};

// Local login using phone and password
export const loginUser = async (phone: string, password: string): Promise<User> => {
  const user = storage.getUser();

  if (!user || user.phone !== phone || !user.passwordHash) {
    throw new Error('Account not found. Please register first.');
  }

  if (!verifyPassword(password, user.passwordHash)) {
    throw new Error('Invalid phone or password');
  }

  const updatedUser: User = { ...user, lastLoginAt: new Date() };
  storage.setUser(updatedUser);

  const token = generateToken(updatedUser.id);
  storage.setAuthToken(token);
  return updatedUser;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = storage.getAuthToken();
  const user = storage.getUser();
  return !!(token && user);
};

// Logout
export const logout = () => {
  storage.clearUser();
};
