'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Placeholder from './ui/Placeholder';

export default function ProdutoPorDentro() {
  const pages = [
    { type: 'mapa' as const, label: 'Página interna: Método M.A.P.A. do Degradê Limpo' },
    { type: 'tabela' as const, label: 'Página interna: Tabela Prática de Pentes e Alturas' },
    { type: 'checklist' as const, label: 'Página interna: Checklist do Corte Sem Marca' },
    { type: 'erros' as const, label: 'Página interna: Correção de Marcas e Erros Críticos' }
  ];

  return (
    <section id="produto-por-dentro" className="py-20 px-5 bg-[#151820] border-b border-[#2A2F38]">
      <div className="max-w-md mx-auto">
        {/* Título */}
        <h2 className="text-2xl font-black text-[#F5F5F5] text-center font-display tracking-tight leading-tight uppercase">
          Veja por dentro um dos materiais que você vai receber
        </h2>
        
        {/* Texto descritivo */}
        <p className="text-sm text-[#B8BDC7] text-center mt-4 leading-relaxed font-sans">
          O Mapa do Degradê Sem Marca foi criado para ser visual, direto e fácil de consultar. Em vez de estudar um conteúdo longo e solto, você acessa páginas organizadas para entender a lógica do degradê, dos pentes, das alturas e dos pontos de transição.
        </p>

        {/* Imagens / Placeholders das Páginas Internas */}
        <div className="mt-10 space-y-8">
          {pages.map((page, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.3, ease: 'easeOut', delay: idx * 0.05 }}
              className="space-y-3"
            >
              <Placeholder type={page.type} className="w-full shadow-md" />
              <p className="text-[11px] text-center text-[#B8BDC7]/50 italic font-medium">{page.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Legenda curta abaixo */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="mt-10 bg-[#1B1F27] py-4 px-4 rounded-xl border border-[#2A2F38] text-center"
        >
          <p className="text-xs font-bold text-[#F5F5F5] uppercase font-display tracking-wide">
            📱 Material digital, visual e organizado para consultar pelo celular, computador ou tablet.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
