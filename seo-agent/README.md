# Cool Fonts SEO agent

Daily automated content for https://coolfontskeyboard.app, run by GitHub Actions. It finds searches related to the app,
publishes **at most one** article a day, and links readers to Google Play. If nothing qualifies, it publishes nothing.

## Architecture
| Path | What |
|---|---|
| `seo-agent/seo-config.yaml` | Domain, features, seeds, thresholds, limits |
| `seo-agent/seo_agent/app_facts.yaml` | The only claims articles may make, plus banned claims |
| `seo-agent/seo_agent/` | Research, scoring, strategy, writer, independent review, quality gate, publisher, analytics |
| `seo-agent/templates/` | Article and blog index pages in the site's design |
| `seo-agent/data/` | Keyword evidence, article sources, reports, logs (never published: excluded by `_config.yml`) |
| `.github/workflows/daily-seo.yml` | Tests, agent, validation, commit, rebase, re-check limit, push, Pages build, live URL check |

Keywords come from Google Ads Keyword Planner and Search Console. Volume must be 100+/month verified, or 30+ Search Console
impressions in 28 days (labeled "volume unverified"). Metrics are never invented. The 0-100 score is a labeled heuristic,
**not keyword difficulty**: relevance 30%, ranking opportunity 25%, conversion 20%, demand 15%, usefulness 10%. Minimum 50.
Keyword Planner "competition" measures advertisers, so it is stored but not used as ranking difficulty.

Any quality-gate failure blocks publishing and the reason is saved in `data/state.json`. Rejected drafts are rewritten up to
3 times. Existing articles change at most once per 28 days, and only with substantive new content.

## Costs
| Service | Cost |
|---|---|
| Claude API (Sonnet 5.5, $2 input / $10 output per million tokens) | Hard stop at `limits.max_monthly_usd` = $10 estimated. Also set a limit in the Anthropic Console |
| Keyword Planner, Search Console, GitHub Actions on this public repo | Free |

## Setup
Use one Google Cloud project for this site. Keep every key out of chat and git.

1. **Search Console:** the property is the URL prefix `https://coolfontskeyboard.app/`, verified by the
   `google39e3cdfd8e10ad01.html` file in the repo root (never delete it). Submit `https://coolfontskeyboard.app/sitemap.xml`.
2. **Google Cloud:** create a project and enable **Google Search Console API** and **Google Ads API**.
3. **Service account:** IAM & Admin > Service Accounts > Create (no roles). Keys > Add key > JSON. In Search Console >
   Settings > Users and permissions, add its `.iam.gserviceaccount.com` email as **Restricted**.
4. **Google Ads access:** Keyword Planner needs **Basic** access; Explorer cannot call `KeywordPlanIdeaService`. Complete brand
   verification (it needs a privacy policy on this domain), then apply on the Google Ads API Overview page. Describe the real
   use honestly: Google ties this service to a keyword research permissible use, so approval is not guaranteed.
   Developer tokens were retired on 2026-09-09; access now belongs to the Cloud project.
5. **OAuth:** configure the consent screen and **Publish app** (in Testing, refresh tokens expire after 7 days).
   Create an OAuth client of type **Desktop app** and download its JSON to Downloads.
6. **Store the Google Ads secrets** (opens a Google sign-in, saves directly to GitHub, prints nothing secret, and then
   deletes the client JSON from Downloads):
   ```bash
   python3 -m venv .venv-seo && .venv-seo/bin/pip install google-auth-oauthlib
   .venv-seo/bin/python seo-agent/tools/setup_google_ads_secrets.py
   ```
7. **Remaining GitHub secrets** (Settings > Secrets and variables > Actions):

| Secret | Value |
|---|---|
| `ANTHROPIC_API_KEY` | console.anthropic.com (separate from a Claude subscription; needs credit) |
| `GSC_SERVICE_ACCOUNT_JSON` | The whole JSON key from step 3 |
| `GOOGLE_ADS_CLIENT_ID`, `GOOGLE_ADS_CLIENT_SECRET`, `GOOGLE_ADS_REFRESH_TOKEN`, `GOOGLE_ADS_CUSTOMER_ID` | Set by step 6 |
| `GOOGLE_ADS_LOGIN_CUSTOMER_ID` | Only if you sign in through a Manager account |

8. Settings > Actions > General > Workflow permissions > **Read and write**.

Search Console has little data on a new site, so set up Google Ads as well or the agent may publish nothing for weeks.

## First run and switching over
1. Actions > **Daily SEO agent** > Run workflow > tick **Dry run**. Read the report in the log. Nothing is changed.
2. Pause the old routine at https://claude.ai/code/routines/trig_01Ljycy5V2RmNmqaEAaSBZ5c so only one system publishes.
3. Run `python3 seo-agent/tools/import_existing_posts.py` and commit, so the routine's posts stay listed and de-duplicated.
4. Run the workflow without Dry run, then confirm the commit and the new live page.

GA4 is off because the site has no privacy policy. Publish one disclosing Google Analytics before setting `analytics.ga4_*`.

## Local commands
```bash
python3 -m venv .venv-seo && .venv-seo/bin/pip install -r seo-agent/requirements.txt
cd seo-agent
../.venv-seo/bin/python -m pytest -q tests              # offline, all APIs mocked
../.venv-seo/bin/python -m seo_agent.main check         # site validation
../.venv-seo/bin/python -m seo_agent.main run --dry-run # report only, writes nothing
```
