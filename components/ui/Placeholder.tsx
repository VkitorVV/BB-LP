'use client';

import React from 'react';

interface PlaceholderProps {
  type: 
    | 'main-kit' 
    | 'mapa' 
    | 'tabela' 
    | 'checklist' 
    | 'erros' 
    | 'referencias' 
    | 'acabamento' 
    | 'story-1' 
    | 'story-2' 
    | 'story-3' 
    | 'story-4' 
    | 'story-5' 
    | 'story-6'
    | 'basic-plan' 
    | 'complete-plan' 
    | 'garantia';
  className?: string;
}

export default function Placeholder({ type, className = '' }: PlaceholderProps) {
  // Determine aspect ratio class based on type
  let aspectClass = 'aspect-[4/3]';
  let roundedClass = 'rounded-xl';

  if (type === 'main-kit') {
    aspectClass = 'aspect-[4/3] md:aspect-video min-h-[240px]';
    roundedClass = 'rounded-2xl';
  } else if (type.startsWith('story-')) {
    aspectClass = 'aspect-[9/16]';
    roundedClass = 'rounded-2xl';
  } else if (type === 'basic-plan' || type === 'complete-plan') {
    aspectClass = 'aspect-[4/3]';
    roundedClass = 'rounded-2xl';
  } else if (type === 'garantia') {
    aspectClass = 'aspect-[2/1]';
    roundedClass = 'rounded-xl';
  }

  const labels: Record<string, string> = {
    'main-kit': '[Mockup principal do kit]',
    'mapa': '[Página interna Método M.A.P.A.]',
    'tabela': '[Tabela de conversão]',
    'checklist': '[Checklist de revisão]',
    'erros': '[Guia de erros comuns]',
    'referencias': '[Imagens de referência]',
    'acabamento': '[Guia de acabamento]',
    'story-1': '[Story prova social 01]',
    'story-2': '[Story prova social 02]',
    'story-3': '[Story prova social 03]',
    'story-4': '[Story prova social 04]',
    'story-5': '[Story prova social 05]',
    'story-6': '[Story prova social 06]',
    'basic-plan': '[Mockup plano básico]',
    'complete-plan': '[Mockup plano completo]',
    'garantia': '[Selo garantia 15 dias]',
  };

  const label = labels[type] || `[${type}]`;

  return (
    <div 
      className={`image-placeholder w-full ${aspectClass} ${roundedClass} bg-[#1B1F27] border border-dashed border-[#2A2F38] transition-all duration-300 relative overflow-hidden group hover:border-[#22C55E]/20 flex items-center justify-center p-4 text-center ${className}`}
      data-placeholder={type}
    >
      <span className="text-[#B8BDC7] text-sm font-mono z-10">{label}</span>
      {/* Dynamic scan line effect to look premium and ready for assets */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2A2F38]/5 to-transparent -translate-y-full animate-[pulse_3s_infinite]" />
    </div>
  );
}
