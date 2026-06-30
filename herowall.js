/* Ana sayfa hero — kayan foto duvarı.
   #hero-wall içine sabit küçük tile'lı satırlar kurar; her satır sola sürekli akar.
   Havuz: /assets/hero-wall/1..56.jpg (26 lab fotosu + 30 geçici soyut görsel). */
(function () {
  var el = document.getElementById("hero-wall");
  if (!el) return;
  var N = 50, base = [];   // gerçek lab fotoları
  for (var i = 1; i <= N; i++) base.push("/assets/hero-wall/" + i + ".jpg");
  function rot(a, k) { k = ((k % N) + N) % N; return a.slice(k).concat(a.slice(0, k)); }

  var tileH = 66, gap = 4;
  var rowCount = 5;   // hero = 5 görsellik yükseklik

  for (var ri = 0; ri < rowCount; ri++) {
    var dur = 70 + (ri % 6) * 8;      // satıra göre değişen hız (70..110s, daha sakin)
    var off = (ri * 9) % N;
    var rev = (ri % 2 === 1);
    var row = document.createElement("div");
    row.className = "hw-row";
    row.style.height = tileH + "px";
    row.style.animationDuration = dur + "s";
    var half = rot(base, off).slice(0, 28);
    if (rev) half = half.slice().reverse();
    half.concat(half).forEach(function (src) {
      var im = document.createElement("img");
      im.src = src; im.alt = ""; im.loading = "lazy";
      row.appendChild(im);
    });
    el.appendChild(row);
  }
})();
