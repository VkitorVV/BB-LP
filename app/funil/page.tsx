'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface SectionData {
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
interface CampaignRow extends MapRow { utmCampaign: string; }
interface AdsetRow    extends MapRow { adsetId: string; }
interface CreativeRow extends MapRow { utmContent: string; }
interface SessionRow {
  session_id: string; userLabel: string; status: 'online'|'recente'|'inativo';
  first_seen: string; last_seen: string;
  utm_campaign?: string; utm_source?: string; utm_content?: string;
  utm_term?: string; adset_id?: string; ad_id?: string;
  max_section_title?: string; max_section_order?: number;
  clicks_count?: number; purchased?: boolean;
}
interface DashboardData {
  date: string; window: string;
  activeNow: number; active30m: number;
  totalSessionsInWindow: number; totalClicks: number;
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

const fmt    = (n?: number|null) => (n ?? 0).toLocaleString('pt-BR');
const fmtBRL = (n?: number|null) => (n||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const fmtTime = (iso?: string|null) => iso ? new Date(iso).toLocaleTimeString('pt-BR') : '—';
const pctColor = (p: number) => p >= 70 ? '#4ade80' : p >= 40 ? '#f59e0b' : '#ff6b6b';
const today = () => new Date().toISOString().split('T')[0];
const statusColor = (s: string) => s === 'online' ? '#4ade80' : s === 'recente' ? '#f59e0b' : '#555';
const statusDot   = (s: string) => s === 'online' ? '●' : s === 'recente' ? '◑' : '○';

const WINDOWS = [
  { value: '90s',  label: 'Agora/90s' },
  { value: '30m',  label: '30 min' },
  { value: '1h',   label: '1 hora' },
  { value: '2h',   label: '2 horas' },
  { value: '4h',   label: '4 horas' },
  { value: '12h',  label: '12 horas' },
  { value: '24h',  label: '24 horas' },
  { value: 'today',label: 'Hoje (dia todo)' },
];

// ── Main component ────────────────────────────────────────────────────────────

export default function FunilPage() {
  const [token, setToken]     = useState('');
  const [date, setDate]       = useState(today());
  const [win, setWin]         = useState('today');
  const [data, setData]       = useState<DashboardData | null>(null);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState('');
  const [autoRefresh, setAutoRefresh]   = useState(false);
  const [selectedSid, setSelectedSid]   = useState<string | null>(null);
  const [detail, setDetail]             = useState<SessionDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [clearInput, setClearInput]     = useState('');
  const [showClearModal, setShowClearModal] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>|null>(null);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setToken(p.get('token') || '');
  }, []);

