import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getBrazilDate } from '@/lib/brazilDate';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token  = searchParams.get('token');
  const date   = searchParams.get('date') || getBrazilDate();
  const format = (searchParams.get('type') || 'json').toLowerCase();

  if (!token || token !== process.env.FUNNEL_DASHBOARD_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // â”€â”€ 1. Buscar dados do Supabase â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [sessionsRes, sectionEventsRes, clickEventsRes, purchasesRes] = await Promise.all([
    supabaseAdmin
      .from('funnel_sessions')
      .select('session_id,date,first_seen,last_seen,left_at,page_status,utm_source,utm_medium,utm_campaign,utm_content,utm_term,campaign_id,adset_id,ad_id,placement,site_source_name,max_section_order,max_section_title')
      .eq('date', date)
      .order('last_seen', { ascending: false }),

    supabaseAdmin
      .from('funnel_section_events')
      .select('session_id,section_id,section_title,section_order,reach_method,source_cta_label,source_section_title,created_at')
      .eq('date', date)
      .order('section_order', { ascending: true }),

    supabaseAdmin
      .from('funnel_click_events')
      .select('session_id,checkout_type,checkout_label,checkout_price,button_location,click_kind,cta_label,source_section_title,target_section_title,current_section_title,clicked_at,utm_campaign,utm_content,utm_term')
      .eq('date', date)
      .order('clicked_at', { ascending: true }),

    supabaseAdmin
      .from('funnel_purchases')
      .select('session_id,payment_id,status,checkout_title,amount,utm_campaign,utm_content,utm_term,approved_at,created_at')
      .eq('date', date)
      .order('created_at', { ascending: false }),
  ]);

  const sessions     = (sessionsRes.data    || []) as Record<string, unknown>[];
  const sectionEvts  = (sectionEventsRes.data || []) as Record<string, unknown>[];
  const clickEvts    = (clickEventsRes.data  || []) as Record<string, unknown>[];
  const purchases    = (purchasesRes.data    || []) as Record<string, unknown>[];

  // Debug log
  console.log('[funnel-export]', { date, type: format, sessionsFound: sessions.length, sectionEventsFound: sectionEvts.length, clickEventsFound: clickEvts.length, purchasesFound: purchases.length });

  // â”€â”€ 2. Build per-session indexes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const sectionsBySession: Record<string, Record<string, unknown>[]> = {};
  sectionEvts.forEach(e => {
    const sid = e.session_id as string;
    if (!sectionsBySession[sid]) sectionsBySession[sid] = [];
    sectionsBySession[sid].push(e);
  });

  const clicksBySession: Record<string, Record<string, unknown>[]> = {};
  clickEvts.forEach(e => {
    const sid = e.session_id as string;
    if (!clicksBySession[sid]) clicksBySession[sid] = [];
    clicksBySession[sid].push(e);
  });

  const purchaseBySession: Record<string, Record<string, unknown>> = {};
  purchases.forEach(p => {
    const sid = p.session_id as string;
    if (sid && !purchaseBySession[sid]) purchaseBySession[sid] = p;
  });

  // â”€â”€ 3. JSON response â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (format === 'json') {
    const body = JSON.stringify({
      date,
      sessionsCount: sessions.length,
      sessions:      sessions.map(s => {
        const sid    = s.session_id as string;
        const sects  = (sectionsBySession[sid] || []).sort((a, b) => (a.section_order as number) - (b.section_order as number));
        const clicks = clicksBySession[sid] || [];
        const purch  = purchaseBySession[sid] || null;
        const checkoutClicks  = clicks.filter(c => !c.click_kind || c.click_kind === 'checkout');
        const internalClicks  = clicks.filter(c => c.click_kind === 'internal_cta');
        const lastCk = checkoutClicks[checkoutClicks.length - 1] || null;
        return {
          sessionId:               sid,
          date:                    s.date,
          firstSeen:               s.first_seen,
          lastSeen:                s.last_seen,
          leftAt:                  s.left_at,
          pageStatus:              s.page_status,
          utmSource:               s.utm_source,
          utmMedium:               s.utm_medium,
          utmCampaign:             s.utm_campaign,
          utmContent:              s.utm_content,
          utmTerm:                 s.utm_term,
          campaignId:              s.campaign_id,
          adsetId:                 s.adset_id,
          adId:                    s.ad_id,
          placement:               s.placement,
          siteSourceName:          s.site_source_name,
          maxSectionTitle:         s.max_section_title,
          maxSectionOrder:         s.max_section_order,
          sectionsReached:         sects.map(e => e.section_title).join(' > '),
          sectionsDetail:          sects,
          clicksCount:             clicks.length,
          checkoutClicksCount:     checkoutClicks.length,
          internalCtaClicksCount:  internalClicks.length,
          lastCheckoutLabel:       lastCk?.checkout_label || null,
          lastCheckoutPrice:       lastCk?.checkout_price || null,
          lastCheckoutType:        lastCk?.checkout_type  || null,
          purchased:               Boolean(purch),
          purchaseValue:           (purch?.amount as number | null) || null,
          transactionId:           (purch?.payment_id as string | null) || null,
          purchasedAt:             (purch?.approved_at as string | null) || (purch?.created_at as string | null) || null,
        };
      }),
      sectionEvents: sectionEvts,
      clickEvents:   clickEvts,
      purchases,
    }, null, 2);

    return new NextResponse(body, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="funil-mapa-degrade-${date}.json"`,
      },
    });
  }

  // â”€â”€ 4. CSV response â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const DELIM = ';';
  const CRLF  = '\r\n';
  const BOM   = '\uFEFF';

  const CSV_HEADERS = [
    'date','sessionId','firstSeen','lastSeen','leftAt','pageStatus',
    'utmSource','utmMedium','utmCampaign','utmTerm','utmContent',
    'campaignId','adsetId','adId','placement','siteSourceName',
    'maxSectionTitle','maxSectionOrder','sectionsReached','lastSection',
    'clicksCount','checkoutClicksCount','internalCtaClicksCount',
    'lastCheckoutLabel','lastCheckoutPrice','lastCheckoutType',
    'purchased','purchaseValue','transactionId','purchasedAt',
  ];

  const escape = (v: unknown): string => {
    if (v === null || v === undefined) return '""';
    const str = String(v).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows: string[] = [CSV_HEADERS.map(h => `"${h}"`).join(DELIM)];

  if (sessions.length === 0) {
    rows.push(`"sem dados"${DELIM.repeat(CSV_HEADERS.length - 1)}`);
  } else {
    sessions.forEach(s => {
      const sid    = s.session_id as string;
      const sects  = (sectionsBySession[sid] || []).sort((a, b) => (a.section_order as number) - (b.section_order as number));
      const clicks = clicksBySession[sid] || [];
      const purch  = purchaseBySession[sid] || null;
      const checkoutClicks = clicks.filter(c => !c.click_kind || c.click_kind === 'checkout');
      const internalClicks = clicks.filter(c => c.click_kind === 'internal_cta');
      const lastCk = checkoutClicks[checkoutClicks.length - 1] || null;
      const sectionsReached = sects.map(e => e.section_title).join(' > ');
      const lastSection = sects.length > 0 ? sects[sects.length - 1].section_title : '';

      rows.push([
        escape(date),
        escape(sid),
        escape(s.first_seen),
        escape(s.last_seen),
        escape(s.left_at),
        escape(s.page_status),
        escape(s.utm_source),
        escape(s.utm_medium),
        escape(s.utm_campaign),
        escape(s.utm_term),
        escape(s.utm_content),
        escape(s.campaign_id),
        escape(s.adset_id),
        escape(s.ad_id),
        escape(s.placement),
        escape(s.site_source_name),
        escape(s.max_section_title),
        escape(s.max_section_order),
        escape(sectionsReached),
        escape(lastSection),
        escape(clicks.length),
        escape(checkoutClicks.length),
        escape(internalClicks.length),
        escape(lastCk?.checkout_label),
        escape(lastCk?.checkout_price),
        escape(lastCk?.checkout_type),
        escape(Boolean(purch)),
        escape(purch?.amount),
        escape(purch?.payment_id),
        escape(purch?.approved_at || purch?.created_at),
      ].join(DELIM));
    });
  }

  return new NextResponse(BOM + rows.join(CRLF), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="funil-mapa-degrade-${date}.csv"`,
    },
  });
}
