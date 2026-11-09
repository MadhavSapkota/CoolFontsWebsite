"""Offline end-to-end tests: all external APIs are mocked. No network, no credentials."""
from __future__ import annotations

import json
import shutil
from pathlib import Path

import pytest

from seo_agent import config as config_mod
from seo_agent import content, dataforseo, main, publisher, quality, research, search_console
from seo_agent.audit import crawl
from seo_agent.state import State

AGENT = Path(__file__).resolve().parent.parent
REPO = AGENT.parent

WORDS = ("kitten panda sparkle moon flower heart ribbon cloud star smile wink blush bunny bear puppy shrug sleepy happy tiny fluffy "
         "pastel neon gothic cursive bubble glitch serif bold italic script unicode glyph letter accent border arrow divider "
         "banner caption profile status").split()


def articles(site):
    return [p for p in (site / "blog").glob("*.html") if p.name != "index.html"]


def fake_body(topic: str) -> str:
    import random
    rnd = random.Random(7)
    sections = ["Why text faces work", "Simple steps that work", "Picking a style", "Where they display", "Common mistakes"]
    body = f"<p>Typing kaomoji for {topic} is easier with a few reliable steps.</p>"
    for s in sections:
        body += f"<h2>{s}</h2>"
        for _ in range(4):
            sent = " ".join(rnd.choice(WORDS) for _ in range(22))
            body += f"<p>Try pairing {sent}. Then compare {' '.join(rnd.choice(WORDS) for _ in range(20))}.</p>"
    body += '<p>See <a href="/">the home page</a>, <a href="/blog/">more guides</a> and <a href="https://evil.example.com">this</a>.</p>'
    return body


@pytest.fixture()
def site(tmp_path, monkeypatch):
    root = tmp_path / "repo"
    root.mkdir()
    (root / "seo-agent").mkdir()
    shutil.copytree(AGENT / "templates", root / "seo-agent" / "templates")
    (root / "blog").mkdir()
    shutil.copy(REPO / "blog" / "blog.css", root / "blog" / "blog.css")
    (root / "icon.png").write_text("x")
    (root / "style.css").write_text("x")
    (root / "privacy.html").write_text("<!doctype html><html><head><title>Privacy Policy | Cool Fonts</title></head><body><h1>Privacy</h1></body></html>")
    page = '<!doctype html><html><head><title>{t}</title><meta name="description" content="{d}"></head><body><h1>{t}</h1><p>{b}</p></body></html>'
    (root / "index.html").write_text(page.format(t="Cool Fonts Keyboard: 1000+ fonts", d="Copy cool fonts and kaomoji, or type them in any app with the Cool Fonts Android keyboard.", b="fonts"))
    (root / "robots.txt").write_text("User-agent: *\nAllow: /\n\nSitemap: https://yourdomain.com/sitemap.xml\n")
    cfg_text = ((AGENT / "seo-config.yaml").read_text().replace("organic_difficulty_source: none", "organic_difficulty_source: dataforseo")
                .replace("minimum_monthly_searches: 1000", "minimum_monthly_searches: 100")
                .replace("require_low_ads_competition: true", "require_low_ads_competition: false")
                .replace("rank_by: volume", "rank_by: score")
                .replace("unverified: 999999", "unverified: 30")
                .replace("min_ranking_opportunity: 0 ", "min_ranking_opportunity: 25 "))
    (root / "seo-agent" / "seo-config.yaml").write_text(cfg_text)
    real_load = config_mod.load_config
    monkeypatch.setattr(main, "load_config", lambda *a, **k: real_load(root=root))
    monkeypatch.setenv("SEO_AGENT_TODAY", "2026-11-01")
    for k in ("GSC_SERVICE_ACCOUNT_JSON",):
        monkeypatch.delenv(k, raising=False)
    return root


