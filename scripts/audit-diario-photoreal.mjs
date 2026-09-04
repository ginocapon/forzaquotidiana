#!/usr/bin/env node
/**
 * Audit mix fotorealistico articoli diario
 * node scripts/audit-diario-photoreal.mjs [--slug SLUG] [--all]
 */
import fs from "node:fs";
import path from "node:path";
import { REPO_ROOT } from "./lib/editorial-utils.mjs";

const args = process.argv.slice(2);
const slugArg = args.includes("--slug") ? args[args.indexOf("--slug") + 1] : null;
const all = args.includes("--all") || !slugArg;

function listDiarioSlugs() {
  const dir = path.join(REPO_ROOT, "diario");
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(dir, d.name, "index.html")))
    .map((d) => d.name)
    .filter((s) => s !== "index");
}

function extractBodyImages(html) {
  const main = html.match(/<main[\s\S]*?<\/main>/i)?.[0] || html;
  const imgs = [...main.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  return imgs;
}

function hasDocumentalReal(imgTag) {
  if (/data-ai=/i.test(imgTag)) return false;
  if (/\/img\/esercizi\//i.test(imgTag)) return false;
  if (/arnold|pianta|cartoon|manga|vignetta|illustrazione cartoon|diagramma|schema|figura originale/i.test(imgTag))
    return false;
  return /gino|selfie|spogliatoio|mare|palestra|technogym/i.test(imgTag);
}

function hasPhotorealAi(imgTag) {
  if (/diario-photo--fotoreal/i.test(imgTag)) return true;
  if (/-realistic\.webp/i.test(imgTag)) return true;
  if (/fotorealist/i.test(imgTag)) return true;
  return false;
}

export function auditDiarioHtml(html, slug) {
  const imgs = extractBodyImages(html);
  if (!imgs.length) {
    return { slug, ok: false, reason: "nessuna immagine nel corpo articolo", imgs: 0 };
  }
  const documental = imgs.filter(hasDocumentalReal);
  const photoreal = imgs.filter(hasPhotorealAi);
  const ok = documental.length > 0 || photoreal.length > 0;
  return {
    slug,
    ok,
    reason: ok
      ? documental.length
        ? "foto documentale reale"
        : "IA fotorealistica"
      : "solo cartoon/diagrammi — manca fotoreal o foto reale",
    imgs: imgs.length,
    documental: documental.length,
    photoreal: photoreal.length,
  };
}

function auditSlug(slug) {
  const htmlPath = path.join(REPO_ROOT, "diario", slug, "index.html");
  if (!fs.existsSync(htmlPath)) return { slug, ok: false, reason: "HTML mancante" };
  const html = fs.readFileSync(htmlPath, "utf8");
  if (/http-equiv="refresh"/i.test(html) && !/<h1\b/i.test(html)) {
    return { slug, ok: true, reason: "redirect — escluso", skip: true };
  }
  return auditDiarioHtml(html, slug);
}

let exitCode = 0;
const slugs = slugArg ? [slugArg] : listDiarioSlugs();

if (all && !slugArg) {
  const results = slugs.map(auditSlug).filter((r) => !r.skip);
  const fail = results.filter((r) => !r.ok);
  for (const r of results) {
    console.log(`${r.ok ? "OK" : "FAIL"} · ${r.slug} · ${r.reason}${r.imgs != null ? ` (${r.imgs} img)` : ""}`);
  }
  console.log(`\n${results.length - fail.length}/${results.length} articoli conformi`);
  if (fail.length) exitCode = 1;
} else {
  const r = auditSlug(slugArg);
  console.log(`${r.ok ? "OK" : "FAIL"} · ${r.slug} · ${r.reason}`);
  if (!r.ok) exitCode = 1;
}

process.exit(exitCode);
