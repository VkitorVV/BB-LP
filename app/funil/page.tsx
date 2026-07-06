'use client';
import React, { useEffect, useState, useCallback, useRef } from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────
type SessionStatus = 'online' | 'recente' | 'saiu' | 'inativo';

interface SectionRow {
  order: number; id: string; title: string;
  reached: number; percentOfHero: number; dropFromPrevious: number;
}
interface CheckoutClicks {
  plano_basico_popup_open: number; plano_basico: number;
  kit_completo: number; kit_desconto_popup: number;
}
interface MapRow {
  sessions: number; clicks: number; reachedOffer: number;
  purchases: number; revenue: number;
  conversionClick: number; conversionPurchase: number;
}
interface SessionRow {
  sessionId: string; label: string; shortId: string;
  firstSeen: string; lastSeen: string; leftAt: string | null;
  pageStatus: string; status: SessionStatus;
  secondsSinceLastSeen: number;
  utmSource?: string; utmCampaign?: string; utmTerm?: string;
  utmContent?: string; campaignId?: string; adsetId?: string;
  adId?: string; placement?: string; siteSourceName?: string;
  maxSectionOrder: number; maxSectionTitle?: string;
  clicksCount: number; purchased: boolean; revenue: number;
}
interface DashData {
  date: string; window: string;
  activeNow: number; active30m: number;
  totalSessionsToday: number; totalSessionsInWindow: number; totalClicks: number;
  sections: SectionRow[];
  checkoutClicks: CheckoutClicks;
  purchases: { count: number; revenue: number };
  campaigns: (MapRow & { utmCampaign: string })[];
  adsets: (MapRow & { adsetId: string })[];
  creatives: (MapRow & { utmContent: string })[];
  sessions: SessionRow[];
  showingMax: boolean;
  updatedAt: string;
}
interface SessionDetail {
  session: Record<string, unknown> | null;
  sectionsReached: Record<string, unknown>[];
  clicks: Record<string, unknown>[];
  purchase: Record<string, unknown> | null;
}

