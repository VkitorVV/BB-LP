import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await request.json(); }
  catch { return NextResponse.json({ ok: false }, { status: 400 }); }

  const {
    sessionId, checkoutType, buttonLocation,
    utmSource, utmMedium, utmCampaign, utmContent, utmTerm,
    campaignId, adsetId, adId,
  } = body as Record<string, string | number | undefined>;

  if (!sessionId || !checkoutType) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const today = new Date().toISOString().split('T')[0];

  try {
    // Upsert sessão
    const { data: existingSession } = await supabaseAdmin
      .from('funnel_sessions')
      .select('id, clicks_count')
      .eq('session_id', sessionId)
      .eq('date', today)
      .single();

    if (existingSession) {
      await supabaseAdmin
        .from('funnel_sessions')
        .update({ last_seen: new Date().toISOString(), clicks_count: (existingSession.clicks_count || 0) + 1 })
        .eq('session_id', sessionId)
        .eq('date', today);
    } else {
      await supabaseAdmin
        .from('funnel_sessions')
        .insert({
          session_id: sessionId, date: today, clicks_count: 1,
          utm_source: utmSource, utm_medium: utmMedium,
          utm_campaign: utmCampaign, utm_content: utmContent, utm_term: utmTerm,
          campaign_id: campaignId, adset_id: adsetId, ad_id: adId,
        });
    }

    // Inserir clique — proteção: máx 20 cliques por sessão/dia
    const { count: existingClicks } = await supabaseAdmin
      .from('funnel_click_events')
      .select('*', { count: 'exact', head: true })
      .eq('session_id', sessionId)
      .eq('date', today);

    if ((existingClicks || 0) < 20) {
      await supabaseAdmin
        .from('funnel_click_events')
        .insert({
          session_id: sessionId, date: today,
          checkout_type: checkoutType, button_location: buttonLocation,
        });
    }

  } catch (err) {
    console.error('[track-click]', err);
  }

  return NextResponse.json({ ok: true });
}
