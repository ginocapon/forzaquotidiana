/**
 * Processa foto upload GitHub (WhatsApp) → WebP con nome SEO in img/allenamenti/amazfit/
 * Uso: node tools/processa-foto-upload.mjs [cartella-upload]
 * Default cartella: allenamenti/foto allenamento *
 */
import { readdirSync, statSync, mkdirSync, unlinkSync, rmSync } from "node:fs";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = dirname(__dirname);

const UPLOAD_ARG = process.argv[2];
const RASTER = new Set([".jpg", ".jpeg", ".png"]);

/** Mapping esplicito per batch upload — estendere ad ogni nuova sessione */
const KNOWN_BATCHES = {
  "foto allenamento 17 agosto": {
    date: "2026-08-17",
    scheda: 1,
    /** Ordine export Zepp tipico da chat (6 file): riepilogo, TSB, valutazione, tecnica, zone, grafico FC */
    slugs: ["riepilogo", "tsb", "valutazione", "tecnica", "zone-effetto", "fc-grafico"],
  },
  "foto allenamento 4 agosto": {
    date: "2026-08-04",
    scheda: 2,
    files: {
      "WhatsApp Image 2026-08-04 at 16.56.03.jpeg": "riepilogo",
      "WhatsApp Image 2026-08-04 at 18.48.41 (3).jpeg": "fc-grafico",
      "WhatsApp Image 2026-08-04 at 18.48.41 (2).jpeg": "zone-effetto",
      "WhatsApp Image 2026-08-04 at 18.48.41 (1).jpeg": "tecnica",
      "WhatsApp Image 2026-08-04 at 18.48.41.jpeg": "valutazione",
      "WhatsApp Image 2026-08-04 at 18.48.41 (8).jpeg": "hybridcharge",
      "WhatsApp Image 2026-08-04 at 18.48.41 (7).jpeg": "readiness-metriche",
      "WhatsApp Image 2026-08-04 at 18.48.41 (6).jpeg": "tsb",
      "WhatsApp Image 2026-08-04 at 18.48.41 (5).jpeg": "sonno-score",
      "WhatsApp Image 2026-08-04 at 18.48.41 (4).jpeg": "sonno-metriche",
    },
  },
};

/** Rotazione extra per file specifici (gradi, senso orario positivo) */
const ROTATE_OVERRIDES = {
  tsb: -90,
};

function processImage(src, slug) {
  let pipeline = sharp(src).rotate();
  const extra = ROTATE_OVERRIDES[slug];
  if (extra) pipeline = pipeline.rotate(extra);
  return pipeline.webp({ quality: 82, effort: 4 });
}

function buildSlugMap(files, date, scheda, dirName) {
  const batch = KNOWN_BATCHES[dirName];
  const useDate = batch?.date || date;
  const useScheda = batch?.scheda || scheda;
  if (batch?.files && Object.keys(batch.files).length) {
    const map = {};
    for (const [whatsapp, slug] of Object.entries(batch.files)) {
      map[whatsapp] = { dest: `${useDate}-scheda-${useScheda}-${slug}.webp`, slug };
    }
    return map;
  }
  const sorted = [...files].sort();
  const slugs = batch?.slugs || [
    "riepilogo", "valutazione", "tecnica", "zone-effetto", "fc-grafico",
    "sonno-metriche", "sonno-score", "tsb", "readiness-metriche", "hybridcharge",
  ];
  const map = {};
  for (let i = 0; i < sorted.length && i < slugs.length; i++) {
    const slug = slugs[i];
    map[sorted[i]] = { dest: `${useDate}-scheda-${useScheda}-${slug}.webp`, slug };
  }
  return map;
}

function findUploadDir() {
  if (UPLOAD_ARG) {
    return join(REPO, UPLOAD_ARG);
  }
  const allenamenti = join(REPO, "allenamenti");
  for (const name of readdirSync(allenamenti)) {
    if (/foto allenamento/i.test(name)) {
      return join(allenamenti, name);
    }
  }
  throw new Error("Nessuna cartella upload trovata. Passa il path: node tools/processa-foto-upload.mjs allenamenti/foto\\ allenamento\\ 4\\ agosto");
}

function parseDateFromDir(dirName) {
  const m = dirName.match(/(\d{1,2})\s*agosto\s*(\d{4})?/i);
  if (m) {
    const year = m[2] || "2026";
    const day = String(m[1]).padStart(2, "0");
    return `${year}-08-${day}`;
  }
  const iso = dirName.match(/(\d{4}-\d{2}-\d{2})/);
  if (iso) return iso[1];
  throw new Error(`Impossibile estrarre data da: ${dirName}`);
}

async function main() {
  const uploadDir = findUploadDir();
  const dirName = uploadDir.split("/").pop();
  const batch = KNOWN_BATCHES[dirName];
  const date = batch?.date || parseDateFromDir(dirName);
  const scheda = batch?.scheda || process.argv[3] || "2";

  const files = readdirSync(uploadDir).filter((f) => RASTER.has(extname(f).toLowerCase()));
  if (!files.length) {
    console.log("Nessun file raster in", uploadDir);
    return;
  }

  const destDir = join(REPO, "img/allenamenti/amazfit");
  mkdirSync(destDir, { recursive: true });

  const slugMap = buildSlugMap(files, date, scheda, dirName);
  console.log(`Processing ${files.length} files → ${destDir} (${date} scheda ${scheda})`);

  for (const file of files) {
    const entry = slugMap[file];
    if (!entry) {
      console.warn("SKIP (no slug):", file);
      continue;
    }
    const { dest: destName, slug } = entry;
    const src = join(uploadDir, file);
    const dest = join(destDir, destName);
    const before = statSync(src).size;
    await processImage(src, slug).toFile(dest);
    const after = statSync(dest).size;
    console.log(`OK ${destName} (${before} → ${after} bytes)`);
    unlinkSync(src);
  }

  try {
    rmSync(uploadDir, { recursive: true });
    console.log("Rimossa cartella upload:", uploadDir);
  } catch {
    console.log("Cartella upload non vuota — verifica mapping manuale");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
