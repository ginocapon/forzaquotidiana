/**
 * Sprite figure esercizi — symbol inline clonati (no <use>, sempre visibili)
 */
(function () {
  "use strict";

  var SPRITE_URLS = [
    "/img/esercizi-sprite.svg",
    "/admin/img/esercizi-sprite.svg"
  ];
  var MOUNT_ID = "fq-ex-sprite";
  var pending = null;

  var ALIAS = {
    "fig-adduttori": "fig-doktor",
    "fig-leg-extension": "fig-legext",
    "fig-stacco-rdl": "fig-rdl"
  };

  function resolveFigId(figId) {
    return ALIAS[figId] || figId || "fig-press-incl";
  }

  function findSymbol(figId) {
    var id = resolveFigId(figId);
    var mount = document.getElementById(MOUNT_ID);
    if (!mount) return null;
    return mount.querySelector("symbol#" + id) || mount.querySelector("[id='" + id + "']");
  }

  function mountSprite(doc) {
    if (document.getElementById(MOUNT_ID)) return;

    var NS = "http://www.w3.org/2000/svg";
    var mount = document.createElementNS(NS, "svg");
    mount.id = MOUNT_ID;
    mount.setAttribute("xmlns", NS);
    mount.setAttribute("aria-hidden", "true");
    mount.setAttribute("focusable", "false");
    mount.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none";

    var defs = doc.querySelector("defs");
    if (defs) mount.appendChild(defs.cloneNode(true));

    doc.querySelectorAll("symbol").forEach(function (sym) {
      mount.appendChild(sym.cloneNode(true));
    });

    if (!mount.querySelector("symbol")) {
      throw new Error("Nessun symbol nello sprite");
    }

    document.body.insertBefore(mount, document.body.firstChild);
  }

  function parseSprite(svgText) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(svgText, "image/svg+xml");
    if (doc.querySelector("parsererror")) {
      throw new Error("Sprite SVG non valido");
    }
    return doc;
  }

  function tryFetch(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error(url + " (" + r.status + ")");
      return r.text();
    });
  }

  function inject() {
    if (document.getElementById(MOUNT_ID)) return Promise.resolve();
    if (pending) return pending;

    var chain = Promise.reject();
    SPRITE_URLS.forEach(function (url) {
      chain = chain.catch(function () {
        return tryFetch(url).then(parseSprite);
      });
    });

    pending = chain
      .then(function (doc) {
        mountSprite(doc);
      })
      .catch(function (err) {
        pending = null;
        if (typeof console !== "undefined" && console.warn) {
          console.warn("fqSprite:", err && err.message ? err.message : err);
        }
      });

    return pending;
  }

  function figure(figId, label) {
    var NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 120 120");
    svg.setAttribute("class", "ex-fig-svg");
    if (label) {
      svg.setAttribute("role", "img");
      svg.setAttribute("aria-label", "Illustrazione esercizio: " + label);
    } else {
      svg.setAttribute("aria-hidden", "true");
      svg.setAttribute("focusable", "false");
    }

    var sym = findSymbol(figId);
    if (sym) {
      Array.prototype.forEach.call(sym.childNodes, function (node) {
        if (node.nodeType !== 1) return;
        if (node.localName === "title") return;
        svg.appendChild(node.cloneNode(true));
      });
    }

    return svg;
  }

  window.fqSprite = {
    inject: inject,
    figure: figure,
    findSymbol: findSymbol,
    URL: SPRITE_URLS[0],
    alias: ALIAS
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();
