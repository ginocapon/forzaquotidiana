/**
 * Allinea layout pagine sessione allo standard 2026-08-04-scheda-2
 * - Riepilogo metabolico: .phone-shot--full sulla prima figura
 * node tools/standardizza-layout-sessioni.mjs [--dry-run]
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dirname, "..");
const SESSIONS_DIR = join(REPO, "allenamenti/sessioni");
const DRY = process.argv.includes("--dry-run");

function listSessionPages() {
  return readdirSync(SESSIONS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(SESSIONS_DIR, d.name, "index.html")))
    .map((d) => join(SESSIONS_DIR, d.name, "index.html"));
}

function addRiepilogoFullWidth(html) {
  return html.replace(
    /(<figure class="phone-shot)(?!--full)(\s*">\s*<div class="phone-shot__frame">\s*<img[^>]+riepilogo[^>]+>)/g,
    '$1 phone-shot--full$2'
  );
}

function bumpCssVersion(html) {
  return html.replace(/styles\.css\?v=\d+/g, "styles.css?v=59");
}

function patchPage(pagePath) {
  let html = readFileSync(pagePath, "utf8");
  const orig = html;
  html = addRiepilogoFullWidth(html);
  html = bumpCssVersion(html);
  const changed = html !== orig;
  if (changed && !DRY) writeFileSync(pagePath, html, "utf8");
  return { path: pagePath, changed, slug: pagePath.split("/sessioni/")[1].replace("/index.html", "") };
}

const results = listSessionPages().map(patchPage);
const updated = results.filter((r) => r.changed);
console.log(DRY ? "[dry-run] " : "", `Sessioni: ${results.length}, aggiornate: ${updated.length}`);
updated.forEach((r) => console.log(" ", r.slug));
