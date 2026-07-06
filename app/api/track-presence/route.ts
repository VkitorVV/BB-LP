import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await request.json(); }
  catch { return NextResponse.json({ ok: false }, { status: 400 }); }

  const {
    sessionId, utmSource, utmMedium, utmCampaign, utmContent, utmTerm,
    campaignId, adsetId, adId, placement, siteSourceName,
  } = body as Record<string, string | undefined>;

  if (!sessionId) return NextResponse.json({ ok: false }, { status: 400 });

  const today = new Date().toISOString().split('T')[0];
  const now   = new Date().toISOString();

  try {
    const { data: existing } = await supabaseAdmin
      .from('funnel_sessions')
      .select('id, utm_source, utm_campaign')
      .eq('session_id', sessionId)
      .eq('date', today)
      .single();

    if (existing) {
      // Update presence — restore active status, preserve original UTMs
      const hasUtms = Boolean(existing.utm_source || existing.utm_campaign);
      const update: Record<string, unknown> = {
        last_seen:   now,
        page_status: 'active',
        left_at:     null,
      };
      if (!hasUtms) {
        Object.assign(update, {
          utm_source: utmSource, utm_medium: utmMedium,
          utm_campaign: utmCampaign, utm_content: utmContent, utm_term: utmTerm,
          campaign_id: campaignId, adset_id: adsetId, ad_id: adId,
          placement, site_source_name: siteSourceName,
        });
      }
      await supabaseAdmin
        .from('funnel_sessions')
        .update(update)
        .eq('session_id', sessionId)
        .eq('date', today);
    } else {
      await supabaseAdmin
        .from('funnel_sessions')
        .insert({
          session_id: sessionId, date: today,
          first_seen: now, last_seen: now, page_status: 'active',
          utm_source: utmSource, utm_medium: utmMedium,
          utm_campaign: utmCampaign, utm_content: utmContent, utm_term: utmTerm,
          campaign_id: campaignId, adset_id: adsetId, ad_id: adId,
          placement, site_source_name: siteSourceName,
        });
    }
  } catch (err) {
    console.error('[track-presence]', err);
  }

  return NextResponse.json({ ok: true });
}
