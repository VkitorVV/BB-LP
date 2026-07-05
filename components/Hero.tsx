'use client';

import React from 'react';
import { Check } from 'lucide-react';
import Image from 'next/image';

export default function Hero() {
  const handleScrollToOffer = () => {
    document.getElementById('oferta')?.scrollIntoView({ behavior: 'smooth' });
  };

  const bullets = [
    'Veja onde a marca costuma aparecer.',
    'Entenda a lógica dos pentes sem confusão.',
    'Use checklists para revisar o corte.',
    'Consulte o material sempre que estiver treinando.',
  ];

  return (
    <section
      id="hero"
      className="relative pt-12 pb-16 px-5 overflow-hidden texture-brick"
      style={{ borderBottom: '1px solid #3A1D10' }}
    >
      {/* Barber pole top bar */}
      <div className="absolute top-0 left-0 w-full h-[5px] animate-barber-pole" />

      {/* Warm vignette corners */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(11,7,4,0.7) 100%)' }}
      />

      <div className="relative z-10 max-w-md mx-auto flex flex-col items-center">

        {/* Pre-headline tag */}
        <div className="mb-6">
          <span className="badge-gold">
            Para barbeiros que querem degradê mais limpo
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-[2.8rem] leading-none text-center tracking-wide uppercase text-[#FFF4E6]">
          Seu degradê ainda fica com{' '}
          <span style={{ color: '#F28A1A' }}>marca aparecendo?</span>
        </h1>

        {/* Copper divider */}
        <div
          className="w-16 h-[2px] my-5"
          style={{ background: 'linear-gradient(90deg, #F28A1A, #D8A64A)' }}
        />

        {/* Subheadline */}
        <p className="text-sm text-[#D9C3A3] text-center leading-relaxed">
          Entenda onde trocar o pente, como suavizar a transição e como finalizar
          o corte usando um mapa visual simples de pentes, alturas e acabamento.
        </p>

        {/* Main mockup — LCP element, no animation wrapper */}
        <div className="w-full mt-8">
          <Image
            src="/images/hero/mockup-hero-guia-principal.webp"
            alt="Mockup do guia Mapa do Degradê Sem Marca"
            width={1400}
            height={1000}
            priority
            fetchPriority="high"
            loading="eager"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 95vw, 600px"
            className="w-full h-auto rounded-2xl"
          />
        </div>

        {/* Bullets */}
        <div
          className="w-full mt-8 space-y-3 rounded-xl p-5"
          style={{ background: '#160D08', border: '1px solid #3A1D10' }}
        >
          {bullets.map((bullet, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div
                className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(242,138,26,0.15)', border: '1px solid #F28A1A' }}
              >
                <Check size={11} style={{ color: '#F28A1A' }} strokeWidth={3} />
              </div>
              <span className="text-xs text-[#D9C3A3] leading-relaxed font-medium">{bullet}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="w-full mt-8">
          <button
            onClick={handleScrollToOffer}
            className="w-full py-4 px-6 text-sm font-black uppercase rounded-lg tracking-wider transition-all duration-150 active:scale-[0.98] cursor-pointer font-display"
            style={{ background: '#F28A1A', color: '#0B0704' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#D87512')}
            onMouseLeave={e => (e.currentTarget.style.background = '#F28A1A')}
          >
            Quero acessar o Mapa do Degradê
          </button>
          <p className="text-[11px] text-[#C9B89A] text-center mt-3 font-medium">
            🔒 Acesso digital liberado após a confirmação da compra.
          </p>
        </div>

      </div>
    </section>
  );
}
