'use client';
import React, { useEffect, useState, useCallback, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface SectionRow { order:number; id:string; title:string; reached:number; percentOfHero:number; dropFromPrevious:number; }
interface CheckoutClicks { plano_basico_popup_open:number; plano_basico:number; kit_completo:number; kit_desconto_popup:number; }
interface MapRow { sessions:number; clicks:number; reachedOffer:number; purchases:number; revenue:number; conversionClick:number; conversionPurchase:number; }
interface CRow extends MapRow { utmCampaign:string; }
interface ARow extends MapRow { adsetId:string; }
interface CreRow extends MapRow { utmContent:string; }
type SessionStatus = 'online'|'recente'|'saiu'|'inativo';
interface SessionRow {
  sessionId:string; label:string; shortId:string;
  firstSeen:string; lastSeen:string; leftAt:string|null; pageStatus:string;
  status:SessionStatus; secondsSinceLastSeen:number;
  utmSource?:string; utmCampaign?:string; utmTerm?:string; utmContent?:string;
  campaignId?:string; adsetId?:string; adId?:string; placement?:string; siteSourceName?:string;
  maxSectionOrder:number; maxSectionTitle?:string; clicksCount:number; purchased:boolean; revenue:number;
}
interface DashData {
  date:string; window:string;
  activeNow:number; active30m:number; totalSessionsInWindow:number; totalClicks:number;
  sections:SectionRow[]; checkoutClicks:CheckoutClicks;
  purchases:{count:number;revenue:number};
  campaigns:CRow[]; adsets:ARow[]; creatives:CreRow[];
  sessions:SessionRow[]; showingMax:boolean; updatedAt:string;
}
interface SessionDetail {
  session:Record<string,unknown>|null;
  sectionsReached:Record<string,unknown>[];
  clicks:Record<string,unknown>[];
  purchase:Record<string,unknown>|null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt    = (n?:number|null) => (n??0).toLocaleString('pt-BR');
const fmtBRL = (n?:number|null) => (n||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const fmtTime = (iso?:string|null) => iso ? new Date(iso).toLocaleTimeString('pt-BR') : '—';
const pctCol  = (p:number) => p>=70?'#4ade80':p>=40?'#f59e0b':'#ff6b6b';
const today   = () => new Date().toISOString().split('T')[0];

const STATUS_COLOR: Record<SessionStatus,string> = {
  online:'#4ade80', recente:'#60a5fa', saiu:'#6b7280', inativo:'#374151',
};
const STATUS_DOT: Record<SessionStatus,string> = {
  online:'●', recente:'●', saiu:'○', inativo:'○',
};

function secsAgo(sec:number): string {
  if (sec < 5)   return 'agora';
  if (sec < 60)  return `há ${sec}s`;
  if (sec < 3600) return `há ${Math.floor(sec/60)}min`;
  return `há ${Math.floor(sec/3600)}h`;
}

const WINDOWS = [
  {v:'now',  l:'Agora (35s)'}, {v:'30m', l:'30 min'}, {v:'1h', l:'1 hora'},
  {v:'2h',   l:'2 horas'},     {v:'4h',  l:'4 horas'},{v:'12h',l:'12 horas'},
  {v:'24h',  l:'24 horas'},    {v:'today',l:'Hoje'},
];

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function FunilPage() {
  const [token,setToken]     = useState('');
  const [date,setDate]       = useState(today());
  const [win,setWin]         = useState('today');
  const [data,setData]       = useState<DashData|null>(null);
  const [err,setErr]         = useState('');
  const [loading,setLoading] = useState(false);
  const [lu,setLu]           = useState('');
  const [auto,setAuto]       = useState(false);
  const [selSid,setSelSid]   = useState<string|null>(null);
  const [detail,setDetail]   = useState<SessionDetail|null>(null);
  const [detL,setDetL]       = useState(false);
  const [clearTxt,setClearTxt] = useState('');
  const [showClear,setShowClear] = useState(false);
  const [tick,setTick]       = useState(0);
  const ivRef  = useRef<ReturnType<typeof setInterval>|null>(null);
  const tickIv = useRef<ReturnType<typeof setInterval>|null>(null);

  // 1-second ticker for "visto há"
  useEffect(()=>{ tickIv.current=setInterval(()=>setTick(p=>p+1),1000); return()=>{ if(tickIv.current) clearInterval(tickIv.current); }; },[]);

  useEffect(()=>{ const p=new URLSearchParams(window.location.search); setToken(p.get('token')||''); },[]);

  const load = useCallback(async(tok:string,d:string,w:string)=>{
    if(!tok) return;
    setLoading(true);
    try {
      const r = await fetch(`/api/funnel-dashboard?token=${encodeURIComponent(tok)}&date=${d}&window=${w}`);
      if(r.status===401){setErr('Acesso negado.');setData(null);return;}
      if(!r.ok){const j=await r.json().catch(()=>({})) as {error?:string}; setErr(`Erro ${r.status}${j.error?': '+j.error:''}`);return;}
      setData(await r.json() as DashData);
      setErr('');
      setLu(new Date().toLocaleTimeString('pt-BR'));
    } catch(e){setErr(`Conexão: ${e instanceof Error?e.message:e}`);}
    finally{setLoading(false);}
  },[]);

  useEffect(()=>{if(token)load(token,date,win);},[token]);           // eslint-disable-line
  useEffect(()=>{if(token)load(token,date,win);},[date,win]);        // eslint-disable-line
  useEffect(()=>{
    if(ivRef.current) clearInterval(ivRef.current);
    if(auto&&token) ivRef.current=setInterval(()=>load(token,date,win),60_000);
    return()=>{if(ivRef.current) clearInterval(ivRef.current);};
  },[auto,token,date,win,load]);

  const openDetail = useCallback(async(sid:string)=>{
    setSelSid(sid); setDetL(true);
    try {
      const r=await fetch(`/api/funnel-session?token=${encodeURIComponent(token)}&sessionId=${encodeURIComponent(sid)}&date=${date}`);
      setDetail(await r.json() as SessionDetail);
    } catch{setDetail(null);} finally{setDetL(false);}
  },[token,date]);

  const closeDetail=()=>{setSelSid(null);setDetail(null);};
  const exportData=(t:'csv'|'json')=>window.open(`/api/funnel-export?token=${encodeURIComponent(token)}&date=${date}&type=${t}`,'_blank');
  const doClear=async()=>{
    if(clearTxt!=='LIMPAR') return;
    await fetch('/api/funnel-clear',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token,date})});
    setShowClear(false); setClearTxt(''); load(token,date,win);
  };

  if(err) return <div style={s.center}><div style={s.ebox}><div style={{fontSize:32,marginBottom:12}}>🔒</div><p style={{color:'#ff6b6b',fontWeight:700,marginBottom:16}}>{err}</p><Btn onClick={()=>{setErr('');load(token,date,win);}}>Tentar novamente</Btn></div></div>;
  if(!data) return <div style={s.center}><div style={{color:'#888'}}>{loading?'Carregando...':'Aguardando ?token=...'}</div></div>;

  const totalClicks=Object.values(data.checkoutClicks).reduce((a,b)=>a+b,0);
  const detSess = selSid ? data.sessions.find(s=>s.sessionId===selSid) : null;

  return (
    <div style={s.page}>
      <div style={s.wrap}>

        {/* Header */}
        <div style={s.hdr}>
          <div><h1 style={s.ttl}>FUNIL — Mapa do Degradê</h1><p style={s.sub}>Atualizado às {lu}{loading?' · carregando...':''}</p></div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
            <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={s.inp}/>
            <select value={win} onChange={e=>setWin(e.target.value)} style={s.inp}>
              {WINDOWS.map(w=><option key={w.v} value={w.v}>{w.l}</option>)}
            </select>
            <Btn active={auto} onClick={()=>setAuto(p=>!p)}>{auto?'⟳ Auto 60s':'⟳ Auto OFF'}</Btn>
            <Btn onClick={()=>load(token,date,win)} disabled={loading}>↺ Atualizar</Btn>
          </div>
        </div>

        {/* Cards */}
        <div style={s.cards}>
          <Card label="● Ativos agora" value={fmt(data.activeNow)} color="#4ade80" hint="Presença confirmada nos últimos 35s"/>
          <Card label="◑ Ativos 30min" value={fmt(data.active30m)} color="#60a5fa"/>
          <Card label="Sessões período" value={fmt(data.totalSessionsInWindow)} color="#a78bfa"/>
          <Card label="Cliques CTA" value={fmt(totalClicks)} color="#f59e0b"/>
          <Card label="Compras" value={fmt(data.purchases.count)} color="#fb923c"/>
          <Card label="Receita" value={fmtBRL(data.purchases.revenue)} color="#e879f9"/>
        </div>

        {/* Funnel */}
        <Block title="Funil por Seção">
          <table style={s.tbl}>
            <thead><tr style={{color:'#555'}}>
              <Th>Seção</Th><Th r>Alcançaram</Th><Th r>% Topo</Th><Th r>Drop</Th><Th>Barra</Th>
            </tr></thead>
            <tbody>{data.sections.map(sec=>(
              <tr key={sec.id} style={{...s.tr, outline: sec.id==='oferta'?'1px solid rgba(242,138,26,.35)':'none'}}>
                <Td>{sec.id==='oferta'?<span style={{color:'#F28A1A',marginRight:4}}>★</span>:null}{sec.title}</Td>
                <Td r bold>{fmt(sec.reached)}</Td>
                <Td r style={{color:pctCol(sec.percentOfHero)}}>{sec.percentOfHero}%</Td>
                <Td r style={{color:sec.dropFromPrevious>30?'#ff6b6b':'#555'}}>{sec.dropFromPrevious>0?`-${sec.dropFromPrevious}%`:'—'}</Td>
                <Td><div style={s.barBg}><div style={{...s.barFill,width:`${sec.percentOfHero}%`}}/></div></Td>
              </tr>
            ))}</tbody>
          </table>
        </Block>

        {/* Checkout clicks */}
        <Block title="Cliques em Checkout">
          <div style={s.cards}>
            {([['Básico→popup','plano_basico_popup_open'],['Kit (PV)','kit_completo'],['Kit desconto','kit_desconto_popup'],['Continua Bás.','plano_basico']] as [string,keyof typeof data.checkoutClicks][]).map(([l,k])=>(
              <Card key={k} label={l} value={fmt(data.checkoutClicks[k]||0)} color="#60a5fa"/>
            ))}
          </div>
        </Block>

        {/* Campaigns */}
        {data.campaigns.length>0&&<Block title="Por Campanha (utm_campaign)">
          <Grid headers={['Campanha','Sessões','Oferta','Cliques','Compras','Receita','CTR%','CVR%']}
            rows={data.campaigns.map(c=>[c.utmCampaign,fmt(c.sessions),fmt(c.reachedOffer),fmt(c.clicks),fmt(c.purchases),fmtBRL(c.revenue),c.conversionClick+'%',c.conversionPurchase+'%'])}/>
        </Block>}

        {/* Adsets */}
        {data.adsets.length>0&&<Block title="Por Conjunto (adset_id)">
          <Grid headers={['Conjunto','Sessões','Oferta','Cliques','Compras','Receita','CTR%','CVR%']}
            rows={data.adsets.map(a=>[a.adsetId,fmt(a.sessions),fmt(a.reachedOffer),fmt(a.clicks),fmt(a.purchases),fmtBRL(a.revenue),a.conversionClick+'%',a.conversionPurchase+'%'])}/>
        </Block>}

        {/* Creatives */}
        {data.creatives.length>0&&<Block title="Por Criativo (utm_content)">
          <Grid headers={['Criativo','Sessões','Oferta','Cliques','Compras','Receita','CTR%','CVR%']}
            rows={data.creatives.map(c=>[c.utmContent,fmt(c.sessions),fmt(c.reachedOffer),fmt(c.clicks),fmt(c.purchases),fmtBRL(c.revenue),c.conversionClick+'%',c.conversionPurchase+'%'])}/>
        </Block>}

        {/* Users */}
        {data.sessions.length>0&&<Block title={`Usuários Anônimos (${data.sessions.length}${data.showingMax?' — mostrando 100':''}) `}>
          <div style={{overflowX:'auto'}}>
            <table style={s.tbl}>
              <thead><tr style={{color:'#555'}}>
                <Th>Usuário</Th><Th>Status</Th><Th>1ª visita</Th><Th>Visto há</Th>
                <Th>Campanha</Th><Th>Conjunto</Th><Th>Criativo</Th>
                <Th>Última seção</Th><Th r>Cliques</Th><Th r>Compra</Th><Th r>Receita</Th>
              </tr></thead>
              <tbody>{data.sessions.map(sess=>{
                const secAgoVal = tick >= 0 ? sess.secondsSinceLastSeen + Math.floor((Date.now()/1000) - Math.floor(Date.now()/1000)) : sess.secondsSinceLastSeen;
                void secAgoVal;
                const liveSeconds = sess.secondsSinceLastSeen;
                return (
                  <tr key={sess.sessionId} style={{...s.tr,cursor:'pointer'}} onClick={()=>openDetail(sess.sessionId)}>
                    <Td><span style={{color:'#60a5fa',fontFamily:'monospace',fontSize:11}}>{sess.label}</span><span style={{color:'#555',fontSize:10,marginLeft:6}}>#{sess.shortId}</span></Td>
                    <Td><span style={{color:STATUS_COLOR[sess.status],fontSize:13}}>{STATUS_DOT[sess.status]}</span> <span style={{fontSize:12,color:STATUS_COLOR[sess.status]}}>{sess.status}</span></Td>
                    <Td style={{fontSize:11}}>{fmtTime(sess.firstSeen)}</Td>
                    <Td style={{fontSize:11,color:'#888'}}>{secsAgo(liveSeconds)}</Td>
                    <Td style={{fontSize:12}}>{sess.utmCampaign||'—'}</Td>
                    <Td style={{fontSize:12}}>{sess.adsetId||'—'}</Td>
                    <Td style={{fontSize:12}}>{sess.utmContent||'—'}</Td>
                    <Td style={{fontSize:12}}>{sess.maxSectionTitle||'—'}</Td>
                    <Td r>{fmt(sess.clicksCount)}</Td>
                    <Td r>{sess.purchased?<span style={{color:'#4ade80'}}>✓</span>:'—'}</Td>
                    <Td r style={{fontSize:12}}>{sess.revenue>0?fmtBRL(sess.revenue):'—'}</Td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
        </Block>}

        {/* Actions */}
        <div style={{display:'flex',gap:10,flexWrap:'wrap',margin:'8px 0'}}>
          <Btn onClick={()=>exportData('csv')}>⬇ CSV</Btn>
          <Btn onClick={()=>exportData('json')}>⬇ JSON</Btn>
          <Btn danger onClick={()=>setShowClear(true)}>🗑 Limpar {date}</Btn>
        </div>
        <p style={{textAlign:'center',fontSize:10,color:'#333',marginTop:8}}>Sem dados pessoais · {data.updatedAt}</p>

      </div>{/* /wrap */}

      {/* Session Detail */}
      {selSid&&(
        <div style={s.overlay} onClick={closeDetail}>
          <div style={s.drawer} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16,borderBottom:'1px solid #222',paddingBottom:12}}>
              <h2 style={{margin:0,fontSize:15,fontWeight:800,color:'#F28A1A'}}>{detSess?.label||'Detalhe'}</h2>
              <button onClick={closeDetail} style={{background:'none',border:'none',color:'#666',cursor:'pointer',fontSize:20}}>✕</button>
            </div>
            {detL?<div style={{color:'#888',textAlign:'center',padding:32}}>Carregando…</div>:detail?(
              <div style={{overflowY:'auto',maxHeight:'calc(90vh - 80px)'}}>
                {/* Bloco 1 — ID */}
                {detSess&&<>
                  <DLabel>Identificação</DLabel>
                  <div style={s.dBlock}>
                    <DRow k="Usuário" v={detSess.label}/>
                    <DRow k="Status" v={<span style={{color:STATUS_COLOR[detSess.status]}}>{detSess.status}</span>}/>
                    <DRow k="sessionId" v={<span style={{fontFamily:'monospace',fontSize:11}}>{selSid.slice(0,20)}…</span>}/>
                    <DRow k="Primeira visita" v={fmtTime(detSess.firstSeen)}/>
                    <DRow k="Última atividade" v={fmtTime(detSess.lastSeen)}/>
                    {detSess.leftAt&&<DRow k="Saiu em" v={fmtTime(detSess.leftAt)}/>}
                  </div>
                </>}
                {/* Bloco 2 — UTM */}
                {detail.session&&<>
                  <DLabel>Origem</DLabel>
                  <div style={s.dBlock}>
                    {(['utm_source','utm_medium','utm_campaign','utm_term','utm_content','campaign_id','adset_id','ad_id','placement','site_source_name'] as string[]).map(k=>(
                      detail.session![k]?<DRow key={k} k={k} v={String(detail.session![k])}/>:null
                    ))}
                  </div>
                </>}
                {/* Bloco 3 — Seções */}
                {detail.sectionsReached.length>0&&<>
                  <DLabel>Percurso na PV ({detail.sectionsReached.length})</DLabel>
                  <div style={{...s.dBlock,padding:0,overflow:'hidden'}}>
                    {detail.sectionsReached.map((ev,i)=>{
                      const isLast = i===detail.sectionsReached.length-1;
                      return <div key={i} style={{padding:'8px 12px',borderBottom:'1px solid #1a1a1a',background:isLast?'rgba(242,138,26,.06)':'transparent',display:'flex',justifyContent:'space-between'}}>
                        <span style={{fontSize:12,color:isLast?'#F28A1A':'#ccc'}}>{ev.section_title as string}</span>
                        <span style={{fontSize:11,color:'#555'}}>{fmtTime(ev.created_at as string)}</span>
                      </div>;
                    })}
                  </div>
                </>}
                {/* Bloco 4 — Cliques */}
                {detail.clicks.length>0&&<>
                  <DLabel>Cliques ({detail.clicks.length})</DLabel>
                  <div style={{...s.dBlock,padding:0,overflow:'hidden'}}>
                    {detail.clicks.map((ev,i)=>(
                      <div key={i} style={{padding:'8px 12px',borderBottom:'1px solid #1a1a1a',display:'flex',justifyContent:'space-between'}}>
                        <span style={{fontSize:12,color:'#f59e0b'}}>{ev.checkout_type as string}</span>
                        <span style={{fontSize:11,color:'#555'}}>{String(ev.button_location||'')} · {fmtTime(ev.created_at as string)}</span>
                      </div>
                    ))}
                  </div>
                </>}
                {/* Bloco 5 — Compra */}
                <DLabel>Compra</DLabel>
                {detail.purchase?(
                  <div style={s.dBlock}>
                    <DRow k="Produto" v={String(detail.purchase.checkout_title||'')}/>
                    <DRow k="Valor" v={<span style={{color:'#4ade80',fontWeight:700}}>{fmtBRL(detail.purchase.amount as number)}</span>}/>
                    <DRow k="Horário" v={fmtTime(detail.purchase.created_at as string)}/>
                  </div>
                ):<div style={{...s.dBlock,color:'#555',fontSize:12}}>Sem compra registrada.</div>}
              </div>
            ):<div style={{color:'#888',textAlign:'center',padding:24}}>Sessão não encontrada.</div>}
          </div>
        </div>
      )}

      {/* Clear Modal */}
      {showClear&&(
        <div style={s.overlay} onClick={()=>setShowClear(false)}>
          <div style={{...s.drawer,maxWidth:440}} onClick={e=>e.stopPropagation()}>
            <h2 style={{fontSize:14,fontWeight:700,color:'#ff6b6b',margin:'0 0 12px'}}>⚠️ Limpar dados de {date}</h2>
            <p style={{fontSize:12,color:'#ccc',marginBottom:8}}>Isso apagará <strong style={{color:'#fff'}}>todos os dados do Supabase</strong> para {date}. Exporte antes de continuar.</p>
            <p style={{fontSize:12,color:'#888',marginBottom:12}}>Digite <strong style={{color:'#ff6b6b'}}>LIMPAR</strong> para confirmar:</p>
            <input value={clearTxt} onChange={e=>setClearTxt(e.target.value)} placeholder="LIMPAR" style={{...s.inp,width:'100%',marginBottom:12,color:'#ff6b6b'}}/>
            <div style={{display:'flex',gap:8}}>
              <Btn danger onClick={doClear} disabled={clearTxt!=='LIMPAR'}>Confirmar limpeza</Btn>
              <Btn onClick={()=>{setShowClear(false);setClearTxt('');}}>Cancelar</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function Block({title,children}:{title:string;children:React.ReactNode}){
  return <div style={s.blk}><h2 style={s.blkT}>{title}</h2>{children}</div>;
}
function Card({label,value,color,hint}:{label:string;value:string;color:string;hint?:string}){
  return <div style={s.card} title={hint}>
    <p style={s.cLabel}>{label}</p>
    <p style={{...s.cVal,color}}>{value}</p>
    {hint&&<p style={{fontSize:10,color:'#444',margin:'4px 0 0'}}>{hint}</p>}
  </div>;
}
function Grid({headers,rows}:{headers:string[];rows:string[][]}){
  return <div style={{overflowX:'auto'}}>
    <table style={s.tbl}>
      <thead><tr style={{color:'#555'}}>
        {headers.map((h,i)=><th key={h} style={{...s.th,textAlign:i===0?'left':'right'}}>{h}</th>)}
      </tr></thead>
      <tbody>{rows.map((row,ri)=>(
        <tr key={ri} style={s.tr}>
          {row.map((cell,ci)=><td key={ci} style={{...s.td,textAlign:ci===0?'left':'right',fontWeight:ci===0?400:600}}>{cell}</td>)}
        </tr>
      ))}</tbody>
    </table>
  </div>;
}
function Btn({children,onClick,active,danger,disabled}:{children:React.ReactNode;onClick?:()=>void;active?:boolean;danger?:boolean;disabled?:boolean}){
  return <button onClick={onClick} disabled={disabled} style={{border:'1px solid',borderRadius:6,padding:'6px 14px',fontSize:12,cursor:disabled?'not-allowed':'pointer',
    background:active?'#166534':danger?'#3f0000':'#1f1f1f',
    color:active?'#4ade80':danger?'#ff6b6b':'#aaa',
    borderColor:active?'#166534':danger?'#7f1d1d':'#333',
    opacity:disabled?0.5:1}}>{children}</button>;
}
const Th=({children,r}:{children?:React.ReactNode;r?:boolean})=><th style={{...s.th,textAlign:r?'right':'left'}}>{children}</th>;
const Td=({children,r,bold,style}:{children?:React.ReactNode;r?:boolean;bold?:boolean;style?:React.CSSProperties})=>
  <td style={{...s.td,textAlign:r?'right':'left',fontWeight:bold?700:400,...style}}>{children}</td>;
const DLabel=({children}:{children:React.ReactNode})=><p style={{fontSize:10,color:'#F28A1A',textTransform:'uppercase',letterSpacing:1,margin:'16px 0 6px',fontWeight:700}}>{children}</p>;
const DRow=({k,v}:{k:string;v:React.ReactNode})=><div style={{display:'flex',justifyContent:'space-between',padding:'4px 0',borderBottom:'1px solid #1e1e1e'}}>
  <span style={{fontSize:11,color:'#555'}}>{k}</span>
  <span style={{fontSize:12,color:'#ccc'}}>{v}</span>
</div>;

// ─── Styles ───────────────────────────────────────────────────────────────────
const s: Record<string,React.CSSProperties> = {
  page:   {minHeight:'100vh',background:'#0c0c0c',color:'#fff',fontFamily:'system-ui,sans-serif',padding:'20px 16px'},
  wrap:   {maxWidth:1000,margin:'0 auto'},
  center: {minHeight:'100vh',background:'#0c0c0c',display:'flex',alignItems:'center',justifyContent:'center'},
  ebox:   {background:'#1a1a1a',border:'1px solid #333',borderRadius:12,padding:32,textAlign:'center'},
  hdr:    {display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20,flexWrap:'wrap',gap:12},
  ttl:    {fontSize:18,fontWeight:800,margin:0,color:'#F28A1A'},
  sub:    {fontSize:11,color:'#444',margin:'4px 0 0'},
  cards:  {display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:10,marginBottom:20},
  card:   {background:'#161616',border:'1px solid #222',borderRadius:10,padding:'12px 16px'},
  cLabel: {fontSize:11,color:'#555',margin:'0 0 6px',textTransform:'uppercase',letterSpacing:.8},
  cVal:   {fontSize:22,fontWeight:800,margin:0},
  blk:    {background:'#121212',border:'1px solid #1e1e1e',borderRadius:10,padding:18,marginBottom:18},
  blkT:   {fontSize:12,fontWeight:700,color:'#555',textTransform:'uppercase',letterSpacing:1,margin:'0 0 14px'},
  tbl:    {width:'100%',borderCollapse:'collapse',fontSize:13},
  tr:     {borderBottom:'1px solid #1a1a1a'},
  th:     {padding:'8px 10px',fontWeight:600,fontSize:11,textTransform:'uppercase',letterSpacing:.7,borderBottom:'1px solid #1e1e1e'},
  td:     {padding:'9px 10px',color:'#bbb',verticalAlign:'middle'},
  barBg:  {height:5,background:'#1e1e1e',borderRadius:3,overflow:'hidden',minWidth:60},
  barFill:{height:'100%',background:'#F28A1A',borderRadius:3,transition:'width .4s'},
  inp:    {background:'#161616',border:'1px solid #2a2a2a',borderRadius:6,color:'#ccc',padding:'6px 10px',fontSize:12},
  overlay:{position:'fixed',inset:0,background:'rgba(0,0,0,.8)',display:'flex',alignItems:'flex-start',justifyContent:'flex-end',zIndex:1000},
  drawer: {background:'#141414',borderLeft:'1px solid #222',padding:24,width:'100%',maxWidth:500,height:'100vh',overflowY:'auto'},
  dBlock: {background:'#0f0f0f',borderRadius:8,padding:'10px 12px',marginBottom:4},
};
