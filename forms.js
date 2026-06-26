/* MUPLAB form gönderimi → api.muplab.com
   form.api-form üzerinde data-endpoint (/api/iletisim, /api/basvuru),
   data-ok ve data-err özniteliklerini kullanır. */
(function () {
  var API = "https://api.muplab.com";

  function baglan(form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var endpoint = form.getAttribute("data-endpoint");
      var msg = form.querySelector(".form-msg");
      var btn = form.querySelector("button[type=submit]");

      var data = {};
      Array.prototype.forEach.call(form.elements, function (el) {
        if (el.name) data[el.name] = el.value;
      });

      if (btn) btn.disabled = true;
      if (msg) { msg.textContent = ""; msg.className = "form-msg"; }

      fetch(API + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (res) {
          if (res.ok && res.j && res.j.ok) {
            if (msg) {
              msg.textContent = form.getAttribute("data-ok") || "Gönderildi. Teşekkürler!";
              msg.className = "form-msg ok";
            }
            form.reset();
          } else {
            if (msg) {
              msg.textContent = (res.j && res.j.hata) ||
                form.getAttribute("data-err") || "Bir hata oluştu.";
              msg.className = "form-msg err";
            }
          }
        })
        .catch(function () {
          if (msg) {
            msg.textContent = form.getAttribute("data-err") ||
              "Bağlantı hatası. Lütfen tekrar deneyin.";
            msg.className = "form-msg err";
          }
        })
        .finally(function () { if (btn) btn.disabled = false; });
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll("form.api-form"), baglan);
})();
