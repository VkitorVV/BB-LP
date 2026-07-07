'use client';
import React, { useEffect, useState, useCallback, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
type SessionStatus = 'online' | 'recente' | 'saiu' | 'inativo';
type Tab = 'geral' | 'usuarios' | 'campanhas' | 'exportacoes';

interface SectionRow { order:number; id:string; title:string; reached:number; percentOfHero:number; dropFromPrevious:number; }
interface CheckoutClicks { plano_basico_popup_open:number; plano_basico:number; kit_completo:number; kit_desconto_popup:number; }
interface MapRow { sessions:number; clicks:number; reachedOffer:number; purchases:number; revenue:number; conversionClick:number; conversionPurchase:number; }
interface LastClick { checkoutType:string; checkoutLabel:string|null; checkoutPrice:number|null; buttonLocation:string|null; clickedAt:string|null; }
interface SessionRow {
  sessionId:string; shortId:string; label:string;
  firstSeen:string; lastSeen:string; leftAt:string|null; pageStatus:string;
  status:SessionStatus; secondsSinceLastSeen:number;
  utmSource?:string; utmCampaign?:string; utmTerm?:string; utmContent?:string;
  campaignId?:string; adsetId?:string; adId?:string; placement?:string; siteSourceName?:string;
  maxSectionOrder:number; maxSectionTitle?:string;
  clicksCount:number; purchased:boolean; revenue:number;
  lastCheckoutClick:LastClick|null;
}
interface DashData {
  date:string; window:string;
  activeNow:number; active30m:number;
  totalSessionsToday:number; sessionsPeriod:number;
  sections:SectionRow[]; checkoutClicks:CheckoutClicks;
  purchases:{count:number;revenue:number};
  campaigns:(MapRow&{utmCampaign:string})[]; adsets:(MapRow&{adsetId:string})[]; creatives:(MapRow&{utmContent:string})[];
  sessions:SessionRow[]; showingMax:boolean;
  debug?:{allSessionsTodayCount:number;filteredSessionsCount:number;returnedSessionsCount:number;sessQueryError?:string|null};
  updatedAt:string;
}
interface SessionDetail {
  session:Record<string,unknown>|null;
  sectionsReached:{section_title:string;section_order:number;created_at:string}[];
  clicks:{checkout_type:string;checkout_label:string|null;checkout_price:number|null;button_location:string|null;current_section_title:string|null;clicked_at:string}[];
  purchase:Record<string,unknown>|null;
}

// ─── Utils ────────────────────────────────────────────────────────────────────
const fmt     = (n?:number|null) => (n??0).toLocaleString('pt-BR');
const fmtBRL  = (n?:number|null) => (n||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const fmtTime = (iso?:string|null) => iso ? new Date(iso).toLocaleTimeString('pt-BR') : '—';
const pctCol  = (p:number) => p>=70?'#22c55e':p>=40?'#f59e0b':'#ef4444';
const brazilToday = () => new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());

const STATUS_COLOR:Record<SessionStatus,string> = { online:'#22c55e', recente:'#3b82f6', saiu:'#6b7280', inativo:'#374151' };
const STATUS_DOT:Record<SessionStatus,string>   = { online:'●', recente:'●', saiu:'○', inativo:'○' };

const CLICK_BADGE:Record<string,{label:string;color:string}> = {
  plano_basico_popup_open: {label:'Básico →popup',  color:'#6366f1'},
  plano_basico:            {label:'Básico',          color:'#3b82f6'},
  kit_completo:            {label:'Kit R$29',        color:'#f59e0b'},
  kit_desconto_popup:      {label:'Kit R$24',        color:'#22c55e'},
};

function secsAgo(sec:number):string {
  if(sec<5)  return 'agora';
  if(sec<60) return `há ${sec}s`;
  if(sec<3600) return `há ${Math.floor(sec/60)}min`;
  return `há ${Math.floor(sec/3600)}h`;
}

const WINDOWS=[
  {v:'now',l:'Agora/25s'},{v:'30m',l:'30 min'},{v:'1h',l:'1 hora'},
  {v:'2h',l:'2 horas'},{v:'4h',l:'4 horas'},{v:'12h',l:'12 horas'},
  {v:'24h',l:'24 horas'},{v:'today',l:'Hoje'},
];
const TABS:[Tab,string][]=[['geral','Visão Geral'],['usuarios','Usuários'],['campanhas','Campanhas'],['exportacoes','Exportações']];
const USER_FILTERS=['todos','online','recentes','saíram','compraram','clicaram','chegaram_oferta'] as const;
type UserFilter = typeof USER_FILTERS[number];

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function FunilPage() {
  const [token,setToken]     = useState('');
  const [date,setDate]       = useState(brazilToday());
  const [win,setWin]         = useState('today');
  const [tab,setTab]         = useState<Tab>('geral');
  const [data,setData]       = useState<DashData|null>(null);
  const [err,setErr]         = useState('');
  const [loading,setLoading] = useState(false);
  const [lu,setLu]           = useState('');
  const [auto,setAuto]       = useState(false);
  const [tick,setTick]       = useState(0);
  const [selSid,setSelSid]   = useState<string|null>(null);
  const [detail,setDetail]   = useState<SessionDetail|null>(null);
  const [detL,setDetL]       = useState(false);
  const [userFilter,setUserFilter] = useState<UserFilter>('todos');
  const [userSearch,setUserSearch] = useState('');
  const [clearTxt,setClearTxt]     = useState('');
  const [showClear,setShowClear]   = useState(false);
  const ivRef  = useRef<ReturnType<typeof setInterval>|null>(null);
  const tickIv = useRef<ReturnType<typeof setInterval>|null>(null);

  useEffect(()=>{ tickIv.current=setInterval(()=>setTick(p=>p+1),1000); return()=>{if(tickIv.current) clearInterval(tickIv.current);}; },[]);
  useEffect(()=>{ const p=new URLSearchParams(window.location.search); setToken(p.get('token')||''); const t=p.get('tab'); if(t) setTab(t as Tab); },[]);

  const load = useCallback(async(tok:string,d:string,w:string)=>{
    if(!tok) return;
    setLoading(true);
    try {
      const r=await fetch(`/api/funnel-dashboard?token=${encodeURIComponent(tok)}&date=${d}&window=${w}`);
      if(r.status===401){setErr('Acesso negado.');setData(null);return;}
      if(!r.ok){const j=await r.json().catch(()=>({})) as {error?:string}; setErr(`Erro ${r.status}${j.error?': '+j.error:''}`);return;}
      setData(await r.json() as DashData); setErr(''); setLu(new Date().toLocaleTimeString('pt-BR'));
    } catch(e){setErr(`Conexão: ${e instanceof Error?e.message:e}`);} finally{setLoading(false);}
  },[]);

  useEffect(()=>{if(token)load(token,date,win);},[token]);      // eslint-disable-line
  useEffect(()=>{if(token)load(token,date,win);},[date,win]);   // eslint-disable-line
  useEffect(()=>{
    if(ivRef.current) clearInterval(ivRef.current);
    if(auto&&token) ivRef.current=setInterval(()=>load(token,date,win),60_000);
    return()=>{if(ivRef.current) clearInterval(ivRef.current);};
  },[auto,token,date,win,load]);

  const openDetail=useCallback(async(sid:string)=>{
    setSelSid(sid); setDetL(true); setDetail(null);
    try{
      const r=await fetch(`/api/funnel-session?token=${encodeURIComponent(token)}&sessionId=${encodeURIComponent(sid)}&date=${date}`);
      setDetail(await r.json() as SessionDetail);
    }catch{setDetail(null);}finally{setDetL(false);}
  },[token,date]);

  const closeDetail=()=>{setSelSid(null);setDetail(null);};

  const filteredUsers = (data?.sessions||[]).filter(s=>{
    if(userFilter==='online')          return s.status==='online';
    if(userFilter==='recentes')        return s.status==='recente';
    if(userFilter==='saíram')          return s.status==='saiu';
    if(userFilter==='compraram')       return s.purchased;
    if(userFilter==='clicaram')        return s.clicksCount>0;
    if(userFilter==='chegaram_oferta') return s.maxSectionOrder>=11;
    return true;
  }).filter(s=>{
    if(!userSearch) return true;
    const q=userSearch.toLowerCase();
    return (s.utmCampaign||'').toLowerCase().includes(q)||
           (s.utmContent||'').toLowerCase().includes(q)||
           (s.adsetId||'').toLowerCase().includes(q)||
           s.shortId.toLowerCase().includes(q)||
           s.label.toLowerCase().includes(q);
  });

  if(err) return <div style={s.center}><div style={s.ebox}><p style={{fontSize:32,marginBottom:12}}>🔒</p><p style={{color:'#ef4444',fontWeight:700,marginBottom:16}}>{err}</p><Btn onClick={()=>{setErr('');load(token,date,win);}}>Tentar novamente</Btn></div></div>;
  if(!data&&!loading) return <div style={s.center}><p style={{color:'#6b7280'}}>Aguardando <code style={{color:'#f59e0b'}}>?token=...</code></p></div>;
  if(!data) return <div style={s.center}><p style={{color:'#9ca3af'}}>Carregando…</p></div>;

  const totalClicks=Object.values(data.checkoutClicks).reduce((a,b)=>a+b,0);
  const detSess=selSid?data.sessions.find(s=>s.sessionId===selSid):null;
  void tick;

  return (
    <div style={s.page}>
      <div style={s.wrap}>

        {/* ── Header ── */}
        <header style={s.hdr}>
          <div>
            <h1 style={s.title}>FUNIL <span style={{color:'#f59e0b'}}>—</span> Mapa do Degradê</h1>
            <p style={s.sub}>{lu?`Atualizado às ${lu}`:'...'}{loading&&<span style={{color:'#f59e0b',marginLeft:8}}>⟳</span>}</p>
          </div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
            <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={s.inp}/>
            <select value={win} onChange={e=>setWin(e.target.value)} style={s.inp}>
              {WINDOWS.map(w=><option key={w.v} value={w.v}>{w.l}</option>)}
            </select>
            <Btn active={auto} onClick={()=>setAuto(p=>!p)}>{auto?'⟳ Auto ON':'⟳ Auto OFF'}</Btn>
            <Btn onClick={()=>load(token,date,win)} disabled={loading}>↺</Btn>
          </div>
        </header>

        {/* ── Tabs ── */}
        <div style={s.tabBar}>
          {TABS.map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)} style={{...s.tabBtn, ...(tab===t?s.tabActive:{})}}>
              {l}
              {t==='usuarios'&&data.sessions.length>0&&<span style={s.badge}>{data.sessions.length}</span>}
            </button>
          ))}
        </div>

        {/* ══════════════ TAB: GERAL ══════════════ */}
        {tab==='geral'&&<>
          {/* Cards */}
          <div style={s.grid6}>
            <SCard label="● Ativos agora" value={fmt(data.activeNow)} color="#22c55e" hint="≤25s, não saiu"/>
            <SCard label="◑ Ativos 30min" value={fmt(data.active30m)} color="#3b82f6"/>
            <SCard label="Sessões hoje"   value={fmt(data.totalSessionsToday)} color="#06b6d4"/>
            <SCard label="Cliques CTA"    value={fmt(totalClicks)}              color="#f59e0b"/>
            <SCard label="Compras"        value={fmt(data.purchases.count)}     color="#f97316"/>
            <SCard label="Receita"        value={fmtBRL(data.purchases.revenue)} color="#a855f7"/>
          </div>

          {/* Funil */}
          <Block title="Funil por Seção">
            <div style={{overflowX:'auto'}}>
              <table style={s.tbl}><thead><tr>
                <TH>Seção</TH><TH r>Alcançaram</TH><TH r>% Topo</TH><TH r>Drop</TH><TH>Barra</TH>
              </tr></thead><tbody>
              {data.sections.map(sec=>(
                <tr key={sec.id} style={{...s.tr, background:sec.id==='oferta'?'rgba(249,115,22,.06)':undefined}}>
                  <TD>{sec.id==='oferta'&&<span style={{color:'#f97316',marginRight:6}}>★</span>}<span style={{color:sec.id==='oferta'?'#fdba74':'#e5e7eb'}}>{sec.title}</span></TD>
                  <TD r bold>{fmt(sec.reached)}</TD>
                  <TD r style={{color:pctCol(sec.percentOfHero)}}>{sec.percentOfHero}%</TD>
                  <TD r style={{color:sec.dropFromPrevious>30?'#ef4444':'#6b7280'}}>
                    {sec.dropFromPrevious>0?`-${sec.dropFromPrevious}%`:'—'}
                    {sec.dropFromPrevious>30&&<span style={{marginLeft:4,fontSize:10,color:'#ef4444'}}>⚠</span>}
                  </TD>
                  <TD><div style={s.barBg}><div style={{...s.barFill,width:`${Math.min(sec.percentOfHero,100)}%`}}/></div></TD>
                </tr>
              ))}</tbody></table>
            </div>
          </Block>

          {/* Checkout clicks */}
          <Block title="Cliques em Checkout">
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:10}}>
              {([['Básico→popup','plano_basico_popup_open','#6366f1'],['Kit R$29','kit_completo','#f59e0b'],['Kit R$24','kit_desconto_popup','#22c55e'],['Continua Básico','plano_basico','#3b82f6']] as [string,keyof CheckoutClicks,string][]).map(([l,k,c])=>(
                <div key={k} style={s.miniCard}>
                  <p style={s.miniLabel}>{l}</p>
                  <p style={{...s.miniVal,color:c}}>{fmt(data.checkoutClicks[k]||0)}</p>
                </div>
              ))}
            </div>
          </Block>

          {/* Preview últimos 5 usuários */}
          <Block title="Usuários Recentes">
            <table style={s.tbl}><thead><tr>
              <TH>Usuário</TH><TH>Status</TH><TH>Visto há</TH><TH>Campanha</TH><TH>Última seção</TH><TH>Última oferta</TH>
            </tr></thead><tbody>
            {data.sessions.slice(0,5).map(sess=>(
              <tr key={sess.sessionId} style={{...s.tr,cursor:'pointer'}} onClick={()=>{setTab('usuarios');openDetail(sess.sessionId);}}>
                <TD><span style={{color:'#60a5fa',fontFamily:'monospace',fontSize:11}}>{sess.label}</span></TD>
                <TD><span style={{color:STATUS_COLOR[sess.status],fontSize:12}}>{STATUS_DOT[sess.status]} {sess.status}</span></TD>
                <TD style={{fontSize:11,color:'#9ca3af'}}>{secsAgo(sess.secondsSinceLastSeen)}</TD>
                <TD style={{fontSize:12}}>{sess.utmCampaign||'—'}</TD>
                <TD style={{fontSize:12}}>{sess.maxSectionTitle||'—'}</TD>
                <TD>{sess.lastCheckoutClick?<span style={{...s.clickBadge,...{background:(CLICK_BADGE[sess.lastCheckoutClick.checkoutType]?.color||'#6b7280')+'22',color:(CLICK_BADGE[sess.lastCheckoutClick.checkoutType]?.color||'#9ca3af'),border:`1px solid ${(CLICK_BADGE[sess.lastCheckoutClick.checkoutType]?.color||'#6b7280')}44`}}}>{CLICK_BADGE[sess.lastCheckoutClick.checkoutType]?.label||sess.lastCheckoutClick.checkoutType}</span>:'—'}</TD>
              </tr>
            ))}</tbody></table>
            {data.sessions.length>5&&<button style={{...s.linkBtn,marginTop:12}} onClick={()=>setTab('usuarios')}>Ver todos os {data.sessions.length} usuários →</button>}
          </Block>

          {/* Debug */}
          <div style={s.debugBar}>
            <span>all today: <b>{data.debug?.allSessionsTodayCount??data.totalSessionsToday}</b></span>
            <span>returned: <b>{data.debug?.returnedSessionsCount??data.sessions.length}</b></span>
            <span>date: <b>{data.date}</b></span>
            <span>window: <b>{data.window}</b></span>
            {data.debug?.sessQueryError&&<span style={{color:'#ef4444'}}>err: {data.debug.sessQueryError}</span>}
          </div>
        </>}

        {/* ══════════════ TAB: USUÁRIOS ══════════════ */}
        {tab==='usuarios'&&<>
          {/* Filtros */}
          <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:12,alignItems:'center'}}>
            <input value={userSearch} onChange={e=>setUserSearch(e.target.value)} placeholder="Buscar campanha, criativo, usuário..." style={{...s.inp,flex:1,minWidth:200}}/>
            <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
              {USER_FILTERS.map(f=>(
                <button key={f} onClick={()=>setUserFilter(f)} style={{...s.filterBtn,...(userFilter===f?s.filterActive:{})}}>{f}</button>
              ))}
            </div>
          </div>

          <Block title={`Usuários Anônimos (${filteredUsers.length}${data.showingMax?' — mostrando 100':''})`}>
            {filteredUsers.length===0?(
              <p style={{color:'#6b7280',fontSize:13,padding:'12px 0'}}>Nenhuma sessão{userSearch||userFilter!=='todos'?' com os filtros selecionados':' no período selecionado.'}.</p>
            ):(
              <div style={{overflowX:'auto'}}>
                <table style={s.tbl}><thead><tr>
                  <TH>Usuário</TH><TH>Status</TH><TH>1ª visita</TH><TH>Visto há</TH>
                  <TH>Campanha</TH><TH>Conjunto</TH><TH>Criativo</TH>
                  <TH>Última seção</TH><TH>Última oferta</TH><TH r>Cliques</TH><TH r>Comprou</TH>
                </tr></thead><tbody>
                {filteredUsers.map(sess=>(
                  <tr key={sess.sessionId} style={{...s.tr,cursor:'pointer'}} onClick={()=>openDetail(sess.sessionId)} title="Ver detalhes">
                    <TD><span style={{color:'#60a5fa',fontFamily:'monospace',fontSize:12}}>{sess.label}</span><span style={{color:'#374151',fontSize:10,marginLeft:6}}>#{sess.shortId}</span></TD>
                    <TD><span style={{color:STATUS_COLOR[sess.status],fontSize:12}}>{STATUS_DOT[sess.status]} {sess.status}</span></TD>
                    <TD style={{fontSize:11,color:'#9ca3af'}}>{fmtTime(sess.firstSeen)}</TD>
                    <TD style={{fontSize:11,color:'#9ca3af'}}>{secsAgo(sess.secondsSinceLastSeen)}</TD>
                    <TD style={{fontSize:12}}>{sess.utmCampaign||'—'}</TD>
                    <TD style={{fontSize:12}}>{sess.adsetId||'—'}</TD>
                    <TD style={{fontSize:12}}>{sess.utmContent||'—'}</TD>
                    <TD style={{fontSize:12,color:'#d1d5db'}}>{sess.maxSectionTitle||'—'}</TD>
                    <TD>{sess.lastCheckoutClick?<span style={{...s.clickBadge,...{background:(CLICK_BADGE[sess.lastCheckoutClick.checkoutType]?.color||'#6b7280')+'22',color:(CLICK_BADGE[sess.lastCheckoutClick.checkoutType]?.color||'#9ca3af'),border:`1px solid ${(CLICK_BADGE[sess.lastCheckoutClick.checkoutType]?.color||'#6b7280')}44`}}}>{CLICK_BADGE[sess.lastCheckoutClick.checkoutType]?.label||sess.lastCheckoutClick.checkoutType}</span>:'—'}</TD>
                    <TD r>{fmt(sess.clicksCount)}</TD>
                    <TD r>{sess.purchased?<span style={{color:'#22c55e',fontWeight:700}}>✓</span>:'—'}</TD>
                  </tr>
                ))}</tbody></table>
              </div>
            )}
          </Block>
        </>}

        {/* ══════════════ TAB: CAMPANHAS ══════════════ */}
        {tab==='campanhas'&&<>
          {data.campaigns.length>0&&<Block title="Por Campanha"><DataGrid headers={['Campanha','Sessões','Oferta','Cliques','Compras','Receita','CTR%','CVR%']} rows={data.campaigns.map(c=>[c.utmCampaign,fmt(c.sessions),fmt(c.reachedOffer),fmt(c.clicks),fmt(c.purchases),fmtBRL(c.revenue),c.conversionClick+'%',c.conversionPurchase+'%'])}/></Block>}
          {data.adsets.length>0&&<Block title="Por Conjunto (adset_id)"><DataGrid headers={['Conjunto','Sessões','Oferta','Cliques','Compras','Receita','CTR%','CVR%']} rows={data.adsets.map(a=>[a.adsetId,fmt(a.sessions),fmt(a.reachedOffer),fmt(a.clicks),fmt(a.purchases),fmtBRL(a.revenue),a.conversionClick+'%',a.conversionPurchase+'%'])}/></Block>}
          {data.creatives.length>0&&<Block title="Por Criativo (utm_content)"><DataGrid headers={['Criativo','Sessões','Oferta','Cliques','Compras','Receita','CTR%','CVR%']} rows={data.creatives.map(c=>[c.utmContent,fmt(c.sessions),fmt(c.reachedOffer),fmt(c.clicks),fmt(c.purchases),fmtBRL(c.revenue),c.conversionClick+'%',c.conversionPurchase+'%'])}/></Block>}
          {data.campaigns.length===0&&data.adsets.length===0&&data.creatives.length===0&&<p style={{color:'#6b7280',padding:24}}>Nenhum dado de campanha disponível para este período.</p>}
        </>}

        {/* ══════════════ TAB: EXPORTAÇÕES ══════════════ */}
        {tab==='exportacoes'&&<>
          <Block title="Exportar Dados">
            <p style={{color:'#9ca3af',fontSize:13,marginBottom:16}}>Exporta todas as sessões da data selecionada: <strong style={{color:'#f3f4f6'}}>{date}</strong></p>
            <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
              <Btn onClick={()=>window.open(`/api/funnel-export?token=${encodeURIComponent(token)}&date=${date}&type=csv`,'_blank')}>⬇ Exportar CSV</Btn>
              <Btn onClick={()=>window.open(`/api/funnel-export?token=${encodeURIComponent(token)}&date=${date}&type=json`,'_blank')}>⬇ Exportar JSON</Btn>
            </div>
          </Block>
          <Block title="Limpar Dados">
            <div style={{background:'rgba(239,68,68,.05)',border:'1px solid rgba(239,68,68,.2)',borderRadius:8,padding:16,marginBottom:16}}>
              <p style={{color:'#fca5a5',fontSize:13,margin:0}}>⚠️ Isso apagará <strong>todos os dados do Supabase</strong> para {date}. Exporte antes de continuar. Esta ação não pode ser desfeita.</p>
            </div>
            {!showClear?(
              <Btn danger onClick={()=>setShowClear(true)}>🗑 Limpar dados de {date}</Btn>
            ):(
              <>
                <p style={{color:'#9ca3af',fontSize:12,marginBottom:8}}>Digite <strong style={{color:'#ef4444'}}>LIMPAR</strong> para confirmar:</p>
                <input value={clearTxt} onChange={e=>setClearTxt(e.target.value)} placeholder="LIMPAR" style={{...s.inp,marginBottom:12,color:'#ef4444',width:200}}/>
                <div style={{display:'flex',gap:8}}>
                  <Btn danger onClick={async()=>{
                    if(clearTxt!=='LIMPAR') return;
                    await fetch('/api/funnel-clear',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token,date})});
                    setShowClear(false); setClearTxt(''); load(token,date,win);
                  }} disabled={clearTxt!=='LIMPAR'}>Confirmar limpeza</Btn>
                  <Btn onClick={()=>{setShowClear(false);setClearTxt('');}}>Cancelar</Btn>
                </div>
              </>
            )}
          </Block>
        </>}

        <p style={{textAlign:'center',fontSize:10,color:'#1f2937',paddingBottom:32,marginTop:8}}>Sem dados pessoais · {data.updatedAt}</p>

      </div>{/* /wrap */}

      {/* ── Session drawer ── */}
      {selSid&&(
        <div style={s.overlay} onClick={closeDetail}>
          <aside style={s.drawer} onClick={e=>e.stopPropagation()}>
            <div style={s.drawerHdr}>
              <h2 style={s.drawerTitle}>{detSess?.label||'Detalhe da Sessão'}</h2>
              <button onClick={closeDetail} style={{background:'none',border:'none',color:'#6b7280',cursor:'pointer',fontSize:20}}>✕</button>
            </div>
            <div style={{flex:1,overflowY:'auto',padding:'20px 22px'}}>
              {detL?<p style={{color:'#6b7280',textAlign:'center',padding:32}}>Carregando…</p>:detail?(
                <>
                  {/* Bloco 1 — ID */}
                  {detSess&&<DBlock title="Identificação">
                    <DRow k="Usuário"     v={detSess.label}/>
                    <DRow k="Status"      v={<span style={{color:STATUS_COLOR[detSess.status]}}>{STATUS_DOT[detSess.status]} {detSess.status}</span>}/>
                    <DRow k="Session"     v={<code style={{fontSize:10}}>{selSid.slice(0,20)}…</code>}/>
                    <DRow k="1ª visita"   v={fmtTime(detSess.firstSeen)}/>
                    <DRow k="Última ativ." v={fmtTime(detSess.lastSeen)}/>
                    {detSess.leftAt&&<DRow k="Saiu em" v={fmtTime(detSess.leftAt)}/>}
                  </DBlock>}

                  {/* Bloco 2 — UTM */}
                  {detail.session&&<DBlock title="Origem">
                    {(['utm_source','utm_medium','utm_campaign','utm_term','utm_content','campaign_id','adset_id','ad_id','placement','site_source_name'] as string[]).map(k=>
                      detail.session![k]?<DRow key={k} k={k} v={String(detail.session![k])}/>:null
                    )}
                  </DBlock>}

                  {/* Bloco 3 — Timeline */}
                  {detail.sectionsReached.length>0&&<DBlock title={`Percurso (${detail.sectionsReached.length})`}>
                    <div style={{background:'#070a0f',borderRadius:6,overflow:'hidden'}}>
                      {detail.sectionsReached.map((ev,i)=>{
                        const isLast=i===detail.sectionsReached.length-1;
                        return <div key={i} style={{padding:'8px 12px',borderBottom:'1px solid #111827',background:isLast?'rgba(249,115,22,.1)':undefined,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                          <span style={{fontSize:12,color:isLast?'#f97316':'#d1d5db',fontWeight:isLast?700:400}}>{isLast&&'→ '}{ev.section_title}</span>
                          <span style={{fontSize:10,color:'#6b7280'}}>{fmtTime(ev.created_at)}</span>
                        </div>;
                      })}
                    </div>
                  </DBlock>}

                  {/* Bloco 4 — Cliques em checkout */}
                  <DBlock title={`Cliques em Checkout (${detail.clicks.length})`}>
                    {detail.clicks.length===0?<p style={{color:'#6b7280',fontSize:12,margin:0}}>Sem clique em checkout.</p>:(
                      <div style={{background:'#070a0f',borderRadius:6,overflow:'hidden'}}>
                        {detail.clicks.map((cl,i)=>{
                          const badge=CLICK_BADGE[cl.checkout_type];
                          return <div key={i} style={{padding:'10px 12px',borderBottom:'1px solid #111827',display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:8}}>
                            <div>
                              <span style={{...s.clickBadge,...{background:(badge?.color||'#6b7280')+'22',color:(badge?.color||'#9ca3af'),border:`1px solid ${(badge?.color||'#6b7280')}44`,marginRight:8}}}>{badge?.label||cl.checkout_type}</span>
                              {cl.checkout_price&&<span style={{color:'#22c55e',fontSize:12,fontWeight:700}}>{fmtBRL(cl.checkout_price)}</span>}
                              {cl.current_section_title&&<p style={{fontSize:10,color:'#6b7280',margin:'4px 0 0'}}>na seção: {cl.current_section_title}</p>}
                            </div>
                            <span style={{fontSize:10,color:'#6b7280',whiteSpace:'nowrap'}}>{fmtTime(cl.clicked_at)}</span>
                          </div>;
                        })}
                      </div>
                    )}
                  </DBlock>

                  {/* Bloco 5 — Compra */}
                  <DBlock title="Compra">
                    {detail.purchase?(
                      <>{<DRow k="Produto" v={String(detail.purchase.checkout_title||'')}/>}
                      <DRow k="Valor" v={<span style={{color:'#22c55e',fontWeight:700}}>{fmtBRL(detail.purchase.amount as number)}</span>}/>
                      <DRow k="Horário" v={fmtTime(detail.purchase.created_at as string)}/></>
                    ):<p style={{color:'#6b7280',fontSize:12,margin:0}}>Sem compra registrada.</p>}
                  </DBlock>
                </>
              ):<p style={{color:'#6b7280',textAlign:'center',padding:24}}>Sessão não encontrada.</p>}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function Block({title,children}:{title:string;children:React.ReactNode}){
  return <div style={s.block}><h2 style={s.blockTitle}>{title}</h2>{children}</div>;
}
function SCard({label,value,color,hint}:{label:string;value:string;color:string;hint?:string}){
  return <div style={s.card} title={hint}><p style={s.cardLabel}>{label}</p><p style={{...s.cardVal,color}}>{value}</p>{hint&&<p style={{fontSize:10,color:'#374151',margin:'4px 0 0'}}>{hint}</p>}</div>;
}
function DataGrid({headers,rows}:{headers:string[];rows:string[][]}){
  return <div style={{overflowX:'auto'}}><table style={s.tbl}><thead><tr>{headers.map((h,i)=><TH key={h} r={i>0}>{h}</TH>)}</tr></thead><tbody>{rows.map((row,ri)=><tr key={ri} style={s.tr}>{row.map((cell,ci)=><TD key={ci} r={ci>0} bold={ci>0}>{cell}</TD>)}</tr>)}</tbody></table></div>;
}
function DBlock({title,children}:{title:string;children:React.ReactNode}){
  return <div style={{marginBottom:20}}><p style={{fontSize:10,color:'#f59e0b',textTransform:'uppercase',letterSpacing:1,margin:'0 0 8px',fontWeight:700}}>{title}</p><div style={{background:'#0d1117',border:'1px solid #1f2937',borderRadius:8,padding:'10px 14px'}}>{children}</div></div>;
}
function DRow({k,v}:{k:string;v:React.ReactNode}){
  return <div style={{display:'flex',justifyContent:'space-between',padding:'5px 0',borderBottom:'1px solid #111827'}}>
    <span style={{fontSize:11,color:'#6b7280'}}>{k}</span>
    <span style={{fontSize:12,color:'#d1d5db',textAlign:'right',maxWidth:'65%',wordBreak:'break-all'}}>{v}</span>
  </div>;
}
function Btn({children,onClick,active,danger,disabled}:{children:React.ReactNode;onClick?:()=>void;active?:boolean;danger?:boolean;disabled?:boolean}){
  return <button onClick={onClick} disabled={disabled} style={{border:'1px solid',borderRadius:6,padding:'7px 14px',fontSize:12,cursor:disabled?'not-allowed':'pointer',
    background:active?'#14532d':danger?'#450a0a':'#111827',
    color:active?'#4ade80':danger?'#f87171':'#d1d5db',
    borderColor:active?'#166534':danger?'#991b1b':'#1f2937',
    opacity:disabled?.5:1}}>{children}</button>;
}
const TH=({children,r}:{children?:React.ReactNode;r?:boolean})=>
  <th style={{padding:'10px 12px',fontWeight:600,fontSize:11,textTransform:'uppercase',letterSpacing:.8,borderBottom:'1px solid #1f2937',color:'#4b5563',textAlign:r?'right':'left',whiteSpace:'nowrap'}}>{children}</th>;
const TD=({children,r,bold,style}:{children?:React.ReactNode;r?:boolean;bold?:boolean;style?:React.CSSProperties})=>
  <td style={{padding:'10px 12px',color:'#9ca3af',verticalAlign:'middle',textAlign:r?'right':'left',fontWeight:bold?600:400,...style}}>{children}</td>;

// ─── Styles ───────────────────────────────────────────────────────────────────
const s:Record<string,React.CSSProperties>={
  page:       {minHeight:'100vh',background:'#070a0f',color:'#fff',fontFamily:'system-ui,sans-serif',padding:'20px 16px'},
  wrap:       {maxWidth:1440,margin:'0 auto'},
  center:     {minHeight:'100vh',background:'#070a0f',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:12},
  ebox:       {background:'#0d1117',border:'1px solid #1f2937',borderRadius:12,padding:32,textAlign:'center'},
  hdr:        {display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16,flexWrap:'wrap',gap:12},
  title:      {fontSize:22,fontWeight:800,margin:0,color:'#f3f4f6',letterSpacing:'-.01em'},
  sub:        {fontSize:12,color:'#374151',margin:'4px 0 0'},
  inp:        {background:'#0d1117',border:'1px solid #1f2937',borderRadius:6,color:'#d1d5db',padding:'7px 12px',fontSize:12},
  tabBar:     {display:'flex',gap:4,borderBottom:'1px solid #1f2937',marginBottom:20},
  tabBtn:     {background:'none',border:'none',color:'#6b7280',padding:'10px 18px',fontSize:13,cursor:'pointer',borderBottom:'2px solid transparent',display:'flex',alignItems:'center',gap:6},
  tabActive:  {color:'#f59e0b',borderBottom:'2px solid #f59e0b'},
  badge:      {background:'#1f2937',color:'#9ca3af',borderRadius:10,padding:'1px 7px',fontSize:11,fontWeight:700},
  grid6:      {display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:10,marginBottom:18},
  card:       {background:'#0d1117',border:'1px solid #1f2937',borderRadius:10,padding:'14px 18px'},
  cardLabel:  {fontSize:11,color:'#374151',margin:'0 0 6px',textTransform:'uppercase',letterSpacing:.9},
  cardVal:    {fontSize:26,fontWeight:800,margin:0},
  block:      {background:'#0d1117',border:'1px solid #1f2937',borderRadius:12,padding:'18px 20px',marginBottom:16},
  blockTitle: {fontSize:12,fontWeight:700,color:'#374151',textTransform:'uppercase',letterSpacing:1,margin:'0 0 14px'},
  tbl:        {width:'100%',borderCollapse:'collapse',fontSize:13},
  tr:         {borderBottom:'1px solid #111827',transition:'background .1s'},
  barBg:      {height:5,background:'#1f2937',borderRadius:3,overflow:'hidden',minWidth:60},
  barFill:    {height:'100%',background:'#f59e0b',borderRadius:3,transition:'width .5s'},
  miniCard:   {background:'#111827',border:'1px solid #1f2937',borderRadius:8,padding:'12px 16px'},
  miniLabel:  {fontSize:11,color:'#374151',margin:'0 0 4px',textTransform:'uppercase',letterSpacing:.8},
  miniVal:    {fontSize:22,fontWeight:800,margin:0},
  filterBtn:  {background:'#0d1117',border:'1px solid #1f2937',borderRadius:16,padding:'4px 12px',fontSize:11,cursor:'pointer',color:'#6b7280'},
  filterActive:{background:'#1f2937',color:'#f3f4f6',border:'1px solid #374151'},
  clickBadge: {display:'inline-block',padding:'2px 8px',borderRadius:10,fontSize:11,fontWeight:600},
  linkBtn:    {background:'none',border:'none',color:'#f59e0b',cursor:'pointer',fontSize:13,padding:0,textDecoration:'underline'},
  overlay:    {position:'fixed',inset:0,background:'rgba(0,0,0,.8)',zIndex:999,display:'flex',justifyContent:'flex-end'},
  drawer:     {background:'#0d1117',borderLeft:'1px solid #1f2937',width:'100%',maxWidth:500,height:'100vh',display:'flex',flexDirection:'column',zIndex:1000},
  drawerHdr:  {display:'flex',justifyContent:'space-between',alignItems:'center',padding:'18px 22px',borderBottom:'1px solid #1f2937'},
  drawerTitle:{margin:0,fontSize:16,fontWeight:700,color:'#f59e0b'},
  debugBar:   {background:'#0d1117',border:'1px solid #1f2937',borderRadius:8,padding:'10px 16px',marginBottom:24,fontSize:11,color:'#374151',display:'flex',gap:20,flexWrap:'wrap'},
};
