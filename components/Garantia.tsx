'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export default function Garantia() {
  return (
    <section id="garantia" className="py-20 px-5 bg-[#0F1115] border-b border-[#2A2F38]">
      <div className="max-w-md mx-auto text-center">
        
        {/* Selo Simples em CSS (Garantia de 15 Dias) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="inline-flex flex-col items-center justify-center p-6 bg-[#1B1F27] border border-[#2A2F38] rounded-2xl w-full max-w-[280px] mx-auto mb-8 shadow-sm"
        >
          <div className="w-12 h-12 bg-[#22C55E]/5 border border-[#22C55E]/20 rounded-full flex items-center justify-center text-[#22C55E] mb-3">
            <ShieldCheck size={24} />
          </div>
          <span className="text-[10px] font-mono font-black text-[#D6A94A] uppercase tracking-widest">
            Compromisso de Satisfação
          </span>
          <span className="text-3xl font-black text-[#F5F5F5] font-display mt-1">15 DIAS</span>
          <span className="text-[10px] font-bold text-[#B8BDC7] uppercase mt-0.5 tracking-wider">
            GARANTIA TOTAL
          </span>
        </motion.div>

        {/* Título de Garantia */}
        <h2 className="text-xl font-black text-[#F5F5F5] font-display uppercase tracking-tight leading-tight mb-4">
          Acesse o material por 15 dias sem compromisso
        </h2>

        {/* Texto de Garantia */}
        <p className="text-xs md:text-sm text-[#B8BDC7] leading-relaxed font-sans max-w-sm mx-auto">
          Queremos que você consulte o material e aplique nos seus treinos com tranquilidade. Se dentro de 15 dias você entender que as explicações, checklists e esquemas visuais não ajudaram a clarear o seu degradê, você pode solicitar o reembolso total de forma simples.
        </p>
      </div>
    </section>
  );
}
