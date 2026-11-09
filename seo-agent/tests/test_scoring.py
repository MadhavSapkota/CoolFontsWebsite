"""Scoring, feature classification, intent duplicates, publishing format, claims, and guardrails."""
from __future__ import annotations

import json
import re
import shutil
from pathlib import Path

import pytest

from seo_agent import config as config_mod
from seo_agent import http, intent, main, publisher, quality, reports, research, scoring
from seo_agent.state import State

from test_agent import articles, fake_body, mock_apis, site  # noqa: F401  (fixture re-export)


@pytest.fixture(scope="module")
def cfg():
    return config_mod.load_config()


@pytest.mark.parametrize("kw,feature", [
    ("bear kaomoji copy and paste", "kaomoji"), ("japanese emoticons list", "kaomoji"),
    ("fonts for instagram captions", "social-fonts"), ("tiktok fonts", "social-fonts"),
    ("discord font generator", "gaming-names"), ("roblox name fonts", "gaming-names"),
    ("cursive fonts copy and paste", "font-styles"), ("bubble letters", "font-styles"),
    ("cute symbols copy and paste", "symbols"), ("text art for bio", "symbols"),
    ("font keyboard for android", "keyboard-howto"), ("how to change keyboard font on samsung", "keyboard-howto"),
    ("best font keyboard apps", "comparisons"),
])
def test_every_feature_is_classified(cfg, kw, feature):
    assert scoring.classify(cfg, kw)[0] == feature


def test_duplicate_intent_blocked_by_meaning_not_shared_words(cfg):
    arts = {"cool-letter-fonts": {"keyword": "cool letter fonts", "secondary_keywords": []}}
    d = intent.duplicate_of(cfg, "letter fonts cool", "font-styles", arts, [])
    assert d and d["slug"] == "cool-letter-fonts"
    assert intent.duplicate_of(cfg, "bear kaomoji copy and paste", "kaomoji", arts, []) is None


def test_mix_boost_favors_uncovered_features(cfg):
    arts = {"a": {"keyword": "cute kaomoji list"}}
    assert scoring.mix_boost(cfg, "social-fonts", arts) > scoring.mix_boost(cfg, "kaomoji", arts)


def test_copy_grid_survives_but_scripts_do_not(cfg):
    dirty = '<div class="kgrid"><button class="k" type="button">(^_^)</button></div><div class="x" onclick="a()">y</div><script>x()</script>'
    clean = publisher.sanitize_body(cfg, dirty, publisher.article_url(cfg, "a-b"))
    assert '<div class="kgrid"><button' in clean and 'class="k"' in clean and "(^_^)" in clean
    assert "onclick" not in clean and "<script" not in clean and 'class="x"' not in clean


def test_urls_match_existing_site_format(cfg):
    assert publisher.article_url(cfg, "fonts-for-instagram") == "https://coolfontskeyboard.app/blog/fonts-for-instagram.html"
    assert publisher.article_path(cfg, "a-b").name == "a-b.html"


@pytest.mark.parametrize("claim,label", [
    ("Cool Fonts Keyboard is completely free.", "unconfirmed pricing claim"),
    ("The app never collects what you type.", "unconfirmed privacy claim"),
    ("Download it on the App Store for iPhone.", "claims iOS availability"),
    ("Cool Fonts is partnered with Instagram.", "implied platform affiliation"),
    ("Over 2 million downloads so far.", "invented usage numbers"),
])
def test_banned_claims_are_blocked(claim, label):
    assert label in {l for p, l in quality.FORBIDDEN if re.search(p, quality.claim_text(claim), flags=re.I)}


def test_denials_and_questions_are_not_claims():
    ok = "Is the app free? Cool Fonts is not affiliated with Instagram."
    assert not [l for p, l in quality.FORBIDDEN if re.search(p, quality.claim_text(ok), flags=re.I)]


