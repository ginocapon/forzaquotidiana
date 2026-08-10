/**
 * Grafici performance — readiness (0–100) + cuore in allenamento (bpm)
 * Hub allenamenti. Il cuore mostra FC max/min per capire lo sforzo reale.
 */
(function () {
  "use strict";

  var SESSIONS_URL = "/data/performance-sessions.json";
  var MOUNT_ID = "allenamenti-readiness-chart";

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function formatLabel(iso) {
    var p = iso.split("-");
    return pad(+p[2]) + "/" + pad(+p[1]);
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
      scheda: session.scheda || session.scheda_label || "—",
      sleep: hc.sleep_score != null ? hc.sleep_score : null,
      efficiency: hc.pre != null ? hc.pre : null,
      effort: effort != null ? effort : null
    };
  }

  function extractHrPoint(session) {
    return {
      date: session.date,
      id: session.id,
      url: "/allenamenti/sessioni/" + session.id + "/",
      scheda: session.scheda || session.scheda_label || "—",
      fc_max: session.fc_max != null ? session.fc_max : null,
      fc_min: session.fc_min != null ? session.fc_min : null,
      fc_media: session.fc_media != null ? session.fc_media : null
    };
  }

  function buildPath(points, key, xScale, yScale) {
    var segments = [];
    var current = [];

    points.forEach(function (p, i) {
      var val = p[key];
      if (val == null) {
        if (current.length) {
          segments.push(current);
          current = [];
        }
        return;
      }
      current.push({ x: xScale(i), y: yScale(val), val: val, p: p });
    });
    if (current.length) segments.push(current);

    return segments.map(function (seg) {
      return seg.map(function (pt, j) {
        return (j === 0 ? "M" : "L") + pt.x.toFixed(1) + " " + pt.y.toFixed(1);
      }).join(" ");
    }).join(" ");
  }

  function axisLabels(points, xScale, H) {
    var labels = "";
    points.forEach(function (p, i) {
      if (i === 0 || i === points.length - 1 || points.length <= 8 || i % 2 === 0) {
        labels += '<text class="readiness-axis-x" x="' + xScale(i) + '" y="' + (H - 8) + '" text-anchor="middle">' + formatLabel(p.date) + "</text>";
      }
    });
    return labels;
  }

  function renderReadinessChart(points) {
    var hasSleep = points.some(function (p) { return p.sleep != null; });
    var hasEff = points.some(function (p) { return p.efficiency != null; });
    var hasEffort = points.some(function (p) { return p.effort != null; });

    if (!hasSleep && !hasEff && !hasEffort) return "";

    var W = 640;
    var H = 220;
    var padL = 36;
    var padR = 12;
    var padT = 16;
    var padB = 32;
    var innerW = W - padL - padR;
    var innerH = H - padT - padB;

    function xScale(i) {
      if (points.length === 1) return padL + innerW / 2;
      return padL + (i / (points.length - 1)) * innerW;
    }
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

    var svg = '<svg class="readiness-chart__svg" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Andamento sonno, efficienza e sforzo per sessione">';
    svg += '<line class="readiness-grid" x1="' + padL + '" y1="' + (padT + innerH) + '" x2="' + (padL + innerW) + '" y2="' + (padT + innerH) + '"/>';
    [25, 50, 75].forEach(function (tick) {
      var y = yScale(tick);
      svg += '<line class="readiness-grid readiness-grid--minor" x1="' + padL + '" y1="' + y + '" x2="' + (padL + innerW) + '" y2="' + y + '"/>';
      svg += '<text class="readiness-axis-y" x="' + (padL - 6) + '" y="' + y + '" text-anchor="end" dominant-baseline="middle">' + tick + "</text>";
    });

    series.forEach(function (s) {
      var d = buildPath(points, s.key, xScale, yScale);
      if (d) svg += '<path class="readiness-line ' + s.className + '" fill="none" d="' + d + '"/>';
    });

    points.forEach(function (p, i) {
      var cx = xScale(i);
      series.forEach(function (s) {
        var val = p[s.key];
        if (val == null) return;
        svg += '<circle class="readiness-dot ' + s.dotClass + '" cx="' + cx + '" cy="' + yScale(val) + '" r="4">';
        svg += "<title>" + formatLabel(p.date) + " · " + s.label + ": " + val + "</title></circle>";
      });
    });
    svg += axisLabels(points, xScale, H);
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

  function renderHrChart(points) {
    var hasMax = points.some(function (p) { return p.fc_max != null; });
    var hasMin = points.some(function (p) { return p.fc_min != null; });
    if (!hasMax && !hasMin) return "";

    var values = [];
    points.forEach(function (p) {
      if (p.fc_max != null) values.push(p.fc_max);
      if (p.fc_min != null) values.push(p.fc_min);
    });
    var yMin = Math.max(50, Math.floor(Math.min.apply(null, values) / 10) * 10 - 10);
    var yMax = Math.min(180, Math.ceil(Math.max.apply(null, values) / 10) * 10 + 10);

    var W = 640;
    var H = 240;
    var padL = 40;
    var padR = 12;
    var padT = 16;
    var padB = 32;
    var innerW = W - padL - padR;
    var innerH = H - padT - padB;

    function xScale(i) {
      if (points.length === 1) return padL + innerW / 2;
      return padL + (i / (points.length - 1)) * innerW;
    }
    function yScale(v) {
      return padT + innerH - ((v - yMin) / (yMax - yMin)) * innerH;
    }

    var ticks = [];
    var step = yMax - yMin <= 60 ? 10 : 20;
    for (var t = yMin; t <= yMax; t += step) ticks.push(t);

    var svg = '<svg class="readiness-chart__svg readiness-chart__svg--hr" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="FC massima e minima in allenamento per sessione">';
    svg += '<line class="readiness-grid" x1="' + padL + '" y1="' + (padT + innerH) + '" x2="' + (padL + innerW) + '" y2="' + (padT + innerH) + '"/>';

    ticks.forEach(function (tick) {
      var y = yScale(tick);
      svg += '<line class="readiness-grid readiness-grid--minor" x1="' + padL + '" y1="' + y + '" x2="' + (padL + innerW) + '" y2="' + y + '"/>';
      svg += '<text class="readiness-axis-y" x="' + (padL - 6) + '" y="' + y + '" text-anchor="end" dominant-baseline="middle">' + tick + "</text>";
    });

    points.forEach(function (p, i) {
      var cx = xScale(i);
      if (p.fc_min != null && p.fc_max != null) {
        svg += '<line class="readiness-hr-range" x1="' + cx + '" y1="' + yScale(p.fc_max) + '" x2="' + cx + '" y2="' + yScale(p.fc_min) + '"/>';
      }
    });

    if (hasMax) {
      var dMax = buildPath(points, "fc_max", xScale, yScale);
      if (dMax) svg += '<path class="readiness-line readiness-line--hr-max" fill="none" d="' + dMax + '"/>';
    }
    if (hasMin) {
      var dMin = buildPath(points, "fc_min", xScale, yScale);
      if (dMin) svg += '<path class="readiness-line readiness-line--hr-min" fill="none" d="' + dMin + '"/>';
    }

    points.forEach(function (p, i) {
      var cx = xScale(i);
      if (p.fc_max != null) {
        svg += '<circle class="readiness-dot readiness-dot--hr-max" cx="' + cx + '" cy="' + yScale(p.fc_max) + '" r="4.5">';
        svg += "<title>" + formatLabel(p.date) + " · FC max: " + p.fc_max + " bpm</title></circle>";
      }
      if (p.fc_min != null) {
        svg += '<circle class="readiness-dot readiness-dot--hr-min" cx="' + cx + '" cy="' + yScale(p.fc_min) + '" r="3.5">';
        svg += "<title>" + formatLabel(p.date) + " · FC min: " + p.fc_min + " bpm</title></circle>";
      }
    });
    svg += axisLabels(points, xScale, H);
    svg += "</svg>";

    var legend = '<p class="readiness-chart__legend">';
    if (hasMax) legend += '<span class="readiness-legend readiness-line--hr-max">● FC max in seduta</span> ';
    if (hasMin) legend += '<span class="readiness-legend readiness-line--hr-min">● FC min in seduta</span> ';
    legend += '<span class="readiness-legend readiness-hr-range-label">▮ Fascia max–min</span>';
    legend += "</p>";

    return (
      '<div class="readiness-chart__block readiness-chart__block--hr">' +
      '<h3 class="readiness-chart__subtitle">Cuore in allenamento</h3>' +
      "<p class=\"readiness-chart__lead\">Picchi e minimi Zepp per seduta — quanto sale il cuore sotto sforzo e quanto scende in recupero tra i set.</p>" +
      svg + legend +
      "</div>"
    );
  }

  function render(root, readinessPoints, hrPoints) {
    if (!readinessPoints.length && !hrPoints.length) {
      root.innerHTML = "<p class=\"readiness-chart__empty\"><small>Nessuna sessione con metriche ancora — i grafici si popolano man mano che pubblico i log Zepp.</small></p>";
      return;
    }

    var readinessHtml = renderReadinessChart(readinessPoints);
    var hrHtml = renderHrChart(hrPoints);

    var note = "<p class=\"readiness-chart__note\">Ogni punto = una seduta loggata. Dati da export Amazfit/Zepp. ";
    note += "Dettaglio completo nelle <a href=\"/allenamenti/sessioni/\">pagine sessione</a>.</p>";

    root.innerHTML =
      '<div class="readiness-chart__head">' +
      "<h2 id=\"readiness-chart-title\">Performance corporea</h2>" +
      "<p>Come oscillano sonno, efficienza, sforzo e frequenza cardiaca — nulla a che vedere con i kg in palestra.</p>" +
      "</div>" +
      readinessHtml +
      hrHtml +
      note;
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

        var maxCarico = 0;
        sessions.forEach(function (s) {
          var c = s.carico_adjusted || s.carico;
          if (c != null && c > maxCarico) maxCarico = c;
        });

        var readinessPoints = sessions.map(function (s) {
          return extractReadinessPoint(s, maxCarico);
        }).filter(function (p) {
          return p.sleep != null || p.efficiency != null || p.effort != null;
        });

        var hrPoints = sessions.map(extractHrPoint).filter(function (p) {
          return p.fc_max != null || p.fc_min != null;
        });

        render(root, readinessPoints, hrPoints);
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
