/* Ana sayfa hero — YARIK SAYFA (split) canli izgara (hero-yarik dali).
   Acik zemin, solda metin; sagda 3 kolonlu, ust kenari basamakli foto izgarasi.
   Yuvalar SABIT oranli (duzen hic oynamaz, CLS=0); ~8 sn'de bir rastgele yuva,
   duvarda gorunmeyen rezerv fotolardan birine yerinde crossfade olur (KAYMA YOK).
   Duvardaki fotolar hep TEKRARSIZ: takaslar yalnizca rezervden beslenir.
   prefers-reduced-motion: tamamen statik.
   Havuz: /assets/hero-wall/<n>.jpg */
(function () {
  var grid = document.getElementById("hero-wall");
  if (!grid) return;
  var colEls = grid.querySelectorAll(".hg-col");
  if (!colEls.length) return;

  // Kuratorlu havuz (logolar/grafikler, zayif ve yakin-kopya kareler haric).
  var pool = [1, 2, 5, 7, 9, 13, 14, 15, 17, 18, 20, 21, 22, 23, 25, 29, 30, 34];
  var POOL = pool.map(function (n) { return "/assets/hero-wall/" + n + ".jpg"; });

  var SWAP_MS = 8000;   // vida: takas araligi (0 = kapali)
  var GAPY = 6;
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

  // yuva oranlari (genislik/yukseklik) — sabit: yeni foto ayni kutuya cover ile oturur
  var RATIOS = [
    [0.8, 1, 0.75, 0.85],
    [1, 0.75, 0.8, 1],
    [0.75, 0.85, 1, 0.8]
  ];
  var OFFSETS = mobile ? [0, 0, 0] : [96, 48, 0];
  var gridH = grid.clientHeight || 480;

  var bag = shuffle(POOL);
  var tiles = [];
  for (var ci = 0; ci < 3; ci++) {
    var colEl = colEls[ci];
    var colW = colEl.clientWidth || ((grid.clientWidth - 12) / 3) || 150;
    var y = OFFSETS[ci], k = 0;
    while (y < gridH + 40 && bag.length) {
      var ratio = RATIOS[ci][k % RATIOS[ci].length];
      var d = document.createElement("div");
      d.className = "hg-t";
      d.style.aspectRatio = String(ratio);
      var src = bag.shift();
      var a = document.createElement("img");
      a.src = src; a.alt = ""; a.decoding = "async";
      var b = document.createElement("img");
      b.alt = ""; b.decoding = "async"; b.className = "back";
      d.appendChild(a); d.appendChild(b);
      colEl.appendChild(d);
      tiles.push({ el: d, imgs: [a, b], front: 0, src: src });
      y += colW / ratio + GAPY;
      k++;
    }
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
