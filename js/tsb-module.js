/**
 * Modulo TSB (CTL / ATL / bilancio) — legge data/performance-tsb.json
 * Uso: <div class="tsb-module" data-session-id="2026-07-24-scheda-4"></div>
 *      <div class="tsb-module" data-mode="trimestre"></div>
 */
(function () {
  var roots = document.querySelectorAll(".tsb-module");
  if (!roots.length) return;

  fetch("/data/performance-tsb.json")
    .then(function (r) { return r.json(); })
    .then(function (data) {
      roots.forEach(function (root) { render(root, data); });
    })
    .catch(function () {
      roots.forEach(function (root) {
        root.innerHTML = "<p><small>Modulo TSB non disponibile.</small></p>";
      });
    });

  function render(root, data) {
    var sessionId = root.getAttribute("data-session-id");
    var isTrimestre = root.getAttribute("data-mode") === "trimestre";
    var session = sessionId
      ? data.sessions.find(function (s) { return s.id === sessionId; })
      : null;
    var focusDate = session ? session.date : data.sessions[data.sessions.length - 1].date;
    var point = data.series.find(function (p) { return p.date === focusDate; }) || data.series[data.series.length - 1];
    var titolo = isTrimestre ? data.sintesi.titolo : (session ? session.titolo : point.zone);
    var testo = isTrimestre ? data.sintesi.testo : (session ? session.analisi : "");

    var html = "";
    html += '<div class="tsb-module__kpis" role="group" aria-label="Metriche TSB al ' + esc(fmtDate(focusDate)) + '">';
    html += kpi("TSB", point.tsb, point.zone, true);
    html += kpi("Affaticamento (ATL)", point.atl, "", false);
    html += kpi("Fitness (CTL)", point.ctl, "", false);
    html += "</div>";

    html += '<div class="tsb-chart" role="img" aria-label="Grafico bilancio allenamento CTL ATL TSB">';
    html += buildSvg(data.series, focusDate, data.sessions);
    html += "</div>";

    html += '<div class="tsb-module__legend">';
    html += '<span><i class="tsb-swatch tsb-swatch--ctl"></i>Fitness (CTL)</span>';
    html += '<span><i class="tsb-swatch tsb-swatch--atl"></i>Affaticamento (ATL)</span>';
    html += '<span><i class="tsb-swatch tsb-swatch--load"></i>Carico giornaliero</span>';
    html += "</div>";

    html += '<div class="tsb-module__copy">';
    html += "<h3>" + esc(titolo) + "</h3>";
    html += "<p>" + esc(testo) + "</p>";
    if (!isTrimestre && session && session.partial) {
      html += '<p class="tsb-module__note"><small>Export parziale: il carico di questa sessione non è nel calcolo — il trend resta indicativo.</small></p>';
    }
    html += '<p class="tsb-module__note"><small>TSB = Fitness − Affaticamento. Zone: Rilassato · Energetico · Bilanciato · Ottimale. Valori da carico Zepp delle sessioni pubblicate, ancorati all\'export del 24/07.</small></p>';
    html += "</div>";

    root.innerHTML = html;
  }

  function kpi(label, val, zone, primary) {
    var cls = "tsb-kpi" + (primary ? " tsb-kpi--primary" : "");
    var z = zone ? '<span class="tsb-kpi__zone">' + esc(zone) + "</span>" : "";
    return '<div class="' + cls + '"><span class="tsb-kpi__label">' + esc(label) + "</span>" +
      '<strong class="tsb-kpi__val">' + esc(String(val)) + "</strong>" + z + "</div>";
  }

  function buildSvg(series, focusDate, sessions) {
    var W = 720;
    var H = 260;
    var pad = { t: 12, r: 36, b: 28, l: 88 };
    var iw = W - pad.l - pad.r;
    var ih = H - pad.t - pad.b;

    var maxVal = 0;
    series.forEach(function (p) {
      maxVal = Math.max(maxVal, p.ctl, p.atl, p.load);
    });
    maxVal = Math.max(maxVal * 1.15, 45);

    function x(i) { return pad.l + (i / (series.length - 1)) * iw; }
    function y(v) { return pad.t + ih - (v / maxVal) * ih; }

    var sessionDates = {};
    sessions.forEach(function (s) { sessionDates[s.date] = true; });

    var zones = [
      { label: "Rilassato", cls: "tsb-zone--rilassato" },
      { label: "Energetico", cls: "tsb-zone--energetico" },
      { label: "Bilanciato", cls: "tsb-zone--bilanciato" },
      { label: "Ottimale", cls: "tsb-zone--ottimale" }
    ];
    var zoneH = ih / zones.length;

    var svg = '<svg class="tsb-chart__svg" viewBox="0 0 ' + W + " " + H + '" preserveAspectRatio="xMidYMid meet">';

    zones.forEach(function (z, zi) {
      var yTop = pad.t + zi * zoneH;
      svg += '<rect class="tsb-zone ' + z.cls + '" x="' + pad.l + '" y="' + yTop + '" width="' + iw + '" height="' + zoneH + '"/>';
      svg += '<text class="tsb-zone__label" x="' + (pad.l - 8) + '" y="' + (yTop + zoneH / 2 + 4) + '">' + esc(z.label) + "</text>";
    });

    series.forEach(function (p, i) {
      if (!p.load) return;
      var bw = Math.max(iw / series.length * 0.55, 2);
      var bx = x(i) - bw / 2;
      var bh = (p.load / maxVal) * ih;
      svg += '<rect class="tsb-bar" x="' + bx + '" y="' + (pad.t + ih - bh) + '" width="' + bw + '" height="' + bh + '"/>';
    });

    svg += polyline(series, "ctl", x, y, "tsb-line tsb-line--ctl");
    svg += polyline(series, "atl", x, y, "tsb-line tsb-line--atl");

    var focusIdx = series.findIndex(function (p) { return p.date === focusDate; });
    if (focusIdx >= 0) {
      var fx = x(focusIdx);
      svg += '<line class="tsb-focus" x1="' + fx + '" y1="' + pad.t + '" x2="' + fx + '" y2="' + (pad.t + ih) + '"/>';
      svg += '<circle class="tsb-dot tsb-dot--ctl" cx="' + fx + '" cy="' + y(series[focusIdx].ctl) + '" r="4"/>';
      svg += '<circle class="tsb-dot tsb-dot--atl" cx="' + fx + '" cy="' + y(series[focusIdx].atl) + '" r="4"/>';
    }

    var ticks = [0, Math.round(maxVal / 2), Math.round(maxVal)];
    ticks.forEach(function (t) {
      var ty = y(t);
      svg += '<line class="tsb-grid" x1="' + pad.l + '" y1="' + ty + '" x2="' + (pad.l + iw) + '" y2="' + ty + '"/>';
      svg += '<text class="tsb-axis" x="' + (W - pad.r + 6) + '" y="' + (ty + 4) + '">' + t + "</text>";
    });

    var labelEvery = Math.ceil(series.length / 7);
    series.forEach(function (p, i) {
      if (i % labelEvery !== 0 && p.date !== focusDate) return;
      svg += '<text class="tsb-axis tsb-axis--x" x="' + x(i) + '" y="' + (H - 6) + '">' + esc(fmtDate(p.date)) + "</text>";
    });

    svg += "</svg>";
    return svg;
  }

  function polyline(series, key, x, y, cls) {
    var pts = series.map(function (p, i) { return x(i) + "," + y(p[key]); }).join(" ");
    return '<polyline class="' + cls + '" points="' + pts + '" fill="none"/>';
  }

  function fmtDate(iso) {
    var p = iso.split("-");
    return p[2] + "/" + p[1];
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  }
})();
