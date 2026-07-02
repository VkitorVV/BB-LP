'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function Beneficios() {
  const benefitsList = [
    {
      title: '1. Entenda onde a marca aparece',
      desc: 'Veja os pontos mais comuns onde a transição pesa e o degradê começa a ficar marcado.',
    },
    {
      title: '2. Organize a troca dos pentes',
      desc: 'Tenha mais clareza sobre qual pente entra em cada etapa e evite saltos bruscos na transição.',
    },
    {
      title: '3. Consulte enquanto treina',
      desc: 'Use o material como apoio visual nos seus treinos, sem precisar decorar tudo de uma vez.',
    },
    {
      title: '4. Revise antes de finalizar',
      desc: 'Com o checklist, você confere marcação, transição, acabamento e simetria antes de liberar o corte.',
    },
    {
      title: '5. Treine seu olhar visual',
      desc: 'Use referências de low, mid, high e taper fade para entender melhor o resultado que você quer alcançar.',
    },
    {
      title: '6. Finalize com mais segurança',
      desc: 'Revise pezinho, nuca e laterais para deixar o corte com aparência mais limpa.',
    },
  ];

  return (
    <section id="beneficios" className="py-20 px-5 bg-[#0F1115] border-b border-[#2A2F38]">
      <div className="max-w-md mx-auto">
        {/* Título */}
        <h2 className="text-2xl font-black text-[#F5F5F5] text-center font-display tracking-tight leading-tight uppercase">
          Um material simples para entender o que está deixando seu degradê marcado
        </h2>

        {/* Grid de Cards */}
        <div className="mt-10 grid grid-cols-1 gap-4">
          {benefitsList.map((benefit, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.25, ease: 'easeOut', delay: idx * 0.04 }}
              className="bg-[#1B1F27] border border-[#2A2F38] rounded-xl p-5 flex items-start gap-4 transition-all duration-200"
            >
              {/* Ícone Discreto */}
              <div className="p-1.5 bg-[#151820] rounded text-[#22C55E] border border-[#2A2F38] shrink-0 mt-0.5">
                <Check size={14} className="stroke-[3]" />
              </div>
              
              {/* Texto */}
              <div className="space-y-1">
                <h3 className="text-xs font-extrabold text-[#F5F5F5] uppercase font-display tracking-wider">
                  {benefit.title}
                </h3>
                <p className="text-xs text-[#B8BDC7] leading-relaxed font-sans">
                  {benefit.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
