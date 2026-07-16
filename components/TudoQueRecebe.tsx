'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';

const bonuses = [
  {
    image: '/images/tudo-que-recebe/bonus-01-pentes-alturas.webp',
    alt: 'Mockup do bônus Tabela dos Pentes e Alturas',
    title: 'Tabela dos Pentes e Alturas',
    description: 'Para consultar a ordem dos pentes e entender onde cada altura entra na transição.',
  },
  {
    image: '/images/tudo-que-recebe/bonus-02-checklist.webp',
    alt: 'Mockup do bônus Checklist do Corte Sem Marca',
    title: 'Checklist do Corte Sem Marca',
    description: 'Para revisar o corte antes, durante e depois da finalização.',
  },
  {
    image: '/images/tudo-que-recebe/bonus-03-erros.webp',
    alt: 'Mockup do bônus Guia dos 7 Erros que Estragam o Degradê',
    title: 'Guia dos 7 Erros que Estragam o Degradê',
    description: 'Para identificar o que pode estar deixando seu corte com linha aparente ou aparência pesada.',
  },
  {
    image: '/images/tudo-que-recebe/bonus-04-referencias.webp',
    alt: 'Mockup do bônus Pack de Referências Essenciais de Fade',
    title: 'Pack de Referências Essenciais de Fade',
    description: 'Referências visuais de low fade, mid fade, high fade e taper fade para treinar seu olhar.',
  },
  {
    image: '/images/tudo-que-recebe/bonus-05-acabamento.webp',
    alt: 'Mockup do bônus Mini Guia de Acabamento Profissional',
    title: 'Mini Guia de Acabamento Profissional',
    description: 'Para revisar pezinho, nuca, laterais e apresentação final do corte.',
  },
] as const;

