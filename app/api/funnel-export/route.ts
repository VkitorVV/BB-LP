import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getBrazilDate } from '@/lib/brazilDate';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token  = searchParams.get('token');
  const date   = searchParams.get('date') || getBrazilDate();
  const format = searchParams.get('type') || 'json';

  if (!token || token !== process.env.FUNNEL_DASHBOARD_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data } = await supabaseAdmin
    .from('funnel_sessions')
    .select('session_id,first_seen,last_seen,left_at,page_status,utm_source,utm_campaign,utm_term,utm_content,campaign_id,adset_id,ad_id,placement,site_source_name,max_section_title,max_section_order,clicks_count,purchased,revenue')
    .eq('date', date)
    .order('last_seen', { ascending: false });

  const now = Date.now();
  const t35 = new Date(now - 35_000).toISOString();
  const t30m = new Date(now - 30*60_000).toISOString();

  const rows = (data || []).map((s: Record<string,unknown>) => {
    const ls = String(s.last_seen || '');
    const ps = String(s.page_status || 'active');
    const status = ps === 'left' ? 'saiu' : ls >= t35 ? 'online' : ls >= t30m ? 'recente' : 'inativo';
    return {
      date, sessionId: s.session_id,
      firstSeen: s.first_seen, lastSeen: s.last_seen,
      leftAt: s.left_at || '',
      pageStatus: ps, status,
      secondsSinceLastSeen: Math.floor((now - new Date(ls).getTime()) / 1000),
      utmSource: s.utm_source, utmCampaign: s.utm_campaign,
      utmTerm: s.utm_term, utmContent: s.utm_content,
      campaignId: s.campaign_id, adsetId: s.adset_id, adId: s.ad_id,
      placement: s.placement, siteSourceName: s.site_source_name,
      maxSectionTitle: s.max_section_title, maxSectionOrder: s.max_section_order,
      clicksCount: s.clicks_count, purchased: s.purchased, revenue: s.revenue,
    };
  });

  if (format === 'csv') {
    if (!rows.length) return new NextResponse('Sem dados', { headers: { 'Content-Type': 'text/plain' } });
    const headers = Object.keys(rows[0]).join(',');
    const csv = [headers, ...rows.map(r => Object.values(r).map(v => `"${v ?? ''}"`).join(','))].join('\n');
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="funil-${date}.csv"`,
      },
    });
  }
  return NextResponse.json(rows);
}
