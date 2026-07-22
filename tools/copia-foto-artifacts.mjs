/**
 * Copia foto da /opt/cursor/artifacts/assets/ a img/diario/YYYY-MM-DD/.
 * Uso dopo upload da mobile: node tools/copia-foto-artifacts.mjs 2026-07-22
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

const expected = [
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

mkdirSync(destDir, { recursive: true });
files.sort().forEach((src, i) => {
  const name = expected[i] || src;
  const from = join(ASSETS, src);
  const to = join(destDir, name);
  copyFileSync(from, to);
  console.log("OK", src, "->", to);
});
