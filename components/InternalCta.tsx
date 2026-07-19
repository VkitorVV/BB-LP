'use client';

import type { MouseEvent, ReactNode } from 'react';
import { getSessionId, getUtmParams } from '@/lib/clientTracking';
import { trackInternalCta } from '@/lib/trackInternalCta';
import { OFFER_ANCHOR_ID } from '@/lib/trackingConfig';

type InternalCtaProps = {
  children: ReactNode;
  className: string;
  ctaLabel: string;
  buttonLocation: string;
  sourceSectionId: string;
  sourceSectionTitle: string;
  sourceSectionOrder: number;
  href?: string;
  replaceHash?: boolean;
};

export default function InternalCta({
  children,
  className,
  ctaLabel,
  buttonLocation,
  sourceSectionId,
  sourceSectionTitle,
  sourceSectionOrder,
  href,
  replaceHash = false,
}: InternalCtaProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    const target = document.getElementById(OFFER_ANCHOR_ID);
    if (!target && href) return;

    event.preventDefault();
    trackInternalCta({
      ctaLabel,
      buttonLocation,
      sourceSectionId,
      sourceSectionTitle,
      sourceSectionOrder,
      sessionId: getSessionId(),
      utms: getUtmParams(),
    });

    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (replaceHash) {
      window.history.replaceState(null, '', `#${OFFER_ANCHOR_ID}`);
    }
  };

  if (href) {
    return (
      <a
        className={className}
        href={href}
        onClick={handleClick}
        data-track-cta={ctaLabel}
        data-button-location={buttonLocation}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={className}
      onClick={handleClick}
      data-track-cta={ctaLabel}
      data-button-location={buttonLocation}
    >
      {children}
    </button>
  );
}
