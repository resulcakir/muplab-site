/* Ana sayfa hero — YASAYAN BENTO duvar (2026-07-05).
   Ince mozaik (taban 144px) + 1 buyuk 3x3 "kahraman" kare + 2-3 orta kare.
   Tekrar kurali: ayni foto birbirine 2 kareden yakin gelmez, hep en az
   kullanilan foto secilir. Canli takas: buyuk kare ~10 sn'de bir o an duvarda
   gorunmeyen bir fotoya yerinde crossfade olur (KAYMA YOK), orta kareler ~26 sn.
   prefers-reduced-motion: duvar tamamen statik.
   Geri donus: git'te onceki surum (statik esit-karo mozaik) duruyor.
   Havuz: /assets/hero-wall/<n>.jpg */
(function () {
  var el = document.getElementById("hero-wall");
  if (!el) return;

  // Kuratorlu havuz (logolar/grafikler, zayif ve yakin-kopya kareler haric).
  var pool = [1, 2, 5, 7, 9, 13, 14, 15, 17, 18, 20, 21, 22, 23, 25, 29, 30, 34];
  var POOL = pool.map(function (n) { return "/assets/hero-wall/" + n + ".jpg"; });

  var GAP = 5, BASE = 144;               // vida: taban karo boyutu (S:120 / M:144 / L:168)
  var HERO_MS = 10000, MED_MS = 26000;   // vida: takas araliklari (0 = kapali)
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i];
      a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  var host = el.parentNode;
  var w = (host && host.clientWidth) || document.documentElement.clientWidth || 1200;
  var h = (host && host.clientHeight) || 640;
  var cols = Math.max(3, Math.round((w + GAP) / (BASE + GAP)));
  var cell = (w - (cols - 1) * GAP) / cols;
  var rows = Math.max(3, Math.ceil((h + GAP) / (cell + GAP)));
  el.style.gridTemplateColumns = "repeat(" + cols + ",1fr)";
  el.style.gridAutoRows = cell.toFixed(2) + "px";

  var occ = [], srcMap = [];
  for (var r = 0; r < rows; r++) {
    var l1 = [], l2 = [];
    for (var c = 0; c < cols; c++) { l1.push(false); l2.push(null); }
    occ.push(l1); srcMap.push(l2);
  }
  function fits(r, c, sw, sh) {
    if (r + sh > rows || c + sw > cols) return false;
    for (var i = r; i < r + sh; i++) for (var j = c; j < c + sw; j++) if (occ[i][j]) return false;
    return true;
  }
  function take(r, c, sw, sh) { for (var i = r; i < r + sh; i++) for (var j = c; j < c + sw; j++) occ[i][j] = true; }
  function stamp(r, c, sw, sh, s) { for (var i = r; i < r + sh; i++) for (var j = c; j < c + sw; j++) srcMap[i][j] = s; }
  // ayak izinin 2 hucre cevresinde ayni foto var mi (tekrarlar ancak uzakta olabilir)
  function nearHas(r, c, sw, sh, cand) {
    for (var i = Math.max(0, r - 2); i < Math.min(rows, r + sh + 2); i++)
      for (var j = Math.max(0, c - 2); j < Math.min(cols, c + sw + 2); j++)
        if (srcMap[i][j] === cand) return true;
    return false;
  }

  // 1) buyuk kareler: 1 kahraman 3x3 (metnin saginda) + 2-3 orta 2x2 + 1-2 yatay/dikey 2x1
  var bigs = [];
  var hs = Math.min(3, cols, rows);
  var hc = Math.max(0, Math.min(cols - hs, Math.round(cols * 0.58)));
  var hr = rows > hs ? 1 : 0;
  if (!fits(hr, hc, hs, hs)) { hr = 0; hc = cols - hs; }
  take(hr, hc, hs, hs);
  bigs.push({ r: hr, c: hc, sw: hs, sh: hs, kind: "hero" });
  var medWant = Math.min(3, Math.max(1, Math.round(cols * rows / 18)));
  var tries = 0;
  while (medWant > 0 && tries++ < 60) {
    var mr = Math.floor(Math.random() * rows), mc = Math.floor(Math.random() * cols);
    if (fits(mr, mc, 2, 2)) { take(mr, mc, 2, 2); bigs.push({ r: mr, c: mc, sw: 2, sh: 2, kind: "med" }); medWant--; }
  }
  var wideWant = 2; tries = 0;
  while (wideWant > 0 && tries++ < 40) {
    var wr = Math.floor(Math.random() * rows), wc = Math.floor(Math.random() * cols);
    var ww = Math.random() < 0.5 ? 2 : 1, wh = ww === 2 ? 1 : 2;
    if (fits(wr, wc, ww, wh)) { take(wr, wc, ww, wh); bigs.push({ r: wr, c: wc, sw: ww, sh: wh, kind: "med" }); wideWant--; }
  }

  // 2) foto dagitimi: en az kullanilan + cevrede olmayan foto
  var cnt = {};
  function pick(r, c, sw, sh, excl) {
    var opts = shuffle(POOL).sort(function (a, b) { return (cnt[a] || 0) - (cnt[b] || 0); });
    for (var q = 0; q < opts.length; q++) {
      if (excl && opts[q] === excl) continue;
      if (!nearHas(r, c, sw, sh, opts[q])) return opts[q];
    }
    return opts[0];
  }
  var tiles = [];
  function makeTile(pl, src) {
    var d = document.createElement("div");
    d.className = "hwt";
    d.style.gridRowStart = pl.r + 1;
    d.style.gridColumnStart = pl.c + 1;
    if (pl.sw > 1) d.style.gridColumnEnd = "span " + pl.sw;
    if (pl.sh > 1) d.style.gridRowEnd = "span " + pl.sh;
    if (src) {
      var a = document.createElement("img");
      a.src = src; a.alt = ""; a.decoding = "async";
      var b = document.createElement("img");
      b.alt = ""; b.decoding = "async"; b.className = "back";
      d.appendChild(a); d.appendChild(b);
      cnt[src] = (cnt[src] || 0) + 1;
      stamp(pl.r, pl.c, pl.sw, pl.sh, src);
      tiles.push({ el: d, imgs: [a, b], front: 0, src: src, r: pl.r, c: pl.c, sw: pl.sw, sh: pl.sh, kind: pl.kind });
    }
    return d;
  }
  var frag = document.createDocumentFragment();
  for (var bIdx = 0; bIdx < bigs.length; bIdx++) {
    var bp = bigs[bIdx];
    frag.appendChild(makeTile(bp, pick(bp.r, bp.c, bp.sw, bp.sh)));
  }
  // tekiller: karisik sirayla, ~%5 komsusuz bos kare
  var order = [];
  for (var r2 = 0; r2 < rows; r2++) for (var c2 = 0; c2 < cols; c2++) if (!occ[r2][c2]) order.push([r2, c2]);
  order = shuffle(order);
  var blankAt = {};
  for (var k = 0; k < order.length; k++) {
    var pr = order[k][0], pc = order[k][1];
    var nbBlank = blankAt[(pr - 1) + "_" + pc] || blankAt[(pr + 1) + "_" + pc] || blankAt[pr + "_" + (pc - 1)] || blankAt[pr + "_" + (pc + 1)];
    var pl2 = { r: pr, c: pc, sw: 1, sh: 1, kind: "one" };
    if (!nbBlank && Math.random() < 0.05) {
      blankAt[pr + "_" + pc] = 1;
      frag.appendChild(makeTile(pl2, null));
    } else {
      frag.appendChild(makeTile(pl2, pick(pr, pc, 1, 1)));
    }
  }
  el.appendChild(frag);

  // 3) canli takas: gorunmeyen (veya en az gorunen) fotoya yerinde crossfade
  function swap(t) {
    var next = pick(t.r, t.c, t.sw, t.sh, t.src);
    if (!next || next === t.src) return;
    cnt[t.src]--; cnt[next] = (cnt[next] || 0) + 1;
    stamp(t.r, t.c, t.sw, t.sh, next);
    t.src = next;
    var back = t.imgs[1 - t.front];
    var done = false;
    var go = function () {
      if (done) return; done = true;
      back.style.opacity = "1";
      t.imgs[t.front].style.opacity = "0";
      t.front = 1 - t.front;
    };
    back.onload = go;
    back.src = next;
    if (back.complete && back.naturalWidth) go();
  }
  if (!reduce) {
    var hero = null, meds = [];
    for (var ti = 0; ti < tiles.length; ti++) {
      if (tiles[ti].kind === "hero") hero = tiles[ti];
      else if (tiles[ti].kind === "med") meds.push(tiles[ti]);
    }
    if (hero && HERO_MS) setInterval(function () { if (!document.hidden) swap(hero); }, HERO_MS);
    if (meds.length && MED_MS) setInterval(function () { if (!document.hidden) swap(meds[Math.floor(Math.random() * meds.length)]); }, MED_MS);
  }
})();
