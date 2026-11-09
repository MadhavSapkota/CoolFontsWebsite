"""Register posts written by the old routine (blog/posts/*.json) so the agent lists and de-duplicates them.
Idempotent; existing HTML pages are not rewritten. Run from anywhere: python3 seo-agent/tools/import_existing_posts.py"""
import json
import re
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
DATA = REPO / "seo-agent" / "data"
STATE = DATA / "state.json"
state = json.loads(STATE.read_text(encoding="utf-8")) if STATE.exists() else {"version": 1, "keywords": {}, "articles": {}, "runs": [], "page_updates": []}
(DATA / "articles").mkdir(parents=True, exist_ok=True)
added = 0
for f in sorted((REPO / "blog" / "posts").glob("*.json")):
    p = json.loads(f.read_text(encoding="utf-8"))
    if p["slug"] in state["articles"]:
        continue
    a = {"slug": p["slug"], "keyword": p["keyword"].lower(), "title": p["title"], "h1": p["title"], "meta_description": p["desc"],
         "summary": p["desc"], "tag": p.get("tag"), "body_html": p["body"], "faqs": [], "secondary_keywords": [],
         "published": p["date"], "modified": p["date"], "imported": True}
    (DATA / "articles" / f"{p['slug']}.json").write_text(json.dumps(a, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    state["articles"][p["slug"]] = {k: v for k, v in a.items() if k != "body_html"}
    added += 1
STATE.write_text(json.dumps(state, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print(f"imported {added} post(s)")
