/* Opt-in analytics. Nothing loads, and no cookie is set, unless a GA4 ID is present below AND the visitor accepts.
   Measures page views and Play Store link clicks only. Text typed into generators is never sent. */
(function () {
  var ID = "G-G5NSQ5X7RS";
  if (!/^G-[A-Z0-9]{4,12}$/.test(ID)) return;
  var KEY = "cf_analytics_choice", PLAY = "play.google.com/store/apps/details?id=com.sapkotamadhav.fonts.collections", loaded = false;
  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function load() {
    window["ga-disable-" + ID] = false;
    if (loaded) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag("consent", "default", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "granted" });
    gtag("js", new Date());
    gtag("config", ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
    var s = document.createElement("script");
    s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + ID;
    document.head.appendChild(s);
  }
  function decline() {
    window["ga-disable-" + ID] = true;
    document.cookie.split(";").forEach(function (c) {
      var n = c.split("=")[0].trim();
      if (n.indexOf("_ga") === 0) document.cookie = n + "=; Max-Age=0; path=/; domain=." + location.hostname.replace(/^www\./, "");
    });
  }
  function banner() {
    if (document.getElementById("cf-consent")) return;
    var b = document.createElement("div");
    b.id = "cf-consent"; b.setAttribute("role", "region"); b.setAttribute("aria-label", "Analytics choice");
    b.style.cssText = "position:fixed;left:12px;right:12px;bottom:12px;z-index:50;max-width:460px;margin:auto;padding:14px 16px;border-radius:16px;background:#1f1a2e;color:#fff;font:14px/1.45 system-ui,sans-serif;box-shadow:0 8px 30px rgba(0,0,0,.3)";
    var p = document.createElement("div");
    p.textContent = "May we use Google Analytics to count visits and Play Store clicks? No advertising. Text you type stays on your device.";
    var row = document.createElement("div"); row.style.cssText = "display:flex;gap:8px;margin-top:10px";
    [["Accept", "granted"], ["Decline", "denied"]].forEach(function (o) {
      var x = document.createElement("button"); x.type = "button"; x.textContent = o[0];
      x.style.cssText = "flex:1;padding:9px;border:1px solid #fff;border-radius:999px;background:transparent;color:#fff;font:inherit;font-weight:700;cursor:pointer";
      x.onclick = function () { save(o[1]); if (o[1] === "granted") load(); else decline(); b.remove(); };
      row.appendChild(x);
    });
    b.appendChild(p); b.appendChild(row); document.body.appendChild(b);
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest("[data-analytics-choices]");
    if (t) { e.preventDefault(); banner(); return; }
    var a = e.target.closest && e.target.closest("a[href*='" + PLAY + "']");
    if (a && loaded && read() === "granted") gtag("event", "play_store_click", { page_path: location.pathname, placement: a.dataset.placement || "", transport_type: "beacon" });
  });
  function start() {
    document.querySelectorAll("[data-analytics-choices]").forEach(function (n) { n.hidden = false; });
    var c = read();
    if (c === "granted") load(); else if (c !== "denied") banner();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
