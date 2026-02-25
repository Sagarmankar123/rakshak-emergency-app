import { useState, useEffect } from 'react';
import { AppScreen, TrustedContact, User } from './types';
import { storage } from './utils/storage';
import { LoginScreen } from './components/LoginScreen';
import { useFirebaseAuth, useFirebaseUser, useFirebaseContacts, useFirebaseEmergencyLogs, useFirebaseSettings } from './hooks/useFirebase';
import { EmergencyButton } from './components/EmergencyButton';
import { ContactsManager } from './components/ContactsManager';
import { EmergencyHistory } from './components/EmergencyHistory';
import { FakeCall } from './components/FakeCall';
import { EnhancedSettings } from './components/EnhancedSettings';
import { EmergencyServices } from './components/EmergencyServices';
import { SafetyTips } from './components/SafetyTips';

export function App() {
  const { firebaseUser, loading: authLoading } = useFirebaseAuth();
  const { user: firebaseUserData } = useFirebaseUser(firebaseUser?.uid || null);
  const { contacts: firebaseContacts, updateContacts } = useFirebaseContacts(firebaseUser?.uid || null);
  const { logs: firebaseLogs, addLog } = useFirebaseEmergencyLogs(firebaseUser?.uid || null);
  const { settings: firebaseSettings, updateSettings } = useFirebaseSettings(firebaseUser?.uid || null);

  const [currentScreen, setCurrentScreen] = useState<AppScreen>('main');
  const [theme, setTheme] = useState<'light' | 'dark'>(storage.getTheme());

  useEffect(() => {
    if (firebaseSettings?.darkMode !== undefined) {
      setTheme(firebaseSettings.darkMode ? 'dark' : 'light');
    }
  }, [firebaseSettings]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    storage.setTheme(theme);
  }, [theme]);

  const handleLogout = () => {
    // Firebase signOut logic is handled in LoginScreen and by onAuthStateChange
    setCurrentScreen('main');
  };

  const handleContactsChange = (newContacts: TrustedContact[]) => {
    updateContacts(newContacts);
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    if (firebaseUser?.uid) {
      updateSettings({ 
        ...firebaseSettings, 
        darkMode: newTheme === 'dark' 
      } as any);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!firebaseUser) {
    return <LoginScreen onLogin={() => {}} />;
  }

  // Use firebase data if available, otherwise fallback to local/empty
  const displayUser: User = firebaseUserData || {
    id: firebaseUser.uid,
    phone: firebaseUser.phoneNumber?.replace('+91', '') || '',
    name: 'User',
    createdAt: new Date(),
  };

  const displayContacts = firebaseContacts || [];
  const displayLogs = firebaseLogs || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Rakshak</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Emergency Help</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right mr-2 hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{displayUser.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">+91 {displayUser.phone}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {displayUser.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        {currentScreen === 'main' && (
          <div className="py-4">
            <EmergencyButton 
              contacts={displayContacts} 
              userName={displayUser.name} 
              onLogAdd={addLog}
            />
          </div>
        )}
        {currentScreen === 'contacts' && (
          <div className="py-4">
            <ContactsManager contacts={displayContacts} onContactsChange={handleContactsChange} />
          </div>
        )}
        {currentScreen === 'history' && (
          <div className="py-4">
            <EmergencyHistory logs={displayLogs} />
          </div>
        )}
        {currentScreen === 'fake-call' && (
          <div className="py-4">
            <FakeCall />
          </div>
        )}
        {currentScreen === 'emergency-services' && (
          <div className="py-4">
            <EmergencyServices />
          </div>
        )}
        {currentScreen === 'safety-tips' && (
          <div className="py-4">
            <SafetyTips />
          </div>
        )}
        {currentScreen === 'settings' && (
          <div className="py-0">
            <EnhancedSettings 
              user={displayUser} 
              theme={theme} 
              onThemeChange={handleThemeChange}
              onLogout={handleLogout}
            />
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around py-2">
            <button
              onClick={() => setCurrentScreen('main')}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all ${
                currentScreen === 'main'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-xs mt-1 font-medium">SOS</span>
            </button>

            <button
              onClick={() => setCurrentScreen('emergency-services')}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all ${
                currentScreen === 'emergency-services'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-xs mt-1 font-medium">Services</span>
            </button>

            <button
              onClick={() => setCurrentScreen('contacts')}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all ${
                currentScreen === 'contacts'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-xs mt-1 font-medium">Contacts</span>
            </button>

            <button
              onClick={() => setCurrentScreen('fake-call')}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all ${
                currentScreen === 'fake-call'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-xs mt-1 font-medium">Fake Call</span>
            </button>

            <button
              onClick={() => setCurrentScreen('safety-tips')}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all ${
                currentScreen === 'safety-tips'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-xs mt-1 font-medium">Safety</span>
            </button>

            <button
              onClick={() => setCurrentScreen('history')}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all ${
                currentScreen === 'history'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs mt-1 font-medium">History</span>
            </button>

            <button
              onClick={() => setCurrentScreen('settings')}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all ${
                currentScreen === 'settings'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs mt-1 font-medium">Settings</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Bottom padding for fixed nav */}
      <div className="h-20"></div>
    </div>
  );
}
