#!/usr/bin/env node
/** Scaffold sessione 2026-09-11-a2 — venerdì Blocco 1 upper + foto progresso reale */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderTsbModule } from "./tsb-render.mjs";

const REPO = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const data = JSON.parse(fs.readFileSync(path.join(REPO, "data/training-load.json"), "utf8"));
const tsbHtml = renderTsbModule(data, "2026-09-11", { sessionId: "sess-2026-09-11-a2" });

const dir = path.join(REPO, "allenamenti/sessioni/2026-09-11-a2");
fs.mkdirSync(dir, { recursive: true });

const html = `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<title>11 settembre 2026 — A2 petto · schiena · spalle | Sessione · La Forza Quotidiana</title>
<meta name="description" content="Sessione 11 settembre 2026 ore 14:48: A2 Blocco 1. 23 serie, 83 min, carico 54, FC 108/137, 607 kcal. Upper + progress check reale.">
<link rel="canonical" href="https://forzaquotidiana.it/allenamenti/sessioni/2026-09-11-a2/">
<meta property="og:type" content="article">
<meta property="og:site_name" content="La Forza Quotidiana">
<meta property="og:locale" content="it_IT">
<meta property="og:url" content="https://forzaquotidiana.it/allenamenti/sessioni/2026-09-11-a2/">
<meta property="og:title" content="11 settembre 2026 — A2 · petto · schiena · spalle">
<meta property="og:image" content="https://forzaquotidiana.it/img/allenamenti/amazfit/2026-09-11-a2-riepilogo.webp">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="11 settembre 2026 — A2 · upper Blocco 1">
<meta name="twitter:description" content="83 min, 23 serie, carico 54, FC 108/137, aerobico 2,5 Medio — foto progresso reale.">
<meta name="twitter:image" content="https://forzaquotidiana.it/img/allenamenti/amazfit/2026-09-11-a2-riepilogo.webp">
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
        <a href="/allenamenti/">Allenamenti</a> · <a href="/allenamenti/sessioni/">Sessioni</a> · 11 settembre 2026
      </nav>
      <div class="session-hero__top">
        <span class="session-hero__badge">A2</span>
        <time class="session-hero__time" datetime="2026-09-11T14:48">11 settembre 2026 · ore 14:48 · venerdì</time>
      </div>
      <h1>Petto · schiena · spalle — A2 Blocco 1</h1>
      <p class="session-hero__sub">83 min, carico 54, FC 108/137, 607 kcal — 23 serie · aerobico 2,5 Medio · HRV 46 Buono · TSB -11 Ottimale</p>
      <dl class="session-kpis" aria-label="Metriche principali sessione">
        <div class="session-kpis__item session-kpis__item--accent"><dt>Durata</dt><dd>01:23:26</dd></div>
        <div class="session-kpis__item"><dt>FC media</dt><dd>108</dd></div>
        <div class="session-kpis__item"><dt>FC max</dt><dd>137</dd></div>
        <div class="session-kpis__item"><dt>Calorie</dt><dd>607</dd></div>
        <div class="session-kpis__item"><dt>Carico</dt><dd>54</dd></div>
        <div class="session-kpis__item"><dt>Serie</dt><dd>23</dd></div>
      </dl>
      <p class="session-hero__refs">Scheda di riferimento: <a href="/admin/"><strong>A2</strong> · Blocco 1 · Ipertrofia accumulo</a> · Precedente: <a href="/allenamenti/sessioni/2026-09-08-b1/">B1 · 8 settembre</a></p>
    </div>
  </header>

  <div class="wrap prose prose--wide session-body">
    <!-- TSB-START -->
    <section class="session-panel session-panel--tsb" aria-labelledby="tsb-modulo-2026-09-11">
      <span class="session-panel__label" id="tsb-modulo-2026-09-11">Fitness · fatica · riposo</span>
      ${tsbHtml}
    </section>
    <!-- TSB-END -->

    <!-- GUILE-START -->
    <section class="session-panel session-panel--guile guile-panel" aria-labelledby="guile-2026-09-11-a2">
      <span class="session-panel__label" id="guile-2026-09-11-a2">Spirito Guile · umorismo pro</span>
      <p class="guile-panel__lead">Tre illustrazioni IA — <strong>una fotorealistica</strong> (upper body), due stile arcade. Export Zepp = fonte numerica.</p>
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

    <section class="session-panel session-panel--progress" aria-labelledby="progresso-visivo">
      <span class="session-panel__label" id="progresso-visivo">Performance visiva · step di oggi</span>
      <p class="session-panel__intro">Selfie documentale post-sessione in spogliatoio — <strong>step visivo</strong> settimana 2 del Blocco 1, complemento ai numeri Zepp. Stesso giorno del pezzo diario <a href="/diario/selfie-spogliatoio-settimana-due-blocco1-57-anni/">Selfie spogliatoio</a> (canottiera FITNESS, specchio Technogym).</p>
      <figure class="phone-shot phone-shot--portrait phone-shot--solo" aria-label="Foto progresso reale 11 settembre">
        <div class="phone-shot__frame phone-shot__frame--document">
          <img src="/img/allenamenti/sessioni/2026-09-11-a2-progresso-specchio.webp" alt="Gino Capon — selfie specchio spogliatoio post A2, canottiera FITNESS, 11 settembre 2026" width="1200" height="1600" loading="eager" fetchpriority="high">
        </div>
        <figcaption>Foto reale · progress check · 11/09 post A2 · nessuna IA</figcaption>
      </figure>
      <p class="session-note">Lo specchio non sostituisce carico e FC: integra. Petto e spalle visibili coerenti con map muscoli Zepp (petto primario, deltoidi secondari). Confronto nel tempo, non perfezione da feed.</p>
    </section>

    <section class="session-panel" aria-labelledby="nota-sessione">
      <span class="session-panel__label" id="nota-sessione">Nota di Gino</span>
      <p class="session-note"><strong>A2</strong> venerdì pomeriggio <strong>14:48</strong> — petto · schiena · spalle, chiusura settimana 2 upper/lower. <strong>23 serie</strong> in <strong>01:23:26</strong>, recupero <strong>59:31</strong>, carico <strong>54</strong> — più basso dell'A1 lunedi (299) ma seduta lunga con FC controllata.</p>
      <p class="session-note">Profilo cardio distinto: FC media <strong>108</strong>, max <strong>137</strong> — 54% tempo in zona intensiva, effetto aerobico <strong>2,5 Medio</strong> e anaerobico <strong>1,7 Basso</strong>. Readiness migliorata vs inizio settimana: sonno <strong>6:21</strong>, HRV <strong>46</strong>, HybridCharge risveglio <strong>72</strong>, TSB <strong>-11 Ottimale</strong> (CTL 36 / ATL 47).</p>
    </section>

    <section class="session-panel session-panel--readiness" aria-labelledby="readiness-title">
      <span class="session-panel__label">Readiness · sonno · HRV</span>
      <h2 id="readiness-title">Metriche giornata · Zepp · 11/09</h2>
      <p class="session-panel__intro">Sonno <strong>6:21 Normale</strong> (+ pisolino 0:33), HRV <strong>46 Buono</strong>, FC riposo <strong>49 Ottimale</strong>, HybridCharge <strong>72 Discreto</strong>. TSB <strong>-11,0 Ottimale</strong>.</p>

      <div class="amazfit-tsb-hero" aria-label="Modulo TSB — 11 settembre">
        <figure class="phone-shot phone-shot--full phone-shot--solo">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-11-a2-tsb.webp" alt="Modulo TSB 11 settembre — CTL 36 ATL 47 TSB -11 Ottimale" width="844" height="390" loading="eager" fetchpriority="high">
          </div>
          <figcaption>TSB · 11/09 · Ottimale · CTL 36 · ATL 47</figcaption>
        </figure>
      </div>

      <div class="amazfit-gallery" aria-label="Screenshot Zepp — readiness 11 settembre">
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-11-a2-hybridcharge.webp" alt="HybridCharge 11 settembre — risveglio 72 Discreto, allenamento 14:48-16:12" width="390" height="844" loading="lazy">
          </div>
          <figcaption>HybridCharge 72 · Discreto</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-11-a2-readiness-dettaglio.webp" alt="Metriche 11 settembre — carico sforzo 80, sonno 6:21, HRV 46" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Carico sforzo 80 · sonno 6:21</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-11-a2-hrv.webp" alt="HRV 11 settembre — 46 ms Buono, baseline 43" width="390" height="844" loading="lazy">
          </div>
          <figcaption>HRV 46 · Buono</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-11-a2-sonno-metriche.webp" alt="Sonno 11 settembre — 6:21, profondo 1:22, REM 1:54, veglia 1:39" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Sonno 6:21 · regolarità 56%</figcaption>
        </figure>
      </div>

      <div class="amazfit-data" aria-label="Dati readiness estratti">
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Modulo allenamento TSB · 11/09</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>-11,0</strong><span>TSB · Ottimale</span></div>
            <div class="amazfit-card__cell"><strong>36,0</strong><span>Fitness · CTL</span></div>
            <div class="amazfit-card__cell"><strong>47,0</strong><span>Fatica · ATL</span></div>
            <div class="amazfit-card__cell"><strong>54</strong><span>Carico sessione</span></div>
            <div class="amazfit-card__cell"><strong>14:48</strong><span>Inizio workout</span></div>
          </div>
        </div>
        <div class="amazfit-card">
          <p class="amazfit-card__title">Sonno · readiness · 11/09</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>6:21</strong><span>Durata · Normale</span></div>
            <div class="amazfit-card__cell"><strong>56%</strong><span>Regolarità · Attenzione</span></div>
            <div class="amazfit-card__cell"><strong>1:22</strong><span>Profondo · Leggero</span></div>
            <div class="amazfit-card__cell"><strong>72</strong><span>HybridCharge risveglio</span></div>
            <div class="amazfit-card__cell"><strong>80</strong><span>Carico sforzo giorno</span></div>
          </div>
        </div>
        <div class="amazfit-card">
          <p class="amazfit-card__title">HRV · FC riposo · 11/09</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>46</strong><span>HRV · ms · Buono</span></div>
            <div class="amazfit-card__cell"><strong>43</strong><span>Baseline</span></div>
            <div class="amazfit-card__cell"><strong>49</strong><span>FC a riposo · Ottimale</span></div>
            <div class="amazfit-card__cell"><strong>0:33</strong><span>Pisolino mattina</span></div>
          </div>
        </div>
      </div>
    </section>

    <section class="session-panel session-panel--metabolic">
    <section class="metabolic-block" aria-labelledby="metabolic-title">
      <h2 id="metabolic-title">Dati metabolici · Amazfit</h2>
      <p class="metabolic-block__device"><strong>Amazfit Active 2 NFC</strong> · sync app Zepp · Allenamento muscolare</p>
      <p class="amazfit-gallery__lead">Export Zepp — 11 settembre ore 14:48, <strong>23 serie</strong>. Riepilogo e grafico FC a tutta larghezza.</p>

      <div class="amazfit-riepilogo-hero" aria-label="Resoconto Zepp — 11 settembre">
        <figure class="phone-shot phone-shot--full phone-shot--solo">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-11-a2-riepilogo.webp" alt="Riepilogo Zepp 11 settembre A2 — 23 serie, 607 kcal, FC 108, durata 01:23:26, carico 54" width="390" height="430" loading="eager" fetchpriority="high">
          </div>
          <figcaption>Riepilogo · 01:23:26 · 23 serie · carico 54 · 607 kcal</figcaption>
        </figure>
      </div>

      <div class="amazfit-fc-hero" aria-label="Grafico FC — 11 settembre">
        <figure class="phone-shot phone-shot--full phone-shot--solo">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-11-a2-fc-grafico.webp" alt="Grafico FC 11 settembre — media 108 max 137 bpm, 83 minuti" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Grafico FC · max 137 · 83 min</figcaption>
        </figure>
      </div>

      <div class="amazfit-gallery" aria-label="Screenshot Zepp — tecnica 11 settembre">
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-11-a2-zone-effetto.webp" alt="Zone FC 11 settembre — aerobico 2,5 Medio, anaerobico 1,7 Basso" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Zone FC · intensiva 54% · aerobica 28%</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-11-a2-tecnica.webp" alt="Muscoli petto/deltoidi e radar tecnica — A2" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Muscoli + radar tecnica</figcaption>
        </figure>
        <figure class="phone-shot">
          <div class="phone-shot__frame">
            <img src="/img/allenamenti/amazfit/2026-09-11-a2-valutazione.webp" alt="Valutazione complessiva movimento A2" width="390" height="844" loading="lazy">
          </div>
          <figcaption>Valutazione complessiva</figcaption>
        </figure>
      </div>

      <div class="amazfit-data" aria-label="Dati sessione 11 settembre">
        <div class="amazfit-card">
          <div class="amazfit-card__top">
            <div>
              <div class="amazfit-card__user">ginocapon</div>
              <div class="amazfit-card__meta">11 set · 14:48 · venerdì · A2</div>
            </div>
            <span class="amazfit-card__badge">23 serie</span>
          </div>
          <p class="amazfit-card__title">Riepilogo sessione</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>01:23:26</strong><span>Tempo allenamento</span></div>
            <div class="amazfit-card__cell"><strong>59:31</strong><span>Recupero tra set</span></div>
            <div class="amazfit-card__cell"><strong>108</strong><span>FC media · bpm</span></div>
            <div class="amazfit-card__cell"><strong>137</strong><span>FC max · bpm</span></div>
            <div class="amazfit-card__cell"><strong>607</strong><span>Calorie · kcal</span></div>
            <div class="amazfit-card__cell"><strong>54</strong><span>Carico allenamento</span></div>
          </div>
        </div>
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Zone cardiache · minuti</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell"><strong>12:58</strong><span>Leggera · 81–96</span></div>
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>45:46</strong><span>Intensiva · 97–113</span></div>
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>23:55</strong><span>Aerobica · 114–129</span></div>
            <div class="amazfit-card__cell"><strong>0:41</strong><span>Anaerobica · 130–145</span></div>
            <div class="amazfit-card__cell"><strong>0:00</strong><span>VO₂ max · 146+</span></div>
          </div>
        </div>
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Effetto allenamento · Zepp</p>
          <div class="amazfit-card__grid">
            <div class="amazfit-card__cell amazfit-card__cell--highlight"><strong>2,5</strong><span>Aerobico · Medio</span></div>
            <div class="amazfit-card__cell"><strong>1,7</strong><span>Anaerobico · Basso</span></div>
          </div>
        </div>
        <div class="amazfit-card amazfit-card--wide">
          <p class="amazfit-card__title">Muscoli usati · map Zepp</p>
          <p><strong>Primari:</strong> petto. <strong>Secondari:</strong> deltoidi, trapezio. Coerente con A2 upper body — petto e spalle.</p>
        </div>
      </div>

      <p class="metabolic-note"><strong>Valutazione conclusiva.</strong> Seduta <strong>A2</strong> venerdì (<strong>83 min</strong>, <strong>23 serie</strong>), carico <strong>54</strong> — volume tecnico alto, intensità cardio moderata (FC max 137). Recupero tra set lungo (59 min). Sonno e HRV in miglioramento rispetto a martedì. Foto progresso in spogliatoio documenta step visivo settimana 2.</p>

      <article class="hr-log hr-log--elevated" data-session="2026-09-11T14:48" data-duration-corrected="false">
        <div class="hr-metrics">
          <div class="hr-metric"><strong>01:23:26</strong><span>Durata</span></div>
          <div class="hr-metric"><strong>108</strong><span>FC media</span></div>
          <div class="hr-metric"><strong>137</strong><span>FC max</span></div>
          <div class="hr-metric"><strong>607</strong><span>Calorie</span></div>
          <div class="hr-metric"><strong>54</strong><span>Carico</span></div>
          <div class="hr-metric"><strong>23</strong><span>Serie</span></div>
        </div>
      </article>
    </section>
    </section>

    <nav class="session-nav" aria-label="Navigazione sessione">
      <a class="session-nav__primary" href="/allenamenti/sessioni/">← Tutte le sessioni</a>
      <a href="/admin/">A2 · Blocco 1 admin</a>
      <a href="/allenamenti/sessioni/2026-09-08-b1/">← B1 · 8 settembre</a>
    </nav>
    <p class="session-meta-footer">Ultimo aggiornamento: 11 settembre 2026 · export Zepp completo + foto progresso reale</p>
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
console.log("OK allenamenti/sessioni/2026-09-11-a2/index.html");
