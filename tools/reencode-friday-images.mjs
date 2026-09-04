#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { REPO_ROOT } from "../scripts/lib/editorial-utils.mjs";

const MAP = [
  { dest: "volume-mass-phase-natural-hero.webp", src: "img/diario/2026-08-26/gareggiare-natural-senza-farmaci-hero.webp", hero: true },
  { dest: "volume-mass-phase-natural-fig1.webp", src: "img/diario/2026-08-26/gareggiare-natural-senza-farmaci-fig1.webp", hero: false },
  { dest: "volume-mass-phase-natural-fig2.webp", src: "img/diario/2026-08-26/gareggiare-natural-senza-farmaci-fig2.webp", hero: false },
  { dest: "blocco1-prime-settimane-settembre-hero.webp", src: "img/diario/2026-07-30/blocco-1-periodizzazione-hero.webp", hero: true },
  { dest: "blocco1-prime-settimane-settembre-fig1.webp", src: "img/diario/2026-08-16/overtraining-recupero-50-anni-fig1.webp", hero: false },
  { dest: "blocco1-prime-settimane-settembre-fig2.webp", src: "img/diario/2026-08-16/overtraining-recupero-50-anni-fig2.webp", hero: false },
  { dest: "weeks-into-mass-phase-hero.webp", src: "img/diario/2026-08-26/check-weeks-natural-viking-hero.webp", hero: true },
  { dest: "weeks-into-mass-phase-fig1.webp", src: "img/diario/2026-08-26/check-weeks-natural-viking-fig1.webp", hero: false },
  { dest: "weeks-into-mass-phase-fig2.webp", src: "img/diario/2026-08-26/check-weeks-natural-viking-fig2.webp", hero: false },
];

const outDir = path.join(REPO_ROOT, "img/diario/2026-09-04");
fs.mkdirSync(outDir, { recursive: true });

for (const job of MAP) {
  const src = path.join(REPO_ROOT, job.src);
  const dest = path.join(outDir, job.dest);
  let pipe = sharp(src).rotate(job.hero ? 0.4 : 0.6).modulate({ brightness: 1.02, saturation: 1.04 });
  if (job.hero) {
    pipe = pipe.resize(1600, 760, { fit: "cover", position: "centre" });
  } else {
    pipe = pipe.resize(1200, null, { withoutEnlargement: false });
  }
  await pipe.webp({ quality: job.hero ? 60 : 64 }).toFile(dest);
  console.log(job.dest, Math.round(fs.statSync(dest).size / 1024), "KiB");
}
