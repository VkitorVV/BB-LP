import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getBrazilDate } from '@/lib/brazilDate';

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await request.json(); }
  catch { return NextResponse.json({ ok: false }, { status: 400 }); }

  const {
    sessionId, sectionId, sectionTitle, sectionOrder,
    utmSource, utmMedium, utmCampaign, utmContent, utmTerm,
    campaignId, adsetId, adId, placement, siteSourceName,
  } = body as Record<string, string | number | undefined>;

  if (!sessionId || !sectionId || !sectionTitle) {
    return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 });
  }

  const order = typeof sectionOrder === 'number' ? sectionOrder : parseInt(String(sectionOrder || 0), 10);
  const today = getBrazilDate();
  const now   = new Date().toISOString();

  try {
    // ── Upsert sessão (sempre atualiza last_seen) ─────────────────────────
    const { data: existing } = await supabaseAdmin
      .from('funnel_sessions')
      .select('id, max_section_order, utm_source, utm_campaign')
      .eq('session_id', sessionId)
      .eq('date', today)
      .single();

    if (existing) {
      const updates: Record<string, unknown> = { last_seen: now, page_status: 'active' };
      if (order > (existing.max_section_order || 0)) {
        updates.max_section_order = order;
        updates.max_section_title = sectionTitle;
      }
      // Fill UTMs if still empty
      if (!existing.utm_source && !existing.utm_campaign) {
        Object.assign(updates, {
          utm_source: utmSource, utm_medium: utmMedium,
          utm_campaign: utmCampaign, utm_content: utmContent, utm_term: utmTerm,
          campaign_id: campaignId, adset_id: adsetId, ad_id: adId,
          placement, site_source_name: siteSourceName,
        });
      }
      await supabaseAdmin
        .from('funnel_sessions')
        .update(updates)
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
          max_section_order: order, max_section_title: sectionTitle,
        });
    }

    // ── Upsert evento de seção (sem duplicata por session+date+section) ───
    await supabaseAdmin
      .from('funnel_section_events')
      .upsert({
        session_id:    sessionId,
        date:          today,
        section_id:    sectionId as string,
        section_title: sectionTitle as string,
        section_order: order,
      }, { onConflict: 'session_id,date,section_id' });

  } catch (err) {
    console.error('[track-section]', err instanceof Error ? err.message : err);
  }

  return NextResponse.json({ ok: true });
}
