# Enrichment re-run workflow

How to close the player-data gaps (market value, minutes, detailed position, …)
with **real, sourced** values — never invented.

## The loop

```
1. measure   python3 dashboard/enrich_gaps.py
                → .context/enrich_worklist.json   (team → players → missing fields)
                → .context/ENRICH_GAPS.md          (coverage table, gaps per team)

2. research  pick a team from the worklist; look up the missing fields from a real
             source (Transfermarkt / FBref / official club site). Write a patch:
                .context/enrich_patches/<CODE>.json   (keyed by exact player_name)
             {
               "Vinícius Júnior": {
                 "position_detail": "LW",
                 "market_value_eur": 150000000,
                 "club_minutes_2025_26": 2480,
                 "_source": "https://www.transfermarkt.com/..."
               }
             }

3. merge     python3 dashboard/enrich_apply.py --dry-run <CODE>   # preview + validate
             python3 dashboard/enrich_apply.py <CODE>             # write (fills NULLs only)
                → updates .context/squads_enriched/<CODE>.json, logs _source into
                  enrichment_sources. --force overwrites non-null values.

4. rebuild   python3 dashboard/build_dataset.py \
             && python3 dashboard/build_data.py \
             && npm run build
```

## Field priority (highest impact first)

| field | why |
|---|---|
| `market_value_eur` | feeds the rating engine + Value Cosmos |
| `position_detail`  | CB/RB/LB/CDM/CM/CAM/RW/LW/ST/SS — positional features |
| `club_minutes_2025_26` / `club_starts_2025_26` | "regular starter" signal |
| `club_assists_2025_26` | completes goals + assists |
| `club_clean_sheets_2025_26` / `club_goals_conceded_2025_26` | GK ratings (GK only) |
| `preferred_foot`, `height_cm` | card detail |

## Validation (enforced by enrich_apply.py)

- int fields must parse to an integer **and** sit inside a plausibility band
  (e.g. `market_value_eur` 0–500M, `club_minutes_2025_26` 0–5400, `height_cm` 150–215).
- `position_detail` ∈ {GK,CB,RB,LB,RWB,LWB,CDM,CM,CAM,RW,LW,ST,SS,CF}.
- `preferred_foot` ∈ {Left,Right,Both}.
- unmatched player names are reported, not guessed.
- by default only NULL fields are filled (re-running is safe / idempotent).

## Integrity rule

Every value must come from a real source recorded in `_source`. If a value can't
be sourced, leave it null — a measured gap is better than a fabricated number.

The curated JS role map (`POS_DETAIL` in `src/shared/lib/wc.js`) is the display
**fallback** for players whose `position_detail` hasn't been filled yet; the
structural field always wins once present.
