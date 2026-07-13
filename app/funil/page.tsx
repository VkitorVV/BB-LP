'use client';
import React, { useEffect, useState, useCallback, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
type SessionStatus = 'online' | 'recente' | 'saiu' | 'inativo';
type Tab = 'geral' | 'usuarios' | 'campanhas' | 'exportacoes';

interface SectionRow  { order:number; id:string; title:string; reached:number; percentOfHero:number; dropFromPrevious:number; }
interface FunnelStep  { sectionId:string; sectionTitle:string; sectionOrder:number; reached:number; percentOfTop:number; dropFromPrevious:number; dropAccumulated:number; topCampaign?:string|null; topCreative?:string|null; }
interface Bottleneck  { fromSection:string; toSection:string; dropUsers:number; dropPercent:number; }
interface StopPoint   { sectionTitle:string; usersStopped:number; }
interface CheckoutClicks { plano_basico_popup_open:number; plano_basico:number; kit_completo:number; kit_desconto_popup:number; }
interface CheckoutSummary {
  rawCheckoutEvents:number;
  basicPopupOpens:number;
  checkoutRedirects:number;
  uniqueCheckoutSessions:number;
  basicSelected:number;
  completeSelected:number;
  upgradeAccepted:number;
}
interface MapRow      { sessions:number; clicks:number; reachedOffer:number; purchases:number; revenue:number; conversionClick:number; conversionPurchase:number; }
interface LastClick   { checkoutType:string; checkoutLabel:string|null; checkoutPrice:number|null; buttonLocation:string|null; clickedAt:string|null; }
interface SessionRow  {
  sessionId:string; shortId:string; label:string;
  firstSeen:string; lastSeen:string; leftAt:string|null; pageStatus:string;
  status:SessionStatus; secondsSinceLastSeen:number;
  utmSource?:string; utmCampaign?:string; utmTerm?:string; utmContent?:string;
  campaignId?:string; adsetId?:string; adId?:string;
  maxSectionOrder:number; maxSectionTitle?:string;
  clicksCount:number; purchased:boolean; revenue:number;
  lastCheckoutClick:LastClick|null;
}
interface DashData {
  date:string; window:string;
  activeNow:number; active30m:number;
  totalSessionsToday:number; sessionsPeriod:number;
  sections:SectionRow[]; checkoutClicks:CheckoutClicks; checkoutSummary?:CheckoutSummary;
  purchases:{count:number;revenue:number};
  campaigns:(MapRow&{utmCampaign:string})[]; adsets:(MapRow&{adsetId:string})[]; creatives:(MapRow&{utmContent:string})[];
  sessions:SessionRow[]; showingMax:boolean;
  funnelVisual:FunnelStep[];
  topBottlenecks:Bottleneck[];
  stopPoints:StopPoint[];
  sectionDiagnostics:FunnelStep[];
  includeCta:boolean;
  ctaJumpCounts:Record<string,number>;
  internalCtaClicks:{label:string;clicks:number}[];
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
const fmt     = (n?:number|null)=>(n??0).toLocaleString('pt-BR');
const fmtBRL  = (n?:number|null)=>(n||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const fmtPct  = (n:number,d:number)=>d>0?`${Math.round((n/d)*100)}%`:'0%';
const fmtTime = (iso?:string|null)=>iso?new Date(iso).toLocaleTimeString('pt-BR'):'—';
const pctCol  = (p:number)=>p>=70?'#22c55e':p>=40?'#f59e0b':'#ef4444';
const dropCol = (d:number)=>d<=10?'#22c55e':d<=30?'#f59e0b':'#ef4444';
const brazilToday=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const STATUS_COLOR:Record<SessionStatus,string>={online:'#22c55e',recente:'#3b82f6',saiu:'#6b7280',inativo:'#374151'};
const CLICK_BADGE:Record<string,{label:string;color:string}>={
  plano_basico_popup_open:{label:'Básico→popup',color:'#6366f1'},
  plano_basico:           {label:'Básico',       color:'#3b82f6'},
  kit_completo:           {label:'Kit R$29',      color:'#f59e0b'},
  kit_desconto_popup:     {label:'Kit R$24',      color:'#22c55e'},
};
function secsAgo(sec:number){if(sec<5)return 'agora';if(sec<60)return `há ${sec}s`;if(sec<3600)return `há ${Math.floor(sec/60)}min`;return `há ${Math.floor(sec/3600)}h`;}
const WINDOWS=[{v:'now',l:'Agora/25s'},{v:'30m',l:'30 min'},{v:'1h',l:'1 hora'},{v:'2h',l:'2 horas'},{v:'4h',l:'4 horas'},{v:'12h',l:'12 horas'},{v:'24h',l:'24 horas'},{v:'today',l:'Hoje'}];
const TABS:[Tab,string][]=[['geral','Visão Geral'],['usuarios','Usuários'],['campanhas','Campanhas'],['exportacoes','Exportações']];
type UserFilter='todos'|'online'|'recentes'|'saíram'|'compraram'|'clicaram'|'chegaram_oferta'|'nao_oferta';

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function FunilPage() {
  const [token,setToken]=useState('');
  const [date,setDate]=useState(brazilToday());
  const [win,setWin]=useState('today');
  const [tab,setTab]=useState<Tab>('geral');
  const [data,setData]=useState<DashData|null>(null);
  const [err,setErr]=useState('');
  const [loading,setLoading]=useState(false);
  const [lu,setLu]=useState('');
  const [auto,setAuto]=useState(false);
  const [tick,setTick]=useState(0);
  const [selSid,setSelSid]=useState<string|null>(null);
  const [detail,setDetail]=useState<SessionDetail|null>(null);
  const [detL,setDetL]=useState(false);
  const [funnelFilter,setFunnelFilter]=useState<{type:'campaign'|'creative'|'adset';value:string}|null>(null);
  const [selectedStep,setSelectedStep]=useState<string|null>(null);
  const [includeCta,setIncludeCta]=useState(false);
  const [userFilter,setUserFilter]=useState<UserFilter>('todos');
  const [userSearch,setUserSearch]=useState('');
  const [stopFilter,setStopFilter]=useState<string|null>(null);
  const [clearTxt,setClearTxt]=useState('');
  const [showClear,setShowClear]=useState(false);
  const ivRef=useRef<ReturnType<typeof setInterval>|null>(null);
  const tickIv=useRef<ReturnType<typeof setInterval>|null>(null);

  useEffect(()=>{tickIv.current=setInterval(()=>setTick(p=>p+1),1000);return()=>{if(tickIv.current)clearInterval(tickIv.current);};},[]);
  useEffect(()=>{const p=new URLSearchParams(window.location.search);setToken(p.get('token')||'');const t=p.get('tab');if(t)setTab(t as Tab);},[]);

  const load=useCallback(async(tok:string,d:string,w:string)=>{
    if(!tok)return;setLoading(true);
    try{
      const r=await fetch(`/api/funnel-dashboard?token=${encodeURIComponent(tok)}&date=${d}&window=${w}&includeCta=${includeCta?'1':'0'}`);
      if(r.status===401){setErr('Acesso negado.');setData(null);return;}
      if(!r.ok){const j=await r.json().catch(()=>({}))as{error?:string};setErr(`Erro ${r.status}${j.error?': '+j.error:''}`);return;}
      setData(await r.json() as DashData);setErr('');setLu(new Date().toLocaleTimeString('pt-BR'));
    }catch(e){setErr(`Conexão: ${e instanceof Error?e.message:e}`);}finally{setLoading(false);}
  },[]);

  useEffect(()=>{if(token)load(token,date,win);},[token]);     // eslint-disable-line
  useEffect(()=>{if(token)load(token,date,win);},[date,win,includeCta]);  // eslint-disable-line
  useEffect(()=>{
    if(ivRef.current)clearInterval(ivRef.current);
    if(auto&&token)ivRef.current=setInterval(()=>load(token,date,win),60_000);
    return()=>{if(ivRef.current)clearInterval(ivRef.current);};
  },[auto,token,date,win,load]);

  const openDetail=useCallback(async(sid:string)=>{
    setSelSid(sid);setDetL(true);setDetail(null);
    try{const r=await fetch(`/api/funnel-session?token=${encodeURIComponent(token)}&sessionId=${encodeURIComponent(sid)}&date=${date}`);setDetail(await r.json() as SessionDetail);}
    catch{setDetail(null);}finally{setDetL(false);}
  },[token,date]);

  const closeDetail=()=>{setSelSid(null);setDetail(null);};

  // Get funnel steps (optionally filtered by campaign/creative)
  const funnelSteps = data?.funnelVisual || [];

  // Filter sections by origin filter
  const getFilteredSections = () => {
    if (!funnelFilter || !data) return funnelSteps;
    const filtered = data.sessions.filter(s =>
      funnelFilter.type === 'campaign' ? s.utmCampaign === funnelFilter.value :
      funnelFilter.type === 'creative' ? s.utmContent  === funnelFilter.value :
      s.adsetId === funnelFilter.value
    );
    const counts: Record<string, number> = {};
    filtered.forEach(s => { if (s.maxSectionOrder > 0) {
      data.funnelVisual.filter(f => f.sectionOrder <= s.maxSectionOrder).forEach(f => { counts[f.sectionId] = (counts[f.sectionId] || 0) + 1; });
    }});
    const heroC = counts['hero'] || 1;
    return funnelSteps.map((f, i) => {
      const reached = counts[f.sectionId] || 0;
      const prev = i > 0 ? (counts[funnelSteps[i-1].sectionId] || reached) : reached;
      return { ...f, reached, percentOfTop: Math.round((reached / heroC) * 100), dropFromPrevious: prev > 0 ? Math.round(((prev - reached) / prev) * 100) : 0 };
    });
  };
  const visibleFunnel = getFilteredSections();

  const filteredUsers = (data?.sessions||[]).filter(s=>{
    const base = stopFilter ? s.maxSectionTitle === stopFilter : true;
    const filter =
      userFilter==='online'          ? s.status==='online' :
      userFilter==='recentes'        ? s.status==='recente' :
      userFilter==='saíram'          ? s.status==='saiu' :
      userFilter==='compraram'       ? s.purchased :
      userFilter==='clicaram'        ? s.clicksCount>0 :
      userFilter==='chegaram_oferta' ? s.maxSectionOrder>=11 :
      userFilter==='nao_oferta'      ? s.maxSectionOrder<11 : true;
    const search = !userSearch || [s.utmCampaign,s.utmContent,s.adsetId,s.shortId,s.label].some(v=>(v||'').toLowerCase().includes(userSearch.toLowerCase()));
    return base && filter && search;
  });

  if(err)return(<div style={g.center}><div style={g.ebox}><p style={{fontSize:32,marginBottom:12}}>🔒</p><p style={{color:'#ef4444',fontWeight:700,marginBottom:16}}>{err}</p><Btn onClick={()=>{setErr('');load(token,date,win);}}>Tentar novamente</Btn></div></div>);
  if(!data&&!loading)return(<div style={g.center}><p style={{color:'#6b7280'}}>Aguardando <code style={{color:'#f59e0b'}}>?token=...</code></p></div>);
  if(!data)return(<div style={g.center}><p style={{color:'#9ca3af'}}>Carregando…</p></div>);

  const totalClicks=Object.values(data.checkoutClicks).reduce((a,b)=>a+b,0);
  const checkoutSummary=data.checkoutSummary||{
    rawCheckoutEvents:totalClicks,
    basicPopupOpens:data.checkoutClicks.plano_basico_popup_open,
    checkoutRedirects:data.checkoutClicks.plano_basico+data.checkoutClicks.kit_completo+data.checkoutClicks.kit_desconto_popup,
    uniqueCheckoutSessions:0,
    basicSelected:data.checkoutClicks.plano_basico,
    completeSelected:data.checkoutClicks.kit_completo,
    upgradeAccepted:data.checkoutClicks.kit_desconto_popup,
  };
  const periodBase=data.sessionsPeriod||data.totalSessionsToday||0;
  const periodLabel=WINDOWS.find(w=>w.v===data.window)?.l||data.window;
  const dataIssue=data.debug?.sessQueryError||'';
  const detSess=selSid?data.sessions.find(s=>s.sessionId===selSid):null;
  void tick;

  return (
    <div style={g.page}>
      <div style={g.wrap}>

        {/* Header */}
        <header style={g.hdr}>
          <div>
            <p style={g.eyebrow}>Painel de leitura da PV</p>
            <h1 style={g.title}>FUNIL <span style={{color:'#f59e0b'}}>—</span> Mapa do Degradê</h1>
            <p style={g.sub}>
              {lu?`Atualizado às ${lu}`:'Aguardando primeira leitura'} · {fmt(data.totalSessionsToday)} sessões no dia · janela {periodLabel}
              {loading&&<span style={{color:'#f59e0b',marginLeft:8}}>atualizando</span>}
            </p>
          </div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
            <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={g.inp}/>
            <select value={win} onChange={e=>setWin(e.target.value)} style={g.inp}>
              {WINDOWS.map(w=><option key={w.v} value={w.v}>{w.l}</option>)}
            </select>
            <Btn active={auto} onClick={()=>setAuto(p=>!p)}>{auto?'⟳ ON':'⟳ OFF'}</Btn>
            <Btn onClick={()=>load(token,date,win)} disabled={loading}>↺</Btn>
          </div>
        </header>

        {/* Tabs */}
        <div style={g.tabBar}>
          {TABS.map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)} style={{...g.tabBtn,...(tab===t?g.tabActive:{})}}>
              {l}{t==='usuarios'&&data.sessions.length>0&&<span style={g.badge}>{data.sessions.length}</span>}
            </button>
          ))}
        </div>

        <div style={g.statusBar}>
          <div>
            <strong style={{color:'#f3f4f6'}}>Base carregada sem corte de 100 sessões</strong>
            <span style={{color:'#6b7280',marginLeft:8}}>Hoje: {fmt(data.totalSessionsToday)} · Período: {fmt(data.sessionsPeriod)} · Usuários listados: {fmt(data.sessions.length)}</span>
          </div>
          <div style={{color:'#9ca3af'}}>Checkout único: <b style={{color:'#22c55e'}}>{fmtPct(checkoutSummary.uniqueCheckoutSessions,periodBase)}</b> · Compra: <b style={{color:'#f97316'}}>{fmtPct(data.purchases.count,periodBase)}</b></div>
        </div>
        {dataIssue&&<div style={g.warnBar}>Alguma consulta retornou aviso: {dataIssue}</div>}

        {/* ════ TAB GERAL ════ */}
        {tab==='geral'&&<>
          {/* Cards */}
          <div style={g.grid6}>
            <Card label="● Ativos agora"  value={fmt(data.activeNow)}            color="#22c55e" hint="≤25s"/>
            <Card label="◑ Ativos 30min"  value={fmt(data.active30m)}            color="#3b82f6"/>
            <Card label="Sessões hoje"    value={fmt(data.totalSessionsToday)}   color="#06b6d4"/>
            <Card label="Sessões período" value={fmt(data.sessionsPeriod)}        color="#38bdf8" hint="Sessões consideradas na janela selecionada"/>
            <Card label="Checkout único"  value={fmt(checkoutSummary.uniqueCheckoutSessions)} color="#22c55e" hint="Sessões com redirecionamento real"/>
            <Card label="Taxa checkout"   value={fmtPct(checkoutSummary.uniqueCheckoutSessions,periodBase)} color="#84cc16" hint="Checkout único / sessões do período"/>
            <Card label="Redirect Wiapy"  value={fmt(checkoutSummary.checkoutRedirects)} color="#f59e0b" hint="Cliques que abrem checkout"/>
            <Card label="Popup Básico"   value={fmt(checkoutSummary.basicPopupOpens)} color="#6366f1" hint="Apenas abertura do popup"/>
            <Card label="Compras"         value={fmt(data.purchases.count)}      color="#f97316"/>
            <Card label="Taxa compra"     value={fmtPct(data.purchases.count,periodBase)} color="#fb7185" hint="Compras / sessões do período"/>
            <Card label="Receita"         value={fmtBRL(data.purchases.revenue)} color="#a855f7"/>
          </div>

          <Block title="Resumo Checkout">
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:10}}>
              <MiniMetric label="Cliques brutos" value={fmt(checkoutSummary.rawCheckoutEvents)} color="#9ca3af"/>
              <MiniMetric label="Popup Básico" value={fmt(checkoutSummary.basicPopupOpens)} color="#6366f1"/>
              <MiniMetric label="Básico selecionado" value={fmt(checkoutSummary.basicSelected)} color="#3b82f6"/>
              <MiniMetric label="Kit R$29" value={fmt(checkoutSummary.completeSelected)} color="#f59e0b"/>
              <MiniMetric label="Upgrade R$24" value={fmt(checkoutSummary.upgradeAccepted)} color="#22c55e"/>
              <MiniMetric label="Sessões únicas" value={fmt(checkoutSummary.uniqueCheckoutSessions)} color="#22c55e"/>
            </div>
          </Block>

          {/* ── Funil Visual ── */}
          <Block title="Funil Visual">
            {/* Controls row */}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12,flexWrap:'wrap',gap:8}}>
              <div style={{display:'flex',gap:6,flexWrap:'wrap',alignItems:'center'}}>
                <span style={{fontSize:11,color:'#6b7280',marginRight:2}}>Filtrar:</span>
                <Pill active={!funnelFilter} onClick={()=>setFunnelFilter(null)}>Geral</Pill>
                {data.campaigns.slice(0,3).map(c=><Pill key={c.utmCampaign} active={funnelFilter?.value===c.utmCampaign} onClick={()=>setFunnelFilter(f=>f?.value===c.utmCampaign?null:{type:'campaign',value:c.utmCampaign})}>📢 {c.utmCampaign}</Pill>)}
                {data.creatives.slice(0,3).map(c=><Pill key={c.utmContent} active={funnelFilter?.value===c.utmContent} onClick={()=>setFunnelFilter(f=>f?.value===c.utmContent?null:{type:'creative',value:c.utmContent})}>🎨 {c.utmContent}</Pill>)}
              </div>
              <button onClick={()=>setIncludeCta(p=>!p)} style={{display:'flex',alignItems:'center',gap:6,background:'none',border:'1px solid #1f2937',borderRadius:16,padding:'4px 12px',cursor:'pointer',fontSize:11,color:includeCta?'#f59e0b':'#6b7280'}}>
                <span style={{width:26,height:14,borderRadius:7,background:includeCta?'#f59e0b':'#374151',display:'inline-block',position:'relative',flexShrink:0}}>
                  <span style={{position:'absolute',top:2,width:10,height:10,borderRadius:'50%',background:'#fff',transition:'left .2s',left:includeCta?'14px':'2px'}}/>
                </span>
                {includeCta?'Scroll + CTA jump':'Scroll real apenas'}
              </button>
            </div>

            <div style={{overflowX:'auto'}}>
              {visibleFunnel.map((step,i)=>{
                const barW = Math.max(step.percentOfTop, 2);
                const isOferta = step.sectionId==='oferta';
                const isSel = selectedStep===step.sectionId;
                return (
                  <div key={step.sectionId}
                    onClick={()=>{setSelectedStep(s=>s===step.sectionId?null:step.sectionId); setTab('usuarios'); setStopFilter(s=>s===step.sectionTitle?null:step.sectionTitle); setUserFilter('todos');}}
                    style={{display:'flex',alignItems:'center',gap:10,marginBottom:4,padding:'4px 8px',borderRadius:8,cursor:'pointer',
                      background:isSel?'rgba(249,115,22,.1)':isOferta?'rgba(249,115,22,.05)':'transparent',
                      border:isSel?'1px solid rgba(249,115,22,.3)':isOferta?'1px solid rgba(249,115,22,.15)':'1px solid transparent'}}
                  >
                    <div style={{width:180,fontSize:12,color:isOferta?'#fdba74':'#d1d5db',flexShrink:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                      {isOferta&&'★ '}{step.sectionTitle}
                    </div>
                    <div style={{flex:1,background:'#111827',borderRadius:4,height:24,position:'relative',overflow:'hidden'}}>
                      <div style={{position:'absolute',left:0,top:0,height:'100%',width:`${barW}%`,background:
                        isOferta?'linear-gradient(90deg,#f97316,#f59e0b)':
                        step.percentOfTop>=70?'#22c55e':step.percentOfTop>=40?'#f59e0b':'#ef4444',
                        borderRadius:4,transition:'width .5s'}}/>
                      <span style={{position:'absolute',left:8,top:'50%',transform:'translateY(-50%)',fontSize:11,fontWeight:600,color:'#fff',textShadow:'0 1px 3px rgba(0,0,0,.8)'}}>
                        {fmt(step.reached)}
                      </span>
                    </div>
                    <div style={{width:42,textAlign:'right',fontSize:12,color:pctCol(step.percentOfTop),fontWeight:700,flexShrink:0}}>{step.percentOfTop}%</div>
                    <div style={{width:46,textAlign:'right',fontSize:11,flexShrink:0,color:step.dropFromPrevious>0?dropCol(step.dropFromPrevious):'#374151'}}>
                      {i>0&&step.dropFromPrevious>0?<span>-{step.dropFromPrevious}%</span>:'—'}
                    </div>
                    {!includeCta&&(data.ctaJumpCounts[step.sectionId]||0)>0&&(
                      <div style={{width:60,textAlign:'right',fontSize:10,color:'#f59e0b',flexShrink:0}} title="Chegaram via CTA jump">
                        ↗ {data.ctaJumpCounts[step.sectionId]}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <p style={{fontSize:11,color:'#374151',marginTop:8}}>Clique em uma etapa para filtrar usuários que pararam ali.</p>
          </Block>

          {/* ── CTA Interno + Gargalos ── */}
          {data.internalCtaClicks&&data.internalCtaClicks.length>0&&<Block title="Cliques em CTA Interno">
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:10,marginBottom:8}}>
              {data.internalCtaClicks.map((c,i)=>(
                <div key={i} style={{background:'#111827',border:'1px solid #1f2937',borderRadius:10,padding:'12px 16px'}}>
                  <p style={{fontSize:11,color:'#6b7280',margin:'0 0 4px',textTransform:'uppercase',letterSpacing:.8}}>{c.label}</p>
                  <p style={{fontSize:22,fontWeight:800,color:'#f59e0b',margin:0}}>{fmt(c.clicks)}</p>
                  <p style={{fontSize:10,color:'#374151',margin:'4px 0 0'}}>→ 11 - Oferta (salto)</p>
                </div>
              ))}
            </div>
            <p style={{fontSize:11,color:'#374151',margin:0}}>
              Esses cliques saltam para a oferta sem passar pelas seções intermediárias.
              {!includeCta&&' O funil acima mostra apenas scroll real.'}
            </p>
          </Block>}

          {/* ── Gargalos ── */}
          {data.topBottlenecks.length>0&&<Block title="Gargalos Principais">            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:10}}>
              {data.topBottlenecks.slice(0,4).map((b,i)=>(
                <div key={i} style={{background:'#111827',border:`1px solid ${b.dropPercent>40?'rgba(239,68,68,.3)':'rgba(245,158,11,.2)'}`,borderRadius:10,padding:'12px 16px'}}>
                  <div style={{fontSize:10,color:'#6b7280',marginBottom:6,textTransform:'uppercase',letterSpacing:.8}}>
                    {i===0?'🔴 Maior gargalo':i===1?'🟠 2º gargalo':'📉 Gargalo'}
                  </div>
                  <div style={{fontSize:12,color:'#d1d5db',marginBottom:4}}>{b.fromSection} <span style={{color:'#6b7280'}}>→</span> {b.toSection}</div>
                  <div style={{fontSize:22,fontWeight:800,color:dropCol(b.dropPercent)}}>-{b.dropPercent}%</div>
                  <div style={{fontSize:11,color:'#6b7280'}}>{fmt(b.dropUsers)} usuários abandonaram nessa etapa</div>
                </div>
              ))}
            </div>
          </Block>}

          {/* ── Onde pararam ── */}
          {data.stopPoints.length>0&&<Block title="Onde os Leads Pararam">
            <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
              {data.stopPoints.slice(0,10).map((sp,i)=>(
                <button key={i} onClick={()=>{setStopFilter(s=>s===sp.sectionTitle?null:sp.sectionTitle);setSelectedStep(s=>s===sp.sectionTitle?null:sp.sectionTitle);setTab('usuarios');setUserFilter('todos');}}
                  style={{background: stopFilter===sp.sectionTitle?'rgba(249,115,22,.15)':'#111827',border:`1px solid ${stopFilter===sp.sectionTitle?'rgba(249,115,22,.4)':'#1f2937'}`,borderRadius:8,padding:'8px 14px',cursor:'pointer',textAlign:'left'}}>
                  <div style={{fontSize:12,color:'#d1d5db',marginBottom:2}}>{sp.sectionTitle}</div>
                  <div style={{fontSize:18,fontWeight:700,color:i<2?'#ef4444':i<5?'#f59e0b':'#6b7280'}}>{fmt(sp.usersStopped)}</div>
                  <div style={{fontSize:10,color:'#6b7280'}}>leads pararam aqui</div>
                </button>
              ))}
            </div>
            {stopFilter&&<p style={{fontSize:11,color:'#f59e0b',marginTop:8}}>Filtrando: "{stopFilter}" — <button onClick={()=>{setStopFilter(null);setSelectedStep(null);}} style={{background:'none',border:'none',color:'#6b7280',cursor:'pointer',fontSize:11}}>limpar</button></p>}
          </Block>}

          {/* ── Diagnóstico por seção ── */}
          <Block title="Diagnóstico por Seção">
            <div style={{overflowX:'auto'}}>
              <table style={g.tbl}><thead><tr>
                <TH>Seção</TH><TH r>Chegaram</TH><TH r>% Topo</TH><TH r>Drop</TH><TH r>Drop Acum.</TH><TH>Top Campanha</TH><TH>Top Criativo</TH>
              </tr></thead><tbody>
              {data.sectionDiagnostics.map(d=>(
                <tr key={d.sectionId} style={{...g.tr,background:d.sectionId==='oferta'?'rgba(249,115,22,.05)':undefined}}>
                  <TD style={{fontSize:12,color:d.sectionId==='oferta'?'#fdba74':'#d1d5db'}}>{d.sectionId==='oferta'&&<span style={{marginRight:4}}>★</span>}{d.sectionTitle}</TD>
                  <TD r bold>{fmt(d.reached)}</TD>
                  <TD r style={{color:pctCol(d.percentOfTop)}}>{d.percentOfTop}%</TD>
                  <TD r style={{color:d.dropFromPrevious>0?dropCol(d.dropFromPrevious):'#374151'}}>{d.dropFromPrevious>0?`-${d.dropFromPrevious}%`:'—'}</TD>
                  <TD r style={{color:d.dropAccumulated>50?'#ef4444':d.dropAccumulated>20?'#f59e0b':'#9ca3af'}}>{d.dropAccumulated>0?`-${d.dropAccumulated}%`:'—'}</TD>
                  <TD style={{fontSize:11,color:'#9ca3af'}}>{d.topCampaign||'—'}</TD>
                  <TD style={{fontSize:11,color:'#9ca3af'}}>{d.topCreative||'—'}</TD>
                </tr>
              ))}</tbody></table>
            </div>
          </Block>

          {/* Preview usuários */}
          <Block title="Últimos Usuários">
            <table style={g.tbl}><thead><tr>
              <TH>Usuário</TH><TH>Status</TH><TH>Visto há</TH><TH>Campanha</TH><TH>Parou em</TH><TH>Última oferta</TH>
            </tr></thead><tbody>
            {data.sessions.slice(0,5).map(sess=>(
              <tr key={sess.sessionId} style={{...g.tr,cursor:'pointer'}} onClick={()=>{openDetail(sess.sessionId);}}>
                <TD style={{fontSize:11,fontFamily:'monospace',color:'#60a5fa'}}>{sess.label}</TD>
                <TD><span style={{color:STATUS_COLOR[sess.status],fontSize:12}}>● {sess.status}</span></TD>
                <TD style={{fontSize:11,color:'#6b7280'}}>{secsAgo(sess.secondsSinceLastSeen)}</TD>
                <TD style={{fontSize:12}}>{sess.utmCampaign||'—'}</TD>
                <TD style={{fontSize:12,color:'#d1d5db'}}>{sess.maxSectionTitle||'—'}</TD>
                <TD>{sess.lastCheckoutClick?<span style={{...g.clickBadge,background:(CLICK_BADGE[sess.lastCheckoutClick.checkoutType]?.color||'#6b7280')+'22',color:(CLICK_BADGE[sess.lastCheckoutClick.checkoutType]?.color||'#9ca3af')}}>{CLICK_BADGE[sess.lastCheckoutClick.checkoutType]?.label||sess.lastCheckoutClick.checkoutType}</span>:'—'}</TD>
              </tr>
            ))}</tbody></table>
            {data.sessions.length>5&&<button style={g.linkBtn} onClick={()=>setTab('usuarios')}>Ver todos os {data.sessions.length} usuários →</button>}
          </Block>

          <div style={g.debugBar}>
            <span>all today: <b>{data.debug?.allSessionsTodayCount??data.totalSessionsToday}</b></span>
            <span>returned: <b>{data.debug?.returnedSessionsCount??data.sessions.length}</b></span>
            <span>date: <b>{data.date}</b></span><span>window: <b>{data.window}</b></span>
            {data.debug?.sessQueryError&&<span style={{color:'#ef4444'}}>err: {data.debug.sessQueryError}</span>}
          </div>
        </>}

        {/* ════ TAB USUÁRIOS ════ */}
        {tab==='usuarios'&&<>
          <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:12,alignItems:'center'}}>
            <input value={userSearch} onChange={e=>setUserSearch(e.target.value)} placeholder="Buscar..." style={{...g.inp,flex:1,minWidth:180}}/>
            <select value={userFilter} onChange={e=>setUserFilter(e.target.value as UserFilter)} style={g.inp}>
              {(['todos','online','recentes','saíram','compraram','clicaram','chegaram_oferta','nao_oferta'] as UserFilter[]).map(f=><option key={f} value={f}>{f}</option>)}
            </select>
            {stopFilter&&<span style={{background:'rgba(249,115,22,.1)',border:'1px solid rgba(249,115,22,.3)',borderRadius:16,padding:'4px 12px',fontSize:11,color:'#f59e0b'}}>
              Parou em: {stopFilter} <button onClick={()=>setStopFilter(null)} style={{background:'none',border:'none',color:'#6b7280',cursor:'pointer',marginLeft:4}}>✕</button>
            </span>}
          </div>

          <Block title={`Usuários Anônimos (${filteredUsers.length})`}>
            {filteredUsers.length===0?<p style={{color:'#6b7280',fontSize:13,padding:'12px 0'}}>Nenhuma sessão encontrada.</p>:(
              <div style={{overflowX:'auto'}}>
                <table style={g.tbl}><thead><tr>
                  <TH>Usuário</TH><TH>Status</TH><TH>Visto há</TH><TH>Campanha</TH><TH>Criativo</TH>
                  <TH>Parou em</TH><TH>Última oferta clicada</TH><TH r>Cliques</TH><TH r>Comprou</TH>
                </tr></thead><tbody>
                {filteredUsers.map(sess=>(
                  <tr key={sess.sessionId} style={{...g.tr,cursor:'pointer'}} onClick={()=>openDetail(sess.sessionId)}>
                    <TD><span style={{color:'#60a5fa',fontFamily:'monospace',fontSize:11}}>{sess.label}</span><span style={{color:'#374151',fontSize:10,marginLeft:5}}>#{sess.shortId}</span></TD>
                    <TD><span style={{color:STATUS_COLOR[sess.status],fontSize:12}}>● {sess.status}</span></TD>
                    <TD style={{fontSize:11,color:'#6b7280'}}>{secsAgo(sess.secondsSinceLastSeen)}</TD>
                    <TD style={{fontSize:12}}>{sess.utmCampaign||'—'}</TD>
                    <TD style={{fontSize:12}}>{sess.utmContent||'—'}</TD>
                    <TD style={{fontSize:12,color:'#d1d5db'}}>{sess.maxSectionTitle||'—'}</TD>
                    <TD>{sess.lastCheckoutClick?<span style={{...g.clickBadge,background:(CLICK_BADGE[sess.lastCheckoutClick.checkoutType]?.color||'#6b7280')+'22',color:(CLICK_BADGE[sess.lastCheckoutClick.checkoutType]?.color||'#9ca3af')}}>{CLICK_BADGE[sess.lastCheckoutClick.checkoutType]?.label||sess.lastCheckoutClick.checkoutType}</span>:'—'}</TD>
                    <TD r>{fmt(sess.clicksCount)}</TD>
                    <TD r>{sess.purchased?<span style={{color:'#22c55e',fontWeight:700}}>✓</span>:'—'}</TD>
                  </tr>
                ))}</tbody></table>
              </div>
            )}
          </Block>
        </>}

        {/* ════ TAB CAMPANHAS ════ */}
        {tab==='campanhas'&&<>
          {data.campaigns.length>0&&<Block title="Por Campanha"><DGrid headers={['Campanha','Sessões','Oferta','Cliques','Compras','Receita','CTR%','CVR%']} rows={data.campaigns.map(c=>[c.utmCampaign,fmt(c.sessions),fmt(c.reachedOffer),fmt(c.clicks),fmt(c.purchases),fmtBRL(c.revenue),c.conversionClick+'%',c.conversionPurchase+'%'])}/></Block>}
          {data.adsets.length>0&&<Block title="Por Conjunto (adset_id)"><DGrid headers={['Conjunto','Sessões','Oferta','Cliques','Compras','Receita','CTR%','CVR%']} rows={data.adsets.map(a=>[a.adsetId,fmt(a.sessions),fmt(a.reachedOffer),fmt(a.clicks),fmt(a.purchases),fmtBRL(a.revenue),a.conversionClick+'%',a.conversionPurchase+'%'])}/></Block>}
          {data.creatives.length>0&&<Block title="Por Criativo (utm_content)"><DGrid headers={['Criativo','Sessões','Oferta','Cliques','Compras','Receita','CTR%','CVR%']} rows={data.creatives.map(c=>[c.utmContent,fmt(c.sessions),fmt(c.reachedOffer),fmt(c.clicks),fmt(c.purchases),fmtBRL(c.revenue),c.conversionClick+'%',c.conversionPurchase+'%'])}/></Block>}
        </>}

        {/* ════ TAB EXPORTAÇÕES ════ */}
        {tab==='exportacoes'&&<>
          <Block title="Exportar Dados">
            <p style={{color:'#9ca3af',fontSize:13,marginBottom:16}}>Data: <strong style={{color:'#f3f4f6'}}>{date}</strong></p>
            <div style={{display:'flex',gap:10}}>
              <Btn onClick={()=>window.open(`/api/funnel-export?token=${encodeURIComponent(token)}&date=${date}&type=csv`,'_blank')}>⬇ CSV</Btn>
              <Btn onClick={()=>window.open(`/api/funnel-export?token=${encodeURIComponent(token)}&date=${date}&type=json`,'_blank')}>⬇ JSON</Btn>
            </div>
          </Block>
          <Block title="Limpar Dados">
            <div style={{background:'rgba(239,68,68,.05)',border:'1px solid rgba(239,68,68,.2)',borderRadius:8,padding:16,marginBottom:16}}>
              <p style={{color:'#fca5a5',fontSize:13,margin:0}}>⚠️ Apaga todos os dados do Supabase para {date}. Exporte antes.</p>
            </div>
            {!showClear?<Btn danger onClick={()=>setShowClear(true)}>🗑 Limpar {date}</Btn>:<>
              <p style={{color:'#9ca3af',fontSize:12,marginBottom:8}}>Digite <strong style={{color:'#ef4444'}}>LIMPAR</strong>:</p>
              <input value={clearTxt} onChange={e=>setClearTxt(e.target.value)} placeholder="LIMPAR" style={{...g.inp,marginBottom:10,color:'#ef4444',width:160}}/>
              <div style={{display:'flex',gap:8}}>
                <Btn danger onClick={async()=>{if(clearTxt!=='LIMPAR')return;await fetch('/api/funnel-clear',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token,date})});setShowClear(false);setClearTxt('');load(token,date,win);}} disabled={clearTxt!=='LIMPAR'}>Confirmar</Btn>
                <Btn onClick={()=>{setShowClear(false);setClearTxt('');}}>Cancelar</Btn>
              </div>
            </>}
          </Block>
        </>}

        <p style={{textAlign:'center',fontSize:10,color:'#1f2937',paddingBottom:32,marginTop:8}}>Sem dados pessoais · {data.updatedAt}</p>
      </div>

      {/* Session drawer */}
      {selSid&&(
        <div style={g.overlay} onClick={closeDetail}>
          <aside style={g.drawer} onClick={e=>e.stopPropagation()}>
            <div style={g.drawerHdr}>
              <h2 style={g.drawerTitle}>{detSess?.label||'Detalhe'}</h2>
              <button onClick={closeDetail} style={{background:'none',border:'none',color:'#6b7280',cursor:'pointer',fontSize:20}}>✕</button>
            </div>
            <div style={{flex:1,overflowY:'auto',padding:'20px 22px'}}>
              {detL?<p style={{color:'#6b7280',textAlign:'center',padding:32}}>Carregando…</p>:detail?(
                <>
                  {detSess&&<DBlock title="Identificação">
                    <DR k="Usuário" v={detSess.label}/><DR k="Status" v={<span style={{color:STATUS_COLOR[detSess.status]}}>● {detSess.status}</span>}/>
                    <DR k="Session" v={<code style={{fontSize:10}}>{selSid.slice(0,20)}…</code>}/>
                    <DR k="1ª visita" v={fmtTime(detSess.firstSeen)}/><DR k="Última ativ." v={fmtTime(detSess.lastSeen)}/>
                    {detSess.leftAt&&<DR k="Saiu em" v={fmtTime(detSess.leftAt)}/>}
                  </DBlock>}
                  {detail.session&&<DBlock title="Origem">
                    {['utm_source','utm_medium','utm_campaign','utm_term','utm_content','campaign_id','adset_id','ad_id','placement','site_source_name'].map(k=>
                      detail.session![k]?<DR key={k} k={k} v={String(detail.session![k])}/>:null)}
                  </DBlock>}
                  {detail.sectionsReached.length>0&&<DBlock title={`Percurso (${detail.sectionsReached.length} seções)`}>
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
                  <DBlock title={`Cliques em Checkout (${detail.clicks.length})`}>
                    {detail.clicks.length===0?<p style={{color:'#6b7280',fontSize:12,margin:0}}>Sem clique em checkout.</p>:(
                      <div style={{background:'#070a0f',borderRadius:6,overflow:'hidden'}}>
                        {detail.clicks.map((cl,i)=>{
                          const badge=CLICK_BADGE[cl.checkout_type];
                          return <div key={i} style={{padding:'10px 12px',borderBottom:'1px solid #111827',display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:8}}>
                            <div>
                              <span style={{...g.clickBadge,background:(badge?.color||'#6b7280')+'22',color:(badge?.color||'#9ca3af'),marginRight:8}}>{badge?.label||cl.checkout_type}</span>
                              {cl.checkout_price&&<span style={{color:'#22c55e',fontSize:12,fontWeight:700}}>{fmtBRL(cl.checkout_price)}</span>}
                              {cl.current_section_title&&<p style={{fontSize:10,color:'#6b7280',margin:'4px 0 0'}}>na seção: {cl.current_section_title}</p>}
                            </div>
                            <span style={{fontSize:10,color:'#6b7280',whiteSpace:'nowrap'}}>{fmtTime(cl.clicked_at)}</span>
                          </div>;
                        })}
                      </div>
                    )}
                  </DBlock>
                  <DBlock title="Compra">
                    {detail.purchase?<><DR k="Produto" v={String(detail.purchase.checkout_title||'')}/><DR k="Valor" v={<span style={{color:'#22c55e',fontWeight:700}}>{fmtBRL(detail.purchase.amount as number)}</span>}/><DR k="Horário" v={fmtTime(detail.purchase.created_at as string)}/></>:<p style={{color:'#6b7280',fontSize:12,margin:0}}>Sem compra registrada.</p>}
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

// ─── Components ───────────────────────────────────────────────────────────────
function Block({title,children}:{title:string;children:React.ReactNode}){return <div style={g.block}><h2 style={g.blockTitle}>{title}</h2>{children}</div>;}
function Card({label,value,color,hint}:{label:string;value:string;color:string;hint?:string}){return <div style={{...g.card,borderLeft:`3px solid ${color}`}} title={hint}><p style={g.cardLabel}>{label}</p><p style={{...g.cardVal,color}}>{value}</p></div>;}
function MiniMetric({label,value,color}:{label:string;value:string;color:string}){return <div style={{background:'#0f172a',border:'1px solid #1e293b',borderRadius:8,padding:'10px 12px'}}><p style={{fontSize:10,color:'#64748b',margin:'0 0 4px',textTransform:'uppercase',letterSpacing:.7}}>{label}</p><p style={{fontSize:20,fontWeight:800,color,margin:0}}>{value}</p></div>;}
function DGrid({headers,rows}:{headers:string[];rows:string[][]}){return <div style={{overflowX:'auto'}}><table style={g.tbl}><thead><tr>{headers.map((h,i)=><TH key={h} r={i>0}>{h}</TH>)}</tr></thead><tbody>{rows.map((row,ri)=><tr key={ri} style={g.tr}>{row.map((cell,ci)=><TD key={ci} r={ci>0} bold={ci>0}>{cell}</TD>)}</tr>)}</tbody></table></div>;}
function DBlock({title,children}:{title:string;children:React.ReactNode}){return <div style={{marginBottom:20}}><p style={{fontSize:10,color:'#f59e0b',textTransform:'uppercase',letterSpacing:1,margin:'0 0 8px',fontWeight:700}}>{title}</p><div style={{background:'#0d1117',border:'1px solid #1f2937',borderRadius:8,padding:'10px 14px'}}>{children}</div></div>;}
function DR({k,v}:{k:string;v:React.ReactNode}){return <div style={{display:'flex',justifyContent:'space-between',padding:'5px 0',borderBottom:'1px solid #111827'}}><span style={{fontSize:11,color:'#6b7280'}}>{k}</span><span style={{fontSize:12,color:'#d1d5db',textAlign:'right',maxWidth:'65%',wordBreak:'break-all'}}>{v}</span></div>;}
function Pill({children,active,onClick}:{children:React.ReactNode;active:boolean;onClick:()=>void}){return <button onClick={onClick} style={{border:'1px solid',borderRadius:16,padding:'3px 10px',fontSize:11,cursor:'pointer',background:active?'rgba(249,115,22,.15)':'#111827',color:active?'#f59e0b':'#6b7280',borderColor:active?'rgba(249,115,22,.4)':'#1f2937'}}>{children}</button>;}
function Btn({children,onClick,active,danger,disabled}:{children:React.ReactNode;onClick?:()=>void;active?:boolean;danger?:boolean;disabled?:boolean}){return <button onClick={onClick} disabled={disabled} style={{border:'1px solid',borderRadius:6,padding:'7px 14px',fontSize:12,cursor:disabled?'not-allowed':'pointer',background:active?'#14532d':danger?'#450a0a':'#111827',color:active?'#4ade80':danger?'#f87171':'#d1d5db',borderColor:active?'#166534':danger?'#991b1b':'#1f2937',opacity:disabled?.5:1}}>{children}</button>;}
const TH=({children,r}:{children?:React.ReactNode;r?:boolean})=><th style={{padding:'9px 12px',fontWeight:600,fontSize:11,textTransform:'uppercase',letterSpacing:.8,borderBottom:'1px solid #1f2937',color:'#4b5563',textAlign:r?'right':'left',whiteSpace:'nowrap'}}>{children}</th>;
const TD=({children,r,bold,style}:{children?:React.ReactNode;r?:boolean;bold?:boolean;style?:React.CSSProperties})=><td style={{padding:'9px 12px',color:'#9ca3af',verticalAlign:'middle',textAlign:r?'right':'left',fontWeight:bold?600:400,...style}}>{children}</td>;

const g:Record<string,React.CSSProperties>={
  page:       {minHeight:'100vh',background:'linear-gradient(180deg,#080b10 0%,#0b1018 44%,#070a0f 100%)',color:'#fff',fontFamily:'system-ui,sans-serif',padding:'20px 16px'},
  wrap:       {maxWidth:1440,margin:'0 auto'},
  center:     {minHeight:'100vh',background:'#070a0f',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:12},
  ebox:       {background:'#0d1117',border:'1px solid #1f2937',borderRadius:12,padding:32,textAlign:'center'},
  hdr:        {display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14,flexWrap:'wrap',gap:12,background:'rgba(15,23,42,.62)',border:'1px solid #1e293b',borderRadius:12,padding:'16px 18px',boxShadow:'0 18px 44px rgba(0,0,0,.22)'},
  eyebrow:    {fontSize:10,color:'#f59e0b',textTransform:'uppercase',letterSpacing:1.2,fontWeight:800,margin:'0 0 5px'},
  title:      {fontSize:24,fontWeight:850,margin:0,color:'#f8fafc',letterSpacing:0},
  sub:        {fontSize:12,color:'#94a3b8',margin:'5px 0 0'},
  inp:        {background:'#0f172a',border:'1px solid #1e293b',borderRadius:6,color:'#d1d5db',padding:'7px 12px',fontSize:12},
  tabBar:     {display:'flex',gap:2,borderBottom:'1px solid #1f2937',marginBottom:12,overflowX:'auto'},
  tabBtn:     {background:'none',border:'none',borderBottom:'2px solid transparent',color:'#94a3b8',padding:'10px 18px',fontSize:13,cursor:'pointer',display:'flex',alignItems:'center',gap:6,whiteSpace:'nowrap'},
  tabActive:  {color:'#f59e0b',borderBottom:'2px solid #f59e0b'},
  badge:      {background:'#1f2937',color:'#9ca3af',borderRadius:10,padding:'1px 7px',fontSize:11,fontWeight:700},
  grid6:      {display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:10,marginBottom:16},
  statusBar:  {display:'flex',justifyContent:'space-between',alignItems:'center',gap:10,flexWrap:'wrap',background:'#0f172a',border:'1px solid #1e293b',borderRadius:10,padding:'10px 14px',marginBottom:12,fontSize:12},
  warnBar:    {background:'rgba(245,158,11,.1)',border:'1px solid rgba(245,158,11,.28)',color:'#fbbf24',borderRadius:10,padding:'10px 14px',marginBottom:12,fontSize:12},
  card:       {background:'#0f172a',border:'1px solid #1e293b',borderRadius:8,padding:'13px 16px',boxShadow:'inset 0 1px 0 rgba(255,255,255,.03)'},
  cardLabel:  {fontSize:11,color:'#64748b',margin:'0 0 6px',textTransform:'uppercase',letterSpacing:.9},
  cardVal:    {fontSize:26,fontWeight:800,margin:0},
  block:      {background:'#0d1117',border:'1px solid #1e293b',borderRadius:10,padding:'18px 20px',marginBottom:14,boxShadow:'0 12px 30px rgba(0,0,0,.16)'},
  blockTitle: {fontSize:12,fontWeight:800,color:'#64748b',textTransform:'uppercase',letterSpacing:1,margin:'0 0 14px'},
  tbl:        {width:'100%',borderCollapse:'collapse',fontSize:13},
  tr:         {borderBottom:'1px solid #111827',transition:'background .1s'},
  clickBadge: {display:'inline-block',padding:'2px 8px',borderRadius:10,fontSize:11,fontWeight:600},
  linkBtn:    {background:'none',border:'none',color:'#f59e0b',cursor:'pointer',fontSize:13,padding:'8px 0 0',display:'block'},
  overlay:    {position:'fixed',inset:0,background:'rgba(0,0,0,.8)',zIndex:999,display:'flex',justifyContent:'flex-end'},
  drawer:     {background:'#0d1117',borderLeft:'1px solid #1f2937',width:'100%',maxWidth:500,height:'100vh',display:'flex',flexDirection:'column'},
  drawerHdr:  {display:'flex',justifyContent:'space-between',alignItems:'center',padding:'18px 22px',borderBottom:'1px solid #1f2937'},
  drawerTitle:{margin:0,fontSize:16,fontWeight:700,color:'#f59e0b'},
  debugBar:   {background:'#070a0f',border:'1px solid #111827',borderRadius:8,padding:'8px 16px',marginBottom:24,fontSize:11,color:'#374151',display:'flex',gap:20,flexWrap:'wrap'},
};
