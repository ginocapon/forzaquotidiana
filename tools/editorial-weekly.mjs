#!/usr/bin/env node
/**
 * Pipeline editoriale settimanale — FASE 0→7
 * node tools/editorial-weekly.mjs run [--publish] [--generate]
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import {
  REPO_ROOT,
  readJson,
  writeJson,
  todayISO,
  monthLabelIt,
  monthGroupId,
  monthGroupTitle,
} from "../scripts/lib/editorial-utils.mjs";

const args = process.argv.slice(2);
const cmd = args[0] || "run";
const doPublish = args.includes("--publish");
const doGenerate = args.includes("--generate");

function runScript(rel, scriptArgs = []) {
  const r = spawnSync("node", [path.join(REPO_ROOT, rel), ...scriptArgs], {
    encoding: "utf8",
    cwd: REPO_ROOT,
  });
  return { ok: r.status === 0, stdout: r.stdout || "", stderr: r.stderr || "", status: r.status };
}

function phase0() {
  const ctx = {
    agent: fs.existsSync(path.join(REPO_ROOT, "guardian/AGENT.md")),
    queue: readJson("data/editorial-queue.json"),
    myStats: readJson("data/my-stats.json"),
    guardianReport: fs.existsSync(path.join(REPO_ROOT, "guardian/reports/guardian-latest.md")),
  };
  return ctx;
}

function prioritize(queue, max = 3) {
  const today = todayISO();
  const weekEnd = new Date();
  weekEnd.setDate(weekEnd.getDate() + 7);
  const weekEndStr = weekEnd.toISOString().slice(0, 10);

  const scheduled = (queue.items || [])
    .filter((i) => i.status === "scheduled" && i.target_week <= weekEndStr)
    .sort((a, b) => (a.target_week || "").localeCompare(b.target_week || ""));

  let picked = [...scheduled];
  const proposed = (queue.items || [])
    .filter((i) => i.status === "proposed")
    .sort((a, b) => (b.discovery_score || 0) - (a.discovery_score || 0));

  for (const p of proposed) {
    if (picked.length >= max) break;
    const sameMuscle = picked.some((x) => x.muscle_group && x.muscle_group === p.muscle_group);
    const sameCluster = picked.filter((x) => x.cluster === p.cluster).length >= 2;
    if (sameMuscle || sameCluster) continue;
    picked.push(p);
  }

  return picked.slice(0, max);
}

function addToDiarioIndex(item, publishDate) {
  const indexPath = path.join(REPO_ROOT, "diario/index.html");
  let html = fs.readFileSync(indexPath, "utf8");
  const groupId = monthGroupId(publishDate);
  const groupTitle = monthGroupTitle(publishDate);
  const listItem = `
          <li>
            <a class="diario-list__link" href="/diario/${item.slug}/">
              <div class="diario-list__meta"><time datetime="${publishDate}">${monthLabelIt(publishDate)}</time> · ${item.fiction ? "Goliardia" : "Riflessione"}</div>
              <h3 class="diario-list__title">${item.title_draft || item.h1_draft || item.slug}</h3>
              <p class="diario-list__excerpt">${item.meta_draft?.slice(0, 120) || item.intent || ""}</p>
            </a>
          </li>`;

  const marker = `id="${groupId}"`;
  if (html.includes(marker)) {
    html = html.replace(
      new RegExp(`(<h2[^>]*id="${groupId}"[^>]*>[\\s\\S]*?<ul class="diario-list[^"]*">)`),
      `$1${listItem}`
    );
  } else {
    const insertBefore = `<h2 class="diario-month-group__title" id="agosto-2026">`;
    const newGroup = `        <h2 class="diario-month-group__title" id="${groupId}">${groupTitle}</h2>
        <ul class="diario-list diario-month-group">${listItem}
        </ul>
        `;
    html = html.replace(insertBefore, newGroup + insertBefore);
  }
  fs.writeFileSync(indexPath, html);
}

function addToSitemap(slug, publishDate) {
  const smPath = path.join(REPO_ROOT, "sitemap.xml");
  let xml = fs.readFileSync(smPath, "utf8");
  const loc = `https://forzaquotidiana.it/diario/${slug}/`;
  if (xml.includes(loc)) return;
  const entry = `  <url><loc>${loc}</loc><lastmod>${publishDate}</lastmod></url>\n`;
  xml = xml.replace("</urlset>", entry + "</urlset>");
  fs.writeFileSync(smPath, xml);
}

function publishItem(item) {
  const htmlPath = item.paths?.html || `diario/${item.slug}/index.html`;
  const full = path.join(REPO_ROOT, htmlPath);
  if (!fs.existsSync(full)) {
    return { ok: false, reason: "HTML mancante — eseguire generazione agente" };
  }

  const dup = runScript("scripts/check-doppioni.mjs", ["--slug", item.slug, "--kw", item.kw_primary || "", "--cluster", item.cluster || ""]);
  if (!dup.ok) return { ok: false, reason: "check_doppioni FAIL" };

  const skimm = runScript("scripts/build-skimm.mjs", ["--check", item.slug, item.kw_primary || "kw", item.cluster || "goliardia-culturismo"]);
  if (!skimm.ok) return { ok: false, reason: "build_skimm FAIL" };

  const hero = runScript("scripts/verify-article-hero.mjs", ["--slug", item.slug]);
  if (!hero.ok) return { ok: false, reason: "verify_article_hero FAIL" };

  const geo = runScript("scripts/geo-aeo-formula.mjs", ["--slug", item.slug]);
  if (!geo.ok) return { ok: false, reason: "geo_aeo FAIL" };

  const val = runScript("scripts/validate-page.js", ["--file", htmlPath]);
  if (!val.ok) return { ok: false, reason: "validate-page FAIL" };

  const publishDate = todayISO();
  addToDiarioIndex(item, publishDate);
  addToSitemap(item.slug, publishDate);
  item.status = "published";
  item.published_date = publishDate;
  return { ok: true };
}

function writeWeeklyReport(data) {
  const d = todayISO();
  const mdPath = path.join(REPO_ROOT, `guardian/reports/weekly-${d}.md`);
  fs.mkdirSync(path.dirname(mdPath), { recursive: true });
  let md = `# Weekly editorial — ${d}\n\n`;
  md += `## Obiettivo\nVisite organiche + iscrizioni newsletter. Zero vendita.\n\n`;
  md += `## Articoli\n`;
  for (const a of data.articles) {
    md += `- **${a.slug}** · kw: ${a.kw_primary} · GEO: ${a.geo || "n/a"} · ${a.status}\n`;
    md += `  - Finzione: ${a.fiction ? "sì" : "no"} · Immagini IA: ${a.ai_images ? "sì (disclosure)" : "da verificare"}\n`;
  }
  md += `\n## Assunzioni\n${data.assumptions.map((a) => `- ${a}`).join("\n")}\n`;
  md += `\n## Premortem\n${data.premortem}\n`;
  md += `\n## Prossimo check\nVenerdì 07:00 — discovery + max 3 articoli\n`;
  fs.writeFileSync(mdPath, md);
  return mdPath;
}

async function runPipeline() {
  console.log("=== FASE 0 CONTEXT ===");
  const ctx = phase0();
  spawnSync("node", ["tools/sync-my-stats.mjs"], { cwd: REPO_ROOT, stdio: "inherit" });

  console.log("=== FASE 1 OBSERVE ===");
  const disc = runScript("scripts/web-keyword-discovery.mjs", ["--count", "3", "--niche", "culturismo"]);
  if (!disc.ok) console.warn("Discovery warning:", disc.stderr);

  console.log("=== FASE 2 VERIFY ===");
  const dupAll = runScript("scripts/check-doppioni.mjs");
  if (!dupAll.ok) {
    console.error("Anti-doppioni FAIL — correggere queue prima di pubblicare");
    if (doPublish) process.exit(1);
  }

  console.log("=== FASE 3 ASSUMPTIONS + PREMORTEM ===");
  const assumptions = [
    "Angoli goliardici non saturano keyword esistenti",
    "FAQ risponde a query reali su culturismo dilettante 50+",
    "CTA newsletter dopo 40% scroll non invasiva",
  ];
  const premortem =
    "Se in 30 giorni non crescono iscrizioni: (1) titoli troppo inside-joke, (2) immagini non distintive, (3) manca GSC per misurare. Segnale: site-stats iscritti null + zero nuovi accessi Sheet.";

  console.log("=== FASE 4 PRIORITIZE ===");
  const queue = readJson("data/editorial-queue.json");
  const picked = prioritize(queue, 3);
  console.log("Picked:", picked.map((p) => p.slug).join(", ") || "(nessuno)");

  if (doGenerate) {
    console.log("=== FASE 5 ACT (generate flag) ===");
    for (const item of picked) {
      item.status = "scheduled";
      console.log(`→ ${item.slug}: scheduled — agente deve generare HTML + WebP (vedi SKILL-EDITORIAL.md)`);
    }
  }

  const published = [];
  if (doPublish) {
    console.log("=== FASE 5 ACT (publish) ===");
    for (const item of picked) {
      const r = publishItem(item);
      if (r.ok) {
        console.log(`✓ Pubblicato: ${item.slug}`);
        published.push(item);
      } else {
        console.warn(`✗ Skip ${item.slug}: ${r.reason}`);
        item.status = item.status === "published" ? "published" : "needs_generation";
      }
    }
    writeJson("data/editorial-queue.json", queue);
    spawnSync("node", ["tools/aggiorna-site-stats.mjs"], { cwd: REPO_ROOT, stdio: "inherit" });
  }

  console.log("=== FASE 6 VERIFY AGAIN ===");
  runScript("guardian/scripts/guardian.mjs", ["run", "--job", "site_integrity"]);

  console.log("=== FASE 7 LEARN + REPORT ===");
  const reportPath = writeWeeklyReport({
    articles: picked.map((p) => ({
      slug: p.slug,
      kw_primary: p.kw_primary,
      fiction: p.fiction,
      ai_images: true,
      status: p.status,
      geo: published.find((x) => x.slug === p.slug) ? "verified" : "pending",
    })),
    assumptions,
    premortem,
  });

  // Riempi proposed se < 3 scheduled
  const scheduledCount = queue.items.filter((i) => i.status === "scheduled").length;
  if (scheduledCount < 3) {
    console.log("Queue: proposed slots disponibili per prossima discovery");
  }
  queue.updated = todayISO();
  writeJson("data/editorial-queue.json", queue);

  console.log(`Report: ${path.relative(REPO_ROOT, reportPath)}`);
}

if (cmd === "run") {
  runPipeline().catch((e) => {
    console.error(e);
    process.exit(1);
  });
} else {
  console.log("Uso: editorial-weekly.mjs run [--publish] [--generate]");
  process.exit(1);
}
