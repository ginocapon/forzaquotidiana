/**
 * Adapter: HTTP availability — probe URL produzione
 */
export async function checkAvailability(config) {
  const urls = config.probe_urls || [];
  const observations = [];
  const failures = [];

  for (const url of urls) {
    try {
      const res = await fetch(url, { method: "GET", redirect: "follow" });
      const ok = res.status === 200;
      observations.push({ url, status: res.status, ok });
      if (!ok) {
        failures.push({
          category: "availability",
          event: `HTTP ${res.status} su ${url}`,
          probability: 0.7,
          impact: 0.9,
          detectability: 0.95,
          controllability: 0.8,
          signal: "curl/fetch non 200",
          action_level: "green",
          suggested_action: "Verificare deploy GitHub Pages e DNS",
        });
      }
    } catch (e) {
      observations.push({ url, error: String(e.message), ok: false });
      failures.push({
        category: "availability",
        event: `Errore fetch ${url}`,
        probability: 0.8,
        impact: 1,
        detectability: 0.9,
        controllability: 0.6,
        signal: "network error",
        action_level: "yellow",
        suggested_action: "Controllare DNS Serverplan e status GitHub",
      });
    }
  }

  return { observations, failures, verified_facts: observations.filter((o) => o.ok).map((o) => `${o.url} → ${o.status}`) };
}
