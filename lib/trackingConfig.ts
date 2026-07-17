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
  { id: 'marca-nao-aparece', title: '02 - NÃO APARECE DO NADA', order: 2 },
  { id: 'se-a-marca-nao-sai', title: '03 - SE A MARCA NÃO SAI', order: 3 },
  { id: 'material-por-dentro', title: '04 - MATERIAL POR DENTRO', order: 4 },
  { id: 'cta-material-por-dentro', title: '05 - CTA MATERIAL POR DENTRO', order: 5 },
  { id: 'com-o-mapa-voce-vai', title: '06 - COM O MAPA VOCÊ VAI', order: 6 },
  { id: 'carrossel-cortes', title: '07 - CARROSSEL DE CORTES', order: 7 },
  { id: 'veja-tudo-produto-principal', title: '08 - PRODUTO PRINCIPAL', order: 8 },
  { id: 'veja-tudo-bonus', title: '09 - BÔNUS', order: 9 },
  { id: 'precos-acesso', title: '10 - PREÇOS / PLANOS', order: 10 },
  { id: 'prova-social', title: '11 - PROVA SOCIAL', order: 11 },
  { id: 'garantia', title: '12 - GARANTIA', order: 12 },
  { id: 'faq', title: '13 - FAQ', order: 13 },
  { id: 'cta-final', title: '14 - CTA FINAL', order: 14 },
  { id: 'rodape', title: '15 - RODAPÉ', order: 15 },
] as const;

export type TrackingSection = typeof TRACKING_SECTIONS[number];
export type TrackingSectionId = TrackingSection['id'];

export const SECTION_ALIASES: Record<string, TrackingSectionId> = {
  oferta: 'precos-acesso',
  planos: 'precos-acesso',
  'veja-tudo-que-recebe': 'veja-tudo-produto-principal',
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
    label: 'Plano Básico - abriu popup',
    price: 19.90,
    isRedirect: false,
  },
  plano_basico: {
    label: 'Plano Básico',
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
