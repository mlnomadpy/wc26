# CSS Architecture & Reference — WC26 Matchday

> Reference documentation for the styling system of the FIFA World Cup 2026 data
> explorer. For the audit/findings see [`css-review.md`](./css-review.md); for the
> overall code layout see [`feature-sliced-design.md`](./feature-sliced-design.md).

---

## 1. Overview

All styling lives in **one hand-authored stylesheet**:

```
src/app/styles/app.css        (~66 KB source · ~58 KB built, un-gzipped)
```

It is imported exactly once, at the top of the shared layout:

```astro
// src/app/layouts/Base.astro
import '../styles/app.css';
```

Every page renders inside `Base.astro`, so this one stylesheet covers the whole
site. There are **no scoped `<style>` blocks** in any `.astro` component or page
— styling is fully centralized. There is no preprocessor, PostCSS, Tailwind, or
CSS-in-JS.

### A single clean pass

`app.css` is **one palette, one cascade, no legacy/dead code**. It is organized
top-to-bottom into **14 numbered sections** (the banners are greppable):

```
 1  TOKENS            :root custom properties + light theme
 2  BASE / TYPE       reset, body background, headings, a11y, reduced-motion
 3  SHELL             topbar, nav, search/theme buttons, main scroll, footer, app-page
 4  CONTROLS          buttons, inputs, chips, subtabs, pills
 5  TABLES            data tables, sticky headers, zebra, .trow
 6  CARDS / PANELS    .panel, .gcard, .stat, .bar, flags, tier chips, .funbar
 7  LANDING           .home hero, countdown, "Last Dance" face-off, stats, bento
 8  DETAIL HEROES     .phead, .dhero (team), .phero (player)
 9  FUT CARDS         the collectible player card (.fut) + 3-D tilt/foil
10  PITCH             football pitch, player tokens, bench
11  BRACKET           tournament bracket (absolute nodes + SVG connectors)
12  MATCH             scoreboard, tale-of-the-tape bars, key-man duel
13  MAP / COMPARE     host-city map dots, SVG radar comparison
14  COMMAND PALETTE   ⌘K search modal
```

> History: this file began as an append-only stack of ~23 redesign layers
> (`src/styles/global.css`, ~1,874 lines, with three shadowed palettes). It was
> later **consolidated into the current single clean pass** — one palette, the
> dead/shadowed layers removed, `!important` reduced to a few legitimate
> accessibility guards. The earlier "modular partials" era is gone.

### Key conventions at a glance
| Concern | Approach |
|---|---|
| Theming / colors | CSS custom properties on `:root`, overridden by `html[data-theme="light"]` |
| Dynamic per-element values | Inline `style="--c:…"` passes values **into** the cascade (never raw one-off declarations) |
| Class naming | Short, flat, feature-prefixed (`.fut-*`, `.hh-*`, `.bl-*`, `.ms-*`, `.dh-*`) |
| Color mixing | `color-mix(in srgb, …)` used heavily for tints/alpha from tokens |
| Layout | CSS Grid + Flexbox; app-shell with a single internal scroll pane |
| Motion | `@keyframes` + transitions, globally gated by `prefers-reduced-motion` |

---

## 2. Design Language — "Blue Lock"

The active aesthetic is **Blue Lock**: electric blue + cyan energy on deep navy,
with a green *spark* accent used for headlines and labels. Restraint is the rule
— the energy lives in the **chrome** (frames, glows, HUD ticks, the hero), while
**data surfaces stay calm and readable**.

Signature traits:
- **Deep-navy gradient backdrop** with a faint cyan grid (set on `body`).
- **Cyan HUD accents:** diamond `▰` section markers (`h2.sec::before`), glowing
  underlines on nav and table headers, a cyan edge-bar on row/palette hover.
- **Energy hero** ("The Last Dance"): a Messi-vs-Ronaldo face-off card with a
  burning hexagonal **VS**, chamfered (`clip-path`) HUD frames, and a one-shot
  **glitch** animation on hover.
- **Chamfered tabs/tiles:** corners cut with `clip-path:polygon(...)` on the
  hero countdown, stat band, story tiles, and bento cards.
- **Tri-colour host accent:** `--can / --mex / --usa` (red / green / blue) for
  the live dot and match scoreboards.

> Design memory: the accepted look is Blue Lock electric-blue. Anton/Oswald-style
> condensed display faces were **rejected** — the display stack is Bricolage
> Grotesque / Saira Condensed / Barlow Condensed (see §2.3).

### 2.1 Color tokens (dark, default)

