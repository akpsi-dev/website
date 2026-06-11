#!/usr/bin/env node
/**
 * In-place image optimizer for src/Assets.
 *
 * Downscales oversized photos and re-encodes them with sensible quality,
 * keeping filenames and formats identical so no import changes are needed.
 * A file is only rewritten when the optimized output is smaller.
 *
 * Usage: node scripts/optimize-images.mjs [--dry-run]
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(process.cwd(), "src/Assets");
const DRY_RUN = process.argv.includes("--dry-run");

// Max long-edge pixels per directory. Logos are excluded — they're small
// and need crisp edges/transparency.
const DIR_RULES = [
  { dir: "ActiveHeadshots", maxDim: 1000 },
  { dir: "BrotherhoodPhotos", maxDim: 1600 },
  { dir: "AboutPhotos", maxDim: 1600 },
  // Frames hold full-bleed hero/title images — keep them larger and sharper.
  { dir: "Frames", maxDim: 2400, quality: 85 },
  { dir: "TrollPhotos", maxDim: 1400 },
  { dir: "Side Photos", maxDim: 1600 },
];

const QUALITY = { webp: 72, jpeg: 74, png: 80 };

async function* walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

function ruleFor(filePath) {
  const rel = path.relative(ROOT, filePath);
  return DIR_RULES.find((r) => rel.startsWith(r.dir + path.sep));
}

async function optimize(filePath, maxDim, quality) {
  const ext = path.extname(filePath).toLowerCase();
  if (![".webp", ".png", ".jpg", ".jpeg"].includes(ext)) return null;

  const input = await fs.readFile(filePath);
  const image = sharp(input, { failOn: "none" });
  const meta = await image.metadata();
  if (!meta.width || !meta.height) return null;

  const needsResize = Math.max(meta.width, meta.height) > maxDim;
  let pipeline = sharp(input, { failOn: "none" }).rotate();
  if (needsResize) {
    pipeline = pipeline.resize(maxDim, maxDim, {
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  if (ext === ".webp") {
    pipeline = pipeline.webp({ quality: quality ?? QUALITY.webp });
  } else if (ext === ".png") {
    pipeline = pipeline.png({ compressionLevel: 9, palette: false });
  } else {
    pipeline = pipeline.jpeg({
      quality: quality ?? QUALITY.jpeg,
      mozjpeg: true,
    });
  }

  const output = await pipeline.toBuffer();
  if (output.length >= input.length) return { saved: 0 };

  if (!DRY_RUN) await fs.writeFile(filePath, output);
  return { saved: input.length - output.length, from: input.length };
}

let totalSaved = 0;
let touched = 0;
for await (const file of walk(ROOT)) {
  const rule = ruleFor(file);
  if (!rule) continue;
  try {
    const result = await optimize(file, rule.maxDim, rule.quality);
    if (result?.saved > 0) {
      totalSaved += result.saved;
      touched += 1;
      console.log(
        `${path.relative(ROOT, file)}: ${(result.from / 1e6).toFixed(1)}MB → ${((result.from - result.saved) / 1e6).toFixed(1)}MB`,
      );
    }
  } catch (err) {
    console.error(`SKIP ${file}: ${err.message}`);
  }
}

console.log(
  `\n${DRY_RUN ? "[dry-run] " : ""}${touched} files optimized, ${(totalSaved / 1e6).toFixed(1)}MB saved`,
);
