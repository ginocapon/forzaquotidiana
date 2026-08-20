/**
 * Smooth scroll Lenis — base Grok (lerp .08) + 20% effetto in più
 * ginocapon.github.io/Grok/en/ · smoothWheel · syncTouch · autoRaf
 */
(function () {
  "use strict";

  var LENIS_OPTS = {
    lerp: 0.064,
    smoothWheel: true,
    wheelMultiplier: 1.2,
    touchMultiplier: 1.2,
    syncTouch: true,
    syncTouchLerp: 0.064,
    autoRaf: true,
    anchors: true
  };

  function shouldSkip() {
    if (typeof Lenis === "undefined") return true;
    var body = document.body;
    if (!body) return true;
    if (body.getAttribute("data-no-smooth-scroll") === "true") return true;
    if (body.classList.contains("schede-peso")) return true;
    return false;
  }

  function isScrollable(node) {
    if (!node || node === document.body || node === document.documentElement) return false;
    var style = window.getComputedStyle(node);
    var oy = style.overflowY;
    var ox = style.overflowX;
    if ((oy === "auto" || oy === "scroll") && node.scrollHeight > node.clientHeight + 1) return true;
    if ((ox === "auto" || ox === "scroll") && node.scrollWidth > node.clientWidth + 1) return true;
    return false;
  }

  function preventNode(node) {
    if (!node) return false;
    if (node.closest && node.closest("[data-lenis-prevent], .no-smooth-scroll")) return true;
    var tag = node.nodeName;
    if (tag === "TEXTAREA" || tag === "SELECT") return true;
    if (node.isContentEditable) return true;
    var el = node.nodeType === 1 ? node : node.parentElement;
    while (el && el !== document.body) {
      if (isScrollable(el)) return true;
      el = el.parentElement;
    }
    return false;
  }

  function destroyLenis(instance) {
    if (!instance) return;
    try {
      instance.destroy();
    } catch (e) { /* ignore */ }
    if (window.lenis === instance) window.lenis = null;
  }

  function init() {
    if (shouldSkip()) return;

    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    var lenis = new Lenis(Object.assign({}, LENIS_OPTS, { prevent: preventNode }));
    window.lenis = lenis;

    reducedMotion.addEventListener("change", function (ev) {
      if (ev.matches) destroyLenis(lenis);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
