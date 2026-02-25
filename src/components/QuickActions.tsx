import { useState } from 'react';

interface QuickAction {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

const quickActions: QuickAction[] = [
  { id: 'sos', name: 'SOS Alert', icon: '🚨', color: 'bg-red-500', description: 'Send emergency alert' },
  { id: 'fake-call', name: 'Fake Call', icon: '📞', color: 'bg-blue-500', description: 'Simulate incoming call' },
  { id: 'share-location', name: 'Share Location', icon: '📍', color: 'bg-green-500', description: 'Send location to contacts' },
  { id: 'flashlight', name: 'Flashlight', icon: '🔦', color: 'bg-yellow-500', description: 'Toggle flashlight' },
  { id: 'siren', name: 'Siren', icon: '🔔', color: 'bg-purple-500', description: 'Play alarm sound' },
  { id: 'record', name: 'Record', icon: '🎤', color: 'bg-pink-500', description: 'Start audio recording' },
];

export const QuickActions = ({ onAction }: { onAction: (action: string) => void }) => {
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const handleAction = (actionId: string) => {
    setActiveAction(actionId);
    onAction(actionId);
    setTimeout(() => setActiveAction(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Fast access to emergency features
        </p>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleAction(action.id)}
            className={`${action.color} rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl ${
              activeAction === action.id ? 'ring-4 ring-white scale-110' : ''
            }`}
          >
            <span className="text-3xl">{action.icon}</span>
            <span className="text-white text-xs font-semibold text-center">
              {action.name}
            </span>
          </button>
        ))}
      </div>

      {/* Emergency Profile Selector */}
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Emergency Profile
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: 'Personal', icon: '🏠', color: 'from-blue-500 to-blue-600' },
            { name: 'Family', icon: '👨‍👩‍👧', color: 'from-green-500 to-green-600' },
            { name: 'Travel', icon: '✈️', color: 'from-purple-500 to-purple-600' },
            { name: 'Work', icon: '💼', color: 'from-orange-500 to-orange-600' },
          ].map((profile) => (
            <button
              key={profile.name}
              className={`bg-gradient-to-br ${profile.color} rounded-xl p-4 text-white hover:opacity-90 transition-opacity`}
            >
              <div className="text-3xl mb-1">{profile.icon}</div>
              <div className="font-semibold text-sm">{profile.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
