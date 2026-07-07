'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const sections = [
  { id: 'hero',                title: '01 - Hero',               order: 1  },
  { id: 'material-por-dentro', title: '02 - Material por dentro', order: 2  },
  { id: 'beneficios',          title: '03 - Beneficios',          order: 3  },
  { id: 'prova-social',        title: '04 - Prova social',        order: 4  },
  { id: 'cta-intermediario',   title: '05 - CTA intermediario',   order: 5  },
  { id: 'ideal-para',          title: '06 - Ideal para',          order: 6  },
  { id: 'o-que-recebe',        title: '07 - O que recebe',        order: 7  },
  { id: 'bonus',               title: '08 - Bonus',               order: 8  },
  { id: 'comparativo',         title: '09 - Por que usar o mapa', order: 9  },
  { id: 'countdown',           title: '10 - Cronometro',          order: 10 },
  { id: 'oferta',              title: '11 - Oferta',              order: 11 },
  { id: 'garantia',            title: '12 - Garantia',            order: 12 },
  { id: 'faq',                 title: '13 - FAQ',                 order: 13 },
  { id: 'rodape',              title: '14 - Rodape',              order: 14 },
];

// GA4 deduplication — per session (sessionStorage)
const GA4_PREFIX = 'ga4_fired_';
// Panel deduplication — per PAGE LOAD only (in-memory set, resets on refresh)
// This ensures the panel always gets events on each page load, even if GA4 already fired
const panelFiredThisLoad = new Set<string>();

const SESSION_ID_KEY = 'mapa_degrade_session_id';

function getSessionId(): string {
  let id = sessionStorage.getItem(SESSION_ID_KEY);
  if (!id) { id = crypto.randomUUID(); sessionStorage.setItem(SESSION_ID_KEY, id); }
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

// ── GA4 event (deduplicated per session via sessionStorage) ─────────────────
function fireGA4(id: string, title: string, order: number) {
  if (!title || !id) return;
  if (sessionStorage.getItem(GA4_PREFIX + id)) return;
  if (typeof window.gtag !== 'function') return;

  try {
    sessionStorage.setItem(GA4_PREFIX + id, '1');
    window.gtag('event', 'section_reached', {
      section_title:  title,
      section_id:     id,
      section_order:  order,
      transport_type: 'beacon',
    });
    window.gtag('event', 'page_view', {
      page_title:    title,
      page_location: window.location.origin + window.location.pathname + '#' + id,
      page_path:     window.location.pathname + '#' + id,
      transport_type: 'beacon',
    });
  } catch { /* silently ignore */ }
}

// ── Panel event (deduplicated per PAGE LOAD via in-memory set) ─────────────
// Resets on every refresh — so panel always gets fresh data on each page load
function firePanel(sessionId: string, id: string, title: string, order: number) {
  if (!title || !id) return;
  if (panelFiredThisLoad.has(id)) return; // already sent this session+load
  panelFiredThisLoad.add(id);

  try {
    fetch('/api/track-section', {
      method:    'POST',
      headers:   { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        sessionId,
        sectionId:    id,
        sectionTitle: title,
        sectionOrder: order,
        timestamp:    new Date().toISOString(),
        ...getUtmParams(),
      }),
    }).catch(() => { /* silently ignore */ });
  } catch { /* silently ignore */ }
}

export default function SectionTracker() {
  useEffect(() => {
    const sessionId = getSessionId();
    let rafId: number | null = null;

    const checkSections = () => {
      const triggerLine = window.scrollY + window.innerHeight * 0.75;
      sections.forEach(({ id, title, order }) => {
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top > triggerLine) return;
        // GA4 and panel are independent — one doesn't block the other
        fireGA4(id, title, order);
        firePanel(sessionId, id, title, order);
      });
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => { checkSections(); rafId = null; });
    };

    // Initial check — panel sends immediately (no gtag dependency)
    checkSections();

    // GA4 retry after gtag loads
    const tryGA4 = (attempts = 0) => {
      if (typeof window.gtag === 'function') { checkSections(); }
      else if (attempts < 20) { setTimeout(() => tryGA4(attempts + 1), 250); }
    };
    tryGA4();

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}