def mock_apis(monkeypatch, *, body=None, review=None, ideas=None):
    monkeypatch.setattr(research, "discover", lambda cfg, seeds=None: ideas or [
        {"keyword": "how to type kaomoji on android", "volume": 880, "source": "google_ads_keyword_planner"},
        {"keyword": "best font keyboard app", "volume": 5400, "source": "google_ads_keyword_planner"},
        {"keyword": "cute symbols for jobs", "volume": 300, "source": "google_ads_keyword_planner"},
        {"keyword": "pizza recipe", "volume": 90000, "source": "google_ads_keyword_planner"},
    ])
    monkeypatch.setattr(dataforseo, "available", lambda: True)
    monkeypatch.setattr(dataforseo, "keyword_difficulty", lambda cfg, kws: {"how to type kaomoji on android": 14, "best font keyboard app": 41})
    monkeypatch.setattr(dataforseo, "search_intent", lambda cfg, kws: {k: "informational" for k in kws})
    monkeypatch.setattr(dataforseo, "serp_top10", lambda cfg, kw: {"keyword": kw, "organic": [
        {"rank": 1, "url": "https://reddit.com/x", "domain": "reddit.com", "title": "Kaomoji help", "description": "..."}], "questions": ["How do I type kaomoji?"]})
    monkeypatch.setattr(content, "available", lambda: True)
    monkeypatch.setattr(content, "plan", lambda *a, **k: {"intent": "informational", "action": "new", "reason": "gap",
                                                         "slug": "how-to-type-kaomoji-on-android", "secondary_keywords": ["kaomoji on android"], "outline": []})
    monkeypatch.setattr(content, "write_article", lambda *a, **k: {
        "title": "How to Type Kaomoji on Android: Simple Steps",
        "meta_description": "Learn how to type kaomoji on android with easy formulas, undertone tips, and real examples you can wear today, from neutrals to brights.",
        "h1": "How to Type Kaomoji on Android", "body_html": body or fake_body("everyday wear"),
        "faqs": [{"question": "What is a kaomoji?", "answer": "A kaomoji is a Japanese-style text face."}],
        "cta_text": "Type kaomoji in any app with no copy and paste.", "summary": "Easy kaomoji steps."})
    # Rewrite mock: returns the draft unchanged (so a bad draft keeps failing through every revision).
    monkeypatch.setattr(content, "revise", lambda cfg, kw, plan, draft, feedback, facts: {**draft, "changes_made": []})
    monkeypatch.setattr(content, "review", lambda *a, **k: review or {"intent_match": True, "value_score": 8, "factual_issues": [],
                                                                       "invented_app_features": [], "unsupported_claims": [],
                                                                       "spam_policy_issues": [], "keyword_stuffing": False, "pass": True, "notes": "ok"})


def test_full_run_publishes_one_article(site, monkeypatch):
    mock_apis(monkeypatch)
    assert main.main(["run"]) == 0
    art = site / "blog" / "how-to-type-kaomoji-on-android.html"
    assert art.exists()
    html = art.read_text()
    assert html.count("<h1>") == 1
    assert '<link rel="canonical" href="https://coolfontskeyboard.app/blog/how-to-type-kaomoji-on-android.html">' in html
    assert "evil.example.com" not in html  # external links stripped
    assert 'href="/"' in html
    assert "play.google.com" in html
    ld = html.split('application/ld+json">')[1].split("</script>")[0]
    types = {g["@type"] for g in json.loads(ld)["@graph"]}
    assert {"Article", "BreadcrumbList", "FAQPage"} <= types
    sm = (site / "sitemap.xml").read_text()
    assert "https://coolfontskeyboard.app/blog/how-to-type-kaomoji-on-android.html" in sm and "yourdomain" not in sm
    assert "Sitemap: https://coolfontskeyboard.app/sitemap.xml" in (site / "robots.txt").read_text()
    assert "how-to-type-kaomoji-on-android" in (site / "blog" / "index.html").read_text()
    assert 'rel="canonical"' in (site / "index.html").read_text()
    st = json.loads((site / "seo-agent" / "data" / "state.json").read_text())
    assert st["keywords"]["best font keyboard app"]["decision"] == "rejected_difficulty"
    assert "pizza recipe" not in st["keywords"]  # filtered before paid difficulty lookups
    assert (site / "seo-agent" / "data" / "reports" / "2026-11-01.md").exists()
    # second run same day: no duplicate publishing
    assert main.main(["run"]) == 0
    assert len(articles(site)) == 1
    assert main.main(["check"]) == 0


