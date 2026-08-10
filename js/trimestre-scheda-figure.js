/**
 * Figure esercizi pagina trimestre — sprite admin + JSON condiviso
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

  function init() {
    var mounts = document.querySelectorAll("[data-trimestre-scheda]");
    if (!mounts.length) return;

    var spriteReady = window.fqSprite ? window.fqSprite.inject() : Promise.resolve();

    spriteReady
      .then(function () { return fetch(DATA_URL).then(function (r) { return r.json(); }); })
      .then(function (data) {
        mounts.forEach(function (mount) {
          var key = "scheda-" + mount.getAttribute("data-trimestre-scheda");
          var list = data.schede[key];
          if (!list || !list.length) return;
          mount.innerHTML = "";
          list.forEach(function (ex) {
            mount.appendChild(renderCard(ex));
          });
        });
      })
      .catch(function () {
        mounts.forEach(function (mount) {
          mount.innerHTML = "<p><small>Figure esercizi non disponibili.</small></p>";
        });
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
