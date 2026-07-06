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

function windowToSince(win: string): string | null {
  const ms: Record<string, number> = {
    'now': 35_000, '30m': 30*60_000, '1h': 60*60_000,
    '2h': 2*60*60_000, '4h': 4*60*60_000, '12h': 12*60*60_000, '24h': 24*60*60_000,
  };
  const delta = ms[win];
  return delta ? new Date(Date.now() - delta).toISOString() : null;
}

function sessionStatus(lastSeen: string, pageStatus: string): 'online'|'recente'|'saiu'|'inativo' {
  const secAgo = (Date.now() - new Date(lastSeen).getTime()) / 1000;
  if (pageStatus === 'left') return 'saiu';
  if (secAgo <= 25) return 'online';
  if (secAgo <= 1800) return 'recente';
  return 'inativo';
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  if (!token || token !== process.env.FUNNEL_DASHBOARD_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const date  = searchParams.get('date')   || getBrazilDate();
  const win   = searchParams.get('window') || 'today';
  const since = windowToSince(win);
  const now25  = new Date(Date.now() -    25_000).toISOString();
  const now30m = new Date(Date.now() - 30*60_000).toISOString();

  try {
    // ── Ativos agora (25s, não "left") ───────────────────────────────────
    const { count: activeNow } = await supabaseAdmin
      .from('funnel_sessions')
      .select('*', { count: 'exact', head: true })
      .gte('last_seen', now25)
      .neq('page_status', 'left');

    // ── Ativos 30min ──────────────────────────────────────────────────────
    const { count: active30m } = await supabaseAdmin
      .from('funnel_sessions')
      .select('*', { count: 'exact', head: true })
      .gte('last_seen', now30m);

    // ── Sessões no período ────────────────────────────────────────────────
    let sq = supabaseAdmin
      .from('funnel_sessions')
      .select('session_id,first_seen,last_seen,left_at,page_status,utm_source,utm_medium,utm_campaign,utm_content,utm_term,campaign_id,adset_id,ad_id,placement,site_source_name,max_section_order,max_section_title,clicks_count,purchased,revenue')
      .eq('date', date)
      .order('last_seen', { ascending: false });
    if (since) sq = sq.gte('last_seen', since);
    const { data: sessionData } = await sq;

    // totalSessionsToday = full day count
    const { count: totalSessionsToday } = await supabaseAdmin
      .from('funnel_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('date', date);

    const sessions = ((sessionData || []) as Array<{
      session_id: string; first_seen: string; last_seen: string;
      left_at?: string; page_status?: string;
      utm_source?: string; utm_medium?: string; utm_campaign?: string;
      utm_content?: string; utm_term?: string;
      campaign_id?: string; adset_id?: string; ad_id?: string;
      placement?: string; site_source_name?: string;
      max_section_order?: number; max_section_title?: string;
      clicks_count?: number; purchased?: boolean; revenue?: number;
    }>).slice(0, 100).map((s, idx) => ({
      sessionId:           s.session_id,
      label:               `Usuário #${String(idx + 1).padStart(3, '0')}`,
      shortId:             s.session_id.slice(0, 6),
      firstSeen:           s.first_seen,
      lastSeen:            s.last_seen,
      leftAt:              s.left_at || null,
      pageStatus:          s.page_status || 'active',
      status:              sessionStatus(s.last_seen, s.page_status || 'active'),
      secondsSinceLastSeen: Math.floor((Date.now() - new Date(s.last_seen).getTime()) / 1000),
      utmSource:           s.utm_source,
      utmCampaign:         s.utm_campaign,
      utmTerm:             s.utm_term,
      utmContent:          s.utm_content,
      campaignId:          s.campaign_id,
      adsetId:             s.adset_id,
      adId:                s.ad_id,
      placement:           s.placement,
      siteSourceName:      s.site_source_name,
      maxSectionOrder:     s.max_section_order || 0,
      maxSectionTitle:     s.max_section_title || null,
      clicksCount:         s.clicks_count || 0,
      purchased:           s.purchased || false,
      revenue:             s.revenue || 0,
    }));

    const sessionIds = sessions.map(s => s.sessionId);
    const totalInWindow = (sessionData || []).length;

    // ── Funil ─────────────────────────────────────────────────────────────
    let secQ = supabaseAdmin.from('funnel_section_events').select('section_id').eq('date', date);
    if (sessionIds.length > 0) secQ = secQ.in('session_id', sessionIds);
    const { data: secData } = await secQ;

    const secCounts: Record<string, number> = {};
    (secData || []).forEach((r: {section_id:string}) => { secCounts[r.section_id] = (secCounts[r.section_id]||0)+1; });
    const heroCount = secCounts['hero'] || 1;
    const sections  = SECTION_ORDER.map((s, i) => {
      const reached = secCounts[s.id] || 0;
      const prev    = i > 0 ? (secCounts[SECTION_ORDER[i-1].id] || reached) : reached;
      return { ...s, reached, percentOfHero: Math.round((reached/heroCount)*100),
        dropFromPrevious: prev > 0 ? Math.round(((prev-reached)/prev)*100) : 0 };
    });

    // ── Cliques ───────────────────────────────────────────────────────────
    let cq = supabaseAdmin.from('funnel_click_events').select('checkout_type').eq('date', date);
    if (sessionIds.length > 0) cq = cq.in('session_id', sessionIds);
    const { data: clickData } = await cq;
    const checkoutClicks: Record<string,number> = {
      plano_basico_popup_open:0, plano_basico:0, kit_completo:0, kit_desconto_popup:0 };
    (clickData||[]).forEach((r:{checkout_type:string}) => { if (r.checkout_type in checkoutClicks) checkoutClicks[r.checkout_type]++; });

    // ── Compras ───────────────────────────────────────────────────────────
    let pq = supabaseAdmin.from('funnel_purchases').select('amount').eq('date', date);
    if (since) pq = pq.gte('created_at', since);
    const { data: purchaseData } = await pq;
    const purchaseCount   = (purchaseData||[]).length;
    const purchaseRevenue = (purchaseData||[]).reduce((sum: number, r: {amount: number}) => sum + (r.amount||0), 0);

    // ── Campanhas / Adsets / Criativos ───────────────────────────────────
    type MapEntry = {sessions:number;clicks:number;reachedOffer:number;purchases:number;revenue:number};
    const campaignMap: Record<string,MapEntry> = {};
    const adsetMap:    Record<string,MapEntry> = {};
    const contentMap:  Record<string,MapEntry> = {};

    sessions.forEach(s => {
      const camp  = s.utmCampaign || 'direct';
      const adset = s.adsetId     || 'none';
      const cont  = s.utmContent  || 'none';
      for (const [map, key] of [[campaignMap,camp],[adsetMap,adset],[contentMap,cont]] as [typeof campaignMap,string][]) {
        if (!map[key]) map[key] = {sessions:0,clicks:0,reachedOffer:0,purchases:0,revenue:0};
        map[key].sessions++;
        map[key].clicks       += s.clicksCount;
        map[key].reachedOffer += s.maxSectionOrder >= 11 ? 1 : 0;
        map[key].purchases    += s.purchased ? 1 : 0;
        map[key].revenue      += s.revenue;
      }
    });

    const toArr = (map: typeof campaignMap, k: string) =>
      Object.entries(map).map(([v,d]) => ({
        [k]: v, ...d,
        conversionClick:    d.sessions > 0 ? Math.round((d.clicks/d.sessions)*100) : 0,
        conversionPurchase: d.sessions > 0 ? Math.round((d.purchases/d.sessions)*100) : 0,
      })).sort((a,b) => b.sessions-a.sessions);

    return NextResponse.json({
      date, window: win,
      activeNow: activeNow||0, active30m: active30m||0,
      totalSessionsToday: totalSessionsToday||0,
      totalSessionsInWindow: totalInWindow,
      totalClicks: Object.values(checkoutClicks).reduce((a,b)=>a+b,0),
      sections, checkoutClicks,
      purchases: { count: purchaseCount, revenue: purchaseRevenue },
      campaigns: toArr(campaignMap, 'utmCampaign'),
      adsets:    toArr(adsetMap,    'adsetId'),
      creatives: toArr(contentMap,  'utmContent'),
      sessions,
      showingMax: totalInWindow > 100,
      updatedAt: new Date().toISOString(),
    });

  } catch (err) {
    console.error('[funnel-dashboard]', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal error' }, { status: 500 });
  }
}
