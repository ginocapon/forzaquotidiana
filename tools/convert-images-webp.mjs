/**
 * Converte JPG/PNG in WebP nel repo e aggiorna riferimenti in HTML/CSS/JSON.
 * Uso: node tools/convert-images-webp.mjs [--dry-run]
 * Richiede: npm install sharp (in tools/)
 */
import { readFileSync, writeFileSync, readdirSync, statSync, unlinkSync } from "node:fs";
import { dirname, join, extname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = dirname(__dirname);
const DRY = process.argv.includes("--dry-run");

const SKIP_DIRS = new Set(["node_modules", ".git", "tools/node_modules"]);
const RASTER_EXT = new Set([".jpg", ".jpeg", ".png"]);
const TEXT_EXT = new Set([".html", ".css", ".js", ".json", ".md", ".xml", ".txt"]);

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (SKIP_DIRS.has(name)) continue;
    const st = statSync(p);
    if (st.isDirectory()) walk(p, files);
    else if (RASTER_EXT.has(extname(name).toLowerCase())) files.push(p);
  }
  return files;
}

function walkText(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (SKIP_DIRS.has(name) || name === "node_modules") continue;
    const st = statSync(p);
    if (st.isDirectory()) walkText(p, files);
    else if (TEXT_EXT.has(extname(name).toLowerCase())) files.push(p);
  }
  return files;
}

const images = walk(REPO).filter((p) => !p.includes("/tools/node_modules/"));
console.log(`Raster images found: ${images.length}`);

const replacements = new Map();

for (const src of images) {
  const ext = extname(src).toLowerCase();
  const webpPath = src.slice(0, -ext.length) + ".webp";
  if (DRY) {
    console.log("would convert", relative(REPO, src));
    continue;
  }
  await sharp(src)
    .webp({ quality: 82, effort: 4 })
    .toFile(webpPath);
  const before = statSync(src).size;
  const after = statSync(webpPath).size;
  console.log(`OK ${relative(REPO, src)} → webp (${before} → ${after} bytes)`);
  replacements.set(src, webpPath);
  unlinkSync(src);
}

if (!DRY && replacements.size) {
  const textFiles = walkText(REPO).filter((f) => !f.includes("/tools/node_modules/"));
  for (const file of textFiles) {
    let content = readFileSync(file, "utf8");
    let changed = false;
    for (const [src, webp] of replacements) {
      const relFromRepo = "/" + relative(REPO, src).replace(/\\/g, "/");
      const relWebp = "/" + relative(REPO, webp).replace(/\\/g, "/");
      if (content.includes(relFromRepo)) {
        content = content.split(relFromRepo).join(relWebp);
        changed = true;
      }
      const noLead = relFromRepo.slice(1);
      const noLeadWebp = relWebp.slice(1);
      if (content.includes(noLead)) {
        content = content.split(noLead).join(noLeadWebp);
        changed = true;
      }
    }
    if (changed) {
      writeFileSync(file, content);
      console.log("updated refs:", relative(REPO, file));
    }
  }
}

console.log(DRY ? "Dry run complete." : `Converted ${replacements.size} images to WebP.`);
