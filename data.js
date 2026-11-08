const KAOMOJI = {
  "Happy": ["(◕‿◕)","(＾▽＾)","٩(◕‿◕)۶","(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧","(✿◠‿◠)","ヽ(•‿•)ノ","(≧◡≦)","(◠‿◠✿)","＼(^o^)／","(*^▽^*)","(´｡• ᵕ •｡`)","٩(｡•́‿•̀｡)۶","(o^▽^o)","(⌒‿⌒)","ヾ(＾∇＾)","(✯◡✯)","☆*:.｡.o(≧▽≦)o.｡.:*☆","(〃＾▽＾〃)"],
  "Love": ["(♡μ_μ)","(´∀｀)♡","(◍•ᴗ•◍)❤","(｡♥‿♥｡)","♡＾▽＾♡","(っ˘з(˘⌣˘ ) ♡","(*♡∀♡)","(´ε｀ )♡","( ˘ ³˘)♥","♥(ˆ⌣ˆԅ)","(≧◡≦) ♡","(づ￣ ³￣)づ","(灬º‿º灬)♡","❤ (ɔˆз(ˆ⌣ˆc)","♡(ӦｖӦ｡)","(˘∀˘)/(μ‿μ) ❤"],
  "Sad": ["(╥﹏╥)","(ಥ﹏ಥ)","(｡•́︿•̀｡)","(っ˘̩╭╮˘̩)っ","(T_T)","(;´༎ຶД༎ຶ`)","( ´•̥̥̥ω•̥̥̥` )","(◞‸◟；)","｡ﾟ(ﾟ´Д｀ﾟ)ﾟ｡","(ᗒᗣᗕ)՞","(╯︵╰,)","(ノ_<。)","( ╥ω╥ )","(-_-;)・・・"],
  "Angry": ["(╬ Ò﹏Ó)","(ノಠ益ಠ)ノ彡┻━┻","(╯°□°）╯︵ ┻━┻","ヽ(`Д´)ﾉ","(ꐦ°᷄д°᷅)","(҂ `з´ )","凸(￣ヘ￣)","(＃`Д´)","ಠ_ಠ","(¬_¬\")","(눈_눈)","┬─┬ノ( º _ ºノ)"],
  "Cute": ["(｡◕‿◕｡)","ʕ•ᴥ•ʔ","(=^･ω･^=)","ฅ^•ﻌ•^ฅ","(ᵔᴥᵔ)","૮ ˶ᵔ ᵕ ᵔ˶ ა","(っ◔◡◔)っ ♥","૮₍ ˃ ⤙ ˂ ₎ა","₍ᐢ•ﻌ•ᐢ₎","(˶ᵔ ᵕ ᵔ˶)","/ᐠ｡ꞈ｡ᐟ\\","ʕ •́؈•̀ ₎","(◕ᴗ◕✿)","ପ(๑•ᴗ•๑)ଓ ♡","(*ᴗ͈ˬᴗ͈)ꕤ*.ﾟ","₍₍ ◝(●˙꒳˙●)◜ ₎₎"],
  "Shrug & Cool": ["¯\\_(ツ)_/¯","(⌐■_■)","( ͡° ͜ʖ ͡°)","(•_•) ( •_•)>⌐■-■ (⌐■_■)","ᕕ( ᐛ )ᕗ","(☞ﾟヮﾟ)☞","☜(ﾟヮﾟ☜)","(ง •̀_•́)ง","ᕦ(ò_óˇ)ᕤ","( ͡~ ͜ʖ ͡°)","┐(￣ヘ￣)┌","(¬‿¬)","(▀̿Ĺ̯▀̿ ̿)","ʘ‿ʘ"],
  "Animals": ["ʕ •ᴥ•ʔ","(=①ω①=)","ᘛ⁐̤ᕐᐷ","><(((('>","(•ㅅ•)","(・⊝・)","( ˘ ɜ˘) ♬♪♫","ᓚᘏᗢ","∪･ω･∪","(V●ᴥ●V)","🐾 ฅ(＾・ω・＾ฅ)","/(•ㅅ•)\\","(°)#))<<","＜コ:彡"],
  "Actions": ["(っ˘ڡ˘ς)","(*-_-)zzZ","(｀・ω・´)ゞ","ヾ(・ω・*)","(ﾉ´ヮ`)ﾉ*: ･ﾟ","(ﾉ◕ヮ◕)ﾉ","┌(・。・)┘♪","♪┏(・o･)┛♪","(☆^O^☆)","(ノ°ο°)ノ","Σ(°ロ°)","(⊙_⊙)","(・_・ヾ","ヽ(°〇°)ﾉ"]
};

let ART = [
  ["Cat", " /\\_/\\\n( o.o )  ♡ {t}\n > ^ <"],
  ["Bunny", "(\\_/)\n( •_•)\n/ >♥ {t}"],
  ["Bear", "ʕ•ᴥ•ʔ\n /づ♥ \n  U U"],
  ["Heart", "  ♥♥   ♥♥\n♥♥♥♥ ♥♥♥♥\n ♥♥♥♥♥♥♥\n   ♥♥♥♥\n     ♥\n ♡ {t} ♡"], ["_old", "  ♥♥   ♥♥\n♥♥♥♥ ♥♥♥♥\n ♥♥♥♥♥♥♥\n   ♥♥♥♥\n     ♥"],
  ["Gun", "▄︻デ{t}══━一 💥"],
  ["Sword", "o()xxxx[{::: {t} :::>"],
  ["Rose", "    ,.\n  (\\(\\)\n  ;  o >\n /(  _)\n  `--'\n   |\n  \\|/"],
  ["Hug Bunny", "(\\__/)\n(•ㅅ•)\n/ 　 づ♡ {t}"],
  ["Coffee", "   ( (\n    ) )\n  ........\n  |      |]\n  \\      /\n   `----'"],
  ["Table Flip", "(╯°□°）╯︵ ┻━┻"],
  ["Sparkle Divider", "˚ ༘♡ ⋆｡˚ ꕥ ˚｡⋆ ♡ ༘˚"],
  ["Lenny Army", "( ͡° ͜ʖ ͡°)( ͡° ͜ʖ ͡°)( ͡° ͜ʖ ͡°)"],
  ["Fish", "  ><(((º>  ><>\n ><>   <º)))><"],
  ["Star", "    ★\n   ★★★\n★★★★★★★\n  ★★ ★★\n ★     ★\n★ {t} ★"], ["_old", "    ★\n   ★★★\n★★★★★★★\n  ★★ ★★\n ★     ★"],
  ["Music", "ılı.lıllılı.ıllı.\n▶ ●───────── 3:14"],
  ["Box Frame", "{box}"]
];

