/**
 * Messaggio motivazionale post-allenamento — ultimo messaggio da /data/daily-messages.json
 */
(function () {
  var root = document.querySelector("[data-daily-message]");
  if (!root) return;

  fetch("/data/daily-messages.json")
    .then(function (r) {
      if (!r.ok) throw new Error("fetch");
      return r.json();
    })
    .then(function (data) {
      var messages = (data.messages || []).slice().sort(function (a, b) {
        return b.date.localeCompare(a.date);
      });
      if (!messages.length) return;

      var latest = messages[0];
      var label = root.querySelector(".hero__daily-label");
      var text = root.querySelector(".hero__daily-text");

      if (label) {
        var when = formatDate(latest.date);
        if (latest.time) when += " · ore " + latest.time;
        label.textContent = "Messaggio di " + when;
      }
      if (text) text.textContent = latest.text;

      if (latest.session_id) {
        root.setAttribute("data-session", latest.session_id);
      }
      root.hidden = false;
    })
    .catch(function () {
      root.remove();
    });

  function formatDate(iso) {
    var parts = iso.split("-");
    if (parts.length !== 3) return iso;
    var months = [
      "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
      "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"
    ];
    return parseInt(parts[2], 10) + " " + months[parseInt(parts[1], 10) - 1];
  }
})();
