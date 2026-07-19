const items = [
  <>ENTENDER ONDE<br />A MARCA COMEÇA</>,
  <>RECONHECER QUANDO<br />A TRANSIÇÃO ESTÁ PESADA</>,
  <>LER PENTES E ALTURAS<br />COM MAIS LÓGICA</>,
  <>USAR O MÉTODO M.A.P.A.<br />PARA REVISAR</>,
  <>VISUALIZAR A BASE DE<br />LOW, MID E HIGH FADE</>,
  <>CORRIGIR MARCAS<br />SEM SUBIR DEMAIS O CORTE</>,
  <>MELHORAR O ACABAMENTO<br />DE NUCA, PEZINHO<br />E LATERAIS</>,
  <>TREINAR O OLHAR<br />PARA OS PRÓXIMOS CORTES</>,
] as const;

export default function MapaVai() {
  return (
    <section
      id="com-o-mapa-voce-vai"
      aria-labelledby="com-o-mapa-voce-vai-title"
      data-track-section="com-o-mapa-voce-vai"
      data-track-order="6"
      data-track-title="06 - COM O MAPA VOCE VAI"
    >
      <style>{`
        #com-o-mapa-voce-vai {
          position: relative;
          left: 50%;
          width: 100vw;
          max-width: 100vw;
          transform: translateX(-50%);
          overflow: hidden;
          box-sizing: border-box;
          padding: 78px 8px 86px;
          background: var(--color-paper);
          color: var(--color-ink);
          border-bottom: 1px solid rgba(31, 24, 16, 0.12);
        }
        #com-o-mapa-voce-vai *,
        #com-o-mapa-voce-vai *::before,
        #com-o-mapa-voce-vai *::after {
          box-sizing: border-box;
        }
        #com-o-mapa-voce-vai .map-shell {
          width: 100%;
          max-width: 430px;
          margin: 0 auto;
        }
        #com-o-mapa-voce-vai .map-display {
          font-family: var(--font-display), var(--font-display-family), Impact, sans-serif;
          font-weight: 900;
          letter-spacing: 0;
          line-height: 0.9;
          text-transform: uppercase;
        }
        #com-o-mapa-voce-vai .map-title {
          max-width: min(100%, 760px);
          margin: 0 auto;
          text-align: center;
          color: var(--color-ink);
          font-size: clamp(1.95rem, 7.35vw, 4.72rem);
        }
        #com-o-mapa-voce-vai .map-title-line {
          display: block;
          white-space: normal;
          text-wrap: balance;
        }
        #com-o-mapa-voce-vai .map-title-line:first-child {
          font-size: 0.88em;
        }
        #com-o-mapa-voce-vai .map-title-line + .map-title-line {
          font-size: 1.16em;
        }
        #com-o-mapa-voce-vai .map-path {
          position: relative;
          width: 100%;
          margin: 50px auto 0;
          padding: 10px 0 4px;
        }
        #com-o-mapa-voce-vai .map-path::before {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          left: 50%;
          width: 2px;
          transform: translateX(-50%);
          background: var(--color-gold);
          transform-origin: top;
        }
        #com-o-mapa-voce-vai .map-row {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          column-gap: 10px;
          width: 100%;
          min-height: 0;
          align-items: stretch;
          margin: 0 auto 10px;
        }
        #com-o-mapa-voce-vai .map-row::before {
          content: "";
          position: absolute;
          top: 50%;
          left: calc(50% - 5px);
          width: 10px;
          height: 2px;
          background: var(--color-gold);
          transform: translateY(-50%);
        }
        #com-o-mapa-voce-vai .map-row::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 9px;
          height: 9px;
          border-radius: 999px;
          background: var(--color-gold);
          box-shadow: none;
          transform: translate(-50%, -50%);
        }
        #com-o-mapa-voce-vai .map-step {
          position: relative;
          min-width: 0;
          display: flex;
        }
        #com-o-mapa-voce-vai .map-card {
          position: relative;
          width: 100%;
          min-height: 132px;
          display: flex;
          align-items: flex-end;
          border-radius: 7px;
          background: #101010;
          color: #FFFFFF;
          padding: 46px 12px 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        #com-o-mapa-voce-vai .map-number {
          position: absolute;
          top: 16px;
          left: 12px;
          color: var(--color-gold);
          font-size: 0.68rem;
          font-weight: 900;
          letter-spacing: 0.08em;
          line-height: 1;
        }
        #com-o-mapa-voce-vai .map-text {
          display: block;
          width: 100%;
          color: #FFFFFF;
          font-size: clamp(0.88rem, 3.55vw, 1.08rem);
          line-height: 1.04;
        }
        #com-o-mapa-voce-vai .map-step-left .map-card {
          justify-self: start;
          text-align: left;
        }
        #com-o-mapa-voce-vai .map-step-right .map-card {
          justify-self: end;
          text-align: left;
        }
        #com-o-mapa-voce-vai [data-map-reveal] {
          opacity: 0;
          transition: opacity 560ms ease, transform 560ms ease;
        }
        #com-o-mapa-voce-vai .map-step-left[data-map-reveal] {
          transform: translateX(-22px);
        }
        #com-o-mapa-voce-vai .map-step-right[data-map-reveal] {
          transform: translateX(22px);
        }
        #com-o-mapa-voce-vai [data-map-reveal].is-visible {
          opacity: 1;
          transform: translateX(0);
        }
        @media (max-width: 374px) {
          #com-o-mapa-voce-vai {
            padding-left: 8px;
            padding-right: 8px;
          }
          #com-o-mapa-voce-vai .map-row {
            column-gap: 8px;
          }
          #com-o-mapa-voce-vai .map-row::before {
            left: calc(50% - 4px);
            width: 8px;
          }
          #com-o-mapa-voce-vai .map-card {
            padding-left: 8px;
            padding-right: 8px;
          }
          #com-o-mapa-voce-vai .map-text {
            font-size: 0.98rem;
          }
        }
        @media (min-width: 760px) {
          #com-o-mapa-voce-vai {
            padding: 96px 28px 108px;
          }
          #com-o-mapa-voce-vai .map-shell {
            max-width: 980px;
          }
          #com-o-mapa-voce-vai .map-path {
            max-width: 920px;
            margin-top: 74px;
          }
          #com-o-mapa-voce-vai .map-row {
            column-gap: 76px;
            margin-bottom: 24px;
          }
          #com-o-mapa-voce-vai .map-card {
            min-height: 126px;
            padding: 18px 20px 17px;
          }
          #com-o-mapa-voce-vai .map-row::before {
            left: calc(50% - 38px);
            width: 76px;
          }
          #com-o-mapa-voce-vai .map-text {
            font-size: clamp(1.18rem, 2.05vw, 1.74rem);
            line-height: 0.95;
          }
        }
        @media (min-width: 1120px) {
          #com-o-mapa-voce-vai .map-card {
            width: 100%;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          #com-o-mapa-voce-vai [data-map-reveal],
          #com-o-mapa-voce-vai .map-step-left[data-map-reveal],
          #com-o-mapa-voce-vai .map-step-right[data-map-reveal] {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
      `}</style>

      <div className="map-shell">
        <h2 id="com-o-mapa-voce-vai-title" className="map-display map-title">
          <span className="map-title-line">COM O MAPA DO DEGRADÊ SEM MARCA,</span>
          <span className="map-title-line">VOCÊ VAI...</span>
        </h2>

        <div className="map-path" aria-label="Capacidades que o Mapa do Degradê Sem Marca ajuda a desenvolver">
          {Array.from({ length: Math.ceil(items.length / 2) }, (_, rowIndex) => {
            const leftIndex = rowIndex * 2;
            const rightIndex = leftIndex + 1;

            return (
              <div className="map-row" key={leftIndex} data-map-reveal>
                {[leftIndex, rightIndex].map((itemIndex) => {
                  const side = itemIndex % 2 === 0 ? 'left' : 'right';
                  const number = String(itemIndex + 1).padStart(2, '0');

                  return (
                    <article
                      key={number}
                      className={`map-step map-step-${side}`}
                    >
                      <div className="map-card">
                        <span className="map-number" aria-hidden="true">{number}</span>
                        <span className="map-display map-text">{items[itemIndex]}</span>
                      </div>
                    </article>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
