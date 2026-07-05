/* Ana sayfa hero — YARIK SAYFA (split) canli izgara v7.1.
   Acik zemin, solda metin; sagda basamakli, SAG KENARA TASAN foto izgarasi.
   Kolon sayisi ekrana uyar (3-5); yuvalar SABIT oranli (duzen oynamaz, CLS=0).
   ~8 sn'de bir rastgele yuva, duvarda gorunmeyen rezerv fotoya yerinde
   crossfade olur (KAYMA YOK); duvar her an tekrarsiz (rezerv >= 3 korunur).
   prefers-reduced-motion: tamamen statik.
   Havuz: /assets/hero-wall/<n>.jpg */
(function () {
  var grid = document.getElementById("hero-wall");
  if (!grid) return;

  // Kuratorlu havuz (logolar/grafikler, zayif ve yakin-kopya kareler haric).
  var pool = [1, 2, 5, 7, 9, 13, 14, 15, 17, 18, 20, 21, 22, 23, 25, 29, 30, 34];
  var POOL = pool.map(function (n) { return "/assets/hero-wall/" + n + ".jpg"; });

  var SWAP_MS = 8000;   // vida: takas araligi (0 = kapali)
  var RESERVE_MIN = 3;  // vida: duvara girmeyip takas icin bekletilen foto sayisi
  var GAPY = 6, STEP = 48;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var mobile = window.matchMedia && window.matchMedia("(max-width: 759px)").matches;

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i];
      a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // kolonlar ekrana gore: ~230px kolon hedefi, 3-5 arasi
  var gridW = grid.clientWidth || 520;
  var nCols = mobile ? 3 : Math.max(3, Math.min(5, Math.round(gridW / 230)));
  var colEls = [];
  for (var c = 0; c < nCols; c++) {
    var col = document.createElement("div");
    col.className = "hg-col";
    if (!mobile) col.style.marginTop = ((nCols - 1 - c) * STEP) + "px";
    grid.appendChild(col);
    colEls.push(col);
  }

  // yuva oranlari (genislik/yukseklik) — sabit: yeni foto ayni kutuya cover ile oturur
  var PATTERNS = [
    [0.8, 1, 0.75, 0.85],
    [1, 0.75, 0.8, 1],
    [0.75, 0.85, 1, 0.8],
    [0.85, 0.8, 1, 0.75],
    [1, 0.8, 0.85, 0.75]
  ];
  var gridH = grid.clientHeight || 520;

  var bag = shuffle(POOL);
  var tiles = [];
  // round-robin dolgu: her turda EN KISA kolona yuva eklenir — genis duvarda
  // foto butcesi kolonlara esit dagilir, son kolon ac kalmaz
  var slots = [];
  for (var ci = 0; ci < nCols; ci++) {
    slots.push({
      el: colEls[ci],
      w: colEls[ci].clientWidth || ((gridW - (nCols - 1) * GAPY) / nCols) || 150,
      y: mobile ? 0 : (nCols - 1 - ci) * STEP,
      k: 0, full: false, pat: PATTERNS[ci % PATTERNS.length]
    });
  }
  function canTake(c) {
    if (c.full) return false;
    // masaustu: kiymik yok — yuva ancak >= %45'i gorunuyorsa eklenir (kesik ama bilincli);
    // mobil bant (CSS 1/1) tasarak dolar
    if (mobile) { if (c.y >= gridH + 40) c.full = true; }
    else if (c.y >= gridH || (gridH - c.y) < (c.w / c.pat[c.k % 4]) * 0.45) c.full = true;
    return !c.full;
  }
  while (bag.length > RESERVE_MIN) {
    var pick = null;
    for (var pi = 0; pi < slots.length; pi++) {
      if (!canTake(slots[pi])) continue;
      if (!pick || slots[pi].y < pick.y) pick = slots[pi];
    }
    if (!pick) break;
    var ratio = pick.pat[pick.k % 4];
    var d = document.createElement("div");
    d.className = "hg-t";
    d.style.aspectRatio = String(ratio);
    var src = bag.shift();
    var a = document.createElement("img");
    a.src = src; a.alt = ""; a.decoding = "async";
    var b = document.createElement("img");
    b.alt = ""; b.decoding = "async"; b.className = "back";
    d.appendChild(a); d.appendChild(b);
    pick.el.appendChild(d);
    tiles.push({ el: d, imgs: [a, b], front: 0, src: src });
    pick.y += pick.w / ratio + GAPY;
    pick.k++;
  }
  var reserve = bag; // duvarda OLMAYAN fotolar — takas kaynagi, tekrar imkansiz

  if (reduce || !SWAP_MS || !reserve.length || !tiles.length) return;
  var busy = false;
  setInterval(function () {
    if (busy || document.hidden) return;
    var t = tiles[Math.floor(Math.random() * tiles.length)];
    var next = reserve.shift();
    reserve.push(t.src);
    t.src = next;
    var back = t.imgs[1 - t.front];
    busy = true;
    var done = false;
    var go = function () {
      if (done) return; done = true;
      back.style.opacity = "1";
      t.imgs[t.front].style.opacity = "0";
      t.front = 1 - t.front;
      setTimeout(function () { busy = false; }, 1000);
    };
    back.onload = go;
    back.src = next;
    if (back.complete && back.naturalWidth) go();
    setTimeout(function () { if (!done) { done = true; busy = false; } }, 3000);
  }, SWAP_MS);
})();
