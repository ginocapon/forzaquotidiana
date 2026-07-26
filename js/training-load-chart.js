/**
 * Modulo TSB Zepp — CTL / ATL / TSB (fitness, fatica, riposo)
 * Trimestre: vista panoramica · Sessione: focus sulla data allenamento
 * data-training-load="YYYY-MM-DD" oppure data-training-load="overview"
 */
(function () {
  var roots = document.querySelectorAll("[data-training-load]");
  if (!roots.length) return;

  // Grafico già pre-renderizzato in HTML — non sostituire
  var needsFetch = [];
  roots.forEach(function (root) {
    if (root.classList.contains("tsb-module--static") && root.querySelector(".tsb-module__svg")) return;
    needsFetch.push(root);
  });
  if (!needsFetch.length) return;

  fetch("/data/training-load.json")
    .then(function (r) { return r.json(); })
    .then(function (data) {
      needsFetch.forEach(function (root) {
        var mode = root.getAttribute("data-training-load");
        renderModule(root, data, mode);
      });
    })
    .catch(function () {
      needsFetch.forEach(function (root) {
        if (!root.querySelector(".tsb-module__svg")) {
          root.innerHTML = "<p class=\"tsb-module__fallback\"><small>Modulo TSB non disponibile.</small></p>";
        }
      });
    });

  function renderModule(root, data, mode) {
    var focusDate = mode === "overview" ? null : mode;
    var snapshot = focusDate && data.snapshots[focusDate] ? data.snapshots[focusDate] : null;
    var timeline = data.timeline || [];
    if (!timeline.length) return;

    var windowDays = focusDate ? 42 : timeline.length;
    var slice = sliceTimeline(timeline, focusDate, windowDays);
    var display = snapshot || slice.focusPoint || slice.points[slice.points.length - 1];

    var statusClass = statusId(display.status);
    var html = "";

    html += '<div class="tsb-module__head">';
    html += '<div class="tsb-module__title-block">';
    html += "<h3 class=\"tsb-module__title\">Modulo di allenamento <span class=\"tsb-module__abbr\">(TSB)</span>";
    if (focusDate) {
      html += " · " + esc(formatItalianDate(focusDate));
    }
    html += "</h3>";
    html += '<p class="tsb-module__status tsb-module__status--' + statusClass + '">';
    html += "<strong>" + esc(formatTsb(display.tsb)) + "</strong> " + esc(display.status);
    html += "</p>";
    html += "</div>";
    html += '<div class="tsb-module__kpis">';
    html += kpi("Livello di affaticamento (ATL)", display.atl, "tsb-kpi--fatigue");
    html += kpi("Livello di fitness (CTL)", display.ctl, "tsb-kpi--fitness");
    html += "</div>";
    html += "</div>";

    html += '<div class="tsb-module__chart-wrap">';
    html += '<div class="tsb-module__zones" aria-hidden="true">';
    data.zones.forEach(function (z) {
      html += '<span class="tsb-zone tsb-zone--' + z.id + '">' + esc(z.label) + "</span>";
    });
    html += "</div>";
    html += renderSvg(slice, focusDate, data.sessions || []);
    html += "</div>";

    if (focusDate && snapshot) {
      html += '<p class="tsb-module__session-note">';
      html += "Stato di <strong>fatica e riposo</strong> al momento dell&apos;allenamento del ";
      html += esc(formatItalianDate(focusDate)) + ": ";
      html += "<strong>" + esc(display.status) + "</strong> (TSB " + esc(formatTsb(display.tsb)) + "). ";
      html += sessionInterpretation(display);
      html += "</p>";
    } else if (!focusDate) {
      html += '<p class="tsb-module__session-note">Panoramica trimestre — le date con pallino evidenziano le sessioni registrate. Valori da carico Zepp/Amazfit (CTL fitness, ATL fatica, TSB = differenza).</p>";
    }

    root.innerHTML = html;
    root.classList.add("tsb-module--ready");
  }

  function sliceTimeline(timeline, focusDate, windowDays) {
    if (!focusDate) {
      return { points: timeline, focusIndex: -1, focusPoint: null };
    }
    var idx = timeline.findIndex(function (p) { return p.date === focusDate; });
    if (idx < 0) {
      idx = timeline.length - 1;
    }
    var start = Math.max(0, idx - Math.floor(windowDays / 2));
    var end = Math.min(timeline.length, start + windowDays);
    if (end - start < windowDays) start = Math.max(0, end - windowDays);
    var points = timeline.slice(start, end);
    var focusIndex = points.findIndex(function (p) { return p.date === focusDate; });
    return {
      points: points,
      focusIndex: focusIndex,
      focusPoint: focusIndex >= 0 ? points[focusIndex] : null
    };
  }

  function renderSvg(slice, focusDate, sessions) {
    var points = slice.points;
    var w = 640;
    var h = 220;
    var padL = 8;
    var padR = 36;
    var padT = 12;
    var padB = 28;
    var chartW = w - padL - padR;
    var chartH = h - padT - padB;

    var maxVal = 0;
    points.forEach(function (p) {
      maxVal = Math.max(maxVal, p.atl, p.ctl, p.load || 0);
    });
    maxVal = Math.ceil(maxVal / 5) * 5 + 5;
    if (maxVal < 45) maxVal = 45;

    function x(i) {
      return padL + (i / (points.length - 1 || 1)) * chartW;
    }
    function y(v) {
      return padT + chartH - (v / maxVal) * chartH;
    }

    var sessionDates = {};
    sessions.forEach(function (s) { sessionDates[s.date] = true; });

    var svg = '<svg class="tsb-module__svg" viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="Grafico fitness CTL e fatica ATL">';
    svg += '<defs><linearGradient id="tsbFatigueFill" x1="0" y1="0" x2="0" y2="1">';
    svg += '<stop offset="0%" stop-color="#e85d5d" stop-opacity="0.18"/>';
    svg += '<stop offset="100%" stop-color="#e85d5d" stop-opacity="0"/>';
    svg += "</linearGradient></defs>";

    points.forEach(function (p, i) {
      if (!p.load) return;
      var barW = chartW / points.length * 0.55;
      var bx = x(i) - barW / 2;
      var bh = (p.load / maxVal) * chartH;
      svg += '<rect class="tsb-bar" x="' + bx + '" y="' + (padT + chartH - bh) + '" width="' + barW + '" height="' + bh + '" rx="1"/>';
    });

    var atlPath = linePath(points, "atl", x, y);
    var ctlPath = linePath(points, "ctl", x, y);
    svg += '<path class="tsb-line tsb-line--atl" d="' + atlPath + '"/>';
    svg += '<path class="tsb-line tsb-line--ctl" d="' + ctlPath + '"/>';

    if (slice.focusIndex >= 0) {
      var fx = x(slice.focusIndex);
      svg += '<line class="tsb-focus-line" x1="' + fx + '" y1="' + padT + '" x2="' + fx + '" y2="' + (padT + chartH) + '"/>';
      var fp = points[slice.focusIndex];
      svg += '<circle class="tsb-dot tsb-dot--atl" cx="' + fx + '" cy="' + y(fp.atl) + '" r="4"/>';
      svg += '<circle class="tsb-dot tsb-dot--ctl" cx="' + fx + '" cy="' + y(fp.ctl) + '" r="4"/>';
    }

    points.forEach(function (p, i) {
      if (!sessionDates[p.date] && p.date !== focusDate) return;
      var cx = x(i);
      var cy = y(p.atl);
      var active = p.date === focusDate;
      svg += '<circle class="tsb-session-marker' + (active ? " is-active" : "") + '" cx="' + cx + '" cy="' + cy + '" r="' + (active ? 5 : 3) + '"/>';
    });

    for (var tick = 0; tick <= maxVal; tick += 15) {
      if (tick === 0) continue;
      var ty = y(tick);
      svg += '<text class="tsb-axis-y" x="' + (w - 6) + '" y="' + ty + '" text-anchor="end">' + tick + "</text>";
    }

    var labelStep = Math.ceil(points.length / 8);
    points.forEach(function (p, i) {
      if (i % labelStep !== 0 && i !== points.length - 1) return;
      svg += '<text class="tsb-axis-x" x="' + x(i) + '" y="' + (h - 6) + '" text-anchor="middle">' + esc(p.label) + "</text>";
    });

    svg += "</svg>";
    return svg;
  }

  function linePath(points, key, xFn, yFn) {
    return points
      .map(function (p, i) {
        return (i === 0 ? "M" : "L") + xFn(i) + " " + yFn(p[key]);
      })
      .join(" ");
  }

  function kpi(label, value, cls) {
    return "<div class=\"tsb-module__kpi " + cls + "\"><dt>" + esc(label) + "</dt><dd>" + esc(String(value)) + "</dd></div>";
  }

  function statusId(label) {
    return String(label || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function formatTsb(v) {
    var n = Number(v);
    if (Number.isNaN(n)) return "—";
    return n.toFixed(1);
  }

  function formatItalianDate(iso) {
    var p = iso.split("-");
    if (p.length !== 3) return iso;
    return p[2] + "/" + p[1];
  }

  function sessionInterpretation(s) {
    if (s.status === "Rilassato") return "Recupero ampio — puoi spingere se la sessione lo richiede.";
    if (s.status === "Energetico") return "Buona freschezza — giornata adatta a carichi pieni.";
    if (s.status === "Bilanciato") return "Equilibrio tra fitness e fatica — sessione in linea con il carico programmato.";
    return "Fatica accumulata — utile per lo stimolo, ma monitora recupero e sonno.";
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  }
})();
