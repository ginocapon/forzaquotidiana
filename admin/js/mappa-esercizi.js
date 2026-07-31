/**
 * Mappa esercizi Blocco 1 — griglia figure SVG + scheda tecnica
 */
(function () {
  "use strict";

  var BLOCCO_URL = "/admin/data/blocco-1-fase1.json";
  var CATALOGO_URL = "/admin/data/esercizi-catalogo.json";

  function injectSprite() {
    if (document.getElementById("admin-ex-sprite")) return Promise.resolve();
    return fetch("/admin/img/esercizi-sprite.svg")
      .then(function (r) { return r.text(); })
      .then(function (svg) {
        var wrap = document.createElement("div");
        wrap.id = "admin-ex-sprite";
        wrap.innerHTML = svg;
        wrap.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
        document.body.insertBefore(wrap, document.body.firstChild);
      });
  }

  function uniqueExercises(blocco) {
    var seen = {};
    var list = [];
    ["a1", "b1", "a2", "b2"].forEach(function (key) {
      (blocco.sessioni[key].esercizi || []).forEach(function (ex) {
        if (!seen[ex.nome]) {
          seen[ex.nome] = true;
          list.push({ nome: ex.nome, figura: ex.figura, sessione: key.toUpperCase() });
        }
      });
    });
    return list.sort(function (a, b) { return a.nome.localeCompare(b.nome, "it"); });
  }

  function render(blocco, catalogo, root) {
    root.innerHTML = "";
    var grid = document.createElement("div");
    grid.className = "admin-mappa-grid";

    uniqueExercises(blocco).forEach(function (item) {
      var cat = catalogo[item.nome] || {};
      var card = document.createElement("article");
      card.className = "admin-mappa-card card";

      var badge = document.createElement("span");
      badge.className = "admin-mappa-card__session";
      badge.textContent = item.sessione;
      card.appendChild(badge);

      var fig = document.createElement("div");
      fig.className = "admin-mappa-card__fig";
      var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 80 80");
      var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
      use.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#" + (item.figura || cat.figura || "fig-press-incl"));
      svg.appendChild(use);
      fig.appendChild(svg);
      card.appendChild(fig);

      var h = document.createElement("h2");
      h.textContent = item.nome;
      card.appendChild(h);

      if (cat.primario) {
        var p = document.createElement("p");
        p.className = "admin-mappa-card__meta";
        p.innerHTML = "<strong>Primario:</strong> " + cat.primario + (cat.secondario ? " · <strong>Secondario:</strong> " + cat.secondario : "");
        card.appendChild(p);
      }
      if (cat.movimento) {
        var m = document.createElement("p");
        m.className = "admin-mappa-card__mov";
        m.textContent = cat.movimento;
        card.appendChild(m);
      }

      grid.appendChild(card);
    });

    root.appendChild(grid);
    var back = document.createElement("p");
    back.className = "admin-back";
    back.innerHTML = "<a href=\"/admin/sessione/?ciclo=ipertrofia-accumulo&sessione=a1\">← A1 Blocco 1</a> · <a href=\"/admin/prototipi/periodizzazione/\">Hub periodizzazione</a>";
    root.appendChild(back);
  }

  function init() {
    var root = document.getElementById("mappa-root");
    if (!root) return;
    injectSprite().then(function () {
      return Promise.all([
        fetch(BLOCCO_URL).then(function (r) { return r.json(); }),
        fetch(CATALOGO_URL).then(function (r) { return r.json(); })
      ]);
    }).then(function (res) {
      render(res[0], res[1], root);
    }).catch(function (err) {
      root.innerHTML = "<p>Errore: " + err.message + "</p>";
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
