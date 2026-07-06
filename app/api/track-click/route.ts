import { NextRequest, NextResponse } from 'next/server';
import { redis, TTL_7D, TTL_30M } from '@/lib/redis';

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await request.json(); }
  catch { return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 }); }

  const { sessionId, checkoutType, buttonLocation,
          utmCampaign, utmContent, utmSource, utmMedium, utmTerm,
          campaignId, adsetId, adId, timestamp } =
    body as Record<string, string | number | undefined>;

  if (!sessionId || typeof sessionId !== 'string') return NextResponse.json({ ok: false }, { status: 400 });
  if (!checkoutType || typeof checkoutType !== 'string') return NextResponse.json({ ok: false }, { status: 400 });

  const campaign = (utmCampaign as string | undefined) || 'direct';
  const content  = (utmContent  as string | undefined) || 'none';
  const location = (buttonLocation as string | undefined) || 'unknown';
  const ts       = typeof timestamp === 'number' ? timestamp : Date.now();

  const sessionData = JSON.stringify({
    lastClick: checkoutType, utmSource, utmMedium, utmCampaign, utmContent,
    utmTerm, campaignId, adsetId, adId, updatedAt: ts,
  });

  try {
    await Promise.all([
      redis.incr(`funnel:click:${checkoutType}:count`).then(() =>
        redis.expire(`funnel:click:${checkoutType}:count`, TTL_7D)),

      redis.incr(`funnel:click:location:${location}:count`).then(() =>
        redis.expire(`funnel:click:location:${location}:count`, TTL_7D)),

      redis.incr(`funnel:click:${checkoutType}:campaign:${campaign}`).then(() =>
        redis.expire(`funnel:click:${checkoutType}:campaign:${campaign}`, TTL_7D)),

      redis.incr(`funnel:click:${checkoutType}:content:${content}`).then(() =>
        redis.expire(`funnel:click:${checkoutType}:content:${content}`, TTL_7D)),

      redis.set(`funnel:session:${sessionId}`, sessionData, { ex: TTL_30M }),

      redis.pfadd(`funnel:campaign:${campaign}:clicks`, sessionId).then(() =>
        redis.expire(`funnel:campaign:${campaign}:clicks`, TTL_7D)),

      redis.pfadd(`funnel:content:${content}:clicks`, sessionId).then(() =>
        redis.expire(`funnel:content:${content}:clicks`, TTL_7D)),
    ]);
  } catch (err) {
    console.error('[track-click] Redis error', err);
  }

  return NextResponse.json({ ok: true });
}
