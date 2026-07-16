'use client';

import { useEffect } from 'react';
import { getSessionId, getUtmParams } from '@/lib/clientTracking';

function sendHeartbeat() {
  if (document.visibilityState === 'hidden') return;
  try {
    fetch('/api/track-presence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        sessionId: getSessionId(),
        timestamp: new Date().toISOString(),
        ...getUtmParams(),
      }),
    }).catch(() => {});
  } catch { /* silently ignore */ }
}

function sendExit() {
  const sessionId = getSessionId();
  const payload   = JSON.stringify({ sessionId, timestamp: new Date().toISOString() });
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon('/api/track-exit', blob);
    } else {
      fetch('/api/track-exit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        keepalive: true, body: payload,
      }).catch(() => {});
    }
  } catch { /* silently ignore */ }
}

export default function PresenceTracker() {
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    function startInterval() {
      if (interval) clearInterval(interval);
      interval = setInterval(sendHeartbeat, 15_000); // every 15s — threshold 25s
    }

    function stopInterval() {
      if (interval) { clearInterval(interval); interval = null; }
    }

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        sendHeartbeat();
        startInterval();
      } else {
        stopInterval();
        sendExit();
      }
    };

    const onExit = () => sendExit();

    // Initial heartbeat + start interval
    sendHeartbeat();
    startInterval();

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', onExit);
    window.addEventListener('beforeunload', onExit);

    return () => {
      stopInterval();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', onExit);
      window.removeEventListener('beforeunload', onExit);
    };
  }, []);

  return null;
}
