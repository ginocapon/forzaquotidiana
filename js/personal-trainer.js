(function () {
  var root = document.getElementById('pt-hub');
  if (!root) return;

  fetch('/data/training-app.json')
    .then(function (res) { return res.json(); })
    .then(function (cfg) {
      var base = (cfg.appBaseUrl || '').replace(/\/$/, '');
      var paths = cfg.paths || {};
      root.querySelectorAll('[data-app-link]').forEach(function (el) {
        var key = el.getAttribute('data-app-link');
        var path = paths[key] || '/';
        if (base) el.href = base + path;
      });
      var badge = root.querySelector('[data-pt-status]');
      if (badge && cfg.status) badge.textContent = cfg.status === 'beta' ? 'Beta' : cfg.status;
    })
    .catch(function () { /* static fallbacks remain */ });
})();
