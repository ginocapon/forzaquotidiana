/**
 * Ricalcola data/performance-monthly.json da performance-sessions.json.
 * Raggruppa per mese (YYYY-MM) e anno per confronti trimestrali/annuali.
 * Uso: node tools/aggiorna-performance.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = dirname(__dirname);
const sessionsPath = join(REPO, "data", "performance-sessions.json");
const monthlyPath = join(REPO, "data", "performance-monthly.json");

const MONTH_NAMES = [
  "", "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
  "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre",
];

function secToHms(sec) {
  if (!sec) return "—";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

function fmtDateIt(session) {
  const id = session.id;
  const d = id.slice(8, 10);
  const m = id.slice(5, 7);
  const names = ["", "gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"];
  let scheda = "";
  if (session.scheda_label) {
    scheda = session.scheda_label;
  } else if (session.schede?.length) {
    scheda = "S" + session.schede.join("+");
  } else if (session.scheda) {
    scheda = "S" + session.scheda;
  } else {
    const mScheda = id.match(/scheda-(\d)/);
    scheda = mScheda ? "S" + mScheda[1] : id.slice(8, 10);
  }
  return `${d} ${names[parseInt(m, 10)]} ${scheda}`;
}

function monthLabel(mk) {
  const [y, m] = mk.split("-");
  return `${MONTH_NAMES[parseInt(m, 10)]} ${y}`;
}

const data = JSON.parse(readFileSync(sessionsPath, "utf8"));
const byMonth = {};

for (const s of data.sessions) {
  const m = s.month || s.date.slice(0, 7);
  if (!byMonth[m]) byMonth[m] = [];
  byMonth[m].push(s);
}

// Mesi del trimestre corrente + tutti i mesi con sessioni (per archivio futuro)
const trimestreMonths = [];
const trimMatch = data.trimestre?.match(/trimestre-(\w+)-(\w+)-(\w+)-(\d{4})/);
if (trimMatch) {
  const monthMap = {
    gennaio: "01", febbraio: "02", marzo: "03", aprile: "04",
    maggio: "05", giugno: "06", luglio: "07", agosto: "08",
    settembre: "09", ottobre: "10", novembre: "11", dicembre: "12",
  };
  const year = trimMatch[4];
  for (let i = 1; i <= 3; i++) {
    const mm = monthMap[trimMatch[i]];
    if (mm) trimestreMonths.push(`${year}-${mm}`);
  }
}

const allMonthKeys = [...new Set([...trimestreMonths, ...Object.keys(byMonth)])].sort();
const months = [];
const charts = {};

for (const mk of allMonthKeys) {
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
    label: monthLabel(mk),
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
    in_trimestre: trimestreMonths.includes(mk),
  });

  if (complete.length) {
    charts[mk] = {
      labels: complete.map((s) => fmtDateIt(s) + (s.duration_corrected ? "*" : "")),
      durata_min: complete.map((s) => Math.round(s.durata_sec / 60)),
      fc_media: complete.map((s) => s.fc_media),
      calorie: complete.map((s) => s.calorie),
      carico: complete.map((s) => s.carico),
      gruppi: complete.map((s) => s.gruppi),
    };
  }
}

// Raggruppamento per anno — base per confronti annuali
const years = {};
for (const mk of allMonthKeys) {
  const y = mk.slice(0, 4);
  if (!years[y]) years[y] = { year: y, label: y, months: [] };
  years[y].months.push(mk);
}

const out = {
  _nota: "Generato da tools/aggiorna-performance.mjs — medie solo su sessioni con export completo (durata + fc_media). Raggruppamento mese/anno per confronti.",
  trimestre: data.trimestre,
  trimestre_months: trimestreMonths,
  months,
  charts,
  years,
};

writeFileSync(monthlyPath, JSON.stringify(out, null, 2) + "\n");
console.log("OK ->", monthlyPath);
