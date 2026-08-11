/**
 * Utility condivise pipeline editoriale
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export const REPO_ROOT = path.join(import.meta.dirname, "..", "..");

export function readJson(rel) {
  const p = path.join(REPO_ROOT, rel);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

export function writeJson(rel, data) {
  const p = path.join(REPO_ROOT, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + "\n");
}

export function listDiarioSlugs() {
  const base = path.join(REPO_ROOT, "diario");
  if (!fs.existsSync(base)) return [];
  return fs
    .readdirSync(base, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(base, d.name, "index.html")))
    .map((d) => d.name);
}

/** Slug già in catalogo pubblico (diario/index.html) */
export function listCatalogDiarioSlugs() {
  const indexPath = path.join(REPO_ROOT, "diario/index.html");
  if (!fs.existsSync(indexPath)) return [];
  const html = fs.readFileSync(indexPath, "utf8");
  const slugs = [...html.matchAll(/href="\/diario\/([^"\/]+)\//g)].map((m) => m[1]);
  return [...new Set(slugs)];
}

export function slugTokens(slug) {
  return slug.toLowerCase().split("-").filter((t) => t.length > 2 && t !== "anni" && t !== "57");
}

export function jaccard(a, b) {
  const sa = new Set(a);
  const sb = new Set(b);
  const inter = [...sa].filter((x) => sb.has(x)).length;
  const union = new Set([...sa, ...sb]).size;
  return union ? inter / union : 0;
}

export function fileSha256(relPath) {
  const p = path.join(REPO_ROOT, relPath);
  if (!fs.existsSync(p)) return null;
  return crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
}

export function allImageHashes() {
  const imgRoot = path.join(REPO_ROOT, "img");
  const map = new Map();
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) walk(full);
      else if (/\.(webp|jpg|jpeg|png)$/i.test(ent.name)) {
        const hash = crypto.createHash("sha256").update(fs.readFileSync(full)).digest("hex");
        const rel = path.relative(REPO_ROOT, full).replace(/\\/g, "/");
        if (!map.has(hash)) map.set(hash, []);
        map.get(hash).push(rel);
      }
    }
  }
  walk(imgRoot);
  return map;
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function monthLabelIt(iso) {
  const months = ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"];
  const [y, m, d] = iso.split("-");
  return `${Number(d)} ${months[Number(m) - 1]} ${y}`;
}

export function monthGroupId(iso) {
  const [y, m] = iso.split("-");
  const names = [
    "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
    "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre",
  ];
  return `${names[Number(m) - 1]}-${y}`;
}

export function monthGroupTitle(iso) {
  const [y, m] = iso.split("-");
  const names = [
    "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
    "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
  ];
  return `${names[Number(m) - 1]} ${y}`;
}
