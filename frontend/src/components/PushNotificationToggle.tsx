'use client';

import { usePushNotifications } from '@/hooks/usePushNotifications';

export function PushNotificationToggle() {
  const { isSupported, isSubscribed, permission, loading, error, subscribe, unsubscribe } = usePushNotifications();

  if (!isSupported) {
    return null;
  }

  const handleToggle = async () => {
    if (isSubscribed) {
      await unsubscribe();
    } else {
      await subscribe();
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl border border-gray-700">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-500/20 rounded-lg">
          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-white">Notifications push</p>
          <p className="text-xs text-gray-400">
            {isSubscribed ? 'Activees' : 'Desactivees'}
          </p>
        </div>
      </div>
      
      <button
        onClick={handleToggle}
        disabled={loading || permission === 'denied'}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          isSubscribed ? 'bg-emerald-500' : 'bg-gray-600'
        } ${loading ? 'opacity-50' : ''} ${permission === 'denied' ? 'opacity-30 cursor-not-allowed' : ''}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isSubscribed ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}
