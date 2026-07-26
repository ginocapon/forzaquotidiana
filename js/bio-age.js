/**
 * Età biologica sulla home — dati da /data/biological-age.json
 */
(function () {
  var roots = document.querySelectorAll("[data-bio-age]");
  if (!roots.length) return;

  fetch("/data/biological-age.json")
    .then(function (r) {
      if (!r.ok) throw new Error("fetch");
      return r.json();
    })
    .then(function (data) {
      roots.forEach(function (root) {
        render(root, data);
      });
    })
    .catch(function () {
      roots.forEach(function (root) {
        root.classList.add("bio-age--unavailable");
      });
    });

  function render(root, data) {
    var mode = root.getAttribute("data-bio-age");
    var age = data.biological_age;
    var chrono = data.chronological_age;
    var delta = data.delta_vs_chrono;

    if (mode === "hero") {
      var trend = data.trend || "";
      root.innerHTML =
        '<span class="bio-age__label">Età biologica</span> ' +
        '<strong class="bio-age__value">' + formatAge(age) + " anni</strong>" +
        (delta > 0
          ? ' <span class="bio-age__delta">(−' + formatAge(delta) + " vs " + chrono + ")</span>"
          : "") +
        (trend
          ? ' <span class="bio-age__trend">· ' + esc(trend) + " man mano che ci alleniamo</span>"
          : "");
      root.hidden = false;
      return;
    }

    if (mode === "stat") {
      var valueEl = root.querySelector(".proof-stat__value");
      var labelEl = root.querySelector(".proof-stat__label");
      if (valueEl) valueEl.textContent = formatAge(age);
      if (labelEl) {
        labelEl.textContent =
          "Età biologica da dati Amazfit" +
          (delta > 0 ? " · −" + formatAge(delta) + " anni" : "");
      }
      root.classList.add("proof-stat--bio-age");
      return;
    }
  }

  function formatAge(n) {
    return String(n).replace(".", ",");
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
})();
