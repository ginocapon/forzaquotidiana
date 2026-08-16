import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Adapter: newsletter funnel + GAS
 */
export async function checkNewsletter(config, repoRoot) {
  const observations = [];
  const failures = [];
  const verified = [];
  const assumptions = [];

  const gasUrl = config.newsletter?.gas_url;
  const pagePath = join(repoRoot, config.newsletter?.page_path || "allenamenti/newsletter/index.html");

  if (gasUrl) {
    try {
      const res = await fetch(gasUrl, { method: "GET", redirect: "follow" });
      observations.push({ gas_url: gasUrl, status: res.status });
      if (res.status >= 500) {
        failures.push({
          category: "newsletter",
          event: "GAS endpoint errore server",
          probability: 0.5,
          impact: 1,
          detectability: 0.9,
          controllability: 0.7,
          signal: `HTTP ${res.status} su Apps Script`,
          action_level: "yellow",
          suggested_action: "Verificare deploy GAS e quota Gmail — NEWSLETTER-SETUP.md",
        });
      } else {
        verified.push(`GAS risponde HTTP ${res.status} (non equivale a subscribe funzionante)`);
        assumptions.push({
          text: "GAS doPost subscribe funziona se GET non è 500",
          confidence: "medium",
          test: "Test manuale testSubscribe in editor GAS",
        });
      }
    } catch (e) {
      failures.push({
        category: "newsletter",
        event: "GAS non raggiungibile",
        probability: 0.6,
        impact: 1,
        detectability: 0.95,
        controllability: 0.5,
        signal: e.message,
        action_level: "red",
        suggested_action: "Ripristinare Apps Script prima di campagne",
      });
    }
  }

  if (existsSync(pagePath)) {
    const html = readFileSync(pagePath, "utf8");
    const hasForm = html.includes('id="newsletter-form"');
    const hasScriptUrl = html.includes("data-script-url");
    const hasPrivacy = html.includes('name="privacy"') || html.includes("privacy");
    const hasHoneypot = html.includes('name="website"');
    observations.push({ page: pagePath, hasForm, hasScriptUrl, hasPrivacy, hasHoneypot });
    if (!hasForm || !hasScriptUrl) {
      failures.push({
        category: "forms",
        event: "Form newsletter incompleto",
        probability: 0.4,
        impact: 0.95,
        detectability: 1,
        controllability: 0.9,
        signal: "manca form o data-script-url",
        action_level: "yellow",
        suggested_action: "Ripristinare form in allenamenti/newsletter/index.html",
      });
    } else {
      verified.push("Pagina newsletter: form + data-script-url presenti");
    }
    if (!hasHoneypot) {
      assumptions.push({ text: "Honeypot spam assente", confidence: "high", test: "Aggiungere campo website hidden" });
    }
  } else {
    failures.push({
      category: "newsletter",
      event: "Pagina newsletter mancante",
      probability: 0.3,
      impact: 1,
      detectability: 1,
      controllability: 0.95,
      signal: "file non trovato",
      action_level: "red",
      suggested_action: "Ripristinare allenamenti/newsletter/index.html",
    });
  }

  const statsPath = join(repoRoot, "data/site-stats.json");
  if (existsSync(statsPath)) {
    const stats = JSON.parse(readFileSync(statsPath, "utf8"));
    observations.push({ iscritti_totali: stats.iscritti_totali, updated: stats.updated });
    if (stats.iscritti_totali == null) {
      assumptions.push({
        text: "Conteggio iscritti non sincronizzato in site-stats",
        confidence: "high",
        test: "node tools/sync-newsletter-stats.mjs (richiede GAS ?action=stats deployato)",
      });
    } else {
      verified.push(`iscritti_totali in site-stats: ${stats.iscritti_totali} (${stats.updated || "n/d"})`);
    }
  }

  return { observations, failures, verified_facts: verified, assumptions };
}
