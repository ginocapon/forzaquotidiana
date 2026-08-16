import { readFileSync, existsSync, readdirSync } from "node:fs";
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
 * Adapter: trasparenza AI — immagini data-ai senza nota o marchio Foto AI
 */
function listHtmlFiles(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name === ".git") continue;
      listHtmlFiles(p, acc);
    } else if (ent.name.endsWith(".html")) {
      acc.push(p);
    }
  }
  return acc;
}

export function checkAiTransparency(repoRoot) {
  const failures = [];
  const verified = [];
  const assumptions = [];
  let totalAi = 0;
  let totalMarks = 0;

  const roots = [
    join(repoRoot, "index.html"),
    join(repoRoot, "chi-sono/index.html"),
    join(repoRoot, "allenamenti/index.html"),
    ...listHtmlFiles(join(repoRoot, "diario")),
  ].filter((p) => existsSync(p));

  for (const p of roots) {
    const html = readFileSync(p, "utf8");
    if (!html.includes("data-ai=")) continue;
    const rel = p.replace(repoRoot + "/", "");
    const aiImgs = (html.match(/<img\b[^>]*\bdata-ai=/gi) || []).length;
    const marks = (html.match(/ai-photo-mark/gi) || []).length;
    totalAi += aiImgs;
    totalMarks += marks;

    if (aiImgs > 0 && marks < aiImgs) {
      failures.push({
        category: "ai_transparency",
        event: `Marchio Foto AI mancante in ${rel}`,
        probability: 0.9,
        impact: 0.7,
        detectability: 1,
        controllability: 0.95,
        signal: `${aiImgs - marks} img[data-ai] senza .ai-photo-mark`,
        action_level: "yellow",
        suggested_action: "node scripts/apply-ai-photo-watermark.mjs",
      });
    }

    if (
      html.includes('data-ai="generated"') &&
      !html.includes("ai-media-note") &&
      !html.includes("ai-badge") &&
      !html.includes("fig-credit")
    ) {
      failures.push({
        category: "ai_transparency",
        event: `Possibile immagine IA senza didascalia in ${rel}`,
        probability: 0.5,
        impact: 0.6,
        detectability: 0.7,
        controllability: 0.9,
        signal: "data-ai senza ai-badge/fig-credit",
        action_level: "yellow",
        suggested_action: "Aggiungere .fig-credit con .ai-badge per AI Act art. 50",
      });
    }
  }

  if (totalAi > 0 && totalMarks >= totalAi) {
    verified.push(`Marchio Foto AI: ${totalMarks}/${totalAi} img[data-ai] su pagine pubbliche`);
  } else if (totalAi === 0) {
    assumptions.push("Nessuna img data-ai nelle pagine campionate");
  }

  verified.push("Scan trasparenza AI (marchio + didascalia) completato");
  return { observations: [], failures, verified_facts: verified, assumptions };
}
