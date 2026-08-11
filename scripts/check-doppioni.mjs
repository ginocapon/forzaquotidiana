#!/usr/bin/env node
/**
 * Anti-doppioni slug/kw/intent
 * node scripts/check-doppioni.mjs [--slug X] [--kw Y] [--cluster Z]
 */
import {
  readJson,
  listCatalogDiarioSlugs,
  slugTokens,
  jaccard,
} from "./lib/editorial-utils.mjs";

const args = process.argv.slice(2);
const slug = args.includes("--slug") ? args[args.indexOf("--slug") + 1] : null;
const kw = args.includes("--kw") ? args[args.indexOf("--kw") + 1] : null;
const cluster = args.includes("--cluster") ? args[args.indexOf("--cluster") + 1] : null;

const catalog = readJson("data/skimm-catalog.json");
const threshold = catalog?.blocked_overlap_threshold ?? 0.55;
const queue = readJson("data/editorial-queue.json");
const published = listCatalogDiarioSlugs();

const failures = [];

function checkOne(s, k, c) {
  const tokens = slugTokens(s || "");
  const kwTokens = (k || "").toLowerCase().split(/\s+/).filter((t) => t.length > 2);

  for (const ps of published) {
    if (ps === s) failures.push({ type: "slug_exists", against: ps });
    const sim = jaccard(tokens, slugTokens(ps));
    if (sim >= threshold) failures.push({ type: "slug_overlap", against: ps, score: sim });
  }

  for (const item of queue?.items || []) {
    if (item.status === "published" && item.slug === s) continue;
    if (item.slug === s && item.status === "published") {
      failures.push({ type: "queue_slug", against: item.slug, status: item.status });
    }
    if (k && item.kw_primary === k && item.slug !== s) {
      failures.push({ type: "kw_duplicate", against: item.slug, kw: k });
    }
    // Overlap intent solo vs published, non tra proposed della stessa settimana
    if (item.status === "published") {
      const sim = jaccard(kwTokens, slugTokens(item.slug || ""));
      if (sim >= threshold && item.slug !== s) {
        failures.push({ type: "intent_overlap", against: item.slug, score: sim });
      }
    }
  }
}

if (slug || kw) {
  checkOne(slug, kw, cluster);
} else {
  // Audit solo proposed vs catalogo pubblicato
  for (const item of queue?.items || []) {
    if (item.status === "proposed") {
      checkOne(item.slug, item.kw_primary, item.cluster);
    }
  }
}

if (failures.length) {
  console.error("check_doppioni: FAIL");
  failures.forEach((f) => console.error(JSON.stringify(f)));
  process.exit(1);
}

console.log("check_doppioni: OK");
process.exit(0);
