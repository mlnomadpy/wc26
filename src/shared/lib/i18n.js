/* Server-side i18n. UI strings + localized team names + the AI-explanation phrase
   packs. Hand-authored translations (higher SEO quality than machine output).
   English is the source of truth; missing keys fall back to English. */

export const LOCALES = ['en', 'es'];
export const LOCALE_NAME = { en: 'English', es: 'Español' };
export const LOCALE_LABEL = { en: 'EN', es: 'ES' };

const STR = {
  en: {
    'site.tagline': 'FIFA World Cup 2026',
    // nav
    'nav.home': 'Home', 'nav.footle': 'Footle', 'nav.teams': 'Teams', 'nav.players': 'Players',
    'nav.clubs': 'Clubs', 'nav.groups': 'Groups', 'nav.bracket': 'Bracket', 'nav.predictions': 'Predictions',
    'nav.matches': 'Matches', 'nav.map': 'Map', 'nav.compare': 'Compare', 'nav.insights': 'Insights', 'nav.data': 'Data',
    'a.search': 'Search', 'a.language': 'Language',
    // predictions page
    'pred.title': 'World Cup 2026 Predictions: {champ} to Win — AI Score for Every Match',
    'pred.desc': 'Our AI predicts {champ} to win the 2026 FIFA World Cup, beating {runner} {score} in the final. Full AI score predictions, group tables and win probabilities for all {n} group-stage matches — with a plain-English reason for every result.',
    'pred.eyebrow': 'AI predictions · who wins it all',
    'pred.h1': 'World Cup 2026 predictions',
    'pred.sub': 'An AI model predicts every group game, simulates the whole bracket, and crowns a champion — each call backed by a plain-English reason.',
    'pred.stat.predictions': 'Predictions', 'pred.stat.simulated': 'Simulated',
    'pred.champion': 'Predicted World Champion',
    'pred.beats': 'Beats {runner} {score} in the final · Jul 19, New York',
    'pred.semis': 'Predicted semi-finalists',
    'pred.intro': 'Below is an <b>AI score prediction for every group-stage match</b>, the <b>projected group tables</b> (points), and <b>win/draw/loss probabilities</b> — all from a model that scores each team’s attack against the other’s defence using squad ratings, 2025/26 club goals & assists and goalkeeping form. Tap any match for the full head-to-head. <a href="{bracket}">See the full knockout bracket →</a>',
    'pred.group': 'Group {g} predictions',
    'pred.th.pos': '#', 'pred.th.team': 'Team', 'pred.th.pld': 'Pld', 'pred.th.gd': 'GD', 'pred.th.pts': 'Pts',
    'pred.tablekey': 'Top 2 advance · 3rd may qualify as a best third',
    'pred.method': 'How it works: every squad is scored for attack and defence from its players — strength ratings, 2025/26 club goals and assists, international goals, goalkeeping and clean sheets — blended with FIFA-ranking pedigree. The model pits each team’s attack against the other’s defence for an expected-goals figure, takes the most-likely scoreline and win/draw/loss probabilities from a Poisson distribution, then simulates the group tables and the entire knockout bracket to a champion. It’s a model, not a crystal ball — upsets are the best part of the World Cup.',
    'faq.q.champion': 'Who will win the 2026 World Cup?',
    'faq.a.champion': 'Our AI model predicts {champ} to win the 2026 FIFA World Cup, beating {runner} {score} in the final. The predicted semi-finalists are {semis}.',
    'faq.q.match': '{a} vs {b} prediction',
    'faq.a.match': 'Predicted score: {a} {score} {b}. {why}',
  },
  es: {
    'site.tagline': 'Copa Mundial de la FIFA 2026',
    'nav.home': 'Inicio', 'nav.footle': 'Footle', 'nav.teams': 'Selecciones', 'nav.players': 'Jugadores',
    'nav.clubs': 'Clubes', 'nav.groups': 'Grupos', 'nav.bracket': 'Cuadro', 'nav.predictions': 'Predicciones',
    'nav.matches': 'Partidos', 'nav.map': 'Mapa', 'nav.compare': 'Comparar', 'nav.insights': 'Análisis', 'nav.data': 'Datos',
    'a.search': 'Buscar', 'a.language': 'Idioma',
    'pred.title': 'Predicciones Mundial 2026: {champ} Campeón — Pronóstico de Cada Partido',
    'pred.desc': 'Nuestra IA predice que {champ} ganará el Mundial 2026, venciendo a {runner} por {score} en la final. Pronósticos de marcador, tablas de grupos y probabilidades de victoria para los {n} partidos de la fase de grupos, con una explicación clara de cada resultado.',
    'pred.eyebrow': 'Predicciones IA · quién gana todo',
    'pred.h1': 'Predicciones del Mundial 2026',
    'pred.sub': 'Un modelo de IA predice cada partido de grupos, simula todo el cuadro y corona a un campeón — cada pronóstico con una explicación clara.',
    'pred.stat.predictions': 'Pronósticos', 'pred.stat.simulated': 'Simulado',
    'pred.champion': 'Campeón del Mundo Pronosticado',
    'pred.beats': 'Vence a {runner} por {score} en la final · 19 jul, Nueva York',
    'pred.semis': 'Semifinalistas pronosticados',
    'pred.intro': 'A continuación, un <b>pronóstico de marcador para cada partido de la fase de grupos</b>, las <b>tablas de grupos proyectadas</b> (puntos) y las <b>probabilidades de victoria/empate/derrota</b> — todo de un modelo que enfrenta el ataque de cada equipo contra la defensa del rival usando valoraciones de plantilla, goles y asistencias de club 2025/26 y forma de los porteros. Toca cualquier partido para el cara a cara. <a href="{bracket}">Ver el cuadro completo →</a>',
    'pred.group': 'Pronóstico del Grupo {g}',
    'pred.th.pos': '#', 'pred.th.team': 'Equipo', 'pred.th.pld': 'PJ', 'pred.th.gd': 'DG', 'pred.th.pts': 'Pts',
    'pred.tablekey': 'Los 2 primeros avanzan · el 3.º puede clasificar como mejor tercero',
    'pred.method': 'Cómo funciona: cada plantilla recibe una valoración de ataque y defensa a partir de sus jugadores — valoraciones de fuerza, goles y asistencias de club 2025/26, goles internacionales, porteros y porterías a cero — combinada con el prestigio del ranking FIFA. El modelo enfrenta el ataque de cada equipo contra la defensa del rival para una cifra de goles esperados, toma el marcador más probable y las probabilidades de victoria/empate/derrota de una distribución de Poisson, y luego simula las tablas de grupos y todo el cuadro eliminatorio hasta el campeón. Es un modelo, no una bola de cristal — las sorpresas son lo mejor del Mundial.',
    'faq.q.champion': '¿Quién ganará el Mundial 2026?',
    'faq.a.champion': 'Nuestro modelo de IA predice que {champ} ganará el Mundial 2026, venciendo a {runner} por {score} en la final. Los semifinalistas pronosticados son {semis}.',
    'faq.q.match': 'Pronóstico {a} vs {b}',
    'faq.a.match': 'Marcador pronosticado: {a} {score} {b}. {why}',
  },
};

