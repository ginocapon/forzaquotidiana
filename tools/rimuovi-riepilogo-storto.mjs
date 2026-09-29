#!/usr/bin/env node
/**
 * Rimuove screenshot riepilogo Zepp ruotati/ ridondanti dalle pagine sessione.
 * Resta il grafico FC completo (.amazfit-fc-hero) e le card .amazfit-data.
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = dirname(dirname(fileURLToPath(import.meta.url)));
const SESSIONI = join(REPO, "allenamenti/sessioni");

function walkHtml(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walkHtml(p, out);
    else if (name === "index.html") out.push(p);
  }
  return out;
}

function processHtml(html) {
  let next = html;
  const hasFc = /-fc-grafico\.webp/.test(html);
  const hasCards = /class="amazfit-data"/.test(html);

  if (hasFc || hasCards) {
    for (let i = 0; i < 5; i++) {
      const prev = next;
      next = next.replace(
        /\s*<div class="amazfit-riepilogo-hero"[\s\S]*?<\/figure>\s*<\/div>\s*/g,
        "\n"
      );
      next = next.replace(
        /\s*<figure class="phone-shot[^"]*"[^>]*>[\s\S]*?-riepilogo\.webp[\s\S]*?<\/figure>\s*/g,
        ""
      );
      next = next.replace(
        /\s*<figcaption>Riepilogo[^<]*<\/figcaption>\s*<\/figure>\s*<\/div>\s*/g,
        ""
      );
      if (next === prev) break;
    }
  }

  next = next.replace(
    /Riepilogo e grafico FC a tutta larghezza/g,
    "Grafico FC completo a tutta larghezza"
  );
  next = next.replace(
    /Riepilogo a tutta larghezza · export parziale/g,
    "Export parziale"
  );
  next = next.replace(
    /Riepilogo sessione, grafico FC, zone/g,
    "Grafico FC, zone"
  );
  next = next.replace(
    /Riepilogo sessione, grafico FC/g,
    "Grafico FC"
  );

  if (hasFc) {
    const fcMatch = html.match(/\/img\/allenamenti\/amazfit\/([^\s"]+-fc-grafico\.webp)/);
    if (fcMatch) {
      const fcUrl = fcMatch[1];
      next = next.replace(
        /https:\/\/forzaquotidiana\.it\/img\/allenamenti\/amazfit\/[^\s"]+-riepilogo\.webp/g,
        `https://forzaquotidiana.it/img/allenamenti/amazfit/${fcUrl}`
      );
      next = next.replace(
        /(<div class="amazfit-fc-hero"[\s\S]*?<img src="[^"]+-fc-grafico\.webp"[^>]*?)loading="lazy"/,
        '$1loading="eager" fetchpriority="high"'
      );
    }
  }

  return next;
}

function patchCreateSession(file) {
  let src = readFileSync(file, "utf8");
  const before = src;
  src = processHtml(src);
  if (src !== before) writeFileSync(file, src);
}

let n = 0;
for (const file of walkHtml(SESSIONI)) {
  if (file.endsWith(`${"sessioni"}${"/"}index.html`) || file.endsWith("sessioni\\index.html")) {
    continue;
  }
  const html = readFileSync(file, "utf8");
  const next = processHtml(html);
  if (next !== html) {
    writeFileSync(file, next);
    n++;
    console.log("OK", file.replace(REPO + "\\", "").replace(REPO + "/", ""));
  }
}

for (const name of readdirSync(join(REPO, "tools"))) {
  if (name.startsWith("create-session-") && name.endsWith(".mjs")) {
    patchCreateSession(join(REPO, "tools", name));
  }
}

console.log(`Aggiornate ${n} pagine sessione.`);
