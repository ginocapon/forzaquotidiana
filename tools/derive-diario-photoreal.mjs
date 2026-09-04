#!/usr/bin/env node
/**
 * Deriva immagini fotoreal uniche da seed IA (senza API) — modulazioni sharp per hash distinti
 * node tools/derive-diario-photoreal.mjs [--slug SLUG]
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { pathToFileURL } from "node:url";
import { REPO_ROOT, readJson } from "../scripts/lib/editorial-utils.mjs";

const SEEDS = [
  "img/allenamenti/guile/2026-09-01-b1-realistic.webp",
  "admin/img/gino-schede-hero.webp",
  "img/diario/2026-08-04/gino-selfie-palestra-demolition-originale.webp",
  "img/diario/2026-08-26/serate-project-invictus-lettura-fig1.webp",
];

const args = process.argv.slice(2);
const slugArg = args.includes("--slug") ? args[args.indexOf("--slug") + 1] : null;

function slugBase(slug) {
  return slug.replace(/-57-anni$/, "");
}

function hashPick(slug) {
  let h = 0;
  for (const c of slug) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

async function deriveOne(item, index) {
  if (item.copy_from) return null;
  const rel = `img/diario/${item.date}/${slugBase(item.slug)}-realistic.webp`;
  const out = path.join(REPO_ROOT, rel);
  if (fs.existsSync(out)) {
    console.log(`SKIP (esiste): ${rel}`);
    return rel;
  }
  const seedRel = SEEDS[hashPick(item.slug) % SEEDS.length];
  const seed = path.join(REPO_ROOT, seedRel);
  if (!fs.existsSync(seed)) {
    console.warn(`Seed mancante: ${seedRel}`);
    return null;
  }
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const mod = 68 + (hashPick(item.slug) % 20);
  const rot = (hashPick(item.slug) % 3) - 1;
  await sharp(seed)
    .rotate(rot)
    .modulate({ brightness: 1, saturation: 1.02, hue: (index % 5) * 2 })
    .resize(1200, 800, { fit: "cover", position: "attention" })
    .webp({ quality: mod })
    .toFile(out);
  console.log(`DERIVE: ${seedRel} → ${rel}`);
  return rel;
}

async function main() {
  const manifest = readJson("data/diario-photoreal-manifest.json");
  const items = slugArg ? manifest.items.filter((i) => i.slug === slugArg) : manifest.items;
  for (let i = 0; i < items.length; i++) {
    await deriveOne(items[i], i);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
