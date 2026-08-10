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
    readinessAll: [],
    hrAll: [],
    windowStart: null,
    rangeMin: null,
    rangeMax: null
  };

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

  function extractReadinessPoint(session, maxCarico) {
    var hc = session.hybridcharge || {};
    var carico = session.carico_adjusted || session.carico;
    var effort = hc.effort_pct;
    if (effort == null && carico != null && maxCarico) {
      effort = Math.round((carico / maxCarico) * 100);
    }
    return {
      date: session.date,
      id: session.id,
      scheda: schedaSigla(session),
      weekday: weekdayShort(session.date),
      sleep: hc.sleep_score != null ? hc.sleep_score : null,
      efficiency: hc.pre != null ? hc.pre : null,
      effort: effort != null ? effort : null
    };
  }

  function extractHrPoint(session) {
    return {
      date: session.date,
      id: session.id,
      scheda: schedaSigla(session),
      weekday: weekdayShort(session.date),
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
    var hasSleep = points.some(function (p) { return p.sleep != null; });
    var hasEff = points.some(function (p) { return p.efficiency != null; });
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
      series.push({ key: "sleep", label: "Qualità sonno", className: "readiness-line--sleep", dotClass: "readiness-dot--sleep" });
    }
    if (hasEff) {
      series.push({ key: "efficiency", label: "Efficienza corpo (HybridCharge)", className: "readiness-line--efficiency", dotClass: "readiness-dot--efficiency" });
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

  function renderHrChart(points, windowStart) {
    var hasMax = points.some(function (p) { return p.fc_max != null; });
    var hasMin = points.some(function (p) { return p.fc_min != null; });
    if (!hasMax && !hasMin) {
      return '<p class="readiness-chart__empty-window"><small>Nessun dato FC in questa finestra di 15 giorni.</small></p>';
    }

    var values = [];
    points.forEach(function (p) {
      if (p.fc_max != null) values.push(p.fc_max);
      if (p.fc_min != null) values.push(p.fc_min);
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

    points.forEach(function (p) {
      var cx = xForDate(p.date);
      if (p.fc_max != null) {
        svg += '<circle class="readiness-dot readiness-dot--hr-max" cx="' + cx + '" cy="' + yScale(p.fc_max) + '" r="4.5">';
        svg += "<title>" + p.weekday + " " + p.scheda + " · FC max: " + p.fc_max + " bpm</title></circle>";
      }
      if (p.fc_min != null) {
        svg += '<circle class="readiness-dot readiness-dot--hr-min" cx="' + cx + '" cy="' + yScale(p.fc_min) + '" r="3.5">';
        svg += "<title>" + p.weekday + " " + p.scheda + " · FC min: " + p.fc_min + " bpm</title></circle>";
      }
    });
    svg += pointLabels(points, xForDate, H);
    svg += "</svg>";

    var legend = '<p class="readiness-chart__legend">';
    if (hasMax) legend += '<span class="readiness-legend readiness-line--hr-max">● FC max in seduta</span> ';
    if (hasMin) legend += '<span class="readiness-legend readiness-line--hr-min">● FC min in seduta</span>';
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
    if (!state.readinessAll.length && !state.hrAll.length) {
      root.innerHTML = "<p class=\"readiness-chart__empty\"><small>Nessuna sessione con metriche ancora — i grafici si popolano man mano che pubblico i log Zepp.</small></p>";
      return;
    }

    var readinessPoints = filterWindow(state.readinessAll, state.windowStart);
    var hrPoints = filterWindow(state.hrAll, state.windowStart);

    var note = "<p class=\"readiness-chart__note\">Ogni punto = una seduta loggata. Dati da export Amazfit/Zepp. ";
    note += "Scorri con le frecce a blocchi di <strong>" + WINDOW_DAYS + " giorni</strong>. ";
    note += "Dettaglio nelle <a href=\"/allenamenti/sessioni/\">pagine sessione</a>.</p>";

    root.innerHTML =
      '<div class="readiness-chart__head">' +
      "<h2 id=\"readiness-chart-title\">Performance corporea</h2>" +
      "<p>Come oscillano sonno, efficienza, sforzo e frequenza cardiaca — nulla a che vedere con i kg in palestra.</p>" +
      "</div>" +
      renderPager() +
      renderReadinessChart(readinessPoints, state.windowStart) +
      renderHrChart(hrPoints, state.windowStart) +
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

        state.readinessAll = sessions.map(function (s) {
          return extractReadinessPoint(s, maxCarico);
        }).filter(function (p) {
          return p.sleep != null || p.efficiency != null || p.effort != null;
        });

        state.hrAll = sessions.map(extractHrPoint).filter(function (p) {
          return p.fc_max != null || p.fc_min != null;
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
