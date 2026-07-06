import { NextRequest, NextResponse } from 'next/server';
import { rGetInt, rKeys, rPipeline } from '@/lib/redis';

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

const CHECKOUT_TYPES = [
  'plano_basico_popup_open',
  'plano_basico',
  'kit_completo',
  'kit_desconto_popup',
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token || token !== process.env.FUNNEL_DASHBOARD_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // ── Usuários ativos nos últimos 30min ─────────────────────────────────
    const sessionKeys = await rKeys('funnel:session:*');
    const activeUsersLast30Min = sessionKeys.length;

    // ── Seções ────────────────────────────────────────────────────────────
    const sectionCounts = await Promise.all(
      SECTIONS.map(({ id }) => rGetInt(`funnel:section:${id}:count`))
    );
    const heroCount = sectionCounts[0] || 1; // evitar divisão por zero

    const sections = SECTIONS.map((s, i) => {
      const reached         = sectionCounts[i];
      const prev            = i > 0 ? sectionCounts[i - 1] : reached;
      const percentOfHero   = heroCount > 0 ? Math.round((reached / heroCount) * 100) : 0;
      const dropFromPrevious = prev > 0 ? Math.round(((prev - reached) / prev) * 100) : 0;
      return { ...s, reached, percentOfHero, dropFromPrevious };
    });

    // ── Cliques em checkout ───────────────────────────────────────────────
    const clickCounts = await Promise.all(
      CHECKOUT_TYPES.map((t) => rGetInt(`funnel:click:${t}:count`))
    );
    const checkoutClicks: Record<string, number> = {};
    CHECKOUT_TYPES.forEach((t, i) => { checkoutClicks[t] = clickCounts[i]; });

    // ── Compras ───────────────────────────────────────────────────────────
    const purchaseCount   = await rGetInt('funnel:purchase:count');
    const purchaseRevenue = await rGetInt('funnel:purchase:revenue_cents');
    const revenue         = purchaseRevenue / 100;

    // ── Campanhas ─────────────────────────────────────────────────────────
    const campaignKeys = await rKeys('funnel:campaign:*:sessions');
    const campaignNames = campaignKeys
      .map((k) => k.replace('funnel:campaign:', '').replace(':sessions', ''))
      .filter((v, i, a) => a.indexOf(v) === i);

    const campaigns = await Promise.all(
      campaignNames.map(async (c) => {
        const [sessions, clicks, purchases, revCents] = await Promise.all([
          rGetInt(`funnel:campaign:${c}:session_count`),
          rGetInt(`funnel:campaign:${c}:click_count`),
          rGetInt(`funnel:campaign:${c}:purchase_count`),
          rGetInt(`funnel:campaign:${c}:revenue_cents`),
        ]);
        const reachedOffer = await rGetInt(`funnel:section:oferta:campaign:${c}`);
        return {
          utmCampaign:    c,
          sessions,
          reachedOffer,
          checkoutClicks: clicks,
          purchases,
          revenue:        revCents / 100,
        };
      })
    );

    // ── Criativos ─────────────────────────────────────────────────────────
    const contentKeys = await rKeys('funnel:content:*:sessions');
    const contentNames = contentKeys
      .map((k) => k.replace('funnel:content:', '').replace(':sessions', ''))
      .filter((v, i, a) => a.indexOf(v) === i);

    const creatives = await Promise.all(
      contentNames.map(async (c) => {
        const [sessions, clicks, purchases, revCents] = await Promise.all([
          rGetInt(`funnel:content:${c}:session_count`),
          rGetInt(`funnel:content:${c}:click_count`),
          rGetInt(`funnel:content:${c}:purchase_count`),
          rGetInt(`funnel:content:${c}:revenue_cents`),
        ]);
        const reachedOffer = await rGetInt(`funnel:section:oferta:content:${c}`);
        return {
          utmContent:     c,
          sessions,
          reachedOffer,
          checkoutClicks: clicks,
          purchases,
          revenue:        revCents / 100,
        };
      })
    );

    return NextResponse.json({
      activeUsersLast30Min,
      sections,
      checkoutClicks,
      purchases: { count: purchaseCount, revenue },
      campaigns: campaigns.sort((a, b) => b.sessions - a.sessions),
      creatives: creatives.sort((a, b) => b.sessions - a.sessions),
      updatedAt: new Date().toISOString(),
    });

  } catch (err) {
    console.error('[funnel-dashboard] Error', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal error' }, { status: 500 });
  }
}
