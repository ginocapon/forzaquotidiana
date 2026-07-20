(function () {
  "use strict";

  var CONSENT_COOKIE = "fq_consent";
  var PRIVACY_KEY = "fq_privacy_ack";
  var CONSENT_VERSION = "1";
  var CONSENT_MAX_AGE = 31536000;

  var CONTENT_PATH = /^\/(diario|allenamenti|chi-sono)(\/|$)/;
  var LEGAL_PATH = /^\/(privacy|cookie)(\/|$)/;

  function readCookie(name) {
    var match = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "=([^;]*)"));
    return match ? decodeURIComponent(match[1]) : "";
  }

  function writeCookie(name, value, maxAge) {
    var secure = location.protocol === "https:" ? ";Secure" : "";
    document.cookie =
      name + "=" + encodeURIComponent(value) +
      ";path=/;max-age=" + maxAge +
      ";SameSite=Lax" + secure;
  }

  function getConsent() {
    var raw = readCookie(CONSENT_COOKIE);
    if (!raw) return null;
    try {
      var data = JSON.parse(raw);
      if (data.v !== CONSENT_VERSION) return null;
      return data;
    } catch (e) {
      return null;
    }
  }

  function setConsent(choices) {
    var payload = {
      v: CONSENT_VERSION,
      necessary: true,
      analytics: !!choices.analytics,
      ts: new Date().toISOString()
    };
    writeCookie(CONSENT_COOKIE, JSON.stringify(payload), CONSENT_MAX_AGE);
    applyConsent(payload);
    document.dispatchEvent(new CustomEvent("fq:consent-updated", { detail: payload }));
  }

  function hasPrivacyAck() {
    try {
      return localStorage.getItem(PRIVACY_KEY) === CONSENT_VERSION;
    } catch (e) {
      return readCookie(CONSENT_COOKIE) !== "";
    }
  }

  function setPrivacyAck() {
    try {
      localStorage.setItem(PRIVACY_KEY, CONSENT_VERSION);
    } catch (e) {
      /* fallback: cookie consenso sufficiente */
    }
  }

  function applyConsent(consent) {
    if (consent && consent.analytics) {
      loadAnalytics();
    }
  }

  function loadAnalytics() {
    /* Riservato: GA/Matomo solo dopo consenso esplicito categoria analitici */
  }

  function isContentPage() {
    return CONTENT_PATH.test(window.location.pathname);
  }

  function isLegalPage() {
    return LEGAL_PATH.test(window.location.pathname);
  }

  function isContentHref(href) {
    try {
      var url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) return false;
      return CONTENT_PATH.test(url.pathname);
    } catch (e) {
      return false;
    }
  }

  function injectFooterLegal() {
    var footer = document.querySelector(".site-footer .wrap");
    if (!footer || footer.querySelector(".footer-legal")) return;
    var legal = document.createElement("p");
    legal.className = "footer-legal";
    legal.innerHTML =
      '<a href="/privacy/">Privacy Policy</a> · ' +
      '<a href="/cookie/">Cookie Policy</a> · ' +
      '<button type="button" class="footer-legal__btn" id="fq-manage-cookies">Gestisci cookie</button>';
    footer.appendChild(legal);
    var btn = document.getElementById("fq-manage-cookies");
    if (btn) btn.addEventListener("click", openPreferences);
  }

  function createBanner() {
    if (document.getElementById("fq-cookie-banner")) return;
    var banner = document.createElement("aside");
    banner.id = "fq-cookie-banner";
    banner.className = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Informativa cookie e privacy");
    banner.setAttribute("aria-live", "polite");
    banner.hidden = true;
    banner.innerHTML =
      '<div class="cookie-banner__inner wrap">' +
        '<p class="cookie-banner__text">' +
          'Utilizziamo cookie tecnici necessari e, previo consenso, cookie analitici anonimi. ' +
          'I contenuti del diario comportano trattamento di dati di navigazione secondo la ' +
          '<a href="/privacy/">Privacy Policy</a> e la <a href="/cookie/">Cookie Policy</a> ' +
          '(Reg. UE 2016/679 e normativa italiana).' +
        '</p>' +
        '<div class="cookie-banner__actions">' +
          '<button type="button" class="btn btn-ghost cookie-banner__btn" data-consent="reject">Solo necessari</button>' +
          '<button type="button" class="btn btn-ghost cookie-banner__btn" data-consent="prefs">Personalizza</button>' +
          '<button type="button" class="btn btn-primary cookie-banner__btn" data-consent="accept">Accetta tutti</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(banner);

    banner.addEventListener("click", function (ev) {
      var btn = ev.target.closest("[data-consent]");
      if (!btn) return;
      var action = btn.getAttribute("data-consent");
      if (action === "accept") {
        setConsent({ analytics: true });
        setPrivacyAck();
        hideBanner();
      } else if (action === "reject") {
        setConsent({ analytics: false });
        hideBanner();
      } else if (action === "prefs") {
        openPreferences();
      }
    });
  }

  function showBanner() {
    var banner = document.getElementById("fq-cookie-banner");
    if (banner) {
      banner.hidden = false;
      banner.classList.add("is-visible");
    }
  }

  function hideBanner() {
    var banner = document.getElementById("fq-cookie-banner");
    if (banner) {
      banner.classList.remove("is-visible");
      banner.hidden = true;
    }
  }

  function openPreferences() {
    var modal = document.getElementById("fq-cookie-prefs");
    var consent = getConsent() || { analytics: false };

    if (modal) {
      modal.hidden = false;
      modal.classList.add("is-visible");
      var chk = modal.querySelector("#fq-analytics-opt");
      if (chk) chk.checked = !!consent.analytics;
      return;
    }

    modal = document.createElement("div");
    modal.id = "fq-cookie-prefs";
    modal.className = "cookie-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "fq-prefs-title");
    modal.innerHTML =
      '<div class="cookie-modal__backdrop" data-close="prefs" tabindex="-1"></div>' +
      '<div class="cookie-modal__panel" role="document">' +
        '<h2 id="fq-prefs-title">Preferenze cookie</h2>' +
        '<p>Puoi modificare le scelte in qualsiasi momento. I cookie necessari garantiscono funzioni base e memorizzano questa preferenza.</p>' +
        '<div class="cookie-pref">' +
          '<div><strong>Necessari (sempre attivi)</strong><p>Consenso cookie, sicurezza, preferenze essenziali. Base: legittimo interesse / necessità tecnica.</p></div>' +
          '<span class="cookie-pref__tag">Obbligatori</span>' +
        '</div>' +
        '<label class="cookie-pref cookie-pref--toggle">' +
          '<div><strong>Analitici (opzionali)</strong><p>Statistiche aggregate e anonime sulle visite, se attivati in futuro.</p></div>' +
          '<input type="checkbox" id="fq-analytics-opt"' + (consent.analytics ? " checked" : "") + '>' +
        '</label>' +
        '<p class="cookie-modal__legal"><a href="/cookie/">Cookie Policy</a> · <a href="/privacy/">Privacy Policy</a></p>' +
        '<div class="cookie-modal__actions">' +
          '<button type="button" class="btn btn-ghost" data-close="prefs">Chiudi</button>' +
          '<button type="button" class="btn btn-primary" id="fq-save-prefs">Salva preferenze</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);
    modal.classList.add("is-visible");

    modal.addEventListener("click", function (ev) {
      if (ev.target.closest("[data-close='prefs']")) {
        modal.classList.remove("is-visible");
        modal.hidden = true;
      }
    });

    document.getElementById("fq-save-prefs").addEventListener("click", function () {
      setConsent({ analytics: document.getElementById("fq-analytics-opt").checked });
      hideBanner();
      modal.classList.remove("is-visible");
      modal.hidden = true;
    });
  }

  function openPrivacyModal(targetHref) {
    var modal = document.getElementById("fq-privacy-gate");
    if (modal) {
      modal.hidden = false;
      modal.classList.add("is-visible");
      modal.dataset.href = targetHref || "";
      var check = modal.querySelector("#fq-privacy-check");
      var cont = modal.querySelector("#fq-privacy-continue");
      if (check) check.checked = false;
      if (cont) cont.disabled = true;
      return;
    }

    modal = document.createElement("div");
    modal.id = "fq-privacy-gate";
    modal.className = "cookie-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "fq-privacy-title");
    modal.dataset.href = targetHref || "";
    modal.innerHTML =
      '<div class="cookie-modal__backdrop" data-close="privacy" tabindex="-1"></div>' +
      '<div class="cookie-modal__panel" role="document">' +
        '<h2 id="fq-privacy-title">Informativa prima dell&apos;accesso ai contenuti</h2>' +
        '<p>Stai per consultare contenuti personali (diario, allenamenti, biografia). ' +
        'La navigazione comporta trattamento di dati tecnici (es. indirizzo IP, log di sistema) ' +
        'da parte dell&apos;hosting, come descritto nell&apos;informativa privacy ai sensi degli artt. 13-14 del GDPR.</p>' +
        '<ul class="cookie-modal__list">' +
          '<li><strong>Titolare:</strong> Gino Capon — La Forza Quotidiana</li>' +
          '<li><strong>Contatto:</strong> <a href="mailto:ginocapon@gmail.com">ginocapon@gmail.com</a></li>' +
          '<li><strong>Finalità:</strong> erogazione del sito, sicurezza, preferenze cookie</li>' +
          '<li><strong>Diritti:</strong> accesso, rettifica, cancellazione, limitazione, opposizione, reclamo al Garante</li>' +
        '</ul>' +
        '<p><a href="/privacy/" target="_blank" rel="noopener">Privacy Policy completa</a> · ' +
        '<a href="/cookie/" target="_blank" rel="noopener">Cookie Policy</a></p>' +
        '<label class="cookie-pref cookie-pref--ack">' +
          '<input type="checkbox" id="fq-privacy-check">' +
          '<span>Dichiaro di aver letto l&apos;informativa privacy e acconsento alla prosecuzione della navigazione sui contenuti</span>' +
        '</label>' +
        '<div class="cookie-modal__actions">' +
          '<button type="button" class="btn btn-ghost" data-close="privacy">Annulla</button>' +
          '<button type="button" class="btn btn-primary" id="fq-privacy-continue" disabled>Continua</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);
    modal.classList.add("is-visible");

    var check = document.getElementById("fq-privacy-check");
    var cont = document.getElementById("fq-privacy-continue");
    check.addEventListener("change", function () {
      cont.disabled = !check.checked;
    });

    modal.addEventListener("click", function (ev) {
      if (ev.target.closest("[data-close='privacy']")) {
        modal.classList.remove("is-visible");
        modal.hidden = true;
      }
    });

    cont.addEventListener("click", function () {
      if (!check.checked) return;
      setPrivacyAck();
      if (!getConsent()) {
        setConsent({ analytics: false });
        hideBanner();
      }
      var href = modal.dataset.href;
      modal.classList.remove("is-visible");
      modal.hidden = true;
      if (href) window.location.href = href;
    });
  }

  function injectContentNotice() {
    if (!isContentPage() || isLegalPage()) return;
    var main = document.getElementById("contenuto");
    if (!main || main.querySelector(".privacy-content-notice")) return;
    var notice = document.createElement("aside");
    notice.className = "privacy-content-notice wrap";
    notice.setAttribute("role", "note");
    notice.innerHTML =
      '<p>Contenuto editoriale — trattamento dati di navigazione secondo ' +
      '<a href="/privacy/">Privacy Policy</a> (GDPR). ' +
      '<button type="button" class="privacy-content-notice__btn" id="fq-notice-prefs">Gestisci cookie</button></p>';
    main.insertBefore(notice, main.firstChild);
    var prefsBtn = document.getElementById("fq-notice-prefs");
    if (prefsBtn) prefsBtn.addEventListener("click", openPreferences);
  }

  function interceptContentLinks() {
    document.addEventListener("click", function (ev) {
      var link = ev.target.closest("a[href]");
      if (!link) return;
      if (link.target === "_blank") return;
      if (link.hasAttribute("download")) return;
      var hrefAttr = link.getAttribute("href");
      if (!hrefAttr || hrefAttr.charAt(0) === "#") return;
      if (!isContentHref(link.href)) return;
      if (hasPrivacyAck()) return;

      ev.preventDefault();
      openPrivacyModal(hrefAttr);
    });
  }

  function init() {
    createBanner();
    injectFooterLegal();
    injectContentNotice();
    interceptContentLinks();

    document.addEventListener("fq:open-prefs", openPreferences);

    var consent = getConsent();
    if (consent) {
      applyConsent(consent);
    } else if (!isLegalPage()) {
      window.setTimeout(showBanner, 600);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
