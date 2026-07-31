#!/usr/bin/env node
/** Aggiunge favicon, Twitter Card e meta SEO alle pagine pubbliche che ne sono prive. */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const GOOGLE_VERIFY = "UDSpTc6NWtgVmdn6Z-ZGkr7rDiC_O3nhGTFePh85hhs";

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      if (name === "admin" || name === "node_modules" || name === ".git") continue;
      walk(p, out);
    } else if (name === "index.html") out.push(p);
  }
  return out;
}

function extractMeta(html, prop) {
  const m = html.match(new RegExp(`<meta\\s+(?:name|property)="${prop}"\\s+content="([^"]*)"`, "i"));
  return m ? m[1] : null;
}

let updated = 0;
for (const file of walk(ROOT)) {
  let html = fs.readFileSync(file, "utf8");
  if (/content="noindex"/i.test(html)) continue;

  let changed = false;

  if (!html.includes('rel="icon"')) {
    html = html.replace(
      /<meta name="viewport"[^>]*>\n/,
      (m) => m + '<link rel="icon" href="/favicon.svg" type="image/svg+xml">\n'
    );
    changed = true;
  }

  if (!html.includes('name="twitter:card"')) {
    const ogTitle = extractMeta(html, "og:title");
    const ogDesc = extractMeta(html, "og:description");
    const ogImage = extractMeta(html, "og:image");
    const title = (html.match(/<title>([^<]*)<\/title>/i) || [])[1];
    const desc = extractMeta(html, "description");
    const twTitle = ogTitle || title;
    const twDesc = ogDesc || desc;
    const twImage = ogImage || "https://forzaquotidiana.it/img/hero/gino-locker-disciplina.png";
    if (twTitle) {
      const block =
        `<meta name="twitter:card" content="summary_large_image">\n` +
        `<meta name="twitter:title" content="${twTitle.replace(/"/g, "&quot;")}">\n` +
        (twDesc ? `<meta name="twitter:description" content="${twDesc.replace(/"/g, "&quot;")}">\n` : "") +
        `<meta name="twitter:image" content="${twImage}">\n`;
      html = html.replace(/(<meta property="og:image"[^>]*>\n)/i, `$1${block}`);
      changed = true;
    }
  }

  if (!html.includes('property="og:site_name"') && html.includes('property="og:')) {
    html = html.replace(
      /<meta property="og:type"[^>]*>\n/i,
      (m) => m + '<meta property="og:site_name" content="La Forza Quotidiana">\n<meta property="og:locale" content="it_IT">\n'
    );
    changed = true;
  }

  if (path.resolve(file) === path.join(ROOT, "index.html") && !html.includes('name="google-site-verification"')) {
    html = html.replace(
      /<meta name="description"[^>]*>\n/i,
      (m) => m + `<meta name="google-site-verification" content="${GOOGLE_VERIFY}">\n`
    );
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, html);
    updated++;
    console.log("OK", path.relative(ROOT, file));
  }
}
console.log(`Aggiornate ${updated} pagine.`);
