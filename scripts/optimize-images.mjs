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

// Max long-edge pixels per directory.
const DIR_RULES = [
  { dir: "ActiveHeadshots", maxDim: 1000 },
  { dir: "BrotherhoodPhotos", maxDim: 1600 },
  { dir: "AboutPhotos", maxDim: 1600 },
  // Frames hold full-bleed hero/title images — keep them larger and sharper.
  { dir: "Frames", maxDim: 2400, quality: 85 },
  { dir: "TrollPhotos", maxDim: 1400 },
  { dir: "Side Photos", maxDim: 1600 },
  // Logos were excluded upstream on the assumption they are small and need
  // crisp edges. This set is not small: several are 3000-4096px wide, and they
  // were the worst overdraw on /meet-us — a 4096px mark decoded into a 159px
  // box. 800px still covers the largest use (a 140px slot at DPR 3 needs 420),
  // and PNG stays lossless with alpha intact, so edges and transparency hold.
  // alwaysDownscale: several logos are enormous in pixels but tiny on disk —
  // DeloitteLogo.png is 3840x2160 in 24.8KB because it is mostly transparent.
  // Downscaling those makes the *file* slightly bigger, so the smaller-output
  // guard below rejects them. Bytes are not the cost that matters here: a
  // 3840x2160 PNG allocates ~33MB of bitmap when decoded whatever it weighs,
  // and that is what shows up as jank. Accept a few KB to lose 30MB of decode.
  { dir: "Logos", maxDim: 800, quality: 88, alwaysDownscale: true },
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

async function optimize(filePath, maxDim, quality, alwaysDownscale = false) {
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
  // Normally only write a genuine byte win. When a rule sets alwaysDownscale,
  // a resize is worth taking for the decode saving even if bytes tick up.
  const keep = output.length < input.length || (alwaysDownscale && needsResize);
  if (!keep) return { saved: 0 };

  if (!DRY_RUN) await fs.writeFile(filePath, output);
  return { saved: input.length - output.length, from: input.length };
}

let totalSaved = 0;
let touched = 0;
for await (const file of walk(ROOT)) {
  const rule = ruleFor(file);
  if (!rule) continue;
  try {
    const result = await optimize(
      file,
      rule.maxDim,
      rule.quality,
      rule.alwaysDownscale,
    );
    if (result && result.saved !== 0) {
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
