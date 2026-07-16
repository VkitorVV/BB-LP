'use client';

import { useEffect } from 'react';
import { TRACKING_SECTIONS } from '@/lib/trackingConfig';
import { getSessionId, getUtmParams } from '@/lib/clientTracking';

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

const GA4_PREFIX = 'ga4_section_reached_';
const panelFiredThisLoad = new Set<string>();

function fireGA4(id: string, title: string, order: number) {
  if (!title || !id) return;
  if (sessionStorage.getItem(GA4_PREFIX + id)) return;
  if (typeof window.gtag !== 'function') return;

  try {
    sessionStorage.setItem(GA4_PREFIX + id, '1');
    window.gtag('event', 'section_reached', {
      section_title: title,
      section_id: id,
      section_order: order,
      transport_type: 'beacon',
    });
  } catch {
    // GA4 can be blocked by the browser/ad blockers.
  }
}

function firePanel(
  sessionId: string,
  id: string,
  title: string,
  order: number,
  reachMethod = 'scroll',
  ctaInfo?: typeof window.__internalCtaJump,
) {
  if (!title || !id) return;
  if (panelFiredThisLoad.has(id)) return;
  panelFiredThisLoad.add(id);

  try {
    fetch('/api/track-section', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        sessionId,
        sectionId: id,
        sectionTitle: title,
        sectionOrder: order,
        reachMethod,
        sourceCtaLabel: ctaInfo?.ctaLabel || undefined,
        sourceSectionId: ctaInfo?.sourceSectionId || undefined,
        sourceSectionTitle: ctaInfo?.sourceSectionTitle || undefined,
        sourceSectionOrder: ctaInfo?.sourceSectionOrder || undefined,
        timestamp: new Date().toISOString(),
        ...getUtmParams(),
      }),
    }).catch(() => {});
  } catch {
    // Tracking must never block the page.
  }
}

export default function SectionTracker() {
  useEffect(() => {
    const sessionId = getSessionId();
    let rafId: number | null = null;

    const checkSections = () => {
      const triggerLine = window.scrollY + window.innerHeight * 0.75;
      const jump = window.__internalCtaJump;
      const isJumping = jump?.active && (Date.now() - (jump?.startedAt || 0)) < 2500;

      TRACKING_SECTIONS.forEach(({ id, title, order }) => {
        const el = document.getElementById(id);
        if (!el) return;

        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top > triggerLine) return;

        if (isJumping && jump) {
          if (id === jump.targetSectionId) {
            fireGA4(id, title, order);
            firePanel(sessionId, id, title, order, 'cta_jump', jump);
            window.__internalCtaJump = null;
          } else if (order > jump.sourceSectionOrder && order < jump.targetSectionOrder) {
            return;
          } else {
            fireGA4(id, title, order);
            firePanel(sessionId, id, title, order, 'scroll');
          }
        } else {
          fireGA4(id, title, order);
          firePanel(sessionId, id, title, order, 'scroll');
        }
      });
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        checkSections();
        rafId = null;
      });
    };

    checkSections();

    const tryGA4 = (attempts = 0) => {
      if (typeof window.gtag === 'function') {
        checkSections();
      } else if (attempts < 20) {
        setTimeout(() => tryGA4(attempts + 1), 250);
      }
    };
    tryGA4();

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
      clearInterval(jumpGuard);
    };
  }, []);

  return null;
}
