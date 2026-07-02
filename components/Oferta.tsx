'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Flame, ShieldAlert } from 'lucide-react';
import Placeholder from './ui/Placeholder';

export default function Oferta() {
  const handleCheckoutBasic = () => {
    // Redirecionamento de checkout para plano básico
    window.open('https://pay.hotmart.com/mock-basic', '_blank');
  };

  const handleCheckoutComplete = () => {
    // Redirecionamento de checkout para plano completo
    window.open('https://pay.hotmart.com/mock-complete', '_blank');
  };

  return (
    <section id="oferta" className="py-20 px-5 bg-[#151820] border-b border-[#2A2F38]">
      <div className="max-w-md mx-auto">
        {/* Título de Oferta */}
        <h2 className="text-2xl font-black text-[#F5F5F5] text-center font-display tracking-tight leading-tight uppercase">
          Escolha o seu plano de acesso ao material
        </h2>
        
        <p className="text-xs text-[#B8BDC7] text-center mt-3 font-sans leading-relaxed">
          Acesso imediato e digital. Escolha o formato ideal para você consultar no seu dia a dia na barbearia.
        </p>

        {/* Empilhamento de Planos (Mobile-First) */}
        <div className="mt-10 space-y-8">
          
          {/* PLANO BÁSICO - Menos Vantajoso */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-[#1B1F27] border border-[#2A2F38] rounded-2xl p-6 flex flex-col justify-between"
          >
            <div>
              {/* Cabeçalho */}
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-mono font-black text-[#B8BDC7] uppercase tracking-wider bg-[#151820] py-1 px-2 rounded border border-[#2A2F38]">
                    Apenas o Guia
                  </span>
                  <h3 className="text-lg font-black text-[#F5F5F5] uppercase font-display tracking-wide mt-2">
                    Plano Básico
                  </h3>
                </div>
              </div>

              {/* Descrição Curta */}
              <p className="text-xs text-[#B8BDC7] mt-2 leading-relaxed font-sans">
                Acesso exclusivo ao Guia Principal Mapa do Degradê em formato digital (PDF) para consulta.
              </p>

              {/* Container Vazio de Mockup */}
              <div className="my-5">
                <Placeholder type="basic-plan" className="w-full" />
              </div>

              {/* Lista curta do que recebe */}
              <div className="space-y-2 border-t border-[#2A2F38]/50 pt-4 text-xs text-[#B8BDC7]">
                <div className="flex items-center gap-2.5">
                  <Check size={12} className="text-[#22C55E] shrink-0" />
                  <span className="font-sans font-medium">Guia Digital Mapa do Degradê (PDF)</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#B8BDC7]/40">
                  <span className="shrink-0 text-[10px] font-mono">✕</span>
                  <span className="font-sans line-through">Tabela dos Pentes e Alturas</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#B8BDC7]/40">
                  <span className="shrink-0 text-[10px] font-mono">✕</span>
                  <span className="font-sans line-through">Checklist do Corte Sem Marca</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#B8BDC7]/40">
                  <span className="shrink-0 text-[10px] font-mono">✕</span>
                  <span className="font-sans line-through">Os 7 Erros Comuns</span>
                </div>
              </div>
            </div>

            {/* Preços e CTA */}
            <div className="mt-8 pt-4 border-t border-[#2A2F38]/50">
              <p className="text-[10px] text-[#B8BDC7]/40 font-bold uppercase tracking-wider line-through">
                De R$ 37,00
              </p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xs font-mono text-[#F5F5F5] font-black">Por apenas</span>
                <span className="text-3xl font-black text-[#F5F5F5] font-display">R$ 19,90</span>
                <span className="text-[10px] text-[#B8BDC7]/50 font-bold">à vista</span>
              </div>

              <button 
                onClick={handleCheckoutBasic}
                className="w-full py-3.5 mt-5 bg-transparent text-[#22C55E] border-2 border-[#22C55E] text-xs font-black uppercase rounded-xl hover:bg-[#22C55E]/5 transition-all duration-150 cursor-pointer font-display tracking-wider"
              >
                Quero o Plano Básico
              </button>
            </div>
          </motion.div>

          {/* PLANO COMPLETO - Extremamente Destaque e Vantajoso */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: 0.1 }}
            className="bg-[#1B1F27] border-2 border-[#22C55E] rounded-2xl p-6 flex flex-col justify-between relative shadow-xl shadow-[#22C55E]/5"
          >
            {/* Tag de Destaque */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#22C55E] text-[#0F1115] text-[9px] font-extrabold px-4 py-1 rounded-full uppercase tracking-wider font-display flex items-center gap-1">
              <Flame size={10} className="fill-current" /> Recomendado e mais vantajoso
            </div>

            <div className="pt-2">
              {/* Cabeçalho */}
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-mono font-black text-[#D6A94A] uppercase tracking-wider bg-[#211808] py-1 px-2.5 rounded border border-[#D6A94A]/20">
                    O Kit Completo + 5 Bônus
                  </span>
                  <h3 className="text-xl font-black text-[#F5F5F5] uppercase font-display tracking-wide mt-2 flex items-center gap-1.5">
                    Kit Completo
                  </h3>
                </div>
              </div>

              {/* Descrição Curta */}
              <p className="text-xs text-[#B8BDC7] mt-2 leading-relaxed font-sans">
                O acesso completo ao guia principal mais as 5 ferramentas de bancada para usar na barbearia.
              </p>

              {/* Container Vazio de Mockup */}
              <div className="my-5">
                <Placeholder type="complete-plan" className="w-full" />
              </div>

              {/* Lista completa de bônus inclusos */}
              <div className="space-y-2.5 border-t border-[#22C55E]/20 pt-4 text-xs">
                <p className="text-[9px] font-mono tracking-wider text-[#D6A94A] font-extrabold uppercase">
                  ✓ Tudo incluso neste plano:
                </p>
                <div className="flex items-center gap-2.5 text-[#F5F5F5]">
                  <Check size={12} className="text-[#22C55E] shrink-0" />
                  <span className="font-sans font-bold">Guia Digital Mapa do Degradê (PDF)</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#F5F5F5]">
                  <Check size={12} className="text-[#22C55E] shrink-0" />
                  <span className="font-sans font-bold">Bônus 1: Tabela dos Pentes e Alturas (Bancada)</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#F5F5F5]">
                  <Check size={12} className="text-[#22C55E] shrink-0" />
                  <span className="font-sans font-bold">Bônus 2: Checklist do Corte Sem Marca</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#F5F5F5]">
                  <Check size={12} className="text-[#22C55E] shrink-0" />
                  <span className="font-sans font-bold">Bônus 3: Guia dos 7 Erros Comuns</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#F5F5F5]">
                  <Check size={12} className="text-[#22C55E] shrink-0" />
                  <span className="font-sans font-bold">Bônus 4: Pack de Referências de Fade</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#F5F5F5]">
                  <Check size={12} className="text-[#22C55E] shrink-0" />
                  <span className="font-sans font-bold">Bônus 5: Mini Guia de Acabamento</span>
                </div>
              </div>
            </div>

            {/* Preços e CTA */}
            <div className="mt-8 pt-4 border-t border-[#22C55E]/20">
              <p className="text-[10px] text-[#B8BDC7]/40 font-bold uppercase tracking-wider line-through">
                De R$ 67,00
              </p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xs font-mono text-[#22C55E] font-black">Por apenas</span>
                <span className="text-3xl font-black text-[#22C55E] font-display">R$ 27,00</span>
                <span className="text-[10px] text-[#B8BDC7]/50 font-bold">à vista</span>
              </div>

              <button 
                onClick={handleCheckoutComplete}
                className="w-full py-4 mt-5 bg-[#22C55E] text-[#0F1115] text-sm font-black uppercase rounded-xl hover:bg-[#1eb053] active:scale-[0.98] transition-all duration-150 cursor-pointer font-display tracking-wider flex items-center justify-center gap-1"
              >
                Quero o Kit Completo + Bônus
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
