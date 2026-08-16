#!/usr/bin/env node
/**
 * Sincronizza conteggi newsletter da GAS → data/site-stats.json
 * node tools/sync-newsletter-stats.mjs
 *
 * Richiede deploy GAS con doGet ?action=stats (newsletter/google-apps-script.gs)
 * URL: guardian/config/guardian.yaml → newsletter.gas_url + ?action=stats
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const STATS_PATH = path.join(REPO, "data/site-stats.json");
const GUARDIAN_YAML = path.join(REPO, "guardian/config/guardian.yaml");

function loadGasUrl() {
  if (process.env.NEWSLETTER_GAS_URL) return process.env.NEWSLETTER_GAS_URL;
  const raw = fs.readFileSync(GUARDIAN_YAML, "utf8");
  const m = raw.match(/gas_url:\s*(.+)/);
  if (!m) throw new Error("gas_url non trovato in guardian/config/guardian.yaml");
  return m[1].trim();
}

async function fetchStats(gasUrl) {
  const url = gasUrl.includes("?") ? `${gasUrl}&action=stats` : `${gasUrl}?action=stats`;
  const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`GAS stats HTTP ${res.status}`);
  const data = await res.json();
  if (typeof data.iscritti_totali !== "number") {
    throw new Error("Risposta stats invalida — ridistribuire Apps Script con action=stats");
  }
  return data;
}

function mergeSiteStats(remote) {
  let prev = {};
  if (fs.existsSync(STATS_PATH)) {
    prev = JSON.parse(fs.readFileSync(STATS_PATH, "utf8"));
  }
  const today = new Date().toISOString().slice(0, 10);
  const out = {
    ...prev,
    updated: today,
    iscritti_totali: remote.iscritti_totali,
    accessi_scheda_settimana: remote.accessi_scheda_settimana ?? prev.accessi_scheda_settimana,
    ultimo_controllo: remote.updated || today,
    newsletter_sync: {
      at: new Date().toISOString(),
      da_confermare: remote.iscritti_da_confermare ?? null,
      disiscritti: remote.iscritti_disiscritti ?? null,
    },
  };
  fs.writeFileSync(STATS_PATH, JSON.stringify(out, null, 2) + "\n");
  return out;
}

async function main() {
  const gasUrl = loadGasUrl();
  console.log("Fetch stats da GAS…");
  const remote = await fetchStats(gasUrl);
  const out = mergeSiteStats(remote);
  console.log(`OK → ${STATS_PATH}`);
  console.log(
    `Iscritti confermati: ${out.iscritti_totali} · Accessi scheda (7 gg): ${out.accessi_scheda_settimana} · ultimo_controllo: ${out.ultimo_controllo}`
  );
}

main().catch((e) => {
  console.error("sync-newsletter-stats FAIL:", e.message);
  process.exit(1);
});
