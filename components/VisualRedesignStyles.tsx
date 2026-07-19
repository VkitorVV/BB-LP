export default function VisualRedesignStyles() {
  return (
    <style>{`
      [data-reveal],
      [data-map-reveal],
      [data-price-reveal],
      [data-recebe-reveal] {
        opacity: 1 !important;
        transform: none !important;
      }

      :root {
        --color-clarity: #315B46;
        --color-clarity-soft: #E5ECE4;
        --color-cta: #246B45;
        --color-cta-hover: #2E8054;
        --color-cta-text: #F7F1E8;
        --color-technical-line: rgba(17, 16, 14, 0.16);
      }

      #hero,
      #cta-final {
        background: var(--color-espresso) !important;
        color: var(--color-paper) !important;
      }
      #hero .hero-bg {
        background: var(--color-espresso) !important;
      }
      #hero .hero-tag {
        background: rgba(247, 241, 232, 0.08) !important;
        border-color: rgba(247, 241, 232, 0.2) !important;
        color: var(--color-paper-alt) !important;
      }
      #hero .hero-title,
      #hero .hero-title-line,
      #hero .hero-underline-text {
        color: var(--color-paper) !important;
      }
      #hero .hero-title-alert,
      #cta-final .cta-final-title-alert {
        color: var(--color-alert) !important;
      }
      #hero .hero-underline {
        background: rgba(179, 58, 46, 0.62) !important;
      }
      #hero .hero-tension {
        color: rgba(247, 241, 232, 0.74) !important;
        font-weight: 500 !important;
        font-size: clamp(1rem, 4vw, 1.1rem) !important;
        line-height: 1.62 !important;
      }
      #hero .hero-callout span {
        padding: 0.38em 0.52em 0.32em !important;
        border: 1px solid rgba(11, 7, 4, 0.16) !important;
        background: rgba(247, 241, 232, 0.72) !important;
        color: var(--color-ink) !important;
        font-family: var(--font-sans), var(--font-sans-family) !important;
        font-size: clamp(0.58rem, 2.2vw, 0.74rem) !important;
        line-height: 1.05 !important;
        font-weight: 900 !important;
        letter-spacing: 0.14em !important;
        text-shadow: none !important;
      }
      #hero .hero-reveal,
      #hero .hero-product-copy,
      #hero .hero-cta-wrap {
        position: relative !important;
        z-index: 2 !important;
      }
      #hero .hero-reveal {
        max-width: none !important;
        margin: 34px -20px 0 !important;
        padding: 36px 20px 30px !important;
        background: var(--color-paper) !important;
        color: var(--color-ink) !important;
        border-top: 1px solid var(--color-border) !important;
        border-bottom: 1px solid var(--color-border) !important;
      }
      #hero .hero-reveal-strong {
        color: var(--color-ink) !important;
        font-size: clamp(2rem, 8.5vw, 3.35rem) !important;
      }
      #hero .hero-reveal-copy {
        color: var(--color-clarity) !important;
        font-family: var(--font-sans), var(--font-sans-family) !important;
        font-size: clamp(1rem, 4vw, 1.1rem) !important;
        font-weight: 650 !important;
        text-transform: none !important;
      }
      #hero .hero-product-copy {
        color: rgba(247, 241, 232, 0.78) !important;
        font-weight: 500 !important;
      }
      #hero .hero-trust {
        display: flex !important;
        flex-wrap: wrap !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 7px 9px !important;
        max-width: 360px !important;
        color: rgba(247, 241, 232, 0.58) !important;
        letter-spacing: 0.06em !important;
      }
      #hero .hero-trust-item {
        display: inline-flex !important;
        align-items: center !important;
        gap: 5px !important;
      }
      #hero .hero-trust-icon {
        display: inline-grid !important;
        place-items: center !important;
        width: 17px !important;
        height: 17px !important;
        border: 1px solid rgba(247, 241, 232, 0.28) !important;
        color: var(--color-paper) !important;
        font-size: 0.62rem !important;
        line-height: 1 !important;
      }

      #hero .hero-cta,
      #cta-material-por-dentro .cta-button,
      #precos-acesso .plan-button,
      .upgrade-modal-primary,
      #cta-final .cta-final-button {
        background: var(--color-cta) !important;
        border-color: var(--color-cta) !important;
        color: var(--color-cta-text) !important;
        box-shadow: none !important;
      }
      #hero .hero-cta:hover,
      #cta-material-por-dentro .cta-button:hover,
      #precos-acesso .plan-button:hover,
      .upgrade-modal-primary:hover,
      #cta-final .cta-final-button:hover {
        background: var(--color-cta-hover) !important;
        border-color: var(--color-cta-hover) !important;
        color: var(--color-cta-text) !important;
      }

      #marca-nao-aparece {
        background: #140D08 !important;
        color: var(--color-paper) !important;
      }
      #marca-nao-aparece .marca-opening,
      #marca-nao-aparece .marca-nao,
      #marca-nao-aparece .marca-nada,
      #marca-nao-aparece .marca-copy-strong,
      #marca-nao-aparece .marca-cause,
      #marca-nao-aparece .marca-easy {
        color: var(--color-paper) !important;
      }
      #marca-nao-aparece .marca-nada-alert {
        background: var(--color-alert) !important;
        color: var(--color-paper) !important;
      }
      #marca-nao-aparece .marca-cause {
        font-family: var(--font-sans), var(--font-sans-family) !important;
        text-transform: none !important;
        letter-spacing: 0 !important;
      }
      #marca-nao-aparece .marca-cause:nth-child(4),
      #marca-nao-aparece .marca-cause:nth-child(5),
      #marca-nao-aparece .marca-cause:nth-child(6) {
        font-weight: 850 !important;
      }
      #marca-nao-aparece .marca-cause:nth-child(6) {
        color: #F1B0A8 !important;
        font-size: clamp(1.35rem, 5.2vw, 2.1rem) !important;
      }
      #marca-nao-aparece .marca-easy-highlight {
        background: var(--color-clarity) !important;
        color: var(--color-paper) !important;
      }
      #marca-nao-aparece .marca-arrow {
        filter: invert(34%) sepia(24%) saturate(743%) hue-rotate(91deg) brightness(91%) contrast(88%) !important;
      }

      #material-por-dentro {
        background: #F8F4EC !important;
      }
      #material-por-dentro .method-map-block {
        display: grid !important;
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        gap: 10px !important;
        width: min(100%, 620px) !important;
        margin: 30px auto 0 !important;
      }
      #material-por-dentro .method-map-item {
        border: 1px solid var(--color-border) !important;
        background: var(--color-clarity-soft) !important;
        padding: 12px 10px !important;
        text-align: center !important;
      }
      #material-por-dentro .method-map-letter {
        display: block !important;
        color: var(--color-clarity) !important;
        font-family: var(--font-display), var(--font-display-family) !important;
        font-size: 2.6rem !important;
        line-height: 0.86 !important;
      }
      #material-por-dentro .method-map-label {
        display: block !important;
        margin-top: 7px !important;
        color: #2D3B31 !important;
        font-size: 0.74rem !important;
        line-height: 1.12 !important;
        font-weight: 850 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.04em !important;
      }
      #material-por-dentro .inside-underline,
      #material-por-dentro .inside-moderate {
        border-color: var(--color-clarity) !important;
      }
      #material-por-dentro .inside-hint {
        color: var(--color-clarity) !important;
      }
      #material-por-dentro .inside-close-small,
      #material-por-dentro .inside-close-logic,
      #material-por-dentro .inside-close-next {
        line-height: 1.02 !important;
      }

      #cta-material-por-dentro {
        padding-top: 28px !important;
        padding-bottom: 34px !important;
      }
      #cta-material-por-dentro .cta-shell {
        background: #100C08 !important;
      }
      #cta-material-por-dentro .cta-safe {
        display: inline-flex !important;
        align-items: center !important;
        gap: 7px !important;
        border: 1px solid rgba(247, 241, 232, 0.16) !important;
        border-radius: 999px !important;
        padding: 7px 10px !important;
      }

      #com-o-mapa-voce-vai .map-path {
        display: grid !important;
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        gap: 10px !important;
        margin-top: 38px !important;
        padding: 0 !important;
      }
      #com-o-mapa-voce-vai .map-path::before,
      #com-o-mapa-voce-vai .map-row::before,
      #com-o-mapa-voce-vai .map-row::after {
        content: none !important;
      }
      #com-o-mapa-voce-vai .map-row {
        display: contents !important;
      }
      #com-o-mapa-voce-vai .map-card {
        min-height: 132px !important;
        display: grid !important;
        align-content: start !important;
        gap: 12px !important;
        background: #10100E !important;
        border: 1px solid rgba(49, 91, 70, 0.32) !important;
        padding: 14px !important;
      }
      #com-o-mapa-voce-vai .map-number {
        position: static !important;
        display: block !important;
        color: #7DB592 !important;
        font-family: var(--font-display), var(--font-display-family) !important;
        font-size: clamp(2.1rem, 8vw, 3.3rem) !important;
        letter-spacing: 0 !important;
      }
      #com-o-mapa-voce-vai .map-text {
        font-family: var(--font-sans), var(--font-sans-family) !important;
        font-size: clamp(0.78rem, 3.1vw, 0.98rem) !important;
        line-height: 1.22 !important;
        font-weight: 750 !important;
        text-transform: none !important;
      }

      #carrossel-cortes .cuts-subtitle,
      #prova-social .social-subtitle {
        max-width: 520px !important;
        font-size: 0.92rem !important;
        line-height: 1.48 !important;
        font-weight: 500 !important;
      }
      #carrossel-cortes .cuts-copy {
        margin-bottom: 24px !important;
      }
      #carrossel-cortes .cut-frame {
        flex-basis: min(92vw, 700px) !important;
      }

      #veja-tudo-que-recebe .value-mark,
      #veja-tudo-que-recebe .bonus-badge {
        border-color: rgba(49, 91, 70, 0.28) !important;
        background: var(--color-clarity-soft) !important;
        color: var(--color-clarity) !important;
      }
      #veja-tudo-que-recebe .bonus-badge-icon {
        color: var(--color-clarity) !important;
      }
      #veja-tudo-que-recebe .main-product {
        padding: 22px 16px 28px !important;
        border: 1px solid var(--color-border) !important;
        background: rgba(255, 255, 255, 0.34) !important;
        box-shadow: var(--shadow-card) !important;
      }

      #precos-acesso .plan-card.complete {
        border-color: var(--color-cta) !important;
        box-shadow: 0 14px 40px rgba(11, 7, 4, 0.16) !important;
      }
      #precos-acesso .best-label,
      #precos-acesso .upgrade-text {
        background: var(--color-clarity-soft) !important;
        color: var(--color-clarity) !important;
        border: 1px solid rgba(49, 91, 70, 0.24) !important;
      }
      #precos-acesso .upgrade-text {
        padding: 8px 10px 7px !important;
        border-radius: 999px !important;
      }
      #precos-acesso .plan-card.complete .plan-price {
        color: var(--color-cta) !important;
        font-size: clamp(3.4rem, 15vw, 5.8rem) !important;
      }
      #precos-acesso .bonus-item-icon,
      #precos-acesso .item-icon,
      .upgrade-modal-check {
        color: var(--color-clarity) !important;
      }
      #precos-acesso .plan-list.compact .muted .item-icon {
        color: var(--color-alert) !important;
      }
      .upgrade-modal-secondary {
        min-height: 40px !important;
        border: 0 !important;
        background: transparent !important;
        color: #51473C !important;
        text-decoration: underline !important;
        text-transform: none !important;
        font-size: 0.9rem !important;
      }

      #prova-social {
        background: var(--color-paper) !important;
      }
      #prova-social .social-frame {
        width: min(92vw, 540px) !important;
        margin: 0 auto !important;
      }
      #prova-social .social-print {
        max-height: min(78vh, 760px) !important;
        object-fit: contain !important;
      }
      #prova-social .social-count,
      #prova-social .social-hint {
        color: #4D4237 !important;
        font-size: 0.76rem !important;
        letter-spacing: 0.08em !important;
        text-transform: uppercase !important;
      }

      #garantia {
        background: var(--color-paper-alt) !important;
        color: var(--color-ink) !important;
        border-top-color: rgba(17, 16, 14, 0.08) !important;
        border-bottom-color: rgba(17, 16, 14, 0.08) !important;
      }
      #garantia .guarantee-title-main {
        color: #8A5F16 !important;
      }
      #garantia .guarantee-title-rest,
      #garantia .guarantee-close {
        color: var(--color-ink) !important;
      }
      #garantia .guarantee-copy {
        color: #46545A !important;
        font-weight: 500 !important;
      }
      #garantia .guarantee-close span {
        color: #35566B !important;
        font-style: italic !important;
      }

      #faq .faq-question {
        font-weight: 750 !important;
      }
      #faq .faq-answer-inner {
        color: var(--color-muted) !important;
        font-weight: 450 !important;
      }
      #faq .faq-item:nth-child(6),
      #faq .faq-item:nth-child(9) {
        margin-top: 18px !important;
        border-top: 1px solid rgba(17, 16, 14, 0.22) !important;
      }
      #faq .faq-icon {
        transition: transform 180ms ease !important;
      }

      #cta-final .cta-final-line {
        background: var(--color-alert) !important;
      }
      #cta-final .cta-final-title .cta-final-title-line {
        color: var(--color-paper) !important;
      }
      #cta-final .cta-final-title .cta-final-title-alert {
        color: var(--color-gold) !important;
      }
      #cta-final .cta-final-button {
        min-height: 64px !important;
        max-width: 470px !important;
      }

      #rodape {
        background: #090604 !important;
      }
      #rodape .footer-brand {
        font-family: var(--font-sans), var(--font-sans-family) !important;
        font-size: 1rem !important;
        font-weight: 750 !important;
        text-transform: none !important;
      }
      #rodape .footer-description,
      #rodape .footer-support {
        color: rgba(247, 241, 232, 0.58) !important;
        font-weight: 450 !important;
      }
      #rodape .footer-support a {
        color: rgba(247, 241, 232, 0.72) !important;
      }
      #rodape .footer-copy {
        color: rgba(247, 241, 232, 0.68) !important;
      }

      @media (min-width: 760px) {
        #material-por-dentro .method-map-block {
          grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
        }
        #com-o-mapa-voce-vai .map-path {
          grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
          gap: 14px !important;
        }
        #com-o-mapa-voce-vai .map-card {
          min-height: 150px !important;
        }
      }

      @media (max-width: 520px) {
        #hero .hero-reveal {
          margin-left: -20px !important;
          margin-right: -20px !important;
        }
        #precos-acesso .plan-button,
        #hero .hero-cta,
        #cta-material-por-dentro .cta-button,
        #cta-final .cta-final-button {
          min-height: 56px !important;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        * {
          scroll-behavior: auto !important;
        }
      }
    `}</style>
  );
}
