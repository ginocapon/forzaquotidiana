/**
 * Ricalcola data/performance-monthly.json da performance-sessions.json.
 * Uso: node tools/aggiorna-performance.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = dirname(__dirname);
const sessionsPath = join(REPO, "data", "performance-sessions.json");
const monthlyPath = join(REPO, "data", "performance-monthly.json");

function secToHms(sec) {
  if (!sec) return "—";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

function fmtDateIt(id) {
  const d = id.slice(8, 10);
  const m = id.slice(5, 7);
  const names = ["", "gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"];
  return `${d} ${names[parseInt(m, 10)]} S${id.slice(-1)}`;
}

const data = JSON.parse(readFileSync(sessionsPath, "utf8"));
const byMonth = {};

for (const s of data.sessions) {
  const m = s.month || s.date.slice(0, 7);
  if (!byMonth[m]) byMonth[m] = [];
  byMonth[m].push(s);
}

const monthKeys = ["2026-06", "2026-07", "2026-08"];
const labels = { "2026-06": "Giugno 2026", "2026-07": "Luglio 2026", "2026-08": "Agosto 2026" };
const months = [];
const charts = {};

for (const mk of monthKeys) {
  const list = byMonth[mk] || [];
  const complete = list.filter((s) => s.durata_sec && s.fc_media != null && !s.partial);
  const durSec = complete.reduce((a, s) => a + s.durata_sec, 0);
  let fcWeighted = 0;
  let fcWeight = 0;
  for (const s of complete) {
    fcWeighted += s.fc_media * s.durata_sec;
    fcWeight += s.durata_sec;
  }
  const cal = complete.reduce((a, s) => a + (s.calorie || 0), 0);
  const caricoList = complete.filter((s) => s.carico != null).map((s) => s.carico);
  const gruppiList = complete.filter((s) => s.gruppi != null).map((s) => s.gruppi);
  const calAsterisk = complete.some((s) => s.calorie_asterisk);
  const caricoAsterisk = complete.some((s) => s.carico_asterisk);

  months.push({
    month: mk,
    label: labels[mk],
    sessioni_totali: list.length,
    sessioni_con_export: complete.length,
    durata_totale_sec: durSec || 0,
    durata_totale: durSec ? secToHms(durSec) : "—",
    fc_media: fcWeight ? Math.round(fcWeighted / fcWeight) : null,
    calorie_totale: cal || null,
    calorie_asterisk: calAsterisk,
    carico_medio: caricoList.length ? Math.round(caricoList.reduce((a, b) => a + b, 0) / caricoList.length) : null,
    carico_asterisk: caricoAsterisk,
    gruppi_medio: gruppiList.length ? Math.round(gruppiList.reduce((a, b) => a + b, 0) / gruppiList.length) : null,
    sessioni_ids: list.map((s) => s.id),
  });

  if (complete.length) {
    charts[mk] = {
      labels: complete.map((s) => fmtDateIt(s.id) + (s.duration_corrected ? "*" : "")),
      durata_min: complete.map((s) => Math.round(s.durata_sec / 60)),
      fc_media: complete.map((s) => s.fc_media),
      calorie: complete.map((s) => s.calorie),
      carico: complete.map((s) => s.carico),
      gruppi: complete.map((s) => s.gruppi),
    };
  }
}

const out = {
  _nota: "Generato da tools/aggiorna-performance.mjs — medie solo su sessioni con export completo (durata + fc_media).",
  trimestre: data.trimestre,
  months,
  charts,
};

writeFileSync(monthlyPath, JSON.stringify(out, null, 2) + "\n");
console.log("OK ->", monthlyPath);
