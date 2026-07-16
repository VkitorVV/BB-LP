export default function Rodape() {
  const currentYear = new Date().getFullYear();

  return (
  <footer
    id="rodape"
    aria-labelledby="rodape-title"
    data-track-section="rodape"
    data-track-order="14"
    data-track-title="14 - Rodapé"
  >
      <style>{`
        #rodape {
          position: relative;
          left: 50%;
          width: 100vw;
          max-width: 100vw;
          transform: translateX(-50%);
          overflow-x: clip;
          box-sizing: border-box;
          padding: 34px 18px 36px;
          background: #0F0A06;
          color: #D9C3A3;
          border-top: 1px solid rgba(216, 166, 74, 0.2);
        }
        #rodape *,
        #rodape *::before,
        #rodape *::after {
          box-sizing: border-box;
        }
        #rodape .footer-shell {
          width: 100%;
          max-width: 1040px;
          margin: 0 auto;
        }
        #rodape .footer-top {
          display: grid;
          gap: 18px;
          text-align: center;
        }
        #rodape .footer-brand {
          margin: 0 0 6px;
          color: #FFF4E6;
          font-family: var(--font-display), var(--font-display-family), Impact, sans-serif;
          font-size: 1.35rem;
          font-weight: 900;
          line-height: 1;
          letter-spacing: 0;
          text-transform: uppercase;
        }
        #rodape .footer-description,
        #rodape .footer-support,
        #rodape .footer-copy {
          margin: 0;
          font-size: 0.86rem;
          line-height: 1.45;
          font-weight: 600;
        }
        #rodape .footer-support {
          color: #C9B89A;
        }
        #rodape .footer-support a {
          color: #D8A64A;
          overflow-wrap: anywhere;
          text-decoration: none;
          font-weight: 850;
        }
        #rodape .footer-support a:hover {
          text-decoration: underline;
        }
        #rodape .footer-support a:focus-visible {
          outline: 3px solid rgba(216, 166, 74, 0.72);
          outline-offset: 4px;
          border-radius: 4px;
        }
        #rodape .footer-copy {
          margin-top: 22px;
          padding-top: 18px;
          border-top: 1px solid rgba(216, 166, 74, 0.13);
          color: #A89678;
          text-align: center;
          font-size: 0.78rem;
        }
        @media (min-width: 768px) {
          #rodape {
            padding: 38px 28px 36px;
          }
          #rodape .footer-top {
            grid-template-columns: minmax(0, 1fr) auto;
            align-items: start;
            gap: 30px;
            text-align: left;
          }
          #rodape .footer-support {
            text-align: right;
          }
        }
      `}</style>

      <div className="footer-shell">
        <div className="footer-top">
          <div>
            <p id="rodape-title" className="footer-brand">
              Mapa do Degradê Sem Marca
            </p>
            <p className="footer-description">
              Material digital para consulta e impressão em formato A4.
            </p>
          </div>

          <p className="footer-support">
            Suporte:{' '}
            <a href="mailto:entregamateriaisadquiridos@gmail.com">
              entregamateriaisadquiridos@gmail.com
            </a>
          </p>
        </div>

        <p className="footer-copy">
          © {currentYear} Mapa do Degradê Sem Marca. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
