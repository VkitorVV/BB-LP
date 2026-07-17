import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getBrazilDate } from '@/lib/brazilDate';
import { getCanonicalSectionId, getTrackingSection } from '@/lib/trackingConfig';

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await request.json(); }
  catch { return NextResponse.json({ ok: false }, { status: 400 }); }

  const {
    sessionId, sectionId, sectionTitle, sectionOrder,
    utmSource, utmMedium, utmCampaign, utmContent, utmTerm,
    campaignId, adsetId, adId, placement, siteSourceName,
    reachMethod, sourceCtaLabel, sourceSectionId, sourceSectionTitle, sourceSectionOrder,
    visitorId, visitorFirstSeenAt, visitorLastSeenAt, visitNumber, returnCount, isReturning,
  } = body as Record<string, string | number | boolean | undefined>;

  if (!sessionId || !sectionId || !sectionTitle) {
    return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 });
  }

  const canonicalSection = getTrackingSection(String(sectionId));
  const normalizedSectionId = canonicalSection?.id || getCanonicalSectionId(String(sectionId));
  const normalizedSectionTitle = canonicalSection?.title || String(sectionTitle);
  const order = canonicalSection?.order
    || (typeof sectionOrder === 'number' ? sectionOrder : parseInt(String(sectionOrder || 0), 10));
  const today = getBrazilDate();
  const now   = new Date().toISOString();
  const visitorFields = visitorId ? {
    visitor_id: visitorId,
    visitor_first_seen_at: visitorFirstSeenAt || now,
    visitor_last_seen_at: visitorLastSeenAt || now,
    visit_number: Number(visitNumber || 1),
    return_count: Number(returnCount || 0),
    is_returning: Boolean(isReturning),
  } : {};

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
      Object.assign(updates, visitorFields);
      if (order > (existing.max_section_order || 0)) {
        updates.max_section_order = order;
        updates.max_section_title = normalizedSectionTitle;
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
      const { error: updateError } = await supabaseAdmin
        .from('funnel_sessions')
        .update(updates)
        .eq('session_id', sessionId)
        .eq('date', today);

      if (updateError && Object.keys(visitorFields).length > 0) {
        Object.keys(visitorFields).forEach((key) => delete updates[key]);
        await supabaseAdmin
          .from('funnel_sessions')
          .update(updates)
          .eq('session_id', sessionId)
          .eq('date', today);
      }
    } else {
      const insertPayload: Record<string, unknown> = {
        session_id: sessionId, date: today,
        first_seen: now, last_seen: now, page_status: 'active',
        utm_source: utmSource, utm_medium: utmMedium,
        utm_campaign: utmCampaign, utm_content: utmContent, utm_term: utmTerm,
        campaign_id: campaignId, adset_id: adsetId, ad_id: adId,
        placement, site_source_name: siteSourceName,
        max_section_order: order, max_section_title: normalizedSectionTitle,
        ...visitorFields,
      };

      const { error: insertError } = await supabaseAdmin
        .from('funnel_sessions')
        .insert(insertPayload);

      if (insertError && Object.keys(visitorFields).length > 0) {
        const legacyInsertPayload: Record<string, unknown> = { ...insertPayload };
        Object.keys(visitorFields).forEach((key) => delete legacyInsertPayload[key]);
        await supabaseAdmin
          .from('funnel_sessions')
          .insert(legacyInsertPayload);
      }
    }

    // ── Upsert evento de seção (sem duplicata por session+date+section) ───
    await supabaseAdmin
      .from('funnel_section_events')
      .upsert({
        session_id:           sessionId,
        date:                 today,
        section_id:           normalizedSectionId,
        section_title:        normalizedSectionTitle,
        section_order:        order,
        reach_method:         (reachMethod as string | undefined) || 'scroll',
        source_cta_label:     (sourceCtaLabel as string | undefined) || null,
        source_section_id:    (sourceSectionId as string | undefined) || null,
        source_section_title: (sourceSectionTitle as string | undefined) || null,
        source_section_order: sourceSectionOrder ? Number(sourceSectionOrder) : null,
      }, { onConflict: 'session_id,date,section_id' });

  } catch (err) {
    console.error('[track-section]', err instanceof Error ? err.message : err);
  }

  return NextResponse.json({ ok: true });
}
