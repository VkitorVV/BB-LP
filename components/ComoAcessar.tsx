'use client';

import React from 'react';
import { CreditCard, Mail, Smartphone, CheckSquare } from 'lucide-react';

const steps = [
  { num: '01', icon: <CreditCard  size={16} style={{ color: '#F28A1A' }} />, title: 'Passo 1 — Finalize a compra',            desc: 'Escolha o plano desejado e conclua o pagamento.' },
  { num: '02', icon: <Mail        size={16} style={{ color: '#F28A1A' }} />, title: 'Passo 2 — Receba o acesso digital',       desc: 'Após a confirmação, você recebe as instruções de acesso.' },
  { num: '03', icon: <Smartphone  size={16} style={{ color: '#F28A1A' }} />, title: 'Passo 3 — Abra pelo celular ou computador', desc: 'O material é digital e pode ser acessado em qualquer dispositivo.' },
  { num: '04', icon: <CheckSquare size={16} style={{ color: '#F28A1A' }} />, title: 'Passo 4 — Consulte sempre que quiser',    desc: 'Use o guia, a tabela e o checklist durante seus estudos e treinos.' },
];

export default function ComoAcessar() {
  return (
    <section
      id="como-acessar"
      className="py-20 px-5"
      style={{ background: '#0B0704', borderBottom: '1px solid #3A1D10' }}
    >
      <div className="max-w-md mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-[4px] rounded-full" style={{ background: '#F28A1A' }} />
          <span className="badge-copper">Acesso</span>
        </div>

        <h2 className="font-display text-[2.4rem] leading-none uppercase text-[#FFF4E6] mb-12">
          Como você recebe o material
        </h2>

        {/* Steps timeline */}
        <div className="relative pl-6 space-y-8"
          style={{
            paddingLeft: '2rem',
          }}
        >
          {/* Vertical line */}
          <div
            className="absolute left-[19px] top-4 bottom-4 w-[2px]"
            style={{ background: 'linear-gradient(to bottom, #F28A1A, #3A1D10)' }}
          />

          {steps.map((step, idx) => (
            <div key={idx} className="relative flex gap-5 items-start">
              {/* Circle */}
              <div
                className="absolute -left-[30px] w-10 h-10 rounded-full flex items-center justify-center z-10 shrink-0"
                style={{
                  background: '#160D08',
                  border: '2px solid #F28A1A',
                  boxShadow: '0 0 0 3px rgba(242,138,26,0.08)',
                }}
              >
                {step.icon}
              </div>

              {/* Card */}
              <div
                className="flex-1 rounded-xl p-4 transition-all duration-300"
                style={{ background: '#160D08', border: '1px solid #3A1D10' }}
              >
                <span className="badge-gold mb-2 inline-block">ETAPA {step.num}</span>
                <h3 className="text-sm font-bold text-[#FFF4E6] uppercase font-display tracking-wide mt-1">
                  {step.title}
                </h3>
                <p className="text-xs text-[#D9C3A3] leading-relaxed mt-1">
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
