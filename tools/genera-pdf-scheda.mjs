/**
 * Genera il PDF di una scheda pesi (A4 orizzontale, 1 pagina) dalla pagina live.
 *
 * Uso:
 *   node tools/genera-pdf-scheda.mjs <slug> <nome-file.pdf> [--local]
 * Esempio:
 *   node tools/genera-pdf-scheda.mjs trimestre-giugno-luglio-agosto-2026 scheda-forza-quotidiana-q3-2026.pdf
 *
 * Il PDF viene salvato in allenamenti/schede-peso/<slug>/<nome-file.pdf>.
 * La pagina viene aperta con ?sub=1 per superare il gate newsletter.
 */
import puppeteer from "puppeteer-core";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = dirname(__dirname);
const SITE = "https://forzaquotidiana.it";

const CHROME_CANDIDATES = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
];

function findChrome() {
  for (const p of CHROME_CANDIDATES) if (existsSync(p)) return p;
  throw new Error("Chrome/Edge non trovati.");
}

async function main() {
  const [slug, outName, mode] = process.argv.slice(2);
  if (!slug || !outName) {
    console.error("Uso: node tools/genera-pdf-scheda.mjs <slug> <nome-file.pdf> [--local]");
    process.exit(1);
  }

  const schedaDir = join(REPO, "allenamenti", "schede-peso", slug);
  if (!existsSync(schedaDir)) throw new Error("Cartella scheda non trovata: " + schedaDir);
  const outPath = join(schedaDir, outName);

  const url = mode === "--local"
    ? "file:///" + join(schedaDir, "index.html").replace(/\\/g, "/") + "?sub=1"
    : `${SITE}/allenamenti/schede-peso/${slug}/?sub=1`;

  console.log("Rendering:", url);
  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: "new",
    args: ["--no-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
    await page.emulateMediaType("print");
    await page.pdf({
      path: outPath,
      landscape: true,
      printBackground: true,
      preferCSSPageSize: true,
      format: "A4",
      margin: { top: "5mm", right: "5mm", bottom: "5mm", left: "5mm" },
    });
    console.log("OK ->", outPath);
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
