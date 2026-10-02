#!/usr/bin/env node
/** Scaffold sessione 2026-10-01-cardio — tapis, giorno senza pesi */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderTsbModule } from "./tsb-render.mjs";

const REPO = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const data = JSON.parse(fs.readFileSync(path.join(REPO, "data/training-load.json"), "utf8"));
const tsbHtml = renderTsbModule(data, "2026-10-01", { sessionId: "sess-2026-10-01-cardio" });

const dir = path.join(REPO, "allenamenti/sessioni/2026-10-01-cardio");
fs.mkdirSync(dir, { recursive: true });

const html = `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<title>1 ottobre 2026 — Cardio tapis roulant | Sessione · La Forza Quotidiana</title>
<meta name="description" content="Primo slot cardio 1 ottobre 2026 ore 20:01: tapis 1,30 km in 21 min, passo 16'02/km, carico +25. TSB −4 Bilanciato. Giorno senza pesistica.">
<link rel="canonical" href="https://forzaquotidiana.it/allenamenti/sessioni/2026-10-01-cardio/">
<meta property="og:type" content="article">
<meta property="og:site_name" content="La Forza Quotidiana">
<meta property="og:locale" content="it_IT">
<meta property="og:url" content="https://forzaquotidiana.it/allenamenti/sessioni/2026-10-01-cardio/">
<meta property="og:title" content="1 ottobre 2026 — Cardio tapis roulant">
<meta property="og:image" content="https://forzaquotidiana.it/img/allenamenti/amazfit/2026-10-01-cardio-tsb.webp">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="1 ottobre 2026 — Cardio tapis">
<meta name="twitter:description" content="21 min, 1,30 km, passo 16'02/km, carico +25, TSB −4 Bilanciato.">
<meta name="twitter:image" content="https://forzaquotidiana.it/img/allenamenti/amazfit/2026-10-01-cardio-tsb.webp">
<link rel="preload" as="image" href="/img/allenamenti/session-hero-bg.webp">
<link rel="stylesheet" href="/css/styles.css?v=70">
</head>
<body class="theme-allenamenti session-page--guile" data-trimestre-url="/admin/">
<a class="skip-link" href="#contenuto">Vai al contenuto</a>
<header class="site-header">
  <div class="wrap">
    <a class="logo" href="/">La Forza Quotidiana<small>Gino Capon</small></a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-principale">Menu</button>
    <nav class="site-nav" id="nav-principale" aria-label="Principale">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/chi-sono/">Chi sono</a></li>
        <li><a href="/allenamenti/" aria-current="page">Allenamenti</a></li>
        <li><a href="/admin/" data-nav="schede">Schede</a></li>
      </ul>
    </nav>
  </div>
</header>

<main id="contenuto" class="session-page">
  <header class="session-hero">
    <div class="wrap">
      <nav class="breadcrumb" aria-label="Percorso">
        <a href="/allenamenti/">Allenamenti</a> · <a href="/allenamenti/sessioni/">Sessioni</a> · 1 ottobre 2026
      </nav>
      <div class="session-hero__top">
        <span class="session-hero__badge">Cardio</span>
        <time class="session-hero__time" datetime="2026-10-01T20:01">1 ottobre 2026 · ore 20:01 · giovedì</time>
      </div>
      <h1>Tapis roulant — giorno senza pesi</h1>
      <p class="session-hero__sub">21 min, 1,30 km, passo 16'02″/km, carico Zepp +25 — TSB −4 Bilanciato · sonno 1:38 · HRV 38</p>
      <dl class="session-kpis" aria-label="Metriche principali sessione">
        <div class="session-kpis__item session-kpis__item--accent"><dt>Durata</dt><dd>00:21:00</dd></div>
        <div class="session-kpis__item"><dt>Distanza</dt><dd>1,30 km</dd></div>
        <div class="session-kpis__item"><dt>Passo</dt><dd>16'02″</dd></div>
        <div class="session-kpis__item"><dt>Carico</dt><dd>+25</dd></div>
        <div class="session-kpis__item"><dt>TSB</dt><dd>−4</dd></div>
        <div class="session-kpis__item"><dt>Sforzo</dt><dd>56/27</dd></div>
      </dl>
      <p class="session-hero__refs">Slot cardio (non è A1–B2) · Precedente pesi: <a href="/allenamenti/sessioni/2026-09-30-b1/">B1 · 30 settembre</a></p>
    </div>
  </header>

  <div class="wrap prose prose--wide session-body">
    <!-- TSB-START -->
    <section class="session-panel session-panel--tsb" aria-labelledby="tsb-modulo-2026-10-01">
      <span class="session-panel__label" id="tsb-modulo-2026-10-01">Fitness · fatica · riposo</span>
      ${tsbHtml}
    </section>
    <!-- TSB-END -->

    <!-- GUILE-START -->
    <section class="session-panel session-panel--guile guile-panel" aria-labelledby="guile-2026-10-01-cardio">
      <span class="session-panel__label" id="guile-2026-10-01-cardio">Spirito Guile · umorismo pro</span>
      <p class="guile-panel__lead">Tre illustrazioni IA — <strong>una fotorealistica</strong> (tapis, viso Gino), due stile arcade. Export Zepp = fonte numerica.</p>
      <div class="guile-strip guile-strip--3" aria-label="Galleria illustrazioni cardio">
        <figure class="guile-card" style="--guile-i:0">
          <span class="ai-photo-wrap guile-card__frame">
            <img src="/img/allenamenti/guile/2026-10-01-cardio-realistic.webp" alt="Gino sul tapis roulant — fotorealistica sessione cardio 1 ottobre" width="640" height="360" loading="lazy" data-ai="generated">
            <span class="ai-photo-mark" aria-hidden="true">Foto AI</span>
          </span>
          <figcaption>Tapis · fotorealistica</figcaption>
        </figure>
        <figure class="guile-card" style="--guile-i:1">
          <span class="ai-photo-wrap guile-card__frame">
            <img src="/img/allenamenti/guile/2026-10-01-cardio-arcade.webp" alt="Tapis stile arcade Guile — cardio 1 ottobre" width="640" height="360" loading="lazy" data-ai="generated">
            <span class="ai-photo-mark" aria-hidden="true">Foto AI</span>
          </span>
          <figcaption>Camminata · arcade</figcaption>
        </figure>
        <figure class="guile-card" style="--guile-i:2">
          <span class="ai-photo-wrap guile-card__frame">
            <img src="/img/allenamenti/guile/2026-10-01-cardio-arcade-recovery.webp" alt="Recovery post tapis stile arcade" width="640" height="360" loading="lazy" data-ai="generated">
            <span class="ai-photo-mark" aria-hidden="true">Foto AI</span>
          </span>
          <figcaption>Recovery · cardio</figcaption>
        </figure>
      </div>
      <p class="fig-credit guile-panel__credit"><span class="ai-badge" aria-hidden="true">IA</span> Immagini generate con intelligenza artificiale · <a href="/trasparenza-ai/">Trasparenza</a></p>
    </section>
    <!-- GUILE-END -->

    <section class="session-panel" aria-labelledby="nota-sessione">
      <span class="session-panel__label" id="nota-sessione">Nota di Gino</span>
      <p class="session-note">Da ottobre, nei giorni <strong>senza pesistica</strong>, entra il tapis. Prima uscita: <strong>giovedì 1 ottobre</strong>, <strong>20:01–20:22</strong>, il giorno dopo il B1. Camminata <strong>1,30 km</strong> in <strong>21:00</strong>, passo <strong>16'02″/km</strong>, carico Zepp <strong>+25</strong>. Non è una seduta A1–B2: stesso cruscotto readiness, dati solo cardio.</p>
      <p class="session-note">Notte cortissima: sonno <strong>1:38</strong> (01:27–03:05, score <strong>42</strong> Fai attenzione) + pisolini <strong>0:19</strong> e <strong>0:49</strong>. HRV <strong>38 Buono</strong> (baseline 42), HybridCharge <strong>26 Basso → 5</strong>. TSB <strong>−4,0 Bilanciato</strong> (CTL 37 / ATL 41). Sforzo giorno <strong>56/27</strong> (100%).</p>
    </section>

    <section class="session-panel" aria-labelledby="programma-cardio">
      <span class="session-panel__label" id="programma-cardio">Programma</span>
      <h2>Cardio · tapis roulant</h2>
      <p>Camminata su tapis, ritmo conversazionale. Stesso slot nelle giornate off dai pesi: durata e passo simili, niente serie né carichi da sala.</p>
      <table class="scheda-table">
        <caption class="visually-hidden">Log cardio 1 ottobre</caption>
        <thead>
          <tr><th>Esercizio</th><th>Distanza</th><th>Tempo</th><th>Passo</th><th>Carico Zepp</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Tapis roulant · camminata</td>
            <td>1,30 km</td>
            <td>00:21:00</td>
            <td>16'02″/km</td>
            <td>+25</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="session-panel session-panel--readiness" aria-labelledby="readiness-title">
      <span class="session-panel__label">Readiness · sonno · HRV</span>
      <h2 id="readiness-title">Metriche giornata · Zepp · 01/10</h2>
      <p class="session-panel__intro">Sonno <strong>1:38</strong> (score 42 Fai attenzione), HRV <strong>38 Buono</strong>, FC riposo <strong>55</strong>, HybridCharge <strong>26 Basso</strong> → <strong>5</strong>. TSB <strong>−4,0 Bilanciato</strong>, sforzo <strong>56/27</strong>.</p>

      <div class="amazfit-tsb-hero" aria-label="Modulo TSB — 1 ottobre">
        <figure class="phone-shot phone-shot--landscape phone-shot--solo">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-10-01-cardio-tsb.webp" alt="Modulo TSB Zepp — CTL 37 ATL 41 TSB −4 Bilanciato, 1 ottobre" width="1024" height="473" loading="eager" fetchpriority="high">
          </div>
          <figcaption>TSB · 01/10 · Bilanciato · CTL 37 · ATL 41</figcaption>
        </figure>
      </div>

      <div class="amazfit-gallery" aria-label="Screenshot Zepp — readiness 1 ottobre">
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-10-01-cardio-hybridcharge.webp" alt="HybridCharge 1 ottobre — risveglio 26 Basso, tapis −3 alle 20:01–20:22" width="390" height="844" loading="lazy">
          </div>
          <figcaption>HybridCharge · 26 Basso · tapis −3</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-10-01-cardio-hybridcharge-analisi.webp" alt="Analisi HybridCharge — 5 sera da 26 al mattino" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Analisi HC · 5 ↔ 26</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-10-01-cardio-readiness-metriche.webp" alt="Trend 1 ottobre — HRV 38, RHR 55, HC al risveglio 26" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Trend 7 gg · HRV 38 · RHR 55</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-10-01-cardio-hrv.webp" alt="HRV 1 ottobre — 38 ms Buono, baseline 42" width="390" height="844" loading="lazy">
          </div>
          <figcaption>HRV 38 · Buono</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-10-01-cardio-sonno-score.webp" alt="Sonno 1 ottobre — 1:38 dalle 01:27 alle 03:05, pisolini 0:19 e 0:49" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Durata sonno 1:38 · pisolini</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-10-01-cardio-sonno-metriche.webp" alt="Sonno 1 ottobre — profondo 0:32, REM 0:35, veglia 0:00, regolarità 50%" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Profondo 0:32 · REM 0:35 · 50%</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-10-01-cardio-sonno-insight.webp" alt="Punteggio sonno 42 Fai attenzione — 1 ottobre" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Score sonno 42 · Fai attenzione</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-10-01-cardio-sonno-fc.webp" alt="FC sonno 1 ottobre — media 55 bpm" width="390" height="844" loading="lazy">
          </div>
          <figcaption>FC sonno 55 · 01:27–03:05</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-10-01-cardio-sonno-settimana.webp" alt="Regolarità e durata sonno ultimi 7 giorni — giovedì 1:38" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Settimana sonno · gio 1:38</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-10-01-cardio-sonno-respirazione.webp" alt="Ipopnea 0,6/h e frequenza respiratoria 11 il 1 ottobre" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Ipopnea 0,6 · resp. 11</figcaption>
        </figure>
      </div>

      <div class="amazfit-data" aria-label="Dati readiness estratti">
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Modulo allenamento TSB · 01/10</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>−4,0</strong><span>TSB · Bilanciato</span></div>
            <div class="amazfit-card__cell"><strong>37,0</strong><span>Fitness · CTL</span></div>
            <div class="amazfit-card__cell"><strong>41,0</strong><span>Fatica · ATL</span></div>
            <div class="amazfit-card__cell"><strong>+25</strong><span>Carico tapis</span></div>
            <div class="amazfit-card__cell"><strong>20:01</strong><span>Inizio camminata</span></div>
          </div>
        </div>
        <div class="amazfit-card">
          <p class="amazfit-card__title">Sonno · readiness · 01/10</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>1:38</strong><span>Durata · score 42</span></div>
            <div class="amazfit-card__cell"><strong>01:27</strong><span>A letto</span></div>
            <div class="amazfit-card__cell"><strong>03:05</strong><span>Risveglio</span></div>
            <div class="amazfit-card__cell"><strong>55</strong><span>FC sonno · bpm</span></div>
            <div class="amazfit-card__cell"><strong>56/27</strong><span>Sforzo giornaliero</span></div>
          </div>
        </div>
        <div class="amazfit-card">
          <p class="amazfit-card__title">HRV · FC riposo · 01/10</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>38</strong><span>HRV · ms · Buono</span></div>
            <div class="amazfit-card__cell"><strong>42</strong><span>Baseline</span></div>
            <div class="amazfit-card__cell"><strong>55</strong><span>FC a riposo</span></div>
            <div class="amazfit-card__cell"><strong>26→5</strong><span>HybridCharge</span></div>
          </div>
        </div>
      </div>
    </section>

    <section class="session-panel session-panel--metabolic">
    <section class="metabolic-block" aria-labelledby="metabolic-title">
      <h2 id="metabolic-title">Dati cardio · Amazfit</h2>
      <p class="metabolic-block__device"><strong>Amazfit Active 2 NFC</strong> · sync app Zepp · Tapis roulant</p>
      <p class="amazfit-gallery__lead">Export movimento + sforzo — <strong>nessuna</strong> schermata FC/zone/tecnica in questo batch (a differenza delle sedute pesi). Hero: tapis in panoramica e anello sforzo.</p>
      <div class="amazfit-fc-hero" aria-label="Panoramica movimento — 1 ottobre">
        <figure class="phone-shot phone-shot--full phone-shot--solo">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-10-01-cardio-readiness-panoramica.webp" alt="Panoramica 1 ottobre — tapis 1,30 km, 21:00, 16'02/km, HybridCharge 5, sforzo 100%" width="390" height="844" loading="eager" fetchpriority="high">
          </div>
          <figcaption>Tapis 1,30 km · 21:00 · 16'02″/km</figcaption>
        </figure>
      </div>

      <div class="amazfit-gallery" aria-label="Screenshot Zepp — sforzo 1 ottobre">
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-10-01-cardio-sforzo.webp" alt="Sforzo 1 ottobre — 100% 56/27, tapis +25 dalle 20:01 alle 20:22" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Sforzo 56/27 · tapis +25</figcaption>
        </figure>
      </div>

      <div class="amazfit-data" aria-label="Dati sessione 1 ottobre">
        <div class="amazfit-card">
          <div class="amazfit-card__top">
            <div>
              <div class="amazfit-card__user">ginocapon</div>
              <div class="amazfit-card__meta">1 ott · 20:01 · giovedì · Cardio</div>
            </div>
            <span class="amazfit-card__badge">Tapis</span>
          </div>
          <p class="amazfit-card__title">Riepilogo camminata</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>00:21:00</strong><span>Tempo allenamento</span></div>
            <div class="amazfit-card__cell"><strong>1,30 km</strong><span>Distanza</span></div>
            <div class="amazfit-card__cell"><strong>16'02″</strong><span>Passo / km</span></div>
            <div class="amazfit-card__cell"><strong>+25</strong><span>Carico Zepp</span></div>
            <div class="amazfit-card__cell"><strong>20:01–20:22</strong><span>Finestra</span></div>
            <div class="amazfit-card__cell"><strong>—</strong><span>FC workout · non in export</span></div>
          </div>
        </div>
      </div>

      <p class="metabolic-note"><strong>Analisi.</strong> Slot di recupero attivo dopo il B1: passo da camminata (16'/km), 21 minuti, carico <strong>+25</strong> contro i 147 del giorno prima. TSB scende da −2 a <strong>−4</strong> (CTL 37, ATL ancora 41) ma resta Bilanciato — coerente con una notte da <strong>1:38</strong> e HybridCharge al risveglio <strong>26</strong>. HRV 38 sulla baseline: autonomico ok, volume sonno no. Prossimo tapis: stesso schema; se Gino esporta anche la schermata workout (FC + zone) la mettiamo in hero come sulle sedute pesi. Non è un giorno di forza: è il nuovo rito off-palestra.</p>

      <article class="hr-log hr-log--elevated" data-session="2026-10-01T20:01" data-duration-corrected="false">
        <div class="hr-metrics">
          <div class="hr-metric"><strong>00:21:00</strong><span>Durata</span></div>
          <div class="hr-metric"><strong>1,30</strong><span>km</span></div>
          <div class="hr-metric"><strong>16'02″</strong><span>Passo</span></div>
          <div class="hr-metric"><strong>+25</strong><span>Carico</span></div>
          <div class="hr-metric"><strong>−4</strong><span>TSB</span></div>
          <div class="hr-metric"><strong>—</strong><span>FC media</span></div>
        </div>
      </article>
    </section>
    </section>

    <nav class="session-nav" aria-label="Navigazione sessione">
      <a class="session-nav__primary" href="/allenamenti/sessioni/">← Tutte le sessioni</a>
      <a href="/admin/">Schede · Blocco 1</a>
      <a href="/allenamenti/sessioni/2026-09-30-b1/">← B1 · 30 settembre</a>
    </nav>
    <p class="session-meta-footer">Ultimo aggiornamento: 1 ottobre 2026 · primo slot cardio tapis · export readiness + movimento (senza FC workout)</p>
  </div>
</main>

<footer class="site-footer">
  <div class="wrap"><p>© <span id="y"></span> La Forza Quotidiana · Gino Capon</p></div>
</footer>
<script>document.getElementById("y").textContent = new Date().getFullYear();</script>
<script src="/js/vendor/lenis.min.js" defer></script>
<script src="/js/smooth-scroll.js?v=2" defer></script>
<script src="/js/main.js?v=30" defer></script>
<script src="/js/session-guile.js?v=1" defer></script>
<script src="/js/cookie-consent.js?v=4" defer></script>
<script src="/js/training-load-chart.js?v=3" defer></script>
</body>
</html>
`;

fs.writeFileSync(path.join(dir, "index.html"), html);
console.log("OK allenamenti/sessioni/2026-10-01-cardio/index.html");
