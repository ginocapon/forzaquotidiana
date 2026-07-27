/**
 * Inietta modulo TSB con grafico SVG statico in sessioni + trimestre
 * node tools/inietta-tsb-pagine.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  renderTsbModule,
  renderTsbPanel,
  renderTrimestreSchedaBlock,
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
  { file: "allenamenti/sessioni/2026-07-27-scheda-1/index.html", date: "2026-07-27" },
];

const SCHEDA_FOCUS = {
  1: "2026-07-27",
  2: "2026-07-21",
  3: "2026-07-23",
  4: "2026-07-24",
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

function ensureScript(html) {
  let out = html.replace("/css/styles.css?v=34", "/css/styles.css?v=35");
  if (!out.includes("styles.css?v=35") && out.includes("styles.css?v=")) {
    out = out.replace(/styles\.css\?v=\d+/, "styles.css?v=35");
  }
  if (out.includes("training-load-chart.js")) {
    out = out.replace(/training-load-chart\.js\?v=\d+/, "training-load-chart.js?v=2");
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
      <p>Riepilogo trimestrale — il <strong>grafico</strong> CTL/ATL è sempre visibile; sotto, il giudizio delle singole giornate di allenamento nelle schede tipo.</p>
      <div class="tsb-module tsb-module--static" data-training-load="overview" aria-live="polite">${overviewInner}</div>
`;

if (trim.includes("<!-- TSB-TRIM-START -->")) {
  trim = replaceBetween(trim, "<!-- TSB-TRIM-START -->", "<!-- TSB-TRIM-END -->", "\n" + overviewBlock + "\n");
} else {
  trim = trim.replace(
    /<h2 id="modulo-tsb">[\s\S]*?<div class="tsb-module[\s\S]*?<\/div>\s*/,
    overviewBlock + "\n"
  );
}

for (const [num, date] of Object.entries(SCHEDA_FOCUS)) {
  const markerStart = `<!-- TSB-SCHEDA-${num}-START -->`;
  const markerEnd = `<!-- TSB-SCHEDA-${num}-END -->`;
  const inner = renderTsbModule(data, date, `trim-s${num}`);
  const block = renderTrimestreSchedaBlock(num, inner);

  if (trim.includes(markerStart)) {
    trim = replaceBetween(trim, markerStart, markerEnd, block);
  } else {
    const schedaRe = new RegExp(`(<section class="section section--tight day-block" id="scheda-${num}">[\\s\\S]*?<div class="day-block__head">[\\s\\S]*?</div>)`);
    trim = trim.replace(schedaRe, `$1\n      ${markerStart}${block}${markerEnd}`);
  }
  console.log("trimestre scheda", num, date);
}

trim = ensureScript(trim);
if (!trim.includes("training-load-chart.js")) {
  trim = trim.replace(
    '<script src="/js/performance-charts.js',
    '<script src="/js/training-load-chart.js?v=2" defer></script>\n<script src="/js/performance-charts.js'
  );
}
writeFileSync(trimPath, trim);
console.log("trimestre overview OK");
