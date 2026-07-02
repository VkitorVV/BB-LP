'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Placeholder from './ui/Placeholder';

export default function ProvaSocial() {
  const handleScrollToOffer = () => {
    const offerSection = document.getElementById('oferta');
    if (offerSection) {
      offerSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const stories = [
    'story-1',
    'story-2',
    'story-3',
    'story-4',
    'story-5',
    'story-6'
  ] as const;

  return (
    <section id="prova-social" className="py-20 px-5 bg-[#151820] border-b border-[#2A2F38] overflow-hidden">
      <div className="max-w-md mx-auto">
        {/* Título e Subtítulo */}
        <h2 className="text-2xl font-black text-[#F5F5F5] text-center font-display tracking-tight leading-tight uppercase">
          Veja o que outros barbeiros falaram sobre o material
        </h2>
        
        <p className="text-xs font-bold text-[#D6A94A] text-center mt-3 uppercase tracking-wider font-display">
          ✨ Prints reais de pessoas que acompanharam, receberam ou comentaram sobre o conteúdo.
        </p>

        <p className="text-sm text-[#B8BDC7] text-center mt-4 leading-relaxed font-sans">
          Quem está começando na barbearia geralmente tem a mesma dificuldade: entender onde a marca aparece, qual pente usar e como deixar a transição mais limpa. Veja alguns retornos recebidos nos stories:
        </p>

        {/* Carrossel Horizontal / Grid touch-friendly com 6 placeholders de story vazios em proporção 9:16 */}
        <div className="mt-10 flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory scroll-smooth -mx-5 px-5">
          {stories.map((storyType, idx) => (
            <div key={idx} className="snap-center shrink-0 w-[240px] md:w-[280px]">
              <Placeholder 
                type={storyType} 
                className="w-full hover:border-[#22C55E]/30 transition-all duration-300" 
              />
            </div>
          ))}
        </div>

        {/* Indicador de arrastar para o lado */}
        <p className="text-[10px] text-center text-[#B8BDC7]/40 font-extrabold uppercase tracking-widest mt-2 font-display">
          ← Deslize para o lado para ver os stories →
        </p>

        {/* Botão */}
        <div className="mt-10">
          <button 
            onClick={handleScrollToOffer}
            className="w-full py-4 px-6 bg-[#22C55E] text-[#0F1115] text-sm font-black uppercase rounded-xl hover:bg-[#1eb053] active:scale-[0.98] transition-all duration-150 cursor-pointer font-display text-center tracking-wider"
          >
            Quero acessar o Mapa do Degradê
          </button>
          
          <p className="text-[11px] text-[#B8BDC7]/40 text-center mt-3 font-semibold">
            🔒 Compra 100% segura • Acesso imediato no celular
          </p>
        </div>
      </div>
    </section>
  );
}
