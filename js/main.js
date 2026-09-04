(function () {
  var body = document.body;
  var isAdmin = body.classList.contains("admin-page") || body.classList.contains("schede-peso");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");
  var mobileMq = window.matchMedia("(max-width: 720px)");

  if (!isAdmin) {
    body.classList.add("site-shell");
    initMobileOverlay(toggle, mobileMq);
  } else if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  var ul = nav && nav.querySelector("ul");
  if (ul) {
    /* Menu desktop: Home · Chi sono · Allenamenti · Schede (niente Diario in barra) */
    var diarioLink = ul.querySelector('a[href="/diario/"]');
    if (diarioLink && diarioLink.parentNode) diarioLink.parentNode.remove();

    var spec = [
      { href: "/", label: "Home", match: function (p) { return p === "/" || p === "/index.html"; } },
      { href: "/chi-sono/", label: "Chi sono", match: function (p) { return p.indexOf("/chi-sono") === 0; } },
      { href: "/allenamenti/", label: "Allenamenti", match: function (p) { return p.indexOf("/allenamenti") === 0; } },
      {
        href: "/admin/",
        label: "Schede",
        dataNav: "schede",
        match: function (p) { return p.indexOf("/admin") === 0; }
      }
    ];
    var path = location.pathname;
    ul.innerHTML = "";
    spec.forEach(function (item) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = item.href;
      a.textContent = item.label;
      if (item.dataNav) a.setAttribute("data-nav", item.dataNav);
      if (item.match(path)) a.setAttribute("aria-current", "page");
      li.appendChild(a);
      ul.appendChild(li);
    });
  }

  document.querySelectorAll('img[data-ai]').forEach(function (img) {
    if (img.closest(".ai-photo-wrap")) return;
    if (img.closest(".diario-list__thumb")) return;
    var wrap = document.createElement("span");
    wrap.className = "ai-photo-wrap";
    var mark = document.createElement("span");
    mark.className = "ai-photo-mark";
    mark.setAttribute("aria-hidden", "true");
    mark.textContent = "Foto AI";
    var parent = img.parentNode;
    parent.insertBefore(wrap, img);
    wrap.appendChild(img);
    wrap.appendChild(mark);
  });

  function initMobileOverlay(openBtn, mq) {
    if (!openBtn || document.getElementById("fq-overlay")) return;

    var path = location.pathname;
    var links = [
      { href: "/", label: "Home", num: "[01]", preview: "/img/hero/gino-locker-disciplina.webp", current: path === "/" || path === "/index.html" },
      { href: "/chi-sono/", label: "Chi sono", num: "[02]", preview: "/img/chi-sono/gino-affari.webp", current: path.indexOf("/chi-sono") === 0 },
      { href: "/diario/", label: "Diario", num: "[03]", preview: "/img/allenamenti/hub/diario.webp", current: path.indexOf("/diario") === 0 },
      { href: "/allenamenti/", label: "Allenamenti", num: "[04]", preview: "/img/allenamenti/hub/allenamenti.webp", current: path.indexOf("/allenamenti") === 0 },
      { href: "/personal-trainer/", label: "Personal trainer", num: "[05]", preview: "/img/allenamenti/hub/sessioni.webp", current: path.indexOf("/personal-trainer") === 0 },
      { href: "/admin/", label: "Schede", num: "[06]", preview: "/img/allenamenti/hub/trimestre.webp", current: path.indexOf("/admin") === 0 }
    ];

    var dim = document.createElement("div");
    dim.className = "fq-overlay-dim";
    dim.id = "fq-overlay-dim";
    dim.setAttribute("aria-hidden", "true");

    var overlay = document.createElement("div");
    overlay.className = "fq-overlay";
    overlay.id = "fq-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Menu");
    overlay.setAttribute("aria-hidden", "true");

    var cells = links.map(function (item) {
      var cur = item.current ? " aria-current=\"page\"" : "";
      return "<a href=\"" + item.href + "\"" + cur + ">" +
        "<img class=\"fq-overlay-bg\" src=\"" + item.preview + "\" alt=\"\" loading=\"lazy\">" +
        "<span class=\"fq-overlay-shade\" aria-hidden=\"true\"></span>" +
        "<span class=\"fq-overlay-num\">" + item.num + "</span>" +
        "<span class=\"fq-overlay-label\">" + item.label + "</span>" +
        "</a>";
    }).join("");

    overlay.innerHTML =
      "<div class=\"fq-overlay-bar\">" +
        "<a class=\"fq-overlay-bar__brand\" href=\"/\"><span class=\"fq-overlay-mark\" aria-hidden=\"true\"></span> La Forza Quotidiana</a>" +
        "<button class=\"fq-overlay-close\" type=\"button\" id=\"fq-close-menu\">Chiudi <span aria-hidden=\"true\">×</span></button>" +
      "</div>" +
      "<nav class=\"fq-overlay-nav\" aria-label=\"Sezioni\">" + cells + "</nav>" +
      "<div class=\"fq-overlay-foot\">" +
        "<p>Per Ginevra</p>" +
        "<p class=\"fq-overlay-meta\">Treviso — lascito di un papà presente</p>" +
      "</div>";

    document.body.appendChild(dim);
    document.body.appendChild(overlay);

    openBtn.setAttribute("aria-controls", "fq-overlay");
    if (!openBtn.querySelector(".fq-menu-dots")) {
      openBtn.innerHTML = "Menu <span class=\"fq-menu-dots\" aria-hidden=\"true\"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>";
    }

    var closeBtn = document.getElementById("fq-close-menu");
    var menuOpen = false;
    var peekAcc = 0;
    var lastTouchY = null;
    var lastFocus = null;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function scrollPage(dy) {
      if (window.lenis && typeof window.lenis.scrollTo === "function") {
        var now = typeof window.lenis.scroll === "number" ? window.lenis.scroll : window.scrollY;
        window.lenis.scrollTo(now + dy, { immediate: true });
      } else {
        window.scrollBy(0, dy);
      }
    }

    function openMenu() {
      if (!mq.matches) return;
      menuOpen = true;
      peekAcc = 0;
      lastFocus = document.activeElement;
      document.body.classList.add("fq-menu-open");
      document.body.classList.remove("is-peeking");
      dim.setAttribute("aria-hidden", "false");
      overlay.setAttribute("aria-hidden", "false");
      dim.classList.add("is-open");
      overlay.classList.add("is-open");
      openBtn.setAttribute("aria-expanded", "true");
      if (closeBtn) closeBtn.focus();
    }

    function closeMenu() {
      menuOpen = false;
      peekAcc = 0;
      document.body.classList.remove("fq-menu-open");
      document.body.classList.remove("is-peeking");
      dim.classList.remove("is-open");
      overlay.classList.remove("is-open");
      dim.setAttribute("aria-hidden", "true");
      overlay.setAttribute("aria-hidden", "true");
      openBtn.setAttribute("aria-expanded", "false");
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    function onPeekDelta(dy) {
      if (reduce) return;
      peekAcc += Math.abs(dy);
      if (peekAcc > 48) document.body.classList.add("is-peeking");
    }

    openBtn.addEventListener("click", function () {
      if (mq.matches) {
        if (menuOpen) closeMenu();
        else openMenu();
      }
    });

    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
    dim.addEventListener("click", closeMenu);

    document.addEventListener("keydown", function (e) {
      if (!menuOpen) return;
      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu();
        return;
      }
      if (e.key !== "Tab") return;
      var focusable = overlay.querySelectorAll("a[href], button");
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    function onWheel(e) {
      if (!menuOpen || !mq.matches) return;
      e.preventDefault();
      scrollPage(e.deltaY);
      onPeekDelta(e.deltaY);
    }
    overlay.addEventListener("wheel", onWheel, { passive: false });
    dim.addEventListener("wheel", onWheel, { passive: false });

    overlay.addEventListener("touchstart", function (e) {
      if (e.touches[0]) lastTouchY = e.touches[0].clientY;
    }, { passive: true });
    overlay.addEventListener("touchmove", function (e) {
      if (!menuOpen || !mq.matches || lastTouchY == null || !e.touches[0]) return;
      var y = e.touches[0].clientY;
      var dy = lastTouchY - y;
      lastTouchY = y;
      e.preventDefault();
      scrollPage(dy);
      onPeekDelta(dy);
    }, { passive: false });

    mq.addEventListener("change", function () {
      if (!mq.matches) closeMenu();
    });
  }
})();