let SYMBOLS = {
  "Hearts": "♡♥❤❥❣❦❧ღ❤️🧡💛💚💙💜🖤🤍🤎💕💞💓💗💖💘💝💟❣️ᥫ᭡",
  "Stars": "★☆✦✧✩✪✫✬✭✮✯✰⁂⁎⁑✢✣✤✥✱✲✳✴✵✶✷✸✹✺✻✼❂⋆✨🌟⭐",
  "Flowers & Plants": "✿❀❁✾✽❃❋❊❉✼⚘𖧷ꕤꕥ🌸🌺🌹🌷🌻🌼💐🍀☘🌿🍃🌱",
  "Snow & Weather": "❄❅❆☃⛄☀☁☂☔⛅⛈☄☾☽☼🌙🌈⚡🌪🔥💧",
  "Arrows": "←↑→↓↔↕↖↗↘↙⇐⇑⇒⇓⇔⇕⇦⇧⇨⇩➔➘➙➚➛➜➝➞➟➠➡➢➣➤➥➦➧➨➩➪➫➬➭➮➯➱➲↩↪⤴⤵↻↺⟲⟳",
  "Brackets": "【】『』「」〖〗〔〕《》〈〉⦅⦆⟦⟧⟨⟩❨❩❪❫❬❭❮❯❰❱❲❳❴❵﴾﴿⁅⁆",
  "Bullets & Dots": "•◦●○◉◎◌◍◘◙·∙⋅⊙⊚⊛⦿⁌⁍※⁘⁙⁚⁛⁜‣⁃",
  "Lines & Borders": "─━│┃┄┅┆┇┈┉┊┋┌┐└┘├┤┬┴┼═║╒╓╔╕╖╗╘╙╚╛╜╝╞╟╠╡╢╣╤╥╦╧╨╩╪╫╬╭╮╯╰▬▭¦‖",
  "Blocks & Shapes": "■□▢▣▤▥▦▧▨▩▪▫▬▮▯▰▱▲△▴▵▶▷▸▹►▻▼▽▾▿◀◁◂◃◄◅◆◇◈◊○◢◣◤◥█▓▒░▀▄▌▐",
  "Checks & Crosses": "✓✔✕✖✗✘☐☑☒☓⊗⊘⊠⨯❌❎✅",
  "Math": "+−×÷=≠≈≡≤≥±∓∞∑∏∫∂√∛∜∆∇∈∉∩∪⊂⊃⊆⊇∧∨¬∀∃∅∝∠⊥∥%‰π",
  "Numbers": "①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳❶❷❸❹❺❻❼❽❾❿⓪½⅓⅔¼¾⅛ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ",
  "Currency": "$€£¥¢₹₩₽₺₦₱₫₴₪₭₮₲₳₵₸฿₿¤",
  "Music": "♩♪♫♬♭♮♯𝄞𝄢🎵🎶🎧🎤🎸🎹",
  "Zodiac & Astro": "♈♉♊♋♌♍♎♏♐♑♒♓☉☿♀♁♂♃♄♅♆⛎",
  "Chess & Cards": "♔♕♖♗♘♙♚♛♜♝♞♟♠♡♢♣♤♥♦♧🂡🃏",
  "Religion & Peace": "☮☯☪☸☦☥✝✞✟✠✡☬☫☩🕉🕎",
  "Hands & Gestures": "☚☛☜☝☞☟✌✍✋👍👎👌🤞🤟🤘👏🙏💪",
  "Office & Tech": "✉✎✏✐✑✒✂✄☎☏⌚⌛⏳⌨✆⚙⚒⚔⚖⚗⚛🔑🔒",
  "Gender & Misc": "♀♂⚢⚣⚤⚥⚦⚧⚲☠☢☣⚠⚡♻♿⚓⚑⚐©®™℗℠№℃℉",
  "Japanese & Deco": "彡ツシッ〆〄〒〠ヅ乂卍卐の〤〥ゞゝ々〃｡･ﾟ｡ꕀ꒰꒱ʚɞ୨୧ᐟᐠ"
};

const DECOR = [
  ["★彡 ","彡★"],["꧁༒☬ "," ☬༒꧂"],["•°¯`•• "," ••´¯°•"],["▄︻デ ","══━一"],["(っ◔◡◔)っ ♥ "," ♥"],
  ["✿ "," ✿"],["【","】"],["『","』"],["𓆩♡𓆪 "," 𓆩♡𓆪"],["⋆｡°✩ "," ✩°｡⋆"],["ıllıllı "," ıllıllı"],
  ["·.¸¸.·♩♪♫ "," ♫♪♩·.¸¸.·"],["◦•●◉✿ "," ✿◉●•◦"],["▀▄▀▄ "," ▄▀▄▀"],["꧁ "," ꧂"],["˗ˏˋ "," ˎˊ˗"],
  ["╰☆☆ "," ☆☆╮"],["✧･ﾟ: *✧･ﾟ:* ", " *:･ﾟ✧*:･ﾟ✧"],["︵‿︵‿୨♡୧ ", " ୨♡୧‿︵‿︵"],["⫷ "," ⫸"],["☾ "," ☽"],["♛ "," ♛"]
];

