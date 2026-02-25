import { useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { onAuthStateChange } from '@/services/firebaseAuth';
import {
  getUserFromFirebase,
  getContactsFromFirebase,
  getEmergencyLogsFromFirebase,
  getSettingsFromFirebase,
  saveUserToFirebase,
  saveContactsToFirebase,
  saveEmergencyLogToFirebase,
  saveSettingsToFirebase,
} from '@/services/firebaseDb';
import { User, TrustedContact, EmergencyLog } from '@/types';
import { AppSettings } from '@/utils/storage';

export const useFirebaseAuth = () => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setFirebaseUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { firebaseUser, loading };
};

export const useFirebaseUser = (userId: string | null) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await getUserFromFirebase(userId);
        setUser(userData);
        setError(null);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const updateUser = async (userData: User) => {
    if (!userId) return;
    
    try {
      await saveUserToFirebase(userId, userData);
      setUser(userData);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return { user, loading, error, updateUser };
};

export const useFirebaseContacts = (userId: string | null) => {
  const [contacts, setContacts] = useState<TrustedContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchContacts = async () => {
      try {
        setLoading(true);
        const contactsData = await getContactsFromFirebase(userId);
        setContacts(contactsData);
        setError(null);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching contacts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [userId]);

  const updateContacts = async (newContacts: TrustedContact[]) => {
    if (!userId) return;
    
    try {
      await saveContactsToFirebase(userId, newContacts);
      setContacts(newContacts);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return { contacts, loading, error, updateContacts };
};

export const useFirebaseEmergencyLogs = (userId: string | null) => {
  const [logs, setLogs] = useState<EmergencyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchLogs = async () => {
      try {
        setLoading(true);
        const logsData = await getEmergencyLogsFromFirebase(userId);
        setLogs(logsData);
        setError(null);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching emergency logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [userId]);

  const addLog = async (log: EmergencyLog) => {
    if (!userId) return;
    
    try {
      const logId = await saveEmergencyLogToFirebase(userId, log);
      setLogs(prev => [{ ...log, id: logId }, ...prev]);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return { logs, loading, error, addLog };
};

export const useFirebaseSettings = (userId: string | null) => {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchSettings = async () => {
      try {
        setLoading(true);
        const settingsData = await getSettingsFromFirebase(userId);
        setSettings(settingsData);
        setError(null);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [userId]);

  const updateSettings = async (newSettings: AppSettings) => {
    if (!userId) return;
    
    try {
      await saveSettingsToFirebase(userId, newSettings);
      setSettings(newSettings);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return { settings, loading, error, updateSettings };
};