def test_quality_gate_blocks_invented_features(site, monkeypatch):
    mock_apis(monkeypatch, body=fake_body("x") + "<p>Download it on the App Store for iPhone. Over 1 million users love it.</p>")
    main.main(["run"])
    assert not (site / "blog" / "how-to-type-kaomoji-on-android.html").exists()
    st = json.loads((site / "seo-agent" / "data" / "state.json").read_text())
    d = st["keywords"]["how to type kaomoji on android"]["decision"]
    assert "forbidden_claim" in d


def test_rejected_draft_is_rewritten_with_feedback_and_published(site, monkeypatch):
    bad = fake_body("x") + "<p>This keyboard is guaranteed to work everywhere.</p>"
    mock_apis(monkeypatch, body=bad)
    seen = []

    def fake_review(cfg, keyword, intent, article, facts):
        ok = "guaranteed" not in article["body_html"]
        return {"intent_match": True, "value_score": 8, "factual_issues": [] if ok else ["absolute promise"],
                "invented_app_features": [], "unsupported_claims": [], "spam_policy_issues": [], "keyword_stuffing": False,
                "pass": ok, "notes": ""}

    def fake_revise(cfg, kw, plan, draft, feedback, facts):
        seen.append(feedback)
        return {**draft, "body_html": draft["body_html"].replace("<p>This keyboard is guaranteed to work everywhere.</p>", ""),
                "changes_made": ["removed absolute promise"]}
    monkeypatch.setattr(content, "review", fake_review)
    monkeypatch.setattr(content, "revise", fake_revise)
    main.main(["run"])
    st = json.loads((site / "seo-agent" / "data" / "state.json").read_text())
    assert st["keywords"]["how to type kaomoji on android"]["decision"].startswith("published")
    assert len(seen) == 1 and any("absolute guarantee" in f for f in seen[0]["quality_gate_failures"])
    assert seen[0]["factual_issues"] == ["absolute promise"]
    assert "guaranteed" not in (site / "blog" / "how-to-type-kaomoji-on-android.html").read_text()
    assert st["articles"]["how-to-type-kaomoji-on-android"]["quality_gate"]["revisions"] == 1


def test_quality_gate_blocks_stuffing_and_failed_review(site, monkeypatch):
    stuffed = fake_body("x") + "<p>" + " ".join(["how to type kaomoji on android"] * 60) + "</p>"
    mock_apis(monkeypatch, body=stuffed, review={"pass": False, "intent_match": True, "value_score": 4})
    main.main(["run"])
    assert not (site / "blog" / "how-to-type-kaomoji-on-android.html").exists()
    st = json.loads((site / "seo-agent" / "data" / "state.json").read_text())
    d = st["keywords"]["how to type kaomoji on android"]["decision"]
    assert "keyword_stuffing" in d and "review_failed" in d


def test_no_qualifying_keyword_makes_no_article(site, monkeypatch):
    mock_apis(monkeypatch, ideas=[{"keyword": "cute kaomoji list", "volume": 50, "source": "google_ads_keyword_planner"}])
    main.main(["run"])
    assert not bool(articles(site))


def test_no_provider_never_fabricates(site, monkeypatch):
    mock_apis(monkeypatch)
    monkeypatch.setattr(research, "discover", research.__dict__["discover"].__wrapped__ if hasattr(research.discover, "__wrapped__") else research.discover)
    import importlib
    importlib.reload(research)
    for k in ("GOOGLE_ADS_DEVELOPER_TOKEN", "DATAFORSEO_LOGIN", "DATAFORSEO_PASSWORD"):
        monkeypatch.delenv(k, raising=False)
    monkeypatch.setattr(dataforseo, "available", lambda: False)
    main.main(["run"])
    assert not bool(articles(site))
    assert "No keyword volume provider" in (site / "seo-agent" / "data" / "reports" / "2026-11-01.md").read_text()