DECOR.push(
  ["☆꧁✬◦°˚°◦. "," .◦°˚°◦✬꧂☆"],["▁ ▂ ▄ ▅ ▆ ▇ █ "," █ ▇ ▆ ▅ ▄ ▂ ▁"],["█▓▒░⡷⠂ ","⠐⢾░▒▓█"],["°°°·.°·..·°¯°·._.· ",".·._.·°¯°·..·°.·°°°"],
  ["⚡ "," ⚡"],["🔥 "," 🔥"],["👑 "," 👑"],["💎 "," 💎"],["🦋 "," 🦋"],["🌸 "," 🌸"],["✨ "," ✨"],["🖤 "," 🖤"],
  ["★·.·´¯`·.·★ "," ★·.·´¯`·.·★"],["(¯´•._.• "," •._.•´¯)"],["¸„.-•~¹°”ˆ˜¨ "," ¨˜ˆ”°¹~•-.„¸"],["▌│█║▌║▌║ "," ║▌║▌║█│▌"],
  ["×º°”˜`”°º× "," ×º°”˜`”°º×"],["•´¯`•. "," .•´¯`•"],["▂▃▅▇█▓▒░ "," ░▒▓█▇▅▃▂"],["]|I{•------» "," «------•}I|["],
  ["✌(◕‿-)✌ "," ✌(◕‿-)✌"],["(◍•ᴗ•◍)❤ "," ❤"],["ʕっ•ᴥ•ʔっ "," ♡"],["ฅ^•ﻌ•^ฅ "," ฅ^•ﻌ•^ฅ"],
  ["(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ ",""],["ᕙ(⇀‸↼‶)ᕗ "," ᕙ(⇀‸↼‶)ᕗ"],["( ͡° ͜ʖ ͡°) "," ( ͡° ͜ʖ ͡°)"],["(☞ﾟヮﾟ)☞ "," ☜(ﾟヮﾟ☜)"],
  ["ʚ "," ɞ"],["୨୧ "," ୨୧"],["꒰ "," ꒱"],["ˏˋ°•*⁀➷ ",""],["⊹˚₊‧ "," ‧₊˚⊹"],["⋆⁺₊⋆ ☾ "," ☽ ⋆⁺₊⋆"],
  ["✦•┈๑⋅⋯ "," ⋯⋅๑┈•✦"],["─── ⋆⋅☆⋅⋆ "," ⋆⋅☆⋅⋆ ───"],["︻╦̵̵͇̿̿̿̿╤── "," ──╤╦̵̵͇̿̿̿̿︻"],["▬▬ι═══════ﺤ ",""],
  ["◥꧁ད "," ཌ꧂◤"],["ঔৣ☬✞ "," ✞☬ঔৣ"],["࿐ "," ࿐"],["亗 "," 亗"],["么 "," 么"],["ᴳᵒᵈ ",""],
  ["乂 "," 乂"],["『✦』 "," 『✦』"],["┊ ┊ ┊ ┊ ★ "," ★ ┊ ┊ ┊ ┊"],["♚ "," ♚"],["☠ "," ☠"],["⚔ "," ⚔"]
);
ART.push(
  ["Owl", "  ,_,\n (O,O)\n (   )\n  \" \""],
  ["Dog", "  / \\__\n (    @\\___\n /         O\n/   (_____/\n/_____/   U"],
  ["Pig", " ^..^\n(oo)\n(  )~"],
  ["Mouse", "  ()-()\n   \\\"/\n    `"],
  ["Snail", "    @\n  _/_ \\@\n (____/ "],
  ["Duck", "  __\n<(o )___\n ( ._> /\n  `---'"],
  ["Penguin", "  (o_\n  //\\\n  V_/_"],
  ["Butterfly", " Ƹ̵̡Ӝ̵̨̄Ʒ  Ƹ̵̡Ӝ̵̨̄Ʒ"],
  ["Crown", " ♚ ♛ ♚\n▀▄▀▄▀▄▀"],
  ["House", "   /\\\n  /  \\\n /____\\\n |[] |\n |__|_|"],
  ["Rocket", "   /\\\n  |  |\n  |  |\n /|##|\\\n/_|__|_\\\n  /\\/\\"],
  ["Love Letter", "╔══╗\n╚╗╔╝\n╔╝(¯`v´¯)\n╚══`.¸.{t}"],
  ["Skull", "  ___\n /x x\\\n|  ^  |\n \\vvv/"],
  ["Flower Pot", "  ✿ ✿ ✿\n \\|/\\|/\n ╔═══╗\n ╚═══╝"],
  ["Divider Hearts", "♡ ･ﾟ: *✧ ♡ ･ﾟ: *✧ ♡"],
  ["Cute Divider", "⋆ ˚｡⋆୨୧˚ ˚୨୧⋆｡˚ ⋆"],
  ["Waves", "～～～～～～～～～\n ⋆｡ﾟ☁︎｡⋆｡ ﾟ☾ ﾟ｡⋆"],
  ["Bow & Arrow", "➳♥ ━━━ {t} ━━━➤"],
  ["Shrug Gang", "¯\\_(ツ)_/¯ ¯\\_(ツ)_/¯"],
  ["Hug", "(っ´▽｀)っ ♡ {t} ♡ ⊂(◕‿◕⊂)"]
);

