/**
 * Genera il PDF di una scheda pesi (A4 orizzontale, 1 pagina) dalla pagina HTML.
 *
 * Uso:
 *   node tools/genera-pdf-scheda.mjs <slug> <nome-file.pdf> [--local]
 * Esempio:
 *   node tools/genera-pdf-scheda.mjs trimestre-giugno-luglio-agosto-2026 scheda-forza-quotidiana-q3-2026.pdf --local
 *
 * Con --local avvia un server HTTP temporaneo sulla cartella del sito
 * (serve CSS/immagini di sfondo). Apre la pagina con ?sub=1 per il gate newsletter.
 *
 * Richiede: npm i puppeteer-core  (una tantum) + Chrome/Edge installato.
 */
import puppeteer from "puppeteer-core";
import { existsSync } from "node:fs";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, extname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = dirname(__dirname);
const SITE = "https://forzaquotidiana.it";

const CHROME_CANDIDATES = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
];

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".pdf": "application/pdf",
  ".json": "application/json",
  ".ico": "image/x-icon",
};

function findChrome() {
  for (const p of CHROME_CANDIDATES) if (existsSync(p)) return p;
  throw new Error("Chrome/Edge non trovati.");
}

function startLocalServer() {
  return new Promise((resolve, reject) => {
    const server = createServer(async (req, res) => {
      try {
        const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
        let rel = urlPath === "/" ? "index.html" : urlPath.replace(/^\//, "");
        let filePath = join(REPO, rel);
        if (existsSync(filePath) && !extname(filePath)) {
          filePath = join(filePath, "index.html");
        }
        if (!filePath.startsWith(REPO) || !existsSync(filePath)) {
          res.writeHead(404);
          res.end("Not found: " + rel);
          return;
        }
        const body = await readFile(filePath);
        res.writeHead(200, { "Content-Type": MIME[extname(filePath).toLowerCase()] || "application/octet-stream" });
        res.end(body);
      } catch (e) {
        res.writeHead(500);
        res.end(String(e));
      }
    });
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ server, port });
    });
    server.on("error", reject);
  });
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

  let local;
  let url;
  if (mode === "--local") {
    local = await startLocalServer();
    url = `http://127.0.0.1:${local.port}/allenamenti/schede-peso/${slug}/?sub=1`;
  } else {
    url = `${SITE}/allenamenti/schede-peso/${slug}/?sub=1`;
  }

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
    /* Attende sfondo immagine */
    await page.evaluate(async () => {
      const imgs = Array.from(document.querySelectorAll(".scheda-a4__bg"));
      await Promise.all(
        imgs.map((el) => {
          const bg = getComputedStyle(el).backgroundImage;
          const m = /url\(["']?([^"')]+)["']?\)/.exec(bg);
          if (!m) return Promise.resolve();
          return new Promise((resolve) => {
            const i = new Image();
            i.onload = i.onerror = resolve;
            i.src = m[1];
          });
        })
      );
    });
    await new Promise((r) => setTimeout(r, 800));
    await page.pdf({
      path: outPath,
      landscape: true,
      printBackground: true,
      preferCSSPageSize: false,
      format: "A4",
      margin: { top: "5mm", right: "5mm", bottom: "5mm", left: "5mm" },
    });
    console.log("OK ->", outPath);
  } finally {
    await browser.close();
    if (local) local.server.close();
  }
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