```css
:root{
  /* surfaces — deep navy, never pure black */
  --bg:#050a15; --bg1:#081326; --bg2:#0d1f3d; --bg3:#173867;
  --line:#14315d; --line2:#285496;
  /* text */
  --fg:#eaf1ff; --fg-dim:#9fb2d6; --fg-mute:#6f83ab;
  /* accents */
  --accent:#2e8cff;    /* electric blue — primary            */
  --accent2:#58ddff;   /* cyan — highlights, focus, HUD edges */
  --spark:#46e08a;     /* green — headlines / eyebrow labels  */
  --gold:#ffd23d; --magenta:#ff4d8d;
  --on-accent:#04122b; /* text on accent fills */
  /* host tri-colour (Canada / Mexico / USA) */
  --can:#ff5a4d; --mex:#46e08a; --usa:#5aa2ff;
}
```

The **light theme** is a clean token override on `html[data-theme="light"]`
(re-declares surfaces, text, accents, and the softer `--e2/--e3` shadows).

### 2.2 Effect tokens

```css
--r:10px; --r-sm:8px;                         /* radii */
--e1:…; --e2:…; --e3:…;                        /* layered elevation scale */
--glow:0 0 24px -8px color-mix(... accent2 ...); /* cyan accent glow */
--ease:cubic-bezier(.22,.61,.36,1); --t:.18s var(--ease); /* shared easing/duration */
```

### 2.3 Typography tokens

```css
--fdisp :'Bricolage Grotesque', system-ui, sans-serif;          /* display headings */
--fdisp2:'Saira Condensed', 'Bricolage Grotesque', system-ui;   /* condensed numbers, FUT cards, hero h1 */
--fbl   :'Barlow Condensed', 'Saira Condensed', system-ui;      /* "Last Dance" / countdown big numerals */
--ftech :'Chakra Petch', 'IBM Plex Mono', ui-monospace, mono;   /* HUD/tech eyebrows */
--fmono :'IBM Plex Mono', ui-monospace, monospace;              /* labels, data, table headers */
--fbody :'Plus Jakarta Sans', -apple-system, …;                 /* body text */
```

Six families are loaded from Google Fonts in `Base.astro`: **Bricolage
Grotesque, Saira Condensed, Barlow Condensed, Chakra Petch, Plus Jakarta Sans,
IBM Plex Mono**.

### 2.4 Theming model

```
html[data-theme="dark"]   → :root defaults (default)
html[data-theme="light"]  → re-declares surface/text/accent/shadow tokens
```

Toggled by `#themeb` in the topbar, persisted to `localStorage['wc-theme']`, and
applied by setting `data-theme` on `<html>` (inline script in `Base.astro`).

---

## 3. The Inline-Variable Pattern

Inline `style=` is used **only to feed dynamic values into CSS custom
properties** — never to write one-off property declarations. The global
stylesheet then consumes those variables, so all real styling stays in one place
while allowing per-element data binding.

```astro
<a class="fut gold" style={`--ovr:${r}`}>            <!-- FutCard.astro -->
<div class="dhero" style={`--c:${teamColor}`}>        <!-- team identity colour -->
<div class="poshead" style={`--pc:${posColor}`}>      <!-- position colour -->
<div class="token" style={`--tc:${jersey}`}>          <!-- jersey disc colour -->
```

| Var | Meaning | Consumed by |
|---|---|---|
| `--c`   | team/player identity colour | `.dhero .dh-num` |
| `--ovr` | player overall rating (data hook) | `.fut` |
| `--pc`  | position colour | `.poshead .pdot` |
| `--tc`  | team/jersey colour | `.token .sh` pitch discs |
| `--edge`| FUT card tier accent (set via tier class, not inline) | `.fut*` |

A few data-viz pages (`bracket`, `matches/[n]`, `map`, `compare`, `insights`)
also use inline `style=` for **computed geometry** — absolute `left/top`,
`width:%` bar fills, SVG positions — which is data, not styling.

---

## 4. Component / Class Catalogue

Grouped by the section that defines them. Names are short and flat.

### 4.1 App shell & chrome (§3)
| Class | Role |
|---|---|
| `.topbar` | sticky top bar; cyan hairline border + soft glow; blur+saturate |
| `.brand`, `.mark`, `.wm` | logo lockup (CSS-drawn ball mark + wordmark) |
| `#nav a`, `#nav a.on` | primary nav; uppercase mono, sliding cyan glow underline |
| `.navcd`, `.livedot` | live kickoff countdown chip (pulsing dot; `.live` state) |
| `.searchpill`, `.iconbtn` | ⌘K search trigger and theme toggle |
| `main`, `.foot` | single internal scroll pane + footer (footer hidden on `.home`) |
| `.skip` | skip-to-content a11y link |

**Shell model:** `body` is a `100dvh` flex column with `overflow:hidden`; `main`
is the only scrolling pane. List pages opt into `.app-page` / `.app-grow`
(`.scroll`) for a pinned header + internal-scroll body.

