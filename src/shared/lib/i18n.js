/* Server-side i18n. UI strings + localized team names + AI-explanation phrase
   packs, hand-authored (higher SEO quality than machine output). English is the
   source of truth; missing keys fall back to English. */

export const LOCALES = ['en', 'es', 'pt', 'fr', 'de', 'it'];
export const LOCALE_NAME = { en: 'English', es: 'Español', pt: 'Português', fr: 'Français', de: 'Deutsch', it: 'Italiano' };
export const LOCALE_LABEL = { en: 'EN', es: 'ES', pt: 'PT', fr: 'FR', de: 'DE', it: 'IT' };

const STR = {
  en: {
    'nav.home': 'Home', 'nav.footle': 'Footle', 'nav.teams': 'Teams', 'nav.players': 'Players', 'nav.clubs': 'Clubs', 'nav.groups': 'Groups', 'nav.bracket': 'Bracket', 'nav.predictions': 'Predictions', 'nav.matches': 'Matches', 'nav.map': 'Map', 'nav.compare': 'Compare', 'nav.insights': 'Insights', 'nav.data': 'Data',
    'a.language': 'Language',
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
    'faq.q.match': '{a} vs {b} prediction', 'faq.a.match': 'Predicted score: {a} {score} {b}. {why}',
  },
  es: {
    'nav.home': 'Inicio', 'nav.footle': 'Footle', 'nav.teams': 'Selecciones', 'nav.players': 'Jugadores', 'nav.clubs': 'Clubes', 'nav.groups': 'Grupos', 'nav.bracket': 'Cuadro', 'nav.predictions': 'Predicciones', 'nav.matches': 'Partidos', 'nav.map': 'Mapa', 'nav.compare': 'Comparar', 'nav.insights': 'Análisis', 'nav.data': 'Datos',
    'a.language': 'Idioma',
    'pred.title': 'Predicciones Mundial 2026: {champ} Campeón — Pronóstico de Cada Partido',
    'pred.desc': 'Nuestra IA predice que {champ} ganará el Mundial 2026, venciendo a {runner} por {score} en la final. Pronósticos de marcador, tablas de grupos y probabilidades para los {n} partidos de la fase de grupos, con una explicación clara de cada resultado.',
    'pred.eyebrow': 'Predicciones IA · quién gana todo', 'pred.h1': 'Predicciones del Mundial 2026',
    'pred.sub': 'Un modelo de IA predice cada partido de grupos, simula todo el cuadro y corona a un campeón — cada pronóstico con una explicación clara.',
    'pred.stat.predictions': 'Pronósticos', 'pred.stat.simulated': 'Simulado',
    'pred.champion': 'Campeón del Mundo Pronosticado', 'pred.beats': 'Vence a {runner} por {score} en la final · 19 jul, Nueva York', 'pred.semis': 'Semifinalistas pronosticados',
    'pred.intro': 'A continuación, un <b>pronóstico de marcador para cada partido de la fase de grupos</b>, las <b>tablas de grupos proyectadas</b> (puntos) y las <b>probabilidades de victoria/empate/derrota</b> — todo de un modelo que enfrenta el ataque de cada equipo contra la defensa del rival usando valoraciones de plantilla, goles y asistencias de club 2025/26 y forma de los porteros. Toca cualquier partido para el cara a cara. <a href="{bracket}">Ver el cuadro completo →</a>',
    'pred.group': 'Pronóstico del Grupo {g}',
    'pred.th.pos': '#', 'pred.th.team': 'Equipo', 'pred.th.pld': 'PJ', 'pred.th.gd': 'DG', 'pred.th.pts': 'Pts',
    'pred.tablekey': 'Los 2 primeros avanzan · el 3.º puede clasificar como mejor tercero',
    'pred.method': 'Cómo funciona: cada plantilla recibe una valoración de ataque y defensa a partir de sus jugadores — valoraciones de fuerza, goles y asistencias de club 2025/26, goles internacionales, porteros y porterías a cero — combinada con el prestigio del ranking FIFA. El modelo enfrenta el ataque de cada equipo contra la defensa del rival para una cifra de goles esperados, toma el marcador más probable y las probabilidades de una distribución de Poisson, y luego simula las tablas de grupos y todo el cuadro eliminatorio hasta el campeón. Es un modelo, no una bola de cristal — las sorpresas son lo mejor del Mundial.',
    'faq.q.champion': '¿Quién ganará el Mundial 2026?',
    'faq.a.champion': 'Nuestro modelo de IA predice que {champ} ganará el Mundial 2026, venciendo a {runner} por {score} en la final. Los semifinalistas pronosticados son {semis}.',
    'faq.q.match': 'Pronóstico {a} vs {b}', 'faq.a.match': 'Marcador pronosticado: {a} {score} {b}. {why}',
  },
  pt: {
    'nav.home': 'Início', 'nav.footle': 'Footle', 'nav.teams': 'Seleções', 'nav.players': 'Jogadores', 'nav.clubs': 'Clubes', 'nav.groups': 'Grupos', 'nav.bracket': 'Chaveamento', 'nav.predictions': 'Previsões', 'nav.matches': 'Jogos', 'nav.map': 'Mapa', 'nav.compare': 'Comparar', 'nav.insights': 'Análises', 'nav.data': 'Dados',
    'a.language': 'Idioma',
    'pred.title': 'Previsões Copa 2026: {champ} Campeã — Palpite de Cada Jogo',
    'pred.desc': 'Nossa IA prevê que {champ} vencerá a Copa do Mundo de 2026, batendo {runner} por {score} na final. Palpites de placar, tabelas de grupos e probabilidades para todos os {n} jogos da fase de grupos — com uma explicação clara de cada resultado.',
    'pred.eyebrow': 'Previsões IA · quem leva tudo', 'pred.h1': 'Previsões da Copa do Mundo 2026',
    'pred.sub': 'Um modelo de IA prevê cada jogo de grupo, simula todo o mata-mata e coroa um campeão — cada palpite com uma explicação clara.',
    'pred.stat.predictions': 'Palpites', 'pred.stat.simulated': 'Simulado',
    'pred.champion': 'Campeã Mundial Prevista', 'pred.beats': 'Bate {runner} por {score} na final · 19 jul, Nova York', 'pred.semis': 'Semifinalistas previstos',
    'pred.intro': 'Abaixo, um <b>palpite de placar para cada jogo da fase de grupos</b>, as <b>tabelas de grupos projetadas</b> (pontos) e as <b>probabilidades de vitória/empate/derrota</b> — tudo de um modelo que cruza o ataque de cada seleção com a defesa do rival usando avaliações de elenco, gols e assistências de clube 2025/26 e forma dos goleiros. Toque em qualquer jogo para o confronto direto. <a href="{bracket}">Ver o chaveamento completo →</a>',
    'pred.group': 'Previsões do Grupo {g}',
    'pred.th.pos': '#', 'pred.th.team': 'Seleção', 'pred.th.pld': 'J', 'pred.th.gd': 'SG', 'pred.th.pts': 'Pts',
    'pred.tablekey': 'Os 2 primeiros avançam · o 3.º pode se classificar como melhor terceiro',
    'pred.method': 'Como funciona: cada elenco recebe uma nota de ataque e defesa a partir de seus jogadores — avaliações de força, gols e assistências de clube 2025/26, gols internacionais, goleiros e jogos sem sofrer gols — combinada com o prestígio do ranking da FIFA. O modelo cruza o ataque de cada seleção com a defesa do rival para uma estimativa de gols, toma o placar mais provável e as probabilidades de uma distribuição de Poisson, e então simula as tabelas de grupos e todo o mata-mata até o campeão. É um modelo, não uma bola de cristal — as zebras são o melhor da Copa.',
    'faq.q.champion': 'Quem vai ganhar a Copa do Mundo de 2026?',
    'faq.a.champion': 'Nosso modelo de IA prevê que {champ} vencerá a Copa de 2026, batendo {runner} por {score} na final. Os semifinalistas previstos são {semis}.',
    'faq.q.match': 'Palpite {a} vs {b}', 'faq.a.match': 'Placar previsto: {a} {score} {b}. {why}',
  },
  fr: {
    'nav.home': 'Accueil', 'nav.footle': 'Footle', 'nav.teams': 'Équipes', 'nav.players': 'Joueurs', 'nav.clubs': 'Clubs', 'nav.groups': 'Groupes', 'nav.bracket': 'Tableau', 'nav.predictions': 'Pronostics', 'nav.matches': 'Matchs', 'nav.map': 'Carte', 'nav.compare': 'Comparer', 'nav.insights': 'Analyses', 'nav.data': 'Données',
    'a.language': 'Langue',
    'pred.title': 'Pronostics Coupe du Monde 2026 : {champ} Vainqueur — Score IA de Chaque Match',
    'pred.desc': 'Notre IA prédit que {champ} remportera la Coupe du Monde 2026, en battant {runner} {score} en finale. Pronostics de score, classements des groupes et probabilités pour les {n} matchs de la phase de groupes — avec une explication claire pour chaque résultat.',
    'pred.eyebrow': 'Pronostics IA · qui gagne tout', 'pred.h1': 'Pronostics Coupe du Monde 2026',
    'pred.sub': 'Un modèle d’IA prédit chaque match de groupe, simule tout le tableau et couronne un champion — chaque pronostic avec une explication claire.',
    'pred.stat.predictions': 'Pronostics', 'pred.stat.simulated': 'Simulé',
    'pred.champion': 'Champion du Monde Prédit', 'pred.beats': 'Bat {runner} {score} en finale · 19 juil., New York', 'pred.semis': 'Demi-finalistes prédits',
    'pred.intro': 'Voici un <b>pronostic de score pour chaque match de la phase de groupes</b>, les <b>classements de groupes projetés</b> (points) et les <b>probabilités victoire/nul/défaite</b> — le tout d’un modèle qui oppose l’attaque de chaque équipe à la défense adverse à partir des notes d’effectif, des buts et passes en club 2025/26 et de la forme des gardiens. Touchez un match pour le face-à-face. <a href="{bracket}">Voir le tableau complet →</a>',
    'pred.group': 'Pronostics du Groupe {g}',
    'pred.th.pos': '#', 'pred.th.team': 'Équipe', 'pred.th.pld': 'J', 'pred.th.gd': 'Diff', 'pred.th.pts': 'Pts',
    'pred.tablekey': 'Les 2 premiers se qualifient · le 3e peut passer comme meilleur troisième',
    'pred.method': 'Comment ça marche : chaque effectif reçoit une note d’attaque et de défense à partir de ses joueurs — notes de force, buts et passes en club 2025/26, buts internationaux, gardiens et clean sheets — combinées au prestige du classement FIFA. Le modèle oppose l’attaque de chaque équipe à la défense adverse pour un total de buts attendus, retient le score le plus probable et les probabilités d’une loi de Poisson, puis simule les classements de groupes et tout le tableau jusqu’au champion. C’est un modèle, pas une boule de cristal — les surprises font tout le sel de la Coupe.',
    'faq.q.champion': 'Qui va gagner la Coupe du Monde 2026 ?',
    'faq.a.champion': 'Notre modèle d’IA prédit que {champ} remportera la Coupe du Monde 2026, en battant {runner} {score} en finale. Les demi-finalistes prédits sont {semis}.',
    'faq.q.match': 'Pronostic {a} vs {b}', 'faq.a.match': 'Score prédit : {a} {score} {b}. {why}',
  },
  de: {
    'nav.home': 'Start', 'nav.footle': 'Footle', 'nav.teams': 'Teams', 'nav.players': 'Spieler', 'nav.clubs': 'Klubs', 'nav.groups': 'Gruppen', 'nav.bracket': 'K.-o.-Baum', 'nav.predictions': 'Prognosen', 'nav.matches': 'Spiele', 'nav.map': 'Karte', 'nav.compare': 'Vergleich', 'nav.insights': 'Analysen', 'nav.data': 'Daten',
    'a.language': 'Sprache',
    'pred.title': 'WM 2026 Prognosen: {champ} wird Weltmeister — KI-Tipp für jedes Spiel',
    'pred.desc': 'Unsere KI prognostiziert {champ} als Sieger der WM 2026, mit einem {score} gegen {runner} im Finale. Ergebnis-Tipps, Gruppentabellen und Wahrscheinlichkeiten für alle {n} Gruppenspiele — mit einer klaren Begründung für jedes Ergebnis.',
    'pred.eyebrow': 'KI-Prognosen · wer den Titel holt', 'pred.h1': 'WM 2026 Prognosen',
    'pred.sub': 'Ein KI-Modell tippt jedes Gruppenspiel, simuliert den ganzen K.-o.-Baum und kürt einen Weltmeister — jeder Tipp mit einer klaren Begründung.',
    'pred.stat.predictions': 'Tipps', 'pred.stat.simulated': 'Simuliert',
    'pred.champion': 'Prognostizierter Weltmeister', 'pred.beats': 'Schlägt {runner} {score} im Finale · 19. Juli, New York', 'pred.semis': 'Prognostizierte Halbfinalisten',
    'pred.intro': 'Unten ein <b>Ergebnis-Tipp für jedes Gruppenspiel</b>, die <b>projizierten Gruppentabellen</b> (Punkte) und die <b>Sieg/Unentschieden/Niederlage-Wahrscheinlichkeiten</b> — alles von einem Modell, das den Angriff jedes Teams gegen die Abwehr des Gegners stellt, anhand von Kaderbewertungen, Klub-Toren und -Vorlagen 2025/26 sowie Torwartform. Tippe auf ein Spiel für das Direktduell. <a href="{bracket}">Den kompletten K.-o.-Baum ansehen →</a>',
    'pred.group': 'Prognosen Gruppe {g}',
    'pred.th.pos': '#', 'pred.th.team': 'Team', 'pred.th.pld': 'Sp', 'pred.th.gd': 'TD', 'pred.th.pts': 'Pkt',
    'pred.tablekey': 'Top 2 weiter · der 3. kann als bester Gruppendritter weiterkommen',
    'pred.method': 'So funktioniert es: Jeder Kader erhält aus seinen Spielern einen Angriffs- und Abwehrwert — Stärkebewertungen, Klub-Tore und -Vorlagen 2025/26, Länderspieltore, Torhüter und Spiele ohne Gegentor — kombiniert mit dem Prestige der FIFA-Rangliste. Das Modell stellt den Angriff jedes Teams gegen die Abwehr des Gegners für einen Expected-Goals-Wert, nimmt das wahrscheinlichste Ergebnis und die Wahrscheinlichkeiten aus einer Poisson-Verteilung und simuliert dann die Gruppentabellen und den gesamten K.-o.-Baum bis zum Weltmeister. Es ist ein Modell, keine Glaskugel — Überraschungen sind das Beste an einer WM.',
    'faq.q.champion': 'Wer gewinnt die WM 2026?',
    'faq.a.champion': 'Unser KI-Modell prognostiziert {champ} als Sieger der WM 2026, mit einem {score} gegen {runner} im Finale. Die prognostizierten Halbfinalisten sind {semis}.',
    'faq.q.match': 'Prognose {a} vs {b}', 'faq.a.match': 'Tipp: {a} {score} {b}. {why}',
  },
  it: {
    'nav.home': 'Home', 'nav.footle': 'Footle', 'nav.teams': 'Nazionali', 'nav.players': 'Giocatori', 'nav.clubs': 'Club', 'nav.groups': 'Gironi', 'nav.bracket': 'Tabellone', 'nav.predictions': 'Pronostici', 'nav.matches': 'Partite', 'nav.map': 'Mappa', 'nav.compare': 'Confronta', 'nav.insights': 'Analisi', 'nav.data': 'Dati',
    'a.language': 'Lingua',
    'pred.title': 'Pronostici Mondiali 2026: {champ} Campione — Risultato IA di Ogni Partita',
    'pred.desc': 'La nostra IA prevede che {champ} vincerà i Mondiali 2026, battendo {runner} {score} in finale. Pronostici di risultato, classifiche dei gironi e probabilità per tutte le {n} partite della fase a gironi — con una spiegazione chiara per ogni risultato.',
    'pred.eyebrow': 'Pronostici IA · chi vince tutto', 'pred.h1': 'Pronostici Mondiali 2026',
    'pred.sub': 'Un modello di IA pronostica ogni partita dei gironi, simula tutto il tabellone e incorona un campione — ogni pronostico con una spiegazione chiara.',
    'pred.stat.predictions': 'Pronostici', 'pred.stat.simulated': 'Simulato',
    'pred.champion': 'Campione del Mondo Previsto', 'pred.beats': 'Batte {runner} {score} in finale · 19 lug, New York', 'pred.semis': 'Semifinaliste previste',
    'pred.intro': 'Di seguito un <b>pronostico di risultato per ogni partita dei gironi</b>, le <b>classifiche dei gironi previste</b> (punti) e le <b>probabilità di vittoria/pareggio/sconfitta</b> — tutto da un modello che oppone l’attacco di ogni squadra alla difesa avversaria usando le valutazioni della rosa, gol e assist di club 2025/26 e forma dei portieri. Tocca una partita per il confronto diretto. <a href="{bracket}">Vedi il tabellone completo →</a>',
    'pred.group': 'Pronostici Girone {g}',
    'pred.th.pos': '#', 'pred.th.team': 'Squadra', 'pred.th.pld': 'G', 'pred.th.gd': 'DR', 'pred.th.pts': 'Pti',
    'pred.tablekey': 'Le prime 2 avanzano · la 3ª può qualificarsi come migliore terza',
    'pred.method': 'Come funziona: ogni rosa riceve una valutazione di attacco e difesa dai suoi giocatori — valutazioni di forza, gol e assist di club 2025/26, gol internazionali, portieri e porte inviolate — combinata con il prestigio del ranking FIFA. Il modello oppone l’attacco di ogni squadra alla difesa avversaria per una stima di gol attesi, prende il risultato più probabile e le probabilità da una distribuzione di Poisson, poi simula le classifiche dei gironi e tutto il tabellone fino al campione. È un modello, non una sfera di cristallo — le sorprese sono il bello dei Mondiali.',
    'faq.q.champion': 'Chi vincerà i Mondiali 2026?',
    'faq.a.champion': 'Il nostro modello di IA prevede che {champ} vincerà i Mondiali 2026, battendo {runner} {score} in finale. Le semifinaliste previste sono {semis}.',
    'faq.q.match': 'Pronostico {a} vs {b}', 'faq.a.match': 'Risultato previsto: {a} {score} {b}. {why}',
  },
};

