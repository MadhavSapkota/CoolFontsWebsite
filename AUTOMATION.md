# Weekly SEO blog automation

This repo publishes to https://coolfontskeyboard.app via GitHub Pages (branch `master`).
A scheduled agent runs **every day** and publishes **1 article per run**. Everything runs without human review.

## Strategy: own every long-tail angle
Cover every search related to what the app does, cluster by cluster, until each topic is fully covered:
- **Kaomoji & text faces** — by emotion/animal, how to type, meaning, for each app
- **Fonts for apps** — Instagram bio, TikTok, Discord, WhatsApp, Snapchat, Roblox/gaming names
- **Font styles** — cursive, aesthetic, bold, bubble, tiny/small text, gothic, glitch, upside-down
- **Symbols & text art** — hearts, stars, arrows, sparkles, borders, cute symbols
- **Keyboards & how-to** — font keyboard for Android, type fonts without copy-paste, fixing fonts that show as boxes
- **Comparisons** — "best font keyboard apps for Android", copy-paste sites vs keyboard. Be fair and factual about other products; never invent their prices, ratings or flaws.
Each run, prefer the cluster with the fewest posts so coverage grows evenly.

## Steps
1. `git pull` on `master`.
2. Run `python3 tools/suggest_keywords.py` to refresh `keywords/ideas.txt` (Google Autocomplete long-tail ideas).
3. **Daily keyword research (do this every run, with WebSearch / WebFetch):**
   a. Shortlist 5 **long-tail** candidate keywords (3+ words, e.g. "bear kaomoji copy and paste", "discord name fonts copy paste"): unused ones from `keywords/keywords.tsv` with **100–10,000 searches** and Low competition
      plus fresh long-tail phrases from `keywords/ideas.txt`, from the cluster with the fewest posts.
   b. For each candidate, web-search it and look at the top ~10 results. Score the opportunity:
      - **Easy** if the top results include forums (Reddit, Quora), thin generator pages, small blogs, or pages that don't match the search intent.
      - **Hard** if the top results are all big authority sites with in-depth guides.
      - Note the search intent (copy-paste list? how-to? app search? comparison?) and what the top pages are missing.
   c. Pick the ONE candidate with the best mix of search volume, easy competition and relevance to the app.
   d. Save the analysis to `keywords/research/<YYYY-MM-DD>.md`: the candidates, their volume (or "no data"),
      the competition notes, the pick and why, and an outline that beats the current top results
      (more examples, clearer steps, better FAQ, answers the gaps).
   e. If live search is unavailable, pick from `keywords/keywords.tsv` by volume and competition and say so in the research file.
4. Write the post following the research outline as `blog/posts/<slug>.json` with fields:
   `slug, title, desc, tag, read, date (YYYY-MM-DD, today), keyword, body` — same format as `blog/posts/kaomoji-copy-and-paste.json`.
   - Structure: the reader's goal → useful, specific content (copyable examples in `<div class="kgrid"><button class="k" type="button">…</button></div>` grids when it fits) → the **problem with the usual way** (copy-paste websites, switching apps, boxes/broken symbols, no preview) → **Cool Fonts Keyboard as the solution** (link `href="PLAY"`) → short FAQ using long-tail phrases from `keywords/ideas.txt`.
   - Put the target keyword in the title, description, first paragraph and one H2. Use 3–6 related long-tail phrases naturally in H2s/FAQ.
   - 700–1200 words. Genuinely useful; no keyword stuffing; no made-up statistics, reviews, or app features.
   - App facts you may state: Android keyboard; 1000+ fonts, emojis and kaomoji; Cute / Aesthetic / Gamer / Kaomoji tabs; works in any app with no copy and paste.
   - Link to an existing post with a relative link (`<slug>.html`) and to `../#fonts` or `../#kaomoji` where relevant.
   - Count any "N+" claim in the title and make it true.
5. Run `python3 tools/build_blog.py` — it rebuilds every post page, `blog/index.html` and `sitemap.xml`.
6. Verify: the new HTML file exists, has the keyword in `<title>`, and no literal `PLAY` href remains.
7. Append the target keyword to `keywords/used.txt`.
8. Commit with message `Blog: <title>` and push to `master`.
