'use client';

import Image from 'next/image';
import React from 'react';

const cuts = [
  {
    src: '/images/carrosel-cortes/imagem-1.webp',
    alt: 'Degradê visto em dois ângulos',
  },
  {
    src: '/images/carrosel-cortes/imagem-2.webp',
    alt: 'Corte masculino com transição suave',
  },
  {
    src: '/images/carrosel-cortes/imagem-3.webp',
    alt: 'Fade com acabamento lateral e traseiro',
  },
  {
    src: '/images/carrosel-cortes/imagem-4.webp',
    alt: 'Degradê masculino com laterais revisadas',
  },
  {
    src: '/images/carrosel-cortes/imagem-5.webp',
    alt: 'Corte masculino visto de frente e de lado',
  },
] as const;

const AUTOPLAY_DURATION_MS = 46_000;

export default function CarrosselCortes() {
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const sequenceRef = React.useRef<HTMLDivElement | null>(null);
  const offsetRef = React.useRef(0);
  const sequenceWidthRef = React.useRef(1);
  const rafRef = React.useRef<number | null>(null);
  const lastFrameRef = React.useRef<number | null>(null);
  const inViewRef = React.useRef(false);
  const draggingRef = React.useRef(false);
  const dragRef = React.useRef({ x: 0, y: 0, offset: 0, moved: false });
  const [manualPaused, setManualPaused] = React.useState(false);
  const [reducedMotion, setReducedMotion] = React.useState(false);

  const normalizeOffset = React.useCallback((value: number) => {
    const width = sequenceWidthRef.current || 1;
    return ((value % width) + width) % width;
  }, []);

  const applyOffset = React.useCallback((value: number) => {
    offsetRef.current = normalizeOffset(value);
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
    }
  }, [normalizeOffset]);

  const measure = React.useCallback(() => {
    const width = sequenceRef.current?.getBoundingClientRect().width || 1;
    sequenceWidthRef.current = Math.max(1, width);
    applyOffset(offsetRef.current);
  }, [applyOffset]);

  React.useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => setReducedMotion(media.matches);
    syncMotion();
    media.addEventListener('change', syncMotion);
    window.addEventListener('resize', measure);
    measure();

    return () => {
      media.removeEventListener('change', syncMotion);
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  React.useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = Boolean(entry?.isIntersecting);
      },
      { threshold: 0.12, rootMargin: '160px 0px 160px 0px' }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    const step = (time: number) => {
      const previous = lastFrameRef.current ?? time;
      const delta = time - previous;
      lastFrameRef.current = time;

      if (!reducedMotion && inViewRef.current && !manualPaused && !draggingRef.current && !document.hidden) {
        const speed = sequenceWidthRef.current / AUTOPLAY_DURATION_MS;
        applyOffset(offsetRef.current + delta * speed);
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [applyOffset, manualPaused, reducedMotion]);

  const handlePointerDown = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    draggingRef.current = true;
    dragRef.current = { x: event.clientX, y: event.clientY, offset: offsetRef.current, moved: false };
    sectionRef.current?.classList.add('is-dragging');
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }, []);

  const handlePointerMove = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const deltaX = event.clientX - dragRef.current.x;
    const deltaY = event.clientY - dragRef.current.y;

    if (Math.abs(deltaX) > 5 && Math.abs(deltaX) > Math.abs(deltaY) * 1.05) {
      dragRef.current.moved = true;
      applyOffset(dragRef.current.offset - deltaX);
    }
  }, [applyOffset]);

  const finishPointer = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    sectionRef.current?.classList.remove('is-dragging');

    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (!dragRef.current.moved) {
      setManualPaused((paused) => !paused);
    }
  }, []);

  const preventImageAction = React.useCallback((event: React.SyntheticEvent) => {
    event.preventDefault();
  }, []);

  const renderSequence = (hidden: boolean, cloneIndex: number) => (
    <div
      ref={cloneIndex === 0 ? sequenceRef : undefined}
      className="cuts-sequence"
      aria-hidden={hidden ? 'true' : undefined}
    >
      {cuts.map((cut) => (
        <div className="cut-frame" key={`${cloneIndex}-${cut.src}`}>
          <Image
            className="cut-image"
            src={cut.src}
            alt={hidden ? '' : cut.alt}
            width={1448}
            height={1086}
            loading="lazy"
            decoding="async"
            sizes="(max-width: 759px) 88vw, (max-width: 1199px) 62vw, 620px"
            draggable={false}
            onContextMenu={preventImageAction}
            onDragStart={preventImageAction}
          />
        </div>
      ))}
    </div>
  );

  return (
    <section
      ref={sectionRef}
      id="carrossel-cortes"
      aria-labelledby="carrossel-cortes-title"
      data-track-section="carrossel-cortes"
      data-track-order="7"
      data-track-title="07 - CARROSSEL DE CORTES"
      className={manualPaused ? 'is-manually-paused' : undefined}
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
          background: #F7F1E8;
          color: #100F0D;
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
          color: #100F0D;
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
        #carrossel-cortes .cuts-subtitle {
          max-width: 610px;
          margin: 22px auto 0;
          color: #3E352B;
          font-size: clamp(0.98rem, 4vw, 1.14rem);
          line-height: 1.42;
          font-weight: 700;
        }
        #carrossel-cortes .cuts-marquee {
          position: relative;
          width: 100vw;
          max-width: 100vw;
          overflow: hidden;
          touch-action: pan-y;
          user-select: none;
          -webkit-user-select: none;
          -webkit-touch-callout: none;
          cursor: grab;
        }
        #carrossel-cortes.is-dragging .cuts-marquee {
          cursor: grabbing;
        }
        #carrossel-cortes .cuts-track {
          display: flex;
          width: max-content;
          will-change: transform;
          transform: translate3d(0, 0, 0);
        }
        #carrossel-cortes .cuts-sequence {
          display: flex;
          flex: 0 0 auto;
          gap: 16px;
          padding-right: 16px;
        }
        #carrossel-cortes .cut-frame {
          flex: 0 0 min(88vw, 620px);
          overflow: hidden;
          border-radius: 8px;
          border: 1px solid rgba(31, 24, 16, 0.14);
          background: transparent;
          box-shadow: 0 16px 34px rgba(31, 24, 16, 0.14);
          -webkit-user-drag: none;
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
          #carrossel-cortes .cuts-sequence {
            gap: 24px;
            padding-right: 24px;
          }
          #carrossel-cortes .cut-frame {
            flex-basis: clamp(520px, 48vw, 650px);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          #carrossel-cortes .cuts-marquee {
            overflow-x: auto;
            scrollbar-width: thin;
          }
        }
      `}</style>

      <div className="cuts-copy">
        <h2 id="carrossel-cortes-title" className="cuts-title">
          <span className="cuts-red">Tá duvidando?</span>
          <br />
          Dá uma olhada
          <br />
          aqui...
        </h2>
        <p className="cuts-subtitle">
          É isso que começa a aparecer no resultado quando você entende onde marcar, quanto subir e o que revisar antes de finalizar.
        </p>
      </div>

      <div
        className="cuts-marquee"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishPointer}
        onPointerCancel={finishPointer}
        onLostPointerCapture={finishPointer}
        onContextMenu={preventImageAction}
        onDragStart={preventImageAction}
      >
        <div ref={trackRef} className="cuts-track">
          {renderSequence(false, 0)}
          {renderSequence(true, 1)}
          {renderSequence(true, 2)}
        </div>
      </div>
    </section>
  );
}
