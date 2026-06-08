# Feature-Sliced Design (FSD) Structure

This project is organized with [Feature-Sliced Design](https://feature-sliced.design/),
adapted to Astro's constraints. FSD organizes code into **layers** with a strict
dependency rule: a layer may only import from layers **below** it.

## Layers

```
app       →  highest: global setup, layout, global styles
pages     →  route compositions (Astro routes — must live in src/pages/)
widgets   →  large self-contained UI blocks (composed from features/entities)
features  →  user-facing interactions
entities  →  business entities (player, team, match, …)
shared    →  lowest: reusable UI kit, libs, config — depends on nothing
```

**Dependency rule:** `app → pages → widgets → features → entities → shared`.
Imports only ever point *downward*. (e.g. an entity may use `shared`, but `shared`
must never import an entity.)

## Directory map

```
src/
├─ app/
│  ├─ layouts/
│  │  └─ Base.astro            # HTML shell: <head>, fonts, topbar, footer,
│  │                           #   command palette, theme toggle, card-tilt JS
│  └─ styles/
│     └─ app.css               # the whole stylesheet — one clean pass
│
├─ pages/                      # Astro file-based routes (unchanged location).
│  ├─ index.astro              # Thin route entries that import from the layers
│  ├─ teams/[code].astro       #   below via @-aliases. No <style> blocks.
│  ├─ players/[id].astro
│  ├─ og/{match,team}/*.png.ts # build-time OG image endpoints
│  └─ …
│
├─ widgets/                    # (reserved) large composed blocks — see "Notes"
├─ features/                   # (reserved) interactions — see "Notes"
│
├─ entities/
│  └─ player/
│     └─ ui/
│        └─ FutCard.astro      # the collectible player card
│
└─ shared/
   ├─ ui/
   │  └─ Flag.astro            # nation flag <img>
   └─ lib/
      ├─ wc.js                 # data access + domain helpers (indexes, rating,
      │                        #   tier, formations, formatters, geo, bracket…)
      └─ og/
         ├─ render.js          # satori → resvg PNG renderer
         └─ fonts/*.ttf        # fonts read at build time by render.js
```

## Path aliases

Imports use layer aliases instead of fragile `../../..` paths. Defined in **two
places that must stay in sync**:

- `tsconfig.json` → `compilerOptions.paths` (editor + type resolution)
- `astro.config.mjs` → `vite.resolve.alias` (build + dev resolution, incl. client `<script>`s)

| Alias | Resolves to |
|---|---|
| `@app/*` | `src/app/*` |
| `@pages/*` | `src/pages/*` |
| `@widgets/*` | `src/widgets/*` |
| `@features/*` | `src/features/*` |
| `@entities/*` | `src/entities/*` |
| `@shared/*` | `src/shared/*` |

Example (from `src/pages/players/[id].astro`):
```astro
import Base from '@app/layouts/Base.astro';
import Flag from '@shared/ui/Flag.astro';
import FutCard from '@entities/player/ui/FutCard.astro';
import { indexes, slugify, POSC } from '@shared/lib/wc.js';
```

## Astro-specific adaptations

- **Routes stay in `src/pages/`.** Astro's file-based router requires it, so
  `pages` cannot physically move under an FSD folder. They act as the FSD *pages*
  layer: thin compositions that pull widgets/entities/shared and add no styling
  of their own (styling is global, in `app`).
- **Global styles live in `app`.** Because the stylesheet is one cascade-ordered
  whole (see the CSS docs), it stays global under `app/styles` rather than being
  scattered as per-slice styles — splitting it per slice would break the
  load-bearing override order.
- **OG fonts are read cwd-relative** at build time (`src/shared/lib/og/fonts`),
  since `render.js` is bundled into a chunk and can't rely on `import.meta.url`.

## Notes & future work

- `widgets/` and `features/` exist as **reserved, empty** layers. The current
  interactive features (theme toggle, ⌘K command palette, holographic card tilt,
  keyboard table rows) are still implemented as inline scripts inside
  `app/layouts/Base.astro`. Extracting each into `features/<name>/` (and large
  blocks like the topbar / landing hero / bracket / pitch into `widgets/`) is the
  natural next FSD step but was deferred to keep this migration low-risk.
- `shared/lib/wc.js` is intentionally the single shared data+helpers module. It
  could later be decomposed into `entities/*/model` (e.g. player/team/match) and
  `shared/lib` formatters, but it is widely imported and was kept whole here.

## Verification

The production build is green: ~1,900 pages build cleanly, all OG PNGs render,
and the dev server serves all routes 200. The whole stylesheet is the single
`app/styles/app.css` (~58 KB built); see [`css-architecture.md`](./css-architecture.md).
</content>
