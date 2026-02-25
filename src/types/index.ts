export interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  addedAt: Date;
  priority: 'primary' | 'secondary' | 'normal';
  notifyWhatsApp: boolean;
}

export interface EmergencyProfile {
  id: string;
  name: string;
  icon: string;
  color: string;
  isDefault: boolean;
}

export interface EmergencyService {
  id: string;
  name: string;
  number: string;
  icon: string;
  description: string;
  available: boolean;
}

export interface SafetyTip {
  id: string;
  title: string;
  description: string;
  category: string;
}

export interface QuickDialNumber {
  id: string;
  name: string;
  number: string;
  icon: string;
}

export interface EmergencyLog {
  id: string;
  timestamp: Date;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  contactsNotified: number;
  status: 'active' | 'resolved' | 'cancelled';
  duration?: number;
}

export interface User {
  id: string;
  phone: string;
  name: string;
  createdAt: Date;
  // Hashed password for local authentication (never store plain text)
  passwordHash?: string;
  // Whether the phone number has been verified via OTP
  isVerified?: boolean;
  // Last login timestamp (optional, for activity tracking)
  lastLoginAt?: Date;
}

export interface LocationUpdate {
  latitude: number;
  longitude: number;
  timestamp: Date;
  accuracy?: number;
}

export type AppScreen = 'login' | 'main' | 'contacts' | 'history' | 'settings' | 'fake-call' | 'emergency-services' | 'safety-tips';
