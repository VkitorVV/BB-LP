'use client';

import React from 'react';
import { Check } from 'lucide-react';
import Image from 'next/image';

const items = [
  'Por que o degradê fica marcado.',
  'Como identificar uma transição pesada.',
  'A lógica dos pentes e alturas.',
  'O Método M.A.P.A. do Degradê Limpo.',
  'Sequência base para low fade.',
  'Sequência base para mid fade.',
  'Sequência base para high fade.',
  'Como corrigir marcas sem subir demais o corte.',
  'Acabamento de nuca, pezinho e laterais.',
  'Rotina simples para treinar seu olhar visual.',
];

export default function OQueRecebe() {
  return (
    <section
      id="o-que-recebe"
      className="py-20 px-5 texture-brick relative"
      style={{ borderBottom: '1px solid #3A1D10' }}
    >
      <div className="max-w-md mx-auto">

        <h2 className="font-display text-[2.4rem] leading-none uppercase text-[#FFF4E6] mb-8">
          Tudo que você vai receber ao acessar o Mapa
        </h2>

        {/* Main mockup */}
        <div className="rounded-2xl overflow-hidden" style={{ border: '1.5px solid #5A321C', boxShadow: '0 8px 28px rgba(11,7,4,0.85)' }}>
          <Image
            src="/images/tudo-que-recebe/mockup-tudo-que-recebe-guia-principal.webp"
            alt="Mockup com capa e páginas internas do guia Mapa do Degradê Sem Marca"
            width={1600}
            height={1200}
            loading="lazy"
            sizes="(max-width: 640px) 92vw, (max-width: 768px) 88vw, 580px"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>

        {/* Product name */}
        <div className="mt-6 text-center">
          <h3 className="font-display text-xl text-[#FFF4E6] uppercase tracking-wider">
            Mapa do Degradê Sem Marca
          </h3>
          <p className="text-xs text-[#D9C3A3] mt-2 leading-relaxed">
            Um guia visual em Ebook para barbeiros iniciantes e intermediários entenderem a lógica
            de marcação, pentes, alturas, pontos de transição e acabamento do degradê.
          </p>
        </div>

        {/* Content list */}
        <div
          className="mt-8 rounded-xl p-5 space-y-4"
          style={{ background: '#160D08', border: '1px solid #3A1D10' }}
        >
          <p
            className="text-[10px] font-display tracking-widest text-[#D8A64A] uppercase font-extrabold text-center pb-3"
            style={{ borderBottom: '1px solid #3A1D10' }}
          >
            CONTEÚDO DETALHADO DO MAPA
          </p>

          <div className="space-y-3 pt-1">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs text-[#FFF4E6]">
                <div
                  className="mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(242,138,26,0.12)', border: '1px solid rgba(242,138,26,0.3)' }}
                >
                  <Check size={11} style={{ color: '#F28A1A' }} strokeWidth={3} />
                </div>
                <span className="leading-tight font-medium text-[#D9C3A3]">{item}</span>
              </div>
            ))}
          </div>
        </div>



      </div>
    </section>
  );
}
