import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getBrazilDate } from '@/lib/brazilDate';

const SECTION_ORDER = [
  { id: 'hero',                title: '01 - Hero',               order: 1  },
  { id: 'material-por-dentro', title: '02 - Material por dentro', order: 2  },
  { id: 'beneficios',          title: '03 - Beneficios',          order: 3  },
  { id: 'prova-social',        title: '04 - Prova social',        order: 4  },
  { id: 'cta-intermediario',   title: '05 - CTA intermediario',   order: 5  },
  { id: 'ideal-para',          title: '06 - Ideal para',          order: 6  },
  { id: 'o-que-recebe',        title: '07 - O que recebe',        order: 7  },
  { id: 'bonus',               title: '08 - Bonus',               order: 8  },
  { id: 'comparativo',         title: '09 - Por que usar o mapa', order: 9  },
  { id: 'countdown',           title: '10 - Cronometro',          order: 10 },
  { id: 'oferta',              title: '11 - Oferta',              order: 11 },
  { id: 'garantia',            title: '12 - Garantia',            order: 12 },
  { id: 'faq',                 title: '13 - FAQ',                 order: 13 },
  { id: 'rodape',              title: '14 - Rodape',              order: 14 },
];

// Window → milliseconds (null = full day)
function windowMs(win: string): number | null {
  const map: Record<string, number> = {
    'now': 25_000,
    '30m': 30 * 60_000,
    '1h':  60 * 60_000,
    '2h':  2  * 60 * 60_000,
    '4h':  4  * 60 * 60_000,
    '12h': 12 * 60 * 60_000,
    '24h': 24 * 60 * 60_000,
  };
  return map[win] ?? null;
}

function calcStatus(lastSeen: string, pageStatus: string): 'online' | 'recente' | 'saiu' | 'inativo' {
  if (pageStatus === 'left') return 'saiu';
  const sec = (Date.now() - new Date(lastSeen).getTime()) / 1000;
  if (sec <= 25)   return 'online';
  if (sec <= 1800) return 'recente';
  return 'inativo';
}

type RawSession = {
  session_id: string;
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
  clicks_count: number | null;
  purchased: boolean | null;
  revenue: number | null;
};

