'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    __internalCtaJump?: {
      active: boolean;
      targetSectionId: string;
      targetSectionOrder: number;
      sourceSectionId: string;
      sourceSectionTitle: string;
      sourceSectionOrder: number;
      ctaLabel: string;
      startedAt: number;
    } | null;
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

const GA4_PREFIX   = 'ga4_fired_';
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

// ── GA4 event (sessionStorage dedup) ─────────────────────────────────────────
function fireGA4(id: string, title: string, order: number) {
  if (!title || !id) return;
  if (sessionStorage.getItem(GA4_PREFIX + id)) return;
  if (typeof window.gtag !== 'function') return;
  try {
    sessionStorage.setItem(GA4_PREFIX + id, '1');
    window.gtag('event', 'section_reached', {
      section_title: title, section_id: id, section_order: order, transport_type: 'beacon',
    });
    window.gtag('event', 'page_view', {
      page_title: title,
      page_location: window.location.origin + window.location.pathname + '#' + id,
      page_path:     window.location.pathname + '#' + id,
      transport_type: 'beacon',
    });
  } catch { /* ignore */ }
}

// ── Panel event (page-load dedup) ─────────────────────────────────────────────
function firePanel(sessionId: string, id: string, title: string, order: number, reachMethod = 'scroll', ctaInfo?: typeof window.__internalCtaJump) {
  if (!title || !id) return;
  if (panelFiredThisLoad.has(id)) return;
  panelFiredThisLoad.add(id);
  try {
    fetch('/api/track-section', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, keepalive: true,
      body: JSON.stringify({
        sessionId, sectionId: id, sectionTitle: title, sectionOrder: order,
        reachMethod,
        sourceCtaLabel:     ctaInfo?.ctaLabel        || undefined,
        sourceSectionId:    ctaInfo?.sourceSectionId || undefined,
        sourceSectionTitle: ctaInfo?.sourceSectionTitle || undefined,
        sourceSectionOrder: ctaInfo?.sourceSectionOrder || undefined,
        timestamp: new Date().toISOString(),
        ...getUtmParams(),
      }),
    }).catch(() => {});
  } catch { /* ignore */ }
}

export default function SectionTracker() {
  useEffect(() => {
    const sessionId = getSessionId();
    let rafId: number | null = null;
    // Timeout to auto-clear stuck CTA jump flag
    let jumpTimeout: ReturnType<typeof setTimeout> | null = null;

    const checkSections = () => {
      const triggerLine = window.scrollY + window.innerHeight * 0.75;
      const jump = window.__internalCtaJump;
      const isJumping = jump?.active && (Date.now() - (jump?.startedAt || 0)) < 2500;

      sections.forEach(({ id, title, order }) => {
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top > triggerLine) return;

        // During a CTA jump: skip intermediate sections, only mark target
        if (isJumping && jump) {
          if (id === jump.targetSectionId) {
            // Mark target as cta_jump
            fireGA4(id, title, order);
            firePanel(sessionId, id, title, order, 'cta_jump', jump);
            window.__internalCtaJump = null; // clear flag
            if (jumpTimeout) clearTimeout(jumpTimeout);
          } else if (order > jump.sourceSectionOrder && order < jump.targetSectionOrder) {
            // Skip intermediate sections — do not mark
            return;
          } else {
            // Sections before source — mark as scroll
            fireGA4(id, title, order);
            firePanel(sessionId, id, title, order, 'scroll');
          }
        } else {
          // Normal scroll
          fireGA4(id, title, order);
          firePanel(sessionId, id, title, order, 'scroll');
        }
      });
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => { checkSections(); rafId = null; });
    };

    // Defer initial check to after LCP — avoids reflow during first paint
    const scheduleInitialCheck = () => {
      checkSections();
      const tryGA4 = (attempts = 0) => {
        if (typeof window.gtag === 'function') { checkSections(); }
        else if (attempts < 20) { setTimeout(() => tryGA4(attempts + 1), 250); }
      };
      tryGA4();
    };

    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(scheduleInitialCheck, { timeout: 3000 });
    } else {
      setTimeout(scheduleInitialCheck, 500);
    }

    // Auto-clear stale jump flag after 2500ms
    const jumpGuard = setInterval(() => {
      const j = window.__internalCtaJump;
      if (j?.active && Date.now() - (j?.startedAt || 0) > 2500) {
        window.__internalCtaJump = null;
      }
    }, 500);

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (jumpTimeout) clearTimeout(jumpTimeout);
      clearInterval(jumpGuard);
    };
  }, []);

  return null;
}