// localized country names by fifa_code (only where they differ from English)
const TEAM = {
  es: { MEX: 'México', RSA: 'Sudáfrica', KOR: 'Corea del Sur', CZE: 'Chequia', CAN: 'Canadá', BIH: 'Bosnia y Herzegovina', QAT: 'Catar', SUI: 'Suiza', BRA: 'Brasil', MAR: 'Marruecos', HAI: 'Haití', SCO: 'Escocia', USA: 'Estados Unidos', TUR: 'Turquía', GER: 'Alemania', CUR: 'Curazao', CIV: 'Costa de Marfil', NED: 'Países Bajos', JPN: 'Japón', SWE: 'Suecia', TUN: 'Túnez', BEL: 'Bélgica', EGY: 'Egipto', IRN: 'Irán', NZL: 'Nueva Zelanda', ESP: 'España', KSA: 'Arabia Saudí', FRA: 'Francia', IRQ: 'Irak', NOR: 'Noruega', ALG: 'Argelia', JOR: 'Jordania', COD: 'RD Congo', UZB: 'Uzbekistán', ENG: 'Inglaterra', CRO: 'Croacia', PAN: 'Panamá', AUS: 'Australia' },
  pt: { MEX: 'México', RSA: 'África do Sul', KOR: 'Coreia do Sul', CZE: 'Chéquia', CAN: 'Canadá', BIH: 'Bósnia e Herzegovina', QAT: 'Catar', SUI: 'Suíça', BRA: 'Brasil', MAR: 'Marrocos', SCO: 'Escócia', USA: 'Estados Unidos', AUS: 'Austrália', TUR: 'Turquia', GER: 'Alemanha', CIV: 'Costa do Marfim', ECU: 'Equador', NED: 'Países Baixos', JPN: 'Japão', SWE: 'Suécia', TUN: 'Tunísia', BEL: 'Bélgica', EGY: 'Egito', IRN: 'Irã', NZL: 'Nova Zelândia', ESP: 'Espanha', KSA: 'Arábia Saudita', URU: 'Uruguai', FRA: 'França', IRQ: 'Iraque', NOR: 'Noruega', ALG: 'Argélia', AUT: 'Áustria', JOR: 'Jordânia', COD: 'RD Congo', UZB: 'Uzbequistão', COL: 'Colômbia', ENG: 'Inglaterra', CRO: 'Croácia', GHA: 'Gana', PAN: 'Panamá' },
  fr: { MEX: 'Mexique', RSA: 'Afrique du Sud', KOR: 'Corée du Sud', CZE: 'Tchéquie', BIH: 'Bosnie-Herzégovine', SUI: 'Suisse', BRA: 'Brésil', MAR: 'Maroc', HAI: 'Haïti', SCO: 'Écosse', USA: 'États-Unis', AUS: 'Australie', TUR: 'Turquie', GER: 'Allemagne', CIV: 'Côte d’Ivoire', ECU: 'Équateur', NED: 'Pays-Bas', JPN: 'Japon', SWE: 'Suède', TUN: 'Tunisie', BEL: 'Belgique', EGY: 'Égypte', IRN: 'Iran', NZL: 'Nouvelle-Zélande', ESP: 'Espagne', CPV: 'Cap-Vert', KSA: 'Arabie saoudite', IRQ: 'Irak', NOR: 'Norvège', ARG: 'Argentine', ALG: 'Algérie', AUT: 'Autriche', JOR: 'Jordanie', COD: 'RD Congo', UZB: 'Ouzbékistan', COL: 'Colombie', ENG: 'Angleterre', CRO: 'Croatie' },
  de: { MEX: 'Mexiko', RSA: 'Südafrika', KOR: 'Südkorea', CZE: 'Tschechien', CAN: 'Kanada', BIH: 'Bosnien und Herzegowina', QAT: 'Katar', SUI: 'Schweiz', BRA: 'Brasilien', MAR: 'Marokko', SCO: 'Schottland', AUS: 'Australien', TUR: 'Türkei', GER: 'Deutschland', CIV: 'Elfenbeinküste', NED: 'Niederlande', SWE: 'Schweden', TUN: 'Tunesien', BEL: 'Belgien', EGY: 'Ägypten', NZL: 'Neuseeland', ESP: 'Spanien', CPV: 'Kap Verde', KSA: 'Saudi-Arabien', FRA: 'Frankreich', IRQ: 'Irak', NOR: 'Norwegen', ARG: 'Argentinien', ALG: 'Algerien', AUT: 'Österreich', JOR: 'Jordanien', COD: 'DR Kongo', UZB: 'Usbekistan', COL: 'Kolumbien', CRO: 'Kroatien' },
  it: { MEX: 'Messico', RSA: 'Sudafrica', KOR: 'Corea del Sud', CZE: 'Cechia', BIH: 'Bosnia ed Erzegovina', SUI: 'Svizzera', BRA: 'Brasile', MAR: 'Marocco', SCO: 'Scozia', USA: 'Stati Uniti', AUS: 'Australia', TUR: 'Turchia', GER: 'Germania', CIV: 'Costa d’Avorio', NED: 'Paesi Bassi', JPN: 'Giappone', SWE: 'Svezia', BEL: 'Belgio', EGY: 'Egitto', NZL: 'Nuova Zelanda', ESP: 'Spagna', CPV: 'Capo Verde', KSA: 'Arabia Saudita', FRA: 'Francia', NOR: 'Norvegia', ALG: 'Algeria', JOR: 'Giordania', COD: 'RD Congo', COL: 'Colombia', ENG: 'Inghilterra', CRO: 'Croazia', POR: 'Portogallo' },
};

