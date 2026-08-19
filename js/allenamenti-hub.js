/**
 * Hub allenamenti — calendario sessioni + schede programma
 */
(function () {
  "use strict";

  var HUB_URL = "/data/allenamenti-hub.json";
  var SESSIONS_URL = "/data/performance-sessions.json";

  var MONTHS_IT = [
    "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
    "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
  ];
  var DAYS_SHORT = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
  var DAYS_LONG = [
    "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"
  ];

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function parseDate(iso) {
    var p = iso.split("-");
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }

  function toIso(d) {
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }

  function startOfWeek(d) {
    var copy = new Date(d);
    var day = copy.getDay();
    var diff = day === 0 ? -6 : 1 - day;
    copy.setDate(copy.getDate() + diff);
    copy.setHours(0, 0, 0, 0);
    return copy;
  }

  function addDays(d, n) {
    var copy = new Date(d);
    copy.setDate(copy.getDate() + n);
    return copy;
  }

  function formatDayLong(iso) {
    var d = parseDate(iso);
    return DAYS_LONG[(d.getDay() + 6) % 7] + " " + d.getDate() + " " +
      MONTHS_IT[d.getMonth()].toLowerCase() + " " + d.getFullYear();
  }

  function formatMonthYear(d) {
    return MONTHS_IT[d.getMonth()] + " " + d.getFullYear();
  }

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

  function schedaLabel(s) {
    if (s.scheda_label) return s.scheda_label;
    if (s.schede && s.schede.length) {
      return s.schede.map(function (n) { return "S" + n; }).join(" + ");
    }
    if (s.scheda) return "S" + s.scheda;
    return "—";
  }

  function sessionUrl(s) {
    return "/allenamenti/sessioni/" + s.id + "/";
  }

  function muscoliForSession(s, hub) {
    if (s.schede && s.schede.length) {
      var map = hub.muscoliPerScheda || {};
      var set = {};
      s.schede.forEach(function (n) {
        (map[String(n)] || []).forEach(function (m) { set[m] = true; });
      });
      return Object.keys(set);
    }
    if (s.scheda && hub.muscoliPerScheda) {
      return hub.muscoliPerScheda[String(s.scheda)] || [];
    }
    return [];
  }

  function enrichSessions(hub, perf) {
    return (perf.sessions || [])
      .filter(function (s) { return s.date; })
      .map(function (s) {
        return {
          id: s.id,
          date: s.date,
          time: s.time || "",
          datetime: s.datetime || s.date,
          durata: s.durata || (s.partial ? "dati parziali" : "—"),
          calorie: s.calorie,
          gruppi: s.gruppi,
          schedaLabel: schedaLabel(s),
          muscoli: muscoliForSession(s, hub),
          url: sessionUrl(s),
          partial: !!s.partial
        };
      });
  }

  function groupByDate(sessions) {
    var map = {};
    sessions.forEach(function (s) {
      if (!map[s.date]) map[s.date] = [];
      map[s.date].push(s);
    });
    return map;
  }

  function figureNode(figId, label, className) {
    var wrap = el("div", { className: className || "scheda-tile__fig" });
    if (window.fqSprite && window.fqSprite.figure) {
      wrap.appendChild(window.fqSprite.figure(figId, label));
    }
    return wrap;
  }

  function renderQuickActions(root, hub, sessionCount) {
    var ciclo = hub.cicloCorrente;
    var card = el("article", { className: "allen-hub-unified" });
    var body = el("div", { className: "allen-hub-unified__body" });
    body.appendChild(el("span", { className: "allen-hub-unified__badge", text: ciclo.badge }));
    body.appendChild(el("h2", { text: "Tutto in questa pagina" }));
    body.appendChild(el("p", {
      className: "allen-hub-unified__lead",
      text: "Calendario, grafici performance, programma trimestre e link alle sedute con export Zepp — un solo hub, niente doppioni."
    }));

    var links = el("div", { className: "allen-hub-unified__links" });
    links.appendChild(el("a", { className: "btn btn-ghost", href: "#calendario", text: "Calendario ↓" }));
    links.appendChild(el("a", { className: "btn btn-ghost", href: "#programma", text: "Programma trimestre" }));
    var sess = el("a", {
      className: "btn btn-primary",
      href: "/allenamenti/sessioni/",
      text: "Sedute svolte (" + (sessionCount || "—") + ")"
    });
    links.appendChild(sess);
    body.appendChild(links);
    card.appendChild(body);

    root.appendChild(card);
  }

  function renderSchedaTile(s) {
    var a = el("a", {
      className: "scheda-tile",
      href: s.anchor || "#"
    });
    a.appendChild(figureNode(s.figura, s.titolo));
    var body = el("div", { className: "scheda-tile__body" });
    body.appendChild(el("span", { className: "scheda-tile__code", text: s.codice }));
    body.appendChild(el("strong", { className: "scheda-tile__title", text: s.titolo }));
    body.appendChild(el("span", {
      className: "scheda-tile__muscles",
      text: (s.muscoli || []).join(" · ")
    }));
    a.appendChild(body);
    return a;
  }

  function getWeekPlanRow(dayIso, hub) {
    var cicloId = hub.cicloCorrente.id;
    var prossimo = hub.cicloProssimo;
    var useAnnuale = prossimo && prossimo.inizio && dayIso >= prossimo.inizio;
    var key = useAnnuale ? prossimo.id : cicloId;
    var rows = hub.settimanaTipo[key] || [];
    var weekday = DAYS_LONG[(parseDate(dayIso).getDay() + 6) % 7];
    return rows.find(function (r) { return r.giorno === weekday; });
  }

  function schedaAnchor(hub, schedaNum) {
    var cicloId = hub.cicloCorrente.id;
    var giornaliere = (hub.schedeGiornaliere && hub.schedeGiornaliere[cicloId]) || [];
    var scheda = giornaliere.find(function (g) { return g.numero === schedaNum; });
    if (scheda && scheda.anchor) return scheda.anchor;
    return hub.cicloCorrente.url + "#scheda-" + schedaNum;
  }

  function renderWeekRow(day, hub) {
    var row = getWeekPlanRow(day, hub);
    if (!row) return null;
    if (row.tipo === "riposo") {
      return el("span", { className: "week-plan__rest", text: "Riposo" });
    }
    if (row.codice) {
      return el("span", { className: "week-plan__code", text: row.codice });
    }
    return null;
  }

  function renderMonthPlan(iso, hub, hasSession) {
    var row = getWeekPlanRow(iso, hub);
    if (!row) return null;
    if (row.tipo === "riposo") {
      return el("span", { className: "cal-month__rest", text: "Riposo" });
    }
    var href = row.scheda ? schedaAnchor(hub, row.scheda) : hub.cicloCorrente.url;
    var link = el("a", {
      className: "cal-month__plan" + (hasSession ? " cal-month__plan--logged" : ""),
      href: href,
      title: row.focus || row.codice
    });
    link.appendChild(el("span", { className: "cal-month__plan-code", text: row.codice }));
    if (row.focus) {
      link.appendChild(el("span", { className: "cal-month__plan-focus", text: row.focus }));
    }
    return link;
  }

  function renderTodayHint(hub, sessionsByDate, today) {
    var todayIso = toIso(today);
    var todaySessions = sessionsByDate[todayIso] || [];
    if (todaySessions.length) return null;
    var row = getWeekPlanRow(todayIso, hub);
    if (!row || row.tipo === "riposo") return null;
    var href = row.scheda ? schedaAnchor(hub, row.scheda) : hub.cicloCorrente.url;
    var hint = el("p", { className: "cal-today-hint" });
    hint.appendChild(document.createTextNode("Oggi · programma "));
    var strong = el("a", { href: href, html: "<strong>" + row.codice + "</strong>" });
    hint.appendChild(strong);
    hint.appendChild(document.createTextNode(" — " + row.focus + ". "));
    hint.appendChild(el("a", {
      href: "/allenamenti/sessioni/",
      text: "Seduta non ancora pubblicata"
    }));
    hint.appendChild(document.createTextNode(" — invia export Zepp per aggiornare sessioni e grafico FC."));
    return hint;
  }

  function periodStatus(inizio, fine) {
    if (!inizio || !fine) return "futuro";
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var a = parseDate(inizio);
    var b = parseDate(fine);
    if (today < a) return "futuro";
    if (today > b) return "passato";
    return "in-corso";
  }

  function statusLabel(st) {
    if (st === "in-corso") return "In corso";
    if (st === "passato") return "Passato";
    return "Futuro";
  }

  function renderMesoCard(m) {
    var st = periodStatus(m.inizio, m.fine);
    var a = el("a", {
      className: "meso-card card meso-card--" + st + (st === "in-corso" ? " is-current" : ""),
      href: m.url
    });
    var top = el("p", { className: "meso-card__meta" });
    var badge = m.num ? "Mesociclo " + m.num + " · " + (m.quadrimestre || "") : (m.quadrimestre || "");
    top.appendChild(el("span", { className: "meso-card__quad", text: badge }));
    top.appendChild(el("span", { className: "meso-card__status", text: statusLabel(st) }));
    a.appendChild(top);
    a.appendChild(el("strong", { className: "meso-card__title", text: m.label }));
    a.appendChild(el("span", { className: "meso-card__periodo", text: m.periodo }));
    a.appendChild(el("span", { className: "meso-card__desc", text: m.descrizione }));
    a.appendChild(el("span", { className: "meso-card__cta", text: "Apri schede →" }));
    return a;
  }

  function renderProgramma(root, hub) {
    var sec = el("section", { className: "allen-hub-programma" });
    sec.appendChild(el("h2", { text: "Programma" }));

    var ciclo = hub.cicloCorrente;
    sec.appendChild(el("p", {
      className: "allen-hub-programma__lead",
      html: "Periodo che stai osservando: <a href=\"" + ciclo.url + "\"><strong>" + ciclo.label + "</strong></a> — " + ciclo.descrizione +
        " · <a href=\"/admin/\">Tutte le schede →</a>"
    }));

    if (hub.annoLavoro) {
      sec.appendChild(el("h3", {
        className: "allen-hub-programma__h3",
        text: hub.annoLavoro.label
      }));
      sec.appendChild(el("p", {
        className: "allen-hub-programma__note",
        html: hub.annoLavoro.periodo + " · 4 mesocicli (~13 settimane). Clicca passato, presente o futuro. " +
          "<a href=\"" + hub.annoLavoro.url + "\">Hub schede anno →</a>"
      }));
    }

    var meso = hub.mesocicli || [];
    if (meso.length) {
      var grid = el("div", { className: "meso-grid" });
      meso.forEach(function (m) { grid.appendChild(renderMesoCard(m)); });
      sec.appendChild(grid);
    }

    sec.appendChild(el("h3", { className: "allen-hub-programma__h3", text: "Settimana tipo" }));
    sec.appendChild(el("p", {
      className: "allen-hub-programma__note",
      text: "Schema settimanale del ciclo in corso — distinto dalle singole schede giornaliere sotto."
    }));

    var weekKey = ciclo.id;
    var weekRows = hub.settimanaTipo[weekKey] || [];
    var weekGrid = el("div", { className: "week-plan" });
    weekRows.forEach(function (row) {
      var cell = el("div", {
        className: "week-plan__day" + (row.tipo === "riposo" ? " is-rest" : "")
      });
      cell.appendChild(el("span", { className: "week-plan__label", text: row.giorno }));
      if (row.tipo === "riposo") {
        cell.appendChild(el("span", { className: "week-plan__rest", text: "Riposo" }));
      } else {
        cell.appendChild(el("span", { className: "week-plan__code", text: row.codice }));
        cell.appendChild(el("span", { className: "week-plan__focus", text: row.focus }));
      }
      weekGrid.appendChild(cell);
    });
    sec.appendChild(weekGrid);

    sec.appendChild(el("h3", {
      className: "allen-hub-programma__h3",
      text: "Schede giornaliere · " + ciclo.badge
    }));
    sec.appendChild(el("p", {
      className: "allen-hub-programma__note",
      text: "Ogni scheda è un giorno di allenamento del trimestre. Clicca per aprire esercizi, serie e note."
    }));

    var giornaliere = (hub.schedeGiornaliere && hub.schedeGiornaliere[ciclo.id]) || [];
    var tiles = el("div", { className: "scheda-tiles" });
    giornaliere.forEach(function (s) { tiles.appendChild(renderSchedaTile(s)); });
    sec.appendChild(tiles);

    if (hub.schedeAnnuali && hub.cicloProssimo) {
      sec.appendChild(el("h3", {
        className: "allen-hub-programma__h3",
        text: "Schede ciclo annuale · A1–B2"
      }));
      sec.appendChild(el("p", {
        className: "allen-hub-programma__note",
        text: "Dal settembre 2026 — stesso split tutto l'anno. Clicca A1–B2 per la scheda della fase in corso."
      }));
      var annual = hub.schedeAnnuali[hub.cicloProssimo.id] || [];
      var annualTiles = el("div", { className: "scheda-tiles scheda-tiles--annual" });
      annual.forEach(function (s) {
        var href = "/admin/sessione/?ciclo=" + encodeURIComponent(s.fase || "ipertrofia-accumulo") +
          "&sessione=" + encodeURIComponent(s.sessione || "a1");
        var tile = el("a", { className: "scheda-tile", href: href });
        tile.appendChild(figureNode(s.figura, s.titolo));
        var body = el("div", { className: "scheda-tile__body" });
        body.appendChild(el("span", { className: "scheda-tile__code", text: s.codice }));
        body.appendChild(el("strong", { className: "scheda-tile__title", text: s.titolo }));
        body.appendChild(el("span", {
          className: "scheda-tile__muscles",
          text: (s.muscoli || []).join(" · ")
        }));
        tile.appendChild(body);
        annualTiles.appendChild(tile);
      });
      sec.appendChild(annualTiles);
    }

    root.appendChild(sec);
  }

  function renderSessionChip(s) {
    var a = el("a", {
      className: "cal-session" + (s.partial ? " is-partial" : ""),
      href: s.url
    });
    var head = el("div", { className: "cal-session__head" });
    head.appendChild(el("span", { className: "cal-session__badge", text: s.schedaLabel }));
    if (s.time) head.appendChild(el("time", { text: s.time }));
    a.appendChild(head);
    a.appendChild(el("span", {
      className: "cal-session__dur",
      text: s.durata + (s.calorie ? " · " + s.calorie + " kcal" : "")
    }));
    if (s.muscoli.length) {
      a.appendChild(el("span", {
        className: "cal-session__muscles",
        text: s.muscoli.join(" · ")
      }));
    }
    if (s.gruppi) {
      a.appendChild(el("span", {
        className: "cal-session__groups",
        text: s.gruppi + " gruppi"
      }));
    }
    return a;
  }

  function Calendar(root, hub, sessionsByDate) {
    var min = parseDate(hub.calendario.inizio);
    var max = parseDate(hub.calendario.fine);
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var state = {
      view: "month",
      cursor: new Date(today)
    };

    if (state.cursor < min) state.cursor = new Date(min);
    if (state.cursor > max) state.cursor = new Date(max);

    var toolbar = el("div", { className: "cal-toolbar" });
    var prevBtn = el("button", {
      type: "button",
      className: "cal-nav",
      "aria-label": "Periodo precedente",
      text: "‹"
    });
    var nextBtn = el("button", {
      type: "button",
      className: "cal-nav",
      "aria-label": "Periodo successivo",
      text: "›"
    });
    var title = el("h2", { className: "cal-toolbar__title", id: "cal-title" });
    var todayBtn = el("button", {
      type: "button",
      className: "btn btn-ghost cal-today",
      text: "Oggi"
    });
    var toggle = el("div", { className: "cal-toggle", role: "group", "aria-label": "Vista calendario" });
    var weekBtn = el("button", {
      type: "button",
      className: "cal-toggle__btn",
      text: "Settimana"
    });
    var monthBtn = el("button", {
      type: "button",
      className: "cal-toggle__btn is-active",
      text: "Mese"
    });
    toggle.appendChild(weekBtn);
    toggle.appendChild(monthBtn);

    toolbar.appendChild(prevBtn);
    toolbar.appendChild(title);
    toolbar.appendChild(nextBtn);
    toolbar.appendChild(todayBtn);
    toolbar.appendChild(toggle);

    var body = el("div", { className: "cal-body", "aria-live": "polite" });

    function setView(v) {
      state.view = v;
      weekBtn.classList.toggle("is-active", v === "week");
      monthBtn.classList.toggle("is-active", v === "month");
      render();
    }

    function shift(dir) {
      if (state.view === "month") {
        state.cursor.setMonth(state.cursor.getMonth() + dir);
      } else {
        state.cursor = addDays(state.cursor, dir * 7);
      }
      clampCursor();
      render();
    }

    function clampCursor() {
      if (state.cursor < min) state.cursor = new Date(min);
      if (state.cursor > max) state.cursor = new Date(max);
    }

    function renderMonth() {
      body.innerHTML = "";
      title.textContent = formatMonthYear(state.cursor);

      var y = state.cursor.getFullYear();
      var m = state.cursor.getMonth();
      var first = new Date(y, m, 1);
      var start = startOfWeek(first);
      var grid = el("div", { className: "cal-month" });

      DAYS_SHORT.forEach(function (d) {
        grid.appendChild(el("div", { className: "cal-month__dow", text: d }));
      });

      var day = new Date(start);
      for (var i = 0; i < 42; i++) {
        var iso = toIso(day);
        var inMonth = day.getMonth() === m;
        var cell = el("div", {
          className: "cal-month__cell" +
            (inMonth ? "" : " is-outside") +
            (iso === toIso(today) ? " is-today" : "") +
            (sessionsByDate[iso] ? " has-session" : "")
        });
        cell.appendChild(el("span", { className: "cal-month__num", text: String(day.getDate()) }));
        var daySessions = sessionsByDate[iso] || [];
        var list = el("div", { className: "cal-month__sessions" });
        daySessions.forEach(function (s) {
          list.appendChild(renderSessionChip(s));
        });
        cell.appendChild(list);
        grid.appendChild(cell);
        day = addDays(day, 1);
      }
      body.appendChild(grid);
    }

    function renderWeek() {
      body.innerHTML = "";
      var weekStart = startOfWeek(state.cursor);
      var weekEnd = addDays(weekStart, 6);
      title.textContent = weekStart.getDate() + "–" + weekEnd.getDate() + " " +
        MONTHS_IT[weekEnd.getMonth()] + " " + weekEnd.getFullYear();

      var agenda = el("div", { className: "cal-week" });
      for (var i = 0; i < 7; i++) {
        var day = addDays(weekStart, i);
        var iso = toIso(day);
        var col = el("div", {
          className: "cal-week__day" + (iso === toIso(today) ? " is-today" : "")
        });
        col.appendChild(el("span", { className: "cal-week__dow", text: DAYS_SHORT[i] }));
        col.appendChild(el("span", {
          className: "cal-week__date",
          text: day.getDate() + " " + MONTHS_IT[day.getMonth()].slice(0, 3)
        }));
        var sessWrap = el("div", { className: "cal-week__sessions" });
        var daySessions = sessionsByDate[iso] || [];
        if (daySessions.length) {
          daySessions.forEach(function (s) { sessWrap.appendChild(renderSessionChip(s)); });
        } else {
          sessWrap.appendChild(el("p", { className: "cal-week__empty", text: "—" }));
        }
        col.appendChild(sessWrap);
        agenda.appendChild(col);
      }
      body.appendChild(agenda);
    }

    function render() {
      if (state.view === "month") renderMonth();
      else renderWeek();
    }

    prevBtn.addEventListener("click", function () { shift(-1); });
    nextBtn.addEventListener("click", function () { shift(1); });
    todayBtn.addEventListener("click", function () {
      state.cursor = new Date(today);
      clampCursor();
      render();
    });
    weekBtn.addEventListener("click", function () { setView("week"); });
    monthBtn.addEventListener("click", function () { setView("month"); });

    root.appendChild(toolbar);
    root.appendChild(body);
    render();
  }

  function init() {
    var calRoot = document.getElementById("allenamenti-calendario");
    var progRoot = document.getElementById("allenamenti-programma");
    var actionsRoot = document.getElementById("allenamenti-azioni");
    if (!calRoot) return;

    var spriteReady = window.fqSprite ? window.fqSprite.inject() : Promise.resolve();

    Promise.all([
      spriteReady,
      fetch(HUB_URL).then(function (r) { return r.json(); }),
      fetch(SESSIONS_URL).then(function (r) { return r.json(); })
    ])
      .then(function (res) {
        var hub = res[1];
        var perf = res[2];
        var sessions = enrichSessions(hub, perf);
        var byDate = groupByDate(sessions);

        if (actionsRoot) renderQuickActions(actionsRoot, hub, sessions.length);
        Calendar(calRoot, hub, byDate);
        if (progRoot) renderProgramma(progRoot, hub);

        var countEl = document.getElementById("allenamenti-session-count");
        if (countEl) countEl.textContent = String(sessions.length);
      })
      .catch(function (err) {
        calRoot.innerHTML = "<p class=\"admin-error\">Calendario non disponibile: " + err.message + "</p>";
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
