'use client';

import React from 'react';
import { getSessionId, getUtmParams } from '@/lib/clientTracking';
import { trackInternalCta } from '@/lib/trackInternalCta';
import { OFFER_ANCHOR_ID } from '@/lib/trackingConfig';

export default function CTAFinal() {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(OFFER_ANCHOR_ID);
    if (!target) return;

    event.preventDefault();
    trackInternalCta({
      ctaLabel: 'CTA Final',
      buttonLocation: 'cta-final',
      sourceSectionId: 'cta-final',
      sourceSectionTitle: '13 - CTA final',
      sourceSectionOrder: 13,
      sessionId: getSessionId(),
      utms: getUtmParams(),
    });
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', `#${OFFER_ANCHOR_ID}`);
  };

  return (
    <section
      id="cta-final"
      aria-labelledby="cta-final-title"
      data-track-section="cta-final"
      data-track-order="13"
      data-track-title="13 - CTA final"
    >
      <style>{`
        #cta-final {
          position: relative;
          left: 50%;
          width: 100vw;
          max-width: 100vw;
          transform: translateX(-50%);
          overflow-x: clip;
          box-sizing: border-box;
          padding: 78px 18px 76px;
          background: #0F0A06;
          color: #FFF4E6;
          text-align: center;
          border-bottom: 1px solid rgba(216, 166, 74, 0.18);
        }
        #cta-final *,
        #cta-final *::before,
        #cta-final *::after {
          box-sizing: border-box;
        }
        #cta-final .cta-final-shell {
          width: 100%;
          max-width: 780px;
          margin: 0 auto;
        }
        #cta-final .cta-final-line {
          width: 70px;
          height: 3px;
          margin: 0 auto 22px;
          border-radius: 999px;
          background: #D8A64A;
        }
        #cta-final .cta-final-title {
          margin: 0;
          font-family: var(--font-display), var(--font-display-family), Impact, sans-serif;
          font-size: clamp(2.45rem, 11vw, 5.8rem);
          font-weight: 900;
          line-height: 0.92;
          letter-spacing: 0;
          text-transform: uppercase;
          color: #FFF4E6;
        }
        #cta-final .cta-final-title span {
          display: block;
          margin-top: 8px;
          color: #D8A64A;
        }
        #cta-final .cta-final-text {
          max-width: 620px;
          margin: 22px auto 30px;
          color: #D9C3A3;
          font-size: 1rem;
          line-height: 1.52;
          font-weight: 650;
        }
        #cta-final .cta-final-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-width: 430px;
          min-height: 58px;
          padding: 17px 20px 15px;
          border-radius: 7px;
          background: #F28A1A;
          color: #0B0704;
          font-family: var(--font-display), var(--font-display-family), Impact, sans-serif;
          font-size: 1.06rem;
          font-weight: 900;
          line-height: 1;
          letter-spacing: 0;
          text-decoration: none;
          text-transform: uppercase;
          box-shadow: 0 16px 34px rgba(242, 138, 26, 0.2);
          transition: transform 160ms ease, background-color 160ms ease;
        }
        #cta-final .cta-final-button:hover {
          background: #D8A64A;
        }
        #cta-final .cta-final-button:active {
          transform: scale(0.985);
        }
        #cta-final .cta-final-button:focus-visible {
          outline: 3px solid #FFF4E6;
          outline-offset: 4px;
        }
        #cta-final .cta-final-safe {
          max-width: 420px;
          margin: 14px auto 0;
          color: #B8A688;
          font-size: 0.78rem;
          line-height: 1.35;
          font-weight: 750;
        }
        @media (min-width: 768px) {
          #cta-final {
            padding: 104px 28px 100px;
          }
          #cta-final .cta-final-text {
            font-size: 1.08rem;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          #cta-final .cta-final-button {
            transition: none;
          }
        }
      `}</style>

      <div className="cta-final-shell">
        <div className="cta-final-line" aria-hidden="true" />
        <h2 id="cta-final-title" className="cta-final-title">
          DA PRÓXIMA VEZ QUE UMA MARCA APARECER,
          <span>VOCÊ NÃO PRECISA CORRIGIR NO CHUTE.</span>
        </h2>
        <p className="cta-final-text">
          Tenha o Mapa do Degradê Sem Marca por perto para consultar, entender o que revisar e treinar seu olhar nos próximos cortes.
        </p>
        <a
          className="cta-final-button"
          href="#planos"
          onClick={handleClick}
          data-track-cta="CTA Final"
          data-button-location="cta-final"
        >
          QUERO ESCOLHER MEU ACESSO
        </a>
        <p className="cta-final-safe">
          🔒 Compra segura. Acesso após confirmação. Garantia de 7 dias.
        </p>
      </div>
    </section>
  );
}
