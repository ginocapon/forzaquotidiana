#!/usr/bin/env node
/** Scaffold sessione 2026-09-04-a2 da template B1 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderTsbModule } from "./tsb-render.mjs";

const REPO = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const data = JSON.parse(fs.readFileSync(path.join(REPO, "data/training-load.json"), "utf8"));
const tsbHtml = renderTsbModule(data, "2026-09-04", { sessionId: "sess-2026-09-04-a2" });

const dir = path.join(REPO, "allenamenti/sessioni/2026-09-04-a2");
fs.mkdirSync(dir, { recursive: true });

const html = `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<title>4 settembre 2026 — A2 petto · schiena · spalle | Sessione · La Forza Quotidiana</title>
<meta name="description" content="Sessione 4 settembre 2026 ore 13:08: A2 Blocco 1. 22 serie, 50 min, carico 100, FC 122/147, 446 kcal. Upper body.">
<link rel="canonical" href="https://forzaquotidiana.it/allenamenti/sessioni/2026-09-04-a2/">
<meta property="og:type" content="article">
<meta property="og:site_name" content="La Forza Quotidiana">
<meta property="og:locale" content="it_IT">
<meta property="og:url" content="https://forzaquotidiana.it/allenamenti/sessioni/2026-09-04-a2/">
<meta property="og:title" content="4 settembre 2026 — A2 · petto · schiena · spalle">
<meta property="og:image" content="https://forzaquotidiana.it/img/allenamenti/amazfit/2026-09-04-a2-riepilogo.webp">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="4 settembre 2026 — A2 · upper Blocco 1">
<meta name="twitter:description" content="50 min, 22 serie, carico 100, FC 122/147, aerobico 3,3 Buono.">
<meta name="twitter:image" content="https://forzaquotidiana.it/img/allenamenti/amazfit/2026-09-04-a2-riepilogo.webp">
<link rel="preload" as="image" href="/img/allenamenti/session-hero-bg.webp">
<link rel="stylesheet" href="/css/styles.css?v=69">
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
        <a href="/allenamenti/">Allenamenti</a> · <a href="/allenamenti/sessioni/">Sessioni</a> · 4 settembre 2026
      </nav>
      <div class="session-hero__top">
        <span class="session-hero__badge">A2</span>
        <time class="session-hero__time" datetime="2026-09-04T13:08">4 settembre 2026 · ore 13:08 · giovedì</time>
      </div>
      <h1>Petto · schiena · spalle — A2 Blocco 1</h1>
      <p class="session-hero__sub">50 min, carico 100, FC 122/147, 446 kcal — 22 serie · aerobico 3,3 Buono · map Zepp petto/dorsali/spalle</p>
      <dl class="session-kpis" aria-label="Metriche principali sessione">
        <div class="session-kpis__item session-kpis__item--accent"><dt>Durata</dt><dd>00:49:57</dd></div>
        <div class="session-kpis__item"><dt>FC media</dt><dd>122</dd></div>
        <div class="session-kpis__item"><dt>FC max</dt><dd>147</dd></div>
        <div class="session-kpis__item"><dt>Calorie</dt><dd>446</dd></div>
        <div class="session-kpis__item"><dt>Carico</dt><dd>100</dd></div>
        <div class="session-kpis__item"><dt>Serie</dt><dd>22</dd></div>
      </dl>
      <p class="session-hero__refs">Scheda di riferimento: <a href="/admin/"><strong>A2</strong> · Blocco 1 · Ipertrofia accumulo</a> · Precedente: <a href="/allenamenti/sessioni/2026-09-01-b1/">B1 · 1 settembre</a></p>
    </div>
  </header>

  <div class="wrap prose prose--wide session-body">
    <!-- TSB-START -->
    <section class="session-panel session-panel--tsb" aria-labelledby="tsb-modulo-2026-09-04">
      <span class="session-panel__label" id="tsb-modulo-2026-09-04">Fitness · fatica · riposo</span>
      ${tsbHtml}
    </section>
    <!-- TSB-END -->

    <!-- GUILE-START -->
    <section class="session-panel session-panel--guile guile-panel" aria-labelledby="guile-2026-09-04-a2">
      <span class="session-panel__label" id="guile-2026-09-04-a2">Spirito Guile · umorismo pro</span>
      <p class="guile-panel__lead">Tre illustrazioni IA — <strong>una fotorealistica</strong> (panca inclinata, viso Gino), due stile arcade. Export Zepp = fonte numerica.</p>
      <div class="guile-strip guile-strip--1" aria-label="Galleria illustrazioni A2">
        <figure class="guile-card" style="--guile-i:0">
          <span class="ai-photo-wrap guile-card__frame">
            <img src="/img/allenamenti/guile/2026-09-04-a2-realistic.webp" alt="Gino alla panca inclinata — fotorealistica sessione A2" width="640" height="360" loading="lazy" data-ai="generated">
            <span class="ai-photo-mark" aria-hidden="true">Foto AI</span>
          </span>
          <figcaption>Panca inclinata · fotorealistica</figcaption>
        </figure>
        <figure class="guile-card" style="--guile-i:1">
          <span class="ai-photo-wrap guile-card__frame">
            <img src="/img/allenamenti/guile/guile-scheda-1-spotter.webp" alt="Spotter stile arcade — assistenza panca A2" width="640" height="360" loading="lazy" data-ai="generated">
            <span class="ai-photo-mark" aria-hidden="true">Foto AI</span>
          </span>
          <figcaption>Spotter · panca</figcaption>
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

    <section class="session-panel session-panel--readiness">
      <h2>Readiness · sonno · HRV · HybridCharge</h2>
      <p class="session-panel__intro">Export Zepp pre-sessione — 4 settembre ore 13:08. TSB <strong>-4 Bilanciato</strong>, HRV <strong>39 ms Buono</strong>, HybridCharge <strong>56 Basso</strong>.</p>

      <div class="amazfit-tsb-hero" aria-label="Modulo TSB screenshot — 4 settembre">
        <figure class="phone-shot phone-shot--full phone-shot--solo">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-04-a2-tsb.webp" alt="Modulo TSB 4 settembre — CTL 24 ATL 28 TSB -4 Bilanciato" width="844" height="390" loading="eager" fetchpriority="high">
          </div>
          <figcaption>TSB · 04/09 · Bilanciato · CTL 24 · ATL 28</figcaption>
        </figure>
      </div>

      <div class="amazfit-gallery" aria-label="Screenshot Zepp — readiness 4 settembre">
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-04-a2-hybridcharge.webp" alt="HybridCharge 4 settembre — 56 Basso, sonno +51, allenamento 13:08–13:58" width="390" height="844" loading="lazy">
          </div>
          <figcaption>HybridCharge 56 · Basso</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-04-a2-readiness-metriche.webp" alt="Metriche principali 4 settembre — fitness 24, affaticamento 28, sonno profondo 0:53" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Metriche · fitness 24 · affaticamento 28</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-04-a2-hrv.webp" alt="HRV 4 settembre — 39 ms Buono, baseline 42" width="390" height="844" loading="lazy">
          </div>
          <figcaption>HRV 39 · Buono</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-04-a2-sonno-metriche.webp" alt="Sonno 4 settembre — 6:53 Normale, profondo 0:53, REM 2:12, veglia 0:44" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Sonno 6:53 · regolarità 43%</figcaption>
        </figure>
      </div>

      <div class="amazfit-data" aria-label="Dati readiness estratti">
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Modulo allenamento TSB · 04/09</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>-4,0</strong><span>TSB · Bilanciato</span></div>
            <div class="amazfit-card__cell"><strong>24,0</strong><span>Fitness · CTL</span></div>
            <div class="amazfit-card__cell"><strong>28,0</strong><span>Fatica · ATL</span></div>
            <div class="amazfit-card__cell"><strong>100</strong><span>Carico sessione</span></div>
            <div class="amazfit-card__cell"><strong>13:08</strong><span>Inizio workout</span></div>
          </div>
        </div>
        <div class="amazfit-card">
          <p class="amazfit-card__title">Sonno · readiness · 04/09</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>6:53</strong><span>Durata · Normale</span></div>
            <div class="amazfit-card__cell"><strong>43%</strong><span>Regolarità · Attenzione</span></div>
            <div class="amazfit-card__cell"><strong>0:53</strong><span>Profondo · Leggero</span></div>
            <div class="amazfit-card__cell"><strong>56</strong><span>HybridCharge risveglio</span></div>
            <div class="amazfit-card__cell"><strong>54</strong><span>Obiettivo sforzo giorno</span></div>
          </div>
        </div>
        <div class="amazfit-card">
          <p class="amazfit-card__title">HRV · FC riposo · 04/09</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>39</strong><span>HRV · ms · Buono</span></div>
            <div class="amazfit-card__cell"><strong>42</strong><span>Baseline</span></div>
            <div class="amazfit-card__cell"><strong>52</strong><span>FC a riposo</span></div>
            <div class="amazfit-card__cell"><strong>67</strong><span>Score sonno</span></div>
          </div>
        </div>
      </div>
    </section>

    <section class="session-panel session-panel--metabolic">
    <section class="metabolic-block" aria-labelledby="metabolic-title">
      <h2 id="metabolic-title">Dati metabolici · Amazfit</h2>
      <p class="metabolic-block__device"><strong>Amazfit Active 2 NFC</strong> · sync app Zepp · Allenamento muscolare</p>
      <p class="amazfit-gallery__lead">Export Zepp — 4 settembre ore 13:08, <strong>22 serie</strong>. Riepilogo e grafico FC a tutta larghezza.</p>

      <div class="amazfit-riepilogo-hero" aria-label="Resoconto Zepp — 4 settembre">
        <figure class="phone-shot phone-shot--full phone-shot--solo">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-04-a2-riepilogo.webp" alt="Riepilogo Zepp 4 settembre A2 — 22 serie, 446 kcal, FC 122, durata 49:57, carico 100" width="390" height="430" loading="eager" fetchpriority="high">
          </div>
          <figcaption>Riepilogo · 00:49:57 · 22 serie · carico 100 · 446 kcal</figcaption>
        </figure>
      </div>

      <div class="amazfit-fc-hero" aria-label="Grafico FC — 4 settembre">
        <figure class="phone-shot phone-shot--full phone-shot--solo">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-04-a2-fc-grafico.webp" alt="Grafico FC 4 settembre — media 122 max 147 bpm, 50 minuti" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Grafico FC · max 147 · 50 min</figcaption>
        </figure>
      </div>

      <div class="amazfit-gallery" aria-label="Screenshot Zepp — tecnica 4 settembre">
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-04-a2-zone-effetto.webp" alt="Zone FC 4 settembre — aerobico 3,3 Buono, anaerobico 1,7 Basso" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Zone FC · aerobico 50% · anaerobico 22%</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-04-a2-valutazione.webp" alt="Muscoli petto/dorsali/spalle e radar tecnica — A2 upper" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Muscoli + radar tecnica</figcaption>
        </figure>
      </div>

      <div class="amazfit-data" aria-label="Dati sessione 4 settembre">
        <div class="amazfit-card">
          <div class="amazfit-card__top">
            <div>
              <div class="amazfit-card__user">ginocapon</div>
              <div class="amazfit-card__meta">4 set · 13:08 · giovedì · A2</div>
            </div>
            <span class="amazfit-card__badge">22 serie</span>
          </div>
          <p class="amazfit-card__title">Riepilogo sessione</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>00:49:57</strong><span>Tempo allenamento</span></div>
            <div class="amazfit-card__cell"><strong>36:48</strong><span>Recupero tra set</span></div>
            <div class="amazfit-card__cell"><strong>122</strong><span>FC media · bpm</span></div>
            <div class="amazfit-card__cell"><strong>147</strong><span>FC max · bpm</span></div>
            <div class="amazfit-card__cell"><strong>446</strong><span>Calorie · kcal</span></div>
            <div class="amazfit-card__cell"><strong>100</strong><span>Carico allenamento</span></div>
          </div>
        </div>
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Zone cardiache · minuti</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell"><strong>0:00</strong><span>Leggera · 81–96</span></div>
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>13:18</strong><span>Intensiva · 97–113</span></div>
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>25:15</strong><span>Aerobica · 114–129</span></div>
            <div class="amazfit-card__cell"><strong>11:21</strong><span>Anaerobica · 130–145</span></div>
            <div class="amazfit-card__cell"><strong>0:02</strong><span>VO₂ max · 146+</span></div>
          </div>
        </div>
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Effetto allenamento · Zepp</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>3,3</strong><span>Aerobico · Buono</span></div>
            <div class="amazfit-card__cell"><strong>1,7</strong><span>Anaerobico · Basso</span></div>
          </div>
        </div>
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Muscoli usati · map Zepp</p>
          <p><strong>Primari:</strong> petto, dorsali. <strong>Secondari:</strong> deltoidi, trapezio. Coerente con A2 upper body Blocco 1.</p>
        </div>
      </div>

      <p class="metabolic-note"><strong>Valutazione conclusiva.</strong> Seduta <strong>A2</strong> giovedì (<strong>50 min</strong>, <strong>22 serie</strong>), carico <strong>100</strong>, FC max <strong>147</strong>. Profilo cardio prevalentemente aerobico (50% zona aerobica), effetto aerobico <strong>3,3 Buono</strong>. TSB -4 e HRV 39 indicano carico gestibile — buon rientro upper dopo B1 lunedì.</p>

      <article class="hr-log hr-log--elevated" data-session="2026-09-04T13:08" data-duration-corrected="false">
        <div class="hr-metrics">
          <div class="hr-metric"><strong>00:49:57</strong><span>Durata</span></div>
          <div class="hr-metric"><strong>122</strong><span>FC media</span></div>
          <div class="hr-metric"><strong>147</strong><span>FC max</span></div>
          <div class="hr-metric"><strong>446</strong><span>Calorie</span></div>
          <div class="hr-metric"><strong>100</strong><span>Carico</span></div>
          <div class="hr-metric"><strong>22</strong><span>Serie</span></div>
        </div>
      </article>
    </section>
    </section>

    <nav class="session-nav" aria-label="Navigazione sessione">
      <a class="session-nav__primary" href="/allenamenti/sessioni/">← Tutte le sessioni</a>
      <a href="/admin/">A2 · Blocco 1 admin</a>
      <a href="/allenamenti/sessioni/2026-09-01-b1/">← B1 · 1 settembre</a>
    </nav>
    <p class="session-meta-footer">Ultimo aggiornamento: 4 settembre 2026 · export Zepp completo + Guile IA</p>
  </div>
</main>

<footer class="site-footer">
  <div class="wrap"><p>© <span id="y"></span> La Forza Quotidiana · Gino Capon</p></div>
</footer>
<script>document.getElementById("y").textContent = new Date().getFullYear();</script>
<script src="/js/vendor/lenis.min.js" defer></script>
<script src="/js/smooth-scroll.js?v=2" defer></script>
<script src="/js/main.js?v=29" defer></script>
<script src="/js/session-guile.js?v=1" defer></script>
<script src="/js/cookie-consent.js?v=4" defer></script>
<script src="/js/training-load-chart.js?v=3" defer></script>
</body>
</html>
`;

fs.writeFileSync(path.join(dir, "index.html"), html);
console.log("OK allenamenti/sessioni/2026-09-04-a2/index.html");
