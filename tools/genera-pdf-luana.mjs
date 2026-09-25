/**
 * Genera il PDF del programma allenamento Luana (A4 portrait, multi-pagina).
 *
 * Uso:
 *   node tools/genera-pdf-luana.mjs
 */
import puppeteer from "puppeteer-core";
import { existsSync } from "node:fs";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, extname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = dirname(__dirname);
const LUANA_DIR = join(REPO, "tools", "schede-personali", "luana");
const OUT_PATH = join(LUANA_DIR, "Programma-Allenamento-Luana.pdf");

const CHROME_CANDIDATES = [
  "/usr/bin/google-chrome-stable",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
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
  ".pdf": "application/pdf",
};

function findChrome() {
  for (const p of CHROME_CANDIDATES) if (existsSync(p)) return p;
  throw new Error("Chrome/Chromium non trovato.");
}

function startLocalServer(root) {
  return new Promise((resolve, reject) => {
    const server = createServer(async (req, res) => {
      try {
        const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
        let rel = urlPath === "/" ? "index.html" : urlPath.replace(/^\//, "");
        let filePath = join(root, rel);
        if (existsSync(filePath) && !extname(filePath)) {
          filePath = join(filePath, "index.html");
        }
        if (!filePath.startsWith(root) || !existsSync(filePath)) {
          res.writeHead(404);
          res.end("Not found: " + rel);
          return;
        }
        const body = await readFile(filePath);
        res.writeHead(200, {
          "Content-Type": MIME[extname(filePath).toLowerCase()] || "application/octet-stream",
        });
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
  const local = await startLocalServer(LUANA_DIR);
  const url = `http://127.0.0.1:${local.port}/index.html`;

  console.log("Rendering:", url);
  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
    await page.emulateMediaType("print");
    await page.waitForSelector(".luana-page", { timeout: 10000 });
    await new Promise((r) => setTimeout(r, 500));

    await page.pdf({
      path: OUT_PATH,
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "8mm", right: "8mm", bottom: "8mm", left: "8mm" },
    });

    console.log("OK ->", OUT_PATH);
  } finally {
    await browser.close();
    local.server.close();
  }
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
