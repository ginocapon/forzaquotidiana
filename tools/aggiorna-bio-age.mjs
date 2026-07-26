/**
 * Età biologica — modello a crediti da dati Zepp reali.
 *
 * Pilastri (tetto totale −5,8 aa):
 *   1. Storia palestra (10+ anni)     max −2,5
 *   2. Fitness CTL (Zepp verificato)  max −1,4
 *   3. Cardio (FC + aerobico)         max −1,0
 *   4. Forza (anaerobico, carico, vol) max −1,6
 *   5. Trimestre documentato          max −0,9 (scala con sessioni/12)
 *
 * node tools/aggiorna-bio-age.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const REPO = dirname(ROOT);
const SESSIONS_PATH = join(REPO, "data/performance-sessions.json");
const LOAD_PATH = join(REPO, "data/training-load.json");
const OUT_PATH = join(REPO, "data/biological-age.json");

const CHRONO_AGE = 57;
const TRIMESTRE_START = "2026-06-01";
const TRAINING_YEARS = 10;
const MATURITY_SESSIONS = 12;

const CAPS = {
  total: 5.8,
  storia: 2.5,
  ctl: 1.4,
  cardio: 1.0,
  forza: 1.6,
  trimestre: 0.9,
};

function round1(n) {
  return Math.round(n * 10) / 10;
}

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

function avgOf(list) {
  return list.length ? list.reduce((a, b) => a + b, 0) / list.length : null;
}

function sessionLoad(s) {
  if (s.partial) return null;
  if (s.carico_adjusted != null) return s.carico_adjusted;
  return s.carico;
}

function isComplete(s) {
  return !s.partial && s.durata_sec && s.fc_media != null;
}

function techniqueScore(s) {
  if (!s.tecnica) return 0;
  const t = s.tecnica;
  let score = 0;
  if (/uniforme|molto uniforme/i.test(t.consistenza || "")) score += 0.35;
  if (/molto stabili|stabili/i.test(t.stability || "")) score += 0.25;
  if (/fluidi/i.test(t.continuity || "")) score += 0.2;
  if (/coerenti|uniforme/i.test(t.rhythm || "")) score += 0.1;
  if (/ragionevole|contenuto|buona/i.test(s.speed_decay || t.speed_decay || "")) score += 0.1;
  return Math.min(1, score);
}

/** CTL Zepp verificato (override) o ultimo snapshot sessione, non proiezione decaduta */
function verifiedCtl(loadData, endDate) {
  const overrides = loadData.overrides || {};
  const overrideDates = Object.keys(overrides)
    .filter((d) => d <= endDate)
    .sort();
  if (overrideDates.length) {
    return overrides[overrideDates[overrideDates.length - 1]].ctl;
  }
  const snapshots = loadData.snapshots || {};
  const snapDates = Object.keys(snapshots)
    .filter((d) => d <= endDate)
    .sort();
  if (snapDates.length) {
    return snapshots[snapDates[snapDates.length - 1]].ctl;
  }
  const timeline = (loadData.timeline || []).filter((d) => d.date <= endDate);
  const last = timeline[timeline.length - 1];
  return last?.ctl ?? loadData.baseline?.ctl ?? 28;
}

function collectMetrics(sessions, loadData, endDate) {
  const complete = sessions.filter((s) => isComplete(s) && s.date <= endDate);
  const documented = sessions.filter((s) => !s.partial && s.date <= endDate).length;

  let fcWeighted = 0;
  let fcWeight = 0;
  let aerobicSum = 0;
  let aerobicCount = 0;
  let techniqueSum = 0;
  let techniqueCount = 0;

  const anaerobic = [];
  const loads = [];
  const gruppi = [];

  for (const s of complete) {
    fcWeighted += s.fc_media * s.durata_sec;
    fcWeight += s.durata_sec;
    if (s.effetto_aerobico != null) {
      aerobicSum += s.effetto_aerobico;
      aerobicCount += 1;
    }
    if (s.effetto_anaerobico != null) anaerobic.push(s.effetto_anaerobico);
    const load = sessionLoad(s);
    if (load != null) loads.push(load);
    if (s.gruppi != null) gruppi.push(s.gruppi);
    if (s.tecnica) {
      techniqueSum += techniqueScore(s);
      techniqueCount += 1;
    }
  }

  return {
    ctl: verifiedCtl(loadData, endDate),
    avgHr: fcWeight ? fcWeighted / fcWeight : null,
    avgAerobic: aerobicCount ? aerobicSum / aerobicCount : null,
    avgAnaerobic: avgOf(anaerobic),
    peakAnaerobic: anaerobic.length ? Math.max(...anaerobic) : null,
    avgLoad: avgOf(loads),
    avgGruppi: avgOf(gruppi),
    completeSessions: complete.length,
    documentedSessions: documented,
    techniqueAvg: techniqueCount ? techniqueSum / techniqueCount : 0,
  };
}

