#!/usr/bin/env node
/** Scaffold sessione 2026-09-18-a2 — venerdì A2 settimana 3 (recupero slot giovedì) */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderTsbModule } from "./tsb-render.mjs";

const REPO = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const data = JSON.parse(fs.readFileSync(path.join(REPO, "data/training-load.json"), "utf8"));
const tsbHtml = renderTsbModule(data, "2026-09-18", { sessionId: "sess-2026-09-18-a2" });

const dir = path.join(REPO, "allenamenti/sessioni/2026-09-18-a2");
fs.mkdirSync(dir, { recursive: true });

const html = `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<title>18 settembre 2026 — A2 petto · schiena · spalle | Sessione · La Forza Quotidiana</title>
<meta name="description" content="Sessione 18 settembre 2026 ore 12:55: A2 Blocco 1 settimana 3. 25 serie, 62 min, carico 105, FC 115/151, 507 kcal. Upper venerdì post-recupero TSB Bilanciato.">
<link rel="canonical" href="https://forzaquotidiana.it/allenamenti/sessioni/2026-09-18-a2/">
<meta property="og:type" content="article">
<meta property="og:site_name" content="La Forza Quotidiana">
<meta property="og:locale" content="it_IT">
<meta property="og:url" content="https://forzaquotidiana.it/allenamenti/sessioni/2026-09-18-a2/">
<meta property="og:title" content="18 settembre 2026 — A2 · petto · schiena · spalle">
<meta property="og:image" content="https://forzaquotidiana.it/img/allenamenti/amazfit/2026-09-18-a2-riepilogo.webp">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="18 settembre 2026 — A2 · settimana 3 Blocco 1">
<meta name="twitter:description" content="62 min, 25 serie, carico 105, FC 115/151, HRV 37 Buono, TSB -1 Bilanciato.">
<meta name="twitter:image" content="https://forzaquotidiana.it/img/allenamenti/amazfit/2026-09-18-a2-riepilogo.webp">
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
        <a href="/allenamenti/">Allenamenti</a> · <a href="/allenamenti/sessioni/">Sessioni</a> · 18 settembre 2026
      </nav>
      <div class="session-hero__top">
        <span class="session-hero__badge">A2</span>
        <time class="session-hero__time" datetime="2026-09-18T12:55">18 settembre 2026 · ore 12:55 · venerdì</time>
      </div>
      <h1>Petto · schiena · spalle — A2 settimana 3</h1>
      <p class="session-hero__sub">62 min, carico 105, FC 115/151, 507 kcal — 25 serie · aerobico 3,1 Buono · sforzo 82/68 · TSB -1 Bilanciato</p>
      <dl class="session-kpis" aria-label="Metriche principali sessione">
        <div class="session-kpis__item session-kpis__item--accent"><dt>Durata</dt><dd>01:02:14</dd></div>
        <div class="session-kpis__item"><dt>FC media</dt><dd>115</dd></div>
        <div class="session-kpis__item"><dt>FC max</dt><dd>151</dd></div>
        <div class="session-kpis__item"><dt>Calorie</dt><dd>507</dd></div>
        <div class="session-kpis__item"><dt>Carico</dt><dd>105</dd></div>
        <div class="session-kpis__item"><dt>Serie</dt><dd>25</dd></div>
      </dl>
      <p class="session-hero__refs">Scheda di riferimento: <a href="/admin/"><strong>A2</strong> · Blocco 1 · Ipertrofia accumulo</a> · Precedente: <a href="/allenamenti/sessioni/2026-09-15-b1/">B1 · 15 settembre</a> · Stesso slot: <a href="/allenamenti/sessioni/2026-09-11-a2/">A2 · 11 settembre</a></p>
    </div>
  </header>

  <div class="wrap prose prose--wide session-body">
    <!-- TSB-START -->
    <section class="session-panel session-panel--tsb" aria-labelledby="tsb-modulo-2026-09-18">
      <span class="session-panel__label" id="tsb-modulo-2026-09-18">Fitness · fatica · riposo</span>
      ${tsbHtml}
    </section>
    <!-- TSB-END -->

    <!-- GUILE-START -->
    <section class="session-panel session-panel--guile guile-panel" aria-labelledby="guile-2026-09-18-a2">
      <span class="session-panel__label" id="guile-2026-09-18-a2">Spirito Guile · umorismo pro</span>
      <p class="guile-panel__lead">Tre illustrazioni IA — tono arcade su A2 upper body. Export Zepp = fonte numerica.</p>
      <div class="guile-strip guile-strip--3" aria-label="Galleria illustrazioni A2">
        <figure class="guile-card" style="--guile-i:0">
          <span class="ai-photo-wrap guile-card__frame">
            <img src="/img/allenamenti/guile/2026-09-11-a2-realistic.webp" alt="Gino upper body — fotorealistica sessione A2" width="640" height="360" loading="lazy" data-ai="generated">
            <span class="ai-photo-mark" aria-hidden="true">Foto AI</span>
          </span>
          <figcaption>Upper · fotorealistica</figcaption>
        </figure>
        <figure class="guile-card" style="--guile-i:1">
          <span class="ai-photo-wrap guile-card__frame">
            <img src="/img/allenamenti/guile/guile-scheda-1-spotter.webp" alt="Spotter stile arcade — A2" width="640" height="360" loading="lazy" data-ai="generated">
            <span class="ai-photo-mark" aria-hidden="true">Foto AI</span>
          </span>
          <figcaption>Spotter · arcade</figcaption>
        </figure>
        <figure class="guile-card" style="--guile-i:2">
          <span class="ai-photo-wrap guile-card__frame">
            <img src="/img/allenamenti/guile/guile-scheda-1-recovery.webp" alt="Recovery post A2 con wearable" width="640" height="360" loading="lazy" data-ai="generated">
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
      <p class="session-note"><strong>A2</strong> venerdì mezzogiorno <strong>12:55</strong> — petto · schiena · spalle, recupero dello slot giovedì in settimana 3. <strong>25 serie</strong> in <strong>01:02:14</strong>, recupero <strong>43:47</strong>, carico <strong>105</strong> — densità più alta dell'A2 dell'11/09 (54) ma seduta più corta.</p>
      <p class="session-note">Profilo cardio più intenso dell'A2 dell'11/09 (FC max 151 vs 137, carico 105 vs 54): <strong>27 min in zona aerobica</strong> e <strong>9 min anaerobica</strong>, effetto aerobico <strong>3,1 Buono</strong>. Readiness discreta: sonno <strong>6:23</strong> (5 risvegli, FC notturna 55), HRV <strong>37</strong> sotto baseline 43, carico sforzo <strong>82</strong> su obiettivo 68. HybridCharge <strong>60</strong> → <strong>26</strong> post workout (−10 punti analisi). TSB <strong>-1 Bilanciato</strong> (CTL 38 / ATL 39). Focus Zepp: <em>Ripristina</em>.</p>
    </section>

    <section class="session-panel session-panel--readiness" aria-labelledby="readiness-title">
      <span class="session-panel__label">Readiness · sonno · HRV</span>
      <h2 id="readiness-title">Metriche giornata · Zepp · 18/09</h2>
      <p class="session-panel__intro">Sonno <strong>6:23 Normale</strong> (score 69), regolarità <strong>90% Ottimale</strong>, HRV <strong>37 Buono</strong>, FC riposo <strong>52 Ottimale</strong>, HybridCharge <strong>60 Discreto</strong> → <strong>26</strong> post sessione. TSB <strong>-1,0 Bilanciato</strong>.</p>

      <div class="amazfit-tsb-hero" aria-label="Modulo TSB — 18 settembre">
        <figure class="phone-shot phone-shot--landscape phone-shot--solo">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-18-a2-tsb.webp" alt="Modulo TSB Zepp — CTL 38 ATL 39 TSB -1 Bilanciato, 18 settembre" width="1024" height="473" loading="eager" fetchpriority="high">
          </div>
          <figcaption>TSB · 18/09 · Bilanciato · CTL 38 · ATL 39</figcaption>
        </figure>
      </div>

      <div class="amazfit-gallery" aria-label="Screenshot Zepp — readiness 18 settembre">
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-18-a2-hybridcharge.webp" alt="HybridCharge 18 settembre — risveglio 60 Discreto, allenamento 12:55-13:58" width="390" height="844" loading="lazy">
          </div>
          <figcaption>HybridCharge 60 → 26 post workout</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-18-a2-hybridcharge-analisi.webp" alt="Analisi HybridCharge — −10 punti post allenamento muscolare" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Analisi HC · −10 punti workout</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-18-a2-readiness-panoramica.webp" alt="Panoramica 18 settembre — sonno 69, sforzo 100%, carico 82" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Panoramica · sforzo 100% · HC 27</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-18-a2-readiness-metriche.webp" alt="Metriche 18 settembre — carico sforzo 82, sonno 6:23, HRV 37" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Carico sforzo 82 · sonno 6:23 · fitness 38</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-18-a2-hrv.webp" alt="HRV 18 settembre — 37 ms Buono, baseline 43" width="390" height="844" loading="lazy">
          </div>
          <figcaption>HRV 37 · Buono · sotto baseline</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-18-a2-sonno-score.webp" alt="Sonno score 18 settembre — 69 Normale" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Score sonno 69 · Normale</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-18-a2-sonno-metriche.webp" alt="Sonno 18 settembre — 6:23, profondo 1:24, REM 1:24, veglia 0:35" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Sonno 6:23 · regolarità 90%</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-18-a2-sonno-fc.webp" alt="FC sonno 18 settembre — media 55 bpm, 23:56-06:54" width="390" height="844" loading="lazy">
          </div>
          <figcaption>FC sonno 55 · 6:58 a letto</figcaption>
        </figure>
      </div>

      <div class="amazfit-data" aria-label="Dati readiness estratti">
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Modulo allenamento TSB · 18/09</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>-1,0</strong><span>TSB · Bilanciato</span></div>
            <div class="amazfit-card__cell"><strong>38,0</strong><span>Fitness · CTL</span></div>
            <div class="amazfit-card__cell"><strong>39,0</strong><span>Fatica · ATL</span></div>
            <div class="amazfit-card__cell"><strong>105</strong><span>Carico sessione</span></div>
            <div class="amazfit-card__cell"><strong>12:55</strong><span>Inizio workout</span></div>
          </div>
        </div>
        <div class="amazfit-card">
          <p class="amazfit-card__title">Sonno · readiness · 18/09</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>6:23</strong><span>Durata · Normale</span></div>
            <div class="amazfit-card__cell"><strong>90%</strong><span>Regolarità · Ottimale</span></div>
            <div class="amazfit-card__cell"><strong>1:24</strong><span>Profondo · Leggero</span></div>
            <div class="amazfit-card__cell"><strong>69</strong><span>Score sonno · Normale</span></div>
            <div class="amazfit-card__cell"><strong>55</strong><span>FC sonno · bpm</span></div>
            <div class="amazfit-card__cell"><strong>82</strong><span>Carico sforzo / 68</span></div>
          </div>
        </div>
        <div class="amazfit-card">
          <p class="amazfit-card__title">HRV · FC riposo · 18/09</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>37</strong><span>HRV · ms · Buono</span></div>
            <div class="amazfit-card__cell"><strong>43</strong><span>Baseline</span></div>
            <div class="amazfit-card__cell"><strong>52</strong><span>FC a riposo · Ottimale</span></div>
            <div class="amazfit-card__cell"><strong>26</strong><span>HybridCharge post workout</span></div>
          </div>
        </div>
      </div>
    </section>

    <section class="session-panel session-panel--metabolic">
    <section class="metabolic-block" aria-labelledby="metabolic-title">
      <h2 id="metabolic-title">Dati metabolici · Amazfit</h2>
      <p class="metabolic-block__device"><strong>Amazfit Active 2 NFC</strong> · sync app Zepp · Allenamento muscolare</p>
      <p class="amazfit-gallery__lead">Export Zepp — 18 settembre ore 12:55, <strong>25 serie</strong>. Riepilogo e grafico FC a tutta larghezza.</p>

      <div class="amazfit-riepilogo-hero" aria-label="Resoconto Zepp — 18 settembre">
        <figure class="phone-shot phone-shot--full phone-shot--solo">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-18-a2-riepilogo.webp" alt="Riepilogo Zepp 18 settembre A2 — 25 serie, 507 kcal, FC 115, durata 01:02:14, carico 105" width="390" height="430" loading="eager" fetchpriority="high">
          </div>
          <figcaption>Riepilogo · 01:02:14 · 25 serie · carico 105 · 507 kcal</figcaption>
        </figure>
      </div>

      <div class="amazfit-fc-hero" aria-label="Grafico FC — 18 settembre">
        <figure class="phone-shot phone-shot--full phone-shot--solo">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-18-a2-fc-grafico.webp" alt="Grafico FC 18 settembre — media 115 max 151 bpm, 62 minuti" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Grafico FC · max 151 · 62 min</figcaption>
        </figure>
      </div>

      <div class="amazfit-gallery" aria-label="Screenshot Zepp — tecnica 18 settembre">
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-18-a2-zone-effetto.webp" alt="Zone FC 18 settembre — effetto aerobico e anaerobico" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Zone FC · effetto allenamento</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-18-a2-tecnica.webp" alt="Muscoli petto/deltoidi e radar tecnica — A2" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Muscoli + radar tecnica</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-18-a2-readiness-dettaglio.webp" alt="Dettaglio metriche 18 settembre — carico sforzo 82, TSB -1, sonno 6:23" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Dettaglio metriche giornata</figcaption>
        </figure>
      </div>

      <div class="amazfit-data" aria-label="Dati sessione 18 settembre">
        <div class="amazfit-card">
          <div class="amazfit-card__top">
            <div>
              <div class="amazfit-card__user">ginocapon</div>
              <div class="amazfit-card__meta">18 set · 12:55 · venerdì · A2</div>
            </div>
            <span class="amazfit-card__badge">25 serie</span>
          </div>
          <p class="amazfit-card__title">Riepilogo sessione</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>01:02:14</strong><span>Tempo allenamento</span></div>
            <div class="amazfit-card__cell"><strong>43:47</strong><span>Recupero tra set</span></div>
            <div class="amazfit-card__cell"><strong>115</strong><span>FC media · bpm</span></div>
            <div class="amazfit-card__cell"><strong>151</strong><span>FC max · bpm</span></div>
            <div class="amazfit-card__cell"><strong>507</strong><span>Calorie · kcal</span></div>
            <div class="amazfit-card__cell"><strong>105</strong><span>Carico allenamento</span></div>
          </div>
        </div>
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Zone cardiache · minuti</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell"><strong>10:17</strong><span>Leggera · 81–96</span></div>
            <div class="amazfit-card__cell"><strong>15:47</strong><span>Intensiva · 97–113</span></div>
            <div class="amazfit-card__cell"><strong>26:55</strong><span>Aerobica · 114–129</span></div>
            <div class="amazfit-card__cell"><strong>9:01</strong><span>Anaerobica · 130–145</span></div>
            <div class="amazfit-card__cell"><strong>0:11</strong><span>VO₂ max · 146+</span></div>
          </div>
        </div>
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Effetto allenamento · Zepp</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>3,1</strong><span>Aerobico · Buono</span></div>
            <div class="amazfit-card__cell"><strong>2,6</strong><span>Anaerobico · Medio</span></div>
          </div>
        </div>
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Muscoli usati · map Zepp</p>
          <p><strong>Primari:</strong> petto, dorsali superiori. <strong>Secondari:</strong> deltoidi anteriori, trapezio, tricipiti. Coerente con A2 upper body — petto e spalle dominanti.</p>
        </div>
      </div>

      <p class="metabolic-note"><strong>Analisi.</strong> Rispetto all'A2 dell'11/09: stessa durata di sonno (~6:20) ma seduta più corta (62 vs 83 min) e <strong>carico quasi raddoppiato</strong> (105 vs 54). FC media +7 bpm, max +14 bpm — più tempo in aerobica (+3 min) e anaerobica (+8 min), effetto aerobico salito da 2,5 Medio a <strong>3,1 Buono</strong>. Il grafico FC mostra salita progressiva con picchi 140+ negli ultimi 20 min (superset petto/spalle). Carico sforzo giornaliero <strong>82</strong> (+14 vs obiettivo 68): venerdì intenso nonostante TSB Bilanciato. Sonno 6:23 con 5 risvegli e profondo leggero; HRV 37 ancora sotto baseline 43. HybridCharge crolla a 26 post workout — Zepp suggerisce <em>Ripristina</em>. Priorità weekend: sonno e idratazione prima del B2.</p>

      <article class="hr-log hr-log--elevated" data-session="2026-09-18T12:55" data-duration-corrected="false">
        <div class="hr-metrics">
          <div class="hr-metric"><strong>01:02:14</strong><span>Durata</span></div>
          <div class="hr-metric"><strong>115</strong><span>FC media</span></div>
          <div class="hr-metric"><strong>151</strong><span>FC max</span></div>
          <div class="hr-metric"><strong>507</strong><span>Calorie</span></div>
          <div class="hr-metric"><strong>105</strong><span>Carico</span></div>
          <div class="hr-metric"><strong>25</strong><span>Serie</span></div>
        </div>
      </article>
    </section>
    </section>

    <nav class="session-nav" aria-label="Navigazione sessione">
      <a class="session-nav__primary" href="/allenamenti/sessioni/">← Tutte le sessioni</a>
      <a href="/admin/">A2 · Blocco 1 admin</a>
      <a href="/allenamenti/sessioni/2026-09-15-b1/">← B1 · 15 settembre</a>
    </nav>
    <p class="session-meta-footer">Ultimo aggiornamento: 18 settembre 2026 · export Zepp completo</p>
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
console.log("OK allenamenti/sessioni/2026-09-18-a2/index.html");
