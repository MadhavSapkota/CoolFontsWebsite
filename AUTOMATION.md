# Weekly SEO blog automation

This repo publishes to https://coolfontskeyboard.app via GitHub Pages (branch `master`).
A scheduled agent runs **every day** and publishes **2 articles per run**. Everything runs without human review.

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
3. Pick TWO different target keywords (from different clusters when possible), and do steps 4–7 for each:
   - Prefer rows in `keywords/keywords.tsv` (real Keyword Planner data: keyword, avg monthly searches, competition, competition index)
     with **500–50,000 searches**, **Low** competition, related to fonts / text / kaomoji / symbols / keyboards.
   - Fall back to a phrase from `keywords/ideas.txt` only if no TSV row qualifies.
   - Skip anything in `keywords/used.txt` or already covered by a post in `blog/posts/` (check titles and `keyword` fields).
   - Skip brand names of other companies and anything unrelated to the app.
4. Write each post as `blog/posts/<slug>.json` with fields:
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
8. Commit once with message `Blog: <title 1> + <title 2>` and push to `master`.
