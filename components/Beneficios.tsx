'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const benefitsList = [
  { title: '1. Entenda onde a marca aparece',    desc: 'Veja os pontos mais comuns onde a transição pesa e o degradê começa a ficar marcado.' },
  { title: '2. Organize a troca dos pentes',     desc: 'Tenha mais clareza sobre qual pente entra em cada etapa e evite saltos bruscos.' },
  { title: '3. Consulte enquanto treina',        desc: 'Use o material como apoio visual nos seus treinos, sem precisar decorar tudo de uma vez.' },
  { title: '4. Revise antes de finalizar',       desc: 'Com o checklist, confira marcação, transição, acabamento e simetria antes de liberar o corte.' },
  { title: '5. Treine seu olhar visual',         desc: 'Use referências de low, mid, high e taper fade para entender melhor o resultado desejado.' },
  { title: '6. Finalize com mais segurança',     desc: 'Revise pezinho, nuca e laterais para deixar o corte com aparência mais limpa.' },
];

export default function Beneficios() {
  return (
    <section
      id="beneficios"
      className="py-20 px-5 texture-brick relative"
      style={{ borderBottom: '1px solid #3A1D10' }}
    >
      <div className="max-w-md mx-auto">

        <h2 className="font-display text-[2.4rem] leading-none uppercase text-[#FFF4E6] mb-10">
          Um material simples para entender o que está deixando seu degradê marcado
        </h2>

        {/* Cards */}
        <div className="space-y-4">
          {benefitsList.map((benefit, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.25, ease: 'easeOut', delay: idx * 0.04 }}
              className="rounded-xl p-5 flex items-start gap-4 transition-all duration-200"
              style={{ background: '#160D08', border: '1px solid #3A1D10' }}
            >
              <div
                className="shrink-0 mt-0.5 w-6 h-6 rounded flex items-center justify-center"
                style={{ background: 'rgba(242,138,26,0.12)', border: '1px solid rgba(242,138,26,0.3)' }}
              >
                <Check size={13} style={{ color: '#F28A1A' }} strokeWidth={3} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-extrabold text-[#FFF4E6] uppercase font-display tracking-wider">
                  {benefit.title}
                </h3>
                <p className="text-xs text-[#D9C3A3] leading-relaxed">
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
