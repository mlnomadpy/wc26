#!/usr/bin/env python3
"""Compute standings from verified group results, VERIFY they reproduce the actual
32 Round-of-32 teams, then lay the real knockout bracket onto match slots (every
knockout row gets explicit real teams + scores). Emits results.json.

The dataset's original knockout slot labels (2A vs 2B, …) are an unofficial bracket
that does NOT match the real tournament pairings, so we assign real teams directly
and relabel knockout rows by round. Aborts loudly on any group-stage inconsistency."""
import csv, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data", "fifa-world-cup-2026")

# --- verified group scores: match_number -> [home_score, away_score] (HIGH confidence, 2 sources) ---
GROUP = {
 1:[2,0], 2:[2,1], 3:[1,1], 4:[4,1], 5:[1,1], 6:[1,1], 7:[0,1], 8:[2,0], 9:[7,1], 10:[2,2],
 11:[1,0], 12:[5,1], 13:[0,0], 14:[1,1], 15:[1,1], 16:[2,2], 17:[3,1], 18:[1,4], 19:[3,0], 20:[3,1],
 21:[1,1], 22:[4,2], 23:[1,0], 24:[1,3], 25:[1,1], 26:[4,1], 27:[6,0], 28:[1,0], 29:[2,0], 30:[0,1],
 31:[3,0], 32:[0,1], 33:[5,1], 34:[2,1], 35:[0,0], 36:[0,4], 37:[4,0], 38:[0,0], 39:[2,2], 40:[1,3],
 41:[2,0], 42:[3,0], 43:[3,2], 44:[1,2], 45:[5,0], 46:[0,0], 47:[0,1], 48:[1,0], 49:[2,1], 50:[3,1],
 51:[0,3], 52:[4,2], 53:[0,3], 54:[1,0], 55:[0,2], 56:[2,1], 57:[1,1], 58:[1,3], 59:[3,2], 60:[0,0],
 61:[1,4], 62:[5,0], 63:[0,0], 64:[0,1], 65:[1,1], 66:[1,5], 67:[0,2], 68:[2,1], 69:[0,0], 70:[3,1],
 71:[3,3], 72:[1,3],
}

# --- verified Round of 32: home,away (as reported), scores, winner, note ---
R32 = [
 ("RSA","CAN",0,1,"CAN",None),
 ("BRA","JPN",2,1,"BRA",None),
 ("GER","PAR",1,1,"PAR","Paraguay won 4–3 on penalties"),
 ("NED","MAR",1,1,"MAR","Morocco won 3–2 on penalties"),
 ("CIV","NOR",1,2,"NOR",None),
 ("FRA","SWE",3,0,"FRA",None),
 ("MEX","ECU",2,0,"MEX",None),
 ("ENG","COD",2,1,"ENG",None),
 ("BEL","SEN",3,2,"BEL","after extra time"),
 ("USA","BIH",2,0,"USA",None),
 ("ESP","AUT",3,0,"ESP",None),
 ("POR","CRO",2,1,"POR",None),
 ("SUI","ALG",2,0,"SUI",None),
 ("AUS","EGY",1,1,"EGY","Egypt won 4–2 on penalties"),
 ("ARG","CPV",3,2,"ARG","after extra time"),
 ("COL","GHA",1,0,"COL",None),
]

# --- verified Round of 16 (real pairings): home, away, hs, as, status, note ---
R16 = [
 ("CAN","MAR",0,1,"final",None),
 ("PAR","FRA",0,1,"final",None),
 ("BRA","NOR",1,2,"final",None),
 ("MEX","ENG",2,3,"final",None),
 ("POR","ESP",None,None,"scheduled",None),
 ("USA","BEL",None,None,"scheduled",None),
 ("ARG","EGY",None,None,"scheduled",None),
 ("SUI","COL",None,None,"scheduled",None),
]

# R32 match_numbers 73-88; R16 89-96 with their two feeder slots (from matches.csv tree)
R16_FEEDERS = {89:(73,75), 90:(74,77), 91:(76,78), 92:(79,80), 93:(83,84), 94:(81,82), 95:(86,88), 96:(85,87)}

# keep the ORIGINAL bracket slot labels — simulateTournament() parses these to build
# the (separate) pre-tournament predicted bracket, so they must stay intact.
LABELS = {
 73:"2A vs 2B", 74:"1C vs 2F", 75:"1E vs 3ABCDF", 76:"1F vs 2C", 77:"2E vs 2I", 78:"1I vs 3CDFGH",
 79:"1A vs 3CEFHI", 80:"1L vs 3EHIJK", 81:"1G vs 3AEHIJ", 82:"1D vs 3BEFIJ", 83:"1H vs 2J", 84:"2K vs 2L",
 85:"1B vs 3EFGIJ", 86:"2D vs 2G", 87:"1J vs 2H", 88:"1K vs 3DEIJL",
 89:"W73 vs W75", 90:"W74 vs W77", 91:"W76 vs W78", 92:"W79 vs W80", 93:"W83 vs W84", 94:"W81 vs W82",
 95:"W86 vs W88", 96:"W85 vs W87", 97:"W89 vs W90", 98:"W93 vs W94", 99:"W91 vs W92", 100:"W95 vs W100",
 101:"W97 vs W98", 102:"W99 vs W100", 103:"RU101 vs RU102", 104:"W101 vs W102",
}


