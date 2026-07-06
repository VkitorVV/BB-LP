'use client';

import { useEffect } from 'react';

const SESSION_ID_KEY = 'mapa_degrade_session_id';

function getSessionId(): string {
  let id = sessionStorage.getItem(SESSION_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_ID_KEY, id);
  }
  return id;
}

function getUtmParams() {
  const p = new URLSearchParams(window.location.search);
  return {
    utmSource:      p.get('utm_source')       || undefined,
    utmMedium:      p.get('utm_medium')       || undefined,
    utmCampaign:    p.get('utm_campaign')     || undefined,
    utmContent:     p.get('utm_content')      || undefined,
    utmTerm:        p.get('utm_term')         || undefined,
    campaignId:     p.get('campaign_id')      || undefined,
    adsetId:        p.get('adset_id')         || undefined,
    adId:           p.get('ad_id')            || undefined,
    placement:      p.get('placement')        || undefined,
    siteSourceName: p.get('site_source_name') || undefined,
  };
}

function sendHeartbeat() {
  if (document.visibilityState === 'hidden') return;
  try {
    const sessionId = getSessionId();
    fetch('/api/track-presence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({ sessionId, timestamp: new Date().toISOString(), ...getUtmParams() }),
    }).catch(() => {});
  } catch { /* silently ignore */ }
}

export default function PresenceTracker() {
  useEffect(() => {
    // Initial heartbeat
    sendHeartbeat();

    // Heartbeat every 30s
    const interval = setInterval(sendHeartbeat, 30_000);

    // Pause when tab hidden
    const onVisibility = () => {
      if (document.visibilityState === 'visible') sendHeartbeat();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return null;
}
