#!/usr/bin/env python3
"""
Turn fetched reference photos (refs/<id>.jpg) into clean square card portraits
(public/faces/<id>.png) and write attribution -> public/faces/_credits.json.

  pip install pillow requests
  python3 scripts/process_faces.py

- center-crops to a square, resizes to 512px, saves PNG where FutCard auto-loads it
- pulls Wikimedia license + author for each kept image (polite) for attribution
"""
import os, glob, json, time
import requests
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REFS = os.path.join(ROOT, "refs")
OUT = os.path.join(ROOT, "public", "faces")
API = "https://en.wikipedia.org/w/api.php"
S = requests.Session()
S.headers["User-Agent"] = "WC26Matchday/1.0 (Astro WC2026 data explorer; image processing)"

def square(path, out, size=512):
    im = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
    w, h = im.size
    s = min(w, h)
    # crop centered but biased slightly toward the top (faces sit high in portraits)
    left = (w - s) // 2
    top = max(0, (h - s) // 2 - int(h * 0.08))
    im = im.crop((left, top, left + s, top + s)).resize((size, size), Image.LANCZOS)
    im.save(out, "PNG")

def credit(src):
    """given an image_url, fetch its Commons file license + author"""
    fname = src.split("/")[-1].split("?")[0]
    fname = requests.utils.unquote(fname)
    for attempt in range(4):
        try:
            r = S.get(API, params={"action": "query", "format": "json", "titles": "File:" + fname,
                      "prop": "imageinfo", "iiprop": "extmetadata"}, timeout=30)
            if r.status_code == 429: time.sleep(4 * (attempt + 1)); continue
            for pg in r.json().get("query", {}).get("pages", {}).values():
                md = pg.get("imageinfo", [{}])[0].get("extmetadata", {})
                import re
                art = re.sub("<[^>]+>", "", md.get("Artist", {}).get("value", ""))[:80].strip()
                return md.get("LicenseShortName", {}).get("value", ""), art
        except Exception:
            time.sleep(2)
    return "", ""

def main():
    os.makedirs(OUT, exist_ok=True)
    # map id -> source url from the fetch log
    src = {}
    sf = os.path.join(REFS, "_sources.csv")
    if os.path.exists(sf):
        import csv
        for row in csv.DictReader(open(sf, encoding="utf-8")):
            if row.get("image_url"): src[row["player_id"]] = row["image_url"]
    credits = {}
    n = 0
    for f in sorted(glob.glob(os.path.join(REFS, "*.jpg")) + glob.glob(os.path.join(REFS, "*.png"))):
        pid = os.path.splitext(os.path.basename(f))[0]
        if os.path.getsize(f) < 2000: continue
        try:
            square(f, os.path.join(OUT, f"{pid}.png"))
            lic, art = credit(src.get(pid, "")) if src.get(pid) else ("", "")
            credits[pid] = {"src": src.get(pid, ""), "license": lic, "artist": art}
            n += 1
            if n % 50 == 0: print(f"  …{n}")
            time.sleep(0.25)
        except Exception as e:
            print(f"✗ {pid}: {e}")
    json.dump(credits, open(os.path.join(OUT, "_credits.json"), "w"), ensure_ascii=False, indent=0)
    print(f"processed {n} portraits -> public/faces/  (+ _credits.json)")

if __name__ == "__main__":
    main()
