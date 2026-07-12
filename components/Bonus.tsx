'use client';

import React from 'react';
import Image from 'next/image';

const bonuses = [
  { num: 'BÔNUS 01', title: 'Tabela dos Pentes e Alturas',           desc: 'Para consultar a ordem dos pentes e entender onde cada altura entra na transição.',                           img: '/images/bonus/bonus-01-tabela-pentes-alturas.webp', alt: 'Mockup do bônus Tabela dos Pentes e Alturas' },
  { num: 'BÔNUS 02', title: 'Checklist do Corte Sem Marca',          desc: 'Para revisar o corte antes, durante e depois da finalização.',                                                img: '/images/bonus/bonus-02-checklist-corte-sem-marca.webp', alt: 'Mockup do bônus Checklist do Corte Sem Marca' },
  { num: 'BÔNUS 03', title: 'Guia dos 7 Erros que Estragam o Degradê', desc: 'Para identificar o que pode estar deixando seu corte com linha aparente ou aparência pesada.',             img: '/images/bonus/bonus-03-guia-7-erros.webp', alt: 'Mockup do bônus Guia dos 7 Erros que Estragam o Degradê' },
  { num: 'BÔNUS 04', title: 'Pack de Referências Essenciais de Fade', desc: 'Referências visuais de low fade, mid fade, high fade e taper fade para treinar seu olhar.',                  img: '/images/bonus/bonus-04-pack-referencias-fade.webp', alt: 'Mockup do bônus Pack de Referências de Degradê' },
  { num: 'BÔNUS 05', title: 'Mini Guia de Acabamento Profissional',   desc: 'Para revisar pezinho, nuca, laterais e apresentação final do corte.',                                        img: '/images/bonus/bonus-05-mini-guia-acabamento.webp', alt: 'Mockup do bônus Mini Guia de Acabamento Profissional' },
];

export default function Bonus() {
  return (
    <section
      id="bonus"
      className="py-20 px-5"
      style={{ background: '#160D08', borderBottom: '1px solid #3A1D10' }}
    >
      <div className="max-w-md mx-auto">

        <h2 className="font-display text-[2.4rem] leading-none uppercase text-[#FFF4E6] mb-3">
          E não para por aí. Você também recebe 5 bônus práticos
        </h2>
        <p className="text-[11px] text-[#D8A64A] font-bold uppercase tracking-wider mb-10">
          🎁 Bônus práticos inclusos no plano completo
        </p>

        {/* Bonus cards */}
        <div className="space-y-8">
          {bonuses.map((bonus, idx) => (
            <div
              key={idx}
              className="rounded-2xl p-5 relative overflow-hidden"
              style={{ background: '#2A130B', border: '1px solid #5A321C' }}
            >
              {/* Tags row */}
              <div className="flex justify-between items-center mb-4">
                <span className="badge-gold">{bonus.num}</span>
                <span
                  className="text-[10px] font-mono font-black uppercase px-2 py-1 rounded"
                  style={{
                    background: 'rgba(216,166,74,0.1)',
                    border: '1px solid rgba(216,166,74,0.25)',
                    color: '#D8A64A',
                  }}
                >
                  Incluso no Plano Completo
                </span>
              </div>

              {/* Image frame */}
              <div className="mb-4 rounded-xl overflow-hidden" style={{ border: '1.5px solid #5A321C', boxShadow: '0 4px 16px rgba(11,7,4,0.65)' }}>
                <Image
                  src={bonus.img}
                  alt={bonus.alt}
                  width={1000}
                  height={1000}
                  loading="lazy"
                  sizes="(max-width: 640px) 88vw, (max-width: 768px) 85vw, 340px"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>

              {/* Text */}
              <div className="space-y-1.5">
                <h3 className="font-display text-lg text-[#FFF4E6] uppercase leading-tight tracking-wide">
                  {bonus.title}
                </h3>
                <p className="text-xs text-[#D9C3A3] leading-relaxed">
                  {bonus.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
