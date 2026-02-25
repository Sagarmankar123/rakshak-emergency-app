import { TrustedContact, EmergencyLog, User } from '@/types';

const STORAGE_KEYS = {
  USER: 'rakshak_user',
  CONTACTS: 'rakshak_contacts',
  LOGS: 'rakshak_logs',
  THEME: 'rakshak_theme',
  AUTH_TOKEN: 'rakshak_auth_token',
  SETTINGS: 'rakshak_settings',
};

export interface AppSettings {
  countdownDuration: number;
  shakeToActivate: boolean;
  autoSendLocation: boolean;
  recordAudio: boolean;
  vibrateOnActivate: boolean;
  keepScreenOn: boolean;
  soundNotifications: boolean;
  showOnLockScreen: boolean;
  batteryOptimization: boolean;
  darkMode?: boolean;
}

// Encryption simulation (in production, use proper encryption)
const encrypt = (data: string): string => {
  return btoa(data); // Base64 encoding (use proper encryption in production)
};

const decrypt = (data: string): string => {
  return atob(data);
};

export const storage = {
  // User
  setUser: (user: User) => {
    localStorage.setItem(STORAGE_KEYS.USER, encrypt(JSON.stringify(user)));
  },
  
  getUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    if (!data) return null;
    try {
      return JSON.parse(decrypt(data));
    } catch {
      return null;
    }
  },
  
  clearUser: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  },
  
  // Contacts
  setContacts: (contacts: TrustedContact[]) => {
    localStorage.setItem(STORAGE_KEYS.CONTACTS, encrypt(JSON.stringify(contacts)));
  },
  
  getContacts: (): TrustedContact[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CONTACTS);
    if (!data) return [];
    try {
      return JSON.parse(decrypt(data));
    } catch {
      return [];
    }
  },
  
  // Emergency Logs
  setLogs: (logs: EmergencyLog[]) => {
    localStorage.setItem(STORAGE_KEYS.LOGS, encrypt(JSON.stringify(logs)));
  },
  
  getLogs: (): EmergencyLog[] => {
    const data = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (!data) return [];
    try {
      return JSON.parse(decrypt(data));
    } catch {
      return [];
    }
  },
  
  addLog: (log: EmergencyLog) => {
    const logs = storage.getLogs();
    logs.unshift(log);
    storage.setLogs(logs);
  },
  
  // Theme
  setTheme: (theme: 'light' | 'dark') => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },
  
  getTheme: (): 'light' | 'dark' => {
    return (localStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark') || 'light';
  },
  
  // Auth Token
  setAuthToken: (token: string) => {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  },
  
  getAuthToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  // App Settings
  setSettings: (settings: AppSettings) => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, encrypt(JSON.stringify(settings)));
  },

  getSettings: (): AppSettings | null => {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) return null;
    try {
      return JSON.parse(decrypt(data));
    } catch {
      return null;
    }
  },
};
