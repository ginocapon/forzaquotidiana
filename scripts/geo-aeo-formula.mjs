#!/usr/bin/env node
/**
 * Score GEO/AEO articolo diario
 * node scripts/geo-aeo-formula.mjs [--file path] [--slug slug]
 */
import fs from "node:fs";
import path from "node:path";
import { REPO_ROOT, writeJson, todayISO } from "./lib/editorial-utils.mjs";

const args = process.argv.slice(2);
let file = args.includes("--file") ? args[args.indexOf("--file") + 1] : null;
const slug = args.includes("--slug") ? args[args.indexOf("--slug") + 1] : null;

if (!file && slug) file = `diario/${slug}/index.html`;
if (!file) {
  console.error("Uso: geo-aeo-formula.mjs --file path | --slug slug");
  process.exit(1);
}

const full = path.join(REPO_ROOT, file);
if (!fs.existsSync(full)) {
  console.error(`FAIL: file non trovato ${file}`);
  process.exit(1);
}

const html = fs.readFileSync(full, "utf8");
const checks = [];

function add(name, ok, weight, note = "") {
  checks.push({ name, ok, weight, note });
}

add("title presente", /<title>[^<]+<\/title>/i.test(html), 1);
add("title ≤60 char", (html.match(/<title>([^<]*)<\/title>/i)?.[1]?.length || 99) <= 60, 1);
add("meta description", /<meta\s+name="description"/i.test(html), 1);
add("meta ≤160", (html.match(/meta\s+name="description"\s+content="([^"]*)"/i)?.[1]?.length || 99) <= 160, 1);
add("canonical", /rel="canonical"/i.test(html), 0.5);
add("og:image", /property="og:image"/i.test(html), 1);
add("article-lead / risposta breve", /class="article-lead"/i.test(html) || /Risposta breve/i.test(html), 1.5);
add("FAQ visibile", /class="faq"/i.test(html) || /<details>/i.test(html), 1.5);
add("FAQPage JSON-LD", /"@type"\s*:\s*"FAQPage"/i.test(html), 1.5);
add("BlogPosting JSON-LD", /"@type"\s*:\s*"BlogPosting"/i.test(html), 1);
add("Person author", /"@type"\s*:\s*"Person"/i.test(html), 0.5);
add("H1 presente", /<h1[^>]*>/i.test(html), 1);
add("≥3 internal link diario/allenamenti", (html.match(/href="\/(diario|allenamenti|chi-sono)\//g) || []).length >= 3, 1);
add("cookie-consent.js", /cookie-consent\.js/i.test(html), 1);
add("newsletter CTA", /newsletter-form|href="\/allenamenti\/newsletter\//i.test(html), 1);
add("goliardia banner se fiction", true, 0); // valutato sotto
const isFiction = /goliardic|finzione|Contenuto goliardico/i.test(html);
const hasBanner = /banner-goliardia|Contenuto goliardico/i.test(html);
if (isFiction || /data-fiction/i.test(html)) {
  checks[checks.length - 1].weight = 1;
  checks[checks.length - 1].ok = hasBanner;
}

const maxScore = checks.reduce((s, c) => s + c.weight, 0);
const score = checks.filter((c) => c.ok).reduce((s, c) => s + c.weight, 0);
const normalized = Math.round((score / maxScore) * 10 * 10) / 10;

const report = {
  file,
  slug: slug || path.basename(path.dirname(file)),
  date: todayISO(),
  score: normalized,
  max: 10,
  pass: normalized >= 8,
  checks,
};

const outJson = path.join(REPO_ROOT, "guardian/reports/geo-aeo-formula-latest.json");
fs.mkdirSync(path.dirname(outJson), { recursive: true });
fs.writeFileSync(outJson, JSON.stringify(report, null, 2));

console.log(`GEO/AEO: ${normalized}/10 ${report.pass ? "PASS" : "FAIL"} — ${file}`);
process.exit(report.pass ? 0 : 1);
