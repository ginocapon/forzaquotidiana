(function () {
  var body = document.body;
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");
  var mobileMq = window.matchMedia("(max-width: 900px)");

  body.classList.add("site-shell");
  if (!toggle) {
    injectSiteHeader();
    toggle = document.querySelector(".nav-toggle");
    nav = document.querySelector(".site-nav");
  }
  if (toggle) initOverlayMenu(toggle, mobileMq);

  var ul = nav && nav.querySelector("ul");
  if (ul) {
    /* Menu desktop: Home · Chi sono · Diario · Allenamenti · Personal trainer · Schede */
    var spec = [
      { href: "/", label: "Home", match: function (p) { return p === "/" || p === "/index.html"; } },
      { href: "/chi-sono/", label: "Chi sono", match: function (p) { return p.indexOf("/chi-sono") === 0; } },
      { href: "/diario/", label: "Diario", match: function (p) { return p.indexOf("/diario") === 0; } },
      {
        href: "/allenamenti/",
        label: "Allenamenti",
        match: function (p) {
          return p.indexOf("/allenamenti") === 0 && p.indexOf("/allenamenti/schede-peso") !== 0;
        }
      },
      {
        href: "/personal-trainer/",
        label: "Personal trainer",
        match: function (p) { return p.indexOf("/personal-trainer") === 0; }
      },
      {
        href: "/admin/",
        label: "Schede",
        dataNav: "schede",
        match: function (p) { return p.indexOf("/admin") === 0 || p.indexOf("/allenamenti/schede-peso") === 0; }
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

  function injectSiteHeader() {
    if (document.querySelector(".site-header")) return;
    var header = document.createElement("header");
    header.className = "site-header no-print";
    header.innerHTML =
      "<div class=\"wrap\">" +
        "<a class=\"logo\" href=\"/\">La Forza Quotidiana<small>Gino Capon</small></a>" +
        "<button class=\"nav-toggle\" type=\"button\" aria-expanded=\"false\" aria-controls=\"fq-overlay\">Menu</button>" +
        "<nav class=\"site-nav\" id=\"nav-principale\" aria-label=\"Principale\" hidden>" +
          "<ul></ul>" +
        "</nav>" +
      "</div>";
    body.insertBefore(header, body.firstChild);
  }

  function initOverlayMenu(openBtn, mq) {
    if (!openBtn || document.getElementById("fq-overlay")) return;

    var path = location.pathname;
    var links = [
      { href: "/", label: "Home", num: "[01]", preview: "/img/hero/gino-locker-disciplina.webp", current: path === "/" || path === "/index.html" },
      { href: "/chi-sono/", label: "Chi sono", num: "[02]", preview: "/img/chi-sono/gino-affari.webp", current: path.indexOf("/chi-sono") === 0 },
      { href: "/diario/", label: "Diario", num: "[03]", preview: "/img/allenamenti/hub/diario.webp", current: path.indexOf("/diario") === 0 },
      { href: "/allenamenti/", label: "Allenamenti", num: "[04]", preview: "/img/allenamenti/hub/allenamenti.webp", current: path.indexOf("/allenamenti") === 0 && path.indexOf("/allenamenti/schede-peso") !== 0 },
      { href: "/personal-trainer/", label: "Personal trainer", num: "[05]", preview: "/img/allenamenti/hub/sessioni.webp", current: path.indexOf("/personal-trainer") === 0 },
      { href: "/admin/", label: "Schede", num: "[06]", preview: "/img/allenamenti/hub/trimestre.webp", current: path.indexOf("/admin") === 0 || path.indexOf("/allenamenti/schede-peso") === 0 }
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

    links.forEach(function (item) {
      var img = new Image();
      img.src = item.preview;
    });

    var cells = links.map(function (item) {
      var cur = item.current ? " aria-current=\"page\"" : "";
      return "<a href=\"" + item.href + "\"" + cur + " style=\"--fq-cell-photo:url('" + item.preview + "')\">" +
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

    openBtn.addEventListener("click", function (e) {
      e.preventDefault();
      if (menuOpen) closeMenu();
      else openMenu();
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
      if (!menuOpen) return;
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
      if (!menuOpen || lastTouchY == null || !e.touches[0]) return;
      var y = e.touches[0].clientY;
      var dy = lastTouchY - y;
      lastTouchY = y;
      e.preventDefault();
      scrollPage(dy);
      onPeekDelta(dy);
    }, { passive: false });

    mq.addEventListener("change", function () {
      if (menuOpen) closeMenu();
    });
  }
})();

/* Barra di navigazione mobile: Indietro · Sezione · Menu (pagine interne, solo telefono) */
(function () {
  var path = location.pathname.replace(/index\.html$/, "");
  if (path === "/" || path === "") return;
  if (document.querySelector(".fq-backbar")) return;

  function parentOf(p) {
    var parts = p.split("/").filter(Boolean);
    parts.pop();
    return parts.length ? "/" + parts.join("/") + "/" : "/";
  }
  var labels = {
    "/diario/": "Diario",
    "/allenamenti/": "Allenamenti",
    "/allenamenti/sessioni/": "Sessioni",
    "/admin/": "Schede",
    "/personal-trainer/": "Personal trainer"
  };
  var up = parentOf(path);
  var upLabel = labels[up] || (up === "/" ? "Home" : "Su");

  var style = document.createElement("style");
  style.textContent =
    ".fq-backbar{display:none}" +
    "@media (max-width:900px){" +
    ".fq-backbar{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:90;gap:8px;padding:8px 10px calc(8px + env(safe-area-inset-bottom));background:rgba(14,14,14,.92);border-top:1px solid rgba(201,120,58,.35);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}" +
    ".fq-backbar a,.fq-backbar button{flex:1 1 0;min-height:44px;display:flex;align-items:center;justify-content:center;gap:6px;font-family:inherit;font-weight:600;font-size:.9rem;line-height:1.1;color:#f4efe6;background:rgba(201,120,58,.14);border:1px solid rgba(201,120,58,.45);border-radius:999px;text-decoration:none;cursor:pointer;padding:0 10px}" +
    ".fq-backbar a:active,.fq-backbar button:active{background:rgba(201,120,58,.35)}" +
    "body.site-shell{padding-bottom:calc(64px + env(safe-area-inset-bottom))}" +
    "}" +
    "@media print{.fq-backbar{display:none!important}}";
  document.head.appendChild(style);

  var bar = document.createElement("nav");
  bar.className = "fq-backbar no-print";
  bar.setAttribute("aria-label", "Navigazione rapida");

  var back = document.createElement("button");
  back.type = "button";
  back.innerHTML = "<span aria-hidden=\"true\">←</span> Indietro";
  back.addEventListener("click", function () {
    var sameSite = document.referrer && document.referrer.indexOf(location.origin) === 0;
    if (sameSite && history.length > 1) history.back();
    else location.href = up;
  });
  bar.appendChild(back);

  var upLink = document.createElement("a");
  upLink.href = up;
  upLink.innerHTML = "<span aria-hidden=\"true\">↑</span> " + upLabel;
  bar.appendChild(upLink);

  var menu = document.createElement("button");
  menu.type = "button";
  menu.innerHTML = "<span aria-hidden=\"true\">☰</span> Menu";
  menu.addEventListener("click", function () {
    var t = document.querySelector(".nav-toggle");
    if (t) t.click();
  });
  bar.appendChild(menu);

  document.body.appendChild(bar);
})();
