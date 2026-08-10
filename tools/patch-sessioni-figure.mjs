#!/usr/bin/env node
/**
 * Aggiunge figure esercizi admin alle pagine sessione Q3 2026
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SESSIONI = path.join(ROOT, "allenamenti/sessioni");

const FIGURE_PANEL = `    <section class="session-panel" aria-labelledby="figure-esercizi">
      <span class="session-panel__label" id="figure-esercizi">Programma</span>
      <h2>Figure esercizi · scheda di riferimento</h2>
      <div id="sessione-scheda-figure" class="sessione-figure-mount"></div>
    </section>

`;

const SCRIPTS = `    <script src="/admin/js/sprite-esercizi.js?v=1" defer></script>
    <script src="/js/sessione-scheda-figure.js?v=1" defer></script>
`;

const EQUIPMENT_IMG = /technogym|leg-press|leg-extension|leg-curl|panca-scott|multipower-sala|adduttori-poster|stacco-omega-poster/i;

/** slug folder -> scheda number(s) */
const SCHEDA_MAP = {
  "2026-07-16-scheda-1": "1",
  "2026-07-17-scheda-2": "2",
  "2026-07-20-scheda-1": "1",
  "2026-07-21-scheda-2": "2",
  "2026-07-23-scheda-3": "3",
  "2026-07-24-scheda-4": "4",
  "2026-07-27": "1,3",
  "2026-07-27-scheda-1": "1",
  "2026-07-27-scheda-3": "3",
  "2026-07-28-scheda-2": "2",
  "2026-07-30-scheda-3": "3",
  "2026-07-30-scheda-4": "4",
  "2026-07-31-scheda-4": "4",
  "2026-08-03-scheda-1": "1",
  "2026-08-04-scheda-2": "2",
};

function patchFile(filePath, scheda) {
  let html = fs.readFileSync(filePath, "utf8");
  if (html.includes('id="sessione-scheda-figure"')) {
    console.log("skip (già patchato):", path.basename(path.dirname(filePath)));
    return false;
  }
  if (!scheda) {
    console.log("skip (no scheda):", path.basename(path.dirname(filePath)));
    return false;
  }

  html = html.replace(
    /<body class="theme-allenamenti">/,
    `<body class="theme-allenamenti" data-schede="${scheda}" data-trimestre-url="/allenamenti/trimestre-giugno-luglio-agosto-2026/">`
  );

  html = html.replace(/href="\/css\/styles\.css\?v=\d+"/, 'href="/css/styles.css?v=50"');

  if (html.includes('id="log-esercizi"')) {
    html = html.replace(
      /(\s*<section class="session-panel" aria-labelledby="log-esercizi">)/,
      "\n" + FIGURE_PANEL + "$1"
    );
  } else if (html.includes('id="nota-sessione"')) {
    html = html.replace(
      /(\s*<section class="session-panel" aria-labelledby="nota-sessione">[\s\S]*?<\/section>)/,
      "$1\n" + FIGURE_PANEL
    );
  }

  // Rimuovi polaroid solo attrezzi (mantieni Gino e video)
  html = html.replace(
    /<figure class="polaroid[^"]*">\s*<img[^>]+src="[^"]*(?:technogym|panca-scott|multipower-sala)[^"]*"[^>]*>[\s\S]*?<\/figure>\s*/gi,
    ""
  );

  if (!html.includes("sprite-esercizi.js")) {
    html = html.replace(
      /(<script src="\/js\/cookie-consent\.js[^<]+><\/script>)/,
      SCRIPTS + "$1"
    );
  }

  fs.writeFileSync(filePath, html);
  console.log("patched:", path.basename(path.dirname(filePath)), "scheda", scheda);
  return true;
}

const dirs = fs.readdirSync(SESSIONI).filter((d) => {
  const p = path.join(SESSIONI, d);
  return fs.statSync(p).isDirectory();
});

let count = 0;
for (const dir of dirs) {
  const index = path.join(SESSIONI, dir, "index.html");
  if (!fs.existsSync(index)) continue;
  if (patchFile(index, SCHEDA_MAP[dir])) count++;
}

console.log("Totale patchate:", count);
