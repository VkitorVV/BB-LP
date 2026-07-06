import { NextRequest, NextResponse } from 'next/server';
import { rPipeline } from '@/lib/redis';

const TTL_7D  = 7 * 24 * 60 * 60;
const TTL_30M = 30 * 60;

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const {
    sessionId,
    checkoutType,
    buttonLocation,
    utmCampaign,
    utmContent,
    utmSource,
    utmMedium,
    utmTerm,
    campaignId,
    adsetId,
    adId,
    timestamp,
  } = body as Record<string, string | number | undefined>;

  if (!sessionId || typeof sessionId !== 'string') {
    return NextResponse.json({ ok: false, error: 'Missing sessionId' }, { status: 400 });
  }
  if (!checkoutType || typeof checkoutType !== 'string') {
    return NextResponse.json({ ok: false, error: 'Missing checkoutType' }, { status: 400 });
  }

  const campaign = utmCampaign || 'direct';
  const content  = utmContent  || 'none';
  const location = buttonLocation || 'unknown';
  const ts       = typeof timestamp === 'number' ? timestamp : Date.now();

  const sessionData = JSON.stringify({
    lastClick:    checkoutType,
    utmSource,
    utmMedium,
    utmCampaign,
    utmContent,
    utmTerm,
    campaignId,
    adsetId,
    adId,
    updatedAt: ts,
  });

  const commands: unknown[][] = [
    // Contador por checkoutType
    ['INCR', `funnel:click:${checkoutType}:count`],
    ['EXPIRE', `funnel:click:${checkoutType}:count`, TTL_7D],

    // Contador por buttonLocation
    ['INCR', `funnel:click:location:${location}:count`],
    ['EXPIRE', `funnel:click:location:${location}:count`, TTL_7D],

    // Contador por checkoutType + campanha
    ['INCR', `funnel:click:${checkoutType}:campaign:${campaign}`],
    ['EXPIRE', `funnel:click:${checkoutType}:campaign:${campaign}`, TTL_7D],

    // Contador por checkoutType + content
    ['INCR', `funnel:click:${checkoutType}:content:${content}`],
    ['EXPIRE', `funnel:click:${checkoutType}:content:${content}`, TTL_7D],

    // Sessão ativa
    ['SET', `funnel:session:${sessionId}`, sessionData, 'EX', TTL_30M],

    // Sessões únicas com clique por campanha
    ['PFADD', `funnel:campaign:${campaign}:clicks`, sessionId],
    ['EXPIRE', `funnel:campaign:${campaign}:clicks`, TTL_7D],

    // Sessões únicas com clique por content
    ['PFADD', `funnel:content:${content}:clicks`, sessionId],
    ['EXPIRE', `funnel:content:${content}:clicks`, TTL_7D],
  ];

  try {
    await rPipeline(commands);
  } catch (err) {
    console.error('[track-click] Redis error', err);
  }

  return NextResponse.json({ ok: true });
}
