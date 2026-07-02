'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Placeholder from './ui/Placeholder';

export default function Bonus() {
  const bonuses = [
    {
      num: 'BÔNUS 01',
      title: 'Tabela dos Pentes e Alturas',
      desc: 'Para consultar a ordem dos pentes e entender onde cada altura entra na transição.',
      placeholderType: 'tabela' as const,
    },
    {
      num: 'BÔNUS 02',
      title: 'Checklist do Corte Sem Marca',
      desc: 'Para revisar o corte antes, durante e depois da finalização.',
      placeholderType: 'checklist' as const,
    },
    {
      num: 'BÔNUS 03',
      title: 'Guia dos 7 Erros que Estragam o Degradê',
      desc: 'Para identificar o que pode estar deixando seu corte com linha aparente ou aparência pesada.',
      placeholderType: 'erros' as const,
    },
    {
      num: 'BÔNUS 04',
      title: 'Pack de Referências Essenciais de Fade',
      desc: 'Referências visuais de low fade, mid fade, high fade e taper fade para treinar seu olhar.',
      placeholderType: 'referencias' as const,
    },
    {
      num: 'BÔNUS 05',
      title: 'Mini Guia de Acabamento Profissional',
      desc: 'Para revisar pezinho, nuca, laterais e apresentação final do corte.',
      placeholderType: 'acabamento' as const,
    },
  ];

  return (
    <section id="bonus" className="py-20 px-5 bg-[#151820] border-b border-[#2A2F38]">
      <div className="max-w-md mx-auto">
        {/* Título */}
        <h2 className="text-2xl font-black text-[#F5F5F5] text-center font-display tracking-tight leading-tight uppercase">
          E não para por aí. Você também recebe 5 bônus práticos
        </h2>
        
        <p className="text-xs text-center text-[#D6A94A] uppercase tracking-wider font-extrabold mt-3 font-display">
          🎁 Conteúdos de bancada inclusos gratuitamente
        </p>

        {/* Lista de Bônus */}
        <div className="mt-10 space-y-8">
          {bonuses.map((bonus, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.3, ease: 'easeOut', delay: idx * 0.05 }}
              className="bg-[#1B1F27] border border-[#2A2F38] rounded-2xl p-5 hover:border-[#D6A94A]/10 transition-all duration-300 relative overflow-hidden"
            >
              {/* Tag com número e GRÁTIS */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-mono font-black text-[#D6A94A] bg-[#151820] py-1 px-3 rounded border border-[#2A2F38] uppercase">
                  {bonus.num}
                </span>
                <span className="text-[10px] font-mono text-[#22C55E] bg-[#22C55E]/5 py-1 px-2.5 rounded border border-[#22C55E]/10 font-black uppercase">
                  GRÁTIS
                </span>
              </div>

              {/* Visual Preview - Completamente Vazio */}
              <div className="mb-4">
                <Placeholder type={bonus.placeholderType} className="w-full" />
              </div>

              {/* Textos */}
              <div className="space-y-1.5 pt-1">
                <h3 className="text-base font-black text-[#F5F5F5] uppercase font-display leading-tight tracking-wide">
                  {bonus.title}
                </h3>
                <p className="text-xs text-[#B8BDC7] leading-relaxed font-sans">
                  {bonus.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
