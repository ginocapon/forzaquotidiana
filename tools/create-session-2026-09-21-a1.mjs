#!/usr/bin/env node
/** Scaffold sessione 2026-09-21-a1 — lunedì A1 settimana 4 Blocco 1 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderTsbModule } from "./tsb-render.mjs";

const REPO = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const data = JSON.parse(fs.readFileSync(path.join(REPO, "data/training-load.json"), "utf8"));
const tsbHtml = renderTsbModule(data, "2026-09-21", { sessionId: "sess-2026-09-21-a1" });

const dir = path.join(REPO, "allenamenti/sessioni/2026-09-21-a1");
fs.mkdirSync(dir, { recursive: true });

const html = `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<title>21 settembre 2026 — A1 petto · schiena · spalle | Sessione · La Forza Quotidiana</title>
<meta name="description" content="Sessione 21 settembre 2026 ore 13:05: A1 Blocco 1 settimana 4. 23 serie, 51 min, carico 139, FC 126/158, 480 kcal. TSB +2 Bilanciato post-recupero weekend.">
<link rel="canonical" href="https://forzaquotidiana.it/allenamenti/sessioni/2026-09-21-a1/">
<meta property="og:type" content="article">
<meta property="og:site_name" content="La Forza Quotidiana">
<meta property="og:locale" content="it_IT">
<meta property="og:url" content="https://forzaquotidiana.it/allenamenti/sessioni/2026-09-21-a1/">
<meta property="og:title" content="21 settembre 2026 — A1 · petto · schiena · spalle">
<meta property="og:image" content="https://forzaquotidiana.it/img/allenamenti/amazfit/2026-09-21-a1-riepilogo.webp">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="21 settembre 2026 — A1 · settimana 4 Blocco 1">
<meta name="twitter:description" content="51 min, 23 serie, carico 139, FC 126/158, aerobico 3,4 Buono, TSB +2 Bilanciato.">
<meta name="twitter:image" content="https://forzaquotidiana.it/img/allenamenti/amazfit/2026-09-21-a1-riepilogo.webp">
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
        <a href="/allenamenti/">Allenamenti</a> · <a href="/allenamenti/sessioni/">Sessioni</a> · 21 settembre 2026
      </nav>
      <div class="session-hero__top">
        <span class="session-hero__badge">A1</span>
        <time class="session-hero__time" datetime="2026-09-21T13:05">21 settembre 2026 · ore 13:05 · lunedì</time>
      </div>
      <h1>Petto · schiena · spalle — A1 settimana 4</h1>
      <p class="session-hero__sub">51 min, carico 139, FC 126/158, 480 kcal — 23 serie · aerobico 3,4 Buono · sforzo 82/150 · TSB +2 Bilanciato</p>
      <dl class="session-kpis" aria-label="Metriche principali sessione">
        <div class="session-kpis__item session-kpis__item--accent"><dt>Durata</dt><dd>00:51:15</dd></div>
        <div class="session-kpis__item"><dt>FC media</dt><dd>126</dd></div>
        <div class="session-kpis__item"><dt>FC max</dt><dd>158</dd></div>
        <div class="session-kpis__item"><dt>Calorie</dt><dd>480</dd></div>
        <div class="session-kpis__item"><dt>Carico</dt><dd>139</dd></div>
        <div class="session-kpis__item"><dt>Serie</dt><dd>23</dd></div>
      </dl>
      <p class="session-hero__refs">Scheda di riferimento: <a href="/admin/"><strong>A1</strong> · Blocco 1 · Ipertrofia accumulo</a> · Precedente: <a href="/allenamenti/sessioni/2026-09-19-b2/">B2 · 19 settembre</a> · Sett. 3: <a href="/allenamenti/sessioni/2026-09-14-a1/">A1 · 14 settembre</a></p>
    </div>
  </header>

  <div class="wrap prose prose--wide session-body">
    <!-- TSB-START -->
    <section class="session-panel session-panel--tsb" aria-labelledby="tsb-modulo-2026-09-21">
      <span class="session-panel__label" id="tsb-modulo-2026-09-21">Fitness · fatica · riposo</span>
      ${tsbHtml}
    </section>
    <!-- TSB-END -->

    <!-- GUILE-START -->
    <section class="session-panel session-panel--guile guile-panel" aria-labelledby="guile-2026-09-21-a1">
      <span class="session-panel__label" id="guile-2026-09-21-a1">Spirito Guile · umorismo pro</span>
      <p class="guile-panel__lead">Tre illustrazioni IA — tono arcade su A1 upper body. Export Zepp = fonte numerica.</p>
      <div class="guile-strip guile-strip--3" aria-label="Galleria illustrazioni A1">
        <figure class="guile-card" style="--guile-i:0">
          <span class="ai-photo-wrap guile-card__frame">
            <img src="/img/allenamenti/guile/2026-09-07-a1-realistic.webp" alt="Gino upper body — fotorealistica sessione A1" width="640" height="360" loading="lazy" data-ai="generated">
            <span class="ai-photo-mark" aria-hidden="true">Foto AI</span>
          </span>
          <figcaption>Upper · fotorealistica</figcaption>
        </figure>
        <figure class="guile-card" style="--guile-i:1">
          <span class="ai-photo-wrap guile-card__frame">
            <img src="/img/allenamenti/guile/guile-scheda-1-spotter.webp" alt="Spotter stile arcade — A1" width="640" height="360" loading="lazy" data-ai="generated">
            <span class="ai-photo-mark" aria-hidden="true">Foto AI</span>
          </span>
          <figcaption>Spotter · arcade</figcaption>
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

    <section class="session-panel" aria-labelledby="nota-sessione">
      <span class="session-panel__label" id="nota-sessione">Nota di Gino</span>
      <p class="session-note"><strong>A1</strong> lunedì <strong>13:05</strong> — rientro post-weekend B2, avvio settimana 4. <strong>23 serie</strong> in <strong>00:51:15</strong>, recupero <strong>37:39</strong>, carico <strong>139</strong> — seduta più corta dell'A1 del 14/09 (57 min, carico 174) ma FC media simile.</p>
      <p class="session-note">Profilo cardio intenso: <strong>16 min anaerobica</strong> + <strong>4 min VO₂</strong>, FC max <strong>158</strong>. Sonno weekend corto (~5:11, a letto 02:35), HRV trend domenica <strong>53</strong>. TSB <strong>+2 Bilanciato</strong> (CTL 39 / ATL 37) — corpo riposato dal weekend. Sforzo giornaliero <strong>82/150</strong> (54%).</p>
    </section>

    <section class="session-panel session-panel--readiness" aria-labelledby="readiness-title">
      <span class="session-panel__label">Readiness · sonno · HRV</span>
      <h2 id="readiness-title">Metriche giornata · Zepp · 21/09</h2>
      <p class="session-panel__intro">Export parziale readiness: sonno notte dom-lun <strong>~5:11</strong> (02:35–07:46), HRV trend <strong>53</strong>, HybridCharge domenica <strong>42</strong>. TSB <strong>+2,0 Bilanciato</strong>, carico sforzo <strong>82/150</strong>.</p>

      <div class="amazfit-tsb-hero" aria-label="Modulo TSB — 21 settembre">
        <figure class="phone-shot phone-shot--landscape phone-shot--solo">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-21-a1-tsb.webp" alt="Modulo TSB Zepp — CTL 39 ATL 37 TSB +2 Bilanciato, 21 settembre" width="1024" height="473" loading="eager" fetchpriority="high">
          </div>
          <figcaption>TSB · 21/09 · Bilanciato · CTL 39 · ATL 37</figcaption>
        </figure>
      </div>

      <div class="amazfit-gallery" aria-label="Screenshot Zepp — readiness 21 settembre">
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-21-a1-readiness-panoramica.webp" alt="Panoramica 21 settembre — sforzo 82, fitness 39, TSB 2" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Panoramica · sforzo 82 · fitness 39</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-21-a1-readiness-metriche.webp" alt="Trend settimanale HRV RHR HybridCharge — 21 settembre" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Trend 7 gg · HRV 53 dom · RHR 53</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-21-a1-readiness-dettaglio.webp" alt="Dettaglio metriche 21 settembre — ATL 37, obiettivo sforzo 150" width="390" height="844" loading="lazy">
          </div>
          <figcaption>ATL 37 · obiettivo sforzo 150</figcaption>
        </figure>
      </div>

      <div class="amazfit-data" aria-label="Dati readiness estratti">
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Modulo allenamento TSB · 21/09</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>+2,0</strong><span>TSB · Bilanciato</span></div>
            <div class="amazfit-card__cell"><strong>39,0</strong><span>Fitness · CTL</span></div>
            <div class="amazfit-card__cell"><strong>37,0</strong><span>Fatica · ATL</span></div>
            <div class="amazfit-card__cell"><strong>139</strong><span>Carico sessione</span></div>
            <div class="amazfit-card__cell"><strong>13:05</strong><span>Inizio workout</span></div>
          </div>
        </div>
        <div class="amazfit-card">
          <p class="amazfit-card__title">Sonno · readiness · 21/09</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>5:11</strong><span>Durata · da trend</span></div>
            <div class="amazfit-card__cell"><strong>02:35</strong><span>A letto · dom</span></div>
            <div class="amazfit-card__cell"><strong>07:46</strong><span>Risveglio · lun</span></div>
            <div class="amazfit-card__cell"><strong>54</strong><span>FC sonno · bpm</span></div>
            <div class="amazfit-card__cell"><strong>82</strong><span>Carico sforzo / 150</span></div>
          </div>
        </div>
        <div class="amazfit-card">
          <p class="amazfit-card__title">HRV · FC riposo · 21/09</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>53</strong><span>HRV · ms · trend dom</span></div>
            <div class="amazfit-card__cell"><strong>43</strong><span>Baseline</span></div>
            <div class="amazfit-card__cell"><strong>53</strong><span>FC a riposo · Ottimale</span></div>
            <div class="amazfit-card__cell"><strong>42</strong><span>HybridCharge dom</span></div>
          </div>
        </div>
      </div>
    </section>

    <section class="session-panel session-panel--metabolic">
    <section class="metabolic-block" aria-labelledby="metabolic-title">
      <h2 id="metabolic-title">Dati metabolici · Amazfit</h2>
      <p class="metabolic-block__device"><strong>Amazfit Active 2 NFC</strong> · sync app Zepp · Allenamento muscolare</p>
      <p class="amazfit-gallery__lead">Export Zepp — 21 settembre ore 13:05, <strong>23 serie</strong>. Riepilogo e grafico FC a tutta larghezza.</p>

      <div class="amazfit-riepilogo-hero" aria-label="Resoconto Zepp — 21 settembre">
        <figure class="phone-shot phone-shot--full phone-shot--solo">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-21-a1-riepilogo.webp" alt="Riepilogo Zepp 21 settembre A1 — 23 serie, 480 kcal, FC 126, durata 00:51:15, carico 139" width="390" height="430" loading="eager" fetchpriority="high">
          </div>
          <figcaption>Riepilogo · 00:51:15 · 23 serie · carico 139 · 480 kcal</figcaption>
        </figure>
      </div>

      <div class="amazfit-fc-hero" aria-label="Grafico FC — 21 settembre">
        <figure class="phone-shot phone-shot--full phone-shot--solo">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-21-a1-fc-grafico.webp" alt="Grafico FC 21 settembre — media 126 max 158 bpm, 51 minuti" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Grafico FC · max 158 · 51 min</figcaption>
        </figure>
      </div>

      <div class="amazfit-gallery" aria-label="Screenshot Zepp — tecnica 21 settembre">
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-21-a1-zone-effetto.webp" alt="Zone FC 21 settembre — aerobico 3,4 Buono, anaerobico 2,7 Medio" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Zone FC · anaerobica 31% · aerobica 37%</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-21-a1-tecnica.webp" alt="Muscoli petto/dorsali e radar tecnica — A1" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Muscoli + radar tecnica</figcaption>
        </figure>
      </div>

      <div class="amazfit-data" aria-label="Dati sessione 21 settembre">
        <div class="amazfit-card">
          <div class="amazfit-card__top">
            <div>
              <div class="amazfit-card__user">ginocapon</div>
              <div class="amazfit-card__meta">21 set · 13:05 · lunedì · A1</div>
            </div>
            <span class="amazfit-card__badge">23 serie</span>
          </div>
          <p class="amazfit-card__title">Riepilogo sessione</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>00:51:15</strong><span>Tempo allenamento</span></div>
            <div class="amazfit-card__cell"><strong>37:39</strong><span>Recupero tra set</span></div>
            <div class="amazfit-card__cell"><strong>126</strong><span>FC media · bpm</span></div>
            <div class="amazfit-card__cell"><strong>158</strong><span>FC max · bpm</span></div>
            <div class="amazfit-card__cell"><strong>480</strong><span>Calorie · kcal</span></div>
            <div class="amazfit-card__cell"><strong>139</strong><span>Carico allenamento</span></div>
          </div>
        </div>
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Zone cardiache · minuti</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell"><strong>00:41</strong><span>Leggera · 81–96</span></div>
            <div class="amazfit-card__cell"><strong>11:28</strong><span>Intensiva · 97–113</span></div>
            <div class="amazfit-card__cell"><strong>19:03</strong><span>Aerobica · 114–129</span></div>
            <div class="amazfit-card__cell"><strong>16:03</strong><span>Anaerobica · 130–145</span></div>
            <div class="amazfit-card__cell"><strong>03:58</strong><span>VO₂ max · 146+</span></div>
          </div>
        </div>
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Effetto allenamento · Zepp</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>3,4</strong><span>Aerobico · Buono</span></div>
            <div class="amazfit-card__cell"><strong>2,7</strong><span>Anaerobico · Medio</span></div>
          </div>
        </div>
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Muscoli usati · map Zepp</p>
          <p><strong>Primari:</strong> petto, dorsali. <strong>Secondari:</strong> deltoidi, tricipiti, trapezio. Coerente con A1 upper — petto e schiena dominanti, radar tecnica alto.</p>
        </div>
      </div>

      <p class="metabolic-note"><strong>Analisi.</strong> Rispetto all'A1 del 14/09: −1 serie, −6 min, carico <strong>139 vs 174</strong> (−20%), FC max +2 bpm. Profilo più anaerobico relativo (31% vs 23% zona 130–145). Effetto aerobico stabile (<strong>3,4 Buono</strong>), anaerobico <strong>2,7 Medio</strong>. Entrata con TSB <strong>+2</strong> dopo weekend — CTL in salita (39), ATL contenuto (37). Sonno weekend corto e tardivo (02:35) ma seduta portata a termine con tecnica pulita. Grafico FC: picchi 150+ nella seconda metà, coerente con chiusura spalle/petto.</p>

      <article class="hr-log hr-log--elevated" data-session="2026-09-21T13:05" data-duration-corrected="false">
        <div class="hr-metrics">
          <div class="hr-metric"><strong>00:51:15</strong><span>Durata</span></div>
          <div class="hr-metric"><strong>126</strong><span>FC media</span></div>
          <div class="hr-metric"><strong>158</strong><span>FC max</span></div>
          <div class="hr-metric"><strong>480</strong><span>Calorie</span></div>
          <div class="hr-metric"><strong>139</strong><span>Carico</span></div>
          <div class="hr-metric"><strong>23</strong><span>Serie</span></div>
        </div>
      </article>
    </section>
    </section>

    <nav class="session-nav" aria-label="Navigazione sessione">
      <a class="session-nav__primary" href="/allenamenti/sessioni/">← Tutte le sessioni</a>
      <a href="/admin/">A1 · Blocco 1 admin</a>
      <a href="/allenamenti/sessioni/2026-09-19-b2/">← B2 · 19 settembre</a>
    </nav>
    <p class="session-meta-footer">Ultimo aggiornamento: 21 settembre 2026 · export Zepp (readiness parziale)</p>
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
console.log("OK allenamenti/sessioni/2026-09-21-a1/index.html");
