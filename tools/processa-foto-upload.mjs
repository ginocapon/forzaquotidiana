/**
 * Processa foto upload GitHub (WhatsApp) → WebP SEO in img/allenamenti/amazfit/
 *
 * Uso:
 *   node tools/processa-foto-upload.mjs
 *   node tools/processa-foto-upload.mjs "allenamenti/foto allenamento 17 agosto"
 *
 * Cerca JPEG/PNG in: argomento, cartelle allenamenti/foto* e allenamenti/allenamento*,
 * e WhatsApp Image a root del repo. Identificare visivamente; mapping esplicito sotto.
 */
import { readdirSync, statSync, mkdirSync, unlinkSync, rmSync, existsSync } from "node:fs";
import { dirname, join, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = dirname(__dirname);
const DEST_DIR = join(REPO, "img/allenamenti/amazfit");
const RASTER = new Set([".jpg", ".jpeg", ".png"]);
const UPLOAD_ARG = process.argv[2];

/** Mapping esplicito per batch — estendere ad ogni nuova sessione dopo identificazione visiva */
const KNOWN_BATCHES = {
  "foto allenamento 17 agosto": {
    date: "2026-08-17",
    scheda: 1,
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
  "allenamento  18 agosto 2026": {
    date: "2026-08-18",
    scheda: 2,
    files: {
      "WhatsApp Image 2026-08-19 at 11.07.54(1).jpeg": "riepilogo",
      "WhatsApp Image 2026-08-19 at 11.07.54(2).jpeg": "fc-grafico",
      "WhatsApp Image 2026-08-19 at 11.07.54(3).jpeg": "zone-effetto",
      "WhatsApp Image 2026-08-19 at 11.07.54(4).jpeg": "tecnica",
      "WhatsApp Image 2026-08-19 at 11.07.54(5).jpeg": "valutazione",
      "WhatsApp Image 2026-08-19 at 11.08.56.jpeg": "tsb",
      "WhatsApp Image 2026-08-19 at 11.18.51.jpeg": "hybridcharge",
      "WhatsApp Image 2026-08-19 at 11.18.51(1).jpeg": "sonno-score",
    },
    /** TSB 17/08 duplicato — non appartiene alla S2 del 18 */
    skip: ["WhatsApp Image 2026-08-19 at 11.07.54.jpeg"],
  },
};

/** WhatsApp lasciati a root del repo (upload GitHub senza cartella) */
const ROOT_FILES = {
  "WhatsApp Image 2026-08-17 at 23.01.32.jpeg": { date: "2026-08-17", scheda: 1, slug: "riepilogo" },
  "WhatsApp Image 2026-08-17 at 23.16.20.jpeg": { date: "2026-08-17", scheda: 1, slug: "tsb" },
  "WhatsApp Image 2026-08-17 at 23.16.20(1).jpeg": { date: "2026-08-17", scheda: 1, slug: "valutazione" },
  "WhatsApp Image 2026-08-17 at 23.16.21.jpeg": { date: "2026-08-17", scheda: 1, slug: "fc-grafico" },
  "WhatsApp Image 2026-08-17 at 23.16.21(1).jpeg": { date: "2026-08-17", scheda: 1, slug: "zone-effetto" },
  "WhatsApp Image 2026-08-17 at 23.16.21(2).jpeg": { date: "2026-08-17", scheda: 1, slug: "tecnica" },
};

function destName(date, scheda, slug) {
  return `${date}-scheda-${scheda}-${slug}.webp`;
}

async function processImage(src, slug) {
  let pipeline = sharp(src).rotate();
  if (slug === "tsb") {
    const meta = await sharp(src).rotate().metadata();
    if ((meta.height || 0) > (meta.width || 0)) {
      pipeline = pipeline.rotate(-90);
    }
  }
  return pipeline.webp({ quality: 82, effort: 4 });
}

function rasterFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => RASTER.has(extname(f).toLowerCase()));
}

function buildSlugMap(files, dirName) {
  const batch = KNOWN_BATCHES[dirName];
  if (!batch) return {};
  const map = {};
  if (batch.files) {
    for (const [whatsapp, slug] of Object.entries(batch.files)) {
      map[whatsapp] = { dest: destName(batch.date, batch.scheda, slug), slug };
    }
    return map;
  }
  const skip = new Set(batch.skip || []);
  const sorted = files.filter((f) => !skip.has(f)).sort();
  const slugs = batch.slugs || [];
  for (let i = 0; i < sorted.length && i < slugs.length; i++) {
    map[sorted[i]] = { dest: destName(batch.date, batch.scheda, slugs[i]), slug: slugs[i] };
  }
  return map;
}

function findUploadDirs() {
  if (UPLOAD_ARG) return [join(REPO, UPLOAD_ARG)];
  const allenamenti = join(REPO, "allenamenti");
  const dirs = [];
  for (const name of readdirSync(allenamenti)) {
    if (/foto allenamento|allenamento\s+\d/i.test(name)) {
      dirs.push(join(allenamenti, name));
    }
  }
  return dirs;
}

async function convertOne(src, destFile, slug) {
  mkdirSync(DEST_DIR, { recursive: true });
  const dest = join(DEST_DIR, destFile);
  const before = statSync(src).size;
  await (await processImage(src, slug)).toFile(dest);
  const after = statSync(dest).size;
  console.log(`OK ${destFile} (${before} → ${after} bytes)`);
  unlinkSync(src);
}

async function processDir(uploadDir) {
  const dirName = basename(uploadDir);
  const files = rasterFiles(uploadDir);
  if (!files.length) {
    console.log("Nessun raster in", uploadDir);
    return;
  }
  const batch = KNOWN_BATCHES[dirName];
  const skip = new Set(batch?.skip || []);
  const slugMap = buildSlugMap(files, dirName);
  console.log(`\nCartella «${dirName}» — ${files.length} file`);
  for (const file of files) {
    const src = join(uploadDir, file);
    if (skip.has(file)) {
      console.log("SKIP (duplicato altra sessione):", file);
      unlinkSync(src);
      continue;
    }
    const entry = slugMap[file];
    if (!entry) {
      console.warn("SKIP (no slug, identifica visivamente):", file);
      continue;
    }
    await convertOne(src, entry.dest, entry.slug);
  }
  const leftover = rasterFiles(uploadDir);
  const others = existsSync(uploadDir)
    ? readdirSync(uploadDir).filter((f) => f !== "README.md" && !f.startsWith("."))
    : [];
  if (!leftover.length && others.length === 0) {
    try {
      rmSync(uploadDir, { recursive: true });
      console.log("Rimossa cartella upload:", uploadDir);
    } catch {
      /* keep */
    }
  } else {
    console.log("Cartella non vuota — verifica mapping:", others.join(", ") || leftover.join(", "));
  }
}

async function processRootWhatsApp() {
  const files = rasterFiles(REPO).filter((f) => /^WhatsApp Image /i.test(f));
  if (!files.length) return;
  console.log(`\nRoot repo — ${files.length} WhatsApp JPEG`);
  for (const file of files) {
    const mapped = ROOT_FILES[file];
    if (!mapped) {
      console.warn("SKIP root (no slug):", file);
      continue;
    }
    await convertOne(join(REPO, file), destName(mapped.date, mapped.scheda, mapped.slug), mapped.slug);
  }
}

async function main() {
  if (UPLOAD_ARG) {
    await processDir(join(REPO, UPLOAD_ARG));
    return;
  }
  await processRootWhatsApp();
  for (const dir of findUploadDirs()) {
    await processDir(dir);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
