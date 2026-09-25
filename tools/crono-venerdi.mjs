#!/usr/bin/env node
/**
 * Crono venerdì — premortem Guardian + freschezza SEO (stats, llms, feed).
 * node tools/crono-venerdi.mjs
 */
import { spawnSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = dirname(fileURLToPath(import.meta.url)).replace(/\/tools$/, "");

function run(cmd, args) {
  const r = spawnSync(cmd, args, { cwd: REPO, encoding: "utf8" });
  const out = (r.stdout || "") + (r.stderr || "");
  if (out.trim()) process.stdout.write(out);
  return r.status === 0;
}

console.log("=== Crono venerdì Forza Quotidiana ===\n");

const steps = [
  ["node", ["guardian/scripts/guardian.mjs", "run", "--job", "weekly_strategy"]],
  ["node", ["tools/aggiorna-site-stats.mjs"]],
  ["node", ["tools/sync-llms-recente.mjs"]],
  ["node", ["tools/genera-feed.mjs"]],
  ["node", ["tools/sync-newsletter-stats.mjs"]],
];

for (const [cmd, args] of steps) {
  const label = args.join(" ");
  console.log(`→ ${label}`);
  const ok = run(cmd, args);
  if (!ok && args.includes("sync-newsletter-stats.mjs")) {
    console.log("  (newsletter sync opzionale — verifica deploy GAS ?action=stats)\n");
  } else if (!ok) {
    console.log(`  ATTENZIONE: exit non zero\n`);
  } else {
    console.log("");
  }
}

const reportPath = join(REPO, "guardian/reports/guardian-latest.md");
if (existsSync(reportPath)) {
  const md = readFileSync(reportPath, "utf8");
  const fm = md.match(/## Failure modes[\s\S]*?(?=## |$)/);
  if (fm) {
    console.log("--- Premortem (estratto) ---");
    console.log(fm[0].trim());
    console.log("");
  }
}

const statsPath = join(REPO, "data/site-stats.json");
if (existsSync(statsPath)) {
  const s = JSON.parse(readFileSync(statsPath, "utf8"));
  console.log("--- Freschezza ---");
  console.log(`site-stats updated: ${s.updated}`);
  if (s.latest_content_date) {
    console.log(`ultimo contenuto: ${s.latest_content_date} — ${s.latest_content_title}`);
    console.log(`URL: ${s.latest_content_url}`);
  }
}

console.log("\n=== Azioni umane (Foglio Google) ===");
console.log("- Iscritti / accessi scheda / invio newsletter se articolo nuovo");
console.log("- Commit: feed.xml, llms.txt, data/site-stats.json se cambiati");
