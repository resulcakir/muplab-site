/* Ana sayfa hero — STATİK foto mozaiği (kayma yok).
   #hero-wall'u küçük tile'lı bir ızgarayla doldurur; her tile komşusundan (sol/üst) farklı seçilir,
   böylece rastgele saçılır ve yan yana aynı foto gelmez. Havuz: /assets/hero-wall/1..50.jpg */
(function () {
  var el = document.getElementById("hero-wall");
  if (!el) return;
  var N = 50, base = [];
  for (var i = 1; i <= N; i++) base.push("/assets/hero-wall/" + i + ".jpg");
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i];
      a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  var tile = 66, gap = 4;
  var W = (el.parentNode && el.parentNode.clientWidth) || document.documentElement.clientWidth || 1200;
  var H = (el.parentNode && el.parentNode.clientHeight) || 300;
  var cols = Math.max(3, Math.floor((W + gap) / (tile + gap)));
  var rows = Math.ceil((H + gap) / (tile + gap)) + 1;
  var total = cols * rows;

  // sol & üst komşu aynı olmayacak şekilde diz (karıştırılmış desteden çek)
  var arr = new Array(total), bag = shuffle(base), bi = 0;
  function draw(forbid) {
    for (var k = 0; k < base.length + 2; k++) {
      if (bi >= bag.length) { bag = shuffle(base); bi = 0; }
      var s = bag[bi++];
      if (forbid.indexOf(s) === -1) return s;
    }
    return bag[bi - 1];
  }
  for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
    var idx = r * cols + c, f = [];
    if (c > 0) f.push(arr[idx - 1]);        // sol komşu
    if (r > 0) f.push(arr[idx - cols]);     // üst komşu
    arr[idx] = draw(f);
  }

  el.style.gridTemplateColumns = "repeat(" + cols + ",1fr)";
  el.style.gridAutoRows = tile + "px";
  var frag = document.createDocumentFragment();
  arr.forEach(function (src) {
    var im = document.createElement("img");
    im.src = src; im.alt = ""; im.loading = "lazy";
    frag.appendChild(im);
  });
  el.appendChild(frag);
})();
