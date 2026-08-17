/**
 * Genera il PDF bianco A4 orizzontale della scheda fase (A1–B2).
 *
 * Uso:
 *   node tools/genera-pdf-fase.mjs [--local]
 */
import puppeteer from "puppeteer-core";
import { existsSync } from "node:fs";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, extname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = dirname(__dirname);

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
  const local = await startLocalServer();
  const url = `http://127.0.0.1:${local.port}/admin/prototipi/periodizzazione/fase/?anno=2026-2027&fase=ipertrofia-accumulo`;
  const outPath = join(REPO, "admin", "prototipi", "periodizzazione", "fase", "scheda-fase-1-ipertrofia-accumulo.pdf");

  console.log("Rendering:", url);
  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: "new",
    args: ["--no-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.emulateMediaType("print");
    await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
    await page.waitForSelector(".scheda-a4", { timeout: 20000 });
    await new Promise((r) => setTimeout(r, 400));
    await page.pdf({
      path: outPath,
      landscape: true,
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });
    console.log("OK ->", outPath);
  } finally {
    await browser.close();
    local.server.close();
  }
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
