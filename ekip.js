/* Ekip kartlarını api.muplab.com'dan çizer (scholar ikonlu).
   #ekip-grid içindeki gömülü kartlar fallback'tir; API erişilebilirse üzerine yazılır.
   data-bio özniteliği varsa (ekip/team sayfası) bio da gösterilir. */
(function () {
  var API = "https://api.muplab.com";
  var grid = document.getElementById("ekip-grid");
  if (!grid) return;
  var en = document.documentElement.lang === "en";
  var withBio = grid.hasAttribute("data-bio");

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function gs(url) {
    if (!url) return "";
    return '<a class="gs" href="' + esc(url) + '" target="_blank" rel="noopener" ' +
      'aria-label="Google Scholar" title="Google Scholar">' +
      '<img src="/assets/scholar.png" alt="Google Scholar" width="22" height="22"></a>';
  }

  fetch(API + "/api/ekip", { cache: "no-store" })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (list) {
      if (!Array.isArray(list) || !list.length) return;
      grid.innerHTML = list.map(function (u) {
        var ad = en ? u.ad_en : u.ad_tr,
            rol = en ? u.rol_en : u.rol_tr,
            alan = en ? u.alan_en : u.alan_tr,
            bio = en ? u.bio_en : u.bio_tr;
        var s = '<div class="person">';
        if (u.foto) s += '<img class="photo" src="' + esc(u.foto) + '" alt="' + esc(ad) + '">';
        s += "<h3>" + esc(ad) + "</h3>";
        if (rol) s += '<div class="role">' + esc(rol) + "</div>";
        if (alan) s += '<div class="area">' + esc(alan) + "</div>";
        if (withBio && bio) s += '<p class="bio">' + esc(bio) + "</p>";
        s += gs(u.scholar);
        s += "</div>";
        return s;
      }).join("");
    })
    .catch(function () {});
})();
