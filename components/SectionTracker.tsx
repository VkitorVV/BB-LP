'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const sections = [
  { id: 'hero',              title: '01 - Hero' },
  { id: 'produto-por-dentro', title: '02 - Material por dentro' },
  { id: 'beneficios',        title: '03 - Beneficios' },
  { id: 'prova-social',      title: '04 - Prova social' },
  { id: 'cta-intermediario', title: '05 - CTA intermediario' },
  { id: 'ideal-para',        title: '06 - Ideal para' },
  { id: 'o-que-recebe',      title: '07 - O que recebe' },
  { id: 'bonus',             title: '08 - Bonus' },
  { id: 'comparativo',       title: '09 - Por que usar o mapa' },
  { id: 'oferta',            title: '10 - Oferta' },
  { id: 'garantia',          title: '11 - Garantia' },
  { id: 'como-acessar',      title: '12 - Como acessar' },
  { id: 'faq',               title: '13 - FAQ' },
  { id: 'rodape',            title: '14 - Rodape' },
];

export default function SectionTracker() {
  useEffect(() => {
    const fired = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !fired.has(entry.target.id)) {
            const section = sections.find((s) => s.id === entry.target.id);
            if (section && typeof window.gtag === 'function') {
              fired.add(entry.target.id);
              window.gtag('event', 'page_view', {
                page_title: section.title,
                page_location: `${window.location.origin}/#${section.id}`,
                page_path: `/#${section.id}`,
              });
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
