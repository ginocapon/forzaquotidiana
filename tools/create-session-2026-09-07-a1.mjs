#!/usr/bin/env node
/** Scaffold sessione 2026-09-07-a1 — lunedì Blocco 1 upper */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderTsbModule } from "./tsb-render.mjs";

const REPO = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const data = JSON.parse(fs.readFileSync(path.join(REPO, "data/training-load.json"), "utf8"));
const tsbHtml = renderTsbModule(data, "2026-09-07", { sessionId: "sess-2026-09-07-a1" });

const dir = path.join(REPO, "allenamenti/sessioni/2026-09-07-a1");
fs.mkdirSync(dir, { recursive: true });

const html = `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<title>7 settembre 2026 — A1 petto · schiena · spalle | Sessione · La Forza Quotidiana</title>
<meta name="description" content="Sessione 7 settembre 2026 ore 14:53: A1 Blocco 1. 27 serie, 95 min, carico 299, FC 130/160, 944 kcal. Upper body settimana 2.">
<link rel="canonical" href="https://forzaquotidiana.it/allenamenti/sessioni/2026-09-07-a1/">
<meta property="og:type" content="article">
<meta property="og:site_name" content="La Forza Quotidiana">
<meta property="og:locale" content="it_IT">
<meta property="og:url" content="https://forzaquotidiana.it/allenamenti/sessioni/2026-09-07-a1/">
<meta property="og:title" content="7 settembre 2026 — A1 · petto · schiena · spalle">
<meta property="og:image" content="https://forzaquotidiana.it/img/allenamenti/amazfit/2026-09-07-a1-riepilogo.webp">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="7 settembre 2026 — A1 · upper Blocco 1">
<meta name="twitter:description" content="95 min, 27 serie, carico 299, FC 130/160, aerobico 4,9 Eccellente.">
<meta name="twitter:image" content="https://forzaquotidiana.it/img/allenamenti/amazfit/2026-09-07-a1-riepilogo.webp">
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
        <a href="/allenamenti/">Allenamenti</a> · <a href="/allenamenti/sessioni/">Sessioni</a> · 7 settembre 2026
      </nav>
      <div class="session-hero__top">
        <span class="session-hero__badge">A1</span>
        <time class="session-hero__time" datetime="2026-09-07T14:53">7 settembre 2026 · ore 14:53 · lunedì</time>
      </div>
      <h1>Petto · schiena · spalle — A1 Blocco 1</h1>
      <p class="session-hero__sub">95 min, carico 299, FC 130/160, 944 kcal — 27 serie · aerobico 4,9 Eccellente · anaerobico 4,1 Eccellente · HRV 47 Ottimale</p>
      <dl class="session-kpis" aria-label="Metriche principali sessione">
        <div class="session-kpis__item session-kpis__item--accent"><dt>Durata</dt><dd>01:34:49</dd></div>
        <div class="session-kpis__item"><dt>FC media</dt><dd>130</dd></div>
        <div class="session-kpis__item"><dt>FC max</dt><dd>160</dd></div>
        <div class="session-kpis__item"><dt>Calorie</dt><dd>944</dd></div>
        <div class="session-kpis__item"><dt>Carico</dt><dd>299</dd></div>
        <div class="session-kpis__item"><dt>Serie</dt><dd>27</dd></div>
      </dl>
      <p class="session-hero__refs">Scheda di riferimento: <a href="/admin/"><strong>A1</strong> · Blocco 1 · Ipertrofia accumulo</a> · Precedente: <a href="/allenamenti/sessioni/2026-09-05-b2/">B2 · 5 settembre</a></p>
    </div>
  </header>

  <div class="wrap prose prose--wide session-body">
    <!-- TSB-START -->
    <section class="session-panel session-panel--tsb" aria-labelledby="tsb-modulo-2026-09-07">
      <span class="session-panel__label" id="tsb-modulo-2026-09-07">Fitness · fatica · riposo</span>
      ${tsbHtml}
    </section>
    <!-- TSB-END -->

    <!-- GUILE-START -->
    <section class="session-panel session-panel--guile guile-panel" aria-labelledby="guile-2026-09-07-a1">
      <span class="session-panel__label" id="guile-2026-09-07-a1">Spirito Guile · umorismo pro</span>
      <p class="guile-panel__lead">Tre illustrazioni IA — <strong>una fotorealistica</strong> (panca inclinata, viso Gino), due stile arcade. Export Zepp = fonte numerica.</p>
      <div class="guile-strip guile-strip--1" aria-label="Galleria illustrazioni A1">
        <figure class="guile-card" style="--guile-i:0">
          <span class="ai-photo-wrap guile-card__frame">
            <img src="/img/allenamenti/guile/2026-09-07-a1-realistic.webp" alt="Gino alla panca inclinata — fotorealistica sessione A1" width="640" height="360" loading="lazy" data-ai="generated">
            <span class="ai-photo-mark" aria-hidden="true">Foto AI</span>
          </span>
          <figcaption>Panca inclinata · fotorealistica</figcaption>
        </figure>
        <figure class="guile-card" style="--guile-i:1">
          <span class="ai-photo-wrap guile-card__frame">
            <img src="/img/allenamenti/guile/guile-scheda-1-spotter.webp" alt="Spotter stile arcade — assistenza panca A1" width="640" height="360" loading="lazy" data-ai="generated">
            <span class="ai-photo-mark" aria-hidden="true">Foto AI</span>
          </span>
          <figcaption>Spotter · panca</figcaption>
        </figure>
        <figure class="guile-card" style="--guile-i:2">
          <span class="ai-photo-wrap guile-card__frame">
            <img src="/img/allenamenti/guile/guile-scheda-1-recovery.webp" alt="Recovery post A1 con wearable" width="640" height="360" loading="lazy" data-ai="generated">
            <span class="ai-photo-mark" aria-hidden="true">Foto AI</span>
          </span>
          <figcaption>Recovery · wearable</figcaption>
        </figure>
      </div>
      <p class="fig-credit guile-panel__credit"><span class="ai-badge" aria-hidden="true">IA</span> Immagini generate con intelligenza artificiale · <a href="/trasparenza-ai/">Trasparenza</a></p>
    </section>
    <!-- GUILE-END -->

    <section class="session-panel session-panel--readiness">
      <h2>Readiness · sonno · HRV · HybridCharge</h2>
      <p class="session-panel__intro">Export Zepp pre-sessione — 7 settembre ore 14:53. TSB <strong>-15 Ottimale</strong>, HRV <strong>47 ms Ottimale</strong>, HybridCharge <strong>61 Discreto</strong>, sonno <strong>6:31 Normale</strong>.</p>

      <div class="amazfit-tsb-hero" aria-label="Modulo TSB screenshot — 7 settembre">
        <figure class="phone-shot phone-shot--full phone-shot--solo">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-07-a1-tsb.webp" alt="Modulo TSB 7 settembre — CTL 38 ATL 53 TSB -15 Ottimale" width="844" height="390" loading="eager" fetchpriority="high">
          </div>
          <figcaption>TSB · 07/09 · Ottimale · CTL 38 · ATL 53</figcaption>
        </figure>
      </div>

      <div class="amazfit-gallery" aria-label="Screenshot Zepp — readiness 7 settembre">
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-07-a1-hybridcharge.webp" alt="HybridCharge 7 settembre — 61 Discreto, sonno +56" width="390" height="844" loading="lazy">
          </div>
          <figcaption>HybridCharge 61 · Discreto</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-07-a1-readiness-metriche.webp" alt="Metriche principali 7 settembre — affaticamento 53, obiettivo sforzo 67" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Affaticamento 53 · obiettivo 67</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-07-a1-hrv.webp" alt="HRV 7 settembre — 47 ms Ottimale, baseline 43" width="390" height="844" loading="lazy">
          </div>
          <figcaption>HRV 47 · Ottimale</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-07-a1-sonno-metriche.webp" alt="Sonno 7 settembre — 6:31 Normale, profondo 0:54, REM 1:34" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Sonno 6:31 · regolarità 58%</figcaption>
        </figure>
      </div>

      <div class="amazfit-data" aria-label="Dati readiness estratti">
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Modulo allenamento TSB · 07/09</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>-15,0</strong><span>TSB · Ottimale</span></div>
            <div class="amazfit-card__cell"><strong>38,0</strong><span>Fitness · CTL</span></div>
            <div class="amazfit-card__cell"><strong>53,0</strong><span>Fatica · ATL</span></div>
            <div class="amazfit-card__cell"><strong>299</strong><span>Carico sessione</span></div>
            <div class="amazfit-card__cell"><strong>14:53</strong><span>Inizio workout</span></div>
          </div>
        </div>
        <div class="amazfit-card">
          <p class="amazfit-card__title">Sonno · readiness · 07/09</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>6:31</strong><span>Durata · Normale</span></div>
            <div class="amazfit-card__cell"><strong>58%</strong><span>Regolarità · Attenzione</span></div>
            <div class="amazfit-card__cell"><strong>0:54</strong><span>Profondo · Leggero</span></div>
            <div class="amazfit-card__cell"><strong>61</strong><span>HybridCharge risveglio</span></div>
            <div class="amazfit-card__cell"><strong>67</strong><span>Obiettivo sforzo giorno</span></div>
          </div>
        </div>
        <div class="amazfit-card">
          <p class="amazfit-card__title">HRV · FC riposo · 07/09</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>47</strong><span>HRV · ms · Ottimale</span></div>
            <div class="amazfit-card__cell"><strong>43</strong><span>Baseline</span></div>
            <div class="amazfit-card__cell"><strong>48</strong><span>FC a riposo</span></div>
            <div class="amazfit-card__cell"><strong>1:34</strong><span>REM</span></div>
          </div>
        </div>
      </div>
    </section>

    <section class="session-panel session-panel--metabolic">
    <section class="metabolic-block" aria-labelledby="metabolic-title">
      <h2 id="metabolic-title">Dati metabolici · Amazfit</h2>
      <p class="metabolic-block__device"><strong>Amazfit Active 2 NFC</strong> · sync app Zepp · Allenamento muscolare</p>
      <p class="amazfit-gallery__lead">Export Zepp — 7 settembre ore 14:53, <strong>27 serie</strong>. Riepilogo e grafico FC a tutta larghezza.</p>

      <div class="amazfit-riepilogo-hero" aria-label="Resoconto Zepp — 7 settembre">
        <figure class="phone-shot phone-shot--full phone-shot--solo">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-07-a1-riepilogo.webp" alt="Riepilogo Zepp 7 settembre A1 — 27 serie, 944 kcal, FC 130, durata 01:34:49, carico 299" width="390" height="430" loading="eager" fetchpriority="high">
          </div>
          <figcaption>Riepilogo · 01:34:49 · 27 serie · carico 299 · 944 kcal</figcaption>
        </figure>
      </div>

      <div class="amazfit-fc-hero" aria-label="Grafico FC — 7 settembre">
        <figure class="phone-shot phone-shot--full phone-shot--solo">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-07-a1-fc-grafico.webp" alt="Grafico FC 7 settembre — media 130 max 160 bpm, 95 minuti" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Grafico FC · max 160 · 95 min</figcaption>
        </figure>
      </div>

      <div class="amazfit-gallery" aria-label="Screenshot Zepp — tecnica 7 settembre">
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-07-a1-zone-effetto.webp" alt="Zone FC 7 settembre — aerobico 4,9 Eccellente, anaerobico 4,1 Eccellente" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Zone FC · anaerobica 44% · aerobica 36%</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-07-a1-valutazione.webp" alt="Muscoli petto/dorsali/spalle e radar tecnica — A1 upper" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Muscoli + radar tecnica</figcaption>
        </figure>
      </div>

      <div class="amazfit-data" aria-label="Dati sessione 7 settembre">
        <div class="amazfit-card">
          <div class="amazfit-card__top">
            <div>
              <div class="amazfit-card__user">ginocapon</div>
              <div class="amazfit-card__meta">7 set · 14:53 · lunedì · A1</div>
            </div>
            <span class="amazfit-card__badge">27 serie</span>
          </div>
          <p class="amazfit-card__title">Riepilogo sessione</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>01:34:49</strong><span>Tempo allenamento</span></div>
            <div class="amazfit-card__cell"><strong>53:33</strong><span>Recupero tra set</span></div>
            <div class="amazfit-card__cell"><strong>130</strong><span>FC media · bpm</span></div>
            <div class="amazfit-card__cell"><strong>160</strong><span>FC max · bpm</span></div>
            <div class="amazfit-card__cell"><strong>944</strong><span>Calorie · kcal</span></div>
            <div class="amazfit-card__cell"><strong>299</strong><span>Carico allenamento</span></div>
          </div>
        </div>
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Zone cardiache · minuti</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell"><strong>0:07</strong><span>Leggera · 81–96</span></div>
            <div class="amazfit-card__cell"><strong>10:33</strong><span>Intensiva · 97–113</span></div>
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>34:16</strong><span>Aerobica · 114–129</span></div>
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>41:50</strong><span>Anaerobica · 130–145</span></div>
            <div class="amazfit-card__cell"><strong>8:01</strong><span>VO₂ max · 146+</span></div>
          </div>
        </div>
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Effetto allenamento · Zepp</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>4,9</strong><span>Aerobico · Eccellente</span></div>
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>4,1</strong><span>Anaerobico · Eccellente</span></div>
          </div>
        </div>
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Muscoli usati · map Zepp</p>
          <p><strong>Primari:</strong> petto, dorsali. <strong>Secondari:</strong> deltoidi, trapezio, tricipiti. Coerente con A1 upper body Blocco 1.</p>
        </div>
      </div>

      <p class="metabolic-note"><strong>Valutazione conclusiva.</strong> Seduta <strong>A1</strong> lunedì (<strong>95 min</strong>, <strong>27 serie</strong>), carico <strong>299</strong> — massimo del ciclo settembre — FC max <strong>160</strong>. Effetto aerobico e anaerobico entrambi <strong>Eccellenti</strong>. HRV 47 pre-sessione: readiness buona nonostante TSB -15. Dopo B2 sabato: volume upper aumentato (+5 serie vs A2).</p>

      <article class="hr-log hr-log--elevated" data-session="2026-09-07T14:53" data-duration-corrected="false">
        <div class="hr-metrics">
          <div class="hr-metric"><strong>01:34:49</strong><span>Durata</span></div>
          <div class="hr-metric"><strong>130</strong><span>FC media</span></div>
          <div class="hr-metric"><strong>160</strong><span>FC max</span></div>
          <div class="hr-metric"><strong>944</strong><span>Calorie</span></div>
          <div class="hr-metric"><strong>299</strong><span>Carico</span></div>
          <div class="hr-metric"><strong>27</strong><span>Serie</span></div>
        </div>
      </article>
    </section>
    </section>

    <nav class="session-nav" aria-label="Navigazione sessione">
      <a class="session-nav__primary" href="/allenamenti/sessioni/">← Tutte le sessioni</a>
      <a href="/admin/">A1 · Blocco 1 admin</a>
      <a href="/allenamenti/sessioni/2026-09-05-b2/">← B2 · 5 settembre</a>
    </nav>
    <p class="session-meta-footer">Ultimo aggiornamento: 7 settembre 2026 · export Zepp completo + Guile IA</p>
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
console.log("OK allenamenti/sessioni/2026-09-07-a1/index.html");
