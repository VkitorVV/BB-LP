'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface SectionData {
  order: number;
  id: string;
  title: string;
  reached: number;
  percentOfHero: number;
  dropFromPrevious: number;
}

interface CheckoutClicks {
  plano_basico_popup_open: number;
  plano_basico: number;
  kit_completo: number;
  kit_desconto_popup: number;
}

interface CampaignRow {
  utmCampaign: string;
  sessions: number;
  clicks: number;
  purchases: number;
  revenue: number;
}

interface AdsetRow {
  adsetId: string;
  sessions: number;
  clicks: number;
  purchases: number;
  revenue: number;
}

interface CreativeRow {
  utmContent: string;
  sessions: number;
  clicks: number;
  purchases: number;
  revenue: number;
}

interface SessionRow {
  session_id: string;
  first_seen: string;
  last_seen: string;
  utm_campaign: string | null;
  utm_source: string | null;
  max_section_title: string | null;
  max_section_order: number | null;
  clicks_count: number | null;
  purchased: boolean | null;
}

interface DashboardData {
  date: string;
  activeUsersLast30Min: number;
  totalSessionsToday: number;
  sections: SectionData[];
  checkoutClicks: CheckoutClicks;
  purchases: { count: number; revenue: number };
  campaigns: CampaignRow[];
  adsets: AdsetRow[];
  creatives: CreativeRow[];
  sessions: SessionRow[];
  updatedAt: string;
}

interface SessionDetail {
  session: Record<string, unknown> | null;
  sectionEvents: Record<string, unknown>[];
  clickEvents: Record<string, unknown>[];
  purchase: Record<string, unknown> | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n: number | null | undefined) { return (n ?? 0).toLocaleString('pt-BR'); }