// ---- Jewelry & Bling ----
SYMBOLS = Object.assign({ "Jewelry & Bling": "💍💎📿👑💰🪙🥇🥈🏆✨⭐🌟💫♛♕◇◆❖⟡⬥⬦◈⋄❂☼⚜︎♢♦" }, SYMBOLS);
KAOMOJI["Bling ✨"] = ["(◕‿◕)💍","(✧ω✧)💎","ヽ(♡‿♡)ノ💍","(☆▽☆)👑","(＾◇＾)💎✨","(ﾉ◕ヮ◕)ﾉ💍✧","(✪‿✪)ノ📿","(◍•ᴗ•◍)💰","( •̀ᴗ•́ )و 🥇","♛(◕‿◕)♛","💎(⌐■_■)💎","(*≧▽≦)💍💎"];
ART.unshift(
  ["Gold Ring", "    _◇_\n   /    \\\n  |  💛  |\n   \\____/"],
  ["Diamond Ring", "     ◆\n    ◢◣\n  ╭─╯╰─╮\n  │      │\n  ╰──────╯"],
  ["Silver Ring", "   ◇◇◇\n  (    )\n   ‾‾‾‾"],
  ["Big Diamond", "   ________\n  /\\  /\\  /\\\n /__\\/__\\/__\\\n \\   \\  /   /\n  \\   \\/   /\n   \\  /\\  /\n    \\/  \\/"],
  ["Diamond Necklace", "◟◦•◦•◦•◦•◦•◦◞\n  ◟•◦•◦•◦•◦◞\n    ◟◦•◦•◞\n       💎"],
  ["Pearl Necklace", "○ ○ ○ ○ ○ ○ ○ ○\n ○           ○\n   ○ ○ ○ ○ ○\n       ◆"],
  ["Gold Chain", "∞∞∞∞∞∞∞∞∞∞∞∞\n  ∞∞∞∞∞∞∞∞∞∞\n      👑"],
  ["Earrings", " o        o\n |        |\n ◇        ◇\n ◆        ◆"],
  ["Drop Earrings", "  ○      ○\n  ┃      ┃\n  💧      💧\n  💎      💎"],
  ["Hoop Earrings", "  ◯      ◯\n (  )    (  )\n  ◯      ◯"],
  ["Crown Jewels", "  👑\n ♛ ♕ ♛\n💎💎💎💎"],
  ["Bling Divider", "✧･ﾟ:💎:･ﾟ✧💍✧･ﾟ:💎:･ﾟ✧"],
  ["Gold Bars", "  ▄▄▄▄▄\n ▟█████▙\n▟███████▙  💰"],
  ["Medal Set", "🥇 GOLD  🥈 SILVER  🥉 BRONZE"]
);
DECOR.unshift(
  ["💍 "," 💍"],["💎 "," 💎"],["📿 "," 📿"],["💍✨ "," ✨💎"],["◆◇ "," ◇◆"],["❖ "," ❖"],["⟡ "," ⟡"],
  ["◇─◇──◇ "," ◇──◇─◇"],["•◦•◦💎 "," 💎◦•◦•"],["○○○💎 "," 💎○○○"],["♛💎 "," 💎♛"],["✧💍✧ "," ✧💍✧"],
  ["🥇 "," 🥇"],["🥈 "," 🥈"],["💰 "," 💰"],["👑💎 "," 💎👑"]
);

ART = ART.filter(a => a[0] !== "_old");
ART.unshift(
  ["Love Heart", "  ♥♥♥     ♥♥♥\n♥♥♥♥♥♥ ♥♥♥♥♥♥\n ♥♥♥♥♥♥♥♥♥♥♥\n   ♥♥♥♥♥♥♥\n     ♥♥♥\n      ♥\n  ♡ {t} ♡"],
  ["Star Burst", "  ☆ . ★ . ☆\n★  {t}  ★\n  ☆ ' ★ ' ☆"],
  ["Love Arrow", "♥━━━━ {t} ━━━━➳♥"],
  ["Sparkle Name", "✧･ﾟ: *✧･ﾟ:*\n   {t}\n*:･ﾟ✧*:･ﾟ✧"],
  ["Ribbon", "╭─────── ୨୧ ───────╮\n      {t}\n╰─────── ୨୧ ───────╯"],
  ["Crown Name", "    ♛\n ♛ {t} ♛\n▀▄▀▄▀▄▀▄▀"],
  ["Flower Name", "✿ ✿ ✿ ✿ ✿\n✿ {t} ✿\n✿ ✿ ✿ ✿ ✿"],
  ["Love Letter Box", "┏━━━━━ ♡ ━━━━━┓\n   {t}\n┗━━━━━ ♡ ━━━━━┛"]
);

