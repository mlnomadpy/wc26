/* =====================================================================
   FIFA World Cup 2026 — "Matchday" data explorer
   Modular vanilla ES app (no build). Hash-routed, deep-linkable.
   ===================================================================== */
"use strict";

/* ---------- constants ---------- */
const CONF = {UEFA:'#5aa2ff',CONMEBOL:'#3ddc97',CAF:'#ffb454',AFC:'#ff6b9d',CONCACAF:'#b48cff',OFC:'#5fd6ce',Unknown:'#6b7a90'};
const POSC = {GK:'#ffcf5a',DF:'#7fb6ff',MF:'#5ce0a8',FW:'#ff8fb0'};
const POSNAME = {GK:'Goalkeepers',DF:'Defenders',MF:'Midfielders',FW:'Forwards'};
const FLAG = {MEX:'🇲🇽',RSA:'🇿🇦',KOR:'🇰🇷',CZE:'🇨🇿',CAN:'🇨🇦',BIH:'🇧🇦',QAT:'🇶🇦',SUI:'🇨🇭',BRA:'🇧🇷',MAR:'🇲🇦',HAI:'🇭🇹',SCO:'🏴󠁧󠁢󠁳󠁣󠁴󠁿',USA:'🇺🇸',PAR:'🇵🇾',AUS:'🇦🇺',TUR:'🇹🇷',GER:'🇩🇪',CUR:'🇨🇼',CIV:'🇨🇮',ECU:'🇪🇨',NED:'🇳🇱',JPN:'🇯🇵',SWE:'🇸🇪',TUN:'🇹🇳',BEL:'🇧🇪',EGY:'🇪🇬',IRN:'🇮🇷',NZL:'🇳🇿',ESP:'🇪🇸',CPV:'🇨🇻',KSA:'🇸🇦',URU:'🇺🇾',FRA:'🇫🇷',SEN:'🇸🇳',IRQ:'🇮🇶',NOR:'🇳🇴',ARG:'🇦🇷',ALG:'🇩🇿',AUT:'🇦🇹',JOR:'🇯🇴',POR:'🇵🇹',COD:'🇨🇩',UZB:'🇺🇿',COL:'🇨🇴',ENG:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',CRO:'🇭🇷',GHA:'🇬🇭',PAN:'🇵🇦'};
const CITY_GEO = {1:[33.755,-84.401],2:[42.091,-71.264],3:[32.747,-97.093],4:[29.685,-95.411],5:[39.049,-94.484],6:[33.953,-118.339],7:[25.958,-80.239],8:[40.814,-74.074],9:[39.901,-75.168],10:[37.403,-121.970],11:[47.595,-122.332],12:[43.633,-79.418],13:[49.277,-123.112],14:[20.681,-103.462],15:[19.303,-99.150],16:[25.669,-100.244]};
const FORMATIONS = {
 '4-3-3':[['GK',50,90],['DF',16,72],['DF',38,75],['DF',62,75],['DF',84,72],['MF',30,52],['MF',50,55],['MF',70,52],['FW',22,26],['FW',50,20],['FW',78,26]],
 '4-4-2':[['GK',50,90],['DF',16,72],['DF',38,75],['DF',62,75],['DF',84,72],['MF',16,50],['MF',39,52],['MF',61,52],['MF',84,50],['FW',36,24],['FW',64,24]],
 '4-2-3-1':[['GK',50,90],['DF',16,73],['DF',38,76],['DF',62,76],['DF',84,73],['MF',38,60],['MF',62,60],['MF',22,40],['MF',50,42],['MF',78,40],['FW',50,20]],
 '3-5-2':[['GK',50,90],['DF',28,74],['DF',50,77],['DF',72,74],['MF',12,54],['MF',34,52],['MF',50,57],['MF',66,52],['MF',88,54],['FW',38,26],['FW',62,26]],
 '3-4-3':[['GK',50,90],['DF',28,74],['DF',50,77],['DF',72,74],['MF',16,54],['MF',40,54],['MF',60,54],['MF',84,54],['FW',24,28],['FW',50,22],['FW',76,28]],
 '5-3-2':[['GK',50,90],['DF',12,70],['DF',31,76],['DF',50,79],['DF',69,76],['DF',88,70],['MF',30,52],['MF',50,55],['MF',70,52],['FW',38,28],['FW',62,28]],
};
const FORMNAMES = Object.keys(FORMATIONS);

/* ---------- tiny helpers ---------- */
const $ = (s,el=document)=>el.querySelector(s);
const $$ = (s,el=document)=>[...el.querySelectorAll(s)];
const esc = s => (s==null?'':String(s)).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const num = n => n==null||n===''?'':Number(n).toLocaleString('en-US');
const money = v => v==null?'':v>=1e6?'€'+(v/1e6).toFixed(v>=1e7?0:1)+'M':v>=1e3?'€'+Math.round(v/1e3)+'K':'€'+v;
const flag = c => FLAG[c]||'🏳️';
const surname = n => {const w=(n||'').trim().split(/\s+/);return w.length>1?w[w.length-1]:(w[0]||'');};
const slug = s => encodeURIComponent(s);
const go = h => {location.hash = h.startsWith('#')?h:('#/'+h);};
window.go = go;            // inline onclick handlers resolve names via window

/* ---------- data + indexes ---------- */
let DB=null, IDX={};
function buildIndexes(){
  IDX.teamByCode={}; IDX.teamById={}; IDX.playersByTeam={}; IDX.playersByClub={}; IDX.playerById={}; IDX.cityById={};
  DB.teams.forEach(t=>{IDX.teamByCode[t.fifa_code]=t; IDX.teamById[t.id]=t; IDX.playersByTeam[t.fifa_code]=[];});
  DB.cities.forEach(c=>IDX.cityById[c.id]=c);
  DB.players.forEach(p=>{
    IDX.playerById[p.player_id]=p;
    (IDX.playersByTeam[p.fifa_code]=IDX.playersByTeam[p.fifa_code]||[]).push(p);
    if(p.club)(IDX.playersByClub[p.club]=IDX.playersByClub[p.club]||[]).push(p);
  });
}
const teamPlayers = code => IDX.playersByTeam[code]||[];
const avgAge = ps => {const a=ps.map(p=>p.age).filter(Number.isFinite); return a.length?(a.reduce((x,y)=>x+y,0)/a.length):null;};

/* ---------- projected-XI engine ---------- */
function strength(p){
  let s=0;
  if(Number.isFinite(p.club_minutes_2025_26)) s+=p.club_minutes_2025_26/90;
  else if(Number.isFinite(p.club_apps_2025_26)) s+=p.club_apps_2025_26;
  s+=(p.caps||0)*0.4 + (p.international_goals||0)*0.3;
  if(p.shirt_number) s+=Math.max(0,27-p.shirt_number)*0.25;
  if(p.is_captain) s+=1e6;
  return s;
}
function autoForm(sq){
  const df=sq.filter(p=>p.position==='DF').length, fw=sq.filter(p=>p.position==='FW').length;
  if(df<=7) return '3-4-3'; if(fw>=8) return '4-3-3'; if(fw<=5) return '4-2-3-1'; return '4-3-3';
}
function pickXI(sq,form){
  const slots=FORMATIONS[form], need={GK:0,DF:0,MF:0,FW:0};
  slots.forEach(s=>need[s[0]]++);
  const pools={GK:[],DF:[],MF:[],FW:[]};
  sq.forEach(p=>{if(pools[p.position])pools[p.position].push(p);});
  Object.values(pools).forEach(a=>a.sort((x,y)=>strength(y)-strength(x)));
  const chosen={GK:[],DF:[],MF:[],FW:[]}, used=new Set();
  ['GK','DF','MF','FW'].forEach(c=>{chosen[c]=pools[c].slice(0,need[c]);chosen[c].forEach(p=>used.add(p.player_id));});
  const left=sq.filter(p=>!used.has(p.player_id)).sort((x,y)=>strength(y)-strength(x));
  ['GK','DF','MF','FW'].forEach(c=>{while(chosen[c].length<need[c]&&left.length){const p=left.shift();chosen[c].push(p);used.add(p.player_id);}});
  const idx={GK:0,DF:0,MF:0,FW:0};
  return slots.map(s=>{const c=s[0];const p=chosen[c][idx[c]++];return p?p.player_id:null;});
}

/* ===================================================================
   ROUTER
   =================================================================== */
const ROUTES = [
  ['home','Home'],['teams','Teams'],['players','Players'],['clubs','Clubs'],
  ['groups','Groups'],['bracket','Bracket'],['matches','Matches'],['map','Map'],
  ['compare','Compare'],['insights','Insights'],['data','Data'],
];
function parseHash(){
  const h=(location.hash||'#/home').replace(/^#\/?/,'');
  const [view,...rest]=h.split('/');
  return {view:view||'home', param:rest.map(decodeURIComponent).join('/')};
}
function render(){
  const {view,param}=parseHash();
  $$('#nav a').forEach(a=>a.classList.toggle('on',a.dataset.v===view));
  const app=$('#app'); app.innerHTML=''; window.scrollTo(0,0);
  const fn=PAGES[view]||PAGES.home;
  try{ fn(app,param); }catch(e){ app.innerHTML=`<div class="panel"><h3>Something went wrong</h3><pre class="faint">${esc(e.message)}\n${esc(e.stack)}</pre></div>`; }
}
window.addEventListener('hashchange',render);

/* ===================================================================
   PAGES
   =================================================================== */
const PAGES={};
const back = ()=>`<a class="btn back" onclick="history.back()">← Back</a>`;

/* ---------- HOME / storylines ---------- */
PAGES.home=(app)=>{
  const t=DB.totals, P=DB.players;
  const oldest=[...P].filter(p=>p.age).sort((a,b)=>b.age-a.age)[0];
  const youngest=[...P].filter(p=>p.age).sort((a,b)=>a.age-b.age)[0];
  const topVal=[...P].filter(p=>p.market_value_eur).sort((a,b)=>b.market_value_eur-a.market_value_eur)[0];
  const topScorer=[...P].sort((a,b)=>(b.international_goals||0)-(a.international_goals||0))[0];
  const clubCount={}; P.forEach(p=>{if(p.club)clubCount[p.club]=(clubCount[p.club]||0)+1;});
  const topClub=Object.entries(clubCount).sort((a,b)=>b[1]-a[1])[0];
  const debutants=['UZB','CPV','JOR','HAI','CUR','IRQ','PAN'].filter(c=>IDX.teamByCode[c]);
  const stat=(big,lab,sub,hash)=>`<div class="story" ${hash?`onclick="go('${hash}')"`:''}><div class="big">${big}</div><div class="lab">${lab}</div><div class="sub faint">${sub}</div></div>`;
  app.innerHTML=`
   <section class="hero">
     <div class="eyebrow">JUNE 11 – JULY 19, 2026 · USA · CANADA · MEXICO</div>
     <h1>The first <span class="accent">48-team</span> World Cup, in data.</h1>
     <p class="lede">${num(t.players)} players · ${t.teams} nations · ${t.clubs} clubs · ${t.matches} matches across ${t.host_cities} cities. Explore every squad, build lineups, and trace the road to the final.</p>
     <div class="herobtns">
       <a class="btn primary" onclick="go('teams')">Browse teams</a>
       <a class="btn" onclick="go('bracket')">Road to the final</a>
       <a class="btn ghost" onclick="openPalette()">⌘K  Search anything</a>
     </div>
   </section>
   <h2 class="sec">Storylines</h2>
   <div class="storygrid">
     ${stat(flag('ARG')+' '+flag('POR'),'The last dance','Messi (ARG) &amp; Ronaldo (POR) — likely their final World Cup','compare')}
     ${stat(youngest?youngest.age:'—','Youngest player',youngest?`${esc(youngest.player_name)} ${flag(youngest.fifa_code)} · ${esc(youngest.club)}`:'',youngest?`player/${youngest.player_id}`:'')}
     ${stat(oldest?oldest.age:'—','Oldest player',oldest?`${esc(oldest.player_name)} ${flag(oldest.fifa_code)} · ${esc(oldest.club)}`:'',oldest?`player/${oldest.player_id}`:'')}
     ${stat(topScorer.international_goals,'Most intl goals',`${esc(topScorer.player_name)} ${flag(topScorer.fifa_code)}`,`player/${topScorer.player_id}`)}
     ${topVal?stat(money(topVal.market_value_eur),'Most valuable',`${esc(topVal.player_name)} ${flag(topVal.fifa_code)} · ${esc(topVal.club)}`,`player/${topVal.player_id}`):''}
     ${topClub?stat(topClub[1],'Top club supplier',`${esc(topClub[0])} sends ${topClub[1]} players`,`club/${slug(topClub[0])}`):''}
     ${stat(debutants.length+'+','Stories of firsts',`Debutants &amp; returnees: ${debutants.map(flag).join(' ')}`,'teams')}
     ${stat('12 → 1','Knockout bracket','From 48 teams to one champion','bracket')}
   </div>
   <h2 class="sec">Explore</h2>
   <div class="explore">
     ${[['teams','Teams & lineups','Formation pitch, projected XI, bench'],['players','Players','1,247 players, filter & compare'],['matches','Match Centre','104 matches, head-to-head XIs'],['map','Host cities','16 venues on the map'],['compare','Compare','Teams & players side-by-side'],['insights','Insights','Charts, value, age, diaspora'],['data','Data & sources','Coverage, methodology, export']].map(([v,h,s])=>`<a class="ecard" onclick="go('${v}')"><div class="eh">${h}</div><div class="faint">${s}</div></a>`).join('')}
   </div>`;
};

/* ---------- TEAMS grid ---------- */
PAGES.teams=(app)=>{
  const byG={}; DB.teams.forEach(t=>{(byG[t.group_letter]=byG[t.group_letter]||[]).push(t);});
  app.innerHTML=`<h2 class="sec">48 teams · 12 groups</h2><div class="tgrid">`+
    Object.keys(byG).sort().map(g=>`<div class="gcard"><div class="gh">Group ${g}</div>`+
      byG[g].sort((a,b)=>(a.fifa_ranking||999)-(b.fifa_ranking||999)).map(t=>`
        <a class="trow" onclick="go('team/${t.fifa_code}')">
          <span class="tn"><span class="fl">${flag(t.fifa_code)}</span> ${esc(t.team_name)}</span>
          <span class="rk">${t.fifa_ranking?'#'+t.fifa_ranking:''}</span></a>`).join('')+
      `</div>`).join('')+`</div>`;
};

/* ---------- TEAM page (lineup / squad / info) ---------- */
let TP=null;
PAGES.team=(app,code)=>{
  const t=IDX.teamByCode[code]; if(!t){app.innerHTML=`<div class="panel">Unknown team.</div>`;return;}
  const sq=teamPlayers(code);
  if(!TP||TP.code!==code){const form=autoForm(sq); TP={code,form,xi:pickXI(sq,form),sub:'lineup',sel:null,msg:''};}
  drawTeam(app);
};
function drawTeam(app){
  const t=IDX.teamByCode[TP.code], sq=teamPlayers(TP.code), av=avgAge(sq);
  const subs=[['lineup','Lineup'],['squad','Squad'],['info','Info']];
  let body = TP.sub==='lineup'?teamLineup(sq):TP.sub==='squad'?teamSquad(sq):teamInfo(t,sq,av);
  app.innerHTML=`${back()}
   <div class="teamhead" style="--c:${CONF[t.confederation]}">
     <div class="thflag">${flag(t.fifa_code)}</div>
     <div><div class="faint">Group ${t.group_letter} · ${t.confederation} · ${esc(t.qualification_method)||''}</div>
       <h1>${esc(t.team_name)}</h1>
       <div class="faint">${esc(t.head_coach)||'—'} · ${t.fifa_ranking?'FIFA #'+t.fifa_ranking:''} · ${sq.length} players · avg age ${av?av.toFixed(1):'—'}</div></div>
   </div>
   <div class="subtabs">${subs.map(([k,l])=>`<span class="subtab ${TP.sub===k?'on':''}" onclick="teamSub('${k}')">${l}</span>`).join('')}</div>
   ${body}`;
  if(TP.sub==='info') drawDoughnut('tpos', countPos(sq), k=>POSC[k]);
}
window.teamSub=s=>{TP.sub=s;TP.sel=null;TP.msg='';drawTeam($('#app'));};
window.setForm=f=>{TP.form=f;TP.xi=pickXI(teamPlayers(TP.code),f);TP.sel=null;TP.msg='';drawTeam($('#app'));};
window.resetXI=()=>{TP.xi=pickXI(teamPlayers(TP.code),TP.form);TP.sel=null;TP.msg='Lineup reset.';drawTeam($('#app'));};
window.benchSel=id=>{TP.sel=TP.sel===id?null:id;TP.msg=TP.sel?'Tap a same-position slot to swap in.':'';drawTeam($('#app'));};
window.slotClick=i=>{
  const cur=TP.xi[i];
  if(TP.sel==null){if(cur)go('player/'+cur);return;}
  const inP=IDX.playerById[TP.sel], cat=FORMATIONS[TP.form][i][0];
  if(inP.position!==cat){TP.msg=`${surname(inP.player_name)} is a ${inP.position}, not ${cat}.`;drawTeam($('#app'));return;}
  const j=TP.xi.indexOf(TP.sel); TP.xi[i]=TP.sel; if(j>=0)TP.xi[j]=cur;
  TP.sel=null; TP.msg=`${surname(inP.player_name)} moved into the XI.`; drawTeam($('#app'));
};
function countPos(sq){const c={GK:0,DF:0,MF:0,FW:0};sq.forEach(p=>c[p.position]!=null&&c[p.position]++);return c;}
function pitchSVG(){return `<div class="line ch"></div><div class="line cc"></div><div class="line box top"></div><div class="line box bot"></div><div class="line six top"></div><div class="line six bot"></div>`;}
function token(id,i,sel){
  const cat=FORMATIONS[TP.form][i][0], p=id?IDX.playerById[id]:null, [_,x,y]=FORMATIONS[TP.form][i];
  return `<div class="token ${TP.xi[i]===sel?'sel':''}" style="left:${x}%;top:${y}%" onclick="slotClick(${i})" title="${p?esc(p.player_name):''}">
    <div class="sh" style="background:${POSC[cat]}">${p?(p.shirt_number??''):''}${p&&p.is_captain?'<i class="cap">C</i>':''}</div>
    <div class="nm">${p?esc(surname(p.player_name)):'—'}</div></div>`;
}
function teamLineup(sq){
  const on=new Set(TP.xi.filter(Boolean));
  const bench=sq.filter(p=>!on.has(p.player_id)).sort((a,b)=>strength(b)-strength(a));
  return `<div class="pitchwrap">
    <div class="panel"><h3>Projected XI <span class="tag">${TP.form} · auto-picked from squad data — not an official lineup</span></h3>
      <div class="formrow">${FORMNAMES.map(f=>`<span class="chip ${TP.form===f?'on':''}" onclick="setForm('${f}')">${f}</span>`).join('')}<span class="chip" onclick="resetXI()">↺ reset</span></div>
      <div class="pitch">${pitchSVG()}${TP.xi.map((id,i)=>token(id,i,TP.sel)).join('')}</div>
      <div class="hint ${TP.msg?'live':'faint'}">${esc(TP.msg)||'Tap a bench player, then a same-position pitch slot to swap. Tap a pitch player for full stats.'}</div></div>
    <div class="panel"><h3>Bench <span class="tag">${bench.length} · ranked by projected role</span></h3>
      <div class="benchlist">${bench.map(p=>benchCard(p)).join('')}</div></div></div>`;
}
function benchCard(p){
  const sub=[p.club_apps_2025_26!=null?p.club_apps_2025_26+' apps':'',p.club_goals_2025_26!=null?p.club_goals_2025_26+'g':'',(p.caps||0)+'c'].filter(Boolean).join(' · ');
  return `<div class="pcard ${TP.sel===p.player_id?'sel':''}" onclick="benchSel(${p.player_id})">
    <div class="pcrow"><span class="pill ${p.position}">${p.position}</span><span class="faint">#${p.shirt_number??'—'}</span></div>
    <div class="nm">${esc(p.player_name)}${p.is_captain?' ©':''}</div>
    <div class="meta faint">${esc(p.club)}</div><div class="meta faint">${sub}</div>
    <a class="mini" onclick="event.stopPropagation();go('player/${p.player_id}')">stats →</a></div>`;
}
function teamSquad(sq){
  return `<div class="grid2">`+['GK','DF','MF','FW'].map(pos=>{
    const ps=sq.filter(p=>p.position===pos).sort((a,b)=>(a.shirt_number||99)-(b.shirt_number||99));
    return `<div class="panel"><h3>${POSNAME[pos]} <span class="tag">${ps.length}</span></h3>
      <table><thead><tr><th>#</th><th>Player</th><th>Club</th><th>Age</th><th>Apps</th><th>G</th><th>A</th></tr></thead><tbody>
      ${ps.map(p=>`<tr onclick="go('player/${p.player_id}')"><td class="mono">${p.shirt_number??''}</td>
        <td>${esc(p.player_name)}${p.is_captain?' <span class=faint>(C)</span>':''}</td><td class="faint">${esc(p.club)}</td>
        <td class="mono">${p.age??''}</td><td class="mono">${p.club_apps_2025_26??'·'}</td><td class="mono">${p.club_goals_2025_26??'·'}</td><td class="mono">${p.club_assists_2025_26??'·'}</td></tr>`).join('')}</tbody></table></div>`;
  }).join('')+`</div>`;
}
function teamInfo(t,sq,av){
  const totG=sq.reduce((s,p)=>s+(p.international_goals||0),0), totC=sq.reduce((s,p)=>s+(p.caps||0),0);
  const val=sq.reduce((s,p)=>s+(p.market_value_eur||0),0);
  const abroad=sq.filter(p=>p.club_country&&p.club_country!==t.team_name).length;
  const topCap=[...sq].sort((a,b)=>(b.caps||0)-(a.caps||0))[0];
  const topSc=[...sq].sort((a,b)=>(b.international_goals||0)-(a.international_goals||0))[0];
  const lg={}; sq.forEach(p=>{if(p.club_league)lg[p.club_league]=(lg[p.club_league]||0)+1;});
  const topLg=Object.entries(lg).sort((a,b)=>b[1]-a[1]).slice(0,7);
  return `<div class="grid2">
   <div class="panel"><h3>Overview</h3><div class="kv">
     <span class="k">Head coach</span><span>${esc(t.head_coach)||'—'}</span>
     <span class="k">FIFA ranking</span><span>${t.fifa_ranking?'#'+t.fifa_ranking:'—'}</span>
     <span class="k">Qualified via</span><span>${esc(t.qualification_method)||'—'}</span>
     <span class="k">Average age</span><span>${av?av.toFixed(1):'—'}</span>
     <span class="k">Total caps</span><span class="mono">${num(totC)}</span>
     <span class="k">Total intl goals</span><span class="mono">${num(totG)}</span>
     <span class="k">Squad value</span><span class="mono">${val?money(val):'—'}</span>
     <span class="k">Play abroad</span><span class="mono">${abroad}/${sq.length}</span>
     <span class="k">Most capped</span><span>${esc(topCap.player_name)} (${topCap.caps})</span>
     <span class="k">Top scorer</span><span>${esc(topSc.player_name)} (${topSc.international_goals})</span></div></div>
   <div class="panel"><h3>Squad shape</h3><canvas id="tpos" height="180"></canvas>
     <div class="sublabel">Players by league</div>
     ${topLg.map(([l,n])=>bar(esc(l),n,sq.length)).join('')}</div></div>`;
}

/* ---------- PLAYERS table ---------- */
let PF={q:'',team:'',conf:'',pos:'',sort:'caps',dir:-1};
PAGES.players=(app)=>{
  const teams=[...new Set(DB.players.map(p=>p.team_name))].sort();
  app.innerHTML=`<div class="panel">
    <div class="controls">
      <input id="q" placeholder="Search player or club…" value="${esc(PF.q)}" aria-label="Search players"/>
      <select id="ft" aria-label="Team"><option value="">All teams</option>${teams.map(t=>`<option ${PF.team===t?'selected':''}>${esc(t)}</option>`).join('')}</select>
      <select id="fc" aria-label="Confederation"><option value="">All confederations</option>${Object.keys(CONF).filter(c=>c!=='Unknown').map(c=>`<option ${PF.conf===c?'selected':''}>${c}</option>`).join('')}</select>
      <div class="chips" id="pc">${['','GK','DF','MF','FW'].map(p=>`<span class="chip ${PF.pos===p?'on':''}" data-p="${p}">${p||'All'}</span>`).join('')}</div>
      <button class="btn" id="exp">⬇ CSV</button><span class="count" id="cnt"></span></div>
    <div class="tablewrap"><table><thead><tr>${
      [['shirt_number','#'],['position','Pos'],['player_name','Player'],['fifa_code','Team'],['age','Age'],['club','Club'],['caps','Caps'],['international_goals','Goals'],['club_apps_2025_26','Apps26'],['club_goals_2025_26','G26'],['market_value_eur','Value']]
      .map(([k,l])=>`<th data-k="${k}">${l}<span class="ar"></span></th>`).join('')}</tr></thead><tbody id="pb"></tbody></table></div></div>`;
  let cur=[];
  const draw=()=>{
    const q=PF.q.toLowerCase();
    cur=DB.players.filter(p=>(!PF.team||p.team_name===PF.team)&&(!PF.conf||p.confederation===PF.conf)&&(!PF.pos||p.position===PF.pos)
      &&(!q||(p.player_name||'').toLowerCase().includes(q)||(p.club||'').toLowerCase().includes(q)));
    cur.sort(cmp(PF.sort,PF.dir));
    $('#cnt').textContent=`${cur.length} players`;
    $('#pb').innerHTML=cur.slice(0,800).map(p=>`<tr onclick="go('player/${p.player_id}')">
      <td class="mono">${p.shirt_number??''}</td><td><span class="pill ${p.position}">${p.position||''}</span></td>
      <td>${esc(p.player_name)}${p.is_captain?' <span class=faint>(C)</span>':''}</td><td>${flag(p.fifa_code)} <span class="mono faint">${p.fifa_code}</span></td>
      <td class="mono">${p.age??''}</td><td class="faint">${esc(p.club)}</td><td class="mono">${p.caps??''}</td><td class="mono">${p.international_goals??''}</td>
      <td class="mono">${p.club_apps_2025_26??'·'}</td><td class="mono">${p.club_goals_2025_26??'·'}</td><td class="mono">${p.market_value_eur?money(p.market_value_eur):'·'}</td></tr>`).join('')
      +(cur.length>800?`<tr><td colspan=11 class=faint>Showing first 800 of ${cur.length} — refine your filters.</td></tr>`:'')||'<tr><td colspan=11 class=faint>No players match.</td></tr>';
    markSort('#pb',PF);
  };
  let d;$('#q').oninput=e=>{PF.q=e.target.value;clearTimeout(d);d=setTimeout(draw,110);};
  $('#ft').onchange=e=>{PF.team=e.target.value;draw();};
  $('#fc').onchange=e=>{PF.conf=e.target.value;draw();};
  $$('#pc .chip').forEach(c=>c.onclick=()=>{PF.pos=c.dataset.p;$$('#pc .chip').forEach(x=>x.classList.toggle('on',x.dataset.p===PF.pos));draw();});
  $('#exp').onclick=()=>exportCSV(cur,'wc2026_players.csv');
  $$('#app th[data-k]').forEach(th=>th.onclick=()=>{const k=th.dataset.k;PF.dir=(PF.sort===k)?-PF.dir:(['player_name','club','fifa_code'].includes(k)?1:-1);PF.sort=k;draw();});
  draw();
};

/* ---------- PLAYER page ---------- */
PAGES.player=(app,id)=>{
  const p=IDX.playerById[id]; if(!p){app.innerHTML=`<div class="panel">Unknown player.</div>`;return;}
  const t=IDX.teamByCode[p.fifa_code];
  const stat=(k,l,fmt=num)=>p[k]!=null?`<div class="stat"><div class="v mono">${fmt(p[k])}</div><div class="k">${l}</div></div>`:'';
  const club=['club_apps_2025_26','club_starts_2025_26','club_minutes_2025_26','club_goals_2025_26','club_assists_2025_26','club_yellow_2025_26','club_red_2025_26','club_clean_sheets_2025_26','club_goals_conceded_2025_26'].some(k=>p[k]!=null);
  const wl=(p.team_wins_2025_26!=null||p.team_losses_2025_26!=null);
  const srcs=(p.enrichment_sources||'').toString().split(' ; ').map(s=>s.trim()).filter(s=>/^https?:/.test(s));
  app.innerHTML=`${back()}
   <div class="playerhead" style="--c:${POSC[p.position]}">
     <div class="phnum mono">${p.shirt_number??'—'}</div>
     <div><div class="faint"><a onclick="go('team/${p.fifa_code}')">${flag(p.fifa_code)} ${esc(p.team_name)}</a> · Group ${p.group_letter} · <span class="pill ${p.position}">${p.position}</span></div>
       <h1>${esc(p.player_name)} ${p.is_captain?'<span class="faint">(captain)</span>':''}</h1>
       <div class="faint"><a onclick="go('club/${slug(p.club)}')">${esc(p.club)}</a> · ${esc(p.club_league)||''}</div></div>
   </div>
   <div class="grid2">
     <div class="panel"><h3>Profile</h3><div class="kv">
       <span class="k">Date of birth</span><span>${esc(p.date_of_birth)||'—'}${p.age?` (age ${p.age})`:''}</span>
       <span class="k">Club</span><span>${esc(p.club)||'—'} · ${esc(p.club_country)||''}</span>
       <span class="k">Height</span><span>${p.height_cm?p.height_cm+' cm':'—'}</span>
       <span class="k">Preferred foot</span><span>${esc(p.preferred_foot)||'—'}</span>
       <span class="k">Market value</span><span class="mono">${p.market_value_eur?money(p.market_value_eur):'—'}</span></div>
       <div class="sublabel">International</div><div class="statgrid">${stat('caps','Caps')}${stat('international_goals','Goals')}</div></div>
     <div class="panel"><h3>Club season 2025/26 ${p.club_competitions_2025_26?`<span class="tag">${esc(p.club_competitions_2025_26)}</span>`:''}</h3>
       ${club?`<div class="statgrid">${stat('club_apps_2025_26','Apps')}${stat('club_starts_2025_26','Starts')}${stat('club_minutes_2025_26','Minutes')}${stat('club_goals_2025_26','Goals')}${stat('club_assists_2025_26','Assists')}${stat('club_yellow_2025_26','Yellow')}${stat('club_red_2025_26','Red')}${stat('club_clean_sheets_2025_26','Clean sheets')}${stat('club_goals_conceded_2025_26','Conceded')}</div>`:'<div class="faint">No verified club-season stats.</div>'}
       ${wl?`<div class="sublabel">Team record in his matches</div><div class="statgrid">${stat('team_wins_2025_26','Won')}${stat('team_draws_2025_26','Drew')}${stat('team_losses_2025_26','Lost')}</div>`:''}
       ${(p.career_club_apps!=null||p.career_club_goals!=null)?`<div class="sublabel">Club career totals</div><div class="statgrid">${stat('career_club_apps','Career apps')}${stat('career_club_goals','Career goals')}</div>`:''}
       ${p.form_note?`<div class="sublabel">Form</div><div class="faint">${esc(p.form_note)}</div>`:''}</div></div>
   ${srcs.length?`<div class="panel"><h3>Sources</h3>${srcs.map(s=>`<div class="src"><a href="${esc(s)}" target="_blank" rel="noopener">${esc(s)}</a></div>`).join('')}</div>`:''}`;
};

/* ---------- CLUBS ---------- */
PAGES.clubs=(app)=>{
  const m={}; DB.players.forEach(p=>{if(p.club)(m[p.club]=m[p.club]||[]).push(p);});
  const rows=Object.entries(m).map(([c,ps])=>({c,n:ps.length,country:ps[0].club_country,league:ps[0].club_league})).sort((a,b)=>b.n-a.n);
  app.innerHTML=`<div class="panel"><h3>${rows.length} clubs represented <span class="tag">click for players</span></h3>
    <div class="tablewrap"><table><thead><tr><th>Club</th><th>Country</th><th>League</th><th>Players</th></tr></thead><tbody>
    ${rows.map(r=>`<tr onclick="go('club/${slug(r.c)}')"><td>${esc(r.c)}</td><td class="faint">${esc(r.country)}</td><td class="faint">${esc(r.league)}</td><td class="mono"><b>${r.n}</b></td></tr>`).join('')}</tbody></table></div></div>`;
};
PAGES.club=(app,name)=>{
  const ps=IDX.playersByClub[name]||[]; if(!ps.length){app.innerHTML=`<div class="panel">No players for that club.</div>`;return;}
  app.innerHTML=`${back()}<div class="panel"><div class="faint">${esc(ps[0].club_country)} · ${esc(ps[0].club_league)}</div>
    <h1>${esc(name)}</h1><div class="faint">${ps.length} players at WC 2026</div></div>
   <div class="panel"><div class="tablewrap"><table><thead><tr><th>Pos</th><th>Player</th><th>Nation</th><th>Apps26</th><th>G26</th></tr></thead><tbody>
   ${ps.sort((a,b)=>a.team_name.localeCompare(b.team_name)).map(p=>`<tr onclick="go('player/${p.player_id}')">
     <td><span class="pill ${p.position}">${p.position}</span></td><td>${esc(p.player_name)}</td>
     <td>${flag(p.fifa_code)} ${esc(p.team_name)}</td><td class="mono">${p.club_apps_2025_26??'·'}</td><td class="mono">${p.club_goals_2025_26??'·'}</td></tr>`).join('')}</tbody></table></div></div>`;
};

/* ---------- GROUPS ---------- */
PAGES.groups=(app)=>{
  const byG={}; DB.teams.forEach(t=>{(byG[t.group_letter]=byG[t.group_letter]||[]).push(t);});
  app.innerHTML=`<h2 class="sec">Group stage</h2><div class="tgrid">`+Object.keys(byG).sort().map(g=>{
    const ms=DB.matches.filter(m=>m.match_label==='Group '+g);
    return `<div class="gcard"><div class="gh">Group ${g}</div>
      <table class="gtable"><thead><tr><th>Team</th><th>Conf</th><th>Rk</th></tr></thead><tbody>
      ${byG[g].map(t=>`<tr onclick="go('team/${t.fifa_code}')"><td>${flag(t.fifa_code)} ${esc(t.team_name)}</td><td class="faint">${t.confederation}</td><td class="mono">${t.fifa_ranking?'#'+t.fifa_ranking:''}</td></tr>`).join('')}</tbody></table>
      <div class="sublabel">${ms.length} fixtures</div></div>`;}).join('')+`</div>`;
};

/* ---------- BRACKET (connected tournament tree) ---------- */
// Official knockout tree (data's match #100 label has a W96->W100 typo; corrected here).
const BTREE={104:[101,102],101:[97,98],102:[99,100],97:[89,90],98:[93,94],99:[91,92],100:[95,96],
  89:[73,75],90:[74,77],91:[76,78],92:[79,80],93:[83,84],94:[81,82],95:[86,88],96:[85,87]};
const STAGE_R={'Round of 32':0,'Round of 16':1,'Quarterfinals':2,'Semifinals':3,'Final':4};
const groupColor=L=>`hsl(${(L.charCodeAt(0)-65)*30},44%,30%)`;
function decodeSlot(s){let m;s=(s||'').trim();
  if(m=s.match(/^W(\d+)$/))  return {code:'W'+m[1],label:'Winner · M'+m[1],color:'#26406b',feed:+m[1]};
  if(m=s.match(/^RU(\d+)$/)) return {code:'RU'+m[1],label:'Runner-up · M'+m[1],color:'#5a2740',feed:+m[1]};
  if(m=s.match(/^(\d)([A-L])$/)) return {code:m[2],label:(m[1]==='1'?'Winner Grp ':m[1]==='2'?'Runner-up Grp ':m[1]+'rd Grp ')+m[2],color:groupColor(m[2])};
  if(m=s.match(/^3([A-L]+)$/)) return {code:'3rd',label:'Best 3rd · '+m[1].split('').join('/'),color:'#3b3320'};
  return {code:'·',label:esc(s),color:'#2a3647'};
}
function brow(s){const d=decodeSlot(s);return `<div class="brow"><span class="bchip" style="background:${d.color}">${d.code}</span><span class="blabel">${d.label}</span></div>`;}
PAGES.bracket=(app)=>{
  const byNum={}; DB.matches.forEach(m=>byNum[m.match_number]=m);
  const roundOf=n=>{const m=byNum[n];return m?(STAGE_R[m.stage]||0):0;};
  const leaves=[]; (function dfs(n){const ch=BTREE[n];if(!ch){leaves.push(n);return;}ch.forEach(dfs);})(104);
  const Y={}; leaves.forEach((n,i)=>Y[n]=i);
  Object.keys(BTREE).map(Number).sort((a,b)=>roundOf(a)-roundOf(b))
    .forEach(n=>{const ch=BTREE[n];Y[n]=ch.reduce((s,c)=>s+Y[c],0)/ch.length;});
  const cardW=164,cardH=60,colGap=78,rowUnit=74,padT=44,headers=['Round of 32','Round of 16','Quarterfinals','Semifinals','Final'];
  const colX=r=>r*(cardW+colGap);
  const H=leaves.length*rowUnit+padT+18, W=colX(5)+186;
  const yc=n=>Y[n]*rowUnit+padT+cardH/2;
  let lines='';
  Object.entries(BTREE).forEach(([p,ch])=>{const px=colX(roundOf(+p)),pyc=yc(+p);
    ch.forEach(c=>{const cr=colX(roundOf(c))+cardW,cy=yc(c),mid=(cr+px)/2;
      lines+=`<path d="M${cr} ${cy} H${mid} V${pyc} H${px}" class="bcon"/>`;});});
  lines+=`<path d="M${colX(4)+cardW} ${yc(104)} H${colX(5)}" class="bcon win"/>`;
  const node=n=>{const m=byNum[n];if(!m)return'';const r=roundOf(n),[a,b]=(m.match_label||'').split(/\s+vs\s+/);
    return `<button class="bnode r${r}" style="left:${colX(r)}px;top:${Y[n]*rowUnit+padT}px;width:${cardW}px;height:${cardH}px" onclick="go('match/${n}')" aria-label="Match ${n}">
      ${brow(a)}<div class="bvs"><span>vs</span></div>${brow(b)}<div class="bnum">#${n} · ${esc((m.city||'').split('/')[0])}</div></button>`;};
  const heads=headers.map((h,r)=>`<div class="bhead" style="left:${colX(r)}px;width:${cardW}px">${h}</div>`).join('')
    +`<div class="bhead" style="left:${colX(5)}px;width:170px">Champion</div>`;
  const champ=`<div class="bchamp" style="left:${colX(5)}px;top:${Y[104]*rowUnit+padT-6}px"><div class="trophy">🏆</div><div class="ct">Champion 2026</div><div class="faint cs">Lifts the trophy<br>Jul 19 · New York</div></div>`;
  const tp=byNum[103];
  app.innerHTML=`<div class="brkhead"><h2 class="sec" style="margin:0">Road to the final</h2><span class="tag">48 → 1 · click any match for its head-to-head</span></div>
    <div class="bktwrap"><div class="bktree" style="width:${W}px;height:${H}px">
      <svg class="bcons" width="${W}" height="${H}" aria-hidden="true">${lines}</svg>
      ${heads}${[...leaves,...Object.keys(BTREE).map(Number)].map(node).join('')}${champ}</div></div>
    <div class="grid2">
      ${tp?`<div class="panel"><h3>🥉 Third-place playoff</h3><div class="brow">${brow((tp.match_label||'').split(/\s+vs\s+/)[0])}</div><div class="brow">${brow((tp.match_label||'').split(/\s+vs\s+/)[1])}</div><div class="faint" style="margin-top:8px">Match #103 · ${esc(tp.venue)}, ${esc(tp.city)}</div></div>`:''}
      <div class="panel"><h3>How to read the slots</h3><div class="kv">
        <span class="bchip" style="background:${groupColor('A')}">A</span><span>Group A winner / runner-up</span>
        <span class="bchip" style="background:#3b3320">3rd</span><span>One of the best third-placed teams</span>
        <span class="bchip" style="background:#26406b">W</span><span>Winner of an earlier match</span>
        <span class="bchip" style="background:#5a2740">RU</span><span>Runner-up (third-place playoff)</span></div>
        <div class="faint" style="margin-top:10px">Teams are filled in once the group stage and each knockout round finish.</div></div>
    </div>`;
};

/* ---------- MATCHES list + MATCH page ---------- */
let MFstage='';
PAGES.matches=(app)=>{
  const stages=[...new Set(DB.matches.map(m=>m.stage))];
  app.innerHTML=`<div class="panel"><div class="controls">
     <select id="ss"><option value="">All stages</option>${stages.map(s=>`<option ${MFstage===s?'selected':''}>${esc(s)}</option>`).join('')}</select><span class="count" id="mc"></span></div>
     <div class="tablewrap"><table><thead><tr><th>#</th><th>Kickoff</th><th>Stage</th><th>Match</th><th>Venue</th></tr></thead><tbody id="mb"></tbody></table></div></div>`;
  const draw=()=>{let r=[...DB.matches].sort((a,b)=>(a.kickoff_at||'').localeCompare(b.kickoff_at||''));
    if(MFstage)r=r.filter(m=>m.stage===MFstage);
    $('#mc').textContent=`${r.length} matches`;
    $('#mb').innerHTML=r.map(m=>`<tr onclick="go('match/${m.match_number}')"><td class="mono">${m.match_number}</td><td class="faint mono">${esc((m.kickoff_at||'').replace('T',' ').slice(0,16))}</td>
      <td>${esc(m.match_label)}</td><td>${m.home_code?`${flag(m.home_code)} ${esc(m.home_team)} <span class=faint>v</span> ${flag(m.away_code)} ${esc(m.away_team)}`:`<span class=faint>${esc(m.match_label)}</span>`}</td>
      <td class="faint">${esc(m.venue)}, ${esc((m.city||'').split('/')[0])}</td></tr>`).join('');};
  $('#ss').onchange=e=>{MFstage=e.target.value;draw();};draw();
};
PAGES.match=(app,n)=>{
  const m=DB.matches.find(x=>x.match_number==n); if(!m){app.innerHTML=`<div class="panel">Unknown match.</div>`;return;}
  const ht=m.home_code?IDX.teamByCode[m.home_code]:null, at=m.away_code?IDX.teamByCode[m.away_code]:null;
  let pitch='';
  if(ht&&at){
    const hsq=teamPlayers(ht.fifa_code), asq=teamPlayers(at.fifa_code);
    const hf=autoForm(hsq), af=autoForm(asq), hx=pickXI(hsq,hf), ax=pickXI(asq,af);
    const tk=(xi,form,bottom,col)=>xi.map((id,i)=>{const p=id?IDX.playerById[id]:null,[_,x,y]=FORMATIONS[form][i];
      const ty=bottom?50+(y/100)*47:50-(y/100)*47, tx=bottom?x:100-x;
      return `<div class="token sm" style="left:${tx}%;top:${ty}%" onclick="go('player/${id}')" title="${p?esc(p.player_name):''}"><div class="sh" style="background:${col}">${p?(p.shirt_number??''):''}</div><div class="nm">${p?esc(surname(p.player_name)):''}</div></div>`;}).join('');
    pitch=`<div class="panel"><h3>Projected head-to-head XIs <span class="tag">auto-picked — not official lineups</span></h3>
      <div class="mhead"><span>${flag(ht.fifa_code)} ${esc(ht.team_name)} <span class="faint">${hf}</span></span><span class="faint">vs</span><span><span class="faint">${af}</span> ${esc(at.team_name)} ${flag(at.fifa_code)}</span></div>
      <div class="pitch tall">${pitchSVG()}${tk(ax,af,false,'#ff8fb0')}${tk(hx,hf,true,'#5ce0a8')}</div></div>`;
  } else {
    pitch=`<div class="panel"><div class="faint">This is a knockout slot — teams are decided by earlier results (${esc(m.match_label)}).</div></div>`;
  }
  const cmp=(a,b)=>{if(!ht||!at)return '';const av=a(teamPlayers(ht.fifa_code)),bv=b?b(teamPlayers(at.fifa_code)):a(teamPlayers(at.fifa_code));return `<div class="vsrow"><span class="mono">${av}</span><span class="faint vk"></span><span class="mono">${bv}</span></div>`;};
  app.innerHTML=`${back()}
   <div class="matchhead"><div class="ms">${esc(m.stage)} · Match ${m.match_number}</div>
     <div class="mscore">${ht?`<span>${flag(ht.fifa_code)} ${esc(ht.team_name)}</span>`:`<span class="faint">${esc((m.match_label||'').split(' vs ')[0]||'')}</span>`}<span class="mv">vs</span>${at?`<span>${esc(at.team_name)} ${flag(at.fifa_code)}</span>`:`<span class="faint">${esc((m.match_label||'').split(' vs ')[1]||'')}</span>`}</div>
     <div class="faint">${esc((m.kickoff_at||'').replace('T',' '))} · ${esc(m.venue)}, ${esc(m.city)}, ${esc(m.country)}</div></div>
   ${ht&&at?`<div class="panel"><h3>Tale of the tape</h3>
     <div class="tape"><div><b>${flag(ht.fifa_code)} ${esc(ht.team_name)}</b><div class="faint">${esc(ht.head_coach)}</div></div><div class="faint"></div><div style="text-align:right"><b>${esc(at.team_name)} ${flag(at.fifa_code)}</b><div class="faint">${esc(at.head_coach)}</div></div></div>
     ${tapeRow('FIFA ranking',ht.fifa_ranking?'#'+ht.fifa_ranking:'—',at.fifa_ranking?'#'+at.fifa_ranking:'—')}
     ${tapeRow('Avg age',fmtAvg(ht),fmtAvg(at))}
     ${tapeRow('Total caps',num(sum(ht,'caps')),num(sum(at,'caps')))}
     ${tapeRow('Total intl goals',num(sum(ht,'international_goals')),num(sum(at,'international_goals')))}
     ${tapeRow('Squad value',money(sum(ht,'market_value_eur'))||'—',money(sum(at,'market_value_eur'))||'—')}</div>`:''}
   ${pitch}`;
};
const sum=(t,k)=>teamPlayers(t.fifa_code).reduce((s,p)=>s+(p[k]||0),0);
const fmtAvg=t=>{const a=avgAge(teamPlayers(t.fifa_code));return a?a.toFixed(1):'—';};
const tapeRow=(l,a,b)=>`<div class="taperow"><span class="mono">${a}</span><span class="tl">${l}</span><span class="mono">${b}</span></div>`;

/* ---------- MAP ---------- */
PAGES.map=(app)=>{
  const lats=Object.values(CITY_GEO).map(g=>g[0]), lons=Object.values(CITY_GEO).map(g=>g[1]);
  const minLa=Math.min(...lats)-2,maxLa=Math.max(...lats)+2,minLo=Math.min(...lons)-3,maxLo=Math.max(...lons)+3;
  const X=lo=>(lo-minLo)/(maxLo-minLo)*100, Y=la=>(1-(la-minLa)/(maxLa-minLa))*100;
  const mcount={}; DB.matches.forEach(m=>{if(m.city_id)mcount[m.city_id]=(mcount[m.city_id]||0)+1;});
  app.innerHTML=`<h2 class="sec">16 host cities</h2>
   <div class="grid2"><div class="panel"><h3>Venues across North America</h3>
     <div class="mapbox">${DB.cities.map(c=>{const g=CITY_GEO[c.id];if(!g)return'';
       const sz=8+(mcount[c.id]||0)*0.9;
       return `<div class="cdot2" style="left:${X(g[1])}%;top:${Y(g[0])}%;width:${sz}px;height:${sz}px" title="${esc(c.city_name)} — ${mcount[c.id]||0} matches"></div>
         <div class="clab" style="left:${X(g[1])}%;top:${Y(g[0])}%">${esc(c.city_name)}</div>`;}).join('')}</div>
     <div class="faint" style="margin-top:8px">Dot size = matches hosted. Approximate positions (no basemap).</div></div>
   <div class="panel"><h3>Cities</h3><table><thead><tr><th>City</th><th>Venue</th><th>Country</th><th>Matches</th></tr></thead><tbody>
     ${DB.cities.map(c=>`<tr><td>${esc(c.city_name)}</td><td class="faint">${esc(c.venue_name)}</td><td class="faint">${esc(c.country)}</td><td class="mono">${mcount[c.id]||0}</td></tr>`).join('')}</tbody></table></div></div>`;
};

/* ---------- COMPARE ---------- */
let CMP={mode:'team',a:'ARG',b:'FRA',pa:null,pb:null};
PAGES.compare=(app)=>{
  const teams=DB.teams.map(t=>t.fifa_code);
  if(CMP.mode==='player'){CMP.pa=CMP.pa||DB.players[0].player_id;CMP.pb=CMP.pb||DB.players[1].player_id;}
  app.innerHTML=`<div class="panel"><div class="controls">
     <div class="chips"><span class="chip ${CMP.mode==='team'?'on':''}" onclick="cmpMode('team')">Teams</span><span class="chip ${CMP.mode==='player'?'on':''}" onclick="cmpMode('player')">Players</span></div>
     ${CMP.mode==='team'
       ? `<select id="ca">${teams.map(c=>`<option ${CMP.a===c?'selected':''} value="${c}">${esc(IDX.teamByCode[c].team_name)}</option>`).join('')}</select>
          <span class="faint">vs</span><select id="cb">${teams.map(c=>`<option ${CMP.b===c?'selected':''} value="${c}">${esc(IDX.teamByCode[c].team_name)}</option>`).join('')}</select>`
       : `<select id="pa">${DB.players.map(p=>`<option ${CMP.pa==p.player_id?'selected':''} value="${p.player_id}">${esc(p.player_name)} (${p.fifa_code})</option>`).join('')}</select>
          <span class="faint">vs</span><select id="pb">${DB.players.map(p=>`<option ${CMP.pb==p.player_id?'selected':''} value="${p.player_id}">${esc(p.player_name)} (${p.fifa_code})</option>`).join('')}</select>`}
     </div><div id="cmpout"></div></div>`;
  if(CMP.mode==='team'){
    $('#ca').onchange=e=>{CMP.a=e.target.value;drawCompare();};
    $('#cb').onchange=e=>{CMP.b=e.target.value;drawCompare();};
  } else {
    $('#pa').onchange=e=>{CMP.pa=+e.target.value;drawCompare();};
    $('#pb').onchange=e=>{CMP.pb=+e.target.value;drawCompare();};
  }
  drawCompare();
};
window.cmpMode=m=>{CMP.mode=m;render();};
function drawCompare(){
  const out=$('#cmpout'); if(!out)return;
  if(CMP.mode==='team'){
    const A=teamPlayers(CMP.a),B=teamPlayers(CMP.b),ta=IDX.teamByCode[CMP.a],tb=IDX.teamByCode[CMP.b];
    const metrics=[
      ['Attack', t=>t.filter(p=>p.position==='FW').length],
      ['Midfield', t=>t.filter(p=>p.position==='MF').length],
      ['Defence', t=>t.filter(p=>p.position==='DF').length],
      ['Experience', t=>t.reduce((s,p)=>s+(p.caps||0),0)],
      ['Goal threat', t=>t.reduce((s,p)=>s+(p.international_goals||0),0)],
      ['Youth', t=>{const a=avgAge(t);return a?40-a:0;}],
    ];
    const labels=metrics.map(m=>m[0]);
    const va=metrics.map(m=>m[1](A)), vb=metrics.map(m=>m[1](B));
    const maxs=metrics.map((m,i)=>Math.max(va[i],vb[i])||1);
    out.innerHTML=`<div class="cmpwrap"><div>${radar(labels, va.map((v,i)=>v/maxs[i]), vb.map((v,i)=>v/maxs[i]), CONF[ta.confederation], CONF[tb.confederation])}</div>
      <div><div class="cmpleg"><span style="color:${CONF[ta.confederation]}">● ${flag(ta.fifa_code)} ${esc(ta.team_name)}</span><span style="color:${CONF[tb.confederation]}">● ${flag(tb.fifa_code)} ${esc(tb.team_name)}</span></div>
      ${metrics.map((m,i)=>`<div class="taperow"><span class="mono">${num(Math.round(va[i]))}</span><span class="tl">${m[0]}</span><span class="mono">${num(Math.round(vb[i]))}</span></div>`).join('')}
      <div class="taperow"><span class="mono">${fmtAvg(ta)}</span><span class="tl">Avg age</span><span class="mono">${fmtAvg(tb)}</span></div></div></div>`;
  } else {
    const a=IDX.playerById[CMP.pa],b=IDX.playerById[CMP.pb]; if(!a||!b){out.innerHTML='';return;}
    const metrics=[['Caps','caps'],['Intl goals','international_goals'],['Club apps','club_apps_2025_26'],['Club goals','club_goals_2025_26'],['Club assists','club_assists_2025_26'],['Minutes','club_minutes_2025_26']];
    const va=metrics.map(m=>a[m[1]]||0), vb=metrics.map(m=>b[m[1]]||0);
    const maxs=metrics.map((m,i)=>Math.max(va[i],vb[i])||1);
    out.innerHTML=`<div class="cmpwrap"><div>${radar(metrics.map(m=>m[0]), va.map((v,i)=>v/maxs[i]), vb.map((v,i)=>v/maxs[i]), POSC[a.position], POSC[b.position])}</div>
      <div><div class="cmpleg"><span style="color:${POSC[a.position]}">● ${esc(a.player_name)} ${flag(a.fifa_code)}</span><span style="color:${POSC[b.position]}">● ${esc(b.player_name)} ${flag(b.fifa_code)}</span></div>
      ${metrics.map((m,i)=>`<div class="taperow"><span class="mono">${num(va[i])}</span><span class="tl">${m[0]}</span><span class="mono">${num(vb[i])}</span></div>`).join('')}</div></div>`;
  }
}

/* ---------- INSIGHTS ---------- */
PAGES.insights=(app)=>{
  app.innerHTML=`<div class="grid2">
     <div class="panel"><h3>Players by position</h3><canvas id="i1" height="200"></canvas></div>
     <div class="panel"><h3>Players by confederation</h3><canvas id="i2" height="200"></canvas></div></div>
   <div class="grid2">
     <div class="panel"><h3>Age pyramid <span class="tag">squad ages</span></h3><div id="pyr"></div></div>
     <div class="panel"><h3>Most valuable players</h3><div id="val"></div></div></div>
   <div class="grid2">
     <div class="panel"><h3>Top leagues by players</h3><div id="lg"></div></div>
     <div class="panel"><h3>Diaspora — where players play <span class="tag">top club countries</span></h3><div id="dia"></div></div></div>`;
  drawDoughnut('i1', DB.agg.positions, k=>POSC[k]);
  drawDoughnut('i2', DB.agg.by_confederation, k=>CONF[k]);
  // pyramid
  const buckets={}; DB.players.forEach(p=>{if(Number.isFinite(p.age)){const b=Math.floor(p.age/2)*2;buckets[b]=(buckets[b]||0)+1;}});
  const keys=Object.keys(buckets).map(Number).sort((a,b)=>b-a);
  const mx=Math.max(...Object.values(buckets));
  $('#pyr').innerHTML=keys.map(k=>`<div class="barrow"><span class="mono">${k}-${k+1}</span><div class="bartrack"><div class="bar" style="width:${buckets[k]/mx*100}%"></div></div><span class="faint mono">${buckets[k]}</span></div>`).join('');
  // value
  const tv=[...DB.players].filter(p=>p.market_value_eur).sort((a,b)=>b.market_value_eur-a.market_value_eur).slice(0,12);
  $('#val').innerHTML=tv.map((p,i)=>`<div class="lead" onclick="go('player/${p.player_id}')"><span><span class="rk">${i+1}</span>${flag(p.fifa_code)} ${esc(p.player_name)} <span class="faint">${esc(p.club)}</span></span><b class="mono">${money(p.market_value_eur)}</b></div>`).join('')||'<div class="faint">No value data.</div>';
  // leagues
  const lg=DB.agg.by_league, lmax=Math.max(...Object.values(lg));
  $('#lg').innerHTML=Object.entries(lg).slice(0,12).map(([l,n])=>`<div class="barrow"><span>${esc(l)}</span><div class="bartrack"><div class="bar" style="width:${n/lmax*100}%"></div></div><span class="faint mono">${n}</span></div>`).join('');
  // diaspora
  const cc=DB.agg.by_club_country, cmax=Math.max(...Object.values(cc));
  $('#dia').innerHTML=Object.entries(cc).slice(0,12).map(([c,n])=>`<div class="barrow"><span>${esc(c)}</span><div class="bartrack"><div class="bar alt" style="width:${n/cmax*100}%"></div></div><span class="faint mono">${n}</span></div>`).join('');
};

/* ---------- DATA / transparency ---------- */
PAGES.data=(app)=>{
  const t=DB.totals, cov=DB.agg.coverage;
  app.innerHTML=`<div class="grid2">
   <div class="panel"><h3>Dataset</h3><div class="kv">
     <span class="k">Teams</span><span class="mono">${t.teams}</span>
     <span class="k">Players</span><span class="mono">${num(t.players)}</span>
     <span class="k">Clubs</span><span class="mono">${t.clubs}</span>
     <span class="k">Leagues</span><span class="mono">${t.leagues}</span>
     <span class="k">Matches</span><span class="mono">${t.matches}</span>
     <span class="k">Host cities</span><span class="mono">${t.host_cities}</span>
     <span class="k">Built</span><span>${esc(DB.generated_at)}</span></div>
     <div class="sublabel">Export</div>
     <button class="btn" onclick="exportCSV(DB.players,'wc2026_players.csv')">⬇ players.csv</button>
     <button class="btn" onclick="exportCSV(DB.teams,'wc2026_teams.csv')">⬇ teams.csv</button></div>
   <div class="panel"><h3>Field coverage <span class="tag">filled / ${num(t.players)} · null = not fabricated</span></h3>
     ${Object.entries(cov).map(([k,n])=>bar(k,n,t.players)).join('')}</div></div>
   <div class="panel"><h3>Methodology &amp; honesty notes</h3><ul class="meth">
     <li>Squads are the official 26-man lists (announced 2 June 2026). Playoff slots resolved from March 2026 results.</li>
     <li>Club-season stats are 2025/26, sourced per-player (Wikipedia/FBref/Transfermarkt). Unverified fields are left <b>null</b>, never guessed.</li>
     <li><b>Projected XIs are auto-generated</b> from a transparent score (club minutes/apps + caps + goals, captain weighted) — not official team sheets, which don't exist before kickoff.</li>
     <li>Win/draw/loss per player is essentially unpublished (≈0.3% coverage) and mostly null by design.</li>
     <li>Iran's shirt numbers were never published; Uzbekistan's were unverifiable — both left null.</li>
   </ul></div>`;
};

/* ===================================================================
   SHARED UI: charts, radar, bars, table utils, command palette
   =================================================================== */
let CHARTS=[];
function clearCharts(){CHARTS.forEach(c=>{try{c.destroy()}catch(e){}});CHARTS=[];}
function drawDoughnut(id,obj,colorFn){clearChartsFor(id);const c=$('#'+id);if(!c||!window.Chart)return;
  CHARTS.push(new Chart(c,{type:'doughnut',data:{labels:Object.keys(obj),datasets:[{data:Object.values(obj),backgroundColor:Object.keys(obj).map(colorFn),borderColor:getCss('--bg'),borderWidth:2}]},
    options:{plugins:{legend:{position:'right',labels:{color:getCss('--fg-dim'),boxWidth:12,padding:7,font:{size:11}}}},cutout:'60%'}}));}
function clearChartsFor(){ /* charts auto-replaced on full re-render; keep simple */ }
const getCss=v=>getComputedStyle(document.documentElement).getPropertyValue(v).trim()||'#888';
function bar(label,n,total){const p=total?Math.round(n/total*100):0;return `<div class="barrow"><span>${label}</span><div class="bartrack"><div class="bar" style="width:${p}%"></div></div><span class="faint mono">${p}%</span></div>`;}
function radar(labels,a,b,ca,cb){
  const N=labels.length,R=92,cx=120,cy=120;
  const pt=(i,v)=>{const ang=-Math.PI/2+i/N*2*Math.PI;return [cx+Math.cos(ang)*R*v, cy+Math.sin(ang)*R*v];};
  const poly=v=>v.map((x,i)=>pt(i,Math.max(0.04,x)).join(',')).join(' ');
  const rings=[0.25,0.5,0.75,1].map(r=>`<polygon points="${labels.map((_,i)=>pt(i,r).join(',')).join(' ')}" class="rring"/>`).join('');
  const axes=labels.map((l,i)=>{const[x,y]=pt(i,1.18);const[ax,ay]=pt(i,1);return `<line x1="${cx}" y1="${cy}" x2="${ax}" y2="${ay}" class="raxis"/><text x="${x}" y="${y}" class="rlab" text-anchor="middle">${esc(l)}</text>`;}).join('');
  return `<svg viewBox="0 0 240 240" class="radar">${rings}${axes}
    <polygon points="${poly(b)}" fill="${cb}" fill-opacity="0.18" stroke="${cb}" stroke-width="2"/>
    <polygon points="${poly(a)}" fill="${ca}" fill-opacity="0.22" stroke="${ca}" stroke-width="2"/></svg>`;
}
function cmp(k,dir){return (a,b)=>{let x=a[k],y=b[k];const nx=x==null,ny=y==null;if(nx&&ny)return 0;if(nx)return 1;if(ny)return -1;
  if(typeof x==='string'&&typeof y==='string')return dir*x.localeCompare(y);return dir*((x>y)-(x<y));};}
function markSort(sel,st){const tb=$(sel);if(!tb)return;const tbl=tb.closest('table');$$('th[data-k] .ar',tbl).forEach(a=>a.textContent='');const th=$(`th[data-k="${st.sort}"] .ar`,tbl);if(th)th.textContent=st.dir>0?' ▲':' ▼';}
function exportCSV(rows,name){
  if(!rows||!rows.length)return;
  const cols=Object.keys(rows[0]);
  const lines=[cols.join(',')].concat(rows.map(r=>cols.map(c=>{let v=r[c];if(v==null)v='';v=String(v);return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v;}).join(',')));
  const blob=new Blob([lines.join('\n')],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();
}

/* ---------- command palette ---------- */
let PAL=null;
function buildPalette(){
  PAL=[];
  DB.teams.forEach(t=>PAL.push({t:'Team',label:t.team_name,sub:'Group '+t.group_letter,k:flag(t.fifa_code),h:'team/'+t.fifa_code,s:(t.team_name+' '+t.fifa_code).toLowerCase()}));
  DB.players.forEach(p=>PAL.push({t:'Player',label:p.player_name,sub:p.fifa_code+' · '+p.club,k:'',h:'player/'+p.player_id,s:(p.player_name+' '+p.club).toLowerCase()}));
  const clubs=new Set(); DB.players.forEach(p=>p.club&&clubs.add(p.club));
  clubs.forEach(c=>PAL.push({t:'Club',label:c,sub:'',k:'',h:'club/'+slug(c),s:c.toLowerCase()}));
  DB.cities.forEach(c=>PAL.push({t:'City',label:c.city_name,sub:c.venue_name,k:'',h:'map',s:c.city_name.toLowerCase()}));
  ROUTES.forEach(([v,l])=>PAL.push({t:'Page',label:l,sub:'',k:'→',h:v,s:l.toLowerCase()}));
}
window.openPalette=()=>{
  $('#palette').classList.add('show'); const inp=$('#palq'); inp.value=''; palResults(''); inp.focus();
};
function closePalette(){$('#palette').classList.remove('show');}
function palResults(q){
  q=q.toLowerCase().trim();
  let r = q? PAL.filter(x=>x.s.includes(q)) : PAL.filter(x=>x.t==='Page'||x.t==='Team');
  r=r.slice(0,40);
  $('#palres').innerHTML=r.map((x,i)=>`<div class="palrow ${i===0?'sel':''}" data-h="${x.h}"><span class="palk">${x.k||x.t[0]}</span><span class="pall">${esc(x.label)}</span><span class="palsub faint">${esc(x.sub)}</span><span class="palt faint">${x.t}</span></div>`).join('')||'<div class="palrow faint">No matches.</div>';
}

/* ---------- theme ---------- */
function applyTheme(th){document.documentElement.dataset.theme=th;localStorage.setItem('wc-theme',th);$('#themeb').textContent=th==='light'?'🌙':'☀️';}
window.toggleTheme=()=>applyTheme((localStorage.getItem('wc-theme')||'dark')==='dark'?'light':'dark');

/* ===================================================================
   BOOT
   =================================================================== */
function chrome(){
  document.body.innerHTML=`
   <a href="#main" class="skip">Skip to content</a>
   <header class="topbar">
     <a class="brand" onclick="go('home')"><span class="ball"></span><span>WC<b>26</b> <span class="faint">Matchday</span></span></a>
     <nav id="nav" aria-label="Primary">${ROUTES.map(([v,l])=>`<a data-v="${v}" onclick="go('${v}')">${l}</a>`).join('')}</nav>
     <div class="actions"><button class="btn ghost kbtn" onclick="openPalette()" aria-label="Search">⌘K</button><button class="btn ghost" id="themeb" onclick="toggleTheme()" aria-label="Toggle theme">☀️</button></div>
   </header>
   <main id="main"><div id="app"></div></main>
   <div class="palette" id="palette" role="dialog" aria-modal="true">
     <div class="palbox"><input id="palq" placeholder="Search players, teams, clubs, cities…" aria-label="Search"/><div id="palres" class="palres"></div><div class="palfoot faint">↑↓ navigate · ↵ open · esc close</div></div>
   </div>
   <footer class="foot faint">FIFA World Cup 2026 data explorer · ${num(DB.totals.players)} players · built ${esc(DB.generated_at)} · projected lineups are estimates, not official.</footer>`;
  // palette interactions
  const inp=$('#palq');
  inp.addEventListener('input',e=>palResults(e.target.value));
  $('#palette').addEventListener('click',e=>{if(e.target.id==='palette')closePalette();});
  $('#palres').addEventListener('click',e=>{const r=e.target.closest('.palrow');if(r&&r.dataset.h){closePalette();go(r.dataset.h);}});
  inp.addEventListener('keydown',e=>{
    const rows=$$('#palres .palrow[data-h]');let si=rows.findIndex(r=>r.classList.contains('sel'));
    if(e.key==='ArrowDown'){e.preventDefault();if(si>=0)rows[si].classList.remove('sel');rows[Math.min(si+1,rows.length-1)]?.classList.add('sel');}
    else if(e.key==='ArrowUp'){e.preventDefault();if(si>=0)rows[si].classList.remove('sel');rows[Math.max(si-1,0)]?.classList.add('sel');}
    else if(e.key==='Enter'){const r=rows.find(r=>r.classList.contains('sel'))||rows[0];if(r){closePalette();go(r.dataset.h);}}
  });
  document.addEventListener('keydown',e=>{
    if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();openPalette();}
    if(e.key==='Escape')closePalette();
    if(e.key==='/'&&!/input|select|textarea/i.test(document.activeElement.tagName)){e.preventDefault();openPalette();}
  });
}
fetch((window.__BASE__||'')+'data.json?_='+Date.now()).then(r=>r.json()).then(d=>{
  DB=d; window.DB=d; buildIndexes(); buildPalette();
  chrome();
  applyTheme(localStorage.getItem('wc-theme')||'dark');
  if(!location.hash)location.hash='#/home';
  render();
}).catch(e=>{document.body.innerHTML=`<div style="padding:40px;font-family:sans-serif">Could not load data.json — run <code>build_data.py</code> and serve over http. ${esc(e.message)}</div>`;});
