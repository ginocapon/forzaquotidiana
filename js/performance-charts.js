/**
 * Grafici performance mensili — legge data/performance-monthly.json
 * Usato in /allenamenti/trimestre-…/#statistiche
 */
(function () {
  var root = document.getElementById("perf-charts");
  if (!root) return;

  fetch("/data/performance-monthly.json")
    .then(function (r) { return r.json(); })
    .then(render)
    .catch(function () {
      root.innerHTML = "<p><small>Grafici performance non disponibili.</small></p>";
    });

  function render(data) {
    var month = data.months.find(function (m) { return m.sessioni_con_export > 0; });
    if (!month) return;
    var chart = data.charts[month.month];
    if (!chart) return;

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
    root.innerHTML = html;
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  }
})();
