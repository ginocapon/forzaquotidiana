#!/usr/bin/env node
/**
 * Applica markup marchio «Foto AI» a ogni img[data-ai] non già wrappata
 * node scripts/apply-ai-photo-watermark.mjs [--check]
 */
import fs from "node:fs";
import path from "node:path";
import { REPO_ROOT } from "./lib/editorial-utils.mjs";

const checkOnly = process.argv.includes("--check");

function listHtmlFiles(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name === ".git") continue;
      listHtmlFiles(p, acc);
    } else if (ent.name.endsWith(".html")) {
      acc.push(p);
    }
  }
  return acc;
}

function wrapAiImages(html) {
  if (!html.includes("data-ai=")) return { html, changed: 0 };

  let changed = 0;
  const out = html.replace(/^(\s*)<img\b([^>]*\bdata-ai="[^"]+"[^>]*)>/gim, (full, indent, attrs) => {
    const start = html.indexOf(full);
    const before = html.slice(Math.max(0, start - 120), start);
    if (before.includes("ai-photo-wrap") || before.endsWith("<span class=\"ai-photo-wrap\">\n")) return full;
    changed += 1;
    const inner = indent + "  ";
    return (
      `${indent}<span class="ai-photo-wrap">\n` +
      `${inner}<img${attrs}>\n` +
      `${inner}<span class="ai-photo-mark" aria-hidden="true">Foto AI</span>\n` +
      `${indent}</span>`
    );
  });
  return { html: out, changed };
}

function run() {
  const root = REPO_ROOT;
  const files = listHtmlFiles(root).filter((f) => !f.includes("node_modules"));
  let totalImgs = 0;
  let missing = 0;
  let fixed = 0;
  const problems = [];

  for (const file of files) {
    let html = fs.readFileSync(file, "utf8");
    if (!html.includes("data-ai=")) continue;

    const imgCount = (html.match(/<img\b[^>]*\bdata-ai=/gi) || []).length;
    const wrapped = (html.match(/ai-photo-wrap/gi) || []).length;
    totalImgs += imgCount;

    if (checkOnly) {
      if (wrapped < imgCount) {
        missing += imgCount - wrapped;
        problems.push(`${path.relative(root, file)}: ${imgCount - wrapped} senza wrap`);
      }
      continue;
    }

    const { html: next, changed } = wrapAiImages(html);
    if (changed) {
      fs.writeFileSync(file, next);
      fixed += changed;
      console.log(`✓ ${path.relative(root, file)} (${changed} img)`);
    }
  }

  if (checkOnly) {
    if (problems.length) {
      console.error("VERIFY FAIL — immagini data-ai senza ai-photo-wrap:");
      problems.forEach((p) => console.error(`  - ${p}`));
      process.exit(1);
    }
    console.log(`VERIFY OK — ${totalImgs} img[data-ai] con marchio statico`);
    return;
  }

  console.log(`Fatto: ${fixed} immagini wrappate`);
}

run();
