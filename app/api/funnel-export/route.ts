import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

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
    .select('session_id, first_seen, last_seen, utm_source, utm_campaign, utm_term, utm_content, campaign_id, adset_id, ad_id, max_section_title, max_section_order, clicks_count, purchased, revenue')
    .eq('date', date)
    .order('last_seen', { ascending: false });

  const rows = (sessions || []).map((s: Record<string, unknown>) => ({
    date,
    sessionId:       s.session_id,
    firstSeen:       s.first_seen,
    lastSeen:        s.last_seen,
    utmSource:       s.utm_source,
    utmCampaign:     s.utm_campaign,
    utmTerm:         s.utm_term,
    utmContent:      s.utm_content,
    campaignId:      s.campaign_id,
    adsetId:         s.adset_id,
    adId:            s.ad_id,
    maxSectionTitle: s.max_section_title,
    maxSectionOrder: s.max_section_order,
    clicksCount:     s.clicks_count,
    purchased:       s.purchased,
    revenue:         s.revenue,
  }));

  if (format === 'csv') {
    const headers = Object.keys(rows[0] || {}).join(',');
    const csvRows = rows.map((r) => Object.values(r).map((v) => `"${v ?? ''}"`).join(','));
    const csv = [headers, ...csvRows].join('\n');
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="funil-${date}.csv"`,
      },
    });
  }

  return NextResponse.json(rows);
}
