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

  const previousIndex = (active + steps.length - 1) % steps.length;
  const nextIndex = (active + 1) % steps.length;
  const previous = steps[previousIndex];
  const current = steps[active];
  const next = steps[nextIndex];

  function show(index: number) {
    setActive(index);
    setHasInteracted(true);
  }

  return (
    <section
      id="se-a-marca-nao-sai"
      aria-labelledby="se-a-marca-nao-sai-title"
      data-track-section="se-a-marca-nao-sai"
      data-track-order="3"
      data-track-title="03 - Se a marca não sai"
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
          background: #F7F1E8;
          color: #100F0D;
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
          color: #100F0D;
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
          background: #A92A2A;
        }
        #se-a-marca-nao-sai .sai-consequence {
          position: relative;
          display: grid;
          gap: 38px;
          max-width: 720px;
          margin: 66px auto 0;
          text-align: center;
          color: #100F0D;
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
        #se-a-marca-nao-sai .sai-branch .sai-node {
          font-size: 0.86em;
        }
        #se-a-marca-nao-sai .sai-consequence .sai-mark {
          display: inline-block;
          color: #A92A2A;
        }
        #se-a-marca-nao-sai .sai-intro {
          max-width: 680px;
          margin: 72px auto 0;
          text-align: center;
          color: #100F0D;
          font-size: clamp(2.1rem, 8.4vw, 3.85rem);
        }
        #se-a-marca-nao-sai .sai-gold {
          display: inline-block;
          padding-bottom: 0.06em;
          border-bottom: 0.08em solid #D7A42C;
        }
        #se-a-marca-nao-sai .sai-slot {
          width: min(100%, 450px);
          margin: 46px auto 0;
          touch-action: pan-y;
          -webkit-user-select: none;
          user-select: none;
        }
        #se-a-marca-nao-sai .sai-slot-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 14px;
          color: #5B4E3F;
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.08em;
        }
        #se-a-marca-nao-sai .sai-slot-hint {
          max-width: 180px;
          margin: 0;
          line-height: 1.18;
          text-align: right;
          opacity: 0.72;
          transition: opacity 240ms ease;
        }
        #se-a-marca-nao-sai .sai-slot-hint.is-muted {
          opacity: 0;
        }
        #se-a-marca-nao-sai .sai-counter {
          color: #100F0D;
          font-size: 0.9rem;
        }
        #se-a-marca-nao-sai .sai-stage {
          position: relative;
          height: clamp(520px, 138vw, 690px);
          overflow: hidden;
          isolation: isolate;
          border-top: 1px solid rgba(215, 164, 44, 0.45);
          border-bottom: 1px solid rgba(215, 164, 44, 0.45);
        }
        #se-a-marca-nao-sai .sai-stage::before,
        #se-a-marca-nao-sai .sai-stage::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          z-index: 5;
          height: 26%;
          pointer-events: none;
        }
        #se-a-marca-nao-sai .sai-stage::before {
          top: 0;
          background: linear-gradient(180deg, #F7F1E8 0%, rgba(247, 241, 232, 0) 100%);
        }
        #se-a-marca-nao-sai .sai-stage::after {
          bottom: 0;
          background: linear-gradient(0deg, #F7F1E8 0%, rgba(247, 241, 232, 0) 100%);
        }
        #se-a-marca-nao-sai .sai-preview,
        #se-a-marca-nao-sai .sai-main {
          position: absolute;
          left: 50%;
          width: 92%;
          transform: translateX(-50%);
          border: 0;
          padding: 0;
          background: transparent;
        }
        #se-a-marca-nao-sai .sai-preview {
          z-index: 2;
          height: 72%;
          cursor: pointer;
          opacity: 0.34;
          transition: opacity 420ms ease, transform 420ms ease;
        }
        #se-a-marca-nao-sai .sai-preview:hover,
        #se-a-marca-nao-sai .sai-preview:focus-visible {
          opacity: 0.48;
        }
        #se-a-marca-nao-sai .sai-preview:focus-visible {
          outline: 3px solid #D7A42C;
          outline-offset: 4px;
        }
        #se-a-marca-nao-sai .sai-preview-top {
          top: -55%;
          transform: translateX(-50%) scale(0.9);
          transform-origin: bottom center;
        }
        #se-a-marca-nao-sai .sai-preview-bottom {
          bottom: -55%;
          transform: translateX(-50%) scale(0.9);
          transform-origin: top center;
        }
        #se-a-marca-nao-sai .sai-main {
          z-index: 4;
          top: 50%;
          height: 78%;
          transform: translate(-50%, -50%);
          animation: saiSlotIn 440ms ease both;
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
          color: #100F0D;
          border: 1px solid rgba(215, 164, 44, 0.7);
          font-size: clamp(1.1rem, 5vw, 1.65rem);
          text-align: center;
        }
        #se-a-marca-nao-sai .sai-close {
          margin: 64px auto 0;
          text-align: center;
          color: #100F0D;
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
            width: min(100%, 520px);
            margin-top: 54px;
          }
          #se-a-marca-nao-sai .sai-stage {
            height: 740px;
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
          SE A MARCA NÃO SAI,
          <br />
          <span className="sai-title-alert">
            NÃO PASSE A MÁQUINA
            <br />
            DE NOVO.
          </span>
        </h2>

        <div className="sai-display sai-consequence" aria-label="Diagrama de causa e consequência da correção sem clareza visual">
          <svg className="sai-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path d="M50 9 L27 38" />
            <path d="M50 9 L73 38" />
            <path d="M27 62 L50 91" />
            <path d="M73 62 L50 91" />
          </svg>
          <div className="sai-node">
            SEM CLAREZA VISUAL
            <br />
            DO QUE REVISAR,
          </div>
          <div className="sai-branch">
            <div className="sai-node sai-node-left">
              VOCÊ PODE MEXER
              <br />
              NA FAIXA ERRADA,
            </div>
            <div className="sai-node sai-node-right sai-mark">SUBIR O DEGRADÊ</div>
          </div>
          <div className="sai-node">
            E DEIXAR A MARCA
            <br />
            <span className="sai-mark">AINDA MAIS PESADA.</span>
          </div>
        </div>

        <p className="sai-display sai-intro">
          ANTES DE CORRIGIR,
          <br />
          <br />
          COMPARE ESTAS
          <br />
          <span className="sai-gold">4 PARTES DA LATERAL.</span>
        </p>

        <div className="sai-slot" aria-label="Sequência visual das quatro partes da lateral">
          <div className="sai-slot-head">
            <span className="sai-counter" aria-live="polite">
              {padIndex(active)} / 04
            </span>
            <p className={`sai-slot-hint${hasInteracted ? ' is-muted' : ''}`}>
              TOQUE ACIMA OU ABAIXO
              <br />
              PARA VER CADA PARTE
            </p>
          </div>

          <div className="sai-stage">
            <button
              className="sai-preview sai-preview-top"
              type="button"
              onClick={() => show(previousIndex)}
              aria-label={`Mostrar etapa anterior: ${previous.label}`}
            >
              <Image
                className="sai-image"
                src={previous.src}
                alt={previous.alt}
                width={previous.width}
                height={previous.height}
                sizes="(max-width: 759px) 86vw, 478px"
              />
            </button>

            <div className="sai-main" key={current.label} aria-current="true">
              <Image
                className="sai-image"
                src={current.src}
                alt={current.alt}
                width={current.width}
                height={current.height}
                sizes="(max-width: 759px) 92vw, 520px"
              />
              <div className="sai-display sai-step-label">{current.label}</div>
            </div>

            <button
              className="sai-preview sai-preview-bottom"
              type="button"
              onClick={() => show(nextIndex)}
              aria-label={`Mostrar próxima etapa: ${next.label}`}
            >
              <Image
                className="sai-image"
                src={next.src}
                alt={next.alt}
                width={next.width}
                height={next.height}
                sizes="(max-width: 759px) 86vw, 478px"
              />
            </button>
          </div>
        </div>

        <p className="sai-display sai-close">
          <span>EM VEZ DE VOLTAR</span>
          <br />
          <span>EM TUDO,</span>
          <br />
          <br />
          <span>VOCÊ CONSEGUE VER</span>
          <br />
          <span>QUAL PARTE PRECISA</span>
          <br />
          <span>SER REVISADA.</span>
        </p>
      </div>
    </section>
  );
}
