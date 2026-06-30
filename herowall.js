/* Ana sayfa hero — kayan foto duvarı.
   #hero-wall içine sabit küçük tile'lı satırlar kurar; her satır sola sürekli akar.
   Her satır rastgele karıştırılır -> kopyalanan logolar/fotolar art arda gelmez. */
(function () {
  var el = document.getElementById("hero-wall");
  if (!el) return;
  var N = 50, base = [];   // gerçek lab fotoları (/assets/hero-wall/1..50.jpg)
  for (var i = 1; i <= N; i++) base.push("/assets/hero-wall/" + i + ".jpg");

  function shuffle(a) {     // Fisher-Yates (kopya üzerinde)
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i];
      a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  var tileH = 66, gap = 4;
  // satır sayısını hero yüksekliğine göre hesapla (+1) -> altta boşluk kalmaz
  var heroH = (el.parentNode && el.parentNode.clientHeight) || 320;
  var rowCount = Math.min(20, Math.ceil(heroH / (tileH + gap)) + 1);

  for (var ri = 0; ri < rowCount; ri++) {
    var dur = 70 + (ri % 6) * 8;          // satıra göre değişen hız (70..110s)
    var row = document.createElement("div");
    row.className = "hw-row";
    row.style.height = tileH + "px";
    row.style.animationDuration = dur + "s";
    var half = shuffle(base).slice(0, 28); // her satır rastgele dizilir
    half.concat(half).forEach(function (src) {   // sorunsuz döngü için 2 kopya
      var im = document.createElement("img");
      im.src = src; im.alt = ""; im.loading = "lazy";
      row.appendChild(im);
    });
    el.appendChild(row);
  }
})();
