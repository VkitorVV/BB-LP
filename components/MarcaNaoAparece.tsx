'use client';

import React from 'react';
import Image from 'next/image';

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
      data-track-title="02 - NÃO APARECE DO NADA"
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
          color: #11100E;
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
          margin: 0 auto 54px;
          color: #11100E;
          text-align: center;
          font-size: clamp(3.9rem, 16vw, 7rem);
        }
        #marca-nao-aparece .marca-composition {
          position: relative;
          width: min(100%, 620px);
          min-height: 360px;
          margin: 0 auto;
        }
        #marca-nao-aparece .marca-image {
          position: relative;
          z-index: 1;
          display: block;
          width: 76%;
          height: auto;
          margin-right: auto;
          object-fit: contain;
        }
        #marca-nao-aparece .marca-nao {
          position: absolute;
          z-index: 2;
          left: 62%;
          top: 33%;
          max-width: 46%;
          transform: translateY(-50%);
          color: #11100E;
          font-size: clamp(2.55rem, 13vw, 5.2rem);
          text-align: left;
          text-shadow:
            0 1px 0 rgba(243, 238, 230, 0.9),
            1px 0 0 rgba(243, 238, 230, 0.72),
            -1px 0 0 rgba(243, 238, 230, 0.72);
        }
        #marca-nao-aparece .marca-nada {
          margin: 56px 0 0;
          text-align: center;
          color: #11100E;
          font-size: clamp(3.6rem, 15vw, 6.6rem);
        }
        #marca-nao-aparece .marca-nada-alert {
          display: inline-block;
          margin-left: 0.08em;
          padding: 0.02em 0.13em 0.08em;
          border-radius: 2px;
          background: #A92A2A;
          color: #FFFFFF;
        }
        #marca-nao-aparece .marca-copy-strong {
          max-width: 620px;
          margin: 44px auto 0;
          text-align: center;
          color: #11100E;
          font-size: clamp(1.8rem, 7.5vw, 3.3rem);
        }
        #marca-nao-aparece .marca-causes {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 17px;
          max-width: 620px;
          margin: 42px auto 0;
          text-align: center;
        }
        #marca-nao-aparece .marca-cause {
          width: 100%;
          margin: 0;
          color: #30271F;
          font-size: clamp(1.18rem, 4.7vw, 1.85rem);
          line-height: 1.12;
          font-weight: 800;
        }
        #marca-nao-aparece .marca-conclusion {
          margin: 52px auto 0;
          text-align: center;
        }
        #marca-nao-aparece .marca-conclusion-title {
          margin: 0;
          color: #11100E;
          font-size: clamp(2.05rem, 8vw, 3.65rem);
        }
        #marca-nao-aparece .marca-conclusion-title span {
          display: inline-block;
        }
        #marca-nao-aparece .marca-easy {
          max-width: 620px;
          margin: 52px auto 0;
          text-align: center;
          color: #11100E;
          font-size: clamp(1.85rem, 7.4vw, 3.45rem);
          line-height: 1;
          font-weight: 900;
        }
        #marca-nao-aparece .marca-easy-highlight {
          display: inline-block;
          padding: 0.04em 0.14em 0.1em;
          border-radius: 2px;
          background: #2FFF00;
          color: #11100E;
        }
        #marca-nao-aparece .marca-arrow {
          display: block;
          width: clamp(82px, 23vw, 128px);
          height: auto;
          margin: 22px auto 0;
          animation: marcaArrowDrift 1500ms ease-in-out infinite;
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
            min-height: 470px;
          }
          #marca-nao-aparece .marca-image {
            width: 70%;
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
            margin-bottom: 76px;
          }
          #marca-nao-aparece .marca-composition {
            width: min(100%, 980px);
            min-height: 590px;
          }
          #marca-nao-aparece .marca-image {
            width: 64%;
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
            min-height: 330px;
          }
          #marca-nao-aparece .marca-image {
            width: 74%;
          }
          #marca-nao-aparece .marca-nao {
            left: 62%;
            top: 33%;
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
          A MARCA
        </h2>

        <div className="marca-composition" data-reveal>
          <Image
            src="/images/problema/problema.webp"
            alt="Corte degradê visto de perfil mostrando a marca antes de ficar evidente"
            width={1122}
            height={1402}
            loading="lazy"
            sizes="(max-width: 639px) 76vw, (max-width: 1023px) 70vw, 630px"
            className="marca-image"
          />
          <div className="marca-display marca-nao" aria-label="Não aparece">
            NÃO
            <br />
            APARECE
          </div>
        </div>

        <p className="marca-display marca-nada" data-reveal>
          DO <span className="marca-nada-alert">NADA</span>.
        </p>

        <p className="marca-display marca-copy-strong" data-reveal>
          Ela começa antes
          <br />
          de você perceber.
        </p>

        <div className="marca-causes">
          <p className="marca-cause" data-reveal>
            Quando uma altura invade a outra.
          </p>
          <p className="marca-cause" data-reveal>
            Quando o pente sobe
            <br />
            além do necessário.
          </p>
          <p className="marca-cause" data-reveal>
            A alavanca,
          </p>
          <p className="marca-cause" data-reveal>
            O ângulo,
          </p>
          <p className="marca-cause" data-reveal>
            E a pressão,
          </p>
          <p className="marca-cause" data-reveal>
            Deixam peso
            <br />
            no lugar da transição.
          </p>
        </div>

        <div className="marca-easy-wrap" data-reveal>
          <p className="marca-display marca-easy">
            Mas isso é <span className="marca-easy-highlight">bem mais fácil</span>
            <br />
            de resolver do que você imagina.
          </p>
          <img
            className="marca-arrow"
            src="/images/seta-anima%C3%A7%C3%A3o/seta-verde-anima%C3%A7%C3%A3o.svg"
            alt=""
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
