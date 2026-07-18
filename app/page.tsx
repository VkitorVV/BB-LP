import React from 'react';
import dynamic from 'next/dynamic';
import Hero from '@/components/Hero';
import MarcaNaoAparece from '@/components/MarcaNaoAparece';
import ClientTrackers from '@/components/ClientTrackers';
import OfertaLimitadaTimer from '@/components/OfertaLimitadaTimer';
import VisualRedesignStyles from '@/components/VisualRedesignStyles';

// Below-the-fold: code-split, SSR mantido para SEO
const ProdutoPorDentro = dynamic(() => import('@/components/ProdutoPorDentro'), { ssr: true });
const CTAMaterialPorDentro = dynamic(() => import('@/components/CTAMaterialPorDentro'), { ssr: true });
const MapaVai = dynamic(() => import('@/components/MapaVai'), { ssr: true });
const CarrosselCortes = dynamic(() => import('@/components/CarrosselCortes'), { ssr: true });
const TudoQueRecebe = dynamic(() => import('@/components/TudoQueRecebe'), { ssr: true });
const PrecosAcesso = dynamic(() => import('@/components/PrecosAcesso'), { ssr: true });
const ProvaSocial = dynamic(() => import('@/components/ProvaSocial'), { ssr: true });
const Garantia = dynamic(() => import('@/components/Garantia'), { ssr: true });
const FAQ = dynamic(() => import('@/components/FAQ'), { ssr: true });
const CTAFinal = dynamic(() => import('@/components/CTAFinal'), { ssr: true });
const Rodape = dynamic(() => import('@/components/Rodape'), { ssr: true });

export default function Home() {
  return (
    <main
      className="min-h-screen font-sans overflow-x-hidden"
      style={{ background: 'var(--color-espresso)', color: 'var(--color-paper)' }}
    >
      <div
        className="w-full max-w-lg mx-auto md:max-w-xl lg:max-w-2xl relative"
        style={{
          background: '#0B0704',
          borderLeft: '1px solid rgba(216, 201, 182, 0.14)',
          borderRight: '1px solid rgba(216, 201, 182, 0.14)',
        }}
      >
        {/* Trackers client-only: não entram no SSR nem bloqueiam LCP */}
        <VisualRedesignStyles />
        <ClientTrackers />

        {/* 1. Hero: import estático, renderiza sem esperar JS */}
        <Hero />
        <MarcaNaoAparece />

        {/* 2-12. Below the fold: code-split */}
        <ProdutoPorDentro />
        <CTAMaterialPorDentro />
        <MapaVai />
        <CarrosselCortes />
        <TudoQueRecebe />
        <OfertaLimitadaTimer />
        <PrecosAcesso />
        <ProvaSocial />
        <Garantia />
        <FAQ />
        <CTAFinal />
        <Rodape />
      </div>
    </main>
  );
}
