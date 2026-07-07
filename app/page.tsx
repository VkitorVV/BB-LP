import React from 'react';
import dynamic from 'next/dynamic';
import Hero from '@/components/Hero';

// Trackers — client-only (ssr:false), não bloqueiam SSR nem LCP
const SectionTracker  = dynamic(() => import('@/components/SectionTracker'),  { ssr: false });
const PresenceTracker = dynamic(() => import('@/components/PresenceTracker'), { ssr: false });

// Below-the-fold — code-split, SSR mantido para SEO
const ProdutoPorDentro = dynamic(() => import('@/components/ProdutoPorDentro'), { ssr: true });
const Beneficios       = dynamic(() => import('@/components/Beneficios'),       { ssr: true });
const ProvaSocial      = dynamic(() => import('@/components/ProvaSocial'),      { ssr: true });
const CTAIntermediario = dynamic(() => import('@/components/CTAIntermediario'), { ssr: true });
const IdealPara        = dynamic(() => import('@/components/IdealPara'),        { ssr: true });
const OQueRecebe       = dynamic(() => import('@/components/OQueRecebe'),       { ssr: true });
const Bonus            = dynamic(() => import('@/components/Bonus'),            { ssr: true });
const Comparativo      = dynamic(() => import('@/components/Comparativo'),      { ssr: true });
const OfferCountdown   = dynamic(() => import('@/components/OfferCountdown'),   { ssr: true });
const Oferta           = dynamic(() => import('@/components/Oferta'),           { ssr: true });
const Garantia         = dynamic(() => import('@/components/Garantia'),         { ssr: true });
const ComoAcessar      = dynamic(() => import('@/components/ComoAcessar'),      { ssr: true });
const FAQ              = dynamic(() => import('@/components/FAQ'),              { ssr: true });
const Rodape           = dynamic(() => import('@/components/Rodape'),           { ssr: true });

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
        {/* Trackers client-only — não entram no SSR nem bloqueiam LCP */}
        <SectionTracker />
        <PresenceTracker />

        {/* 1. Hero — import estático, renderiza sem esperar JS */}
        <Hero />

        {/* 2–15. Below the fold — code-split */}
        <ProdutoPorDentro />
        <Beneficios />
        <ProvaSocial />
        <CTAIntermediario />
        <IdealPara />
        <OQueRecebe />
        <Bonus />
        <Comparativo />
        <OfferCountdown />
        <Oferta />
        <Garantia />
        <ComoAcessar />
        <FAQ />
        <Rodape />
      </div>
    </main>
  );
}
