/**
 * Copia foto da /opt/cursor/artifacts/assets/ a img/diario/YYYY-MM-DD/.
 * Uso dopo upload da mobile (Artifacts, NON chat): node tools/copia-foto-artifacts.mjs YYYY-MM-DD
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
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
    "gino-selfie-palestra-demolition-originale.jpg": "gino-selfie-palestra-demolition-originale.jpg",
    "gino-teken-il-guerriero-originale.jpg": "gino-teken-il-guerriero-originale.jpg",
    "gino-demolition-men-disfatto.jpg": "gino-selfie-palestra-demolition-originale.jpg",
    "gino-teken-il-guerriero-cartovita.jpg": "gino-teken-il-guerriero-originale.jpg",
    "selfie-palestra.jpg": "gino-selfie-palestra-demolition-originale.jpg",
    "teken-guerriero.jpg": "gino-teken-il-guerriero-originale.jpg",
  },
};

const DEMOLITION_DEST = {
  selfie: "gino-selfie-palestra-demolition-originale.jpg",
  teken: "gino-teken-il-guerriero-originale.jpg",
};

function isLikelyAiGenerated(path) {
  try {
    const out = execFileSync("file", ["-b", path], { encoding: "utf8" }).trim();
    const is1536x1024 = /\b1536 x 1024\b/.test(out);
    const isPng = out.startsWith("PNG image");
    if (is1536x1024 && isPng) {
      return true;
    }
    const buf = readFileSync(path);
    const head = buf.subarray(0, 8);
    if (head.length >= 8 && head[0] === 0x89 && head[1] === 0x50 && is1536x1024) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

function guessDestName(src, dateKey) {
  const map = MAP_BY_DATE[dateKey];
  if (map?.[src]) return map[src];

  const lower = src.toLowerCase();
  if (/teken|guerriero|cartovit|cartoon|ken/.test(lower)) {
    return DEMOLITION_DEST.teken;
  }
  if (/selfie|palestra|demolition|disfatto|new-york/.test(lower)) {
    return DEMOLITION_DEST.selfie;
  }
  return null;
}

if (!existsSync(ASSETS)) {
  console.error("Cartella assets non trovata:", ASSETS);
  process.exit(1);
}

const files = readdirSync(ASSETS).filter((f) => /\.(jpe?g|png|webp|heic)$/i.test(f));
if (!files.length) {
  console.error("Nessuna immagine in", ASSETS);
  console.error("Carica le foto in Cursor → Artifacts → assets/ (non solo nella chat).");
  process.exit(1);
}

mkdirSync(destDir, { recursive: true });

for (const src of files) {
  const from = join(ASSETS, src);
  const destName = guessDestName(src, date);

  if (!destName) {
    console.warn("SKIP (nome non mappato):", src);
    continue;
  }

  if (isLikelyAiGenerated(from)) {
    console.error("ERRORE: file probabilmente generato dall'AI (PNG 1536×1024):", src);
    console.error("Ricarica la foto originale dal telefono, non una versione generata.");
    process.exit(1);
  }

  const to = join(destDir, destName);
  copyFileSync(from, to);
  console.log("OK", src, "->", to);
}
