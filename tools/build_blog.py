import json, os, sys
ROOT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
SITE = "https://coolfontskeyboard.app"
PLAY = "https://play.google.com/store/apps/details?id=com.sapkotamadhav.fonts.collections"
DATE = "2026-11-07"

import glob, datetime
POSTS = sorted((json.load(open(f)) for f in glob.glob(os.path.join(ROOT,"blog","posts","*.json"))), key=lambda p: p["date"], reverse=True)
def nice(d): return datetime.date.fromisoformat(d).strftime("%B %-d, %Y")
DATE = max(p["date"] for p in POSTS)

def page(title, desc, canon, body, ld, rel=""):
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{canon}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{canon}">
<meta property="og:image" content="{SITE}/icon.png">
<meta name="twitter:card" content="summary">
<link rel="icon" href="{rel}../icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../style.css">
<link rel="stylesheet" href="blog.css">
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
</head>
<body>
<header class="top">
  <a class="logo" href="../"><img class="logo-img" src="../icon.png" alt="Cool Fonts app icon"><span><i>Cool</i>fonts<sup>✦</sup></span></a>
  <nav><a href="../#fonts">Fonts</a><a href="../#kaomoji">Kaomoji</a><a href="./">Blog</a></nav>
  <a class="get-app" href="{PLAY}" target="_blank" rel="noopener">Get the App ↗</a>
</header>
{body}
<footer><span class="logo"><img class="logo-img" src="../icon.png" alt=""><i>Cool</i>fonts</span><span>copy · paste · shine ✦</span></footer>
<script>document.querySelectorAll('.k').forEach(b=>b.onclick=()=>{{navigator.clipboard&&navigator.clipboard.writeText(b.textContent);const t=b.textContent;b.textContent='Copied ✓';b.classList.add('ok');setTimeout(()=>{{b.textContent=t;b.classList.remove('ok')}},900)}})</script>
</body>
</html>
"""

cta = f"""<aside class="post-cta"><img src="../icon.png" alt="" width="64" height="64"><div><b>Cool Fonts Keyboard</b><p>Type in 1000+ fonts, emojis and kaomoji in any app. No copy and paste.</p></div><a href="{PLAY}" target="_blank" rel="noopener">▶ Get it on Google Play</a></aside>"""

for i, p in enumerate(POSTS):
    url = f"{SITE}/blog/{p['slug']}.html"
    others = "".join(f'<li><a href="{o["slug"]}.html">{o["title"]}</a></li>' for o in POSTS if o is not p)
    body = f"""<article class="post">
  <a class="back" href="./">← All articles</a>
  <p class="eyebrow">{p['tag']} · {p['read']} min read</p>
  <h1>{p['title']}</h1>
  <p class="meta">Published <time datetime="{p['date']}">{nice(p['date'])}</time></p>
  {p['body'].replace('href="PLAY"', f'href="{PLAY}" target="_blank" rel="noopener"')}
  {cta}
</article>"""
    ld = {"@context":"https://schema.org","@type":"BlogPosting","headline":p['title'],"description":p['desc'],
          "datePublished":p["date"],"dateModified":p["date"],"mainEntityOfPage":url,"image":f"{SITE}/icon.png",
          "author":{"@type":"Organization","name":"Cool Fonts Keyboard"},
          "publisher":{"@type":"Organization","name":"Cool Fonts Keyboard","logo":{"@type":"ImageObject","url":f"{SITE}/icon.png"}}}
    open(os.path.join(ROOT,"blog",p['slug']+".html"),"w").write(page(p['title']+" | Cool Fonts", p['desc'], url, body, ld))

cards = "".join(f"""<a class="b-card" href="{p['slug']}.html"><span class="eyebrow">{p['tag']} · {p['read']} min</span><h2>{p['title']}</h2><p>{p['desc']}</p><span class="more">Read article →</span></a>""" for p in POSTS)
idx = f"""<section class="blog-hero"><p class="eyebrow">The Cool Fonts Blog</p><h1>Fonts, bios &amp; <em>aesthetic</em> text — explained.</h1><p class="sub">Fix font problems, style your Instagram bio, and type fancy text faster on Android.</p></section>
<main class="b-grid">{cards}</main>"""
ld = {"@context":"https://schema.org","@type":"Blog","name":"Cool Fonts Blog","url":f"{SITE}/blog/",
      "blogPost":[{"@type":"BlogPosting","headline":p['title'],"url":f"{SITE}/blog/{p['slug']}.html","datePublished":p["date"]} for p in POSTS]}
open(os.path.join(ROOT,"blog","index.html"),"w").write(page("Blog — Cool Fonts Tips, Instagram Bio Fonts & Kaomoji","Guides on fancy fonts, Instagram bio fonts, kaomoji and fixing fonts that show as boxes — plus how to type cool fonts in any app on Android.",f"{SITE}/blog/",idx,ld))

urls = [(f"{SITE}/", DATE), (f"{SITE}/blog/", DATE)] + [(f"{SITE}/blog/{p['slug']}.html", p["date"]) for p in POSTS]
open(os.path.join(ROOT,"sitemap.xml"),"w").write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "".join(f"  <url><loc>{u}</loc><lastmod>{d}</lastmod></url>\n" for u, d in urls) + "</urlset>\n")
open(os.path.join(ROOT,"robots.txt"),"w").write(f"User-agent: *\nAllow: /\n\nSitemap: {SITE}/sitemap.xml\n")
print("built", len(POSTS), "posts")
