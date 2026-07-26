/**
 * Calcola CTL / ATL / TSB da carico sessione (Zepp) e aggiorna data/training-load.json
 * Esegui dopo performance-sessions.json: node tools/aggiorna-training-load.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const REPO = dirname(ROOT);
const SESSIONS_PATH = join(REPO, "data/performance-sessions.json");
const LOAD_PATH = join(REPO, "data/training-load.json");

const TAU_ATL = 7;
const TAU_CTL = 42;

function ewm(prev, load, tau) {
  const k = 1 - Math.exp(-1 / tau);
  return prev + k * (load - prev);
}

function statusFromTsb(tsb) {
  if (tsb >= 15) return "Rilassato";
  if (tsb >= 5) return "Energetico";
  if (tsb >= -10) return "Bilanciato";
  return "Ottimale";
}

function parseDate(s) {
  return new Date(s + "T12:00:00");
}

function formatShort(d) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}`;
}

function iso(d) {
  return d.toISOString().slice(0, 10);
}

const sessionsRaw = JSON.parse(readFileSync(SESSIONS_PATH, "utf8"));
let existing = {};
if (existsSync(LOAD_PATH)) {
  existing = JSON.parse(readFileSync(LOAD_PATH, "utf8"));
}

const overrides = existing.overrides || {};
const baseline = existing.baseline || { ctl: 28, atl: 25, start: "2026-06-01" };

const loadsByDate = {};
for (const s of sessionsRaw.sessions) {
  if (!s.date || s.partial) continue;
  let load = s.carico;
  if (s.carico_adjusted != null) load = s.carico_adjusted;
  if (load == null) continue;
  loadsByDate[s.date] = (loadsByDate[s.date] || 0) + load;
}

const sessionDates = Object.keys(loadsByDate).sort();
if (sessionDates.length === 0) {
  console.warn("Nessuna sessione con carico — training-load.json non aggiornato.");
  process.exit(0);
}

const firstSession = sessionDates[0];
const chartStart = parseDate(baseline.start);
const lastSession = parseDate(sessionDates[sessionDates.length - 1]);
const chartEnd = new Date(lastSession);
chartEnd.setDate(chartEnd.getDate() + 14);

let ctl = baseline.ctl;
let atl = baseline.atl;
const timeline = [];
const snapshots = {};

for (let d = new Date(chartStart); d <= chartEnd; d.setDate(d.getDate() + 1)) {
  const key = iso(d);
  const load = loadsByDate[key] || 0;
  atl = ewm(atl, load, TAU_ATL);
  ctl = ewm(ctl, load, TAU_CTL);
  let tsb = ctl - atl;

  if (overrides[key]) {
    const o = overrides[key];
    if (o.ctl != null) ctl = o.ctl;
    if (o.atl != null) atl = o.atl;
    if (o.tsb != null) tsb = o.tsb;
    else tsb = ctl - atl;
  }

  const point = {
    date: key,
    label: formatShort(d),
    load,
    ctl: round(ctl),
    atl: round(atl),
    tsb: round(tsb),
    status: overrides[key]?.status || statusFromTsb(tsb),
    session: load > 0
  };
  timeline.push(point);

  if (load > 0 || overrides[key]) {
    snapshots[key] = {
      ctl: point.ctl,
      atl: point.atl,
      tsb: point.tsb,
      status: point.status,
      load
    };
  }
}

const out = {
  _nota:
    "CTL/ATL/TSB da carico Zepp (EWM 42/7 gg). overrides per snapshot Zepp verificati. node tools/aggiorna-training-load.mjs",
  trimestre: sessionsRaw.trimestre,
  updated: new Date().toISOString().slice(0, 10),
  zones: [
    { id: "rilassato", label: "Rilassato", min: 15 },
    { id: "energetico", label: "Energetico", min: 5 },
    { id: "bilanciato", label: "Bilanciato", min: -10 },
    { id: "ottimale", label: "Ottimale", min: null }
  ],
  baseline,
  overrides,
  timeline,
  snapshots,
  sessions: sessionDates.map((date) => ({
    date,
    id: sessionsRaw.sessions.find((s) => s.date === date && s.carico)?.id || date
  }))
};

writeFileSync(LOAD_PATH, JSON.stringify(out, null, 2) + "\n");
console.log("training-load.json aggiornato —", timeline.length, "giorni,", Object.keys(snapshots).length, "snapshot sessione.");

// Rigenera grafici statici nelle pagine
import("./inietta-tsb-pagine.mjs").catch((e) => console.warn("inietta-tsb:", e.message));

function round(n) {
  return Math.round(n * 10) / 10;
}
