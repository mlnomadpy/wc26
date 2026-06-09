#!/usr/bin/env python3
"""Enrichment patch merge — the SECOND half of a targeted re-run.

Reads researched values from .context/enrich_patches/<CODE>.json and merges them
into .context/squads_enriched/<CODE>.json with type validation + source
provenance. By default only fills NULL fields (use --force to overwrite).

Patch file format (one per team, keyed by exact player_name):
  {
    "Alisson": { "market_value_eur": 25000000, "club_minutes_2025_26": 3150,
                 "position_detail": "GK", "_source": "https://www.transfermarkt.com/..." }
  }

Run:  python3 dashboard/enrich_apply.py [--dry-run] [--force] [CODE ...]
Then: python3 dashboard/build_dataset.py && python3 dashboard/build_data.py && npm run build
Validation rejects implausible values — it will not let bad data through.
"""
import json, glob, os, sys, unicodedata

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENR = os.path.join(ROOT, ".context", "squads_enriched")
PATCH = os.path.join(ROOT, ".context", "enrich_patches")

INT_FIELDS = {"market_value_eur", "club_minutes_2025_26", "club_starts_2025_26",
    "club_assists_2025_26", "club_yellow_2025_26", "club_red_2025_26",
    "club_clean_sheets_2025_26", "club_goals_conceded_2025_26", "club_apps_2025_26",
    "club_goals_2025_26", "career_club_apps", "career_club_goals", "height_cm", "caps",
    "international_goals"}
ROLES = {"GK","CB","RB","LB","RWB","LWB","CDM","CM","CAM","RW","LW","ST","SS","CF"}
FEET = {"Left", "Right", "Both"}
# plausibility bounds for the noisy int fields
BOUNDS = {"market_value_eur": (0, 500_000_000), "club_minutes_2025_26": (0, 5400),
          "club_starts_2025_26": (0, 60), "club_apps_2025_26": (0, 70),
          "height_cm": (150, 215), "club_assists_2025_26": (0, 40),
          "club_clean_sheets_2025_26": (0, 50), "club_goals_conceded_2025_26": (0, 120)}


def norm(s):
    return unicodedata.normalize("NFKD", str(s)).encode("ascii", "ignore").decode().lower().strip()


def validate(field, value):
    """return (ok, coerced_value_or_reason)"""
    if field == "position_detail":
        return (value in ROLES, value if value in ROLES else f"role not in {sorted(ROLES)}")
    if field == "preferred_foot":
        return (value in FEET, value if value in FEET else "foot must be Left/Right/Both")
    if field in INT_FIELDS:
        try:
            v = int(float(value))
        except (ValueError, TypeError):
            return (False, "not an integer")
        lo, hi = BOUNDS.get(field, (0, 10**12))
        if not (lo <= v <= hi):
            return (False, f"out of bounds [{lo},{hi}]")
        return (True, v)
    return (True, value)  # free-text fields (form_note, etc.)


def main():
    args = sys.argv[1:]
    dry = "--dry-run" in args
    force = "--force" in args
    only = [a.upper() for a in args if not a.startswith("--")]

    if not os.path.isdir(PATCH):
        print(f"no patch dir — create {PATCH}/<CODE>.json files first (see header).")
        return
    applied = skipped = rejected = 0
    for pf in sorted(glob.glob(os.path.join(PATCH, "*.json"))):
        code = os.path.splitext(os.path.basename(pf))[0].upper()
        if only and code not in only:
            continue
        ef = os.path.join(ENR, f"{code}.json")
        if not os.path.exists(ef):
            print(f"! {code}: no enriched file, skipping")
            continue
        patches = json.load(open(pf, encoding="utf-8"))
        squad = json.load(open(ef, encoding="utf-8"))
        by_name = {norm(p["player_name"]): p for p in squad["players"]}
        changed = 0
        for pname, fields in patches.items():
            tgt = by_name.get(norm(pname))
            if not tgt:
                print(f"! {code}: no player match for '{pname}'")
                continue
            src = fields.get("_source")
            for field, value in fields.items():
                if field == "_source":
                    continue
                ok, res = validate(field, value)
                if not ok:
                    print(f"  ✗ {code} {pname}.{field}={value!r}: {res}")
                    rejected += 1
                    continue
                if tgt.get(field) not in (None, "") and not force:
                    skipped += 1
                    continue
                if not dry:
                    tgt[field] = res
                    if src:
                        cur = tgt.get("enrichment_sources")
                        if isinstance(cur, list):
                            if src not in cur:
                                cur.append(src)
                        else:
                            cur = cur or ""
                            if src not in cur:
                                tgt["enrichment_sources"] = (cur + " ; " + src).strip(" ;")
                applied += 1
                changed += 1
        if changed and not dry:
            json.dump(squad, open(ef, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        if changed:
            print(f"{'(dry) ' if dry else ''}{code}: {changed} field(s)")
    print(f"\n{'DRY-RUN — nothing written. ' if dry else ''}"
          f"applied={applied} skipped(already-filled)={skipped} rejected={rejected}")
    if not dry and applied:
        print("next: python3 dashboard/build_dataset.py && python3 dashboard/build_data.py && npm run build")


if __name__ == "__main__":
    main()
