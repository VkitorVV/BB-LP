import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: NextRequest) {
  let body: { token?: string; date?: string };
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  if (!body.token || body.token !== process.env.FUNNEL_DASHBOARD_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const date = body.date || new Date().toISOString().split('T')[0];

  await Promise.all([
    supabaseAdmin.from('funnel_section_events').delete().eq('date', date),
    supabaseAdmin.from('funnel_click_events').delete().eq('date', date),
    supabaseAdmin.from('funnel_purchases').delete().eq('date', date),
    supabaseAdmin.from('funnel_sessions').delete().eq('date', date),
  ]);

  return NextResponse.json({ ok: true, cleared: date });
}