def test_import_registers_old_posts_without_rewriting_them(tmp_path):
    root = tmp_path / "repo"
    tool = root / "seo-agent" / "tools" / "import_existing_posts.py"
    tool.parent.mkdir(parents=True)
    shutil.copy(Path(__file__).parents[1] / "tools" / "import_existing_posts.py", tool)
    (root / "blog" / "posts").mkdir(parents=True)
    (root / "blog" / "x-y.html").write_text("original")
    (root / "blog" / "posts" / "x-y.json").write_text(json.dumps({"slug": "x-y", "title": "T", "desc": "D", "date": "2026-11-09", "keyword": "Cool Key", "body": "<p>b</p>"}))
    import runpy
    (root / "seo-agent" / "data").mkdir()
    for _ in range(2):
        runpy.run_path(str(tool))
    st = json.loads((root / "seo-agent" / "data" / "state.json").read_text())
    assert list(st["articles"]) == ["x-y"] and st["articles"]["x-y"]["keyword"] == "cool key"
    assert (root / "blog" / "x-y.html").read_text() == "original"


def test_no_reference_project_text_left(cfg):
    pat = re.compile(r"fitcheck|outfit|makeup|hairstyle|dermatolog|fashion", re.I)
    files = [p for d in ("seo_agent", "templates") for p in (cfg.agent_dir / d).rglob("*") if p.is_file() and "__pycache__" not in p.parts]
    files += [cfg.agent_dir / "seo-config.yaml"]
    assert [str(p) for p in files if pat.search(p.read_text(encoding="utf-8"))] == []


def test_spending_cap_and_workflow_guards(cfg):
    assert cfg.get("limits.max_monthly_usd") == 15 and cfg.get("publishing.max_new_articles_per_day") == 1
    wf = (cfg.root / ".github" / "workflows" / "daily-seo.yml").read_text()
    assert "concurrency:" in wf and "refs/heads/master" in wf and "pages/builds" in wf and "git add -A" not in wf


def test_irrelevant_keyword_never_qualifies_even_if_easy(cfg):
    i = scoring.score(cfg, {"keyword": "how to make sourdough bread at home easily", "volume": 500,
                            "source": "google_ads_keyword_planner"}, [], {})
    assert i["score"]["feature_relevance"] == 0
    assert scoring.qualifies(cfg, i, 0) == "rejected_low_feature_relevance"
    assert not research.relevant(cfg, "how to make sourdough bread at home easily")


def test_score_components_and_weights(cfg):
    i = scoring.score(cfg, {"keyword": "font keyboard for android", "volume": 1000, "source": "google_ads_keyword_planner"}, [], {})
    s = i["score"]
    assert set(s) == {"feature_relevance", "ranking_opportunity", "search_demand", "conversion_potential", "content_usefulness"}
    assert all(0 <= v <= 100 for v in s.values())
    assert s["search_demand"] == 60  # 20 * log10(1000)
    expect = round(.30 * s["feature_relevance"] + .25 * s["ranking_opportunity"] + .15 * s["search_demand"]
                   + .20 * s["conversion_potential"] + .10 * s["content_usefulness"], 1)
    assert i["score_total"] == expect
    assert "verified 1000/mo" in i["score_evidence"]["search_demand"]


def test_unverified_volume_is_never_invented(cfg):
    i = scoring.score(cfg, {"keyword": "kaomoji keyboard app", "volume": None, "source": "editorial"}, [], {})
    assert i["score"]["search_demand"] == 0 and "unverified" in i["score_evidence"]["search_demand"]


def test_owner_keyword_rule(cfg):
    i = scoring.score(cfg, {"keyword": "font generator", "volume": 1000000, "source": "google_ads_keyword_planner"}, [], {})
    assert i["feature"] == "font-styles" and scoring.qualifies(cfg, i) is None
    assert cfg.get("keyword_research.minimum_monthly_searches") == 1000
    assert cfg.get("keyword_research.require_low_ads_competition") is True and cfg.get("keyword_research.rank_by") == "volume"


def test_rule_rejects_high_competition_and_low_volume(site, monkeypatch):
    p = site / "seo-agent" / "seo-config.yaml"
    p.write_text(p.read_text().replace("organic_difficulty_source: dataforseo", "organic_difficulty_source: none")
                 .replace("minimum_monthly_searches: 100", "minimum_monthly_searches: 1000")
                 .replace("require_low_ads_competition: false", "require_low_ads_competition: true"))
    mock_apis(monkeypatch, ideas=[
        {"keyword": "how to type kaomoji on android", "volume": 5000, "ads_competition": "HIGH", "source": "google_ads_keyword_planner"},
        {"keyword": "cute kaomoji list for bios", "volume": 900, "ads_competition": "LOW", "source": "google_ads_keyword_planner"}])
    main.main(["run", "--dry-run"])
    assert not articles(site)


