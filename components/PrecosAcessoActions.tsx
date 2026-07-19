'use client';

import Image from 'next/image';
import React from 'react';
import { createPortal } from 'react-dom';
import {
  buildCheckoutUrl,
  getCheckoutMeta,
  getOfferTrackingSection,
  getSessionId,
  getUtmParams,
} from '@/lib/clientTracking';
import {
  CHECKOUT_URLS,
  type CheckoutRedirectType,
  type CheckoutType,
} from '@/lib/trackingConfig';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function trackClick(
  checkoutType: CheckoutType,
  checkoutLabel: string,
  checkoutPrice: number,
  targetUrl: string,
  buttonLocation = 'oferta',
  clickKind = 'checkout',
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
      clickKind,
      currentSectionId: offerSection.id,
      currentSectionTitle: offerSection.title,
      currentSectionOrder: offerSection.order,
      timestamp: Date.now(),
      ...getUtmParams(),
    }),
  }).catch(() => { /* silently ignore */ });
}

function useCheckoutHref(checkoutType: CheckoutRedirectType) {
  const [href, setHref] = React.useState<string>(CHECKOUT_URLS[checkoutType]);

  const refreshHref = React.useCallback(() => {
    const nextHref = buildCheckoutUrl(checkoutType);
    setHref(nextHref);
    return nextHref;
  }, [checkoutType]);

  React.useEffect(() => {
    refreshHref();
    const refreshTimers = [
      window.setTimeout(refreshHref, 80),
      window.setTimeout(refreshHref, 400),
      window.setTimeout(refreshHref, 1200),
    ];
    return () => {
      refreshTimers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [refreshHref]);

  return { href, refreshHref };
}

function trackCheckoutLinkClick(
  checkoutType: CheckoutRedirectType,
  buttonLocation: string,
  targetUrl: string,
) {
  const checkoutMeta = getCheckoutMeta(checkoutType);

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'checkout_click', {
      checkout_type: checkoutType,
      checkout_price: checkoutMeta.price.toFixed(2),
      button_location: buttonLocation,
      transport_type: 'beacon',
    });
  }

  trackClick(checkoutType, checkoutMeta.label, checkoutMeta.price, targetUrl, buttonLocation);
}

export function CompleteCheckoutButton() {
  const { href } = useCheckoutHref('kit_completo');

  return (
    <a
      href={href}
      className="plan-button complete-button"
      onClick={(event) => {
        trackCheckoutLinkClick('kit_completo', 'oferta', event.currentTarget.href);
      }}
      data-checkout-type="kit_completo"
      data-checkout-label="Kit Completo"
      data-checkout-price="29.90"
      data-button-location="oferta"
    >
      QUERO O KIT COMPLETO
    </a>
  );
}

export function BasicUpgradeAction() {
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = React.useState(false);
  const basicButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const modalRef = React.useRef<HTMLDivElement | null>(null);
  const previouslyFocusedRef = React.useRef<HTMLElement | null>(null);
  const hasOpenedUpgradeModalRef = React.useRef(false);
  const basicCheckout = useCheckoutHref('plano_basico');
  const discountedKitCheckout = useCheckoutHref('kit_desconto_popup');

  const closeUpgradeModal = () => {
    setIsUpgradeModalOpen(false);
  };

  const openUpgradeModal = () => {
    hasOpenedUpgradeModalRef.current = true;
    previouslyFocusedRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : basicButtonRef.current;
    basicCheckout.refreshHref();
    discountedKitCheckout.refreshHref();

    const popupMeta = getCheckoutMeta('plano_basico_popup_open');
    trackClick(
      'plano_basico_popup_open',
      popupMeta.label,
      popupMeta.price,
      'popup_upgrade',
      'oferta',
      'popup_open',
    );
    setIsUpgradeModalOpen(true);
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
      <button
        ref={basicButtonRef}
        type="button"
        className="plan-button basic-button"
        onClick={openUpgradeModal}
        data-popup-action="open_upgrade"
        data-button-location="oferta"
      >
        QUERO APENAS O GUIA
      </button>

      {isUpgradeModalOpen && typeof document !== 'undefined' && createPortal(
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
                  <Image
                    src="/images/popup/mockup-upgrade-kit-completo.webp"
                    alt="Mockup do Kit Completo Mapa do Degradê Sem Marca com bônus inclusos"
                    width={1254}
                    height={1254}
                    loading="lazy"
                    sizes="260px"
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
                  <a
                    href={discountedKitCheckout.href}
                    className="upgrade-modal-primary popup-upgrade-button"
                    onClick={(event) => {
                      trackCheckoutLinkClick('kit_desconto_popup', 'popup_upgrade', event.currentTarget.href);
                    }}
                    data-checkout-type="kit_desconto_popup"
                    data-checkout-label="Kit Completo com Desconto"
                    data-checkout-price="24.90"
                    data-button-location="popup_upgrade"
                    data-popup-action="accept_upgrade"
                  >
                    Quero o Kit Completo por R$ 24,90
                  </a>
                  <a
                    href={basicCheckout.href}
                    className="upgrade-modal-secondary popup-basic-button"
                    onClick={(event) => {
                      trackCheckoutLinkClick('plano_basico', 'popup_upgrade', event.currentTarget.href);
                    }}
                    data-checkout-type="plano_basico"
                    data-checkout-label="Plano Básico"
                    data-checkout-price="19.90"
                    data-button-location="popup_upgrade"
                    data-popup-action="decline_upgrade"
                  >
                    Não, quero continuar com o Plano Básico
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
