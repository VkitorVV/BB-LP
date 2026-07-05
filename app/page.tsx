import React from 'react';
import Hero from '@/components/Hero';
import ProdutoPorDentro from '@/components/ProdutoPorDentro';
import Beneficios from '@/components/Beneficios';
import ProvaSocial from '@/components/ProvaSocial';
import CTAIntermediario from '@/components/CTAIntermediario';
import IdealPara from '@/components/IdealPara';
import OQueRecebe from '@/components/OQueRecebe';
import Bonus from '@/components/Bonus';
import OfferCountdown from '@/components/OfferCountdown';
import Comparativo from '@/components/Comparativo';
import Oferta from '@/components/Oferta';
import Garantia from '@/components/Garantia';
import ComoAcessar from '@/components/ComoAcessar';
import FAQ from '@/components/FAQ';
import Rodape from '@/components/Rodape';

export default function Home() {
  return (
    <main
      className="min-h-screen font-sans overflow-x-hidden"
      style={{ background: '#0B0704', color: '#FFF4E6' }}
    >
      <div
        className="w-full max-w-lg mx-auto md:max-w-xl lg:max-w-2xl relative"
        style={{
          background: '#0B0704',
          borderLeft: '1px solid #2A130B',
          borderRight: '1px solid #2A130B',
          boxShadow: '0 0 80px rgba(11,7,4,0.9)',
        }}
      >
        {/* 1. Hero */}
        <Hero />
        {/* 2. Produto por dentro */}
        <ProdutoPorDentro />
        {/* 3. Benefícios */}
        <Beneficios />
        {/* 4. Prova social */}
        <ProvaSocial />
        {/* 5. CTA intermediário */}
        <CTAIntermediario />
        {/* 6. Ideal para */}
        <IdealPara />
        {/* 7. O que recebe */}
        <OQueRecebe />
        {/* 8. Bônus */}
        <Bonus />
        {/* 9. Comparativo */}
        <Comparativo />
        {/* 10. Countdown de oferta */}
        <OfferCountdown />
        {/* 11. Oferta */}
        <Oferta />
        {/* 12. Garantia */}
        <Garantia />
        {/* 13. Como acessar */}
        <ComoAcessar />
        {/* 14. FAQ */}
        <FAQ />
        {/* 15. Rodapé */}
        <Rodape />
      </div>
    </main>
  );
}
