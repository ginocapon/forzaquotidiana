/**
 * Grafici progressione pesi per esercizio e per gruppo muscolare
 * data/exercise-progress.json · #progressione-pesi nel trimestre
 */
(function () {
  var root = document.getElementById("exercise-progress-charts");
  var groupRoot = document.getElementById("muscle-group-progress-charts");
  if (!root && !groupRoot) return;

  fetch("/data/exercise-progress.json")
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (root) renderExercises(data, root);
      if (groupRoot) renderMuscleGroups(data, groupRoot);
    })
    .catch(function () {
      if (root) root.innerHTML = "<p><small>Progressione pesi non disponibile.</small></p>";
      if (groupRoot) groupRoot.innerHTML = "<p><small>Progressione gruppi non disponibile.</small></p>";
    });

  function renderExercises(data, container) {
    var exercises = (data.exercises || []).filter(function (ex) {
      return ex.entries && ex.entries.some(function (e) { return e.peso_kg != null; });
    });
    if (!exercises.length) {
      container.innerHTML = "<p><small>Nessun dato peso registrato ancora.</small></p>";
      return;
    }

    var html = '<p class="ex-progress__lead">Registrazione da <time datetime="' + esc(data.started) + '">' + fmtIt(data.started) + '</time> — solo multi-articolari principali. Asse X: data sessione · Asse Y: peso primario (kg) e numero serie.</p>';
    html += '<div class="ex-progress__grid">';

    exercises.forEach(function (ex) {
      html += renderExerciseChart(ex);
    });

    html += '</div>';
    container.innerHTML = html;
  }

  function renderMuscleGroups(data, container) {
    var exercises = (data.exercises || []).filter(function (ex) {
      return ex.entries && ex.entries.some(function (e) { return e.peso_kg != null; });
    });
    if (!exercises.length) {
      container.innerHTML = "<p><small>Nessun dato per gruppo muscolare ancora.</small></p>";
      return;
    }

    var groups = {};
    exercises.forEach(function (ex) {
      var g = ex.gruppo || "Altro";
      if (!groups[g]) {
        groups[g] = { started: ex.started || data.started, exercises: [] };
      }
      groups[g].exercises.push(ex);
      if (ex.started && ex.started < groups[g].started) {
        groups[g].started = ex.started;
      }
    });

    var groupNames = Object.keys(groups).sort();
    var html = '<p class="ex-progress__lead">Vista aggregata per gruppo muscolare — ogni riga è un esercizio tracciato nel gruppo. Data di inizio registrazione per gruppo indicata sotto il titolo.</p>';
    html += '<div class="ex-progress__grid ex-progress__grid--groups">';

    groupNames.forEach(function (name) {
      var group = groups[name];
      html += '<article class="ex-progress-chart ex-progress-chart--group" id="prog-gruppo-' + slug(name) + '">';
      html += '<h3>' + esc(name) + ' <small>da <time datetime="' + esc(group.started) + '">' + fmtIt(group.started) + '</time> · ' + group.exercises.length + ' esercizi</small></h3>';
      html += '<div class="ex-progress-group__exercises">';

      group.exercises.forEach(function (ex) {
        var entries = ex.entries.filter(function (e) { return e.peso_kg != null; });
        if (!entries.length) return;
        var maxW = Math.max.apply(null, entries.map(function (e) { return e.peso_kg; }));
        var maxS = Math.max.apply(null, entries.map(function (e) { return e.serie || 1; }));

        html += '<div class="ex-progress-group__exercise">';
        html += '<h4>' + esc(ex.nome) + ' <small>Scheda ' + ex.scheda + '</small></h4>';
        html += '<div class="ex-progress-chart__plot ex-progress-chart__plot--compact" role="img" aria-label="Andamento ' + esc(ex.nome) + '">';

        entries.forEach(function (e) {
          var wPct = maxW ? Math.round((e.peso_kg / maxW) * 100) : 0;
          var sPct = maxS ? Math.round(((e.serie || 1) / maxS) * 100) : 0;
          html += '<div class="ex-progress-point">';
          html += '<time class="ex-progress-point__date" datetime="' + esc(e.date) + '">' + fmtShort(e.date) + '</time>';
          html += '<div class="ex-progress-point__bars">';
          html += '<span class="ex-progress-bar ex-progress-bar--weight" style="--pct:' + wPct + '%" title="' + e.peso_kg + ' kg"><i></i><em>' + e.peso_kg + ' kg</em></span>';
          html += '<span class="ex-progress-bar ex-progress-bar--series" style="--pct:' + sPct + '%" title="' + (e.serie || "—") + ' serie"><i></i><em>' + (e.serie || "—") + ' ser.</em></span>';
          html += '</div>';
          if (e.serie_label) html += '<span class="ex-progress-point__label">' + esc(e.serie_label) + '</span>';
          if (e.tut) html += '<span class="ex-progress-point__tut">TUT ' + esc(e.tut) + '</span>';
          html += '</div>';
        });

        html += '</div></div>';
      });

      html += '</div>';
      html += '<p class="ex-progress-chart__legend"><span class="ex-progress-legend ex-progress-legend--weight">▮ Peso primario (kg)</span> <span class="ex-progress-legend ex-progress-legend--series">▮ Serie</span></p>';
      html += '</article>';
    });

    html += '</div>';
    container.innerHTML = html;
  }

  function renderExerciseChart(ex) {
    var entries = ex.entries.filter(function (e) { return e.peso_kg != null; });
    if (!entries.length) return "";
    var maxW = Math.max.apply(null, entries.map(function (e) { return e.peso_kg; }));
    var maxS = Math.max.apply(null, entries.map(function (e) { return e.serie || 1; }));
    var started = ex.started || (entries[0] && entries[0].date);

    var html = '<article class="ex-progress-chart" id="prog-' + esc(ex.id) + '">';
    html += '<h3>' + esc(ex.nome) + ' <small>Scheda ' + ex.scheda + ' · ' + esc(ex.gruppo);
    if (started) html += ' · da ' + fmtIt(started);
    html += '</small></h3>';
    html += '<div class="ex-progress-chart__plot" role="img" aria-label="Andamento peso ' + esc(ex.nome) + '">';

    entries.forEach(function (e) {
      var wPct = maxW ? Math.round((e.peso_kg / maxW) * 100) : 0;
      var sPct = maxS ? Math.round(((e.serie || 1) / maxS) * 100) : 0;
      html += '<div class="ex-progress-point">';
      html += '<time class="ex-progress-point__date" datetime="' + esc(e.date) + '">' + fmtShort(e.date) + '</time>';
      html += '<div class="ex-progress-point__bars">';
      html += '<span class="ex-progress-bar ex-progress-bar--weight" style="--pct:' + wPct + '%" title="' + e.peso_kg + ' kg"><i></i><em>' + e.peso_kg + ' kg</em></span>';
      html += '<span class="ex-progress-bar ex-progress-bar--series" style="--pct:' + sPct + '%" title="' + (e.serie || "—") + ' serie"><i></i><em>' + (e.serie || "—") + ' ser.</em></span>';
      html += '</div>';
      if (e.serie_label) html += '<span class="ex-progress-point__label">' + esc(e.serie_label) + '</span>';
      if (e.tut) html += '<span class="ex-progress-point__tut">TUT ' + esc(e.tut) + '</span>';
      html += '</div>';
    });

    html += '</div>';
    html += '<p class="ex-progress-chart__legend"><span class="ex-progress-legend ex-progress-legend--weight">▮ Peso primario (kg)</span> <span class="ex-progress-legend ex-progress-legend--series">▮ Serie</span></p>';
    html += '</article>';
    return html;
  }

  function slug(s) {
    return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function fmtIt(iso) {
    var p = iso.split("-");
    return p[2] + "/" + p[1] + "/" + p[0];
  }

  function fmtShort(iso) {
    var p = iso.split("-");
    return p[2] + "/" + p[1];
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  }
})();
