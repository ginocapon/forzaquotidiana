/**
 * Grafico performance corporea — sonno, efficienza (HybridCharge), sforzo
 * Sotto il calendario hub allenamenti. Non riguarda i pesi in sala.
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

  function extractPoint(session, maxCarico) {
    var hc = session.hybridcharge || {};
    var carico = session.carico_adjusted || session.carico;
    var effort = hc.effort_pct;
    if (effort == null && carico != null && maxCarico) {
      effort = Math.round((carico / maxCarico) * 100);
    }
    return {
      date: session.date,
      id: session.id,
      url: "/allenamenti/sessioni/" + session.id + "/",
      sleep: hc.sleep_score != null ? hc.sleep_score : null,
      efficiency: hc.pre != null ? hc.pre : null,
      effort: effort != null ? effort : null,
      scheda: session.scheda
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

  function render(root, points) {
    if (!points.length) {
      root.innerHTML = "<p class=\"readiness-chart__empty\"><small>Nessuna sessione con metriche readiness ancora — il grafico si popola man mano che pubblico i log Zepp.</small></p>";
      return;
    }

    var hasSleep = points.some(function (p) { return p.sleep != null; });
    var hasEff = points.some(function (p) { return p.efficiency != null; });
    var hasEffort = points.some(function (p) { return p.effort != null; });

    if (!hasSleep && !hasEff && !hasEffort) {
      root.innerHTML = "<p class=\"readiness-chart__empty\"><small>Metriche HybridCharge in arrivo — per ora solo carico sessione nelle pagine singole.</small></p>";
      return;
    }

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
      series.push({
        key: "sleep",
        label: "Qualità sonno",
        className: "readiness-line--sleep",
        dotClass: "readiness-dot--sleep"
      });
    }
    if (hasEff) {
      series.push({
        key: "efficiency",
        label: "Efficienza corpo (HybridCharge)",
        className: "readiness-line--efficiency",
        dotClass: "readiness-dot--efficiency"
      });
    }
    if (hasEffort) {
      series.push({
        key: "effort",
        label: "Sforzo",
        className: "readiness-line--effort",
        dotClass: "readiness-dot--effort"
      });
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
        svg += '<title>' + formatLabel(p.date) + " · S" + p.scheda + " · " + s.label + ": " + val + "</title></circle>";
      });
      if (i === 0 || i === points.length - 1 || points.length <= 8 || i % 2 === 0) {
        svg += '<text class="readiness-axis-x" x="' + cx + '" y="' + (H - 8) + '" text-anchor="middle">' + formatLabel(p.date) + "</text>";
      }
    });

    svg += "</svg>";

    var legend = '<p class="readiness-chart__legend">';
    series.forEach(function (s, i) {
      if (i) legend += " ";
      legend += '<span class="readiness-legend ' + s.className + '">● ' + s.label + "</span>";
    });
    legend += "</p>";

    var note = "<p class=\"readiness-chart__note\">Ogni punto = una seduta loggata. ";
    note += "Sonno e HybridCharge da export Zepp; sforzo = carico giornaliero o % Zepp quando disponibile. ";
    note += "Dettaglio completo nelle <a href=\"/allenamenti/sessioni/\">pagine sessione</a>.</p>";

    root.innerHTML =
      '<div class="readiness-chart__head">' +
      "<h2 id=\"readiness-chart-title\">Performance corporea</h2>" +
      "<p>Come oscillano sonno, efficienza e sforzo nel tempo — nulla a che vedere con i kg in palestra.</p>" +
      "</div>" +
      svg + legend + note;
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

        var points = sessions.map(function (s) {
          return extractPoint(s, maxCarico);
        }).filter(function (p) {
          return p.sleep != null || p.efficiency != null || p.effort != null;
        });

        render(root, points);
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
