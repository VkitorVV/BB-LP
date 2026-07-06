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
      .select('*')
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
      .select('checkout_type,button_location,created_at')
      .eq('session_id', sessionId)
      .eq('date', date)
      .order('created_at', { ascending: true }),
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
    session:       sessionRes.data  || null,
    sectionsReached: sectionsRes.data || [],
    clicks:        clicksRes.data   || [],
    purchase:      purchaseRes.data || null,
  });
}