def test_reviewer_no_issue_and_minor_entries_ignored_only_when_passed():
    passed = {"pass": True, "value_score": 8, "unsupported_claims": ["No unsupported claims found."],
              "factual_issues": ["Minor: wording could be tighter."]}
    assert quality.real_issues(passed, "unsupported_claims") == [] and quality.real_issues(passed, "factual_issues") == []
    failed = {**passed, "pass": False}
    assert quality.real_issues(failed, "factual_issues") == ["Minor: wording could be tighter."]
    real = {**passed, "factual_issues": ["The Unicode claim is stated as fact."]}
    assert quality.real_issues(real, "factual_issues")


def test_one_article_per_day_and_feature_cta(site, monkeypatch):
    cfg_p = site / "seo-agent" / "seo-config.yaml"
    cfg_p.write_text(cfg_p.read_text().replace("organic_difficulty_source: dataforseo", "organic_difficulty_source: none"))
    mock_apis(monkeypatch, ideas=[
        {"keyword": "how to type kaomoji on android", "volume": 880, "source": "google_ads_keyword_planner"},
        {"keyword": "how to get kaomoji on your phone keyboard", "volume": 390, "source": "google_ads_keyword_planner"},
    ])
    assert main.main(["run"]) == 0
    pages = articles(site)
    assert len(pages) == 1
    html = pages[0].read_text()
    assert "Get Kaomoji on Your Keyboard" in html
    rep = (site / "seo-agent" / "data" / "reports" / "2026-11-01.md").read_text()
    assert "## Keywords by feature" in rep and "relevance | ranking opp." in rep
    assert (site / "seo-agent" / "data" / "reports" / "weekly-2026-W44.md").exists()


def test_faq_heading_not_duplicated(cfg):
    a = {"slug": "x-y", "keyword": "what is a kaomoji", "title": "What Is a Kaomoji? A Simple Guide", "h1": "What Is a Kaomoji",
         "meta_description": "m" * 140, "published": "2026-11-05", "modified": "2026-11-05",
         "body_html": "<p>Intro.</p><h2>Depth</h2><p>a</p><h2>Frequently asked questions</h2><p>Common follow-ups.</p>",
         "faqs": [{"question": "Q?", "answer": "A."}]}
    html = publisher.render_article(cfg, a, [])
    assert html.lower().count("frequently asked questions</h2>") == 1 and "Common follow-ups" not in html
    assert "<h2>Depth</h2>" in html


def test_polish_applies_reviewer_suggestions_only_if_still_passing(site, monkeypatch):
    from seo_agent import content
    cfg_p = site / "seo-agent" / "seo-config.yaml"
    cfg_p.write_text(cfg_p.read_text().replace("organic_difficulty_source: dataforseo", "organic_difficulty_source: none"))
    body = fake_body("x") + "<p>Pick a emerald heart symbol for your bio.</p>"
    mock_apis(monkeypatch, body=body)

    def review(cfg, keyword, intent, article, facts):
        typo = "a emerald" in article["body_html"]
        return {"intent_match": True, "value_score": 8, "factual_issues": [], "invented_app_features": [],
                "unsupported_claims": [], "spam_policy_issues": [], "keyword_stuffing": False, "pass": True,
                "notes": "Minor: fix the typo 'a emerald' -> 'an emerald'." if typo else "Good."}
    monkeypatch.setattr(content, "review", review)
    monkeypatch.setattr(content, "revise", lambda cfg, kw, plan, draft, fb, facts: {
        **draft, "body_html": draft["body_html"].replace("a emerald", "an emerald"), "changes_made": ["typo"]})
    assert main.main(["run"]) == 0
    html = (site / "blog" / "how-to-type-kaomoji-on-android.html").read_text()
    assert "an emerald" in html and "a emerald" not in html
    st = json.loads((site / "seo-agent" / "data" / "state.json").read_text())
    assert st["articles"]["how-to-type-kaomoji-on-android"]["quality_gate"]["polished"] is True


