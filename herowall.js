/* Ana sayfa hero — STATIK foto mozaigi (kayma yok).
   Az sayida iyi gorselimiz var -> KURATORLU havuz + BUYUK tile kullaniriz:
   boylece her foto okunakli kalir ve tekrar goze batmaz. Logolar/grafikler ve
   zayif/kopya kareler havuzdan cikarildi. Komsu (sol/ust) ayni foto gelmez,
   iki bos kare yan yana gelmez. Havuz: /assets/hero-wall/<n>.jpg */
(function () {
  var el = document.getElementById("hero-wall");
  if (!el) return;

  // Kuratorlu havuz: belirgin, sunulabilir, tekrarsiz konular.
  // Cikarilanlar: 31/32/33/35 (logo/grafik), 3/16/19/24/36 (zayif),
  // 4/6/8/10/11/12/26/27/28 (yakin-kopya).
  var pool = [1, 2, 5, 7, 9, 13, 14, 15, 17, 18, 20, 21, 22, 23, 25, 29, 30, 34];
  var base = pool.map(function (n) { return "/assets/hero-wall/" + n + ".jpg"; });

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i];
      a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  var tile = 150, gap = 4, BLANK = "__blank__", BLANK_P = 0.08;  // buyuk tile + cok az bos kare
  var W = (el.parentNode && el.parentNode.clientWidth) || document.documentElement.clientWidth || 1200;
  var H = (el.parentNode && el.parentNode.clientHeight) || 300;
  var cols = Math.max(2, Math.floor((W + gap) / (tile + gap)));
  var rows = Math.ceil((H + gap) / (tile + gap)) + 1;
  var total = cols * rows;

  var arr = new Array(total), bag = shuffle(base), bi = 0;
  function draw(forbid) {  // komsu fotolardan farkli bir foto cek (havuz bitince yeniden karistir)
    for (var k = 0; k < base.length + 2; k++) {
      if (bi >= bag.length) { bag = shuffle(base); bi = 0; }
      var s = bag[bi++];
      if (forbid.indexOf(s) === -1) return s;
    }
    return bag[bi - 1];
  }
  for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
    var idx = r * cols + c;
    var leftBlank = c > 0 && arr[idx - 1] === BLANK;
    var upBlank = r > 0 && arr[idx - cols] === BLANK;
    if (Math.random() < BLANK_P && !leftBlank && !upBlank) { arr[idx] = BLANK; continue; }
    var f = [];
    if (c > 0 && arr[idx - 1] !== BLANK) f.push(arr[idx - 1]);
    if (r > 0 && arr[idx - cols] !== BLANK) f.push(arr[idx - cols]);
    arr[idx] = draw(f);
  }

  el.style.gridTemplateColumns = "repeat(" + cols + ",1fr)";
  el.style.gridAutoRows = tile + "px";
  var frag = document.createDocumentFragment();
  arr.forEach(function (v) {
    if (v === BLANK) {
      var d = document.createElement("span");
      d.className = "hw-blank";
      frag.appendChild(d);
    } else {
      var im = document.createElement("img");
      im.src = v; im.alt = ""; im.loading = "lazy";
      frag.appendChild(im);
    }
  });
  el.appendChild(frag);
})();
