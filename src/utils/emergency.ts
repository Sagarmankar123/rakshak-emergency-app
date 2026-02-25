import { TrustedContact, LocationUpdate } from '@/types';
import { getAddressFromCoords, getGoogleMapsUrl } from './location';

// Siren sound generation
let audioContext: AudioContext | null = null;
let oscillator: OscillatorNode | null = null;
let gainNode: GainNode | null = null;

export const startSiren = () => {
  try {
    if (audioContext) {
      stopSiren();
    }
    
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    oscillator = audioContext.createOscillator();
    gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 800;
    gainNode.gain.value = 0.3;
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    
    // Alternate between two frequencies for siren effect
    let high = true;
    setInterval(() => {
      if (oscillator) {
        oscillator.frequency.value = high ? 800 : 400;
        high = !high;
      }
    }, 500);
    
    return true;
  } catch (error) {
    console.error('Failed to start siren:', error);
    return false;
  }
};

export const stopSiren = () => {
  if (oscillator) {
    oscillator.stop();
    oscillator = null;
  }
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
  gainNode = null;
};

// Flashlight (uses camera flash on supported devices)
let stream: MediaStream | null = null;

export const toggleFlashlight = async (enable: boolean): Promise<boolean> => {
  try {
    if (enable) {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities() as any;
      
      if (capabilities.torch) {
        await track.applyConstraints({
          advanced: [{ torch: true } as any]
        });
        return true;
      }
    } else {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
      }
    }
    return false;
  } catch (error) {
    console.error('Flashlight error:', error);
    return false;
  }
};

// Audio recording
let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];

export const startRecording = async (): Promise<boolean> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];
    
    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };
    
    mediaRecorder.start();
    return true;
  } catch (error) {
    console.error('Recording error:', error);
    return false;
  }
};

export const stopRecording = (): Promise<Blob | null> => {
  return new Promise((resolve) => {
    if (!mediaRecorder) {
      resolve(null);
      return;
    }
    
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      mediaRecorder?.stream.getTracks().forEach(track => track.stop());
      mediaRecorder = null;
      resolve(audioBlob);
    };
    
    mediaRecorder.stop();
  });
};

// Send emergency SMS
export const sendEmergencySMS = async (
  contacts: TrustedContact[],
  location: LocationUpdate,
  userName: string
): Promise<void> => {
  const address = await getAddressFromCoords(location.latitude, location.longitude);
  const mapsUrl = getGoogleMapsUrl(location.latitude, location.longitude);
  
  const message = `🚨 EMERGENCY ALERT from ${userName}!\n\nI need immediate help!\n\nMy location:\n${address}\n\nGoogle Maps: ${mapsUrl}\n\nTime: ${new Date().toLocaleString()}\n\n- Sent by Rakshak App`;
  
  // In a real app, this would call an SMS API
  // For demo, we'll show a notification
  console.log('Emergency SMS would be sent to:', contacts);
  console.log('Message:', message);
  
  // Simulate SMS sending with Web Share API
  if (navigator.share) {
    try {
      await navigator.share({
        title: '🚨 EMERGENCY ALERT',
        text: message,
      });
    } catch (error) {
      console.log('Share cancelled or failed');
    }
  }
  
  // Also try to open WhatsApp Web (works on mobile)
  contacts.forEach((contact) => {
    const whatsappMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${contact.phone.replace(/\D/g, '')}?text=${whatsappMessage}`;
    console.log('WhatsApp URL:', whatsappUrl);
  });
};

// Vibrate phone
export const vibrate = (pattern: number[] = [200, 100, 200]) => {
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

// Screen wake lock (keep screen on during emergency)
let wakeLock: any = null;

export const requestWakeLock = async (): Promise<boolean> => {
  try {
    if ('wakeLock' in navigator) {
      wakeLock = await (navigator as any).wakeLock.request('screen');
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

export const releaseWakeLock = async () => {
  if (wakeLock) {
    await wakeLock.release();
    wakeLock = null;
  }
};
