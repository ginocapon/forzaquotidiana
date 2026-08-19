(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  var ul = nav && nav.querySelector("ul");
  if (ul) {
    /* Menu unificato: Home · Chi sono · Allenamenti · Schede (niente Diario in barra) */
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

  /* Marchio «Foto AI» su immagini data-ai (AI Act UE).
     Esclusi i thumb dell’indice diario: troppo piccoli, il testo non si legge. */
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
})();
