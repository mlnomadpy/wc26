/* Pure, dependency-free helpers + constants. Safe to import on server (Astro
   frontmatter) AND client (<script>) — contains NO data import, so it stays tiny. */

export const CONF = {UEFA:'#5aa2ff',CONMEBOL:'#3ddc97',CAF:'#ffb454',AFC:'#ff6b9d',CONCACAF:'#b48cff',OFC:'#5fd6ce',Unknown:'#6b7a90'};
export const POSC = {GK:'#ffcf5a',DF:'#7fb6ff',MF:'#5ce0a8',FW:'#ff8fb0'};
export const POSNAME = {GK:'Goalkeepers',DF:'Defenders',MF:'Midfielders',FW:'Forwards'};
export const FLAG = {MEX:'🇲🇽',RSA:'🇿🇦',KOR:'🇰🇷',CZE:'🇨🇿',CAN:'🇨🇦',BIH:'🇧🇦',QAT:'🇶🇦',SUI:'🇨🇭',BRA:'🇧🇷',MAR:'🇲🇦',HAI:'🇭🇹',SCO:'🏴󠁧󠁢󠁳󠁣󠁴󠁿',USA:'🇺🇸',PAR:'🇵🇾',AUS:'🇦🇺',TUR:'🇹🇷',GER:'🇩🇪',CUR:'🇨🇼',CIV:'🇨🇮',ECU:'🇪🇨',NED:'🇳🇱',JPN:'🇯🇵',SWE:'🇸🇪',TUN:'🇹🇳',BEL:'🇧🇪',EGY:'🇪🇬',IRN:'🇮🇷',NZL:'🇳🇿',ESP:'🇪🇸',CPV:'🇨🇻',KSA:'🇸🇦',URU:'🇺🇾',FRA:'🇫🇷',SEN:'🇸🇳',IRQ:'🇮🇶',NOR:'🇳🇴',ARG:'🇦🇷',ALG:'🇩🇿',AUT:'🇦🇹',JOR:'🇯🇴',POR:'🇵🇹',COD:'🇨🇩',UZB:'🇺🇿',COL:'🇨🇴',ENG:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',CRO:'🇭🇷',GHA:'🇬🇭',PAN:'🇵🇦'};
export const CITY_GEO = {1:[33.755,-84.401],2:[42.091,-71.264],3:[32.747,-97.093],4:[29.685,-95.411],5:[39.049,-94.484],6:[33.953,-118.339],7:[25.958,-80.239],8:[40.814,-74.074],9:[39.901,-75.168],10:[37.403,-121.970],11:[47.595,-122.332],12:[43.633,-79.418],13:[49.277,-123.112],14:[20.681,-103.462],15:[19.303,-99.150],16:[25.669,-100.244]};
export const FORMATIONS = {
 '4-3-3':[['GK',50,90],['DF',16,72],['DF',38,75],['DF',62,75],['DF',84,72],['MF',30,52],['MF',50,55],['MF',70,52],['FW',22,26],['FW',50,20],['FW',78,26]],
 '4-4-2':[['GK',50,90],['DF',16,72],['DF',38,75],['DF',62,75],['DF',84,72],['MF',16,50],['MF',39,52],['MF',61,52],['MF',84,50],['FW',36,24],['FW',64,24]],
 '4-2-3-1':[['GK',50,90],['DF',16,73],['DF',38,76],['DF',62,76],['DF',84,73],['MF',38,60],['MF',62,60],['MF',22,40],['MF',50,42],['MF',78,40],['FW',50,20]],
 '3-5-2':[['GK',50,90],['DF',28,74],['DF',50,77],['DF',72,74],['MF',12,54],['MF',34,52],['MF',50,57],['MF',66,52],['MF',88,54],['FW',38,26],['FW',62,26]],
 '3-4-3':[['GK',50,90],['DF',28,74],['DF',50,77],['DF',72,74],['MF',16,54],['MF',40,54],['MF',60,54],['MF',84,54],['FW',24,28],['FW',50,22],['FW',76,28]],
 '5-3-2':[['GK',50,90],['DF',12,70],['DF',31,76],['DF',50,79],['DF',69,76],['DF',88,70],['MF',30,52],['MF',50,55],['MF',70,52],['FW',38,28],['FW',62,28]],
};
export const FORMNAMES = Object.keys(FORMATIONS);
export const BTREE = {104:[101,102],101:[97,98],102:[99,100],97:[89,90],98:[93,94],99:[91,92],100:[95,96],
  89:[73,75],90:[74,77],91:[76,78],92:[79,80],93:[83,84],94:[81,82],95:[86,88],96:[85,87]};
export const STAGE_R = {'Round of 32':0,'Round of 16':1,'Quarterfinals':2,'Semifinals':3,'Final':4};

// FIFA code -> ISO 3166 (flagcdn) code, incl. UK subdivisions
export const FLAG_ISO = {MEX:'mx',RSA:'za',KOR:'kr',CZE:'cz',CAN:'ca',BIH:'ba',QAT:'qa',SUI:'ch',BRA:'br',MAR:'ma',HAI:'ht',SCO:'gb-sct',USA:'us',PAR:'py',AUS:'au',TUR:'tr',GER:'de',CUR:'cw',CIV:'ci',ECU:'ec',NED:'nl',JPN:'jp',SWE:'se',TUN:'tn',BEL:'be',EGY:'eg',IRN:'ir',NZL:'nz',ESP:'es',CPV:'cv',KSA:'sa',URU:'uy',FRA:'fr',SEN:'sn',IRQ:'iq',NOR:'no',ARG:'ar',ALG:'dz',AUT:'at',JOR:'jo',POR:'pt',COD:'cd',UZB:'uz',COL:'co',ENG:'gb-eng',CRO:'hr',GHA:'gh',PAN:'pa'};
export const flagImg = (code, w = 40) => FLAG_ISO[code] ? `https://flagcdn.com/w${w}/${FLAG_ISO[code]}.png` : '';

export const num = n => n==null||n===''?'':Number(n).toLocaleString('en-US');
export const money = v => v==null?'':v>=1e6?'€'+(v/1e6).toFixed(v>=1e7?0:1)+'M':v>=1e3?'€'+Math.round(v/1e3)+'K':'€'+v;
export const flag = c => FLAG[c]||'🏳️';
export const surname = n => {const w=(n||'').trim().split(/\s+/);return w.length>1?w[w.length-1]:(w[0]||'');};
export const slugify = s => String(s).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
export const groupColor = L => `hsl(${(L.charCodeAt(0)-65)*30},44%,30%)`;
// team strength rating derived from FIFA world ranking (#1≈95, decaying) — shared
// by the teams directory and group pages so a team rates the same everywhere.
export const teamRating = (rank) => rank ? Math.max(58, Math.min(95, Math.round(95 - 13 * Math.log10(rank)))) : null;

/* AI score model — Poisson expected-goals from the two team strength ratings
   (the same teamRating used across groups/bracket, so predictions stay consistent).
   Returns expected goals (la/lb), the most-likely exact scoreline (ha/aa), and
   win / draw / loss probabilities. Pure + deterministic. */
const _fact = n => { let f = 1; for (let i = 2; i <= n; i++) f *= i; return f; };
const _pois = (k, l) => Math.exp(-l) * Math.pow(l, k) / _fact(k);
export function predictMatch(teamA, teamB) {
  // attack/defence indexes (1.0 = field average), precomputed in build_data.py
  // from squad ratings + club goals/assists + GK/clean sheets + FIFA pedigree.
  // Fallback: a plain rating number -> rough index off a 50 floor / 77 average.
  const idx = (t, k) => typeof t === 'number' ? (t - 50) / 27 : (t?.[k] ?? (((t?.overall ?? 74) - 50) / 27));
  const aAtt = idx(teamA, 'attIdx'), aDef = idx(teamA, 'defIdx');
  const bAtt = idx(teamB, 'attIdx'), bDef = idx(teamB, 'defIdx');
  const BASE = 1.4, P = 1.6, CAP = 3.6;               // expected goals = each attack vs the other defence
  const clamp = x => Math.max(0.15, Math.min(CAP, x));
  const la = clamp(BASE * Math.pow(aAtt / bDef, P));
  const lb = clamp(BASE * Math.pow(bAtt / aDef, P));
  // full Poisson grid -> win/draw/loss + most-likely exact scoreline
  let pH = 0, pD = 0, pA = 0, best = { p: -1, i: 0, j: 0 };
  const grid = [];
  for (let i = 0; i <= 8; i++) for (let j = 0; j <= 8; j++) {
    const p = _pois(i, la) * _pois(j, lb);
    grid.push({ p, i, j });
    if (i > j) pH += p; else if (i === j) pD += p; else pA += p;
    if (p > best.p) best = { p, i, j };
  }
  let ha = best.i, aa = best.j;
  // break a predicted draw toward a clear favourite (keeps genuinely even games drawn)
  if (ha === aa) {
    if (pH - pA > 0.12) { let b = { p: -1, i: 1, j: 0 }; for (const g of grid) if (g.i > g.j && g.p > b.p) b = g; ha = b.i; aa = b.j; }
    else if (pA - pH > 0.12) { let b = { p: -1, i: 0, j: 1 }; for (const g of grid) if (g.j > g.i && g.p > b.p) b = g; ha = b.i; aa = b.j; }
  }
  const r = x => Math.round(x * 100);
  return { la, lb, ha, aa, xgA: +la.toFixed(1), xgB: +lb.toFixed(1),
           pH: r(pH), pD: r(pD), pA: r(pA), top: Math.max(r(pH), r(pD), r(pA)) };
}

export function strength(p){
  let s=0;
  if(Number.isFinite(p.club_minutes_2025_26)) s+=p.club_minutes_2025_26/90;
  else if(Number.isFinite(p.club_apps_2025_26)) s+=p.club_apps_2025_26;
  s+=(p.caps||0)*0.4 + (p.international_goals||0)*0.3;
  if(p.shirt_number) s+=Math.max(0,27-p.shirt_number)*0.25;
  if(p.is_captain) s+=1e6;
  return s;
}
export function autoForm(sq){
  const df=sq.filter(p=>p.position==='DF').length, fw=sq.filter(p=>p.position==='FW').length;
  if(df<=7) return '3-4-3'; if(fw>=8) return '4-3-3'; if(fw<=5) return '4-2-3-1'; return '4-3-3';
}
export function pickXI(sq,form){
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
export function decodeSlot(s){let m;s=(s||'').trim();
  if(m=s.match(/^W(\d+)$/))  return {code:'W'+m[1],label:'Winner · M'+m[1],color:'#26406b'};
  if(m=s.match(/^RU(\d+)$/)) return {code:'RU'+m[1],label:'Runner-up · M'+m[1],color:'#5a2740'};
  if(m=s.match(/^(\d)([A-L])$/)) return {code:m[2],label:(m[1]==='1'?'Winner Grp ':m[1]==='2'?'Runner-up Grp ':m[1]+'rd Grp ')+m[2],color:groupColor(m[2])};
  if(m=s.match(/^3([A-L]+)$/)) return {code:'3rd',label:'Best 3rd · '+m[1].split('').join('/'),color:'#3b3320'};
  return {code:'·',label:s,color:'#2a3647'};
}

/* Plain-English reasoning for a predicted scoreline — grounded in the model's
   own inputs (attack vs defence, win probability, projected goals). */
// opt.name(team)->localized name, opt.L = phrase pack (i18n.explainPack). English by default.
export function explainMatch(teamA, teamB, p, opt = {}) {
  const nm = opt.name || (x => x.team_name), L = opt.L || null;
  const fav = p.pH > p.pA ? teamA : p.pA > p.pH ? teamB : null;
  const dog = fav === teamA ? teamB : teamA;
  const aAtt = Math.round(teamA.attack || 0), aDef = Math.round(teamA.defense || 0);
  const bAtt = Math.round(teamB.attack || 0), bDef = Math.round(teamB.defense || 0);
  const goals = p.ha + p.aa;
  let lead;
  if (!fav) {
    lead = L ? L.lineball(nm(teamA), nm(teamB), p.pH, p.pD, p.pA)
             : `${nm(teamA)} and ${nm(teamB)} are line-ball — the model splits it ${p.pH}/${p.pD}/${p.pA}%`;
  } else {
    const fAtt = fav === teamA ? aAtt : bAtt, oDef = fav === teamA ? bDef : aDef;
    const fp = fav === teamA ? p.pH : p.pA, diff = fAtt - oDef;
    if (L) {
      lead = L.fav(nm(fav), fAtt, diff > 22 ? L.classV : diff > 8 ? L.edgeV : L.narrowV, nm(dog), oDef, fp);
    } else {
      const verb = diff > 22 ? 'is in a different class to' : diff > 8 ? 'has a clear edge over' : 'narrowly outguns';
      lead = `${nm(fav)}'s attack (rated ${fAtt}) ${verb} ${nm(dog)}'s defence (${oDef}), so the model makes them ${fp}% favourites`;
    }
  }
  const tail = L ? (goals >= 4 ? L.tailHigh : goals <= 1 ? L.tailLow : L.tailMid)
                 : (goals >= 4 ? 'with goals likely at both ends' : goals <= 1 ? 'in what shapes up as a cagey, low-scoring tie' : 'in a game that should stay competitive');
  const s = `${lead}, ${tail}. ${L ? L.projected(p.ha, p.aa) : `Projected ${p.ha}–${p.aa}.`}`;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* Full tournament simulation: predict every group game -> points/standings ->
   qualifiers (top 2 + best 8 thirds) -> seed the knockout via the real bracket
   slots -> simulate every tie -> predicted champion. Deterministic. */
export function simulateTournament(DB) {
  const T = {}; DB.teams.forEach(t => T[t.fifa_code] = t);
  const byNum = {}; DB.matches.forEach(m => byNum[m.match_number] = m);
  const roundOf = n => { const m = byNum[n]; return m ? (STAGE_R[m.stage] || 0) : 0; };
  const byGroup = {}; DB.teams.forEach(t => (byGroup[t.group_letter] = byGroup[t.group_letter] || []).push(t.fifa_code));
  const rec = {}; DB.teams.forEach(t => rec[t.fifa_code] = { code: t.fifa_code, name: t.team_name, g: t.group_letter, P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0 });
  DB.matches.filter(m => m.match_label && m.match_label.startsWith('Group') && m.home_code && m.away_code).forEach(m => {
    const p = predictMatch(T[m.home_code], T[m.away_code]);
    for (const [c, gf, ga] of [[m.home_code, p.ha, p.aa], [m.away_code, p.aa, p.ha]]) {
      const r = rec[c]; r.P++; r.GF += gf; r.GA += ga; r.GD = r.GF - r.GA;
      if (gf > ga) { r.W++; r.Pts += 3; } else if (gf === ga) { r.D++; r.Pts += 1; } else r.L++;
    }
  });
  const cmp = (a, b) => b.Pts - a.Pts || b.GD - a.GD || b.GF - a.GA || a.name.localeCompare(b.name);
  const standings = {}, rank = {};
  Object.entries(byGroup).forEach(([g, cs]) => {
    const rows = cs.map(c => rec[c]).sort(cmp); rows.forEach((r, i) => (r.rank = i + 1));
    standings[g] = rows; rank[g] = rows.map(r => r.code);
  });
  const thirds = Object.values(standings).map(r => r[2]).sort(cmp);
  const qual3 = new Set(thirds.slice(0, 8).map(r => r.code));
  const leaves = []; (function dfs(n) { const ch = BTREE[n]; if (!ch) { leaves.push(n); return; } ch.forEach(dfs); })(104);
  const leafTeams = {}; const slot3 = [];
  const non3 = s => { const m = (s || '').match(/^([12])([A-L])$/); return m ? (rank[m[2]] ? rank[m[2]][+m[1] - 1] : null) : undefined; };
  leaves.forEach(n => {
    const [a, b] = (byNum[n].match_label || '').split(/\s+vs\s+/);
    leafTeams[n] = { a: non3(a), b: non3(b) };
    [['a', a], ['b', b]].forEach(([side, code]) => { const mm = (code || '').match(/^3([A-L]+)$/); if (mm) slot3.push({ n, side, groups: mm[1].split('') }); });
  });
  const usedT = new Set();
  slot3.forEach(slot => {
    let pick = slot.groups.map(g => standings[g] && standings[g][2]).filter(r => r && qual3.has(r.code) && !usedT.has(r.code)).sort(cmp)[0];
    if (!pick) pick = thirds.filter(r => qual3.has(r.code) && !usedT.has(r.code)).sort(cmp)[0];
    if (pick) { usedT.add(pick.code); leafTeams[slot.n][slot.side] = pick.code; }
  });
  const koWin = (a, b) => {
    if (!a) return b; if (!b) return a;
    const p = predictMatch(T[a], T[b]);
    return (p.pH > p.pA || (p.pH === p.pA && (T[a].overall || 0) >= (T[b].overall || 0))) ? a : b;
  };
  const result = {};
  leaves.forEach(n => (result[n] = koWin(leafTeams[n].a, leafTeams[n].b)));
  Object.keys(BTREE).map(Number).sort((x, y) => roundOf(x) - roundOf(y)).forEach(n => { const [c1, c2] = BTREE[n]; result[n] = koWin(result[c1], result[c2]); });
  const champion = result[104];
  const finalists = [result[BTREE[104][0]], result[BTREE[104][1]]];
  const runnerUp = finalists.find(c => c !== champion);
  const semifinalists = BTREE[104].flatMap(sn => BTREE[sn].map(qn => result[qn]));
  return { standings, rank, qual3: [...qual3], leafTeams, result, champion, finalists, runnerUp, semifinalists };
}

/* indexes built from the (server-only) DB object */
export function indexes(DB){
  const teamByCode={}, teamById={}, playersByTeam={}, playersByClub={}, playerById={}, cityById={};
  DB.teams.forEach(t=>{teamByCode[t.fifa_code]=t;teamById[t.id]=t;playersByTeam[t.fifa_code]=[];});
  DB.cities.forEach(c=>cityById[c.id]=c);
  DB.players.forEach(p=>{
    playerById[p.player_id]=p;
    (playersByTeam[p.fifa_code]=playersByTeam[p.fifa_code]||[]).push(p);
    if(p.club)(playersByClub[p.club]=playersByClub[p.club]||[]).push(p);
  });
  return {teamByCode,teamById,playersByTeam,playersByClub,playerById,cityById};
}
export const avgAge = ps => {const a=ps.map(p=>p.age).filter(Number.isFinite);return a.length?(a.reduce((x,y)=>x+y,0)/a.length):null;};

/* All-time greats present at WC2026 -> special LEGEND cards */
export const LEGENDS = new Set(['Lionel Messi','Cristiano Ronaldo','Manuel Neuer','Luka Modrić','Ángel Di María']);
/* Curated overalls for well-known players so top cards read accurately
   (EA/FIFA ratings are licensed; these are hand-set approximations) */
export const OVR = {
  'Lionel Messi':90,'Cristiano Ronaldo':86,'Manuel Neuer':87,'Luka Modrić':85,'Ángel Di María':84,
  'Kylian Mbappé':91,'Erling Haaland':91,'Vinícius Júnior':90,'Jude Bellingham':90,'Kevin De Bruyne':88,
  'Rodri':90,'Harry Kane':90,'Mohamed Salah':89,'Heung-min Son':87,'Son Heung-min':87,'Lautaro Martínez':89,
  'Bruno Fernandes':86,'Bernardo Silva':87,'Federico Valverde':89,'Antoine Griezmann':87,'Bukayo Saka':87,
  'Phil Foden':88,'Pedri':88,'Florian Wirtz':88,'Jamal Musiala':88,'Alisson':89,'Thibaut Courtois':90,
  'Virgil van Dijk':89,'Joško Gvardiol':86,'Achraf Hakimi':85,'Declan Rice':87,'Nico Williams':84,
  'Rúben Dias':88,'Emiliano Martínez':86,'Lamine Yamal':84,'Endrick':75,'Julián Álvarez':87,
};
/* Curated detailed role for marquee players (the coarse position field is only
   GK/DF/MF/FW). Display-only — does not feed the rating engine. Spellings match
   the dataset. Falls back to the coarse position when a player isn't listed. */
export const POS_DETAIL = {
  // Goalkeepers
  'Alisson':'GK','Thibaut Courtois':'GK','Emiliano Martínez':'GK','Yassine Bounou':'GK','David Raya':'GK',
  'Jordan Pickford':'GK','Gianluigi Donnarumma':'GK','André Onana':'GK','Manuel Neuer':'GK','Diogo Costa':'GK',
  // Centre-backs
  'Virgil van Dijk':'CB','Rúben Dias':'CB','Marquinhos':'CB','William Saliba':'CB','Gabriel Magalhães':'CB',
  'Alessandro Bastoni':'CB','Antonio Rüdiger':'CB','Josko Gvardiol':'CB','Joško Gvardiol':'CB','Cristian Romero':'CB',
  // Full-backs / wing-backs
  'Achraf Hakimi':'RB','Trent Alexander-Arnold':'RB','Jules Koundé':'RB','Denzel Dumfries':'RWB','Dani Carvajal':'RB',
  'Theo Hernández':'LB','Alphonso Davies':'LB','Álex Grimaldo':'LB','Andrew Robertson':'LB','Nuno Mendes':'LB','Jesús Gallardo':'LB',
  // Defensive / central midfield
  'Rodri':'CDM','Declan Rice':'CDM','Aurélien Tchouaméni':'CDM','Casemiro':'CDM','Moisés Caicedo':'CDM','Joshua Kimmich':'CDM',
  'Federico Valverde':'CM','Pedri':'CM','Frenkie de Jong':'CM','Luka Modrić':'CM','Scott McTominay':'CM','Weston McKennie':'CM',
  'Franck Kessié':'CM','John McGinn':'CM','Konrad Laimer':'CM',
  // Attacking midfield
  'Jude Bellingham':'CAM','Kevin De Bruyne':'CAM','Florian Wirtz':'CAM','Jamal Musiala':'CAM','Bruno Fernandes':'CAM',
  'Martin Ødegaard':'CAM','Giorgian de Arrascaeta':'CAM','Ismael Saibari':'CAM',
  // Wingers
  'Bukayo Saka':'RW','Lamine Yamal':'RW','Bernardo Silva':'RW','Mohamed Salah':'RW','Phil Foden':'RW','Leroy Sané':'RW',
  'Vinícius Júnior':'LW','Rafael Leão':'LW','Nico Williams':'LW','Heung-min Son':'LW','Son Heung-min':'LW','Neymar':'LW','Jérémy Doku':'LW',
  // Forwards
  'Erling Haaland':'ST','Harry Kane':'ST','Lautaro Martínez':'ST','Julián Álvarez':'ST','Victor Osimhen':'ST',
  'Randal Kolo Muani':'ST','Dušan Vlahović':'ST','Viktor Gyökeres':'ST','Darwin Núñez':'ST','Ivan Toney':'ST',
  'Endrick':'ST','Mehdi Taremi':'ST','Ayoub El Kaabi':'ST','Dominic Solanke':'ST',
  // Roaming / second strikers & wide forwards
  'Kylian Mbappé':'ST','Antoine Griezmann':'SS','Lionel Messi':'RW','Cristiano Ronaldo':'ST','João Félix':'SS',
};
export const POSD_NAME = {GK:'Goalkeeper',CB:'Centre-back',RB:'Right-back',LB:'Left-back',RWB:'Right wing-back',LWB:'Left wing-back',CDM:'Defensive mid',CM:'Central mid',CAM:'Attacking mid',RW:'Right wing',LW:'Left wing',ST:'Striker',SS:'Second striker',CF:'Centre-forward'};
export const posDetail = p => POS_DETAIL[p && p.player_name] || null;

export function rating(p){
  if (p.data_rating != null) return p.data_rating;   // population-ranked rating from build_data.py
  if (OVR[p.player_name] != null) return OVR[p.player_name];
  const mv = p.market_value_eur || 0;
  let r = mv
    ? 74 + Math.log10(mv/1e6 + 1) * 11
    : 67 + (p.caps||0)*0.05 + (p.international_goals||0)*0.22 + (p.club_goals_2025_26||0)*0.3 + (p.club_apps_2025_26||0)*0.06;
  r += Math.min(8, (p.international_goals||0)/20);
  if (p.is_captain) r += 1.5;
  return Math.max(58, Math.min(99, Math.round(r)));
}
/* Special FRAMES are EARNED by hitting real stat thresholds (priority order).
   Otherwise the card falls back to gold/silver/bronze by rating. */
export function tier(p){
  const r = rating(p), age = p.age || 99, pos = p.position;
  const g = p.international_goals||0, caps = p.caps||0;
  const cg = p.club_goals_2025_26||0, ca = p.club_assists_2025_26||0, cs = p.club_clean_sheets_2025_26||0;
  if (LEGENDS.has(p.player_name)) return 'legend';          // curated all-time greats
  if (r >= 91) return 'special';                            // superstar (top of the data ranking)
  if (caps >= 100) return 'centurion';                      // 100+ international caps
  if (pos === 'GK' && cs >= 12) return 'glove';             // 12+ clean sheets (GK)
  if (g >= 40 || cg >= 25) return 'marksman';               // prolific scorer
  if (ca >= 12) return 'maestro';                           // 12+ assists (playmaker)
  if (age <= 19 || (age <= 21 && r >= 80)) return 'rising'; // wonderkid
  return r >= 81 ? 'gold' : r >= 71 ? 'silver' : 'bronze';
}
export const SPECIAL = new Set(['legend','special','centurion','glove','marksman','maestro','rising']);
export const tierName = t => ({legend:'Legend',special:'Superstar',centurion:'Centurion',glove:'Golden Glove',marksman:'Marksman',maestro:'Maestro',rising:'Rising ★',gold:'Gold',silver:'Silver',bronze:'Bronze'}[t]||'');
export function monogram(n){const w=(n||'').trim().split(/\s+/);return ((w[0]?.[0]||'')+(w.length>1?w[w.length-1][0]:'')).toUpperCase();}