// localized country/team names by fifa_code (only where they differ from English)
const TEAM = {
  es: {
    MEX: 'México', RSA: 'Sudáfrica', KOR: 'Corea del Sur', CZE: 'Chequia', CAN: 'Canadá',
    BIH: 'Bosnia y Herzegovina', QAT: 'Catar', SUI: 'Suiza', BRA: 'Brasil', MAR: 'Marruecos',
    HAI: 'Haití', SCO: 'Escocia', USA: 'Estados Unidos', AUS: 'Australia', TUR: 'Turquía',
    GER: 'Alemania', CUR: 'Curazao', CIV: 'Costa de Marfil', NED: 'Países Bajos', JPN: 'Japón',
    SWE: 'Suecia', TUN: 'Túnez', BEL: 'Bélgica', EGY: 'Egipto', IRN: 'Irán', NZL: 'Nueva Zelanda',
    ESP: 'España', KSA: 'Arabia Saudí', FRA: 'Francia', IRQ: 'Irak', NOR: 'Noruega', ALG: 'Argelia',
    JOR: 'Jordania', COD: 'RD Congo', UZB: 'Uzbekistán', ENG: 'Inglaterra', CRO: 'Croacia', PAN: 'Panamá',
  },
};

export function t(lang, key, vars) {
  let s = (STR[lang] && STR[lang][key]) ?? STR.en[key] ?? key;
  if (vars) for (const k in vars) s = String(s).split('{' + k + '}').join(vars[k]);
  return s;
}
export const teamName = (team, lang) =>
  (team && lang !== 'en' && TEAM[lang] && TEAM[lang][team.fifa_code]) || (team && team.team_name) || '';

// explanation phrase pack for the AI model (passed into wc.js explainMatch)
export function explainPack(lang) {
  if (lang === 'es') return {
    lineball: (a, b, h, d, x) => `${a} y ${b} están muy igualados — el modelo lo reparte ${h}/${d}/${x}%`,
    fav: (fav, att, verb, dog, def, p) => `el ataque de ${fav} (valorado en ${att}) ${verb} la defensa de ${dog} (${def}), así que el modelo lo hace ${p}% favorito`,
    classV: 'está en otra categoría frente a', edgeV: 'tiene una clara ventaja sobre', narrowV: 'supera por poco a',
    tailHigh: 'con goles probables en ambas porterías', tailLow: 'en lo que se perfila como un duelo cerrado y de pocos goles', tailMid: 'en un partido que debería seguir competido',
    projected: (ha, aa) => `Marcador previsto ${ha}–${aa}.`,
  };
  return null; // English default lives in wc.js
}
