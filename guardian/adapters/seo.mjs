import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

/**
 * Adapter: SEO base — validate-page su file chiave
 */
export function checkSeo(repoRoot) {
  const observations = [];
  const failures = [];
  const verified = [];

  const keyPages = [
    "index.html",
    "allenamenti/index.html",
    "allenamenti/newsletter/index.html",
    "diario/index.html",
  ];

  const validator = join(repoRoot, "scripts/validate-page.js");
  if (existsSync(validator)) {
    for (const rel of keyPages) {
      const p = join(repoRoot, rel);
      if (!existsSync(p)) continue;
      const r = spawnSync("node", [validator, "--file", p], { encoding: "utf8" });
      observations.push({ page: rel, exit_code: r.status, output: (r.stdout || r.stderr || "").trim().slice(0, 200) });
      if (r.status !== 0) {
        failures.push({
          category: "seo",
          event: `validate-page fallito: ${rel}`,
          probability: 0.8,
          impact: 0.5,
          detectability: 1,
          controllability: 0.9,
          signal: r.stderr || r.stdout,
          action_level: "yellow",
          suggested_action: `Correggere title/meta in ${rel}`,
        });
      } else {
        verified.push(`${rel} passa validate-page`);
      }
    }
  }

  const robots = join(repoRoot, "robots.txt");
  if (existsSync(robots)) {
    const txt = readFileSync(robots, "utf8");
    if (!txt.includes("Disallow: /admin/")) {
      failures.push({
        category: "security",
        event: "robots.txt senza Disallow /admin/",
        probability: 0.3,
        impact: 0.2,
        detectability: 1,
        controllability: 0.95,
        signal: "admin indicizzabile",
        action_level: "green",
        suggested_action: "Aggiungere Disallow: /admin/",
      });
    } else {
      verified.push("robots.txt blocca /admin/");
    }
  }

  return { observations, failures, verified_facts: verified, assumptions: [] };
}

/**
 * Adapter: trasparenza AI — immagini data-ai senza nota
 */
export function checkAiTransparency(repoRoot) {
  const failures = [];
  const verified = [];
  const pages = ["index.html", "chi-sono/index.html", "allenamenti/index.html"];
  for (const rel of pages) {
    const p = join(repoRoot, rel);
    if (!existsSync(p)) continue;
    const html = readFileSync(p, "utf8");
    if (html.includes('data-ai="generated"') && !html.includes("ai-media-note") && !html.includes("ai-badge")) {
      failures.push({
        category: "ai_transparency",
        event: `Possibile immagine IA senza nota in ${rel}`,
        probability: 0.5,
        impact: 0.6,
        detectability: 0.7,
        controllability: 0.9,
        signal: "data-ai senza ai-media-note",
        action_level: "yellow",
        suggested_action: "Aggiungere .ai-media-note per AI Act art. 50",
      });
    }
  }
  verified.push("Scan trasparenza AI su pagine chiave completato");
  return { observations: [], failures, verified_facts: verified, assumptions: [] };
}
