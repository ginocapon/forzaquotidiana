#!/usr/bin/env node
/** Scaffold sessione 2026-09-29-a1 — martedì A1 settimana 5 Blocco 1 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderTsbModule } from "./tsb-render.mjs";

const REPO = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const data = JSON.parse(fs.readFileSync(path.join(REPO, "data/training-load.json"), "utf8"));
const tsbHtml = renderTsbModule(data, "2026-09-29", { sessionId: "sess-2026-09-29-a1" });

const dir = path.join(REPO, "allenamenti/sessioni/2026-09-29-a1");
fs.mkdirSync(dir, { recursive: true });

const html = `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<title>29 settembre 2026 — A1 petto · schiena · spalle | Sessione · La Forza Quotidiana</title>
<meta name="description" content="Sessione 29 settembre 2026 ore 14:26: A1 Blocco 1 settimana 5. 23 serie, 54 min, carico 152, FC 126/152, 507 kcal. TSB +4 Bilanciato post B2.">
<link rel="canonical" href="https://forzaquotidiana.it/allenamenti/sessioni/2026-09-29-a1/">
<meta property="og:type" content="article">
<meta property="og:site_name" content="La Forza Quotidiana">
<meta property="og:locale" content="it_IT">
<meta property="og:url" content="https://forzaquotidiana.it/allenamenti/sessioni/2026-09-29-a1/">
<meta property="og:title" content="29 settembre 2026 — A1 · petto · schiena · spalle">
<meta property="og:image" content="https://forzaquotidiana.it/img/allenamenti/amazfit/2026-09-29-a1-fc-grafico.webp">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="29 settembre 2026 — A1 · settimana 4 Blocco 1">
<meta name="twitter:description" content="54 min, 23 serie, carico 152, FC 126/152, aerobico 3,4 Buono, TSB +4 Bilanciato.">
<meta name="twitter:image" content="https://forzaquotidiana.it/img/allenamenti/amazfit/2026-09-29-a1-fc-grafico.webp">
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
        <a href="/allenamenti/">Allenamenti</a> · <a href="/allenamenti/sessioni/">Sessioni</a> · 29 settembre 2026
      </nav>
      <div class="session-hero__top">
        <span class="session-hero__badge">A1</span>
        <time class="session-hero__time" datetime="2026-09-29T14:26">29 settembre 2026 · ore 14:26 · martedì</time>
      </div>
      <h1>Petto · schiena · spalle — A1 settimana 5</h1>
      <p class="session-hero__sub">54 min, carico 152, FC 126/152, 507 kcal — 23 serie · aerobico 3,4 Buono · sforzo 105/97 · TSB +4 Bilanciato</p>
      <dl class="session-kpis" aria-label="Metriche principali sessione">
        <div class="session-kpis__item session-kpis__item--accent"><dt>Durata</dt><dd>00:53:33</dd></div>
        <div class="session-kpis__item"><dt>FC media</dt><dd>126</dd></div>
        <div class="session-kpis__item"><dt>FC max</dt><dd>152</dd></div>
        <div class="session-kpis__item"><dt>Calorie</dt><dd>507</dd></div>
        <div class="session-kpis__item"><dt>Carico</dt><dd>152</dd></div>
        <div class="session-kpis__item"><dt>Serie</dt><dd>23</dd></div>
      </dl>
      <p class="session-hero__refs">Scheda di riferimento: <a href="/admin/"><strong>A1</strong> · Blocco 1 · Ipertrofia accumulo</a> · Precedente: <a href="/allenamenti/sessioni/2026-09-26-b2/">B2 · 26 settembre</a> · Sett. 4: <a href="/allenamenti/sessioni/2026-09-21-a1/">A1 · 21 settembre</a></p>
    </div>
  </header>

  <div class="wrap prose prose--wide session-body">
    <!-- TSB-START -->
    <section class="session-panel session-panel--tsb" aria-labelledby="tsb-modulo-2026-09-29">
      <span class="session-panel__label" id="tsb-modulo-2026-09-29">Fitness · fatica · riposo</span>
      ${tsbHtml}
    </section>
    <!-- TSB-END -->

    <!-- GUILE-START -->
    <section class="session-panel session-panel--guile guile-panel" aria-labelledby="guile-2026-09-29-a1">
      <span class="session-panel__label" id="guile-2026-09-29-a1">Spirito Guile · umorismo pro</span>
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
      <p class="session-note"><strong>A1</strong> martedì <strong>14:26</strong> — rientro dopo B2 del 26/09, avvio settimana 5. <strong>23 serie</strong> in <strong>00:53:33</strong>, recupero <strong>38:53</strong>, carico <strong>152</strong> — stesso volume dell'A1 del 21/09, +13 min e carico +9% vs lunedì scorso.</p>
      <p class="session-note">Profilo cardio spinto: <strong>39% anaerobica</strong> + <strong>3% VO₂</strong> (23 min), FC max <strong>152</strong>. Sonno notte lun-mar <strong>5:57</strong> (01:19–07:25, score 61), HRV <strong>39</strong> Buono, HybridCharge <strong>75</strong> → <strong>35</strong> (−13). TSB <strong>+4 Bilanciato</strong> (CTL 35 / ATL 31). Sforzo <strong>105/97</strong> (100%).</p>
    </section>

    <section class="session-panel session-panel--readiness" aria-labelledby="readiness-title">
      <span class="session-panel__label">Readiness · sonno · HRV</span>
      <h2 id="readiness-title">Metriche giornata · Zepp · 29/09</h2>
      <p class="session-panel__intro">Sonno <strong>5:57</strong> (score 61 Normale), HRV <strong>39 Buono</strong>, FC riposo <strong>49</strong>, HybridCharge <strong>75 Discreto</strong> → <strong>35</strong> post workout. TSB <strong>+4,0 Bilanciato</strong>, sforzo <strong>105/97</strong>.</p>

      <div class="amazfit-tsb-hero" aria-label="Modulo TSB — 29 settembre">
        <figure class="phone-shot phone-shot--landscape phone-shot--solo">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-29-a1-tsb.webp" alt="Modulo TSB Zepp — CTL 35 ATL 31 TSB +4 Bilanciato, 29 settembre" width="1024" height="473" loading="eager" fetchpriority="high">
          </div>
          <figcaption>TSB · 29/09 · Bilanciato · CTL 35 · ATL 31</figcaption>
        </figure>
      </div>

      <div class="amazfit-gallery" aria-label="Screenshot Zepp — readiness 29 settembre">
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-29-a1-hybridcharge.webp" alt="HybridCharge 29 settembre — carica +36 scarico −43, workout 14:26" width="390" height="844" loading="lazy">
          </div>
          <figcaption>HybridCharge giornata · +36 / −43</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-29-a1-hybridcharge-analisi.webp" alt="Analisi HybridCharge — −13 punti post allenamento" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Analisi HC · −13 punti workout</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-29-a1-readiness-panoramica.webp" alt="Panoramica 29 settembre — sonno 61, HybridCharge 37, sforzo 100%" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Panoramica · sforzo 100% · HC 37</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-29-a1-readiness-metriche.webp" alt="Trend 29 settembre — HRV 39, RHR 49, HC al risveglio 75" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Trend 7 gg · HRV 39 · RHR 49</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-29-a1-hrv.webp" alt="HRV 29 settembre — 39 ms Buono, baseline 42" width="390" height="844" loading="lazy">
          </div>
          <figcaption>HRV 39 · Buono</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-29-a1-sonno-score.webp" alt="Sonno score 29 settembre — 61 Normale" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Score sonno 61 · Normale</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-29-a1-sonno-metriche.webp" alt="Sonno 29 settembre — 5:57, profondo 1:14, REM 1:33, 01:19-07:25" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Sonno 5:57 · regolarità 64%</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-29-a1-sonno-fc.webp" alt="FC sonno 29 settembre — media 52 bpm" width="390" height="844" loading="lazy">
          </div>
          <figcaption>FC sonno 52 · 01:19–07:25</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-29-a1-readiness-dettaglio.webp" alt="Sforzo 29 settembre — 105/97, workout 14:26-15:20" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Sforzo 105/97 · 14:26–15:20</figcaption>
        </figure>
      </div>

      <div class="amazfit-data" aria-label="Dati readiness estratti">
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Modulo allenamento TSB · 29/09</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>+4,0</strong><span>TSB · Bilanciato</span></div>
            <div class="amazfit-card__cell"><strong>35,0</strong><span>Fitness · CTL</span></div>
            <div class="amazfit-card__cell"><strong>31,0</strong><span>Fatica · ATL</span></div>
            <div class="amazfit-card__cell"><strong>152</strong><span>Carico sessione</span></div>
            <div class="amazfit-card__cell"><strong>14:26</strong><span>Inizio workout</span></div>
          </div>
        </div>
        <div class="amazfit-card">
          <p class="amazfit-card__title">Sonno · readiness · 29/09</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>5:57</strong><span>Durata · score 61</span></div>
            <div class="amazfit-card__cell"><strong>01:19</strong><span>A letto</span></div>
            <div class="amazfit-card__cell"><strong>07:25</strong><span>Risveglio</span></div>
            <div class="amazfit-card__cell"><strong>52</strong><span>FC sonno · bpm</span></div>
            <div class="amazfit-card__cell"><strong>105/97</strong><span>Sforzo giornaliero</span></div>
          </div>
        </div>
        <div class="amazfit-card">
          <p class="amazfit-card__title">HRV · FC riposo · 29/09</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>39</strong><span>HRV · ms · Buono</span></div>
            <div class="amazfit-card__cell"><strong>42</strong><span>Baseline</span></div>
            <div class="amazfit-card__cell"><strong>49</strong><span>FC a riposo</span></div>
            <div class="amazfit-card__cell"><strong>75→35</strong><span>HybridCharge · −13</span></div>
          </div>
        </div>
      </div>
    </section>

    <section class="session-panel session-panel--metabolic">
    <section class="metabolic-block" aria-labelledby="metabolic-title">
      <h2 id="metabolic-title">Dati metabolici · Amazfit</h2>
      <p class="metabolic-block__device"><strong>Amazfit Active 2 NFC</strong> · sync app Zepp · Allenamento muscolare</p>
      <p class="amazfit-gallery__lead">Export Zepp — 29 settembre ore 14:26, <strong>23 serie</strong>. Grafico FC completo a tutta larghezza.</p>
      <div class="amazfit-fc-hero" aria-label="Grafico FC — 29 settembre">
        <figure class="phone-shot phone-shot--full phone-shot--solo">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-29-a1-fc-grafico.webp" alt="Grafico FC 29 settembre — media 126 max 152 bpm, 54 minuti" width="390" height="844" loading="eager" fetchpriority="high">
          </div>
          <figcaption>Grafico FC · max 152 · 54 min</figcaption>
        </figure>
      </div>

      <div class="amazfit-gallery" aria-label="Screenshot Zepp — tecnica 29 settembre">
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-29-a1-zone-effetto.webp" alt="Zone FC 29 settembre — aerobico 3,4 Buono, anaerobico 2,5 Medio" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Zone FC · anaerobica 39% · aerobica 37%</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-29-a1-tecnica.webp" alt="Muscoli petto/dorsali e radar tecnica — A1" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Muscoli + radar tecnica</figcaption>
        </figure>
      </div>

      <div class="amazfit-data" aria-label="Dati sessione 29 settembre">
        <div class="amazfit-card">
          <div class="amazfit-card__top">
            <div>
              <div class="amazfit-card__user">ginocapon</div>
              <div class="amazfit-card__meta">29 set · 14:26 · martedì · A1</div>
            </div>
            <span class="amazfit-card__badge">23 serie</span>
          </div>
          <p class="amazfit-card__title">Riepilogo sessione</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>00:53:33</strong><span>Tempo allenamento</span></div>
            <div class="amazfit-card__cell"><strong>38:53</strong><span>Recupero tra set</span></div>
            <div class="amazfit-card__cell"><strong>126</strong><span>FC media · bpm</span></div>
            <div class="amazfit-card__cell"><strong>152</strong><span>FC max · bpm</span></div>
            <div class="amazfit-card__cell"><strong>507</strong><span>Calorie · kcal</span></div>
            <div class="amazfit-card__cell"><strong>152</strong><span>Carico allenamento</span></div>
          </div>
        </div>
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Zone cardiache · minuti</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell"><strong>00:33</strong><span>Leggera · 81–96</span></div>
            <div class="amazfit-card__cell"><strong>10:15</strong><span>Intensiva · 97–113</span></div>
            <div class="amazfit-card__cell"><strong>19:58</strong><span>Aerobica · 114–129</span></div>
            <div class="amazfit-card__cell"><strong>21:03</strong><span>Anaerobica · 130–145</span></div>
            <div class="amazfit-card__cell"><strong>01:42</strong><span>VO₂ max · 146+</span></div>
          </div>
        </div>
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Effetto allenamento · Zepp</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>3,4</strong><span>Aerobico · Buono</span></div>
            <div class="amazfit-card__cell"><strong>2,5</strong><span>Anaerobico · Medio</span></div>
          </div>
        </div>
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Muscoli usati · map Zepp</p>
          <p><strong>Primari:</strong> petto, dorsali. <strong>Secondari:</strong> deltoidi, trapezio. Coerente con A1 upper — petto e schiena in evidenza, radar tecnica equilibrato.</p>
        </div>
      </div>

      <p class="metabolic-note"><strong>Analisi.</strong> Rispetto all'A1 del 21/09: stesse <strong>23 serie</strong>, +2 min, carico <strong>152 vs 139</strong> (+9%), FC max −6 bpm. Profilo più anaerobico (<strong>39%</strong> zona 130–145 vs 31%). Effetto aerobico stabile (<strong>3,4 Buono</strong>), anaerobico <strong>2,5 Medio</strong>. Entrata con TSB <strong>+4</strong> post-B2 — ATL sceso a 31, CTL 35. Sonno 5:57 non ottimale ma HRV 39 sopra soglia critica. Grafico FC: lavoro costante 120–145 bpm con picchi moderati 152.</p>

      <article class="hr-log hr-log--elevated" data-session="2026-09-29T14:26" data-duration-corrected="false">
        <div class="hr-metrics">
          <div class="hr-metric"><strong>00:53:33</strong><span>Durata</span></div>
          <div class="hr-metric"><strong>126</strong><span>FC media</span></div>
          <div class="hr-metric"><strong>152</strong><span>FC max</span></div>
          <div class="hr-metric"><strong>507</strong><span>Calorie</span></div>
          <div class="hr-metric"><strong>152</strong><span>Carico</span></div>
          <div class="hr-metric"><strong>23</strong><span>Serie</span></div>
        </div>
      </article>
    </section>
    </section>

    <nav class="session-nav" aria-label="Navigazione sessione">
      <a class="session-nav__primary" href="/allenamenti/sessioni/">← Tutte le sessioni</a>
      <a href="/admin/">A1 · Blocco 1 admin</a>
      <a href="/allenamenti/sessioni/2026-09-26-b2/">← B2 · 26 settembre</a>
    </nav>
    <p class="session-meta-footer">Ultimo aggiornamento: 29 settembre 2026 · export Zepp completo</p>
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
console.log("OK allenamenti/sessioni/2026-09-29-a1/index.html");
