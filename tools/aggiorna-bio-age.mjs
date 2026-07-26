/**
 * Calcola età biologica da export Zepp/Amazfit + profilo forza reale.
 * Pensato per dilettante maturo con anni di palestra e forza sopra la media
 * (anche rispetto a molti trentenni in sala).
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
/** 10+ anni palestra con forza consolidata — già molto sotto il cronologico */
const PROFILE_OFFSET = 3;
/** Bonus forza da carico, anaerobico e volume (sopra media sala) */
const MAX_STRENGTH_OFFSET = 1.4;
/** Bonus trimestre documentato (con 8+ sessioni complete) */
const MAX_TRIMESTRE_OFFSET = 2.2;
/** Tetto totale per lifter maturo forte e costante */
const MAX_TOTAL_OFFSET = 6.5;
const MATURITY_SESSIONS = 8;

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

function avgOf(list) {
  return list.length ? list.reduce((a, b) => a + b, 0) / list.length : null;
}

function strengthOffsetRaw(complete) {
  const anaerobic = complete
    .map((s) => s.effetto_anaerobico)
    .filter((v) => v != null);
  const loads = complete.map((s) => sessionLoad(s)).filter((v) => v != null);
  const gruppi = complete.map((s) => s.gruppi).filter((v) => v != null);

  const anaerobicAvg = avgOf(anaerobic);
  const loadAvg = avgOf(loads);
  const gruppiAvg = avgOf(gruppi);

  const anaerobicPart = anaerobicAvg != null
    ? Math.min(0.55, Math.max(0, (anaerobicAvg - 2.2) * 0.5))
    : 0;
  const loadPart = loadAvg != null
    ? Math.min(0.5, Math.max(0, (loadAvg - 45) * 0.012))
    : 0;
  const volumePart = gruppiAvg != null
    ? Math.min(0.35, Math.max(0, (gruppiAvg - 16) * 0.035))
    : 0;

  return Math.min(MAX_STRENGTH_OFFSET, anaerobicPart + loadPart + volumePart);
}

function trimestreOffsetRaw({ ctl, avgAerobic, avgHr, sessionCount, techniqueAvg }) {
  const ctlPart = Math.min(1, Math.max(0, (ctl - 22) * 0.06));
  const aerobicPart = avgAerobic != null
    ? Math.min(0.5, Math.max(0, (avgAerobic - 2) * 0.38))
    : 0;
  const hrPart = avgHr != null
    ? Math.min(0.4, Math.max(0, (116 - avgHr) * 0.035))
    : 0;
  const consistencyPart = Math.min(0.45, (sessionCount / 10) * 0.45);
  const techniquePart = Math.min(0.25, techniqueAvg * 0.25);

  return Math.min(
    MAX_TRIMESTRE_OFFSET,
    ctlPart + aerobicPart + hrPart + consistencyPart + techniquePart
  );
}

function computeOffset(metrics, completeSessions) {
  const maturity = maturityFactor(metrics.completeSessions);
  const strength = strengthOffsetRaw(completeSessions);
  const trimestre = trimestreOffsetRaw(metrics) * maturity;
  const total = Math.min(MAX_TOTAL_OFFSET, PROFILE_OFFSET + strength + trimestre);

  return {
    profile: PROFILE_OFFSET,
    strength: round1(strength),
    trimestre: round1(trimestre),
    total: round1(total),
    maturity: round1(maturity),
    breakdown: {
      forza_anaerobica: round1(
        (avgOf(completeSessions.map((s) => s.effetto_anaerobico).filter((v) => v != null)) != null
          ? Math.min(0.55, Math.max(0, (avgOf(completeSessions.map((s) => s.effetto_anaerobico).filter((v) => v != null)) - 2.2) * 0.5))
          : 0)
      ),
      ctl: round1(Math.min(1, Math.max(0, (metrics.ctl - 22) * 0.06)) * maturity),
      aerobico: round1(
        (metrics.avgAerobic != null
          ? Math.min(0.5, Math.max(0, (metrics.avgAerobic - 2) * 0.38))
          : 0) * maturity
      ),
      fc: round1(
        (metrics.avgHr != null
          ? Math.min(0.4, Math.max(0, (116 - metrics.avgHr) * 0.035))
          : 0) * maturity
      ),
      costanza: round1(Math.min(0.45, (metrics.sessionCount / 10) * 0.45) * maturity),
      tecnica: round1(Math.min(0.25, metrics.techniqueAvg * 0.25) * maturity),
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
    complete,
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
  note: "Profilo: 10+ anni forza in palestra",
}];

for (const date of sessionDates) {
  const m = metricsUpTo(sessions, loadData, date);
  const offset = computeOffset(m, m.complete);
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
const currentOffset = computeOffset(currentMetrics, currentMetrics.complete);
const currentAge = round1(CHRONO_AGE - currentOffset.total);
const delta = round1(CHRONO_AGE - currentAge);

const out = {
  _nota: "Età biologica stimata: profilo forza 10+ anni (−3 aa) + componente forza Zepp + bonus trimestre. Per lifter maturo forte, non dato clinico. node tools/aggiorna-bio-age.mjs",
  trimestre: sessionsRaw.trimestre,
  updated: today,
  chronological_age: CHRONO_AGE,
  biological_age: currentAge,
  offset_years: currentOffset.total,
  delta_vs_chrono: delta,
  trend: delta >= 4 ? "in miglioramento" : delta >= 2.5 ? "positiva" : "in costruzione",
  methodology: {
    profile_offset: PROFILE_OFFSET,
    profile_note: "10+ anni palestra, forza sopra media anche vs trentenni in sala",
    strength_offset: currentOffset.strength,
    max_trimestre_offset: MAX_TRIMESTRE_OFFSET,
    max_total_offset: MAX_TOTAL_OFFSET,
    maturity_sessions: MATURITY_SESSIONS,
    maturity_pct: currentOffset.maturity,
  },
  components: {
    ctl: round1(currentMetrics.ctl),
    fc_media_pesata: currentMetrics.avgHr != null ? Math.round(currentMetrics.avgHr) : null,
    effetto_aerobico_medio: currentMetrics.avgAerobic != null ? round1(currentMetrics.avgAerobic) : null,
    effetto_anaerobico_medio: avgOf(
      currentMetrics.complete.map((s) => s.effetto_anaerobico).filter((v) => v != null)
    ) != null
      ? round1(avgOf(currentMetrics.complete.map((s) => s.effetto_anaerobico).filter((v) => v != null)))
      : null,
    sessioni_documentate: currentMetrics.sessionCount,
    sessioni_complete: currentMetrics.completeSessions,
    breakdown_anni: currentOffset.breakdown,
  },
  timeline: timelinePoints,
};

writeFileSync(OUT_PATH, JSON.stringify(out, null, 2) + "\n");
console.log(`OK -> ${OUT_PATH}`);
console.log(`Età biologica: ${currentAge} anni (cronologica ${CHRONO_AGE}, −${delta} anni)`);
console.log(`  Profilo forza: −${PROFILE_OFFSET} | Forza Zepp: −${currentOffset.strength} | Trimestre: −${currentOffset.trimestre}`);
