/**
 * Calcola età biologica da export Zepp/Amazfit (performance + CTL).
 * Esegui dopo aggiornamento sessioni: node tools/aggiorna-bio-age.mjs
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
const MAX_OFFSET = 6;

function round1(n) {
  return Math.round(n * 10) / 10;
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

function computeOffset({ ctl, avgAerobic, avgHr, sessionCount, techniqueAvg, weeksActive }) {
  const ctlBonus = Math.min(2.5, Math.max(0, (ctl - 22) * 0.12));
  const aerobicBonus = avgAerobic != null
    ? Math.min(1.8, Math.max(0, (avgAerobic - 1.8) * 0.65))
    : 0;
  const hrBonus = avgHr != null
    ? Math.min(1.2, Math.max(0, (118 - avgHr) * 0.06))
    : 0;
  const consistencyBonus = Math.min(1.2, sessionCount * 0.18);
  const techniqueBonus = Math.min(0.8, techniqueAvg * 0.8);
  const adherenceBonus = Math.min(0.7, Math.max(0, weeksActive - 1) * 0.2);

  const raw = ctlBonus + aerobicBonus + hrBonus + consistencyBonus + techniqueBonus + adherenceBonus;
  return Math.min(MAX_OFFSET, raw);
}

function metricsUpTo(sessions, loadData, endDate) {
  const complete = sessions.filter((s) => isComplete(s) && s.date <= endDate);
  const partialCount = sessions.filter((s) => !s.partial && s.date <= endDate).length;

  let fcWeighted = 0;
  let fcWeight = 0;
  let aerobicSum = 0;
  let aerobicCount = 0;
  let techniqueSum = 0;
  let techniqueCount = 0;

  for (const s of complete) {
    fcWeighted += s.fc_media * s.durata_sec;
    fcWeight += s.durata_sec;
    if (s.effetto_aerobico != null) {
      aerobicSum += s.effetto_aerobico;
      aerobicCount += 1;
    }
    if (s.tecnica) {
      techniqueSum += techniqueScore(s);
      techniqueCount += 1;
    }
  }

  const timeline = (loadData.timeline || []).filter((d) => d.date <= endDate);
  const lastPoint = timeline[timeline.length - 1];
  const ctl = lastPoint?.ctl ?? loadData.baseline?.ctl ?? 28;

  const firstDate = complete[0]?.date || endDate;
  const weeksActive = Math.max(
    1,
    Math.ceil((new Date(endDate) - new Date(firstDate)) / (7 * 24 * 60 * 60 * 1000)) + 1
  );

  return {
    ctl,
    avgHr: fcWeight ? fcWeighted / fcWeight : null,
    avgAerobic: aerobicCount ? aerobicSum / aerobicCount : null,
    sessionCount: partialCount,
    techniqueAvg: techniqueCount ? techniqueSum / techniqueCount : 0,
    weeksActive,
  };
}

const sessionsRaw = JSON.parse(readFileSync(SESSIONS_PATH, "utf8"));
const sessions = sessionsRaw.sessions || [];

let loadData = { baseline: { ctl: 28 }, timeline: [] };
if (existsSync(LOAD_PATH)) {
  loadData = JSON.parse(readFileSync(LOAD_PATH, "utf8"));
}

const baselineOffset = 0.4;
const baselineAge = round1(CHRONO_AGE + baselineOffset);

const sessionDates = sessions
  .filter((s) => !s.partial && sessionLoad(s) != null)
  .map((s) => s.date)
  .sort();

const timelinePoints = [{ date: TRIMESTRE_START, age: baselineAge, offset: 0, sessions: 0 }];

for (const date of sessionDates) {
  const m = metricsUpTo(sessions, loadData, date);
  const offset = computeOffset(m);
  timelinePoints.push({
    date,
    age: round1(CHRONO_AGE - offset),
    offset: round1(offset),
    sessions: m.sessionCount,
    ctl: round1(m.ctl),
  });
}

const today = new Date().toISOString().slice(0, 10);
const currentMetrics = metricsUpTo(sessions, loadData, today);
const currentOffset = computeOffset(currentMetrics);
const currentAge = round1(CHRONO_AGE - currentOffset);
const delta = round1(CHRONO_AGE - currentAge);

const out = {
  _nota: "Età biologica stimata da CTL Zepp, FC, effetto aerobico, costanza e tecnica. Non è dato clinico. node tools/aggiorna-bio-age.mjs",
  trimestre: sessionsRaw.trimestre,
  updated: today,
  chronological_age: CHRONO_AGE,
  biological_age: currentAge,
  offset_years: round1(currentOffset),
  delta_vs_chrono: delta,
  trend: delta >= 2 ? "in miglioramento" : delta >= 0.8 ? "positiva" : "in costruzione",
  components: {
    ctl: round1(currentMetrics.ctl),
    fc_media_pesata: currentMetrics.avgHr != null ? Math.round(currentMetrics.avgHr) : null,
    effetto_aerobico_medio: currentMetrics.avgAerobic != null ? round1(currentMetrics.avgAerobic) : null,
    sessioni_documentate: currentMetrics.sessionCount,
    settimane_attive: currentMetrics.weeksActive,
  },
  timeline: timelinePoints,
};

writeFileSync(OUT_PATH, JSON.stringify(out, null, 2) + "\n");
console.log(`OK -> ${OUT_PATH}`);
console.log(`Età biologica: ${currentAge} anni (cronologica ${CHRONO_AGE}, −${delta} anni)`);
