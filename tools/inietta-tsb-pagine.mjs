/**
 * Inietta modulo TSB con grafico SVG statico in sessioni + trimestre (overview + mensile)
 * node tools/inietta-tsb-pagine.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  renderTsbModule,
  renderTsbPanel,
} from "./tsb-render.mjs";

const REPO = dirname(dirname(fileURLToPath(import.meta.url)));
const data = JSON.parse(readFileSync(join(REPO, "data/training-load.json"), "utf8"));

const SESSION_PAGES = [
  { file: "allenamenti/sessioni/2026-07-16-scheda-1/index.html", date: "2026-07-16" },
  { file: "allenamenti/sessioni/2026-07-17-scheda-2/index.html", date: "2026-07-17" },
  { file: "allenamenti/sessioni/2026-07-20-scheda-1/index.html", date: "2026-07-20" },
  { file: "allenamenti/sessioni/2026-07-21-scheda-2/index.html", date: "2026-07-21" },
  { file: "allenamenti/sessioni/2026-07-23-scheda-3/index.html", date: "2026-07-23" },
  { file: "allenamenti/sessioni/2026-07-24-scheda-4/index.html", date: "2026-07-24" },
  { file: "allenamenti/sessioni/2026-07-27/index.html", date: "2026-07-27" },
  { file: "allenamenti/sessioni/2026-07-28-scheda-2/index.html", date: "2026-07-28" },
  { file: "allenamenti/sessioni/2026-07-30-scheda-3/index.html", date: "2026-07-30" },
  { file: "allenamenti/sessioni/2026-07-31-scheda-4/index.html", date: "2026-07-31" },
  { file: "allenamenti/sessioni/2026-08-03-scheda-1/index.html", date: "2026-08-03" },
  { file: "allenamenti/sessioni/2026-08-04-scheda-2/index.html", date: "2026-08-04" },
  { file: "allenamenti/sessioni/2026-08-17-scheda-1/index.html", date: "2026-08-17" },
  { file: "allenamenti/sessioni/2026-08-18-scheda-2/index.html", date: "2026-08-18" },
  { file: "allenamenti/sessioni/2026-08-20-scheda-1/index.html", date: "2026-08-20" },
  { file: "allenamenti/sessioni/2026-08-21-scheda-2/index.html", date: "2026-08-21" },
  { file: "allenamenti/sessioni/2026-08-24-scheda-1/index.html", date: "2026-08-24" },
  { file: "allenamenti/sessioni/2026-08-25-scheda-2/index.html", date: "2026-08-25" },
  { file: "allenamenti/sessioni/2026-08-28-scheda-3/index.html", date: "2026-08-28" },
  { file: "allenamenti/sessioni/2026-08-31-a1/index.html", date: "2026-08-31" },
  { file: "allenamenti/sessioni/2026-09-01-b1/index.html", date: "2026-09-01" },
  { file: "allenamenti/sessioni/scheda 04-09-2026  a2/index.html", date: "2026-09-04" },
];

const MONTH_KEYS = ["2026-06", "2026-07", "2026-08"];
const MONTH_ANCHORS = {
  "2026-06": "mese-giugno-2026",
  "2026-07": "mese-luglio-2026",
  "2026-08": "mese-agosto-2026",
};

function replaceBetween(html, startMarker, endMarker, replacement) {
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker);
  if (start === -1 || end === -1) return null;
  return html.slice(0, start + startMarker.length) + replacement + html.slice(end);
}

function upsertTsbPanel(html, date) {
  const inner = renderTsbModule(data, date, `sess-${date}`);
  const panel = renderTsbPanel(date, inner);
  const markerStart = "<!-- TSB-START -->";
  const markerEnd = "<!-- TSB-END -->";

  if (html.includes(markerStart)) {
    return replaceBetween(html, markerStart, markerEnd, "\n" + panel + "\n    ");
  }

  const oldPanelRe = /<section class="session-panel session-panel--tsb[\s\S]*?<\/section>\s*/;
  if (oldPanelRe.test(html)) {
    return html.replace(oldPanelRe, panel + "\n");
  }

  return html.replace(
    "  <div class=\"wrap prose prose--wide session-body\">\n",
    `  <div class="wrap prose prose--wide session-body">\n    ${markerStart}\n${panel}    ${markerEnd}\n`
  );
}

function renderMonthPanel(monthKey) {
  const anchor = MONTH_ANCHORS[monthKey] || `mese-${monthKey}`;
  const inner = renderTsbModule(data, `month-${monthKey}`, `trim-month-${monthKey}`);
  const labels = {
    "2026-06": "Giugno 2026",
    "2026-07": "Luglio 2026",
    "2026-08": "Agosto 2026",
  };
  const label = labels[monthKey] || monthKey;

  return `
      <article class="month-panel" id="${anchor}" data-month="${monthKey}">
        <h3 class="month-panel__title">${label}</h3>
        <div class="tsb-module tsb-module--static tsb-module--month" data-training-load="month-${monthKey}" aria-live="polite">${inner}</div>
        <div class="perf-charts" data-perf-month="${monthKey}" aria-label="Grafici performance ${label}"></div>
      </article>
`;
}

