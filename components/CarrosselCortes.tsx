import CarrosselCortesSlider from '@/components/CarrosselCortesSlider';

export default function CarrosselCortes() {
  return (
    <section
      id="carrossel-cortes"
      aria-labelledby="carrossel-cortes-title"
      data-track-section="carrossel-cortes"
      data-track-order="7"
      data-track-title="07 - TA DUVIDANDO"
    >
      <style>{`
        #carrossel-cortes {
          position: relative;
          left: 50%;
          width: 100vw;
          max-width: 100vw;
          transform: translateX(-50%);
          overflow: hidden;
          box-sizing: border-box;
          padding: 78px 0 84px;
          background: var(--color-paper);
          color: var(--color-ink);
          border-bottom: 1px solid rgba(31, 24, 16, 0.12);
        }
        #carrossel-cortes *,
        #carrossel-cortes *::before,
        #carrossel-cortes *::after {
          box-sizing: border-box;
        }
        #carrossel-cortes .cuts-copy {
          width: 100%;
          max-width: 760px;
          margin: 0 auto 38px;
          padding: 0 18px;
          text-align: center;
        }
        #carrossel-cortes .cuts-title {
          margin: 0;
          color: var(--color-ink);
          font-family: var(--font-display), var(--font-display-family), Impact, sans-serif;
          font-size: clamp(2.38rem, 11.8vw, 6.6rem);
          font-weight: 900;
          letter-spacing: 0;
          line-height: 0.88;
          text-transform: uppercase;
          overflow-wrap: break-word;
        }
        #carrossel-cortes .cuts-red {
          color: #C32721;
        }
        #carrossel-cortes .cuts-one-line {
          display: block;
          white-space: nowrap;
        }
        #carrossel-cortes .cuts-subtitle {
          max-width: 610px;
          margin: 22px auto 0;
          color: #3E352B;
          font-size: clamp(1.08rem, 4.4vw, 1.25rem);
          line-height: 1.42;
          font-weight: 700;
        }
        #carrossel-cortes .cuts-carousel {
          --cuts-slide-width: min(78vw, 590px);
          --cuts-gap: 14px;
          position: relative;
          left: 50%;
          width: 100vw;
          max-width: 100vw;
          overflow: hidden;
          transform: translateX(-50%);
          touch-action: pan-y;
          user-select: none;
          -webkit-user-select: none;
          -webkit-touch-callout: none;
          cursor: grab;
        }
        #carrossel-cortes .cuts-carousel:active {
          cursor: grabbing;
        }
        #carrossel-cortes .cuts-track {
          position: relative;
          width: 100vw;
          height: min(58.5vw, 442px);
          padding: 6px 0 14px;
        }
        #carrossel-cortes .cut-frame {
          position: absolute;
          top: 6px;
          left: 50%;
          width: var(--cuts-slide-width);
          overflow: hidden;
          border-radius: 0;
          border: 0;
          background: transparent;
          box-shadow: none;
          opacity: 0.38;
          transform: translateX(-50%) scale(0.94);
          transition: opacity 180ms ease, transform 180ms ease;
          -webkit-user-drag: none;
        }
        #carrossel-cortes .cut-frame.is-prev {
          transform: translateX(calc(-50% - var(--cuts-slide-width) - var(--cuts-gap) + var(--drag-offset, 0px))) scale(0.94);
        }
        #carrossel-cortes .cut-frame:nth-child(1) {
          transform: translateX(calc(-50% - var(--cuts-slide-width) - var(--cuts-gap) + var(--drag-offset, 0px))) scale(0.94);
        }
        #carrossel-cortes .cut-frame.is-next {
          transform: translateX(calc(-50% + var(--cuts-slide-width) + var(--cuts-gap) + var(--drag-offset, 0px))) scale(0.94);
        }
        #carrossel-cortes .cut-frame:nth-child(3) {
          transform: translateX(calc(-50% + var(--cuts-slide-width) + var(--cuts-gap) + var(--drag-offset, 0px))) scale(0.94);
        }
        #carrossel-cortes .cut-frame.is-active {
          opacity: 1;
          transform: translateX(calc(-50% + var(--drag-offset, 0px))) scale(1);
        }
        #carrossel-cortes .cut-frame:nth-child(2) {
          opacity: 1;
          transform: translateX(calc(-50% + var(--drag-offset, 0px))) scale(1);
        }
        #carrossel-cortes .cut-image {
          display: block;
          width: 100%;
          height: auto;
          aspect-ratio: 4 / 3;
          object-fit: contain;
          user-select: none;
          -webkit-user-select: none;
          -webkit-user-drag: none;
          -webkit-touch-callout: none;
        }
        #carrossel-cortes .cuts-arrow {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(31, 24, 16, 0.16);
          border-radius: 999px;
          background: rgba(255, 249, 239, 0.94);
          color: var(--color-ink);
          font-size: 1.5rem;
          font-weight: 900;
          line-height: 1;
          cursor: pointer;
        }
        #carrossel-cortes .cuts-bottom-controls {
          width: var(--cuts-slide-width);
          max-width: calc(100vw - 40px);
          margin: 14px auto 0;
          display: grid;
          grid-template-columns: 44px minmax(0, 1fr) 44px;
          align-items: center;
          gap: 18px;
        }
        #carrossel-cortes .cuts-swipe-label {
          color: rgba(62, 53, 43, 0.88);
          font-size: 0.72rem;
          font-weight: 900;
          letter-spacing: 0.13em;
          text-align: center;
          text-transform: uppercase;
        }
        @media (min-width: 760px) {
          #carrossel-cortes {
            padding: 96px 0 106px;
          }
          #carrossel-cortes .cuts-copy {
            margin-bottom: 52px;
            padding: 0 28px;
          }
          #carrossel-cortes .cuts-subtitle {
            font-size: 1.12rem;
          }
          #carrossel-cortes .cuts-carousel {
            --cuts-slide-width: min(58vw, 650px);
          }
          #carrossel-cortes .cuts-track {
            height: min(43.5vw, 488px);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          #carrossel-cortes .cuts-track,
          #carrossel-cortes .cut-frame {
            transition: none;
          }
        }
      `}</style>

      <div className="cuts-copy">
        <h2 id="carrossel-cortes-title" className="cuts-title">
          <span className="cuts-red">Tá duvidando?</span>
          <span className="cuts-one-line">Dá uma olhada aqui...</span>
        </h2>
        <p className="cuts-subtitle">
          É isso que começa a aparecer no resultado quando você entende onde marcar, quanto subir e o que revisar antes de finalizar.
        </p>
      </div>

      <CarrosselCortesSlider />
    </section>
  );
}
