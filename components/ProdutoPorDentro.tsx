'use client';

import Image from 'next/image';
import React from 'react';

const panels = [
  {
    action: 'COMPARE',
    src: '/images/material-por-dentro/transicao-limpa-vs-pesada.webp',
    alt: 'Página do Mapa comparando transição limpa e transição pesada',
    copy: (
      <>
        Veja a diferença entre
        <br />
        uma transição limpa
        <br />
        e uma faixa com peso.
      </>
    ),
  },
  {
    action: 'LOCALIZE',
    src: '/images/material-por-dentro/diagnostico-rapido-da-marca.webp',
    alt: 'Página de diagnóstico visual mostrando onde a marca aparece no degradê',
    copy: (
      <>
        Identifique onde a marca
        <br />
        aparece antes de começar
        <br />
        a corrigir.
      </>
    ),
  },
  {
    action: 'CONSULTE',
    src: '/images/material-por-dentro/tabela-pentes-alturas.webp',
    alt: 'Tabela visual com pentes e progressão de alturas do degradê',
    copy: (
      <>
        Confira a função dos pentes
        <br />
        e a progressão entre
        <br />
        as alturas.
      </>
    ),
  },
  {
    action: 'REVISE',
    src: '/images/material-por-dentro/checklist-troca-de-pente.webp',
    alt: 'Checklist visual para revisar a troca de pentes durante o corte',
    copy: (
      <>
        Passe pelo checklist
        <br />
        antes de continuar
        <br />
        mexendo no corte.
      </>
    ),
  },
] as const;

type Direction = 'next' | 'previous';

const getWrappedIndex = (index: number) => (index + panels.length) % panels.length;

