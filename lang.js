/* Dil tercihi + yönlendirme.
   Varsayılan: İngilizce. Tercih yoksa kök (TR) sayfalar en/ karşılığına yönlenir.
   "TR"/"EN" bağlantısına tıklayınca tercih localStorage'a kaydedilir.
   <head>'de senkron yüklenir → sayfa boyanmadan önce çalışır (flash yok). */
(function () {
  try {
    var KEY = "muplab_lang";
    var T2E = {
      "index.html": "en/index.html", "arastirma.html": "en/research.html",
      "haberler.html": "en/news.html", "ekip.html": "en/team.html",
      "projeler.html": "en/projects.html", "iletisim.html": "en/contact.html",
      "yayinlar.html": "en/publications.html", "kaynaklar.html": "en/resources.html",
      "katilin.html": "en/join.html", "living-ma.html": "en/living-ma.html"
    };
    var E2T = {
      "index.html": "../index.html", "research.html": "../arastirma.html",
      "news.html": "../haberler.html", "team.html": "../ekip.html",
      "projects.html": "../projeler.html", "contact.html": "../iletisim.html",
      "publications.html": "../yayinlar.html", "resources.html": "../kaynaklar.html",
      "join.html": "../katilin.html", "living-ma.html": "../living-ma.html"
    };
    var path = location.pathname;
    var cur = /\/en\//.test(path) ? "en" : "tr";
    var file = path.substring(path.lastIndexOf("/") + 1) || "index.html";

    var pref = null;
    try { pref = localStorage.getItem(KEY); } catch (e) {}
    var want = pref || "en";  // varsayılan İngilizce

    if (want !== cur) {
      var t = cur === "tr" ? T2E[file] : E2T[file];
      if (t) { window.__muplabRedirect = 1; location.replace(t); return; }
    }

    // Dil bağlantısı tıklanınca tercihi kaydet
    document.addEventListener("DOMContentLoaded", function () {
      var L = document.querySelector("a.lang");
      if (!L) return;
      L.addEventListener("click", function () {
        var href = L.getAttribute("href") || "";
        var to = (href.indexOf("en/") === 0 || /\/en\//.test(href)) ? "en" : "tr";
        try { localStorage.setItem(KEY, to); } catch (e) {}
      });
    });
  } catch (e) {}
})();
