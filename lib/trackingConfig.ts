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
  { id: 'hero', title: '01 - Hero', order: 1 },
  { id: 'marca-nao-aparece', title: '02 - A marca não aparece do nada', order: 2 },
  { id: 'se-a-marca-nao-sai', title: '03 - Se a marca não sai', order: 3 },
  { id: 'material-por-dentro', title: '04 - Material por dentro', order: 4 },
  { id: 'cta-material-por-dentro', title: '05 - CTA material por dentro', order: 5 },
  { id: 'com-o-mapa-voce-vai', title: '06 - Com o Mapa você vai', order: 6 },
  { id: 'carrossel-cortes', title: '07 - Carrossel de cortes', order: 7 },
  { id: 'veja-tudo-que-recebe', title: '08 - Veja tudo que recebe', order: 8 },
  { id: 'precos-acesso', title: '09 - Preços / Planos', order: 9 },
  { id: 'prova-social', title: '10 - Prova social', order: 10 },
  { id: 'garantia', title: '11 - Garantia', order: 11 },
  { id: 'faq', title: '12 - FAQ', order: 12 },
  { id: 'cta-final', title: '13 - CTA final', order: 13 },
  { id: 'rodape', title: '14 - Rodapé', order: 14 },
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
