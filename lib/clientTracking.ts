import {
  CHECKOUT_META,
  CHECKOUT_URLS,
  OFFER_SECTION_ID,
  UTM_KEYS,
  getTrackingSection,
  type CheckoutRedirectType,
} from '@/lib/trackingConfig';

export const SESSION_ID_KEY = 'mapa_degrade_session_id';
export const ATTRIBUTION_KEY = 'mapa_degrade_attribution';
export const VISITOR_STATE_KEY = 'mapa_degrade_visitor_state';

export type TrackingUtms = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  campaignId?: string;
  adsetId?: string;
  adId?: string;
  placement?: string;
  siteSourceName?: string;
};

export type VisitorState = {
  visitorId: string;
  visitorFirstSeenAt: string;
  visitorLastSeenAt: string;
  visitNumber: number;
  returnCount: number;
  isReturning: boolean;
};

type StoredVisitorState = Partial<VisitorState> & {
  lastSessionId?: string;
};

const UTM_TO_PAYLOAD_KEY: Record<(typeof UTM_KEYS)[number], keyof TrackingUtms> = {
  utm_source: 'utmSource',
  utm_medium: 'utmMedium',
  utm_campaign: 'utmCampaign',
  utm_content: 'utmContent',
  utm_term: 'utmTerm',
  campaign_id: 'campaignId',
  adset_id: 'adsetId',
  ad_id: 'adId',
  placement: 'placement',
  site_source_name: 'siteSourceName',
};

function readStoredAttribution(): TrackingUtms {
  if (typeof window === 'undefined') return {};

  try {
    const raw = sessionStorage.getItem(ATTRIBUTION_KEY);
    return raw ? JSON.parse(raw) as TrackingUtms : {};
  } catch {
    return {};
  }
}

function createClientId(): string {
  return typeof crypto?.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

export function getSessionId(): string {
  if (typeof window === 'undefined') return '';

  let id = sessionStorage.getItem(SESSION_ID_KEY);
  if (!id) {
    id = createClientId();
    sessionStorage.setItem(SESSION_ID_KEY, id);
  }
  return id;
}

export function getVisitorState(): VisitorState {
  const now = new Date().toISOString();
  const fallback: VisitorState = {
    visitorId: '',
    visitorFirstSeenAt: now,
    visitorLastSeenAt: now,
    visitNumber: 1,
    returnCount: 0,
    isReturning: false,
  };

  if (typeof window === 'undefined') return fallback;

  const sessionId = getSessionId();

  try {
    const raw = localStorage.getItem(VISITOR_STATE_KEY);
    const stored = raw ? JSON.parse(raw) as StoredVisitorState : {};
    const visitorId = stored.visitorId || createClientId();
    const visitorFirstSeenAt = stored.visitorFirstSeenAt || now;
    const previousVisitNumber = Number(stored.visitNumber || 0);
    const isNewSession = stored.lastSessionId !== sessionId;
    const visitNumber = isNewSession
      ? Math.max(1, previousVisitNumber + 1)
      : Math.max(1, previousVisitNumber || 1);
    const returnCount = Math.max(0, visitNumber - 1);

    const nextState: VisitorState & { lastSessionId: string } = {
      visitorId,
      visitorFirstSeenAt,
      visitorLastSeenAt: now,
      visitNumber,
      returnCount,
      isReturning: visitNumber > 1,
      lastSessionId: sessionId,
    };

    localStorage.setItem(VISITOR_STATE_KEY, JSON.stringify(nextState));

    return {
      visitorId: nextState.visitorId,
      visitorFirstSeenAt: nextState.visitorFirstSeenAt,
      visitorLastSeenAt: nextState.visitorLastSeenAt,
      visitNumber: nextState.visitNumber,
      returnCount: nextState.returnCount,
      isReturning: nextState.isReturning,
    };
  } catch {
    return {
      ...fallback,
      visitorId: sessionId,
    };
  }
}

export function getUtmParams(): TrackingUtms {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);
  const fromUrl: TrackingUtms = {};

  UTM_KEYS.forEach((key) => {
    const value = params.get(key);
    if (!value) return;
    fromUrl[UTM_TO_PAYLOAD_KEY[key]] = value;
  });

  const stored = readStoredAttribution();
  const merged = { ...stored, ...fromUrl };

  if (Object.values(fromUrl).some(Boolean)) {
    try {
      sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(merged));
    } catch {
      // Storage can be blocked in some in-app browsers.
    }
  }

  return merged;
}

export function buildCheckoutUrl(checkoutType: CheckoutRedirectType): string {
  const baseUrl = CHECKOUT_URLS[checkoutType];
  const url = new URL(baseUrl);
  const sessionId = getSessionId();
  const params = new URLSearchParams(window.location.search);

  if (sessionId) {
    url.searchParams.set('session_id', sessionId);
    url.searchParams.set('sid', sessionId);
  }

  UTM_KEYS.forEach((key) => {
    const fromUrl = params.get(key);
    const fromStorage = readStoredAttribution()[UTM_TO_PAYLOAD_KEY[key]];
    const value = fromUrl || fromStorage;
    if (value && !url.searchParams.has(key)) url.searchParams.set(key, value);
  });

  return url.toString();
}

export function getOfferTrackingSection() {
  return getTrackingSection(OFFER_SECTION_ID) || {
    id: OFFER_SECTION_ID,
    title: '12 - PRECOS / PLANOS',
    order: 12,
  };
}

export function getCheckoutMeta(checkoutType: keyof typeof CHECKOUT_META) {
  return CHECKOUT_META[checkoutType];
}
