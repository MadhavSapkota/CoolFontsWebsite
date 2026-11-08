// A few sakura petals drifting down
(() => {
  const c = document.createElement("canvas");
  c.id = "sakura"; c.setAttribute("aria-hidden", "true");
  document.body.appendChild(c);
  const ctx = c.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let on = true;
  try { on = localStorage.getItem("sakura") !== "off"; } catch {}
  if (reduce) on = false;
  let W, H, dpr, petals = [];
  const COLORS = ["#ffc4d6", "#ffb3c8", "#ffd6e2", "#f9a8c2", "#ffe0ea"];
  function size() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    const hero = document.querySelector(".hero");
    W = document.documentElement.clientWidth;
    H = hero ? hero.offsetTop + hero.offsetHeight : innerHeight; // only the top area, above the text box
    c.style.height = H + "px"; c.style.width = W + "px";
    c.width = W * dpr; c.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = W < 640 ? 14 : 26; // "little" — keep it sparse
    while (petals.length < n) petals.push(make(true));
    petals.length = n;
  }
  function make(anyY) {
    const flower = Math.random() < .15;
    // spawn in the top-right corner: along the top edge's right part or the right edge's upper part
    const fromTop = Math.random() < .6;
    const p = { x: fromTop ? W - Math.random() * W * .3 : W + 10, y: fromTop ? -15 : Math.random() * H * .3,
      s: flower ? 9 + Math.random() * 4 : 6 + Math.random() * 6,
      vy: .6 + Math.random() * .8, vx: -(.7 + Math.random() * 1.0), ph: Math.random() * 6.28, rot: Math.random() * 6.28,
      vr: (Math.random() - .5) * .04, flip: Math.random() * 6.28, col: COLORS[Math.random() * COLORS.length | 0], flower };
    if (anyY) { const k = Math.random() * (H / p.vy); p.x += p.vx * k; p.y += p.vy * k; } // pre-spread along the path on load
    return p;
  }
  function petal(s) { // notched sakura petal
    ctx.beginPath();
    ctx.moveTo(0, s);
    ctx.bezierCurveTo(s * .9, s * .5, s * .8, -s * .7, s * .22, -s);
    ctx.lineTo(0, -s * .72);
    ctx.lineTo(-s * .22, -s);
    ctx.bezierCurveTo(-s * .8, -s * .7, -s * .9, s * .5, 0, s);
    ctx.fill();
  }
  let last = 0;
  function tick(t) {
    if (!on) { ctx.clearRect(0, 0, W, H); return; }
    const dt = Math.min(3, (t - last) / 16.7 || 1); last = t;
    ctx.clearRect(0, 0, W, H);
    for (const p of petals) {
      p.ph += .015 * dt; p.rot += p.vr * dt; p.flip += .03 * dt;
      p.y += p.vy * dt; p.x += (p.vx + Math.sin(p.ph) * .7) * dt;
      if (p.y > H || p.x < -30) Object.assign(p, make(false));
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.globalAlpha = .85 * Math.max(0, Math.min(1, (H - p.y) / 80)); ctx.fillStyle = p.col; // fade out before the text box
      if (p.flower) {
        for (let i = 0; i < 5; i++) { ctx.save(); ctx.rotate(i * 1.2566); ctx.translate(0, -p.s * .55); petal(p.s * .5); ctx.restore(); }
        ctx.fillStyle = "#f472a6"; ctx.beginPath(); ctx.arc(0, 0, p.s * .16, 0, 6.28); ctx.fill();
      } else {
        ctx.scale(Math.cos(p.flip), 1); // tumbling
        petal(p.s);
      }
      ctx.restore();
    }
    requestAnimationFrame(tick);
  }
  addEventListener("resize", size); addEventListener("load", size); document.fonts && document.fonts.ready.then(size);
  size();
  if (on) requestAnimationFrame(tick);
  const btn = document.getElementById("sakura-btn");
  if (btn) {
    const sync = () => { btn.classList.toggle("on", on); btn.title = on ? "Stop sakura" : "Sakura petals"; };
    sync();
    btn.onclick = () => {
      on = !on; sync();
      try { localStorage.setItem("sakura", on ? "on" : "off"); } catch {}
      if (on) { last = 0; requestAnimationFrame(tick); } else ctx.clearRect(0, 0, W, H);
    };
  }
})();
