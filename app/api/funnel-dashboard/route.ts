import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getBrazilDate } from '@/lib/brazilDate';
import {
  OFFER_SECTION_ID,
  TRACKING_SECTIONS,
  getCanonicalSectionId,
  getTrackingSection,
} from '@/lib/trackingConfig';

const SECTION_ORDER = TRACKING_SECTIONS;
const OFFER_SECTION_ORDER = getTrackingSection(OFFER_SECTION_ID)?.order || 10;
const PAGE_SIZE = 1000;

async function fetchAllRows<T>(
  buildQuery: () => any,
): Promise<{ data: T[]; errorMessage: string | null }> {
  const rows: T[] = [];

  for (let from = 0; ; from += PAGE_SIZE) {
    const to = from + PAGE_SIZE - 1;
    const { data, error } = await buildQuery().range(from, to);
    if (error) return { data: rows, errorMessage: error.message || 'Erro ao buscar dados paginados' };

    const page = (data || []) as T[];
    rows.push(...page);
    if (page.length < PAGE_SIZE) return { data: rows, errorMessage: null };
  }
}

function windowMs(win: string): number | null {
  const map: Record<string, number> = {
    'now': 25_000, '30m': 30*60_000, '1h': 60*60_000,
    '2h': 2*60*60_000, '4h': 4*60*60_000, '12h': 12*60*60_000, '24h': 24*60*60_000,
  };
  return map[win] ?? null;
}

function calcStatus(lastSeen: string, pageStatus: string | null): 'online'|'recente'|'saiu'|'inativo' {
  if (pageStatus === 'left') return 'saiu';
  const sec = (Date.now() - new Date(lastSeen).getTime()) / 1000;
  if (sec <= 25) return 'online';
  if (sec <= 90) return 'recente';
  return 'inativo';
}

// Only real columns in funnel_sessions (no clicks_count, purchased, revenue)
type RawSession = {
  session_id: string;
  date: string;
  first_seen: string;
  last_seen: string;
  left_at: string | null;
  page_status: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  campaign_id: string | null;
  adset_id: string | null;
  ad_id: string | null;
  placement: string | null;
  site_source_name: string | null;
  max_section_order: number | null;
  max_section_title: string | null;
  visitor_id?: string | null;
  visitor_first_seen_at?: string | null;
  visitor_last_seen_at?: string | null;
  visit_number?: number | null;
  return_count?: number | null;
  is_returning?: boolean | null;
};

type ClickEvent = {
  session_id: string;
  checkout_type: string;
  click_kind?: string | null;
  cta_label?: string | null;
  checkout_label?: string | null;
  checkout_price?: number | null;
  button_location?: string | null;
  clicked_at?: string | null;
};
type PurchaseEvent = { session_id: string | null; amount?: number | string | null; created_at?: string | null };
type SectionEvent = { session_id: string; section_id: string; reach_method?: string | null };

async function fetchPurchases(date: string): Promise<{ data: PurchaseEvent[]; errorMessage: string | null; fallback: string | null }> {
  const attempts = [
    { select: 'session_id, amount, created_at', fallback: null },
    { select: 'session_id, created_at', fallback: 'funnel_purchases.amount ausente no Supabase real' },
    { select: 'session_id', fallback: 'funnel_purchases.amount/created_at ausentes no Supabase real' },
  ];

  let lastError: string | null = null;
  for (const attempt of attempts) {
    const result = await fetchAllRows<PurchaseEvent>(() =>
      supabaseAdmin
        .from('funnel_purchases')
        .select(attempt.select)
        .eq('date', date),
    );

    if (!result.errorMessage) return { data: result.data, errorMessage: null, fallback: attempt.fallback };
    lastError = result.errorMessage;
  }

  return { data: [], errorMessage: lastError, fallback: null };
}

