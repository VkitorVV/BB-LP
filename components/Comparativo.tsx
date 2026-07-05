'use client';

import React from 'react';
import { XCircle, CheckCircle } from 'lucide-react';

const comparisons = [
  { bad: 'Você passa a máquina várias vezes sem saber onde está o erro.',           good: 'Você identifica onde a transição está pesando.' },
  { bad: 'Troca pentes sem uma lógica clara.',                                       good: 'Entende a função de cada altura.' },
  { bad: 'Pode subir demais o degradê tentando corrigir.',                           good: 'Consulta uma sequência visual antes de mexer.' },
  { bad: 'Finaliza sem revisar pontos importantes.',                                 good: 'Usa checklist para conferir o corte.' },
  { bad: 'Aprende apenas por tentativa e erro.',                                     good: 'Treina com um material organizado.' },
];

export default function Comparativo() {
  return (
    <section
      id="comparativo"
      className="py-20 px-5 texture-brick relative"
      style={{ borderBottom: '1px solid #3A1D10' }}
    >
      <div className="max-w-md mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-[4px] rounded-full" style={{ background: '#F28A1A' }} />
          <span className="badge-copper">Por que usar o mapa</span>
        </div>

        <h2 className="font-display text-[2.4rem] leading-none uppercase text-[#FFF4E6] mb-10">
          Por que usar um mapa visual em vez de tentar corrigir no improviso?
        </h2>

        <div className="space-y-6">
          {comparisons.map((item, idx) => (
            <div
              key={idx}
              className="space-y-2"
              style={{ paddingBottom: '1.5rem', borderBottom: idx < comparisons.length - 1 ? '1px solid #2A130B' : 'none' }}
            >
              {/* Without map */}
              <div
                className="rounded-xl p-4 flex gap-3 items-start"
                style={{ background: '#1F0C0C', border: '1px solid rgba(179,58,46,0.2)' }}
              >
                <XCircle className="shrink-0 mt-0.5" size={16} style={{ color: '#B33A2E' }} />
                <div>
                  <p className="text-[9px] font-black text-[#B33A2E] uppercase tracking-wider font-display mb-1">
                    Tentando no Improviso
                  </p>
                  <p className="text-xs text-[#D9C3A3] leading-relaxed">{item.bad}</p>
                </div>
              </div>

              {/* With map */}
              <div
                className="rounded-xl p-4 flex gap-3 items-start"
                style={{ background: '#1A0F04', border: '1px solid rgba(242,138,26,0.2)' }}
              >
                <CheckCircle className="shrink-0 mt-0.5" size={16} style={{ color: '#F28A1A' }} />
                <div>
                  <p className="text-[9px] font-black text-[#F28A1A] uppercase tracking-wider font-display mb-1">
                    Com o Mapa do Degradê
                  </p>
                  <p className="text-xs text-[#FFF4E6] leading-relaxed font-bold">{item.good}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div
          className="mt-10 text-center py-4 px-5 rounded-xl"
          style={{ background: '#160D08', border: '1px solid #3A1D10' }}
        >
          <p className="text-xs text-[#D9C3A3] leading-relaxed font-medium">
            💡 A ideia não é complicar o corte. É deixar mais claro o que observar, onde
            corrigir e como revisar antes de finalizar.
          </p>
        </div>

      </div>
    </section>
  );
}
