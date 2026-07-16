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

export default function CarrosselCortes() {
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const pointerDownRef = React.useRef(false);
  const inViewRef = React.useRef(false);

  const setPaused = React.useCallback((paused: boolean) => {
    sectionRef.current?.classList.toggle('is-paused', paused);
  }, []);

  React.useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      section.classList.add('reduced-motion');
      setPaused(true);
      return;
    }

    const syncPauseState = () => {
      setPaused(!inViewRef.current || pointerDownRef.current || document.hidden);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = Boolean(entry?.isIntersecting);
        syncPauseState();
      },
      { threshold: 0.12, rootMargin: '160px 0px 160px 0px' }
    );

    observer.observe(section);
    document.addEventListener('visibilitychange', syncPauseState);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', syncPauseState);
    };
  }, [setPaused]);

  const pauseForPress = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    pointerDownRef.current = true;
    setPaused(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }, [setPaused]);

  const resumeAfterPress = React.useCallback((event?: React.PointerEvent<HTMLDivElement>) => {
    pointerDownRef.current = false;
    if (event?.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setPaused(!inViewRef.current || document.hidden);
  }, [setPaused]);

  const handlePointerLeave = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerDownRef.current && event.buttons !== 0) return;
    resumeAfterPress(event);
  }, [resumeAfterPress]);

  const preventImageAction = React.useCallback((event: React.SyntheticEvent) => {
    event.preventDefault();
  }, []);

  const renderSequence = (hidden: boolean) => (
    <div className="cuts-sequence" aria-hidden={hidden ? 'true' : undefined}>
      {cuts.map((cut) => (
        <div className="cut-frame" key={`${hidden ? 'loop' : 'main'}-${cut.src}`}>
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
    <section ref={sectionRef} id="carrossel-cortes" aria-labelledby="carrossel-cortes-title">
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
        }
        #carrossel-cortes .cuts-track {
          display: flex;
          width: max-content;
          animation: cutsMarquee 46s linear infinite;
          will-change: transform;
        }
        #carrossel-cortes.is-paused .cuts-track,
        #carrossel-cortes.reduced-motion .cuts-track {
          animation-play-state: paused;
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
        @keyframes cutsMarquee {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-50%, 0, 0);
          }
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
          #carrossel-cortes .cuts-track {
            animation: none;
          }
          #carrossel-cortes .cuts-sequence[aria-hidden="true"] {
            display: none;
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
        onPointerDown={pauseForPress}
        onPointerUp={resumeAfterPress}
        onPointerCancel={resumeAfterPress}
        onLostPointerCapture={resumeAfterPress}
        onPointerLeave={handlePointerLeave}
        onContextMenu={preventImageAction}
        onDragStart={preventImageAction}
      >
        <div className="cuts-track">
          {renderSequence(false)}
          {renderSequence(true)}
        </div>
      </div>
    </section>
  );
}
