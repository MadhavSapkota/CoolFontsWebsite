"""Collect long-tail keyword ideas from Google Autocomplete (free, no API key).
Usage: python3 tools/suggest_keywords.py  -> prints new ideas, saves to keywords/ideas.txt"""
import json, os, urllib.parse, urllib.request
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SEEDS = ["kaomoji", "cute kaomoji", "text faces", "kawaii faces", "japanese emoticons",
         "discord fonts", "aesthetic fonts", "fancy text", "cursive fonts", "instagram bio fonts",
         "font keyboard", "fonts keyboard android", "cool symbols", "bubble letters", "tiny text",
         "cute symbols", "whatsapp fonts", "tiktok fonts", "stylish text", "text art"]
def suggest(q):
    url = "https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=us&q=" + urllib.parse.quote(q)
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (compatible; keyword-research-script)"})
    with urllib.request.urlopen(req, timeout=10) as r:
        return json.loads(r.read().decode("utf-8", "replace"))[1]
path = os.path.join(ROOT, "keywords", "ideas.txt")
seen = set(open(path).read().split("\n")) if os.path.exists(path) else set()
new = []
for seed in SEEDS:
    for extra in ["", " how to", " for", " copy and paste", " app", " android"]:
        try: res = suggest(seed + extra)
        except Exception as e: print("skip", seed + extra, e); continue
        for k in res:
            k = k.strip().lower()
            if k and k not in seen: seen.add(k); new.append(k)
with open(path, "a") as f: f.writelines(k + "\n" for k in new)
print(f"{len(new)} new ideas"); print("\n".join(new[:50]))
