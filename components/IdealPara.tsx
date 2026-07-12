'use client';

import React from 'react';
import { Check } from 'lucide-react';

const cards = [
  { title: 'Deixar o degradê menos marcado',    desc: 'Se você sente que sempre fica uma linha aparecendo, o mapa ajuda a entender onde a transição está pesando.' },
  { title: 'Entender melhor a troca dos pentes', desc: 'Veja a função de cada altura e como organizar a sequência de forma mais clara.' },
  { title: 'Parar de corrigir no improviso',     desc: 'Em vez de passar a máquina várias vezes sem saber o motivo da marca, consulte uma lógica visual simples.' },
  { title: 'Treinar com mais direção',           desc: 'Use o guia para revisar seus cortes, comparar erros e evoluir com mais clareza.' },
  { title: 'Finalizar com mais segurança',       desc: 'Tenha apoio para revisar nuca, pezinho, laterais e aparência final do corte.' },
];

export default function IdealPara() {
  return (
    <section
      id="ideal-para"
      className="py-20 px-5"
      style={{ background: '#160D08', borderBottom: '1px solid #3A1D10' }}
    >
      <div className="max-w-md mx-auto">

        <h2 className="font-display text-[2.4rem] leading-none uppercase text-[#FFF4E6] mb-10">
          Ideal para você que deseja:
        </h2>

        <div className="space-y-4">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="rounded-xl p-5 flex items-start gap-4"
              style={{
                background: '#2A130B',
                border: '1px solid #5A321C',
              }}
            >
              <div
                className="shrink-0 mt-0.5 w-6 h-6 rounded flex items-center justify-center"
                style={{ background: 'rgba(242,138,26,0.15)', border: '1px solid rgba(242,138,26,0.35)' }}
              >
                <Check size={13} style={{ color: '#F28A1A' }} strokeWidth={3} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-extrabold text-[#FFF4E6] uppercase font-display tracking-wider">
                  {card.title}
                </h3>
                <p className="text-xs text-[#D9C3A3] leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
