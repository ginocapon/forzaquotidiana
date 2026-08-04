/**
 * Newsletter gate — La Forza Quotidiana
 * Backend: Google Apps Script + Gmail (ginocapon@gmail.com)
 * Scarica PDF richiede iscrizione (localStorage fq_newsletter_ok).
 */
(function () {
  var STORAGE_KEY = "fq_newsletter_ok";
  var NEWSLETTER_PATH = "/allenamenti/newsletter/";
  var DEFAULT_NEXT = "/allenamenti/schede-peso/trimestre-giugno-luglio-agosto-2026/";
  var DEFAULT_PDF =
    "/allenamenti/schede-peso/trimestre-giugno-luglio-agosto-2026/scheda-forza-quotidiana-q3-2026.pdf";
  var DEFAULT_DOWNLOAD_NAME = "Scheda-ForzaQuotidiana-Q3-2026.pdf";

  var form = document.getElementById("newsletter-form");
  var success = document.getElementById("newsletter-success");
  var errorBox = document.getElementById("newsletter-error");

  function isSubscribed() {
    try {
      return !!localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return false;
    }
  }

  /* Nessuna email in localStorage: serve solo sapere che l'iscrizione è avvenuta. */
  function markSubscribed() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch (e) { /* ignore */ }
  }

  function showSuccess(email) {
    if (form) form.hidden = true;
    if (errorBox) errorBox.hidden = true;
    if (success) {
      success.hidden = false;
      var em = document.getElementById("newsletter-success-email");
      if (em && email) em.textContent = email;
    }
  }

  function newsletterGateUrl(from, next) {
    var u = NEWSLETTER_PATH + "?from=" + encodeURIComponent(from || "schede-peso");
    if (next) u += "&next=" + encodeURIComponent(next);
    return u;
  }

  /** Abilita download PDF se iscritto; altrimenti punta al form newsletter. */
  function applyPdfGates() {
    var subscribed = isSubscribed();
    document.querySelectorAll("a.js-scheda-pdf").forEach(function (a) {
      var pdfUrl = a.getAttribute("data-pdf") || DEFAULT_PDF;
      var from = a.getAttribute("data-from") || "schede-peso";
      var next = a.getAttribute("data-next") || DEFAULT_NEXT;
      var downloadName = a.getAttribute("data-download") || DEFAULT_DOWNLOAD_NAME;

      if (subscribed) {
        a.setAttribute("href", pdfUrl);
        a.setAttribute("download", downloadName);
        a.removeAttribute("aria-disabled");
      } else {
        a.setAttribute("href", newsletterGateUrl(from, next));
        a.removeAttribute("download");
      }
    });

    document.querySelectorAll(".js-scheda-print").forEach(function (btn) {
      btn.hidden = !subscribed;
    });
  }

  function consumeReturnParams() {
    var params = new URLSearchParams(window.location.search);
    if (params.get("sub") !== "1") return false;

    var email = params.get("e") || "";
    try {
      email = decodeURIComponent(email);
    } catch (e) { /* ignore */ }

    markSubscribed();
    showSuccess(email);
    applyPdfGates();

    params.delete("sub");
    params.delete("e");
    var qs = params.toString();
    var clean = window.location.pathname + (qs ? "?" + qs : "");
    if (window.history && window.history.replaceState) {
      window.history.replaceState({}, "", clean);
    }
    return true;
  }

  window.fqNewsletter = {
    isSubscribed: isSubscribed,
    markSubscribed: markSubscribed,
    applyPdfGates: applyPdfGates
  };

  consumeReturnParams();
  applyPdfGates();

  if (isSubscribed() && form && success && success.hidden) {
    form.hidden = true;
    success.hidden = false;
  }

  var params = new URLSearchParams(window.location.search);
  var err = params.get("err");
  if (err && errorBox) {
    errorBox.hidden = false;
    errorBox.textContent = err;
  }

  /* Stampa scheda: solo dopo iscrizione (stesso browser). */
  document.querySelectorAll(".js-scheda-print").forEach(function (btn) {
    btn.addEventListener("click", function (ev) {
      if (isSubscribed()) return;
      ev.preventDefault();
      ev.stopImmediatePropagation();
      window.location.href = newsletterGateUrl("scheda-print", DEFAULT_NEXT);
    }, true);
  });

  if (!form) return;

  var nextInput = document.getElementById("newsletter-next");
  if (nextInput) {
    nextInput.value = params.get("next") || DEFAULT_NEXT;
  }

  var fromInput = document.getElementById("newsletter-from");
  if (fromInput) {
    fromInput.value = params.get("from") || "sito";
  }

  form.addEventListener("submit", function (ev) {
    var scriptUrl = form.getAttribute("data-script-url");
    if (!scriptUrl || scriptUrl.indexOf("YOUR_SCRIPT_ID") !== -1) {
      ev.preventDefault();
      if (errorBox) {
        errorBox.hidden = false;
        errorBox.textContent =
          "Modulo non ancora collegato a Gmail. Segui NEWSLETTER-SETUP.md — oppure usa accesso demo in fondo pagina.";
      }
      return;
    }

    form.action = scriptUrl;
    form.method = "POST";
  });
})();
