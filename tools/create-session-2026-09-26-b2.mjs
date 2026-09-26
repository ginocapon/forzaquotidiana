#!/usr/bin/env node
/** Scaffold sessione 2026-09-26-b2 — sabato B2 chiusura settimana 4 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderTsbModule } from "./tsb-render.mjs";

const REPO = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const data = JSON.parse(fs.readFileSync(path.join(REPO, "data/training-load.json"), "utf8"));
const tsbHtml = renderTsbModule(data, "2026-09-26", { sessionId: "sess-2026-09-26-b2" });

const dir = path.join(REPO, "allenamenti/sessioni/2026-09-26-b2");
fs.mkdirSync(dir, { recursive: true });

const html = `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<title>26 settembre 2026 — B2 gambe · bicipiti | Sessione · La Forza Quotidiana</title>
<meta name="description" content="Sessione 26 settembre 2026 ore 11:35: B2 Blocco 1 settimana 4. 15 serie, 57 min, carico 185, FC 127/160, 544 kcal. Chiusura ciclo — export readiness parziale.">
<link rel="canonical" href="https://forzaquotidiana.it/allenamenti/sessioni/2026-09-26-b2/">
<meta property="og:type" content="article">
<meta property="og:site_name" content="La Forza Quotidiana">
<meta property="og:locale" content="it_IT">
<meta property="og:url" content="https://forzaquotidiana.it/allenamenti/sessioni/2026-09-26-b2/">
<meta property="og:title" content="26 settembre 2026 — B2 · gambe anca · bicipiti">
<meta property="og:image" content="https://forzaquotidiana.it/img/allenamenti/amazfit/2026-09-26-b2-riepilogo.webp">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="26 settembre 2026 — B2 · chiusura settimana 4">
<meta name="twitter:description" content="57 min, 15 serie, carico 185, FC 127/160, effetto 3,6 Buono su entrambi i gauge.">
<meta name="twitter:image" content="https://forzaquotidiana.it/img/allenamenti/amazfit/2026-09-26-b2-riepilogo.webp">
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
        <a href="/allenamenti/">Allenamenti</a> · <a href="/allenamenti/sessioni/">Sessioni</a> · 26 settembre 2026
      </nav>
      <div class="session-hero__top">
        <span class="session-hero__badge">B2</span>
        <time class="session-hero__time" datetime="2026-09-26T11:35">26 settembre 2026 · ore 11:35 · sabato</time>
      </div>
      <h1>Gambe dominante anca · core — chiusura settimana 4</h1>
      <p class="session-hero__sub">57 min, carico 185, FC 127/160, 544 kcal — 15 serie · aerobico/anaerobico 3,6 Buono · TSB pre +2 (export parziale)</p>
      <dl class="session-kpis" aria-label="Metriche principali sessione">
        <div class="session-kpis__item session-kpis__item--accent"><dt>Durata</dt><dd>00:56:56</dd></div>
        <div class="session-kpis__item"><dt>FC media</dt><dd>127</dd></div>
        <div class="session-kpis__item"><dt>FC max</dt><dd>160</dd></div>
        <div class="session-kpis__item"><dt>Calorie</dt><dd>544</dd></div>
        <div class="session-kpis__item"><dt>Carico</dt><dd>185</dd></div>
        <div class="session-kpis__item"><dt>Serie</dt><dd>15</dd></div>
      </dl>
      <p class="session-hero__refs">Scheda di riferimento: <a href="/admin/"><strong>B2</strong> · Blocco 1 · Ipertrofia accumulo</a> · Precedente: <a href="/allenamenti/sessioni/2026-09-25-a2/">A2 · 25 settembre</a> · Sett. 3: <a href="/allenamenti/sessioni/2026-09-19-b2/">B2 · 19 settembre</a></p>
    </div>
  </header>

  <div class="wrap prose prose--wide session-body">
    <!-- TSB-START -->
    <section class="session-panel session-panel--tsb" aria-labelledby="tsb-modulo-2026-09-26">
      <span class="session-panel__label" id="tsb-modulo-2026-09-26">Fitness · fatica · riposo</span>
      ${tsbHtml}
    </section>
    <!-- TSB-END -->

    <!-- GUILE-START -->
    <section class="session-panel session-panel--guile guile-panel" aria-labelledby="guile-2026-09-26-b2">
      <span class="session-panel__label" id="guile-2026-09-26-b2">Spirito Guile · umorismo pro</span>
      <p class="guile-panel__lead">Tre illustrazioni IA — tono arcade su B2 gambe anca. Export Zepp = fonte numerica.</p>
      <div class="guile-strip guile-strip--3" aria-label="Galleria illustrazioni B2">
        <figure class="guile-card" style="--guile-i:0">
          <span class="ai-photo-wrap guile-card__frame">
            <img src="/img/allenamenti/guile/guile-scheda-4-hero.webp" alt="Trap bar e hip thrust stile Guile — B2" width="640" height="360" loading="lazy" data-ai="generated">
            <span class="ai-photo-mark" aria-hidden="true">Foto AI</span>
          </span>
          <figcaption>Trap bar · dominante anca</figcaption>
        </figure>
        <figure class="guile-card" style="--guile-i:1">
          <span class="ai-photo-wrap guile-card__frame">
            <img src="/img/allenamenti/guile/guile-scheda-4-calves.webp" alt="Polpacci multipower — focus gambe B2" width="640" height="360" loading="lazy" data-ai="generated">
            <span class="ai-photo-mark" aria-hidden="true">Foto AI</span>
          </span>
          <figcaption>Polpacci · multipower</figcaption>
        </figure>
        <figure class="guile-card" style="--guile-i:2">
          <span class="ai-photo-wrap guile-card__frame">
            <img src="/img/allenamenti/guile/guile-scheda-4-recovery.webp" alt="Recovery post B2 con wearable" width="640" height="360" loading="lazy" data-ai="generated">
            <span class="ai-photo-mark" aria-hidden="true">Foto AI</span>
          </span>
          <figcaption>Recovery · carico alto</figcaption>
        </figure>
      </div>
      <p class="fig-credit guile-panel__credit"><span class="ai-badge" aria-hidden="true">IA</span> Immagini generate con intelligenza artificiale · <a href="/trasparenza-ai/">Trasparenza</a></p>
    </section>
    <!-- GUILE-END -->

    <section class="session-panel" aria-labelledby="nota-sessione">
      <span class="session-panel__label" id="nota-sessione">Nota di Gino</span>
      <p class="session-note"><strong>B2</strong> sabato <strong>11:35</strong> — chiusura settimana 4 Blocco 1, gambe anca + core. <strong>15 serie</strong> in <strong>00:56:56</strong>, recupero <strong>43:34</strong>, carico <strong>185</strong> — seduta più corta del B2 del 19/09 (68 min) ma carico Zepp molto più alto (124 → 185).</p>
      <p class="session-note">Profilo cardio spinto: FC media <strong>127</strong>, max <strong>160</strong> — <strong>41% combinata anaerobica + VO₂</strong> (24 min), effetto <strong>3,6 / 3,6 Buono</strong> su entrambi i gauge. Export readiness incompleto: mancano tab sonno/HRV/sforzo del <strong>26/09</strong> (in upload c’erano duplicati del 25/09, scartati).</p>
    </section>

    <section class="session-panel session-panel--readiness" aria-labelledby="readiness-title">
      <span class="session-panel__label">Readiness · TSB</span>
      <h2 id="readiness-title">Metriche giornata · Zepp · 26/09</h2>
      <p class="session-panel__intro">Export parziale: solo modulo TSB (screenshot con data <strong>25/09</strong> nel titolo, valori pre-sessione <strong>+2 Bilanciato</strong> CTL 35 / ATL 33). Mancano sonno/HRV/sforzo del 26/09 — da integrare in un secondo upload.</p>

      <div class="amazfit-tsb-hero" aria-label="Modulo TSB — 26 settembre">
        <figure class="phone-shot phone-shot--landscape phone-shot--solo">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-26-b2-tsb.webp" alt="Modulo TSB Zepp — CTL 35 ATL 33 TSB +2 Bilanciato (export pre-sessione)" width="1024" height="473" loading="eager" fetchpriority="high">
          </div>
          <figcaption>TSB · export pre-workout · CTL 35 · ATL 33</figcaption>
        </figure>
      </div>

      <div class="amazfit-data" aria-label="Dati readiness estratti">
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Modulo allenamento TSB · pre B2</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>+2,0</strong><span>TSB · Bilanciato</span></div>
            <div class="amazfit-card__cell"><strong>35,0</strong><span>Fitness · CTL</span></div>
            <div class="amazfit-card__cell"><strong>33,0</strong><span>Fatica · ATL</span></div>
            <div class="amazfit-card__cell"><strong>185</strong><span>Carico sessione</span></div>
            <div class="amazfit-card__cell"><strong>11:35</strong><span>Inizio workout</span></div>
          </div>
        </div>
      </div>
    </section>

    <section class="session-panel session-panel--metabolic">
    <section class="metabolic-block" aria-labelledby="metabolic-title">
      <h2 id="metabolic-title">Dati metabolici · Amazfit</h2>
      <p class="metabolic-block__device"><strong>Amazfit Active 2 NFC</strong> · sync app Zepp · Allenamento muscolare</p>
      <p class="amazfit-gallery__lead">Export Zepp — 26 settembre ore 11:35, <strong>15 serie</strong>. Riepilogo e grafico FC a tutta larghezza.</p>

      <div class="amazfit-riepilogo-hero" aria-label="Resoconto Zepp — 26 settembre">
        <figure class="phone-shot phone-shot--full phone-shot--solo">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-26-b2-riepilogo.webp" alt="Riepilogo Zepp 26 settembre B2 — 15 serie, 544 kcal, FC 127, durata 00:56:56, carico 185" width="390" height="430" loading="eager" fetchpriority="high">
          </div>
          <figcaption>Riepilogo · 00:56:56 · 15 serie · carico 185 · 544 kcal</figcaption>
        </figure>
      </div>

      <div class="amazfit-fc-hero" aria-label="Grafico FC — 26 settembre">
        <figure class="phone-shot phone-shot--full phone-shot--solo">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-26-b2-fc-grafico.webp" alt="Grafico FC 26 settembre — media 127 max 160 bpm, 57 minuti" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Grafico FC · max 160 · 57 min · picchi sostenuti</figcaption>
        </figure>
      </div>

      <div class="amazfit-gallery" aria-label="Screenshot Zepp — tecnica 26 settembre">
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-26-b2-zone-effetto.webp" alt="Zone FC 26 settembre — aerobico 3,6 Buono, anaerobico 3,6 Buono" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Zone FC · anaerobica 33% · VO₂ 8%</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-26-b2-tecnica.webp" alt="Muscoli addominali/quadricipiti/glutei e radar tecnica — B2" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Muscoli + radar tecnica pieno</figcaption>
        </figure>
      </div>

      <div class="amazfit-data" aria-label="Dati sessione 26 settembre">
        <div class="amazfit-card">
          <div class="amazfit-card__top">
            <div>
              <div class="amazfit-card__user">ginocapon</div>
              <div class="amazfit-card__meta">26 set · 11:35 · sabato · B2</div>
            </div>
            <span class="amazfit-card__badge">15 serie</span>
          </div>
          <p class="amazfit-card__title">Riepilogo sessione</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>00:56:56</strong><span>Tempo allenamento</span></div>
            <div class="amazfit-card__cell"><strong>43:34</strong><span>Recupero tra set</span></div>
            <div class="amazfit-card__cell"><strong>127</strong><span>FC media · bpm</span></div>
            <div class="amazfit-card__cell"><strong>160</strong><span>FC max · bpm</span></div>
            <div class="amazfit-card__cell"><strong>544</strong><span>Calorie · kcal</span></div>
            <div class="amazfit-card__cell"><strong>185</strong><span>Carico allenamento</span></div>
          </div>
        </div>
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Zone cardiache · minuti</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell"><strong>01:01</strong><span>Leggera · 81–96</span></div>
            <div class="amazfit-card__cell"><strong>09:55</strong><span>Intensiva · 97–113</span></div>
            <div class="amazfit-card__cell"><strong>22:06</strong><span>Aerobica · 114–129</span></div>
            <div class="amazfit-card__cell"><strong>18:51</strong><span>Anaerobica · 130–145</span></div>
            <div class="amazfit-card__cell"><strong>05:00</strong><span>VO₂ max · 146+</span></div>
          </div>
        </div>
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Effetto allenamento · Zepp</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>3,6</strong><span>Aerobico · Buono</span></div>
            <div class="amazfit-card__cell"><strong>3,6</strong><span>Anaerobico · Buono</span></div>
          </div>
        </div>
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Muscoli usati · map Zepp</p>
          <p><strong>Primari:</strong> addominali, quadricipiti. <strong>Secondari:</strong> glutei. Coerente con B2 — dominante anca + core.</p>
        </div>
      </div>

      <p class="metabolic-note"><strong>Analisi.</strong> Rispetto al B2 del 19/09: −5 serie, −11 min, carico Zepp <strong>+49% (185 vs 124)</strong>, FC media <strong>+9 bpm</strong> (127 vs 117). Profilo molto più intenso: <strong>24 min</strong> in anaerobica+VO₂ vs ~10 min sett. 3, effetto sale a <strong>3,6 Buono</strong> su entrambi i gauge. Meno volume (15 serie) ma densità cardio massima del mese — grafico FC con picchi ripetuti 150+. Settimana 4 chiusa in ipercarico: recupero domenica/lunedì prioritario. Quando hai il TSB post-sessione del 26/09, aggiorniamo il modulo.</p>

      <article class="hr-log hr-log--elevated" data-session="2026-09-26T11:35" data-duration-corrected="false">
        <div class="hr-metrics">
          <div class="hr-metric"><strong>00:56:56</strong><span>Durata</span></div>
          <div class="hr-metric"><strong>127</strong><span>FC media</span></div>
          <div class="hr-metric"><strong>160</strong><span>FC max</span></div>
          <div class="hr-metric"><strong>544</strong><span>Calorie</span></div>
          <div class="hr-metric"><strong>185</strong><span>Carico</span></div>
          <div class="hr-metric"><strong>15</strong><span>Serie</span></div>
        </div>
      </article>
    </section>
    </section>

    <nav class="session-nav" aria-label="Navigazione sessione">
      <a class="session-nav__primary" href="/allenamenti/sessioni/">← Tutte le sessioni</a>
      <a href="/admin/">B2 · Blocco 1 admin</a>
      <a href="/allenamenti/sessioni/2026-09-25-a2/">← A2 · 25 settembre</a>
    </nav>
    <p class="session-meta-footer">Ultimo aggiornamento: 26 settembre 2026 · export workout completo · readiness parziale</p>
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
console.log("OK allenamenti/sessioni/2026-09-26-b2/index.html");
