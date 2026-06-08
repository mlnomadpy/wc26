#!/usr/bin/env python3
"""Build dashboard/data.json from the CANONICAL CSVs (players.csv, teams.csv, etc.).
Passes through every player column that exists, so enriched stat columns light up
automatically once players.csv is rebuilt. Re-run any time to refresh the dashboard."""
import csv, json, os
from datetime import date
from collections import Counter, defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data", "fifa-world-cup-2026")
OUT = os.path.join(ROOT, "public", "data.json")

INT_FIELDS = {"shirt_number","age","caps","international_goals","height_cm","market_value_eur",
    "club_apps_2025_26","club_starts_2025_26","club_minutes_2025_26","club_goals_2025_26",
    "club_assists_2025_26","club_yellow_2025_26","club_red_2025_26","club_clean_sheets_2025_26",
    "club_goals_conceded_2025_26","team_wins_2025_26","team_draws_2025_26","team_losses_2025_26",
    "career_club_apps","career_club_goals","fifa_ranking","stage_order","match_number",
    "home_team_id","away_team_id","city_id","stage_id","id","team_id","player_id","squad_size"}


def read_csv(name):
    with open(os.path.join(DATA, name), newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def coerce(row):
    out = {}
    for k, v in row.items():
        if v is None or v == "":
            out[k] = None
        elif k in INT_FIELDS:
            try:
                out[k] = int(float(v))
            except (ValueError, TypeError):
                out[k] = v
        elif v in ("True", "False"):
            out[k] = (v == "True")
        else:
            out[k] = v
    return out


teams = [coerce(t) for t in read_csv("teams.csv")]
players = [coerce(p) for p in read_csv("players.csv")]
for p in players:  # researched facts stored as " ; "-joined string -> array
    p["facts"] = [x for x in (p.get("facts") or "").split(" ; ") if x] if isinstance(p.get("facts"), str) else (p.get("facts") or [])
matches_raw = read_csv("matches.csv")
cities = [coerce(c) for c in read_csv("host_cities.csv")]
stages = [coerce(s) for s in read_csv("tournament_stages.csv")]

team_by_id = {str(t["id"]): t for t in teams}
city_by_id = {str(c["id"]): c for c in cities}
stage_by_id = {str(s["id"]): s for s in stages}

matches = []
for m in matches_raw:
    h = team_by_id.get(m["home_team_id"], {})
    a = team_by_id.get(m["away_team_id"], {})
    c = city_by_id.get(m["city_id"], {})
    s = stage_by_id.get(m["stage_id"], {})
    mm = coerce(m)
    mm.update({
        "home_team": h.get("team_name"), "home_code": h.get("fifa_code"),
        "away_team": a.get("team_name"), "away_code": a.get("fifa_code"),
        "city": c.get("city_name"), "venue": c.get("venue_name"),
        "country": c.get("country"), "stage": s.get("stage_name"),
    })
    matches.append(mm)

# which enriched columns actually have data
present_cols = [c for c in players[0].keys()] if players else []
def filled(col):
    return sum(1 for p in players if p.get(col) not in (None, ""))
has_enrichment = filled("club_apps_2025_26") > 60  # >base pilot threshold


def count_by(items, key, top=None):
    c = Counter((it.get(key) or "Unknown") for it in items)
    items_sorted = sorted(c.items(), key=lambda kv: -kv[1])
    if top:
        items_sorted = items_sorted[:top]
    return dict(items_sorted)


def top_n(col, n=25, label="val"):
    rows = [p for p in players if isinstance(p.get(col), int)]
    rows.sort(key=lambda p: -p[col])
    return [{"name": p["player_name"], "team": p["fifa_code"], "club": p.get("club"),
             "pos": p.get("position"), label: p[col]} for p in rows[:n]]


# age buckets
age_buckets = {"≤20": 0, "21-24": 0, "25-28": 0, "29-32": 0, "33+": 0, "?": 0}
for p in players:
    a = p.get("age")
    if not isinstance(a, int):
        age_buckets["?"] += 1
    elif a <= 20: age_buckets["≤20"] += 1
    elif a <= 24: age_buckets["21-24"] += 1
    elif a <= 28: age_buckets["25-28"] += 1
    elif a <= 32: age_buckets["29-32"] += 1
    else: age_buckets["33+"] += 1

# avg age per team
team_age = defaultdict(list)
for p in players:
    if isinstance(p.get("age"), int):
        team_age[p["fifa_code"]].append(p["age"])
avg_age = {k: round(sum(v) / len(v), 1) for k, v in team_age.items()}
avg_age = dict(sorted(avg_age.items(), key=lambda kv: kv[1]))

coverage_fields = ["height_cm","preferred_foot","market_value_eur","club_apps_2025_26",
    "club_starts_2025_26","club_minutes_2025_26","club_goals_2025_26","club_assists_2025_26",
    "club_yellow_2025_26","club_red_2025_26","team_wins_2025_26","career_club_apps","form_note"]
coverage = {f: filled(f) for f in coverage_fields if f in present_cols}

# ---- data-ranking rating + fun/social stats (computed from the whole population) ----
import math, statistics, bisect
def nv(p, k):
    v = p.get(k)
    return v if isinstance(v, (int, float)) else 0
def _score(p):
    g, c = nv(p, "international_goals"), nv(p, "caps")
    cg, ca = nv(p, "club_goals_2025_26"), nv(p, "club_assists_2025_26")
    ap, mn = nv(p, "club_apps_2025_26"), nv(p, "club_minutes_2025_26")
    mv, cs = nv(p, "market_value_eur"), nv(p, "club_clean_sheets_2025_26")
    val = math.log10(mv / 1e6 + 1) if mv else 0       # market value carries quality
    invol = ap * 0.14 + (mn / 90) * 0.1 + c * 0.05    # caps weighted lightly
    att = cg * 1.2 + ca * 0.8 + g * 0.4
    pos = p.get("position")
    if pos == "FW": return val * 9 + att + g * 0.4 + invol * 0.3
    if pos == "MF": return val * 9 + att * 0.7 + ca * 0.4 + invol * 0.5 + c * 0.1
    if pos == "DF": return val * 9 + invol * 0.7 + (cg + ca) * 0.4 + c * 0.1
    return val * 9 + cs * 1.2 + ap * 0.25 + c * 0.08  # GK
# z-score within position (normalises positions), then global percentile -> rating
posg = {}
for p in players: posg.setdefault(p.get("position"), []).append(p)
zmap = {}
for grp in posg.values():
    sc = [_score(p) for p in grp]
    m = statistics.mean(sc); sd = statistics.pstdev(sc) or 1
    for p in grp: zmap[p["player_id"]] = (_score(p) - m) / sd
# ordinal-rank percentile (smooth spread, only the very top reaches 99)
_order = sorted(players, key=lambda p: zmap[p["player_id"]])
_rankpct = {p["player_id"]: i / max(1, len(_order) - 1) for i, p in enumerate(_order)}
goals_sorted = sorted(nv(p, "international_goals") for p in players)
val_sorted = sorted(nv(p, "market_value_eur") for p in players if nv(p, "market_value_eur"))
def gpct(v): return bisect.bisect_left(goals_sorted, v) / max(1, len(goals_sorted) - 1)
# per-team superlatives
tflag = {}
byteam = {}
for p in players: byteam.setdefault(p["fifa_code"], []).append(p)
for grp in byteam.values():
    tc = max(grp, key=lambda x: nv(x, "caps"))
    tv = max(grp, key=lambda x: nv(x, "market_value_eur"))
    ages = [x for x in grp if isinstance(x.get("age"), int)]
    ty = min(ages, key=lambda x: x["age"]) if ages else None
    for p in grp: tflag[p["player_id"]] = (p is tc, p is tv, ty is not None and p is ty)
for p in players:
    p["data_rating"] = max(55, min(99, round(55 + (_rankpct[p["player_id"]] ** 1.25) * 44)))
    fun = []
    g, c, age = nv(p, "international_goals"), nv(p, "caps"), p.get("age")
    isCap, isVal, isYng = tflag[p["player_id"]]
    if c > 0 and g / c >= 0.5: fun.append(f"⚡ {round(g / c, 2)} goals per cap")
    gp = round(gpct(g) * 100)
    if g >= 20 and gp >= 85: fun.append(f"\U0001f525 Top {max(1, 100 - gp)}% scorer at the Cup")
    if isCap and c: fun.append(f"\U0001f396️ Most-capped in the squad ({c})")
    if isVal and nv(p, "market_value_eur"): fun.append("\U0001f48e Most valuable in the squad")
    if isYng and isinstance(age, int): fun.append(f"\U0001f423 Youngest in the squad ({age})")
    if isinstance(age, int) and age <= 20: fun.append("\U0001f31f Wonderkid")
    elif isinstance(age, int) and age >= 34: fun.append("\U0001f9d3 Veteran presence")
    if p.get("club_country") and p.get("club_country") != p.get("team_name"): fun.append(f"\U0001f30d Plays abroad · {p['club_country']}")
    cg = nv(p, "club_goals_2025_26")
    if cg >= 15: fun.append(f"\U0001f3af {cg} club goals in 2025/26")
    if nv(p, "club_clean_sheets_2025_26") >= 10: fun.append(f"\U0001f9e4 {nv(p,'club_clean_sheets_2025_26')} clean sheets in 2025/26")
    if p.get("is_captain"): fun.append("©️ Captain")
    p["fun"] = fun[:5]

payload = {
    "generated_at": str(date.today()),
    "has_enrichment": has_enrichment,
    "columns": present_cols,
    "totals": {
        "teams": len(teams),
        "squads_loaded": sum(1 for t in teams if t.get("squad_size")),
        "players": len(players),
        "matches": len(matches),
        "host_cities": len(cities),
        "clubs": len(set(p.get("club") for p in players if p.get("club"))),
        "leagues": len(set(p.get("club_league") for p in players if p.get("club_league"))),
    },
    "teams": teams,
    "matches": matches,
    "cities": cities,
    "stages": stages,
    "players": players,
    "agg": {
        "positions": count_by(players, "position"),
        "by_confederation": count_by(players, "confederation"),
        "by_club_country": count_by(players, "club_country", top=15),
        "by_league": count_by(players, "club_league", top=15),
        "by_club": count_by(players, "club", top=20),
        "age_buckets": age_buckets,
        "avg_age_per_team": avg_age,
        "top_caps": top_n("caps", 25, "caps"),
        "top_goals": top_n("international_goals", 25, "goals"),
        "top_club_goals": top_n("club_goals_2025_26", 25, "goals"),
        "top_club_assists": top_n("club_assists_2025_26", 25, "assists"),
        "top_minutes": top_n("club_minutes_2025_26", 25, "minutes"),
        "top_value": top_n("market_value_eur", 25, "value"),
        "coverage": coverage,
    },
}

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "w", encoding="utf-8") as f:
    json.dump(payload, f, ensure_ascii=False)