def test_near_duplicate_detection():
    a = "typing kaomoji is easier with a few reliable steps on android " * 5
    assert quality.similarity(a, a) > 0.9
    assert quality.similarity(a, "completely different text about hiking boots and trail running shoes") == 0.0


def test_ads_competition_not_used_as_difficulty(site, monkeypatch):
    mock_apis(monkeypatch, ideas=[{"keyword": "how to type kaomoji on android", "volume": 880, "ads_competition": "LOW",
                                   "source": "google_ads_keyword_planner"}])
    monkeypatch.setattr(dataforseo, "keyword_difficulty", lambda cfg, kws: {})  # no organic KD available
    main.main(["run"])
    assert not bool(articles(site))
    st = json.loads((site / "seo-agent" / "data" / "state.json").read_text())
    assert st["keywords"]["how to type kaomoji on android"]["decision"] == "rejected_no_organic_difficulty_data"


def test_real_repository_config_and_site_validate():
    cfg = config_mod.load_config()
    res = crawl(cfg)
    assert any(p.path == "index.html" for p in res["pages"])


def _free_mode(site):
    cfg_p = site / "seo-agent" / "seo-config.yaml"
    cfg_p.write_text(cfg_p.read_text().replace("organic_difficulty_source: dataforseo", "organic_difficulty_source: none"))


def test_low_cost_mode_keyword_planner_only(site, monkeypatch):
    _free_mode(site)
    mock_apis(monkeypatch, ideas=[
        {"keyword": "how to type kaomoji on android", "volume": 880, "ads_competition": "HIGH", "source": "google_ads_keyword_planner"},
        {"keyword": "aesthetic fonts", "volume": 90000, "source": "google_ads_keyword_planner"},
        {"keyword": "heart symbols for bios", "volume": 5400, "source": "google_ads_keyword_planner"},
    ])
    called = []
    monkeypatch.setattr(dataforseo, "keyword_difficulty", lambda *a: called.append(1) or {})
    monkeypatch.setattr(dataforseo, "serp_top10", lambda *a: called.append(1) or {})
    assert main.main(["run"]) == 0
    assert not called  # no paid SEO API calls
    html = (site / "blog" / "how-to-type-kaomoji-on-android.html").read_text()
    assert "Get Kaomoji on Your Keyboard" in html
    assert html.count('data-placement="inline"') == 1 and 'data-placement="end"' in html
    assert "googletagmanager" not in html  # no analytics until a privacy policy exists
    st = json.loads((site / "seo-agent" / "data" / "state.json").read_text())
    # broad head term: blocked by the ranking-opportunity gate
    assert st["keywords"]["aesthetic fonts"]["decision"] == "rejected_head_term_low_ranking_opportunity"
    rep = (site / "seo-agent" / "data" / "reports" / "2026-11-01.md").read_text()
    assert "NOT keyword difficulty" in rep and "Low-cost mode" in rep


def test_search_console_queries_without_keyword_planner(site, monkeypatch):
    _free_mode(site)
    mock_apis(monkeypatch)
    monkeypatch.setattr(research, "discover", lambda cfg, seeds=None: (_ for _ in ()).throw(research.NoProvider("no Ads API")))
    perf = {"queries_28d": [{"query": "how to make kaomoji on a phone", "impressions": 80, "clicks": 1, "ctr": 0.01, "position": 14.0},
                            {"query": "kaomoji meaning", "impressions": 5, "clicks": 0, "ctr": 0, "position": 40.0}]}
    from seo_agent.agents import analytics_agent
    monkeypatch.setattr(analytics_agent, "search_performance", lambda cfg, report: perf)
    monkeypatch.setattr(analytics_agent, "suggestions", lambda *a: [])
    assert main.main(["run"]) == 0
    st = json.loads((site / "seo-agent" / "data" / "state.json").read_text())
    kw = st["keywords"]["how to make kaomoji on a phone"]
    assert kw["decision"].startswith("published") and kw["latest"]["volume"] is None
    assert st["keywords"]["kaomoji meaning"]["decision"] == "rejected_volume_unverified_and_little_search_console_evidence"


