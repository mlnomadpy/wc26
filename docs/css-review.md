# CSS Audit — collisions, dependencies & reuse

> Full audit of the stylesheet after the dashboard/redesign work. For the
> reference docs see [`css-architecture.md`](./css-architecture.md).
>
> **Scope:** the 15 ordered partials in `src/app/styles/sections/` (bundled by
> `app.css`) and class usage across all `src/pages/*.astro`.

---

## Verdict

The cascade is **clean**. There are **no harmful style collisions**: generic
class names are single-source, parameterised patterns are intentional, and the
one historical collision (a feature class clashing with the global `.home`
landing wrapper) was already fixed. This pass added a few **reuse primitives**
(tokens) for the patterns that recur, with no rendering change.

---

## 1. Dependency map (what each partial owns)

`app.css` `@import`s these **in order** — the order is load-bearing
(last-writer-wins). Everything downstream depends on the **tokens** in `01`.

```
01-tokens         :root design tokens + light theme        ← depended on by ALL
02-base           reset, body, type, a11y, reduced-motion, @view-transition
03-shell          topbar, nav, main scroll, footer, app-page
04-controls       .btn .chip .subtab input .pill            (uses 01)
05-tables         table, .tablewrap, .gtable, .trow         (uses 01)
06-cards          .panel .gcard .stat .bar flags tier-chips .teamdir  (uses 01)
07-landing        .home hero, countdown, faceoff, bento, marquee, cta
07b-landing-fx    landing ambient/interaction FX (beam/scan/spotlight/reveal)
08-detail-heroes  .phead, .dhero, .phero, group page, team+player dashboards (.tv2/.pv)
09-fut-cards      .fut collectible card + tilt/foil; sets perspective on .phero/.futgrid
10-pitch          .pitch electric turf, .token energy discs, .xistat, bench
11-bracket        .bktree nodes + animated SVG connectors, champion
12-match          .mscore2 scoreboard, prediction bar, .mv dashboard
13-map-compare    .mapbox living map, .radar comparison
14-palette        ⌘K search modal
```

Only **3 selectors appear in two files**, all intentional:
- `.brand .mark` — base size in `03`, mobile size override in `07`.
- `.home-cta` — layout in `07`, the rotating border-beam in `07b`.
- `.phero` — layout in `08`, 3-D `perspective` (for the embedded FUT card) in `09`.

---

## 2. Collision audit — clean

- **Generic class names are single-source.** `.mono .faint .tag .count .chip
  .panel .stat .bar .token` are each defined in exactly one partial.
- **`.on .win .big .w .s .nm .meta .sm .span` are always parent-scoped**
  (`.chip.on`, `.fut.big`, `.token .nm`, `.taperow .win`…), so there is no
  global clash between, say, a leaderboard `.win` and a bracket `.bcon.win`.
- **Historical bug (fixed):** the team-page fixtures used `class="fx-side home"`,
  which collided with the global `.home { display:flex; flex-direction:column }`
  landing wrapper and stacked the row vertically. Renamed to `.fx-home/.fx-away`.
- **Watch-outs going forward:** `.home`, `.on`, `.s`, `.k`, `.v`, `.w` are
  short/global enough that a new bare `.home`-style feature class could clash —
  always scope new short class names under a parent.

---

## 3. Duplication — parameterised, not copy-paste

The repetition that exists is **the same idea at different intensities**, which
is deliberate (a heavier card lifts more than a chip). Counts:

| Pattern | Occurrences | Variation |
|---|---|---|
| HUD border `color-mix(--accent2 N% , --line2)` | ~13 | N = 26–54% |
| Hover lift `:hover{ translateY(-Npx)…glow }` | 9 | N = 1–4px, ±`--e2/--e3` |
| Accent glow `0 0 Npx … var(--accent2)` | ~12 | N varies |
| Angled chamfer `clip-path:polygon(…)` | 9 | 2–3% edge, or 7–15px corner |

None of these are byte-identical *across files in a way that causes bugs* — the
two truly identical hover bodies (`.btn`/`.fxrow`, `.mflag`/`.duelman`) live in
different partials, so merging them would move them in the cascade; left as-is.

---

## 4. Reuse primitives added (this pass, no visual change)

Added to `01-tokens.css` and substituted into the exact-match call sites
(7 sites). CSS custom properties resolve at runtime to the same values, so the
render is identical — but the "HUD vocabulary" is now centralised:

```css
--hud-b:   color-mix(in srgb,var(--accent2) 30%,var(--line2));   /* standard HUD border */
--cut:     polygon(0 0,100% 0,100% 66%,calc(100% - 9px) 100%,0 100%); /* card chamfer */
--cut-edge:polygon(2% 0,100% 0,97% 100%,0 100%);                /* angled tile/stat chamfer */
--glow:    0 0 24px -8px color-mix(in srgb,var(--accent2) 75%,transparent); /* (existing) */
```

New components should prefer `border:1px solid var(--hud-b)`,
`clip-path:var(--cut)` / `var(--cut-edge)`, and `box-shadow:…,var(--glow)`
instead of re-deriving the values.

---

## 5. Consolidations applied

All four follow-ups are now done (verified: the bundle renders identically):

1. **Hover-lift unified** into one shared rule
   (`.spl,.xrow,…:hover{ transform:translateY(var(--lift)); … }`) with per-element
   `--lift` / `--lift-sh` vars that preserve each element's exact lift & shadow —
   8 rules → 1.
2. **HUD borders** → `--hud-b` (30%) and `--hud-b2` (46%) tokens, substituted at
   every exact call site.
3. **Chamfers** → `--cut` (card) and `--cut-edge` (tile/stat); the 2 / 2.5 / 3%
   variants now resolve through `--cut-edge`.
4. **Native `@layer`** — `app.css` declares `tokens < base < components <
   overrides` and imports each partial into its layer (`@import … layer(…)`).
   Section order is still load-bearing *within* `components`; the empty
   `overrides` layer is reserved for future last-word rules that win without
   `!important`. Verified across landing, dashboards, tables and match — no
   cascade shift.
</content>
