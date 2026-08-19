/**
 * Screenshot Zepp da chat mobile → WebP in img/allenamenti/amazfit/
 * Dopo upload in Cursor (finiscono in /opt/cursor/artifacts/assets/):
 *   node tools/copia-screenshot-zepp-artifacts.mjs 2026-08-17 1
 */
import { existsSync, mkdirSync, readdirSync, statSync, unlinkSync } from "node:fs";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = dirname(__dirname);
const ASSETS = "/opt/cursor/artifacts/assets";
const RASTER = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const date = process.argv[2];
const scheda = process.argv[3] || "1";
if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
  console.error("Uso: node tools/copia-screenshot-zepp-artifacts.mjs YYYY-MM-DD [scheda]");
  process.exit(1);
}

/** Ordine export tipico da chat Zepp (6 file) */
const SLUGS_BY_COUNT = {
  6: ["riepilogo", "tsb", "valutazione", "tecnica", "zone-effetto", "fc-grafico"],
  5: ["riepilogo", "fc-grafico", "zone-effetto", "tecnica", "valutazione"],
  4: ["riepilogo", "fc-grafico", "zone-effetto", "tecnica"],
};

const ROTATE_OVERRIDES = { tsb: -90 };

function processImage(src, slug) {
  let pipeline = sharp(src).rotate();
  const extra = ROTATE_OVERRIDES[slug];
  if (extra) pipeline = pipeline.rotate(extra);
  return pipeline.webp({ quality: 82, effort: 4 });
}

if (!existsSync(ASSETS)) {
  console.error("Cartella assets non trovata:", ASSETS);
  console.error("Carica le foto nella chat Cursor (mobile) o in GitHub: allenamenti/foto allenamento …");
  process.exit(1);
}

const files = readdirSync(ASSETS).filter((f) => RASTER.has(extname(f).toLowerCase()));
if (!files.length) {
  console.error("Nessuna immagine in", ASSETS);
  process.exit(1);
}

const slugs = SLUGS_BY_COUNT[files.length] || SLUGS_BY_COUNT[6];
const destDir = join(REPO, "img/allenamenti/amazfit");
mkdirSync(destDir, { recursive: true });

const sorted = [...files].sort();
console.log(`Processing ${sorted.length} file da assets → ${date} scheda ${scheda}`);

async function main() {
  for (let i = 0; i < sorted.length && i < slugs.length; i++) {
    const slug = slugs[i];
    const src = join(ASSETS, sorted[i]);
    const destName = `${date}-scheda-${scheda}-${slug}.webp`;
    const dest = join(destDir, destName);
    const before = statSync(src).size;
    await processImage(src, slug).toFile(dest);
    const after = statSync(dest).size;
    console.log(`OK ${destName} (${before} → ${after} bytes) da ${sorted[i]}`);
    unlinkSync(src);
  }
  console.log("Fatto.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
