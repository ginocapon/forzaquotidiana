#!/usr/bin/env node
/**
 * Rigenera data/editorial-memory.json da diario/index.html + editorial-queue.json
 *
 *   node tools/build-editorial-memory.mjs
 *   node tools/build-editorial-memory.mjs --check eq-XXX   # verifica proposta vs saturazione
 */
import fs from "node:fs";
import path from "node:path";
import { readJson, writeJson, REPO_ROOT } from "../scripts/lib/editorial-utils.mjs";

const WINDOW = 8;
const CLUSTER_CAP = 2; // stesso cluster negli ultimi WINDOW → serve update_reason o altro angolo

function parseDiarioIndex() {
  const indexPath = path.join(REPO_ROOT, "diario/index.html");
  if (!fs.existsSync(indexPath)) return [];
  const html = fs.readFileSync(indexPath, "utf8");
  const blocks = [...html.matchAll(
    /<a class="diario-list__link" href="\/diario\/([^"\/]+)\/">[\s\S]*?<time datetime="(\d{4}-\d{2}-\d{2})">[\s\S]*?· ([^<]+)<\/div>/g
  )];
  return blocks.map((m) => ({
    slug: m[1],
    published_date: m[2],
    tone_label: m[3].trim(),
  }));
}

function toneFromLabel(label) {
  const l = label.toLowerCase();
  if (l.includes("tecnico")) return "tecnico";
  if (l.includes("goliardia")) return "goliardico";
  return "riflessione";
}

function inferCluster(slug, tone, queueItem) {
  if (tone === "riflessione") return "riflessione-vita";
  if (queueItem?.cluster) return queueItem.cluster;
  if (slug.includes("creatina") || slug.includes("proteine") || slug.includes("shake")) {
    return "goliardia-nutrizione";
  }
  if (slug.includes("leg-day") || slug.includes("gambe") || slug.includes("rest-day")) {
    return "goliardia-allenamento";
  }
  if (tone === "tecnico") return "tecnico-natural";
  if (tone === "goliardico") return "goliardia-culturismo";
  return "riflessione-vita";
}

function buildRisks(recent, clusterCounts, toneCounts) {
  const risks = [];
  for (const [cluster, count] of Object.entries(clusterCounts)) {
    if (count >= CLUSTER_CAP) {
      risks.push(
        `Cluster \`${cluster}\` già ${count}/${WINDOW} negli ultimi publish — variare angolo o fare refresh articolo esistente`
      );
    }
  }
  if (toneCounts.goliardico >= 5) {
    risks.push(
      `Troppa goliardia negli ultimi ${WINDOW} (${toneCounts.goliardico}) — priorità 2 tecnici + 1 goliardico al prossimo venerdì`
    );
  }
  if (toneCounts.tecnico === 0) {
    risks.push("Nessun articolo tecnico negli ultimi 8 — programmare almeno 2 tecnici al venerdì");
  }
  const nutSlugs = recent.filter((r) => r.cluster === "goliardia-nutrizione").map((r) => r.slug);
  if (nutSlugs.length >= 2) {
    risks.push(
      `Nutrizione goliardica satura (${nutSlugs.join(", ")}) — non aggiungere altro meme integratori`
    );
  }
  const cultSlugs = recent.filter((r) => r.cluster === "goliardia-culturismo").map((r) => r.slug);
  if (cultSlugs.length >= 3) {
    risks.push(
      `Trend Reddit/culturismo saturo — preferire tecnico natural o riflessione vita`
    );
  }
  return [...new Set(risks)];
}

function mergeArticles(indexRows, queue) {
  const bySlug = new Map();
  for (const item of queue?.items ?? []) {
    if (item.status === "published" && item.slug) {
      bySlug.set(item.slug, item);
    }
  }
  return indexRows.map((row) => {
    const q = bySlug.get(row.slug);
    const tone = toneFromLabel(row.tone_label);
    return {
      slug: row.slug,
      published_date: q?.published_date ?? row.published_date,
      tone,
      tone_label: row.tone_label,
      cluster: inferCluster(row.slug, tone, q),
      kw_primary: q?.kw_primary ?? null,
      intent: q?.intent ?? null,
      fiction: q?.fiction ?? tone === "goliardico",
      source: q ? "queue+index" : "index",
    };
  });
}

function buildMemory() {
  const queue = readJson("data/editorial-queue.json");
  const indexRows = parseDiarioIndex();
  const merged = mergeArticles(indexRows, queue);
  merged.sort((a, b) => b.published_date.localeCompare(a.published_date));
  const recent = merged.slice(0, WINDOW);

  const clusterCounts = {};
  const toneCounts = { tecnico: 0, goliardico: 0, riflessione: 0 };
  for (const r of recent) {
    clusterCounts[r.cluster] = (clusterCounts[r.cluster] ?? 0) + 1;
    toneCounts[r.tone] = (toneCounts[r.tone] ?? 0) + 1;
  }

  const stats = readJson("data/site-stats.json");
  const sessions = readJson("data/performance-sessions.json");

  return {
    version: 1,
    generated: new Date().toISOString().slice(0, 10),
    window_size: WINDOW,
    cluster_cap: CLUSTER_CAP,
    mix_rule: { tecnico: 2, goliardico: 1, per_week: 3 },
    site_snapshot: {
      diario_catalog_count: merged.length,
      sessions_documented: sessions?.sessions?.length ?? null,
      site_stats_updated: stats?.updated ?? null,
    },
    tone_balance_last_window: toneCounts,
    cluster_saturation: clusterCounts,
    recent,
    risks: buildRisks(recent, clusterCounts, toneCounts),
  };
}

function checkProposal(id) {
  const queue = readJson("data/editorial-queue.json");
  const item = queue?.items?.find((i) => i.id === id);
  if (!item) {
    console.error(`FAIL: id ${id} non trovato in editorial-queue.json`);
    process.exit(1);
  }
  const memory = readJson("data/editorial-memory.json") ?? buildMemory();
  const cluster = item.cluster ?? inferCluster(item.slug, item.tone, item);
  const count = memory.cluster_saturation?.[cluster] ?? 0;
  if (count >= CLUSTER_CAP && !item.update_reason) {
    console.error(
      `FAIL: cluster ${cluster} saturo (${count}/${WINDOW}) — aggiungi update_reason o scegli altro angolo`
    );
    process.exit(1);
  }
  console.log(`CONTINUITY OK: ${id} · cluster ${cluster} (${count}/${WINDOW})`);
}

const args = process.argv.slice(2);
if (args.includes("--check")) {
  const id = args[args.indexOf("--check") + 1];
  if (!id) {
    console.error("Uso: node tools/build-editorial-memory.mjs --check <eq-id>");
    process.exit(1);
  }
  checkProposal(id);
  process.exit(0);
}

const memory = buildMemory();
writeJson("data/editorial-memory.json", memory);
console.log(`editorial-memory.json aggiornato (${memory.recent.length} recent, ${memory.risks.length} risks)`);
if (memory.risks.length) {
  for (const r of memory.risks) console.log(`  ⚠ ${r}`);
}
