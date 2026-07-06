import { NextRequest, NextResponse } from 'next/server';
import { rPipeline } from '@/lib/redis';

const TTL_7D = 7 * 24 * 60 * 60;

export async function POST(request: NextRequest) {
  console.warn('[WIAPY_WEBHOOK] POST route called');

  // ── 1. Validar Authorization ──────────────────────────────────────────────
  const authHeader = request.headers.get('authorization');

  console.warn('[WIAPY_WEBHOOK] Authorization received', {
    hasAuthHeader: Boolean(authHeader),
    authMatches:   authHeader === process.env.WIAPY_WEBHOOK_SECRET,
  });

  if (authHeader !== process.env.WIAPY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ── 2. Ler payload ────────────────────────────────────────────────────────
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch (err) {
    console.error('[WIAPY_WEBHOOK] Error', err);
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const payment  = payload.payment  as Record<string, unknown> | undefined;
  const customer = payload.customer as Record<string, unknown> | undefined;
  const checkout = payload.checkout as Record<string, unknown> | undefined;
  const tracking = payload.tracking as Record<string, unknown> | undefined;
  const products = payload.products as Record<string, unknown>[] | undefined;

  const status        = payment?.status         as string | undefined;
  const paymentId     = payment?.id             as string | undefined;
  const checkoutTitle = checkout?.title         as string | undefined;
  const amount        = payment?.amount         as number | undefined;
  const utmCampaign   = tracking?.utm_campaign  as string | undefined;
  const utmContent    = tracking?.utm_content   as string | undefined;
  const utmTerm       = tracking?.utm_term      as string | undefined;

  console.warn('[WIAPY_WEBHOOK] Payload parsed', {
    paymentStatus: status,
    paymentId,
    amount,
    checkoutTitle,
    productsCount: products?.length || 0,
  });

  // ── 3. Processar apenas pagamentos confirmados ────────────────────────────
  if (status !== 'paid') {
    return NextResponse.json(
      { received: true, ignored: true, reason: 'not_paid' },
      { status: 200 }
    );
  }

  // ── 4. Variáveis de ambiente ──────────────────────────────────────────────
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const apiSecret     = process.env.GA4_API_SECRET;

  if (!measurementId || !apiSecret) {
    console.error('[WIAPY_WEBHOOK] Error', {
      message:             'GA4 env vars missing',
      measurementIdExists: Boolean(measurementId),
      apiSecretExists:     Boolean(apiSecret),
    });
    return NextResponse.json({ error: 'GA4 configuration missing' }, { status: 500 });
  }

  // ── 5. Montar parâmetros do evento ────────────────────────────────────────
  const clientId = (tracking?.ga_client_id as string | undefined)
    || `wiapy.${(customer?.id as string | undefined) || paymentId || Date.now()}`;

  const value         = typeof amount === 'number' ? amount / 100 : 0;
  const transactionId = paymentId || String(Date.now());

  const items = products?.map((product) => ({
    item_id:       product.id       as string,
    item_name:     product.title    as string,
    item_category: product.type     as string,
    quantity:      1,
    price: typeof checkout?.amount === 'number'
      ? (checkout.amount as number) / 100
      : value,
  })) ?? [];

  console.warn('[WIAPY_WEBHOOK] Sending to GA4', {
    measurementIdExists: Boolean(measurementId),
    apiSecretExists:     Boolean(apiSecret),
    transactionId,
    value,
  });

  const ga4Body = {
    client_id: clientId,
    user_id:   customer?.id as string | undefined,
    events: [{
      name: 'purchase',
      params: {
        transaction_id:       transactionId,
        value,
        currency:             'BRL',
        payment_method:       payment?.payment_method as string | undefined,
        checkout_id:          checkout?.id            as string | undefined,
        checkout_title:       checkoutTitle,
        utm_source:           tracking?.utm_source    as string | undefined,
        utm_medium:           tracking?.utm_medium    as string | undefined,
        utm_campaign:         utmCampaign,
        utm_content:          utmContent,
        utm_term:             utmTerm,
        items,
        engagement_time_msec: 1,
      },
    }],
  };

  // ── 6. Enviar ao GA4 ──────────────────────────────────────────────────────
  try {
    const ga4Response = await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(ga4Body),
      }
    );

    console.warn('[WIAPY_WEBHOOK] GA4 response', {
      status: ga4Response.status,
      ok:     ga4Response.ok,
    });

    if (!ga4Response.ok) {
      const ga4ErrorText = await ga4Response.text();
      console.error('[WIAPY_WEBHOOK] Error', ga4ErrorText);
      return NextResponse.json(
        { error: 'GA4 request failed', details: ga4ErrorText },
        { status: 500 }
      );
    }

    console.warn('[WIAPY_WEBHOOK] GA4 purchase event sent');
  } catch (err) {
    console.error('[WIAPY_WEBHOOK] Error', err);
    return NextResponse.json(
      { error: 'GA4 fetch failed', details: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }

  // ── 7. Salvar no Redis ────────────────────────────────────────────────────
  try {
    const campaign    = utmCampaign || 'direct';
    const content     = utmContent  || 'none';
    const valueCents  = typeof amount === 'number' ? amount : 0;

    const commands: unknown[][] = [
      // Contadores globais
      ['INCR',   'funnel:purchase:count'],
      ['EXPIRE', 'funnel:purchase:count', TTL_7D],
      ['INCRBY', 'funnel:purchase:revenue_cents', valueCents],
      ['EXPIRE', 'funnel:purchase:revenue_cents', TTL_7D],

      // Por checkoutTitle
      ['INCR',   `funnel:purchase:checkout:${checkoutTitle || 'unknown'}:count`],
      ['EXPIRE', `funnel:purchase:checkout:${checkoutTitle || 'unknown'}:count`, TTL_7D],

      // Por campanha
      ['INCR',   `funnel:campaign:${campaign}:purchase_count`],
      ['EXPIRE', `funnel:campaign:${campaign}:purchase_count`, TTL_7D],
      ['INCRBY', `funnel:campaign:${campaign}:revenue_cents`, valueCents],
      ['EXPIRE', `funnel:campaign:${campaign}:revenue_cents`, TTL_7D],

      // Por content (criativo)
      ['INCR',   `funnel:content:${content}:purchase_count`],
      ['EXPIRE', `funnel:content:${content}:purchase_count`, TTL_7D],
      ['INCRBY', `funnel:content:${content}:revenue_cents`, valueCents],
      ['EXPIRE', `funnel:content:${content}:revenue_cents`, TTL_7D],
    ];

    // Por UTM Term (se existir)
    if (utmTerm) {
      commands.push(['INCR',   `funnel:term:${utmTerm}:purchase_count`]);
      commands.push(['EXPIRE', `funnel:term:${utmTerm}:purchase_count`, TTL_7D]);
    }

    await rPipeline(commands);
    console.warn('[WIAPY_WEBHOOK] Redis purchase saved');
  } catch (err) {
    // Redis failure não bloqueia a resposta — GA4 já foi enviado com sucesso
    console.error('[WIAPY_WEBHOOK] Redis error (non-fatal)', err instanceof Error ? err.message : err);
  }

  return NextResponse.json({ received: true, ga4Sent: true }, { status: 200 });
}