export default function TudoQueRecebe() {
  React.useEffect(() => {
    const section = document.getElementById('veja-tudo-que-recebe');
    if (!section) return;

    const revealItems = Array.from(section.querySelectorAll<HTMLElement>('[data-recebe-reveal]'));
    if (!revealItems.length) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
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

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="veja-tudo-que-recebe" aria-labelledby="veja-tudo-que-recebe-title">
      <style>{`
        #veja-tudo-que-recebe {
          position: relative;
          left: 50%;
          width: 100vw;
          max-width: 100vw;
          transform: translateX(-50%);
          overflow: hidden;
          box-sizing: border-box;
          padding: 78px 0 88px;
          background: #F7F1E8;
          color: #100F0D;
          border-bottom: 1px solid rgba(31, 24, 16, 0.12);
        }
        #veja-tudo-que-recebe *,
        #veja-tudo-que-recebe *::before,
        #veja-tudo-que-recebe *::after {
          box-sizing: border-box;
        }
        #veja-tudo-que-recebe .recebe-shell {
          width: 100%;
          max-width: 980px;
          margin: 0 auto;
          padding: 0 18px;
        }
        #veja-tudo-que-recebe .recebe-display {
          font-family: var(--font-display), var(--font-display-family), Impact, sans-serif;
          font-weight: 900;
          letter-spacing: 0;
          line-height: 0.9;
          text-transform: uppercase;
        }
        #veja-tudo-que-recebe .recebe-title {
          max-width: 760px;
          margin: 0 auto 48px;
          text-align: center;
          color: #100F0D;
          font-size: clamp(2.7rem, 11.6vw, 5.8rem);
        }
        #veja-tudo-que-recebe .main-product {
          max-width: 620px;
          margin: 0 auto;
          text-align: center;
        }
        #veja-tudo-que-recebe .value-mark {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 18px;
          color: #8B6725;
          border-top: 1px solid rgba(196, 154, 74, 0.42);
          border-bottom: 1px solid rgba(196, 154, 74, 0.42);
          padding: 8px 4px 7px;
          font-size: 0.74rem;
          font-weight: 900;
          letter-spacing: 0.12em;
          line-height: 1;
          text-transform: uppercase;
        }
        #veja-tudo-que-recebe .main-mockup {
          width: min(100%, 520px);
          margin: 0 auto;
        }
        #veja-tudo-que-recebe .image-frame {
          position: relative;
          overflow: hidden;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.5);
          border: 1px solid rgba(196, 154, 74, 0.18);
          box-shadow: 0 18px 42px rgba(52, 35, 18, 0.14);
        }
        #veja-tudo-que-recebe .main-name {
          margin: 24px auto 12px;
          color: #100F0D;
          font-size: clamp(2.05rem, 9vw, 4.2rem);
        }
        #veja-tudo-que-recebe .main-description {
          max-width: 560px;
          margin: 0 auto;
          color: #3E352B;
          font-size: 0.98rem;
          line-height: 1.55;
          font-weight: 650;
        }
        #veja-tudo-que-recebe .bonus-transition {
          width: min(calc(100% - 36px), 680px);
          margin: 70px auto 38px;
          text-align: center;
          padding: 30px 0 32px;
          border-top: 1px solid rgba(196, 154, 74, 0.42);
          border-bottom: 1px solid rgba(196, 154, 74, 0.42);
        }
        #veja-tudo-que-recebe .transition-kicker {
          margin: 0 0 12px;
          color: #8B6725;
          font-size: clamp(1.4rem, 5.8vw, 2.7rem);
        }
        #veja-tudo-que-recebe .transition-title {
          margin: 0;
          color: #100F0D;
          font-size: clamp(2.25rem, 10vw, 4.9rem);
        }
        #veja-tudo-que-recebe .bonus-list {
          width: 100%;
          max-width: 980px;
          margin: 0 auto;
        }
        #veja-tudo-que-recebe .bonus-item {
          display: grid;
          grid-template-columns: minmax(0, 47%) minmax(0, 53%);
          column-gap: 14px;
          row-gap: 8px;
          align-items: center;
          padding: 34px 4px 42px;
          border-bottom: 1px solid rgba(31, 24, 16, 0.12);
        }
        #veja-tudo-que-recebe .bonus-item:first-child {
          padding-top: 8px;
        }
        #veja-tudo-que-recebe .bonus-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          justify-self: start;
          grid-column: 1;
          color: #8B6725;
          font-size: clamp(0.45rem, 1.9vw, 0.62rem);
          font-weight: 900;
          letter-spacing: 0.06em;
          line-height: 1;
          text-transform: uppercase;
          border: 1px solid rgba(196, 154, 74, 0.35);
          border-radius: 999px;
          padding: 5px 7px 4px;
          background: rgba(255, 255, 255, 0.42);
        }
        #veja-tudo-que-recebe .bonus-badge-icon {
          width: 11px;
          height: 11px;
          color: #8B6725;
          stroke-width: 2.8;
          display: block;
        }
        #veja-tudo-que-recebe .bonus-media {
          grid-column: 1;
          width: 100%;
          align-self: center;
        }
        #veja-tudo-que-recebe .bonus-copy {
          grid-column: 2;
          max-width: 100%;
          align-self: center;
        }
        #veja-tudo-que-recebe .bonus-item:nth-child(even) .bonus-badge,
        #veja-tudo-que-recebe .bonus-item:nth-child(even) .bonus-media {
          grid-column: 2;
        }
        #veja-tudo-que-recebe .bonus-item:nth-child(even) .bonus-copy {
          grid-column: 1;
          grid-row: 2;
        }
        #veja-tudo-que-recebe .bonus-name {
          margin: 0 0 7px;
          color: #100F0D;
          font-size: clamp(1.22rem, 5.45vw, 2.55rem);
        }
        #veja-tudo-que-recebe .bonus-description {
          margin: 0;
          color: #3E352B;
          font-size: clamp(0.62rem, 2.6vw, 0.92rem);
          line-height: 1.28;
          font-weight: 650;
        }
        #veja-tudo-que-recebe [data-recebe-reveal] {
          opacity: 0;
          transform: translateY(22px);
          transition: opacity 560ms ease, transform 560ms ease;
        }
        #veja-tudo-que-recebe [data-recebe-reveal].is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        @media (max-width: 374px) {
          #veja-tudo-que-recebe .recebe-shell {
            padding-left: 14px;
            padding-right: 14px;
          }
          #veja-tudo-que-recebe .recebe-title {
            font-size: clamp(2.35rem, 10.8vw, 3rem);
          }
          #veja-tudo-que-recebe .bonus-item {
            column-gap: 10px;
            padding-top: 30px;
            padding-bottom: 38px;
          }
          #veja-tudo-que-recebe .bonus-badge {
            font-size: 0.43rem;
            padding-left: 6px;
            padding-right: 6px;
          }
          #veja-tudo-que-recebe .bonus-description,
          #veja-tudo-que-recebe .main-description {
            font-size: 0.78rem;
          }
        }
        @media (min-width: 760px) {
          #veja-tudo-que-recebe {
            padding: 96px 0 112px;
          }
          #veja-tudo-que-recebe .recebe-shell {
            padding-left: 28px;
            padding-right: 28px;
          }
          #veja-tudo-que-recebe .recebe-title {
            margin-bottom: 62px;
          }
          #veja-tudo-que-recebe .main-mockup {
            width: min(88%, 660px);
          }
          #veja-tudo-que-recebe .bonus-transition {
            margin-top: 86px;
            margin-bottom: 52px;
          }
          #veja-tudo-que-recebe .bonus-list {
            max-width: 980px;
          }
          #veja-tudo-que-recebe .bonus-item {
            grid-template-columns: minmax(280px, 0.94fr) minmax(280px, 1fr);
            column-gap: 44px;
            row-gap: 14px;
            padding: 48px 0 56px;
          }
          #veja-tudo-que-recebe .bonus-item:nth-child(even) .bonus-badge {
            justify-self: start;
          }
          #veja-tudo-que-recebe .bonus-name {
            font-size: clamp(2.1rem, 4vw, 3.2rem);
          }
          #veja-tudo-que-recebe .bonus-description,
          #veja-tudo-que-recebe .main-description {
            font-size: 1.05rem;
            line-height: 1.45;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          #veja-tudo-que-recebe [data-recebe-reveal] {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
      `}</style>

      <div className="recebe-shell">
        <h2 id="veja-tudo-que-recebe-title" className="recebe-display recebe-title">
          VEJA TUDO QUE VOCÊ VAI RECEBER:
        </h2>

        <div className="main-product" data-recebe-reveal>
          <div className="value-mark">GUIA PRINCIPAL - R$ 19,90</div>

          <div className="main-mockup image-frame">
            <Image
              src="/images/tudo-que-recebe/guia-principal.webp"
              alt="Mockup do guia principal Mapa do Degradê Sem Marca"
              width={1200}
              height={900}
              loading="eager"
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 70vw, 660px"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          <h3 className="recebe-display main-name">
            MAPA DO DEGRADÊ
            <br />
            SEM MARCA
          </h3>

          <p className="main-description">
            Um guia visual para entender a lógica de marcação, pentes, alturas, pontos de transição e acabamento do degradê.
          </p>
        </div>

        <div className="bonus-transition" data-recebe-reveal>
          <p className="recebe-display transition-kicker">E ISSO É SÓ O COMEÇO...</p>
          <p className="recebe-display transition-title">
            VOCÊ TAMBÉM LEVA
            <br />
            5 BÔNUS EXCLUSIVOS
          </p>
        </div>

        <div className="bonus-list">
          {bonuses.map((bonus) => (
            <article className="bonus-item" key={bonus.title} data-recebe-reveal>
              <div className="bonus-badge">
                <Sparkles className="bonus-badge-icon" aria-hidden="true" />
                <span>INCLUSO NO KIT COMPLETO</span>
              </div>

              <div className="bonus-media image-frame">
                <Image
                  src={bonus.image}
                  alt={bonus.alt}
                  width={900}
                  height={900}
                  loading="lazy"
                  sizes="(max-width: 640px) 47vw, (max-width: 1024px) 46vw, 430px"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>

              <div className="bonus-copy">
                <h3 className="recebe-display bonus-name">{bonus.title}</h3>
                <p className="bonus-description">{bonus.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