  const fetchData = useCallback(async (tok: string, d: string, w: string) => {
    if (!tok) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/funnel-dashboard?token=${encodeURIComponent(tok)}&date=${d}&window=${w}`);
      if (res.status === 401) { setError('Acesso negado.'); setData(null); return; }
      if (!res.ok) {
        const j = await res.json().catch(() => ({})) as {error?:string};
        setError(`Erro ${res.status}${j.error ? ': '+j.error : ''}`);
        return;
      }
      setData(await res.json() as DashboardData);
      setError('');
      setLastUpdate(new Date().toLocaleTimeString('pt-BR'));
    } catch (e) {
      setError(`Conexão: ${e instanceof Error ? e.message : e}`);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { if (token) fetchData(token, date, win); }, [token]);             // eslint-disable-line
  useEffect(() => { if (token) fetchData(token, date, win); }, [date, win]);         // eslint-disable-line
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (autoRefresh && token) intervalRef.current = setInterval(() => fetchData(token, date, win), 60_000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [autoRefresh, token, date, win, fetchData]);

  const openDetail = useCallback(async (sid: string) => {
    setSelectedSid(sid); setDetailLoading(true);
    try {
      const res = await fetch(`/api/funnel-session?token=${encodeURIComponent(token)}&sessionId=${encodeURIComponent(sid)}&date=${date}`);
      setDetail(await res.json() as SessionDetail);
    } catch { setDetail(null); }
    finally { setDetailLoading(false); }
  }, [token, date]);

  const closeDetail = () => { setSelectedSid(null); setDetail(null); };

  const exportData = (type: 'csv'|'json') =>
    window.open(`/api/funnel-export?token=${encodeURIComponent(token)}&date=${date}&type=${type}`, '_blank');

  const clearDay = async () => {
    if (clearInput !== 'LIMPAR') return;
    const res = await fetch('/api/funnel-clear', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ token, date }),
    });
    if (res.ok) { setShowClearModal(false); setClearInput(''); fetchData(token, date, win); }
  };

  // ── Error / loading states ────────────────────────────────────────────────
  if (error) return (
    <div style={s.center}>
      <div style={s.errorBox}>
        <div style={{fontSize:32,marginBottom:12}}>🔒</div>
        <p style={{color:'#ff6b6b',fontWeight:700,marginBottom:16}}>{error}</p>
        <button style={s.btn} onClick={()=>{setError('');fetchData(token,date,win);}}>Tentar novamente</button>
      </div>
    </div>
  );
  if (!data) return <div style={s.center}><div style={{color:'#888'}}>{loading?'Carregando...':'Aguardando token (?token=)...'}</div></div>;

  const totalClicks = Object.values(data.checkoutClicks).reduce((a,b)=>a+b,0);

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <div style={s.page}>
      <div style={s.container}>

        {/* Header */}
        <div style={s.header}>
          <div>
            <h1 style={s.title}>FUNIL — Mapa do Degradê</h1>
            <p style={s.sub}>Atualizado às {lastUpdate}</p>
          </div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
            <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={s.dateInput}/>
            <select value={win} onChange={e=>setWin(e.target.value)} style={s.dateInput}>
              {WINDOWS.map(w=><option key={w.value} value={w.value}>{w.label}</option>)}
            </select>
            <button onClick={()=>setAutoRefresh(p=>!p)} style={{...s.btn,background:autoRefresh?'#166534':'#1f1f1f',color:autoRefresh?'#4ade80':'#888'}}>
              {autoRefresh?'⟳ Auto 60s':'⟳ Auto OFF'}
            </button>
            <button onClick={()=>fetchData(token,date,win)} disabled={loading} style={{...s.btn,background:'#1f1f1f',color:loading?'#F28A1A':'#ccc'}}>
              {loading?'...':'↺ Atualizar'}
            </button>
          </div>
        </div>

        {/* Cards */}
        <div style={s.cardGrid}>
          {[
            {label:'● Ativos agora',  val:fmt(data.activeNow),              color:'#4ade80'},
            {label:'◑ Ativos 30min',  val:fmt(data.active30m),              color:'#a3e635'},
            {label:'Sessões período', val:fmt(data.totalSessionsInWindow),   color:'#60a5fa'},
            {label:'Cliques CTA',     val:fmt(totalClicks),                  color:'#f59e0b'},
            {label:'Compras',         val:fmt(data.purchases.count),         color:'#fb923c'},
            {label:'Receita',         val:fmtBRL(data.purchases.revenue),    color:'#a78bfa'},
          ].map(c=>(
            <div key={c.label} style={s.card}>
              <p style={s.cardLabel}>{c.label}</p>
              <p style={{...s.cardVal,color:c.color}}>{c.val}</p>
            </div>
          ))}
        </div>

        {/* Funnel */}
        <Block title="Funil por Seção">
          <table style={s.table}>
            <thead><tr style={{color:'#555'}}>
              <th style={th}>Seção</th>
              <th style={{...th,textAlign:'right'}}>Alcançaram</th>
              <th style={{...th,textAlign:'right'}}>% Topo</th>
              <th style={{...th,textAlign:'right'}}>Drop</th>
              <th style={{...th,minWidth:80}}>Barra</th>
            </tr></thead>
            <tbody>{data.sections.map(sec=>(
              <tr key={sec.id} style={s.tr}>
                <td style={td}>{sec.title}</td>
                <td style={{...td,textAlign:'right',fontWeight:700}}>{fmt(sec.reached)}</td>
                <td style={{...td,textAlign:'right',color:pctColor(sec.percentOfHero)}}>{sec.percentOfHero}%</td>
                <td style={{...td,textAlign:'right',color:sec.dropFromPrevious>30?'#ff6b6b':'#666'}}>
                  {sec.dropFromPrevious>0?`-${sec.dropFromPrevious}%`:'—'}
                </td>
                <td style={td}>
                  <div style={s.barBg}><div style={{...s.barFill,width:`${sec.percentOfHero}%`}}/></div>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </Block>

        {/* Checkout clicks */}
        <Block title="Cliques em Checkout">
          <div style={s.clickGrid}>
            {[
              {label:'Básico → popup', val:data.checkoutClicks.plano_basico_popup_open},
              {label:'Kit (PV)',       val:data.checkoutClicks.kit_completo},
              {label:'Kit desconto',  val:data.checkoutClicks.kit_desconto_popup},
              {label:'Continua Bás.', val:data.checkoutClicks.plano_basico},
            ].map(c=>(
              <div key={c.label} style={s.card}>
                <p style={s.cardLabel}>{c.label}</p>
                <p style={{...s.cardVal,fontSize:22,color:'#60a5fa'}}>{fmt(c.val||0)}</p>
              </div>
            ))}
          </div>
        </Block>

        {/* Campaigns */}
        {data.campaigns.length>0&&<Block title="Por Campanha">
          <Grid headers={['Campanha','Sessões','Oferta','Cliques','Compras','Receita','CTR%','Conv%']}
            rows={data.campaigns.map(c=>[c.utmCampaign,fmt(c.sessions),fmt(c.reachedOffer),fmt(c.clicks),fmt(c.purchases),fmtBRL(c.revenue),c.conversionClick+'%',c.conversionPurchase+'%'])}/>
        </Block>}

        {/* Adsets */}
        {data.adsets.length>0&&<Block title="Por Conjunto (adset_id)">
          <Grid headers={['Adset','Sessões','Oferta','Cliques','Compras','Receita','CTR%','Conv%']}
            rows={data.adsets.map(a=>[a.adsetId,fmt(a.sessions),fmt(a.reachedOffer),fmt(a.clicks),fmt(a.purchases),fmtBRL(a.revenue),a.conversionClick+'%',a.conversionPurchase+'%'])}/>
        </Block>}

        {/* Creatives */}
        {data.creatives.length>0&&<Block title="Por Criativo (utm_content)">
          <Grid headers={['Criativo','Sessões','Oferta','Cliques','Compras','Receita','CTR%','Conv%']}
            rows={data.creatives.map(c=>[c.utmContent,fmt(c.sessions),fmt(c.reachedOffer),fmt(c.clicks),fmt(c.purchases),fmtBRL(c.revenue),c.conversionClick+'%',c.conversionPurchase+'%'])}/>
        </Block>}

        {/* Sessions */}
        {data.sessions.length>0&&<Block title={`Usuários Anônimos (${data.sessions.length})`}>
          <div style={{overflowX:'auto'}}>
            <table style={s.table}>
              <thead><tr style={{color:'#555'}}>
                <th style={th}>Usuário</th>
                <th style={th}>Status</th>
                <th style={th}>1ª visita</th>
                <th style={th}>Última ativ.</th>
                <th style={th}>Campanha</th>
                <th style={th}>Adset</th>
                <th style={th}>Criativo</th>
                <th style={th}>Última seção</th>
                <th style={{...th,textAlign:'right'}}>Cliques</th>
                <th style={{...th,textAlign:'center'}}>Comprou</th>
              </tr></thead>
              <tbody>{data.sessions.map(sess=>(
                <tr key={sess.session_id} style={{...s.tr,cursor:'pointer'}} onClick={()=>openDetail(sess.session_id)}>
                  <td style={{...td,color:'#60a5fa',fontFamily:'monospace',fontSize:11}}>{sess.userLabel}</td>
                  <td style={{...td,color:statusColor(sess.status)}}>{statusDot(sess.status)} {sess.status}</td>
                  <td style={{...td,fontSize:11}}>{fmtTime(sess.first_seen)}</td>
                  <td style={{...td,fontSize:11}}>{fmtTime(sess.last_seen)}</td>
                  <td style={{...td,fontSize:12}}>{sess.utm_campaign||'—'}</td>
                  <td style={{...td,fontSize:12}}>{sess.adset_id||'—'}</td>
                  <td style={{...td,fontSize:12}}>{sess.utm_content||'—'}</td>
                  <td style={{...td,fontSize:12}}>{sess.max_section_title||'—'}</td>
                  <td style={{...td,textAlign:'right'}}>{fmt(sess.clicks_count)}</td>
                  <td style={{...td,textAlign:'center'}}>{sess.purchased?<span style={{color:'#4ade80'}}>✓</span>:'—'}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </Block>}

        {/* Actions */}
        <div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:8,marginBottom:8}}>
          <button onClick={()=>exportData('csv')} style={s.btnAct}>⬇ Exportar CSV</button>
          <button onClick={()=>exportData('json')} style={s.btnAct}>⬇ Exportar JSON</button>
          <button onClick={()=>setShowClearModal(true)} style={{...s.btnAct,background:'#3f0000',color:'#ff6b6b',borderColor:'#7f1d1d'}}>
            🗑 Limpar {date}
          </button>
        </div>
        <p style={{textAlign:'center',fontSize:10,color:'#333',marginTop:8}}>
          Sem dados pessoais · {data.updatedAt}
        </p>

      </div>{/* /container */}

      {/* ── Session detail modal ── */}
      {selectedSid&&(
        <div style={s.overlay} onClick={closeDetail}>
          <div style={s.modal} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
              <h2 style={{fontSize:14,fontWeight:700,color:'#F28A1A',margin:0}}>Detalhe</h2>
              <button onClick={closeDetail} style={{background:'none',border:'none',color:'#888',cursor:'pointer',fontSize:18}}>✕</button>
            </div>
            {detailLoading?<div style={{color:'#888',textAlign:'center',padding:24}}>Carregando...</div>:detail?(
              <div style={{overflowY:'auto',maxHeight:'65vh'}}>
                {detail.session&&<>
                  <Label>SESSION</Label><Mono>{selectedSid.slice(0,20)}…</Mono>
                  <Label>STATUS / TEMPO</Label>
                  <Mono>Primeiro: {fmtTime(detail.session.first_seen as string)} | Último: {fmtTime(detail.session.last_seen as string)}</Mono>
                  <Label>UTM</Label>
                  <Mono>source={String(detail.session.utm_source||'—')} | campaign={String(detail.session.utm_campaign||'—')} | content={String(detail.session.utm_content||'—')} | term={String(detail.session.utm_term||'—')}</Mono>
                  <Label>IDS</Label>
                  <Mono>campaign_id={String(detail.session.campaign_id||'—')} | adset_id={String(detail.session.adset_id||'—')} | ad_id={String(detail.session.ad_id||'—')}</Mono>
                  <Label>PROGRESSO</Label>
                  <Mono>Última seção: {String(detail.session.max_section_title||'—')} | Cliques: {String(detail.session.clicks_count||0)} | Comprou: {detail.session.purchased?'SIM':'não'}</Mono>
                </>}
                {detail.sectionEvents.length>0&&<>
                  <Label>SEÇÕES ({detail.sectionEvents.length})</Label>
                  <div style={s.evList}>
                    {detail.sectionEvents.map((ev,i)=>(
                      <div key={i} style={s.evRow}><span style={{color:'#60a5fa'}}>{ev.section_order as number}.</span> {ev.section_title as string} <span style={{color:'#555',fontSize:10}}>{fmtTime(ev.created_at as string)}</span></div>
                    ))}
                  </div>
                </>}
                {detail.clickEvents.length>0&&<>
                  <Label>CLIQUES ({detail.clickEvents.length})</Label>
                  <div style={s.evList}>
                    {detail.clickEvents.map((ev,i)=>(
                      <div key={i} style={s.evRow}><span style={{color:'#f59e0b'}}>{ev.checkout_type as string}</span> · {String(ev.button_location||'')} <span style={{color:'#555',fontSize:10}}>{fmtTime(ev.created_at as string)}</span></div>
                    ))}
                  </div>
                </>}
                {detail.purchase&&<>
                  <Label>COMPRA</Label>
                  <Mono style={{color:'#4ade80'}}>{fmtBRL(detail.purchase.amount as number)} · {String(detail.purchase.checkout_title||'')}</Mono>
                </>}
              </div>
            ):<div style={{color:'#888',textAlign:'center',padding:24}}>Sessão não encontrada.</div>}
          </div>
        </div>
      )}

      {/* ── Clear modal ── */}
      {showClearModal&&(
        <div style={s.overlay} onClick={()=>setShowClearModal(false)}>
          <div style={s.modal} onClick={e=>e.stopPropagation()}>
            <h2 style={{fontSize:14,fontWeight:700,color:'#ff6b6b',margin:'0 0 12px'}}>⚠️ Limpar dados</h2>
            <p style={{fontSize:12,color:'#ccc',marginBottom:8}}>Isso apagará todos os dados do Supabase para <strong style={{color:'#fff'}}>{date}</strong>. Exporte antes de continuar.</p>
            <p style={{fontSize:12,color:'#888',marginBottom:12}}>Digite <strong style={{color:'#ff6b6b'}}>LIMPAR</strong> para confirmar:</p>
            <input value={clearInput} onChange={e=>setClearInput(e.target.value)} placeholder="LIMPAR"
              style={{...s.dateInput,width:'100%',marginBottom:12,color:'#ff6b6b'}}/>
            <div style={{display:'flex',gap:8}}>
              <button onClick={clearDay} disabled={clearInput!=='LIMPAR'}
                style={{...s.btn,background:clearInput==='LIMPAR'?'#7f1d1d':'#1f1f1f',color:clearInput==='LIMPAR'?'#ff6b6b':'#555',flex:1}}>
                Confirmar limpeza
              </button>
              <button onClick={()=>{setShowClearModal(false);setClearInput('');}} style={{...s.btn,background:'#1f1f1f',color:'#888'}}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Block({title,children}:{title:string;children:React.ReactNode}){
  return <div style={s.block}><h2 style={s.blockTitle}>{title}</h2>{children}</div>;
}
function Grid({headers,rows}:{headers:string[];rows:string[][]}){
  return <div style={{overflowX:'auto'}}>
    <table style={s.table}>
      <thead><tr style={{color:'#555'}}>
        {headers.map((h,i)=><th key={h} style={{...th,textAlign:i===0?'left':'right'}}>{h}</th>)}
      </tr></thead>
      <tbody>{rows.map((row,ri)=>(
        <tr key={ri} style={s.tr}>
          {row.map((cell,ci)=><td key={ci} style={{...td,textAlign:ci===0?'left':'right',fontWeight:ci===0?400:600}}>{cell}</td>)}
        </tr>
      ))}</tbody>
    </table>
  </div>;
}
const Label = ({children}:{children:React.ReactNode})=><p style={{fontSize:10,color:'#555',textTransform:'uppercase',letterSpacing:1,margin:'12px 0 4px'}}>{children}</p>;
const Mono = ({children,style}:{children:React.ReactNode;style?:React.CSSProperties})=>
  <p style={{fontFamily:'monospace',fontSize:12,color:'#ccc',margin:0,wordBreak:'break-all',...style}}>{children}</p>;

// ── Styles ────────────────────────────────────────────────────────────────────

const th:React.CSSProperties = {padding:'8px 10px',fontWeight:600,fontSize:11,textTransform:'uppercase',letterSpacing:.8,borderBottom:'1px solid #222'};
const td:React.CSSProperties = {padding:'10px 10px',color:'#ccc',verticalAlign:'middle'};

const s:Record<string,React.CSSProperties> = {
  page:      {minHeight:'100vh',background:'#0f0f0f',color:'#fff',fontFamily:'system-ui,sans-serif',padding:'24px 16px'},
  container: {maxWidth:980,margin:'0 auto'},
  center:    {minHeight:'100vh',background:'#0f0f0f',display:'flex',alignItems:'center',justifyContent:'center'},
  errorBox:  {background:'#1a1a1a',border:'1px solid #333',borderRadius:12,padding:32,textAlign:'center',color:'#fff'},
  header:    {display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24,flexWrap:'wrap',gap:12},
  title:     {fontSize:20,fontWeight:800,margin:0,color:'#F28A1A'},
  sub:       {fontSize:11,color:'#555',margin:'4px 0 0'},
  cardGrid:  {display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:10,marginBottom:24},
  card:      {background:'#1a1a1a',border:'1px solid #2a2a2a',borderRadius:10,padding:'14px 18px'},
  cardLabel: {fontSize:11,color:'#555',margin:'0 0 6px',textTransform:'uppercase',letterSpacing:1},
  cardVal:   {fontSize:24,fontWeight:800,margin:0},
  block:     {background:'#141414',border:'1px solid #222',borderRadius:10,padding:20,marginBottom:20},
  blockTitle:{fontSize:13,fontWeight:700,color:'#666',textTransform:'uppercase',letterSpacing:1,margin:'0 0 14px'},
  table:     {width:'100%',borderCollapse:'collapse',fontSize:13},
  tr:        {borderBottom:'1px solid #1f1f1f'},
  barBg:     {height:6,background:'#222',borderRadius:4,overflow:'hidden'},
  barFill:   {height:'100%',background:'#F28A1A',borderRadius:4,transition:'width .4s'},
  clickGrid: {display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:10},
  btn:       {border:'1px solid #333',borderRadius:6,padding:'6px 12px',fontSize:12,cursor:'pointer'},
  btnAct:    {background:'#1a1a1a',border:'1px solid #333',borderRadius:8,color:'#ccc',padding:'8px 16px',fontSize:13,cursor:'pointer'},
  dateInput: {background:'#1a1a1a',border:'1px solid #333',borderRadius:6,color:'#ccc',padding:'6px 10px',fontSize:12},
  overlay:   {position:'fixed',inset:0,background:'rgba(0,0,0,.75)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:16},
  modal:     {background:'#1a1a1a',border:'1px solid #333',borderRadius:12,padding:24,width:'100%',maxWidth:560},
  evList:    {background:'#111',borderRadius:6,padding:'8px 10px',marginBottom:4},
  evRow:     {fontSize:12,color:'#aaa',padding:'2px 0'},
};
