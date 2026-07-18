import Image from 'next/image';

export default function Garantia() {
  return (
  <section
    id="garantia"
    aria-labelledby="garantia-title"
    data-track-section="garantia"
    data-track-order="14"
    data-track-title="14 - GARANTIA"
  >
      <style>{`
        #garantia {
          position: relative;
          left: 50%;
          width: 100vw;
          max-width: 100vw;
          transform: translateX(-50%);
          overflow: hidden;
          box-sizing: border-box;
          padding: 72px 18px 78px;
          background: var(--color-paper-alt);
          color: var(--color-ink);
          border-top: 1px solid rgba(216, 166, 74, 0.2);
          border-bottom: 1px solid rgba(216, 166, 74, 0.18);
        }
        #garantia *,
        #garantia *::before,
        #garantia *::after {
          box-sizing: border-box;
        }
        #garantia .guarantee-shell {
          width: 100%;
          max-width: 720px;
          margin: 0 auto;
          text-align: center;
        }
        #garantia .guarantee-badge {
          display: block;
          width: clamp(150px, 44vw, 220px);
          height: auto;
          margin: 0 auto 24px;
          object-fit: contain;
          filter: sepia(0.38) saturate(0.9) hue-rotate(348deg) drop-shadow(0 10px 22px rgba(11, 7, 4, 0.16));
        }
        #garantia .guarantee-title {
          margin: 0;
          font-family: var(--font-display), var(--font-display-family), Impact, sans-serif;
          font-size: clamp(2.42rem, 11.2vw, 5.4rem);
          font-weight: 900;
          letter-spacing: 0;
          line-height: 0.9;
          text-transform: uppercase;
        }
        #garantia .guarantee-title-main {
          display: block;
          color: var(--color-gold);
        }
        #garantia .guarantee-title-rest {
          display: block;
          color: var(--color-ink);
        }
        #garantia .guarantee-copy {
          max-width: 560px;
          margin: 24px auto 0;
          color: #4B4035;
          font-size: clamp(1rem, 4vw, 1.14rem);
          font-weight: 650;
          line-height: 1.52;
        }
        #garantia .guarantee-copy p {
          margin: 0;
        }
        #garantia .guarantee-copy p + p {
          margin-top: 12px;
        }
        #garantia .guarantee-close {
          margin: 28px 0 0;
          color: var(--color-ink);
          font-family: var(--font-display), var(--font-display-family), Impact, sans-serif;
          font-size: clamp(1.52rem, 6.2vw, 2.65rem);
          font-weight: 900;
          letter-spacing: 0;
          line-height: 0.98;
          text-transform: uppercase;
        }
        @media (min-width: 760px) {
          #garantia {
            padding: 86px 28px 92px;
          }
          #garantia .guarantee-badge {
            width: clamp(190px, 18vw, 250px);
            margin-bottom: 28px;
          }
          #garantia .guarantee-copy {
            font-size: 1.12rem;
          }
        }
      `}</style>

      <div className="guarantee-shell">
        <Image
          className="guarantee-badge"
          src="/images/garantia-7dias/garantia-7-dias.webp"
          alt="Garantia de 7 dias"
          width={1200}
          height={1200}
          loading="lazy"
          decoding="async"
          sizes="(max-width: 759px) 44vw, 250px"
        />

        <h2 id="garantia-title" className="guarantee-title">
          <span className="guarantee-title-main">VOCÊ TEM 7 DIAS</span>
          <span className="guarantee-title-rest">PARA DECIDIR COM CALMA</span>
        </h2>

        <div className="guarantee-copy">
          <p>
            Acesse o material, conheça o conteúdo e veja se ele faz sentido para o seu momento.
          </p>
          <p>
            Caso decida que não é para você, solicite o reembolso dentro do prazo de 7 dias.
          </p>
        </div>

        <p className="guarantee-close">
          Seu acesso é imediato.
        </p>
      </div>
    </section>
  );
}
