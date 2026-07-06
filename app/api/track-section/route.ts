import { NextRequest, NextResponse } from 'next/server';
import { redis, TTL_7D, TTL_30M } from '@/lib/redis';

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await request.json(); }
  catch { return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 }); }

  const { sessionId, sectionId, sectionTitle, sectionOrder,
          utmCampaign, utmContent, utmSource, utmMedium, utmTerm,
          campaignId, adsetId, adId, placement, siteSourceName, timestamp } =
    body as Record<string, string | number | undefined>;

  if (!sessionId || typeof sessionId !== 'string') return NextResponse.json({ ok: false }, { status: 400 });
  if (!sectionId || typeof sectionId !== 'string') return NextResponse.json({ ok: false }, { status: 400 });
  if (!sectionTitle || typeof sectionTitle !== 'string') return NextResponse.json({ ok: false }, { status: 400 });

  const order    = typeof sectionOrder === 'number' ? sectionOrder : parseInt(String(sectionOrder || 0), 10);
  const ts       = typeof timestamp === 'number' ? timestamp : Date.now();
  const campaign = (utmCampaign as string | undefined) || 'direct';
  const content  = (utmContent  as string | undefined) || 'none';

  const sessionData = JSON.stringify({
    lastSection: sectionId, lastOrder: order,
    utmSource, utmMedium, utmCampaign, utmContent, utmTerm,
    campaignId, adsetId, adId, placement, siteSourceName, updatedAt: ts,
  });

  try {
    await Promise.all([
      redis.incr(`funnel:section:${sectionId}:count`).then(() =>
        redis.expire(`funnel:section:${sectionId}:count`, TTL_7D)),

      redis.zadd('funnel:sessions:maxSection', { score: order, member: sessionId }).then(() =>
        redis.expire('funnel:sessions:maxSection', TTL_7D)),

      redis.incr(`funnel:section:${sectionId}:campaign:${campaign}`).then(() =>
        redis.expire(`funnel:section:${sectionId}:campaign:${campaign}`, TTL_7D)),

      redis.incr(`funnel:section:${sectionId}:content:${content}`).then(() =>
        redis.expire(`funnel:section:${sectionId}:content:${content}`, TTL_7D)),

      redis.set(`funnel:session:${sessionId}`, sessionData, { ex: TTL_30M }),

      redis.pfadd(`funnel:campaign:${campaign}:sessions`, sessionId).then(() =>
        redis.expire(`funnel:campaign:${campaign}:sessions`, TTL_7D)),

      redis.pfadd(`funnel:content:${content}:sessions`, sessionId).then(() =>
        redis.expire(`funnel:content:${content}:sessions`, TTL_7D)),
    ]);
  } catch (err) {
    console.error('[track-section] Redis error', err);
  }

  return NextResponse.json({ ok: true });
}