function computeCredits(m) {
  const storia = clamp(TRAINING_YEARS * 0.25, 0, CAPS.storia);

  const ctl = clamp((m.ctl - 22) * 0.07, 0, CAPS.ctl);

  const hrPart = m.avgHr != null ? clamp((120 - m.avgHr) * 0.04, 0, 0.55) : 0;
  const aerobicPart = m.avgAerobic != null
    ? clamp((m.avgAerobic - 2.5) * 0.5, 0, 0.45)
    : 0;
  const cardio = clamp(hrPart + aerobicPart, 0, CAPS.cardio);

  const anaerobicAvgPart = m.avgAnaerobic != null
    ? clamp((m.avgAnaerobic - 2.2) * 0.4, 0, 0.55)
    : 0;
  const anaerobicPeakPart = m.peakAnaerobic != null
    ? clamp((m.peakAnaerobic - 2.5) * 0.35, 0, 0.5)
    : 0;
  const loadPart = m.avgLoad != null
    ? clamp((m.avgLoad - 50) * 0.015, 0, 0.35)
    : 0;
  const volumePart = m.avgGruppi != null
    ? clamp((m.avgGruppi - 18) * 0.04, 0, 0.25)
    : 0;
  const forza = clamp(anaerobicAvgPart + anaerobicPeakPart + loadPart + volumePart, 0, CAPS.forza);

  const maturity = clamp(m.completeSessions / MATURITY_SESSIONS, 0, 1);
  const trimestre = clamp((m.documentedSessions / MATURITY_SESSIONS) * CAPS.trimestre * maturity, 0, CAPS.trimestre);

  const raw = storia + ctl + cardio + forza + trimestre;
  const total = round1(clamp(raw, 0, CAPS.total));

  return {
    storia: round1(storia),
    ctl: round1(ctl),
    cardio: round1(cardio),
    forza: round1(forza),
    trimestre: round1(trimestre),
    total,
    maturity: round1(maturity),
    raw_inputs: {
      ctl_zepp: round1(m.ctl),
      fc_media_pesata: m.avgHr != null ? Math.round(m.avgHr) : null,
      effetto_aerobico_medio: m.avgAerobic != null ? round1(m.avgAerobic) : null,
      effetto_anaerobico_medio: m.avgAnaerobic != null ? round1(m.avgAnaerobic) : null,
      effetto_anaerobico_picco: m.peakAnaerobic != null ? round1(m.peakAnaerobic) : null,
      carico_medio: m.avgLoad != null ? Math.round(m.avgLoad) : null,
      gruppi_medi: m.avgGruppi != null ? Math.round(m.avgGruppi) : null,
      sessioni_complete: m.completeSessions,
      sessioni_documentate: m.documentedSessions,
      tecnica_media: m.techniqueAvg > 0 ? round1(m.techniqueAvg) : null,
    },
  };
}

const sessionsRaw = JSON.parse(readFileSync(SESSIONS_PATH, "utf8"));
const sessions = sessionsRaw.sessions || [];

let loadData = { baseline: { ctl: 28 }, timeline: [], overrides: {}, snapshots: {} };
if (existsSync(LOAD_PATH)) {
  loadData = JSON.parse(readFileSync(LOAD_PATH, "utf8"));
}

const sessionDates = sessions
  .filter((s) => !s.partial && sessionLoad(s) != null)
  .map((s) => s.date)
  .sort();

const timelinePoints = [{
  date: TRIMESTRE_START,
  ...(() => {
    const c = computeCredits(collectMetrics(sessions, loadData, TRIMESTRE_START));
    return {
      age: round1(CHRONO_AGE - c.total),
      offset: c.total,
      sessions: 0,
      ctl: verifiedCtl(loadData, TRIMESTRE_START),
      note: "Profilo 10+ anni palestra, trimestre Q3 non ancora documentato",
    };
  })(),
}];

for (const date of sessionDates) {
  const m = collectMetrics(sessions, loadData, date);
  const credits = computeCredits(m);
  timelinePoints.push({
    date,
    age: round1(CHRONO_AGE - credits.total),
    offset: credits.total,
    sessions: m.documentedSessions,
    ctl: m.ctl,
    maturity: credits.maturity,
  });
}

const today = new Date().toISOString().slice(0, 10);
const currentMetrics = collectMetrics(sessions, loadData, today);
const currentCredits = computeCredits(currentMetrics);
const currentAge = round1(CHRONO_AGE - currentCredits.total);
const delta = round1(CHRONO_AGE - currentAge);

const out = {
  _nota: "Età biologica da crediti Zepp verificati + profilo 10+ anni palestra. Non dato clinico. node tools/aggiorna-bio-age.mjs",
  trimestre: sessionsRaw.trimestre,
  updated: today,
  chronological_age: CHRONO_AGE,
  biological_age: currentAge,
  offset_years: currentCredits.total,
  delta_vs_chrono: delta,
  trend: delta >= 4.5 ? "in miglioramento" : delta >= 2.5 ? "positiva" : "in costruzione",
  methodology: {
    modello: "crediti per pilastro",
    max_offset_totale: CAPS.total,
    ctl_fonte: "Zepp verificato (override/snapshot), non proiezione decaduta",
    maturita_sessioni: MATURITY_SESSIONS,
    maturita_pct: currentCredits.maturity,
  },
  crediti_anni: {
    storia_palestra: currentCredits.storia,
    fitness_ctl: currentCredits.ctl,
    cardio: currentCredits.cardio,
    forza: currentCredits.forza,
    trimestre_documentato: currentCredits.trimestre,
  },
  dati_zepp: currentCredits.raw_inputs,
  timeline: timelinePoints,
};

writeFileSync(OUT_PATH, JSON.stringify(out, null, 2) + "\n");
console.log(`OK -> ${OUT_PATH}`);
console.log(`Età biologica: ${currentAge} anni (−${delta} vs ${CHRONO_AGE})`);
console.log(`  Storia ${currentCredits.storia} | CTL ${currentCredits.ctl} | Cardio ${currentCredits.cardio} | Forza ${currentCredits.forza} | Trimestre ${currentCredits.trimestre}`);
console.log(`  CTL Zepp usato: ${currentCredits.raw_inputs.ctl_zepp}`);
