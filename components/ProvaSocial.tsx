'use client';

import Image from 'next/image';
import React from 'react';

const testimonials = [
  {
    src: '/images/prova-social/prova-socialfeeds-05.webp',
    width: 971,
    height: 1620,
    alt: 'Mensagem recebida de barbeiro sobre o material',
  },
  {
    src: '/images/prova-social/prova-socialstory-04.webp',
    width: 941,
    height: 1571,
    alt: 'Depoimento em mensagem sobre o Mapa do Degradê Sem Marca',
  },
  {
    src: '/images/prova-social/prova-socialstory-01.webp',
    width: 941,
    height: 1577,
    alt: 'Mensagem recebida sobre o material',
  },
  {
    src: '/images/prova-social/prova-socialstory-02.webp',
    width: 941,
    height: 1571,
    alt: 'Depoimento em mensagem de barbeiro',
  },
  {
    src: '/images/prova-social/prova-socialstory-03.webp',
    width: 941,
    height: 1571,
    alt: 'Mensagem sobre o Mapa do Degradê Sem Marca',
  },
] as const;

export default function ProvaSocial() {
  const [current, setCurrent] = React.useState(0);
  const swipeStartRef = React.useRef<{ x: number; y: number } | null>(null);

  React.useEffect(() => {
    testimonials.forEach((testimonial) => {
      const image = new window.Image();
      image.decoding = 'async';
      image.src = testimonial.src;
    });
  }, []);

  const show = React.useCallback((index: number) => {
    setCurrent((index + testimonials.length) % testimonials.length);
  }, []);

  const goNext = React.useCallback(() => show(current + 1), [current, show]);
  const goPrevious = React.useCallback(() => show(current - 1), [current, show]);

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

    if (deltaX < 0) goNext();
    else goPrevious();
  }, [goNext, goPrevious]);

  const preventImageAction = React.useCallback((event: React.SyntheticEvent) => {
    event.preventDefault();
  }, []);

  return (
    <section
      id="prova-social"
      aria-labelledby="prova-social-title"
      data-track-section="prova-social"
      data-track-order="12"
      data-track-title="12 - PROVA SOCIAL"
    >
      <style>{`
        #prova-social {
          position: relative;
          left: 50%;
          width: 100vw;
          max-width: 100vw;
          transform: translateX(-50%);
          overflow: hidden;
          box-sizing: border-box;
          padding: 76px 0 82px;
          background: var(--color-paper);
          color: var(--color-ink);
          border-top: 1px solid rgba(31, 24, 16, 0.12);
          border-bottom: 1px solid rgba(31, 24, 16, 0.12);
        }
        #prova-social *,
        #prova-social *::before,
        #prova-social *::after {
          box-sizing: border-box;
        }
        #prova-social .social-copy {
          width: min(100%, 760px);
          margin: 0 auto 36px;
          padding: 0 18px;
          text-align: center;
        }
        #prova-social .social-title {
          margin: 0;
          color: var(--color-ink);
          font-family: var(--font-display), var(--font-display-family), Impact, sans-serif;
          font-size: clamp(2.45rem, 11vw, 5.9rem);
          font-weight: 900;
          letter-spacing: 0;
          line-height: 0.9;
          text-transform: uppercase;
        }
        #prova-social .social-subtitle {
          max-width: 520px;
          margin: 18px auto 0;
          color: #3E352B;
          font-size: clamp(0.98rem, 3.8vw, 1.1rem);
          line-height: 1.45;
          font-weight: 700;
        }
        #prova-social .social-carousel {
          position: relative;
          width: 100vw;
          margin: 0 auto;
          padding: 0 18px 14px;
          touch-action: pan-y;
          user-select: none;
          -webkit-user-select: none;
          -webkit-touch-callout: none;
        }
        #prova-social .social-frame {
          position: relative;
          width: min(92vw, 470px);
          margin: 0 auto;
          display: grid;
        }
        #prova-social .social-print {
          grid-area: 1 / 1;
          display: block;
          width: 100%;
          height: auto;
          border-radius: 0;
          border: 0;
          background: transparent;
          box-shadow: none;
          object-fit: contain;
          user-select: none;
          -webkit-user-select: none;
          -webkit-user-drag: none;
          -webkit-touch-callout: none;
          opacity: 0;
          visibility: hidden;
          transition: opacity 120ms ease;
        }
        #prova-social .social-print.is-active {
          opacity: 1;
          visibility: visible;
        }
        #prova-social .social-arrow {
          position: absolute;
          top: 50%;
          z-index: 3;
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(31, 24, 16, 0.16);
          border-radius: 999px;
          background: rgba(255, 249, 239, 0.92);
          color: var(--color-ink);
          font-size: 1.45rem;
          font-weight: 900;
          line-height: 1;
          cursor: pointer;
          transform: translateY(-50%);
          box-shadow: none;
        }
        #prova-social .social-arrow:focus-visible {
          outline: 3px solid var(--color-gold);
          outline-offset: 3px;
        }
        #prova-social .social-arrow.prev {
          left: 10px;
        }
        #prova-social .social-arrow.next {
          right: 10px;
        }
        #prova-social .social-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin: 12px auto 0;
        }
        #prova-social .social-dot {
          width: 7px;
          height: 7px;
          border: 0;
          border-radius: 999px;
          padding: 0;
          background: rgba(31, 24, 16, 0.24);
          cursor: pointer;
        }
        #prova-social .social-dot.is-active {
          width: 20px;
          background: var(--color-gold);
        }
        #prova-social .social-count,
        #prova-social .social-hint {
          margin: 8px 0 0;
          color: rgba(62, 53, 43, 0.62);
          font-size: 0.76rem;
          font-weight: 800;
          letter-spacing: 0;
          text-align: center;
          text-transform: uppercase;
        }
        @media (min-width: 760px) {
          #prova-social {
            padding: 92px 0 98px;
          }
          #prova-social .social-copy {
            margin-bottom: 46px;
            padding: 0 28px;
          }
          #prova-social .social-carousel {
            width: min(100%, 620px);
            padding-left: 24px;
            padding-right: 24px;
          }
          #prova-social .social-frame {
            width: min(88vw, 540px);
          }
          #prova-social .social-arrow {
            width: 42px;
            height: 42px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          #prova-social .social-frame {
            animation: none;
          }
        }
      `}</style>

      <div className="social-copy">
        <h2 id="prova-social-title" className="social-title">
          VEJA O QUE OUTROS BARBEIROS
          <br />
          ESTÃO DIZENDO:
        </h2>
        <p className="social-subtitle">
          Mensagens reais recebidas de quem já conheceu o material.
        </p>
      </div>

      <div
        className="social-carousel"
        aria-label="Depoimentos de barbeiros"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => { swipeStartRef.current = null; }}
        onContextMenu={preventImageAction}
        onDragStart={preventImageAction}
      >
        <button className="social-arrow prev" type="button" onClick={goPrevious} aria-label="Ver depoimento anterior">‹</button>
        <div className="social-frame">
          {testimonials.map((testimonial, index) => (
            <Image
              className={`social-print${index === current ? ' is-active' : ''}`}
              key={testimonial.src}
              src={testimonial.src}
              alt={index === current ? testimonial.alt : ''}
              width={testimonial.width}
              height={testimonial.height}
              priority={index === 0}
              loading="eager"
              decoding="async"
              sizes="(max-width: 759px) 92vw, 540px"
              draggable={false}
              unoptimized
              aria-hidden={index === current ? undefined : true}
              onContextMenu={preventImageAction}
              onDragStart={preventImageAction}
            />
          ))}
        </div>
        <button className="social-arrow next" type="button" onClick={goNext} aria-label="Ver próximo depoimento">›</button>
      </div>

      <div className="social-controls" aria-label="Selecionar depoimento">
        {testimonials.map((testimonial, index) => (
          <button
            key={testimonial.src}
            className={`social-dot${index === current ? ' is-active' : ''}`}
            type="button"
            onClick={() => show(index)}
            aria-label={`Mostrar depoimento ${index + 1}`}
            aria-current={index === current ? 'true' : undefined}
          />
        ))}
      </div>
      <p className="social-count">{current + 1} / {testimonials.length}</p>
      <p className="social-hint">Arraste para ver mais</p>
    </section>
  );
}
