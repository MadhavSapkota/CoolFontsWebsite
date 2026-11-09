/* Cool Fonts on-page generators. Everything runs in the browser: typed text is never sent anywhere. */
(function () {
const AZ = "abcdefghijklmnopqrstuvwxyz";
const cp = n => String.fromCodePoint(n);

// --- builders ---
function offs(up, lo, dig, ex = {}) {
  return ch => {
    if (ex[ch]) return ex[ch];
    const c = ch.charCodeAt(0);
    if (c >= 65 && c <= 90 && up) return cp(up + c - 65);
    if (c >= 97 && c <= 122 && lo) return cp(lo + c - 97);
    if (c >= 48 && c <= 57 && dig != null) return cp(dig + c - 48);
    return ch;
  };
}
function strMap(lower, upper, digits = null, extra = {}) {
  const lo = Array.from(lower), up = upper ? Array.from(upper) : null, dg = digits ? Array.from(digits) : null;
  return ch => {
    if (extra[ch]) return extra[ch];
    const l = AZ.indexOf(ch), u = AZ.indexOf(ch.toLowerCase());
    if (l >= 0) return lo[l];
    if (u >= 0) return up ? up[u] : lo[u];
    if (dg && ch >= "0" && ch <= "9") return dg[+ch];
    return ch;
  };
}
const mapper = fn => t => Array.from(t).map(fn).join("");
const combine = mark => t => Array.from(t).map(c => c === " " || c === "\n" ? c : c + mark).join("");
const between = sep => t => Array.from(t).join(sep);

const F = {
  bold: offs(0x1D400, 0x1D41A, 0x1D7CE),
  italic: offs(0x1D434, 0x1D44E, null, { h: "ℎ" }),
  boldItalic: offs(0x1D468, 0x1D482),
  script: offs(0x1D49C, 0x1D4B6, null, { B:"ℬ",E:"ℰ",F:"ℱ",H:"ℋ",I:"ℐ",L:"ℒ",M:"ℳ",R:"ℛ",e:"ℯ",g:"ℊ",o:"ℴ" }),
  boldScript: offs(0x1D4D0, 0x1D4EA),
  fraktur: offs(0x1D504, 0x1D51E, null, { C:"ℭ",H:"ℌ",I:"ℑ",R:"ℜ",Z:"ℨ" }),
  boldFraktur: offs(0x1D56C, 0x1D586),
  double: offs(0x1D538, 0x1D552, 0x1D7D8, { C:"ℂ",H:"ℍ",N:"ℕ",P:"ℙ",Q:"ℚ",R:"ℝ",Z:"ℤ" }),
  sans: offs(0x1D5A0, 0x1D5BA, 0x1D7E2),
  sansBold: offs(0x1D5D4, 0x1D5EE, 0x1D7EC),
  sansItalic: offs(0x1D608, 0x1D622),
  sansBoldItalic: offs(0x1D63C, 0x1D656),
  mono: offs(0x1D670, 0x1D68A, 0x1D7F6),
  wide: offs(0xFF21, 0xFF41, 0xFF10, { " ": "　" }),
  circled: offs(0x24B6, 0x24D0, null, { 0:"⓪",1:"①",2:"②",3:"③",4:"④",5:"⑤",6:"⑥",7:"⑦",8:"⑧",9:"⑨" }),
  negCircled: ch => /[a-z]/i.test(ch) ? cp(0x1F150 + ch.toUpperCase().charCodeAt(0) - 65) : ch,
  squared: ch => /[a-z]/i.test(ch) ? cp(0x1F130 + ch.toUpperCase().charCodeAt(0) - 65) : ch,
  negSquared: ch => /[a-z]/i.test(ch) ? cp(0x1F170 + ch.toUpperCase().charCodeAt(0) - 65) : ch,
  paren: ch => /[a-z]/i.test(ch) ? cp(0x249C + ch.toLowerCase().charCodeAt(0) - 97) : ch,
  smallCaps: strMap("ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ"),
  superscript: strMap("ᵃᵇᶜᵈᵉᶠᵍʰᶦʲᵏˡᵐⁿᵒᵖᵠʳˢᵗᵘᵛʷˣʸᶻ", null, "⁰¹²³⁴⁵⁶⁷⁸⁹"),
  subscript: strMap("ₐbcdₑfgₕᵢⱼₖₗₘₙₒₚqᵣₛₜᵤᵥwₓyz", null, "₀₁₂₃₄₅₆₇₈₉"),
  currency: strMap("₳฿₵ĐɆ₣₲ⱧłJ₭Ⱡ₥₦Ø₱QⱤ₴₮ɄV₩ӾɎⱫ"),
  asian: strMap("卂乃匚ᗪ乇千Ꮆ卄丨ﾌҜㄥ爪几ㄖ卩Ɋ尺丂ㄒㄩᐯ山乂ㄚ乙"),
  curvy: strMap("ᗩᗷᑕᗪEᖴGᕼIᒍKᒪᗰᑎOᑭᑫᖇᔕTᑌᐯᗯ᙭Yᘔ"),
  ancient: strMap("ᎪᏴᏟᎠᎬҒᏀᎻᏆᎫᏦᏞᎷΝϴᏢϘᏒՏͲႮᏙᏔХᎽᏃ"),
  armenian: strMap("λϐςժҽƒցհíյҟӀʍղօքզɾʂէմѵաxվz"),
  magic: strMap("ąცƈɖɛʄɠɧıʝƙƖɱŋơ℘զཞʂɬų۷ῳҳყʑ"),
  greek: strMap("αвcdεғgнιjκlмησρqяsтυvωxуz"),
  ethiopic: strMap("ልጌርዕቿቻኗዘጎጋጕረጠክዐየዒዪነፕሁሀሠሸሃጊ"),
  thai: strMap("ค๒ς๔єŦﻮђเןкɭ๓ภ๏קợгรՇยשฬאץչ"),
  wiggly: strMap("ǟɮƈɖɛʄɢɦɨʝӄʟʍռօքզʀֆȶʊʋաӼʏʐ"),
  rusty: strMap("ꍏꌃꉓꀸꍟꎇꁅꃅꀤꀭꀘ꒒ꂵꈤꂦꉣꆰꋪꌗ꓄ꀎꃴꅏꊼꌩꁴ"),
  dotted: strMap("äḅċḋëḟġḧïjḳḷṁṅöṗqṛṡẗüṿẅẍÿż"),
  accent: strMap("áßčďéƒğȟíǰǩĺḿńőṕqŕśťúvẃxýź"),
  leet: strMap("48(D3F6#!JK1M^0PQR57UVWXY2"),
  lines: strMap("ᗅᗷᑕᗞᗴᖴᏀᕼᏆᒍᏦᏞᗰᑎᝪᑭᑫᖇᔑᎢᑌᐯᗯ᙭ᎩᏃ"),
  hook: strMap("ꪖ᥇ᥴᦔꫀᠻᧁꫝ꠸꠹ᛕꪶꪑꪀꪮρꪇ᥅ᦓꪻꪊꪜ᭙᥊ꪗƺ"),
  squiggle: strMap("αɓcɗεƒɠɦιʝƙℓɱɳσρφɾѕτυʋωχყʑ"),
  bent: strMap("ąβȼď€ƒǥhɨjЌℓʍɲ๏ρǭя$ţµ˅ώж¥ƶ"),
  russian: strMap("авсdёfgнїjкlмпорqгѕтцvшхуz", "ДБCDΞFGHIJҜLMИФPQЯSTЦVЩЖЧZ"),
};
const flipMap = strMap("ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz", "∀ꓭƆꓷƎℲ⅁HIſꓘ˥WNOԀΌᴚS⊥∩ΛMX⅄Z", "0ƖᄅƐㄣϛ9ㄥ86", { "?":"¿","!":"¡",".":"˙",",":"'","(":")",")":"(","[":"]","]":"[" });

const zalgoMarks = Array.from({ length: 0x36F - 0x300 }, (_, i) => cp(0x300 + i));
let seed = 7;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const zalgo = t => Array.from(t).map(c => c === " " || c === "\n" ? c : c + Array.from({ length: 2 + (rnd() * 3 | 0) }, () => zalgoMarks[rnd() * zalgoMarks.length | 0]).join("")).join("");
const mark = m => t => Array.from(t).map(c => c === " " || c === "\n" ? c : c + m).join("");
const map = k => t => Array.from(t).map(F[k]).join("");
const STYLES = {
  boldScript: ["Bold Cursive", map("boldScript")], script: ["Cursive", map("script")], double: ["Double Struck", map("double")],
  fraktur: ["Gothic", map("fraktur")], boldFraktur: ["Bold Gothic", map("boldFraktur")], smallCaps: ["Small Caps", map("smallCaps")],
  circled: ["Bubble", map("circled")], negCircled: ["Dark Bubble", map("negCircled")], squared: ["Squares", map("squared")],
  negSquared: ["Dark Squares", map("negSquared")], wide: ["Wide", map("wide")], asian: ["Asian Style", map("asian")],
  bold: ["Bold Serif", map("bold")], italic: ["Italic Serif", map("italic")], boldItalic: ["Bold Italic", map("boldItalic")],
  sansBold: ["Bold Sans", map("sansBold")], sansItalic: ["Italic Sans", map("sansItalic")], mono: ["Typewriter", map("mono")],
  superscript: ["Tiny Raised", map("superscript")], subscript: ["Tiny Lowered", map("subscript")], curvy: ["Curvy", map("curvy")],
  magic: ["Magic", map("magic")], squiggle: ["Squiggle", map("squiggle")], rusty: ["Rusty", map("rusty")], wiggly: ["Wiggly", map("wiggly")],
  currency: ["Currency", map("currency")], flip: ["Upside Down", t => Array.from(t).reverse().map(flipMap).join("")],
  strike: ["Strikethrough", mark("̶")], underline: ["Underline", mark("̲")], glitch: ["Glitch", zalgo],
};
const FONT_FIRST = {
  all: [], cursive: ["boldScript", "script", "italic", "boldItalic", "sansItalic", "magic"], bold: ["bold", "sansBold", "boldItalic", "boldScript", "boldFraktur"],
  gothic: ["fraktur", "boldFraktur"], bubble: ["circled", "negCircled", "squared", "negSquared"], tiny: ["superscript", "subscript", "smallCaps"],
  glitch: ["glitch", "strike", "underline"], flip: ["flip"], social: ["boldScript", "script", "sansBold", "smallCaps", "double", "wide"],
  gaming: ["asian", "fraktur", "double", "negSquared", "currency", "glitch"],
};
const SYMBOLS = {
  hearts: "♥ ♡ ❤ ❥ ❣ ❦ ❧ ღ ۵ ෆ 💖 💗 💓 💞 💕 💘 💝 💟 🖤 🤍 🤎 💙 💚 💛 🧡 💜 ❤️‍🔥 ♥︎ ₊˚♡ ⋆♡⋆ (♡) ꕤ♡".split(" "),
  stars: "★ ☆ ✦ ✧ ✩ ✪ ✫ ✬ ✭ ✮ ✯ ✰ ⋆ ⍟ ⭐ 🌟 ✨ 💫 ˚₊✧ ⋆｡˚ ☪ ✡".split(" "),
  arrows: "→ ← ↑ ↓ ↔ ↕ ⇒ ⇐ ⇑ ⇓ ⇔ ➜ ➝ ➞ ➔ ➤ ➢ ➣ ↗ ↘ ↙ ↖ ⟶ ⟵ ↻ ↺ ⤴ ⤵".split(" "),
  sparkles: "✨ ✦ ✧ ⋆ ˚ ｡ ﾟ ✺ ✹ ✸ ✷ ❈ ❉ ❊ ❋ ⁂ ✵ ✶ ⊹ ₊ ⟡".split(" "),
  flowers: "✿ ❀ ❁ ✾ ❃ ❋ ✽ ❊ ✼ ⚘ 𖧷 ꕤ 🌸 🌼 🌺 🌹 🌷 🌻 💐".split(" "),
  aesthetic: "⋆ ˚ ｡ ✧ ♡ ☾ ☽ ☁ ❀ ✿ ୨୧ ꒰ ꒱ ᵕ̈ ⊹ ₊ ⟡ ⌗ ✩ ♪ ♫ ☼ ༄ ⚝ ❍ ⌒ ◡̈".split(" "),
  useful: "✓ ✔ ✕ ✖ • ◦ ● ○ ■ □ ▲ △ ▼ ▽ ◆ ◇ ™ © ® ° ∞ § ¶ † ‡ № ♪ ♫ ☀ ☾ ☂ ☎ ✉".split(" "),
};
const TAB_NAMES = { hearts: "Hearts", stars: "Stars", arrows: "Arrows", sparkles: "Sparkles", flowers: "Flowers", aesthetic: "Aesthetic", useful: "Useful" };
function fontsFor(preset) {
  const first = FONT_FIRST[preset] || [];
  return first.concat(Object.keys(STYLES).filter(k => !first.includes(k)));
}
function convert(key, text) { return STYLES[key][1](text); }
function copy(btn, text) {
  const done = () => { btn.classList.add("ok"); const t = btn.dataset.label; btn.textContent = "Copied ✓"; setTimeout(() => { btn.textContent = t; btn.classList.remove("ok"); }, 900); };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done); else done();
}
function el(tag, cls, text) { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
function fontTool(root, preset) {
  const input = el("textarea", "tool-input");
  input.rows = 2; input.maxLength = 300; input.value = "Cool Fonts"; input.setAttribute("aria-label", "Type your text");
  const list = el("div", "tool-list");
  const keys = fontsFor(preset);
  const draw = () => {
    list.textContent = "";
    const text = input.value.trim() ? input.value : "Cool Fonts";
    seed = 7;
    keys.forEach(k => {
      const out = convert(k, text), row = el("div", "tool-row"), info = el("div", "tool-out");
      info.append(el("span", "tool-name", STYLES[k][0]), el("span", "tool-text", out));
      const b = el("button", "tool-copy", "Copy"); b.type = "button"; b.dataset.label = "Copy"; b.onclick = () => copy(b, out);
      row.append(info, b); list.append(row);
    });
  };
  input.addEventListener("input", draw);
  root.append(el("h2", "tool-title", "Type your text"), input, list);
  draw();
}
function symbolTool(root, preset) {
  const names = Object.keys(SYMBOLS);
  let cur = SYMBOLS[preset] ? preset : names[0];
  const tabs = el("div", "tool-tabs"), grid = el("div", "kgrid");
  const box = el("textarea", "tool-input"); box.rows = 2; box.placeholder = "Tap symbols to build your text"; box.setAttribute("aria-label", "Your symbols");
  const copyAll = el("button", "tool-copy", "Copy all"); copyAll.type = "button"; copyAll.dataset.label = "Copy all"; copyAll.onclick = () => copy(copyAll, box.value);
  const draw = () => {
    tabs.textContent = ""; grid.textContent = "";
    names.forEach(n => { const b = el("button", "tool-tab" + (n === cur ? " on" : ""), TAB_NAMES[n]); b.type = "button"; b.onclick = () => { cur = n; draw(); }; tabs.append(b); });
    SYMBOLS[cur].forEach(s => { const b = el("button", "k", s); b.type = "button"; b.dataset.label = s; b.onclick = () => { box.value += s; copy(b, s); }; grid.append(b); });
  };
  const bar = el("div", "tool-row"); bar.append(box, copyAll);
  root.append(el("h2", "tool-title", "Tap a symbol to copy it"), tabs, grid, bar);
  draw();
}
function init() { document.querySelectorAll(".tool[data-tool]").forEach(r => { (r.dataset.tool === "symbols" ? symbolTool : fontTool)(r, r.dataset.preset || "all"); }); }
if (typeof module !== "undefined" && module.exports) module.exports = { STYLES, SYMBOLS, FONT_FIRST, fontsFor, convert, init };
if (typeof document !== "undefined") { if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init(); }
})();
