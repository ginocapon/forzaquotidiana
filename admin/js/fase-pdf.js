/**
 * PDF una fase (A1–B2) — stesso layout palestra della Fase 1
 */
(function () {
  "use strict";

  var HUB_URL = "/admin/data/hub-periodizzazione.json";
  var BLOCCO1_URL = "/admin/data/blocco-1-fase1.json";

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
    return new Date(iso + "T12:00:00").toLocaleDateString("it-IT", {
      day: "numeric", month: "short", year: "numeric"
    });
  }

  function sessionTitle(key, day) {
    var code = ((day && day.codice) || key.toUpperCase()).replace(/^\s+|\s+$/g, "");
    var nome = ((day && day.nome) || "").replace(/^\s+|\s+$/g, "");
    if (!nome) return code;
    var safe = code.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (new RegExp("^" + safe + "\\s*[·•\\-–:]\\s*", "i").test(nome)) return nome;
    if (nome.toUpperCase().indexOf(code.toUpperCase()) === 0) return nome;
    return code + " · " + nome;
  }

  function compactReps(raw) {
    if (raw == null || raw === "") return "";
    var s = String(raw).replace(/\s+/g, " ").trim();
    var first = s.match(/^(\d+(?:\s*[–\-]\s*\d+)?)/);
    if (first) return first[1].replace(/\s/g, "");
    return s.replace(/\s*\([^)]*\)/g, "").split(/\s*·\s*/)[0].trim();
  }

  function hasWaveReps(sessioni) {
    var found = false;
    ["a1", "b1", "a2", "b2"].forEach(function (key) {
      var day = sessioni && sessioni[key];
      if (!day || !day.esercizi) return;
      day.esercizi.forEach(function (ex) {
        if (/→/.test(String(ex.ripetizioni || ""))) found = true;
      });
    });
    return found;
  }

  function normName(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/[àá]/g, "a")
      .replace(/[èé]/g, "e")
      .replace(/[ìí]/g, "i")
      .replace(/[òó]/g, "o")
      .replace(/[ùú]/g, "u")
      .replace(/stacco rumeno/g, "rumeno")
      .replace(/stacco omega/g, "trap")
      .replace(/clean halo/g, "halo")
      .replace(/panca scott/g, "scott")
      .replace(/\b(con|su|a|al|alla|di|del|della|un|una|presa|larga|macchina|kettlebell|doktor|dottor|primo)\b/g, " ")
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function tokens(s) {
    return normName(s).split(" ").filter(function (w) { return w.length > 2; });
  }

  function scoreMatch(a, b) {
    var ta = tokens(a.nome);
    var tb = tokens(b.nome);
    if (!ta.length || !tb.length) return 0;
    var hit = 0;
    ta.forEach(function (t) {
      if (tb.indexOf(t) !== -1) hit += 1;
    });
    return hit / Math.max(ta.length, tb.length);
  }

  function findMatch(templateEx, liveList, used) {
    var bestI = -1;
    var bestS = 0.4;
    liveList.forEach(function (ex, i) {
      if (used[i]) return;
      var s = scoreMatch(templateEx, ex);
      if (s > bestS) {
        bestS = s;
        bestI = i;
      }
    });
    return bestI;
  }

  function mergeSessions(blocco, fase) {
    var out = {};
    ["a1", "b1", "a2", "b2"].forEach(function (key) {
      var tpl = blocco.sessioni[key];
      var live = fase.sessioni && fase.sessioni[key];
      if (!tpl) {
        out[key] = live;
        return;
      }
      var used = {};
      out[key] = {
        codice: tpl.codice,
        nome: tpl.nome,
        esercizi: tpl.esercizi.map(function (ex) {
          var row = {
            nome: ex.nome,
            serie: ex.serie,
            ripetizioni: ex.ripetizioni,
            tempo: ex.tempo,
            recupero: ex.recupero,
            progressionePrincipale: ex.progressionePrincipale === true
          };
          if (!live || !live.esercizi) return row;
          var i = findMatch(ex, live.esercizi, used);
          if (i < 0) return row;
          used[i] = true;
          var src = live.esercizi[i];
          if (src.serie != null) row.serie = src.serie;
          if (src.ripetizioni) row.ripetizioni = compactReps(src.ripetizioni);
          if (src.progressione === true) row.progressionePrincipale = true;
          return row;
        })
      };
    });
    return out;
  }

  function render(macro, fase, root, blocco) {
    root.innerHTML = "";
    document.title = "PDF · " + fase.nome + " | Scheda";
    var titleEl = document.getElementById("fase-pdf-title");
    if (titleEl) titleEl.textContent = "PDF riassunto A1–B2 · " + fase.nome;
    var dl = document.getElementById("fase-pdf-download");
    if (dl) {
      var files = {
        "ipertrofia-accumulo": {
          href: "/admin/prototipi/periodizzazione/fase/scheda-fase-1-ipertrofia-accumulo.pdf",
          name: "Scheda-Fase1-Ipertrofia-accumulo.pdf"
        }
      };
      var file = files[fase.id];
      if (file) {
        dl.href = file.href;
        dl.setAttribute("download", file.name);
        dl.hidden = false;
      } else {
        dl.hidden = true;
      }
    }

    var article = el("article", { className: "scheda-a4 scheda-a4--admin" });
    var tipo = (fase.id === "ipertrofia-accumulo" && blocco && blocco.tipo)
      ? blocco.tipo
      : String(fase.nome || "Periodizzazione").replace(/^Fase\s*\d+\s*[·•]\s*/i, "").toUpperCase();
    var sessioni = (fase.id === "ipertrofia-accumulo" && blocco && blocco.sessioni)
      ? blocco.sessioni
      : (blocco && blocco.sessioni ? mergeSessions(blocco, fase) : fase.sessioni);
    var waveNote = hasWaveReps(fase.sessioni);

    var head = el("header", { className: "scheda-a4__head" });
    head.innerHTML =
      "<div class=\"scheda-a4__head-main\"><strong>Scheda allenamento</strong> · " + tipo + "</div>" +
      "<div class=\"scheda-a4__head-period\"><span class=\"scheda-a4__badge\">" + fase.settimane + " sett.</span> <strong>" + fase.nome + "</strong></div>" +
      "<div class=\"scheda-a4__head-meta\">" +
      "<span><strong>Atleta:</strong> _______________</span>" +
      "<span><strong>Periodo:</strong> " + formatDate(fase.inizio) + " – " + formatDate(fase.fine) + "</span>" +
      "<span><strong>RIR:</strong> " + (fase.rir || "1") + "</span>" +
      "<span><strong>Settimana:</strong> Lun A1 · Mar B1 · Gio A2 · Sab B2</span>" +
      "</div>";
    article.appendChild(head);

    var oss = el("div", { className: "scheda-a4__osservazioni scheda-a4__intro-fase" });
    oss.innerHTML =
      "<div class=\"scheda-a4__osservazioni-label\">Osservazioni / note</div>" +
      (waveNote
        ? "<p class=\"scheda-a4__intro-text\">Sui movimenti *: sett. 1–6 range in tabella, sett. 7–12 range più basso, sett. 13 deload (−40% volume).</p>"
        : "<p class=\"scheda-a4__intro-text\">________________________________________________________________</p>");
    article.appendChild(oss);

    var grid = el("div", { className: "scheda-a4__grid" });
    ["a1", "b1", "a2", "b2"].forEach(function (key) {
      var day = sessioni[key];
      if (!day) return;
      var quad = el("section", { className: "scheda-a4__quad" });
      quad.appendChild(el("h2", { text: sessionTitle(key, day) }));
      var table = el("table");
      table.innerHTML = "<thead><tr><th>Esercizio</th><th>S×R</th><th>TUT</th><th>Rec</th><th>kg</th><th>Reps</th><th>Note</th></tr></thead>";
      var tbody = el("tbody");
      day.esercizi.forEach(function (ex) {
        var tr = el("tr");
        var nome = ex.nome + (ex.progressionePrincipale === true || ex.progressione === true ? " *" : "");
        tr.innerHTML =
          "<td>" + nome + "</td>" +
          "<td>" + ex.serie + "×" + compactReps(ex.ripetizioni) + "</td>" +
          "<td>" + (ex.tempo || ex.tut || "—") + "</td>" +
          "<td>" + (ex.recupero || "—") + "</td>" +
          "<td></td><td></td><td></td>";
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      quad.appendChild(table);
      grid.appendChild(quad);
    });
    article.appendChild(grid);

    article.appendChild(el("footer", {
      className: "scheda-a4__foot",
      text: fase.nome + " · * = progressione · kg da compilare dopo massimali · uso palestra"
    }));

    root.appendChild(article);
  }

  function init() {
    var root = document.getElementById("fase-pdf-root");
    if (!root) return;
    var params = new URLSearchParams(window.location.search);
    var annoId = params.get("anno") || "2026-2027";
    var faseId = params.get("fase");
    if (!faseId) {
      root.innerHTML = "<p>Parametro <code>fase</code> mancante. <a href=\"/admin/prototipi/periodizzazione/\">Torna all’hub</a></p>";
      return;
    }

    Promise.all([
      fetch(HUB_URL).then(function (r) { return r.json(); }),
      fetch(BLOCCO1_URL).then(function (r) { return r.json(); })
    ])
      .then(function (pair) {
        var hub = pair[0];
        var blocco = pair[1];
        var anno = hub.anni.find(function (a) { return a.id === annoId; }) || hub.anni[0];
        return fetch(anno.macrocicloUrl).then(function (r) { return r.json(); }).then(function (macro) {
          return { macro: macro, blocco: blocco };
        });
      })
      .then(function (pack) {
        var fase = pack.macro.fasi.find(function (f) { return f.id === faseId; });
        if (!fase) {
          root.innerHTML = "<p>Fase non trovata. <a href=\"/admin/prototipi/periodizzazione/\">Hub</a></p>";
          return;
        }
        render(pack.macro, fase, root, pack.blocco);
      })
      .catch(function (err) {
        root.innerHTML = "<p>Errore: " + err.message + "</p>";
      });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
