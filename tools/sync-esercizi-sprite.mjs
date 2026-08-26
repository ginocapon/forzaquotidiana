/** Sync esercizi sprite → img/ pubblico (GitHub Pages) */
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(REPO, "admin/img/esercizi-sprite.svg");
const dest = join(REPO, "img/esercizi-sprite.svg");
mkdirSync(dirname(dest), { recursive: true });
copyFileSync(src, dest);
console.log("OK", dest);
