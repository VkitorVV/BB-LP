'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Garantia() {
  return (
    <section
      id="garantia"
      className="py-20 px-5 texture-brick relative"
      style={{ borderBottom: '1px solid #3A1D10' }}
    >
      <div className="max-w-md mx-auto text-center">

        {/* Shield badge */}
        <div
          className="inline-flex flex-col items-center justify-center p-6 rounded-2xl w-full max-w-[260px] mx-auto mb-8"
          style={{
            background: '#160D08',
            border: '2px solid #5A321C',
            boxShadow: '0 4px 24px rgba(242,138,26,0.08)',
          }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
            style={{ background: 'rgba(242,138,26,0.1)', border: '1px solid rgba(242,138,26,0.3)' }}
          >
            <ShieldCheck size={28} style={{ color: '#F28A1A' }} />
          </div>
          <span className="text-[10px] font-mono font-black text-[#D8A64A] uppercase tracking-widest">
            Compromisso de Satisfação
          </span>
          <span className="font-display text-4xl text-[#FFF4E6] mt-1">15 DIAS</span>
          <span className="text-[10px] font-bold text-[#D9C3A3] uppercase mt-1 tracking-wider">
            DE GARANTIA
          </span>
        </div>

        {/* Divider */}
        <div className="divider-copper w-24 mx-auto mb-6" />

        <h2 className="font-display text-[2.2rem] leading-none uppercase text-[#FFF4E6] mb-4">
          Acesse o material por 15 dias sem compromisso
        </h2>

        <p className="text-xs text-[#D9C3A3] leading-relaxed max-w-sm mx-auto">
          Se dentro de 15 dias o material não fizer sentido para você, pode solicitar reembolso.
        </p>

      </div>
    </section>
  );
}
