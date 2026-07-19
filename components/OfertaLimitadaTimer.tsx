'use client';

import React from 'react';

const TIMER_SECONDS = 30 * 60;

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function ClockIcon() {
  return (
    <svg className="timer-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.4" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function OfertaLimitadaTimer() {
  const [remaining, setRemaining] = React.useState(TIMER_SECONDS);

  React.useEffect(() => {
    let startedAt = Date.now();
    const tick = () => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      setRemaining(Math.max(0, TIMER_SECONDS - elapsed));
    };
    const resetTimer = () => {
      startedAt = Date.now();
      setRemaining(TIMER_SECONDS);
      tick();
    };

    tick();
    const timer = window.setInterval(tick, 1000);
    window.addEventListener('pageshow', resetTimer);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('pageshow', resetTimer);
    };
  }, []);

  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;

  return (
    <section
      id="contador-oferta"
      aria-labelledby="contador-oferta-title"
      data-track-section="contador-oferta"
      data-track-order="11"
      data-track-title="11 - OFERTA LIMITADA"
    >
      <style>{`
        #contador-oferta {
          position: relative;
          left: 50%;
          width: 100vw;
          max-width: 100vw;
          transform: translateX(-50%);
          box-sizing: border-box;
          overflow: hidden;
          padding: 34px 16px 30px;
          background: #0B0704;
          color: var(--color-paper);
        }
        #contador-oferta *,
        #contador-oferta *::before,
        #contador-oferta *::after {
          box-sizing: border-box;
        }
        #contador-oferta .timer-shell {
          width: min(100%, 448px);
          margin: 0 auto;
          padding: 24px 16px 22px;
          border: 2px solid var(--color-gold);
          border-radius: 16px;
          background: #140D08;
          text-align: center;
        }
        #contador-oferta .timer-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 36px;
          margin: 0 auto 20px;
          padding: 9px 15px 8px;
          border-radius: 999px;
          background: var(--color-gold);
          color: #0B0704;
          font-size: 0.72rem;
          font-weight: 950;
          letter-spacing: 0.04em;
          line-height: 1;
          text-transform: uppercase;
        }
        #contador-oferta .timer-icon {
          width: 16px;
          height: 16px;
          stroke-width: 2.4;
        }
        #contador-oferta .timer-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          width: min(100%, 300px);
          margin: 0 auto;
        }
        #contador-oferta .timer-box {
          display: grid;
          gap: 10px;
          min-width: 0;
        }
        #contador-oferta .timer-number {
          display: grid;
          place-items: center;
          min-height: 78px;
          border: 1px solid rgba(216, 166, 74, 0.36);
          border-radius: 10px;
          background: #2A1009;
          color: #F58A1F;
          font-family: var(--font-display), Impact, sans-serif;
          font-size: clamp(2.1rem, 9vw, 3rem);
          font-weight: 900;
          line-height: 1;
        }
        #contador-oferta .timer-label {
          color: var(--color-paper);
          font-size: 0.68rem;
          font-weight: 950;
          letter-spacing: 0.14em;
          line-height: 1;
          text-transform: uppercase;
        }
        #contador-oferta .timer-copy {
          max-width: 360px;
          margin: 22px auto 0;
          color: var(--color-paper-alt);
          font-size: 0.88rem;
          line-height: 1.45;
          font-weight: 600;
        }
        @media (min-width: 760px) {
          #contador-oferta {
            padding: 44px 28px 40px;
          }
          #contador-oferta .timer-shell {
            width: min(100%, 540px);
            padding: 26px 28px 28px;
          }
          #contador-oferta .timer-grid {
            width: min(100%, 330px);
            gap: 14px;
          }
        }
      `}</style>

      <div className="timer-shell">
        <div id="contador-oferta-title" className="timer-pill">
          <ClockIcon />
          Oferta Limitada - Termina em:
        </div>

        <div className="timer-grid" aria-live="polite">
          <div className="timer-box">
            <span className="timer-number">{pad(hours)}</span>
            <span className="timer-label">Horas</span>
          </div>
          <div className="timer-box">
            <span className="timer-number">{pad(minutes)}</span>
            <span className="timer-label">Minutos</span>
          </div>
          <div className="timer-box">
            <span className="timer-number">{pad(seconds)}</span>
            <span className="timer-label">Segundos</span>
          </div>
        </div>

        <p className="timer-copy">
          Condição especial disponível por tempo limitado nesta página.
        </p>
      </div>
    </section>
  );
}
