/**
 * Admin dashboard — macrociclo e sessioni a vista
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

  function formatDate(iso) {
    var d = new Date(iso + "T12:00:00");
    return d.toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" });
  }

  function sessionSummary(sessione) {
    var prog = sessione.esercizi.filter(function (e) { return e.progressione || e.progressionePrincipale; });
    var main = prog.length ? prog[0] : sessione.esercizi[0];
    var peso = (!main.peso || main.peso === "—" || main.peso === "-") ? "kg TBD" : main.peso;
    return main ? main.nome + " · " + peso + " · " + main.serie + "×" + main.ripetizioni : "";
  }

  function renderSessionGrid(fase, periodo, blocco) {
    var grid = el("div", { className: "admin-sessioni-grid" });
    var sessioni = periodo && periodo.sessioni ? periodo.sessioni : fase.sessioni;
    ["a1", "b1", "a2", "b2"].forEach(function (key) {
      var s = sessioni[key] || fase.sessioni[key];
      if (!s) return;
      var periodoId = periodo ? periodo.id : null;
      var href = window.fqPeriodi
        ? window.fqPeriodi.sessionUrl(fase.id, key, periodoId)
        : "/admin/sessione/?ciclo=" + encodeURIComponent(fase.id) + "&sessione=" + key;
      var pdfHref = window.fqPeriodi
        ? window.fqPeriodi.sessionPdfUrl(fase.id, key, periodoId)
        : "/admin/sessione/pdf/?ciclo=" + encodeURIComponent(fase.id) + "&sessione=" + key;
      var wrap = el("div", { className: "admin-sessione-card-wrap" });
      var link = el("a", { className: "admin-sessione-card", href: href });
      link.innerHTML =
        "<span class=\"admin-sessione-card__key\">" + key.toUpperCase() + "</span>" +
        "<strong>" + s.nome + "</strong>" +
        "<p>" + s.esercizi.length + " esercizi</p>" +
        "<p class=\"admin-sessione-card__main\">" + sessionSummary(s) + "</p>" +
        "<span class=\"admin-sessione-card__cta\">Apri scheda →</span>";
      wrap.appendChild(link);
      wrap.appendChild(el("a", {
        className: "admin-sessione-card-pdf",
        href: pdfHref,
        target: "_blank",
        rel: "noopener",
        text: "PDF"
      }));
      grid.appendChild(wrap);
    });
    return grid;
  }

  function renderDashboard(data, blocchiById, root) {
    root.innerHTML = "";
    var m = data.macrociclo;

    var hero = el("div", { className: "admin-macrociclo-head" });
    var pesoLine = m.pesoPartenza != null ? " · Peso corporeo rif. " + m.pesoPartenza + " kg" : " · Pesi esercizi da definire";
    hero.innerHTML = "<h2>" + m.nome + "</h2><p>" + formatDate(m.inizio) + " → " + formatDate(m.fine) + " · <strong>" + m.frequenza + "</strong>" + pesoLine + "</p><p class=\"admin-macrociclo-desc\">" + m.descrizione + "</p>";
    root.appendChild(hero);

    var timeline = el("div", { className: "admin-timeline" });
    data.fasi.forEach(function (fase, i) {
      var blocco = blocchiById[fase.id];
      var block = el("section", { className: "admin-fase", id: fase.id });
      var head = el("div", { className: "admin-fase__head" });
      var info = el("div");
      info.innerHTML = "<span class=\"admin-fase__num\">Fase " + (i + 1) + "</span><h3>" + fase.nome + "</h3><p class=\"admin-fase__dates\">" + formatDate(fase.inizio) + " – " + formatDate(fase.fine) + " · " + fase.settimane + " sett. · RIR " + fase.rir + "</p>";
      var side = el("div", { className: "admin-fase__side" });
      side.appendChild(el("p", { className: "admin-fase__obiettivo", html: fase.obiettivo }));
      if (!window.fqPeriodi || !blocco || !window.fqPeriodi.hasPeriodi(blocco)) {
        side.appendChild(el("a", {
          className: "admin-fase__pdf",
          href: window.fqPeriodi
            ? window.fqPeriodi.fasePdfUrl(fase.id)
            : "/admin/prototipi/periodizzazione/fase/?anno=2026-2027&fase=" + encodeURIComponent(fase.id),
          target: "_blank",
          rel: "noopener",
          title: "Riassunto stampabile delle quattro schede A1–B2",
          text: "PDF Fase " + (i + 1) + " · A1–B2"
        }));
      }
      head.appendChild(info);
      head.appendChild(side);
      block.appendChild(head);

      if (window.fqPeriodi && blocco && window.fqPeriodi.hasPeriodi(blocco)) {
        window.fqPeriodi.list(blocco).forEach(function (periodo) {
          var sub = el("div", { className: "admin-fase-periodo" });
          var subHead = el("div", { className: "admin-fase-periodo__head" });
          subHead.innerHTML =
            "<h4>" + periodo.label + "</h4>" +
            "<p>Rep sui *: <strong>" + periodo.repFondamentali + "</strong> · RIR " + periodo.rir + "</p>";
          subHead.appendChild(el("a", {
            className: "admin-fase__pdf admin-fase__pdf--periodo",
            href: window.fqPeriodi.fasePdfUrl(fase.id, periodo.id),
            target: "_blank",
            rel: "noopener",
            text: "PDF riassunto A1–B2 · sett. " + periodo.settimane
          }));
          sub.appendChild(subHead);
          sub.appendChild(renderSessionGrid(fase, periodo, blocco));
          block.appendChild(sub);
        });
      } else {
        block.appendChild(renderSessionGrid(fase, null, blocco));
      }

      timeline.appendChild(block);
    });
    root.appendChild(timeline);
  }

  function init() {
    var root = document.getElementById("admin-dashboard");
    if (!root) return;
    Promise.all([
      fetch(DATA_URL).then(function (r) { return r.json(); }),
      fetch("/admin/data/blocchi-index.json").then(function (r) { return r.json(); }).catch(function () { return { blocchi: {} }; })
    ])
      .then(function (res) {
        var data = res[0];
        var index = res[1];
        var ids = Object.keys(index.blocchi || {});
        return Promise.all(ids.map(function (id) {
          return fetch("/admin/data/" + index.blocchi[id]).then(function (r) { return r.json(); })
            .then(function (b) { return { id: id, blocco: b }; });
        })).then(function (pairs) {
          var blocchiById = {};
          pairs.forEach(function (p) { blocchiById[p.id] = p.blocco; });
          renderDashboard(data, blocchiById, root);
        });
      })
      .catch(function (err) {
        root.innerHTML = "<p>Errore: " + err.message + "</p>";
      });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
