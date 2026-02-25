import { useState, useEffect } from 'react';
import { TrustedContact, EmergencyLog as EmergencyLogType } from '@/types';
import { getCurrentLocation, watchLocation, clearWatch, getAddressFromCoords } from '@/utils/location';
import { startSiren, stopSiren, toggleFlashlight, startRecording, stopRecording, sendEmergencySMS, vibrate, requestWakeLock, releaseWakeLock } from '@/utils/emergency';
import { storage } from '@/utils/storage';

interface EmergencyButtonProps {
  contacts: TrustedContact[];
  userName: string;
  onLogAdd?: (log: EmergencyLogType) => Promise<void>;
}

export const EmergencyButton = ({ contacts, userName, onLogAdd }: EmergencyButtonProps) => {
  const [isEmergency, setIsEmergency] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [locationWatchId, setLocationWatchId] = useState<number | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string>('');
  const [emergencyStartTime, setEmergencyStartTime] = useState<Date | null>(null);

  useEffect(() => {
    return () => {
      if (locationWatchId) {
        clearWatch(locationWatchId);
      }
      stopEmergency();
    };
  }, [locationWatchId]);

  const startCountdown = () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          activateEmergency();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const activateEmergency = async () => {
    setIsEmergency(true);
    setEmergencyStartTime(new Date());
    
    // Vibrate
    vibrate([500, 200, 500, 200, 500]);
    
    // Start siren
    startSiren();
    
    // Request wake lock
    await requestWakeLock();
    
    // Try to enable flashlight
    await toggleFlashlight(true);
    
    // Start audio recording
    await startRecording();
    
    // Get location and send alerts
    try {
      const location = await getCurrentLocation();
      const address = await getAddressFromCoords(location.latitude, location.longitude);
      setCurrentAddress(address);
      
      // Send SMS to contacts
      if (contacts.length > 0) {
        await sendEmergencySMS(contacts, location, userName);
      }
      
      // Start location tracking
      const watchId = watchLocation(
        async (newLocation) => {
          const newAddress = await getAddressFromCoords(newLocation.latitude, newLocation.longitude);
          setCurrentAddress(newAddress);
          console.log('Location update:', newLocation);
        },
        (error) => {
          console.error('Location tracking error:', error);
        }
      );
      setLocationWatchId(watchId);
      
      // Create emergency log
      const log: EmergencyLogType = {
        id: `log_${Date.now()}`,
        timestamp: new Date(),
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          address,
        },
        contactsNotified: contacts.length,
        status: 'active',
      };
      
      if (onLogAdd) {
        await onLogAdd(log);
      } else {
        storage.addLog(log);
      }
      
    } catch (error) {
      console.error('Emergency activation error:', error);
      alert('Failed to get location. Please check location permissions.');
    }
  };

  const stopEmergency = async () => {
    setIsEmergency(false);
    
    // Stop siren
    stopSiren();
    
    // Stop flashlight
    await toggleFlashlight(false);
    
    // Stop recording
    const audioBlob = await stopRecording();
    if (audioBlob) {
      console.log('Recording saved:', audioBlob);
    }
    
    // Release wake lock
    await releaseWakeLock();
    
    // Stop location tracking
    if (locationWatchId) {
      clearWatch(locationWatchId);
      setLocationWatchId(null);
    }
    
    // Update log
    if (emergencyStartTime) {
      const logs = storage.getLogs();
      const activeLog = logs.find(log => log.status === 'active');
      if (activeLog) {
        activeLog.status = 'resolved';
        activeLog.duration = Math.floor((new Date().getTime() - emergencyStartTime.getTime()) / 1000);
        storage.setLogs(logs);
      }
    }
    
    setEmergencyStartTime(null);
    setCurrentAddress('');
  };

  if (isEmergency) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 p-6">
        <div className="text-center">
          <div className="relative">
            <div className="w-48 h-48 bg-red-500 rounded-full animate-ping absolute opacity-75"></div>
            <div className="w-48 h-48 bg-red-600 rounded-full flex items-center justify-center relative">
              <svg className="w-24 h-24 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-red-600 dark:text-red-400">EMERGENCY ACTIVE</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {contacts.length > 0 
              ? `${contacts.length} contacts notified` 
              : 'Add trusted contacts to send alerts'}
          </p>
          {currentAddress && (
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
              📍 {currentAddress}
            </p>
          )}
        </div>
        
        <div className="flex flex-wrap gap-4 justify-center">
          <div className="bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
              <span className="text-sm font-medium">Siren Active</span>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-medium">Tracking Location</span>
            </div>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded-lg">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <span className="text-sm font-medium">Recording Audio</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={stopEmergency}
          className="mt-8 bg-gray-800 dark:bg-gray-700 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-900 dark:hover:bg-gray-600 transition-all shadow-lg"
        >
          Stop Emergency Alert
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-6">
      {countdown > 0 ? (
        <div className="text-center">
          <div className="text-8xl font-bold text-red-600 dark:text-red-400 mb-4 animate-pulse">
            {countdown}
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Activating emergency...
          </p>
          <button
            onClick={() => setCountdown(0)}
            className="mt-6 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Emergency Help
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              Press and hold the button below to activate emergency alert
            </p>
          </div>
          
          <button
            onClick={startCountdown}
            onTouchStart={startCountdown}
            className="relative group"
          >
            <div className="w-64 h-64 bg-gradient-to-br from-red-500 to-red-700 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform">
              <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-75"></div>
              <div className="relative flex flex-col items-center">
                <svg className="w-32 h-32 text-white mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-white text-2xl font-bold">SOS</span>
              </div>
            </div>
          </button>
          
          {contacts.length === 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-400 px-4 py-3 rounded-lg max-w-md text-center">
              ⚠️ Add trusted contacts to receive emergency alerts
            </div>
          )}
        </>
      )}
    </div>
  );
};