// ---- Big letter art (5x5 pixel font) ----
const GLYPHS = {
A:".###.|#...#|#####|#...#|#...#",B:"####.|#...#|####.|#...#|####.",C:".####|#....|#....|#....|.####",D:"####.|#...#|#...#|#...#|####.",
E:"#####|#....|####.|#....|#####",F:"#####|#....|####.|#....|#....",G:".####|#....|#..##|#...#|.###.",H:"#...#|#...#|#####|#...#|#...#",
I:"#####|..#..|..#..|..#..|#####",J:"#####|...#.|...#.|#..#.|.##..",K:"#...#|#..#.|###..|#..#.|#...#",L:"#....|#....|#....|#....|#####",
M:"#...#|##.##|#.#.#|#...#|#...#",N:"#...#|##..#|#.#.#|#..##|#...#",O:".###.|#...#|#...#|#...#|.###.",P:"####.|#...#|####.|#....|#....",
Q:".###.|#...#|#.#.#|#..#.|.##.#",R:"####.|#...#|####.|#..#.|#...#",S:".####|#....|.###.|....#|####.",T:"#####|..#..|..#..|..#..|..#..",
U:"#...#|#...#|#...#|#...#|.###.",V:"#...#|#...#|#...#|.#.#.|..#..",W:"#...#|#...#|#.#.#|##.##|#...#",X:"#...#|.#.#.|..#..|.#.#.|#...#",
Y:"#...#|.#.#.|..#..|..#..|..#..",Z:"#####|...#.|..#..|.#...|#####",
0:".###.|#..##|#.#.#|##..#|.###.",1:"..#..|.##..|..#..|..#..|.###.",2:"####.|....#|.###.|#....|#####",3:"####.|....#|.###.|....#|####.",
4:"#..#.|#..#.|#####|...#.|...#.",5:"#####|#....|####.|....#|####.",6:".###.|#....|####.|#...#|.###.",7:"#####|....#|...#.|..#..|..#..",
8:".###.|#...#|.###.|#...#|.###.",9:".###.|#...#|.####|....#|.###.","!":"#|#|#|.|#","?":".###.|...#.|..#..|.....|..#..",
"♥":".#.#.|#####|#####|.###.|..#..","♡":".#.#.|#####|#####|.###.|..#..",".":".|.|.|.|#"," ":"..|..|..|..|.."
};
const BIG_ICONS = [["★","Stars"],["♥","Hearts"],["❤️","Red Love"],["💖","Pink Love"],["✿","Flowers"],["🌹","Roses"],["🌸","Blossoms"],["💎","Diamonds"],["🔥","Fire"],["✨","Sparkles"],["⭐","Gold Stars"],["🦋","Butterflies"],["👑","Crowns"],["🍀","Clovers"],["☆","Outline Stars"],["█","Blocks"],["#","Hashtags"],["*","Asterisks"]];

// ---- Animals, Gods, Baby, Boy/Girl, Family ----
Object.assign(SYMBOLS, {
  "Animals": "🐶🐱🐭🐹🐰🦊🐻🐼🐨🐯🦁🐮🐷🐸🐵🙈🙉🙊🐔🐧🐦🐤🦆🦅🦉🦇🐺🐗🐴🦄🐝🦋🐌🐞🐢🐍🦎🐙🦑🦀🐠🐟🐬🐳🦈🐊🐅🐆🦓🐘🦛🦏🐪🦒🦘🐃🐄🐎🐖🐑🐐🦌🐕🐈🐓🦃🦚🦜🦢🕊🐇🐿🦔🐾ʕ•ᴥ•ʔฅ^•ﻌ•^ฅ",
  "Gods & Spiritual": "🙏🕉☸☯☪✝☦✡🛐🔱🪔🕎📿🛕⛪🕌🕍⛩🪷☬卐ॐ☥🔯✨😇👼🧘🌺🐘🐒🐍🦚🌙☀️",
  "Baby": "👶🍼🧸🎀🚼👼🤱🧷🎈🍭🐣🐥🛁🛏🌙⭐🍪🧁🎠🪀",
  "Boy & Girl": "👦👧🧒👨👩🧑👱‍♂️👱‍♀️👨‍🎓👩‍🎓👨‍💻👩‍💻🙋‍♂️🙋‍♀️💁‍♂️💁‍♀️🙆‍♂️🙆‍♀️🤴👸🧔👵👴♂♀⚤💏💑👫👬👭",
  "Family": "👪👨‍👩‍👦👨‍👩‍👧👨‍👩‍👧‍👦👨‍👩‍👦‍👦👨‍👩‍👧‍👧👩‍👩‍👦👨‍👨‍👦👩‍👦👩‍👧👨‍👦👨‍👧🏠🏡❤️🤗👵👴🧓"
});
Object.assign(KAOMOJI, {
  "Animal Faces": ["ʕ•ᴥ•ʔ","ʕ ᵔᴥᵔ ʔ","ʕ •̀ ω •́ ʔ","ʕ っ•ᴥ•ʔっ","(=^･ω･^=)","ฅ^•ﻌ•^ฅ","(=ↀωↀ=)","/ᐠ｡ꞈ｡ᐟ\\","ᓚᘏᗢ","(ᵔᴥᵔ)","∪･ω･∪","U・ᴥ・U","(V●ᴥ●V)","(・⊝・)","(•ө•)♡","( ・θ・)","><(((('>","🐟<゜)))彡","(°)#))<<","(\\_/)\n(•ㅅ•)","૮ ・ﻌ・ა","(=･ｪ･=)","(ᐡ ᐧ ﻌ ᐧ ᐡ)","₍ᐢ•ﻌ•ᐢ₎","(•ᴥ•)🐾","🐸 ( ◉ _ ◉ )","🐼 ( ⊙ ᴥ ⊙ )","🦊 ( ̄ー ̄)","🐵 ( ° ᴗ ° )","🐷 ( ・ั(ｪ)・ั )"],
  "Praying & God": ["🙏(◡‿◡)🙏","(｡•̀ᴗ-)✧🙏","ヽ(°〇°)ﾉ🕉","(っ˘ω˘ς)🙏","🙏 (◕‿◕✿) 🙏","☸(◡‿◡✿)☸","🪔(｡◕‿◕｡)🪔","(*^‿^*)✝","😇(◠‿◠)","👼(｡•ᴗ•｡)","( ˘▽˘)っ🕉","🔱ヽ(•‿•)ノ🔱","🌺(◕ᴗ◕)🙏","ॐ (◡ ‿ ◡ ✿) ॐ","(∩˃o˂∩)♡🙏","✨🙏✨ ( ´ ▽ ` )"],
  "Baby": ["(｡•ᴗ•｡)👶","👶(◕‿◕)🍼","( ˘ ³˘)👶♡","(っ˘ω˘ς)🍼","🍼(・ω・)🍼","(*・ω・)ﾉ🧸","👶ʕ•ᴥ•ʔ🧸","(◕ᴗ◕✿)🎀","｡ﾟ(ﾟ´Д｀ﾟ)ﾟ｡👶","(˶ᵔ ᵕ ᵔ˶)🍼","(｡•́︿•̀｡)👶","🐣(•ө•)","(っ◔◡◔)っ🍼","(ᵕ—ᴗ—)zz 👶"],
  "Boy & Girl": ["♂(•‿•)","♀(◕‿◕✿)","👦(⌐■_■)","👧(◕‿◕✿)","(ง •̀_•́)ง👦","(✿◠‿◠)👧","🙋‍♂️(＾▽＾)","🙋‍♀️(≧◡≦)","👦❤️👧","(◕‿◕)♡(◕‿◕✿)","🤴(¬‿¬)","👸(◕ᴗ◕✿)","💑(｡♥‿♥｡)","(づ｡◕‿‿◕｡)づ💏","👫ヽ(•‿•)ノ"],
  "Family": ["👨‍👩‍👧(◕‿◕)","👪♡(◕‿◕)♡","(◕‿◕)(◕‿◕✿)(｡•ᴗ•｡)","♡(｡•ᴗ•｡)(◕‿◕)♡","🏠(＾▽＾)👪","(っ˘▽˘)(˘▽˘ς)👶","ヽ(•‿•)ノヽ(◕‿◕)ノ👶","👨‍👩‍👦 ♡ (◡‿◡✿)","🤗(◕ᴗ◕)(◕ᴗ◕✿)","👵👴(◠‿◠)","(⁄ ⁄•⁄ω⁄•⁄ ⁄)👪","🏡♡(˘︶˘)♡🏡"]
});
ART.push(
  ["Family", " (◕‿◕)  (◕‿◕✿)\n  /|\\     /|\\\n  / \\     / \\  (｡•ᴗ•｡)\n               /|\\\n   ♡ {t} ♡    / \\"],
  ["Baby Bear", "  ʕ•ᴥ•ʔ\n ( 🍼 )\n  U  U\n 👶 {t}"],
  ["Boy & Girl", "  👦 ♡ 👧\n (•‿•)(◕‿◕✿)\n  /|\\  /|\\\n  / \\  / \\\n {t}"],
  ["Praying", "   🙏\n (◡‿◡)\n  /||\\\n ✨ {t} ✨"],
  ["Om Peace", "  ॐ ☸ ✝ ☪ ✡\n ━━━━━━━━━━━\n   🙏 {t} 🙏"],
  ["Animal Parade", "🐘 🦒 🦁 🐒 🐼 🐧\n  ━━━ {t} ━━━"],
  ["Elephant", "    __     __\n   /  \\~~~/  \\\n  (    ..     )\n   \\  ( _ )  /\n    \\__\\_/__/  {t}"]
);

