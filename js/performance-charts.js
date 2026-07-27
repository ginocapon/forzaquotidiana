/**
 * Grafici performance mensili — legge data/performance-monthly.json
 * Un blocco per mese (data-perf-month) in trimestre #statistiche
 */
(function () {
  var roots = document.querySelectorAll("[data-perf-month]");
  if (!roots.length) {
    var legacy = document.getElementById("perf-charts");
    if (legacy) roots = [legacy];
    else return;
  }

  fetch("/data/performance-monthly.json")
    .then(function (r) { return r.json(); })
    .then(function (data) {
      roots.forEach(function (root) {
        var monthKey = root.getAttribute("data-perf-month");
        if (monthKey) renderMonth(root, data, monthKey);
        else renderFirst(root, data);
      });
    })
    .catch(function () {
      roots.forEach(function (root) {
        root.innerHTML = "<p><small>Grafici performance non disponibili.</small></p>";
      });
    });

  function renderMonth(root, data, monthKey) {
    var month = data.months.find(function (m) { return m.month === monthKey; });
    if (!month || month.sessioni_con_export === 0) {
      root.innerHTML = "<p class=\"perf-charts__empty\"><small>Nessuna sessione con export completo in " + esc(month ? month.label : monthKey) + ".</small></p>";
      return;
    }
    var chart = data.charts[monthKey];
    if (!chart) {
      root.innerHTML = "<p class=\"perf-charts__empty\"><small>Grafici non disponibili.</small></p>";
      return;
    }
    root.innerHTML = buildCharts(month, chart);
  }

  function renderFirst(root, data) {
    var month = data.months.find(function (m) { return m.sessioni_con_export > 0; });
    if (!month) return;
    var chart = data.charts[month.month];
    if (!chart) return;
    root.innerHTML = buildCharts(month, chart);
  }

  function buildCharts(month, chart) {
    var blocks = [
      { title: "Durata sessioni (min)", key: "durata_min", unit: "min", max: Math.max.apply(null, chart.durata_min) },
      { title: "FC media", key: "fc_media", unit: "bpm", max: Math.max.apply(null, chart.fc_media) },
      { title: "Calorie", key: "calorie", unit: "kcal", max: Math.max.apply(null, chart.calorie) },
      { title: "Carico allenamento", key: "carico", unit: "", max: Math.max.apply(null, chart.carico) },
      { title: "Gruppi / set", key: "gruppi", unit: "", max: Math.max.apply(null, chart.gruppi) }
    ];

    var html = '<p class="perf-charts__lead">Grafici ' + esc(month.label) + ' — solo sessioni con export completo (' + month.sessioni_con_export + ').</p>';
    html += '<div class="perf-charts__grid">';

    blocks.forEach(function (b) {
      html += '<div class="perf-chart"><h3>' + esc(b.title) + '</h3><div class="perf-chart__bars" role="img" aria-label="' + esc(b.title) + '">';
      chart.labels.forEach(function (label, i) {
        var val = chart[b.key][i];
        var pct = b.max ? Math.round((val / b.max) * 100) : 0;
        html += '<div class="perf-bar"><span class="perf-bar__label">' + esc(label) + '</span>';
        html += '<div class="perf-bar__track"><i style="--pct:' + pct + '%"></i></div>';
        html += '<span class="perf-bar__val">' + val + (b.unit ? ' ' + b.unit : '') + '</span></div>';
      });
      html += '</div></div>';
    });

    html += '</div>';
    return html;
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  }
})();
