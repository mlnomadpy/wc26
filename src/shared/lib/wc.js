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
