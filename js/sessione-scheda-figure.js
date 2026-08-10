/**
 * Figure esercizi sessione — sprite admin come trimestre/hub
 */
(function () {
  "use strict";

  var DATA_URL = "/data/trimestre-q3-esercizi.json";

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === "className") node.className = attrs[k];
        else if (k === "html") node.innerHTML = attrs[k];
        else if (k === "text") node.textContent = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    (children || []).forEach(function (c) {
      if (typeof c === "string") node.appendChild(document.createTextNode(c));
      else if (c) node.appendChild(c);
    });
    return node;
  }

  function renderCard(ex) {
    var card = el("article", { className: "exercise-card" });
    var figWrap = el("div", { className: "exercise-card__fig" });
    if (window.fqSprite && window.fqSprite.figure) {
      figWrap.appendChild(window.fqSprite.figure(ex.figura, ex.nome));
    }
    card.appendChild(figWrap);

    var body = el("div");
    if (ex.meta) {
      body.appendChild(el("p", {
        className: "exercise-card__meta",
        html: ex.meta
      }));
    }
    body.appendChild(el("h3", { text: ex.nome }));
    if (ex.muscoli) {
      body.appendChild(el("p", {
        className: "exercise-card__muscles",
        html: ex.muscoli
      }));
    }
    if (ex.exec && ex.exec.length) {
      var ul = el("ul", { className: "exercise-card__exec" });
      ex.exec.forEach(function (line) {
        ul.appendChild(el("li", { text: line }));
      });
      body.appendChild(ul);
    }
    card.appendChild(body);
    return card;
  }

  function parseSchede(raw) {
    if (!raw) return [];
    return String(raw).split(",").map(function (s) {
      return "scheda-" + s.trim();
    }).filter(Boolean);
  }

  function init() {
    var mount = document.getElementById("sessione-scheda-figure");
    if (!mount) return;

    var schedeKeys = parseSchede(
      document.body.getAttribute("data-schede") ||
      document.body.getAttribute("data-scheda")
    );
    if (!schedeKeys.length) return;

    var trimestreUrl = document.body.getAttribute("data-trimestre-url") ||
      "/allenamenti/trimestre-giugno-luglio-agosto-2026/";

    var spriteReady = window.fqSprite ? window.fqSprite.inject() : Promise.resolve();

    spriteReady
      .then(function () { return fetch(DATA_URL).then(function (r) { return r.json(); }); })
      .then(function (data) {
        mount.innerHTML = "";
        schedeKeys.forEach(function (key, i) {
          var list = data.schede[key];
          if (!list || !list.length) return;

          if (schedeKeys.length > 1) {
            var label = el("h3", {
              className: "sessione-figure__scheda-title",
              text: key.replace("scheda-", "Scheda ") + " · programma"
            });
            mount.appendChild(label);
          }

          var grid = el("div", { className: "exercise-grid" });
          list.forEach(function (ex) { grid.appendChild(renderCard(ex)); });
          mount.appendChild(grid);
        });

        var foot = el("p", { className: "sessione-figure__foot" });
        foot.innerHTML = "Figure guida dal <a href=\"" + trimestreUrl + "\">programma trimestre</a> · stesso stile admin.";
        mount.appendChild(foot);
      })
      .catch(function () {
        mount.innerHTML = "<p><small>Figure esercizi non disponibili.</small></p>";
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
