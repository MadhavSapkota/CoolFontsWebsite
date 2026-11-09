"""Pull live Keyword Planner ideas from the Google Ads API into keywords/live_keywords.tsv.

Keeps Low-competition keywords with 1,000+ monthly searches and no upper limit (US, English).
Exit code: 0 = file refreshed, 1 = API/auth/empty-result failure (existing file is left untouched).

Required env vars (never commit these; the repo is public):
  GOOGLE_ADS_CLIENT_ID, GOOGLE_ADS_CLIENT_SECRET, GOOGLE_ADS_REFRESH_TOKEN,
  GOOGLE_ADS_CUSTOMER_ID (10 digits; dashes are fine)
Optional: GOOGLE_ADS_LOGIN_CUSTOMER_ID (manager account), GOOGLE_ADS_API_VERSION (default v26)

Usage: python3 tools/ads_keywords.py
"""
import json, os, sys, urllib.error, urllib.parse, urllib.request

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
OUT = os.path.join(ROOT, "keywords", "live_keywords.tsv")
USED = os.path.join(ROOT, "keywords", "used.txt")
US, ENGLISH = "geoTargetConstants/2840", "languageConstants/1000"
SEEDS = ["kaomoji", "cute kaomoji", "text faces", "kawaii faces", "japanese emoticons",
         "discord fonts", "aesthetic fonts", "fancy text", "cursive fonts", "instagram bio fonts",
         "font keyboard", "fonts keyboard android", "cool symbols", "bubble letters", "tiny text",
         "cute symbols", "whatsapp fonts", "tiktok fonts", "stylish text", "text art"]  # API max: 20
MIN_SEARCHES, MIN_WORDS = 1000, 2


def digits(value):
    return value.replace("-", "").strip()


def post(url, data, headers):
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read().decode("utf-8"))


def access_token(env):
    form = urllib.parse.urlencode({
        "client_id": env["GOOGLE_ADS_CLIENT_ID"],
        "client_secret": env["GOOGLE_ADS_CLIENT_SECRET"],
        "refresh_token": env["GOOGLE_ADS_REFRESH_TOKEN"],
        "grant_type": "refresh_token",
    }).encode()
    return post("https://oauth2.googleapis.com/token", form,
                {"Content-Type": "application/x-www-form-urlencoded"})["access_token"]


def fetch_ideas(env, token):
    version = env.get("GOOGLE_ADS_API_VERSION", "v26")
    url = f"https://googleads.googleapis.com/{version}/customers/{digits(env['GOOGLE_ADS_CUSTOMER_ID'])}:generateKeywordIdeas"
    headers = {"Content-Type": "application/json", "Authorization": f"Bearer {token}"}
    if env.get("GOOGLE_ADS_LOGIN_CUSTOMER_ID"):
        headers["login-customer-id"] = digits(env["GOOGLE_ADS_LOGIN_CUSTOMER_ID"])
    body = {"language": ENGLISH, "geoTargetConstants": [US], "includeAdultKeywords": False,
            "keywordPlanNetwork": "GOOGLE_SEARCH", "keywordSeed": {"keywords": SEEDS}}
    ideas = []
    while True:
        page = post(url, json.dumps(body).encode(), headers)
        ideas += page.get("results", [])
        if not page.get("nextPageToken"):
            return ideas
        body["pageToken"] = page["nextPageToken"]


def filter_ideas(ideas, used):
    """Return (keyword, searches, competition index) rows, highest volume first."""
    rows = {}
    for idea in ideas:
        keyword = idea.get("text", "").strip().lower()
        m = idea.get("keywordIdeaMetrics") or {}
        searches = int(m.get("avgMonthlySearches") or 0)  # int64 fields arrive as JSON strings
        if (len(keyword.split()) >= MIN_WORDS and keyword not in used and m.get("competition") == "LOW"
                and searches >= MIN_SEARCHES):
            rows[keyword] = (keyword, searches, int(m.get("competitionIndex") or 0))
    return sorted(rows.values(), key=lambda row: (-row[1], row[0]))


def write_rows(rows):
    tmp = OUT + ".tmp"
    with open(tmp, "w") as f:
        f.write("Keyword\tAvg. monthly searches\tCompetition\tCompetition (indexed value)\n")
        f.writelines(f"{k}\t{s}\tLow\t{i}\n" for k, s, i in rows)
    os.replace(tmp, OUT)


def main():
    required = ["GOOGLE_ADS_CLIENT_ID", "GOOGLE_ADS_CLIENT_SECRET", "GOOGLE_ADS_REFRESH_TOKEN", "GOOGLE_ADS_CUSTOMER_ID"]
    missing = [name for name in required if not os.environ.get(name)]
    if missing:
        print("Missing env vars: " + ", ".join(missing), file=sys.stderr)
        return 1
    try:
        ideas = fetch_ideas(os.environ, access_token(os.environ))
    except urllib.error.HTTPError as e:
        print(f"Google API error {e.code}: {e.read().decode('utf-8', 'replace')[:2000]}", file=sys.stderr)
        return 1
    except (urllib.error.URLError, TimeoutError, KeyError, ValueError) as e:
        print(f"Request failed: {e!r}", file=sys.stderr)
        return 1
    used = set()
    if os.path.exists(USED):
        with open(USED) as f:
            used = {line.strip().lower() for line in f}
    rows = filter_ideas(ideas, used)
    if not rows:
        print(f"API returned {len(ideas)} ideas but none passed the filters; keeping existing file.", file=sys.stderr)
        return 1
    write_rows(rows)
    print(f"{len(rows)} keywords saved to keywords/live_keywords.tsv (from {len(ideas)} ideas)")
    for keyword, searches, _ in rows[:20]:
        print(f"{searches}\t{keyword}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
