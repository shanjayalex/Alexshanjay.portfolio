// Builds the web portraits from the sources in /assets. Re-run with
// `npm run images` whenever the photo changes.
//   assets/portrait-2026.png   — original studio portrait
//   assets/portrait-cutout.png — same photo, background removed (transparent PNG)
import { mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const src = (name) => resolve("assets", name);
const out = (name) => resolve("public/images", name);
const PAPER_2 = "#f5f4f1";

await mkdir(out(""), { recursive: true });

const jobs = [
  ["portrait-2026.webp", sharp(src("portrait-2026.png")).resize({ width: 1100 }).webp({ quality: 82 })],
  ["portrait-2026-640.webp", sharp(src("portrait-2026.png")).resize({ width: 640 }).webp({ quality: 80 })],
  ["portrait-cutout.webp", sharp(src("portrait-cutout.png")).trim().resize({ width: 1100 }).webp({ quality: 82, alphaQuality: 90 })],
  [
    "portrait-cutout-mono.webp",
    sharp(src("portrait-cutout.png")).trim().resize({ width: 1100 }).greyscale().linear(1.18, -18).webp({ quality: 82, alphaQuality: 90 }),
  ],
  // Phones show the hero portrait at 70vw.
  [
    "portrait-cutout-mono-640.webp",
    sharp(src("portrait-cutout.png")).trim().resize({ width: 640 }).greyscale().linear(1.18, -18).webp({ quality: 78, alphaQuality: 85 }),
  ],
  // 56px contact avatar (2× + a little headroom): head crop of the cut-out on paper.
  [
    "portrait-avatar.webp",
    sharp(src("portrait-cutout.png")).extract({ left: 280, top: 30, width: 660, height: 660 }).flatten({ background: PAPER_2 }).resize(160).webp({ quality: 80 }),
  ],
];

for (const [name, pipeline] of jobs) {
  const info = await pipeline.toFile(out(name));
  console.log(`images: ${name} ${info.width}×${info.height} ${(info.size / 1024).toFixed(0)} kB`);
}

// The old portrait is replaced by the files above.
await rm(out("photo.png"), { force: true });
