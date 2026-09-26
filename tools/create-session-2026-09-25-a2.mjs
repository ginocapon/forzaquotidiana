#!/usr/bin/env node
/** Scaffold sessione 2026-09-25-a2 — venerdì A2 chiusura settimana 4 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderTsbModule } from "./tsb-render.mjs";

const REPO = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const data = JSON.parse(fs.readFileSync(path.join(REPO, "data/training-load.json"), "utf8"));
const tsbHtml = renderTsbModule(data, "2026-09-25", { sessionId: "sess-2026-09-25-a2" });

const dir = path.join(REPO, "allenamenti/sessioni/2026-09-25-a2");
fs.mkdirSync(dir, { recursive: true });

const html = `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<title>25 settembre 2026 — A2 petto · schiena · spalle | Sessione · La Forza Quotidiana</title>
<meta name="description" content="Sessione 25 settembre 2026 ore 13:10: A2 Blocco 1 settimana 4. 24 serie, 63 min, carico 108, FC 118/148, 529 kcal. Chiusura ciclo TSB +2 Bilanciato.">
<link rel="canonical" href="https://forzaquotidiana.it/allenamenti/sessioni/2026-09-25-a2/">
<meta property="og:type" content="article">
<meta property="og:site_name" content="La Forza Quotidiana">
<meta property="og:locale" content="it_IT">
<meta property="og:url" content="https://forzaquotidiana.it/allenamenti/sessioni/2026-09-25-a2/">
<meta property="og:title" content="25 settembre 2026 — A2 · petto · schiena · spalle">
<meta property="og:image" content="https://forzaquotidiana.it/img/allenamenti/amazfit/2026-09-25-a2-riepilogo.webp">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="25 settembre 2026 — A2 · settimana 3 Blocco 1">
<meta name="twitter:description" content="63 min, 24 serie, carico 108, FC 118/148, sonno 5:00, TSB +2 Bilanciato.">
<meta name="twitter:image" content="https://forzaquotidiana.it/img/allenamenti/amazfit/2026-09-25-a2-riepilogo.webp">
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
        <a href="/allenamenti/">Allenamenti</a> · <a href="/allenamenti/sessioni/">Sessioni</a> · 25 settembre 2026
      </nav>
      <div class="session-hero__top">
        <span class="session-hero__badge">A2</span>
        <time class="session-hero__time" datetime="2026-09-25T13:10">25 settembre 2026 · ore 13:10 · venerdì</time>
      </div>
      <h1>Petto · schiena · spalle — chiusura settimana 4</h1>
      <p class="session-hero__sub">63 min, carico 108, FC 118/148, 529 kcal — 24 serie · aerobico 3,1 Buono · sforzo 103/90 · TSB +2 Bilanciato</p>
      <dl class="session-kpis" aria-label="Metriche principali sessione">
        <div class="session-kpis__item session-kpis__item--accent"><dt>Durata</dt><dd>01:02:52</dd></div>
        <div class="session-kpis__item"><dt>FC media</dt><dd>118</dd></div>
        <div class="session-kpis__item"><dt>FC max</dt><dd>148</dd></div>
        <div class="session-kpis__item"><dt>Calorie</dt><dd>529</dd></div>
        <div class="session-kpis__item"><dt>Carico</dt><dd>108</dd></div>
        <div class="session-kpis__item"><dt>Serie</dt><dd>24</dd></div>
      </dl>
      <p class="session-hero__refs">Scheda di riferimento: <a href="/admin/"><strong>A2</strong> · Blocco 1 · Ipertrofia accumulo</a> · Precedente: <a href="/allenamenti/sessioni/2026-09-22-b1/">B1 · 22 settembre</a> · Stesso slot: <a href="/allenamenti/sessioni/2026-09-18-a2/">A2 · 18 settembre</a></p>
    </div>
  </header>

  <div class="wrap prose prose--wide session-body">
    <!-- TSB-START -->
    <section class="session-panel session-panel--tsb" aria-labelledby="tsb-modulo-2026-09-25">
      <span class="session-panel__label" id="tsb-modulo-2026-09-25">Fitness · fatica · riposo</span>
      ${tsbHtml}
    </section>
    <!-- TSB-END -->

    <!-- GUILE-START -->
    <section class="session-panel session-panel--guile guile-panel" aria-labelledby="guile-2026-09-25-a2">
      <span class="session-panel__label" id="guile-2026-09-25-a2">Spirito Guile · umorismo pro</span>
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
      <p class="session-note"><strong>A2</strong> venerdì pranzo <strong>13:10</strong> — chiusura settimana 4 Blocco 1, upper body dopo il B1 di martedì. <strong>24 serie</strong> in <strong>01:02:52</strong>, recupero <strong>46:29</strong>, carico <strong>108</strong> — simile all’A2 del 18/09 (25 serie, carico 105) con FC leggermente più alta.</p>
      <p class="session-note">Profilo cardio: FC media <strong>118</strong>, max <strong>148</strong> — <strong>44% in zona aerobica</strong> (28 min), effetto aerobico/anaerobico <strong>3,1 Buono / 2,3 Medio</strong>. Readiness fragile: sonno <strong>5:00</strong> (01:47–06:47, score 57), HRV <strong>46</strong> Buono sopra baseline, HybridCharge <strong>70</strong> → <strong>15</strong> post workout. TSB <strong>+2 Bilanciato</strong> (CTL 35 / ATL 33). Sforzo giornaliero <strong>103/90</strong> (100%).</p>
    </section>

    <section class="session-panel session-panel--readiness" aria-labelledby="readiness-title">
      <span class="session-panel__label">Readiness · sonno · HRV</span>
      <h2 id="readiness-title">Metriche giornata · Zepp · 25/09</h2>
      <p class="session-panel__intro">Sonno <strong>5:00 Fai attenzione</strong> (score 57), regolarità <strong>63% Normale</strong>, HRV <strong>46 Buono</strong>, FC riposo <strong>48 Ottimale</strong>, HybridCharge <strong>70 Discreto</strong> → <strong>15</strong> post sessione. TSB <strong>+2,0 Bilanciato</strong>.</p>

      <div class="amazfit-tsb-hero" aria-label="Modulo TSB — 25 settembre">
        <figure class="phone-shot phone-shot--landscape phone-shot--solo">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-25-a2-tsb.webp" alt="Modulo TSB Zepp — CTL 35 ATL 33 TSB +2 Bilanciato, 25 settembre" width="1024" height="473" loading="eager" fetchpriority="high">
          </div>
          <figcaption>TSB · 25/09 · Bilanciato · CTL 38 · ATL 39</figcaption>
        </figure>
      </div>

      <div class="amazfit-gallery" aria-label="Screenshot Zepp — readiness 25 settembre">
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-25-a2-hybridcharge.webp" alt="Sforzo 25 settembre — 100%, allenamento 13:10-14:13" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Sforzo 103/90 · workout 13:10–14:13</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-25-a2-hybridcharge-analisi.webp" alt="Analisi HybridCharge — −10 punti post allenamento muscolare" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Analisi HC · −10 punti workout</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-25-a2-readiness-panoramica.webp" alt="Panoramica 25 settembre — sonno 57, HybridCharge 15, sforzo 100%" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Panoramica · sforzo 100% · HC 27</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-25-a2-readiness-metriche.webp" alt="Trend 25 settembre — HRV 46, RHR 48, HybridCharge 70" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Trend 7 gg · HRV 46 · RHR 48</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-25-a2-hrv.webp" alt="HRV 25 settembre — 46 ms Buono, baseline 43" width="390" height="844" loading="lazy">
          </div>
          <figcaption>HRV 46 · Buono · sopra baseline</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-25-a2-sonno-score.webp" alt="Sonno score 25 settembre — 57 Fai attenzione" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Score sonno 69 · Normale</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-25-a2-sonno-metriche.webp" alt="Sonno 25 settembre — 5:00, profondo 0:49, REM 1:17, 01:47-06:47" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Sonno 5:00 · regolarità 63%</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-25-a2-sonno-fc.webp" alt="FC sonno 25 settembre — media 48 bpm, trend settimanale" width="390" height="844" loading="lazy">
          </div>
          <figcaption>FC sonno 55 · 6:58 a letto</figcaption>
        </figure>
      </div>

      <div class="amazfit-data" aria-label="Dati readiness estratti">
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Modulo allenamento TSB · 25/09</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>+2,0</strong><span>TSB · Bilanciato</span></div>
            <div class="amazfit-card__cell"><strong>35,0</strong><span>Fitness · CTL</span></div>
            <div class="amazfit-card__cell"><strong>33,0</strong><span>Fatica · ATL</span></div>
            <div class="amazfit-card__cell"><strong>108</strong><span>Carico sessione</span></div>
            <div class="amazfit-card__cell"><strong>13:10</strong><span>Inizio workout</span></div>
          </div>
        </div>
        <div class="amazfit-card">
          <p class="amazfit-card__title">Sonno · readiness · 25/09</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>5:00</strong><span>Durata · Attenzione</span></div>
            <div class="amazfit-card__cell"><strong>63%</strong><span>Regolarità · Normale</span></div>
            <div class="amazfit-card__cell"><strong>0:49</strong><span>Profondo · Leggero</span></div>
            <div class="amazfit-card__cell"><strong>57</strong><span>Score sonno · Attenzione</span></div>
            <div class="amazfit-card__cell"><strong>48</strong><span>FC sonno · bpm</span></div>
            <div class="amazfit-card__cell"><strong>103</strong><span>Carico sforzo / 90</span></div>
          </div>
        </div>
        <div class="amazfit-card">
          <p class="amazfit-card__title">HRV · FC riposo · 25/09</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>46</strong><span>HRV · ms · Buono</span></div>
            <div class="amazfit-card__cell"><strong>43</strong><span>Baseline</span></div>
            <div class="amazfit-card__cell"><strong>48</strong><span>FC a riposo · Ottimale</span></div>
            <div class="amazfit-card__cell"><strong>15</strong><span>HybridCharge post workout</span></div>
          </div>
        </div>
      </div>
    </section>

    <section class="session-panel session-panel--metabolic">
    <section class="metabolic-block" aria-labelledby="metabolic-title">
      <h2 id="metabolic-title">Dati metabolici · Amazfit</h2>
      <p class="metabolic-block__device"><strong>Amazfit Active 2 NFC</strong> · sync app Zepp · Allenamento muscolare</p>
      <p class="amazfit-gallery__lead">Export Zepp — 25 settembre ore 13:10, <strong>24 serie</strong>. Riepilogo e grafico FC a tutta larghezza.</p>

      <div class="amazfit-riepilogo-hero" aria-label="Resoconto Zepp — 25 settembre">
        <figure class="phone-shot phone-shot--full phone-shot--solo">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-25-a2-riepilogo.webp" alt="Riepilogo Zepp 25 settembre A2 — 24 serie, 529 kcal, FC 118, durata 01:02:52, carico 108" width="390" height="430" loading="eager" fetchpriority="high">
          </div>
          <figcaption>Riepilogo · 01:02:52 · 24 serie · carico 108 · 529 kcal</figcaption>
        </figure>
      </div>

      <div class="amazfit-fc-hero" aria-label="Grafico FC — 25 settembre">
        <figure class="phone-shot phone-shot--full phone-shot--solo">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-25-a2-fc-grafico.webp" alt="Grafico FC 25 settembre — media 118 max 148 bpm, 63 minuti" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Grafico FC · max 148 · 63 min</figcaption>
        </figure>
      </div>

      <div class="amazfit-gallery" aria-label="Screenshot Zepp — tecnica 25 settembre">
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-25-a2-zone-effetto.webp" alt="Zone FC 25 settembre — aerobico 3,1 Buono, anaerobico 2,3 Medio" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Zone FC · aerobica 44% · effetto Buono/Medio</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-25-a2-tecnica.webp" alt="Muscoli petto/deltoidi e radar tecnica — A2" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Muscoli + radar tecnica</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-25-a2-readiness-dettaglio.webp" alt="Dettaglio metriche 25 settembre — carico sforzo 103, TSB +2, sonno 5:00" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Dettaglio metriche giornata</figcaption>
        </figure>
      </div>

      <div class="amazfit-data" aria-label="Dati sessione 25 settembre">
        <div class="amazfit-card">
          <div class="amazfit-card__top">
            <div>
              <div class="amazfit-card__user">ginocapon</div>
              <div class="amazfit-card__meta">25 set · 13:10 · venerdì · A2</div>
            </div>
            <span class="amazfit-card__badge">24 serie</span>
          </div>
          <p class="amazfit-card__title">Riepilogo sessione</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>01:02:52</strong><span>Tempo allenamento</span></div>
            <div class="amazfit-card__cell"><strong>46:29</strong><span>Recupero tra set</span></div>
            <div class="amazfit-card__cell"><strong>118</strong><span>FC media · bpm</span></div>
            <div class="amazfit-card__cell"><strong>148</strong><span>FC max · bpm</span></div>
            <div class="amazfit-card__cell"><strong>529</strong><span>Calorie · kcal</span></div>
            <div class="amazfit-card__cell"><strong>108</strong><span>Carico allenamento</span></div>
          </div>
        </div>
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Zone cardiache · minuti</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell"><strong>04:08</strong><span>Leggera · 81–96</span></div>
            <div class="amazfit-card__cell"><strong>20:27</strong><span>Intensiva · 97–113</span></div>
            <div class="amazfit-card__cell"><strong>27:57</strong><span>Aerobica · 114–129</span></div>
            <div class="amazfit-card__cell"><strong>10:08</strong><span>Anaerobica · 130–145</span></div>
            <div class="amazfit-card__cell"><strong>00:10</strong><span>VO₂ max · 146+</span></div>
          </div>
        </div>
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Effetto allenamento · Zepp</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>3,1</strong><span>Aerobico · Buono</span></div>
            <div class="amazfit-card__cell"><strong>2,3</strong><span>Anaerobico · Medio</span></div>
          </div>
        </div>
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Muscoli usati · map Zepp</p>
          <p><strong>Primari:</strong> petto, dorsali superiori. <strong>Secondari:</strong> deltoidi anteriori, trapezio, tricipiti. Coerente con A2 upper body — petto e spalle dominanti.</p>
        </div>
      </div>

      <p class="metabolic-note"><strong>Analisi.</strong> Rispetto all’A2 del 18/09 (sett. 3): −1 serie, +38 s durata, carico <strong>108 vs 105</strong>, FC media +3 bpm (118 vs 115), max −3 bpm. Profilo più aerobico (+1 min in zona 114–129, 44% vs 27%), anaerobico invariato in gauge (<strong>2,3 Medio</strong>). Entrata con TSB <strong>+2</strong> (CTL 35 / ATL 33) — corpo più fresco rispetto al −1 di sett. 3, ma sonno peggiore: <strong>5:00</strong> (01:47–06:47, score 57) vs 6:23. HRV migliore (46 vs 37). HybridCharge <strong>70→15</strong>; obiettivo sforzo superato <strong>103/90</strong>. Chiusura settimana 4: domani B2 con priorità al recupero notturno.</p>

      <article class="hr-log hr-log--elevated" data-session="2026-09-25T13:10" data-duration-corrected="false">
        <div class="hr-metrics">
          <div class="hr-metric"><strong>01:02:52</strong><span>Durata</span></div>
          <div class="hr-metric"><strong>118</strong><span>FC media</span></div>
          <div class="hr-metric"><strong>148</strong><span>FC max</span></div>
          <div class="hr-metric"><strong>529</strong><span>Calorie</span></div>
          <div class="hr-metric"><strong>108</strong><span>Carico</span></div>
          <div class="hr-metric"><strong>24</strong><span>Serie</span></div>
        </div>
      </article>
    </section>
    </section>

    <nav class="session-nav" aria-label="Navigazione sessione">
      <a class="session-nav__primary" href="/allenamenti/sessioni/">← Tutte le sessioni</a>
      <a href="/admin/">A2 · Blocco 1 admin</a>
      <a href="/allenamenti/sessioni/2026-09-22-b1/">← B1 · 22 settembre</a>
    </nav>
    <p class="session-meta-footer">Ultimo aggiornamento: 25 settembre 2026 · export Zepp completo</p>
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
console.log("OK allenamenti/sessioni/2026-09-25-a2/index.html");
