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
  { id: 'hero', title: '01 - HERO', order: 1 },
  { id: 'marca-nao-aparece', title: '02 - ELA COMECA ANTES', order: 2 },
  { id: 'material-por-dentro', title: '03 - MATERIAL POR DENTRO', order: 3 },
  { id: 'material-carrossel-3d', title: '04 - CARROSSEL 3D DO MATERIAL', order: 4 },
  { id: 'cta-material-por-dentro', title: '05 - CTA MATERIAL', order: 5 },
  { id: 'com-o-mapa-voce-vai', title: '06 - COM O MAPA VOCE VAI', order: 6 },
  { id: 'carrossel-cortes', title: '07 - TA DUVIDANDO', order: 7 },
  { id: 'veja-tudo-que-recebe', title: '08 - VEJA TUDO QUE VOCE VAI RECEBER', order: 8 },
  { id: 'veja-tudo-produto-principal', title: '09 - PRODUTO PRINCIPAL', order: 9 },
  { id: 'veja-tudo-bonus', title: '10 - BONUS', order: 10 },
  { id: 'precos-acesso', title: '11 - PRECOS / PLANOS', order: 11 },
  { id: 'prova-social', title: '12 - PROVA SOCIAL', order: 12 },
  { id: 'garantia', title: '13 - GARANTIA', order: 13 },
  { id: 'faq', title: '14 - FAQ', order: 14 },
  { id: 'cta-final', title: '15 - CTA FINAL', order: 15 },
  { id: 'rodape', title: '16 - RODAPE', order: 16 },
] as const;

export type TrackingSection = typeof TRACKING_SECTIONS[number];
export type TrackingSectionId = TrackingSection['id'];

export const SECTION_ALIASES: Record<string, TrackingSectionId> = {
  oferta: 'precos-acesso',
  planos: 'precos-acesso',
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
