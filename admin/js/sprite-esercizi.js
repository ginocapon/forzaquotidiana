/**
 * Sprite figure esercizi — iniezione condivisa
 * Symbol in /admin/img/esercizi-sprite.svg, richiamati con <use href="#fig-...">.
 */
(function () {
  "use strict";

  var SPRITE_URL = "/admin/img/esercizi-sprite.svg";
  var MOUNT_ID = "fq-ex-sprite";
  var pending = null;

  /** ID errati o legacy → symbol reale nello sprite */
  var ALIAS = {
    "fig-adduttori": "fig-doktor",
    "fig-leg-extension": "fig-legext",
    "fig-stacco-rdl": "fig-rdl"
  };

  function resolveFigId(figId) {
    var id = ALIAS[figId] || figId || "fig-press-incl";
    if (document.getElementById(id)) return id;
    return "fig-press-incl";
  }

  function inject() {
    if (document.getElementById(MOUNT_ID)) return Promise.resolve();
    if (pending) return pending;

    pending = fetch(SPRITE_URL)
      .then(function (r) {
        if (!r.ok) throw new Error("Sprite non disponibile (" + r.status + ")");
        return r.text();
      })
      .then(function (svgText) {
        if (document.getElementById(MOUNT_ID)) return;

        var parser = new DOMParser();
        var doc = parser.parseFromString(svgText, "image/svg+xml");
        if (doc.querySelector("parsererror")) {
          throw new Error("Sprite SVG non valido");
        }

        var NS = "http://www.w3.org/2000/svg";
        var mount = document.createElementNS(NS, "svg");
        mount.id = MOUNT_ID;
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
      })
      .catch(function (err) {
        pending = null;
        if (typeof console !== "undefined" && console.warn) {
          console.warn("fqSprite:", err && err.message ? err.message : err);
        }
      });

    return pending;
  }

  /**
   * @param {string} figId id symbol (senza #)
   * @param {string} label nome esercizio per screen reader
   */
  function figure(figId, label) {
    var NS = "http://www.w3.org/2000/svg";
    var id = resolveFigId(figId);
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
    var use = document.createElementNS(NS, "use");
    use.setAttribute("href", "#" + id);
    use.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#" + id);
    svg.appendChild(use);
    return svg;
  }

  window.fqSprite = { inject: inject, figure: figure, URL: SPRITE_URL, alias: ALIAS };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();
