/** Log accesso scheda + stampa — invia conteggio anonimo al Foglio Google */
(function () {
  var LOG_KEY = "fq_scheda_logged_session";
  var form = document.getElementById("newsletter-form");
  var scriptUrl = form ? form.getAttribute("data-script-url") : null;

  function getLogEndpoint() {
    var fromBody = document.body.getAttribute("data-script-url");
    if (fromBody && fromBody.indexOf("YOUR_SCRIPT_ID") === -1) return fromBody;
    if (scriptUrl && scriptUrl.indexOf("YOUR_SCRIPT_ID") === -1) return scriptUrl;
    var meta = document.querySelector("[data-script-url]");
    if (meta) return meta.getAttribute("data-script-url");
    return null;
  }

  function logEvent(tipo) {
    try {
      if (sessionStorage.getItem(LOG_KEY)) return;
    } catch (e) { /* ignore */ }

    var base = getLogEndpoint();
    if (!base) return;

    var url = base + "?action=log&tipo=" + encodeURIComponent(tipo || "scheda_apertura");
    try {
      sessionStorage.setItem(LOG_KEY, "1");
    } catch (e) { /* ignore */ }

    var img = new Image();
    img.src = url;
  }

  var printBtn = document.getElementById("scheda-print-btn");
  if (printBtn) {
    printBtn.addEventListener("click", function () {
      logEvent("scheda_stampa");
      window.print();
    });
  }

  if (document.body.classList.contains("schede-peso")) {
    logEvent("scheda_apertura");
  }
})();
