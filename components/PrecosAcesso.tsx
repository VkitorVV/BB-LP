'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const CHECKOUT_BASICO_URL = 'https://pay.wiapy.com/iUoMvXq0sJr-';
const CHECKOUT_KIT_DESCONTO_URL = 'https://pay.wiapy.com/8To4z6HioR';
const CHECKOUT_KIT_COMPLETO_URL = 'https://pay.wiapy.com/MaYsqe4pqwN';

const utmKeys = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'campaign_id',
  'adset_id',
  'ad_id',
  'placement',
  'site_source_name',
] as const;

const basicIncluded = [
  'Guia visual digital',
  'Acesso imediato ao material',
  '7 dias de garantia',
] as const;

const basicExcluded = [
  'Tabela dos Pentes e Alturas',
  'Checklist do Corte Sem Marca',
  'Guia dos 7 Erros que Estragam o Degradê',
  'Pack de Referências Essenciais de Fade',
  'Mini Guia de Acabamento Profissional',
] as const;

const completeIncluded = [
  { label: 'Mapa do Degradê Sem Marca', isBonus: false },
  { label: 'Tabela dos Pentes e Alturas', isBonus: true },
  { label: 'Checklist do Corte Sem Marca', isBonus: true },
  { label: 'Guia dos 7 Erros que Estragam o Degradê', isBonus: true },
  { label: 'Pack de Referências Essenciais de Fade', isBonus: true },
  { label: 'Mini Guia de Acabamento Profissional', isBonus: true },
  { label: 'Acesso vitalício e imediato aos materiais', isBonus: false },
  { label: 'Atualizações futuras', isBonus: false },
  { label: '7 dias de garantia', isBonus: false },
] as const;

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  const KEY = 'mapa_degrade_session_id';
  let id = sessionStorage.getItem(KEY);
  if (!id) {
    id = typeof crypto?.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(KEY, id);
  }
  return id;
}

function getUtms() {
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get('utm_source') || undefined,
    utmMedium: params.get('utm_medium') || undefined,
    utmCampaign: params.get('utm_campaign') || undefined,
    utmContent: params.get('utm_content') || undefined,
    utmTerm: params.get('utm_term') || undefined,
    campaignId: params.get('campaign_id') || undefined,
    adsetId: params.get('adset_id') || undefined,
    adId: params.get('ad_id') || undefined,
    placement: params.get('placement') || undefined,
    siteSourceName: params.get('site_source_name') || undefined,
  };
}

function buildCheckoutUrl(baseUrl: string): string {
  const url = new URL(baseUrl);
  const params = new URLSearchParams(window.location.search);
  const sessionId = getSessionId();

  if (sessionId) {
    url.searchParams.set('session_id', sessionId);
    url.searchParams.set('sid', sessionId);
  }

  utmKeys.forEach((key) => {
    const value = params.get(key);
    if (value && !url.searchParams.has(key)) url.searchParams.set(key, value);
  });

  return url.toString();
}

function trackClick(
  checkoutType: string,
  checkoutLabel: string,
  checkoutPrice: number,
  targetUrl: string,
  buttonLocation = 'precos_acesso',
) {
  fetch('/api/track-click', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    keepalive: true,
    body: JSON.stringify({
      sessionId: getSessionId(),
      checkoutType,
      checkoutLabel,
      checkoutPrice,
      buttonLocation,
      targetUrl,
      timestamp: Date.now(),
      ...getUtms(),
    }),
  }).catch(() => { /* silently ignore */ });
}

