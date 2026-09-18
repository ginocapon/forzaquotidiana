#!/usr/bin/env node
/**
 * Estrae trend readiness da performance-sessions.json per grafici hub.
 * node tools/aggiorna-wellness-trends.mjs [--audit]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = dirname(dirname(fileURLToPath(import.meta.url)));
const sessionsPath = join(REPO, "data/performance-sessions.json");
const outPath = join(REPO, "data/wellness-trends.json");

function parseDurationToMin(str) {
  if (!str || typeof str !== "string") return null;
  const m = str.match(/^(\d+):(\d+)$/);
  if (!m) return null;
  return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
}

function schedaLabel(s) {
  if (s.codice) return s.codice;
  if (s.scheda_label) return s.scheda_label;
  if (s.scheda) return "S" + s.scheda;
  return s.id;
}

const data = JSON.parse(readFileSync(sessionsPath, "utf8"));
const points = [];
const gaps = [];

for (const s of data.sessions || []) {
  if (!s.date) continue;
  const r = s.readiness || {};
  const tsb = s.tsb || {};
  const sleepMin = parseDurationToMin(r.sleep_duration);

  const point = {
    id: s.id,
    date: s.date,
    codice: schedaLabel(s),
    partial: !!s.partial,
    fc_media: s.fc_media ?? null,
    fc_max: s.fc_max ?? null,
    sleep_min: sleepMin,
    sleep_duration: r.sleep_duration ?? null,
    sleep_score: r.sleep_score ?? null,
    hrv: r.hrv ?? null,
    hrv_label: r.hrv_label ?? null,
    hybridcharge_wake: r.hybridcharge_wake ?? null,
    resting_hr: r.resting_hr ?? null,
    tsb: tsb.value ?? null,
    tsb_label: tsb.label ?? null,
    ctl: tsb.fitness_ctl ?? null,
    atl: tsb.fatigue_atl ?? null,
    effort_day: r.effort_day ?? null,
    effort_goal: r.effort_goal ?? null,
    sleep_hr_night: r.sleep_hr_night ?? null,
  };
  points.push(point);

  if (s.partial) {
    gaps.push({ id: s.id, issue: "export parziale" });
    continue;
  }
  const missing = [];
  if (s.fc_media == null) missing.push("fc_media");
  if (sleepMin == null && r.sleep_score == null) missing.push("sonno");
  if (r.hrv == null) missing.push("hrv");
  if (tsb.value == null) missing.push("tsb");
  if (missing.length) gaps.push({ id: s.id, issue: "readiness incompleto: " + missing.join(", ") });
}

points.sort((a, b) => a.date.localeCompare(b.date));

const report = {
  updated: new Date().toISOString().slice(0, 10),
  source: "data/performance-sessions.json",
  sessions_total: points.length,
  sessions_with_readiness: points.filter((p) => p.hrv != null || p.sleep_min != null).length,
  sessions_with_tsb: points.filter((p) => p.tsb != null).length,
  gaps,
  points,
};

writeFileSync(outPath, JSON.stringify(report, null, 2) + "\n");

console.log(`OK -> ${outPath}`);
console.log(`  ${report.sessions_with_readiness}/${report.sessions_total} con readiness · ${report.sessions_with_tsb} con TSB`);
if (gaps.length) {
  console.log(`  ⚠ ${gaps.length} gap:`);
  gaps.slice(0, 8).forEach((g) => console.log(`    - ${g.id}: ${g.issue}`));
  if (gaps.length > 8) console.log(`    … +${gaps.length - 8}`);
}

if (process.argv.includes("--audit") && gaps.length) process.exit(1);
