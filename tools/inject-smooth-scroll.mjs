/**
 * Inserisce Lenis + smooth-scroll.js in tutte le pagine HTML del sito.
 * Esclude fogli stampa PDF (schede-peso, sessione/pdf, metodo pdf, fase pdf).
 */
import { readFile, writeFile, readdir } from "node:fs/promises";
import { join, relative } from "node:path";

const REPO = join(import.meta.dirname, "..");
const MARKER = "/js/smooth-scroll.js";
const SNIPPET =
  '<script src="/js/vendor/lenis.min.js" defer></script>\n' +
  '<script src="/js/smooth-scroll.js?v=1" defer></script>\n';

const SKIP = [
  "admin/prototipi/periodizzazione/fase/index.html",
  "admin/prototipi/periodizzazione/index.html",
  "admin/prototipi/periodizzazione/schede/index.html",
  "admin/prototipi/periodizzazione/pdf/index.html",
  "admin/sessione/pdf/index.html",
  "admin/metodo-blocco1/pdf/index.html",
  "allenamenti/schede-peso/trimestre-giugno-luglio-agosto-2026/index.html",
];

async function walk(dir, files = []) {
  for (const name of await readdir(dir, { withFileTypes: true })) {
    if (name.name.startsWith(".") || name.name === "node_modules") continue;
    const path = join(dir, name.name);
    if (name.isDirectory()) await walk(path, files);
    else if (name.name.endsWith(".html")) files.push(path);
  }
  return files;
}

function shouldInject(rel) {
  const norm = rel.replace(/\\/g, "/");
  if (SKIP.includes(norm)) return false;
  return true;
}

async function main() {
  const files = await walk(REPO);
  let updated = 0;
  for (const file of files) {
    const rel = relative(REPO, file);
    if (!shouldInject(rel)) continue;
    let html = await readFile(file, "utf8");
    if (html.includes(MARKER)) continue;
    if (!html.includes("</body>")) continue;

    if (html.includes("/js/main.js")) {
      html = html.replace(
        /<script src="\/js\/main\.js\?v=\d+" defer><\/script>/,
        SNIPPET + '<script src="/js/main.js?v=25" defer></script>'
      );
    } else {
      html = html.replace("</body>", SNIPPET + "</body>");
    }

    if (!html.includes(MARKER)) {
      console.warn("Skip (no anchor):", rel);
      continue;
    }
    await writeFile(file, html, "utf8");
    updated += 1;
    console.log("OK", rel);
  }
  console.log("Updated", updated, "files");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
