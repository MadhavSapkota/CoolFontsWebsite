// A few butterflies fluttering around the page
(() => {
  const c = document.createElement("canvas");
  c.id = "flutter"; c.setAttribute("aria-hidden", "true");
  document.body.appendChild(c);
  const ctx = c.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let on = true;
  try { on = localStorage.getItem("butterfly") !== "off"; } catch {}
  if (reduce) on = false;
  let W, H, dpr, bugs = [];
  const KINDS = ["🦋", "🦋", "🦋", "🦋"];
  const HUES = [0, 0, 300, 160, 40, 200]; // tint variety via filter
  function size() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    c.width = W * dpr; c.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = 2;
    while (bugs.length < n) bugs.push(make());
    bugs.length = n;
  }
  const hero = document.querySelector(".hero");
  const topBound = () => Math.max(0, hero ? hero.getBoundingClientRect().bottom + 40 : 0); // stay below the sakura area
  function make() {
    const T = topBound();
    return { x: Math.random() * W, y: T + Math.random() * Math.max(60, H - T), ang: Math.random() * 6.28, sp: .7 + Math.random() * .9,
      turn: 0, flap: Math.random() * 6.28, fs: .25 + Math.random() * .15, s: 20 + Math.random() * 14,
      hue: HUES[Math.random() * HUES.length | 0], k: KINDS[Math.random() * KINDS.length | 0], rest: 0 };
  }
  let mx = -999, my = -999;
  addEventListener("pointermove", e => { mx = e.clientX; my = e.clientY; }, { passive: true });
  let last = 0;
  function tick(t) {
    if (!on) { ctx.clearRect(0, 0, W, H); return; }
    const dt = Math.min(3, (t - last) / 16.7 || 1); last = t;
    ctx.clearRect(0, 0, W, H);
    const T = Math.min(topBound(), H - 120);
    for (const b of bugs) {
      // wander
      b.turn += (Math.random() - .5) * .08 * dt; b.turn *= .96;
      b.ang += b.turn * dt;
      // gently steer away from edges
      const m = 60;
      if (b.x < m) b.ang += .05 * dt * Math.sign(Math.sin(b.ang) || 1) * -1 + (Math.cos(b.ang) < 0 ? .06 : 0);
      if (b.x < m || b.x > W - m || b.y < T + m || b.y > H - m) {
        const to = Math.atan2((T + H) / 2 - b.y, W / 2 - b.x);
        b.ang += Math.atan2(Math.sin(to - b.ang), Math.cos(to - b.ang)) * .04 * dt;
      }
      // shy: flee the cursor
      const dx = b.x - mx, dy = b.y - my, d = Math.hypot(dx, dy);
      if (d < 120) { const away = Math.atan2(dy, dx); b.ang += Math.atan2(Math.sin(away - b.ang), Math.cos(away - b.ang)) * .15 * dt; }
      const boost = d < 120 ? 2.2 : 1;
      b.flap += b.fs * dt * boost;
      const bob = Math.sin(b.flap * 2) * .6;
      b.x += Math.cos(b.ang) * b.sp * boost * dt;
      b.y += (Math.sin(b.ang) * b.sp * boost + bob) * dt;
      b.x = Math.max(-40, Math.min(W + 40, b.x)); b.y = Math.max(T, Math.min(H + 40, b.y));
      // draw with wing flap (horizontal squash)
      const wing = .25 + .75 * Math.abs(Math.sin(b.flap));
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(Math.cos(b.ang) * .25);
      ctx.scale((Math.cos(b.ang) < 0 ? -1 : 1) * wing, 1);
      if (b.hue) ctx.filter = `hue-rotate(${b.hue}deg)`;
      ctx.globalAlpha = .9;
      ctx.font = b.s + "px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(b.k, 0, 0);
      ctx.restore();
    }
    requestAnimationFrame(tick);
  }
  addEventListener("resize", size);
  size();
  if (on) requestAnimationFrame(tick);
  const btn = document.getElementById("fly-btn");
  if (btn) {
    const sync = () => { btn.classList.toggle("on", on); btn.title = on ? "Hide butterflies" : "Show butterflies"; };
    sync();
    btn.onclick = () => {
      on = !on; sync();
      try { localStorage.setItem("butterfly", on ? "on" : "off"); } catch {}
      if (on) { last = 0; requestAnimationFrame(tick); } else ctx.clearRect(0, 0, W, H);
    };
  }
})();
