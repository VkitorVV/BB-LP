'use client';

import React from 'react';
import { 
  CreditCard, 
  Mail, 
  Smartphone, 
  CheckSquare 
} from 'lucide-react';

export default function ComoAcessar() {
  const steps = [
    {
      num: '01',
      icon: <CreditCard size={16} className="text-[#22C55E]" />,
      title: 'Passo 1 — Finalize a compra',
      desc: 'Escolha o plano desejado e conclua o pagamento.',
    },
    {
      num: '02',
      icon: <Mail size={16} className="text-[#22C55E]" />,
      title: 'Passo 2 — Receba o acesso digital',
      desc: 'Após a confirmação, você recebe as instruções de acesso.',
    },
    {
      num: '03',
      icon: <Smartphone size={16} className="text-[#22C55E]" />,
      title: 'Passo 3 — Abra pelo celular ou computador',
      desc: 'O material é digital e pode ser acessado pelo celular, computador ou tablet.',
    },
    {
      num: '04',
      icon: <CheckSquare size={16} className="text-[#22C55E]" />,
      title: 'Passo 4 — Consulte sempre que quiser',
      desc: 'Use o guia, a tabela e o checklist durante seus estudos e treinos.',
    },
  ];

  return (
    <section id="como-acessar" className="py-20 px-5 bg-[#0F1115] border-b border-[#2A2F38]">
      <div className="max-w-md mx-auto">
        {/* Título */}
        <h2 className="text-2xl font-black text-[#F5F5F5] text-center font-display tracking-tight leading-tight uppercase mb-12">
          Como você recebe o material
        </h2>

        {/* Linha vertical de passos */}
        <div className="relative pl-6 space-y-8 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-[#22C55E] before:to-[#2A2F38]">
          {steps.map((step, idx) => (
            <div key={idx} className="relative flex gap-5 items-start">
              {/* Círculo do passo com ícone */}
              <div className="absolute -left-[30px] w-10 h-10 rounded-full bg-[#1B1F27] border-2 border-[#22C55E] flex items-center justify-center z-10 shadow-lg shrink-0">
                {step.icon}
              </div>

              {/* Textos */}
              <div className="bg-[#1B1F27] border border-[#2A2F38] rounded-xl p-4 flex-1 hover:border-[#22C55E]/20 transition-all duration-300">
                <span className="text-[9px] font-mono font-black text-[#D6A94A] bg-[#151820] py-0.5 px-2 rounded border border-[#2A2F38] uppercase">
                  ETAPA {step.num}
                </span>
                <h3 className="text-sm font-bold text-[#F5F5F5] uppercase font-display tracking-wide mt-1.5">
                  {step.title}
                </h3>
                <p className="text-xs text-[#B8BDC7] leading-relaxed mt-1 font-sans">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
