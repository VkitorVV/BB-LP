'use client';

import React from 'react';

export default function MarcaNaoAparece() {
  React.useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('#marca-nao-aparece [data-reveal]'));
    if (!elements.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.22, rootMargin: '0px 0px -8% 0px' }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="marca-nao-aparece"
      aria-labelledby="marca-nao-aparece-title"
      data-track-section="marca-nao-aparece"
      data-track-order="2"
      data-track-title="02 - ELA COMECA ANTES"
    >
      <style>{`
        #marca-nao-aparece {
          position: relative;
          left: 50%;
          width: 100vw;
          max-width: 100vw;
          transform: translateX(-50%);
          box-sizing: border-box;
          overflow: hidden;
          padding: 72px 20px 84px;
          background: #F3EEE6;
          color: var(--color-ink);
          border-bottom: 1px solid rgba(20, 16, 12, 0.12);
        }
        #marca-nao-aparece *,
        #marca-nao-aparece *::before,
        #marca-nao-aparece *::after {
          box-sizing: border-box;
        }
        #marca-nao-aparece .marca-shell {
          width: 100%;
          max-width: 1120px;
          margin: 0 auto;
        }
        #marca-nao-aparece [data-reveal] {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 620ms ease, transform 620ms ease;
        }
        #marca-nao-aparece [data-reveal].is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        #marca-nao-aparece .marca-display {
          font-family: var(--font-display), var(--font-display-family), Impact, sans-serif;
          font-weight: 900;
          letter-spacing: 0;
          line-height: 0.9;
          text-transform: uppercase;
        }
        #marca-nao-aparece .marca-opening {
          max-width: 760px;
          margin: 0 auto 34px;
          color: var(--color-ink);
          text-align: center;
          font-size: clamp(3.05rem, 13vw, 6rem);
        }
        #marca-nao-aparece .marca-composition {
          position: relative;
          width: min(100%, 680px);
          min-height: 0;
          margin: 0 auto;
          text-align: center;
        }
        #marca-nao-aparece .marca-image {
          position: relative;
          z-index: 1;
          display: block;
          width: min(100%, 560px);
          height: auto;
          margin: 0 auto;
          object-fit: contain;
        }
        #marca-nao-aparece .marca-nao {
          position: absolute;
          z-index: 2;
          left: 62%;
          top: 33%;
          max-width: 46%;
          transform: translateY(-50%);
          color: var(--color-ink);
          font-size: clamp(2.55rem, 13vw, 5rem);
          text-align: left;
          text-shadow:
            0 1px 0 rgba(243, 238, 230, 0.9),
            1px 0 0 rgba(243, 238, 230, 0.72),
            -1px 0 0 rgba(243, 238, 230, 0.72);
        }
        #marca-nao-aparece .marca-nada {
          margin: 56px 0 0;
          text-align: center;
          color: var(--color-ink);
          font-size: clamp(3.2rem, 13.6vw, 5.9rem);
        }
        #marca-nao-aparece .marca-nada-alert {
          display: inline-block;
          margin-left: 0.08em;
          padding: 0.02em 0.13em 0.08em;
          border-radius: 2px;
          background: var(--color-alert);
          color: #FFFFFF;
        }
        #marca-nao-aparece .marca-copy-strong {
          max-width: 620px;
          margin: 44px auto 0;
          text-align: center;
          color: var(--color-ink);
          font-size: clamp(1.8rem, 7.5vw, 3.3rem);
        }
        #marca-nao-aparece .marca-causes {
          max-width: 680px;
          margin: 34px auto 0;
          text-align: left;
        }
        #marca-nao-aparece .marca-cause-block {
          display: contents;
        }
        #marca-nao-aparece .marca-cause {
          width: 100%;
          margin: 0;
          color: #30271F;
          font-family: var(--font-sans), var(--font-sans-family);
          font-size: clamp(1rem, 4.2vw, 1.25rem);
          line-height: 1.58;
          font-weight: 650;
        }
        #marca-nao-aparece .marca-conclusion {
          margin: 52px auto 0;
          text-align: center;
        }
        #marca-nao-aparece .marca-conclusion-title {
          margin: 0;
          color: var(--color-ink);
          font-size: clamp(2.05rem, 8vw, 3.65rem);
        }
        #marca-nao-aparece .marca-conclusion-title span {
          display: inline-block;
        }
        #marca-nao-aparece .marca-easy {
          max-width: 620px;
          margin: 52px auto 0;
          text-align: center;
          color: var(--color-ink);
          font-size: clamp(1.85rem, 7.4vw, 3.45rem);
          line-height: 1;
          font-weight: 900;
        }
        #marca-nao-aparece .marca-easy-highlight {
          display: inline-block;
          padding: 0.04em 0.14em 0.1em;
          border-radius: 2px;
          background: var(--color-gold);
          color: var(--color-ink);
        }
        #marca-nao-aparece .marca-arrow {
          display: block;
          width: clamp(82px, 23vw, 128px);
          height: auto;
          margin: 22px auto 0;
          animation: marcaArrowDrift 1500ms ease-in-out infinite;
          filter: sepia(1) saturate(0.75) hue-rotate(354deg) brightness(0.92);
        }
        @keyframes marcaArrowDrift {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
        @media (min-width: 640px) {
          #marca-nao-aparece {
            padding: 88px 28px 100px;
          }
          #marca-nao-aparece .marca-composition {
            width: min(100%, 760px);
            min-height: 0;
          }
          #marca-nao-aparece .marca-image {
            width: min(100%, 620px);
          }
          #marca-nao-aparece .marca-nao {
            left: 61%;
            top: 36%;
            font-size: clamp(4.4rem, 9vw, 6.5rem);
          }
        }
        @media (min-width: 1024px) {
          #marca-nao-aparece {
            padding-top: 112px;
            padding-bottom: 120px;
          }
          #marca-nao-aparece .marca-opening {
            margin-bottom: 42px;
          }
          #marca-nao-aparece .marca-composition {
            width: min(100%, 920px);
            min-height: 0;
          }
          #marca-nao-aparece .marca-image {
            width: min(100%, 690px);
          }
          #marca-nao-aparece .marca-nao {
            left: 58%;
            top: 38%;
            max-width: 42%;
            font-size: clamp(5.9rem, 7.4vw, 7.8rem);
          }
          #marca-nao-aparece .marca-nada {
            margin-top: 74px;
          }
        }
        @media (max-width: 374px) {
          #marca-nao-aparece {
            padding-left: 16px;
            padding-right: 16px;
          }
          #marca-nao-aparece .marca-opening {
            font-size: clamp(3.35rem, 15vw, 4rem);
          }
          #marca-nao-aparece .marca-composition {
            min-height: 0;
          }
          #marca-nao-aparece .marca-image {
            width: 100%;
          }
          #marca-nao-aparece .marca-nao {
            left: 58%;
            top: 31%;
            font-size: clamp(2.35rem, 12.8vw, 2.9rem);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          #marca-nao-aparece [data-reveal] {
            opacity: 1;
            transform: none;
            transition: none;
          }
          #marca-nao-aparece .marca-arrow {
            animation: none;
          }
        }
      `}</style>

      <div className="marca-shell">
        <h2 id="marca-nao-aparece-title" className="marca-display marca-opening" data-reveal>
          Ela começa antes de você perceber
        </h2>

        <div className="marca-composition" data-reveal>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/problema/problema.webp?v=20260717-165129"
            alt="Corte degradê visto de perfil mostrando a marca antes de ficar evidente"
            width={1122}
            height={1402}
            loading="lazy"
            decoding="async"
            sizes="(max-width: 639px) 92vw, (max-width: 1023px) 78vw, 690px"
            className="marca-image"
          />
        </div>

        <div className="marca-causes" data-reveal>
          <p className="marca-cause">
            Às vezes uma faixa sobe mais do que devia, você pula uma altura, ou pesa a
            mão justamente onde só precisava conectar.
            <br />
            <br />
            Mesmo com o pente certo, um mau ajuste na alavanca, no ângulo ou na pressão
            já muda o resultado. Por isso passar a máquina de novo nem sempre resolve.
          </p>
        </div>
      </div>
    </section>
  );
}