function ensureScript(html) {
  let out = html;
  if (out.includes("styles.css?v=")) {
    out = out.replace(/styles\.css\?v=\d+/, "styles.css?v=55");
  }
  if (out.includes("training-load-chart.js")) {
    out = out.replace(/training-load-chart\.js\?v=\d+/, "training-load-chart.js?v=3");
  }
  if (out.includes("performance-charts.js")) {
    out = out.replace(/performance-charts\.js\?v=\d+/, "performance-charts.js?v=2");
  }
  return out;
}

for (const { file, date } of SESSION_PAGES) {
  const path = join(REPO, file);
  let html = readFileSync(path, "utf8");
  html = upsertTsbPanel(html, date);
  html = ensureScript(html);
  writeFileSync(path, html);
  console.log("sessione", date);
}

const trimPath = join(REPO, "allenamenti/trimestre-giugno-luglio-agosto-2026/index.html");
let trim = readFileSync(trimPath, "utf8");

const overviewInner = renderTsbModule(data, "overview", "trim-overview");
const overviewBlock = `
      <h2 id="modulo-tsb">Modulo allenamento · fitness e fatica (TSB)</h2>
      <p>Riepilogo trimestrale — il <strong>grafico</strong> CTL/ATL è sempre visibile; sotto, i moduli mensili con focus su ogni mese del trimestre.</p>
      <div class="tsb-module tsb-module--static" data-training-load="overview" aria-live="polite">${overviewInner}</div>
`;

if (trim.includes("<!-- TSB-TRIM-START -->")) {
  trim = replaceBetween(trim, "<!-- TSB-TRIM-START -->", "<!-- TSB-TRIM-END -->", "\n" + overviewBlock + "\n");
} else if (trim.includes("OVERVIEW_INJECT")) {
  trim = trim.replace(
    '<div class="tsb-module tsb-module--static" data-training-load="overview" aria-live="polite">OVERVIEW_INJECT</div>',
    `<div class="tsb-module tsb-module--static" data-training-load="overview" aria-live="polite">${overviewInner}</div>`
  );
} else {
  trim = trim.replace(
    /<h2 id="modulo-tsb">[\s\S]*?<div class="tsb-module[\s\S]*?<\/div>\s*(?=<div class="tsb-module|<div id="perf-charts|<h2>Regole)/,
    overviewBlock + "\n"
  );
}

// Rimuovi markup TSB duplicato/corrotto dopo overview
trim = trim.replace(
  /(<div class="tsb-module tsb-module--static" data-training-load="overview"[\s\S]*?<\/div>)\s*(<div class="tsb-module__kpis">[\s\S]*?<\/div>\s*<\/div><div class="tsb-module__chart-wrap">[\s\S]*?<\/div>)/,
  "$1"
);

const monthPanels = MONTH_KEYS.map((mk) => renderMonthPanel(mk)).join("");
const monthBlock = `
      <h2 id="statistiche-mensili">Statistiche per mese</h2>
      <p>Ogni mese del trimestre ha il proprio modulo TSB e i grafici performance — base per confronti mensili e trimestrali. Le schede tipo restano trimestrali; qui raggruppiamo solo i log e le metriche.</p>
      <nav class="month-nav" aria-label="Mesi del trimestre">
        <a href="#mese-giugno-2026">Giugno</a>
        <a href="#mese-luglio-2026">Luglio</a>
        <a href="#mese-agosto-2026">Agosto</a>
      </nav>
      <div class="month-panels">
${monthPanels}
      </div>
`;

if (trim.includes("<!-- MONTH-PANELS-START -->")) {
  trim = replaceBetween(trim, "<!-- MONTH-PANELS-START -->", "<!-- MONTH-PANELS-END -->", "\n" + monthBlock + "\n");
} else {
  trim = trim.replace(
    /<div id="perf-charts"[\s\S]*?<\/div>\s*/,
  `<!-- MONTH-PANELS-START -->${monthBlock}<!-- MONTH-PANELS-END -->\n`
  );
}

// Schede tipo 1–4: solo spiegazione tecnica — niente TSB (resta nelle sessioni)
for (let num = 1; num <= 4; num++) {
  const markerStart = `<!-- TSB-SCHEDA-${num}-START -->`;
  const markerEnd = `<!-- TSB-SCHEDA-${num}-END -->`;
  if (trim.includes(markerStart) && trim.includes(markerEnd)) {
    trim = replaceBetween(trim, markerStart, markerEnd, "\n");
  }
}

trim = ensureScript(trim);
if (!trim.includes("training-load-chart.js")) {
  trim = trim.replace(
    '<script src="/js/performance-charts.js',
    '<script src="/js/training-load-chart.js?v=3" defer></script>\n<script src="/js/performance-charts.js'
  );
}
writeFileSync(trimPath, trim);
console.log("trimestre overview + mesi OK");
