'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function IdealPara() {
  const cards = [
    {
      title: 'Deixar o degradê menos marcado',
      desc: 'Se você sente que sempre fica uma linha aparecendo, o mapa ajuda a entender onde a transição está pesando.',
    },
    {
      title: 'Entender melhor a troca dos pentes',
      desc: 'Veja a função de cada altura e como organizar a sequência de forma mais clara.',
    },
    {
      title: 'Parar de corrigir no improviso',
      desc: 'Em vez de passar a máquina várias vezes sem saber o motivo da marca, consulte uma lógica visual simples.',
    },
    {
      title: 'Treinar com mais direção',
      desc: 'Use o guia para revisar seus cortes, comparar erros e evoluir com mais clareza.',
    },
    {
      title: 'Finalizar com mais segurança',
      desc: 'Tenha apoio para revisar nuca, pezinho, laterais e aparência final do corte.',
    },
  ];

  return (
    <section id="ideal-para" className="py-20 px-5 bg-[#151820] border-b border-[#2A2F38]">
      <div className="max-w-md mx-auto">
        {/* Título */}
        <h2 className="text-2xl font-black text-[#F5F5F5] text-center font-display tracking-tight leading-tight uppercase mb-10">
          Ideal para você que deseja:
        </h2>

        {/* Lista de Cards em Coluna */}
        <div className="space-y-4">
          {cards.map((card, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.25, ease: 'easeOut', delay: idx * 0.04 }}
              className="bg-[#1B1F27] border border-[#2A2F38] hover:border-[#22C55E]/20 rounded-xl p-5 transition-all duration-200 flex items-start gap-4"
            >
              {/* Ícone Discreto */}
              <div className="p-1.5 bg-[#151820] rounded text-[#22C55E] border border-[#2A2F38] shrink-0 mt-0.5">
                <Check size={14} className="stroke-[3]" />
              </div>

              {/* Textos */}
              <div className="space-y-1">
                <h3 className="text-xs font-extrabold text-[#F5F5F5] uppercase font-display tracking-wider">
                  {card.title}
                </h3>
                <p className="text-xs text-[#B8BDC7] leading-relaxed font-sans">
                  {card.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
