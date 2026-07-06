'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const sections = [
  { id: 'hero',               title: '01 - Hero',               order: 1  },
  { id: 'material-por-dentro', title: '02 - Material por dentro', order: 2  },
  { id: 'beneficios',         title: '03 - Beneficios',          order: 3  },
  { id: 'prova-social',       title: '04 - Prova social',        order: 4  },
  { id: 'cta-intermediario',  title: '05 - CTA intermediario',   order: 5  },
  { id: 'ideal-para',         title: '06 - Ideal para',          order: 6  },
  { id: 'o-que-recebe',       title: '07 - O que recebe',        order: 7  },
  { id: 'bonus',              title: '08 - Bonus',               order: 8  },
  { id: 'comparativo',        title: '09 - Por que usar o mapa', order: 9  },
  { id: 'countdown',          title: '10 - Cronometro',          order: 10 },
  { id: 'oferta',             title: '11 - Oferta',              order: 11 },
  { id: 'garantia',           title: '12 - Garantia',            order: 12 },
  { id: 'faq',                title: '13 - FAQ',                 order: 13 },
  { id: 'rodape',             title: '14 - Rodape',              order: 14 },
];

const SESSION_PREFIX = 'st_fired_';

export default function SectionTracker() {
  useEffect(() => {
    let rafId: number | null = null;

    const checkSections = () => {
      const triggerLine = window.scrollY + window.innerHeight * 0.75;

      sections.forEach(({ id, title, order }) => {
        const storageKey = SESSION_PREFIX + id;
        if (sessionStorage.getItem(storageKey)) return;

        const el = document.getElementById(id);
        if (!el) return;

        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= triggerLine) {
          sessionStorage.setItem(storageKey, '1');
          if (typeof window.gtag === 'function') {
            window.gtag('event', 'section_reached', {
              section_title:  title,
              section_order:  order,
              section_id:     id,
              page_path:      window.location.pathname,
              page_location:  window.location.href,
              transport_type: 'beacon',
            });
          }
        }
      });
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        checkSections();
        rafId = null;
      });
    };

    // Fire once on mount for sections already visible
    checkSections();

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}
