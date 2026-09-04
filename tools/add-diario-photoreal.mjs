#!/usr/bin/env node
/**
 * Aggiunge immagine fotorealistica IA agli articoli diario (retrofit + generate)
 * node tools/add-diario-photoreal.mjs --patch          # solo HTML se webp esiste
 * node tools/add-diario-photoreal.mjs --slug SLUG --patch
 * node tools/add-diario-photoreal.mjs --generate       # richiede OPENAI_API_KEY
 * node tools/add-diario-photoreal.mjs --copy-existing  # copia copy_from → -realistic.webp
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import sharp from "sharp";
import { REPO_ROOT, readJson } from "../scripts/lib/editorial-utils.mjs";
import { generateImagePng, hasApiKey } from "../scripts/lib/llm-client.mjs";

const args = process.argv.slice(2);
const slugArg = args.includes("--slug") ? args[args.indexOf("--slug") + 1] : null;
const doPatch = args.includes("--patch");
const doGenerate = args.includes("--generate");
const doCopy = args.includes("--copy-existing");

function slugBase(slug) {
  return slug.replace(/-57-anni$/, "");
}

function realisticRel(item) {
  return `img/diario/${item.date}/${slugBase(item.slug)}-realistic.webp`;
}

function figureHtml(item, rel) {
  return `
    <figure class="article-figure">
      <span class="ai-photo-wrap">
        <img src="/${rel}" alt="${item.alt}" width="1200" height="800" loading="lazy" data-ai="generated" class="diario-photo--fotoreal">
        <span class="ai-photo-mark" aria-hidden="true">Foto AI</span>
      </span>
      <figcaption>${item.caption} · <span class="fig-credit"><span class="ai-badge" aria-hidden="true">IA</span> Immagine fotorealistica generata con intelligenza artificiale · <a href="/trasparenza-ai/">Trasparenza</a></span></figcaption>
    </figure>`;
}

function patchHtml(item, rel) {
  const htmlPath = path.join(REPO_ROOT, "diario", item.slug, "index.html");
  if (!fs.existsSync(htmlPath)) {
    console.warn(`SKIP HTML: ${item.slug}`);
    return false;
  }
  let html = fs.readFileSync(htmlPath, "utf8");
  if (html.includes("-realistic.webp") || html.includes("diario-photo--fotoreal")) {
    console.log(`SKIP patch (già presente): ${item.slug}`);
    return true;
  }
  const block = figureHtml(item, rel);
  if (html.includes('<div class="article-lead">')) {
    html = html.replace(
      /(<div class="article-lead">[\s\S]*?<\/div>\s*)/,
      `$1${block}\n`
    );
  } else if (html.includes("</h1>")) {
    html = html.replace("</h1>", `</h1>${block}`);
  } else {
    console.warn(`SKIP patch (no anchor): ${item.slug}`);
    return false;
  }
  fs.writeFileSync(htmlPath, html);
  console.log(`PATCH: ${item.slug}`);
  return true;
}

async function pngToWebp(pngPath, webpPath) {
  fs.mkdirSync(path.dirname(webpPath), { recursive: true });
  await sharp(pngPath)
    .rotate()
    .resize(1200, 800, { fit: "cover", position: "centre" })
    .webp({ quality: 72 })
    .toFile(webpPath);
}

async function generateOne(item, imgSkin) {
  const rel = realisticRel(item);
  const webpPath = path.join(REPO_ROOT, rel);
  if (fs.existsSync(webpPath)) {
    console.log(`SKIP generate (esiste): ${rel}`);
    return rel;
  }
  const prefix = imgSkin.style_prefix;
  const prompt = `${prefix}. ${item.prompt}. ${imgSkin.disclosure}. no text overlay, no cartoon, no manga`;
  const tmpDir = path.join(REPO_ROOT, "guardian/memory/tmp-images");
  fs.mkdirSync(tmpDir, { recursive: true });
  const pngTmp = path.join(tmpDir, `${item.slug}-realistic.png`);
  console.log(`GENERATE: ${item.slug}…`);
  const buf = await generateImagePng(prompt);
  fs.writeFileSync(pngTmp, buf);
  await pngToWebp(pngTmp, webpPath);
  fs.unlinkSync(pngTmp);
  console.log(`OK: ${rel}`);
  return rel;
}

async function copyExisting(item) {
  const rel = realisticRel(item);
  const webpPath = path.join(REPO_ROOT, rel);
  if (fs.existsSync(webpPath)) return rel;
  if (!item.copy_from) return null;
  const src = path.join(REPO_ROOT, item.copy_from);
  if (!fs.existsSync(src)) {
    console.warn(`copy_from mancante: ${item.copy_from}`);
    return null;
  }
  fs.mkdirSync(path.dirname(webpPath), { recursive: true });
  await sharp(src).rotate().resize(1200, 800, { fit: "cover" }).webp({ quality: 72 }).toFile(webpPath);
  console.log(`COPY: ${item.copy_from} → ${rel}`);
  return rel;
}

export async function processItem(item, imgSkin, opts) {
  let rel = realisticRel(item);
  if (opts.copy && item.copy_from) rel = (await copyExisting(item)) || rel;
  if (opts.generate && item.prompt && hasApiKey()) rel = await generateOne(item, imgSkin);
  if (opts.patch && fs.existsSync(path.join(REPO_ROOT, rel))) patchHtml(item, rel);
  return rel;
}

async function main() {
  const manifest = readJson("data/diario-photoreal-manifest.json");
  const imgSkin = readJson("data/editorial-image-skin.json").style_fotoreal;
  const items = slugArg ? manifest.items.filter((i) => i.slug === slugArg) : manifest.items;
  const opts = { patch: doPatch, generate: doGenerate, copy: doCopy || true };

  if (!doPatch && !doGenerate && !doCopy) {
    console.error("Uso: --patch | --generate | --copy-existing [--slug SLUG]");
    process.exit(1);
  }

  for (const item of items) {
    await processItem(item, imgSkin, opts);
  }

  if (doPatch || doCopy) {
    spawnSync("node", ["scripts/audit-diario-photoreal.mjs"], { cwd: REPO_ROOT, stdio: "inherit" });
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