def test_spending_limit_stops_generation(site, monkeypatch):
    mock_apis(monkeypatch)
    from seo_agent import budget as budget_mod
    real_write = content.write_article

    def capped(*a, **k):
        budget_mod.current().check()
        return real_write(*a, **k)
    monkeypatch.setattr(content, "write_article", capped)
    st_p = site / "seo-agent" / "data" / "state.json"
    st_p.parent.mkdir(parents=True)
    st_p.write_text(json.dumps({"usage": {"2026-11": {"claude_calls": 500, "input_tokens": 0, "output_tokens": 0, "usd_estimate": 99.0}}}))
    assert main.main(["run"]) == 0
    assert not bool(articles(site))
    assert "spending limit" in (site / "seo-agent" / "data" / "reports" / "2026-11-01.md").read_text()


def test_kaomoji_topic_gets_kaomoji_cta():
    from seo_agent.agents import conversion_agent
    assert conversion_agent.choose({"keyword": "cute kaomoji list", "h1": ""})["button"] == "Get Kaomoji on Your Keyboard"
    assert conversion_agent.choose({"keyword": "gothic text", "h1": ""})["button"] == "Get Cool Fonts Keyboard"


def test_google_ads_error_does_not_crash_run(site, monkeypatch):
    mock_apis(monkeypatch)
    import importlib
    importlib.reload(research)
    from seo_agent import keyword_planner
    monkeypatch.setattr(keyword_planner, "available", lambda: True)
    monkeypatch.setattr(keyword_planner, "keyword_ideas", lambda *a: (_ for _ in ()).throw(RuntimeError("DEVELOPER_TOKEN_NOT_APPROVED")))
    assert main.main(["run"]) == 0
    rep = (site / "seo-agent" / "data" / "reports" / "2026-11-01.md").read_text()
    assert "Keyword Planner unavailable" in rep


def test_default_verified_only_publishes_nothing_without_data(site, monkeypatch):
    _free_mode(site)
    mock_apis(monkeypatch)
    monkeypatch.setattr(research, "discover", lambda cfg, seeds=None: (_ for _ in ()).throw(research.NoProvider("no Ads API")))
    called = []
    monkeypatch.setattr(content, "suggest_topics", lambda *a, **k: called.append(1) or ["how to choose a cute kaomoji for your bio"])
    assert main.main(["run"]) == 0
    assert not called and not bool(articles(site))


def test_editorial_topics_when_enabled(site, monkeypatch):
    _free_mode(site)
    cfg_p = site / "seo-agent" / "seo-config.yaml"
    cfg_p.write_text(cfg_p.read_text().replace("enabled: false", "enabled: true"))
    mock_apis(monkeypatch)
    monkeypatch.setattr(research, "discover", lambda cfg, seeds=None: (_ for _ in ()).throw(research.NoProvider("no Ads API")))
    monkeypatch.setattr(content, "suggest_topics", lambda *a, **k: ["how to choose a cute kaomoji for your bio", "pizza"])
    assert main.main(["run"]) == 0
    st = json.loads((site / "seo-agent" / "data" / "state.json").read_text())
    kw = st["keywords"]["how to choose a cute kaomoji for your bio"]
    assert kw["decision"].startswith("published") and kw["latest"]["volume"] is None
    assert kw["latest"]["source"] == "editorial (volume unverified)"


def _cfg(site):
    return config_mod.load_config(root=site)


