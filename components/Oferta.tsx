'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Flame, X } from 'lucide-react';
import Image from 'next/image';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const CHECKOUT_BASICO_URL      = 'https://pay.wiapy.com/iUoMvXq0sJr-';
const CHECKOUT_KIT_DESCONTO_URL = 'https://pay.wiapy.com/8To4z6HioR';
const CHECKOUT_KIT_COMPLETO_URL = 'https://pay.wiapy.com/MaYsqe4pqwN';

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  const KEY = 'mapa_degrade_session_id';
  let id = sessionStorage.getItem(KEY);
  if (!id) { id = crypto.randomUUID(); sessionStorage.setItem(KEY, id); }
  return id;
}

function getUtms() {
  const p = new URLSearchParams(window.location.search);
  return {
    utmSource:   p.get('utm_source')   || undefined,
    utmMedium:   p.get('utm_medium')   || undefined,
    utmCampaign: p.get('utm_campaign') || undefined,
    utmContent:  p.get('utm_content')  || undefined,
    utmTerm:     p.get('utm_term')     || undefined,
  };
}

function trackClick(checkoutType: string, buttonLocation: string) {
  fetch('/api/track-click', {
    method:    'POST',
    headers:   { 'Content-Type': 'application/json' },
    keepalive: true,
    body: JSON.stringify({
      sessionId: getSessionId(),
      checkoutType,
      buttonLocation,
      timestamp: Date.now(),
      ...getUtms(),
    }),
  }).catch(() => { /* silently ignore */ });
}

