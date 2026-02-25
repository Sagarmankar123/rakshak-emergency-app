import { useState, useEffect } from 'react';

export const FakeCall = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [callerName, setCallerName] = useState('Dad');
  const [selectedCaller, setSelectedCaller] = useState('Dad');
  const [duration, setDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isCallActive) {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCallActive]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startCall = () => {
    setCallerName(selectedCaller);
    setIsCallActive(true);
    setDuration(0);
    setIsFullScreen(true);
    
    // Vibrate to simulate incoming call
    if (navigator.vibrate) {
      navigator.vibrate([1000, 500, 1000, 500, 1000]);
    }
  };

  const endCall = () => {
    setIsCallActive(false);
    setDuration(0);
    setIsFullScreen(false);
  };

  const callerOptions = [
    { name: 'Dad', emoji: '👨' },
    { name: 'Mom', emoji: '👩' },
    { name: 'Boss', emoji: '👔' },
    { name: 'Friend', emoji: '👤' },
    { name: 'Police', emoji: '👮' },
    { name: 'Hospital', emoji: '🏥' },
  ];

  if (isCallActive && isFullScreen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-gray-900 to-black z-50 flex flex-col">
        {/* Call Screen */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-white">
          <div className="text-center mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center text-6xl mb-6 shadow-2xl">
              {callerOptions.find(c => c.name === callerName)?.emoji || '📞'}
            </div>
            <h2 className="text-3xl font-bold mb-2">{callerName}</h2>
            <p className="text-gray-400 text-lg">Calling...</p>
            <p className="text-2xl font-mono mt-4 text-green-400">{formatDuration(duration)}</p>
          </div>

          <div className="w-full max-w-sm space-y-4">
            <div className="grid grid-cols-3 gap-4 mb-8">
              <button className="flex flex-col items-center p-4 hover:bg-gray-800 rounded-xl transition-colors">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                  </svg>
                </div>
                <span className="text-xs">Mute</span>
              </button>

              <button className="flex flex-col items-center p-4 hover:bg-gray-800 rounded-xl transition-colors">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 4v16h10V4H7zm8 14H9V6h6v12z" />
                  </svg>
                </div>
                <span className="text-xs">Pause</span>
              </button>

              <button className="flex flex-col items-center p-4 hover:bg-gray-800 rounded-xl transition-colors">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" />
                  </svg>
                </div>
                <span className="text-xs">Speaker</span>
              </button>
            </div>
          </div>
        </div>

        {/* End Call Button */}
        <div className="p-8 pb-12">
          <button
            onClick={endCall}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-full font-semibold flex items-center justify-center gap-3 transition-all shadow-lg"
          >
            <svg className="w-6 h-6 transform rotate-135" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </svg>
            End Call
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Fake Call</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
          Use this feature to escape unsafe situations
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Select Caller
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {callerOptions.map((caller) => (
              <button
                key={caller.name}
                onClick={() => setSelectedCaller(caller.name)}
                className={`p-6 rounded-xl border-2 transition-all ${
                  selectedCaller === caller.name
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="text-5xl mb-2">{caller.emoji}</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {caller.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={startCall}
            className="w-full bg-gradient-to-r from-red-500 to-orange-600 text-white py-4 rounded-xl font-semibold hover:from-red-600 hover:to-orange-700 transition-all flex items-center justify-center gap-3 shadow-lg"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </svg>
            Start Fake Call from {selectedCaller}
          </button>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-400 p-4 rounded-lg">
            <div className="flex gap-3">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm">
                <p className="font-semibold mb-1">How it works:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-400">
                  <li>Select who you want the call to appear from</li>
                  <li>Press "Start Fake Call" to simulate an incoming call</li>
                  <li>The call screen will appear in full screen</li>
                  <li>Use this to excuse yourself from uncomfortable situations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
