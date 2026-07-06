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
    sectionId,
    sectionTitle,
    sectionOrder,
    utmCampaign,
    utmContent,
    utmSource,
    utmMedium,
    utmTerm,
    campaignId,
    adsetId,
    adId,
    placement,
    siteSourceName,
    timestamp,
  } = body as Record<string, string | number | undefined>;

  // Validações básicas
  if (!sessionId || typeof sessionId !== 'string') {
    return NextResponse.json({ ok: false, error: 'Missing sessionId' }, { status: 400 });
  }
  if (!sectionId || typeof sectionId !== 'string') {
    return NextResponse.json({ ok: false, error: 'Missing sectionId' }, { status: 400 });
  }
  if (!sectionTitle || typeof sectionTitle !== 'string') {
    return NextResponse.json({ ok: false, error: 'Missing sectionTitle' }, { status: 400 });
  }

  const order   = typeof sectionOrder === 'number' ? sectionOrder : parseInt(String(sectionOrder || 0), 10);
  const ts      = typeof timestamp === 'number' ? timestamp : Date.now();
  const campaign = utmCampaign || 'direct';
  const content  = utmContent  || 'none';

  // Montar sessão (sem dados pessoais)
  const sessionData = JSON.stringify({
    lastSection:    sectionId,
    lastOrder:      order,
    utmSource,
    utmMedium,
    utmCampaign,
    utmContent,
    utmTerm,
    campaignId,
    adsetId,
    adId,
    placement,
    siteSourceName,
    updatedAt: ts,
  });

  const commands: unknown[][] = [
    // Contador por seção
    ['INCR', `funnel:section:${sectionId}:count`],
    ['EXPIRE', `funnel:section:${sectionId}:count`, TTL_7D],

    // Maior seção por sessão (usar sorted set com order como score)
    ['ZADD', 'funnel:sessions:maxSection', 'GT', order, sessionId],
    ['EXPIRE', 'funnel:sessions:maxSection', TTL_7D],

    // Contador por seção + campanha
    ['INCR', `funnel:section:${sectionId}:campaign:${campaign}`],
    ['EXPIRE', `funnel:section:${sectionId}:campaign:${campaign}`, TTL_7D],

    // Contador por seção + content (criativo)
    ['INCR', `funnel:section:${sectionId}:content:${content}`],
    ['EXPIRE', `funnel:section:${sectionId}:content:${content}`, TTL_7D],

    // Sessão ativa (TTL 30min, renovado a cada evento)
    ['SET', `funnel:session:${sessionId}`, sessionData, 'EX', TTL_30M],

    // Sessões únicas por campanha (HyperLogLog)
    ['PFADD', `funnel:campaign:${campaign}:sessions`, sessionId],
    ['EXPIRE', `funnel:campaign:${campaign}:sessions`, TTL_7D],

    // Sessões únicas por content
    ['PFADD', `funnel:content:${content}:sessions`, sessionId],
    ['EXPIRE', `funnel:content:${content}:sessions`, TTL_7D],
  ];

  try {
    await rPipeline(commands);
  } catch (err) {
    console.error('[track-section] Redis error', err);
    // Falha silenciosa — não impacta o usuário
  }

  return NextResponse.json({ ok: true });
}
