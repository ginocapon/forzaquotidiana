/**
 * Semplifica pagina trimestre: rimuove TSB dalle schede 1–4,
 * sostituisce exercise-grid statici con mount JS (sprite admin).
 * node tools/patch-trimestre-semplifica.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = dirname(dirname(fileURLToPath(import.meta.url)));
const trimPath = join(REPO, "allenamenti/trimestre-giugno-luglio-agosto-2026/index.html");
let html = readFileSync(trimPath, "utf8");

// Rimuovi sprite inline obsoleto (80×80) — usa admin sprite
html = html.replace(
  /<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" aria-hidden="true"[\s\S]*?<\/svg>\s*\n/,
  ""
);

// Svuota moduli TSB nelle schede tipo (restano i marker per il tool)
for (let n = 1; n <= 4; n++) {
  const start = `<!-- TSB-SCHEDA-${n}-START -->`;
  const end = `<!-- TSB-SCHEDA-${n}-END -->`;
  const s = html.indexOf(start);
  const e = html.indexOf(end);
  if (s !== -1 && e !== -1) {
    html = html.slice(0, s + start.length) + "\n" + html.slice(e);
  }
}

// Sostituisci exercise-grid statici con mount dinamici
for (let n = 1; n <= 4; n++) {
  const re = new RegExp(
    `<div class="exercise-grid">[\\s\\S]*?</div>\\s*(?=</div>\\s*</section>|<!-- SCHEDA|</section>)`,
    "m"
  );
  const mount = `<div class="exercise-grid" data-trimestre-scheda="${n}" aria-label="Esercizi scheda ${n}"></div>\n`;
  html = html.replace(re, mount);
}

// Aggiorna CSS e aggiungi script figure trimestre
html = html.replace(/styles\.css\?v=\d+/, "styles.css?v=51");
if (!html.includes("sprite-esercizi.js")) {
  html = html.replace(
    '<script src="/js/main.js',
    '<script src="/admin/js/sprite-esercizi.js?v=1" defer></script>\n<script src="/js/trimestre-scheda-figure.js?v=1" defer></script>\n<script src="/js/main.js'
  );
}

writeFileSync(trimPath, html);
console.log("Trimestre semplificato:", trimPath);