# ---- search.json: compact index for the command palette ----
import unicodedata, re as _re
def slugify(s):
    s = unicodedata.normalize("NFKD", str(s)).encode("ascii", "ignore").decode().lower()
    return _re.sub(r"-+", "-", _re.sub(r"[^a-z0-9]+", "-", s)).strip("-")

search = []
for t in teams:
    search.append({"n": t["team_name"], "d": f"Group {t['group_letter']} · {t.get('confederation','')}",
                   "t": "Team", "u": f"teams/{t['fifa_code'].lower()}/", "s": f"{t['team_name']} {t['fifa_code']}".lower()})
for p in players:
    search.append({"n": p["player_name"], "d": f"{p['fifa_code']} · {p.get('club','')}",
                   "t": "Player", "u": f"players/{p['player_id']}/", "s": f"{p['player_name']} {p.get('club','')}".lower()})
seen_clubs = {}
for p in players:
    if p.get("club") and p["club"] not in seen_clubs:
        seen_clubs[p["club"]] = True
        search.append({"n": p["club"], "d": p.get("club_country", ""), "t": "Club",
                       "u": f"clubs/{slugify(p['club'])}/", "s": p["club"].lower()})
for c in cities:
    search.append({"n": c["city_name"], "d": c["venue_name"], "t": "City", "u": "map/", "s": c["city_name"].lower()})
for nm, u in [("Home", ""), ("Teams", "teams/"), ("Players", "players/"), ("Clubs", "clubs/"),
              ("Groups", "groups/"), ("Bracket", "bracket/"), ("Matches", "matches/"), ("Map", "map/"),
              ("Compare", "compare/"), ("Insights", "insights/"), ("Data", "data/")]:
    search.append({"n": nm, "d": "", "t": "Page", "k": "→", "u": u, "s": nm.lower()})
with open(os.path.join(os.path.dirname(OUT), "search.json"), "w", encoding="utf-8") as f:
    json.dump(search, f, ensure_ascii=False)

print(f"wrote {OUT}")
print(f"  search.json: {len(search)} entries")
print(f"  teams={payload['totals']['teams']} players={payload['totals']['players']} "
      f"clubs={payload['totals']['clubs']} leagues={payload['totals']['leagues']}")
print(f"  enrichment active: {has_enrichment} | coverage: " +
      ", ".join(f"{k}={v}" for k, v in coverage.items()))
