'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const COUNTDOWN_DURATION = 10 * 60 * 1000; // 10 minutos em milissegundos
const STORAGE_KEY = 'offer_countdown_end_time';

export default function OfferCountdown() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 10, seconds: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Pegar ou criar o tempo de término
    let endTime = localStorage.getItem(STORAGE_KEY);
    
    if (!endTime) {
      // Primeira visita - definir tempo de término
      const now = Date.now();
      endTime = String(now + COUNTDOWN_DURATION);
      localStorage.setItem(STORAGE_KEY, endTime);
    }

    const updateCountdown = () => {
      const now = Date.now();
      const end = parseInt(endTime as string, 10);
      const difference = end - now;

      if (difference <= 0) {
        // Tempo acabou
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      // Calcular horas, minutos e segundos
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    // Atualizar imediatamente
    updateCountdown();

    // Atualizar a cada segundo
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  // Formatar números com zero à esquerda
  const format = (num: number) => String(num).padStart(2, '0');

  if (!isClient) {
    // Evitar hidratação incorreta - mostrar valor inicial
    return (
      <section
        className="py-12 px-5"
        style={{ background: '#0B0704', borderBottom: '1px solid #3A1D10' }}
      >
        <div className="max-w-md mx-auto">
          <div
            className="rounded-2xl p-6 text-center"
            style={{
              background: '#160D08',
              border: '2px solid #F28A1A',
              boxShadow: '0 8px 32px rgba(242,138,26,0.15)',
            }}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{ background: '#F28A1A', color: '#0B0704' }}
            >
              <Clock size={16} className="animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider font-display">
                Oferta Limitada - Termina em:
              </span>
            </div>

            <div className="flex justify-center gap-3">
              <div className="flex flex-col items-center">
                <div
                  className="w-20 h-20 flex items-center justify-center rounded-xl mb-2"
                  style={{
                    background: '#2A130B',
                    border: '1.5px solid #5A321C',
                    boxShadow: '0 4px 16px rgba(11,7,4,0.6)',
                  }}
                >
                  <span className="font-display text-3xl text-[#F28A1A]">00</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D9C3A3]">
                  Horas
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div
                  className="w-20 h-20 flex items-center justify-center rounded-xl mb-2"
                  style={{
                    background: '#2A130B',
                    border: '1.5px solid #5A321C',
                    boxShadow: '0 4px 16px rgba(11,7,4,0.6)',
                  }}
                >
                  <span className="font-display text-3xl text-[#F28A1A]">10</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D9C3A3]">
                  Minutos
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div
                  className="w-20 h-20 flex items-center justify-center rounded-xl mb-2"
                  style={{
                    background: '#2A130B',
                    border: '1.5px solid #5A321C',
                    boxShadow: '0 4px 16px rgba(11,7,4,0.6)',
                  }}
                >
                  <span className="font-display text-3xl text-[#F28A1A]">00</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D9C3A3]">
                  Segundos
                </span>
              </div>
            </div>

            <p className="text-xs text-[#D9C3A3] mt-6 leading-relaxed">
              Condição especial disponível por tempo limitado nesta página.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="py-12 px-5"
      style={{ background: '#0B0704', borderBottom: '1px solid #3A1D10' }}
    >
      <div className="max-w-md mx-auto">
        <div
          className="rounded-2xl p-6 text-center"
          style={{
            background: '#160D08',
            border: '2px solid #F28A1A',
            boxShadow: '0 8px 32px rgba(242,138,26,0.15)',
          }}
        >
          {/* Badge de oferta limitada */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ background: '#F28A1A', color: '#0B0704' }}
          >
            <Clock size={16} className="animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider font-display">
              Oferta Limitada - Termina em:
            </span>
          </div>

          {/* Blocos de tempo */}
          <div className="flex justify-center gap-3">
            {/* Horas */}
            <div className="flex flex-col items-center">
              <div
                className="w-20 h-20 flex items-center justify-center rounded-xl mb-2"
                style={{
                  background: '#2A130B',
                  border: '1.5px solid #5A321C',
                  boxShadow: '0 4px 16px rgba(11,7,4,0.6)',
                }}
              >
                <span className="font-display text-3xl text-[#F28A1A]">
                  {format(timeLeft.hours)}
                </span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D9C3A3]">
                Horas
              </span>
            </div>

            {/* Minutos */}
            <div className="flex flex-col items-center">
              <div
                className="w-20 h-20 flex items-center justify-center rounded-xl mb-2"
                style={{
                  background: '#2A130B',
                  border: '1.5px solid #5A321C',
                  boxShadow: '0 4px 16px rgba(11,7,4,0.6)',
                }}
              >
                <span className="font-display text-3xl text-[#F28A1A]">
                  {format(timeLeft.minutes)}
                </span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D9C3A3]">
                Minutos
              </span>
            </div>

            {/* Segundos */}
            <div className="flex flex-col items-center">
              <div
                className="w-20 h-20 flex items-center justify-center rounded-xl mb-2"
                style={{
                  background: '#2A130B',
                  border: '1.5px solid #5A321C',
                  boxShadow: '0 4px 16px rgba(11,7,4,0.6)',
                }}
              >
                <span className="font-display text-3xl text-[#F28A1A]">
                  {format(timeLeft.seconds)}
                </span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D9C3A3]">
                Segundos
              </span>
            </div>
          </div>

          {/* Texto de reforço */}
          <p className="text-xs text-[#D9C3A3] mt-6 leading-relaxed">
            Condição especial disponível por tempo limitado nesta página.
          </p>
        </div>
      </div>
    </section>
  );
}
