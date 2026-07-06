import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

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

function windowToSince(window: string | null, date: string): string | null {
  if (!window || window === 'today') return null; // full day filter via date
  const ms: Record<string, number> = {
    '90s': 90_000,
    '30m': 30 * 60_000,
    '1h':  60 * 60_000,
    '2h':  2  * 60 * 60_000,
    '4h':  4  * 60 * 60_000,
    '12h': 12 * 60 * 60_000,
    '24h': 24 * 60 * 60_000,
  };
  const delta = ms[window];
  if (!delta) return null;
  return new Date(Date.now() - delta).toISOString();
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  if (!token || token !== process.env.FUNNEL_DASHBOARD_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const date   = searchParams.get('date')   || new Date().toISOString().split('T')[0];
  const window = searchParams.get('window') || 'today';
  const since  = windowToSince(window, date);
  const now90s = new Date(Date.now() -  90_000).toISOString();
  const now30m = new Date(Date.now() - 30 * 60_000).toISOString();

  try {
    // ── Ativos agora (90s) ────────────────────────────────────────────────
    const { count: activeNow } = await supabaseAdmin
      .from('funnel_sessions')
      .select('*', { count: 'exact', head: true })
      .gte('last_seen', now90s);

    // ── Ativos 30min ──────────────────────────────────────────────────────
    const { count: active30m } = await supabaseAdmin
      .from('funnel_sessions')
      .select('*', { count: 'exact', head: true })
      .gte('last_seen', now30m);

    // ── Sessões no período ────────────────────────────────────────────────
    let sessionsQuery = supabaseAdmin
      .from('funnel_sessions')
      .select('session_id, first_seen, last_seen, utm_campaign, utm_content, utm_source, utm_term, adset_id, ad_id, campaign_id, placement, site_source_name, max_section_title, max_section_order, clicks_count, purchased, revenue')
      .eq('date', date)
      .order('last_seen', { ascending: false });
    if (since) sessionsQuery = sessionsQuery.gte('last_seen', since);
    const { data: sessionData } = await sessionsQuery;

    const totalSessionsInWindow = (sessionData || []).length;
    const sessionIds = (sessionData || []).map((s: { session_id: string }) => s.session_id);

    // ── Funil — seções no período ─────────────────────────────────────────
    let sectionQuery = supabaseAdmin
      .from('funnel_section_events')
      .select('section_id')
      .eq('date', date);
    if (sessionIds.length > 0) sectionQuery = sectionQuery.in('session_id', sessionIds);
    const { data: sectionData } = await sectionQuery;

    const sectionCounts: Record<string, number> = {};
    (sectionData || []).forEach((row: { section_id: string }) => {
      sectionCounts[row.section_id] = (sectionCounts[row.section_id] || 0) + 1;
    });
    const heroCount = sectionCounts['hero'] || 1;
    const sections = SECTION_ORDER.map((s, i) => {
      const reached  = sectionCounts[s.id] || 0;
      const prevId   = i > 0 ? SECTION_ORDER[i - 1].id : s.id;
      const prev     = sectionCounts[prevId] || reached;
      return {
        ...s, reached,
        percentOfHero:    Math.round((reached / heroCount) * 100),
        dropFromPrevious: prev > 0 ? Math.round(((prev - reached) / prev) * 100) : 0,
      };
    });

    // ── Cliques no período ────────────────────────────────────────────────
    let clickQuery = supabaseAdmin
      .from('funnel_click_events')
      .select('checkout_type')
      .eq('date', date);
    if (sessionIds.length > 0) clickQuery = clickQuery.in('session_id', sessionIds);
    const { data: clickData } = await clickQuery;

    const checkoutClicks: Record<string, number> = {
      plano_basico_popup_open: 0, plano_basico: 0,
      kit_completo: 0, kit_desconto_popup: 0,
    };
    (clickData || []).forEach((row: { checkout_type: string }) => {
      if (row.checkout_type in checkoutClicks) checkoutClicks[row.checkout_type]++;
    });

    // ── Compras no período ────────────────────────────────────────────────
    let purchaseQuery = supabaseAdmin
      .from('funnel_purchases')
      .select('amount, utm_campaign, utm_content')
      .eq('date', date);
    if (since) purchaseQuery = purchaseQuery.gte('created_at', since);
    const { data: purchaseData } = await purchaseQuery;

    const purchaseCount   = (purchaseData || []).length;
    const purchaseRevenue = (purchaseData || []).reduce((s: number, r: { amount: number }) => s + (r.amount || 0), 0);

    // ── Campanhas / Adsets / Criativos ───────────────────────────────────
    type MapEntry = { sessions: number; clicks: number; reachedOffer: number; purchases: number; revenue: number };
    const campaignMap: Record<string, MapEntry> = {};
    const contentMap:  Record<string, MapEntry> = {};
    const adsetMap:    Record<string, MapEntry> = {};

    (sessionData || []).forEach((s: {
      utm_campaign?: string; utm_content?: string; adset_id?: string;
      max_section_order?: number; clicks_count?: number; purchased?: boolean; revenue?: number;
    }) => {
      const camp  = s.utm_campaign || 'direct';
      const cont  = s.utm_content  || 'none';
      const adset = s.adset_id     || 'none';
      for (const [map, key] of [[campaignMap, camp], [contentMap, cont], [adsetMap, adset]] as [typeof campaignMap, string][]) {
        if (!map[key]) map[key] = { sessions: 0, clicks: 0, reachedOffer: 0, purchases: 0, revenue: 0 };
        map[key].sessions++;
        map[key].clicks       += s.clicks_count || 0;
        map[key].reachedOffer += (s.max_section_order || 0) >= 11 ? 1 : 0;
        map[key].purchases    += s.purchased ? 1 : 0;
        map[key].revenue      += s.revenue   || 0;
      }
    });

    const toArray = (map: typeof campaignMap, keyName: string) =>
      Object.entries(map).map(([k, v]) => ({
        [keyName]: k, ...v,
        conversionClick:    v.sessions > 0 ? Math.round((v.clicks / v.sessions) * 100) : 0,
        conversionPurchase: v.sessions > 0 ? Math.round((v.purchases / v.sessions) * 100) : 0,
      })).sort((a, b) => b.sessions - a.sessions);

    // Sessões recentes — top 100
    const recentSessions = (sessionData || []).slice(0, 100).map((s: {
      session_id: string; first_seen: string; last_seen: string;
      utm_campaign?: string; utm_source?: string; utm_content?: string;
      utm_term?: string; adset_id?: string; ad_id?: string;
      max_section_title?: string; max_section_order?: number;
      clicks_count?: number; purchased?: boolean;
    }, idx: number) => ({
      ...s,
      userLabel: `Usuário #${String(idx + 1).padStart(3, '0')}`,
      status: new Date(s.last_seen) >= new Date(now90s) ? 'online'
            : new Date(s.last_seen) >= new Date(now30m) ? 'recente'
            : 'inativo',
    }));

    return NextResponse.json({
      date, window,
      activeNow:            activeNow  || 0,
      active30m:            active30m  || 0,
      totalSessionsInWindow,
      totalClicks:          Object.values(checkoutClicks).reduce((a, b) => a + b, 0),
      sections,
      checkoutClicks,
      purchases: { count: purchaseCount, revenue: purchaseRevenue },
      campaigns: toArray(campaignMap, 'utmCampaign'),
      adsets:    toArray(adsetMap,    'adsetId'),
      creatives: toArray(contentMap,  'utmContent'),
      sessions:  recentSessions,
      updatedAt: new Date().toISOString(),
    });

  } catch (err) {
    console.error('[funnel-dashboard]', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal error' }, { status: 500 });
  }
}
