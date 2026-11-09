"""Persistent JSON state: keyword history, coverage, articles, decisions. Committed to the repo."""
from __future__ import annotations

import json
import os
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Any

HISTORY_ROWS = 7
REJECT_RETENTION_DAYS = 45
SUMMARY_FIELDS = {"keyword", "volume", "source", "difficulty", "gsc_impressions_28d", "gsc_position", "ads_competition", "intent",
                  "feature", "score_total"}
DEFAULT: dict[str, Any] = {"version": 1, "keywords": {}, "articles": {}, "runs": [], "page_updates": []}


class State:
    def __init__(self, path: Path):
        self.path = path
        if path.exists():
            self.data = json.loads(path.read_text(encoding="utf-8"))
            for k, v in DEFAULT.items():
                self.data.setdefault(k, v if not isinstance(v, (dict, list)) else type(v)())
        else:
            self.data = json.loads(json.dumps(DEFAULT))

    # keywords --------------------------------------------------------------
    def record_keyword(self, kw: str, metrics: dict[str, Any], decision: str) -> None:
        entry = self.data["keywords"].setdefault(kw, {"history": []})
        entry["latest"] = metrics
        entry["decision"] = decision
        entry["feature"] = metrics.get("feature") or entry.get("feature")
        if decision.startswith("published:"):
            entry["article"] = {"slug": decision.split(":", 1)[1], "published": today()}
        row = {"date": today(), "decision": decision, "volume": metrics.get("volume"), "score_total": metrics.get("score_total")}
        last = entry["history"][-1] if entry["history"] else None
        if last and last.get("decision") == decision and last.get("volume") == row["volume"]:
            entry["history"][-1] = row  # unchanged result: move its date forward instead of adding a row
        else:
            entry["history"].append(row)
        entry["history"] = entry["history"][-HISTORY_ROWS:]

    def used_keywords(self) -> set[str]:
        used = set()
        for a in self.data["articles"].values():
            used.add(a["keyword"].lower())
            used.update(k.lower() for k in a.get("secondary_keywords", []))
        return used

    def rejected_recently(self, kw: str, days: int = 30) -> bool:
        e = self.data["keywords"].get(kw)
        if not e or not str(e.get("decision", "")).startswith("rejected_by_quality_gate"):
            return False
        last = e["history"][-1]["date"]
        return (date.fromisoformat(today()) - date.fromisoformat(last)).days < days

    # articles --------------------------------------------------------------
    def add_article(self, slug: str, info: dict[str, Any]) -> None:
        self.data["articles"][slug] = info

    def published_today(self) -> int:
        return sum(1 for a in self.data["articles"].values() if a.get("published") == today() and not a.get("imported"))

    def updates_today(self) -> int:
        return sum(1 for u in self.data["page_updates"] if u.get("date") == today())

    def add_run(self, summary: dict[str, Any]) -> None:
        self.data["runs"].append({"at": datetime.now(timezone.utc).isoformat(timespec="seconds"), **summary})
        self.data["runs"] = self.data["runs"][-120:]

    def compact(self) -> None:
        """Keeps state small: routine rejects keep only summary fields and age out; articles and live candidates are untouched."""
        now = date.fromisoformat(today())
        kept = {}
        for kw, e in self.data["keywords"].items():
            e["history"] = [{k: h.get(k) for k in ("date", "decision", "volume", "score_total")} for h in e.get("history", [])][-HISTORY_ROWS:]
            d = str(e.get("decision", ""))
            routine = d.startswith("rejected_") and not d.startswith("rejected_by_quality_gate")
            if routine:
                seen = e["history"][-1]["date"] if e["history"] else today()
                if (now - date.fromisoformat(seen)).days > REJECT_RETENTION_DAYS:
                    continue
                e["latest"] = {k: v for k, v in (e.get("latest") or {}).items() if k in SUMMARY_FIELDS}
            kept[kw] = e
        self.data["keywords"] = kept

    def _serialize(self) -> str:
        """Valid JSON with one line per keyword, so daily git diffs stay small."""
        one = lambda v: json.dumps(v, sort_keys=True, ensure_ascii=False, separators=(",", ":"))
        parts = []
        for key in sorted(self.data):
            if key == "keywords":
                rows = ",\n".join(f"{one(k)}:{one(self.data[key][k])}" for k in sorted(self.data[key]))
                parts.append('"keywords":{\n' + rows + "\n}")
            else:
                parts.append(f"{one(key)}:{json.dumps(self.data[key], indent=1, sort_keys=True, ensure_ascii=False)}")
        return "{\n" + ",\n".join(parts) + "\n}\n"

    def save(self) -> None:
        self.compact()
        self.path.parent.mkdir(parents=True, exist_ok=True)
        tmp = self.path.with_suffix(".tmp")
        tmp.write_text(self._serialize(), encoding="utf-8")
        os.replace(tmp, self.path)


def today() -> str:
    return os.environ.get("SEO_AGENT_TODAY") or datetime.now(timezone.utc).date().isoformat()