### 4.2 Controls (§4)
| Class | Role |
|---|---|
| `.btn`, `.btn.primary/.ghost/.back` | buttons; primary = blue→cyan gradient + glow |
| `input`, `select` | HUD form fields (cyan focus ring) |
| `.controls`, `.count` | filter bar + result count |
| `.chips`, `.chip`, `.chip.on` | toggle chips (gradient active) |
| `.subtabs`, `.subtab.on` | in-page tabs |
| `.pill.GK/.DF/.MF/.FW` | position badges (per-position colour) |

### 4.3 Tables (§5)
| Class | Role |
|---|---|
| `table`, `th`, `td` | base data table; sticky cyan mono-uppercase headers, zebra rows, cyan inset-bar on hover |
| `.tablewrap` | scroll/overflow wrapper |
| `.gtable` | compact group-standings table |
| `.trow` | flat list row (teams/groups) |
| `tr[role="link"]` | keyboard-operable clickable rows (wired in `Base.astro`) |

`content-visibility:auto` on `tbody tr` for long-list perf; tabular numerals
throughout.

### 4.4 Cards, panels & bits (§6)
| Class | Role |
|---|---|
| `.panel`, `.gcard`, `.gh` | bordered surfaces; cyan section headings |
| `.grid2`, `.statgrid`, `.kv` | two-column / stat / key-value grids |
| `.stat`, `.bar`/`.bar.alt`, `.barrow`/`.bartrack` | stat tiles + gradient bars |
| `.flagi` (`.sm/.lg/.xl`) | nation flag image (from `Flag.astro`) |
| `.tchip`, `.lbovr` | leaderboard tier chip + big rating |
| `.funbar`, `.funchip`, `.journey`, `.pfacts` | player fun-stats + narrative |
| `.reveal` (`.d1/.d2/.d3`) | staggered fade-up entrance |

### 4.5 Landing hero (§7)
| Class | Role |
|---|---|
| `.home`, `.home-hero` | full-bleed cinematic landing wrapper + hero |
| `.hh-bg`, `.hh-grad`, `.hh-inner`, `.hh-copy` | layered hero backdrop + 2-col grid |
| `.lh-eye` | `////` mono eyebrow (green spark) |
| `.hh-cd`, `.cd-clock`, `.cd-match` | chamfered kickoff countdown card |
| `.bl-faceoff`, `.bl-duel`, `.bl-player`, `.bl-name`, `.bl-vs`, `.bl-vs-svg` | "The Last Dance" Messi-vs-Ronaldo card + hex VS |
| `.home-stats` | 4-up stat band (chamfered, icon + big number) |
| `.marquee`, `.mtrack`, `.mflag` | scrolling flag marquee (pause on hover) |
| `.home-sec`, `.sec-head`, `.story-opener`, `.story-flags` | section + featured storyline |
| `.bento`, `.tile`, `.tile-face`, `.tile-pf` | bento grid of entry points |
| `.xstrip`, `.xrow` | "explore" link grid |
| `.home-cta`, `.hc-glow` | closing call-to-action |

**Landing FX** (a `7.x` sub-block) layers ambient + interactive energy on top:
a breathing hero energy-figure (`figurePulse`) and a slow cyan **scan sweep**
(`heroScan`); a rotating **border-beam** tracing the countdown/face-off/CTA
frames (`.cardbeam` / `.home-cta::after`, `beamSpin` via `@property --beam`); a
rotating **energy ring** behind the VS (`ringSpin`); an accent-word glow
(`accentGlow`); a seconds-digit `tickPulse`; and an **interactive cursor
spotlight** on the stat/bento/explore cards (`::after` radial at `--mx/--my`, fed
by a `pointermove` handler in `index.astro`). Hover glitch
(`cardglitch`/`sliceglitch`/`contentglitch`/`vsglitch`) and all of the above are
disabled under reduced-motion. Section reveals are **scroll-triggered**
(`.reveal` → `.in` via IntersectionObserver in `index.astro`), not fired on load.

### 4.6 Detail heroes (§8)
| Class | Role |
|---|---|
| `.phead`, `.pe`, `.psub`, `.pstat` | list-page header (eyebrow + title + right-aligned stats) |
| `.dhero`, `.dh-main`, `.dh-flag`, `.dh-num`, `.dh-stats`, `.thstat` | **team** detail hero (accent top hairline via `--c`) |
| `.phero`, `.phero-id`, `.phero-eye`, `.phero-stats`, `.pcols` | **player** detail hero + two-column stat board (embeds the `.fut.big` card) |

### 4.7 FUT / player card (§9 · `FutCard.astro`)
The collectible player card — a single clean photo-forward design.

