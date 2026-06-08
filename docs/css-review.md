# CSS & UI Review — WC26 Matchday

> Audit of the **current** styling system. For the reference documentation
> (tokens, components, conventions) see [`css-architecture.md`](./css-architecture.md).
>
> **Scope reviewed:** `src/app/styles/app.css` (754 lines), `Base.astro`,
> `FutCard.astro`, `Flag.astro`, and class usage across all 16 routes in
> `src/pages/`.

---

## Verdict

The CSS is **visually coherent, well-crafted, and now structurally clean**. The
site renders as a polished, consistent "Blue Lock" electric-blue theme with
strong attention to detail (focus states, reduced-motion, sticky app-shell,
tabular data), and the maintainability problems flagged in the previous audit
have been **resolved**: the append-only stack of ~23 redesign layers and three
shadowed palettes was consolidated into **one palette, one clean pass**.

This is a healthy stylesheet. The findings below are minor polish items, not
structural debt.

---

## What was fixed since the last audit

The prior review (of the 1,874-line `global.css`) flagged append-only layering,
three shadowed `:root` palettes, a fully-neutralized v21 card, and 14
layer-fighting `!important`s. The current `app.css` has:

- **One `:root` palette** (down from three) + one light-theme override.
- **No dead/shadowed layers** — the v21 "Tactical" card and the Stadium-Electric
  palette are gone; the FUT card is a single clean definition.
- **`!important` down to 3**, all legitimate reduced-motion guards (no longer
  used to win layer fights).
- **14 navigable, top-to-bottom sections** instead of stacked redesign banners.

The recommended consolidation (old R1–R4) is effectively **done**.

---

## Strengths

1. **Token-driven theming.** Colors, fonts, shadows, radii, easing are custom
   properties; the light theme is a clean override on `[data-theme="light"]`.
2. **Disciplined inline styles.** Inline `style=` only passes dynamic values into
   custom properties (`--c`, `--ovr`, `--pc`, `--tc`) or computed geometry on
   data-viz pages — never one-off declarations. Verified across all 16 routes.
3. **No scoped-style sprawl.** Zero `<style>` blocks in any component or page.
4. **Accessibility care.** Skip link, visible cyan `:focus-visible` rings (incl.
   chips/tiles/bracket nodes/rows), keyboard-operable table rows, and a global
   reduced-motion guard plus component-level motion guards.
5. **Performance touches.** `content-visibility:auto` on table rows; lazy flag &
   face images; lazy `search.json` palette index; single shared bundle, HTTP-
   cached across routes.
6. **Modern CSS, used well.** `color-mix()`, `clip-path` chamfers, `mask`,
   `aspect-ratio`, `dvh`, conic/radial gradients, `backdrop-filter`, `:has()`
   (footer hidden on `.home`) — all leveraged tastefully.

---

## Findings (minor)

### F1 — "No !important" banner vs. 3 real uses · severity: trivial
`app.css` opens with `No !important`, but three remain (lines 88 and 622) in
reduced-motion guards. They are correct and idiomatic — but the banner overstates
it. Reword the banner to "no `!important` except reduced-motion guards."

### F2 — Tier classes that collapse to one value · severity: low
`.fut.gold`, `.fut.silver`, `.fut.bronze`, and `.fut.special` all resolve
`--edge` to `var(--accent2)` (cyan); only the rarer tiers (`legend`, `rising`,
`centurion`, `glove`, `marksman`, `maestro`, `icon`) get distinct hues. This is
intentional (a calm common card), but the four identical rules could be one
combined selector, and it's worth a comment so it doesn't read as a bug.

### F3 — Literal hex outside tokens · severity: low
Position pills (`.pill.GK/.DF/.MF/.FW`), the pitch turf greens, some FUT/scrim
rgba scrims, and the special-tier edges use literal hex/rgba rather than tokens.
Reasonable for one-off semantic colors, but the position palette and tier edges
are reused enough to deserve tokens (drift risk if the theme shifts).

### F4 — No breakpoint scale · severity: low
Eleven ad-hoc `max-width` values (`1180, 920, 900, 880, 860, 780, 760, 640, 620,
600, 460px`) with no shared scale. They work, but collapsing toward ~4 named
tokens (`--bp-sm/md/lg/xl`) would reduce drift as new pages are added.

### F5 — Landing section is dense · severity: low
§7 (LANDING) is ~270 lines — the largest section by far, with several multi-layer
gradient/`clip-path` backdrops and four glitch keyframe sets. It's correct and
self-contained, but it's the one area where a future reader will spend the most
time; the inline comments help, and keeping it isolated in §7 is the right call.

### F6 — `.fut` tier `gold/silver/bronze` naming vs. visuals · severity: trivial
The base tier names imply metallic FUT-style differentiation that the current
clean design intentionally doesn't render (all cyan-edged). Not a bug — just note
that "tier" now drives the *badge/label*, not the card chrome, for common tiers.

---

## Recommendations

Ordered by value-to-effort. All are optional polish — none are blocking.

1. **R1 — Reword the `No !important` banner** to acknowledge the reduced-motion
   guards (F1). One-line change; removes a small inaccuracy.
2. **R2 — Tokenize the reused literal palettes** — position colors (`.pill.*`)
   and special-tier `--edge` hues — into `:root` (F3). Lets a future re-skin move
   them in one place.
3. **R3 — Merge the identical tier rules** (`gold/silver/bronze/special` →
   one selector) with a comment explaining the calm-common-card intent (F2).
4. **R4 — Introduce a small breakpoint scale** (~4 named widths) and migrate
   queries opportunistically (F4).
5. **R5 — Adopt native `@layer`** *if* a future redesign is planned, so a re-skin
   overrides predictably without re-introducing append-only growth. Not needed
   for the current single-pass file — only as insurance against regression.

---

## Risk notes

- The stylesheet is now a **single ordered pass**, so edits are local and
  low-risk; there is no longer a hidden last-writer-wins cascade to defeat.
- Tokens `--can/--mex/--usa` (host tri-colour) feed the live dot and match
  scoreboard — keep them in sync if the palette changes.
- The landing hero (§7) and FUT card (§9) are the two highest-craft areas; verify
  them visually after any token change to `--accent`, `--accent2`, or `--spark`.
</content>
