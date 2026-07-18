#!/usr/bin/env node
/** Validazione minima title/meta — Forza Quotidiana */
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
let file = null;
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--file" && args[i + 1]) file = args[++i];
}

if (!file) {
  console.error("Uso: node scripts/validate-page.js --file percorso/index.html");
  process.exit(1);
}

const html = fs.readFileSync(path.resolve(file), "utf8");
const title = html.match(/<title>([^<]*)<\/title>/i);
const meta = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i);

let fail = false;
if (!title) {
  console.error("FAIL: title mancante");
  fail = true;
} else {
  const len = title[1].length;
  if (len > 70) {
    console.error("WARN: title " + len + " char (>70)");
    fail = true;
  } else console.log("OK title: " + len + " char");
}

if (!meta) {
  console.error("FAIL: meta description mancante");
  fail = true;
} else {
  const len = meta[1].length;
  if (len > 160) {
    console.error("WARN: meta " + len + " char (>160)");
    fail = true;
  } else console.log("OK meta: " + len + " char");
}

process.exit(fail ? 1 : 0);
