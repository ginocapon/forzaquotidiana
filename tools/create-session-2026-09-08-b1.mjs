#!/usr/bin/env node
/** Scaffold sessione 2026-09-08-b1 — martedì Blocco 1 gambe */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderTsbModule } from "./tsb-render.mjs";

const REPO = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const data = JSON.parse(fs.readFileSync(path.join(REPO, "data/training-load.json"), "utf8"));
const tsbHtml = renderTsbModule(data, "2026-09-08", { sessionId: "sess-2026-09-08-b1" });

const dir = path.join(REPO, "allenamenti/sessioni/2026-09-08-b1");
fs.mkdirSync(dir, { recursive: true });

const html = `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<title>8 settembre 2026 — B1 gambe · polpacci · braccia | Sessione · La Forza Quotidiana</title>
<meta name="description" content="Sessione 8 settembre 2026 ore 12:51: B1 Blocco 1. 23 serie, 82 min, carico 127, FC 116, 679 kcal. Leg day settimana 2.">
<link rel="canonical" href="https://forzaquotidiana.it/allenamenti/sessioni/2026-09-08-b1/">
<meta property="og:type" content="article">
<meta property="og:site_name" content="La Forza Quotidiana">
<meta property="og:locale" content="it_IT">
<meta property="og:url" content="https://forzaquotidiana.it/allenamenti/sessioni/2026-09-08-b1/">
<meta property="og:title" content="8 settembre 2026 — B1 · gambe · polpacci · braccia">
<meta property="og:image" content="https://forzaquotidiana.it/img/allenamenti/amazfit/2026-09-08-b1-riepilogo.webp">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="8 settembre 2026 — B1 · leg day Blocco 1">
<meta name="twitter:description" content="82 min, 23 serie, carico 127, FC 116, sonno 5:23 — export parziale.">
<meta name="twitter:image" content="https://forzaquotidiana.it/img/allenamenti/amazfit/2026-09-08-b1-riepilogo.webp">
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
        <a href="/allenamenti/">Allenamenti</a> · <a href="/allenamenti/sessioni/">Sessioni</a> · 8 settembre 2026
      </nav>
      <div class="session-hero__top">
        <span class="session-hero__badge">B1</span>
        <time class="session-hero__time" datetime="2026-09-08T12:51">8 settembre 2026 · ore 12:51 · martedì</time>
      </div>
      <h1>Gambe · polpacci · braccia — B1 Blocco 1</h1>
      <p class="session-hero__sub">82 min, carico 127, FC 116, 679 kcal — 23 serie · HRV 43 Buono · sonno 5:23 · TSB -14 Ottimale</p>
      <dl class="session-kpis" aria-label="Metriche principali sessione">
        <div class="session-kpis__item session-kpis__item--accent"><dt>Durata</dt><dd>01:22:24</dd></div>
        <div class="session-kpis__item"><dt>FC media</dt><dd>116</dd></div>
        <div class="session-kpis__item"><dt>Calorie</dt><dd>679</dd></div>
        <div class="session-kpis__item"><dt>Carico</dt><dd>127</dd></div>
        <div class="session-kpis__item"><dt>Serie</dt><dd>23</dd></div>
        <div class="session-kpis__item"><dt>Recupero</dt><dd>44:49</dd></div>
      </dl>
      <p class="session-hero__refs">Scheda di riferimento: <a href="/admin/"><strong>B1</strong> · Blocco 1 · Ipertrofia accumulo</a> · Precedente: <a href="/allenamenti/sessioni/2026-09-07-a1/">A1 · 7 settembre</a></p>
    </div>
  </header>

  <div class="wrap prose prose--wide session-body">
    <!-- TSB-START -->
    <section class="session-panel session-panel--tsb" aria-labelledby="tsb-modulo-2026-09-08">
      <span class="session-panel__label" id="tsb-modulo-2026-09-08">Fitness · fatica · riposo</span>
      ${tsbHtml}
    </section>
    <!-- TSB-END -->

    <!-- GUILE-START -->
    <section class="session-panel session-panel--guile guile-panel" aria-labelledby="guile-2026-09-08-b1">
      <span class="session-panel__label" id="guile-2026-09-08-b1">Spirito Guile · umorismo pro</span>
      <p class="guile-panel__lead">Tre illustrazioni IA — <strong>una fotorealistica</strong> (pressa, viso Gino), due stile arcade. Export Zepp = fonte numerica.</p>
      <div class="guile-strip guile-strip--3" aria-label="Galleria illustrazioni sessione B1">
        <figure class="guile-card" style="--guile-i:0">
          <span class="ai-photo-wrap guile-card__frame">
            <img src="/img/allenamenti/guile/2026-09-08-b1-realistic.webp" alt="Gino in pressa — fotorealistica sessione B1" width="640" height="360" loading="lazy" data-ai="generated">
            <span class="ai-photo-mark" aria-hidden="true">Foto AI</span>
          </span>
          <figcaption>Pressa · fotorealistica</figcaption>
        </figure>
        <figure class="guile-card" style="--guile-i:1">
          <span class="ai-photo-wrap guile-card__frame">
            <img src="/img/allenamenti/guile/2026-09-01-b1-arcade-legs.webp" alt="Leg day stile arcade Guile" width="640" height="360" loading="lazy" data-ai="generated">
            <span class="ai-photo-mark" aria-hidden="true">Foto AI</span>
          </span>
          <figcaption>Leg day · arcade</figcaption>
        </figure>
        <figure class="guile-card" style="--guile-i:2">
          <span class="ai-photo-wrap guile-card__frame">
            <img src="/img/allenamenti/guile/2026-09-01-b1-arcade-recovery.webp" alt="Recovery post B1 con wearable" width="640" height="360" loading="lazy" data-ai="generated">
            <span class="ai-photo-mark" aria-hidden="true">Foto AI</span>
          </span>
          <figcaption>Recovery · wearable</figcaption>
        </figure>
      </div>
      <p class="fig-credit guile-panel__credit"><span class="ai-badge" aria-hidden="true">IA</span> Immagini generate con intelligenza artificiale · <a href="/trasparenza-ai/">Trasparenza</a></p>
    </section>
    <!-- GUILE-END -->

    <section class="session-panel" aria-labelledby="nota-sessione">
      <span class="session-panel__label" id="nota-sessione">Nota di Gino</span>
      <p class="session-note"><strong>B1</strong> martedì pomeriggio <strong>12:51</strong> — gambe · polpacci · braccia, settimana 2 del Blocco 1. <strong>23 serie</strong> in <strong>01:22:24</strong>, recupero <strong>44:49</strong>, carico <strong>127</strong>, FC media <strong>116</strong> — profilo cardio più basso dell'A1 di ieri, coerente con leg day.</p>
      <p class="session-note">Readiness mista: sonno <strong>5:23</strong> (corto — fai attenzione), regolarità <strong>60%</strong>, HRV <strong>43</strong> in baseline, HybridCharge <strong>42</strong>, FC riposo <strong>53 Ottimale</strong>. TSB device <strong>-14 Ottimale</strong> (CTL 42 / ATL 56). Seduta completata nonostante sonno corto post-A1 lungo.</p>
    </section>

    <section class="session-panel session-panel--readiness" aria-labelledby="readiness-title">
      <span class="session-panel__label">Readiness · sonno · HRV</span>
      <h2 id="readiness-title">Metriche giornata · Zepp · 8/09</h2>
      <p class="session-panel__intro">Sonno <strong>5:23</strong>, HybridCharge <strong>42</strong>, HRV <strong>43 Buono</strong> (baseline 43), FC riposo <strong>53 Ottimale</strong>. TSB <strong>-14,0 Ottimale</strong> (CTL 42 / ATL 56).</p>

      <div class="amazfit-tsb-hero" aria-label="Modulo TSB — 8 settembre">
        <figure class="phone-shot phone-shot--full phone-shot--solo">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-08-b1-tsb.webp" alt="Modulo TSB 8 settembre — CTL 42 ATL 56 TSB -14 Ottimale" width="844" height="390" loading="eager" fetchpriority="high">
          </div>
          <figcaption>TSB · 08/09 · Ottimale · CTL 42 · ATL 56</figcaption>
        </figure>
      </div>

      <div class="amazfit-gallery" aria-label="Screenshot Zepp — readiness 8 settembre">
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-08-b1-hybridcharge.webp" alt="HybridCharge 8 settembre — sonno 58, sforzo 100%" width="390" height="844" loading="lazy">
          </div>
          <figcaption>HybridCharge · sonno 58 · sforzo 100%</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-08-b1-readiness-metriche.webp" alt="Metriche 8 settembre — fitness 42, affaticamento 56, obiettivo sforzo 58" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Fitness 42 · affaticamento 56</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-08-b1-hrv.webp" alt="HRV 8 settembre — 43 ms Buono, baseline 43" width="390" height="844" loading="lazy">
          </div>
          <figcaption>HRV 43 · Buono · baseline 43</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-08-b1-sonno-metriche.webp" alt="Sonno 8 settembre — 5:23, profondo 0:47, REM 1:28" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Sonno 5:23 · regolarità 60%</figcaption>
        </figure>
      </div>

      <div class="amazfit-data" aria-label="Dati readiness estratti">
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Modulo allenamento TSB · 08/09</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>-14,0</strong><span>TSB · Ottimale</span></div>
            <div class="amazfit-card__cell"><strong>42,0</strong><span>Fitness · CTL</span></div>
            <div class="amazfit-card__cell"><strong>56,0</strong><span>Fatica · ATL</span></div>
            <div class="amazfit-card__cell"><strong>127</strong><span>Carico sessione</span></div>
            <div class="amazfit-card__cell"><strong>12:51</strong><span>Inizio workout</span></div>
          </div>
        </div>
        <div class="amazfit-card">
          <p class="amazfit-card__title">Sonno · readiness · 08/09</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>5:23</strong><span>Durata · Attenzione</span></div>
            <div class="amazfit-card__cell"><strong>60%</strong><span>Regolarità · Normale</span></div>
            <div class="amazfit-card__cell"><strong>0:47</strong><span>Profondo · Leggero</span></div>
            <div class="amazfit-card__cell"><strong>42</strong><span>HybridCharge</span></div>
            <div class="amazfit-card__cell"><strong>107</strong><span>Carico sforzo giorno</span></div>
          </div>
        </div>
        <div class="amazfit-card">
          <p class="amazfit-card__title">HRV · FC riposo · 08/09</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>43</strong><span>HRV · ms · Buono</span></div>
            <div class="amazfit-card__cell"><strong>43</strong><span>Baseline</span></div>
            <div class="amazfit-card__cell"><strong>53</strong><span>FC a riposo · Ottimale</span></div>
            <div class="amazfit-card__cell"><strong>1:28</strong><span>REM</span></div>
          </div>
        </div>
      </div>
    </section>

    <section class="session-panel session-panel--metabolic">
    <section class="metabolic-block" aria-labelledby="metabolic-title">
      <h2 id="metabolic-title">Dati metabolici · Amazfit</h2>
      <p class="metabolic-block__device"><strong>Amazfit Active 2 NFC</strong> · sync app Zepp · Allenamento muscolare</p>
      <p class="amazfit-gallery__lead">Export Zepp — 8 settembre ore 12:51, <strong>23 serie</strong>. Riepilogo a tutta larghezza · export parziale (mancano grafico FC e zone).</p>

      <div class="amazfit-riepilogo-hero" aria-label="Resoconto Zepp — 8 settembre">
        <figure class="phone-shot phone-shot--full phone-shot--solo">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-08-b1-riepilogo.webp" alt="Riepilogo Zepp 8 settembre B1 — 23 serie, 679 kcal, FC 116, durata 01:22:24, carico 127" width="390" height="430" loading="eager" fetchpriority="high">
          </div>
          <figcaption>Riepilogo · 01:22:24 · 23 serie · carico 127 · 679 kcal</figcaption>
        </figure>
      </div>

      <div class="amazfit-gallery" aria-label="Screenshot Zepp — tecnica 8 settembre">
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-08-b1-tecnica.webp" alt="Muscoli bicipiti/femorali e radar tecnica — B1 leg day" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Muscoli + radar tecnica</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-08-b1-valutazione.webp" alt="Valutazione complessiva movimento Zepp B1" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Valutazione complessiva</figcaption>
        </figure>
      </div>

      <div class="amazfit-data" aria-label="Dati sessione 8 settembre">
        <div class="amazfit-card">
          <div class="amazfit-card__top">
            <div>
              <div class="amazfit-card__user">ginocapon</div>
              <div class="amazfit-card__meta">8 set · 12:51 · martedì · B1</div>
            </div>
            <span class="amazfit-card__badge">23 serie</span>
          </div>
          <p class="amazfit-card__title">Riepilogo sessione</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>01:22:24</strong><span>Tempo allenamento</span></div>
            <div class="amazfit-card__cell"><strong>44:49</strong><span>Recupero tra set</span></div>
            <div class="amazfit-card__cell"><strong>116</strong><span>FC media · bpm</span></div>
            <div class="amazfit-card__cell"><strong>679</strong><span>Calorie · kcal</span></div>
            <div class="amazfit-card__cell"><strong>127</strong><span>Carico allenamento</span></div>
          </div>
        </div>
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Muscoli usati · map Zepp</p>
          <p><strong>Primari:</strong> bicipiti, femorali. <strong>Secondari:</strong> glutei, lombare. Coerente con B1 gambe · polpacci · braccia.</p>
        </div>
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Valutazione movimento · Zepp</p>
          <p>Consistenza uniforme · stabilità buona · continuità fluida · ritmo coerente · decadimento velocità ragionevole.</p>
        </div>
      </div>

      <p class="metabolic-note"><strong>Valutazione conclusiva.</strong> Seduta <strong>B1</strong> martedì (<strong>82 min</strong>, <strong>23 serie</strong>), carico <strong>127</strong>, FC media <strong>116</strong> — profilo più aerobico dell'A1 di ieri. Sonno corto (5:23) ma HRV in baseline: seduta portata a termine. Export incompleto: mancano grafico FC e schermata zone/effetto.</p>

      <article class="hr-log hr-log--elevated" data-session="2026-09-08T12:51" data-duration-corrected="false">
        <div class="hr-metrics">
          <div class="hr-metric"><strong>01:22:24</strong><span>Durata</span></div>
          <div class="hr-metric"><strong>116</strong><span>FC media</span></div>
          <div class="hr-metric"><strong>679</strong><span>Calorie</span></div>
          <div class="hr-metric"><strong>127</strong><span>Carico</span></div>
          <div class="hr-metric"><strong>23</strong><span>Serie</span></div>
        </div>
      </article>
    </section>
    </section>

    <nav class="session-nav" aria-label="Navigazione sessione">
      <a class="session-nav__primary" href="/allenamenti/sessioni/">← Tutte le sessioni</a>
      <a href="/admin/">B1 · Blocco 1 admin</a>
      <a href="/allenamenti/sessioni/2026-09-07-a1/">← A1 · 7 settembre</a>
    </nav>
    <p class="session-meta-footer">Ultimo aggiornamento: 8 settembre 2026 · export Zepp parziale + Guile IA</p>
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
console.log("OK allenamenti/sessioni/2026-09-08-b1/index.html");