export default function PrecosAcesso() {
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = React.useState(false);
  const basicButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const modalRef = React.useRef<HTMLDivElement | null>(null);
  const previouslyFocusedRef = React.useRef<HTMLElement | null>(null);
  const hasOpenedUpgradeModalRef = React.useRef(false);

  React.useEffect(() => {
    const section = document.getElementById('precos-acesso');
    if (!section) return;

    const revealItems = Array.from(section.querySelectorAll<HTMLElement>('[data-price-reveal]'));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' }
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const openCheckout = (
    checkoutType: 'plano_basico' | 'kit_completo' | 'kit_desconto_popup',
    checkoutLabel: string,
    checkoutPrice: number,
    baseUrl: string,
    buttonLocation = 'precos_acesso',
  ) => {
    const checkoutUrl = buildCheckoutUrl(baseUrl);
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'checkout_click', {
        checkout_type: checkoutType,
        checkout_price: checkoutPrice.toFixed(2),
        button_location: buttonLocation,
        transport_type: 'beacon',
      });
    }
    trackClick(checkoutType, checkoutLabel, checkoutPrice, checkoutUrl, buttonLocation);
    window.open(checkoutUrl, '_blank');
  };

  const closeUpgradeModal = () => {
    setIsUpgradeModalOpen(false);
  };

  const openUpgradeModal = () => {
    hasOpenedUpgradeModalRef.current = true;
    previouslyFocusedRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : basicButtonRef.current;

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'checkout_click', {
        checkout_type: 'plano_basico_popup_open',
        checkout_price: '19.90',
        button_location: 'precos_acesso',
        transport_type: 'beacon',
      });
    }
    trackClick(
      'plano_basico_popup_open',
      'Plano Básico - abriu popup',
      19.90,
      'popup_upgrade',
      'precos_acesso',
    );
    setIsUpgradeModalOpen(true);
  };

  const acceptUpgrade = () => {
    setIsUpgradeModalOpen(false);
    openCheckout(
      'kit_desconto_popup',
      'Kit Completo com Desconto',
      24.90,
      CHECKOUT_KIT_DESCONTO_URL,
      'popup_upgrade',
    );
  };

  const declineUpgrade = () => {
    setIsUpgradeModalOpen(false);
    openCheckout(
      'plano_basico',
      'Plano Básico',
      19.90,
      CHECKOUT_BASICO_URL,
      'popup_upgrade',
    );
  };

  React.useEffect(() => {
    if (!isUpgradeModalOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isUpgradeModalOpen]);

  React.useEffect(() => {
    if (!isUpgradeModalOpen) {
      if (hasOpenedUpgradeModalRef.current) {
        previouslyFocusedRef.current?.focus();
      }
      return;
    }

    const getFocusable = () => Array.from(
      modalRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      ) || []
    );

    window.setTimeout(() => {
      getFocusable()[0]?.focus();
    }, 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeUpgradeModal();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = getFocusable();
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isUpgradeModalOpen]);

  return (
    <>
    <section id="precos-acesso" aria-labelledby="precos-acesso-title">
      <style>{`
        #precos-acesso {
          position: relative;
          left: 50%;
          width: 100vw;
          max-width: 100vw;
          transform: translateX(-50%);
          overflow: hidden;
          box-sizing: border-box;
          padding: 78px 16px 90px;
          background: #0F0A06;
          color: #FFF4E6;
          border-bottom: 1px solid #2A130B;
        }
        #precos-acesso *,
        #precos-acesso *::before,
        #precos-acesso *::after {
          box-sizing: border-box;
        }
        #precos-acesso .price-shell {
          width: 100%;
          max-width: 1120px;
          margin: 0 auto;
        }
        #precos-acesso .price-anchor {
          position: absolute;
          top: 0;
          left: 0;
          width: 1px;
          height: 1px;
          pointer-events: none;
          scroll-margin-top: 16px;
        }
        #precos-acesso .price-display {
          font-family: var(--font-display), var(--font-display-family), Impact, sans-serif;
          font-weight: 900;
          letter-spacing: 0;
          line-height: 0.9;
          text-transform: uppercase;
        }
        #precos-acesso .price-title {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
          font-size: clamp(2.5rem, 11vw, 5.8rem);
          color: #FFF4E6;
        }
        #precos-acesso .price-subtitle {
          max-width: 660px;
          margin: 18px auto 42px;
          text-align: center;
          color: #D9C3A3;
          font-size: 0.98rem;
          line-height: 1.45;
          font-weight: 650;
        }
        #precos-acesso .plans-layout {
          display: grid;
          gap: 20px;
          align-items: start;
        }
        #precos-acesso .plan-card {
          position: relative;
          width: 100%;
          border-radius: 8px;
          padding: 24px 18px 20px;
          background: #F7F1E8;
          color: #100F0D;
          border: 1px solid rgba(196, 154, 74, 0.22);
          box-shadow: 0 18px 42px rgba(0, 0, 0, 0.22);
        }
        #precos-acesso .plan-card.complete {
          background: #FFF7E9;
          border: 2px solid #D8A64A;
          box-shadow: 0 22px 58px rgba(216, 166, 74, 0.2);
        }
        #precos-acesso .best-label {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin: 0 0 14px;
          padding: 8px 10px 7px;
          border-radius: 999px;
          background: #D8A64A;
          color: #100F0D;
          font-size: 0.7rem;
          font-weight: 950;
          letter-spacing: 0.08em;
          line-height: 1;
          text-transform: uppercase;
        }
        #precos-acesso .plan-name {
          margin: 0 0 10px;
          color: #100F0D;
          font-size: clamp(2.05rem, 8.6vw, 3.6rem);
        }
        #precos-acesso .plan-support {
          margin: 0 0 20px;
          color: #463B30;
          font-size: 0.95rem;
          line-height: 1.45;
          font-weight: 650;
        }
        #precos-acesso .plan-price {
          margin: 0;
          color: #100F0D;
          font-size: clamp(3rem, 13vw, 5rem);
        }
        #precos-acesso .payment-note {
          margin: 4px 0 20px;
          color: #8B6725;
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        #precos-acesso .plan-list {
          list-style: none;
          margin: 0;
          padding: 18px 0 0;
          border-top: 1px solid rgba(16, 15, 13, 0.12);
        }
        #precos-acesso .plan-list.compact {
          margin-top: 14px;
          padding-top: 14px;
        }
        #precos-acesso .plan-list li {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          margin: 0 0 10px;
          color: #211A14;
          font-size: 0.92rem;
          line-height: 1.25;
          font-weight: 750;
        }
        #precos-acesso .plan-list li.muted {
          color: rgba(61, 55, 48, 0.5);
          font-weight: 650;
          margin-bottom: 8px;
        }
        #precos-acesso .plan-list li.emphasis {
          color: #100F0D;
          font-weight: 900;
        }
        #precos-acesso .item-icon {
          flex: 0 0 auto;
          width: 16px;
          color: #A97818;
          font-weight: 950;
          line-height: 1.2;
        }
        #precos-acesso .bonus-item-icon {
          flex: 0 0 auto;
          width: 17px;
          height: 17px;
          margin-top: -1px;
          color: #A97818;
          stroke-width: 2.8;
        }
        #precos-acesso .muted .item-icon {
          color: rgba(61, 55, 48, 0.5);
        }
        #precos-acesso .plan-button {
          width: 100%;
          min-height: 54px;
          margin-top: 20px;
          border-radius: 7px;
          font-family: var(--font-display), var(--font-display-family), Impact, sans-serif;
          font-size: 1.05rem;
          font-weight: 900;
          letter-spacing: 0;
          line-height: 1;
          text-transform: uppercase;
          cursor: pointer;
          transition: transform 150ms ease, background-color 150ms ease, color 150ms ease, border-color 150ms ease;
        }
        #precos-acesso .plan-button:active {
          transform: scale(0.985);
        }
        #precos-acesso .plan-button:focus-visible {
          outline: 3px solid #FFF4E6;
          outline-offset: 3px;
        }
        #precos-acesso .plan-button.basic-button {
          background: transparent;
          border: 2px solid #100F0D;
          color: #100F0D;
        }
        #precos-acesso .plan-button.basic-button:hover {
          background: #100F0D;
          color: #FFF4E6;
        }
        #precos-acesso .plan-button.complete-button {
          background: #F28A1A;
          border: 2px solid #F28A1A;
          color: #0B0704;
          box-shadow: 0 10px 24px rgba(242, 138, 26, 0.22);
        }
        #precos-acesso .plan-button.complete-button:hover {
          background: #D8A64A;
          border-color: #D8A64A;
        }
        #precos-acesso .upgrade-bridge {
          display: grid;
          justify-items: center;
          gap: 8px;
          margin: 0 auto;
          padding: 4px 0 2px;
          text-align: center;
        }
        #precos-acesso .upgrade-text {
          margin: 0;
          color: #D8A64A;
          font-size: clamp(1.28rem, 5.8vw, 2.1rem);
        }
        #precos-acesso .upgrade-arrow {
          position: relative;
          width: 52px;
          height: 58px;
          display: grid;
          place-items: center;
          pointer-events: none;
          animation: priceArrowBounce 1050ms ease-in-out infinite;
        }
        #precos-acesso .upgrade-arrow::before,
        #precos-acesso .upgrade-arrow::after {
          content: "";
          position: absolute;
          width: 28px;
          height: 28px;
          border-right: 5px solid #D8A64A;
          border-bottom: 5px solid #D8A64A;
          transform: rotate(45deg);
          filter: drop-shadow(0 7px 12px rgba(216, 166, 74, 0.22));
        }
        #precos-acesso .upgrade-arrow::before {
          top: 2px;
          opacity: 0.52;
        }
        #precos-acesso .upgrade-arrow::after {
          top: 22px;
        }
        @keyframes priceArrowBounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(9px);
          }
        }
        #precos-acesso [data-price-reveal] {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 520ms ease, transform 520ms ease;
        }
        #precos-acesso [data-price-reveal].is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        @media (max-width: 374px) {
          #precos-acesso {
            padding-left: 12px;
            padding-right: 12px;
          }
          #precos-acesso .plan-card {
            padding-left: 15px;
            padding-right: 15px;
          }
          #precos-acesso .plan-list li {
            font-size: 0.86rem;
          }
          #precos-acesso .bonus-item-icon {
            width: 16px;
            height: 16px;
          }
        }
        @media (min-width: 860px) {
          #precos-acesso {
            padding: 96px 28px 112px;
          }
          #precos-acesso .price-subtitle {
            margin-bottom: 54px;
            font-size: 1.06rem;
          }
          #precos-acesso .plans-layout {
            grid-template-columns: minmax(0, 1fr) 150px minmax(0, 1.06fr);
            gap: 24px;
            align-items: start;
          }
          #precos-acesso .upgrade-bridge {
            align-self: start;
            padding-top: 108px;
          }
          #precos-acesso .upgrade-arrow {
            width: 68px;
            height: 70px;
          }
          #precos-acesso .upgrade-arrow::before,
          #precos-acesso .upgrade-arrow::after {
            width: 34px;
            height: 34px;
            border-right-width: 6px;
            border-bottom-width: 6px;
          }
          #precos-acesso .plan-card {
            padding: 30px 24px 24px;
          }
          #precos-acesso .plan-card.complete {
            transform: translateY(-10px);
          }
          #precos-acesso .plan-list li {
            font-size: 0.94rem;
          }
        }
        .upgrade-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 120;
          display: grid;
          place-items: center;
          padding: 16px;
          background: rgba(7, 5, 3, 0.78);
          backdrop-filter: blur(5px);
          animation: upgradeOverlayIn 180ms ease both;
        }
        .upgrade-modal {
          position: relative;
          width: min(100%, 960px);
          max-height: min(92vh, 900px);
          overflow-y: auto;
          border-radius: 10px;
          background: #F7F1E8;
          color: #100F0D;
          border: 1px solid rgba(216, 166, 74, 0.42);
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.42);
          animation: upgradeModalIn 220ms ease both;
        }
        .upgrade-modal * {
          box-sizing: border-box;
        }
        .upgrade-modal-close {
          position: sticky;
          top: 10px;
          left: calc(100% - 48px);
          z-index: 2;
          width: 36px;
          height: 36px;
          margin: 10px 10px -46px auto;
          display: grid;
          place-items: center;
          border: 1px solid rgba(16, 15, 13, 0.14);
          border-radius: 999px;
          background: rgba(247, 241, 232, 0.92);
          color: #100F0D;
          font-size: 1.35rem;
          line-height: 1;
          cursor: pointer;
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
        }
        .upgrade-modal-content {
          display: grid;
          gap: 13px;
          padding: 30px 16px 16px;
        }
        .upgrade-modal-label {
          display: inline-flex;
          width: fit-content;
          padding: 7px 10px 6px;
          border-radius: 999px;
          background: rgba(216, 166, 74, 0.18);
          color: #7B5616;
          font-size: 0.68rem;
          font-weight: 950;
          letter-spacing: 0.08em;
          line-height: 1;
          text-transform: uppercase;
        }
        .upgrade-modal-title {
          margin: 0;
          color: #100F0D;
          font-family: var(--font-display), var(--font-display-family), Impact, sans-serif;
          font-size: clamp(1.9rem, 9.7vw, 4.8rem);
          font-weight: 900;
          letter-spacing: 0;
          line-height: 0.9;
          text-transform: uppercase;
        }
        .upgrade-modal-copy {
          margin: 0;
          color: #3B3126;
          font-size: 0.88rem;
          font-weight: 650;
          line-height: 1.45;
        }
        .upgrade-modal-visual {
          width: 100%;
          max-width: 290px;
          margin: 2px auto 0;
          border-radius: 8px;
          background: #FFF7E9;
          box-shadow: 0 18px 42px rgba(16, 15, 13, 0.14);
        }
        .upgrade-modal-visual img {
          display: block;
          width: 100%;
          height: auto;
          border-radius: 8px;
        }
        .upgrade-modal-included {
          margin: 0;
          color: #100F0D;
          font-size: 0.86rem;
          font-weight: 950;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .upgrade-modal-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 6px;
        }
        .upgrade-modal-list li {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          color: #211A14;
          font-size: 0.84rem;
          font-weight: 780;
          line-height: 1.22;
        }
        .upgrade-modal-check {
          flex: 0 0 auto;
          color: #A97818;
          font-weight: 950;
        }
        .upgrade-modal-pricebox {
          display: grid;
          gap: 5px;
          padding-top: 14px;
          border-top: 1px solid rgba(16, 15, 13, 0.12);
        }
        .upgrade-modal-old-price {
          color: rgba(69, 56, 43, 0.62);
          font-size: 0.83rem;
          font-weight: 850;
          text-decoration: line-through;
        }
        .upgrade-modal-price-row {
          display: flex;
          align-items: baseline;
          gap: 9px;
          flex-wrap: wrap;
        }
        .upgrade-modal-price-prefix {
          color: #7B5616;
          font-size: 0.9rem;
          font-weight: 900;
          text-transform: uppercase;
        }
        .upgrade-modal-price {
          color: #F28A1A;
          font-family: var(--font-display), var(--font-display-family), Impact, sans-serif;
          font-size: clamp(3rem, 14vw, 5rem);
          font-weight: 900;
          letter-spacing: 0;
          line-height: 0.9;
        }
        .upgrade-modal-anchor {
          margin: 2px 0 0;
          color: #3B3126;
          font-size: 0.9rem;
          font-weight: 850;
          line-height: 1.35;
        }
        .upgrade-modal-actions {
          display: grid;
          gap: 10px;
          margin-top: 2px;
        }
        .upgrade-modal-primary,
        .upgrade-modal-secondary {
          width: 100%;
          min-height: 52px;
          border-radius: 7px;
          font-family: var(--font-display), var(--font-display-family), Impact, sans-serif;
          font-size: 1rem;
          font-weight: 900;
          letter-spacing: 0;
          line-height: 1;
          text-transform: uppercase;
          cursor: pointer;
          transition: transform 150ms ease, background-color 150ms ease, border-color 150ms ease;
        }
        .upgrade-modal-primary:active,
        .upgrade-modal-secondary:active {
          transform: scale(0.985);
        }
        .upgrade-modal-primary:focus-visible,
        .upgrade-modal-secondary:focus-visible,
        .upgrade-modal-close:focus-visible {
          outline: 3px solid #D8A64A;
          outline-offset: 3px;
        }
        .upgrade-modal-primary {
          border: 2px solid #F28A1A;
          background: #F28A1A;
          color: #0B0704;
          box-shadow: 0 12px 24px rgba(242, 138, 26, 0.2);
        }
        .upgrade-modal-secondary {
          border: 2px solid rgba(16, 15, 13, 0.24);
          background: transparent;
          color: #100F0D;
          font-size: 0.9rem;
        }
        @keyframes upgradeOverlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes upgradeModalIn {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @media (min-width: 820px) {
          .upgrade-modal-content {
            grid-template-columns: minmax(0, 0.92fr) minmax(340px, 1fr);
            align-items: center;
            gap: 26px;
            padding: 44px 34px 34px;
          }
          .upgrade-modal-left,
          .upgrade-modal-right {
            min-width: 0;
          }
          .upgrade-modal-left {
            display: grid;
            gap: 15px;
          }
          .upgrade-modal-right {
            display: grid;
            gap: 14px;
          }
          .upgrade-modal-visual {
            margin: 0 auto;
            max-width: 420px;
          }
          .upgrade-modal-copy {
            font-size: 0.95rem;
          }
          .upgrade-modal-list {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            column-gap: 14px;
          }
        }
        @media (max-width: 374px) {
          .upgrade-modal-overlay {
            padding: 10px;
          }
          .upgrade-modal-content {
            padding-left: 14px;
            padding-right: 14px;
          }
          .upgrade-modal-list li {
            font-size: 0.84rem;
          }
          .upgrade-modal-primary,
          .upgrade-modal-secondary {
            font-size: 0.86rem;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          #precos-acesso [data-price-reveal] {
            opacity: 1;
            transform: none;
            transition: none;
          }
          #precos-acesso .upgrade-arrow {
            animation: none;
          }
          .upgrade-modal-overlay,
          .upgrade-modal {
            animation: none;
          }
        }
      `}</style>

      <span id="planos" className="price-anchor" aria-hidden="true" />
      <div className="price-shell">
        <h2 id="precos-acesso-title" className="price-display price-title">
          ESCOLHA COMO VOCÊ QUER COMEÇAR:
        </h2>
        <p className="price-subtitle">
          Leve apenas o guia principal ou, por R$ 10 a mais, receba também os 5 bônus exclusivos.
        </p>

        <div className="plans-layout">
          <article className="plan-card basic" data-price-reveal>
            <h3 className="price-display plan-name">MAPA DO DEGRADÊ SEM MARCA</h3>
            <p className="plan-support">Para quem quer começar apenas pelo guia principal.</p>

            <p className="price-display plan-price">R$ 19,90</p>
            <p className="payment-note">Pagamento único</p>

            <ul className="plan-list" aria-label="Itens inclusos no Mapa do Degradê Sem Marca">
              {basicIncluded.map((item) => (
                <li key={item}>
                  <span className="item-icon" aria-hidden="true">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <ul className="plan-list compact" aria-label="Bônus não inclusos no Mapa do Degradê Sem Marca">
              {basicExcluded.map((item) => (
                <li className="muted" key={item}>
                  <span className="item-icon" aria-hidden="true">×</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <button
              ref={basicButtonRef}
              type="button"
              className="plan-button basic-button"
              onClick={openUpgradeModal}
            >
              QUERO APENAS O GUIA
            </button>
          </article>

          <div className="upgrade-bridge" data-price-reveal aria-label="Por apenas R$ 10 a mais">
            <p className="price-display upgrade-text">POR APENAS R$ 10 A MAIS</p>
            <span className="upgrade-arrow" aria-hidden="true" />
          </div>

          <article className="plan-card complete" data-price-reveal>
            <div className="best-label">MELHOR CUSTO-BENEFÍCIO</div>
            <h3 className="price-display plan-name">KIT COMPLETO</h3>
            <p className="plan-support">
              Leve o guia principal e todos os 5 bônus para consultar, revisar e treinar seu olhar durante os próximos cortes.
            </p>

            <p className="price-display plan-price">R$ 29,90</p>
            <p className="payment-note">Pagamento único</p>

            <ul className="plan-list" aria-label="Itens inclusos no Kit Completo">
              {completeIncluded.map((item, index) => (
                <li className={index >= 6 ? 'emphasis' : undefined} key={item.label}>
                  {item.isBonus ? (
                    <Sparkles className="bonus-item-icon" aria-hidden="true" />
                  ) : (
                    <span className="item-icon" aria-hidden="true">✓</span>
                  )}
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="plan-button complete-button"
              onClick={() => openCheckout('kit_completo', 'Kit Completo', 29.90, CHECKOUT_KIT_COMPLETO_URL)}
            >
              QUERO O KIT COMPLETO
            </button>
          </article>
        </div>
      </div>
    </section>
    {isUpgradeModalOpen && (
      <div
        className="upgrade-modal-overlay"
        role="presentation"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeUpgradeModal();
        }}
      >
        <div
          ref={modalRef}
          className="upgrade-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="upgrade-modal-title"
          aria-describedby="upgrade-modal-description"
        >
          <button
            type="button"
            className="upgrade-modal-close"
            aria-label="Fechar popup de upgrade"
            onClick={closeUpgradeModal}
          >
            ×
          </button>

          <div className="upgrade-modal-content">
            <div className="upgrade-modal-left">
              <span className="upgrade-modal-label">Oferta especial</span>
              <h2 id="upgrade-modal-title" className="upgrade-modal-title">
                Espere um segundo...
              </h2>
              <p id="upgrade-modal-description" className="upgrade-modal-copy">
                Antes de continuar com o Plano Básico, você pode liberar o Kit Completo com desconto especial.
              </p>
              <p className="upgrade-modal-copy">
                Em vez de levar apenas o guia principal, você recebe o guia completo + todos os bônus por um valor menor que o preço normal do Kit Completo.
              </p>

              <figure className="upgrade-modal-visual">
                <img
                  src="/images/popup/mockup-upgrade-kit-completo.webp"
                  alt="Mockup do Kit Completo Mapa do Degradê Sem Marca com bônus inclusos"
                  loading="eager"
                />
              </figure>
            </div>

            <div className="upgrade-modal-right">
              <p className="upgrade-modal-included">✓ Tudo incluso nesta oferta:</p>
              <ul className="upgrade-modal-list">
                {[
                  'Guia Digital Mapa do Degradê',
                  'Tabela dos Pentes e Alturas',
                  'Checklist do Corte Sem Marca',
                  'Guia dos 7 Erros Comuns',
                  'Pack de Referências de Fade',
                  'Mini Guia de Acabamento',
                  'Atualizações futuras',
                  'Acesso vitalício',
                  '7 dias de garantia',
                ].map((item) => (
                  <li key={item}>
                    <span className="upgrade-modal-check" aria-hidden="true">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="upgrade-modal-pricebox">
                <span className="upgrade-modal-old-price">De R$ 29,90</span>
                <div className="upgrade-modal-price-row">
                  <span className="upgrade-modal-price-prefix">Por</span>
                  <strong className="upgrade-modal-price">R$ 24,90</strong>
                </div>
                <p className="upgrade-modal-anchor">
                  Por apenas R$5,00 a mais que o Plano Básico, você leva o Kit Completo.
                </p>
              </div>

              <div className="upgrade-modal-actions">
                <button type="button" className="upgrade-modal-primary" onClick={acceptUpgrade}>
                  Quero o Kit Completo por R$ 24,90
                </button>
                <button type="button" className="upgrade-modal-secondary" onClick={declineUpgrade}>
                  Não, quero continuar com o Plano Básico
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
