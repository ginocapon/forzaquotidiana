/**
 * Inietta pannello Guile (≥3 img IA) + script animazioni in tutte le pagine sessione
 * node tools/upgrade-sessioni-guile.mjs [--dry-run]
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = join(dirname(fileURLToPath(import.meta.url)), "..");
const SESSIONS_DIR = join(REPO, "allenamenti/sessioni");
const DRY = process.argv.includes("--dry-run");
const CSS_V = 60;

const GUILE_BY_SCHEDA = {
  1: [
    { file: "guile-scheda-1-hero.webp", alt: "Eroe stile arcade — petto e spinta in palestra" },
    { file: "guile-scheda-1-spotter.webp", alt: "Spotter muscoloso stile fumetto — assistenza panca" },
    { file: "guile-scheda-1-recovery.webp", alt: "Recupero post-sessione — smartwatch e HRV" },
  ],
  2: [
    { file: "guile-scheda-2-hero.webp", alt: "Gambe e squat — estetica fighting game anni 90" },
    { file: "guile-scheda-2-squat.webp", alt: "Squat profondo — esplosività controllata" },
    { file: "guile-scheda-2-power.webp", alt: "Power pose umoristico post gambe" },
  ],
  3: [
    { file: "guile-scheda-3-hero.webp", alt: "Spalle e military press — illustrazione Guile-style" },
    { file: "guile-scheda-3-power.webp", alt: "Sonic boom energy — flex post spalle" },
    { file: "guile-scheda-3-recovery.webp", alt: "Monitoraggio recupero con wearable" },
  ],
  4: [
    { file: "guile-scheda-4-hero.webp", alt: "Kettlebell halo — mobilità spalle stile arcade" },
    { file: "guile-scheda-4-calves.webp", alt: "Polpacci in pressa — focus gambe" },
    { file: "guile-scheda-4-recovery.webp", alt: "Recupero e dati sonno" },
  ],
};

const SESSION_OVERRIDES = {
  "2026-08-28-scheda-3": [
    { file: "2026-08-28-scheda-3-hero.webp", alt: "Scheda 3 · 28 agosto — military press stile Guile" },
    { file: "2026-08-28-scheda-3-power.webp", alt: "28 agosto — power pose post spalle e dorsali" },
    { file: "2026-08-28-scheda-3-recovery.webp", alt: "28 agosto — cruscotto recupero HRV e sonno" },
  ],
};

function parseScheda(slug) {
  const m = slug.match(/scheda-(\d)/);
  return m ? Number(m[1]) : 1;
}

function renderGuilePanel(slug, scheda) {
  const imgs = SESSION_OVERRIDES[slug] || GUILE_BY_SCHEDA[scheda] || GUILE_BY_SCHEDA[1];
  const cards = imgs
    .map(
      (img, i) => `        <figure class="guile-card" style="--guile-i:${i}">
          <span class="ai-photo-wrap guile-card__frame">
            <img src="/img/allenamenti/guile/${img.file}" alt="${img.alt}" width="640" height="360" loading="lazy" data-ai="generated">
            <span class="ai-photo-mark" aria-hidden="true">Foto AI</span>
          </span>
          <figcaption>${img.alt.split("—").pop()?.trim() || img.alt}</figcaption>
        </figure>`
    )
    .join("\n");

  return `
    <section class="session-panel session-panel--guile guile-panel" aria-labelledby="guile-${slug}">
      <span class="session-panel__label" id="guile-${slug}">Spirito Guile · umorismo pro</span>
      <p class="guile-panel__lead">Tre illustrazioni IA — <strong>almeno una fotorealistica</strong> con esercizio e viso di Gino, le altre stile arcade Guile. Gli export Zepp restano la fonte numerica.</p>
      <div class="guile-strip guile-strip--${scheda}" aria-label="Galleria illustrazioni Guile-style">
${cards}
      </div>
      <p class="fig-credit guile-panel__credit"><span class="ai-badge" aria-hidden="true">IA</span> Immagini generate con intelligenza artificiale · <a href="/trasparenza-ai/">Trasparenza</a></p>
    </section>`;
}

function listSessionPages() {
  return readdirSync(SESSIONS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(SESSIONS_DIR, d.name, "index.html")))
    .map((d) => d.name);
}

function patchHtml(html, slug, scheda) {
  let out = html;
  const markerStart = "<!-- GUILE-START -->";
  const markerEnd = "<!-- GUILE-END -->";
  const panel = renderGuilePanel(slug, scheda);

  if (out.includes(markerStart)) {
    const s = out.indexOf(markerStart);
    const e = out.indexOf(markerEnd);
    if (s !== -1 && e !== -1) {
      out = out.slice(0, s + markerStart.length) + panel + "\n    " + out.slice(e);
    }
  } else if (out.includes("<!-- TSB-END -->")) {
    out = out.replace("<!-- TSB-END -->", "<!-- TSB-END -->\n\n    " + markerStart + panel + "\n    " + markerEnd);
  }

  if (!out.includes("session-page--guile")) {
    out = out.replace('class="session-page"', 'class="session-page session-page--guile"');
    out = out.replace(/class="theme-allenamenti"(?![^"]*session-page)/, 'class="theme-allenamenti session-page--guile"');
  }

  if (!out.includes("session-guile.js")) {
    out = out.replace(
      '<script src="/js/cookie-consent.js',
      '<script src="/js/session-guile.js?v=1" defer></script>\n<script src="/js/cookie-consent.js'
    );
  }

  out = out.replace(/styles\.css\?v=\d+/g, `styles.css?v=${CSS_V}`);
  return out;
}

const slugs = listSessionPages();
let updated = 0;
for (const slug of slugs) {
  const path = join(SESSIONS_DIR, slug, "index.html");
  const orig = readFileSync(path, "utf8");
  const scheda = parseScheda(slug);
  const next = patchHtml(orig, slug, scheda);
  if (next !== orig) {
    updated++;
    if (!DRY) writeFileSync(path, next, "utf8");
    console.log(DRY ? "[dry-run]" : "✓", slug);
  }
}
console.log(`Sessioni: ${slugs.length}, aggiornate: ${updated}`);
