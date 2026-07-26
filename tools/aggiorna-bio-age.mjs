/**
 * Calcola età biologica da export Zepp/Amazfit (performance + CTL).
 * Modello conservativo: profilo storico + bonus trimestre maturato nel tempo.
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
/** 10+ anni palestra dilettante — già meglio di un pari sedentario, non da atleta */
const PROFILE_OFFSET = 1.2;
/** Bonus massimo dal trimestre documentato (con 12+ sessioni complete) */
const MAX_TRIMESTRE_OFFSET = 1.5;
/** Sessioni complete necessarie per fiducia piena nel dato */
const MATURITY_SESSIONS = 12;

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

function maturityFactor(completeSessions) {
  return Math.min(1, completeSessions / MATURITY_SESSIONS);
}

function trimestreOffsetRaw({ ctl, avgAerobic, avgHr, sessionCount, techniqueAvg }) {
  const ctlPart = Math.min(0.8, Math.max(0, (ctl - 25) * 0.045));
  const aerobicPart = avgAerobic != null
    ? Math.min(0.35, Math.max(0, (avgAerobic - 2.5) * 0.23))
    : 0;
  const hrPart = avgHr != null
    ? Math.min(0.25, Math.max(0, (115 - avgHr) * 0.025))
    : 0;
  const consistencyPart = Math.min(0.35, (sessionCount / 8) * 0.35);
  const techniquePart = Math.min(0.15, techniqueAvg * 0.15);

  return Math.min(
    MAX_TRIMESTRE_OFFSET,
    ctlPart + aerobicPart + hrPart + consistencyPart + techniquePart
  );
}

function computeOffset(metrics) {
  const maturity = maturityFactor(metrics.completeSessions);
  const trimestre = trimestreOffsetRaw(metrics) * maturity;
  return {
    profile: PROFILE_OFFSET,
    trimestre: round1(trimestre),
    total: round1(PROFILE_OFFSET + trimestre),
    maturity: round1(maturity),
    breakdown: {
      ctl: round1(Math.min(0.8, Math.max(0, (metrics.ctl - 25) * 0.045)) * maturity),
      aerobico: round1(
        (metrics.avgAerobic != null
          ? Math.min(0.35, Math.max(0, (metrics.avgAerobic - 2.5) * 0.23))
          : 0) * maturity
      ),
      fc: round1(
        (metrics.avgHr != null
          ? Math.min(0.25, Math.max(0, (115 - metrics.avgHr) * 0.025))
          : 0) * maturity
      ),
      costanza: round1(Math.min(0.35, (metrics.sessionCount / 8) * 0.35) * maturity),
      tecnica: round1(Math.min(0.15, metrics.techniqueAvg * 0.15) * maturity),
    },
  };
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

  return {
    ctl,
    avgHr: fcWeight ? fcWeighted / fcWeight : null,
    avgAerobic: aerobicCount ? aerobicSum / aerobicCount : null,
    sessionCount: partialCount,
    completeSessions: complete.length,
    techniqueAvg: techniqueCount ? techniqueSum / techniqueCount : 0,
  };
}

const sessionsRaw = JSON.parse(readFileSync(SESSIONS_PATH, "utf8"));
const sessions = sessionsRaw.sessions || [];

let loadData = { baseline: { ctl: 28 }, timeline: [] };
if (existsSync(LOAD_PATH)) {
  loadData = JSON.parse(readFileSync(LOAD_PATH, "utf8"));
}

const baselineAge = round1(CHRONO_AGE - PROFILE_OFFSET);

const sessionDates = sessions
  .filter((s) => !s.partial && sessionLoad(s) != null)
  .map((s) => s.date)
  .sort();

const timelinePoints = [{
  date: TRIMESTRE_START,
  age: baselineAge,
  offset: PROFILE_OFFSET,
  sessions: 0,
  note: "Profilo: 10+ anni palestra, trimestre non ancora documentato",
}];

for (const date of sessionDates) {
  const m = metricsUpTo(sessions, loadData, date);
  const offset = computeOffset(m);
  timelinePoints.push({
    date,
    age: round1(CHRONO_AGE - offset.total),
    offset: offset.total,
    sessions: m.sessionCount,
    ctl: round1(m.ctl),
    maturity: offset.maturity,
  });
}

const today = new Date().toISOString().slice(0, 10);
const currentMetrics = metricsUpTo(sessions, loadData, today);
const currentOffset = computeOffset(currentMetrics);
const currentAge = round1(CHRONO_AGE - currentOffset.total);
const delta = round1(CHRONO_AGE - currentAge);

const out = {
  _nota: "Età biologica stimata (conservativa): profilo 10+ anni palestra (−1,2 aa) + bonus trimestre da CTL/FC/effetto aerobico/costanza/tecnica, scalato fino a 12 sessioni complete. Non è dato clinico. node tools/aggiorna-bio-age.mjs",
  trimestre: sessionsRaw.trimestre,
  updated: today,
  chronological_age: CHRONO_AGE,
  biological_age: currentAge,
  offset_years: currentOffset.total,
  delta_vs_chrono: delta,
  trend: delta >= 1.5 ? "in miglioramento" : delta >= 0.8 ? "positiva" : "in costruzione",
  methodology: {
    profile_offset: PROFILE_OFFSET,
    profile_note: "10+ anni di allenamento dilettante documentato",
    max_trimestre_offset: MAX_TRIMESTRE_OFFSET,
    maturity_sessions: MATURITY_SESSIONS,
    maturity_pct: currentOffset.maturity,
  },
  components: {
    ctl: round1(currentMetrics.ctl),
    fc_media_pesata: currentMetrics.avgHr != null ? Math.round(currentMetrics.avgHr) : null,
    effetto_aerobico_medio: currentMetrics.avgAerobic != null ? round1(currentMetrics.avgAerobic) : null,
    sessioni_documentate: currentMetrics.sessionCount,
    sessioni_complete: currentMetrics.completeSessions,
    breakdown_anni: currentOffset.breakdown,
  },
  timeline: timelinePoints,
};

writeFileSync(OUT_PATH, JSON.stringify(out, null, 2) + "\n");
console.log(`OK -> ${OUT_PATH}`);
console.log(`Età biologica: ${currentAge} anni (cronologica ${CHRONO_AGE}, −${delta} anni)`);
console.log(`  Profilo storico: −${PROFILE_OFFSET} | Trimestre Q3: −${currentOffset.trimestre} (maturità ${Math.round(currentOffset.maturity * 100)}%)`);
