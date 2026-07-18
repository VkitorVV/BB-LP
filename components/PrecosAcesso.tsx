'use client';

import React from 'react';
import { Gift } from 'lucide-react';
import {
  buildCheckoutUrl,
  getCheckoutMeta,
  getOfferTrackingSection,
  getSessionId,
  getUtmParams,
} from '@/lib/clientTracking';
import type { CheckoutRedirectType, CheckoutType } from '@/lib/trackingConfig';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const basicIncluded = [
  'Mapa do Degradê Sem Marca',
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
  { label: 'Acesso vitalício', isBonus: false },
  { label: 'Acesso imediato', isBonus: false },
  { label: 'Atualizações futuras', isBonus: false },
  { label: '7 dias de garantia', isBonus: false },
] as const;

function trackClick(
  checkoutType: CheckoutType,
  checkoutLabel: string,
  checkoutPrice: number,
  targetUrl: string,
  buttonLocation = 'oferta',
) {
  const offerSection = getOfferTrackingSection();

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
      currentSectionId: offerSection.id,
      currentSectionTitle: offerSection.title,
      currentSectionOrder: offerSection.order,
      timestamp: Date.now(),
      ...getUtmParams(),
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
    checkoutType: CheckoutRedirectType,
    buttonLocation = 'oferta',
  ) => {
    const checkoutUrl = buildCheckoutUrl(checkoutType);
    const checkoutMeta = getCheckoutMeta(checkoutType);

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'checkout_click', {
        checkout_type: checkoutType,
        checkout_price: checkoutMeta.price.toFixed(2),
        button_location: buttonLocation,
        transport_type: 'beacon',
      });
    }
    trackClick(checkoutType, checkoutMeta.label, checkoutMeta.price, checkoutUrl, buttonLocation);
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
        button_location: 'oferta',
        transport_type: 'beacon',
      });
    }
    const popupMeta = getCheckoutMeta('plano_basico_popup_open');
    trackClick(
      'plano_basico_popup_open',
      popupMeta.label,
      popupMeta.price,
      'popup_upgrade',
      'oferta',
    );
    setIsUpgradeModalOpen(true);
  };

  const acceptUpgrade = () => {
    setIsUpgradeModalOpen(false);
    openCheckout('kit_desconto_popup', 'popup_upgrade');
  };

  const declineUpgrade = () => {
    setIsUpgradeModalOpen(false);
    openCheckout('plano_basico', 'popup_upgrade');
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
    <section
      id="precos-acesso"
      aria-labelledby="precos-acesso-title"
      data-track-section="precos-acesso"
      data-track-order="11"
      data-track-title="11 - PRECOS / PLANOS"
    >
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
          background: var(--color-espresso);
          color: var(--color-paper);
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
          color: var(--color-paper);
        }
        #precos-acesso .price-subtitle {
          max-width: 660px;
          margin: 18px auto 42px;
          text-align: center;
          color: var(--color-paper-alt);
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
          background: var(--color-paper);
          color: var(--color-ink);
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-card);
          text-align: center;
        }
        #precos-acesso .plan-card.complete {
          background: #FFF7E9;
          border: 2px solid var(--color-gold);
          box-shadow: 0 14px 40px rgba(11, 7, 4, 0.08);
        }
        #precos-acesso .best-label {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin: 0 0 14px;
          padding: 8px 10px 7px;
          border-radius: 8px;
          background: var(--color-gold);
          color: var(--color-ink);
          font-size: 0.7rem;
          font-weight: 950;
          letter-spacing: 0.08em;
          line-height: 1;
          text-transform: uppercase;
        }
        #precos-acesso .plan-name {
          margin: 0 0 10px;
          color: var(--color-ink);
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
          color: var(--color-ink);
          font-size: clamp(3rem, 13vw, 5rem);
        }
        #precos-acesso .old-price-anchor {
          margin: 6px 0 2px;
          color: #7C6A58;
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        #precos-acesso .old-price-anchor span {
          color: var(--color-alert);
          text-decoration: line-through;
          text-decoration-thickness: 2px;
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
          justify-content: flex-start !important;
          gap: 9px;
          margin: 0 0 10px;
          color: #211A14;
          font-size: 0.92rem;
          line-height: 1.25;
          font-weight: 750;
          text-align: left !important;
        }
        #precos-acesso .plan-list li.muted {
          color: rgba(61, 55, 48, 0.5);
          font-weight: 650;
          margin-bottom: 8px;
        }
        #precos-acesso .plan-list li.muted span:last-child {
          text-decoration: line-through;
          text-decoration-thickness: 1.5px;
        }
        #precos-acesso .plan-list li.emphasis {
          color: var(--color-ink);
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
          color: var(--color-alert);
        }
        #precos-acesso .bonus-divider {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 10px;
          margin: 18px 0 12px;
          color: #8B6725;
          font-size: 0.72rem;
          font-weight: 950;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        #precos-acesso .bonus-divider::before,
        #precos-acesso .bonus-divider::after {
          content: "";
          height: 1px;
          background: rgba(139, 103, 37, 0.32);
        }
        #precos-acesso .plan-list.bonus-list,
        #precos-acesso .plan-list.advantage-list {
          padding-top: 0;
          border-top: 0;
        }
        #precos-acesso .bonus-list li {
          color: var(--color-ink);
          font-weight: 900;
        }
        #precos-acesso .plan-button {
          width: 100%;
          min-height: 54px;
          margin-top: 20px;
          border-radius: 7px;
          font-family: var(--font-sans), var(--font-sans-family);
          font-size: 0.9rem;
          font-weight: 900;
          letter-spacing: 0.04em;
          line-height: 1;
          text-transform: uppercase;
          cursor: pointer;
          transition: transform 150ms ease, background-color 150ms ease, color 150ms ease, border-color 150ms ease;
        }
        #precos-acesso .plan-button:active {
          transform: scale(0.985);
        }
        #precos-acesso .plan-button:focus-visible {
          outline: 3px solid var(--color-paper);
          outline-offset: 3px;
        }
        #precos-acesso .plan-button.basic-button {
          background: transparent;
          border: 2px solid var(--color-ink);
          color: var(--color-ink);
        }
        #precos-acesso .plan-button.basic-button:hover {
          background: var(--color-ink);
          color: var(--color-paper);
        }
        #precos-acesso .plan-button.complete-button {
          background: var(--color-gold);
          border: 2px solid var(--color-gold);
          color: #0B0704;
          box-shadow: none;
        }
        #precos-acesso .plan-button.complete-button:hover {
          background: #E2B45B;
          border-color: #E2B45B;
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
          color: var(--color-gold);
          font-size: clamp(1.28rem, 5.8vw, 2.1rem);
        }
        #precos-acesso .upgrade-arrow {
          position: relative;
          width: 72px;
          height: 86px;
          display: block;
          background: var(--color-gold);
          -webkit-mask: url('/images/seta-animação/seta-verde-animação.svg') center / contain no-repeat;
          mask: url('/images/seta-animação/seta-verde-animação.svg') center / contain no-repeat;
          pointer-events: none;
          animation: priceArrowBounce 920ms ease-in-out infinite;
        }
        @keyframes priceArrowBounce {
          0%, 100% {
            opacity: 0.78;
            transform: translateY(-2px) scale(0.98);
          }
          50% {
            opacity: 1;
            transform: translateY(13px) scale(1.04);
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
            width: 82px;
            height: 96px;
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
          background: var(--color-paper);
          color: var(--color-ink);
          border: 1px solid var(--color-border);
          box-shadow: 0 14px 40px rgba(11, 7, 4, 0.18);
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
          border-radius: 8px;
          background: rgba(247, 241, 232, 0.92);
          color: var(--color-ink);
          font-size: 1.35rem;
          line-height: 1;
          cursor: pointer;
          box-shadow: none;
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
          border-radius: 8px;
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
          color: var(--color-ink);
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
          box-shadow: var(--shadow-card);
        }
        .upgrade-modal-visual img {
          display: block;
          width: 100%;
          height: auto;
          border-radius: 8px;
        }
        .upgrade-modal-included {
          margin: 0;
          color: var(--color-ink);
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
          color: var(--color-gold);
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
        .upgrade-modal-payment-note {
          margin: -2px 0 2px;
          color: #7B5616;
          font-size: 0.72rem;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
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
          font-family: var(--font-sans), var(--font-sans-family);
          font-size: 0.88rem;
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
          outline: 3px solid var(--color-gold);
          outline-offset: 3px;
        }
        .upgrade-modal-primary {
          border: 2px solid var(--color-gold);
          background: var(--color-gold);
          color: #0B0704;
          box-shadow: none;
        }
        .upgrade-modal-primary:hover {
          border-color: #E2B45B;
          background: #E2B45B;
        }
        .upgrade-modal-secondary {
          border: 2px solid rgba(16, 15, 13, 0.24);
          background: transparent;
          color: var(--color-ink);
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

            <p className="old-price-anchor">De <span>R$ 59,90</span> por:</p>
            <p className="price-display plan-price">R$ 19,90</p>
            <p className="payment-note">no pix ou cartão</p>

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
              data-checkout-type="plano_basico_popup_open"
              data-checkout-label="Plano Básico - abriu popup"
              data-checkout-price="19.90"
              data-button-location="oferta"
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

            <p className="old-price-anchor">De <span>R$ 119,90</span> por:</p>
            <p className="price-display plan-price">R$ 29,90</p>
            <p className="payment-note">no pix ou cartão</p>

            <ul className="plan-list" aria-label="Item principal incluso no Kit Completo">
              {completeIncluded.filter((item) => !item.isBonus).slice(0, 1).map((item) => (
                <li key={item.label}>
                  <span className="item-icon" aria-hidden="true">✓</span>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>

            <div className="bonus-divider">INCLUSO TAMBÉM</div>
            <ul className="plan-list bonus-list" aria-label="Bônus inclusos no Kit Completo">
              {completeIncluded.filter((item) => item.isBonus).map((item) => (
                <li key={item.label}>
                  <Gift className="bonus-item-icon" aria-hidden="true" />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>

            <div className="bonus-divider">VANTAGENS DO ACESSO</div>
            <ul className="plan-list advantage-list" aria-label="Vantagens do acesso ao Kit Completo">
              {completeIncluded.filter((item) => !item.isBonus).slice(1).map((item) => (
                <li className="emphasis" key={item.label}>
                  <span className="item-icon" aria-hidden="true">✓</span>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="plan-button complete-button"
              onClick={() => openCheckout('kit_completo', 'oferta')}
              data-checkout-type="kit_completo"
              data-checkout-label="Kit Completo"
              data-checkout-price="29.90"
              data-button-location="oferta"
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
                <p className="upgrade-modal-payment-note">no pix ou cartão</p>
                <p className="upgrade-modal-anchor">
                  Por apenas R$5,00 a mais que o Plano Básico, você leva o Kit Completo.
                </p>
              </div>

              <div className="upgrade-modal-actions">
                <button
                  type="button"
                  className="upgrade-modal-primary"
                  onClick={acceptUpgrade}
                  data-checkout-type="kit_desconto_popup"
                  data-checkout-label="Kit Completo com Desconto"
                  data-checkout-price="24.90"
                  data-button-location="popup_upgrade"
                  data-popup-action="accept_upgrade"
                >
                  Quero o Kit Completo por R$ 24,90
                </button>
                <button
                  type="button"
                  className="upgrade-modal-secondary"
                  onClick={declineUpgrade}
                  data-checkout-type="plano_basico"
                  data-checkout-label="Plano Básico"
                  data-checkout-price="19.90"
                  data-button-location="popup_upgrade"
                  data-popup-action="decline_upgrade"
                >
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
