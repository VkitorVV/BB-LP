import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getBrazilDate } from '@/lib/brazilDate';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token     = searchParams.get('token');
  const sessionId = searchParams.get('sessionId');
  const date      = searchParams.get('date') || getBrazilDate();

  if (!token || token !== process.env.FUNNEL_DASHBOARD_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!sessionId) return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });

  const [sessionRes, sectionsRes, clicksRes, purchaseRes] = await Promise.all([
    supabaseAdmin
      .from('funnel_sessions')
      .select('session_id,date,first_seen,last_seen,left_at,page_status,utm_source,utm_medium,utm_campaign,utm_content,utm_term,campaign_id,adset_id,ad_id,placement,site_source_name,max_section_order,max_section_title')
      .eq('session_id', sessionId)
      .eq('date', date)
      .single(),
    supabaseAdmin
      .from('funnel_section_events')
      .select('section_id,section_title,section_order,created_at')
      .eq('session_id', sessionId)
      .eq('date', date)
      .order('section_order', { ascending: true }),
    supabaseAdmin
      .from('funnel_click_events')
      .select('checkout_type,checkout_label,checkout_price,button_location,target_url,current_section_title,current_section_order,clicked_at')
      .eq('session_id', sessionId)
      .eq('date', date)
      .order('clicked_at', { ascending: true }),
    supabaseAdmin
      .from('funnel_purchases')
      .select('checkout_title,amount,created_at')
      .eq('session_id', sessionId)
      .eq('date', date)
      .order('created_at', { ascending: false })
      .limit(1)
      .single(),
  ]);

  return NextResponse.json({
    session:        sessionRes.data  || null,
    sectionsReached: sectionsRes.data || [],
    clicks:         clicksRes.data   || [],
    purchase:       purchaseRes.data || null,
  });
}
