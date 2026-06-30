/* MUPLAB — üst menü açılır alt menüleri + deep-link hedefleri.
   Tek dosya; hem TR (kökte) hem EN (en/ altında) sayfalarda çalışır.
   nav HTML'i her sayfada tekrarlandığı için alt menüler buradan enjekte edilir. */
(function () {
  "use strict";

  var isEN = location.pathname.indexOf("/en/") !== -1;

  // Sekme -> alt menü öğeleri ([etiket, href]). href, ilgili sayfaya görelidir.
  var MENUS = isEN ? {
    "research.html": [
      ["Learning and memory", "research.html#r-learning"],
      ["Attention and cognitive control", "research.html#r-attention"],
      ["Psychophysiology", "research.html#r-psychophys"],
      ["Clinical psychology", "research.html#r-clinical"]
    ],
    "team.html": [
      ["Maria G. Veldhuizen", "team.html#t-maria"],
      ["Emre Han Alpay", "team.html#t-emre"],
      ["Resul Çakır", "team.html#t-resul"]
    ],
    "projects.html": [
      ["Auricular taVNS and learning", "projects.html#p-tavns"],
      ["Çakır (2025) — Probabilistic learning", "projects.html#p-prob"],
      ["Measurement instruments repository", "projects.html#p-tools"]
    ]
  } : {
    "arastirma.html": [
      ["Öğrenme ve bellek", "arastirma.html#r-learning"],
      ["Dikkat ve bilişsel kontrol", "arastirma.html#r-attention"],
      ["Psikofizyoloji", "arastirma.html#r-psychophys"],
      ["Klinik psikoloji", "arastirma.html#r-clinical"]
    ],
    "ekip.html": [
      ["Maria G. Veldhuizen", "ekip.html#t-maria"],
      ["Emre Han Alpay", "ekip.html#t-emre"],
      ["Resul Çakır", "ekip.html#t-resul"]
    ],
    "projeler.html": [
      ["Auriküler taVNS ve öğrenme", "projeler.html#p-tavns"],
      ["Çakır (2025) — Olasılıksal öğrenme", "projeler.html#p-prob"],
      ["Ölçme araçları havuzu", "projeler.html#p-tools"]
    ]
  };

  // Hedef sayfalarda deep-link id'leri (kartlara sırayla atanır).
  var TARGETS = {
    "arastirma.html": { sel: ".block .card", ids: ["r-learning", "r-attention", "r-psychophys", "r-clinical"] },
    "research.html":  { sel: ".block .card", ids: ["r-learning", "r-attention", "r-psychophys", "r-clinical"] },
    "ekip.html":      { sel: ".person", ids: ["t-maria", "t-emre", "t-resul"] },
    "team.html":      { sel: ".person", ids: ["t-maria", "t-emre", "t-resul"] },
    "projeler.html":  { sel: ".proj", ids: ["p-tavns", "p-prob", "p-tools"] },
    "projects.html":  { sel: ".proj", ids: ["p-tavns", "p-prob", "p-tools"] }
  };

  function fileName(href) {
    return (href || "").split("#")[0].split("/").pop();
  }

  function buildDropdowns() {
    var nav = document.querySelector("nav.links");
    if (!nav) return;
    var links = Array.prototype.slice.call(nav.children).filter(function (n) {
      return n.tagName === "A";
    });
    links.forEach(function (a) {
      if (a.classList.contains("lang")) return;
      var items = MENUS[fileName(a.getAttribute("href"))];
      if (!items) return;

      var wrap = document.createElement("div");
      wrap.className = "navitem has-drop";
      a.parentNode.insertBefore(wrap, a);
      wrap.appendChild(a);

      var caret = document.createElement("span");
      caret.className = "caret";
      caret.setAttribute("aria-hidden", "true");
      caret.innerHTML = "&#9662;";
      a.appendChild(caret);
      a.setAttribute("aria-haspopup", "true");

      var dd = document.createElement("div");
      dd.className = "dropdown";
      dd.setAttribute("role", "menu");
      items.forEach(function (it) {
        var la = document.createElement("a");
        la.href = it[1];
        la.textContent = it[0];
        la.setAttribute("role", "menuitem");
        dd.appendChild(la);
      });
      wrap.appendChild(dd);
    });
  }

  function assignTargetIds() {
    var page = fileName(location.pathname) || "index.html";
    var t = TARGETS[page];
    if (!t) return;
    var els = document.querySelectorAll(t.sel);
    t.ids.forEach(function (id, i) {
      if (els[i] && !els[i].id) els[i].id = id;
    });
    // id'ler sonradan atandığı için, hash varsa hedefe kaydır.
    if (location.hash) {
      var el = document.getElementById(location.hash.slice(1));
      if (el) setTimeout(function () { el.scrollIntoView(); }, 0);
    }
  }

  function setupReveal() {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;
    var els = document.querySelectorAll(
      ".block .card, .block .person, .block .proj, .block .head, .block .about, " +
      ".newslist .item, .infogrid .infocard, .reslist .res, .publist .pub"
    );
    if (!els.length) return;
    document.documentElement.classList.add("js-reveal");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    Array.prototype.forEach.call(els, function (el) {
      el.classList.add("reveal");
      io.observe(el);
    });
  }

  function init() {
    buildDropdowns();
    assignTargetIds();
    setupReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
