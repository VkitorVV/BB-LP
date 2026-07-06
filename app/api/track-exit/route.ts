import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await request.json(); }
  catch { return NextResponse.json({ ok: false }, { status: 400 }); }

  const { sessionId, timestamp } = body as { sessionId?: string; timestamp?: string };
  if (!sessionId) return NextResponse.json({ ok: false }, { status: 400 });

  const today = new Date().toISOString().split('T')[0];
  const ts    = timestamp || new Date().toISOString();

  try {
    await supabaseAdmin
      .from('funnel_sessions')
      .update({ left_at: ts, page_status: 'left', last_seen: ts })
      .eq('session_id', sessionId)
      .eq('date', today);
  } catch (err) {
    console.error('[track-exit]', err);
  }

  return NextResponse.json({ ok: true });
}
