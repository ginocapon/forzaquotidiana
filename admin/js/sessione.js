/**
 * Pagina sessione dedicata — pesi, serie, note
 */
(function () {
  "use strict";

  var DATA_URL = "/admin/data/macrociclo-2026-2027.json";

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === "className") node.className = attrs[k];
        else if (k === "html") node.innerHTML = attrs[k];
        else if (k === "text") node.textContent = attrs.text;
        else node.setAttribute(k, attrs[k]);
      });
    }
    (children || []).forEach(function (c) {
      if (typeof c === "string") node.appendChild(document.createTextNode(c));
      else if (c) node.appendChild(c);
    });
    return node;
  }

  function formatDate(iso) {
    var d = new Date(iso + "T12:00:00");
    return d.toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
  }

  function findFase(data, id) {
    return data.fasi.find(function (f) { return f.id === id; });
  }

  function renderSession(data, faseId, sessionKey, root) {
    var fase = findFase(data, faseId);
    if (!fase || !fase.sessioni[sessionKey]) {
      root.innerHTML = "<p>Sessione non trovata.</p>";
      return;
    }
    var s = fase.sessioni[sessionKey];
    root.innerHTML = "";

    document.title = sessionKey.toUpperCase() + " · " + fase.nome + " | Admin";

    var nav = el("nav", { className: "admin-breadcrumb", "aria-label": "Percorso" });
    nav.innerHTML = "<a href=\"/admin/\">Dashboard</a> · <a href=\"/admin/#" + fase.id + "\">" + fase.nome + "</a> · <strong>" + sessionKey.toUpperCase() + "</strong>";
    root.appendChild(nav);

    var head = el("header", { className: "admin-session-head" });
    head.innerHTML = "<p class=\"tagline\">" + formatDate(fase.inizio) + " – " + formatDate(fase.fine) + " · RIR " + fase.rir + "</p><h1>" + sessionKey.toUpperCase() + " — " + s.nome + "</h1><p class=\"lead\">" + fase.obiettivo + "</p>";
    root.appendChild(head);

    var actions = el("div", { className: "admin-session-actions no-print" });
    var pdfUrl = "/admin/sessione/pdf/?ciclo=" + encodeURIComponent(faseId) + "&sessione=" + sessionKey;
    actions.innerHTML = "<a class=\"btn btn-primary\" href=\"" + pdfUrl + "\" target=\"_blank\" rel=\"noopener\">Scarica PDF · scheda palestra</a>";
    root.appendChild(actions);

    var tableWrap = el("div", { className: "table-wrap" });
    var table = el("table", { className: "scheda-table admin-session-table" });
    table.innerHTML = "<thead><tr><th>#</th><th>Esercizio</th><th>Gruppo</th><th>S×R</th><th>Peso</th><th>Rec</th><th>RIR</th><th>Tecnica</th><th>Note</th></tr></thead>";
    var tbody = el("tbody");
    s.esercizi.forEach(function (ex, i) {
      var tr = el("tr");
      if (ex.progressione) tr.className = "admin-row--prog";
      tr.innerHTML = "<td>" + (i + 1) + (ex.progressione ? " *" : "") + "</td><td><strong>" + ex.nome + "</strong></td><td>" + ex.gruppo + "</td><td>" + ex.serie + "×" + ex.ripetizioni + "</td><td class=\"admin-peso\">" + ex.peso + "</td><td>" + ex.recupero + "</td><td>" + ex.rir + "</td><td>" + (ex.tecnica || "—") + "</td><td>" + (ex.note || "—") + "</td>";
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    tableWrap.appendChild(table);
    root.appendChild(tableWrap);

    var log = el("section", { className: "admin-log-box" });
    log.innerHTML = "<h2>Log sessione</h2><p>Data: ___/___/___ · Durata: ___ · RPE medio: ___ · Note: _______________________________</p>";
    root.appendChild(log);

    var links = el("nav", { className: "admin-session-nav" });
    ["a1", "b1", "a2", "b2"].forEach(function (k) {
      if (!fase.sessioni[k]) return;
      var a = el("a", {
        href: "/admin/sessione/?ciclo=" + encodeURIComponent(faseId) + "&sessione=" + k,
        className: k === sessionKey ? "is-active" : "",
        text: k.toUpperCase()
      });
      links.appendChild(a);
    });
    root.appendChild(links);

    var back = el("p", { className: "admin-back" });
    back.innerHTML = "<a href=\"/admin/#" + fase.id + "\">← Torna alla fase " + fase.nome + "</a>";
    root.appendChild(back);
  }

  function init() {
    var root = document.getElementById("sessione-root");
    if (!root) return;
    var params = new URLSearchParams(window.location.search);
    var faseId = params.get("ciclo");
    var sessionKey = (params.get("sessione") || "a1").toLowerCase();
    if (!faseId) {
      root.innerHTML = "<p>Parametro <code>ciclo</code> mancante. <a href=\"/admin/\">Torna alla dashboard</a>.</p>";
      return;
    }
    fetch(DATA_URL)
      .then(function (r) { return r.json(); })
      .then(function (data) { renderSession(data, faseId, sessionKey, root); })
      .catch(function (err) { root.innerHTML = "<p>Errore: " + err.message + "</p>"; });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
