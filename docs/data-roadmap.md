# Data-quality roadmap — WC26 Matchday

Goal: raise the quality and depth of the underlying data so the platform's
features (ratings, viz, games, stories) rest on fuller, richer inputs.

## Pipeline recap (where data lives)

```
.context/squads_enriched/<CODE>.json   ← per-team enriched player records (source of truth for players)
data/fifa-world-cup-2026/*.csv         ← teams.csv, players.csv, host_cities.csv, matches.csv, tournament_stages.csv
  dashboard/build_dataset.py           ← assembles enriched JSON → players.csv (+ sqlite)
  dashboard/build_data.py              ← CSVs → public/data.json (+ search.json); computes ratings, fun stats, aggs
public/data.json                       ← what the site reads
```

Rule of the pipeline: **add a column to the CSV and `build_data.py` passes it
through automatically** (it iterates `players[0].keys()`). New INT fields must be
added to `INT_FIELDS` in `build_data.py` to be coerced to numbers.

## Coverage baseline (of 1,247 players) — captured 2026-06-08

- 90–100%: identity, age, caps, intl goals, position, club, league, club_country, club_apps, club_goals, backstory, facts, data_rating
- 50–73%: form_note 73, foot 63, assists 59, career goals 55 / apps 50
- <40%: **market_value 31**, minutes 38, cards 22–34, starts 21, **clean_sheets 9, goals_conceded 6**, team W/D/L 0
- photos: **299 / 1,247 (24%)** face images exist
- structural: position only GK/DF/MF/FW; matches have **no scores**; team/stadium/history minimal

---

## TRACK 1 — Quick wins (small-N, sourceable now: 48 teams + 16 cities)

Tiny row counts → fast, low-risk, each unlocks a visible feature.

### 1A. Team metadata → new `data/fifa-world-cup-2026/team_meta.csv` (keyed by fifa_code)
Columns: `fifa_code, color_primary, color_secondary, nickname, titles, appearances,
best_finish, last_appearance, coach_nationality, title_odds`
- Source: per-team research (Wikipedia/FIFA). 48 rows.
- `build_data.py`: load team_meta, merge onto each team by fifa_code.
- Surfaces:
  - **Team page** subtle accent tint from `color_primary` (HUD border/crest glow only — keep Blue Lock base).
  - **New Records section** (`/records/` or a band on teams index): titles, appearances, best finishes.
  - **Teams directory**: show ★ titles + odds; sort by pedigree.
  - **Stories**: real stakes ("first title since 1998", "8th straight WC").

### 1B. Stadium metadata → extend `host_cities.csv`
Add columns: `capacity, altitude_m, opened_year, roof, surface, lat, lng`
- Move the hard-coded `CITY_GEO` lat/lng out of `wc.js` into the CSV (single source).
- Source: 16 venues, trivial.
- Surfaces:
  - **Map**: node size = capacity; label altitude; the **Mexico City 2,240m** story.
  - **Match page**: venue capacity + altitude line.

### Track 1 deliverable
build green, screenshots of team page (tint), map (capacity/altitude), new Records
view. Commit per sub-step.

---

## TRACK 2 — Player backfill (1,247, batched research; biggest quality jump)

Each field is a pass over `.context/squads_enriched/*.json` filling missing values,
then `build_dataset.py` → `build_data.py`. Validate coverage delta after each.

### 2A. Market value (31% → ~95%) — DO FIRST
- Highest impact: unlocks a real **Value Cosmos**, value compares, "most valuable",
  and **improves every rating** (engine drops the value z-signal when missing).
- After backfill: restore the Value column on Players, re-enable value treemap mode.

### 2B. Detailed position (structural)
- Add `position_detail` (CB/RB/LB/CDM/CM/CAM/LW/RW/ST + GK) alongside the coarse
  `position`.
- Unlocks: positional heat-map viz, smarter auto-XI slotting, role-based compare.

### 2C. Minutes + starts (38/21% → ~90%)
- Best "regular starter" signal → better ratings + a minutes/availability viz.

### 2D. Player photos (24% → ~80%)
- Source headshots → `public/faces/{player_id}.jpg` (existing convention; cards
  already fall back to monogram). Improves every card, game, album, Hi-Lo.

### 2E. Assists + GK clean sheets / goals conceded
- Completes G/A; enables proper Golden-Glove + GK ratings (tier logic already
  references clean sheets).

---

## TRACK 3 — Tournament-time (schema now, data later)

- Add `home_score, away_score, status` to `matches.csv` (null pre-tournament).
- `build_data.py`: pass through; compute live **group standings** + knockout
  resolution when scores exist.
- Flips bracket/groups/standings from *projected* → *real* on June 11.
- Add a small results-update path (edit matches.csv → rebuild; the daily cron
  already rebuilds).

### Results-update path (live now — engine shipped)
`build_data.py` computes `payload["standings"]` (per group: P/W/D/L/GF/GA/GD/Pts,
ranked by points → GD → GF) from any group-stage rows in `matches.csv` that carry
`home_score`/`away_score`. It is **dormant** until scores exist (`matches_played`
= 0 → `standings` = {}). To go live during the tournament:
1. Add `home_score,away_score,status` columns to `matches.csv` (or fill them).
2. Enter final scores on played rows (`status` = `final`).
3. `python3 dashboard/build_data.py && npm run build` (the daily cron does this).
The groups page auto-switches projected → **live** table + shows real scorelines.
Verified end-to-end with a synthetic full Group A. Still TODO: head-to-head
tiebreakers, best-third-place ranking, and knockout real-resolution (the bracket
still projects via teamRating).

---

## Sequencing

1. **Phase 0 — schema plumbing** (no external data): add `team_meta.csv` +
   `host_cities` columns + `matches` score columns; wire `build_data.py`; keep
   nulls. Ship (no visible change, pipeline ready).
2. **Phase 1 — Track 1 data + features** (team meta, stadium meta) → theming,
   Records, map upgrade.
3. **Phase 2 — Track 2A market value** backfill → ratings + Value Cosmos.
4. **Phase 3 — Track 2B detailed position** → positional features.
5. **Phase 4 — Track 2C/2D/2E** minutes, photos, assists/GK.
6. **Phase 5 — Track 3** results wiring (closer to June 11).

Each phase: update source → rebuild → assert coverage delta → `npm run build`
green → screenshot affected pages → commit + push.

## Validation helper
After every data change, run the coverage check and diff against this baseline so
we never regress a field while adding others.
