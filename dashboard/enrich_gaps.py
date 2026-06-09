#!/usr/bin/env python3
"""Enrichment gap analyzer — the FIRST half of a targeted re-run.

Scans .context/squads_enriched/*.json and reports, per field and per team, which
player records are still missing the high-value stats. Emits:
  - .context/enrich_worklist.json   structured work-list (team -> players -> missing fields)
  - .context/ENRICH_GAPS.md         human-readable coverage report

Run:  python3 dashboard/enrich_gaps.py
Then research the gaps (one team at a time) and feed values back with
dashboard/enrich_apply.py. Nothing here invents data — it only measures it.
"""
import json, glob, os
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENR = os.path.join(ROOT, ".context", "squads_enriched")

# priority order — the fields a re-run should chase first (see docs/data-roadmap.md)
TARGETS = [
    ("market_value_eur",          "Market value (€)            — ratings + Value Cosmos"),
    ("position_detail",           "Detailed position (CB/LW/…) — positional features"),
    ("club_minutes_2025_26",      "Club minutes 25/26          — starter signal + ratings"),
    ("club_starts_2025_26",       "Club starts 25/26"),
    ("club_assists_2025_26",      "Club assists 25/26          — completes G/A"),
    ("club_yellow_2025_26",       "Club yellow cards 25/26"),
    ("club_red_2025_26",          "Club red cards 25/26"),
    ("club_clean_sheets_2025_26", "GK clean sheets 25/26       — Golden Glove"),
    ("club_goals_conceded_2025_26", "GK goals conceded 25/26"),
    ("preferred_foot",            "Preferred foot"),
    ("height_cm",                 "Height (cm)"),
]
GK_ONLY = {"club_clean_sheets_2025_26", "club_goals_conceded_2025_26"}


def missing(v):
    return v is None or v == "" or (isinstance(v, list) and not v)


def load():
    squads = {}
    for p in sorted(glob.glob(os.path.join(ENR, "*.json"))):
        d = json.load(open(p, encoding="utf-8"))
        squads[d["fifa_code"]] = d
    return squads


def main():
    squads = load()
    total = sum(len(d["players"]) for d in squads.values())
    cover = {f: 0 for f, _ in TARGETS}
    worklist = {}
    for code, d in squads.items():
        team_rows = []
        for p in d["players"]:
            is_gk = p.get("position") == "GK"
            miss = []
            for f, _ in TARGETS:
                if f in GK_ONLY and not is_gk:
                    continue
                if not missing(p.get(f)):
                    cover[f] += 1
                elif f != "position_detail" or True:
                    miss.append(f)
            if miss:
                team_rows.append({"player_name": p["player_name"], "position": p.get("position"),
                                  "club": p.get("club"), "missing": miss})
        worklist[code] = {"team_name": d["team_name"], "players": team_rows}

    # GK-only denominator
    gk_total = sum(1 for d in squads.values() for p in d["players"] if p.get("position") == "GK")
    coverage = {}
    for f, label in TARGETS:
        denom = gk_total if f in GK_ONLY else total
        coverage[f] = {"filled": cover[f], "total": denom,
                       "pct": round(cover[f] / denom * 100) if denom else 0, "label": label}

    out = {"generated_at": str(date.today()), "players_total": total,
           "coverage": coverage, "teams": worklist}
    with open(os.path.join(ROOT, ".context", "enrich_worklist.json"), "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)

    # markdown report
    lines = [f"# Enrichment gaps — {out['generated_at']}", "",
             f"{total} players across {len(squads)} squads. Coverage of target fields:", "",
             "| % | filled | field |", "|---:|---:|---|"]
    for f, label in TARGETS:
        c = coverage[f]
        lines.append(f"| {c['pct']}% | {c['filled']}/{c['total']} | {label} |")
    lines += ["", "## Gaps per team (players needing ≥1 target field)", "",
              "| Team | players to enrich |", "|---|---:|"]
    for code in sorted(worklist, key=lambda c: -len(worklist[c]["players"])):
        n = len(worklist[code]["players"])
        if n:
            lines.append(f"| {code} {worklist[code]['team_name']} | {n} |")
    with open(os.path.join(ROOT, ".context", "ENRICH_GAPS.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")

    print(f"players: {total} | wrote .context/enrich_worklist.json + .context/ENRICH_GAPS.md")
    for f, label in TARGETS:
        c = coverage[f]
        print(f"  {c['pct']:3d}%  {c['filled']:4d}/{c['total']:<4d}  {f}")


if __name__ == "__main__":
    main()
