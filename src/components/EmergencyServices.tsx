import { useState } from 'react';
import { EmergencyService } from '@/types';

const emergencyServices: EmergencyService[] = [
  { id: 'police', name: 'Police', number: '100', icon: '👮', description: 'Law enforcement', available: true },
  { id: 'ambulance', name: 'Ambulance', number: '102', icon: '🚑', description: 'Medical emergency', available: true },
  { id: 'fire', name: 'Fire', number: '101', icon: '🚒', description: 'Fire emergency', available: true },
  { id: 'women-helpline', name: 'Women Helpline', number: '1091', icon: '👩', description: 'Women safety', available: true },
  { id: 'child-helpline', name: 'Child Helpline', number: '1098', icon: '👶', description: 'Child welfare', available: true },
  { id: 'national', name: 'National Emergency', number: '112', icon: '🆘', description: 'All emergencies', available: true },
];

export const EmergencyServices = () => {
  const [showDialPad, setShowDialPad] = useState(false);

  const makeCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Emergency Services</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
          Quick dial emergency services in India
        </p>
      </div>

      {/* Emergency Service Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {emergencyServices.map((service) => (
          <button
            key={service.id}
            onClick={() => makeCall(service.number)}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 hover:shadow-xl transition-all hover:-translate-y-1 group"
          >
            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
              {service.icon}
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">
              {service.name}
            </h3>
            <p className="text-red-600 dark:text-red-400 font-mono font-bold">
              {service.number}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {service.description}
            </p>
          </button>
        ))}
      </div>

      {/* Quick Dial Pad */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Quick Dial
          </h3>
          <button
            onClick={() => setShowDialPad(!showDialPad)}
            className="text-red-600 dark:text-red-400 text-sm font-medium"
          >
            {showDialPad ? 'Hide' : 'Show'} Custom Dial
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
            <button
              key={digit}
              className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-2xl font-semibold text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              onClick={() => {
                // Play tone (simplified)
                console.log(`Dialed: ${digit}`);
              }}
            >
              {digit}
            </button>
          ))}
        </div>
      </div>

      {/* Emergency Tips */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 mt-6">
        <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-400 mb-3">
          ⚠️ Important
        </h3>
        <ul className="space-y-2 text-sm text-yellow-800 dark:text-yellow-300">
          <li>• In life-threatening emergencies, dial 112 for immediate assistance</li>
          <li>• Women Helpline 1091 is specifically for women's safety concerns</li>
          <li>• For poisoning, dial 1066 (Poison Control)</li>
          <li>• Railway emergency: 132 (Railway Protection Force)</li>
        </ul>
      </div>
    </div>
  );
};
