'use client';

import React, { useEffect, useState, useCallback } from 'react';

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

interface CampaignData {
  utmCampaign: string;
  sessions: number;
  reachedOffer: number;
  checkoutClicks: number;
  purchases: number;
  revenue: number;
}

interface CreativeData {
  utmContent: string;
  sessions: number;
  reachedOffer: number;
  checkoutClicks: number;
  purchases: number;
  revenue: number;
}

interface DashboardData {
  activeUsersLast30Min: number;
  sections: SectionData[];
  checkoutClicks: CheckoutClicks;
  purchases: { count: number; revenue: number };
  campaigns: CampaignData[];
  creatives: CreativeData[];
  updatedAt: string;
}

function fmt(n: number) { return n?.toLocaleString('pt-BR') ?? '0'; }
function fmtBRL(n: number) {
  return (n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function FunilPage() {
  const [token, setToken]   = useState('');
  const [data, setData]     = useState<DashboardData | null>(null);
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token') || '';
    setToken(t);
  }, []);

  const fetchData = useCallback(async (tok: string) => {
    if (!tok) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/funnel-dashboard?token=${encodeURIComponent(tok)}`);
      if (res.status === 401) { setError('Acesso negado. Token inválido.'); setData(null); return; }
      if (!res.ok) { setError('Erro ao carregar dados.'); return; }
      const json = await res.json() as DashboardData;
      setData(json);
      setError('');
      setLastUpdate(new Date().toLocaleTimeString('pt-BR'));
    } catch {
      setError('Erro de conexão.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    fetchData(token);
    const interval = setInterval(() => fetchData(token), 5000);
    return () => clearInterval(interval);
  }, [token, fetchData]);

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 12, padding: 32, textAlign: 'center', color: '#fff' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
          <p style={{ color: '#ff6b6b', fontWeight: 700 }}>{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
        {loading ? 'Carregando...' : 'Aguardando token...'}
      </div>
    );
  }

  const totalClicks = (data.checkoutClicks.plano_basico_popup_open || 0)
    + (data.checkoutClicks.kit_completo || 0);

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', color: '#fff', fontFamily: 'system-ui, sans-serif', padding: '24px 16px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: '#F28A1A' }}>
              FUNIL — Mapa do Degradê
            </h1>
            <p style={{ fontSize: 11, color: '#666', margin: '4px 0 0' }}>
              Atualizado às {lastUpdate} · auto-refresh 5s
            </p>
          </div>
          <div style={{ fontSize: 11, color: loading ? '#F28A1A' : '#555' }}>
            {loading ? '⟳ atualizando...' : '● ao vivo'}
          </div>
        </div>

        {/* Cards de resumo */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 28 }}>
          {[
            { label: 'Ativos (30min)', value: fmt(data.activeUsersLast30Min), color: '#4ade80' },
            { label: 'Cliques CTA',   value: fmt(totalClicks),                color: '#60a5fa' },
            { label: 'Compras',        value: fmt(data.purchases.count),       color: '#f59e0b' },
            { label: 'Receita',        value: fmtBRL(data.purchases.revenue),  color: '#a78bfa' },
          ].map((card) => (
            <div key={card.label} style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, padding: '16px 20px' }}>
              <p style={{ fontSize: 11, color: '#666', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: 1 }}>{card.label}</p>
              <p style={{ fontSize: 26, fontWeight: 800, margin: 0, color: card.color }}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Tabela de funil */}
        <Section title="Funil de Seções">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ color: '#666', textAlign: 'left' }}>
                <th style={th}>Seção</th>
                <th style={{ ...th, textAlign: 'right' }}>Alcançaram</th>
                <th style={{ ...th, textAlign: 'right' }}>% do Topo</th>
                <th style={{ ...th, textAlign: 'right' }}>Drop</th>
                <th style={{ ...th, minWidth: 100 }}>Barra</th>
              </tr>
            </thead>
            <tbody>
              {data.sections.map((s) => (
                <tr key={s.id} style={{ borderBottom: '1px solid #1f1f1f' }}>
                  <td style={td}>{s.title}</td>
                  <td style={{ ...td, textAlign: 'right', fontWeight: 700 }}>{fmt(s.reached)}</td>
                  <td style={{ ...td, textAlign: 'right', color: pctColor(s.percentOfHero) }}>{s.percentOfHero}%</td>
                  <td style={{ ...td, textAlign: 'right', color: s.dropFromPrevious > 30 ? '#ff6b6b' : '#888' }}>
                    {s.dropFromPrevious > 0 ? `-${s.dropFromPrevious}%` : '—'}
                  </td>
                  <td style={td}>
                    <div style={{ height: 6, background: '#222', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${s.percentOfHero}%`, background: '#F28A1A', borderRadius: 4, transition: 'width .4s' }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        {/* Cliques por tipo */}
        <Section title="Cliques em Checkout">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
            {[
              { label: 'Básico → popup',   val: data.checkoutClicks.plano_basico_popup_open },
              { label: 'Kit (PV)',          val: data.checkoutClicks.kit_completo },
              { label: 'Kit desconto',      val: data.checkoutClicks.kit_desconto_popup },
              { label: 'Continua Básico',   val: data.checkoutClicks.plano_basico },
            ].map((c) => (
              <div key={c.label} style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, padding: '12px 16px' }}>
                <p style={{ fontSize: 11, color: '#666', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: 1 }}>{c.label}</p>
                <p style={{ fontSize: 22, fontWeight: 800, margin: 0, color: '#60a5fa' }}>{fmt(c.val || 0)}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Campanhas */}
        {data.campaigns.length > 0 && (
          <Section title="Por Campanha (utm_campaign)">
            <TableGrid
              headers={['Campanha', 'Sessões', 'Chegou oferta', 'Cliques CTA', 'Compras', 'Receita']}
              rows={data.campaigns.map((c) => [
                c.utmCampaign,
                fmt(c.sessions),
                fmt(c.reachedOffer),
                fmt(c.checkoutClicks),
                fmt(c.purchases),
                fmtBRL(c.revenue),
              ])}
            />
          </Section>
        )}

        {/* Criativos */}
        {data.creatives.length > 0 && (
          <Section title="Por Criativo (utm_content)">
            <TableGrid
              headers={['Criativo', 'Sessões', 'Chegou oferta', 'Cliques CTA', 'Compras', 'Receita']}
              rows={data.creatives.map((c) => [
                c.utmContent,
                fmt(c.sessions),
                fmt(c.reachedOffer),
                fmt(c.checkoutClicks),
                fmt(c.purchases),
                fmtBRL(c.revenue),
              ])}
            />
          </Section>
        )}

        <p style={{ textAlign: 'center', fontSize: 10, color: '#333', marginTop: 32 }}>
          Dados dos últimos 7 dias · Sem dados pessoais · {data.updatedAt}
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#141414', border: '1px solid #222', borderRadius: 10, padding: 20, marginBottom: 20 }}>
      <h2 style={{ fontSize: 13, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 16px' }}>{title}</h2>
      {children}
    </div>
  );
}

function TableGrid({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ color: '#555' }}>
            {headers.map((h, i) => (
              <th key={h} style={{ ...th, textAlign: i === 0 ? 'left' : 'right' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={{ borderBottom: '1px solid #1f1f1f' }}>
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

function pctColor(pct: number): string {
  if (pct >= 70) return '#4ade80';
  if (pct >= 40) return '#f59e0b';
  return '#ff6b6b';
}

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
