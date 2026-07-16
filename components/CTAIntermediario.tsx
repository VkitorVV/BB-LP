'use client';

import React from 'react';
import { trackInternalCta } from '@/lib/trackInternalCta';
import { getSessionId, getUtmParams } from '@/lib/clientTracking';
import { OFFER_ANCHOR_ID } from '@/lib/trackingConfig';

export default function CTAIntermediario() {
  const handleScrollToOffer = () => {
    trackInternalCta({
      ctaLabel: 'CTA Intermediário',
      buttonLocation: 'cta-intermediario',
      sourceSectionId: 'cta-intermediario',
      sourceSectionTitle: '05 - CTA intermediario',
      sourceSectionOrder: 5,
      sessionId: getSessionId(),
      utms: getUtmParams(),
    });
    document.getElementById(OFFER_ANCHOR_ID)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="cta-intermediario"
      data-track-section="cta-intermediario"
      data-track-order="5"
      data-track-title="05 - CTA intermediario"
      className="py-16 px-5 texture-brick relative"
      style={{ borderBottom: '1px solid #3A1D10' }}
    >
      {/* Copper accent line top */}
      <div className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: 'linear-gradient(90deg, transparent, #F28A1A 40%, #D8A64A 60%, transparent)' }} />

      <div className="max-w-md mx-auto text-center">
        <h2 className="font-display text-[2.2rem] leading-none uppercase text-[#FFF4E6] mb-4">
          Acesse ainda hoje e consulte o material quando for treinar
        </h2>

        <p className="text-xs text-[#D9C3A3] leading-relaxed mb-8">
          O Mapa do Degradê Sem Marca é digital. Após a confirmação da compra, você recebe
          o acesso e pode abrir pelo celular, computador ou tablet.
        </p>

        <button
          onClick={handleScrollToOffer}
          data-track-cta="CTA Intermediario"
          data-button-location="cta-intermediario"
          className="w-full py-4 px-6 text-sm font-black uppercase rounded-lg tracking-wider transition-all duration-150 active:scale-[0.98] cursor-pointer font-display"
          style={{ background: '#F28A1A', color: '#0B0704' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#D87512')}
          onMouseLeave={e => (e.currentTarget.style.background = '#F28A1A')}
        >
          Quero acessar agora
        </button>

        <p className="text-[11px] text-[#B8A688] mt-3.5 font-semibold">
          🔒 Compra segura. Material digital. Acesso após confirmação.
        </p>
      </div>

      {/* Copper accent line bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px]"
        style={{ background: 'linear-gradient(90deg, transparent, #F28A1A 40%, #D8A64A 60%, transparent)' }} />
    </section>
  );
}
