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
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">' +
      '<path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/>' +
      '</svg></a>';
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
