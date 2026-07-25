/**
 * Copia ritratto professionale da /opt/cursor/artifacts/assets/
 * a img/chi-sono/gino-affari.png (upload da mobile in chat).
 *
 * Uso: node tools/copia-ritratto-affari.mjs
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = dirname(__dirname);
const ASSETS = "/opt/cursor/artifacts/assets";
const destDir = join(REPO, "img", "chi-sono");
const dest = join(destDir, "gino-affari.png");

if (!existsSync(ASSETS)) {
  console.error("Cartella assets non trovata:", ASSETS);
  process.exit(1);
}

const files = readdirSync(ASSETS).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
if (!files.length) {
  console.error("Nessuna immagine in", ASSETS, "— allega la foto in chat da mobile.");
  process.exit(1);
}

const src = join(ASSETS, files.sort()[0]);
mkdirSync(destDir, { recursive: true });
copyFileSync(src, dest);
console.log("OK", src, "->", dest);
