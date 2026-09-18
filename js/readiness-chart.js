/**
 * Grafici performance — readiness + cuore in allenamento
 * Finestre da 15 giorni di calendario, frecce per scorrere nel tempo.
 */
(function () {
  "use strict";

  var SESSIONS_URL = "/data/performance-sessions.json";
  var MOUNT_ID = "allenamenti-readiness-chart";
  var WINDOW_DAYS = 15;
  var DAYS_SHORT = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
  var MONTHS_IT = ["", "gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"];

  var state = {
    wellnessAll: [],
    windowStart: null,
    rangeMin: null,
    rangeMax: null
  };

  function parseDurationToMin(str) {
    if (!str) return null;
    var m = String(str).match(/^(\d+):(\d+)$/);
    if (!m) return null;
    return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
  }

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  }

  function parseDate(iso) {
    var p = iso.split("-");
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }

  function toIso(d) {
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }

  function addDays(d, n) {
    var copy = new Date(d);
    copy.setDate(copy.getDate() + n);
    return copy;
  }

  function weekdayShort(iso) {
    return DAYS_SHORT[parseDate(iso).getDay()];
  }

  function schedaSigla(session) {
    if (session.codice) return session.codice;
    if (session.scheda_label) return session.scheda_label;
    if (session.schede && session.schede.length) {
      return session.schede.map(function (n) { return "S" + n; }).join("+");
    }
    if (session.scheda) return "S" + session.scheda;
    return "—";
  }

  function formatLabel(iso) {
    var p = iso.split("-");
    return pad(+p[2]) + "/" + pad(+p[1]);
  }

  function formatRange(iso) {
    var p = iso.split("-");
    return +p[2] + " " + MONTHS_IT[+p[1]] + " " + p[0];
  }

  function dayOffset(windowStartIso, dateIso) {
    var a = parseDate(windowStartIso);
    var b = parseDate(dateIso);
    return Math.round((b - a) / 86400000);
  }

  function windowEndIso(startIso) {
    return toIso(addDays(parseDate(startIso), WINDOW_DAYS - 1));
  }

  function inWindow(dateIso, startIso) {
    var off = dayOffset(startIso, dateIso);
    return off >= 0 && off < WINDOW_DAYS;
  }

  function filterWindow(points, startIso) {
    return points.filter(function (p) {
      return inWindow(p.date, startIso);
    }).sort(function (a, b) {
      return a.date.localeCompare(b.date);
    });
  }

  function extractWellnessPoint(session, maxCarico) {
    var r = session.readiness || {};
    var hc = session.hybridcharge || {};
    var tsb = session.tsb || {};
    var carico = session.carico_adjusted || session.carico;
    var effort = r.effort_day != null ? r.effort_day : hc.effort_pct;
    if (effort == null && carico != null && maxCarico) {
      effort = Math.round((carico / maxCarico) * 100);
    }
    var sleepMin = parseDurationToMin(r.sleep_duration);
    return {
      date: session.date,
      id: session.id,
      scheda: schedaSigla(session),
      weekday: weekdayShort(session.date),
      sleep_score: r.sleep_score != null ? r.sleep_score : (hc.sleep_score != null ? hc.sleep_score : null),
      sleep_min: sleepMin,
      sleep_h: sleepMin != null ? sleepMin / 60 : null,
      hybridcharge: r.hybridcharge_wake != null ? r.hybridcharge_wake : (hc.pre != null ? hc.pre : hc.wake),
      hrv: r.hrv != null ? r.hrv : null,
      hrv_label: r.hrv_label || null,
      tsb: tsb.value != null ? tsb.value : null,
      tsb_label: tsb.label || null,
      effort: effort != null ? effort : null,
      fc_max: session.fc_max != null ? session.fc_max : null,
      fc_min: session.fc_min != null ? session.fc_min : null,
      fc_media: session.fc_media != null ? session.fc_media : null
    };
  }

  function makeXScale(windowStart, padL, innerW) {
    return function (dateIso) {
      var off = dayOffset(windowStart, dateIso);
      if (WINDOW_DAYS === 1) return padL + innerW / 2;
      return padL + (off / (WINDOW_DAYS - 1)) * innerW;
    };
  }

  function buildPath(points, key, xForDate, yScale) {
    var segments = [];
    var current = [];

    points.forEach(function (p) {
      var val = p[key];
      if (val == null) {
        if (current.length) {
          segments.push(current);
          current = [];
        }
        return;
      }
      current.push({ x: xForDate(p.date), y: yScale(val), val: val, p: p });
    });
    if (current.length) segments.push(current);

    return segments.map(function (seg) {
      return seg.map(function (pt, j) {
        return (j === 0 ? "M" : "L") + pt.x.toFixed(1) + " " + pt.y.toFixed(1);
      }).join(" ");
    }).join(" ");
  }

  function pointLabels(points, xForDate, H) {
    var labels = "";
    points.forEach(function (p) {
      var cx = xForDate(p.date);
      labels += '<text class="readiness-point-label" x="' + cx + '" y="' + (H - 26) + '" text-anchor="middle">';
      labels += '<tspan x="' + cx + '" dy="0">' + esc(p.weekday) + "</tspan>";
      labels += '<tspan x="' + cx + '" dy="11" class="readiness-point-label__scheda">' + esc(p.scheda) + "</tspan>";
      labels += "</text>";
    });
    return labels;
  }

  function renderPager() {
    if (!state.windowStart) return "";
    var start = state.windowStart;
    var end = windowEndIso(start);
    var prevDisabled = parseDate(start) <= parseDate(state.rangeMin);
    var nextDisabled = parseDate(end) >= parseDate(state.rangeMax);

    return (
      '<div class="readiness-chart__pager" role="group" aria-label="Scorri periodo grafico">' +
      '<button type="button" class="readiness-chart__nav" data-readiness-nav="prev"' + (prevDisabled ? " disabled" : "") + ' aria-label="15 giorni precedenti">‹</button>' +
      '<span class="readiness-chart__range">' + esc(formatRange(start) + " – " + formatRange(end)) + " · finestra " + WINDOW_DAYS + " giorni</span>" +
      '<button type="button" class="readiness-chart__nav" data-readiness-nav="next"' + (nextDisabled ? " disabled" : "") + ' aria-label="15 giorni successivi">›</button>' +
      "</div>"
    );
  }

  function renderReadinessChart(points, windowStart) {
    var hasSleep = points.some(function (p) { return p.sleep_score != null; });
    var hasEff = points.some(function (p) { return p.hybridcharge != null; });
    var hasEffort = points.some(function (p) { return p.effort != null; });

    if (!hasSleep && !hasEff && !hasEffort) {
      return '<p class="readiness-chart__empty-window"><small>Nessun dato readiness in questa finestra di 15 giorni.</small></p>';
    }

    var W = 640;
    var H = 236;
    var padL = 36;
    var padR = 12;
    var padT = 16;
    var padB = 40;
    var innerW = W - padL - padR;
    var innerH = H - padT - padB;
    var xForDate = makeXScale(windowStart, padL, innerW);

    function yScale(v) {
      return padT + innerH - (v / 100) * innerH;
    }

    var series = [];
    if (hasSleep) {
      series.push({ key: "sleep_score", label: "Punteggio sonno Zepp", className: "readiness-line--sleep", dotClass: "readiness-dot--sleep" });
    }
    if (hasEff) {
      series.push({ key: "hybridcharge", label: "HybridCharge risveglio", className: "readiness-line--efficiency", dotClass: "readiness-dot--efficiency" });
    }
    if (hasEffort) {
      series.push({ key: "effort", label: "Sforzo", className: "readiness-line--effort", dotClass: "readiness-dot--effort" });
    }

    var svg = '<svg class="readiness-chart__svg" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Andamento sonno, efficienza e sforzo">';
    svg += '<line class="readiness-grid" x1="' + padL + '" y1="' + (padT + innerH) + '" x2="' + (padL + innerW) + '" y2="' + (padT + innerH) + '"/>';
    [25, 50, 75].forEach(function (tick) {
      var y = yScale(tick);
      svg += '<text class="readiness-axis-y" x="' + (padL - 6) + '" y="' + y + '" text-anchor="end" dominant-baseline="middle">' + tick + "</text>";
    });

    series.forEach(function (s) {
      var d = buildPath(points, s.key, xForDate, yScale);
      if (d) svg += '<path class="readiness-line ' + s.className + '" fill="none" d="' + d + '"/>';
    });

    points.forEach(function (p) {
      var cx = xForDate(p.date);
      series.forEach(function (s) {
        var val = p[s.key];
        if (val == null) return;
        svg += '<circle class="readiness-dot ' + s.dotClass + '" cx="' + cx + '" cy="' + yScale(val) + '" r="4">';
        svg += "<title>" + p.weekday + " " + p.scheda + " · " + formatLabel(p.date) + " · " + s.label + ": " + val + "</title></circle>";
      });
    });
    svg += pointLabels(points, xForDate, H);
    svg += "</svg>";

    var legend = '<p class="readiness-chart__legend">';
    series.forEach(function (s, i) {
      if (i) legend += " ";
      legend += '<span class="readiness-legend ' + s.className + '">● ' + s.label + "</span>";
    });
    legend += "</p>";

    return (
      '<div class="readiness-chart__block">' +
      '<h3 class="readiness-chart__subtitle">Readiness · sonno e sforzo</h3>' +
      svg + legend +
      "</div>"
    );
  }

  function renderScalarChart(points, windowStart, opts) {
    var hasData = points.some(function (p) { return p[opts.key] != null; });
    if (!hasData) {
      return '<p class="readiness-chart__empty-window"><small>Nessun dato ' + esc(opts.title) + " in questa finestra.</small></p>";
    }

    var values = points.map(function (p) { return p[opts.key]; }).filter(function (v) { return v != null; });
    var yMin = opts.yMin != null ? opts.yMin : Math.floor(Math.min.apply(null, values) - (opts.pad || 2));
    var yMax = opts.yMax != null ? opts.yMax : Math.ceil(Math.max.apply(null, values) + (opts.pad || 2));

    var W = 640;
    var H = opts.height || 236;
    var padL = 40;
    var padR = 12;
    var padT = 16;
    var padB = 40;
    var innerW = W - padL - padR;
    var innerH = H - padT - padB;
    var xForDate = makeXScale(windowStart, padL, innerW);

    function yScale(v) {
      return padT + innerH - ((v - yMin) / (yMax - yMin)) * innerH;
    }

    var step = opts.tickStep || (yMax - yMin <= 12 ? 1 : Math.ceil((yMax - yMin) / 5));
    var ticks = [];
    for (var t = yMin; t <= yMax + 0.01; t += step) ticks.push(Math.round(t * 10) / 10);

    var svg = '<svg class="readiness-chart__svg" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(opts.title) + '">';
    svg += '<line class="readiness-grid" x1="' + padL + '" y1="' + (padT + innerH) + '" x2="' + (padL + innerW) + '" y2="' + (padT + innerH) + '"/>';
    ticks.forEach(function (tick) {
      var y = yScale(tick);
      svg += '<text class="readiness-axis-y" x="' + (padL - 6) + '" y="' + y + '" text-anchor="end" dominant-baseline="middle">' + tick + (opts.unitY || "") + "</text>";
    });

    var d = buildPath(points, opts.key, xForDate, yScale);
    if (d) svg += '<path class="readiness-line ' + opts.lineClass + '" fill="none" d="' + d + '"/>';

    points.forEach(function (p) {
      var val = p[opts.key];
      if (val == null) return;
      var cx = xForDate(p.date);
      var title = p.weekday + " " + p.scheda + " · " + formatLabel(p.date) + " · " + opts.label + ": ";
      title += opts.formatVal ? opts.formatVal(p) : val + (opts.unit || "");
      svg += '<circle class="readiness-dot ' + opts.dotClass + '" cx="' + cx + '" cy="' + yScale(val) + '" r="4">';
      svg += "<title>" + title + "</title></circle>";
    });
    svg += pointLabels(points, xForDate, H);
    svg += "</svg>";

    return (
      '<div class="readiness-chart__block">' +
      '<h3 class="readiness-chart__subtitle">' + esc(opts.title) + "</h3>" +
      (opts.lead ? '<p class="readiness-chart__lead">' + opts.lead + "</p>" : "") +
      svg +
      '<p class="readiness-chart__legend"><span class="readiness-legend ' + opts.lineClass + '">● ' + esc(opts.label) + "</span></p>" +
      "</div>"
    );
  }

  function renderHrChart(points, windowStart) {
    var hasMax = points.some(function (p) { return p.fc_max != null; });
    var hasMin = points.some(function (p) { return p.fc_min != null; });
    var hasMedia = points.some(function (p) { return p.fc_media != null; });
    if (!hasMax && !hasMin && !hasMedia) {
      return '<p class="readiness-chart__empty-window"><small>Nessun dato FC in questa finestra di 15 giorni.</small></p>';
    }

    var values = [];
    points.forEach(function (p) {
      if (p.fc_max != null) values.push(p.fc_max);
      if (p.fc_min != null) values.push(p.fc_min);
      if (p.fc_media != null) values.push(p.fc_media);
    });
    var yMin = Math.max(50, Math.floor(Math.min.apply(null, values) / 10) * 10 - 10);
    var yMax = Math.min(180, Math.ceil(Math.max.apply(null, values) / 10) * 10 + 10);

    var W = 640;
    var H = 256;
    var padL = 40;
    var padR = 12;
    var padT = 16;
    var padB = 40;
    var innerW = W - padL - padR;
    var innerH = H - padT - padB;
    var xForDate = makeXScale(windowStart, padL, innerW);

    function yScale(v) {
      return padT + innerH - ((v - yMin) / (yMax - yMin)) * innerH;
    }

    var ticks = [];
    var step = yMax - yMin <= 60 ? 10 : 20;
    for (var t = yMin; t <= yMax; t += step) ticks.push(t);

    var svg = '<svg class="readiness-chart__svg readiness-chart__svg--hr" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="FC massima e minima in allenamento">';
    svg += '<line class="readiness-grid" x1="' + padL + '" y1="' + (padT + innerH) + '" x2="' + (padL + innerW) + '" y2="' + (padT + innerH) + '"/>';

    ticks.forEach(function (tick) {
      var y = yScale(tick);
      svg += '<text class="readiness-axis-y" x="' + (padL - 6) + '" y="' + y + '" text-anchor="end" dominant-baseline="middle">' + tick + "</text>";
    });

    if (hasMax) {
      var dMax = buildPath(points, "fc_max", xForDate, yScale);
      if (dMax) svg += '<path class="readiness-line readiness-line--hr-max" fill="none" d="' + dMax + '"/>';
    }
    if (hasMin) {
      var dMin = buildPath(points, "fc_min", xForDate, yScale);
      if (dMin) svg += '<path class="readiness-line readiness-line--hr-min" fill="none" d="' + dMin + '"/>';
    }
    if (hasMedia) {
      var dMed = buildPath(points, "fc_media", xForDate, yScale);
      if (dMed) svg += '<path class="readiness-line readiness-line--hr-media" fill="none" d="' + dMed + '"/>';
    }

    points.forEach(function (p) {
      var cx = xForDate(p.date);
      if (p.fc_max != null) {
        svg += '<circle class="readiness-dot readiness-dot--hr-max" cx="' + cx + '" cy="' + yScale(p.fc_max) + '" r="4.5">';
        svg += "<title>" + p.weekday + " " + p.scheda + " · FC max: " + p.fc_max + " bpm</title></circle>";
      }
      if (p.fc_media != null) {
        svg += '<circle class="readiness-dot readiness-dot--hr-media" cx="' + cx + '" cy="' + yScale(p.fc_media) + '" r="4">';
        svg += "<title>" + p.weekday + " " + p.scheda + " · FC media: " + p.fc_media + " bpm</title></circle>";
      }
      if (p.fc_min != null) {
        svg += '<circle class="readiness-dot readiness-dot--hr-min" cx="' + cx + '" cy="' + yScale(p.fc_min) + '" r="3.5">';
        svg += "<title>" + p.weekday + " " + p.scheda + " · FC min: " + p.fc_min + " bpm</title></circle>";
      }
    });
    svg += pointLabels(points, xForDate, H);
    svg += "</svg>";

    var legend = '<p class="readiness-chart__legend">';
    if (hasMax) legend += '<span class="readiness-legend readiness-line--hr-max">● FC max</span> ';
    if (hasMedia) legend += '<span class="readiness-legend readiness-line--hr-media">● FC media</span> ';
    if (hasMin) legend += '<span class="readiness-legend readiness-line--hr-min">● FC min</span>';
    legend += "</p>";

    return (
      '<div class="readiness-chart__block readiness-chart__block--hr">' +
      '<h3 class="readiness-chart__subtitle">Cuore in allenamento</h3>' +
      "<p class=\"readiness-chart__lead\">Picchi (rosso) e minimi (arancio) Zepp — quanto sale il cuore sotto sforzo e quanto scende in recupero tra i set.</p>" +
      svg + legend +
      "</div>"
    );
  }

  function alignWindowToEnd(endIso) {
    var end = parseDate(endIso);
    var start = addDays(end, -(WINDOW_DAYS - 1));
    if (state.rangeMin && start < parseDate(state.rangeMin)) {
      start = parseDate(state.rangeMin);
    }
    return toIso(start);
  }

  function shiftWindow(days) {
    var next = addDays(parseDate(state.windowStart), days);
    var maxStart = addDays(parseDate(state.rangeMax), -(WINDOW_DAYS - 1));
    if (next < parseDate(state.rangeMin)) next = parseDate(state.rangeMin);
    if (next > maxStart) next = maxStart;
    state.windowStart = toIso(next);
  }

  function render(root) {
    if (!state.wellnessAll.length) {
      root.innerHTML = "<p class=\"readiness-chart__empty\"><small>Nessuna sessione con metriche ancora — i grafici si popolano man mano che pubblico i log Zepp.</small></p>";
      return;
    }

    var points = filterWindow(state.wellnessAll, state.windowStart);

    var note = "<p class=\"readiness-chart__note\">Ogni punto = seduta loggata (A1/B1/A2/B2). Dati readiness + FC da export Zepp. ";
    note += "Scorri con le frecce a blocchi di <strong>" + WINDOW_DAYS + " giorni</strong>. ";
    note += "Dettaglio nelle <a href=\"/allenamenti/sessioni/\">pagine sessione</a>.</p>";

    root.innerHTML =
      '<div class="readiness-chart__head">' +
      "<h2 id=\"readiness-chart-title\">Performance corporea</h2>" +
      "<p>Sonno, HRV, grado di riposo (TSB), HybridCharge e frequenza cardiaca — trend longitudinali dal Blocco 1.</p>" +
      "</div>" +
      renderPager() +
      renderScalarChart(points, state.windowStart, {
        title: "Durata del sonno",
        lead: "Ore notturne Zepp il giorno della sessione — baseline personale ~7 h.",
        key: "sleep_h",
        label: "Durata sonno (h)",
        lineClass: "readiness-line--sleep-h",
        dotClass: "readiness-dot--sleep-h",
        yMin: 4,
        yMax: 10,
        tickStep: 1,
        unitY: "h",
        formatVal: function (p) {
          var h = Math.floor(p.sleep_min / 60);
          var m = p.sleep_min % 60;
          return h + ":" + (m < 10 ? "0" : "") + m;
        }
      }) +
      renderScalarChart(points, state.windowStart, {
        title: "HRV · variabilità cardiaca",
        lead: "ms al risveglio — sotto baseline 43 = Attenzione (Zepp).",
        key: "hrv",
        label: "HRV (ms)",
        lineClass: "readiness-line--hrv",
        dotClass: "readiness-dot--hrv",
        yMin: 25,
        yMax: 65,
        tickStep: 5,
        unit: " ms"
      }) +
      renderScalarChart(points, state.windowStart, {
        title: "Grado di riposo · TSB",
        lead: "Training Stress Balance (CTL − ATL). Negativo = fatica recente; −11 Ottimale ≠ −11 crollo.",
        key: "tsb",
        label: "TSB",
        lineClass: "readiness-line--tsb",
        dotClass: "readiness-dot--tsb",
        yMin: -20,
        yMax: 5,
        tickStep: 5,
        formatVal: function (p) {
          return p.tsb + (p.tsb_label ? " " + p.tsb_label : "");
        }
      }) +
      renderReadinessChart(points, state.windowStart) +
      renderHrChart(points, state.windowStart) +
      note;

    root.querySelectorAll("[data-readiness-nav]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var dir = btn.getAttribute("data-readiness-nav");
        if (dir === "prev" && !btn.disabled) {
          shiftWindow(-WINDOW_DAYS);
          render(root);
        } else if (dir === "next" && !btn.disabled) {
          shiftWindow(WINDOW_DAYS);
          render(root);
        }
      });
    });
  }

  function init() {
    var root = document.getElementById(MOUNT_ID);
    if (!root) return;

    fetch(SESSIONS_URL)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var sessions = (data.sessions || [])
          .filter(function (s) { return s.date && !s.partial; })
          .sort(function (a, b) { return a.date.localeCompare(b.date); });

        if (!sessions.length) {
          root.innerHTML = "<p class=\"readiness-chart__empty\"><small>Nessuna sessione ancora.</small></p>";
          return;
        }

        var maxCarico = 0;
        sessions.forEach(function (s) {
          var c = s.carico_adjusted || s.carico;
          if (c != null && c > maxCarico) maxCarico = c;
        });

        state.wellnessAll = sessions.map(function (s) {
          return extractWellnessPoint(s, maxCarico);
        }).filter(function (p) {
          return p.sleep_min != null || p.sleep_score != null || p.hybridcharge != null ||
            p.hrv != null || p.tsb != null || p.effort != null ||
            p.fc_max != null || p.fc_min != null || p.fc_media != null;
        });

        state.rangeMin = sessions[0].date;
        state.rangeMax = sessions[sessions.length - 1].date;
        state.windowStart = alignWindowToEnd(state.rangeMax);

        render(root);
      })
      .catch(function () {
        root.innerHTML = "<p class=\"readiness-chart__empty\"><small>Grafico performance non disponibile.</small></p>";
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
