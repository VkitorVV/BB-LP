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
  const preventImageAction = React.useCallback((event: React.SyntheticEvent) => {
    event.preventDefault();
  }, []);

  return (
    <section
      id="prova-social"
      aria-labelledby="prova-social-title"
      data-track-section="prova-social"
      data-track-order="10"
      data-track-title="10 - Prova social"
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
          background: #F7F1E8;
          color: #100F0D;
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
          color: #100F0D;
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
        #prova-social .social-track {
          display: flex;
          gap: 16px;
          width: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          overscroll-behavior-x: contain;
          scroll-behavior: smooth;
          scroll-padding-inline: 18px;
          scroll-snap-type: x mandatory;
          padding: 2px 18px 18px;
          touch-action: pan-x pan-y;
          user-select: none;
          -webkit-user-select: none;
          -webkit-touch-callout: none;
          scrollbar-width: thin;
          scrollbar-color: rgba(31, 24, 16, 0.28) transparent;
        }
        #prova-social .social-track::-webkit-scrollbar {
          height: 6px;
        }
        #prova-social .social-track::-webkit-scrollbar-track {
          background: transparent;
        }
        #prova-social .social-track::-webkit-scrollbar-thumb {
          background: rgba(31, 24, 16, 0.26);
          border-radius: 999px;
        }
        #prova-social .social-item {
          flex: 0 0 84vw;
          max-width: 360px;
          scroll-snap-align: center;
        }
        #prova-social .social-print {
          display: block;
          width: 100%;
          height: auto;
          border-radius: 8px;
          border: 1px solid rgba(31, 24, 16, 0.14);
          background: #FFF9EF;
          box-shadow: 0 18px 34px rgba(31, 24, 16, 0.16);
          object-fit: contain;
          user-select: none;
          -webkit-user-select: none;
          -webkit-user-drag: none;
          -webkit-touch-callout: none;
        }
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
          #prova-social .social-track {
            gap: 24px;
            max-width: 1140px;
            margin: 0 auto;
            padding: 4px 28px 18px;
            scroll-padding-inline: 28px;
          }
          #prova-social .social-item {
            flex-basis: clamp(270px, 28vw, 340px);
            max-width: 340px;
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
        className="social-track"
        aria-label="Depoimentos de barbeiros"
        onContextMenu={preventImageAction}
        onDragStart={preventImageAction}
      >
        {testimonials.map((testimonial) => (
          <div className="social-item" key={testimonial.src}>
            <Image
              className="social-print"
              src={testimonial.src}
              alt={testimonial.alt}
              width={testimonial.width}
              height={testimonial.height}
              loading="lazy"
              decoding="async"
              sizes="(max-width: 759px) 84vw, 340px"
              draggable={false}
              onContextMenu={preventImageAction}
              onDragStart={preventImageAction}
            />
          </div>
        ))}
      </div>

      <p className="social-hint">Arraste para ver mais</p>
    </section>
  );
}
