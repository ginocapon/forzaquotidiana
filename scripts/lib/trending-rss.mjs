/**
 * Fetch trending topics da RSS fitness (ultimi titoli)
 */
import fs from "node:fs";
import path from "node:path";
import { REPO_ROOT } from "./editorial-utils.mjs";

const UA = "ForzaQuotidiana-Editorial/1.0 (+https://forzaquotidiana.it)";

function parseRssTitles(xml, limit = 15) {
  const titles = [];
  const re = /<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/gi;
  let m;
  while ((m = re.exec(xml)) && titles.length < limit) {
    const t = m[1].replace(/&amp;/g, "&").replace(/&#39;/g, "'").trim();
    if (t && !/^(r\/|Reddit|\[)/i.test(t) && t.length > 10) titles.push(t);
  }
  return titles;
}

function loadRssUrls() {
  const p = path.join(REPO_ROOT, "guardian/config/web-sources.yaml");
  const raw = fs.readFileSync(p, "utf8");
  const urls = [];
  let inRss = false;
  for (const line of raw.split("\n")) {
    if (line.startsWith("rss_feeds_optional:")) inRss = true;
    else if (inRss && line.match(/^\w/) && !line.startsWith("  ")) inRss = false;
    const um = line.match(/url:\s*(.+)/);
    if (inRss && um) urls.push(um[1].trim());
  }
  return urls;
}

function titleToKeyword(title) {
  const clean = title
    .toLowerCase()
    .replace(/[^a-z0-9àèéìòù\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  const stop = new Set(["the", "and", "for", "with", "this", "that", "how", "what", "why", "your", "you", "are", "was", "has", "have", "from", "about", "just", "my", "i", "a", "to", "in", "on", "is", "it", "of", "che", "non", "per", "una", "del", "della"]);
  const words = clean.split(" ").filter((w) => w.length > 3 && !stop.has(w));
  return words.slice(0, 4).join(" ") || clean.slice(0, 40);
}

export async function fetchTrendingTopics() {
  const urls = loadRssUrls();
  const all = [];
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": UA },
        signal: AbortSignal.timeout(12000),
      });
      if (!res.ok) continue;
      const xml = await res.text();
      for (const title of parseRssTitles(xml, 12)) {
        all.push({
          source: url,
          title,
          kw: titleToKeyword(title),
          score: 0.85,
        });
      }
    } catch {
      /* RSS opzionale — fallback static gaps */
    }
  }
  const seen = new Set();
  return all.filter((t) => {
    if (seen.has(t.kw)) return false;
    seen.add(t.kw);
    return true;
  });
}
