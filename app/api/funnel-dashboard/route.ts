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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  if (!token || token !== process.env.FUNNEL_DASHBOARD_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();

  try {
    // Sessões ativas (30min)
    const { count: activeCount } = await supabaseAdmin
      .from('funnel_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('date', date)
      .gte('last_seen', thirtyMinAgo);

    // Total sessões do dia
    const { count: totalSessions } = await supabaseAdmin
      .from('funnel_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('date', date);

    // Seções — contagem de sessões únicas por section_id
    const { data: sectionData } = await supabaseAdmin
      .from('funnel_section_events')
      .select('section_id, section_title, section_order')
      .eq('date', date);

    const sectionCounts: Record<string, number> = {};
    (sectionData || []).forEach((row: { section_id: string }) => {
      sectionCounts[row.section_id] = (sectionCounts[row.section_id] || 0) + 1;
    });

    const heroCount = sectionCounts['hero'] || 1;
    const sections = SECTION_ORDER.map((s, i) => {
      const reached = sectionCounts[s.id] || 0;
      const prevId  = i > 0 ? SECTION_ORDER[i - 1].id : s.id;
      const prev    = sectionCounts[prevId] || reached;
      return {
        ...s,
        reached,
        percentOfHero:    Math.round((reached / heroCount) * 100),
        dropFromPrevious: prev > 0 ? Math.round(((prev - reached) / prev) * 100) : 0,
      };
    });

    // Cliques
    const { data: clickData } = await supabaseAdmin
      .from('funnel_click_events')
      .select('checkout_type')
      .eq('date', date);

    const checkoutClicks: Record<string, number> = {
      plano_basico_popup_open: 0,
      plano_basico: 0,
      kit_completo: 0,
      kit_desconto_popup: 0,
    };
    (clickData || []).forEach((row: { checkout_type: string }) => {
      if (checkoutClicks[row.checkout_type] !== undefined) {
        checkoutClicks[row.checkout_type]++;
      }
    });

    // Compras
    const { data: purchaseData } = await supabaseAdmin
      .from('funnel_purchases')
      .select('amount')
      .eq('date', date);

    const purchaseCount   = (purchaseData || []).length;
    const purchaseRevenue = (purchaseData || []).reduce((sum: number, r: { amount: number }) => sum + (r.amount || 0), 0);

    // Campanhas / Adsets / Criativos
    const { data: sessionData } = await supabaseAdmin
      .from('funnel_sessions')
      .select('utm_campaign, utm_content, adset_id, session_id, clicks_count, purchased, revenue')
      .eq('date', date);

    const campaignMap: Record<string, { sessions: number; clicks: number; purchases: number; revenue: number }> = {};
    const contentMap:  Record<string, { sessions: number; clicks: number; purchases: number; revenue: number }> = {};
    const adsetMap:    Record<string, { sessions: number; clicks: number; purchases: number; revenue: number }> = {};

    (sessionData || []).forEach((s: {
      utm_campaign?: string; utm_content?: string; adset_id?: string;
      clicks_count?: number; purchased?: boolean; revenue?: number;
    }) => {
      const camp  = s.utm_campaign || 'direct';
      const cont  = s.utm_content  || 'none';
      const adset = s.adset_id     || 'none';
      for (const [map, key] of [
        [campaignMap, camp],
        [contentMap, cont],
        [adsetMap, adset],
      ] as [typeof campaignMap, string][]) {
        if (!map[key]) map[key] = { sessions: 0, clicks: 0, purchases: 0, revenue: 0 };
        map[key].sessions++;
        map[key].clicks    += s.clicks_count || 0;
        map[key].purchases += s.purchased ? 1 : 0;
        map[key].revenue   += s.revenue    || 0;
      }
    });

    const toArray = (map: typeof campaignMap, keyName: string) =>
      Object.entries(map)
        .map(([k, v]) => ({ [keyName]: k, ...v }))
        .sort((a, b) => b.sessions - a.sessions);

    // Sessões recentes (últimas 50)
    const { data: recentSessions } = await supabaseAdmin
      .from('funnel_sessions')
      .select('session_id, first_seen, last_seen, utm_campaign, utm_source, max_section_title, max_section_order, clicks_count, purchased')
      .eq('date', date)
      .order('last_seen', { ascending: false })
      .limit(50);

    return NextResponse.json({
      date,
      activeUsersLast30Min: activeCount || 0,
      totalSessionsToday:   totalSessions || 0,
      sections,
      checkoutClicks,
      purchases: { count: purchaseCount, revenue: purchaseRevenue },
      campaigns: toArray(campaignMap, 'utmCampaign'),
      adsets:    toArray(adsetMap, 'adsetId'),
      creatives: toArray(contentMap, 'utmContent'),
      sessions:  recentSessions || [],
      updatedAt: new Date().toISOString(),
    });

  } catch (err) {
    console.error('[funnel-dashboard]', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal error' }, { status: 500 });
  }
}
