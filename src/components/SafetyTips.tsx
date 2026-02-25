import { useState } from 'react';
import { SafetyTip } from '@/types';

const safetyTips: SafetyTip[] = [
  { id: '1', title: 'Stay Alert', description: 'Always be aware of your surroundings, especially in unfamiliar places.', category: 'General' },
  { id: '2', title: 'Trust Your Gut', description: 'If something feels wrong, leave immediately and seek help.', category: 'General' },
  { id: '3', title: 'Share Your Location', description: 'Keep location sharing enabled with trusted contacts.', category: 'Digital Safety' },
  { id: '4', title: 'Emergency Contacts', description: 'Keep your trusted contacts list updated and prioritized.', category: 'Preparedness' },
  { id: '5', title: 'Know Emergency Numbers', description: 'Save important emergency numbers: 100 (Police), 102 (Ambulance), 112 (Emergency).', category: 'Preparedness' },
  { id: '6', title: 'Avoid Isolated Areas', description: 'Stay in well-lit, populated areas, especially at night.', category: 'General' },
  { id: '7', title: 'Keep Phone Charged', description: 'Maintain your phone battery above 50% when going out.', category: 'Preparedness' },
  { id: '8', title: 'Use Rakshak Features', description: 'Configure countdown timer and shake detection for quick SOS.', category: 'App Features' },
];

const emergencyChecklist = [
  '✅ Trusted contacts list updated',
  '✅ Emergency services numbers saved',
  '✅ Location permissions enabled',
  '✅ SOS countdown set to 3 seconds',
  '✅ Shake detection enabled',
  '✅ Flashlight tested',
  '✅ Siren sound tested',
  '✅ Fake call scenario practiced',
];

export const SafetyTips = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  const categories = ['All', 'General', 'Preparedness', 'Digital Safety', 'App Features'];

  const filteredTips = activeCategory === 'All' 
    ? safetyTips 
    : safetyTips.filter(tip => tip.category === activeCategory);

  const toggleChecklistItem = (index: number) => {
    setCheckedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Safety Tips</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
          Expert advice for your personal safety
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === category
                ? 'bg-red-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Tips Grid */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {filteredTips.map((tip) => (
          <div
            key={tip.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {tip.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {tip.description}
                </p>
                <span className="inline-block mt-2 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                  {tip.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Emergency Checklist */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          ✅ Emergency Preparedness Checklist
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Make sure you've completed these setup steps for maximum safety
        </p>
        <div className="space-y-3">
          {emergencyChecklist.map((item, index) => (
            <button
              key={index}
              onClick={() => toggleChecklistItem(index)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                checkedItems.includes(index)
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <span className={checkedItems.includes(index) ? 'line-through' : ''}>
                {item}
              </span>
            </button>
          ))}
        </div>
        <div className="mt-4 text-center">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {checkedItems.length}/{emergencyChecklist.length} completed
          </span>
        </div>
      </div>

      {/* Emergency Numbers Reference */}
      <div className="mt-6 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl p-6 text-white">
        <h3 className="text-lg font-bold mb-3">📱 Save These Numbers</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between bg-white/20 rounded-lg px-3 py-2">
            <span>Police</span>
            <span className="font-bold">100</span>
          </div>
          <div className="flex justify-between bg-white/20 rounded-lg px-3 py-2">
            <span>Ambulance</span>
            <span className="font-bold">102</span>
          </div>
          <div className="flex justify-between bg-white/20 rounded-lg px-3 py-2">
            <span>Fire</span>
            <span className="font-bold">101</span>
          </div>
          <div className="flex justify-between bg-white/20 rounded-lg px-3 py-2">
            <span>Women Helpline</span>
            <span className="font-bold">1091</span>
          </div>
          <div className="flex justify-between bg-white/20 rounded-lg px-3 py-2">
            <span>Child Helpline</span>
            <span className="font-bold">1098</span>
          </div>
          <div className="flex justify-between bg-white/20 rounded-lg px-3 py-2">
            <span>National Emergency</span>
            <span className="font-bold">112</span>
          </div>
        </div>
      </div>
    </div>
  );
};
