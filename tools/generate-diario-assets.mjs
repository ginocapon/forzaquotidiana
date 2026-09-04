#!/usr/bin/env node
/**
 * Genera contenuto + immagini per un item della editorial-queue
 * node tools/generate-diario-assets.mjs --slug SLUG
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { REPO_ROOT, readJson, writeJson, todayISO } from "../scripts/lib/editorial-utils.mjs";
import { chatJson, generateImagePng, hasApiKey } from "../scripts/lib/llm-client.mjs";
import { renderDiarioHtml } from "./render-diario-html.mjs";

const args = process.argv.slice(2);
const slug = args.includes("--slug") ? args[args.indexOf("--slug") + 1] : null;

function loadSkin() {
  return readJson("data/editorial-skin.json");
}

function loadImageSkin() {
  return readJson("data/editorial-image-skin.json");
}

function imageSkinForItem(item, imgSkin) {
  const serio = item.tone === "tecnico" || item.cluster?.startsWith("tecnico");
  return serio ? imgSkin.style_serio || imgSkin : imgSkin.style_goliardico || imgSkin;
}

function referenceExcerpt(item) {
  const skin = loadSkin();
  const refs = item?.tone === "tecnico" || item?.fiction === false
    ? skin.reference_articles?.tecnico || skin.reference_articles
    : skin.reference_articles?.goliardico || skin.reference_articles;
  const list = Array.isArray(refs) ? refs : Object.values(refs || {}).flat();
  const chunks = [];
  for (const rel of list) {
    const p = path.join(REPO_ROOT, rel);
    if (!fs.existsSync(p)) continue;
    const html = fs.readFileSync(p, "utf8");
    const lead = html.match(/class="article-lead"[\s\S]*?<\/div>/i)?.[0]?.slice(0, 500) || "";
    chunks.push(lead);
  }
  return chunks.join("\n---\n").slice(0, 2000);
}

function buildPaths(item, date) {
  const base = item.slug.replace(/-57-anni$/, "");
  return {
    html: `diario/${item.slug}/index.html`,
    hero: `img/diario/${date}/${base}-hero.webp`,
    figures: [
      `img/diario/${date}/${base}-fig1.webp`,
      `img/diario/${date}/${base}-fig2.webp`,
    ],
    realistic: `img/diario/${date}/${base}-realistic.webp`,
  };
}

async function generateContent(item) {
  const skin = loadSkin();
  const stats = readJson("data/my-stats.json");
  const system = `Sei lo scrittore del diario "La Forza Quotidiana" di Gino Capon.
Rispondi SOLO con JSON valido (nessun markdown).
Tono: ${item.tone}. Finzione: ${item.fiction}.
Regole: ${skin.voice.forbidden.join("; ")}.
Numeri ammessi SOLO: ${JSON.stringify(stats?.claims_allowed || [])}.
NON inventare kg, PR, percentuali body fat.
Struttura JSON:
{
  "title": "max 60 char con | Gino",
  "meta_description": "max 160 char",
  "h1": "diverso da title",
  "og_title": "opzionale",
  "breadcrumb": "breve",
  "aeo_label": "Sintesi Articolo",
  "aeo_lead": "2-3 frasi HTML con <strong> keyword",
  "hero_alt": "...",
  "hero_caption": "...",
  "sections": [{"h2":"...","paragraphs":["<p> con link interni HTML"],"h3":[{"title":"...","paragraphs":[]}]}],
  "figures": [{"alt":"...","caption":"..."},{"alt":"...","caption":"..."}],
  "faq": [{"q":"...","a":"..."}],
  "image_prompts": {"hero":"...","fig1":"...","fig2":"...","realistic":"..."}
}
Minimo ${skin.structure.h2_min} sezioni H2, ${skin.structure.faq_min} FAQ, ${skin.structure.words_min} parole totali nei paragrafi.
Link obbligatori nel testo: /diario/ /allenamenti/ /chi-sono/ — NO /allenamenti/sessioni/`;

  const user = `Keyword: ${item.kw_primary}
Intent: ${item.intent}
Cluster: ${item.cluster}
Slug: ${item.slug}
Brief hero: ${item.hero_brief || item.hero_concept}

Esempio tono dal sito:
${referenceExcerpt(item)}

Angolo trending settimana: ${item.trending_title || "n/a"}`;

  return chatJson(system, user);
}

function resolveImageSkin(item) {
  const imgSkin = loadImageSkin();
  return imageSkinForItem(item, imgSkin);
}

function pngToWebp(pngPath, webpPath, w, h, quality = 62) {
  fs.mkdirSync(path.dirname(webpPath), { recursive: true });
  const vf = w && h ? `scale=${w}:${h}:force_original_aspect_ratio=decrease,pad=${w}:${h}:(ow-iw)/2:(oh-ih)/2:color=0x1a1410` : `scale=${w || 1200}:-1`;
  spawnSync(
    "ffmpeg",
    ["-y", "-i", pngPath, "-vf", vf, "-c:v", "libwebp", "-quality", String(quality), webpPath],
    { stdio: "pipe" }
  );
  fs.unlinkSync(pngPath);
}

async function generateImages(item, article, paths, imgSkinFull) {
  const imgSkin = imageSkinForItem(item, imgSkinFull);
  const fotoSkin = imgSkinFull.style_fotoreal || imgSkinFull;
  const prefix = imgSkin.style_prefix || imgSkinFull.legacy_style_prefix || imgSkinFull.style_prefix;
  const fotoPrefix = fotoSkin.style_prefix || prefix;
  const prompts = article.image_prompts || {};
  const tmpDir = path.join(REPO_ROOT, "guardian/memory/tmp-images");
  fs.mkdirSync(tmpDir, { recursive: true });

  const jobs = [
    { key: "hero", out: paths.hero, prompt: prompts.hero || item.hero_brief, w: imgSkinFull.hero?.width || 1600, h: imgSkinFull.hero?.height || 760, skin: prefix, q: 60 },
    { key: "fig1", out: paths.figures[0], prompt: prompts.fig1 || article.figures?.[0]?.alt, w: imgSkinFull.figure?.width || 1200, h: null, skin: prefix, q: 65 },
    { key: "fig2", out: paths.figures[1], prompt: prompts.fig2 || article.figures?.[1]?.alt, w: imgSkinFull.figure?.width || 1200, h: null, skin: prefix, q: 65 },
    { key: "realistic", out: paths.realistic, prompt: prompts.realistic || article.realistic_alt || `Gino Capon age 57 training in gym related to ${item.kw_primary}`, w: imgSkinFull.figure?.width || 1200, h: 800, skin: fotoPrefix, q: 72 },
  ];

  for (const job of jobs) {
    if (!job.out) continue;
    const fullPrompt = `${job.skin}. ${job.prompt}. ${imgSkin.disclosure || fotoSkin.disclosure}. ${imgSkin.negative || imgSkinFull.negative || ""}`;
    const pngTmp = path.join(tmpDir, `${item.slug}-${job.key}.png`);
    const webpOut = path.join(REPO_ROOT, job.out);
    console.log(`  Immagine ${job.key}…`);
    const buf = await generateImagePng(fullPrompt);
    fs.writeFileSync(pngTmp, buf);
    pngToWebp(pngTmp, webpOut, job.w, job.h, job.q);
  }
}

export async function generateDiarioAssets(item) {
  if (!hasApiKey()) {
    throw new Error("OPENAI_API_KEY mancante — aggiungi secret GitHub per autopilot");
  }
  const date = todayISO();
  const paths = item.paths?.hero ? item.paths : buildPaths(item, date);
  item.paths = paths;

  console.log(`Generazione contenuto: ${item.slug}`);
  const article = await generateContent(item);

  console.log(`Generazione immagini: ${item.slug}`);
  await generateImages(item, article, paths, loadImageSkin());

  const html = renderDiarioHtml(article, item, paths, date);
  const htmlPath = path.join(REPO_ROOT, paths.html);
  fs.mkdirSync(path.dirname(htmlPath), { recursive: true });
  fs.writeFileSync(htmlPath, html);

  item.title_draft = article.title?.replace(/\s*\|\s*Gino\s*$/i, "") || item.title_draft;
  item.meta_draft = article.meta_description;
  item.h1_draft = article.h1;
  item.status = "draft";
  item.generated_at = new Date().toISOString();

  return { article, paths, htmlPath };
}

async function main() {
  if (!slug) {
    console.error("Uso: generate-diario-assets.mjs --slug SLUG");
    process.exit(1);
  }
  const queue = readJson("data/editorial-queue.json");
  const item = queue.items.find((i) => i.slug === slug);
  if (!item) {
    console.error("Slug non in queue");
    process.exit(1);
  }
  await generateDiarioAssets(item);
  writeJson("data/editorial-queue.json", queue);
  console.log(`OK: ${item.paths.html}`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
