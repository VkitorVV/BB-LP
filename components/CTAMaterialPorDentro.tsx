'use client';

import React from 'react';
import { getSessionId, getUtmParams } from '@/lib/clientTracking';
import { trackInternalCta } from '@/lib/trackInternalCta';
import { OFFER_ANCHOR_ID } from '@/lib/trackingConfig';

export default function CTAMaterialPorDentro() {
  const handleClick = React.useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(OFFER_ANCHOR_ID);
    if (!target) return;

    event.preventDefault();
    trackInternalCta({
      ctaLabel: 'CTA Material Por Dentro',
      buttonLocation: 'cta-material-por-dentro',
      sourceSectionId: 'cta-material-por-dentro',
      sourceSectionTitle: '05 - CTA material por dentro',
      sourceSectionOrder: 5,
      sessionId: getSessionId(),
      utms: getUtmParams(),
    });
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', `#${OFFER_ANCHOR_ID}`);
  }, []);

  return (
    <section
      id="cta-material-por-dentro"
      aria-labelledby="cta-material-por-dentro-title"
      data-track-section="cta-material-por-dentro"
      data-track-order="5"
      data-track-title="05 - CTA material por dentro"
    >
      <style>{`
        #cta-material-por-dentro {
          position: relative;
          left: 50%;
          width: 100vw;
          max-width: 100vw;
          transform: translateX(-50%);
          overflow: hidden;
          box-sizing: border-box;
          padding: 34px 18px 40px;
          background: #F7F1E8;
          color: #FFF4E6;
        }
        #cta-material-por-dentro *,
        #cta-material-por-dentro *::before,
        #cta-material-por-dentro *::after {
          box-sizing: border-box;
        }
        #cta-material-por-dentro .cta-shell {
          width: 100%;
          max-width: 760px;
          margin: 0 auto;
          border-radius: 8px;
          padding: 30px 20px 24px;
          background: #100C08;
          border: 1px solid rgba(216, 166, 74, 0.24);
          box-shadow: 0 20px 46px rgba(31, 24, 16, 0.2);
        }
        #cta-material-por-dentro .cta-detail {
          display: block;
          width: 52px;
          height: 3px;
          margin: 0 0 18px;
          border-radius: 999px;
          background: #D8A64A;
        }
        #cta-material-por-dentro .cta-title {
          max-width: 640px;
          margin: 0;
          color: #FFF4E6;
          font-family: var(--font-display), var(--font-display-family), Impact, sans-serif;
          font-size: clamp(1.74rem, 7.9vw, 4.2rem);
          font-weight: 900;
          letter-spacing: 0;
          line-height: 0.92;
          text-transform: uppercase;
          overflow-wrap: break-word;
        }
        #cta-material-por-dentro .cta-copy {
          max-width: 590px;
          margin: 18px 0 0;
          color: rgba(255, 244, 230, 0.78);
          font-size: clamp(0.98rem, 3.9vw, 1.1rem);
          line-height: 1.45;
          font-weight: 650;
        }
        #cta-material-por-dentro .cta-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 56px;
          margin: 24px 0 0;
          border-radius: 7px;
          background: #D8A64A;
          color: #100C08;
          border: 2px solid #D8A64A;
          font-family: var(--font-display), var(--font-display-family), Impact, sans-serif;
          font-size: 1.16rem;
          font-weight: 900;
          line-height: 1;
          letter-spacing: 0;
          text-align: center;
          text-decoration: none;
          text-transform: uppercase;
          -webkit-tap-highlight-color: transparent;
          transition: transform 150ms ease, background-color 150ms ease, border-color 150ms ease;
        }
        #cta-material-por-dentro .cta-button:active {
          transform: scale(0.985);
        }
        #cta-material-por-dentro .cta-button:focus-visible {
          outline: 3px solid #FFF4E6;
          outline-offset: 3px;
        }
        #cta-material-por-dentro .cta-safe {
          margin: 12px 0 0;
          color: rgba(255, 244, 230, 0.58);
          font-size: 0.76rem;
          line-height: 1.35;
          font-weight: 700;
          text-align: center;
        }
        @media (min-width: 760px) {
          #cta-material-por-dentro {
            padding: 46px 28px 52px;
          }
          #cta-material-por-dentro .cta-shell {
            padding: 40px 40px 32px;
          }
          #cta-material-por-dentro .cta-button {
            width: auto;
            min-width: 280px;
            padding-left: 30px;
            padding-right: 30px;
          }
          #cta-material-por-dentro .cta-safe {
            text-align: left;
          }
        }
      `}</style>

      <div className="cta-shell">
        <span className="cta-detail" aria-hidden="true" />
        <h2 id="cta-material-por-dentro-title" className="cta-title">
          Acesse ainda hoje e consulte o material quando for treinar
        </h2>
        <p className="cta-copy">
          O Mapa do Degradê Sem Marca é digital. Após a confirmação da compra, você recebe o acesso e pode abrir pelo celular, computador ou tablet.
        </p>
        <a
          className="cta-button"
          href="#planos"
          onClick={handleClick}
          data-track-cta="CTA Material Por Dentro"
          data-button-location="cta-material-por-dentro"
        >
          Quero acessar agora
        </a>
        <p className="cta-safe">
          🔒 Compra segura. Material digital. Acesso após confirmação.
        </p>
      </div>
    </section>
  );
}
