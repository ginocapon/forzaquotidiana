import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const dir = process.argv[2];
if (!dir) {
  console.error("Uso: node tools/svg-to-png.mjs <cartella-svg>");
  process.exit(1);
}

const chrome = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
].find((p) => fs.existsSync(p));

if (!chrome) throw new Error("Chrome/Edge non trovato");

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: "new",
  args: ["--no-sandbox"],
});

const page = await browser.newPage();
await page.setViewport({ width: 960, height: 720, deviceScaleFactor: 2 });

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".svg"))) {
  const svg = fs.readFileSync(path.join(dir, file), "utf8");
  const html = `<!DOCTYPE html><html><body style="margin:0;background:#121212">${svg}</body></html>`;
  await page.setContent(html, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => document.fonts?.ready);
  const out = path.join(dir, file.replace(/\.svg$/, ".png"));
  await page.screenshot({ path: out, type: "png", clip: { x: 0, y: 0, width: 960, height: 720 } });
  console.log("OK ->", out);
}

await browser.close();
