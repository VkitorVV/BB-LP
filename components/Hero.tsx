'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Placeholder from './ui/Placeholder';

export default function Hero() {
  const handleScrollToOffer = () => {
    const offerSection = document.getElementById('oferta');
    if (offerSection) {
      offerSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative pt-12 pb-16 px-5 border-b border-[#2A2F38] overflow-hidden bg-[#0F1115]">
      {/* Decorative top bar with animation */}
      <div className="absolute top-0 left-0 w-full h-[4px] animate-barber-pole" />
      
      {/* Subtle lighting overlay - no intense glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#22C55E]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md mx-auto flex flex-col items-center">
        {/* Pré-headline */}
        <motion.p 
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="text-xs font-extrabold tracking-wider text-[#D6A94A] bg-[#1B1F27] py-1.5 px-4 rounded-md border border-[#2A2F38] text-center mb-6 uppercase font-display"
        >
          Para barbeiros iniciantes que ainda sentem insegurança na hora do degradê
        </motion.p>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3, ease: 'easeOut' }}
          className="text-3xl font-black text-center text-[#F5F5F5] leading-tight font-display tracking-tight uppercase"
        >
          Seu degradê ainda fica com <span className="text-[#22C55E]">marca aparecendo?</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="text-sm text-[#B8BDC7] text-center mt-4 leading-relaxed font-sans"
        >
          Entenda onde trocar o pente, como suavizar a transição e como finalizar o corte usando um mapa visual simples de pentes, alturas e acabamento.
        </motion.p>

        {/* Mockup principal do kit - Container Vazio */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3 }}
          className="w-full mt-8"
        >
          <Placeholder type="main-kit" className="w-full shadow-lg" />
        </motion.div>

        {/* Bullets rápidos */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="w-full mt-8 space-y-3 bg-[#151820] p-5 rounded-xl border border-[#2A2F38]"
        >
          {[
            'Veja onde a marca costuma aparecer.',
            'Entenda a lógica dos pentes sem confusão.',
            'Use checklists para revisar o corte.',
            'Consulte o material sempre que estiver treinando.',
          ].map((bullet, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="mt-0.5 p-0.5 bg-[#151820] rounded-full text-[#22C55E] border border-[#2A2F38] shrink-0">
                <Check size={14} className="stroke-[3]" />
              </div>
              <span className="text-xs text-[#F5F5F5] font-medium leading-relaxed">{bullet}</span>
            </div>
          ))}
        </motion.div>

        {/* Botão */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.3 }}
          className="w-full mt-8"
        >
          <button 
            onClick={handleScrollToOffer}
            className="w-full py-4 px-6 bg-[#22C55E] text-[#0F1115] text-sm font-black uppercase rounded-xl hover:bg-[#1eb053] active:scale-[0.98] transition-all duration-150 tracking-wider flex items-center justify-center cursor-pointer font-display"
          >
            Quero acessar o Mapa do Degradê
          </button>
          
          <p className="text-[11px] text-[#B8BDC7]/60 text-center mt-3 font-medium">
            🔒 Acesso digital liberado após a confirmação da compra.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
