#!/usr/bin/env node
/** Allinea query string cache busting su HTML pubblici. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKIP = new Set(["node_modules", ".git", "training-app"]);

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(ent.name)) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (ent.name.endsWith(".html")) out.push(p);
  }
  return out;
}

const CSS = process.argv[2] || "72";
const JS = process.argv[3] || "31";
let files = 0;

for (const file of walk(REPO)) {
  const rel = path.relative(REPO, file);
  if (rel.startsWith(`training-app${path.sep}`)) continue;
  let text = fs.readFileSync(file, "utf8");
  const next = text
    .replace(/\/css\/styles\.css\?v=\d+/g, `/css/styles.css?v=${CSS}`)
    .replace(/\/js\/main\.js\?v=\d+/g, `/js/main.js?v=${JS}`);
  if (next !== text) {
    fs.writeFileSync(file, next);
    files += 1;
  }
}

console.log(`bump-asset-cache: ${files} file HTML → styles.css?v=${CSS}, main.js?v=${JS}`);