def die(msg):
    print("ABORT:", msg, file=sys.stderr); sys.exit(1)


def main():
    teams = list(csv.DictReader(open(os.path.join(DATA, "teams.csv"), encoding="utf-8")))
    tid = {t["id"]: t for t in teams}
    grp = {t["fifa_code"]: t["group_letter"] for t in teams}
    mrows = list(csv.DictReader(open(os.path.join(DATA, "matches.csv"), encoding="utf-8")))
    codes = {}
    for m in mrows:
        mn = int(m["match_number"])
        if mn <= 72:
            codes[mn] = (tid[m["home_team_id"]]["fifa_code"], tid[m["away_team_id"]]["fifa_code"])

    # --- standings (pts, GD, GF, name) ---
    rec = {t["fifa_code"]: dict(code=t["fifa_code"], g=t["group_letter"], P=0, W=0, D=0, L=0, GF=0, GA=0, Pts=0) for t in teams}
    for mn, (hs, as_) in GROUP.items():
        h, a = codes[mn]
        for c, gf, ga in ((h, hs, as_), (a, as_, hs)):
            r = rec[c]; r["P"] += 1; r["GF"] += gf; r["GA"] += ga
            if gf > ga: r["W"] += 1; r["Pts"] += 3
            elif gf == ga: r["D"] += 1; r["Pts"] += 1
            else: r["L"] += 1
    for r in rec.values(): r["GD"] = r["GF"] - r["GA"]
    keyf = lambda r: (-r["Pts"], -r["GD"], -r["GF"], r["code"])

    pos, thirds = {}, []
    for g in sorted(set(grp.values())):
        table = sorted((r for r in rec.values() if r["g"] == g), key=keyf)
        for i, r in enumerate(table): pos[f"{i+1}{g}"] = r["code"]
        thirds.append(table[2])
    best_thirds = sorted(thirds, key=keyf)[:8]
    third_codes = {r["code"] for r in best_thirds}

    # --- integrity check: computed 32 qualifiers == actual R32 teams ---
    groups = sorted(set(grp.values()))
    qualified = {pos[f"1{g}"] for g in groups} | {pos[f"2{g}"] for g in groups} | third_codes
    r32_teams = set()
    for h, a, *_ in R32: r32_teams |= {h, a}
    if qualified != r32_teams:
        die(f"qualified != actual R32.\n  extra computed: {sorted(qualified - r32_teams)}\n  extra actual: {sorted(r32_teams - qualified)}")

    winner_r32 = {}   # winner code -> R32 tuple
    for t in R32: winner_r32[t[4]] = t

    ko = {}
    # place R16 (89-96) + their R32 feeders (73-88)
    for (mn, (sh, sa)), (rh, ra, rhs, ras, st, note) in zip(R16_FEEDERS.items(), R16):
        # feeder slots: home team's R32 match -> sh ; away team's R32 match -> sa
        for slot, wcode in ((sh, rh), (sa, ra)):
            t = winner_r32[wcode]
            ko[str(slot)] = {"home": t[0], "away": t[1], "hs": t[2], "as": t[3], "status": "final", "note": t[5]}
        ko[str(mn)] = {"home": rh, "away": ra, "hs": rhs, "as": ras, "status": st, "note": note}

    if len(ko) != 24: die(f"expected 24 knockout rows, got {len(ko)}")

    out = {"as_of": "2026-07-06",
           "group": {str(k): v for k, v in GROUP.items()},
           "ko": ko,
           "labels": {str(k): v for k, v in LABELS.items()}}
    json.dump(out, open(os.path.join(DATA, "results.json"), "w"), indent=1, ensure_ascii=False)

    # --- report ---
    print("VERIFIED: computed top-2 + 8 best thirds == the actual 32 Round-of-32 teams.\n")
    for g in groups:
        t = [pos[f"{i}{g}"] for i in (1, 2, 3, 4)]
        mk = lambda c: c + ("*" if c in third_codes else "")
        r = rec
        print(f"  Grp {g}: 1.{t[0]}({r[t[0]]['Pts']})  2.{t[1]}({r[t[1]]['Pts']})  3.{mk(t[2])}({r[t[2]]['Pts']})  4.{t[3]}({r[t[3]]['Pts']})")
    print("\n  Best thirds:", ", ".join(sorted(f"{c}({grp[c]})" for c in third_codes)))
    print("\n  Round of 32:")
    for n in range(73, 89):
        k = ko[str(n)]; print(f"   {n}: {k['home']} {k['hs']}-{k['as']} {k['away']}" + (f"  ({k['note']})" if k['note'] else ""))
    print("\n  Round of 16:")
    for n in range(89, 97):
        k = ko[str(n)]; sc = f"{k['hs']}-{k['as']}" if k['hs'] is not None else "vs"
        print(f"   {n}: {k['home']} {sc} {k['away']}  [{k['status']}]")


if __name__ == "__main__":
    main()
