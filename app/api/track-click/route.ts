import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getBrazilDate } from '@/lib/brazilDate';

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await request.json(); }
  catch { return NextResponse.json({ ok: false }, { status: 400 }); }

  const {
    sessionId, checkoutType, checkoutLabel, checkoutPrice, buttonLocation,
    targetUrl, currentSectionTitle, currentSectionOrder,
    utmSource, utmMedium, utmCampaign, utmContent, utmTerm,
    campaignId, adsetId, adId,
  } = body as Record<string, string | number | undefined>;

  if (!sessionId || !checkoutType) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const today = getBrazilDate();
  const now   = new Date().toISOString();

  try {
    // Upsert session — only real columns (no clicks_count)
    const { data: existing } = await supabaseAdmin
      .from('funnel_sessions')
      .select('id, utm_source, utm_campaign')
      .eq('session_id', sessionId)
      .eq('date', today)
      .single();

    if (existing) {
      const hasUtms = Boolean(existing.utm_source || existing.utm_campaign);
      const update: Record<string, unknown> = { last_seen: now, page_status: 'active' };
      if (!hasUtms) {
        Object.assign(update, {
          utm_source: utmSource, utm_medium: utmMedium,
          utm_campaign: utmCampaign, utm_content: utmContent, utm_term: utmTerm,
          campaign_id: campaignId, adset_id: adsetId, ad_id: adId,
        });
      }
      await supabaseAdmin.from('funnel_sessions').update(update)
        .eq('session_id', sessionId).eq('date', today);
    } else {
      await supabaseAdmin.from('funnel_sessions').insert({
        session_id: sessionId, date: today,
        first_seen: now, last_seen: now, page_status: 'active',
        utm_source: utmSource, utm_medium: utmMedium,
        utm_campaign: utmCampaign, utm_content: utmContent, utm_term: utmTerm,
        campaign_id: campaignId, adset_id: adsetId, ad_id: adId,
      });
    }

    // Insert click event — max 20 per session/day
    const { count: existingClicks } = await supabaseAdmin
      .from('funnel_click_events')
      .select('*', { count: 'exact', head: true })
      .eq('session_id', sessionId)
      .eq('date', today);

    if ((existingClicks || 0) < 20) {
      const priceNum = typeof checkoutPrice === 'number' ? checkoutPrice
        : typeof checkoutPrice === 'string' ? parseFloat(checkoutPrice) : null;

      await supabaseAdmin.from('funnel_click_events').insert({
        session_id:            sessionId,
        date:                  today,
        checkout_type:         checkoutType,
        checkout_label:        checkoutLabel   || null,
        checkout_price:        priceNum,
        button_location:       buttonLocation  || null,
        target_url:            targetUrl       || null,
        current_section_title: currentSectionTitle || null,
        current_section_order: currentSectionOrder ? Number(currentSectionOrder) : null,
        utm_source:            utmSource       || null,
        utm_medium:            utmMedium       || null,
        utm_campaign:          utmCampaign     || null,
        utm_content:           utmContent      || null,
        utm_term:              utmTerm         || null,
        campaign_id:           campaignId      || null,
        adset_id:              adsetId         || null,
        ad_id:                 adId            || null,
        clicked_at:            now,
      });
    }
  } catch (err) {
    console.error('[track-click]', err instanceof Error ? err.message : err);
  }

  return NextResponse.json({ ok: true });
}
