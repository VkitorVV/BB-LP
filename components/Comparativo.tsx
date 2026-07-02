'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, CheckCircle } from 'lucide-react';

export default function Comparativo() {
  const comparisons = [
    {
      bad: 'Você passa a máquina várias vezes sem saber onde está o erro.',
      good: 'Você identifica onde a transição está pesando.',
    },
    {
      bad: 'Troca pentes sem uma lógica clara.',
      good: 'Entende a função de cada altura.',
    },
    {
      bad: 'Pode subir demais o degradê tentando corrigir.',
      good: 'Consulta uma sequência visual antes de mexer.',
    },
    {
      bad: 'Finaliza sem revisar pontos importantes.',
      good: 'Usa checklist para conferir o corte.',
    },
    {
      bad: 'Aprende apenas por tentativa e erro.',
      good: 'Treina com um material organizado.',
    },
  ];

  return (
    <section id="comparativo" className="py-20 px-5 bg-[#0F1115] border-b border-[#2A2F38]">
      <div className="max-w-md mx-auto">
        {/* Título */}
        <h2 className="text-2xl font-black text-[#F5F5F5] text-center font-display tracking-tight leading-tight uppercase">
          Por que usar um mapa visual em vez de tentar corrigir no improviso?
        </h2>

        {/* Lista de Comparações */}
        <div className="mt-10 space-y-6">
          {comparisons.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.25, ease: 'easeOut', delay: idx * 0.04 }}
              className="space-y-3 border-b border-[#2A2F38]/30 pb-5 last:border-0 last:pb-0"
            >
              {/* Sem o mapa */}
              <div className="bg-[#1B1F27] border border-[#D94141]/20 rounded-xl p-4 flex gap-3 items-start">
                <XCircle className="text-[#D94141] shrink-0 mt-0.5" size={16} />
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-[#D94141] uppercase tracking-wider font-display">
                    Tentando no Improviso
                  </p>
                  <p className="text-xs text-[#B8BDC7] leading-relaxed font-sans">
                    {item.bad}
                  </p>
                </div>
              </div>

              {/* Com o mapa */}
              <div className="bg-[#1B1F27] border border-[#22C55E]/20 rounded-xl p-4 flex gap-3 items-start">
                <CheckCircle className="text-[#22C55E] shrink-0 mt-0.5" size={16} />
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-[#22C55E] uppercase tracking-wider font-display">
                    Com o Mapa do Degradê
                  </p>
                  <p className="text-xs text-[#F5F5F5] leading-relaxed font-sans font-bold">
                    {item.good}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Texto de Fechamento */}
        <div className="mt-10 text-center bg-[#151820] py-4 px-5 rounded-xl border border-[#2A2F38]">
          <p className="text-xs text-[#B8BDC7] leading-relaxed font-sans font-medium">
            💡 A ideia não é complicar o corte. É deixar mais claro o que observar, onde corrigir e como revisar antes de finalizar.
          </p>
        </div>
      </div>
    </section>
  );
}
