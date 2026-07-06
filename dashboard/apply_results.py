#!/usr/bin/env python3
"""Apply real match results into matches.csv from results.json.

results.json shape:
{
  "as_of": "2026-07-06",
  "group": { "<match_number>": [home_score, away_score], ... },   # teams already assigned
  "ko": {                                                          # knockout: set teams + score
    "<match_number>": {
        "home": "RSA", "away": "CAN",            # fifa_code of actual qualified teams
        "hs": 0, "as": 1,                        # scores (omit / null if not played yet)
        "status": "final",                       # or "scheduled"
        "note": "Canada won 4-3 on penalties"    # optional result_note (penalties / a.e.t.)
    }, ...
  }
}

Adds columns home_score, away_score, status, result_note to matches.csv if missing.
Idempotent: re-running with the same results.json yields the same file.
"""
import csv, json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data", "fifa-world-cup-2026")
MATCHES = os.path.join(DATA, "matches.csv")
RESULTS = os.path.join(DATA, "results.json")

COLS = ["home_score", "away_score", "status", "result_note"]


def main():
    with open(RESULTS, encoding="utf-8") as f:
        res = json.load(f)
    group = res.get("group", {})
    ko = res.get("ko", {})
    labels = res.get("labels", {})

    # fifa_code -> team id
    code_to_id = {}
    with open(os.path.join(DATA, "teams.csv"), newline="", encoding="utf-8") as f:
        for t in csv.DictReader(f):
            code_to_id[t["fifa_code"]] = t["id"]

    with open(MATCHES, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        fieldnames = list(reader.fieldnames)
        rows = list(reader)
    for c in COLS:
        if c not in fieldnames:
            fieldnames.append(c)

    for r in rows:
        mn = r["match_number"]
        # ensure columns exist on the row dict
        for c in COLS:
            r.setdefault(c, "")
        if mn in group:
            hs, as_ = group[mn]
            r["home_score"], r["away_score"] = str(hs), str(as_)
            r["status"] = "final"
        elif mn in ko:
            k = ko[mn]
            if k.get("home") in code_to_id:
                r["home_team_id"] = code_to_id[k["home"]]
            if k.get("away") in code_to_id:
                r["away_team_id"] = code_to_id[k["away"]]
            if k.get("hs") is not None and k.get("as") is not None:
                r["home_score"], r["away_score"] = str(k["hs"]), str(k["as"])
                r["status"] = k.get("status", "final")
            else:
                r["status"] = k.get("status", "scheduled")
            if k.get("note"):
                r["result_note"] = k["note"]
        if mn in labels:
            r["match_label"] = labels[mn]

    with open(MATCHES, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        w.writerows(rows)

    n_group = sum(1 for r in rows if r["match_number"] in group)
    n_ko_played = sum(1 for mn, k in ko.items() if k.get("hs") is not None)
    n_ko_sched = len(ko) - n_ko_played
    print(f"applied: {n_group} group results, {n_ko_played} knockout results, {n_ko_sched} knockout matchups scheduled")


if __name__ == "__main__":
    main()
