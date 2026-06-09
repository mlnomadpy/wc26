#!/usr/bin/env python3
"""Assemble the enriched WC2026 dataset from .context/squads_enriched/ (fallback to squads/):
  - data/fifa-world-cup-2026/players.csv   (full enriched schema, 1 row/player)
  - data/fifa-world-cup-2026/teams.csv     (keeps curated meta, refreshes squad_size)
  - data/fifa-world-cup-2026/worldcup2026.db  (rebuilt, all tables + enriched players)
"""
import csv, json, glob, os, sqlite3
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data", "fifa-world-cup-2026")
ENR = os.path.join(ROOT, ".context", "squads_enriched")
BASE = os.path.join(ROOT, ".context", "squads")
START = date(2026, 6, 11)

# (column, sqlite type). int=>INTEGER, else TEXT
PLAYER_SCHEMA = [
    ("player_id","int"),("team_id","int"),("fifa_code","t"),("team_name","t"),("group_letter","t"),
    ("confederation","t"),("shirt_number","int"),("position","t"),("position_detail","t"),("player_name","t"),
    ("date_of_birth","t"),("age","int"),("caps","int"),("international_goals","int"),("is_captain","t"),
    ("club","t"),("club_country","t"),("club_league","t"),("height_cm","int"),("preferred_foot","t"),
    ("market_value_eur","int"),("club_apps_2025_26","int"),("club_starts_2025_26","int"),
    ("club_minutes_2025_26","int"),("club_goals_2025_26","int"),("club_assists_2025_26","int"),
    ("club_yellow_2025_26","int"),("club_red_2025_26","int"),("club_clean_sheets_2025_26","int"),
    ("club_goals_conceded_2025_26","int"),("club_competitions_2025_26","t"),("team_wins_2025_26","int"),
    ("team_draws_2025_26","int"),("team_losses_2025_26","int"),("career_club_apps","int"),
    ("career_club_goals","int"),("enrichment_confidence","t"),("form_note","t"),("enrichment_sources","t"),
    ("backstory","t"),("facts","t"),
]
PLAYER_COLS = [c for c, _ in PLAYER_SCHEMA]
TEAM_COLS = ["id","team_name","fifa_code","group_letter","is_placeholder",
    "confederation","head_coach","fifa_ranking","qualification_method","squad_size"]


def age_on(dob, ref):
    try:
        y,m,d=(int(x) for x in dob.split("-")); b=date(y,m,d)
        return ref.year-b.year-((ref.month,ref.day)<(b.month,b.day))
    except Exception:
        return None


