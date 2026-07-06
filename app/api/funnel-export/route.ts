import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const now90s = () => new Date(Date.now() - 90_000).toISOString();
const now30m = () => new Date(Date.now() - 30 * 60_000).toISOString();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token  = searchParams.get('token');
  const date   = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const format = searchParams.get('type') || 'json';

  if (!token || token !== process.env.FUNNEL_DASHBOARD_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: sessions } = await supabaseAdmin
    .from('funnel_sessions')
    .select('session_id, first_seen, last_seen, utm_source, utm_campaign, utm_term, utm_content, campaign_id, adset_id, ad_id, placement, site_source_name, max_section_title, max_section_order, clicks_count, purchased, revenue')
    .eq('date', date)
    .order('last_seen', { ascending: false });

  const t90 = now90s();
  const t30 = now30m();

  const rows = (sessions || []).map((s: Record<string, unknown>) => ({
    date,
    sessionId:       s.session_id,
    firstSeen:       s.first_seen,
    lastSeen:        s.last_seen,
    status: String(s.last_seen) >= t90 ? 'online' : String(s.last_seen) >= t30 ? 'recente' : 'inativo',
    utmSource:       s.utm_source,
    utmCampaign:     s.utm_campaign,
    utmTerm:         s.utm_term,
    utmContent:      s.utm_content,
    campaignId:      s.campaign_id,
    adsetId:         s.adset_id,
    adId:            s.ad_id,
    placement:       s.placement,
    siteSourceName:  s.site_source_name,
    maxSectionTitle: s.max_section_title,
    maxSectionOrder: s.max_section_order,
    clicksCount:     s.clicks_count,
    purchased:       s.purchased,
    revenue:         s.revenue,
  }));

  if (format === 'csv') {
    if (rows.length === 0) {
      return new NextResponse('Sem dados para exportar', {
        headers: { 'Content-Type': 'text/plain' },
      });
    }
    const headers = Object.keys(rows[0]).join(',');
    const csvRows = rows.map((r) => Object.values(r).map((v) => `"${v ?? ''}"`).join(','));
    const csv = [headers, ...csvRows].join('\n');
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="funil-${date}.csv"`,
      },
    });
  }

  return NextResponse.json(rows);
}
