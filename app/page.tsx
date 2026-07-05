import React from 'react';
import dynamic from 'next/dynamic';
import Hero from '@/components/Hero';

// Lazy load ALL components below the fold with SSR preserved
const ProdutoPorDentro = dynamic(() => import('@/components/ProdutoPorDentro'), { ssr: true });
const Beneficios = dynamic(() => import('@/components/Beneficios'), { ssr: true });
const ProvaSocial = dynamic(() => import('@/components/ProvaSocial'), { ssr: true });
const CTAIntermediario = dynamic(() => import('@/components/CTAIntermediario'), { ssr: true });
const IdealPara = dynamic(() => import('@/components/IdealPara'), { ssr: true });
const OQueRecebe = dynamic(() => import('@/components/OQueRecebe'), { ssr: true });
const Bonus = dynamic(() => import('@/components/Bonus'), { ssr: true });
const Comparativo = dynamic(() => import('@/components/Comparativo'), { ssr: true });
const OfferCountdown = dynamic(() => import('@/components/OfferCountdown'), { ssr: true });
const Oferta = dynamic(() => import('@/components/Oferta'), { ssr: true });
const Garantia = dynamic(() => import('@/components/Garantia'), { ssr: true });
const ComoAcessar = dynamic(() => import('@/components/ComoAcessar'), { ssr: true });
const FAQ = dynamic(() => import('@/components/FAQ'), { ssr: true });
const Rodape = dynamic(() => import('@/components/Rodape'), { ssr: true });

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