export default function Oferta() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleCheckoutBasic = () => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'basic_offer_click', {
        checkout_type:   'plano_basico',
        checkout_price:  '19.90',
        button_location: 'oferta',
        transport_type:  'beacon',
      });
    }
    trackClick('plano_basico_popup_open', 'oferta');
    setShowUpgradeModal(true);
  };

  const handleUpgradeToKit = () => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'checkout_click', {
        checkout_type:   'kit_desconto_popup',
        checkout_price:  '24.90',
        button_location: 'popup_upgrade',
        transport_type:  'beacon',
      });
    }
    trackClick('kit_desconto_popup', 'popup_upgrade');
    window.open(CHECKOUT_KIT_DESCONTO_URL, '_blank');
    setShowUpgradeModal(false);
  };

  const handleContinueBasic = () => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'checkout_click', {
        checkout_type:   'plano_basico',
        checkout_price:  '19.90',
        button_location: 'popup_upgrade',
        transport_type:  'beacon',
      });
    }
    trackClick('plano_basico', 'popup_upgrade');
    window.open(CHECKOUT_BASICO_URL, '_blank');
    setShowUpgradeModal(false);
  };

  const handleCheckoutComplete = () => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'checkout_click', {
        checkout_type:   'kit_completo',
        checkout_price:  '29.90',
        button_location: 'oferta',
        transport_type:  'beacon',
      });
    }
    trackClick('kit_completo', 'oferta');
    window.open(CHECKOUT_KIT_COMPLETO_URL, '_blank');
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showUpgradeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showUpgradeModal]);

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowUpgradeModal(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <section
      id="oferta"
      className="py-20 px-5"
      style={{ background: '#160D08', borderBottom: '1px solid #3A1D10' }}
    >
      <div className="max-w-md mx-auto">

        <h2 className="font-display text-[2.4rem] leading-none uppercase text-[#FFF4E6] mb-3">
          Escolha o seu plano de acesso ao material
        </h2>
        <p className="text-xs text-[#D9C3A3] mb-10 leading-relaxed">
          Acesso imediato e digital. Escolha o formato ideal para você consultar no seu dia a dia.
        </p>

        <div className="space-y-8">

          {/* BASIC PLAN */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="rounded-2xl p-6 flex flex-col"
            style={{ background: '#2A130B', border: '1px solid #5A321C' }}
          >
            <div>
              <span className="badge-copper mb-3 inline-block">Apenas o Guia</span>
              <h3 className="font-display text-2xl text-[#FFF4E6] uppercase tracking-wide mb-2">
                Plano Básico
              </h3>
              <p className="text-xs text-[#D9C3A3] mb-5 leading-relaxed">
                Acesso exclusivo ao Guia Principal Mapa do Degradê em formato digital (Ebook).
              </p>

              <div className="mb-5 rounded-xl overflow-hidden" style={{ border: '1.5px solid #5A321C', boxShadow: '0 4px 16px rgba(11,7,4,0.65)' }}>
                <Image
                  src="/images/oferta/mockup-plano-basico.webp"
                  alt="Mockup do Plano Básico com o guia principal Mapa do Degradê Sem Marca"
                  width={1000}
                  height={1000}
                  loading="lazy"
                  sizes="(max-width: 640px) 80vw, (max-width: 768px) 75vw, 300px"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>

              <div className="space-y-2 pt-4" style={{ borderTop: '1px solid rgba(90,50,28,0.5)' }}>
                <div className="flex items-center gap-2.5 text-xs text-[#D9C3A3]">
                  <Check size={12} style={{ color: '#F28A1A' }} />
                  <span className="font-medium">Guia Digital Mapa do Degradê (Ebook)</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#D9C3A3]">
                  <Check size={12} style={{ color: '#F28A1A' }} />
                  <span className="font-medium">15 dias de garantia</span>
                </div>
                {['Tabela dos Pentes e Alturas', 'Checklist do Corte Sem Marca', 'Os 7 Erros Comuns', 'Pack de Referências de Fade', 'Mini Guia de Acabamento'].map(item => (
                  <div key={item} className="flex items-center gap-2.5 text-xs text-[#B8A688] line-through">
                    <span className="text-[10px] font-mono shrink-0">✕</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4" style={{ borderTop: '1px solid rgba(90,50,28,0.5)' }}>
              <p className="text-[10px] text-[#B8A688] font-bold uppercase tracking-wider line-through">
                De R$ 37,00
              </p>
              <div className="flex items-baseline gap-1 mt-0.5 mb-5">
                <span className="text-xs font-mono text-[#FFF4E6] font-black">Por apenas</span>
                <span className="font-display text-3xl text-[#FFF4E6]">R$ 19,90</span>
                <span className="text-[10px] text-[#C9B89A] font-bold">à vista</span>
              </div>
              <button
                onClick={handleCheckoutBasic}
                className="w-full py-3.5 text-xs font-black uppercase rounded-lg tracking-wider transition-all duration-150 active:scale-[0.98] cursor-pointer font-display"
                style={{
                  background: 'transparent',
                  border: '2px solid #F28A1A',
                  color: '#F28A1A',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(242,138,26,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                Quero o Plano Básico
              </button>
            </div>
          </motion.div>

          {/* COMPLETE PLAN */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: 0.1 }}
            className="rounded-2xl p-6 flex flex-col relative"
            style={{
              background: '#1A0F04',
              border: '2px solid #F28A1A',
              boxShadow: '0 8px 40px rgba(242,138,26,0.12)',
            }}
          >
            {/* Badge */}
            <div
              className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[9px] font-extrabold px-4 py-1 rounded-full uppercase tracking-wider font-display flex items-center gap-1"
              style={{ background: '#F28A1A', color: '#0B0704' }}
            >
              <Flame size={10} className="fill-current" />
              Recomendado e mais vantajoso
            </div>

            <div className="pt-2">
              <span className="badge-gold mb-3 inline-block">O Kit Completo + 5 Bônus</span>
              <h3 className="font-display text-2xl text-[#FFF4E6] uppercase tracking-wide mb-2">
                Kit Completo
              </h3>
              <p className="text-xs text-[#D9C3A3] mb-5 leading-relaxed">
                O acesso completo ao guia principal mais 5 materiais digitais de consulta.
              </p>

              <div className="mb-5 rounded-xl overflow-hidden" style={{ border: '2px solid #F28A1A', boxShadow: '0 6px 24px rgba(242,138,26,0.18)' }}>
                <Image
                  src="/images/oferta/mockup-kit-completo.webp"
                  alt="Mockup do Kit Completo com guia principal e cinco bônus"
                  width={1400}
                  height={1400}
                  loading="lazy"
                  sizes="(max-width: 640px) 92vw, (max-width: 768px) 88vw, 460px"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>

              <div className="space-y-2.5 pt-4" style={{ borderTop: '1px solid rgba(242,138,26,0.2)' }}>
                <p className="text-[9px] font-display tracking-wider text-[#D8A64A] font-extrabold uppercase mb-2">
                  ✓ Tudo incluso neste plano:
                </p>
                {[
                  'Guia Digital Mapa do Degradê (Ebook)',
                  '🎁 Bônus 1: Tabela dos Pentes e Alturas',
                  '🎁 Bônus 2: Checklist do Corte Sem Marca',
                  '🎁 Bônus 3: Guia dos 7 Erros Comuns',
                  '🎁 Bônus 4: Pack de Referências de Fade',
                  '🎁 Bônus 5: Mini Guia de Acabamento',
                  'Atualizações futuras',
                  'Acesso vitalício',
                  '15 dias de garantia',
                ].map(item => (
                  <div key={item} className="flex items-center gap-2.5 text-xs text-[#FFF4E6]">
                    <Check size={12} style={{ color: '#F28A1A' }} />
                    <span className="font-bold">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4" style={{ borderTop: '1px solid rgba(242,138,26,0.2)' }}>
              <p className="text-[10px] text-[#B8A688] font-bold uppercase tracking-wider line-through">
                De R$ 67,00
              </p>
              <div className="flex items-baseline gap-1 mt-0.5 mb-2">
                <span className="text-xs font-mono text-[#F28A1A] font-black">Por apenas</span>
                <span className="font-display text-3xl text-[#F28A1A]">R$ 29,90</span>
                <span className="text-[10px] text-[#C9B89A] font-bold">à vista</span>
              </div>
              <p className="text-[11px] text-[#D8A64A] font-bold mb-5 leading-relaxed">
                Por apenas R$10,00 a mais que o Plano Básico, você leva o guia principal e todos os 5 bônus.
              </p>
              <button
                onClick={handleCheckoutComplete}
                className="w-full py-4 text-sm font-black uppercase rounded-lg tracking-wider transition-all duration-150 active:scale-[0.98] cursor-pointer font-display flex items-center justify-center gap-1"
                style={{ background: '#F28A1A', color: '#0B0704' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#D87512')}
                onMouseLeave={e => (e.currentTarget.style.background = '#F28A1A')}
              >
                Quero o Kit Completo + Bônus
              </button>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Upgrade Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-5"
              style={{ background: 'rgba(11,7,4,0.92)' }}
              onClick={() => setShowUpgradeModal(false)}
            >
              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-6"
                style={{
                  background: '#1A0F04',
                  border: '2px solid #F28A1A',
                  boxShadow: '0 12px 48px rgba(242,138,26,0.24)',
                }}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="upgrade-modal-title"
              >
                {/* Close button */}
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                  style={{ background: 'rgba(242,138,26,0.1)', color: '#F28A1A' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(242,138,26,0.2)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(242,138,26,0.1)')}
                  aria-label="Fechar modal"
                >
                  <X size={18} />
                </button>

                {/* Content */}
                <div className="pr-6">
                  <div
                    className="inline-flex items-center gap-1 text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider font-display mb-4"
                    style={{ background: '#F28A1A', color: '#0B0704' }}
                  >
                    <Flame size={10} className="fill-current" />
                    Oferta especial
                  </div>

                  <h2
                    id="upgrade-modal-title"
                    className="font-display text-[2rem] leading-none uppercase text-[#FFF4E6] mb-3"
                  >
                    Espere um segundo...
                  </h2>

                  <p className="text-sm font-bold text-[#F28A1A] mb-4 leading-relaxed">
                    Antes de continuar com o Plano Básico, você pode liberar o Kit Completo com desconto especial.
                  </p>

                  <p className="text-xs text-[#D9C3A3] mb-5 leading-relaxed">
                    Em vez de levar apenas o guia principal, você recebe o guia completo + todos os bônus por um valor menor que o preço normal do Kit Completo.
                  </p>

                  {/* Imagem do Kit Completo */}
                  <div className="mb-6 flex justify-center">
                    <Image
                      src="/images/popup/mockup-upgrade-kit-completo.webp"
                      alt="Mockup do Kit Completo Mapa do Degradê Sem Marca com bônus inclusos"
                      width={1000}
                      height={1000}
                      loading="lazy"
                      sizes="(max-width: 640px) 60vw, (max-width: 768px) 70vw, 320px"
                      className="w-full max-w-[240px] md:max-w-[340px] h-auto rounded-xl"
                      style={{ border: '1.5px solid #5A321C', boxShadow: '0 4px 20px rgba(11,7,4,0.6)' }}
                    />
                  </div>

                  {/* Lista de itens */}
                  <div
                    className="rounded-xl p-4 mb-5 space-y-2"
                    style={{ background: '#2A130B', border: '1px solid #5A321C' }}
                  >
                    <p className="text-[9px] font-display tracking-wider text-[#D8A64A] font-extrabold uppercase mb-3">
                      ✓ Tudo incluso nesta oferta:
                    </p>
                    {[
                      'Guia Digital Mapa do Degradê',
                      'Tabela dos Pentes e Alturas',
                      'Checklist do Corte Sem Marca',
                      'Guia dos 7 Erros Comuns',
                      'Pack de Referências de Fade',
                      'Mini Guia de Acabamento',
                      'Atualizações futuras',
                      'Acesso vitalício',
                      '15 dias de garantia',
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2.5 text-xs text-[#FFF4E6]">
                        <Check size={11} style={{ color: '#F28A1A' }} strokeWidth={3} />
                        <span className="font-medium">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Preço */}
                  <div
                    className="rounded-xl p-4 mb-4 text-center"
                    style={{ background: 'rgba(242,138,26,0.08)', border: '1px solid rgba(242,138,26,0.3)' }}
                  >
                    <p className="text-[10px] text-[#B8A688] font-bold uppercase tracking-wider line-through">
                      De R$ 29,90
                    </p>
                    <div className="flex items-baseline justify-center gap-1 mt-1 mb-2">
                      <span className="text-xs font-mono text-[#F28A1A] font-black">Por</span>
                      <span className="font-display text-4xl text-[#F28A1A]">R$ 24,90</span>
                    </div>
                    <p className="text-[11px] text-[#D8A64A] font-bold leading-relaxed">
                      Por apenas R$5,00 a mais que o Plano Básico, você leva o Kit Completo.
                    </p>
                  </div>

                  {/* Botão principal */}
                  <button
                    onClick={handleUpgradeToKit}
                    className="w-full py-4 text-sm font-black uppercase rounded-lg tracking-wider transition-all duration-150 active:scale-[0.98] cursor-pointer font-display mb-3"
                    style={{ background: '#F28A1A', color: '#0B0704' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#D87512')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#F28A1A')}
                  >
                    Quero o Kit Completo por R$ 24,90
                  </button>

                  {/* Botão secundário */}
                  <button
                    onClick={handleContinueBasic}
                    className="w-full py-3 text-xs font-bold uppercase rounded-lg tracking-wider transition-all duration-150 cursor-pointer"
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(217,195,163,0.3)',
                      color: '#D9C3A3',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(217,195,163,0.05)';
                      e.currentTarget.style.borderColor = 'rgba(217,195,163,0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = 'rgba(217,195,163,0.3)';
                    }}
                  >
                    Não, quero continuar com o Plano Básico
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
