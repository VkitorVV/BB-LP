'use client';

import React from 'react';
import Image from 'next/image';

const row1Images = [
  { src: '/images/material-por-dentro/pagina-06-transicao-limpa-pesada.webp', alt: 'Página interna mostrando transição limpa e transição pesada' },
  { src: '/images/material-por-dentro/pagina-12-diagnostico-marca.webp',      alt: 'Página interna com diagnóstico rápido da marca no degradê' },
  { src: '/images/material-por-dentro/pagina-25-mapa-pentes.webp',            alt: 'Página interna com mapa visual dos pentes mais usados' },
  { src: '/images/material-por-dentro/pagina-27-metodo-mapa.webp',            alt: 'Página interna mostrando a visão geral do Método M.A.P.A.' },
];

const row2Images = [
  { src: '/images/material-por-dentro/pagina-19-alavanca-maquina.webp',  alt: 'Página interna sobre alavanca aberta meio ajuste e fechada' },
  { src: '/images/material-por-dentro/pagina-36-mapa-final-metodo.webp', alt: 'Página interna com mapa final do Método M.A.P.A.' },
  { src: '/images/material-por-dentro/pagina-71-correcao-visual.webp',   alt: 'Página interna com correção visual em três passos' },
  { src: '/images/material-por-dentro/pagina-72-revisao-correcao.webp',  alt: 'Página interna com revisão da correção antes de finalizar' },
];

const row1Loop = [...row1Images, ...row1Images];
const row2Loop = [...row2Images, ...row2Images];

function MarqueeRow({ images, direction }: { images: typeof row1Loop; direction: 'left' | 'right' }) {
  const animationKeyframes = direction === 'left' 
    ? `@keyframes scrollLeft { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`
    : `@keyframes scrollRight { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }`;
  
  const animationName = direction === 'left' ? 'scrollLeft' : 'scrollRight';
  const duration = direction === 'left' ? '35s' : '40s';

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: animationKeyframes }} />
      <div style={{
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
        maskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
      }}>
        <div style={{
          display: 'flex',
          gap: '16px',
          padding: '10px 0',
          width: 'max-content',
          willChange: 'transform',
          animation: `${animationName} ${duration} linear infinite`,
        }}>
          {images.map((img, idx) => (
            <div key={idx} style={{
              flexShrink: 0,
              width: 'clamp(220px, 64vw, 320px)',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1.5px solid #5A321C',
              boxShadow: '0 6px 20px rgba(11,7,4,0.75)',
            }}>
              <Image
                src={img.src}
                alt={img.alt}
                width={900}
                height={1200}
                loading="lazy"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 45vw, 280px"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function ProdutoPorDentro() {
  return (
    <section
      id="produto-por-dentro"
      className="py-20 relative overflow-hidden"
      style={{ background: '#0B0704', borderBottom: '1px solid #3A1D10' }}
    >
      {/* Text block */}
      <div className="px-5 max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-[4px] rounded-full" style={{ background: '#F28A1A' }} />
          <span className="badge-copper">Material por dentro</span>
        </div>

        <h2 className="font-display text-[2.4rem] leading-none uppercase text-[#FFF4E6] mb-4">
          Veja por dentro o material que você vai receber
        </h2>

        <p className="text-sm text-[#D9C3A3] leading-relaxed mb-10">
          O Mapa do Degradê Sem Marca foi criado para ser visual, direto e fácil de consultar.
          Páginas organizadas para entender a lógica do degradê, dos pentes, das alturas e dos
          pontos de transição.
        </p>
      </div>

      {/* Row 1 — scroll left */}
      <div className="mb-3">
        <MarqueeRow images={row1Loop} direction="left" />
      </div>

      {/* Row 2 — scroll right */}
      <div className="mt-3">
        <MarqueeRow images={row2Loop} direction="right" />
      </div>

      {/* Footer note */}
      <div className="px-5 max-w-md mx-auto">
        <div
          className="mt-10 rounded-xl py-4 px-5 text-center"
          style={{ background: '#160D08', border: '1px solid #3A1D10' }}
        >
          <p className="text-xs font-bold text-[#D9C3A3] uppercase tracking-wide font-display">
            📱 Material digital — consulte pelo celular, computador ou tablet.
          </p>
        </div>
      </div>
    </section>
  );
}
