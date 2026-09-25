/**
 * Conteggi home + età cronologica + anni palestra + sync età biologica.
 * node tools/aggiorna-site-stats.mjs
 *
 * Dopo nuova sessione o articolo diario: eseguire questo script.
 * Mensile (con export Zepp): idem + verifica biological-age.json.
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = dirname(fileURLToPath(import.meta.url));
const REPO = dirname(ROOT);

const PROFILE_PATH = join(REPO, "data/gino-profile.json");
const OUT_PATH = join(REPO, "data/site-stats.json");
const SESSIONS_PATH = join(REPO, "data/performance-sessions.json");
const DIARIO_DIR = join(REPO, "diario");

function chronologicalAge(birthDate, at = new Date()) {
  const [y, m, d] = birthDate.split("-").map(Number);
  let age = at.getFullYear() - y;
  const month = at.getMonth() + 1;
  if (month < m || (month === m && at.getDate() < d)) age -= 1;
  return age;
}

function trainingYears(startYear, at = new Date()) {
  return at.getFullYear() - startYear;
}

function countDiarioArticles() {
  const indexPath = join(DIARIO_DIR, "index.html");
  if (!existsSync(indexPath)) return 0;
  const html = readFileSync(indexPath, "utf8");
  const slugs = [...html.matchAll(/href="\/diario\/([^"\/]+)\//g)].map((m) => m[1]);
  return new Set(slugs).size;
}

function countSessionsDocumented() {
  if (!existsSync(SESSIONS_PATH)) return 0;
  const { sessions = [] } = JSON.parse(readFileSync(SESSIONS_PATH, "utf8"));
  return sessions.filter((s) => s.zones && !s.partial).length;
}

function latestDiarioFromIndex() {
  const indexPath = join(DIARIO_DIR, "index.html");
  if (!existsSync(indexPath)) return null;
  const html = readFileSync(indexPath, "utf8");
  const m = html.match(
    /<a class="diario-list__link" href="(\/diario\/[^"]+\/)">[\s\S]*?<time datetime="([^"]+)">[\s\S]*?<h3 class="diario-list__title">([^<]+)<\/h3>/
  );
  if (!m) return null;
  return {
    type: "diario",
    date: m[2],
    url: `https://forzaquotidiana.it${m[1]}`,
    title: m[3].trim(),
  };
}

function latestSessionFromJson() {
  if (!existsSync(SESSIONS_PATH)) return null;
  const { sessions = [] } = JSON.parse(readFileSync(SESSIONS_PATH, "utf8"));
  const complete = sessions.filter((s) => s.zones && !s.partial && s.date);
  if (!complete.length) return null;
  const s = complete.reduce((a, b) => (a.date >= b.date ? a : b));
  const slug = s.id;
  return {
    type: "sessione",
    date: s.date,
    url: `https://forzaquotidiana.it/allenamenti/sessioni/${slug}/`,
    title: `Sessione ${s.date}${s.scheda ? ` · Scheda ${s.scheda}` : ""}`,
  };
}

function pickLatestContent() {
  const d = latestDiarioFromIndex();
  const s = latestSessionFromJson();
  if (!d && !s) return null;
  if (!d) return s;
  if (!s) return d;
  return d.date >= s.date ? d : s;
}

const profile = JSON.parse(readFileSync(PROFILE_PATH, "utf8"));
const today = new Date().toISOString().slice(0, 10);
const chrono = chronologicalAge(profile.birth_date);
const training = trainingYears(profile.training_start_year);

let prev = {};
if (existsSync(OUT_PATH)) {
  try {
    prev = JSON.parse(readFileSync(OUT_PATH, "utf8"));
  } catch {
    /* ignore */
  }
}

const latest = pickLatestContent();

const out = {
  _nota:
    "Conteggi pubblici (no email). Aggiornato da tools/aggiorna-site-stats.mjs. Età cronologica: compleanno 27 gennaio.",
  updated: today,
  birth_date: profile.birth_date,
  training_start_year: profile.training_start_year,
  chronological_age: chrono,
  training_years: training,
  diario_articles: countDiarioArticles(),
  sessions_documented: countSessionsDocumented(),
  latest_content_date: latest?.date ?? null,
  latest_content_type: latest?.type ?? null,
  latest_content_url: latest?.url ?? null,
  latest_content_title: latest?.title ?? null,
  iscritti_totali: prev.iscritti_totali ?? null,
  accessi_scheda_settimana: prev.accessi_scheda_settimana ?? null,
  ultimo_controllo: prev.ultimo_controllo ?? null,
};

writeFileSync(OUT_PATH, JSON.stringify(out, null, 2) + "\n");
console.log(`OK -> ${OUT_PATH}`);
console.log(
  `Età cronologica: ${chrono} (compleanno ${profile.birthday_label}) · Palestra: ${training} anni · Diario: ${out.diario_articles} · Sessioni Zepp: ${out.sessions_documented}`
);

const bio = spawnSync("node", ["tools/aggiorna-bio-age.mjs"], {
  cwd: REPO,
  stdio: "inherit",
});

if (bio.status !== 0) {
  console.error("aggiorna-bio-age.mjs fallito");
  process.exit(bio.status || 1);
}