export function t(lang, key, vars) {
  let s = (STR[lang] && STR[lang][key]) ?? STR.en[key] ?? key;
  if (vars) for (const k in vars) s = String(s).split('{' + k + '}').join(vars[k]);
  return s;
}
export const teamName = (team, lang) =>
  (team && lang !== 'en' && TEAM[lang] && TEAM[lang][team.fifa_code]) || (team && team.team_name) || '';

// AI-explanation phrase packs (passed into wc.js explainMatch; English lives in wc.js)
const PACKS = {
  es: { lineball: (a, b, h, d, x) => `${a} y ${b} están muy igualados — el modelo lo reparte ${h}/${d}/${x}%`, fav: (f, att, v, dog, def, p) => `el ataque de ${f} (valorado en ${att}) ${v} la defensa de ${dog} (${def}), así que el modelo lo hace ${p}% favorito`, classV: 'está en otra categoría frente a', edgeV: 'tiene una clara ventaja sobre', narrowV: 'supera por poco a', tailHigh: 'con goles probables en ambas porterías', tailLow: 'en lo que se perfila como un duelo cerrado y de pocos goles', tailMid: 'en un partido que debería seguir competido', projected: (h, a) => `Marcador previsto ${h}–${a}.` },
  pt: { lineball: (a, b, h, d, x) => `${a} e ${b} estão muito equilibrados — o modelo divide em ${h}/${d}/${x}%`, fav: (f, att, v, dog, def, p) => `o ataque da ${f} (avaliado em ${att}) ${v} a defesa da ${dog} (${def}), então o modelo a torna ${p}% favorita`, classV: 'está em outro nível em relação à', edgeV: 'tem clara vantagem sobre', narrowV: 'supera por pouco a', tailHigh: 'com gols prováveis dos dois lados', tailLow: 'no que se desenha como um jogo truncado e de poucos gols', tailMid: 'num jogo que deve seguir disputado', projected: (h, a) => `Placar previsto ${h}–${a}.` },
  fr: { lineball: (a, b, h, d, x) => `${a} et ${b} sont au coude-à-coude — le modèle répartit ${h}/${d}/${x}%`, fav: (f, att, v, dog, def, p) => `l’attaque de ${f} (notée ${att}) ${v} la défense de ${dog} (${def}), donc le modèle en fait le favori à ${p}%`, classV: 'est d’un tout autre calibre que', edgeV: 'a un net avantage sur', narrowV: 'devance de peu', tailHigh: 'avec des buts probables des deux côtés', tailLow: 'dans ce qui s’annonce comme un match fermé et peu prolifique', tailMid: 'dans un match qui devrait rester disputé', projected: (h, a) => `Score prévu ${h}–${a}.` },
  de: { lineball: (a, b, h, d, x) => `${a} und ${b} sind auf Augenhöhe — das Modell teilt es ${h}/${d}/${x}%`, fav: (f, att, v, dog, def, p) => `der Angriff von ${f} (Wert ${att}) ${v} die Abwehr von ${dog} (${def}), daher macht das Modell sie zum ${p}%-Favoriten`, classV: 'ist eine Klasse besser als', edgeV: 'hat einen klaren Vorteil gegenüber', narrowV: 'ist knapp stärker als', tailHigh: 'mit Toren auf beiden Seiten zu erwarten', tailLow: 'in einem voraussichtlich engen, torarmen Spiel', tailMid: 'in einem Spiel, das umkämpft bleiben dürfte', projected: (h, a) => `Tipp ${h}–${a}.` },
  it: { lineball: (a, b, h, d, x) => `${a} e ${b} sono in equilibrio — il modello le divide ${h}/${d}/${x}%`, fav: (f, att, v, dog, def, p) => `l’attacco di ${f} (valutato ${att}) ${v} la difesa di ${dog} (${def}), quindi il modello la rende favorita al ${p}%`, classV: 'è di un’altra categoria rispetto a', edgeV: 'ha un netto vantaggio su', narrowV: 'supera di poco', tailHigh: 'con gol probabili da entrambe le parti', tailLow: 'in quella che si profila come una sfida bloccata e con pochi gol', tailMid: 'in una gara che dovrebbe restare equilibrata', projected: (h, a) => `Risultato previsto ${h}–${a}.` },
};
export const explainPack = (lang) => PACKS[lang] || null;
