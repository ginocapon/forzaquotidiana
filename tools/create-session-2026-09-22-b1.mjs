#!/usr/bin/env node
/** Scaffold sessione 2026-09-22-b1 — martedì B1 settimana 4 Blocco 1 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderTsbModule } from "./tsb-render.mjs";

const REPO = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const data = JSON.parse(fs.readFileSync(path.join(REPO, "data/training-load.json"), "utf8"));
const tsbHtml = renderTsbModule(data, "2026-09-22", { sessionId: "sess-2026-09-22-b1" });

const dir = path.join(REPO, "allenamenti/sessioni/2026-09-22-b1");
fs.mkdirSync(dir, { recursive: true });

const html = `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<title>22 settembre 2026 — B1 gambe · polpacci · braccia | Sessione · La Forza Quotidiana</title>
<meta name="description" content="Sessione 22 settembre 2026 ore 12:53: B1 Blocco 1 settimana 4. 28 serie, 68 min, carico 91, FC 111/157, 515 kcal. TSB +4 Bilanciato.">
<link rel="canonical" href="https://forzaquotidiana.it/allenamenti/sessioni/2026-09-22-b1/">
<meta property="og:type" content="article">
<meta property="og:site_name" content="La Forza Quotidiana">
<meta property="og:locale" content="it_IT">
<meta property="og:url" content="https://forzaquotidiana.it/allenamenti/sessioni/2026-09-22-b1/">
<meta property="og:title" content="22 settembre 2026 — B1 · gambe accosciata · braccia">
<meta property="og:image" content="https://forzaquotidiana.it/img/allenamenti/amazfit/2026-09-22-b1-riepilogo.webp">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="22 settembre 2026 — B1 · settimana 4">
<meta name="twitter:description" content="68 min, 28 serie, carico 91, FC 111/157, aerobico 3,0 Buono, TSB +4 Bilanciato.">
<meta name="twitter:image" content="https://forzaquotidiana.it/img/allenamenti/amazfit/2026-09-22-b1-riepilogo.webp">
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
        <a href="/allenamenti/">Allenamenti</a> · <a href="/allenamenti/sessioni/">Sessioni</a> · 22 settembre 2026
      </nav>
      <div class="session-hero__top">
        <span class="session-hero__badge">B1</span>
        <time class="session-hero__time" datetime="2026-09-22T12:53">22 settembre 2026 · ore 12:53 · martedì</time>
      </div>
      <h1>Gambe accosciata · polpacci · braccia — settimana 4</h1>
      <p class="session-hero__sub">68 min, carico 91, FC 111/157, 515 kcal — 28 serie · aerobico 3,0 Buono · sforzo 103/104 · TSB +4 Bilanciato</p>
      <dl class="session-kpis" aria-label="Metriche principali sessione">
        <div class="session-kpis__item session-kpis__item--accent"><dt>Durata</dt><dd>01:07:38</dd></div>
        <div class="session-kpis__item"><dt>FC media</dt><dd>111</dd></div>
        <div class="session-kpis__item"><dt>FC max</dt><dd>157</dd></div>
        <div class="session-kpis__item"><dt>Calorie</dt><dd>515</dd></div>
        <div class="session-kpis__item"><dt>Carico</dt><dd>91</dd></div>
        <div class="session-kpis__item"><dt>Serie</dt><dd>28</dd></div>
      </dl>
      <p class="session-hero__refs">Scheda di riferimento: <a href="/admin/"><strong>B1</strong> · Blocco 1 · Ipertrofia accumulo</a> · Precedente: <a href="/allenamenti/sessioni/2026-09-21-a1/">A1 · 21 settembre</a> · Sett. 3: <a href="/allenamenti/sessioni/2026-09-15-b1/">B1 · 15 settembre</a></p>
    </div>
  </header>

  <div class="wrap prose prose--wide session-body">
    <!-- TSB-START -->
    <section class="session-panel session-panel--tsb" aria-labelledby="tsb-modulo-2026-09-22">
      <span class="session-panel__label" id="tsb-modulo-2026-09-22">Fitness · fatica · riposo</span>
      ${tsbHtml}
    </section>
    <!-- TSB-END -->

    <!-- GUILE-START -->
    <section class="session-panel session-panel--guile guile-panel" aria-labelledby="guile-2026-09-22-b1">
      <span class="session-panel__label" id="guile-2026-09-22-b1">Spirito Guile · umorismo pro</span>
      <p class="guile-panel__lead">Tre illustrazioni IA — tono arcade su B1 pressa e gambe. Export Zepp = fonte numerica.</p>
      <div class="guile-strip guile-strip--3" aria-label="Galleria illustrazioni B1">
        <figure class="guile-card" style="--guile-i:0">
          <span class="ai-photo-wrap guile-card__frame">
            <img src="/img/allenamenti/guile/2026-09-08-b1-realistic.webp" alt="Gino in pressa — fotorealistica sessione B1" width="640" height="360" loading="lazy" data-ai="generated">
            <span class="ai-photo-mark" aria-hidden="true">Foto AI</span>
          </span>
          <figcaption>Pressa · fotorealistica</figcaption>
        </figure>
        <figure class="guile-card" style="--guile-i:1">
          <span class="ai-photo-wrap guile-card__frame">
            <img src="/img/allenamenti/guile/guile-scheda-2-squat.webp" alt="Squat e pressa stile Guile — B1" width="640" height="360" loading="lazy" data-ai="generated">
            <span class="ai-photo-mark" aria-hidden="true">Foto AI</span>
          </span>
          <figcaption>Pattern accosciato · B1</figcaption>
        </figure>
        <figure class="guile-card" style="--guile-i:2">
          <span class="ai-photo-wrap guile-card__frame">
            <img src="/img/allenamenti/guile/2026-09-01-b1-arcade-recovery.webp" alt="Recovery post B1 con wearable" width="640" height="360" loading="lazy" data-ai="generated">
            <span class="ai-photo-mark" aria-hidden="true">Foto AI</span>
          </span>
          <figcaption>Recovery · leg day</figcaption>
        </figure>
      </div>
      <p class="fig-credit guile-panel__credit"><span class="ai-badge" aria-hidden="true">IA</span> Immagini generate con intelligenza artificiale · <a href="/trasparenza-ai/">Trasparenza</a></p>
    </section>
    <!-- GUILE-END -->

    <section class="session-panel" aria-labelledby="nota-sessione">
      <span class="session-panel__label" id="nota-sessione">Nota di Gino</span>
      <p class="session-note"><strong>B1</strong> martedì pranzo <strong>12:53</strong> — secondo slot gambe settimana 4 Blocco 1, dopo l’A1 lunedi. <strong>28 serie</strong> in <strong>01:07:38</strong>, recupero <strong>50:51</strong>, carico sessione <strong>91</strong> — una serie in meno del B1 del 15/09 (29) ma durata simile (−6 min) e carico Zepp più basso (107 sett. 3).</p>
      <p class="session-note">Profilo cardio: FC media <strong>111</strong>, max <strong>157</strong> — <strong>33% in zona intensiva</strong> (97–113), effetto aerobico/anaerobico <strong>3,0 Buono / 2,6 Medio</strong>. Readiness solida: sonno <strong>7:22 Buono</strong> (score 76, 7 risvegli), HRV <strong>40</strong> Buono sotto baseline 43, HybridCharge <strong>75</strong> → <strong>20</strong> post workout. TSB <strong>+4 Bilanciato</strong> (CTL 40 / ATL 36). Sforzo giornaliero <strong>103/104</strong> (99%).</p>
    </section>

    <section class="session-panel session-panel--readiness" aria-labelledby="readiness-title">
      <span class="session-panel__label">Readiness · sonno · HRV</span>
      <h2 id="readiness-title">Metriche giornata · Zepp · 22/09</h2>
      <p class="session-panel__intro">Sonno <strong>7:22 Buono</strong> (score 76 Normale), regolarità <strong>73% Normale</strong>, HRV <strong>40 Buono</strong>, FC riposo <strong>51 Ottimale</strong>, HybridCharge <strong>75</strong> → <strong>20</strong> post sessione. TSB <strong>+4,0 Bilanciato</strong>.</p>

      <div class="amazfit-tsb-hero" aria-label="Modulo TSB — 22 settembre">
        <figure class="phone-shot phone-shot--landscape phone-shot--solo">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-22-b1-tsb.webp" alt="Modulo TSB Zepp — CTL 40 ATL 36 TSB +4 Bilanciato, 22 settembre" width="1024" height="473" loading="eager" fetchpriority="high">
          </div>
          <figcaption>TSB · 22/09 · Bilanciato · CTL 40 · ATL 36</figcaption>
        </figure>
      </div>

      <div class="amazfit-gallery" aria-label="Screenshot Zepp — readiness 22 settembre">
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-22-b1-hybridcharge.webp" alt="Sforzo 22 settembre — 99%, allenamento muscolare 12:53-14:00" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Sforzo 103/104 · workout 12:53–14:00</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-22-b1-hybridcharge-analisi.webp" alt="Analisi HybridCharge — punteggio serale basso 22 settembre" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Analisi HC · serale basso</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-22-b1-readiness-panoramica.webp" alt="Panoramica 22 settembre — sonno 76, HybridCharge 20, sforzo 99%" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Panoramica · sonno 76 · sforzo 99%</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-22-b1-readiness-metriche.webp" alt="Trend settimanale HRV RHR HybridCharge — 22 settembre" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Trend 7 gg · HRV 40 · RHR 51 · HC 75</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-22-b1-hrv.webp" alt="HRV 22 settembre — 40 ms Buono, baseline 43" width="390" height="844" loading="lazy">
          </div>
          <figcaption>HRV 40 · Buono · sotto baseline</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-22-b1-sonno-score.webp" alt="Sonno score 22 settembre — 76 Normale" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Score sonno 76 · Normale</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-22-b1-sonno-metriche.webp" alt="Sonno 22 settembre — 7:22, profondo 1:35, REM 1:37, veglia 0:59" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Sonno 7:22 · regolarità 73%</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-22-b1-sonno-fc.webp" alt="FC sonno 22 settembre — media 54 bpm, trend settimanale" width="390" height="844" loading="lazy">
          </div>
          <figcaption>FC sonno 54 · iponea 2,2/h</figcaption>
        </figure>
      </div>

      <div class="amazfit-data" aria-label="Dati readiness estratti">
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Modulo allenamento TSB · 22/09</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>+4,0</strong><span>TSB · Bilanciato</span></div>
            <div class="amazfit-card__cell"><strong>40,0</strong><span>Fitness · CTL</span></div>
            <div class="amazfit-card__cell"><strong>36,0</strong><span>Fatica · ATL</span></div>
            <div class="amazfit-card__cell"><strong>91</strong><span>Carico sessione</span></div>
            <div class="amazfit-card__cell"><strong>12:53</strong><span>Inizio workout</span></div>
          </div>
        </div>
        <div class="amazfit-card">
          <p class="amazfit-card__title">Sonno · readiness · 22/09</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>7:22</strong><span>Durata · Buono</span></div>
            <div class="amazfit-card__cell"><strong>73%</strong><span>Regolarità · Normale</span></div>
            <div class="amazfit-card__cell"><strong>1:35</strong><span>Profondo · Leggero</span></div>
            <div class="amazfit-card__cell"><strong>76</strong><span>Score sonno · Normale</span></div>
            <div class="amazfit-card__cell"><strong>54</strong><span>FC sonno · bpm</span></div>
            <div class="amazfit-card__cell"><strong>103</strong><span>Carico sforzo / 104</span></div>
          </div>
        </div>
        <div class="amazfit-card">
          <p class="amazfit-card__title">HRV · FC riposo · 22/09</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>40</strong><span>HRV · ms · Buono</span></div>
            <div class="amazfit-card__cell"><strong>43</strong><span>Baseline</span></div>
            <div class="amazfit-card__cell"><strong>51</strong><span>FC a riposo · Ottimale</span></div>
            <div class="amazfit-card__cell"><strong>20</strong><span>HybridCharge post workout</span></div>
          </div>
        </div>
      </div>
    </section>

    <section class="session-panel session-panel--metabolic">
    <section class="metabolic-block" aria-labelledby="metabolic-title">
      <h2 id="metabolic-title">Dati metabolici · Amazfit</h2>
      <p class="metabolic-block__device"><strong>Amazfit Active 2 NFC</strong> · sync app Zepp · Allenamento muscolare</p>
      <p class="amazfit-gallery__lead">Export Zepp — 22 settembre ore 12:53, <strong>28 serie</strong>. Riepilogo e grafico FC a tutta larghezza.</p>

      <div class="amazfit-riepilogo-hero" aria-label="Resoconto Zepp — 22 settembre">
        <figure class="phone-shot phone-shot--full phone-shot--solo">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-22-b1-riepilogo.webp" alt="Riepilogo Zepp 22 settembre B1 — 28 serie, 515 kcal, FC 111, durata 01:07:38, carico 91" width="390" height="430" loading="eager" fetchpriority="high">
          </div>
          <figcaption>Riepilogo · 01:07:38 · 28 serie · carico 91 · 515 kcal</figcaption>
        </figure>
      </div>

      <div class="amazfit-fc-hero" aria-label="Grafico FC — 22 settembre">
        <figure class="phone-shot phone-shot--full phone-shot--solo">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-22-b1-fc-grafico.webp" alt="Grafico FC 22 settembre — media 111 max 157 bpm, 68 minuti" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Grafico FC · max 157 · 68 min</figcaption>
        </figure>
      </div>

      <div class="amazfit-gallery" aria-label="Screenshot Zepp — tecnica 22 settembre">
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-22-b1-zone-effetto.webp" alt="Zone FC 22 settembre — aerobico 3,0 Buono, anaerobico 2,6 Medio" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Zone FC · intensiva 33% · effetto Buono/Medio</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-22-b1-tecnica.webp" alt="Muscoli bicipiti/quadricipiti/femorali e radar tecnica — B1" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Muscoli + radar tecnica pieno</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-22-b1-readiness-dettaglio.webp" alt="Dettaglio metriche 22 settembre — ATL 36, obiettivo sforzo 104" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Dettaglio metriche giornata</figcaption>
        </figure>
      </div>

      <div class="amazfit-data" aria-label="Dati sessione 22 settembre">
        <div class="amazfit-card">
          <div class="amazfit-card__top">
            <div>
              <div class="amazfit-card__user">ginocapon</div>
              <div class="amazfit-card__meta">22 set · 12:53 · martedì · B1</div>
            </div>
            <span class="amazfit-card__badge">28 serie</span>
          </div>
          <p class="amazfit-card__title">Riepilogo sessione</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>01:07:38</strong><span>Tempo allenamento</span></div>
            <div class="amazfit-card__cell"><strong>50:51</strong><span>Recupero tra set</span></div>
            <div class="amazfit-card__cell"><strong>111</strong><span>FC media · bpm</span></div>
            <div class="amazfit-card__cell"><strong>157</strong><span>FC max · bpm</span></div>
            <div class="amazfit-card__cell"><strong>515</strong><span>Calorie · kcal</span></div>
            <div class="amazfit-card__cell"><strong>91</strong><span>Carico allenamento</span></div>
          </div>
        </div>
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Zone cardiache · minuti</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell"><strong>08:31</strong><span>Leggera · 81–96</span></div>
            <div class="amazfit-card__cell"><strong>22:51</strong><span>Intensiva · 97–113</span></div>
            <div class="amazfit-card__cell"><strong>19:32</strong><span>Aerobica · 114–129</span></div>
            <div class="amazfit-card__cell"><strong>08:57</strong><span>Anaerobica · 130–145</span></div>
            <div class="amazfit-card__cell"><strong>01:14</strong><span>VO₂ max · 146+</span></div>
          </div>
        </div>
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Effetto allenamento · Zepp</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>3,0</strong><span>Aerobico · Buono</span></div>
            <div class="amazfit-card__cell"><strong>2,6</strong><span>Anaerobico · Medio</span></div>
          </div>
        </div>
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Muscoli usati · map Zepp</p>
          <p><strong>Primari:</strong> bicipiti, quadricipiti, femorali posteriori. <strong>Secondari:</strong> glutei, lombare. Coerente con B1 — pattern accosciato + braccia.</p>
        </div>
      </div>

      <p class="metabolic-note"><strong>Analisi.</strong> Rispetto al B1 del 15/09 (sett. 3): −1 serie, −6 min, carico Zepp <strong>91 vs 107</strong>, FC media più bassa (111 vs 117) e max simile (157 vs 156). Profilo più “grigio”: <strong>33% intensiva</strong> vs picco aerobico sett. 3, anaerobico scende a <strong>Medio 2,6</strong> (3,1 Buono a settembre). Entrata con TSB <strong>+4 Bilanciato</strong> (CTL 40 / ATL 36) vs −1 — più margine rispetto al martedì precedente del ciclo. Sonno migliore (7:22 vs 7:07, score 76), HRV 40 vs 36. HybridCharge <strong>75→20</strong> post sessione; obiettivo sforzo quasi pieno <strong>103/104</strong>. Radar tecnica pieno — volume gambe/braccia gestito con recuperi lunghi (50:51). Prossimo slot: A2 venerdì.</p>

      <article class="hr-log hr-log--elevated" data-session="2026-09-22T12:53" data-duration-corrected="false">
        <div class="hr-metrics">
          <div class="hr-metric"><strong>01:07:38</strong><span>Durata</span></div>
          <div class="hr-metric"><strong>111</strong><span>FC media</span></div>
          <div class="hr-metric"><strong>157</strong><span>FC max</span></div>
          <div class="hr-metric"><strong>515</strong><span>Calorie</span></div>
          <div class="hr-metric"><strong>91</strong><span>Carico</span></div>
          <div class="hr-metric"><strong>28</strong><span>Serie</span></div>
        </div>
      </article>
    </section>
    </section>

    <nav class="session-nav" aria-label="Navigazione sessione">
      <a class="session-nav__primary" href="/allenamenti/sessioni/">← Tutte le sessioni</a>
      <a href="/admin/">B1 · Blocco 1 admin</a>
      <a href="/allenamenti/sessioni/2026-09-21-a1/">← A1 · 21 settembre</a>
    </nav>
    <p class="session-meta-footer">Ultimo aggiornamento: 22 settembre 2026 · export Zepp completo</p>
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
console.log("OK allenamenti/sessioni/2026-09-22-b1/index.html");
