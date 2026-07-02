'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function CTAIntermediario() {
  const handleScrollToOffer = () => {
    const offerSection = document.getElementById('oferta');
    if (offerSection) {
      offerSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="cta-intermediario" className="py-16 px-5 bg-[#0F1115] border-b border-[#2A2F38]">
      <div className="max-w-md mx-auto text-center">
        {/* Título */}
        <h2 className="text-xl font-black text-[#F5F5F5] font-display uppercase tracking-tight leading-snug">
          Acesse ainda hoje e consulte o material quando for treinar
        </h2>

        {/* Texto descritivo */}
        <p className="text-xs md:text-sm text-[#B8BDC7] mt-3 leading-relaxed font-sans">
          O Mapa do Degradê Sem Marca é digital. Após a confirmação da compra, você recebe o acesso ao material e pode abrir pelo celular, computador ou tablet.
        </p>

        {/* Botão */}
        <div className="mt-8">
          <button 
            onClick={handleScrollToOffer}
            className="w-full py-4 px-6 bg-[#22C55E] text-[#0F1115] text-sm font-black uppercase rounded-xl hover:bg-[#1eb053] active:scale-[0.98] transition-all duration-150 cursor-pointer font-display tracking-wider"
          >
            Quero acessar agora
          </button>

          {/* Microtexto */}
          <p className="text-[11px] text-[#B8BDC7]/40 mt-3.5 font-semibold">
            🔒 Compra segura. Material digital. Acesso após confirmação.
          </p>
        </div>
      </div>
    </section>
  );
}
