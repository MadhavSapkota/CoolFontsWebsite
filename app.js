const $ = s => document.querySelector(s);
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
function zalgo(t, n = 3) {
  return Array.from(t).map(c => c === " " ? c : c + Array.from({ length: n + (Math.random() * n | 0) }, () => zalgoMarks[Math.random() * zalgoMarks.length | 0]).join("")).join("");
}

// [name, category, fn]
const S = [];
const add = (cat, name, fn) => S.push({ cat, name, fn });
const m = k => mapper(F[k]);

add("Popular","Bold Script", m("boldScript"));
add("Popular","Script", m("script"));
add("Popular","Double Struck", m("double"));
add("Popular","Gothic", m("fraktur"));
add("Popular","Small Caps", m("smallCaps"));
add("Popular","Bubble", m("circled"));
add("Popular","Wide / Vaporwave", m("wide"));
add("Popular","Asian Style", m("asian"));

add("Bold & Italic","Bold Serif", m("bold"));
add("Bold & Italic","Italic Serif", m("italic"));
add("Bold & Italic","Bold Italic", m("boldItalic"));
add("Bold & Italic","Sans", m("sans"));
add("Bold & Italic","Sans Bold", m("sansBold"));
add("Bold & Italic","Sans Italic", m("sansItalic"));
add("Bold & Italic","Sans Bold Italic", m("sansBoldItalic"));
add("Bold & Italic","Monospace", m("mono"));
add("Bold & Italic","Bold Gothic", m("boldFraktur"));

add("Bubbles & Boxes","Black Bubble", m("negCircled"));
add("Bubbles & Boxes","Squares", m("squared"));
add("Bubbles & Boxes","Black Squares", m("negSquared"));
add("Bubbles & Boxes","Parenthesized", m("paren"));
add("Bubbles & Boxes","Boxed Keys", t => Array.from(t).map(c => c === " " ? " " : "[" + c + "]").join(""));
add("Bubbles & Boxes","Regional", t => Array.from(t.toLowerCase()).map(c => /[a-z]/.test(c) ? cp(0x1F1E6 + c.charCodeAt(0) - 97) + "\u200B" : c).join(""));

add("Fancy","Currency", m("currency"));
add("Fancy","Curvy", m("curvy"));
add("Fancy","Ancient", m("ancient"));
add("Fancy","Armenian", m("armenian"));
add("Fancy","Magic", m("magic"));
add("Fancy","Greek", m("greek"));
add("Fancy","Faux Cyrillic", m("russian"));
add("Fancy","Superscript", m("superscript"));
add("Fancy","Subscript", m("subscript"));
add("Fancy","Upside Down", t => Array.from(t).map(flipMap).reverse().join(""));
add("Fancy","Mirror Reverse", t => Array.from(t).reverse().join(""));
add("Fancy","Spaced Out", between(" "));

add("Lines & Glitch","Strikethrough", combine("\u0336"));
add("Lines & Glitch","Underline", combine("\u0332"));
add("Lines & Glitch","Double Underline", combine("\u0333"));
add("Lines & Glitch","Slashed", combine("\u0338"));
add("Lines & Glitch","Overline", combine("\u0305"));
add("Lines & Glitch","Wavy", combine("\u0334"));
add("Lines & Glitch","Underdots", combine("\u0324"));
add("Lines & Glitch","Hearts Between", between("♥"));
add("Lines & Glitch","Stars Between", between("☆"));
add("Lines & Glitch","Glitch (light)", t => zalgo(t, 1));
add("Lines & Glitch","Zalgo Chaos", t => zalgo(t, 4));

add("Lines & Glitch","Arrows Between", between("➳"));
add("Lines & Glitch","Dots Between", between("·"));
add("Lines & Glitch","Sparkle Between", between("✧"));
add("Lines & Glitch","Brackets Each", t => Array.from(t).map(c => c === " " ? " " : "【" + c + "】").join(""));
add("Lines & Glitch","Cross-Out", combine("\u0337"));
add("Lines & Glitch","Arrow Below", combine("\u0354"));
add("Lines & Glitch","Ring Above", combine("\u030A"));
add("Bubbles & Boxes","Bubble Strike", t => combine("\u0336")(mapper(F.circled)(t)));
add("Bold & Italic","Bold Script Caps", t => mapper(F.boldScript)(t.toUpperCase()));
add("Fancy","Small Caps Wide", t => between(" ")(mapper(F.smallCaps)(t)));
add("Fancy","Tiny Superscript Wide", t => between(" ")(mapper(F.superscript)(t.toLowerCase())));
add("Fancy","Mixed Gothic", t => Array.from(t).map((c, i) => (i % 2 ? F.boldFraktur : F.fraktur)(c)).join(""));
add("Fancy","Alternating Caps", t => Array.from(t).map((c, i) => i % 2 ? c.toLowerCase() : c.toUpperCase()).join(""));

