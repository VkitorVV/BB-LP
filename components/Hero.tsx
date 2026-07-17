'use client';

import React from 'react';
import Image from 'next/image';
import { trackInternalCta } from '@/lib/trackInternalCta';
import { getSessionId, getUtmParams } from '@/lib/clientTracking';
import { OFFER_ANCHOR_ID } from '@/lib/trackingConfig';

export default function Hero() {
  const handleScrollToOffer = () => {
    trackInternalCta({
      ctaLabel: 'CTA Hero',
      buttonLocation: 'hero',
      sourceSectionId: 'hero',
      sourceSectionTitle: '01 - HERO',
      sourceSectionOrder: 1,
      sessionId: getSessionId(),
      utms: getUtmParams(),
    });
    document.getElementById(OFFER_ANCHOR_ID)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      data-track-section="hero"
      data-track-order="1"
      data-track-title="01 - HERO"
    >
      <style>{`
        #hero {
          position: relative;
          left: 50%;
          width: 100vw;
          max-width: 100vw;
          transform: translateX(-50%);
          box-sizing: border-box;
          overflow: hidden;
          padding: 32px 20px 40px;
          background: #F8F3EA;
          border-bottom: 1px solid rgba(20, 16, 12, 0.12);
          color: #11100E;
        }
        #hero *,
        #hero *::before,
        #hero *::after {
          box-sizing: border-box;
        }
        #hero .hero-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(248,243,234,0.96) 56%, rgba(242,232,216,0.72) 100%);
        }
        #hero .hero-shell {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 1152px;
          margin: 0 auto;
        }
        #hero .hero-top {
          display: grid;
          gap: 32px;
          align-items: center;
        }
        #hero .hero-intro {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 100%;
          min-width: 0;
        }
        #hero .hero-tag {
          display: inline-block;
          border: 1px solid rgba(216, 166, 74, 0.48);
          border-radius: 999px;
          background: #FFF8EC;
          color: #6B4B16;
          padding: 6px 12px;
          max-width: 100%;
          font-size: 0.58rem;
          line-height: 1.15;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-align: center;
          text-transform: uppercase;
        }
        #hero .hero-title {
          margin: 20px 0 0;
          color: #11100E;
          font-family: var(--font-display), var(--font-display-family), Impact, sans-serif;
          font-size: clamp(2.55rem, 11.5vw, 3.45rem);
          line-height: 0.9;
          font-weight: 900;
          letter-spacing: 0;
          text-transform: uppercase;
        }
        #hero .hero-title-line {
          display: block;
        }
        #hero .hero-title-line + .hero-title-line {
          margin-top: 4px;
        }
        #hero .hero-title-heavy {
          display: block;
          margin-top: 12px;
          font-size: 1.04em;
          line-height: 0.86;
        }
        #hero .hero-underline-wrap {
          position: relative;
          display: inline-block;
        }
        #hero .hero-continua {
          display: inline-block;
        }
        #hero .hero-underline {
          position: absolute;
          left: -0.05em;
          right: -0.05em;
          bottom: 0.02em;
          height: 0.16em;
          border-radius: 999px;
          transform: rotate(-1deg);
          background: rgba(216, 166, 74, 0.72);
        }
        #hero .hero-underline-text {
          position: relative;
        }
        #hero .hero-tension {
          margin: 24px 0 0;
          width: 100%;
          max-width: 520px;
          color: #3B3026;
          font-size: 1rem;
          line-height: 1.65;
          font-weight: 700;
          overflow-wrap: break-word;
        }
        #hero .hero-visual {
          position: relative;
          width: 100%;
          max-width: 460px;
          margin: 8px auto 0;
          padding: 12px 0 8px;
          overflow: visible;
        }
        #hero .hero-main-image {
          position: relative;
          z-index: 10;
          display: block;
          width: 100%;
          height: auto;
          margin: 0 auto;
          object-fit: contain;
        }
        #hero .hero-callout {
          position: absolute;
          z-index: 20;
          width: max-content;
          color: #11100E;
          font-family: var(--font-display), var(--font-display-family), Impact, sans-serif;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0;
          pointer-events: none;
        }
        #hero .hero-callout span {
          color: #11100E;
          display: inline-block;
          font-size: clamp(1.05rem, 3.85vw, 1.32rem);
          line-height: 1.05;
          font-weight: 900;
          text-shadow:
            0 1px 0 rgba(248,243,234,0.95),
            1px 0 0 rgba(248,243,234,0.75),
            -1px 0 0 rgba(248,243,234,0.75);
        }
        #hero .callout-peso {
          left: 30%;
          top: 9.5%;
        }
        #hero .callout-transicao {
          left: 4%;
          top: 37.5%;
        }
        #hero .callout-base {
          left: 14%;
          top: 65%;
        }
        #hero .hero-reveal {
          max-width: 672px;
          margin: 28px auto 0;
          text-align: center;
        }
        #hero .hero-reveal-strong {
          margin: 0;
          color: #11100E;
          font-family: var(--font-display), var(--font-display-family), Impact, sans-serif;
          font-size: clamp(1.75rem, 8vw, 2.55rem);
          line-height: 0.95;
          font-weight: 900;
          text-transform: uppercase;
        }
        #hero .hero-reveal-copy,
        #hero .hero-product-copy {
          color: #3B3026;
          font-size: 1rem;
          line-height: 1.65;
        }
        #hero .hero-reveal-copy {
          max-width: 560px;
          margin: 12px auto 0;
          font-weight: 700;
        }
        #hero .hero-product-copy {
          max-width: 580px;
          margin: 28px auto 0;
          text-align: center;
        }
        #hero .hero-cta-wrap {
          width: 100%;
          max-width: 384px;
          margin: 32px auto 0;
        }
        #hero .hero-cta {
          width: 100%;
          min-height: 54px;
          border: 0;
          border-radius: 8px;
          background: #F28A1A;
          color: #0B0704;
          padding: 16px 24px;
          cursor: pointer;
          font-family: var(--font-display), var(--font-display-family), Impact, sans-serif;
          font-size: 0.95rem;
          line-height: 1;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition: background 150ms ease, transform 150ms ease;
        }
        #hero .hero-cta:hover {
          background: #D87512;
        }
        #hero .hero-cta:active {
          transform: scale(0.98);
        }
        #hero .hero-cta:focus-visible {
          outline: 4px solid rgba(216, 166, 74, 0.35);
          outline-offset: 3px;
        }
        #hero .hero-trust {
          max-width: 288px;
          margin: 12px auto 0;
          color: #6B5B47;
          text-align: center;
          font-size: 0.76rem;
          line-height: 1.55;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        @media (min-width: 640px) {
          #hero {
            padding-left: 24px;
            padding-right: 24px;
          }
          #hero .hero-tag {
            font-size: 0.68rem;
          }
          #hero .hero-title {
            font-size: clamp(3.7rem, 9vw, 4.55rem);
          }
          #hero .hero-tension,
          #hero .hero-reveal-copy,
          #hero .hero-product-copy {
            font-size: 1.08rem;
          }
          #hero .hero-visual {
            max-width: 520px;
          }
          #hero .hero-main-image {
            width: 96%;
          }
          #hero .hero-trust {
            max-width: none;
            font-size: 0.8rem;
          }
        }
        @media (min-width: 768px) {
          #hero {
            padding-top: 48px;
            padding-bottom: 48px;
          }
          #hero .hero-top {
            grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
            gap: 32px;
          }
          #hero .hero-title {
            font-size: clamp(4rem, 5vw, 4.9rem);
          }
          #hero .hero-visual {
            max-width: 610px;
            margin-top: 0;
          }
          #hero .hero-main-image {
            width: 100%;
          }
          #hero .hero-reveal {
            margin-top: 32px;
          }
          #hero .hero-product-copy {
            margin-top: 32px;
          }
          #hero .hero-cta-wrap {
            margin-top: 36px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          #hero .hero-cta {
            transition: none;
          }
        }
      `}</style>
      <div className="hero-bg" />

      <div className="hero-shell">
        <div className="hero-top">
          <div className="hero-intro">
            <span className="hero-tag">PARA BARBEIROS INICIANTES E INTERMEDIÁRIOS</span>

            <h1 className="hero-title">
              <span className="hero-title-line">VOCÊ CAPRICHA.</span>
              <span className="hero-title-line">REVISA...</span>
              <span className="hero-title-heavy">
                <span className="hero-title-line">E A MARCA</span>
                <span className="hero-underline-wrap hero-continua">
                  <span className="hero-underline" />
                  <span className="hero-underline-text">CONTINUA ALI?</span>
                </span>
              </span>
            </h1>

            <p className="hero-tension">
              Antes de passar a máquina de novo,
              <br />
              descubra onde a transição
              <br />
              começou a pesar.
            </p>
          </div>

          <div className="hero-visual">
            <Image
              src="/images/hero/mockup-hero-sf.webp"
              alt="Cabeça de perfil com degradê dividido visualmente em peso, transição pesada e base"
              width={1024}
              height={1365}
              unoptimized
              priority
              fetchPriority="high"
              loading="eager"
              decoding="async"
              sizes="(max-width: 767px) 92vw, (max-width: 1199px) 50vw, 610px"
              className="hero-main-image"
            />

            <div className="hero-callout callout-peso">
              <span>PESO</span>
            </div>

            <div className="hero-callout callout-transicao">
              <span>
                TRANSIÇÃO
                <br />
                PESADA
              </span>
            </div>

            <div className="hero-callout callout-base">
              <span>BASE</span>
            </div>
          </div>
        </div>

        <div className="hero-reveal">
          <p className="hero-reveal-strong">O corte já mostra onde o problema começou.</p>
          <p className="hero-reveal-copy">Você só precisa aprender a ler os sinais.</p>
        </div>

        <p className="hero-product-copy">
          O Mapa do Degradê Sem Marca organiza essa leitura de forma visual, para você
          entender onde revisar antes de continuar corrigindo no improviso.
        </p>

        <div className="hero-cta-wrap">
          <button
            onClick={handleScrollToOffer}
            className="hero-cta"
            data-track-cta="CTA Hero"
            data-button-location="hero"
          >
            QUERO ACESSAR O MAPA
          </button>
          <p className="hero-trust">GUIA VISUAL EM PDF • ACESSO IMEDIATO • 7 DIAS DE GARANTIA</p>
        </div>
      </div>
    </section>
  );
}
