#!/usr/bin/env python3
"""
Fetch a real reference photo for each WC2026 player from Wikipedia / Wikimedia
Commons -> refs/<player_id>.jpg  (input for scripts/gen_faces.py)

  pip install requests
  python3 scripts/fetch_refs.py            # all players (resumable)
  python3 scripts/fetch_refs.py --limit 8  # quick test

Writes refs/_sources.csv (id, name, wiki_title, image_url, license, artist) so you
can honour attribution. Coverage is partial — well-known players almost always
have a photo; lower-profile ones may not. Licenses vary (mostly CC-BY-SA, some
non-free) — check _sources.csv before any public/commercial use.
"""
import os, sys, csv, time, json
import requests

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "public", "data.json")
REFS = os.path.join(ROOT, "refs")
LIMIT = int(sys.argv[sys.argv.index("--limit") + 1]) if "--limit" in sys.argv else 0
API = "https://en.wikipedia.org/w/api.php"
S = requests.Session()
S.headers["User-Agent"] = "WC26MatchdayBot/1.0 (https://github.com/mlnomadpy/wc26; tahabhs14@gmail.com)"
def is_image(b):
    return b[:3] == b"\xff\xd8\xff" or b[:8] == b"\x89PNG\r\n\x1a\n" or b[:4] == b"RIFF" or b[:6] in (b"GIF87a", b"GIF89a")

API_FAIL = {"__fail__": True}
def api(params):
    for attempt in range(6):
        try:
            r = S.get(API, params=params, timeout=30)
            if r.status_code == 200 and r.text.strip().startswith("{"):
                return r.json()
            if r.status_code == 429 or "too many requests" in r.text.lower():
                time.sleep(5 * (attempt + 1))   # 429: back off hard
                continue
        except Exception:
            pass
        time.sleep(2 + attempt * 2)
    return API_FAIL

def thumb_for_title(title):
    r = api({"action": "query", "format": "json", "redirects": 1,
             "prop": "pageimages", "piprop": "thumbnail|name", "pithumbsize": 600,
             "titles": title})
    for pg in r.get("query", {}).get("pages", {}).values():
        if "thumbnail" in pg:
            return pg["thumbnail"]["source"], pg.get("pageimage"), pg.get("title")
    return None, None, None

def resolve(name, team):
    r1 = api({"action": "query", "format": "json", "redirects": 1, "prop": "pageimages",
              "piprop": "thumbnail|name", "pithumbsize": 600, "titles": name})
    if r1 is API_FAIL: return None, None, None, True
    for pg in r1.get("query", {}).get("pages", {}).values():
        if "thumbnail" in pg: return pg["thumbnail"]["source"], pg.get("pageimage"), pg.get("title"), False
    sr = api({"action": "query", "format": "json", "list": "search",
              "srsearch": f"{name} {team} footballer", "srlimit": 1})
    if sr is API_FAIL: return None, None, None, True
    hits = sr.get("query", {}).get("search", [])
    if hits:
        u, fn, ti, _ = (*thumb_for_title(hits[0]["title"]), False)
        return u, fn, ti, False
    return None, None, None, False

def license_of(fname):
    if not fname: return "", ""
    try:
        r = api({"action": "query", "format": "json", "titles": "File:" + fname,
                 "prop": "imageinfo", "iiprop": "extmetadata"})
        for pg in r.get("query", {}).get("pages", {}).values():
            md = pg["imageinfo"][0]["extmetadata"]
            lic = md.get("LicenseShortName", {}).get("value", "")
            art = md.get("Artist", {}).get("value", "")
            import re
            art = re.sub("<[^>]+>", "", art)[:80]
            return lic, art
    except Exception:
        pass
    return "", ""

def main():
    players = json.load(open(DATA))["players"]
    os.makedirs(REFS, exist_ok=True)
    rows, got = [], 0
    for p in players:
        pid, name = p["player_id"], p["player_name"]
        outf = os.path.join(REFS, f"{pid}.jpg")
        if os.path.exists(outf):
            continue
        try:
            url, fname, title, failed = resolve(name, p["team_name"])
            if failed:
                print(f"~ api busy, will retry later: {name}"); continue   # don't mark as no-image
            if not url:
                print(f"· no image: {name}"); rows.append([pid, name, "", "", "", ""]); continue
            img = S.get(url, timeout=60, headers={"Referer": "https://en.wikipedia.org/"}).content
            if not is_image(img):
                print(f"· blocked/non-image: {name}"); rows.append([pid, name, title or "", url, "BLOCKED", ""]); continue
            open(outf, "wb").write(img)
            lic, art = ('','') if '--fast' in sys.argv else license_of(fname)
            rows.append([pid, name, title or "", url, lic, art])
            got += 1
            print(f"✓ {pid} {name}  [{lic or '?'}]")
            time.sleep(1.1 if '--fast' in sys.argv else 0.3)
            if LIMIT and got >= LIMIT: break
        except Exception as e:
            print(f"✗ {name}: {e}"); time.sleep(1)
    # append/refresh sources log
    newfile = not os.path.exists(os.path.join(REFS, "_sources.csv"))
    with open(os.path.join(REFS, "_sources.csv"), "a", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        if newfile: w.writerow(["player_id", "name", "wiki_title", "image_url", "license", "artist"])
        w.writerows(rows)
    print(f"\nfetched {got} new images -> refs/  (log: refs/_sources.csv)")

if __name__ == "__main__":
    main()
