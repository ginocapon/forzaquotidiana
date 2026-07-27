/**
 * Confronto metabolico sessioni Zepp — tabella comparativa
 * #confronto-metabolico nel trimestre
 */
(function () {
  var tableRoot = document.getElementById("metabolic-compare-table");
  if (!tableRoot) return;

  fetch("/data/performance-sessions.json")
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var sessions = (data.sessions || []).filter(function (s) {
        return !s.partial && s.zones && s.fc_media != null && s.effetto_aerobico != null;
      });
      if (!sessions.length) return;
      renderTable(sessions);
    })
    .catch(function () {
      tableRoot.innerHTML = "<p><small>Tabella confronto non disponibile.</small></p>";
    });

  function renderTable(sessions) {
    var rows = sessions.map(function (s) {
      var z = s.zones;
      return {
        id: s.id,
        date: s.date,
        scheda: s.scheda,
        durata: s.durata,
        fc: s.fc_media,
        fcMax: s.fc_max,
        cal: s.calorie,
        carico: s.carico_adjusted != null ? s.carico_adjusted : s.carico,
        aer: s.effetto_aerobico,
        ana: s.effetto_anaerobico,
        zonaDom: dominantZone(z),
        intPct: z.intensiva ? z.intensiva.pct : 0,
        aerPct: z.aerobica ? z.aerobica.pct : 0
      };
    });

    var html = '<div class="table-wrap"><table class="month-stats metabolic-compare-table">';
    html += '<thead><tr><th>Data</th><th>Scheda</th><th>Durata</th><th>FC media</th><th>FC max</th><th>Calorie</th><th>Carico</th><th>Zona dom.</th><th>Aerobico</th><th>Anaerobico</th></tr></thead><tbody>';

    rows.forEach(function (r) {
      html += '<tr>';
      html += '<td><a href="/allenamenti/sessioni/' + esc(r.id) + '/">' + fmtShort(r.date) + '</a></td>';
      html += '<td>' + r.scheda + '</td>';
      html += '<td>' + esc(r.durata || "—") + '</td>';
      html += '<td>' + r.fc + '</td>';
      html += '<td>' + (r.fcMax || "—") + '</td>';
      html += '<td>' + (r.cal || "—") + '</td>';
      html += '<td>' + (r.carico || "—") + '</td>';
      html += '<td>' + esc(r.zonaDom) + ' (' + r.intPct + '% int.)</td>';
      html += '<td>' + r.aer + '</td>';
      html += '<td>' + (r.ana || "—") + '</td>';
      html += '</tr>';
    });

    html += '</tbody></table></div>';
    tableRoot.innerHTML = html;
  }

  function dominantZone(zones) {
    var keys = ["intensiva", "aerobica", "anaerobica", "vo2", "leggera"];
    var best = keys[0];
    var bestPct = 0;
    keys.forEach(function (k) {
      if (zones[k] && zones[k].pct > bestPct) {
        bestPct = zones[k].pct;
        best = k;
      }
    });
    var labels = { intensiva: "Intensiva", aerobica: "Aerobica", anaerobica: "Anaerobica", vo2: "VO₂ max", leggera: "Leggera" };
    return labels[best] || best;
  }

  function fmtShort(iso) {
    var p = iso.split("-");
    return p[2] + "/" + p[1];
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  }
})();
