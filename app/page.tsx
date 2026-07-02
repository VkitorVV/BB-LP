import React from 'react';
import Hero from '@/components/Hero';
import ProdutoPorDentro from '@/components/ProdutoPorDentro';
import Beneficios from '@/components/Beneficios';
import ProvaSocial from '@/components/ProvaSocial';
import CTAIntermediario from '@/components/CTAIntermediario';
import IdealPara from '@/components/IdealPara';
import OQueRecebe from '@/components/OQueRecebe';
import Bonus from '@/components/Bonus';
import Comparativo from '@/components/Comparativo';
import Oferta from '@/components/Oferta';
import Garantia from '@/components/Garantia';
import ComoAcessar from '@/components/ComoAcessar';
import FAQ from '@/components/FAQ';
import Rodape from '@/components/Rodape';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0F1115] text-[#F5F5F5] font-sans overflow-x-hidden selection:bg-[#22C55E]/10 selection:text-[#22C55E]">
      {/* Maximum desktop containment with fluid responsive layout scaling for premium mobile-first PV */}
      <div className="w-full max-w-lg mx-auto md:max-w-xl lg:max-w-2xl bg-[#0F1115] shadow-2xl relative border-x border-[#2A2F38]">
        
        {/* 1. Primeira dobra / venda imediata */}
        <Hero />

        {/* 2. Demonstrativo visual do produto */}
        <ProdutoPorDentro />

        {/* 3. Benefícios objetivos */}
        <Beneficios />

        {/* 4. Prova social (Instagram Stories) */}
        <ProvaSocial />

        {/* 5. Urgência + botão */}
        <CTAIntermediario />

        {/* 6. Ideal para você que deseja... */}
        <IdealPara />

        {/* 7. Tudo que você vai receber */}
        <OQueRecebe />

        {/* 8. Bônus */}
        <Bonus />

        {/* 9. Comparativo de solução */}
        <Comparativo />

        {/* 10. Oferta e valores */}
        <Oferta />

        {/* 11. Garantia */}
        <Garantia />

        {/* 12. Como é o acesso */}
        <ComoAcessar />

        {/* 13. FAQ */}
        <FAQ />

        {/* 14. Rodapé */}
        <Rodape />
        
      </div>
    </main>
  );
}
