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
  if (ul && !ul.querySelector('[data-nav="schede"]')) {
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.href = "/admin/prototipi/periodizzazione/";
    a.textContent = "Schede";
    a.setAttribute("data-nav", "schede");
    if (location.pathname.indexOf("/admin/prototipi/periodizzazione") === 0) {
      a.setAttribute("aria-current", "page");
    }
    li.appendChild(a);
    var allen = ul.querySelector('a[href="/allenamenti/"]');
    if (allen && allen.parentNode) allen.parentNode.insertAdjacentElement("afterend", li);
    else ul.appendChild(li);
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
