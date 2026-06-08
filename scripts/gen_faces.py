#!/usr/bin/env python3
"""
Batch-generate anime profile pictures for every WC2026 player, from a reference
face photo, and drop them where the site auto-loads them: public/faces/<id>.png

PIPELINE
  1. reference photo  refs/<player_id>.{jpg,png,webp}   (you provide / fetch_refs.py)
  2. face -> anime    via Replicate `fofr/face-to-many` (style="Anime")
  3. transparent bg   via rembg
  4. save             public/faces/<player_id>.png   (FutCard renders it automatically)

SETUP
  pip install replicate rembg pillow requests
  export REPLICATE_API_TOKEN=r8_xxx        # https://replicate.com/account
  python3 scripts/gen_faces.py             # add --limit 20 to test first

NOTES / RIGHTS
  Generating anime derivatives of real people's faces has likeness/IP
  implications — fine for personal use; get advice before commercial deployment.
  ~1,247 images on Replicate ≈ $15-60 depending on the model. Re-runs skip files
  that already exist (resumable).
"""
import os, sys, json, io, glob, time
import requests

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "public", "data.json")
REFS = os.path.join(ROOT, "refs")
OUT  = os.path.join(ROOT, "public", "faces")
LIMIT = int(sys.argv[sys.argv.index("--limit") + 1]) if "--limit" in sys.argv else 0

KIT = {  # rough national kit colour for the prompt
    "Argentina": "sky blue and white striped", "Brazil": "yellow and green",
    "France": "blue", "England": "white", "Spain": "red", "Germany": "white",
    "Portugal": "dark red", "Netherlands": "orange", "Mexico": "green",
}

def prompt_for(p):
    nat = p["team_name"]
    kit = KIT.get(nat, "national team")
    return (f"masterpiece, best quality, anime portrait of a {nat} football player, "
            f"head and shoulders, centered, facing camera, confident determined gaze, "
            f"detailed eyes, clean cel-shading, vibrant colors, modern sports-anime style "
            f"(Blue Lock inspired), wearing a {kit} football jersey, soft studio rim-light, "
            f"plain dark background, sharp lineart, character trading-card portrait")

def ref_path(pid):
    for ext in ("png", "jpg", "jpeg", "webp"):
        f = os.path.join(REFS, f"{pid}.{ext}")
        if os.path.exists(f):
            return f
    return None

def main():
    import replicate
    from rembg import remove
    from PIL import Image

    players = json.load(open(DATA))["players"]
    os.makedirs(OUT, exist_ok=True)
    done = skip = fail = 0
    for p in players:
        pid = p["player_id"]
        outf = os.path.join(OUT, f"{pid}.png")
        if os.path.exists(outf):
            skip += 1; continue
        ref = ref_path(pid)
        if not ref:
            print(f"· no reference for {pid} {p['player_name']}"); skip += 1; continue
        try:
            out = replicate.run(
                "fofr/face-to-many",
                input={"image": open(ref, "rb"), "style": "Anime",
                       "prompt": prompt_for(p), "prompt_strength": 4.5,
                       "denoising_strength": 0.65, "instant_id_strength": 0.8, "seed": pid},
            )
            url = out[0] if isinstance(out, list) else out
            raw = requests.get(str(url), timeout=120).content
            cut = remove(raw)                          # transparent background
            Image.open(io.BytesIO(cut)).convert("RGBA").save(outf)
            done += 1; print(f"✓ {pid} {p['player_name']}")
            if LIMIT and done >= LIMIT: break
        except Exception as e:
            fail += 1; print(f"✗ {pid} {p['player_name']}: {e}"); time.sleep(2)
    print(f"\ndone={done} skipped={skip} failed={fail} -> public/faces/")

if __name__ == "__main__":
    if not os.environ.get("REPLICATE_API_TOKEN"):
        sys.exit("Set REPLICATE_API_TOKEN first (https://replicate.com/account)")
    main()