async function fetchSessions(date: string): Promise<{ data: RawSession[]; errorMessage: string | null; fallback: string | null }> {
  const baseSelect = `
    session_id, date, first_seen, last_seen, left_at, page_status,
    utm_source, utm_medium, utm_campaign, utm_content, utm_term,
    campaign_id, adset_id, ad_id, placement, site_source_name,
    max_section_order, max_section_title
  `;
  const attempts = [
    {
      select: `${baseSelect},
        visitor_id, visitor_first_seen_at, visitor_last_seen_at,
        visit_number, return_count, is_returning
      `,
      fallback: null,
    },
    {
      select: baseSelect,
      fallback: 'funnel_sessions visitor columns ausentes no Supabase real',
    },
  ];

  let lastError: string | null = null;
  for (const attempt of attempts) {
    const result = await fetchAllRows<RawSession>(() =>
      supabaseAdmin
        .from('funnel_sessions')
        .select(attempt.select)
        .eq('date', date)
        .order('last_seen', { ascending: false }),
    );

    if (!result.errorMessage) return { data: result.data, errorMessage: null, fallback: attempt.fallback };
    lastError = result.errorMessage;
  }

  return { data: [], errorMessage: lastError, fallback: null };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  if (!token || token !== process.env.FUNNEL_DASHBOARD_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const date  = searchParams.get('date')   || getBrazilDate();
  const win   = searchParams.get('window') || 'today';
  const delta = windowMs(win);
  const since = delta ? new Date(Date.now() - delta).toISOString() : null;
  const now25  = new Date(Date.now() -     25_000).toISOString();
  const now30m = new Date(Date.now() - 30*60_000).toISOString();

  // ── 1. All sessions today (only real columns) ───────────────────────────
  const {
    data: allSessionsToday,
    errorMessage: sessionsErrorMessage,
    fallback: sessionsFallbackMessage,
  } = await fetchSessions(date);

  // ── 2. Clicks for this day ──────────────────────────────────────────────
  const { data: clickEvents, errorMessage: clickEventsErrorMessage } = await fetchAllRows<ClickEvent>(() =>
    supabaseAdmin
      .from('funnel_click_events')
      .select('session_id, checkout_type, click_kind, cta_label, checkout_label, checkout_price, button_location, clicked_at')
      .eq('date', date),
  );

  // ── 3. Purchases for this day ───────────────────────────────────────────
  const {
    data: purchasesData,
    errorMessage: purchasesErrorMessage,
    fallback: purchasesFallbackMessage,
  } = await fetchPurchases(date);

  // ── 4. Build per-session maps ───────────────────────────────────────────
  const clicksBySession: Record<string, number> = {};
  const lastClickBySession: Record<string, { checkoutType: string; checkoutLabel: string | null; checkoutPrice: number | null; buttonLocation: string | null; clickedAt: string | null }> = {};

  clickEvents.forEach((e: ClickEvent) => {
    clicksBySession[e.session_id] = (clicksBySession[e.session_id] || 0) + 1;
    const previousClick = lastClickBySession[e.session_id];
    const isLatestClick = !previousClick?.clickedAt || (
      e.clicked_at && new Date(e.clicked_at).getTime() > new Date(previousClick.clickedAt).getTime()
    );
    if (!isLatestClick) return;
    lastClickBySession[e.session_id] = {
      checkoutType:   e.checkout_type,
      checkoutLabel:  e.checkout_label  || null,
      checkoutPrice:  e.checkout_price  || null,
      buttonLocation: e.button_location || null,
      clickedAt:      e.clicked_at      || null,
    };
  });

  const purchasedBySession: Record<string, boolean> = {};
  const revenueBySession:   Record<string, number>  = {};
  purchasesData.forEach((p: PurchaseEvent) => {
    if (!p.session_id) return;
    const amount = typeof p.amount === 'number'
      ? p.amount
      : p.amount
        ? Number(p.amount)
        : 0;
    purchasedBySession[p.session_id] = true;
    revenueBySession[p.session_id]   = (revenueBySession[p.session_id] || 0) + (Number.isFinite(amount) ? amount : 0);
  });

  // ── 5. Filtered sessions (for period metrics only) ──────────────────────
  const filteredSessions = since
    ? allSessionsToday.filter(s => new Date(s.last_seen) >= new Date(since))
    : allSessionsToday;
  const filteredIdSet = new Set(filteredSessions.map(s => s.session_id));

  // ── 6. Map sessions → camelCase with calculated fields ─────────────────
  const sessions = allSessionsToday.map((s, idx) => ({
    sessionId:            s.session_id,
    shortId:              s.session_id.slice(0, 8),
    label:                `Usuário #${String(idx + 1).padStart(3, '0')}`,
    firstSeen:            s.first_seen,
    lastSeen:             s.last_seen,
    leftAt:               s.left_at,
    pageStatus:           s.page_status || 'active',
    status:               calcStatus(s.last_seen, s.page_status),
    secondsSinceLastSeen: Math.floor((Date.now() - new Date(s.last_seen).getTime()) / 1000),
    utmSource:            s.utm_source,
    utmCampaign:          s.utm_campaign,
    utmTerm:              s.utm_term,
    utmContent:           s.utm_content,
    campaignId:           s.campaign_id,
    adsetId:              s.adset_id,
    adId:                 s.ad_id,
    placement:            s.placement,
    siteSourceName:       s.site_source_name,
    maxSectionOrder:      s.max_section_order || 0,
    maxSectionTitle:      s.max_section_title || null,
    visitorId:            s.visitor_id || null,
    visitorShortId:       s.visitor_id ? s.visitor_id.slice(0, 8) : null,
    visitorFirstSeenAt:   s.visitor_first_seen_at || null,
    visitorLastSeenAt:    s.visitor_last_seen_at || null,
    visitNumber:          s.visit_number || 1,
    returnCount:          s.return_count || 0,
    isReturning:          Boolean(s.is_returning),
    // Calculated from related tables
    clicksCount:        clicksBySession[s.session_id]    || 0,
    purchased:          purchasedBySession[s.session_id] || false,
    revenue:            revenueBySession[s.session_id]   || 0,
    lastCheckoutClick:  lastClickBySession[s.session_id] || null,
  }));

  // ── 7. Presence counters (global, no date filter) ───────────────────────
  const [{ count: activeNow }, { count: active30m }] = await Promise.all([
    supabaseAdmin.from('funnel_sessions').select('*', { count: 'exact', head: true })
      .gte('last_seen', now25).neq('page_status', 'left'),
    supabaseAdmin.from('funnel_sessions').select('*', { count: 'exact', head: true })
      .gte('last_seen', now30m),
  ]);

  // ── 8. Funnel sections (with toggle: scroll only vs all) ────────────────
  const includeCta = searchParams.get('includeCta') === '1';
  const { data: allSecData, errorMessage: sectionEventsErrorMessage } = await fetchAllRows<SectionEvent>(() =>
    supabaseAdmin
      .from('funnel_section_events')
      .select('session_id, section_id, reach_method')
      .eq('date', date),
  );
  const secData = filteredIdSet.size > 0
    ? allSecData.filter(r => filteredIdSet.has(r.session_id))
    : [];

  // Count scroll-only and all (scroll + cta_jump)
  const secCountsScroll: Record<string, number> = {};
  const secCountsAll:    Record<string, number> = {};
  secData.forEach((r: { section_id: string; reach_method?: string | null }) => {
    const sectionId = getCanonicalSectionId(r.section_id);
    secCountsAll[sectionId] = (secCountsAll[sectionId] || 0) + 1;
    if (!r.reach_method || r.reach_method === 'scroll') {
      secCountsScroll[sectionId] = (secCountsScroll[sectionId] || 0) + 1;
    }
  });

  const secCounts = includeCta ? secCountsAll : secCountsScroll;
  const heroCount = secCounts['hero'] || 1;
  const sections  = SECTION_ORDER.map((s, i) => {
    const reached = secCounts[s.id] || 0;
    const prev    = i > 0 ? (secCounts[SECTION_ORDER[i - 1].id] || reached) : reached;
    return {
      ...s, reached,
      percentOfHero:    Math.round((reached / heroCount) * 100),
      dropFromPrevious: prev > 0 ? Math.round(((prev - reached) / prev) * 100) : 0,
    };
  });

  // CTA jump counts per section (for info card)
  const ctaJumpCounts: Record<string, number> = {};
  secData.forEach((r: { section_id: string; reach_method?: string | null }) => {
    if (r.reach_method === 'cta_jump') {
      const sectionId = getCanonicalSectionId(r.section_id);
      ctaJumpCounts[sectionId] = (ctaJumpCounts[sectionId] || 0) + 1;
    }
  });

  // ── 9. Checkout clicks + internal CTA clicks ────────────────────────────
  const checkoutClicks: Record<string, number> = {
    plano_basico_popup_open: 0, plano_basico: 0, kit_completo: 0, kit_desconto_popup: 0,
  };
  const internalCtaClicks: Record<string, number> = {};
  const checkoutRedirectTypes = new Set(['plano_basico', 'kit_completo', 'kit_desconto_popup']);
  const uniqueCheckoutSessionIds = new Set<string>();
  let rawCheckoutEvents = 0;
  let checkoutRedirects = 0;

  if (filteredIdSet.size > 0) {
    clickEvents.filter(r => filteredIdSet.has(r.session_id)).forEach((r: ClickEvent) => {
      if (r.click_kind === 'internal_cta') {
        const label = r.cta_label || 'CTA desconhecido';
        internalCtaClicks[label] = (internalCtaClicks[label] || 0) + 1;
      } else {
        rawCheckoutEvents++;
        if (r.checkout_type in checkoutClicks) checkoutClicks[r.checkout_type]++;
        if (checkoutRedirectTypes.has(r.checkout_type)) {
          checkoutRedirects++;
          uniqueCheckoutSessionIds.add(r.session_id);
        }
      }
    });
  }
  const checkoutSummary = {
    rawCheckoutEvents,
    basicPopupOpens: checkoutClicks.plano_basico_popup_open,
    checkoutRedirects,
    uniqueCheckoutSessions: uniqueCheckoutSessionIds.size,
    basicSelected: checkoutClicks.plano_basico,
    completeSelected: checkoutClicks.kit_completo,
    upgradeAccepted: checkoutClicks.kit_desconto_popup,
  };

  // ── 10. Purchases summary ───────────────────────────────────────────────
  const periodPurchases = since
    ? purchasesData.filter((p: PurchaseEvent & { created_at?: string | null }) =>
        p.created_at && new Date(p.created_at) >= new Date(since))
    : purchasesData;
  const purchaseCount   = periodPurchases.length;
  const purchaseRevenue = periodPurchases.reduce((sum, purchase) => {
    const amount = typeof purchase.amount === 'number'
      ? purchase.amount
      : purchase.amount
        ? Number(purchase.amount)
        : 0;
    return sum + (Number.isFinite(amount) ? amount : 0);
  }, 0);

  const visitorColumnsAvailable = allSessionsToday.some(s => typeof s.is_returning === 'boolean' || Boolean(s.visitor_id));
  const visitorSummary = {
    trackingEnabled: visitorColumnsAvailable,
    newVisitors: visitorColumnsAvailable ? filteredSessions.filter(s => !s.is_returning).length : 0,
    returningVisitors: visitorColumnsAvailable ? filteredSessions.filter(s => Boolean(s.is_returning)).length : 0,
    totalReturns: visitorColumnsAvailable
      ? filteredSessions.reduce((sum, session) => sum + Number(session.return_count || 0), 0)
      : 0,
    knownVisitors: visitorColumnsAvailable
      ? new Set(filteredSessions.map(s => s.visitor_id).filter(Boolean)).size
      : 0,
  };

  // ── 11. Campaign / Adset / Creative tables ──────────────────────────────
  type MapEntry = { sessions: number; clicks: number; reachedOffer: number; purchases: number; revenue: number };
  const campaignMap: Record<string, MapEntry> = {};
  const adsetMap:    Record<string, MapEntry> = {};
  const contentMap:  Record<string, MapEntry> = {};

  filteredSessions.forEach(s => {
    const camp  = s.utm_campaign || 'direct';
    const adset = s.adset_id     || 'none';
    const cont  = s.utm_content  || 'none';
    const sid   = s.session_id;
    const clks  = clicksBySession[sid]    || 0;
    const purch = purchasedBySession[sid] || false;
    const rev   = revenueBySession[sid]   || 0;
    const reachedOffer = (s.max_section_order || 0) >= OFFER_SECTION_ORDER ? 1 : 0;
    for (const [map, key] of [[campaignMap, camp], [adsetMap, adset], [contentMap, cont]] as [typeof campaignMap, string][]) {
      if (!map[key]) map[key] = { sessions: 0, clicks: 0, reachedOffer: 0, purchases: 0, revenue: 0 };
      map[key].sessions++;
      map[key].clicks       += clks;
      map[key].reachedOffer += reachedOffer;
      map[key].purchases    += purch ? 1 : 0;
      map[key].revenue      += rev;
    }
  });

  const toArr = (map: typeof campaignMap, k: string) =>
    Object.entries(map).map(([v, d]) => ({
      [k]: v, ...d,
      conversionClick:    d.sessions > 0 ? Math.round((d.clicks    / d.sessions) * 100) : 0,
      conversionPurchase: d.sessions > 0 ? Math.round((d.purchases / d.sessions) * 100) : 0,
    })).sort((a, b) => b.sessions - a.sessions);

  // ── 12. Response ────────────────────────────────────────────────────────
  // Extra analytics
  const heroCount2 = secCountsAll['hero'] || 1;

  // funnelVisual — proportional widths
  let dropAccum = 0;
  const funnelVisual = SECTION_ORDER.map((s, i) => {
    const reached   = secCountsAll[s.id] || 0;
    const prevCount = i > 0 ? (secCountsAll[SECTION_ORDER[i - 1].id] || reached) : reached;
    const pctTop    = heroCount2 > 0 ? Math.round((reached / heroCount2) * 100) : 0;
    const drop      = prevCount > 0 ? Math.round(((prevCount - reached) / prevCount) * 100) : 0;
    dropAccum       = heroCount2 > 0 ? Math.round(((heroCount2 - reached) / heroCount2) * 100) : 0;
    return { sectionId: s.id, sectionTitle: s.title, sectionOrder: s.order, reached, percentOfTop: pctTop, dropFromPrevious: drop, dropAccumulated: dropAccum };
  });

  // topBottlenecks — sorted by dropPercent
  const topBottlenecks = funnelVisual
    .filter((_, i) => i > 0)
    .map((s, i) => ({ fromSection: funnelVisual[i].sectionTitle, toSection: s.sectionTitle, dropUsers: (secCounts[SECTION_ORDER[i].id] || 0) - s.reached, dropPercent: s.dropFromPrevious }))
    .filter(b => b.dropPercent > 0)
    .sort((a, b) => b.dropPercent - a.dropPercent)
    .slice(0, 5);

  // stopPoints — where max_section_title ends for most users
  const stopCounts: Record<string, number> = {};
  allSessionsToday.forEach(s => {
    const t = s.max_section_title;
    if (t) stopCounts[t] = (stopCounts[t] || 0) + 1;
  });
  const stopPoints = Object.entries(stopCounts)
    .map(([sectionTitle, usersStopped]) => ({ sectionTitle, usersStopped }))
    .sort((a, b) => b.usersStopped - a.usersStopped);

  // sectionDiagnostics — per section, top campaign and creative
  const secCampaign: Record<string, Record<string, number>> = {};
  const secCreative: Record<string, Record<string, number>> = {};
  filteredSessions.forEach(s => {
    const maxTitle = s.max_section_title;
    if (!maxTitle) return;
    const camp = s.utm_campaign || 'direct';
    const cont = s.utm_content  || 'none';
    if (!secCampaign[maxTitle]) secCampaign[maxTitle] = {};
    if (!secCreative[maxTitle]) secCreative[maxTitle] = {};
    secCampaign[maxTitle][camp] = (secCampaign[maxTitle][camp] || 0) + 1;
    secCreative[maxTitle][cont] = (secCreative[maxTitle][cont] || 0) + 1;
  });

  const sectionDiagnostics = funnelVisual.map(f => {
    const campMap = secCampaign[f.sectionTitle] || {};
    const contMap = secCreative[f.sectionTitle] || {};
    const topCampaign = Object.entries(campMap).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
    const topCreative = Object.entries(contMap).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
    return { ...f, topCampaign, topCreative };
  });

  return NextResponse.json({
    date, window: win,
    activeNow:          activeNow  || 0,
    active30m:          active30m  || 0,
    totalSessionsToday: allSessionsToday.length,
    sessionsPeriod:     filteredSessions.length,
    visitorSummary,
    sections, checkoutClicks, checkoutSummary,
    purchases: { count: purchaseCount, revenue: purchaseRevenue },
    campaigns: toArr(campaignMap, 'utmCampaign'),
    adsets:    toArr(adsetMap,    'adsetId'),
    creatives: toArr(contentMap,  'utmContent'),
    sessions,
    showingMax: false,
    includeCta,
    ctaJumpCounts,
    internalCtaClicks: Object.entries(internalCtaClicks)
      .map(([label, clicks]) => ({ label, clicks }))
      .sort((a, b) => b.clicks - a.clicks),
    // Analytics
    funnelVisual,
    topBottlenecks,
    stopPoints,
    sectionDiagnostics,
    debug: {
      date, window: win,
      allSessionsTodayCount: allSessionsToday.length,
      filteredSessionsCount: filteredSessions.length,
      returnedSessionsCount: sessions.length,
      sessQueryError: [
        sessionsErrorMessage && `sessions: ${sessionsErrorMessage}`,
        clickEventsErrorMessage && `clicks: ${clickEventsErrorMessage}`,
        purchasesErrorMessage && `purchases: ${purchasesErrorMessage}`,
        sectionEventsErrorMessage && `sections: ${sectionEventsErrorMessage}`,
      ].filter(Boolean).join(' | ') || null,
      purchaseQueryFallback: purchasesFallbackMessage,
      sessionQueryFallback: sessionsFallbackMessage,
    },
    updatedAt: new Date().toISOString(),
  });
}
