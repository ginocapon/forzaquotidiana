import fs from "node:fs";
import path from "node:path";

/**
 * Adapter: coda editoriale goliardica
 */
export function checkEditorial(repoRoot) {
  const observations = [];
  const failures = [];
  const verified = [];
  const assumptions = [];

  const queuePath = path.join(repoRoot, "data/editorial-queue.json");
  const statsPath = path.join(repoRoot, "data/my-stats.json");

  if (!fs.existsSync(queuePath)) {
    failures.push({
      category: "editorial",
      event: "editorial-queue.json mancante",
      probability: 0.9,
      impact: 0.7,
      detectability: 1,
      controllability: 0.95,
      action_level: "yellow",
      suggested_action: "Creare data/editorial-queue.json",
    });
    return { observations, failures, verified_facts: verified, assumptions };
  }

  const queue = JSON.parse(fs.readFileSync(queuePath, "utf8"));
  const items = queue.items || [];
  const scheduled = items.filter((i) => i.status === "scheduled");
  const proposed = items.filter((i) => i.status === "proposed");
  const needsGen = items.filter((i) => i.status === "needs_generation");

  verified.push(`Editorial queue: ${items.length} item, ${scheduled.length} scheduled, ${proposed.length} proposed`);

  if (scheduled.length < 1) {
    failures.push({
      category: "editorial",
      event: "Nessun articolo scheduled per settimana",
      probability: 0.7,
      impact: 0.5,
      detectability: 1,
      controllability: 0.9,
      action_level: "green",
      suggested_action: "Eseguire web-keyword-discovery.mjs e prioritizzare 3 slot",
    });
  }

  if (needsGen.length) {
    assumptions.push(`${needsGen.length} articoli in needs_generation — richiedono agente + immagini WebP`);
  }

  if (!fs.existsSync(statsPath)) {
    failures.push({
      category: "editorial",
      event: "my-stats.json mancante",
      probability: 0.8,
      impact: 0.6,
      detectability: 1,
      controllability: 0.95,
      action_level: "green",
      suggested_action: "node tools/sync-my-stats.mjs",
    });
  } else {
    verified.push("my-stats.json presente");
  }

  const skinText = path.join(repoRoot, "data/editorial-skin.json");
  const skinImg = path.join(repoRoot, "data/editorial-image-skin.json");
  for (const [p, label] of [
    [skinText, "editorial-skin.json"],
    [skinImg, "editorial-image-skin.json"],
  ]) {
    if (!fs.existsSync(p)) {
      failures.push({
        category: "editorial",
        event: `${label} mancante — autopilot non può rispettare la skin`,
        probability: 0.95,
        impact: 0.8,
        detectability: 1,
        controllability: 0.95,
        action_level: "yellow",
        suggested_action: `Creare data/${label} (vedi docs/EDITORIAL-AUTOPILOT-SETUP.md)`,
      });
    } else {
      verified.push(`${label} presente`);
    }
  }

  const reportsDir = path.join(repoRoot, "guardian/reports");
  if (fs.existsSync(reportsDir)) {
    const weeklyReport = fs.readdirSync(reportsDir).filter((f) => f.startsWith("weekly-"));
    if (!weeklyReport.length) {
      assumptions.push("Nessun report weekly-* ancora — normale prima del primo venerdì editoriale");
    }
  }

  return { observations, failures, verified_facts: verified, assumptions };
}
