import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

const SECTIONS = [
  { order: 1,  id: 'hero',                title: '01 - Hero'               },
  { order: 2,  id: 'material-por-dentro', title: '02 - Material por dentro' },
  { order: 3,  id: 'beneficios',          title: '03 - Beneficios'          },
  { order: 4,  id: 'prova-social',        title: '04 - Prova social'        },
  { order: 5,  id: 'cta-intermediario',   title: '05 - CTA intermediario'   },
  { order: 6,  id: 'ideal-para',          title: '06 - Ideal para'          },
  { order: 7,  id: 'o-que-recebe',        title: '07 - O que recebe'        },
  { order: 8,  id: 'bonus',               title: '08 - Bonus'               },
  { order: 9,  id: 'comparativo',         title: '09 - Por que usar o mapa' },
  { order: 10, id: 'countdown',           title: '10 - Cronometro'          },
  { order: 11, id: 'oferta',              title: '11 - Oferta'              },
  { order: 12, id: 'garantia',            title: '12 - Garantia'            },
  { order: 13, id: 'faq',                 title: '13 - FAQ'                 },
  { order: 14, id: 'rodape',              title: '14 - Rodape'              },
];

const CLICK_TYPES = ['plano_basico_popup_open', 'plano_basico', 'kit_completo', 'kit_desconto_popup'];

async function safeInt(key: string): Promise<number> {
  try {
    const val = await redis.get<string>(key);
    return val ? parseInt(String(val), 10) || 0 : 0;
  } catch { return 0; }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token || token !== process.env.FUNNEL_DASHBOARD_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // ── Sessões ativas (30min) ────────────────────────────────────────────
    const sessionKeys = await redis.keys('funnel:session:*');
    const activeUsersLast30Min = sessionKeys.length;

    // ── Seções ────────────────────────────────────────────────────────────
    const sectionCounts = await Promise.all(
      SECTIONS.map(({ id }) => safeInt(`funnel:section:${id}:count`))
    );
    const heroCount = sectionCounts[0] || 1;

    const sections = SECTIONS.map((s, i) => {
      const reached          = sectionCounts[i];
      const prev             = i > 0 ? sectionCounts[i - 1] : reached;
      const percentOfHero    = Math.round((reached / heroCount) * 100);
      const dropFromPrevious = prev > 0 ? Math.round(((prev - reached) / prev) * 100) : 0;
      return { ...s, reached, percentOfHero, dropFromPrevious };
    });

    // ── Cliques ───────────────────────────────────────────────────────────
    const clickCounts = await Promise.all(
      CLICK_TYPES.map((t) => safeInt(`funnel:click:${t}:count`))
    );
    const checkoutClicks: Record<string, number> = {};
    CLICK_TYPES.forEach((t, i) => { checkoutClicks[t] = clickCounts[i]; });

    // ── Compras ───────────────────────────────────────────────────────────
    const [purchaseCount, purchaseRevCents] = await Promise.all([
      safeInt('funnel:purchase:count'),
      safeInt('funnel:purchase:revenue_cents'),
    ]);

    // ── Campanhas ─────────────────────────────────────────────────────────
    const campaignKeys = await redis.keys('funnel:campaign:*:sessions');
    const campaignNames = [...new Set(
      campaignKeys.map((k) => k.replace('funnel:campaign:', '').replace(':sessions', ''))
    )];

    const campaigns = await Promise.all(campaignNames.map(async (c) => {
      const [sessions, clicks, purchases, revCents, reachedOffer] = await Promise.all([
        safeInt(`funnel:campaign:${c}:session_count`),
        safeInt(`funnel:campaign:${c}:click_count`),
        safeInt(`funnel:campaign:${c}:purchase_count`),
        safeInt(`funnel:campaign:${c}:revenue_cents`),
        safeInt(`funnel:section:oferta:campaign:${c}`),
      ]);
      return { utmCampaign: c, sessions, reachedOffer, checkoutClicks: clicks, purchases, revenue: revCents / 100 };
    }));

    // ── Criativos ─────────────────────────────────────────────────────────
    const contentKeys = await redis.keys('funnel:content:*:sessions');
    const contentNames = [...new Set(
      contentKeys.map((k) => k.replace('funnel:content:', '').replace(':sessions', ''))
    )];

    const creatives = await Promise.all(contentNames.map(async (c) => {
      const [sessions, clicks, purchases, revCents, reachedOffer] = await Promise.all([
        safeInt(`funnel:content:${c}:session_count`),
        safeInt(`funnel:content:${c}:click_count`),
        safeInt(`funnel:content:${c}:purchase_count`),
        safeInt(`funnel:content:${c}:revenue_cents`),
        safeInt(`funnel:section:oferta:content:${c}`),
      ]);
      return { utmContent: c, sessions, reachedOffer, checkoutClicks: clicks, purchases, revenue: revCents / 100 };
    }));

    return NextResponse.json({
      redisReady: true,
      activeUsersLast30Min,
      sections,
      checkoutClicks,
      purchases: { count: purchaseCount, revenue: purchaseRevCents / 100 },
      campaigns: campaigns.sort((a, b) => b.sessions - a.sessions),
      creatives: creatives.sort((a, b) => b.sessions - a.sessions),
      updatedAt: new Date().toISOString(),
    });

  } catch (err) {
    console.error('[funnel-dashboard]', err instanceof Error ? err.message : err);
    return NextResponse.json({
      error: err instanceof Error ? err.message : 'Internal error',
    }, { status: 500 });
  }
}