type MapEntry = {
  sessions: number; clicks: number; reachedOffer: number;
  purchases: number; revenue: number;
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  if (!token || token !== process.env.FUNNEL_DASHBOARD_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const date   = searchParams.get('date')   || getBrazilDate();
  const win    = searchParams.get('window') || 'today';
  const delta  = windowMs(win);
  const since  = delta ? new Date(Date.now() - delta).toISOString() : null;
  const now25  = new Date(Date.now() -    25_000).toISOString();
  const now30m = new Date(Date.now() - 30 * 60_000).toISOString();

  try {
    // ── 1. TODAS as sessões do dia — sem filtro de window ─────────────────
    const { data: allRaw, error: sessErr } = await supabaseAdmin
      .from('funnel_sessions')
      .select('session_id,first_seen,last_seen,left_at,page_status,utm_source,utm_medium,utm_campaign,utm_content,utm_term,campaign_id,adset_id,ad_id,placement,site_source_name,max_section_order,max_section_title,clicks_count,purchased,revenue')
      .eq('date', date)
      .order('last_seen', { ascending: false })
      .limit(100);

    if (sessErr) console.error('[funnel-dashboard] sessions query error', sessErr.message);

    const allSessionsToday: RawSession[] = (allRaw || []) as RawSession[];

    // ── 2. Sessões filtradas pelo window — só para métricas ───────────────
    const filteredSessions = since
      ? allSessionsToday.filter(s => new Date(s.last_seen) >= new Date(since))
      : allSessionsToday;

    // ── 3. Mapear sessões → formato camelCase para o frontend ─────────────
    const sessions = allSessionsToday.map((s, idx) => ({
      sessionId:            s.session_id,
      shortId:              s.session_id.slice(0, 6),
      label:                `Usuário #${String(idx + 1).padStart(3, '0')}`,
      firstSeen:            s.first_seen,
      lastSeen:             s.last_seen,
      leftAt:               s.left_at,
      pageStatus:           s.page_status || 'active',
      status:               calcStatus(s.last_seen, s.page_status || 'active'),
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
      maxSectionOrder:      s.max_section_order  || 0,
      maxSectionTitle:      s.max_section_title  || null,
      clicksCount:          s.clicks_count       || 0,
      purchased:            s.purchased          || false,
      revenue:              s.revenue            || 0,
    }));

    // ── 4. Contadores de presença (sem filtro de date — tempo real global) ─
    const [{ count: activeNow }, { count: active30m }] = await Promise.all([
      supabaseAdmin.from('funnel_sessions').select('*', { count: 'exact', head: true })
        .gte('last_seen', now25).neq('page_status', 'left'),
      supabaseAdmin.from('funnel_sessions').select('*', { count: 'exact', head: true })
        .gte('last_seen', now30m),
    ]);

    // ── 5. Funil — baseado nas sessões filtradas ───────────────────────────
    const filteredIds = filteredSessions.map(s => s.session_id);
    let secQ = supabaseAdmin.from('funnel_section_events').select('section_id').eq('date', date);
    if (filteredIds.length > 0) secQ = secQ.in('session_id', filteredIds);
    const { data: secData } = await secQ;

    const secCounts: Record<string, number> = {};
    (secData || []).forEach((r: { section_id: string }) => {
      secCounts[r.section_id] = (secCounts[r.section_id] || 0) + 1;
    });
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

    // ── 6. Cliques — baseado nas sessões filtradas ────────────────────────
    let cq = supabaseAdmin.from('funnel_click_events').select('checkout_type').eq('date', date);
    if (filteredIds.length > 0) cq = cq.in('session_id', filteredIds);
    const { data: clickData } = await cq;
    const checkoutClicks: Record<string, number> = {
      plano_basico_popup_open: 0, plano_basico: 0, kit_completo: 0, kit_desconto_popup: 0,
    };
    (clickData || []).forEach((r: { checkout_type: string }) => {
      if (r.checkout_type in checkoutClicks) checkoutClicks[r.checkout_type]++;
    });

    // ── 7. Compras ────────────────────────────────────────────────────────
    let pq = supabaseAdmin.from('funnel_purchases').select('amount').eq('date', date);
    if (since) pq = pq.gte('created_at', since);
    const { data: purchaseData } = await pq;
    const purchaseCount   = (purchaseData || []).length;
    const purchaseRevenue = (purchaseData || []).reduce((sum: number, r: { amount: number }) => sum + (r.amount || 0), 0);

    // ── 8. Campanhas / Adsets / Criativos — baseado nas sessões filtradas ─
    const campaignMap: Record<string, MapEntry> = {};
    const adsetMap:    Record<string, MapEntry> = {};
    const contentMap:  Record<string, MapEntry> = {};

    filteredSessions.forEach(s => {
      const camp  = s.utm_campaign || 'direct';
      const adset = s.adset_id     || 'none';
      const cont  = s.utm_content  || 'none';
      for (const [map, key] of [[campaignMap, camp], [adsetMap, adset], [contentMap, cont]] as [typeof campaignMap, string][]) {
        if (!map[key]) map[key] = { sessions: 0, clicks: 0, reachedOffer: 0, purchases: 0, revenue: 0 };
        map[key].sessions++;
        map[key].clicks       += s.clicks_count  || 0;
        map[key].reachedOffer += (s.max_section_order || 0) >= 11 ? 1 : 0;
        map[key].purchases    += s.purchased ? 1 : 0;
        map[key].revenue      += s.revenue   || 0;
      }
    });

    const toArr = (map: typeof campaignMap, k: string) =>
      Object.entries(map).map(([v, d]) => ({
        [k]: v, ...d,
        conversionClick:    d.sessions > 0 ? Math.round((d.clicks    / d.sessions) * 100) : 0,
        conversionPurchase: d.sessions > 0 ? Math.round((d.purchases / d.sessions) * 100) : 0,
      })).sort((a, b) => b.sessions - a.sessions);

    // ── 9. Retorno ────────────────────────────────────────────────────────
    return NextResponse.json({
      date,
      window: win,
      // Presença
      activeNow:  activeNow  || 0,
      active30m:  active30m  || 0,
      // Sessões
      totalSessionsToday: allSessionsToday.length,
      sessionsPeriod:     filteredSessions.length,
      // Funil e métricas
      sections,
      checkoutClicks,
      purchases: { count: purchaseCount, revenue: purchaseRevenue },
      // Tabelas por origem
      campaigns: toArr(campaignMap, 'utmCampaign'),
      adsets:    toArr(adsetMap,    'adsetId'),
      creatives: toArr(contentMap,  'utmContent'),
      // Lista de usuários — SEMPRE todas as sessões do dia
      sessions,
      showingMax: allSessionsToday.length >= 100,
      // Debug seguro
      debug: {
        date,
        window:                win,
        allSessionsTodayCount: allSessionsToday.length,
        filteredSessionsCount: filteredSessions.length,
        returnedSessionsCount: sessions.length,
        sessQueryError:        sessErr ? sessErr.message : null,
      },
      updatedAt: new Date().toISOString(),
    });

  } catch (err) {
    console.error('[funnel-dashboard]', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal error' }, { status: 500 });
  }
}