def read_csv(name):
    with open(os.path.join(DATA, name), newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def cell(v):
    if v is None: return ""
    if isinstance(v, list): return " ; ".join(str(x) for x in v)
    if isinstance(v, bool): return str(v)
    return v

# load enriched squads (fallback to base for any gap), keyed by code
squads = {}
for p in glob.glob(os.path.join(BASE, "*.json")):
    d = json.load(open(p, encoding="utf-8")); squads[d["fifa_code"]] = d
for p in glob.glob(os.path.join(ENR, "*.json")):
    d = json.load(open(p, encoding="utf-8")); squads[d["fifa_code"]] = d  # enriched overrides base

teams_csv = read_csv("teams.csv")
id_by_code = {t["fifa_code"]: int(t["id"]) for t in teams_csv}

# ---- players.csv ----
players = []; pid = 0
for code in sorted(squads, key=lambda c: id_by_code.get(c, 999)):
    d = squads[code]; tid = id_by_code.get(code, d.get("team_id"))
    for p in sorted(d["players"], key=lambda x: (x.get("shirt_number") or 999)):
        pid += 1
        row = {c: p.get(c) for c in PLAYER_COLS if c in p}
        row.update({"player_id": pid, "team_id": tid, "fifa_code": code,
            "team_name": d["team_name"], "group_letter": d["group_letter"],
            "confederation": d["confederation"], "age": age_on(p.get("date_of_birth", ""), START)})
        players.append(row)

with open(os.path.join(DATA, "players.csv"), "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=PLAYER_COLS); w.writeheader()
    for r in players:
        w.writerow({c: cell(r.get(c)) for c in PLAYER_COLS})

# ---- teams.csv: keep curated meta, refresh squad_size only ----
for t in teams_csv:
    d = squads.get(t["fifa_code"])
    t["squad_size"] = len(d["players"]) if d else 0
with open(os.path.join(DATA, "teams.csv"), "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=TEAM_COLS); w.writeheader()
    for t in teams_csv:
        w.writerow({k: cell(t.get(k, "")) for k in TEAM_COLS})

# ---- rebuild sqlite ----
db = os.path.join(DATA, "worldcup2026.db")
con = sqlite3.connect(db); cur = con.cursor()
for tbl in ["players","matches","host_cities","tournament_stages","teams"]:
    cur.execute(f"DROP TABLE IF EXISTS {tbl}")
cur.execute("""CREATE TABLE teams(id INTEGER PRIMARY KEY, team_name TEXT, fifa_code TEXT,
  group_letter TEXT, is_placeholder TEXT, confederation TEXT, head_coach TEXT,
  fifa_ranking INTEGER, qualification_method TEXT, squad_size INTEGER)""")
cur.execute("CREATE TABLE tournament_stages(id INTEGER PRIMARY KEY, stage_name TEXT, stage_order INTEGER)")
cur.execute("""CREATE TABLE host_cities(id INTEGER PRIMARY KEY, city_name TEXT, country TEXT,
  venue_name TEXT, region_cluster TEXT, airport_code TEXT)""")
cur.execute("""CREATE TABLE matches(id INTEGER PRIMARY KEY, match_number INTEGER, home_team_id INTEGER,
  away_team_id INTEGER, city_id INTEGER, stage_id INTEGER, kickoff_at TEXT, match_label TEXT)""")
pcols_sql = ", ".join(f"{c} {'INTEGER' if t=='int' else 'TEXT'}" + (" PRIMARY KEY" if c=="player_id" else "")
                      for c, t in PLAYER_SCHEMA)
cur.execute(f"CREATE TABLE players({pcols_sql}, FOREIGN KEY(team_id) REFERENCES teams(id))")


def iv(v):
    if v in (None, ""): return None
    try: return int(float(v))
    except (ValueError, TypeError): return v

cur.executemany("INSERT INTO teams VALUES (?,?,?,?,?,?,?,?,?,?)",
    [(int(t["id"]),t["team_name"],t["fifa_code"],t["group_letter"],t["is_placeholder"],
      t["confederation"],t.get("head_coach") or None,iv(t.get("fifa_ranking")),
      t.get("qualification_method") or None,iv(t["squad_size"])) for t in teams_csv])
cur.executemany("INSERT INTO tournament_stages VALUES (?,?,?)",
    [(int(s["id"]),s["stage_name"],int(s["stage_order"])) for s in read_csv("tournament_stages.csv")])
cur.executemany("INSERT INTO host_cities VALUES (?,?,?,?,?,?)",
    [(int(c["id"]),c["city_name"],c["country"],c["venue_name"],c["region_cluster"],c["airport_code"]) for c in read_csv("host_cities.csv")])

def mi(v): return int(v) if str(v).strip() not in ("","None") else None
cur.executemany("INSERT INTO matches VALUES (?,?,?,?,?,?,?,?)",
    [(mi(m["id"]),mi(m["match_number"]),mi(m["home_team_id"]),mi(m["away_team_id"]),
      mi(m["city_id"]),mi(m["stage_id"]),m["kickoff_at"],m["match_label"]) for m in read_csv("matches.csv")])

ph = ",".join("?" * len(PLAYER_COLS))
def pv(r, c, typ):
    v = r.get(c)
    if isinstance(v, list): return " ; ".join(str(x) for x in v)
    if isinstance(v, bool): return str(v)
    if typ == "int": return iv(v)
    return None if v == "" else v
cur.executemany(f"INSERT INTO players VALUES ({ph})",
    [tuple(pv(r, c, t) for c, t in PLAYER_SCHEMA) for r in players])
con.commit()
counts = {t: cur.execute(f"SELECT COUNT(*) FROM {t}").fetchone()[0]
          for t in ["teams","players","matches","host_cities","tournament_stages"]}
con.close()
print(f"players.csv: {len(players)} rows, {len(PLAYER_COLS)} cols")
print(f"teams.csv: {len(teams_csv)} rows | db rebuilt: {counts}")
