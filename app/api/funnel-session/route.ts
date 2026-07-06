import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token     = searchParams.get('token');
  const sessionId = searchParams.get('sessionId');
  const date      = searchParams.get('date') || new Date().toISOString().split('T')[0];

  if (!token || token !== process.env.FUNNEL_DASHBOARD_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!sessionId) return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });

  const [{ data: session }, { data: sectionEvents }, { data: clickEvents }, { data: purchase }] =
    await Promise.all([
      supabaseAdmin.from('funnel_sessions').select('*').eq('session_id', sessionId).eq('date', date).single(),
      supabaseAdmin.from('funnel_section_events').select('*').eq('session_id', sessionId).eq('date', date).order('section_order'),
      supabaseAdmin.from('funnel_click_events').select('*').eq('session_id', sessionId).eq('date', date).order('created_at'),
      supabaseAdmin.from('funnel_purchases').select('*').eq('session_id', sessionId).eq('date', date).single(),
    ]);

  return NextResponse.json({ session, sectionEvents: sectionEvents || [], clickEvents: clickEvents || [], purchase });
}
