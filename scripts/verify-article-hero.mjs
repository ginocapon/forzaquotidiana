#!/usr/bin/env node
/**
 * Verifica hero e figure articolo — anti-duplicati hash
 * node scripts/verify-article-hero.mjs --slug <slug>
 * node scripts/verify-article-hero.mjs --all
 */
import fs from "node:fs";
import path from "node:path";
import { REPO_ROOT, readJson, allImageHashes, fileSha256 } from "./lib/editorial-utils.mjs";

const args = process.argv.slice(2);
const slug = args.includes("--slug") ? args[args.indexOf("--slug") + 1] : null;
const all = args.includes("--all");

function verifyItem(item) {
  const failures = [];
  const hero = item.paths?.hero;
  const figures = item.paths?.figures || [];
  const htmlPath = item.paths?.html || `diario/${item.slug}/index.html`;

  if (!fs.existsSync(path.join(REPO_ROOT, htmlPath))) {
    failures.push(`HTML mancante: ${htmlPath}`);
  }

  const hashes = allImageHashes();
  const required = [hero, ...figures].filter(Boolean);

  if (required.length < 3) {
    failures.push("Servono hero + almeno 2 figure in paths");
  }

  for (const rel of required) {
    const full = path.join(REPO_ROOT, rel);
    if (!fs.existsSync(full)) {
      failures.push(`Asset mancante: ${rel}`);
      continue;
    }
    if (!rel.endsWith(".webp")) failures.push(`${rel}: deve essere WebP`);
    const stat = fs.statSync(full);
    if (rel.includes("-hero.") && stat.size > 180 * 1024) {
      failures.push(`${rel}: hero >180KiB (${Math.round(stat.size / 1024)}KiB)`);
    }
    const hash = fileSha256(rel);
    const dupes = (hashes.get(hash) || []).filter((p) => p !== rel);
    if (dupes.length) {
      failures.push(`${rel}: hash duplicato di ${dupes[0]}`);
    }
  }

  if (hero) {
    const html = fs.existsSync(path.join(REPO_ROOT, htmlPath))
      ? fs.readFileSync(path.join(REPO_ROOT, htmlPath), "utf8")
      : "";
    if (!html.includes(hero.replace(/^\//, "")) && !html.includes(path.basename(hero))) {
      failures.push("Hero non referenziato in HTML");
    }
    if (!html.includes('property="og:image"') || !html.includes(path.basename(hero))) {
      failures.push("og:image non allineato a hero");
    }
  }

  return failures;
}

let exitCode = 0;

if (all) {
  const queue = readJson("data/editorial-queue.json");
  for (const item of queue?.items || []) {
    if (item.status === "published") {
      const f = verifyItem(item);
      if (f.length) {
        console.error(`${item.slug}: FAIL`);
        f.forEach((x) => console.error(`  - ${x}`));
        exitCode = 1;
      } else console.log(`${item.slug}: OK`);
    }
  }
} else if (slug) {
  const queue = readJson("data/editorial-queue.json");
  const item = queue?.items?.find((i) => i.slug === slug) || { slug, paths: {} };
  const htmlPath = `diario/${slug}/index.html`;
  if (!item.paths?.hero && fs.existsSync(path.join(REPO_ROOT, htmlPath))) {
    const html = fs.readFileSync(path.join(REPO_ROOT, htmlPath), "utf8");
    const m = html.match(/og:image"\s+content="[^"]+\/([^"/]+\.webp)"/i);
    if (m) item.paths = { ...item.paths, html: htmlPath, hero: `img/diario/*/${m[1]}` };
  }
  const failures = verifyItem(item);
  if (failures.length) {
    console.error("verify_article_hero: FAIL");
    failures.forEach((f) => console.error(`- ${f}`));
    exitCode = 1;
  } else console.log("verify_article_hero: OK");
} else {
  console.error("Uso: --slug NAME | --all");
  exitCode = 1;
}

process.exit(exitCode);
