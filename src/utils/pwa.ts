// PWA Installation utilities

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;

// Listen for beforeinstallprompt event
export const initPWA = () => {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e as BeforeInstallPromptEvent;
    console.log('PWA install prompt available');
    
    // Show install banner
    showInstallBanner();
  });

  // Listen for app installed event
  window.addEventListener('appinstalled', () => {
    console.log('PWA installed successfully');
    deferredPrompt = null;
    hideInstallBanner();
    
    // Track installation (if analytics is available)
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', 'pwa_install', {
        event_category: 'engagement',
        event_label: 'PWA Installed'
      });
    }
  });

  // Check if running as PWA
  if (isPWA()) {
    console.log('Running as installed PWA');
  }
};

// Check if app is installed as PWA
export const isPWA = (): boolean => {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  );
};

// Show install banner
const showInstallBanner = () => {
  const banner = document.createElement('div');
  banner.id = 'pwa-install-banner';
  banner.innerHTML = `
    <div style="
      position: fixed;
      bottom: 80px;
      left: 16px;
      right: 16px;
      background: linear-gradient(135deg, #EF4444 0%, #F97316 100%);
      color: white;
      padding: 16px;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      z-index: 9999;
      animation: slideUp 0.3s ease-out;
    ">
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="font-size: 32px;">🛡️</div>
        <div style="flex: 1;">
          <div style="font-weight: bold; margin-bottom: 4px;">Install Rakshak</div>
          <div style="font-size: 14px; opacity: 0.9;">Quick access from your home screen</div>
        </div>
        <button id="pwa-install-btn" style="
          background: white;
          color: #EF4444;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          font-size: 14px;
        ">Install</button>
        <button id="pwa-dismiss-btn" style="
          background: transparent;
          color: white;
          border: none;
          font-size: 24px;
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
        ">×</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(banner);
  
  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideUp {
      from { transform: translateY(100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  // Install button handler
  document.getElementById('pwa-install-btn')?.addEventListener('click', installPWA);
  
  // Dismiss button handler
  document.getElementById('pwa-dismiss-btn')?.addEventListener('click', hideInstallBanner);
};

// Hide install banner
const hideInstallBanner = () => {
  const banner = document.getElementById('pwa-install-banner');
  if (banner) {
    banner.remove();
  }
};

// Install PWA
export const installPWA = async () => {
  if (!deferredPrompt) {
    console.log('Install prompt not available');
    return false;
  }

  // Show the install prompt
  deferredPrompt.prompt();

  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;
  
  console.log(`User response to install prompt: ${outcome}`);
  
  if (outcome === 'accepted') {
    console.log('User accepted the install prompt');
  } else {
    console.log('User dismissed the install prompt');
  }

  // Clear the deferred prompt
  deferredPrompt = null;
  hideInstallBanner();
  
  return outcome === 'accepted';
};

// Check if PWA can be installed
export const canInstallPWA = (): boolean => {
  return deferredPrompt !== null;
};

// Request notification permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

// Show notification
export const showNotification = async (title: string, options?: NotificationOptions) => {
  if (Notification.permission !== 'granted') {
    await requestNotificationPermission();
  }

  if (Notification.permission === 'granted') {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      // Use service worker notification
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          icon: '/icon-192.png',
          badge: '/icon-72.png',
          ...(options as any)
        });
      });
    } else {
      // Fallback to regular notification
      new Notification(title, {
        icon: '/icon-192.png',
        badge: '/icon-72.png',
        ...options
      });
    }
  }
};

// Share content using Web Share API
export const shareContent = async (data: ShareData): Promise<boolean> => {
  if (!navigator.share) {
    console.log('Web Share API not supported');
    return false;
  }

  try {
    await navigator.share(data);
    console.log('Content shared successfully');
    return true;
  } catch (error) {
    if ((error as Error).name !== 'AbortError') {
      console.error('Error sharing:', error);
    }
    return false;
  }
};

// Check for updates
export const checkForUpdates = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.update();
    });
  }
};

// Request persistent storage
export const requestPersistentStorage = async (): Promise<boolean> => {
  if (navigator.storage && navigator.storage.persist) {
    const isPersisted = await navigator.storage.persist();
    console.log(`Persistent storage: ${isPersisted ? 'granted' : 'denied'}`);
    return isPersisted;
  }
  return false;
};

// Get storage estimate
export const getStorageEstimate = async () => {
  if (navigator.storage && navigator.storage.estimate) {
    const estimate = await navigator.storage.estimate();
    console.log('Storage estimate:', estimate);
    return estimate;
  }
  return null;
};

// Add to home screen prompt for iOS
export const showIOSInstallPrompt = () => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator as any).standalone;

  if (isIOS && !isInStandaloneMode) {
    // Show iOS install instructions
    const banner = document.createElement('div');
    banner.id = 'ios-install-banner';
    banner.innerHTML = `
      <div style="
        position: fixed;
        bottom: 80px;
        left: 16px;
        right: 16px;
        background: white;
        color: #1f2937;
        padding: 16px;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        z-index: 9999;
        border: 2px solid #EF4444;
      ">
        <div style="display: flex; align-items: start; gap: 12px;">
          <div style="font-size: 32px;">🛡️</div>
          <div style="flex: 1;">
            <div style="font-weight: bold; margin-bottom: 8px; color: #EF4444;">Install Rakshak on iOS</div>
            <div style="font-size: 14px; line-height: 1.5;">
              1. Tap the Share button <span style="font-size: 18px;">⬆️</span><br/>
              2. Scroll and tap "Add to Home Screen"<br/>
              3. Tap "Add" to install
            </div>
          </div>
          <button id="ios-dismiss-btn" style="
            background: transparent;
            color: #6b7280;
            border: none;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            width: 32px;
            height: 32px;
          ">×</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(banner);
    
    document.getElementById('ios-dismiss-btn')?.addEventListener('click', () => {
      banner.remove();
      localStorage.setItem('ios-install-dismissed', 'true');
    });
  }
};

// Initialize PWA features
export const initPWAFeatures = () => {
  initPWA();
  
  // Show iOS prompt if needed (only once)
  if (!localStorage.getItem('ios-install-dismissed')) {
    setTimeout(showIOSInstallPrompt, 2000);
  }
  
  // Request persistent storage
  requestPersistentStorage();
  
  // Check for updates every 30 minutes
  setInterval(checkForUpdates, 30 * 60 * 1000);
};
