'use client';

import React from 'react';
import Image from 'next/image';

const stories = [
  { src: '/images/prova-social/prova-socialfeeds-05.webp' },
  { src: '/images/prova-social/prova-socialstory-04.webp' },
  { src: '/images/prova-social/prova-socialstory-01.webp' },
  { src: '/images/prova-social/prova-socialstory-02.webp' },
  { src: '/images/prova-social/prova-socialstory-03.webp' },
];

export default function ProvaSocial() {
  return (
    <section
      id="prova-social"
      className="py-20 px-5 overflow-hidden"
      style={{ background: '#0B0704', borderBottom: '1px solid #3A1D10' }}
    >
      <div className="max-w-md mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-[4px] rounded-full" style={{ background: '#F28A1A' }} />
          <span className="badge-gold">Prova social</span>
        </div>

        <h2 className="font-display text-[2.4rem] leading-none uppercase text-[#FFF4E6] mb-3">
          Veja o que outros barbeiros falaram sobre o material
        </h2>

        <p className="text-[11px] font-bold text-[#D8A64A] uppercase tracking-wider mb-4">
          ✨ Prints reais de pessoas que acompanharam ou comentaram sobre o conteúdo.
        </p>

        <p className="text-sm text-[#D9C3A3] leading-relaxed mb-10">
          Quem está começando na barbearia geralmente tem a mesma dificuldade: entender onde
          a marca aparece, qual pente usar e como deixar a transição mais limpa. Veja retornos
          recebidos nos stories:
        </p>

        {/* Stories carousel */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory -mx-5 px-5">
          {stories.map((story, idx) => (
            <div 
              key={idx} 
              className="snap-center shrink-0 w-[393px] md:w-[471px] rounded-2xl overflow-hidden"
              style={{ border: '1.5px solid #5A321C', boxShadow: '0 4px 16px rgba(11,7,4,0.7)' }}
            >
              <Image
                src={story.src}
                alt="Print real de story com prova social sobre o Mapa do Degradê Sem Marca"
                width={720}
                height={1280}
                loading="lazy"
                sizes="(max-width: 640px) 85vw, (max-width: 768px) 90vw, 450px"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          ))}
        </div>

        <p className="text-[10px] text-center text-[#C9B89A] font-bold uppercase tracking-widest mt-3">
          ← Deslize para ver os stories →
        </p>

      </div>
    </section>
  );
}
