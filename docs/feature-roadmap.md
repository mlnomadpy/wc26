# WC26 Matchday — Feature Audit & Creative Roadmap

> An audit of everything the app does today, then a brainstorm of features to make
> it **fun, social, story-driven and alive** — plus the kind of UI/UX craft you
> normally only get from a designer with "100 years of imagination."

---

## 0. The north star

Today the app is the **best-looking WC26 data explorer**. The next leap is to turn
it from a *thing you look at* into a *thing you play with, share, and come back to
every day* — a Blue Lock-flavoured matchday companion.

Three jobs to grow into:
- **Play** — give people a reason to interact (predict, build, guess, collect).
- **Belong** — let people pick a side and see themselves in it.
- **Return** — a daily hook + a live tournament that updates under them.

**The one hard constraint:** it's a static Astro site on GitHub Pages with a daily
cron rebuild. So everything personal/playful is **client-side (localStorage +
shareable URLs + generated OG images)**. Anything *shared/global* (leaderboards,
votes, comments) needs a thin serverless layer — see [§8](#8-technical-notes).

---

## 1. Feature audit — what we have

**Pages & data**
- Landing (cinematic hero, live kickoff countdown, "Last Dance" face-off, stat
  band, flag marquee, storylines/bento, explore strip, CTA).
- Teams directory (search, conf filter, sort by rank/rating/value/A–Z, Grid↔Groups
  view, multi-select → compare, star player + coach + value, cursor spotlight).
- Team dashboard (fits-in-view; electric pitch + formation switcher + XI strength
  readout; squad as HUD mini-cards w/ position filter; Profile tab).
- Players (ranked by data rating; search incl. tier; position/tier/conf/team
  filters; sortable columns; tier colours).
- Player dashboard (FUT card + Stats/Profile/Story tabs).
- Groups overview + **per-group projected standings** (xPts model, qualification
  outlook, fixtures).
- Bracket (animated energy connectors, champion pulse).
- Match dashboard (scoreboard, head-to-head pitch, **win-probability prediction**,
  tale-of-the-tape, key-man).
- Clubs, Map (living host-city map), Compare (radar, URL-param deep links),
  Insights (donuts/bars), Data & sources.
- ⌘K command palette (search), theme toggle, view transitions, OG image endpoints.

**Data we can build on (per player):** rating, market value, age, caps,
international goals, club season stats, **backstory + facts + "fun" lines**,
position, captain, height/foot. (Plus team rank, coach, group; match schedule.)

**Verdict:** strong "read" surface, rich data, zero "play/social/story" surface yet.
That's the whole opportunity.

---

## 2. PLAY — games & prediction (the engagement engine)

> The single biggest unlock. All static-friendly; results shareable as OG images.

1. **Footle — the daily player guess.** Wordle for WC26: guess the mystery player
   in 6 tries; each guess reveals match/▲/▼ on Nation, Position, Age, Club League,
   Caps, Rating. **Date-seeded** so everyone gets the same player each day → a
   shareable emoji grid ("Footle #12 4/6 🟩🟨⬛…"). *The daily return hook.*
2. **Bracket Predictor.** Click through the knockouts, picks saved to a compact
   URL hash (shareable) + localStorage. Then: "you have **France** lifting it,"
   render a **shareable bracket OG image**, and **"You vs the model"** — where your
   picks diverge from the projection. *(Group-stage predictor is the warm-up.)*
3. **Dream XI / Build-a-Squad.** A €budget (real market values), a formation pitch,
   and **chemistry links** (same club / same nation, FUT-style). Auto-rate the XI,
   share it as a pitch image. "Your XI rates 87 for €420m."
4. **WC26 HiLo (Higher/Lower).** Endless: *more caps? more goals? higher value?*
   Streak counter, personal best, juicy card-flip reveals. Stupidly addictive.
5. **Top Trumps / Card Battle.** Pick a stat on your FUT card, beat the deck. Single
   player vs the "house," or pass-and-play.
6. **Score predictor per match** that feeds the prediction model ("the crowd says
   2–1").
7. **Quiz / "Scouting exam."** Blue Lock framing: timed trivia from the dataset
   ("Who has more caps?"), ranks you Player → Striker → **Ego**.

**Why it works:** every one is a loop (guess → reveal → share → return) and every
one already has the data + the FUT-card art to make it gorgeous.

---

## 3. COLLECT — the sticker album

8. **Panini-style sticker album.** All 1,247 players as collectible stickers; track
   completion %; **open packs** with a holographic foil reveal animation (we already
   have the tilt/foil); "shinies" for Legends/special tiers; shareable "got 'em"
   moments. Pure dopamine, all localStorage. *This alone could carry the app.*
9. **Pack-opening as theatre.** The reveal: pack tears, cards fan out, a Legend
   triggers a screen-flash + sound. The most "alive" thing we could ship.

---

## 4. SHARE & SOCIAL

> Two tiers: *frictionless* (static) and *communal* (needs the serverless layer).

**Static / frictionless (do these first):**
- **Generated result cards** for everything (bracket, Dream XI, Footle score, a
  player "scout report") via the existing satori/resvg OG pipeline → **Web Share
  API** + one-tap to X / WhatsApp / Threads / Instagram-story-sized.
- **Deep-link everything** (compare links already do this) so any view is shareable.
- **"Player of the day" / "Match of the day"** auto-card people can share.

**Communal (needs a thin backend — Cloudflare Pages Functions + KV/D1):**
- **Crowd predictions & consensus** — "78% of fans back Brazil to top Group C,"
  live vote bars on every group/match.
- **Global Footle / HiLo leaderboards** + streaks.
- **Reactions / one-tap polls** on matches and storylines (😱🔥🐐).
- **"Pick'em" mini-leagues** — a shareable code, friends predict the bracket, a
  standings table. *This is the retention rocket.*

---

## 5. STORIES & NARRATIVE

> We already have a "Storylines" section and per-player `backstory`/`facts`. Turn
> data into *editorial*.

10. **Scrollytelling stories.** Full-bleed, scroll-driven data narratives:
    - *"The Last Dance"* — Messi vs Ronaldo, their final Cup, the numbers.
    - *"The 48-team revolution"* — how the format changed, who benefits.
    - *"Group of Death"* — compute & crown the hardest group automatically.
    - *"Kids vs Veterans," "The diaspora XI," "Most valuable XI," "Dark horses."*
    The pitch/radar/bar components we built become the scenes.
11. **Auto-generated "Scout Reports."** Per team: a written brief from the data
    (shape, key man, X-factor, weakness, projected finish). Shareable card.
12. **Rivalry pages** — auto H2H storyline for any two nations/players.
13. **"On this day / Road to the Cup"** — a countdown story that evolves daily
    (ties into the cron rebuild).

---

## 6. LIVE & ALIVE (liveliness)

14. **"Now / Next" matchday ticker** in the topbar — the live or next kickoff,
    always one tap away. (We have the countdown chip; make it a ticker.)
15. **Match-day Live mode** *(needs a score feed during the tournament)* — live
    scores, a **live win-probability** line that moves, goal flashes.
16. **Celebration moments** — crown a champion → **confetti + crowd-swell sound +
    haptics**; a Legend sticker → screen flash. Opt-in audio with a tasteful mute.
17. **Ambient day/night** — tint the app to the real kickoff time / host city.
18. **Signature "Flow State"** — a Blue Lock blue-fire transition when you enter a
    big match or crown a winner. Our visual identity, weaponised.

---

## 7. NEXT-LEVEL UX/UI (the 100-years-of-imagination craft)

- **Command palette → *actions*, not just nav.** "compare messi haaland," "predict
  my bracket," "surprise me" (random player), "show dark horses," "open a pack,"
  "/footle." The ⌘K becomes the app's superpower.
- **The Talent Galaxy.** A force-directed / orbital map of all 48 teams (or 1,247
  players) by strength & confederation — zoomable, gorgeous, a true "wow" landing
  for the data. (globe.gl / d3-force / three.js.)
- **Host-city globe.** The map page as a slow-rotating 3D globe with arcs between
  venues and pulsing match nodes.
- **Card flip.** FUT card flips to a stats "back" (radar + bio) — tactile, expected,
  delightful.
- **Magnetic / spotlight micro-interactions** on the hero CTAs and big cards.
- **Pick-your-nation onboarding → full personalization.** Choose your team once;
  the **accent colour becomes theirs**, the home page leads with *your* squad,
  *your* next match, *your* group race. Persisted, optional notifications.
- **Multiple "kits" (skins).** Blue Lock (default), "Broadcast" (clean TV-graphics),
  "Retro Panini," "Mono HUD." A theme gallery, not just dark/light.
- **Generative player art.** The AI anime-illustration idea (currently blocked on a
  Replicate token) — an on-brand portrait per star. Procedural crests for teams
  without one.
- **Scroll-driven & view-transition cinematics** — named shared-element transitions
  (a FUT card *morphs* from the list into the player page).
- **Sound design system** — a tiny, tasteful, opt-in set (whistle, ui ticks, crowd).
- **Easter eggs** — Konami code → "Ego" mode; hidden Blue Lock pentagon; a secret
  1.21-gigawatt button.
- **Accessibility as a feature** — high-contrast kit, dyslexia-friendly font toggle,
  "reduce data" mode; everything already keyboard- and reduced-motion-aware.

---

## 8. Technical notes (so the ambition stays shippable)

- **Static-only (no new infra):** Footle, Bracket Predictor, Dream XI, HiLo, Top
  Trumps, sticker album, scrollytelling, scout reports, personalization, skins,
  galaxy/globe, card flip, sound, share-via-OG. *Most of the list.*
- **Needs a thin serverless layer** (Cloudflare Pages Functions + KV/D1, or
  Supabase — both cheap, both sit happily next to the static deploy): global
  leaderboards, crowd votes/consensus, reactions, pick'em mini-leagues, comments,
  live scores (a feed). Recommend **Cloudflare Pages Functions + KV** — same domain,
  no CORS, generous free tier.
- **Generated share images:** reuse the satori → resvg pipeline already powering
  `/og/*`; add `/og/bracket`, `/og/xi`, `/og/footle`, `/og/scout`.
- **Daily seed (Footle/POTD):** derive from the date string so it's deterministic
  and works fully client-side; the cron rebuild can also bake "today's" content.

---

## 9. Roadmap — what to build, in order

**NOW — quick, static, high delight (days each):**
1. **Footle** (daily hook) + shareable grid.
2. **Pick-your-nation** theming + personalized home block.
3. **Champion-pick celebration** (confetti + opt-in sound) and **card flip**.
4. **Command-palette actions** (compare / surprise me / footle / open pack).

**NEXT — flagship static features (1–2 wks each):**
5. **Bracket Predictor** (URL-shareable + OG image + "you vs the model").
6. **Dream XI builder** (budget + chemistry + share).
7. **Sticker album + pack opening** (the collection loop).
8. **Scrollytelling storylines** (3–4 to start).

**WOW / big bets:**
9. **Talent Galaxy / host-city globe** (signature data viz).
10. **Community layer** (Cloudflare Pages Functions): consensus votes + global
    leaderboards + **pick'em mini-leagues** — the social/retention engine.
11. **Match-day Live mode** once a score feed is wired (tournament time).

**My pick for the first sprint:** **Footle + Pick-your-nation + Bracket Predictor.**
They hit *return*, *belong*, and *play/share* respectively, all static, all reusing
the components and art we already have.
</content>
