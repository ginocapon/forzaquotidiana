/** Imposta paths queue per publish venerdì — one-off */
import { readJson, writeJson } from "../scripts/lib/editorial-utils.mjs";

const date = "2026-08-26";
const queue = readJson("data/editorial-queue.json");

const pathsMap = {
  "creatina-meme-universita-57-anni": {
    html: "diario/creatina-meme-universita-57-anni/index.html",
    hero: `img/diario/${date}/creatina-meme-universita-hero.webp`,
    figures: [
      `img/diario/${date}/creatina-meme-universita-fig1.webp`,
      `img/diario/${date}/creatina-meme-universita-tablet-notte.webp`,
    ],
    title_draft: "Facoltà di Creatina Applicata",
    meta_draft:
      "Satira goliardica su meme creatina + sintesi scientifica prudente — zero vendita integratori. Gino Capon 57 anni.",
    h1_draft: "La mia laurea in Creatina Applicata (con esame notturno al tablet)",
  },
  "many-years-apart-think-57-anni": {
    html: "diario/many-years-apart-think-57-anni/index.html",
    hero: `img/diario/${date}/many-years-apart-think-hero.webp`,
    figures: [
      `img/diario/${date}/many-years-apart-think-fig1.webp`,
      `img/diario/${date}/many-years-apart-think-fig2.webp`,
    ],
    title_draft: "Quanti anni di differenza? Il meme Reddit",
    meta_draft:
      "Parodia goliardica sul trend Reddit foto giovane vs oggi — autenticità vs aspettative social. Gino 57 anni.",
    h1_draft: "Quanti anni di differenza? Il meme Reddit mi chiede il conto (a 57)",
  },
  "check-weeks-natural-viking-57-anni": {
    html: "diario/check-weeks-natural-viking-57-anni/index.html",
    hero: `img/diario/${date}/check-weeks-natural-viking-hero.webp`,
    figures: [
      `img/diario/${date}/check-weeks-natural-viking-fig1.webp`,
      `img/diario/${date}/check-weeks-natural-viking-fig2.webp`,
    ],
    title_draft: "Check-in da gara: due settimane al Viking",
    meta_draft:
      "Parodia del check-in pre-gara bodybuilding: Gino dilettante fa peaking col telecomando. Finizione cartoon.",
    h1_draft: "Check-in da gara Natural Viking — peaking sul divano (a 57 anni)",
  },
};

for (const item of queue.items) {
  const p = pathsMap[item.slug];
  if (!p) continue;
  item.status = "scheduled";
  item.paths = { html: p.html, hero: p.hero, figures: p.figures };
  item.title_draft = p.title_draft;
  item.meta_draft = p.meta_draft;
  item.h1_draft = p.h1_draft;
  console.log("OK", item.slug);
}

queue.updated = date;
writeJson("data/editorial-queue.json", queue);
