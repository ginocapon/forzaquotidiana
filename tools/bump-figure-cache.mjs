/** Bump cache bust figure sprite + CSS — uso one-off: node tools/bump-figure-cache.mjs */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = join(fileURLToPath(import.meta.url), "..", "..");

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === "node_modules" || name === ".git") continue;
      walk(p, out);
    } else if (extname(name) === ".html" || extname(name) === ".mjs") {
      out.push(p);
    }
  }
  return out;
}

const REPLACEMENTS = [
  ["sprite-esercizi.js?v=1", "sprite-esercizi.js?v=2"],
  ["sessione-scheda-figure.js?v=1", "sessione-scheda-figure.js?v=2"],
  ["trimestre-scheda-figure.js?v=1", "trimestre-scheda-figure.js?v=2"],
  ["styles.css?v=51", "styles.css?v=55"],
];

let n = 0;
for (const file of walk(REPO)) {
  if (file.includes("bump-figure-cache.mjs")) continue;
  let text = readFileSync(file, "utf8");
  let changed = false;
  for (const [from, to] of REPLACEMENTS) {
    if (text.includes(from)) {
      text = text.split(from).join(to);
      changed = true;
    }
  }
  if (changed) {
    writeFileSync(file, text);
    n++;
    console.log("OK", file.replace(REPO + "\\", "").replace(REPO + "/", ""));
  }
}
console.log("File aggiornati:", n);