[["ethiopic","Ethiopian"],["thai","Thai Style"],["wiggly","Wiggly"],["rusty","Rusty"],["dotted","Dotted"],["accent","Accented"],["leet","1337 Leet"],["lines","Line Art"],["hook","Hooked"],["squiggle","Squiggle"],["bent","Bent"]]
  .forEach(([k, n]) => add("Fancy", n, m(k)));
add("Numbers","Letters → Numbers (a=1)", t => t.toLowerCase().split(" ").map(w => Array.from(w).map(c => /[a-z]/.test(c) ? c.charCodeAt(0) - 96 : c).join("-")).join("  "));
add("Numbers","Number Bubbles (a=①)", t => Array.from(t.toLowerCase()).map(c => /[a-t]/.test(c) ? cp(0x2460 + c.charCodeAt(0) - 97) : /[u-z]/.test(c) ? "(" + (c.charCodeAt(0) - 96) + ")" : c).join(" "));
add("Numbers","Dark Number Bubbles", t => Array.from(t.toLowerCase()).map(c => /[a-t]/.test(c) ? "❶❷❸❹❺❻❼❽❾❿⓫⓬⓭⓮⓯⓰⓱⓲⓳⓴"[c.charCodeAt(0) - 97] : /[u-z]/.test(c) ? "(" + (c.charCodeAt(0) - 96) + ")" : c).join(" "));
add("Numbers","Superscript Numbers", t => Array.from(t.toLowerCase()).map(c => /[a-z]/.test(c) ? String(c.charCodeAt(0) - 96).replace(/\d/g, d => "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]) : c).join("·"));
add("Numbers","Phone Keypad", t => Array.from(t.toLowerCase()).map(c => { const k = ["abc","def","ghi","jkl","mno","pqrs","tuv","wxyz"].findIndex(g => g.includes(c)); return k < 0 ? c : String(k + 2).repeat(["abc","def","ghi","jkl","mno","pqrs","tuv","wxyz"][k].indexOf(c) + 1); }).join(" "));
add("Numbers","Binary", t => Array.from(t).map(c => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" "));
add("Numbers","Morse Code", t => Array.from(t.toLowerCase()).map(c => ({a:".-",b:"-...",c:"-.-.",d:"-..",e:".",f:"..-.",g:"--.",h:"....",i:"..",j:".---",k:"-.-",l:".-..",m:"--",n:"-.",o:"---",p:".--.",q:"--.-",r:".-.",s:"...",t:"-",u:"..-",v:"...-",w:".--",x:"-..-",y:"-.--",z:"--..",1:".----",2:"..---",3:"...--",4:"....-",5:".....",6:"-....",7:"--...",8:"---..",9:"----.",0:"-----"," ":"/"})[c] ?? c).join(" "));

const comboBases = [["boldScript","Script"],["double","Double"],["fraktur","Gothic"],["sansBold","Bold"],["mono","Mono"],["smallCaps","Small Caps"],["circled","Bubble"],["italic","Italic"]];
const comboFx = [["\u0336","Strike"],["\u0332","Underline"],["\u0334","Wavy"],["\u0338","Slash"]];
comboBases.forEach(([b, bn]) => comboFx.forEach(([fx, fn]) => add("Font Combos", bn + " " + fn, t => combine(fx)(mapper(F[b])(t)))));

const ICONS = [["★","Star"],["♥","Love"],["♡","Heart Outline"],["✿","Flower"],["✨","Sparkles"],["💖","Pink Heart"],["⭐","Gold Star"],["🌸","Blossom"],["🔥","Fire"],["👑","Crown"],["💎","Diamond"],["💍","Ring"],["🦋","Butterfly"],["🌙","Moon"],["☀️","Sun"],["🎀","Bow"],["🍀","Lucky"],["⚡","Lightning"],["🎵","Music"],["😎","Cool"],["🥰","Lovey"],["💫","Dizzy Star"],["🌈","Rainbow"],["☁️","Cloud"]];
ICONS.forEach(([i, n]) => add("Text + Icons", n, t => i + " " + t + " " + i));
add("Text + Icons","Stars All Around", t => "★ " + Array.from(t).join(" ★ ") + " ★");
add("Text + Icons","Hearts All Around", t => "♥ " + Array.from(t).join(" ♥ ") + " ♥");
add("Text + Icons","Love Burst", t => "💕💖 " + t + " 💖💕");
add("Text + Icons","Star Shower", t => "⋆｡°✩ " + t + " ✩°｡⋆");

// Decorated combos
const decoFonts = ["boldScript","fraktur","smallCaps","double","script","sansBold","asian","wide","boldFraktur","curvy","italic","magic"];
DECOR.forEach(([l, r], i) => {
  const f = decoFonts[i % decoFonts.length];
  add("Decorated & Art", "Art " + (i + 1), t => l + mapper(F[f])(t) + r);
});

add("Popular","Gold Bold", m("boldScript"));
add("Popular","Silver Gothic", m("boldFraktur"));
add("Popular","Diamond Double", t => "💎 " + mapper(F.double)(t) + " 💎");
const METAL = { "Gold Bold": "gold", "Silver Gothic": "silver", "Diamond Double": "diamond" };

// --- render ---
const CATS = ["All", ...new Set(S.map(s => s.cat))];
let cat = "All";
const store = { get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} } };
let favs = new Set(store.get("favs", []));

function copy(text) {
  (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).catch(() => {
    const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove();
  });
  const t = $("#toast"); t.textContent = "Copied! ✓  " + (text.length > 24 ? text.slice(0, 24) + "…" : text);
  t.classList.add("show"); clearTimeout(copy.t); copy.t = setTimeout(() => t.classList.remove("show"), 1400);
}

function card(s, text) {
  const el = document.createElement("div");
  el.className = "card" + (METAL[s.name] ? " " + METAL[s.name] : "");
  const out = s.fn(text || "Cool Fonts");
  el.innerHTML = `<div class="name"></div><div class="out"></div><div class="acts"><button class="fav ${favs.has(s.name) ? "on" : ""}" title="Favorite">★</button><button class="copy-pill">Copy</button></div>`;
  el.querySelector(".name").textContent = (S.indexOf(s) + 1) + ". " + s.name;
  el.querySelector(".out").textContent = out;
  el.onclick = e => {
    if (e.target.classList.contains("fav")) {
      favs.has(s.name) ? favs.delete(s.name) : favs.add(s.name);
      store.set("favs", [...favs]); render(); return;
    }
    copy(s.fn(text || "Cool Fonts"));
  };
  return el;
}

function render() {
  const text = $("#input").value;
  const res = $("#results"); res.innerHTML = "";
  const cats = cat === "All" ? CATS.slice(1) : [cat];
  cats.forEach(c => {
    const h = document.createElement("div"); h.className = "group-h";
    h.innerHTML = `<h2></h2><span>${S.filter(s => s.cat === c).length} styles</span>`; h.querySelector("h2").textContent = c; res.appendChild(h);
    const g = document.createElement("div"); g.className = "grid";
    S.filter(s => s.cat === c).forEach(s => g.appendChild(card(s, text)));
    res.appendChild(g);
  });
  const fw = $("#favs"); fw.innerHTML = "";
  S.filter(s => favs.has(s.name)).forEach(s => fw.appendChild(card(s, text)));
  $("#fav-wrap").hidden = !favs.size;
}

function tabs() {
  $("#tabs").innerHTML = "";
  CATS.forEach(c => {
    const b = document.createElement("button");
    b.className = "tab" + (c === cat ? " on" : ""); b.textContent = c;
    b.onclick = () => { cat = c; document.querySelectorAll(".try").forEach(b => b.onclick = () => { $("#input").value = b.textContent; render(); renderArt(); renderBig(); renderBio(); $("#input").focus(); });
$("#input").addEventListener("keydown", e => { if (e.key === "Enter") e.preventDefault(); });
tabs(); render(); $("#fonts").scrollIntoView({ behavior: "smooth" }); };
    $("#tabs").appendChild(b);
  });
}

// Kaomoji
let kcat = Object.keys(KAOMOJI)[0];
function renderKao() {
  $("#kao-tabs").innerHTML = "";
  Object.keys(KAOMOJI).forEach(k => {
    const b = document.createElement("button");
    b.className = "chip" + (k === kcat ? " on" : ""); b.textContent = k;
    b.onclick = () => { kcat = k; renderKao(); };
    $("#kao-tabs").appendChild(b);
  });
  $("#kao").innerHTML = "";
  KAOMOJI[kcat].forEach(k => {
    const d = document.createElement("div"); d.className = "kao"; d.textContent = k; d.title = k;
    d.onclick = () => copy(k); $("#kao").appendChild(d);
  });
}

function fillArt(art, t) {
  t = t || "Cool Fonts";
  if (art === "{box}") { const w = Array.from(t).length + 4; return "╔" + "═".repeat(w) + "╗\n║  " + t + "  ║\n╚" + "═".repeat(w) + "╝"; }
  return art.includes("{t}") ? art.split("{t}").join(t) : art + "\n" + t;
}
const seg = s => Array.from(new Intl.Segmenter().segment(s), x => x.segment).filter(x => x.trim());
const isWide = c => /\p{Emoji_Presentation}|\uFE0F|[\u{1F000}-\u{1FFFF}]|\p{Script=Katakana}|\p{Script=Hiragana}|\p{Script=Han}|[\uFF00-\uFFEF\u3000-\u303F]/u.test(c);
// icon: one symbol/kaomoji, OR several symbols (cycled) — "🌸🌼" or "✿ ❀"; bg: optional background fill
function bigText(t, icon, bg) {
  let parts;
  const toks = icon.trim().split(/\s+/);
  if (toks.length > 1 && toks.every(x => seg(x).length <= 2) && !/[()ʕʔ]/.test(icon)) parts = toks;
  else { const s = seg(icon); parts = s.every(c => isWide(c)) || (s.length <= 4 && !/[()ʕʔ]/.test(icon)) ? s : [icon]; }
  if (!parts.length) parts = ["★"];
  const blank = p => Array.from(new Intl.Segmenter().segment(p), x => x.segment).map(c => isWide(c) ? "　" : " ").join("") || " ";
  const off = bg || blank(parts[0]);
  const G = bigSize === "small" ? GLYPHS_SM : GLYPHS, max = bigSize === "small" ? 12 : 8;
  let letters = 0; // spaces do not use up the letter limit
  const chars = Array.from(t.toUpperCase().replace(/\s+/g, " ")).filter(c => (G[c] || c === " ") && (c === " " || ++letters <= max));
  // Each word is its own block, stacked vertically, so the art fits page and chat widths without wrapping.
  let k = 0;
  const blocks = chars.join("").trim().split(" ").filter(Boolean).map(word => {
    const rows = [[], [], [], [], []];
    Array.from(word).forEach((c, i) => {
      G[c].split("|").forEach((row, r) => {
        if (i) rows[r].push(off);
        Array.from(row).forEach(p => rows[r].push(p === "#" ? parts[(k++) % parts.length] : off));
      });
    });
    return rows;
  });
  if (bg) {
    const width = Math.max(0, ...blocks.flat().map(r => r.length));
    const line = cells => off + cells.join("") + off.repeat(width - cells.length + 1);
    return blocks.map(b => b.map(line).join("\n")).join("\n" + off.repeat(width + 2) + "\n");
  }
  return blocks.map(b => b.map(r => r.join("").replace(/[\s　]+$/u, "")).join("\n")).join("\n\n");
}
let bigSize = "big", bigFirst = null;
document.querySelectorAll("#big-size button").forEach(b => b.onclick = () => {
  bigSize = b.dataset.s;
  document.querySelectorAll("#big-size button").forEach(x => x.classList.toggle("on", x === b));
  $("#big-note").textContent = bigSize === "small" ? "Small letters · up to 12 letters" : "Up to 8 letters";
  renderBig();
});
RELATIVES.forEach(([w, i]) => {
  const b = document.createElement("button"); b.className = "chip"; b.textContent = i + " " + w;
  b.onclick = () => {
    $("#input").value = w; bigFirst = i;
    document.querySelectorAll("#rel-chips .chip").forEach(x => x.classList.toggle("on", x === b));
    render(); renderArt(); renderBig(); renderBio();
  };
  $("#rel-chips").appendChild(b);
});
let customIcon = "", flowerGroup = "Flower Pairs", flowerShow = 24;
Object.keys(FLOWER_GROUPS).forEach(g => {
  const b = document.createElement("button");
  b.className = "chip" + (g === flowerGroup ? " on" : "");
  b.textContent = "🌸 " + g + " (" + FLOWER_GROUPS[g].length + ")";
  b.onclick = () => {
    flowerGroup = g; flowerShow = 24;
    document.querySelectorAll("#flower-chips .chip").forEach(x => x.classList.toggle("on", x === b));
    renderBig();
  };
  $("#flower-chips").appendChild(b);
});
const PICK_SYM = ["★","♥","✿","❀","✦","❄","☀","☾","♛","✞","ღ","ツ","❖","◆","●","■","▲","♪","☯","☮","✓","💗","🌹","🌻","🍓","🍒","🐰","🐻","🦋","🌈","⚽","🎀","💎","🔥","⭐","🕉"];
const PICK_KAO = ["(◕‿◕)","ʕ•ᴥ•ʔ","(^_^)","(♥‿♥)","ฅ^•ﻌ•^ฅ","(✿◠‿◠)","( ͡° ͜ʖ ͡°)","(⌐■_■)","(｡♥‿♥｡)","(=^･ω･^=)","¯\\_(ツ)_/¯","(•ᴥ•)","(ᵔᴥᵔ)","(◠‿◠)","♡(ᐢ ᴥ ᐢ)♡","(っ◔◡◔)っ"].map(k => k.replace("\\\\", "\\"));
function setPick(v) {
  customIcon = v; $("#pick-in").value = v; $("#pick-prev").textContent = v ? "Drawing with: " + v : "";
  document.querySelectorAll(".pick-opt").forEach(b => b.classList.toggle("on", b.textContent === v));
  renderBig();
}
[["#pick-sym", PICK_SYM], ["#pick-kao", PICK_KAO]].forEach(([sel, arr]) => arr.forEach(v => {
  const b = document.createElement("button"); b.className = "pick-opt"; b.textContent = v;
  b.onclick = () => setPick(customIcon === v ? "" : v); $(sel).appendChild(b);
}));
$("#pick-in").addEventListener("input", e => setPick(e.target.value.trim()));
function renderBig() {
  const t = $("#input").value.trim() || "HI";
  $("#bigs").innerHTML = "";
  if (customIcon) {
    const out = bigText(t, customIcon);
    const d = document.createElement("div"); d.className = "card art big custom";
    d.innerHTML = `<div class="name"></div><pre></pre><div class="acts"><button class="copy-pill">Copy</button></div>`;
    d.querySelector(".name").textContent = "★ Your pick: " + customIcon;
    d.querySelector("pre").textContent = out;
    d.onclick = () => copy(out); $("#bigs").appendChild(d);
  }
  const fl = FLOWER_GROUPS[flowerGroup] || [];
  fl.slice(0, flowerShow).forEach(([icon, n, bg]) => {
    const out = bigText(t, icon, bg);
    const d = document.createElement("div"); d.className = "card art big";
    d.innerHTML = `<div class="name"></div><pre></pre><div class="acts"><button class="copy-pill">Copy</button></div>`;
    d.querySelector(".name").textContent = "🌸 " + n;
    d.querySelector("pre").textContent = out;
    d.onclick = () => copy(out); $("#bigs").appendChild(d);
  });
  if (fl.length > flowerShow) {
    const m = document.createElement("button"); m.className = "more-btn";
    m.textContent = "Show more flower combos (" + (fl.length - flowerShow) + " more) ↓";
    m.onclick = () => { flowerShow += 24; renderBig(); };
    $("#bigs").appendChild(m);
  }
  const sep = document.createElement("div"); sep.className = "big-sep"; sep.textContent = "Single icons"; $("#bigs").appendChild(sep);
  const list = bigFirst ? [...BIG_ICONS.filter(x => x[0] === bigFirst), ...BIG_ICONS.filter(x => x[0] !== bigFirst)] : BIG_ICONS;
  list.forEach(([icon, n]) => {
    const out = bigText(t, icon);
    const d = document.createElement("div"); d.className = "card art big";
    d.innerHTML = `<div class="name"></div><pre></pre><div class="acts"><button class="copy-pill">Copy</button></div>`;
    d.querySelector(".name").textContent = icon + " " + n; d.querySelector("pre").textContent = out;
    d.onclick = () => copy(out); $("#bigs").appendChild(d);
  });
  fitBig();
}
// Shrinks each preview so every letter is visible; the copied text is unchanged.
function fitBig() {
  const pres = [...document.querySelectorAll("#bigs pre")];
  pres.forEach(p => { p.style.fontSize = ""; });
  const sizes = pres.map(p => ({ p, base: parseFloat(getComputedStyle(p).fontSize), ratio: p.clientWidth / p.scrollWidth }));
  sizes.forEach(({ p, base, ratio }) => { if (ratio < 1) p.style.fontSize = Math.max(4, base * ratio * 0.98) + "px"; });
}
let fitTimer;
window.addEventListener("resize", () => { clearTimeout(fitTimer); fitTimer = setTimeout(fitBig, 150); });
let bioTab = "Instagram";
function bioText(tpl, font, name) {
  const fancyTag = s => s.replace(/#([A-Za-z0-9]+)/g, (m, w) => "#" + mapper(F.sansBold)(w));
  return fancyTag(tpl.split("{n}").join(mapper(F[font])(name)));
}
function renderBio() {
  const name = $("#input").value.trim() || "Your Name";
  $("#bio-tabs").innerHTML = "";
  Object.keys(BIOS).forEach(k => {
    const b = document.createElement("button");
    b.className = "chip" + (k === bioTab ? " on" : "");
    b.textContent = ({ Instagram: "📸 ", TikTok: "🎵 ", Facebook: "👍 " })[k] + k;
    b.onclick = () => { bioTab = k; renderBio(); };
    $("#bio-tabs").appendChild(b);
  });
  const list = BIOS[bioTab], half = Math.ceil(list.length / 2);
  [[$("#bio-track"), list.slice(0, half)], [$("#bio-track2"), list.slice(half)]].forEach(([track, items]) => {
    track.innerHTML = "";
    [...items, ...items].forEach(([font, label, tpl], i) => {
      const out = bioText(tpl, font, name);
      const d = document.createElement("div"); d.className = "bio-card";
      if (i >= items.length) d.setAttribute("aria-hidden", "true");
      d.innerHTML = `<div class="bio-top"><span class="bio-label"></span><span class="copy-pill">Copy</span></div><pre></pre>`;
      d.querySelector(".bio-label").textContent = bioTab + " · " + label;
      d.querySelector("pre").textContent = out;
      d.onclick = () => copy(out);
      track.appendChild(d);
    });
    track.style.animationDuration = items.length * 7 + "s";
  });
}
function renderArt() {
  const t = $("#input").value.trim();
  $("#arts").innerHTML = "";
  ART.forEach(([n, a]) => {
    const out = fillArt(a, t);
    const d = document.createElement("div"); d.className = "card art";
    d.innerHTML = `<div class="name"></div><pre></pre><div class="acts"><button class="copy-pill">Copy</button></div>`;
    d.querySelector(".name").textContent = n; d.querySelector("pre").textContent = out;
    d.onclick = () => copy(out); $("#arts").appendChild(d);
  });
}

let scat = "All";
function renderSyms() {
  const q = ($("#sym-search").value || "").toLowerCase();
  $("#sym-tabs").innerHTML = "";
  ["All", ...Object.keys(SYMBOLS)].forEach(k => {
    const b = document.createElement("button");
    b.className = "chip" + (k === scat ? " on" : ""); b.textContent = k;
    b.onclick = () => { scat = k; renderSyms(); };
    $("#sym-tabs").appendChild(b);
  });
  $("#syms").innerHTML = "";
  Object.entries(SYMBOLS).filter(([n]) => (scat === "All" || n === scat) && n.toLowerCase().includes(q)).forEach(([n, s]) => {
    const g = document.createElement("div"); g.className = "sym-group";
    g.innerHTML = `<h3></h3><div class="sym-row"></div>`; g.querySelector("h3").textContent = n;
    Array.from(new Intl.Segmenter().segment(s), x => x.segment).forEach(c => {
      const b = document.createElement("button"); b.className = "sym"; b.textContent = c; b.title = "Copy " + c;
      b.onclick = () => copy(c); g.querySelector(".sym-row").appendChild(b);
    });
    $("#syms").appendChild(g);
  });
}
$("#sym-search").addEventListener("input", renderSyms);

// Theme
const theme = store.get("theme", "light");
document.documentElement.dataset.theme = theme;
$("#theme").onclick = () => {
  const t = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = t; store.set("theme", t);
};

let deb;
$("#input").addEventListener("input", () => { clearTimeout(deb); deb = setTimeout(() => { render(); renderArt(); renderBig(); renderBio(); }, 60); });
$("#clear").onclick = () => { $("#input").value = ""; $("#input").focus(); render(); renderArt(); renderBig(); renderBio(); };

document.querySelectorAll(".try").forEach(b => b.onclick = () => { $("#input").value = b.textContent; render(); renderArt(); renderBig(); renderBio(); $("#input").focus(); });
$("#input").addEventListener("keydown", e => { if (e.key === "Enter") e.preventDefault(); });
tabs(); render(); renderKao(); renderArt(); renderBig(); renderBio(); renderSyms();