BIG_ICONS.push(
  ["🐶","Puppies"],["🐱","Kittens"],["🐼","Pandas"],["🐰","Bunnies"],["🦁","Lions"],["🐘","Elephants"],["🦄","Unicorns"],["🐾","Paw Prints"],
  ["🙏","Prayer"],["🕉","Om"],["🪔","Diya"],["🔱","Trishul"],["😇","Angels"],["🪷","Lotus"],
  ["👶","Babies"],["🍼","Baby Bottles"],["🧸","Teddy Bears"],
  ["👦","Boys"],["👧","Girls"],["💑","Couple"],["👪","Family"],["🏠","Home"],
  ["ツ","Smiles ツ"],["ღ","Love ღ"],["✞","Cross ✞"],["♛","Queen ♛"]
);

// small 3x5 font
const GLYPHS_SM = {
A:"###|#.#|###|#.#|#.#",B:"##.|#.#|##.|#.#|##.",C:"###|#..|#..|#..|###",D:"##.|#.#|#.#|#.#|##.",E:"###|#..|###|#..|###",F:"###|#..|###|#..|#..",
G:"###|#..|#.#|#.#|###",H:"#.#|#.#|###|#.#|#.#",I:"###|.#.|.#.|.#.|###",J:"..#|..#|..#|#.#|###",K:"#.#|#.#|##.|#.#|#.#",L:"#..|#..|#..|#..|###",
M:"#.#|###|###|#.#|#.#",N:"##.|#.#|#.#|#.#|#.#",O:"###|#.#|#.#|#.#|###",P:"###|#.#|###|#..|#..",Q:"###|#.#|#.#|###|..#",R:"###|#.#|##.|#.#|#.#",
S:"###|#..|###|..#|###",T:"###|.#.|.#.|.#.|.#.",U:"#.#|#.#|#.#|#.#|###",V:"#.#|#.#|#.#|#.#|.#.",W:"#.#|#.#|###|###|#.#",X:"#.#|#.#|.#.|#.#|#.#",
Y:"#.#|#.#|.#.|.#.|.#.",Z:"###|..#|.#.|#..|###",
0:"###|#.#|#.#|#.#|###",1:".#.|##.|.#.|.#.|###",2:"###|..#|###|#..|###",3:"###|..#|###|..#|###",4:"#.#|#.#|###|..#|..#",
5:"###|#..|###|..#|###",6:"###|#..|###|#.#|###",7:"###|..#|..#|..#|..#",8:"###|#.#|###|#.#|###",9:"###|#.#|###|..#|###",
"♥":"#.#|###|###|.#.|...","♡":"#.#|###|###|.#.|...","!":"#|#|#|.|#",".":".|.|.|.|#","?":"##.|..#|.#.|...|.#."," ":".|.|.|.|."
};
const RELATIVES = [["Baby","👶"],["Son","👦"],["Daughter","👧"],["Wife","💖"],["Husband","💙"],["Mom","🌸"],["Dad","👑"],["Sister","🎀"],["Brother","😎"],["Grandma","👵"],["Grandpa","👴"],["Family","👪"],["Love","❤️"],["Friend","🤝"],["Uncle","🎩"],["Aunty","🌺"]];
BIG_ICONS.push(["🤝","Friends"],["💙","Blue Love"],["🎀","Bows"],["😎","Cool"],["👵","Grandma"],["👴","Grandpa"],["🎩","Hats"],["🌺","Hibiscus"]);

