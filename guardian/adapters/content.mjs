import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Adapter: contenuti e freschezza dati
 */
export function checkContent(repoRoot) {
  const observations = [];
  const failures = [];
  const verified = [];

  const sessionsPath = join(repoRoot, "data/performance-sessions.json");
  const siteStatsPath = join(repoRoot, "data/site-stats.json");
  const sitemapPath = join(repoRoot, "sitemap.xml");

  if (existsSync(sessionsPath)) {
    const data = JSON.parse(readFileSync(sessionsPath, "utf8"));
    const sessions = data.sessions || [];
    const latest = sessions.reduce((a, s) => (s.date > a ? s.date : a), "");
    observations.push({ sessions_count: sessions.length, latest_session_date: latest });
    verified.push(`Ultima sessione in JSON: ${latest}`);

    const daysSince = latest ? (Date.now() - new Date(latest).getTime()) / 86400000 : 999;
    if (daysSince > 14) {
      failures.push({
        category: "content",
        event: "Nessuna sessione documentata da >14 giorni",
        probability: 0.6,
        impact: 0.5,
        detectability: 0.9,
        controllability: 0.9,
        signal: `latest=${latest}`,
        action_level: "green",
        suggested_action: "Pubblicare log sessione o pianificare pausa documentata nel diario",
      });
    }
  }

  if (existsSync(siteStatsPath)) {
    const stats = JSON.parse(readFileSync(siteStatsPath, "utf8"));
    const updated = stats.updated;
    if (updated) {
      const days = (Date.now() - new Date(updated).getTime()) / 86400000;
      observations.push({ site_stats_updated: updated, days_ago: Math.floor(days) });
      if (days > 10) {
        failures.push({
          category: "business_growth",
          event: "site-stats.json non aggiornato da >10 giorni",
          probability: 0.7,
          impact: 0.4,
          detectability: 0.95,
          controllability: 0.95,
          signal: `updated=${updated}`,
          action_level: "green",
          suggested_action: "node tools/aggiorna-site-stats.mjs dopo nuovi contenuti",
        });
      }
    }
  }

  if (existsSync(sitemapPath)) {
    const sm = readFileSync(sitemapPath, "utf8");
    const lastmods = [...sm.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]);
    const maxLm = lastmods.sort().pop();
    observations.push({ sitemap_lastmod_max: maxLm });
    verified.push(`sitemap.xml presente, lastmod più recente: ${maxLm}`);
  } else {
    failures.push({
      category: "seo",
      event: "sitemap.xml mancante",
      probability: 0.2,
      impact: 0.7,
      detectability: 1,
      controllability: 0.95,
      signal: "file assente",
      action_level: "yellow",
      suggested_action: "Ripristinare sitemap.xml",
    });
  }

  const llmsPath = join(repoRoot, "llms.txt");
  if (!existsSync(llmsPath)) {
    failures.push({
      category: "seo",
      event: "llms.txt mancante",
      probability: 0.2,
      impact: 0.3,
      detectability: 1,
      controllability: 0.95,
      signal: "file assente",
      action_level: "green",
      suggested_action: "Aggiornare llms.txt con ultimi contenuti",
    });
  }

  const diarioDir = join(repoRoot, "diario");
  if (existsSync(diarioDir)) {
    const articles = readdirSync(diarioDir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && existsSync(join(diarioDir, d.name, "index.html")))
      .length;
    observations.push({ diario_articles_dirs: articles });
  }

  return { observations, failures, verified_facts: verified, assumptions: [] };
}

/**
 * Adapter: integrità JSON data/
 */
export function checkDataIntegrity(repoRoot) {
  const dataDir = join(repoRoot, "data");
  const observations = [];
  const failures = [];
  const verified = [];

  if (!existsSync(dataDir)) return { observations, failures, verified_facts: verified };

  for (const file of readdirSync(dataDir).filter((f) => f.endsWith(".json"))) {
    const p = join(dataDir, file);
    try {
      JSON.parse(readFileSync(p, "utf8"));
      verified.push(`${file} parse OK`);
    } catch (e) {
      failures.push({
        category: "performance_data",
        event: `JSON invalido: ${file}`,
        probability: 1,
        impact: 0.8,
        detectability: 1,
        controllability: 0.95,
        signal: e.message,
        action_level: "yellow",
        suggested_action: `Correggere data/${file}`,
      });
    }
  }

  return { observations, failures, verified_facts: verified, assumptions: [] };
}
