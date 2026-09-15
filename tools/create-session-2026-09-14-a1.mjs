#!/usr/bin/env node
/** Scaffold sessione 2026-09-14-a1 — domenica Blocco 1 upper */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderTsbModule } from "./tsb-render.mjs";

const REPO = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const data = JSON.parse(fs.readFileSync(path.join(REPO, "data/training-load.json"), "utf8"));
const tsbHtml = renderTsbModule(data, "2026-09-14", { sessionId: "sess-2026-09-14-a1" });

const dir = path.join(REPO, "allenamenti/sessioni/2026-09-14-a1");
fs.mkdirSync(dir, { recursive: true });

const html = `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<title>14 settembre 2026 — A1 petto · schiena · spalle | Sessione · La Forza Quotidiana</title>
<meta name="description" content="Sessione 14 settembre 2026 ore 13:09: A1 Blocco 1. 24 serie, 57 min, carico 174, FC 130/156, 558 kcal. HRV 56 Ottimale, sonno 7:17, TSB -2 Bilanciato.">
<link rel="canonical" href="https://forzaquotidiana.it/allenamenti/sessioni/2026-09-14-a1/">
<meta property="og:type" content="article">
<meta property="og:site_name" content="La Forza Quotidiana">
<meta property="og:locale" content="it_IT">
<meta property="og:url" content="https://forzaquotidiana.it/allenamenti/sessioni/2026-09-14-a1/">
<meta property="og:title" content="14 settembre 2026 — A1 · petto · schiena · spalle">
<meta property="og:image" content="https://forzaquotidiana.it/img/allenamenti/amazfit/2026-09-14-a1-riepilogo.webp">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="14 settembre 2026 — A1 · upper Blocco 1">
<meta name="twitter:description" content="57 min, 24 serie, carico 174, FC 130/156, aerobico 3,6 Buono · HRV 56 Ottimale.">
<meta name="twitter:image" content="https://forzaquotidiana.it/img/allenamenti/amazfit/2026-09-14-a1-riepilogo.webp">
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
        <a href="/allenamenti/">Allenamenti</a> · <a href="/allenamenti/sessioni/">Sessioni</a> · 14 settembre 2026
      </nav>
      <div class="session-hero__top">
        <span class="session-hero__badge">A1</span>
        <time class="session-hero__time" datetime="2026-09-14T13:09">14 settembre 2026 · ore 13:09 · domenica</time>
      </div>
      <h1>Petto · schiena · spalle — A1 Blocco 1</h1>
      <p class="session-hero__sub">57 min, carico 174, FC 130/156, 558 kcal — 24 serie · aerobico 3,6 Buono · anaerobico 2,8 Medio · HRV 56 Ottimale · TSB -2 Bilanciato</p>
      <dl class="session-kpis" aria-label="Metriche principali sessione">
        <div class="session-kpis__item session-kpis__item--accent"><dt>Durata</dt><dd>00:56:36</dd></div>
        <div class="session-kpis__item"><dt>FC media</dt><dd>130</dd></div>
        <div class="session-kpis__item"><dt>FC max</dt><dd>156</dd></div>
        <div class="session-kpis__item"><dt>Calorie</dt><dd>558</dd></div>
        <div class="session-kpis__item"><dt>Carico</dt><dd>174</dd></div>
        <div class="session-kpis__item"><dt>Serie</dt><dd>24</dd></div>
      </dl>
      <p class="session-hero__refs">Scheda di riferimento: <a href="/admin/"><strong>A1</strong> · Blocco 1 · Ipertrofia accumulo</a> · Precedente: <a href="/allenamenti/sessioni/2026-09-12-scheda-4/">B2 · 12 settembre</a></p>
    </div>
  </header>

  <div class="wrap prose prose--wide session-body">
    <!-- TSB-START -->
    <section class="session-panel session-panel--tsb" aria-labelledby="tsb-modulo-2026-09-14">
      <span class="session-panel__label" id="tsb-modulo-2026-09-14">Fitness · fatica · riposo</span>
      ${tsbHtml}
    </section>
    <!-- TSB-END -->

    <!-- GUILE-START -->
    <section class="session-panel session-panel--guile guile-panel" aria-labelledby="guile-2026-09-14-a1">
      <span class="session-panel__label" id="guile-2026-09-14-a1">Spirito Guile · umorismo pro</span>
      <p class="guile-panel__lead">Tre illustrazioni IA — estetica arcade, tono professionale. Non sostituiscono gli export Zepp.</p>
      <div class="guile-strip guile-strip--3" aria-label="Galleria illustrazioni A1">
        <figure class="guile-card" style="--guile-i:0">
          <span class="ai-photo-wrap guile-card__frame">
            <img src="/img/allenamenti/guile/guile-scheda-1-hero.webp" alt="Petto e spinta — estetica fighting game" width="640" height="360" loading="lazy" data-ai="generated">
            <span class="ai-photo-mark" aria-hidden="true">Foto AI</span>
          </span>
          <figcaption>Petto · spinta</figcaption>
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
      <p class="session-note"><strong>A1</strong> domenica pomeriggio <strong>13:09</strong> — petto · schiena · spalle, apertura <strong>settimana 3</strong> del Blocco 1. <strong>24 serie</strong> in <strong>56 min</strong>, recupero <strong>42:19</strong>, carico <strong>174</strong> — seduta compatta ma intensa sul cardio (FC media 130, picco 156).</p>
      <p class="session-note">Readiness migliorata rispetto alla settimana scorsa: sonno <strong>7:17 Buono</strong> (score 78), regolarità <strong>81%</strong>, <strong>HRV 56 Ottimale</strong> (baseline 43), HybridCharge al risveglio <strong>75</strong>. TSB <strong>-2,0 Bilanciato</strong> (CTL 41 / ATL 43) — fatica e fitness quasi allineati dopo il picco di settembre.</p>
    </section>

    <section class="session-panel" aria-labelledby="figure-esercizi">
      <span class="session-panel__label" id="figure-esercizi">Programma</span>
      <h2>Figure esercizi · scheda di riferimento</h2>
      <div id="sessione-scheda-figure" class="sessione-figure-mount" data-sessione="a1"></div>
    </section>

    <section class="session-panel" aria-labelledby="log-esercizi">
      <span class="session-panel__label">Log</span>
      <h2 id="log-esercizi">Esercizi · oggi</h2>
      <div class="table-wrap">
        <table class="scheda-table">
          <thead>
            <tr><th scope="col">Esercizio</th><th scope="col">Serie×Rep</th><th scope="col">kg</th><th scope="col">TUT</th><th scope="col">Note</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>Panca inclinata manubri</strong></td><td>4×6–8</td><td>Blocco 1</td><td>3-1-X-1</td><td>Progressione principale A1</td></tr>
            <tr><td><strong>Croci ai cavi</strong></td><td>3×10–12</td><td>Blocco 1</td><td>2-1-2-1</td><td>Squeeze petto in chiusura</td></tr>
            <tr><td><strong>Lento avanti bilanciere</strong></td><td>2×6–8</td><td>Blocco 1</td><td>3-1-X-1</td><td>Deltoide anteriore moderato</td></tr>
            <tr><td><strong>Alzate laterali</strong></td><td>3×12–15</td><td>Blocco 1</td><td>2-1-3-1</td><td>Priorità deltoide laterale</td></tr>
            <tr><td><strong>Lat machine</strong></td><td>4×8–10</td><td>Blocco 1</td><td>3-1-2-1</td><td>Presa larga · dorsali</td></tr>
            <tr><td><strong>Rematore bilanciere</strong></td><td>3×8–10</td><td>Blocco 1</td><td>3-1-2-1</td><td>Squeeze scapole</td></tr>
            <tr><td><strong>Polpacci in piedi</strong></td><td>3×15–20</td><td>Blocco 1</td><td>2-1-2</td><td>Chiusura A1</td></tr>
          </tbody>
        </table>
      </div>
      <p><small>Log post-sessione · 14 settembre. Pesi come da <a href="/admin/">programma Blocco 1 A1</a> — kg non ritrasmessi oggi.</small></p>
    </section>

    <section class="session-panel session-panel--readiness" aria-labelledby="readiness-title">
      <span class="session-panel__label">Readiness · sonno · HRV</span>
      <h2 id="readiness-title">Metriche giornata · Zepp · 14/09</h2>
      <p class="session-panel__intro">Sonno <strong>7:17 Buono</strong> (score 78), HRV <strong>56 Ottimale</strong>, HybridCharge <strong>75 Discreto</strong>, FC riposo <strong>48</strong>. TSB <strong>-2,0 Bilanciato</strong> (CTL 41 / ATL 43).</p>

      <div class="amazfit-tsb-hero" aria-label="Modulo TSB — 14 settembre">
        <figure class="phone-shot phone-shot--full phone-shot--solo">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-14-a1-tsb.webp" alt="Modulo TSB 14 settembre — CTL 41 ATL 43 TSB -2 Bilanciato" width="844" height="390" loading="eager" fetchpriority="high">
          </div>
          <figcaption>TSB · 14/09 · Bilanciato · CTL 41 · ATL 43</figcaption>
        </figure>
      </div>

      <div class="amazfit-gallery" aria-label="Screenshot Zepp — readiness 14 settembre">
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-14-a1-hybridcharge-panoramica.webp" alt="Panoramica Zepp 14 settembre — sonno 78, HybridCharge 17 post workout, sforzo 82%" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Panoramica · sonno 78 · sforzo 82%</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-14-a1-hybridcharge.webp" alt="HybridCharge 14 settembre — risveglio 75 Discreto, allenamento 13:09-14:06" width="390" height="844" loading="lazy">
          </div>
          <figcaption>HybridCharge 75 · Discreto</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-14-a1-sonno-score.webp" alt="Score sonno Zepp 14 settembre — 78 Normale" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Sonno 78 · Normale</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-14-a1-sonno-metriche.webp" alt="Metriche sonno 14 settembre — 7:17, profondo 1:03, REM 2:17, regolarità 81%" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Sonno · 7:17 · regolarità 81%</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-14-a1-hrv.webp" alt="HRV 14 settembre — 56 ms Ottimale, baseline 43" width="390" height="844" loading="lazy">
          </div>
          <figcaption>HRV 56 · Ottimale</figcaption>
        </figure>
      </div>

      <div class="amazfit-data" aria-label="Dati readiness estratti">
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Modulo allenamento TSB · 14/09</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>-2,0</strong><span>TSB · Bilanciato</span></div>
            <div class="amazfit-card__cell"><strong>41,0</strong><span>Fitness · CTL</span></div>
            <div class="amazfit-card__cell"><strong>43,0</strong><span>Fatica · ATL</span></div>
            <div class="amazfit-card__cell"><strong>174</strong><span>Carico sessione</span></div>
            <div class="amazfit-card__cell"><strong>13:09</strong><span>Inizio workout</span></div>
          </div>
        </div>
        <div class="amazfit-card">
          <p class="amazfit-card__title">Sonno · readiness · 14/09</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>7:17</strong><span>Durata · Buono</span></div>
            <div class="amazfit-card__cell"><strong>78</strong><span>Score · Normale</span></div>
            <div class="amazfit-card__cell"><strong>81%</strong><span>Regolarità · Buono</span></div>
            <div class="amazfit-card__cell"><strong>1:03</strong><span>Profondo · 15% · leggero</span></div>
            <div class="amazfit-card__cell"><strong>75</strong><span>HybridCharge risveglio</span></div>
          </div>
        </div>
        <div class="amazfit-card">
          <p class="amazfit-card__title">HRV · FC riposo · 14/09</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>56</strong><span>HRV · ms · Ottimale</span></div>
            <div class="amazfit-card__cell"><strong>43</strong><span>Baseline</span></div>
            <div class="amazfit-card__cell"><strong>48</strong><span>FC a riposo · Ottimale</span></div>
            <div class="amazfit-card__cell"><strong>0:45</strong><span>Pisolino sera precedente</span></div>
          </div>
        </div>
      </div>
    </section>

    <section class="session-panel session-panel--metabolic">
    <section class="metabolic-block" aria-labelledby="metabolic-title">
      <h2 id="metabolic-title">Dati metabolici · Amazfit</h2>
      <p class="metabolic-block__device"><strong>Amazfit Active 2 NFC</strong> · sync app Zepp · Allenamento muscolare</p>
      <p class="amazfit-gallery__lead">Export Zepp — 14 settembre ore 13:09, <strong>24 serie</strong>. Riepilogo e grafico FC a tutta larghezza.</p>

      <div class="amazfit-riepilogo-hero" aria-label="Resoconto Zepp — 14 settembre">
        <figure class="phone-shot phone-shot--full phone-shot--solo">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-14-a1-riepilogo.webp" alt="Riepilogo Zepp 14 settembre A1 — 24 serie, 558 kcal, FC 130, durata 56:36, carico 174" width="390" height="430" loading="eager" fetchpriority="high">
          </div>
          <figcaption>Riepilogo · 00:56:36 · 24 serie · carico 174 · 558 kcal</figcaption>
        </figure>
      </div>

      <div class="amazfit-fc-hero" aria-label="Grafico FC — 14 settembre">
        <figure class="phone-shot phone-shot--full phone-shot--solo">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-14-a1-fc-grafico.webp" alt="Grafico FC 14 settembre — media 130 max 156 bpm, 57 minuti" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Grafico FC · max 156 · 57 min</figcaption>
        </figure>
      </div>

      <div class="amazfit-gallery" aria-label="Screenshot Zepp — tecnica 14 settembre">
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-14-a1-zone-effetto.webp" alt="Zone FC 14 settembre — aerobico 3,6 Buono, anaerobico 2,8 Medio" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Zone FC · anaerobica 42% · aerobica 48%</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-14-a1-tecnica.webp" alt="Muscoli petto/dorsali e radar tecnica — A1" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Muscoli + radar tecnica</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-14-a1-valutazione.webp" alt="Valutazione complessiva movimento A1" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Valutazione complessiva</figcaption>
        </figure>
      </div>

      <div class="amazfit-data" aria-label="Dati sessione 14 settembre">
        <div class="amazfit-card">
          <div class="amazfit-card__top">
            <div>
              <div class="amazfit-card__user">ginocapon</div>
              <div class="amazfit-card__meta">14 set · 13:09 · domenica · A1</div>
            </div>
            <span class="amazfit-card__badge">24 serie</span>
          </div>
          <p class="amazfit-card__title">Riepilogo sessione</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>00:56:36</strong><span>Tempo allenamento</span></div>
            <div class="amazfit-card__cell"><strong>42:19</strong><span>Recupero tra set</span></div>
            <div class="amazfit-card__cell"><strong>130</strong><span>FC media · bpm</span></div>
            <div class="amazfit-card__cell"><strong>156</strong><span>FC max · bpm</span></div>
            <div class="amazfit-card__cell"><strong>558</strong><span>Calorie · kcal</span></div>
            <div class="amazfit-card__cell"><strong>174</strong><span>Carico allenamento</span></div>
          </div>
        </div>
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Zone cardiache · minuti</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell"><strong>0:00</strong><span>Leggera · 81–96</span></div>
            <div class="amazfit-card__cell"><strong>3:13</strong><span>Intensiva · 97–113</span></div>
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>27:23</strong><span>Aerobica · 114–129</span></div>
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>23:51</strong><span>Anaerobica · 130–145</span></div>
            <div class="amazfit-card__cell"><strong>2:06</strong><span>VO₂ max · 146+</span></div>
          </div>
        </div>
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Effetto allenamento · Zepp</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>3,6</strong><span>Aerobico · Buono</span></div>
            <div class="amazfit-card__cell"><strong>2,8</strong><span>Anaerobico · Medio</span></div>
          </div>
        </div>
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Muscoli usati · map Zepp</p>
          <p><strong>Primari:</strong> pettorali, dorsali. <strong>Secondari:</strong> tricipiti, deltoidi. Coerente con A1 upper body — petto e schiena dominanti.</p>
        </div>
      </div>

      <p class="metabolic-note"><strong>Valutazione conclusiva.</strong> Seduta <strong>A1</strong> domenica (<strong>57 min</strong>, <strong>24 serie</strong>), carico <strong>174</strong> — profilo cardio più spinto dell'A2 di venerdì (FC max 156 vs 137) con volume più compatto. Dominanza <strong>anaerobica 42%</strong> + <strong>aerobica 48%</strong>: tipico upper con recuperi moderati (42 min). Effetto aerobico <strong>3,6 Buono</strong> / anaerobico <strong>2,8 Medio</strong>. Readiness pre-sessione solida (sonno 7:17, HRV 56, HybridCharge 75). TSB <strong>-2,0 Bilanciato</strong> — CTL e ATL quasi pari, buon equilibrio per settimana 3.</p>

      <article class="hr-log hr-log--elevated" data-session="2026-09-14T13:09" data-duration-corrected="false">
        <div class="hr-metrics">
          <div class="hr-metric"><strong>00:56:36</strong><span>Durata</span></div>
          <div class="hr-metric"><strong>130</strong><span>FC media</span></div>
          <div class="hr-metric"><strong>156</strong><span>FC max</span></div>
          <div class="hr-metric"><strong>558</strong><span>Calorie</span></div>
          <div class="hr-metric"><strong>174</strong><span>Carico</span></div>
          <div class="hr-metric"><strong>24</strong><span>Serie</span></div>
        </div>
      </article>
    </section>
    </section>

    <nav class="session-nav" aria-label="Navigazione sessione">
      <a class="session-nav__primary" href="/allenamenti/sessioni/">← Tutte le sessioni</a>
      <a href="/admin/">A1 · Blocco 1 admin</a>
      <a href="/allenamenti/sessioni/2026-09-12-scheda-4/">← B2 · 12 settembre</a>
    </nav>
    <p class="session-meta-footer">Ultimo aggiornamento: 14 settembre 2026 · export Zepp completo</p>
  </div>
</main>

<footer class="site-footer">
  <div class="wrap"><p>© <span id="y"></span> La Forza Quotidiana · Gino Capon</p></div>
</footer>
<script>document.getElementById("y").textContent = new Date().getFullYear();</script>
<script src="/js/vendor/lenis.min.js" defer></script>
<script src="/js/smooth-scroll.js?v=2" defer></script>
<script src="/js/main.js?v=30" defer></script>
<script src="/admin/js/sprite-esercizi.js?v=4" defer></script>
<script src="/js/sessione-scheda-figure.js?v=3" defer></script>
<script src="/js/session-guile.js?v=1" defer></script>
<script src="/js/cookie-consent.js?v=4" defer></script>
<script src="/js/training-load-chart.js?v=3" defer></script>
</body>
</html>
`;

fs.writeFileSync(path.join(dir, "index.html"), html);
console.log("OK allenamenti/sessioni/2026-09-14-a1/index.html");