// ---- Bio maker templates: {n}=name, font key applied to name; lines joined by \n ----
const BIOS = {
  "Instagram": [
    ["boldScript","Adventurer", "🌍 {n}\n✈️ 𝘈𝘥𝘷𝘦𝘯𝘵𝘶𝘳𝘦 𝘴𝘦𝘦𝘬𝘦𝘳 | 30 countries\n📸 Capturing moments\n#Adventure100M #Wanderlust"],
    ["double","Fitness", "💪 {n}\n🏋️ Fitness | Discipline | Growth\n🥗 Eat clean • Train dirty\n#FitFam #NoExcuses"],
    ["fraktur","Royal", "👑 {n} 👑\n♛ Born to rule ♛\n🖤 Attitude is everything\n#KingVibes #Royal"],
    ["smallCaps","Aesthetic", "˚ʚ♡ɞ˚ {n} ˚ʚ♡ɞ˚\n☁️ soft heart • wild soul\n🌸 living my best life\n#AestheticVibes"],
    ["script","Love", "💕 {n} 💕\n♡ Loved by someone special\n🌹 Forever & always\n#LoveLife #Couple"],
    ["sansBold","Entrepreneur", "🚀 {n}\n💼 CEO & Founder\n📈 Building the future\n#Hustle #Entrepreneur"],
    ["boldFraktur","Gamer", "🎮 {n}\n⚔️ Pro Gamer | Streamer\n🔥 Level 100 • Never AFK\n#GamerLife #GG"],
    ["mono","Coder", "💻 {n}\n</> Developer by day, gamer by night\n☕ Coffee → Code\n#100DaysOfCode"],
    ["circled","Cute", "🎀 {n} 🎀\n(◕‿◕✿) Just a happy soul\n🍓 Cute but psycho\n#Cutie #Kawaii"],
    ["boldScript","Artist", "🎨 {n}\n✍️ Artist | Dreamer | Creator\n🖌 DM for commissions\n#ArtistsOnInstagram"],
    ["wide","Music", "🎧 {n}\n🎵 Music is my therapy\n🎤 Singer • Songwriter\n#MusicLover"],
    ["sansItalic","Foodie", "🍕 {n}\n🍜 Eat • Sleep • Repeat\n📍 Food reviews & recipes\n#Foodie #Yummy"],
    ["double","Traveller", "✈️ {n} ✈️\n🗺 Exploring one city at a time\n🌅 Sunsets & salty hair\n#TravelGram #Explore"],
    ["asian","Attitude", "😎 {n}\n🔥 My life, my rules\n⚡ Not for everyone\n#Attitude #Savage"]
  ],
  "TikTok": [
    ["boldScript","Creator", "✨ {n} ✨\n🎬 Daily content creator\n🎯 Road to 100K\n#ForYou #FYP"],
    ["fraktur","Dark", "🖤 {n} 🖤\n☠ Dark vibes only\n🌙 Night owl\n#DarkAesthetic"],
    ["sansBold","Dancer", "💃 {n}\n🔥 Dance • Trends • Fun\n👇 Follow for daily dances\n#Dance #Trending"],
    ["smallCaps","Soft", "ᥫ᭡ {n} ᥫ᭡\n🌷 soft girl era\n✧ just vibing ✧\n#SoftGirl"],
    ["double","Comedy", "😂 {n}\n🎭 Making you laugh daily\n🍿 Skits & memes\n#Comedy #Funny"],
    ["boldFraktur","Gamer", "🎮 {n}\n👾 Gaming clips daily\n🏆 Top 1% player\n#Gaming #FYP"],
    ["script","Lifestyle", "🌸 {n}\n☕ Lifestyle • GRWM • Vlogs\n💌 Collab: DM\n#GRWM #Lifestyle"],
    ["circled","Pet", "🐾 {n} 🐾\n🐶 Life with my fur baby\n💕 Daily cute moments\n#PetsOfTikTok"],
    ["wide","Vibe", "🌈 {n}\n✨ Good vibes only\n🎶 Music • Mood\n#Vibes #FYP"],
    ["mono","Tech", "📱 {n}\n⚡ Tech tips in 60s\n🔔 New tips daily\n#TechTok"],
    ["sansBold","Motivation", "🔥 {n}\n💯 Daily motivation\n🧠 Mindset is everything\n#Motivation"],
    ["boldScript","Beauty", "💄 {n}\n💅 Makeup • Skincare • Hair\n✨ Glow up with me\n#Beauty #Makeup"]
  ],
  "Facebook": [
    ["boldScript","Family", "👨‍👩‍👧 {n}\n❤️ Family first, always\n🏡 Proud parent\n#FamilyLove"],
    ["double","Professional", "💼 {n}\n🎓 Graduate | Professional\n📍 Living & working in the city\n#Career"],
    ["fraktur","Spiritual", "🙏 {n} 🙏\n🕉 Faith • Peace • Gratitude\n🪔 Blessed every day\n#Blessed"],
    ["sansBold","Business", "🏪 {n}\n📦 Quality products, fair prices\n📞 Message us to order\n#SmallBusiness"],
    ["script","Couple", "💑 {n}\n💍 Married to my best friend\n💕 Forever us\n#CoupleGoals"],
    ["smallCaps","Simple", "☘️ {n}\n🌿 Simple living, high thinking\n☀️ Grateful for today\n#SimpleLife"],
    ["boldFraktur","Legend", "⚡ {n} ⚡\n🔥 Born to stand out\n👑 Legends never die\n#Legend"],
    ["circled","Mom", "🌸 {n} 🌸\n👶 Mom of two angels\n🧸 Love • Laugh • Repeat\n#MomLife"],
    ["sansItalic","Student", "📚 {n}\n🎓 Student | Dreamer\n🎯 Chasing goals\n#StudentLife"],
    ["wide","Sports", "⚽ {n}\n🏆 Football is life\n🔥 Never give up\n#Sports #Football"],
    ["mono","Gamer", "🎮 {n}\n🕹 Gaming page — clips & streams\n👍 Like & follow\n#Gaming"]
  ]
};

