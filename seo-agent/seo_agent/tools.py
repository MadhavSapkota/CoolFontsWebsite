"""Interactive generator widgets attached to articles whose keyword wants a tool. The JS lives in /blog/tools.js."""
from __future__ import annotations

import html
import re
from typing import Any

from .config import Config


def _has(phrase: str, kw: str) -> bool:
    return re.search(rf"\b{re.escape(phrase)}s?\b", kw) is not None


def tool_for(cfg: Config, keyword: str) -> dict[str, str] | None:
    """Returns {kind, preset} when a generator serves this search better than prose alone."""
    if not cfg.get("tools.enabled"):
        return None
    kw = keyword.lower()
    for rule in cfg.get("tools.symbol_rules", []):
        if any(_has(p, kw) for p in rule["match"]):
            return {"kind": "symbols", "preset": rule["preset"]}
    if any(t in kw for t in cfg.get("tools.font_triggers", [])):
        for rule in cfg.get("tools.font_rules", []):
            if any(_has(p, kw) for p in rule["match"]):
                return {"kind": "fonts", "preset": rule["preset"]}
    return None


def prioritized(cfg: Config, i: dict[str, Any]) -> bool:
    """A tool-worthy keyword with a realistic (heuristic) chance of ranking goes ahead of plain articles."""
    opp = (i.get("score") or {}).get("ranking_opportunity", 0)
    return tool_for(cfg, i["keyword"]) is not None and opp >= cfg.get("tools.min_ranking_opportunity", 30)


def writer_note(tool: dict[str, str]) -> str:
    what = "a tap-to-copy symbol picker" if tool["kind"] == "symbols" else "a live text generator that converts typed text into many Unicode styles"
    return (f"The page shows {what} directly above your article, so do not build one in body_html. Mention it once in the opening, "
            "then help the reader choose and use the results.")


def widget_html(tool: dict[str, str]) -> str:
    e = html.escape
    return (f'<section class="tool" id="generator" data-tool="{e(tool["kind"])}" data-preset="{e(tool["preset"])}" aria-label="Generator">'
            "<noscript><p>This generator needs JavaScript. The guide below still works without it.</p></noscript></section>")


SCRIPT = '<script src="/blog/tools.js" defer></script>'
