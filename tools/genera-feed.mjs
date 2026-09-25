#!/usr/bin/env node
/**
 * Genera feed.xml (Atom) da diario + sessioni Zepp — discovery organica / RSS.
 * node tools/genera-feed.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = dirname(fileURLToPath(import.meta.url)).replace(/\/tools$/, "");
const SITE = "https://forzaquotidiana.it";
const MAX_ITEMS = 24;

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function parseDiarioEntries() {
  const path = join(REPO, "diario/index.html");
  if (!existsSync(path)) return [];
  const html = readFileSync(path, "utf8");
  const items = [];
  const re = new RegExp(
    '<a class="diario-list__link" href="(/diario/[^"]+/)">[\\s\\S]*?<time datetime="([^"]+)">[\\s\\S]*?<h3 class="diario-list__title">([^<]+)</h3>[\\s\\S]*?<p class="diario-list__excerpt">([^<]*)</p>',
    "g"
  );
  let m;
  while ((m = re.exec(html))) {
    items.push({
      type: "diario",
      url: SITE + m[1],
      date: m[2],
      title: m[3].trim(),
      summary: m[4].trim(),
    });
  }
  return items;
}

function parseSessionEntries() {
  const path = join(REPO, "data/performance-sessions.json");
  if (!existsSync(path)) return [];
  const { sessions = [] } = JSON.parse(readFileSync(path, "utf8"));
  return sessions
    .filter((s) => s.zones && !s.partial && s.date)
    .map((s) => {
      const slug = s.id || `${s.date}-scheda-${s.scheda || ""}`;
      const title = `Sessione ${s.date}${s.scheda ? ` · Scheda ${s.scheda}` : ""}`;
      const summary = (s.note || `${s.durata || ""} · FC ${s.fc_media || "—"}`).slice(0, 200);
      return {
        type: "sessione",
        url: `${SITE}/allenamenti/sessioni/${slug}/`,
        date: s.date,
        title,
        summary,
      };
    });
}

function toAtomUpdated(isoDate) {
  return `${isoDate}T12:00:00+00:00`;
}

function buildFeed(items) {
  const sorted = items
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .slice(0, MAX_ITEMS);
  const updated =
    sorted.length > 0 ? toAtomUpdated(sorted[0].date) : new Date().toISOString();

  let entries = "";
  for (const it of sorted) {
    const id = it.url;
    const label = it.type === "diario" ? "Diario" : "Allenamento";
    entries += `  <entry>
    <title>${escapeXml(`${label}: ${it.title}`)}</title>
    <link href="${escapeXml(it.url)}"/>
    <id>${escapeXml(id)}</id>
    <updated>${escapeXml(toAtomUpdated(it.date))}</updated>
    <summary type="html">${escapeXml(it.summary)}</summary>
  </entry>
`;
  }

  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="it">
  <title>La Forza Quotidiana — Diario e sessioni</title>
  <subtitle>Diario di Gino Capon e log allenamento con dati Amazfit</subtitle>
  <link href="${SITE}/"/>
  <link rel="self" href="${SITE}/feed.xml" type="application/atom+xml"/>
  <id>${SITE}/feed.xml</id>
  <updated>${escapeXml(updated)}</updated>
  <author>
    <name>Gino Capon</name>
    <uri>${SITE}/chi-sono/</uri>
  </author>
${entries}</feed>
`;
}

const all = [...parseDiarioEntries(), ...parseSessionEntries()];
const outPath = join(REPO, "feed.xml");
writeFileSync(outPath, buildFeed(all));
console.log(`OK -> ${outPath} (${Math.min(all.length, MAX_ITEMS)} voci nel feed)`);
