# WC26 Matchday — Documentation

Reference docs for the FIFA World Cup 2026 data explorer — a static
[Astro](https://astro.build/) site (1,247 players · 48 teams · 104 matches),
deployed to GitHub Pages at `https://www.tahabouhsine.com/wc26/`.

## Contents

| Doc | What it covers |
|---|---|
| [feature-sliced-design.md](./feature-sliced-design.md) | How `src/` is organized into FSD layers (app / pages / entities / shared), path aliases, and Astro adaptations. |
| [css-architecture.md](./css-architecture.md) | The styling system: the single `app.css`, design tokens, the Blue Lock design language, the inline-variable pattern, and the full class/component catalogue. |
| [css-review.md](./css-review.md) | Audit of the current CSS & UI — strengths, minor findings, and recommendations. |

## The app at a glance

- **Stack:** Astro static MPA, no UI framework, no preprocessor, no Tailwind. One
  hand-authored stylesheet. Build emits ~1,900 static pages + OG images.
- **Layout shell:** every page renders inside `src/app/layouts/Base.astro` — a
  fixed topbar/footer with a single internal scroll pane, a ⌘K command palette,
  a theme toggle, and a live kickoff countdown.
- **Aesthetic:** "Blue Lock" — electric blue + cyan on deep navy, with a green
  *spark* accent. Dark by default; a light theme is a token override.
- **Data:** all domain data and helpers live in one module,
  `src/shared/lib/wc.js`; built data is read from `public/data.json`.

## TL;DR for editing styles

All styling is in **one file: `src/app/styles/app.css`** — one palette, one
clean pass, organized into 14 numbered sections. There are **no `<style>`
blocks** in any component or page; styling is fully centralized.

- **Palette / theme** → §1 (`:root` tokens) + the `html[data-theme="light"]` block.
- **The landing hero** → §7 (`.home`, `.home-hero`, `.hh-*`, `.bl-faceoff`).
- **The player card** → §9 (`.fut*`).

Jump to the section banner you need (`grep -n '=====' app.css`).

## TL;DR for adding components

Place by FSD layer and import via aliases (`@app`, `@shared`, `@entities`,
`@widgets`, `@features`). Routes stay in `src/pages/`. See
[feature-sliced-design.md](./feature-sliced-design.md).
</content>
</invoke>
