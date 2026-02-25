import { useState, useEffect } from 'react';
import { User } from '@/types';
import { logout } from '@/utils/auth';
import { storage } from '@/utils/storage';

interface EnhancedSettingsProps {
  user: User;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  onLogout: () => void;
}

interface AppSettings {
  countdownDuration: number;
  shakeToActivate: boolean;
  autoSendLocation: boolean;
  recordAudio: boolean;
  vibrateOnActivate: boolean;
  keepScreenOn: boolean;
  soundNotifications: boolean;
  showOnLockScreen: boolean;
  batteryOptimization: boolean;
}

export const EnhancedSettings = ({ user, theme, onThemeChange, onLogout }: EnhancedSettingsProps) => {
  const [settings, setSettings] = useState<AppSettings>({
    countdownDuration: 3,
    shakeToActivate: false,
    autoSendLocation: true,
    recordAudio: true,
    vibrateOnActivate: true,
    keepScreenOn: true,
    soundNotifications: true,
    showOnLockScreen: true,
    batteryOptimization: false,
  });

  useEffect(() => {
    const savedSettings = storage.getSettings();
    if (savedSettings) {
      setSettings(savedSettings);
    }
  }, []);

  const updateSetting = (key: keyof AppSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    storage.setSettings(newSettings);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      onLogout();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 pb-24">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
          Customize your Rakshak experience
        </p>
      </div>

      {/* Profile Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile</h3>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white">{user.name}</h4>
            <p className="text-gray-600 dark:text-gray-400">+91 {user.phone}</p>
            <button className="text-red-600 dark:text-red-400 text-sm font-medium mt-1">
              Edit Profile →
            </button>
          </div>
        </div>
      </div>

      {/* SOS Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🚨 SOS Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Countdown Duration</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Time before SOS activates</p>
            </div>
            <select
              value={settings.countdownDuration}
              onChange={(e) => updateSetting('countdownDuration', parseInt(e.target.value))}
              className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg"
            >
              <option value={0}>Instant (0 sec)</option>
              <option value={3}>3 seconds</option>
              <option value={5}>5 seconds</option>
              <option value={10}>10 seconds</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Shake to Activate</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Shake phone to trigger SOS</p>
            </div>
            <button
              onClick={() => updateSetting('shakeToActivate', !settings.shakeToActivate)}
              className={`w-14 h-8 rounded-full transition-colors ${
                settings.shakeToActivate ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow transform transition-transform ${
                settings.shakeToActivate ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Vibrate on Activate</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Phone vibration during SOS</p>
            </div>
            <button
              onClick={() => updateSetting('vibrateOnActivate', !settings.vibrateOnActivate)}
              className={`w-14 h-8 rounded-full transition-colors ${
                settings.vibrateOnActivate ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow transform transition-transform ${
                settings.vibrateOnActivate ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Features Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">⚙️ Features</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Auto-send Location</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Send location to contacts</p>
            </div>
            <button
              onClick={() => updateSetting('autoSendLocation', !settings.autoSendLocation)}
              className={`w-14 h-8 rounded-full transition-colors ${
                settings.autoSendLocation ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow transform transition-transform ${
                settings.autoSendLocation ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Audio Recording</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Record audio during emergency</p>
            </div>
            <button
              onClick={() => updateSetting('recordAudio', !settings.recordAudio)}
              className={`w-14 h-8 rounded-full transition-colors ${
                settings.recordAudio ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow transform transition-transform ${
                settings.recordAudio ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Keep Screen On</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Prevent screen from sleeping</p>
            </div>
            <button
              onClick={() => updateSetting('keepScreenOn', !settings.keepScreenOn)}
              className={`w-14 h-8 rounded-full transition-colors ${
                settings.keepScreenOn ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow transform transition-transform ${
                settings.keepScreenOn ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Sound Notifications</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Play sound during SOS</p>
            </div>
            <button
              onClick={() => updateSetting('soundNotifications', !settings.soundNotifications)}
              className={`w-14 h-8 rounded-full transition-colors ${
                settings.soundNotifications ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow transform transition-transform ${
                settings.soundNotifications ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🎨 Appearance</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Theme</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Choose your preferred theme</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onThemeChange('light')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  theme === 'light'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                ☀️ Light
              </button>
              <button
                onClick={() => onThemeChange('dark')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  theme === 'dark'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                🌙 Dark
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Battery Optimization */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🔋 Battery</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Battery Optimization</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Allow background activity</p>
            </div>
            <button
              onClick={() => updateSetting('batteryOptimization', !settings.batteryOptimization)}
              className={`w-14 h-8 rounded-full transition-colors ${
                settings.batteryOptimization ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow transform transition-transform ${
                settings.batteryOptimization ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex gap-3">
              <span className="text-2xl">💡</span>
              <div className="text-sm text-blue-800 dark:text-blue-400">
                <p className="font-semibold mb-1">Battery Saving Tip</p>
                <p>For reliable emergency alerts, disable battery optimization for Rakshak in your device settings.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">ℹ️ About</h3>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p><strong className="text-gray-900 dark:text-white">Version:</strong> 1.0.0</p>
          <p><strong className="text-gray-900 dark:text-white">Build:</strong> Production</p>
          <p><strong className="text-gray-900 dark:text-white">Last Updated:</strong> {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">💾 Data</h3>
        <div className="flex gap-3">
          <button className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600">
            Export Data
          </button>
          <button className="flex-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 py-2 rounded-lg font-medium hover:bg-red-200 dark:hover:bg-red-900/50">
            Clear History
          </button>
        </div>
      </div>

      {/* Logout */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
};
