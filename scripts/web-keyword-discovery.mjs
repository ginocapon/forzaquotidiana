#!/usr/bin/env node
/**
 * Keyword discovery — culturismo goliardico
 * node scripts/web-keyword-discovery.mjs [--count 3] [--niche culturismo]
 */
import fs from "node:fs";
import path from "node:path";
import {
  REPO_ROOT,
  listCatalogDiarioSlugs,
  slugTokens,
  jaccard,
  readJson,
  writeJson,
  todayISO,
} from "./lib/editorial-utils.mjs";
import { fetchTrendingTopics } from "./lib/trending-rss.mjs";

const args = process.argv.slice(2);
const count = Number(args.includes("--count") ? args[args.indexOf("--count") + 1] : 3);
const niche = args.includes("--niche") ? args[args.indexOf("--niche") + 1] : "culturismo";

function loadWebSources() {
  const p = path.join(REPO_ROOT, "guardian/config/web-sources.yaml");
  const raw = fs.readFileSync(p, "utf8");
  const gaps = [];
  let inGaps = false;
  for (const line of raw.split("\n")) {
    if (line.startsWith("static_keyword_gaps:")) inGaps = true;
    else if (inGaps && line.match(/^\w/)) inGaps = false;
    if (inGaps) {
      const km = line.match(/^\s+-\s+kw:\s+(.+)/);
      if (km) gaps.push({ kw: km[1].replace(/^["']|["']$/g, ""), cluster: "", intent: "", score: 0.7 });
      const cm = line.match(/^\s+cluster:\s+(.+)/);
      if (cm && gaps.length) gaps[gaps.length - 1].cluster = cm[1].trim();
      const im = line.match(/^\s+intent:\s+(.+)/);
      if (im && gaps.length) gaps[gaps.length - 1].intent = im[1].trim();
      const sm = line.match(/^\s+score:\s+([\d.]+)/);
      if (sm && gaps.length) gaps[gaps.length - 1].score = Number(sm[1]);
    }
  }
  return gaps;
}

function existingKeywords() {
  const slugs = listCatalogDiarioSlugs();
  const tokens = slugs.flatMap(slugTokens);
  const queue = readJson("data/editorial-queue.json");
  const qkw = (queue?.items || []).map((i) => i.kw_primary).filter(Boolean);
  return { slugs, tokens, qkw };
}

function scoreGap(gap, existing) {
  const gapTokens = gap.kw.toLowerCase().split(/\s+/);
  let penalty = 0;
  for (const slug of existing.slugs) {
    if (jaccard(gapTokens, slugTokens(slug)) > 0.5) penalty += 0.4;
  }
  for (const kw of existing.qkw) {
    if (kw && gap.kw.toLowerCase().includes(kw.split(" ")[0])) penalty += 0.2;
  }
  return Math.max(0, gap.score - penalty);
}

function isExcludedTrendTitle(title) {
  return /daily discussion|newbie tuesday|megathread|up for two days/i.test(title);
}

function slugFromKw(kw, suffix = "-57-anni") {
  return kw.replace(/\s+/g, "-").replace(/[^a-z0-9-]/gi, "").slice(0, 44) + suffix;
}

async function main() {
  const gaps = loadWebSources();
  const trending = await fetchTrendingTopics();
  const usableTrends = trending.filter((t) => !isExcludedTrendTitle(t.title));

  for (const t of usableTrends.slice(0, 6)) {
    gaps.push({
      kw: t.kw,
      cluster: "tecnico-bodybuilding",
      intent: `Articolo tecnico in italiano su trend bodybuilding: ${t.title.slice(0, 100)}`,
      score: t.score,
      trending_title: t.title,
      source: t.source,
      tone: "tecnico",
      fiction: false,
    });
    gaps.push({
      kw: `${t.kw} parodia`,
      cluster: "goliardia-culturismo",
      intent: `Parodia goliardica su trend: ${t.title.slice(0, 100)}`,
      score: t.score * 0.92,
      trending_title: t.title,
      source: t.source,
      tone: "goliardico",
      fiction: true,
    });
  }
  const existing = existingKeywords();
  const ranked = gaps
    .map((g) => ({ ...g, discovery_score: scoreGap(g, existing), niche }))
    .sort((a, b) => b.discovery_score - a.discovery_score)
    .slice(0, count);

  const report = {
    generated: new Date().toISOString(),
    niche,
    count: ranked.length,
    proposals: ranked,
    trending_fetched: trending.length,
    existing_slugs: existing.slugs,
    integrations_missing: trending.length ? [] : ["RSS fetch fallito — solo gap statici"],
  };

  const outJson = path.join(REPO_ROOT, "guardian/reports/web-keyword-discovery-latest.json");
  const outMd = path.join(REPO_ROOT, "guardian/reports/web-keyword-discovery-latest.md");
  fs.mkdirSync(path.dirname(outJson), { recursive: true });
  fs.writeFileSync(outJson, JSON.stringify(report, null, 2));
  let md = `# Web keyword discovery — ${todayISO()}\n\n`;
  ranked.forEach((r, i) => {
    md += `${i + 1}. **${r.kw}** (score ${r.discovery_score.toFixed(2)}) — ${r.intent}\n`;
  });
  fs.writeFileSync(outMd, md);

  // Promuovi in editorial-queue se non esiste kw simile
  const queue = readJson("data/editorial-queue.json") || { version: 1, items: [] };
  for (const r of ranked) {
    const dup = queue.items.some(
      (i) => i.kw_primary === r.kw || jaccard(slugTokens(i.slug || ""), r.kw.split(" ")) > 0.5
    );
    if (!dup && queue.items.filter((i) => i.status === "proposed").length < 6) {
      queue.items.push({
        id: `disc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        slug: slugFromKw(r.kw),
        status: "proposed",
        tone: r.tone || (r.cluster?.startsWith("goliardia") ? "goliardico" : "tecnico"),
        fiction: r.fiction ?? r.cluster?.startsWith("goliardia"),
        kw_primary: r.kw,
        cluster: r.cluster,
        intent: r.intent,
        discovery_score: r.discovery_score,
        target_week: todayISO(),
        hero_brief:
          r.tone === "tecnico" || r.cluster?.startsWith("tecnico")
            ? "Illustrazione tecnica performance bodybuilding — periodizzazione, volume, NO fumetto"
            : "Fumetto surreale goliardico — palette scura JoJo-light",
        hero_concept:
          r.tone === "tecnico" || r.cluster?.startsWith("tecnico")
            ? "technical sports science diagram"
            : "comic surreal, NO stock palestra",
        trending_title: r.trending_title || null,
      });
    }
  }
  queue.updated = todayISO();
  writeJson("data/editorial-queue.json", queue);

  console.log(`Discovery: ${ranked.length} proposte → ${outMd}`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
