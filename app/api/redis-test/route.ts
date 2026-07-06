import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token || token !== process.env.FUNNEL_DASHBOARD_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const REDIS_URL   = process.env.UPSTASH_REDIS_REST_URL;
  const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

  const result: Record<string, unknown> = {
    hasUrl:   Boolean(REDIS_URL),
    hasToken: Boolean(REDIS_TOKEN),
    urlPrefix: REDIS_URL ? REDIS_URL.slice(0, 30) + '...' : null,
  };

  if (!REDIS_URL || !REDIS_TOKEN) {
    return NextResponse.json({ ...result, error: 'Missing env vars' }, { status: 500 });
  }

  // Testa PING
  try {
    const pingRes = await fetch(`${REDIS_URL}/ping`, {
      headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
      cache: 'no-store',
    });
    const pingBody = await pingRes.text();
    result.pingStatus = pingRes.status;
    result.pingBody   = pingBody;
    result.pingOk     = pingRes.ok;
  } catch (err) {
    result.pingError = err instanceof Error ? err.message : String(err);
  }

  // Testa SET simples
  try {
    const setRes = await fetch(`${REDIS_URL}/set/redis_test_key/hello`, {
      headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
      cache: 'no-store',
    });
    const setBody = await setRes.text();
    result.setStatus = setRes.status;
    result.setBody   = setBody;
  } catch (err) {
    result.setError = err instanceof Error ? err.message : String(err);
  }

  return NextResponse.json(result);
}
