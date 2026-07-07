import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getBrazilDate } from '@/lib/brazilDate';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  if (!token || token !== process.env.FUNNEL_DASHBOARD_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const date = searchParams.get('date') || getBrazilDate();

  const [sessionsRes, sectionsRes, clicksRes, purchasesRes] = await Promise.all([
    supabaseAdmin
      .from('funnel_sessions')
      .select('session_id,date,first_seen,last_seen,page_status,max_section_title,utm_campaign,utm_content,utm_term')
      .eq('date', date)
      .order('last_seen', { ascending: false })
      .limit(10),
    supabaseAdmin
      .from('funnel_section_events')
      .select('session_id,date,section_title,section_order,created_at')
      .eq('date', date)
      .order('created_at', { ascending: false })
      .limit(20),
    supabaseAdmin
      .from('funnel_click_events')
      .select('*', { count: 'exact', head: true })
      .eq('date', date),
    supabaseAdmin
      .from('funnel_purchases')
      .select('*', { count: 'exact', head: true })
      .eq('date', date),
  ]);

  // Count separately
  const { count: sessionsCount } = await supabaseAdmin
    .from('funnel_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('date', date);

  const { count: sectionEventsCount } = await supabaseAdmin
    .from('funnel_section_events')
    .select('*', { count: 'exact', head: true })
    .eq('date', date);

  type SessionRow = { session_id: string; date: string; first_seen: string; last_seen: string; page_status: string; max_section_title: string; utm_campaign: string; utm_content: string; utm_term: string };
  type SectionRow = { session_id: string; date: string; section_title: string; section_order: number; created_at: string };

  return NextResponse.json({
    date,
    brazilDateNow: getBrazilDate(),
    serverUtcNow:  new Date().toISOString(),
    sessionsCount:      sessionsCount || 0,
    sectionEventsCount: sectionEventsCount || 0,
    clickEventsCount:   clicksRes.count || 0,
    purchasesCount:     purchasesRes.count || 0,
    latestSessions: (sessionsRes.data || []).map((s: SessionRow) => ({
      sessionIdShort: s.session_id?.slice(0, 8),
      date:           s.date,
      firstSeen:      s.first_seen,
      lastSeen:       s.last_seen,
      pageStatus:     s.page_status,
      maxSectionTitle: s.max_section_title,
      utmCampaign:    s.utm_campaign,
      utmContent:     s.utm_content,
      utmTerm:        s.utm_term,
    })),
    latestSectionEvents: (sectionsRes.data || []).map((e: SectionRow) => ({
      sessionIdShort: e.session_id?.slice(0, 8),
      date:           e.date,
      sectionTitle:   e.section_title,
      sectionOrder:   e.section_order,
      reachedAt:      e.created_at,
    })),
  });
}