// ─── Utils ─────────────────────────────────────────────────────────────────
const fmt     = (n?: number | null) => (n ?? 0).toLocaleString('pt-BR');
const fmtBRL  = (n?: number | null) => (n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const fmtTime = (iso?: string | null) => iso ? new Date(iso).toLocaleTimeString('pt-BR') : '—';
const todayStr = () => new Date().toISOString().split('T')[0];
const pctColor = (p: number) => p >= 70 ? '#22c55e' : p >= 40 ? '#f59e0b' : '#ef4444';

const STATUS_COLOR: Record<SessionStatus, string> = {
  online: '#22c55e', recente: '#3b82f6', saiu: '#6b7280', inativo: '#374151',
};
const STATUS_LABEL: Record<SessionStatus, string> = {
  online: '● Online', recente: '◑ Recente', saiu: '○ Saiu', inativo: '○ Inativo',
};

function secsAgo(sec: number): string {
  if (sec < 5)   return 'agora';
  if (sec < 60)  return `há ${sec}s`;
  if (sec < 3600) return `há ${Math.floor(sec / 60)}min`;
  return `há ${Math.floor(sec / 3600)}h`;
}

const WINDOWS = [
  { v: 'now',   l: 'Agora / 25s' },
  { v: '30m',   l: '30 min' },
  { v: '1h',    l: '1 hora' },
  { v: '2h',    l: '2 horas' },
  { v: '4h',    l: '4 horas' },
  { v: '12h',   l: '12 horas' },
  { v: '24h',   l: '24 horas' },
  { v: 'today', l: 'Hoje (dia todo)' },
];

// ─── Main ──────────────────────────────────────────────────────────────────
export default function FunilPage() {
  const [token, setToken]     = useState('');
  const [date, setDate]       = useState(todayStr());
  const [win, setWin]         = useState('today');
  const [data, setData]       = useState<DashData | null>(null);
  const [err, setErr]         = useState('');
  const [loading, setLoading] = useState(false);
  const [lu, setLu]           = useState('');
  const [auto, setAuto]       = useState(false);
  const [tick, setTick]       = useState(0);
  const [selSid, setSelSid]   = useState<string | null>(null);
  const [detail, setDetail]   = useState<SessionDetail | null>(null);
  const [detLoading, setDetLoading] = useState(false);
  const [clearTxt, setClearTxt]     = useState('');
  const [showClear, setShowClear]   = useState(false);
  const ivRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 1s ticker for live "visto há"
  useEffect(() => {
    tickRef.current = setInterval(() => setTick(p => p + 1), 1000);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, []);

  // Read token from URL
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setToken(p.get('token') || '');
  }, []);

  const load = useCallback(async (tok: string, d: string, w: string) => {
    if (!tok) return;
    setLoading(true);
    try {
      const r = await fetch(`/api/funnel-dashboard?token=${encodeURIComponent(tok)}&date=${d}&window=${w}`);
      if (r.status === 401) { setErr('Acesso negado. Token inválido.'); setData(null); return; }
      if (!r.ok) {
        const j = await r.json().catch(() => ({})) as { error?: string };
        setErr(`Erro ${r.status}${j.error ? ': ' + j.error : ''}`);
        return;
      }
      setData(await r.json() as DashData);
      setErr('');
      setLu(new Date().toLocaleTimeString('pt-BR'));
    } catch (e) {
      setErr(`Conexão: ${e instanceof Error ? e.message : String(e)}`);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { if (token) load(token, date, win); }, [token]);          // eslint-disable-line
  useEffect(() => { if (token) load(token, date, win); }, [date, win]);      // eslint-disable-line

  useEffect(() => {
    if (ivRef.current) clearInterval(ivRef.current);
    if (auto && token) ivRef.current = setInterval(() => load(token, date, win), 60_000);
    return () => { if (ivRef.current) clearInterval(ivRef.current); };
  }, [auto, token, date, win, load]);

  const openDetail = useCallback(async (sid: string) => {
    setSelSid(sid);
    setDetLoading(true);
    setDetail(null);
    try {
      const r = await fetch(`/api/funnel-session?token=${encodeURIComponent(token)}&sessionId=${encodeURIComponent(sid)}&date=${date}`);
      setDetail(await r.json() as SessionDetail);
    } catch { setDetail(null); }
    finally { setDetLoading(false); }
  }, [token, date]);

  const closeDetail = () => { setSelSid(null); setDetail(null); };

  const exportData = (type: 'csv' | 'json') =>
    window.open(`/api/funnel-export?token=${encodeURIComponent(token)}&date=${date}&type=${type}`, '_blank');

  const doClear = async () => {
    if (clearTxt !== 'LIMPAR') return;
    await fetch('/api/funnel-clear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, date }),
    });
    setShowClear(false);
    setClearTxt('');
    load(token, date, win);
  };

  // ── Error / empty states ──────────────────────────────────────────────
  if (err) return (
    <div style={g.center}>
      <div style={g.ebox}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
        <p style={{ color: '#ef4444', fontWeight: 700, marginBottom: 16 }}>{err}</p>
        <BtnSm onClick={() => { setErr(''); load(token, date, win); }}>Tentar novamente</BtnSm>
      </div>
    </div>
  );

  if (!data && !loading) return (
    <div style={g.center}>
      <p style={{ color: '#6b7280' }}>Aguardando <code style={{ color: '#f59e0b' }}>?token=...</code> na URL</p>
    </div>
  );

  if (!data) return (
    <div style={g.center}>
      <p style={{ color: '#9ca3af' }}>Carregando…</p>
    </div>
  );

  const totalClicks = Object.values(data.checkoutClicks).reduce((a, b) => a + b, 0);
  const detSess = selSid ? data.sessions.find(s => s.sessionId === selSid) : null;
  void tick; // used implicitly via secsAgo call below

  // ── Render ───────────────────────────────────────────────────────────
  return (
    <div style={g.page}>
      <div style={g.wrap}>

        {/* ── Header ── */}
        <header style={g.hdr}>
          <div>
            <h1 style={g.title}>FUNIL <span style={{ color: '#f59e0b' }}>—</span> Mapa do Degradê</h1>
            <p style={g.sub}>
              {lu ? `Atualizado às ${lu}` : 'Carregando…'}
              {loading && <span style={{ color: '#f59e0b', marginLeft: 8 }}>⟳</span>}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={g.inp} />
            <select value={win} onChange={e => setWin(e.target.value)} style={g.inp}>
              {WINDOWS.map(w => <option key={w.v} value={w.v}>{w.l}</option>)}
            </select>
            <BtnSm active={auto} onClick={() => setAuto(p => !p)}>
              {auto ? '⟳ Auto 60s ON' : '⟳ Auto OFF'}
            </BtnSm>
            <BtnSm onClick={() => load(token, date, win)} disabled={loading}>
              ↺ Atualizar
            </BtnSm>
          </div>
        </header>

        {/* ── Cards ── */}
        <div style={g.cards6}>
          <StatCard label="Ativos agora" value={fmt(data.activeNow)} color="#22c55e" hint="last_seen ≤ 25s e não saiu" />
          <StatCard label="Ativos 30min" value={fmt(data.active30m)} color="#3b82f6" />
          <StatCard label="Sessões hoje" value={fmt(data.totalSessionsToday)} color="#06b6d4" />
          <StatCard label="Cliques CTA" value={fmt(totalClicks)} color="#f59e0b" />
          <StatCard label="Compras" value={fmt(data.purchases.count)} color="#f97316" />
          <StatCard label="Receita" value={fmtBRL(data.purchases.revenue)} color="#a855f7" />
        </div>

        {/* ── Funil ── */}
        <Block title="Funil por Seção">
          <div style={{ overflowX: 'auto' }}>
            <table style={g.tbl}>
              <thead>
                <tr>
                  <TH>Seção</TH>
                  <TH right>Alcançaram</TH>
                  <TH right>% Topo</TH>
                  <TH right>Drop</TH>
                  <TH>Barra</TH>
                </tr>
              </thead>
              <tbody>
                {data.sections.map(sec => (
                  <tr key={sec.id} style={{
                    ...g.tr,
                    background: sec.id === 'oferta' ? 'rgba(249,115,22,.06)' : undefined,
                    outline:    sec.id === 'oferta' ? '1px solid rgba(249,115,22,.2)' : undefined,
                  }}>
                    <TD>
                      {sec.id === 'oferta' && <span style={{ color: '#f97316', marginRight: 6 }}>★</span>}
                      <span style={{ color: sec.id === 'oferta' ? '#fdba74' : '#e5e7eb' }}>{sec.title}</span>
                    </TD>
                    <TD right bold>{fmt(sec.reached)}</TD>
                    <TD right style={{ color: pctColor(sec.percentOfHero) }}>{sec.percentOfHero}%</TD>
                    <TD right style={{ color: sec.dropFromPrevious > 30 ? '#ef4444' : '#6b7280' }}>
                      {sec.dropFromPrevious > 0 ? `-${sec.dropFromPrevious}%` : '—'}
                    </TD>
                    <TD>
                      <div style={g.barBg}>
                        <div style={{ ...g.barFill, width: `${Math.min(sec.percentOfHero, 100)}%` }} />
                      </div>
                    </TD>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Block>

        {/* ── Checkout clicks ── */}
        <Block title="Cliques em Checkout">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 10 }}>
            {([
              ['Básico → popup', 'plano_basico_popup_open'],
              ['Kit (PV)',        'kit_completo'],
              ['Kit desconto',   'kit_desconto_popup'],
              ['Continua Básico','plano_basico'],
            ] as [string, keyof CheckoutClicks][]).map(([l, k]) => (
              <div key={k} style={g.miniCard}>
                <p style={g.miniLabel}>{l}</p>
                <p style={{ ...g.miniVal, color: '#3b82f6' }}>{fmt(data.checkoutClicks[k] || 0)}</p>
              </div>
            ))}
          </div>
        </Block>

        {/* ── USUÁRIOS ANÔNIMOS ── */}
        <Block title={`USUÁRIOS ANÔNIMOS${data.showingMax ? ' — mostrando 100' : ` (${data.sessions.length})`}`}>
          {data.sessions.length === 0 ? (
            <p style={{ color: '#6b7280', fontSize: 13, padding: '12px 0' }}>Nenhuma sessão no período selecionado.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={g.tbl}>
                <thead>
                  <tr>
                    <TH>Usuário</TH>
                    <TH>Status</TH>
                    <TH>1ª visita</TH>
                    <TH>Visto há</TH>
                    <TH>Campanha</TH>
                    <TH>Conjunto</TH>
                    <TH>Criativo</TH>
                    <TH>Última seção</TH>
                    <TH right>Cliques</TH>
                    <TH right>Comprou</TH>
                    <TH right>Receita</TH>
                  </tr>
                </thead>
                <tbody>
                  {data.sessions.map(sess => (
                    <tr
                      key={sess.sessionId}
                      style={{ ...g.tr, cursor: 'pointer' }}
                      onClick={() => openDetail(sess.sessionId)}
                      title="Clique para ver detalhes"
                    >
                      <TD>
                        <span style={{ color: '#60a5fa', fontFamily: 'monospace', fontSize: 12 }}>{sess.label}</span>
                        <span style={{ color: '#374151', fontSize: 10, marginLeft: 6 }}>#{sess.shortId}</span>
                      </TD>
                      <TD>
                        <span style={{ color: STATUS_COLOR[sess.status], fontSize: 13 }}>
                          {STATUS_LABEL[sess.status]}
                        </span>
                      </TD>
                      <TD style={{ fontSize: 11, color: '#9ca3af' }}>{fmtTime(sess.firstSeen)}</TD>
                      <TD style={{ fontSize: 11, color: '#9ca3af' }}>
                        {secsAgo(sess.secondsSinceLastSeen)}
                      </TD>
                      <TD style={{ fontSize: 12 }}>{sess.utmCampaign || '—'}</TD>
                      <TD style={{ fontSize: 12 }}>{sess.adsetId || '—'}</TD>
                      <TD style={{ fontSize: 12 }}>{sess.utmContent || '—'}</TD>
                      <TD style={{ fontSize: 12, color: '#d1d5db' }}>{sess.maxSectionTitle || '—'}</TD>
                      <TD right>{fmt(sess.clicksCount)}</TD>
                      <TD right>
                        {sess.purchased ? <span style={{ color: '#22c55e', fontWeight: 700 }}>✓</span> : '—'}
                      </TD>
                      <TD right style={{ fontSize: 12 }}>
                        {sess.revenue > 0 ? fmtBRL(sess.revenue) : '—'}
                      </TD>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Block>

        {/* ── Campanhas ── */}
        {data.campaigns.length > 0 && (
          <Block title="Por Campanha (utm_campaign)">
            <DataGrid
              headers={['Campanha', 'Sessões', 'Oferta', 'Cliques', 'Compras', 'Receita', 'CTR%', 'CVR%']}
              rows={data.campaigns.map(c => [
                c.utmCampaign, fmt(c.sessions), fmt(c.reachedOffer),
                fmt(c.clicks), fmt(c.purchases), fmtBRL(c.revenue),
                c.conversionClick + '%', c.conversionPurchase + '%',
              ])}
            />
          </Block>
        )}

        {/* ── Adsets ── */}
        {data.adsets.length > 0 && (
          <Block title="Por Conjunto (adset_id)">
            <DataGrid
              headers={['Conjunto', 'Sessões', 'Oferta', 'Cliques', 'Compras', 'Receita', 'CTR%', 'CVR%']}
              rows={data.adsets.map(a => [
                a.adsetId, fmt(a.sessions), fmt(a.reachedOffer),
                fmt(a.clicks), fmt(a.purchases), fmtBRL(a.revenue),
                a.conversionClick + '%', a.conversionPurchase + '%',
              ])}
            />
          </Block>
        )}

        {/* ── Criativos ── */}
        {data.creatives.length > 0 && (
          <Block title="Por Criativo (utm_content)">
            <DataGrid
              headers={['Criativo', 'Sessões', 'Oferta', 'Cliques', 'Compras', 'Receita', 'CTR%', 'CVR%']}
              rows={data.creatives.map(c => [
                c.utmContent, fmt(c.sessions), fmt(c.reachedOffer),
                fmt(c.clicks), fmt(c.purchases), fmtBRL(c.revenue),
                c.conversionClick + '%', c.conversionPurchase + '%',
              ])}
            />
          </Block>
        )}

        {/* ── Actions ── */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', margin: '8px 0 24px' }}>
          <BtnSm onClick={() => exportData('csv')}>⬇ Exportar CSV</BtnSm>
          <BtnSm onClick={() => exportData('json')}>⬇ Exportar JSON</BtnSm>
          <BtnSm danger onClick={() => setShowClear(true)}>🗑 Limpar dados de {date}</BtnSm>
        </div>
        <p style={{ textAlign: 'center', fontSize: 10, color: '#374151', paddingBottom: 32 }}>
          Sem dados pessoais · {data.updatedAt}
        </p>
        {/* Debug bar */}
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, padding: '10px 16px', marginBottom: 32, fontSize: 11, color: '#475569', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <span>sessões retornadas: <strong style={{ color: '#94a3b8' }}>{data.sessions.length}</strong></span>
          <span>sessões hoje: <strong style={{ color: '#94a3b8' }}>{data.totalSessionsToday}</strong></span>
          <span>seções contadas: <strong style={{ color: '#94a3b8' }}>{data.sections.reduce((a, s) => a + s.reached, 0)}</strong></span>
          <span>date: <strong style={{ color: '#94a3b8' }}>{data.date}</strong></span>
          <span>window: <strong style={{ color: '#94a3b8' }}>{data.window}</strong></span>
        </div>

      </div>{/* /wrap */}

      {/* ── Session detail drawer ── */}
      {selSid && (
        <div style={g.overlay} onClick={closeDetail}>
          <aside style={g.drawer} onClick={e => e.stopPropagation()}>
            <div style={g.drawerHdr}>
              <h2 style={g.drawerTitle}>{detSess?.label || 'Detalhe'}</h2>
              <button onClick={closeDetail} style={g.closeBtn}>✕</button>
            </div>
            <div style={g.drawerBody}>
              {detLoading ? (
                <p style={{ color: '#6b7280', textAlign: 'center', padding: 32 }}>Carregando…</p>
              ) : detail ? (
                <>
                  {/* Bloco 1 — ID */}
                  {detSess && (
                    <DetailBlock title="Identificação">
                      <DRow k="Usuário" v={detSess.label} />
                      <DRow k="Status" v={<span style={{ color: STATUS_COLOR[detSess.status] }}>{STATUS_LABEL[detSess.status]}</span>} />
                      <DRow k="Session" v={<code style={{ fontSize: 11 }}>{selSid.slice(0, 20)}…</code>} />
                      <DRow k="1ª visita" v={fmtTime(detSess.firstSeen)} />
                      <DRow k="Última atividade" v={fmtTime(detSess.lastSeen)} />
                      {detSess.leftAt && <DRow k="Saiu em" v={fmtTime(detSess.leftAt)} />}
                    </DetailBlock>
                  )}

                  {/* Bloco 2 — UTM */}
                  {detail.session && (
                    <DetailBlock title="Origem">
                      {(['utm_source','utm_medium','utm_campaign','utm_term','utm_content',
                        'campaign_id','adset_id','ad_id','placement','site_source_name'] as string[]).map(k =>
                        detail.session![k]
                          ? <DRow key={k} k={k} v={String(detail.session![k])} />
                          : null
                      )}
                    </DetailBlock>
                  )}

                  {/* Bloco 3 — Timeline */}
                  {detail.sectionsReached.length > 0 && (
                    <DetailBlock title={`Percurso na PV (${detail.sectionsReached.length} seções)`}>
                      <div style={g.timeline}>
                        {detail.sectionsReached.map((ev, i) => {
                          const isLast = i === detail.sectionsReached.length - 1;
                          return (
                            <div key={i} style={{ ...g.timelineRow, background: isLast ? 'rgba(249,115,22,.1)' : undefined }}>
                              <span style={{ color: isLast ? '#f97316' : '#60a5fa', fontSize: 12, fontWeight: isLast ? 700 : 400 }}>
                                {ev.section_title as string}
                              </span>
                              <span style={{ fontSize: 11, color: '#6b7280' }}>{fmtTime(ev.created_at as string)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </DetailBlock>
                  )}

                  {/* Bloco 4 — Cliques */}
                  {detail.clicks.length > 0 && (
                    <DetailBlock title={`Cliques (${detail.clicks.length})`}>
                      <div style={g.timeline}>
                        {detail.clicks.map((ev, i) => (
                          <div key={i} style={g.timelineRow}>
                            <span style={{ color: '#f59e0b', fontSize: 12 }}>{ev.checkout_type as string}</span>
                            <span style={{ fontSize: 11, color: '#6b7280' }}>
                              {String(ev.button_location || '')} · {fmtTime(ev.created_at as string)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </DetailBlock>
                  )}

                  {/* Bloco 5 — Compra */}
                  <DetailBlock title="Compra">
                    {detail.purchase ? (
                      <>
                        <DRow k="Produto" v={String(detail.purchase.checkout_title || '')} />
                        <DRow k="Valor" v={<span style={{ color: '#22c55e', fontWeight: 700 }}>{fmtBRL(detail.purchase.amount as number)}</span>} />
                        <DRow k="Horário" v={fmtTime(detail.purchase.created_at as string)} />
                      </>
                    ) : (
                      <p style={{ color: '#6b7280', fontSize: 12, margin: 0 }}>Sem compra registrada.</p>
                    )}
                  </DetailBlock>
                </>
              ) : (
                <p style={{ color: '#6b7280', textAlign: 'center', padding: 32 }}>Sessão não encontrada.</p>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* ── Clear modal ── */}
      {showClear && (
        <div style={g.overlay} onClick={() => setShowClear(false)}>
          <div style={g.modal} onClick={e => e.stopPropagation()}>
            <h2 style={{ color: '#ef4444', fontSize: 15, margin: '0 0 12px' }}>⚠️ Limpar dados de {date}</h2>
            <p style={{ color: '#d1d5db', fontSize: 13, marginBottom: 8 }}>
              Isso apagará <strong>todos os dados do Supabase</strong> para {date}. Exporte antes de continuar.
            </p>
            <p style={{ color: '#9ca3af', fontSize: 12, marginBottom: 12 }}>
              Digite <strong style={{ color: '#ef4444' }}>LIMPAR</strong> para confirmar:
            </p>
            <input
              value={clearTxt}
              onChange={e => setClearTxt(e.target.value)}
              placeholder="LIMPAR"
              style={{ ...g.inp, width: '100%', marginBottom: 12, color: '#ef4444' }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <BtnSm danger onClick={doClear} disabled={clearTxt !== 'LIMPAR'}>
                Confirmar limpeza
              </BtnSm>
              <BtnSm onClick={() => { setShowClear(false); setClearTxt(''); }}>
                Cancelar
              </BtnSm>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={g.block}>
      <h2 style={g.blockTitle}>{title}</h2>
      {children}
    </div>
  );
}

function StatCard({ label, value, color, hint }: { label: string; value: string; color: string; hint?: string }) {
  return (
    <div style={g.card} title={hint}>
      <p style={g.cardLabel}>{label}</p>
      <p style={{ ...g.cardVal, color }}>{value}</p>
      {hint && <p style={{ fontSize: 10, color: '#4b5563', margin: '4px 0 0' }}>{hint}</p>}
    </div>
  );
}

function DataGrid({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={g.tbl}>
        <thead>
          <tr>{headers.map((h, i) => <TH key={h} right={i > 0}>{h}</TH>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={g.tr}>
              {row.map((cell, ci) => (
                <TD key={ci} right={ci > 0} bold={ci > 0}>{cell}</TD>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DetailBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <p style={g.detLabel}>{title}</p>
      <div style={g.detCard}>{children}</div>
    </div>
  );
}

function DRow({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #1f2937' }}>
      <span style={{ fontSize: 11, color: '#6b7280' }}>{k}</span>
      <span style={{ fontSize: 12, color: '#d1d5db', textAlign: 'right', maxWidth: '60%', wordBreak: 'break-all' }}>{v}</span>
    </div>
  );
}

function BtnSm({ children, onClick, active, danger, disabled }:
  { children: React.ReactNode; onClick?: () => void; active?: boolean; danger?: boolean; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        border: '1px solid',
        borderRadius: 6,
        padding: '6px 14px',
        fontSize: 12,
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: active ? '#14532d' : danger ? '#450a0a' : '#1f2937',
        color:  active ? '#4ade80' : danger ? '#f87171' : '#d1d5db',
        borderColor: active ? '#166534' : danger ? '#991b1b' : '#374151',
        opacity: disabled ? 0.5 : 1,
        transition: 'opacity .15s',
      }}
    >
      {children}
    </button>
  );
}

const TH = ({ children, right }: { children?: React.ReactNode; right?: boolean }) => (
  <th style={{ padding: '10px 12px', fontWeight: 600, fontSize: 11, textTransform: 'uppercase',
    letterSpacing: .8, borderBottom: '1px solid #1f2937', color: '#6b7280',
    textAlign: right ? 'right' : 'left', whiteSpace: 'nowrap' }}>
    {children}
  </th>
);

const TD = ({ children, right, bold, style }: {
  children?: React.ReactNode; right?: boolean; bold?: boolean; style?: React.CSSProperties;
}) => (
  <td style={{ padding: '10px 12px', color: '#9ca3af', verticalAlign: 'middle',
    textAlign: right ? 'right' : 'left', fontWeight: bold ? 600 : 400, ...style }}>
    {children}
  </td>
);

// ─── Styles ────────────────────────────────────────────────────────────────
const g: Record<string, React.CSSProperties> = {
  page:       { minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'system-ui,sans-serif', padding: '24px 20px' },
  wrap:       { maxWidth: 1320, margin: '0 auto' },
  center:     { minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 },
  ebox:       { background: '#111827', border: '1px solid #1f2937', borderRadius: 12, padding: 32, textAlign: 'center' },
  hdr:        { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 },
  title:      { fontSize: 22, fontWeight: 800, margin: 0, color: '#f3f4f6', letterSpacing: '-.01em' },
  sub:        { fontSize: 12, color: '#4b5563', margin: '4px 0 0' },
  inp:        { background: '#111827', border: '1px solid #1f2937', borderRadius: 6, color: '#d1d5db', padding: '7px 12px', fontSize: 12 },
  cards6:     { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12, marginBottom: 20 },
  card:       { background: '#111827', border: '1px solid #1f2937', borderRadius: 10, padding: '16px 18px' },
  cardLabel:  { fontSize: 11, color: '#4b5563', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: .9 },
  cardVal:    { fontSize: 26, fontWeight: 800, margin: 0 },
  block:      { background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: '20px 22px', marginBottom: 18 },
  blockTitle: { fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 16px' },
  tbl:        { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  tr:         { borderBottom: '1px solid #111827', transition: 'background .1s' },
  barBg:      { height: 5, background: '#1e293b', borderRadius: 3, overflow: 'hidden', minWidth: 80 },
  barFill:    { height: '100%', background: '#f59e0b', borderRadius: 3, transition: 'width .5s' },
  miniCard:   { background: '#111827', border: '1px solid #1f2937', borderRadius: 8, padding: '12px 16px' },
  miniLabel:  { fontSize: 11, color: '#4b5563', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: .8 },
  miniVal:    { fontSize: 22, fontWeight: 800, margin: 0 },
  overlay:    { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', zIndex: 999, display: 'flex', justifyContent: 'flex-end' },
  drawer:     { background: '#0f172a', borderLeft: '1px solid #1e293b', width: '100%', maxWidth: 480, height: '100vh', display: 'flex', flexDirection: 'column', zIndex: 1000 },
  drawerHdr:  { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', borderBottom: '1px solid #1e293b' },
  drawerTitle:{ margin: 0, fontSize: 16, fontWeight: 700, color: '#f59e0b' },
  drawerBody: { flex: 1, overflowY: 'auto', padding: '20px 22px' },
  closeBtn:   { background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: 20, lineHeight: 1 },
  modal:      { background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 24, width: '90%', maxWidth: 460, margin: 'auto', alignSelf: 'center' },
  detLabel:   { fontSize: 10, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 8px', fontWeight: 700 },
  detCard:    { background: '#0a0a0a', border: '1px solid #1f2937', borderRadius: 8, padding: '10px 14px' },
  timeline:   { background: '#0a0a0a', border: '1px solid #1f2937', borderRadius: 8, overflow: 'hidden' },
  timelineRow:{ display: 'flex', justifyContent: 'space-between', padding: '8px 14px', borderBottom: '1px solid #111827', alignItems: 'center' },
};
