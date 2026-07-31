/**
 * Guida operativa Blocco 1 — distribuzione, RIR, periodizzazione, volumi
 */
(function () {
  "use strict";

  var BLOCCO_URL = "/admin/data/blocco-1-fase1.json";

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

  function table(headers, rows, className) {
    var wrap = el("div", { className: "table-wrap" });
    var t = el("table", { className: className || "scheda-table admin-metodo-table" });
    var thead = el("thead");
    var hr = el("tr");
    headers.forEach(function (h) { hr.appendChild(el("th", { text: h })); });
    thead.appendChild(hr);
    t.appendChild(thead);
    var tbody = el("tbody");
    rows.forEach(function (row) {
      var tr = el("tr");
      row.forEach(function (cell) {
        tr.appendChild(el("td", typeof cell === "object" ? cell : { text: String(cell) }));
      });
      tbody.appendChild(tr);
    });
    t.appendChild(tbody);
    wrap.appendChild(t);
    return wrap;
  }

  function section(title, children) {
    var sec = el("section", { className: "admin-section admin-metodo-section" });
    sec.appendChild(el("h2", { text: title }));
    (children || []).forEach(function (c) { if (c) sec.appendChild(c); });
    return sec;
  }

  function render(blocco, root) {
    var g = blocco.guidaOperativa;
    if (!g) {
      root.innerHTML = "<p>Guida operativa non trovata.</p>";
      return;
    }

    root.innerHTML = "";
    document.title = g.titolo + " | Admin";

    var intro = el("aside", { className: "admin-callout card admin-metodo-intro" });
    intro.appendChild(el("p", { html: "<strong>" + g.sintesi + "</strong>" }));
    if (blocco.guida) intro.appendChild(el("p", { text: blocco.guida }));
    root.appendChild(intro);

    /* 1. Distribuzione settimanale */
    var dist = g.distribuzioneSettimanale;
    var distSec = section("1. Distribuzione settimanale — quando fare ogni scheda", [
      el("p", { className: "admin-metodo-lead", text: dist.schema }),
      table(
        ["Giorno", "Sessione", "Tipo", "Focus"],
        dist.consigliata.map(function (r) {
          return [r.giorno, r.sessione, r.tipo, r.focus];
        })
      )
    ]);
    if (dist.alternative && dist.alternative.length) {
      var alt = el("div", { className: "admin-metodo-alt" });
      alt.appendChild(el("h3", { text: "Alternative se non puoi seguire Lun–Mar–Gio–Sab" }));
      var ul = el("ul");
      dist.alternative.forEach(function (a) { ul.appendChild(el("li", { text: a })); });
      alt.appendChild(ul);
      distSec.appendChild(alt);
    }
    if (dist.regoleRecupero) {
      var rec = el("div", { className: "admin-metodo-rules" });
      rec.appendChild(el("h3", { text: "Regole di recupero" }));
      var rul = el("ul");
      dist.regoleRecupero.forEach(function (r) { rul.appendChild(el("li", { text: r })); });
      rec.appendChild(rul);
      distSec.appendChild(rec);
    }
    root.appendChild(distSec);

    /* 2. RIR e cedimento */
    var rir = g.regoleRirECedimento;
    var rirSec = section("2. RIR e cedimento — cosa significa davvero", [
      el("p", { className: "admin-metodo-lead", text: rir.principio }),
      el("h3", { text: "Fondamentali (esercizi con *)" }),
      el("ul", { className: "admin-metodo-list" }, (rir.fondamentali || []).map(function (x) {
        return el("li", { text: x });
      })),
      el("h3", { text: "Isolamento e accessori" }),
      el("ul", { className: "admin-metodo-list" }, (rir.isolamento || []).map(function (x) {
        return el("li", { text: x });
      })),
      table(
        ["Periodo", "Fondamentali *", "Isolamento"],
        (rir.tabellaCedimento || []).map(function (r) {
          return [r.periodo, r.fondamentali, r.isolamento];
        })
      )
    ]);
    root.appendChild(rirSec);

    /* 3. Periodizzazione intensità */
    root.appendChild(section("3. Periodizzazione — 13 settimane", [
      table(
        ["Settimane", "Intensità (RIR)", "Volume", "Nota"],
        g.periodizzazioneIntensita.map(function (p) {
          return [p.settimane, p.intensita, p.volume, p.nota];
        })
      )
    ]));

    /* 4. Volume settimanale */
    root.appendChild(section("4. Volume settimanale finale", [
      table(
        ["Gruppo muscolare", "Serie", "Note"],
        g.volumeSettimanaleFinale.map(function (v) {
          return [v.gruppo, String(v.serie), v.note || "—"];
        })
      )
    ]));

    /* 5. Volume per seduta */
    root.appendChild(section("5. Volume per seduta — mappa rapida", [
      el("p", { className: "admin-metodo-lead", text: "Ogni riga è una delle quattro sessioni. Utile per capire dove finisce il lavoro di ogni muscolo." }),
      table(
        ["Scheda", "Dettaglio volumi (serie efficaci)"],
        g.volumePerSeduta.map(function (v) {
          var parts = [];
          Object.keys(v).forEach(function (k) {
            if (k === "sessione") return;
            parts.push(k + " " + v[k]);
          });
          return [v.sessione, parts.join(" · ")];
        })
      )
    ]));

    /* 6. Progressione e checklist */
    var progSec = section("6. Progressione carico e checklist seduta", []);
    var progUl = el("ul", { className: "admin-metodo-list" });
    g.progressioneCarico.forEach(function (p) { progUl.appendChild(el("li", { text: p })); });
    progSec.appendChild(progUl);
    progSec.appendChild(el("h3", { text: "Checklist prima di uscire dalla palestra" }));
    var chk = el("ol", { className: "admin-metodo-list" });
    g.checklistSeduta.forEach(function (c) { chk.appendChild(el("li", { text: c })); });
    progSec.appendChild(chk);
    root.appendChild(progSec);

    /* Link schede */
    var nav = el("nav", { className: "admin-session-nav no-print" });
    ["a1", "b1", "a2", "b2"].forEach(function (k) {
      nav.appendChild(el("a", {
        href: "/admin/sessione/?ciclo=" + encodeURIComponent(blocco.id) + "&sessione=" + k,
        text: k.toUpperCase() + " — apri scheda"
      }));
    });
    root.appendChild(nav);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var root = document.getElementById("metodo-root");
    if (!root) return;
    fetch(BLOCCO_URL)
      .then(function (r) { return r.json(); })
      .then(function (data) { render(data, root); })
      .catch(function () {
        root.innerHTML = "<p>Errore caricamento guida.</p>";
      });
  });
})();