def test_failed_polish_keeps_the_passing_draft(site, monkeypatch):
    from seo_agent import content
    cfg_p = site / "seo-agent" / "seo-config.yaml"
    cfg_p.write_text(cfg_p.read_text().replace("organic_difficulty_source: dataforseo", "organic_difficulty_source: none"))
    mock_apis(monkeypatch)
    monkeypatch.setattr(content, "review", lambda cfg, keyword, intent, article, facts: {
        "intent_match": True, "value_score": 8, "factual_issues": [], "invented_app_features": [], "unsupported_claims": [],
        "spam_policy_issues": [], "keyword_stuffing": False, "pass": "guaranteed" not in article["body_html"],
        "notes": "Consider tightening the intro."})
    monkeypatch.setattr(content, "revise", lambda cfg, kw, plan, draft, fb, facts: {
        **draft, "body_html": draft["body_html"] + "<p>Results guaranteed.</p>", "changes_made": []})
    assert main.main(["run"]) == 0
    html = (site / "blog" / "how-to-type-kaomoji-on-android.html").read_text()
    assert "guaranteed" not in html.lower()


def _free(site):
    p = site / "seo-agent" / "seo-config.yaml"
    p.write_text(p.read_text().replace("organic_difficulty_source: dataforseo", "organic_difficulty_source: none"))


def test_retest_keyword_cannot_bypass_daily_limit(site, monkeypatch):
    _free(site)
    mock_apis(monkeypatch, ideas=[
        {"keyword": "how to type kaomoji on android", "volume": 880, "source": "google_ads_keyword_planner"},
        {"keyword": "cursive fonts for discord names", "volume": 5400, "source": "google_ads_keyword_planner"}])
    assert main.main(["run"]) == 0
    assert len(articles(site)) == 1
    assert main.main(["run", "--keyword", "cursive fonts for discord names"]) == 0  # manual re-test, same day
    assert len(articles(site)) == 1
    assert "daily article limit already reached" in (site / "seo-agent" / "data" / "reports" / "2026-11-01.md").read_text()


def test_overlapping_runs_are_caught_before_push(site, monkeypatch):
    """Simulates two runs that both published (merged state after `git pull --rebase`): validation must fail."""
    _free(site)
    mock_apis(monkeypatch)
    assert main.main(["run"]) == 0
    assert main.main(["check"]) == 0
    p = site / "seo-agent" / "data" / "state.json"
    st = json.loads(p.read_text())
    other = dict(next(iter(st["articles"].values())), slug="another-article", keyword="another topic")
    st["articles"]["another-article"] = other
    p.write_text(json.dumps(st))
    assert main.main(["check"]) == 1
    cfg = config_mod.load_config(root=site)
    assert main.daily_limit_errors(cfg) and "daily article limit exceeded" in main.daily_limit_errors(cfg)[0]


def test_dry_run_respects_one_article_per_day(site, monkeypatch, capsys):
    cfg_p = site / "seo-agent" / "seo-config.yaml"
    cfg_p.write_text(cfg_p.read_text().replace("organic_difficulty_source: dataforseo", "organic_difficulty_source: none"))
    mock_apis(monkeypatch, ideas=[
        {"keyword": "how to type kaomoji on android", "volume": 880, "source": "google_ads_keyword_planner"},
        {"keyword": "cursive fonts for discord names", "volume": 5400, "source": "google_ads_keyword_planner"},
        {"keyword": "cute symbols for instagram bio", "volume": 5400, "source": "google_ads_keyword_planner"}])
    assert main.main(["run", "--dry-run"]) == 0
    out = capsys.readouterr().out
    assert out.count("[dry-run] would publish") == 1
    assert "## Selection summary" in out and "rejected as duplicate intent" in out
    assert not bool(articles(site))


def test_permanent_errors_are_not_retried():
    class AuthenticationError(Exception):
        pass

    class RateLimitError(Exception):
        pass

    assert not http.is_transient(AuthenticationError("bad key"))
    assert http.is_transient(RateLimitError("slow down"))
    e = Exception("403"); e.status_code = 403
    assert not http.is_transient(e)
    e = Exception("503"); e.status_code = 503
    assert http.is_transient(e)
    calls = []

    @http.with_backoff(attempts=3, min_wait=0, max_wait=0)
    def f():
        calls.append(1)
        raise AuthenticationError("no")
    with pytest.raises(AuthenticationError):
        f()
    assert len(calls) == 1


def test_rescore_report_runs_offline(cfg):
    text = reports.rescore(cfg, State(cfg.data_dir / "state.json"))
    assert "| 40 |" in text and "| 45 |" in text and "| 50 |" in text
    for fid in cfg.get("features"):
        assert f"(`{fid}`)" in text
