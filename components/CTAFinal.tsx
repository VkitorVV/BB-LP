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
      sourceSectionTitle: '16 - CTA FINAL',
      sourceSectionOrder: 16,
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
      data-track-order="16"
      data-track-title="16 - CTA FINAL"
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
          background: var(--color-espresso);
          color: var(--color-paper);
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
          border-radius: 4px;
          background: var(--color-gold);
        }
        #cta-final .cta-final-title {
          margin: 0;
          font-family: var(--font-display), var(--font-display-family), Impact, sans-serif;
          font-size: clamp(2.1rem, 9.2vw, 5.8rem);
          font-weight: 900;
          line-height: 0.92;
          letter-spacing: 0;
          text-transform: uppercase;
          color: var(--color-paper);
        }
        #cta-final .cta-final-title .cta-final-title-line {
          display: block;
          margin-top: 8px;
          color: var(--color-gold);
        }
        #cta-final .cta-final-title-alert {
          display: inline;
          color: var(--color-gold);
          white-space: nowrap;
        }
        #cta-final .cta-final-text {
          max-width: 620px;
          margin: 22px auto 30px;
          color: var(--color-paper-alt);
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
          background: var(--color-gold);
          color: #0B0704;
          font-family: var(--font-sans), var(--font-sans-family);
          font-size: 0.9rem;
          font-weight: 900;
          line-height: 1;
          letter-spacing: 0;
          text-decoration: none;
          text-transform: uppercase;
          box-shadow: none;
          transition: transform 160ms ease, background-color 160ms ease;
        }
        #cta-final .cta-final-button:hover {
          background: #E2B45B;
        }
        #cta-final .cta-final-button:active {
          transform: scale(0.985);
        }
        #cta-final .cta-final-button:focus-visible {
          outline: 3px solid var(--color-paper);
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
          DA PRÓXIMA VEZ QUE UMA <span className="cta-final-title-alert">MARCA</span> APARECER,
          <span className="cta-final-title-line">VOCÊ NÃO PRECISA CORRIGIR NO CHUTE.</span>
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
          Compra segura. Acesso após confirmação. Garantia de 7 dias.
        </p>
      </div>
    </section>
  );
}