def test_tool_matching(site):
    from seo_agent import tools
    cfg = _cfg(site)
    assert tools.tool_for(cfg, "heart symbol copy and paste") == {"kind": "symbols", "preset": "hearts"}
    assert tools.tool_for(cfg, "cursive font generator") == {"kind": "fonts", "preset": "cursive"}
    assert tools.tool_for(cfg, "discord font generator") == {"kind": "fonts", "preset": "gaming"}
    assert tools.tool_for(cfg, "what is a font") is None  # no generator intent
    assert tools.tool_for(cfg, "start symbol") is None    # "star" must match a whole word


def test_tool_keywords_with_ranking_chance_go_first(site):
    text = (site / "seo-agent" / "seo-config.yaml").read_text().replace("rank_by: score", "rank_by: volume")
    (site / "seo-agent" / "seo-config.yaml").write_text(text)
    cfg = _cfg(site)
    c = [{"keyword": "kaomoji", "volume": 165000, "score": {"ranking_opportunity": 0}},
         {"keyword": "copy and paste fonts", "volume": 165000, "score": {"ranking_opportunity": 15}},
         {"keyword": "cute symbols copy and paste", "volume": 33100, "score": {"ranking_opportunity": 45}},
         {"keyword": "heart symbol copy and paste", "volume": 110000, "score": {"ranking_opportunity": 30}}]
    assert [i["keyword"] for i in research.order_by_cluster(c, {}, cfg)][:2] == ["heart symbol copy and paste", "cute symbols copy and paste"]


def test_tool_page_renders_and_counts_toward_daily_limit(site, monkeypatch):
    mock_apis(monkeypatch, ideas=[{"keyword": "how to type kaomoji on android", "volume": 880, "source": "google_ads_keyword_planner"}])
    from seo_agent import tools
    monkeypatch.setattr(tools, "tool_for", lambda cfg, kw: {"kind": "symbols", "preset": "hearts"})
    assert main.main(["run"]) == 0
    html = (site / "blog" / "how-to-type-kaomoji-on-android.html").read_text()
    assert 'data-tool="symbols"' in html and "/blog/tools.js" in html and '"WebApplication"' in html
    assert html.count("/analytics.js") == 1 and "googletagmanager" not in html
    assert main.main(["run"]) == 0
    assert len(articles(site)) == 1  # a tool page uses the single daily slot


def test_state_compacts_and_stays_valid_json(site, monkeypatch):
    cfg = _cfg(site)
    from seo_agent import state as state_mod
    s = state_mod.State.__new__(state_mod.State)
    s.path = cfg.data_dir / "state.json"
    s.data = {"version": 1, "articles": {}, "runs": [], "page_updates": [], "keywords": {}}
    junk = {"volume": 10, "source": "x", "score_evidence": {"a": "b" * 500}, "feature": "symbols"}
    for d in ("2026-11-01", "2026-11-02"):
        monkeypatch.setenv("SEO_AGENT_TODAY", d)
        s.record_keyword("low one", junk, "rejected_low_volume")
    s.record_keyword("cand", {**junk, "score_evidence": {"keep": 1}}, "candidate")
    s.record_keyword("bad draft", junk, "rejected_by_quality_gate: x")
    monkeypatch.setenv("SEO_AGENT_TODAY", "2026-11-02")
    s.save()
    d = json.loads(s.path.read_text())
    assert len(d["keywords"]["low one"]["history"]) == 1 and d["keywords"]["low one"]["history"][0]["date"] == "2026-11-02"
    assert "score_evidence" not in d["keywords"]["low one"]["latest"] and d["keywords"]["low one"]["latest"]["volume"] == 10
    assert "keep" in d["keywords"]["cand"]["latest"]["score_evidence"]
    assert s.rejected_recently("bad draft")
    monkeypatch.setenv("SEO_AGENT_TODAY", "2027-02-01")
    s.save()
    d = json.loads(s.path.read_text())
    assert "low one" not in d["keywords"] and "cand" in d["keywords"] and "bad draft" in d["keywords"]
