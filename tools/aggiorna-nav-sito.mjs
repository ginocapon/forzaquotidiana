/**
 * Allinea menu sito: Home · Chi sono · Allenamenti · Schede (senza Diario).
 * node tools/aggiorna-nav-sito.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, extname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(REPO);

const SPEC = [
  { href: "/", label: "Home", match: (p) => p === "index.html" },
  { href: "/chi-sono/", label: "Chi sono", match: (p) => p.startsWith("chi-sono/") },
  { href: "/allenamenti/", label: "Allenamenti", match: (p) => p.startsWith("allenamenti/") },
  {
    href: "/admin/",
    label: "Schede",
    dataNav: "schede",
    match: (p) => p.startsWith("admin/"),
  },
];

function navUlFor(relPath) {
  const lines = SPEC.map((item) => {
    const cur = item.match(relPath) ? " aria-current=\"page\"" : "";
    const data = item.dataNav ? ` data-nav="${item.dataNav}"` : "";
    return `        <li><a href="${item.href}"${data}${cur}>${item.label}</a></li>`;
  });
  return `<ul>\n${lines.join("\n")}\n      </ul>`;
}

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".git") continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, files);
    else if (extname(name) === ".html") files.push(p);
  }
  return files;
}

const htmlFiles = walk(ROOT);

const re = /<nav class="site-nav" id="nav-principale"[\s\S]*?<\/nav>/g;

for (const file of htmlFiles) {
  let html = readFileSync(file, "utf8");
  if (!html.includes("site-nav")) continue;
  const rel = relative(ROOT, file).replace(/\\/g, "/");
  const orig = html;
  html = html.replace(re, (block) => {
    if (!block.includes("<ul>")) return block;
    return block.replace(/<ul>[\s\S]*?<\/ul>/, navUlFor(rel === "index.html" ? "index.html" : rel));
  });
  if (html !== orig) {
    writeFileSync(file, html);
    console.log("OK", rel);
  }
}
