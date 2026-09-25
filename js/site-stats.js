/**
 * Contatori home — data/site-stats.json (anni palestra, diario, sessioni, età cronologica)
 */
(function () {
  var nodes = document.querySelectorAll("[data-site-stat]");
  if (!nodes.length) return;

  fetch("/data/site-stats.json")
    .then(function (r) {
      if (!r.ok) throw new Error("fetch");
      return r.json();
    })
    .then(function (data) {
      nodes.forEach(function (el) {
        apply(el, data);
      });
    })
    .catch(function () {
      /* valori statici in HTML restano */
    });

  function apply(el, data) {
    var key = el.getAttribute("data-site-stat");
    if (!key) return;

    if (key === "chrono-age") {
      el.textContent = String(data.chronological_age);
      return;
    }
    if (key === "training-years") {
      el.textContent = String(data.training_years);
      return;
    }
    if (key === "sessions") {
      var v = el.querySelector(".proof-stat__value");
      if (v) v.textContent = String(data.sessions_documented);
      return;
    }
    if (key === "diario-articles") {
      var val = el.querySelector(".proof-stat__value");
      if (val) val.textContent = String(data.diario_articles);
      return;
    }
    if (key === "diario-hero-count") {
      el.textContent = String(data.diario_articles);
      return;
    }
    if (key === "chrono-stat") {
      var cv = el.querySelector(".proof-stat__value");
      if (cv) cv.textContent = String(data.chronological_age);
      return;
    }
    if (key === "hero-trust") {
      el.textContent =
        "Gino Capon · " +
        data.chronological_age +
        " anni · " +
        data.training_years +
        " anni di palestra";
    }
    if (key === "chi-sono-trust") {
      el.textContent =
        data.training_years + "+ anni palestra · equilibrio lavoro-famiglia-sport";
    }
    if (key === "latest-content") {
      if (!data.latest_content_url || !data.latest_content_date) return;
      var d = data.latest_content_date;
      var label =
        d.slice(8, 10) + "/" + d.slice(5, 7) + "/" + d.slice(0, 4);
      var kind = data.latest_content_type === "sessione" ? "Sessione" : "Diario";
      el.innerHTML =
        "Ultimo aggiornamento: <a href=\"" +
        data.latest_content_url +
        "\">" +
        kind +
        " · " +
        label +
        "</a>";
      el.hidden = false;
    }
  }
})();
