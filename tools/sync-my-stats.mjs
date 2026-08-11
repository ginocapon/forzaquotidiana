#!/usr/bin/env node
/** Rigenera data/my-stats.json da fonti verificate — zero invenzioni */
import fs from "node:fs";
import path from "node:path";
import { REPO_ROOT, readJson, writeJson, todayISO, listDiarioSlugs } from "../scripts/lib/editorial-utils.mjs";

const profile = readJson("data/gino-profile.json");
const site = readJson("data/site-stats.json");
const perf = readJson("data/performance-sessions.json");
const ex = readJson("data/exercise-progress.json");
const load = readJson("data/training-load.json");

const sessions = perf?.sessions || [];
const full = sessions.filter((s) => !s.partial && s.zones).length;
const partial = sessions.filter((s) => s.partial).length;

const weights = {};
for (const e of ex?.exercises || []) {
  const max = Math.max(...(e.entries || []).map((x) => x.peso_kg || 0).filter(Boolean), 0);
  if (max) weights[`${e.id}_max`] = max;
}

const out = {
  _nota: "Solo numeri verificabili — NON inventare. Rigenerare con: node tools/sync-my-stats.mjs",
  updated: todayISO(),
  sources: [
    "data/gino-profile.json",
    "data/site-stats.json",
    "data/performance-sessions.json",
    "data/exercise-progress.json",
    "data/training-load.json",
  ],
  profile: {
    birth_date: profile?.birth_date,
    chronological_age: site?.chronological_age,
    training_start_year: profile?.training_start_year,
    training_years: site?.training_years,
  },
  sessions: {
    documented_full: full,
    documented_partial: partial,
    note: "Da performance-sessions.json",
  },
  training_load: (() => {
    const ov = load?.overrides || {};
    const dates = Object.keys(ov).sort();
    const last = dates[dates.length - 1];
    const o = last ? ov[last] : null;
    return o
      ? { ctl: o.ctl, atl: o.atl, tsb: o.tsb, source: "data/training-load.json", as_of: last }
      : null;
  })(),
  weights_kg_verified: weights,
  diario_articles: listDiarioSlugs().filter((s) => !s.startsWith("invictus") && s !== "2026-07-20-scheda-uno").length,
  iscritti_newsletter: site?.iscritti_totali ?? null,
  claims_allowed: [
    "età cronologica da birth_date",
    "anni allenamento da training_start_year",
    "dati sessione da export Zepp pubblicati",
    "pesi da exercise-progress.json",
  ],
  claims_forbidden: [
    "record non documentati",
    "percentuali body fat non misurate",
    "kg non in exercise-progress o log sessione",
  ],
};

writeJson("data/my-stats.json", out);
console.log("my-stats.json aggiornato");
