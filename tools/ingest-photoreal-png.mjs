#!/usr/bin/env node
/** Ingest PNG generati (assets/) → WebP diario */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const REPO = path.resolve(import.meta.dirname, "..");
const ASSETS = "C:/Users/Utente/.cursor/projects/c-Users-Utente-progetti-forzaquotidiana/assets";

const MAP = {
  "blocco1-prime-settimane-realistic.png": "img/diario/2026-09-04/blocco1-prime-settimane-settembre-realistic.webp",
  "leg-day-ascensore-realistic.png": "img/diario/2026-08-11/leg-day-ascensore-realistic.webp",
  "mirror-gym-selfie-realistic.png": "img/diario/2026-08-11/mirror-gym-selfie-epica-realistic.webp",
  "clean-halo-realistic.png": "img/diario/2026-07-23/clean-halo-kettlebell-spalle-realistic.webp",
};

for (const [png, rel] of Object.entries(MAP)) {
  const src = fs.existsSync(path.join(ASSETS, png)) ? path.join(ASSETS, png) : path.join(REPO, "assets", png);
  const dst = path.join(REPO, rel);
  if (!fs.existsSync(src)) {
    console.warn("Missing:", src);
    continue;
  }
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  await sharp(src).rotate().resize(1200, 800, { fit: "cover" }).webp({ quality: 72 }).toFile(dst);
  console.log("OK", rel);
}