| Class | Role |
|---|---|
| `.fut`, `.fut.big` | card root; `aspect-ratio:5/7`; `--edge` token drives the accent |
| `.fut-hero`, `.fut-img`, `.fut-mono` | photo zone (real photo → DiceBear avatar → monogram fallback) |
| `.fut-rail`, `.fut-ovr`, `.fut-rdiv` | top-left rating rail (OVR + position + flag + number + captain) |
| `.fut-badge` | special-tier tab (top-right) |
| `.fut-name`, `.fut-stats` | name band + 3-column stat grid |
| `.fut-sheen`, `.fut-glare` | holographic foil + cursor glare (JS-driven) |
| `.futgrid`, `.pgrid` | card grids |

**Tier classes** set `--edge`: `.gold .silver .bronze .special .legend .rising
.centurion .glove .marksman .maestro .icon`. (gold/silver/bronze share the cyan
edge; the special tiers each get a distinct hue.) Tier logic lives in
`src/shared/lib/wc.js` — `rating`, `tier`, `tierName`, `SPECIAL`, `monogram`.

**3-D tilt:** pointer-driven. `Base.astro` sets `--mx/--my/--rx/--ry` on
`.fut[data-tilt]`; CSS rotates the card and shimmers the sheen/glare. Gated by
`(hover:hover) and (pointer:fine)` and `prefers-reduced-motion`.

`.poshead` (position group heading, `--pc` dot) also lives here.

### 4.8 Pitch / lineup (§10)
| Class | Role |
|---|---|
| `.pitchwrap`, `.pitch`, `.pitch.tall` | viewport-capped football pitch (striped turf, CSS-drawn lines) |
| `.pitch .line/.ch/.cc/.box/.six` | pitch markings |
| `.token`, `.token .sh/.cap/.nm` | player discs (jersey colour `--tc`, captain glow) |
| `.benchlist`, `.pcard` | bench / substitute list |

### 4.9 Bracket · Match · Map · Compare (§11–13)
| Class | Role |
|---|---|
| `.bktree`, `.bnode` (`.r1–.r4`), `.bcons`/`.bcon`, `.bchamp` | tournament bracket (absolute nodes + SVG connectors) |
| `.mscore2`, `.ms-team`, `.ms-vs`, `.tot`, `.tot-bar`, `.duel`, `.duelman`, `.taperow` | match scoreboard, tale-of-the-tape bars, key-man duel |
| `.mapbox`, `.cdot2`, `.clab` | host-city map (positioned dots) |
| `.radar`, `.rring`, `.raxis`, `.cmpwrap` | SVG radar comparison |

### 4.10 Command palette (§14)
| Class | Role |
|---|---|
| `.palette`, `.palbox`, `.palrow`, `.palfoot` | ⌘K search modal (cyan-framed; lazy `search.json` index) |

---

## 5. Responsive & Motion

### Breakpoints
A handful of `max-width` queries (no central scale): `1180, 920, 900, 880, 860,
780, 760, 640, 620, 600, 460px`. Most collapse multi-column grids to one column
and shrink hero/card type; the energy hero recedes on narrow screens.

### Animations
Decorative keyframes — `pulse`, `marq`, `fadeUp`, `capglow`, the hero
`cardglitch/sliceglitch/contentglitch/vsglitch` — are **globally disabled** under
reduced motion:

```css
@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{ animation-duration:.01ms !important; transition-duration:.01ms !important; }
}
```
plus card-specific guards (`.fut` transforms off, sheen/glare hidden; hero glitch
off).

### Accessibility hooks
- `.skip` skip link; visible cyan `:focus-visible` outlines on all interactive
  elements (incl. `.chip`, `.tile`, `.bnode`, clickable rows).
- Touch-friendly targets (`#nav a` ≥46px, chips, rows).
- Clickable table rows get `role="link"` + keyboard handlers in `Base.astro`.
- `content-visibility:auto` on `tbody tr` for long-list perf.

---

## 6. File Map

Styling and components follow [Feature-Sliced Design](./feature-sliced-design.md):

```
src/
├─ app/
│  ├─ layouts/Base.astro    ← layout: <head>, fonts, topbar, footer, palette,
│  │                          theme toggle, ⌘K search, card-tilt JS, row a11y
│  └─ styles/app.css        ← the entire stylesheet (14 sections; imported once)
├─ entities/player/ui/
│  └─ FutCard.astro         ← collectible player card markup (.fut)
├─ shared/
│  ├─ ui/Flag.astro         ← <img class="flagi"> nation flag (or emoji fallback)
│  └─ lib/wc.js             ← data + domain helpers (rating/tier/indexes/…)
└─ pages/                   ← routes: consume classes only, no <style> blocks,
                              inline style only for --vars / computed geometry
```
</content>
