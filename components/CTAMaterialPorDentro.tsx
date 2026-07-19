import InternalCta from '@/components/InternalCta';

export default function CTAMaterialPorDentro() {
  return (
    <section
      id="cta-material-por-dentro"
      aria-labelledby="cta-material-por-dentro-title"
      data-track-section="cta-material-por-dentro"
      data-track-order="5"
      data-track-title="05 - CTA MATERIAL"
    >
      <style>{`
        #cta-material-por-dentro {
          position: relative;
          left: 50%;
          width: 100vw;
          max-width: 100vw;
          transform: translateX(-50%);
          overflow: hidden;
          box-sizing: border-box;
          padding: 34px 18px 40px;
          background: var(--color-paper);
          color: var(--color-paper);
        }
        #cta-material-por-dentro *,
        #cta-material-por-dentro *::before,
        #cta-material-por-dentro *::after {
          box-sizing: border-box;
        }
        #cta-material-por-dentro .cta-shell {
          width: 100%;
          max-width: 760px;
          margin: 0 auto;
          border-radius: 8px;
          padding: 30px 20px 24px;
          background: #100C08;
          border: 1px solid rgba(216, 201, 182, 0.22);
          box-shadow: 0 14px 40px rgba(11, 7, 4, 0.08);
          text-align: center;
        }
        #cta-material-por-dentro .cta-detail {
          display: block;
          width: 52px;
          height: 3px;
          margin: 0 auto 18px;
          border-radius: 4px;
          background: var(--color-gold);
        }
        #cta-material-por-dentro .cta-title {
          max-width: 640px;
          margin: 0 auto;
          color: var(--color-paper);
          font-family: var(--font-display), var(--font-display-family), Impact, sans-serif;
          font-size: clamp(1.74rem, 7.9vw, 4.2rem);
          font-weight: 900;
          letter-spacing: 0;
          line-height: 0.92;
          text-transform: uppercase;
          overflow-wrap: break-word;
        }
        #cta-material-por-dentro .cta-copy {
          max-width: 590px;
          margin: 18px auto 0;
          color: rgba(255, 244, 230, 0.78);
          font-size: clamp(0.93rem, 3.7vw, 1.045rem);
          line-height: 1.45;
          font-weight: 650;
          text-align: center;
        }
        #cta-material-por-dentro .cta-copy-break {
          display: block;
          margin-top: 12px;
        }
        #cta-material-por-dentro .cta-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 56px;
          margin: 24px 0 0;
          border-radius: 7px;
          background: var(--color-gold);
          color: #100C08;
          border: 2px solid var(--color-gold);
          font-family: var(--font-sans), var(--font-sans-family);
          font-size: 0.86rem;
          font-weight: 900;
          line-height: 1;
          letter-spacing: 0;
          text-align: center;
          text-decoration: none;
          text-transform: uppercase;
          -webkit-tap-highlight-color: transparent;
          transition: transform 150ms ease, background-color 150ms ease, border-color 150ms ease;
        }
        #cta-material-por-dentro .cta-button:hover {
          background: #E2B45B;
          border-color: #E2B45B;
        }
        #cta-material-por-dentro .cta-button:active {
          transform: scale(0.985);
        }
        #cta-material-por-dentro .cta-button:focus-visible {
          outline: 3px solid var(--color-paper);
          outline-offset: 3px;
        }
        #cta-material-por-dentro .cta-safe {
          margin: 12px 0 0;
          color: rgba(255, 244, 230, 0.58);
          font-size: 0.76rem;
          line-height: 1.35;
          font-weight: 700;
          text-align: center;
        }
        @media (min-width: 760px) {
          #cta-material-por-dentro {
            padding: 46px 28px 52px;
          }
          #cta-material-por-dentro .cta-shell {
            padding: 40px 40px 32px;
          }
          #cta-material-por-dentro .cta-button {
            width: auto;
            min-width: 280px;
            padding-left: 30px;
            padding-right: 30px;
          }
          #cta-material-por-dentro .cta-safe {
            text-align: center;
          }
        }
      `}</style>

      <div className="cta-shell">
        <span className="cta-detail" aria-hidden="true" />
        <h2 id="cta-material-por-dentro-title" className="cta-title">
          DEIXE O MAPA SALVO NO CELULAR PARA O PRÓXIMO CORTE
        </h2>
        <p className="cta-copy">
          Assim que a compra for confirmada, você recebe o mapa e pode abrir pelo celular,
          computador ou tablet.
          <span className="cta-copy-break">
            E ainda pode imprimir, pois as páginas vão em formato A4, perfeitas para impressão.
          </span>
        </p>
        <InternalCta
          className="cta-button"
          href="#planos"
          replaceHash
          ctaLabel="CTA Material Por Dentro"
          buttonLocation="cta-material-por-dentro"
          sourceSectionId="cta-material-por-dentro"
          sourceSectionTitle="05 - CTA MATERIAL"
          sourceSectionOrder={5}
        >
          QUERO USAR O MAPA NO PRÓXIMO CORTE
        </InternalCta>
        <p className="cta-safe">
          🔒 Compra segura. Material digital. Acesso após confirmação.
        </p>
      </div>
    </section>
  );
}
