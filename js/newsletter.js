/**
 * Newsletter gate — La Forza Quotidiana
 * Backend: Google Apps Script + Gmail (ginocapon@gmail.com)
 * Configura data-script-url in allenamenti/newsletter/index.html
 */
(function () {
  var STORAGE_KEY = "fq_newsletter_ok";
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

  function markSubscribed(email) {
    try {
      localStorage.setItem(STORAGE_KEY, email || "1");
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

  function consumeReturnParams() {
    var params = new URLSearchParams(window.location.search);
    if (params.get("sub") !== "1") return false;

    var email = params.get("e") || "";
    try {
      email = decodeURIComponent(email);
    } catch (e) { /* ignore */ }

    markSubscribed(email);
    showSuccess(email);

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
    markSubscribed: markSubscribed
  };

  consumeReturnParams();

  if (document.body.dataset.newsletterGate === "schede-peso" && !isSubscribed()) {
    var next = encodeURIComponent(window.location.pathname);
    window.location.replace("/allenamenti/newsletter/?from=schede-peso&next=" + next);
    return;
  }

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

  if (!form) return;

  var nextInput = document.getElementById("newsletter-next");
  if (nextInput) {
    nextInput.value = params.get("next") || "/allenamenti/schede-peso/trimestre-giugno-luglio-agosto-2026/";
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

  var demoBtn = document.getElementById("newsletter-demo");
  if (demoBtn) {
    demoBtn.addEventListener("click", function () {
      markSubscribed("demo@forzaquotidiana.it");
      showSuccess("demo@forzaquotidiana.it");
      var next = params.get("next") || "/allenamenti/schede-peso/trimestre-giugno-luglio-agosto-2026/";
      window.location.href = next;
    });
  }
})();