function fmtBRL(n: number | null | undefined) {
  return (n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
function pctColor(pct: number): string {
  if (pct >= 70) return '#4ade80';
  if (pct >= 40) return '#f59e0b';
  return '#ff6b6b';
}
function todayStr() { return new Date().toISOString().split('T')[0]; }

// ── Main component ────────────────────────────────────────────────────────────

export default function FunilPage() {
  const [token, setToken]       = useState('');
  const [date, setDate]         = useState(todayStr());
  const [data, setData]         = useState<DashboardData | null>(null);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [lastUpdate, setLastUpdate] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [sessionDetail, setSessionDetail]     = useState<SessionDetail | null>(null);
  const [detailLoading, setDetailLoading]     = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Read token from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get('token') || '');
  }, []);

  const fetchData = useCallback(async (tok: string, d: string) => {
    if (!tok) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/funnel-dashboard?token=${encodeURIComponent(tok)}&date=${d}`);
      if (res.status === 401) { setError('Acesso negado. Token inválido.'); setData(null); return; }
      if (!res.ok) {
        let detail = '';
        try { const j = await res.json() as { error?: string }; detail = j.error || ''; } catch { /* ignore */ }
        setError(`Erro ${res.status}${detail ? ': ' + detail : ''}.`);
        return;
      }
      const json = await res.json() as DashboardData;
      setData(json);
      setError('');
      setLastUpdate(new Date().toLocaleTimeString('pt-BR'));
    } catch (e) {
      setError(`Erro de conexão: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch when token is set
  useEffect(() => {
    if (token) fetchData(token, date);
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-fetch when date changes
  useEffect(() => {
    if (token) fetchData(token, date);
  }, [date]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-refresh toggle (min 60s)
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (autoRefresh && token) {
      intervalRef.current = setInterval(() => fetchData(token, date), 60_000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [autoRefresh, token, date, fetchData]);

  // Session detail modal
  const openSessionDetail = useCallback(async (sessionId: string) => {
    setSelectedSession(sessionId);
    setDetailLoading(true);
    try {
      const res = await fetch(
        `/api/funnel-session?token=${encodeURIComponent(token)}&sessionId=${encodeURIComponent(sessionId)}&date=${date}`
      );
      const json = await res.json() as SessionDetail;
      setSessionDetail(json);
    } catch {
      setSessionDetail(null);
    } finally {
      setDetailLoading(false);
    }
  }, [token, date]);

  const closeModal = () => { setSelectedSession(null); setSessionDetail(null); };

  // Export
  const exportData = (type: 'csv' | 'json') => {
    window.open(`/api/funnel-export?token=${encodeURIComponent(token)}&date=${date}&type=${type}`, '_blank');
  };

  // Clear data
  const clearDay = async () => {
    if (!confirm(`Limpar TODOS os dados de ${date}? Esta ação não pode ser desfeita.`)) return;
    const res = await fetch('/api/funnel-clear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, date }),
    });
    if (res.ok) {
      setData(null);
      fetchData(token, date);
    }
  };

  // ── Render: error state ──────────────────────────────────────────────────
  if (error) {
    return (
      <div style={styles.center}>
        <div style={styles.errorBox}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
          <p style={{ color: '#ff6b6b', fontWeight: 700 }}>{error}</p>
          <button style={styles.btnSmall} onClick={() => { setError(''); fetchData(token, date); }}>
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!data && !loading) {
    return (
      <div style={styles.center}>
        <div style={{ color: '#666' }}>Aguardando token na URL (?token=...)...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={styles.center}>
        <div style={{ color: '#888' }}>Carregando...</div>
      </div>
    );
  }

  const totalClicks = (data.checkoutClicks.plano_basico_popup_open || 0) + (data.checkoutClicks.kit_completo || 0);

  // ── Render: main dashboard ───────────────────────────────────────────────
  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* ── Header ── */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>FUNIL — Mapa do Degradê</h1>
            <p style={styles.subtitle}>Atualizado às {lastUpdate}</p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Date picker */}
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={styles.dateInput}
            />
            {/* Auto-refresh toggle */}
            <button
              onClick={() => setAutoRefresh((p) => !p)}
              style={{ ...styles.btnSmall, background: autoRefresh ? '#166534' : '#1f1f1f', color: autoRefresh ? '#4ade80' : '#888' }}
            >
              {autoRefresh ? '⟳ Auto 60s' : '⟳ Auto OFF'}
            </button>
            {/* Manual refresh */}
            <button
              onClick={() => fetchData(token, date)}
              disabled={loading}
              style={{ ...styles.btnSmall, background: '#1f1f1f', color: loading ? '#F28A1A' : '#ccc' }}
            >
              {loading ? '...' : '↺ Atualizar'}
            </button>
          </div>
        </div>

        {/* ── Summary cards ── */}
        <div style={styles.cardGrid}>
          {[
            { label: 'Ativos 30min',   value: fmt(data.activeUsersLast30Min), color: '#4ade80' },
            { label: 'Total sessões',  value: fmt(data.totalSessionsToday),   color: '#60a5fa' },
            { label: 'Cliques CTA',   value: fmt(totalClicks),                color: '#f59e0b' },
            { label: 'Compras',        value: fmt(data.purchases.count),       color: '#fb923c' },
            { label: 'Receita',        value: fmtBRL(data.purchases.revenue),  color: '#a78bfa' },
          ].map((card) => (
            <div key={card.label} style={styles.card}>
              <p style={styles.cardLabel}>{card.label}</p>
              <p style={{ ...styles.cardValue, color: card.color }}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* ── Funnel sections table ── */}
        <Section title="Funil de Seções">
          <table style={styles.table}>
            <thead>
              <tr style={{ color: '#555' }}>
                <th style={th}>Seção</th>
                <th style={{ ...th, textAlign: 'right' }}>Alcançaram</th>
                <th style={{ ...th, textAlign: 'right' }}>% do Topo</th>
                <th style={{ ...th, textAlign: 'right' }}>Drop</th>
                <th style={{ ...th, minWidth: 100 }}>Barra</th>
              </tr>
            </thead>
            <tbody>
              {data.sections.map((s) => (
                <tr key={s.id} style={styles.tableRow}>
                  <td style={td}>{s.title}</td>
                  <td style={{ ...td, textAlign: 'right', fontWeight: 700 }}>{fmt(s.reached)}</td>
                  <td style={{ ...td, textAlign: 'right', color: pctColor(s.percentOfHero) }}>{s.percentOfHero}%</td>
                  <td style={{ ...td, textAlign: 'right', color: s.dropFromPrevious > 30 ? '#ff6b6b' : '#888' }}>
                    {s.dropFromPrevious > 0 ? `-${s.dropFromPrevious}%` : '—'}
                  </td>
                  <td style={td}>
                    <div style={styles.barBg}>
                      <div style={{ ...styles.barFill, width: `${s.percentOfHero}%` }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        {/* ── Checkout clicks ── */}
        <Section title="Cliques em Checkout">
          <div style={styles.clickGrid}>
            {[
              { label: 'Básico → popup',  val: data.checkoutClicks.plano_basico_popup_open },
              { label: 'Kit (PV)',         val: data.checkoutClicks.kit_completo },
              { label: 'Kit desconto',     val: data.checkoutClicks.kit_desconto_popup },
              { label: 'Continua Básico',  val: data.checkoutClicks.plano_basico },
            ].map((c) => (
              <div key={c.label} style={styles.clickCard}>
                <p style={styles.cardLabel}>{c.label}</p>
                <p style={{ ...styles.cardValue, fontSize: 22, color: '#60a5fa' }}>{fmt(c.val || 0)}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Campaigns ── */}
        {data.campaigns.length > 0 && (
          <Section title="Por Campanha (utm_campaign)">
            <TableGrid
              headers={['Campanha', 'Sessões', 'Cliques', 'Compras', 'Receita']}
              rows={data.campaigns.map((c) => [
                c.utmCampaign,
                fmt(c.sessions),
                fmt(c.clicks),
                fmt(c.purchases),
                fmtBRL(c.revenue),
              ])}
            />
          </Section>
        )}

        {/* ── Adsets ── */}
        {data.adsets.length > 0 && (
          <Section title="Por Conjunto de Anúncios (adset_id)">
            <TableGrid
              headers={['Adset ID', 'Sessões', 'Cliques', 'Compras', 'Receita']}
              rows={data.adsets.map((a) => [
                a.adsetId,
                fmt(a.sessions),
                fmt(a.clicks),
                fmt(a.purchases),
                fmtBRL(a.revenue),
              ])}
            />
          </Section>
        )}

        {/* ── Creatives ── */}
        {data.creatives.length > 0 && (
          <Section title="Por Criativo (utm_content)">
            <TableGrid
              headers={['Criativo', 'Sessões', 'Cliques', 'Compras', 'Receita']}
              rows={data.creatives.map((c) => [
                c.utmContent,
                fmt(c.sessions),
                fmt(c.clicks),
                fmt(c.purchases),
                fmtBRL(c.revenue),
              ])}
            />
          </Section>
        )}

        {/* ── Recent sessions ── */}
        {data.sessions.length > 0 && (
          <Section title={`Sessões Recentes (${data.sessions.length})`}>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr style={{ color: '#555' }}>
                    <th style={th}>Session ID</th>
                    <th style={th}>Campanha</th>
                    <th style={th}>Fonte</th>
                    <th style={th}>Última seção</th>
                    <th style={{ ...th, textAlign: 'right' }}>Cliques</th>
                    <th style={{ ...th, textAlign: 'center' }}>Comprou</th>
                    <th style={th}>Última vista</th>
                  </tr>
                </thead>
                <tbody>
                  {data.sessions.map((s) => (
                    <tr
                      key={s.session_id}
                      style={{ ...styles.tableRow, cursor: 'pointer' }}
                      onClick={() => openSessionDetail(s.session_id)}
                    >
                      <td style={{ ...td, fontFamily: 'monospace', fontSize: 11, color: '#60a5fa' }}>
                        {s.session_id.slice(0, 16)}…
                      </td>
                      <td style={{ ...td, fontSize: 12 }}>{s.utm_campaign || '—'}</td>
                      <td style={{ ...td, fontSize: 12 }}>{s.utm_source || '—'}</td>
                      <td style={{ ...td, fontSize: 12 }}>{s.max_section_title || '—'}</td>
                      <td style={{ ...td, textAlign: 'right' }}>{fmt(s.clicks_count)}</td>
                      <td style={{ ...td, textAlign: 'center' }}>
                        {s.purchased ? <span style={{ color: '#4ade80' }}>✓</span> : '—'}
                      </td>
                      <td style={{ ...td, fontSize: 11, color: '#666' }}>
                        {s.last_seen ? new Date(s.last_seen).toLocaleTimeString('pt-BR') : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        )}

        {/* ── Action buttons ── */}
        <div style={styles.actions}>
          <button onClick={() => exportData('csv')} style={styles.btnAction}>
            ⬇ Exportar CSV
          </button>
          <button onClick={() => exportData('json')} style={styles.btnAction}>
            ⬇ Exportar JSON
          </button>
          <button onClick={clearDay} style={{ ...styles.btnAction, background: '#3f0000', color: '#ff6b6b', borderColor: '#7f1d1d' }}>
            🗑 Limpar dados de {date}
          </button>
        </div>

        <p style={styles.footer}>
          Dados do dia {date} · Sem dados pessoais · {data.updatedAt}
        </p>
      </div>

      {/* ── Session detail modal ── */}
      {selectedSession && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: '#F28A1A', margin: 0 }}>
                Detalhe da Sessão
              </h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>

            {detailLoading ? (
              <div style={{ color: '#888', textAlign: 'center', padding: 24 }}>Carregando...</div>
            ) : sessionDetail ? (
              <div style={{ overflowY: 'auto', maxHeight: '60vh' }}>
                {/* Session info */}
                <p style={styles.modalLabel}>SESSION ID</p>
                <p style={styles.modalMono}>{selectedSession}</p>

                {sessionDetail.session && (
                  <>
                    <p style={styles.modalLabel}>UTM</p>
                    <p style={styles.modalMono}>
                      campaign: {(sessionDetail.session.utm_campaign as string) || '—'} |
                      content: {(sessionDetail.session.utm_content as string) || '—'} |
                      source: {(sessionDetail.session.utm_source as string) || '—'}
                    </p>
                    <p style={styles.modalLabel}>PROGRESSO</p>
                    <p style={styles.modalMono}>
                      Seção máx: {(sessionDetail.session.max_section_title as string) || '—'} (ordem {sessionDetail.session.max_section_order as number}) |
                      Cliques: {sessionDetail.session.clicks_count as number} |
                      Comprou: {sessionDetail.session.purchased ? '✓ SIM' : 'não'}
                    </p>
                  </>
                )}

                {/* Section events */}
                {sessionDetail.sectionEvents.length > 0 && (
                  <>
                    <p style={styles.modalLabel}>SEÇÕES VISITADAS ({sessionDetail.sectionEvents.length})</p>
                    <div style={styles.eventList}>
                      {sessionDetail.sectionEvents.map((ev, i) => (
                        <div key={i} style={styles.eventRow}>
                          <span style={{ color: '#60a5fa' }}>{ev.section_order as number}.</span>{' '}
                          {ev.section_title as string}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Click events */}
                {sessionDetail.clickEvents.length > 0 && (
                  <>
                    <p style={styles.modalLabel}>CLIQUES ({sessionDetail.clickEvents.length})</p>
                    <div style={styles.eventList}>
                      {sessionDetail.clickEvents.map((ev, i) => (
                        <div key={i} style={styles.eventRow}>
                          <span style={{ color: '#f59e0b' }}>{ev.checkout_type as string}</span>
                          {ev.button_location ? ` · ${ev.button_location as string}` : ''}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Purchase */}
                {sessionDetail.purchase && (
                  <>
                    <p style={styles.modalLabel}>COMPRA</p>
                    <p style={{ ...styles.modalMono, color: '#4ade80' }}>
                      {fmtBRL(sessionDetail.purchase.amount as number)} · {sessionDetail.purchase.checkout_title as string}
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div style={{ color: '#888', textAlign: 'center', padding: 24 }}>Sessão não encontrada.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      {children}
    </div>
  );
}

function TableGrid({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={styles.table}>
        <thead>
          <tr style={{ color: '#555' }}>
            {headers.map((h, i) => (
              <th key={h} style={{ ...th, textAlign: i === 0 ? 'left' : 'right' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={styles.tableRow}>
              {row.map((cell, ci) => (
                <td key={ci} style={{ ...td, textAlign: ci === 0 ? 'left' : 'right', fontWeight: ci === 0 ? 400 : 600 }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Style constants ───────────────────────────────────────────────────────────

const th: React.CSSProperties = {
  padding: '8px 10px',
  fontWeight: 600,
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: 0.8,
  borderBottom: '1px solid #222',
};

const td: React.CSSProperties = {
  padding: '10px 10px',
  color: '#ccc',
  verticalAlign: 'middle',
};

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#0f0f0f', color: '#fff', fontFamily: 'system-ui, sans-serif', padding: '24px 16px' },
  container: { maxWidth: 960, margin: '0 auto' },
  center: { minHeight: '100vh', background: '#0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  errorBox: { background: '#1a1a1a', border: '1px solid #333', borderRadius: 12, padding: 32, textAlign: 'center', color: '#fff' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 },
  title: { fontSize: 20, fontWeight: 800, margin: 0, color: '#F28A1A' },
  subtitle: { fontSize: 11, color: '#555', margin: '4px 0 0' },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 28 },
  card: { background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, padding: '16px 20px' },
  cardLabel: { fontSize: 11, color: '#555', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: 1 },
  cardValue: { fontSize: 26, fontWeight: 800, margin: 0 },
  section: { background: '#141414', border: '1px solid #222', borderRadius: 10, padding: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 13, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 16px' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  tableRow: { borderBottom: '1px solid #1f1f1f' },
  barBg: { height: 6, background: '#222', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', background: '#F28A1A', borderRadius: 4, transition: 'width .4s' },
  clickGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 },
  clickCard: { background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, padding: '12px 16px' },
  actions: { display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8, marginBottom: 16 },
  btnAction: { background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, color: '#ccc', padding: '8px 16px', fontSize: 13, cursor: 'pointer' },
  btnSmall: { border: '1px solid #333', borderRadius: 6, padding: '6px 12px', fontSize: 12, cursor: 'pointer' },
  dateInput: { background: '#1a1a1a', border: '1px solid #333', borderRadius: 6, color: '#ccc', padding: '6px 10px', fontSize: 12 },
  footer: { textAlign: 'center', fontSize: 10, color: '#333', marginTop: 16 },
  // Modal
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#1a1a1a', border: '1px solid #333', borderRadius: 12, padding: 24, width: '90%', maxWidth: 560 },
  modalLabel: { fontSize: 10, color: '#555', textTransform: 'uppercase', letterSpacing: 1, margin: '12px 0 4px' },
  modalMono: { fontFamily: 'monospace', fontSize: 12, color: '#ccc', margin: 0, wordBreak: 'break-all' },
  eventList: { background: '#111', borderRadius: 6, padding: 10, marginBottom: 4 },
  eventRow: { fontSize: 12, color: '#aaa', padding: '3px 0' },
};
