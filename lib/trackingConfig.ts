export const UTM_KEYS = [
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

export const TRACKING_SECTIONS = [
  { id: 'hero', title: '01 - HERO', order: 1, domId: 'inicio' },
  { id: 'marca-nao-aparece', title: '02 - O PROBLEMA NAO APARECE DO NADA', order: 2, domId: 'marca-nao-aparece' },
  { id: 'material-por-dentro', title: '03 - A SOLUCAO E CLAREZA', order: 3, domId: 'material-por-dentro' },
  { id: 'cta-material-por-dentro', title: '04 - CTA INTERMEDIARIO', order: 4, domId: 'chamada-oferta' },
  { id: 'com-o-mapa-voce-vai', title: '05 - COM O MAPA VOCE VAI', order: 5, domId: 'com-o-mapa-voce-vai' },
  { id: 'carrossel-cortes', title: '06 - TA DUVIDANDO', order: 6, domId: 'por-dentro' },
  { id: 'prova-social', title: '07 - BARBEIROS APROVARAM', order: 7, domId: 'depoimentos' },
  { id: 'veja-tudo-que-recebe', title: '08 - VEJA TUDO QUE VOCE VAI RECEBER', order: 8, domId: 'conteudo' },
  { id: 'precos-acesso', title: '09 - PRECOS / PLANOS', order: 9, domId: 'oferta' },
  { id: 'garantia', title: '10 - GARANTIA', order: 10, domId: 'garantia' },
  { id: 'faq', title: '11 - FAQ', order: 11, domId: 'faq' },
  { id: 'cta-final', title: '12 - CTA FINAL', order: 12, domId: 'chamada-final' },
  { id: 'rodape', title: '13 - RODAPE', order: 13, domId: 'rodape' },
] as const;

export type TrackingSection = typeof TRACKING_SECTIONS[number];
export type TrackingSectionId = TrackingSection['id'];

export const SECTION_ALIASES: Record<string, TrackingSectionId> = {
  inicio: 'hero',
  oferta: 'precos-acesso',
  planos: 'precos-acesso',
  'chamada-oferta': 'cta-material-por-dentro',
  'por-dentro': 'carrossel-cortes',
  depoimentos: 'prova-social',
  conteudo: 'veja-tudo-que-recebe',
  'chamada-final': 'cta-final',
};

export const OFFER_SECTION_ID = 'precos-acesso' as const;
export const OFFER_ANCHOR_ID = 'planos' as const;

export const CHECKOUT_URLS = {
  plano_basico: 'https://pay.wiapy.com/iUoMvXq0sJr-',
  kit_desconto_popup: 'https://pay.wiapy.com/8To4z6HioR',
  kit_completo: 'https://pay.wiapy.com/MaYsqe4pqwN',
} as const;

export const CHECKOUT_META = {
  plano_basico_popup_open: {
    label: 'Plano Basico - abriu popup',
    price: 19.90,
    isRedirect: false,
  },
  plano_basico: {
    label: 'Plano Basico',
    price: 19.90,
    isRedirect: true,
  },
  kit_desconto_popup: {
    label: 'Kit Completo com Desconto',
    price: 24.90,
    isRedirect: true,
  },
  kit_completo: {
    label: 'Kit Completo',
    price: 29.90,
    isRedirect: true,
  },
} as const;

export type CheckoutType = keyof typeof CHECKOUT_META;
export type CheckoutRedirectType = keyof typeof CHECKOUT_URLS;

export function getCanonicalSectionId(sectionId: string): string {
  return SECTION_ALIASES[sectionId] || sectionId;
}

export function getTrackingSection(sectionId: string): TrackingSection | undefined {
  const canonicalId = getCanonicalSectionId(sectionId);
  return TRACKING_SECTIONS.find((section) => section.id === canonicalId);
}