// flower combos: [pattern (cycled), name, optional background]
const BIG_MIXES = [
  ["🌸🌼🌺","Flower Garden"],["🌹🌷","Rose & Tulip"],["🌻🌼","Sunflower Mix"],["💐🌸🌷","Bouquet"],
  ["🌺🍃","Hibiscus & Leaf"],["🌷💗","Tulip Love"],["🌸💖✨","Blossom Sparkle"],["🌹❤️","Red Roses"],
  ["🌼🐝","Bee Garden"],["🌸🦋","Butterfly Garden"],["🪷🌸","Lotus Blossom"],["🌺🌴","Tropical"],
  ["✿❀","Blossom Mix"],["❀✿❁✾","Petal Mix"],["✿♥","Flower Hearts"],["❀★","Flower Stars"],
  ["🌹","Roses on Leaves","🍃"],["🌸","Sakura in Sky","☁️"],["🌻","Sunflowers on Grass","🌿"],["🌷","Tulips on Pink","💗"],["🌼","Daisies on Green","🟩"],["🌺","Hibiscus in Water","💧"]
];

// ---- Lots of flower combos, generated ----
const FL = [["🌸","Sakura"],["🌼","Daisy"],["🌺","Hibiscus"],["🌹","Rose"],["🌷","Tulip"],["🌻","Sunflower"],["💐","Bouquet"],["🪷","Lotus"],["🪻","Hyacinth"],["💮","White Flower"],["🥀","Wilted Rose"],["🏵️","Rosette"]];
const FL_ACC = [["💗","Love"],["✨","Sparkle"],["🦋","Butterfly"],["🐝","Bee"],["🍃","Leaf"],["💖","Heart"],["⭐","Star"],["🌿","Herb"],["🍓","Berry"],["🎀","Bow"],["☀️","Sun"],["🌙","Moon"]];
const FL_BG = [["🍃","Leaves"],["🌿","Grass"],["☁️","Sky"],["💗","Pink"],["💧","Water"],["🤍","White Hearts"],["🖤","Black Hearts"],["🟩","Green"],["🟪","Purple"],["🟨","Yellow"]];
const TXT_FL = ["✿","❀","❁","✾","❃","❋","✽","❊","✼","⚘","𖧷","ꕤ"];
const FLOWER_GROUPS = {
  "Flower Pairs": [], "Flower Trios": [], "Flowers + Hearts & Friends": [], "Flowers on Background": [], "Text Flowers": [], "Rainbow Gardens": []
};
for (let i = 0; i < FL.length; i++) for (let j = i + 1; j < FL.length; j++)
  FLOWER_GROUPS["Flower Pairs"].push([FL[i][0] + FL[j][0], FL[i][1] + " & " + FL[j][1]]);
for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++) for (let k = j + 1; k < 8; k++)
  if ((i + j + k) % 2 === 0) FLOWER_GROUPS["Flower Trios"].push([FL[i][0] + FL[j][0] + FL[k][0], FL[i][1] + ", " + FL[j][1] + " & " + FL[k][1]]);
FL.forEach(([f, fn]) => FL_ACC.forEach(([a, an]) => FLOWER_GROUPS["Flowers + Hearts & Friends"].push([f + a, fn + " + " + an])));
FL.slice(0, 8).forEach(([f, fn]) => FL_BG.forEach(([b, bn]) => FLOWER_GROUPS["Flowers on Background"].push([f, fn + " on " + bn, b])));
for (let i = 0; i < TXT_FL.length; i++) for (let j = i + 1; j < TXT_FL.length; j++)
  FLOWER_GROUPS["Text Flowers"].push([TXT_FL[i] + TXT_FL[j], TXT_FL[i] + " " + TXT_FL[j] + " Mix"]);
TXT_FL.forEach(t => ["♥","★","✦","♡","☆","❤"].forEach(s => FLOWER_GROUPS["Text Flowers"].push([t + s, t + " + " + s])));
FLOWER_GROUPS["Rainbow Gardens"] = [
  ["🌹🌻🌼🌿💧🪻🌸","Rainbow Garden"],["🌸🌷💐🌺","Pink Garden"],["🌻🌼☀️","Sunny Garden"],["🪻🪷💜","Purple Garden"],["🌹🥀❤️","Romance"],
  ["🌸☁️🦋","Dreamy"],["🌺🌴🌊","Tropical"],["💮🤍🕊","Pure White"],["🌷🌸🌼🌺🌻🌹","Spring Mix"],["🍁🌻🍂","Autumn"],
  ["🌸🍡🎎","Japan Spring"],["🪷🕉🪔","Puja Flowers"],["🌹💍💎","Wedding"],["🌼🐝🍯","Honey Garden"],["🌸🍓🍰","Sweet Garden"],
  ["🌺🦜🌴","Jungle"],["🌹🖤🥀","Dark Roses"],["💐🎀💌","Gift Bouquet"],["🌻🐞🌿","Ladybug Meadow"],["🌷🐰🥚","Easter"]
];
