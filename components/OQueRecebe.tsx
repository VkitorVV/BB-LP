'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Info } from 'lucide-react';
import Placeholder from './ui/Placeholder';

export default function OQueRecebe() {
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

  return (
    <section id="o-que-recebe" className="py-20 px-5 bg-[#0F1115] border-b border-[#2A2F38]">
      <div className="max-w-md mx-auto">
        {/* Título */}
        <h2 className="text-2xl font-black text-[#F5F5F5] text-center font-display tracking-tight leading-tight uppercase">
          Tudo que você vai receber ao acessar o Mapa
        </h2>

        {/* Mockup do Produto Principal - Container Vazio */}
        <div className="mt-8">
          <Placeholder type="basic-plan" className="w-full shadow-md" />
        </div>

        {/* Cabeçalho do Produto */}
        <div className="mt-6 text-center">
          <h3 className="text-base font-extrabold text-[#F5F5F5] uppercase font-display tracking-wider">
            Mapa do Degradê Sem Marca
          </h3>
          <p className="text-xs text-[#B8BDC7] mt-2 leading-relaxed font-sans">
            Um guia visual em PDF para barbeiros iniciantes e intermediários entenderem a lógica de marcação, pentes, alturas, pontos de transição e acabamento do degradê.
          </p>
        </div>

        {/* Lista de Recursos Internos */}
        <div className="mt-8 bg-[#151820] border border-[#2A2F38] rounded-xl p-5 space-y-4">
          <p className="text-[10px] font-mono tracking-widest text-[#D6A94A] uppercase font-extrabold text-center border-b border-[#2A2F38] pb-3">
            CONTEÚDO DETALHADO DO MAPA
          </p>
          
          <div className="space-y-3 pt-1">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs text-[#F5F5F5]">
                <div className="mt-0.5 text-[#22C55E] bg-[#151820] p-0.5 rounded-full border border-[#2A2F38] shrink-0">
                  <Check size={12} className="stroke-[3]" />
                </div>
                <span className="leading-tight font-medium font-sans">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bloco de Reforço de Especificidade (Não é curso completo) */}
        <div className="mt-6 bg-[#2C1919] border border-[#D94141]/10 rounded-xl p-4 flex gap-3">
          <Info className="text-[#D94141] shrink-0 mt-0.5" size={16} />
          <div className="space-y-1">
            <p className="text-[10px] font-black text-[#D94141] uppercase tracking-wider font-display">
              AVISO IMPORTANTE
            </p>
            <p className="text-xs text-red-200 leading-relaxed font-sans font-medium">
              <strong>Não é um curso completo de barbearia.</strong> É um material direto para resolver um problema específico: degradê marcado, transição pesada e acabamento inseguro.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
