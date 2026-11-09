/* Applies the visitor's saved color mode on pages without the home page app, and adds the toggle. */
(function () {
  var root = document.documentElement;
  function read() { try { return JSON.parse(localStorage.getItem("theme")); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem("theme", JSON.stringify(v)); } catch (e) {} }
  var saved = read();
  root.dataset.theme = saved === "dark" ? "dark" : "light";
  function addToggle() {
    var bar = document.querySelector("header.top");
    if (!bar || document.getElementById("theme")) return;
    var b = document.createElement("button");
    b.id = "theme"; b.type = "button"; b.className = "icon-btn"; b.setAttribute("aria-label", "Toggle color mode"); b.textContent = "\u25D0";
    b.onclick = function () { var t = root.dataset.theme === "dark" ? "light" : "dark"; root.dataset.theme = t; save(t); };
    var app = bar.querySelector(".get-app");
    bar.insertBefore(b, app);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", addToggle); else addToggle();
})();
