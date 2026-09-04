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
  "foto allenamento 20 agosto": {
    date: "2026-08-20",
    scheda: 1,
    slugs: ["tsb", "hrv", "riepilogo", "fc-grafico", "hybridcharge-giorno", "readiness-metriche", "sonno-score", "valutazione", "tecnica", "zone-effetto"],
  },
  "foto allenamento 21 agosto": {
    date: "2026-08-21",
    scheda: 2,
    files: {
      "WhatsApp Image 2026-08-25 at 10.39.38 (1).jpeg": "riepilogo",
      "WhatsApp Image 2026-08-25 at 10.38.47 (5).jpeg": "fc-grafico",
      "WhatsApp Image 2026-08-25 at 10.38.47 (6).jpeg": "tsb",
      "WhatsApp Image 2026-08-25 at 10.38.47 (4).jpeg": "zone-effetto",
      "WhatsApp Image 2026-08-25 at 10.38.47 (3).jpeg": "tecnica",
      "WhatsApp Image 2026-08-25 at 10.38.47 (2).jpeg": "valutazione",
      "WhatsApp Image 2026-08-25 at 10.38.47 (1).jpeg": "hrv",
      "WhatsApp Image 2026-08-25 at 10.38.47.jpeg": "sonno-metriche",
    },
  },
  "foto allenamento 24 agosto": {
    date: "2026-08-24",
    scheda: 1,
    files: {
      "WhatsApp Image 2026-08-25 at 11.10.29.jpeg": "tsb",
      "WhatsApp Image 2026-08-25 at 11.10.30.jpeg": "sonno-metriche",
      "WhatsApp Image 2026-08-25 at 11.10.30 (1).jpeg": "readiness-metriche",
      "WhatsApp Image 2026-08-25 at 11.10.30 (2).jpeg": "valutazione",
      "WhatsApp Image 2026-08-25 at 11.10.30 (3).jpeg": "tecnica",
      "WhatsApp Image 2026-08-25 at 11.10.30 (4).jpeg": "zone-effetto",
      "WhatsApp Image 2026-08-25 at 11.10.30 (5).jpeg": "fc-grafico",
    },
  },
  "allenamento 1-09-2026": {
    date: "2026-09-01",
    codice: "b1",
    scheda: 2,
    skip: ["WhatsApp Image 2026-09-02 at 10.43.12 (6).jpeg"],
    files: {
      "WhatsApp Image 2026-09-02 at 10.39.42.jpeg": "riepilogo",
      "WhatsApp Image 2026-09-02 at 10.43.12.jpeg": "tsb",
      "WhatsApp Image 2026-09-02 at 10.43.12 (1).jpeg": "sonno-metriche",
      "WhatsApp Image 2026-09-02 at 10.43.12 (2).jpeg": "hrv",
      "WhatsApp Image 2026-09-02 at 10.43.12 (3).jpeg": "hybridcharge",
      "WhatsApp Image 2026-09-02 at 10.43.12 (4).jpeg": "readiness-panoramica",
      "WhatsApp Image 2026-09-02 at 10.43.12 (5).jpeg": "readiness-dettaglio",
      "WhatsApp Image 2026-09-02 at 10.43.12 (7).jpeg": "readiness-metriche",
      "WhatsApp Image 2026-09-02 at 10.43.13.jpeg": "valutazione",
      "WhatsApp Image 2026-09-02 at 10.43.13 (1).jpeg": "tecnica",
      "WhatsApp Image 2026-09-02 at 10.43.13 (2).jpeg": "zone-effetto",
      "WhatsApp Image 2026-09-02 at 10.43.13 (3).jpeg": "fc-grafico",
    },
  },
  "scheda 04-09-2026  a2": {
    date: "2026-09-04",
    codice: "a2",
    scheda: 1,
    skip: [
      "WhatsApp Image 2026-09-04 at 14.07.36 (3).jpeg",
      "WhatsApp Image 2026-09-04 at 14.07.36 (6).jpeg",
      "WhatsApp Image 2026-09-04 at 14.07.36 (9).jpeg",
    ],
    files: {
      "WhatsApp Image 2026-09-04 at 14.03.30.jpeg": "riepilogo",
      "WhatsApp Image 2026-09-04 at 14.07.36.jpeg": "tsb",
      "WhatsApp Image 2026-09-04 at 14.07.36 (1).jpeg": "sonno-metriche",
      "WhatsApp Image 2026-09-04 at 14.07.36 (2).jpeg": "sonno-score",
      "WhatsApp Image 2026-09-04 at 14.07.36 (4).jpeg": "hrv",
      "WhatsApp Image 2026-09-04 at 14.07.36 (5).jpeg": "hybridcharge",
      "WhatsApp Image 2026-09-04 at 14.07.36 (7).jpeg": "readiness-panoramica",
      "WhatsApp Image 2026-09-04 at 14.07.36 (8).jpeg": "readiness-metriche",
      "WhatsApp Image 2026-09-04 at 14.07.36 (10).jpeg": "valutazione",
      "WhatsApp Image 2026-09-04 at 14.07.36 (11).jpeg": "fc-grafico",
      "WhatsApp Image 2026-09-04 at 14.07.36 (12).jpeg": "zone-effetto",
    },
  },
  "allenamento 31 agosto": {
    date: "2026-08-31",
    codice: "a1",
    scheda: 1,
    files: {
      "WhatsApp Image 2026-09-01 at 16.29.13.jpeg": "riepilogo",
      "WhatsApp Image 2026-09-01 at 16.29.29.jpeg": "tecnica",
      "WhatsApp Image 2026-09-01 at 16.29.29 (1).jpeg": "zone-effetto",
      "WhatsApp Image 2026-09-01 at 16.29.29 (2).jpeg": "fc-grafico",
      "WhatsApp Image 2026-09-01 at 16.29.29 (3).jpeg": "tsb",
      "WhatsApp Image 2026-09-01 at 16.29.30.jpeg": "sonno-metriche",
      "WhatsApp Image 2026-09-01 at 16.29.30 (1).jpeg": "hrv",
      "WhatsApp Image 2026-09-01 at 16.29.30 (2).jpeg": "hybridcharge",
      "WhatsApp Image 2026-09-01 at 16.29.30 (3).jpeg": "readiness-panoramica",
      "WhatsApp Image 2026-09-01 at 16.29.30 (4).jpeg": "readiness-dettaglio",
      "WhatsApp Image 2026-09-01 at 16.29.30 (5).jpeg": "readiness-metriche",
    },
  },
  "2026-08-28-scheda-3": {
    date: "2026-08-28",
    scheda: 3,
    files: {
      "WhatsApp Image 2026-08-28 at 16.44.34.jpeg": "tsb",
      "WhatsApp Image 2026-08-28 at 16.44.34(1).jpeg": "respirazione-sonno",
      "WhatsApp Image 2026-08-28 at 16.44.34(2).jpeg": "fc-sonno",
      "WhatsApp Image 2026-08-28 at 16.44.34(3).jpeg": "sonno-metriche",
      "WhatsApp Image 2026-08-28 at 16.44.34(4).jpeg": "hrv",
      "WhatsApp Image 2026-08-28 at 16.44.35.jpeg": "readiness-panoramica",
      "WhatsApp Image 2026-08-28 at 16.44.35(1).jpeg": "readiness-dettaglio",
      "WhatsApp Image 2026-08-28 at 16.44.35(2).jpeg": "readiness-metriche",
      "WhatsApp Image 2026-08-28 at 16.44.35(3).jpeg": "hybridcharge",
      "WhatsApp Image 2026-08-28 at 16.44.35(4).jpeg": "tecnica",
      "WhatsApp Image 2026-08-28 at 16.44.35(5).jpeg": "zone-effetto",
      "WhatsApp Image 2026-08-28 at 16.44.35(6).jpeg": "fc-grafico",
    },
  },
  "foto allenamento 25 agosto": {
    date: "2026-08-25",
    scheda: 2,
    files: {
      "WhatsApp Image 2026-08-26 at 16.46.06 (1).jpeg": "tsb",
      "WhatsApp Image 2026-08-26 at 16.46.07 (2).jpeg": "readiness-metriche",
      "WhatsApp Image 2026-08-26 at 16.46.07 (3).jpeg": "readiness-panoramica",
      "WhatsApp Image 2026-08-26 at 16.46.07.jpeg": "hrv",
      "WhatsApp Image 2026-08-26 at 16.46.07 (6).jpeg": "fc-grafico",
      "WhatsApp Image 2026-08-26 at 16.46.07 (5).jpeg": "tecnica",
      "WhatsApp Image 2026-08-26 at 16.46.07 (4).jpeg": "valutazione",
    },
  },
  "allenamento  18 agosto 2026": {
    date: "2026-08-18",
    scheda: 2,
    files: {
      "WhatsApp Image 2026-08-19 at 11.07.54.jpeg": { date: "2026-08-17", scheda: 1, slug: "tsb" },
      "WhatsApp Image 2026-08-19 at 11.07.54(1).jpeg": "riepilogo",
      "WhatsApp Image 2026-08-19 at 11.07.54(2).jpeg": "fc-grafico",
      "WhatsApp Image 2026-08-19 at 11.07.54(3).jpeg": "zone-effetto",
      "WhatsApp Image 2026-08-19 at 11.07.54(4).jpeg": "tecnica",
      "WhatsApp Image 2026-08-19 at 11.07.54(5).jpeg": "valutazione",
      "WhatsApp Image 2026-08-19 at 11.08.56.jpeg": "tsb",
      "WhatsApp Image 2026-08-19 at 11.18.51.jpeg": "hybridcharge",
      "WhatsApp Image 2026-08-19 at 11.18.51(1).jpeg": "sonno-score",
    },
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

function destName(date, scheda, slug, codice) {
  if (codice) return `${date}-${String(codice).toLowerCase()}-${slug}.webp`;
  return `${date}-scheda-${scheda}-${slug}.webp`;
}

async function processImage(src, slug) {
  let pipeline = sharp(src).rotate();
  const meta = await sharp(src).rotate().metadata();
  const w = meta.width || 0;
  const h = meta.height || 0;
  if (slug === "tsb") {
    if (h > w) pipeline = pipeline.rotate(-90);
  }
  if (slug === "riepilogo" && w > h) {
    pipeline = pipeline.rotate(90);
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
    for (const [whatsapp, slugOrMeta] of Object.entries(batch.files)) {
      if (typeof slugOrMeta === "string") {
        map[whatsapp] = {
          dest: destName(batch.date, batch.scheda, slugOrMeta, batch.codice),
          slug: slugOrMeta,
        };
      } else {
        map[whatsapp] = {
          dest: destName(slugOrMeta.date, slugOrMeta.scheda, slugOrMeta.slug, slugOrMeta.codice ?? batch.codice),
          slug: slugOrMeta.slug,
        };
      }
    }
    return map;
  }
  const skip = new Set(batch.skip || []);
  const sorted = files.filter((f) => !skip.has(f)).sort();
  const slugs = batch.slugs || [];
  for (let i = 0; i < sorted.length && i < slugs.length; i++) {
    map[sorted[i]] = {
      dest: destName(batch.date, batch.scheda, slugs[i], batch.codice),
      slug: slugs[i],
    };
  }
  return map;
}

function findSessionUploadDirs() {
  const base = join(REPO, "allenamenti/sessioni");
  if (!existsSync(base)) return [];
  return readdirSync(base, { withFileTypes: true })
    .filter((d) => d.isDirectory() && rasterFiles(join(base, d.name)).length > 0)
    .map((d) => join(base, d.name));
}

function findUploadDirs() {
  if (UPLOAD_ARG) return [join(REPO, UPLOAD_ARG)];
  const dirs = [...findSessionUploadDirs()];
  for (const parent of [join(REPO, "allenamenti"), join(REPO, "img/allenamenti")]) {
    if (!existsSync(parent)) continue;
    for (const name of readdirSync(parent)) {
      if (/foto allenamento|allenamento\s+\d/i.test(name)) {
        dirs.push(join(parent, name));
      }
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

function lookupMapped(file) {
  if (ROOT_FILES[file]) return ROOT_FILES[file];
  for (const batch of Object.values(KNOWN_BATCHES)) {
    const hit = batch.files?.[file];
    if (!hit) continue;
    if (typeof hit === "string") return { date: batch.date, scheda: batch.scheda, slug: hit, codice: batch.codice };
    return { ...hit, codice: hit.codice ?? batch.codice };
  }
  return null;
}

async function processLooseWhatsApp(dir, label) {
  const files = rasterFiles(dir).filter((f) => /^WhatsApp Image /i.test(f));
  if (!files.length) return;
  console.log(`\n${label} — ${files.length} WhatsApp JPEG`);
  for (const file of files) {
    const mapped = lookupMapped(file);
    if (!mapped) {
      console.warn("SKIP (no slug, identifica visivamente):", join(dir, file));
      continue;
    }
    await convertOne(join(dir, file), destName(mapped.date, mapped.scheda, mapped.slug, mapped.codice), mapped.slug);
  }
}

async function main() {
  if (UPLOAD_ARG) {
    await processDir(join(REPO, UPLOAD_ARG));
    return;
  }
  await processLooseWhatsApp(REPO, "Root repo");
  await processLooseWhatsApp(join(REPO, "img/allenamenti"), "img/allenamenti");
  for (const dir of findUploadDirs()) {
    await processDir(dir);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