export default function ProdutoPorDentro() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [direction, setDirection] = React.useState<Direction>('next');
  const [hasInteracted, setHasInteracted] = React.useState(false);
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);
  const scrollerRef = React.useRef<HTMLDivElement | null>(null);
  const slideRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const activeIndexRef = React.useRef(0);
  const swipeStartRef = React.useRef<{ x: number; y: number } | null>(null);
  const lastTouchTimeRef = React.useRef(0);

  const slotSlides = React.useMemo(
    () => [
      { panel: panels[getWrappedIndex(activeIndex - 1)], panelIndex: getWrappedIndex(activeIndex - 1) },
      { panel: panels[activeIndex], panelIndex: activeIndex },
      { panel: panels[getWrappedIndex(activeIndex + 1)], panelIndex: getWrappedIndex(activeIndex + 1) },
    ],
    [activeIndex]
  );

  const currentPanel = panels[activeIndex];
  const lightboxPanel = lightboxIndex === null ? null : panels[lightboxIndex];

  React.useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  React.useEffect(() => {
    panels.forEach((panel) => {
      const image = new window.Image();
      image.decoding = 'async';
      image.src = panel.src;
    });
  }, []);

  const goToPanel = React.useCallback(
    (nextIndex: number, nextDirection: Direction) => {
      const fromIndex = activeIndexRef.current;
      if (nextIndex === fromIndex) return;

      activeIndexRef.current = nextIndex;
      setDirection(nextDirection);
      setActiveIndex(nextIndex);
      setHasInteracted(true);
    },
    []
  );

  const handleSlotKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goToPanel(getWrappedIndex(activeIndex + 1), 'next');
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goToPanel(getWrappedIndex(activeIndex - 1), 'previous');
      }
    },
    [activeIndex, goToPanel]
  );

  const startSwipe = React.useCallback((x: number, y: number) => {
    swipeStartRef.current = { x, y };
  }, []);

  const finishSwipe = React.useCallback(
    (x: number, y: number) => {
      const start = swipeStartRef.current;
      swipeStartRef.current = null;
      if (!start) return;

      const deltaX = x - start.x;
      const deltaY = y - start.y;
      const horizontalDistance = Math.abs(deltaX);
      const verticalDistance = Math.abs(deltaY);

      if (horizontalDistance < 38 || horizontalDistance < verticalDistance * 1.2) {
        return;
      }

      if (deltaX < 0) {
        goToPanel(getWrappedIndex(activeIndexRef.current + 1), 'next');
      } else {
        goToPanel(getWrappedIndex(activeIndexRef.current - 1), 'previous');
      }
    },
    [goToPanel]
  );

  const cancelSwipe = React.useCallback(() => {
    swipeStartRef.current = null;
  }, []);

  const getClickDirection = React.useCallback(
    (panelIndex: number, slotIndex: number): Direction => {
      if (slotIndex === 0) return 'previous';
      if (slotIndex === slotSlides.length - 1) return 'next';
      if (panelIndex === getWrappedIndex(activeIndex + 1)) return 'next';
      if (panelIndex === getWrappedIndex(activeIndex - 1)) return 'previous';
      return panelIndex > activeIndex ? 'next' : 'previous';
    },
    [activeIndex, slotSlides.length]
  );

  React.useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      lastTouchTimeRef.current = Date.now();
      startSwipe(touch.clientX, touch.clientY);
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const touch = event.changedTouches[0];
      if (!touch) return;
      lastTouchTimeRef.current = Date.now();
      finishSwipe(touch.clientX, touch.clientY);
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (event.button !== 0 || Date.now() - lastTouchTimeRef.current < 700) return;
      startSwipe(event.clientX, event.clientY);
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (Date.now() - lastTouchTimeRef.current < 700) return;
      finishSwipe(event.clientX, event.clientY);
    };

    scroller.addEventListener('touchstart', handleTouchStart, { passive: true });
    scroller.addEventListener('touchend', handleTouchEnd, { passive: true });
    scroller.addEventListener('touchcancel', cancelSwipe, { passive: true });
    scroller.addEventListener('mousedown', handleMouseDown);
    scroller.addEventListener('mouseup', handleMouseUp);
    scroller.addEventListener('mouseleave', cancelSwipe);

    return () => {
      scroller.removeEventListener('touchstart', handleTouchStart);
      scroller.removeEventListener('touchend', handleTouchEnd);
      scroller.removeEventListener('touchcancel', cancelSwipe);
      scroller.removeEventListener('mousedown', handleMouseDown);
      scroller.removeEventListener('mouseup', handleMouseUp);
      scroller.removeEventListener('mouseleave', cancelSwipe);
    };
  }, [cancelSwipe, finishSwipe, startSwipe]);

  React.useEffect(() => {
    if (lightboxIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxIndex(null);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxIndex]);

  React.useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('#material-por-dentro [data-reveal]'));
    if (!elements.length) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
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
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <>
    <section
      id="material-por-dentro"
      aria-labelledby="material-por-dentro-title"
      data-track-section="material-por-dentro"
      data-track-order="4"
      data-track-title="04 - MATERIAL POR DENTRO"
    >
      <style>{`
        #material-por-dentro {
          position: relative;
          left: 50%;
          width: 100vw;
          max-width: 100vw;
          transform: translateX(-50%);
          box-sizing: border-box;
          overflow: hidden;
          padding: 78px 20px 92px;
          background: #F7F1E8;
          color: #100F0D;
          border-bottom: 1px solid rgba(31, 24, 16, 0.12);
        }
        #material-por-dentro *,
        #material-por-dentro *::before,
        #material-por-dentro *::after {
          box-sizing: border-box;
        }
        #material-por-dentro [data-reveal] {
          opacity: 0;
          transform: translateY(22px);
          transition: opacity 620ms ease, transform 620ms ease;
        }
        #material-por-dentro [data-reveal].is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        #material-por-dentro .inside-shell {
          width: 100%;
          max-width: 1020px;
          margin: 0 auto;
        }
        #material-por-dentro .inside-display {
          font-family: var(--font-display), var(--font-display-family), Impact, sans-serif;
          font-weight: 900;
          letter-spacing: 0;
          line-height: 0.9;
          text-transform: uppercase;
        }
        #material-por-dentro .inside-kicker {
          margin: 0 auto 18px;
          color: #6F614D;
          text-align: center;
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.12em;
        }
        #material-por-dentro .inside-title {
          margin: 0 auto;
          max-width: 760px;
          text-align: center;
          color: #100F0D;
          font-size: clamp(2.8rem, 11.5vw, 6rem);
        }
        #material-por-dentro .inside-underline {
          display: inline-block;
          padding-bottom: 0.04em;
          border-bottom: 0.08em solid #D7A42C;
        }
        #material-por-dentro .inside-subtitle {
          max-width: 620px;
          margin: 28px auto 0;
          text-align: center;
          color: #3A3027;
          font-size: clamp(1rem, 4.2vw, 1.28rem);
          line-height: 1.42;
          font-weight: 800;
        }
        #material-por-dentro .inside-slot {
          --inside-page-width: min(92vw, 430px);
          --inside-page-half: min(46vw, 215px);
          --inside-slot-gap: 8px;
          margin: 64px auto 0;
          text-align: center;
        }
        #material-por-dentro .inside-active-title {
          min-height: 0.86em;
          margin: 0 auto 10px;
          color: #100F0D;
          font-size: clamp(2.7rem, 13vw, 5.6rem);
          will-change: transform, opacity;
        }
        #material-por-dentro .inside-hint {
          display: block;
          margin: 0 auto 14px;
          color: #6F614D;
          font-size: 0.74rem;
          font-weight: 900;
          letter-spacing: 0.11em;
          line-height: 1.22;
          text-transform: uppercase;
        }
        #material-por-dentro .inside-slot-window {
          position: relative;
          left: 50%;
          width: 100vw;
          margin-left: -50vw;
          overflow: hidden;
        }
        #material-por-dentro .inside-nav {
          position: absolute;
          top: 50%;
          z-index: 6;
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(16, 15, 13, 0.16);
          border-radius: 999px;
          background: rgba(247, 241, 232, 0.92);
          color: #100F0D;
          font-size: 1.7rem;
          font-weight: 900;
          line-height: 1;
          cursor: pointer;
          transform: translateY(-50%);
          box-shadow: 0 10px 22px rgba(31, 24, 16, 0.12);
        }
        #material-por-dentro .inside-nav:focus-visible {
          outline: 3px solid #D7A42C;
          outline-offset: 3px;
        }
        #material-por-dentro .inside-nav-prev {
          left: calc(50vw - min(47vw, 228px));
        }
        #material-por-dentro .inside-nav-next {
          right: calc(50vw - min(47vw, 228px));
        }
        #material-por-dentro .inside-scroller {
          display: flex;
          gap: var(--inside-slot-gap);
          width: max-content;
          overflow-x: hidden;
          padding: 8px 0 16px;
          transform: translateX(calc(50vw - var(--inside-page-width) - var(--inside-page-half) - var(--inside-slot-gap)));
          transition: transform 220ms cubic-bezier(0.22, 0.8, 0.2, 1);
          scrollbar-width: none;
          touch-action: pan-y;
          overscroll-behavior-x: contain;
          user-select: none;
        }
        #material-por-dentro .inside-scroller::-webkit-scrollbar {
          display: none;
        }
        #material-por-dentro .inside-slide {
          display: block;
          flex: 0 0 var(--inside-page-width);
          padding: 0;
          border: 0;
          background: transparent;
          opacity: 0.42;
          transform: scale(0.98);
          transition: opacity 160ms ease, transform 160ms ease;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }
        #material-por-dentro .inside-slide[aria-selected="true"] {
          opacity: 1;
          transform: scale(1);
          cursor: zoom-in;
        }
        #material-por-dentro .inside-slide:focus-visible {
          outline: 3px solid rgba(215, 164, 44, 0.88);
          outline-offset: 6px;
        }
        #material-por-dentro .inside-page {
          display: block;
          width: 100%;
          height: auto;
          object-fit: contain;
          border: 1px solid rgba(16, 15, 13, 0.14);
          box-shadow: 0 14px 34px rgba(31, 24, 16, 0.16);
          background: #F7F1E8;
        }
        #material-por-dentro .inside-copy {
          max-width: 330px;
          min-height: 3.1em;
          margin: 22px auto 0;
          color: #2D261F;
          font-size: clamp(1.22rem, 5.4vw, 2rem);
          will-change: transform, opacity;
        }
        #material-por-dentro .inside-title-next {
          animation: insideTitleNext 220ms cubic-bezier(0.22, 0.8, 0.2, 1) both;
        }
        #material-por-dentro .inside-copy-next {
          animation: insideCopyNext 220ms cubic-bezier(0.22, 0.8, 0.2, 1) both;
        }
        #material-por-dentro .inside-title-previous {
          animation: insideTitlePrevious 220ms cubic-bezier(0.22, 0.8, 0.2, 1) both;
        }
        #material-por-dentro .inside-copy-previous {
          animation: insideCopyPrevious 220ms cubic-bezier(0.22, 0.8, 0.2, 1) both;
        }
        @keyframes insideTitleNext {
          from { opacity: 0; transform: translateX(-28px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes insideCopyNext {
          from { opacity: 0; transform: translateX(28px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes insideTitlePrevious {
          from { opacity: 0; transform: translateX(28px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes insideCopyPrevious {
          from { opacity: 0; transform: translateX(-28px); }
          to { opacity: 1; transform: translateX(0); }
        }
        #material-por-dentro .inside-close {
          max-width: 780px;
          margin: 76px auto 0;
          text-align: center;
        }
        #material-por-dentro .inside-close-small {
          margin: 0;
          color: #100F0D;
          font-size: clamp(2rem, 8.4vw, 3.6rem);
        }
        #material-por-dentro .inside-close-logic {
          margin: 34px 0 0;
          color: #100F0D;
          font-size: clamp(2.35rem, 9.5vw, 4.6rem);
        }
        #material-por-dentro .inside-close-next {
          margin: 42px 0 0;
          color: #100F0D;
          font-size: clamp(1.62rem, 6.6vw, 3rem);
        }
        #material-por-dentro .inside-moderate {
          display: inline-block;
          padding-bottom: 0.03em;
          border-bottom: 0.07em solid rgba(215, 164, 44, 0.78);
        }
        #material-por-dentro .inside-final-text {
          max-width: 430px;
          margin: 28px auto 0;
          text-align: center;
          color: #3A3027;
          font-size: clamp(0.94rem, 3.8vw, 1.12rem);
          line-height: 1.42;
          font-weight: 700;
        }
        .inside-lightbox {
          position: fixed;
          inset: 0;
          z-index: 140;
          display: grid;
          place-items: center;
          padding: 14px;
          background: rgba(7, 5, 3, 0.82);
          backdrop-filter: blur(4px);
        }
        .inside-lightbox-card {
          position: relative;
          width: min(100%, 720px);
          max-height: 92vh;
          display: grid;
          place-items: center;
        }
        .inside-lightbox-image {
          display: block;
          width: auto;
          max-width: 100%;
          max-height: 88vh;
          height: auto;
          object-fit: contain;
          border: 1px solid rgba(247, 241, 232, 0.18);
          background: #F7F1E8;
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.44);
        }
        .inside-lightbox-close {
          position: absolute;
          top: -6px;
          right: -6px;
          z-index: 2;
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(16, 15, 13, 0.16);
          border-radius: 999px;
          background: rgba(247, 241, 232, 0.96);
          color: #100F0D;
          font-size: 1.35rem;
          line-height: 1;
          cursor: pointer;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.24);
        }
        @media (min-width: 760px) {
          #material-por-dentro {
            padding: 96px 28px 112px;
          }
          #material-por-dentro .inside-slot {
            --inside-page-width: min(58vw, 700px);
            --inside-page-half: min(29vw, 350px);
            --inside-slot-gap: 38px;
            margin-top: 76px;
          }
          #material-por-dentro .inside-active-title {
            margin-bottom: 12px;
          }
          #material-por-dentro .inside-hint {
            margin-bottom: 18px;
          }
          #material-por-dentro .inside-copy {
            max-width: 390px;
            margin-top: 22px;
          }
        }
        @media (min-width: 1120px) {
          #material-por-dentro .inside-slot {
            --inside-page-width: 700px;
            --inside-page-half: 350px;
          }
        }
        @media (max-width: 374px) {
          #material-por-dentro {
            padding-left: 16px;
            padding-right: 16px;
          }
          #material-por-dentro .inside-title {
            font-size: clamp(2.45rem, 10.9vw, 3.1rem);
          }
          #material-por-dentro .inside-active-title {
            font-size: clamp(2rem, 12.2vw, 2.8rem);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          #material-por-dentro [data-reveal] {
            opacity: 1;
            transform: none;
            transition: none;
          }
          #material-por-dentro .inside-slide {
            transition: none;
          }
          #material-por-dentro .inside-title-next,
          #material-por-dentro .inside-copy-next,
          #material-por-dentro .inside-title-previous,
          #material-por-dentro .inside-copy-previous {
            animation: insideFade 140ms ease both;
          }
          .inside-lightbox {
            backdrop-filter: none;
          }
          @keyframes insideFade {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        }
      `}</style>

      <div className="inside-shell">
        <p className="inside-kicker" data-reveal>
          É AQUI QUE O MAPA ENTRA.
        </p>

        <h2 id="material-por-dentro-title" className="inside-display inside-title" data-reveal>
          NA HORA DE REVISAR,
          <br />
          <br />
          VOCÊ NÃO PRECISA
          <br />
          IR NA <span className="inside-underline">TENTATIVA E ERRO.</span>
        </h2>

        <p className="inside-subtitle" data-reveal>
          Abra a página, compare com a lateral
          <br />
          e confira o que precisa ser revisado
          <br />
          antes de passar a máquina de novo.
        </p>

        <div className="inside-slot" data-reveal>
          <div
            key={`${currentPanel.action}-title-${direction}`}
            className={`inside-display inside-active-title inside-title-${direction}`}
          >
            {currentPanel.action}
          </div>

          {!hasInteracted && (
            <span className="inside-hint">
              TOQUE PARA AMPLIAR
            </span>
          )}

          <div className="inside-slot-window">
            <button
              className="inside-nav inside-nav-prev"
              type="button"
              onClick={() => goToPanel(getWrappedIndex(activeIndex - 1), 'previous')}
              aria-label="Ver página anterior"
            >
              ‹
            </button>
            <div
              ref={scrollerRef}
              className="inside-scroller"
              role="listbox"
              aria-label="Páginas do material por dentro"
              tabIndex={0}
              onKeyDown={handleSlotKeyDown}
            >
              {slotSlides.map(({ panel, panelIndex }, slotIndex) => {
                const isActive = panelIndex === activeIndex;
                const slideKey =
                  slotIndex === 0
                    ? `${panel.action}-clone-start`
                    : slotIndex === slotSlides.length - 1
                      ? `${panel.action}-clone-end`
                      : panel.action;

                return (
                  <button
                    key={slideKey}
                    ref={(node) => {
                      slideRefs.current[slotIndex] = node;
                    }}
                    className="inside-slide"
                    type="button"
                    role="option"
                    aria-label={`${panel.action}, página ${panelIndex + 1} de ${panels.length}`}
                    aria-selected={isActive}
                    aria-current={isActive ? 'true' : undefined}
                    onClick={() => {
                      if (isActive) {
                        setHasInteracted(true);
                        setLightboxIndex(panelIndex);
                        return;
                      }

                      goToPanel(panelIndex, getClickDirection(panelIndex, slotIndex));
                    }}
                  >
                    <Image
                      className="inside-page"
                      src={panel.src}
                      alt={panel.alt}
                      width={7430}
                      height={10753}
                      loading="eager"
                      sizes="(max-width: 759px) 88vw, (max-width: 1119px) 58vw, 680px"
                      draggable={false}
                      unoptimized
                    />
                  </button>
                );
              })}
            </div>
            <button
              className="inside-nav inside-nav-next"
              type="button"
              onClick={() => goToPanel(getWrappedIndex(activeIndex + 1), 'next')}
              aria-label="Ver próxima página"
            >
              ›
            </button>
          </div>

          <p
            key={`${currentPanel.action}-copy-${direction}`}
            className={`inside-display inside-copy inside-copy-${direction}`}
          >
            {currentPanel.copy}
          </p>

        </div>

        <div className="inside-close">
          <p className="inside-display inside-close-small" data-reveal>
            NÃO QUERO QUE VOCÊ
            <br />
            DECORE TUDO.
          </p>

          <p className="inside-display inside-close-logic" data-reveal>
            QUERO QUE VOCÊ
            <br />
            <span className="inside-underline">ENTENDA A LÓGICA.</span>
          </p>

          <p className="inside-display inside-close-next" data-reveal>
            PARA OLHAR OS PRÓXIMOS
            <br />
            DEGRADÊS COM MAIS CLAREZA
            <br />
            <br />
            E <span className="inside-moderate">SABER O QUE REVISAR</span>
            <br />
            QUANDO UMA MARCA APARECER.
          </p>

          <p className="inside-final-text" data-reveal>
            Use o Mapa como referência visual
            <br />
            enquanto treina essa leitura
            <br />
            nos seus próximos cortes.
          </p>
        </div>
      </div>
    </section>
    {lightboxPanel && (
      <div
        className="inside-lightbox"
        role="presentation"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) setLightboxIndex(null);
        }}
      >
        <div
          className="inside-lightbox-card"
          role="dialog"
          aria-modal="true"
          aria-label={`Imagem ampliada: ${lightboxPanel.action}`}
        >
          <button
            type="button"
            className="inside-lightbox-close"
            aria-label="Fechar imagem ampliada"
            onClick={() => setLightboxIndex(null)}
          >
            ×
          </button>
          <Image
            className="inside-lightbox-image"
            src={lightboxPanel.src}
            alt={lightboxPanel.alt}
            width={7430}
            height={10753}
            sizes="96vw"
            draggable={false}
            unoptimized
          />
        </div>
      </div>
    )}
    </>
  );
}
