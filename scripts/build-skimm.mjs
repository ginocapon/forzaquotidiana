#!/usr/bin/env node
/**
 * SKIMM catalog check
 * node scripts/build-skimm.mjs --check "slug" "kw-primaria" "cluster"
 */
import { readJson, listCatalogDiarioSlugs, slugTokens, jaccard } from "./lib/editorial-utils.mjs";

const args = process.argv.slice(2);
if (!args.includes("--check")) {
  console.log("Uso: node scripts/build-skimm.mjs --check <slug> <kw> <cluster>");
  process.exit(1);
}

const i = args.indexOf("--check");
const slug = args[i + 1];
const kw = args[i + 2];
const cluster = args[i + 3];

const catalog = readJson("data/skimm-catalog.json");
const threshold = catalog?.blocked_overlap_threshold ?? 0.55;

if (!catalog?.clusters?.[cluster]) {
  console.error(`FAIL: cluster sconosciuto "${cluster}"`);
  process.exit(1);
}

const published = listCatalogDiarioSlugs();
const kwTok = kw.toLowerCase().split(/\s+/);
let fail = false;

for (const ps of published) {
  const sim = jaccard(slugTokens(ps), slugTokens(slug));
  if (sim >= threshold) {
    console.error(`FAIL: overlap slug con ${ps} (${sim.toFixed(2)})`);
    fail = true;
  }
}

if (slug.length < 3 || !slug.endsWith("-57-anni") && !slug.includes("57-anni")) {
  console.warn("WARN: slug dovrebbe includere 57-anni per coerenza SEO diario");
}

if (kwTok.length < 2) {
  console.error("FAIL: kw troppo corta");
  fail = true;
}

if (fail) process.exit(1);
console.log(`SKIMM OK: ${slug} · ${kw} · ${cluster}`);
process.exit(0);
