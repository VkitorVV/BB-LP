'use client';

import Image from 'next/image';
import React from 'react';

const steps = [
  {
    label: 'MARCAÇÃO',
    src: '/images/metodo-mapa/mapa-marcação.webp',
    alt: 'Leitura visual da marcação na lateral do degradê',
    width: 7431,
    height: 10753,
  },
  {
    label: 'ALTURA',
    src: '/images/metodo-mapa/mapa-altura.webp',
    alt: 'Leitura visual da altura na lateral do degradê',
    width: 7432,
    height: 10753,
  },
  {
    label: 'PONTO DE TRANSIÇÃO',
    src: '/images/metodo-mapa/mapa-ponto-transicao.webp',
    alt: 'Leitura visual do ponto de transição na lateral do degradê',
    width: 7430,
    height: 10753,
  },
  {
    label: 'ACABAMENTO',
    src: '/images/metodo-mapa/mapa-acabamento.webp',
    alt: 'Leitura visual do acabamento na lateral do degradê',
    width: 7430,
    height: 10753,
  },
] as const;

function padIndex(index: number) {
  return String(index + 1).padStart(2, '0');
}

export default function SeMarcaNaoSai() {
  const [active, setActive] = React.useState(0);
  const [hasInteracted, setHasInteracted] = React.useState(false);
  const swipeStartRef = React.useRef<{ x: number; y: number } | null>(null);

  const previousIndex = (active + steps.length - 1) % steps.length;
  const nextIndex = (active + 1) % steps.length;
  const current = steps[active];

  const show = React.useCallback((index: number) => {
    setActive(index);
    setHasInteracted(true);
  }, []);

  const handlePointerDown = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    swipeStartRef.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }, []);

  const handlePointerUp = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const start = swipeStartRef.current;
    swipeStartRef.current = null;

    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (!start) return;
    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.abs(deltaX) < 38 || Math.abs(deltaX) < Math.abs(deltaY) * 1.15) return;

    show(deltaX < 0 ? nextIndex : previousIndex);
  }, [nextIndex, previousIndex, show]);

  return (
    <section
      id="se-a-marca-nao-sai"
      aria-labelledby="se-a-marca-nao-sai-title"
      data-track-section="se-a-marca-nao-sai"
      data-track-order="3"
      data-track-title="03 - SE A MARCA NÃO SAI"
    >
      <style>{`
        #se-a-marca-nao-sai {
          position: relative;
          left: 50%;
          width: 100vw;
          max-width: 100vw;
          transform: translateX(-50%);
          box-sizing: border-box;
          overflow: hidden;
          padding: 74px 20px 84px;
          background: var(--color-paper);
          color: var(--color-ink);
          border-bottom: 1px solid rgba(31, 24, 16, 0.12);
        }
        #se-a-marca-nao-sai *,
        #se-a-marca-nao-sai *::before,
        #se-a-marca-nao-sai *::after {
          box-sizing: border-box;
        }
        #se-a-marca-nao-sai .sai-shell {
          width: 100%;
          max-width: 980px;
          margin: 0 auto;
        }
        #se-a-marca-nao-sai .sai-display {
          font-family: var(--font-display), var(--font-display-family), Impact, sans-serif;
          font-weight: 900;
          letter-spacing: 0;
          line-height: 0.9;
          text-transform: uppercase;
        }
        #se-a-marca-nao-sai .sai-title {
          margin: 0 auto;
          color: var(--color-ink);
          text-align: center;
          font-size: clamp(3.25rem, 13.8vw, 6.4rem);
        }
        #se-a-marca-nao-sai .sai-title-alert {
          position: relative;
          display: inline-block;
          margin-top: 0.12em;
        }
        #se-a-marca-nao-sai .sai-title-alert::after {
          content: '';
          position: absolute;
          left: 0.04em;
          right: 0.04em;
          bottom: -0.08em;
          height: 0.08em;
          background: var(--color-alert);
        }
        #se-a-marca-nao-sai .sai-consequence {
          position: relative;
          display: grid;
          gap: 38px;
          max-width: 720px;
          margin: 66px auto 0;
          text-align: center;
          color: var(--color-ink);
          font-size: clamp(1.35rem, 5.7vw, 3.2rem);
        }
        #se-a-marca-nao-sai .sai-lines {
          position: absolute;
          inset: 42px 0 42px;
          z-index: 0;
          width: 100%;
          height: calc(100% - 84px);
          pointer-events: none;
          overflow: visible;
        }
        #se-a-marca-nao-sai .sai-lines path {
          fill: none;
          stroke: rgba(16, 15, 13, 0.48);
          stroke-width: 1.8;
          vector-effect: non-scaling-stroke;
        }
        #se-a-marca-nao-sai .sai-node {
          position: relative;
          z-index: 1;
        }
        #se-a-marca-nao-sai .sai-branch {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          align-items: center;
          gap: 18px;
          width: 100%;
          margin: 2px auto;
        }
        #se-a-marca-nao-sai .sai-node-left {
          justify-self: start;
          text-align: left;
        }
        #se-a-marca-nao-sai .sai-node-right {
          justify-self: end;
          text-align: right;
        }
        #se-a-marca-nao-sai .sai-consequence .sai-mark {
          display: inline-block;
          color: var(--color-alert);
        }
        #se-a-marca-nao-sai .sai-intro {
          max-width: 680px;
          margin: 72px auto 0;
          text-align: center;
          color: var(--color-ink);
          font-size: clamp(2.1rem, 8.4vw, 3.85rem);
        }
        #se-a-marca-nao-sai .sai-gold {
          display: inline-block;
          padding-bottom: 0.06em;
          border-bottom: 0.08em solid var(--color-gold);
        }
        #se-a-marca-nao-sai .sai-slot {
          width: min(100%, 540px);
          margin: 46px auto 0;
          touch-action: pan-y;
          -webkit-user-select: none;
          user-select: none;
        }
        #se-a-marca-nao-sai .sai-slot-head {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin: 0 0 14px;
          color: #5B4E3F;
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.08em;
        }
        #se-a-marca-nao-sai .sai-slot-hint {
          max-width: 220px;
          margin: 0;
          line-height: 1.18;
          text-align: center;
          opacity: 0.72;
          transition: opacity 240ms ease;
        }
        #se-a-marca-nao-sai .sai-slot-hint.is-muted {
          opacity: 0;
        }
        #se-a-marca-nao-sai .sai-counter {
          color: var(--color-ink);
          font-size: 0.9rem;
        }
        #se-a-marca-nao-sai .sai-progress,
        #se-a-marca-nao-sai .sai-side {
          display: none;
        }
        #se-a-marca-nao-sai .sai-stage {
          position: relative;
          height: clamp(500px, 128vw, 720px);
          overflow: hidden;
          isolation: isolate;
          border-top: 1px solid rgba(215, 164, 44, 0.45);
          border-bottom: 1px solid rgba(215, 164, 44, 0.45);
          touch-action: pan-y;
        }
        #se-a-marca-nao-sai .sai-stage::before,
        #se-a-marca-nao-sai .sai-stage::after {
          content: none;
          position: absolute;
          left: 0;
          right: 0;
          z-index: 5;
          height: 26%;
          pointer-events: none;
        }
        #se-a-marca-nao-sai .sai-stage::before {
          top: 0;
          background: linear-gradient(180deg, var(--color-paper) 0%, rgba(247, 241, 232, 0) 100%);
        }
        #se-a-marca-nao-sai .sai-stage::after {
          bottom: 0;
          background: linear-gradient(0deg, var(--color-paper) 0%, rgba(247, 241, 232, 0) 100%);
        }
        #se-a-marca-nao-sai .sai-main {
          position: absolute;
          left: 50%;
          width: min(86%, 450px);
          border: 0;
          padding: 0;
          background: transparent;
        }
        #se-a-marca-nao-sai .sai-main {
          z-index: 4;
          top: 50%;
          height: 88%;
          transform: translate(-50%, -50%);
          animation: saiSlotIn 440ms ease both;
        }
        #se-a-marca-nao-sai .sai-arrow {
          position: absolute;
          top: 50%;
          z-index: 8;
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(16, 15, 13, 0.16);
          border-radius: 8px;
          background: rgba(247, 241, 232, 0.9);
          color: var(--color-ink);
          font-size: 1.7rem;
          font-weight: 900;
          line-height: 1;
          cursor: pointer;
          transform: translateY(-50%);
          box-shadow: none;
        }
        #se-a-marca-nao-sai .sai-arrow:focus-visible {
          outline: 3px solid var(--color-gold);
          outline-offset: 3px;
        }
        #se-a-marca-nao-sai .sai-arrow-left {
          left: 4px;
        }
        #se-a-marca-nao-sai .sai-arrow-right {
          right: 4px;
        }
        #se-a-marca-nao-sai .sai-image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        #se-a-marca-nao-sai .sai-step-label {
          position: absolute;
          z-index: 6;
          left: 50%;
          bottom: 18px;
          transform: translateX(-50%);
          width: max-content;
          max-width: calc(100% - 24px);
          padding: 0.36em 0.6em 0.42em;
          background: rgba(247, 241, 232, 0.92);
          color: var(--color-ink);
          border: 1px solid rgba(215, 164, 44, 0.7);
          font-size: clamp(1.1rem, 5vw, 1.65rem);
          text-align: center;
        }
        #se-a-marca-nao-sai .sai-close {
          margin: 64px auto 0;
          text-align: center;
          color: var(--color-ink);
          font-size: clamp(2.05rem, 8.2vw, 3.75rem);
        }
        #se-a-marca-nao-sai .sai-close span {
          display: inline-block;
        }
        @keyframes saiSlotIn {
          from {
            opacity: 0;
            transform: translate(-50%, -46%) scale(0.985);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        @media (min-width: 760px) {
          #se-a-marca-nao-sai {
            padding: 96px 28px 108px;
          }
          #se-a-marca-nao-sai .sai-slot {
            width: min(100%, 600px);
            margin-top: 54px;
          }
          #se-a-marca-nao-sai .sai-stage {
            height: 740px;
          }
          #se-a-marca-nao-sai .sai-main {
            width: min(82%, 500px);
          }
        }
        @media (max-width: 759px) {
          #se-a-marca-nao-sai .sai-consequence {
            max-width: 420px;
          }
          #se-a-marca-nao-sai .sai-branch {
            grid-template-columns: 1fr;
          }
          #se-a-marca-nao-sai .sai-node-left,
          #se-a-marca-nao-sai .sai-node-right {
            justify-self: center;
            text-align: center;
          }
          #se-a-marca-nao-sai .sai-lines {
            display: none;
          }
        }
        @media (max-width: 374px) {
          #se-a-marca-nao-sai {
            padding-left: 16px;
            padding-right: 16px;
          }
          #se-a-marca-nao-sai .sai-title {
            font-size: clamp(2.85rem, 13vw, 3.35rem);
          }
          #se-a-marca-nao-sai .sai-stage {
            height: 500px;
          }
          #se-a-marca-nao-sai .sai-consequence {
            gap: 34px;
            font-size: clamp(1.16rem, 5.15vw, 1.48rem);
          }
          #se-a-marca-nao-sai .sai-branch {
            gap: 10px;
          }
          #se-a-marca-nao-sai .sai-step-label {
            bottom: 14px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          #se-a-marca-nao-sai *,
          #se-a-marca-nao-sai *::before,
          #se-a-marca-nao-sai *::after {
            scroll-behavior: auto !important;
            animation-duration: 1ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 1ms !important;
          }
        }
      `}</style>

      <div className="sai-shell">
        <h2 id="se-a-marca-nao-sai-title" className="sai-display sai-title">
          Antes de corrigir,
          <br />
          compara estas
          <br />
          <span className="sai-title-alert">4 partes da lateral</span>
        </h2>

        <div className="sai-method-block">
          <div className="sai-slot" aria-label="Sequencia visual das quatro partes da lateral">
            <div className="sai-slot-head">
              <span className="sai-counter" aria-live="polite">
                {padIndex(active)} / 04
              </span>
              <p className={`sai-slot-hint${hasInteracted ? ' is-muted' : ''}`}>
                ARRASTE PARA O LADO
                <br />
                PARA VER CADA PARTE
              </p>
            </div>

            <div className="sai-progress" aria-label="Etapas do Metodo M.A.P.A.">
              {steps.map((step, index) => (
                <div className={`sai-progress-item${index === active ? ' is-active' : ''}`} key={step.label}>
                  <span className="sai-progress-letter">{step.label.charAt(0)}</span>
                  <span><span aria-hidden="true">— </span>{step.label}</span>
                </div>
              ))}
            </div>

            <div
              className="sai-stage"
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerCancel={() => { swipeStartRef.current = null; }}
            >
              <button
                className="sai-arrow sai-arrow-left"
                type="button"
                onClick={() => show(previousIndex)}
                aria-label="Mostrar etapa anterior"
              >
                &lsaquo;
              </button>

              <button
                className="sai-side sai-side-left"
                type="button"
                onClick={() => show(previousIndex)}
                aria-label="Mostrar etapa anterior"
              >
                <Image
                  className="sai-image"
                  src={steps[previousIndex].src}
                  alt=""
                  width={steps[previousIndex].width}
                  height={steps[previousIndex].height}
                  sizes="(max-width: 759px) 58vw, 430px"
                  aria-hidden="true"
                />
              </button>

              <div className="sai-main" key={current.label} aria-current="true">
                <Image
                  className="sai-image"
                  src={current.src}
                  alt={current.alt}
                  width={current.width}
                  height={current.height}
                  sizes="(max-width: 759px) 76vw, 600px"
                />
                <div className="sai-display sai-step-label">{current.label}</div>
              </div>

              <button
                className="sai-side sai-side-right"
                type="button"
                onClick={() => show(nextIndex)}
                aria-label="Mostrar proxima etapa"
              >
                <Image
                  className="sai-image"
                  src={steps[nextIndex].src}
                  alt=""
                  width={steps[nextIndex].width}
                  height={steps[nextIndex].height}
                  sizes="(max-width: 759px) 58vw, 430px"
                  aria-hidden="true"
                />
              </button>

              <button
                className="sai-arrow sai-arrow-right"
                type="button"
                onClick={() => show(nextIndex)}
                aria-label="Mostrar proxima etapa"
              >
                &rsaquo;
              </button>
            </div>
          </div>
        </div>

        <p className="sai-display sai-close">
          SEM CLAREZA VISUAL DO QUE REVISAR, VOCÊ PODE MEXER NA FAIXA ERRADA,
          SUBIR O DEGRADÊ E DEIXAR A MARCA AINDA MAIS PESADA.
        </p>
      </div>
    </section>
  );
}
