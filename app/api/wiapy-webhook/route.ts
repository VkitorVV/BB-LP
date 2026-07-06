import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // ── 1. Validar Authorization ──────────────────────────────────────────────
  const authHeader = request.headers.get('authorization');
  if (authHeader !== process.env.WIAPY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ── 2. Ler payload ────────────────────────────────────────────────────────
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const payment  = payload.payment  as Record<string, unknown> | undefined;
  const customer = payload.customer as Record<string, unknown> | undefined;
  const checkout = payload.checkout as Record<string, unknown> | undefined;
  const tracking = payload.tracking as Record<string, unknown> | undefined;
  const products = payload.products as Record<string, unknown>[] | undefined;

  const status        = payment?.status        as string | undefined;
  const paymentId     = payment?.id            as string | undefined;
  const checkoutTitle = checkout?.title        as string | undefined;
  const amount        = payment?.amount        as number | undefined;

  // ── 3. Log mínimo ─────────────────────────────────────────────────────────
  console.log('WIAPY webhook received', {
    status,
    paymentId,
    checkoutTitle,
    amount,
  });

  // ── 4. Processar apenas pagamentos confirmados ────────────────────────────
  if (status !== 'paid') {
    return NextResponse.json(
      { received: true, ignored: true, reason: 'not_paid' },
      { status: 200 }
    );
  }

  // ── 5. Variáveis de ambiente ──────────────────────────────────────────────
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const apiSecret     = process.env.GA4_API_SECRET;

  if (!measurementId || !apiSecret) {
    console.error('GA4 env vars missing', { measurementId: !!measurementId, apiSecret: !!apiSecret });
    return NextResponse.json({ error: 'GA4 configuration missing' }, { status: 500 });
  }

  // ── 6. Montar parâmetros do evento ────────────────────────────────────────
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

  // ── 7. Body para GA4 Measurement Protocol ────────────────────────────────
  const ga4Body = {
    client_id: clientId,
    user_id:   customer?.id as string | undefined,
    events: [
      {
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
          utm_campaign:         tracking?.utm_campaign  as string | undefined,
          utm_content:          tracking?.utm_content   as string | undefined,
          utm_term:             tracking?.utm_term      as string | undefined,
          items,
          engagement_time_msec: 1,
        },
      },
    ],
  };

  // ── 8. Enviar ao GA4 ──────────────────────────────────────────────────────
  try {
    const ga4Response = await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(ga4Body),
      }
    );

    if (!ga4Response.ok) {
      const text = await ga4Response.text();
      console.error('GA4 Measurement Protocol error', { status: ga4Response.status, body: text });
      return NextResponse.json(
        { error: 'GA4 request failed', details: text },
        { status: 500 }
      );
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('GA4 fetch exception', { message });
    return NextResponse.json({ error: 'GA4 fetch failed', details: message }, { status: 500 });
  }

  return NextResponse.json({ received: true, ga4Sent: true }, { status: 200 });
}
