import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  addDoc
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { TrustedContact, EmergencyLog, User } from '@/types';

// Collection names
const COLLECTIONS = {
  USERS: 'users',
  CONTACTS: 'contacts',
  EMERGENCY_LOGS: 'emergencyLogs',
  SETTINGS: 'settings',
};

/**
 * User operations
 */
export const saveUserToFirebase = async (userId: string, userData: User): Promise<void> => {
  try {
    await setDoc(doc(db, COLLECTIONS.USERS, userId), {
      ...userData,
      createdAt: Timestamp.fromDate(userData.createdAt),
      updatedAt: Timestamp.now(),
    });
    console.log('User saved to Firebase');
  } catch (error) {
    console.error('Error saving user:', error);
    throw error;
  }
};

export const getUserFromFirebase = async (userId: string): Promise<User | null> => {
  try {
    const docSnap = await getDoc(doc(db, COLLECTIONS.USERS, userId));
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        createdAt: data.createdAt.toDate(),
      } as User;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

/**
 * Contacts operations
 */
export const saveContactsToFirebase = async (
  userId: string, 
  contacts: TrustedContact[]
): Promise<void> => {
  try {
    const contactsData = contacts.map(contact => ({
      ...contact,
      addedAt: Timestamp.fromDate(contact.addedAt),
    }));
    
    await setDoc(doc(db, COLLECTIONS.CONTACTS, userId), {
      userId,
      contacts: contactsData,
      updatedAt: Timestamp.now(),
    });
    
    console.log('Contacts saved to Firebase');
  } catch (error) {
    console.error('Error saving contacts:', error);
    throw error;
  }
};

export const getContactsFromFirebase = async (userId: string): Promise<TrustedContact[]> => {
  try {
    const docSnap = await getDoc(doc(db, COLLECTIONS.CONTACTS, userId));
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.contacts.map((contact: any) => ({
        ...contact,
        addedAt: contact.addedAt.toDate(),
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error getting contacts:', error);
    throw error;
  }
};

/**
 * Emergency Logs operations
 */
export const saveEmergencyLogToFirebase = async (
  userId: string,
  log: EmergencyLog
): Promise<string> => {
  try {
    const logData = {
      userId,
      ...log,
      timestamp: Timestamp.fromDate(log.timestamp),
      createdAt: Timestamp.now(),
    };
    
    const docRef = await addDoc(collection(db, COLLECTIONS.EMERGENCY_LOGS), logData);
    console.log('Emergency log saved to Firebase');
    return docRef.id;
  } catch (error) {
    console.error('Error saving emergency log:', error);
    throw error;
  }
};

export const getEmergencyLogsFromFirebase = async (userId: string): Promise<EmergencyLog[]> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.EMERGENCY_LOGS),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(50)
    );
    
    const querySnapshot = await getDocs(q);
    const logs: EmergencyLog[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      logs.push({
        id: doc.id,
        timestamp: data.timestamp.toDate(),
        location: data.location,
        contactsNotified: data.contactsNotified,
        status: data.status,
        duration: data.duration,
      });
    });
    
    return logs;
  } catch (error) {
    console.error('Error getting emergency logs:', error);
    throw error;
  }
};

export const updateEmergencyLogStatus = async (
  logId: string,
  status: 'active' | 'resolved' | 'cancelled',
  duration?: number
): Promise<void> => {
  try {
    const updateData: any = {
      status,
      updatedAt: Timestamp.now(),
    };
    
    if (duration !== undefined) {
      updateData.duration = duration;
    }
    
    await updateDoc(doc(db, COLLECTIONS.EMERGENCY_LOGS, logId), updateData);
    console.log('Emergency log status updated');
  } catch (error) {
    console.error('Error updating emergency log:', error);
    throw error;
  }
};

/**
 * Settings operations
 */
export const saveSettingsToFirebase = async (
  userId: string,
  settings: any
): Promise<void> => {
  try {
    await setDoc(doc(db, COLLECTIONS.SETTINGS, userId), {
      userId,
      ...settings,
      updatedAt: Timestamp.now(),
    });
    console.log('Settings saved to Firebase');
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
};

export const getSettingsFromFirebase = async (userId: string): Promise<any | null> => {
  try {
    const docSnap = await getDoc(doc(db, COLLECTIONS.SETTINGS, userId));
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { userId: _, updatedAt, ...settings } = data;
      return settings;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting settings:', error);
    throw error;
  }
};

/**
 * Delete user data (GDPR compliance)
 */
export const deleteUserDataFromFirebase = async (userId: string): Promise<void> => {
  try {
    await Promise.all([
      deleteDoc(doc(db, COLLECTIONS.USERS, userId)),
      deleteDoc(doc(db, COLLECTIONS.CONTACTS, userId)),
      deleteDoc(doc(db, COLLECTIONS.SETTINGS, userId)),
    ]);
    
    // Delete emergency logs
    const q = query(
      collection(db, COLLECTIONS.EMERGENCY_LOGS),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    console.log('User data deleted from Firebase');
  } catch (error) {
    console.error('Error deleting user data:', error);
    throw error;
  }
};
