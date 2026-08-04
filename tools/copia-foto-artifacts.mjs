/**
 * Copia foto da /opt/cursor/artifacts/assets/ a img/diario/YYYY-MM-DD/.
 * Uso dopo upload da mobile: node tools/copia-foto-artifacts.mjs YYYY-MM-DD
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const date = process.argv[2];
if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
  console.error("Uso: node tools/copia-foto-artifacts.mjs YYYY-MM-DD");
  process.exit(1);
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = dirname(__dirname);
const ASSETS = "/opt/cursor/artifacts/assets";
const destDir = join(REPO, "img", "diario", date);

/** Per data: mappa nome file in assets → nome file in repo */
const MAP_BY_DATE = {
  "2026-07-22": {
    "gino-selfie-mare.jpg": "gino-selfie-mare.jpg",
    "lido-viale-palme.jpg": "lido-viale-palme.jpg",
    "spiaggia-kite-luce.jpg": "spiaggia-kite-luce.jpg",
    "spiaggia-panorama-kite.jpg": "spiaggia-panorama-kite.jpg",
  },
  "2026-08-04": {
    "gino-demolition-men-disfatto.jpg": "gino-capon-selfie-palestra-demolition-men.png",
    "gino-teken-il-guerriero-cartovita.jpg": "gino-capon-teken-il-guerriero-ritratto.png",
    "gino-capon-selfie-palestra-demolition-men.png": "gino-capon-selfie-palestra-demolition-men.png",
    "gino-capon-teken-il-guerriero-ritratto.png": "gino-capon-teken-il-guerriero-ritratto.png",
  },
};

const FALLBACK_ORDER = [
  "gino-selfie-mare.jpg",
  "lido-viale-palme.jpg",
  "spiaggia-kite-luce.jpg",
  "spiaggia-panorama-kite.jpg",
];

if (!existsSync(ASSETS)) {
  console.error("Cartella assets non trovata:", ASSETS);
  process.exit(1);
}

const files = readdirSync(ASSETS).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
if (!files.length) {
  console.error("Nessuna immagine in", ASSETS);
  process.exit(1);
}

const map = MAP_BY_DATE[date];
mkdirSync(destDir, { recursive: true });

if (map) {
  for (const src of files) {
    const destName = map[src];
    if (!destName) {
      console.warn("SKIP (nome non mappato):", src);
      continue;
    }
    const from = join(ASSETS, src);
    const to = join(destDir, destName);
    copyFileSync(from, to);
    console.log("OK", src, "->", to);
  }
} else {
  files.sort().forEach((src, i) => {
    const name = FALLBACK_ORDER[i] || src;
    const from = join(ASSETS, src);
    const to = join(destDir, name);
    copyFileSync(from, to);
    console.log("OK", src, "->", to);
  });
}
