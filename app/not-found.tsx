import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0F1115] text-[#F5F5F5] font-sans flex flex-col items-center justify-center p-5 selection:bg-[#22C55E]/10 selection:text-[#22C55E]">
      <div className="w-full max-w-md mx-auto text-center space-y-6 border border-[#2A2F38] bg-[#151820] p-8 rounded-2xl shadow-xl">
        <span className="text-[10px] font-mono font-black text-[#D6A94A] bg-[#211808] py-1 px-3 rounded border border-[#D6A94A]/20 uppercase tracking-widest">
          Erro 404
        </span>
        <h1 className="text-3xl font-black text-[#F5F5F5] uppercase font-display tracking-tight leading-tight">
          Página não encontrada
        </h1>
        <p className="text-xs text-[#B8BDC7] leading-relaxed">
          O link que você tentou acessar está incorreto ou a página foi removida. Retorne para a página principal para continuar.
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-block w-full py-3.5 px-6 bg-[#22C55E] text-[#0F1115] text-xs font-black uppercase rounded-xl hover:bg-[#1eb053] active:scale-[0.98] transition-all duration-150 tracking-wider font-display text-center"
          >
            Voltar para o Início
          </Link>
        </div>
      </div>
    </main>
  );
}
