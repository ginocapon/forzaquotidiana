#!/usr/bin/env node
/** Scaffold sessione 2026-09-19-b2 — sabato B2 settimana 3 chiusura ciclo */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderTsbModule } from "./tsb-render.mjs";

const REPO = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const data = JSON.parse(fs.readFileSync(path.join(REPO, "data/training-load.json"), "utf8"));
const tsbHtml = renderTsbModule(data, "2026-09-19", { sessionId: "sess-2026-09-19-b2" });

const dir = path.join(REPO, "allenamenti/sessioni/2026-09-19-b2");
fs.mkdirSync(dir, { recursive: true });

const html = `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<title>19 settembre 2026 — B2 gambe · bicipiti | Sessione · La Forza Quotidiana</title>
<meta name="description" content="Sessione 19 settembre 2026 ore 10:56: B2 Blocco 1 settimana 3. 20 serie, 68 min, carico 124, FC 117/160, 570 kcal. Chiusura ciclo TSB Bilanciato.">
<link rel="canonical" href="https://forzaquotidiana.it/allenamenti/sessioni/2026-09-19-b2/">
<meta property="og:type" content="article">
<meta property="og:site_name" content="La Forza Quotidiana">
<meta property="og:locale" content="it_IT">
<meta property="og:url" content="https://forzaquotidiana.it/allenamenti/sessioni/2026-09-19-b2/">
<meta property="og:title" content="19 settembre 2026 — B2 · gambe anca · bicipiti">
<meta property="og:image" content="https://forzaquotidiana.it/img/allenamenti/amazfit/2026-09-19-b2-riepilogo.webp">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="19 settembre 2026 — B2 · chiusura settimana 3">
<meta name="twitter:description" content="68 min, 20 serie, carico 124, FC 117/160, aerobico 3,3 Buono, TSB 0 Bilanciato.">
<meta name="twitter:image" content="https://forzaquotidiana.it/img/allenamenti/amazfit/2026-09-19-b2-riepilogo.webp">
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
        <a href="/allenamenti/">Allenamenti</a> · <a href="/allenamenti/sessioni/">Sessioni</a> · 19 settembre 2026
      </nav>
      <div class="session-hero__top">
        <span class="session-hero__badge">B2</span>
        <time class="session-hero__time" datetime="2026-09-19T10:56">19 settembre 2026 · ore 10:56 · sabato</time>
      </div>
      <h1>Gambe dominante anca · bicipiti — chiusura settimana 3</h1>
      <p class="session-hero__sub">68 min, carico 124, FC 117/160, 570 kcal — 20 serie · aerobico 3,3 Buono · sforzo 127/83 · TSB 0 Bilanciato</p>
      <dl class="session-kpis" aria-label="Metriche principali sessione">
        <div class="session-kpis__item session-kpis__item--accent"><dt>Durata</dt><dd>01:07:59</dd></div>
        <div class="session-kpis__item"><dt>FC media</dt><dd>117</dd></div>
        <div class="session-kpis__item"><dt>FC max</dt><dd>160</dd></div>
        <div class="session-kpis__item"><dt>Calorie</dt><dd>570</dd></div>
        <div class="session-kpis__item"><dt>Carico</dt><dd>124</dd></div>
        <div class="session-kpis__item"><dt>Serie</dt><dd>20</dd></div>
      </dl>
      <p class="session-hero__refs">Scheda di riferimento: <a href="/admin/"><strong>B2</strong> · Blocco 1 · Ipertrofia accumulo</a> · Precedente: <a href="/allenamenti/sessioni/2026-09-18-a2/">A2 · 18 settembre</a> · Sett. 2: <a href="/allenamenti/sessioni/2026-09-12-scheda-4/">B2 · 12 settembre</a></p>
    </div>
  </header>

  <div class="wrap prose prose--wide session-body">
    <!-- TSB-START -->
    <section class="session-panel session-panel--tsb" aria-labelledby="tsb-modulo-2026-09-19">
      <span class="session-panel__label" id="tsb-modulo-2026-09-19">Fitness · fatica · riposo</span>
      ${tsbHtml}
    </section>
    <!-- TSB-END -->

    <!-- GUILE-START -->
    <section class="session-panel session-panel--guile guile-panel" aria-labelledby="guile-2026-09-19-b2">
      <span class="session-panel__label" id="guile-2026-09-19-b2">Spirito Guile · umorismo pro</span>
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
      <p class="session-note"><strong>B2</strong> sabato mattina <strong>10:56</strong> — chiusura settimana 3 Blocco 1, gambe dominante anca + bicipiti. <strong>20 serie</strong> in <strong>01:07:59</strong>, recupero <strong>48:00</strong>, carico <strong>124</strong> — seduta più lunga del B2 del 12/09 (63 min) ma meno serie (24) e carico Zepp più basso (236 sett. 2).</p>
      <p class="session-note">Profilo cardio: FC media <strong>117</strong>, max <strong>160</strong> — <strong>30 min in zona aerobica</strong> (44%), effetto aerobico/anaerobico <strong>3,3 / 3,4 Buono</strong>. Readiness fragile: sonno <strong>6:00</strong> (score 57, 6 risvegli, veglia 2:02), HRV <strong>41</strong> sotto baseline 43, HybridCharge <strong>48 Basso</strong> → <strong>8</strong> post workout. TSB <strong>0 Bilanciato</strong> (CTL 40 / ATL 40). Carico sforzo giornaliero <strong>127/83</strong>.</p>
    </section>

    <section class="session-panel session-panel--readiness" aria-labelledby="readiness-title">
      <span class="session-panel__label">Readiness · sonno · HRV</span>
      <h2 id="readiness-title">Metriche giornata · Zepp · 19/09</h2>
      <p class="session-panel__intro">Sonno <strong>6:00 Normale</strong> (score 57 Fai attenzione), regolarità <strong>90% Ottimale</strong>, HRV <strong>41 Buono</strong>, FC riposo <strong>52 Ottimale</strong>, HybridCharge <strong>48 Basso</strong> → <strong>8</strong> post sessione. TSB <strong>0,0 Bilanciato</strong>.</p>

      <div class="amazfit-tsb-hero" aria-label="Modulo TSB — 19 settembre">
        <figure class="phone-shot phone-shot--landscape phone-shot--solo">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-19-b2-tsb.webp" alt="Modulo TSB Zepp — CTL 40 ATL 40 TSB 0 Bilanciato, 19 settembre" width="1024" height="473" loading="eager" fetchpriority="high">
          </div>
          <figcaption>TSB · 19/09 · Bilanciato · CTL 40 · ATL 40</figcaption>
        </figure>
      </div>

      <div class="amazfit-gallery" aria-label="Screenshot Zepp — readiness 19 settembre">
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-19-b2-hybridcharge.webp" alt="HybridCharge 19 settembre — risveglio 48 Basso, allenamento 10:56-12:04" width="390" height="844" loading="lazy">
          </div>
          <figcaption>HybridCharge 48 → 8 post workout</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-19-b2-hybridcharge-analisi.webp" alt="Analisi HybridCharge — punteggio serale basso 19 settembre" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Analisi HC · serale basso</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-19-b2-readiness-panoramica.webp" alt="Panoramica 19 settembre — sonno 57, sforzo 127, fitness 40" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Panoramica · sforzo 127 · fitness 40</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-19-b2-readiness-metriche.webp" alt="Trend settimanale HRV RHR HybridCharge — 19 settembre" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Trend 7 gg · HRV 41 · RHR 52</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-19-b2-hrv.webp" alt="HRV 19 settembre — 41 ms Buono, baseline 43" width="390" height="844" loading="lazy">
          </div>
          <figcaption>HRV 41 · Buono · sotto baseline</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-19-b2-sonno-score.webp" alt="Sonno score 19 settembre — 57 Fai attenzione" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Score sonno 57 · Fai attenzione</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-19-b2-sonno-metriche.webp" alt="Sonno 19 settembre — 6:00, profondo 0:56, REM 1:34, veglia 2:02" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Sonno 6:00 · regolarità 90%</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-19-b2-sonno-fc.webp" alt="FC sonno 19 settembre — media 55 bpm, 23:55-07:57" width="390" height="844" loading="lazy">
          </div>
          <figcaption>FC sonno 55 · 8:02 a letto</figcaption>
        </figure>
      </div>

      <div class="amazfit-data" aria-label="Dati readiness estratti">
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Modulo allenamento TSB · 19/09</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>0,0</strong><span>TSB · Bilanciato</span></div>
            <div class="amazfit-card__cell"><strong>40,0</strong><span>Fitness · CTL</span></div>
            <div class="amazfit-card__cell"><strong>40,0</strong><span>Fatica · ATL</span></div>
            <div class="amazfit-card__cell"><strong>124</strong><span>Carico sessione</span></div>
            <div class="amazfit-card__cell"><strong>10:56</strong><span>Inizio workout</span></div>
          </div>
        </div>
        <div class="amazfit-card">
          <p class="amazfit-card__title">Sonno · readiness · 19/09</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>6:00</strong><span>Durata · Normale</span></div>
            <div class="amazfit-card__cell"><strong>90%</strong><span>Regolarità · Ottimale</span></div>
            <div class="amazfit-card__cell"><strong>0:56</strong><span>Profondo · Leggero</span></div>
            <div class="amazfit-card__cell"><strong>57</strong><span>Score sonno · Attenzione</span></div>
            <div class="amazfit-card__cell"><strong>55</strong><span>FC sonno · bpm</span></div>
            <div class="amazfit-card__cell"><strong>127</strong><span>Carico sforzo / 83</span></div>
          </div>
        </div>
        <div class="amazfit-card">
          <p class="amazfit-card__title">HRV · FC riposo · 19/09</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>41</strong><span>HRV · ms · Buono</span></div>
            <div class="amazfit-card__cell"><strong>43</strong><span>Baseline</span></div>
            <div class="amazfit-card__cell"><strong>52</strong><span>FC a riposo · Ottimale</span></div>
            <div class="amazfit-card__cell"><strong>8</strong><span>HybridCharge post workout</span></div>
          </div>
        </div>
      </div>
    </section>

    <section class="session-panel session-panel--metabolic">
    <section class="metabolic-block" aria-labelledby="metabolic-title">
      <h2 id="metabolic-title">Dati metabolici · Amazfit</h2>
      <p class="metabolic-block__device"><strong>Amazfit Active 2 NFC</strong> · sync app Zepp · Allenamento muscolare</p>
      <p class="amazfit-gallery__lead">Export Zepp — 19 settembre ore 10:56, <strong>20 serie</strong>. Riepilogo e grafico FC a tutta larghezza.</p>

      <div class="amazfit-riepilogo-hero" aria-label="Resoconto Zepp — 19 settembre">
        <figure class="phone-shot phone-shot--full phone-shot--solo">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-19-b2-riepilogo.webp" alt="Riepilogo Zepp 19 settembre B2 — 20 serie, 570 kcal, FC 117, durata 01:07:59, carico 124" width="390" height="430" loading="eager" fetchpriority="high">
          </div>
          <figcaption>Riepilogo · 01:07:59 · 20 serie · carico 124 · 570 kcal</figcaption>
        </figure>
      </div>

      <div class="amazfit-fc-hero" aria-label="Grafico FC — 19 settembre">
        <figure class="phone-shot phone-shot--full phone-shot--solo">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-19-b2-fc-grafico.webp" alt="Grafico FC 19 settembre — media 117 max 160 bpm, 68 minuti" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Grafico FC · max 160 · 68 min</figcaption>
        </figure>
      </div>

      <div class="amazfit-gallery" aria-label="Screenshot Zepp — tecnica 19 settembre">
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-19-b2-zone-effetto.webp" alt="Zone FC 19 settembre — aerobico 3,3 Buono, anaerobico 3,4 Buono" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Zone FC · aerobica 44% · effetto Buono</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-19-b2-tecnica.webp" alt="Muscoli deltoidi/femorali e radar tecnica — B2" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Muscoli + radar tecnica pieno</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-19-b2-readiness-dettaglio.webp" alt="Dettaglio metriche 19 settembre — ATL 40, obiettivo sforzo 83" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Dettaglio metriche giornata</figcaption>
        </figure>
      </div>

      <div class="amazfit-data" aria-label="Dati sessione 19 settembre">
        <div class="amazfit-card">
          <div class="amazfit-card__top">
            <div>
              <div class="amazfit-card__user">ginocapon</div>
              <div class="amazfit-card__meta">19 set · 10:56 · sabato · B2</div>
            </div>
            <span class="amazfit-card__badge">20 serie</span>
          </div>
          <p class="amazfit-card__title">Riepilogo sessione</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>01:07:59</strong><span>Tempo allenamento</span></div>
            <div class="amazfit-card__cell"><strong>48:00</strong><span>Recupero tra set</span></div>
            <div class="amazfit-card__cell"><strong>117</strong><span>FC media · bpm</span></div>
            <div class="amazfit-card__cell"><strong>160</strong><span>FC max · bpm</span></div>
            <div class="amazfit-card__cell"><strong>570</strong><span>Calorie · kcal</span></div>
            <div class="amazfit-card__cell"><strong>124</strong><span>Carico allenamento</span></div>
          </div>
        </div>
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Zone cardiache · minuti</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell"><strong>03:48</strong><span>Leggera · 81–96</span></div>
            <div class="amazfit-card__cell"><strong>22:25</strong><span>Intensiva · 97–113</span></div>
            <div class="amazfit-card__cell"><strong>30:10</strong><span>Aerobica · 114–129</span></div>
            <div class="amazfit-card__cell"><strong>08:57</strong><span>Anaerobica · 130–145</span></div>
            <div class="amazfit-card__cell"><strong>01:14</strong><span>VO₂ max · 146+</span></div>
          </div>
        </div>
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Effetto allenamento · Zepp</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>3,3</strong><span>Aerobico · Buono</span></div>
            <div class="amazfit-card__cell"><strong>3,4</strong><span>Anaerobico · Buono</span></div>
          </div>
        </div>
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Muscoli usati · map Zepp</p>
          <p><strong>Primari:</strong> deltoidi, addominali, femorali posteriori. <strong>Secondari:</strong> glutei, lombare. Coerente con B2 — hip thrust/trap bar + core e braccia.</p>
        </div>
      </div>

      <p class="metabolic-note"><strong>Analisi.</strong> Rispetto al B2 del 12/09: +5 min durata ma −4 serie e carico Zepp <strong>124 vs 236</strong> (meno densità anaerobica: 9 vs 22 min). FC simile (117/160 vs 125/161), ma profilo più aerobico (+12 min in zona 114–129). Effetto scende da Eccellente a <strong>Buono</strong> su entrambi i gauge. Entrata con TSB <strong>0 Bilanciato</strong> (CTL=ATL=40) vs −11 Ottimale sett. 2 — corpo più riposato ma sonno peggiore (score 57, veglia 2:02). HybridCharge crolla a <strong>8</strong> post sessione; sforzo giornaliero <strong>127/83</strong> (+44). Radar tecnica pieno — esecuzione pulita nonostante la fatica. Settimana 3 chiusa: recupero domenica prioritario.</p>

      <article class="hr-log hr-log--elevated" data-session="2026-09-19T10:56" data-duration-corrected="false">
        <div class="hr-metrics">
          <div class="hr-metric"><strong>01:07:59</strong><span>Durata</span></div>
          <div class="hr-metric"><strong>117</strong><span>FC media</span></div>
          <div class="hr-metric"><strong>160</strong><span>FC max</span></div>
          <div class="hr-metric"><strong>570</strong><span>Calorie</span></div>
          <div class="hr-metric"><strong>124</strong><span>Carico</span></div>
          <div class="hr-metric"><strong>20</strong><span>Serie</span></div>
        </div>
      </article>
    </section>
    </section>

    <nav class="session-nav" aria-label="Navigazione sessione">
      <a class="session-nav__primary" href="/allenamenti/sessioni/">← Tutte le sessioni</a>
      <a href="/admin/">B2 · Blocco 1 admin</a>
      <a href="/allenamenti/sessioni/2026-09-18-a2/">← A2 · 18 settembre</a>
    </nav>
    <p class="session-meta-footer">Ultimo aggiornamento: 19 settembre 2026 · export Zepp completo</p>
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
console.log("OK allenamenti/sessioni/2026-09-19-b2/index.html");
