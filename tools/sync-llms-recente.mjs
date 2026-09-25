#!/usr/bin/env node
/**
 * Aggiunge a llms.txt (sezione Contenuto recente) sessioni e articoli mancanti.
 * node tools/sync-llms-recente.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = dirname(fileURLToPath(import.meta.url)).replace(/\/tools$/, "");
const LLMS = join(REPO, "llms.txt");
const SESSIONS = join(REPO, "data/performance-sessions.json");

function sessionLines() {
  if (!existsSync(SESSIONS)) return [];
  const { sessions = [] } = JSON.parse(readFileSync(SESSIONS, "utf8"));
  return sessions
    .filter((s) => s.zones && !s.partial)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 8)
    .map((s) => {
      const slug = s.id;
      const url = `https://forzaquotidiana.it/allenamenti/sessioni/${slug}/`;
      const d = s.date;
      const dd = `${d.slice(8, 10)}/${d.slice(5, 7)}/${d.slice(0, 4)}`;
      const note = (s.note || "").slice(0, 140);
      return `- [Sessione ${dd} Scheda ${s.scheda || "?"}](${url}): ${note}`;
    });
}

function main() {
  let txt = readFileSync(LLMS, "utf8");
  const marker = "## Contenuto recente\n";
  if (!txt.includes(marker)) {
    console.error("sync-llms-recente: sezione Contenuto recente non trovata");
    process.exit(1);
  }
  const lines = sessionLines();
  let added = 0;
  for (const line of lines) {
    const url = line.match(/\((https:[^)]+)\)/)?.[1];
    if (url && !txt.includes(url)) {
      txt = txt.replace(marker, marker + line + "\n");
      added++;
    }
  }
  writeFileSync(LLMS, txt);
  console.log(`OK -> llms.txt (+${added} sessioni)`);
}

main();
