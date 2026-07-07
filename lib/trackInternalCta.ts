/**
 * Tracks an internal CTA click (scroll-to-section button).
 * Sets window.__internalCtaJump flag so SectionTracker skips intermediaries.
 */
export function trackInternalCta(params: {
  ctaLabel: string;
  buttonLocation: string;
  sourceSectionId: string;
  sourceSectionTitle: string;
  sourceSectionOrder: number;
  targetSectionId?: string;
  targetSectionTitle?: string;
  targetSectionOrder?: number;
  sessionId: string;
  utms: Record<string, string | undefined>;
}) {
  const {
    ctaLabel, buttonLocation,
    sourceSectionId, sourceSectionTitle, sourceSectionOrder,
    targetSectionId = 'oferta',
    targetSectionTitle = '11 - Oferta',
    targetSectionOrder = 11,
    sessionId, utms,
  } = params;

  // Set jump flag — SectionTracker will read this
  if (typeof window !== 'undefined') {
    window.__internalCtaJump = {
      active:             true,
      targetSectionId,
      targetSectionOrder,
      sourceSectionId,
      sourceSectionTitle,
      sourceSectionOrder,
      ctaLabel,
      startedAt: Date.now(),
    };
  }

  // GA4 event
  if (typeof window !== 'undefined' && typeof (window as { gtag?: (...a: unknown[]) => void }).gtag === 'function') {
    try {
      (window as { gtag: (...a: unknown[]) => void }).gtag('event', 'internal_cta_click', {
        cta_label:             ctaLabel,
        source_section_title:  sourceSectionTitle,
        target_section_title:  targetSectionTitle,
        transport_type:        'beacon',
      });
    } catch { /* ignore */ }
  }

  // Panel tracking
  try {
    fetch('/api/track-click', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, keepalive: true,
      body: JSON.stringify({
        sessionId,
        clickKind:          'internal_cta',
        ctaLabel,
        buttonLocation,
        sourceSectionId,
        sourceSectionTitle,
        sourceSectionOrder,
        targetSectionId,
        targetSectionTitle,
        targetSectionOrder,
        isInternalJump:     true,
        timestamp:          Date.now(),
        ...utms,
      }),
    }).catch(() => {});
  } catch { /* ignore */ }
}
