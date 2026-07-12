/* Dil yönlendirmesi.
   Varsayılan: İngilizce — adres çubuğundan ya da dışarıdan her giriş EN açılır.
   TR yalnızca site içinden gezinirken korunur: EN sayfadaki "TR" bağlantısına
   tıklayan ziyaretçi TR sayfalarda gezmeye devam eder (referrer site içi olduğu
   sürece dokunulmaz); yeni bir giriş yine EN'dir. Tercih hiçbir yerde saklanmaz;
   eski localStorage/sessionStorage kayıtları temizlenir.
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

    /* eski sürümlerin tercih kayıtları — artık kullanılmıyor */
    try { localStorage.removeItem(KEY); } catch (e) {}
    try { sessionStorage.removeItem(KEY); } catch (e) {}

    var path = location.pathname;
    if (/\/en\//.test(path)) return;   /* EN sayfaları hiç yönlenmez */

    /* site içinden mi gelindi? (içeriden gezinme: TR'de kalınabilir) */
    var icden = false;
    try { icden = document.referrer.indexOf(location.origin + "/") === 0; } catch (e) {}
    if (icden) return;

    var file = path.substring(path.lastIndexOf("/") + 1) || "index.html";
    var t = T2E[file];
    if (t) { window.__muplabRedirect = 1; location.replace(t); }
  } catch (e) {}
})();
