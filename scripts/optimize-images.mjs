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
import crypto from "node:crypto";
import sharp from "sharp";

const ROOT = path.resolve(process.cwd(), "src/Assets");
const DRY_RUN = process.argv.includes("--dry-run");
const FORCE = process.argv.includes("--force");
/* Records the current tree as already-optimized without touching a single
   file. Needed once, to adopt assets that were optimized before the manifest
   existed — re-encoding them just to learn their hashes would have been a
   second lossy pass over the whole library. */
const SEED = process.argv.includes("--seed");

/* webp and jpeg are lossy, so re-encoding an already-encoded file loses a
   little more every time. Running this script twice used to do exactly that:
   the second pass re-wrote ~190 files that the first pass had already
   optimized, quietly compounding the loss.

   So we record the hash of everything we write. A file whose current contents
   are already in the manifest is skipped, because we produced it. Replace an
   image and its hash no longer matches, so it gets optimized normally.
   --force ignores the manifest. */
const MANIFEST = path.resolve(process.cwd(), "scripts/.optimized-images.json");
const sha = (buf) => crypto.createHash("sha1").update(buf).digest("hex");

async function loadManifest() {
  if (FORCE) return new Set();
  try {
    return new Set(JSON.parse(await fs.readFile(MANIFEST, "utf8")));
  } catch {
    return new Set();
  }
}

// Max long-edge pixels per directory.
const DIR_RULES = [
  { dir: "ActiveHeadshots", maxDim: 1000 },
  { dir: "BrotherhoodPhotos", maxDim: 1600 },
  { dir: "AboutPhotos", maxDim: 1600 },
  // Frames hold full-bleed hero/title images — keep them larger and sharper.
  { dir: "Frames", maxDim: 2400, quality: 85 },
  // The 404 troll cutouts render in a 16rem (256px) slot, so 1000px on the
  // long edge already covers DPR 2 with room to spare. They were stored at
  // 1400 and are photographic with a soft alpha edge, which is the one
  // combination palette quantization handles badly (measured RMSE ~15 over
  // visible pixels), so the win here has to come from pixels, not palette.
  { dir: "TrollPhotos", maxDim: 1000 },
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

/* A lossless PNG re-encode of a photograph buys nothing — it is already
   entropy-coded — and can come out bigger, which the smaller-output guard then
   rejects. That is why jacob.png sat at 4.4MB through every previous run: the
   lossless attempt produced 6.2MB and was correctly thrown away.

   The lever that works on PNG is palette quantization, but it is lossy and how
   lossy depends entirely on the image. On a flat graphic like TeaserHero (4049
   distinct colours) 256 entries are plenty. On a photograph with a soft alpha
   edge, 256 entries are not, and the alpha ramp eats a chunk of them.

   So we do not guess from the directory: we quantize, measure the error
   against the source, and keep the result only if it is genuinely invisible.
   Anything over the threshold falls back to the lossless attempt. */
const PNG_MAX_RMSE = 5;

/* RMSE over premultiplied colour, 0-255 per channel — an estimate of how far
   the composited pixel moves, which is the only error a viewer can see.

   Comparing raw RGB is wrong twice over. Fully transparent pixels carry
   undefined RGB that encoders may fill with anything, so counting them scored
   the troll cutouts at RMSE 62 when the visible error was a fraction of that.
   Weighting raw RGB by source alpha overcorrects in the other direction: it
   misses error contributed by alpha *itself* shifting, and reported 2.3 for
   cutouts that measured 7.2 once actually composited onto the page colour.

   Premultiplying both sides folds colour and alpha into the one number that
   composites: over a background B, the result is aC + (1-a)B, so the error
   between two candidates is exactly the difference of their aC terms plus the
   background-weighted alpha difference. */
async function rmseAgainst(referenceBuf, candidateBuf) {
  const [a, b] = await Promise.all([
    sharp(referenceBuf).ensureAlpha().raw().toBuffer(),
    sharp(candidateBuf).ensureAlpha().raw().toBuffer(),
  ]);
  if (a.length !== b.length) return Infinity;
  let se = 0;
  let n = 0;
  for (let i = 0; i < a.length; i += 4) {
    const wa = a[i + 3] / 255;
    const wb = b[i + 3] / 255;
    for (let c = 0; c < 3; c += 1) {
      const d = a[i + c] * wa - b[i + c] * wb;
      se += d * d;
      n += 1;
    }
    // The (1-a)B term: an alpha shift changes how much background shows
    // through, which is visible even where the colour underneath matches.
    const da = (a[i + 3] - b[i + 3]) / 255;
    se += (da * 128) ** 2;
    n += 1;
  }
  return n === 0 ? 0 : Math.sqrt(se / n);
}

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

  let output;
  let note = "";
  if (ext === ".webp") {
    output = await pipeline
      .webp({ quality: quality ?? QUALITY.webp })
      .toBuffer();
  } else if (ext === ".png") {
    // The resized-but-not-yet-encoded pixels are the reference to measure
    // against: comparing a downscaled candidate to the full-size original
    // would score the resize, not the quantizer.
    const reference = await pipeline
      .clone()
      .png({ compressionLevel: 0 })
      .toBuffer();
    const lossless = await pipeline
      .clone()
      .png({ compressionLevel: 9, palette: false })
      .toBuffer();
    const quantized = await pipeline
      .clone()
      .png({
        compressionLevel: 9,
        palette: true,
        quality: quality ?? QUALITY.png,
        effort: 8,
      })
      .toBuffer();

    if (quantized.length < lossless.length) {
      const err = await rmseAgainst(reference, quantized);
      if (err <= PNG_MAX_RMSE) {
        output = quantized;
        note = ` (palette, rmse ${err.toFixed(1)})`;
      } else {
        output = lossless;
        note = ` (lossless, palette rejected at rmse ${err.toFixed(1)})`;
      }
    } else {
      output = lossless;
    }
  } else {
    output = await pipeline
      .jpeg({ quality: quality ?? QUALITY.jpeg, mozjpeg: true })
      .toBuffer();
  }
  // Normally only write a genuine byte win. When a rule sets alwaysDownscale,
  // a resize is worth taking for the decode saving even if bytes tick up.
  const keep = output.length < input.length || (alwaysDownscale && needsResize);
  if (!keep) return { saved: 0 };

  if (!DRY_RUN) await fs.writeFile(filePath, output);
  return { saved: input.length - output.length, from: input.length, note };
}

if (SEED) {
  const hashes = [];
  for await (const file of walk(ROOT)) {
    if (!ruleFor(file)) continue;
    hashes.push(sha(await fs.readFile(file)));
  }
  await fs.writeFile(MANIFEST, JSON.stringify(hashes, null, 0));
  console.log(`seeded manifest with ${hashes.length} already-optimized files`);
  process.exit(0);
}

const done = await loadManifest();
let totalSaved = 0;
let touched = 0;
let skipped = 0;
/* Every file we leave in a known-good state, by its final hash. Only --seed
   used to write this, so a normal run optimized files and then forgot it had:
   the next run saw unfamiliar hashes and re-encoded the lot, which is exactly
   the compounding loss the manifest was introduced to stop. A run now records
   what it produced. Files that threw are left out so they are retried. */
const settled = [];
for await (const file of walk(ROOT)) {
  const rule = ruleFor(file);
  if (!rule) continue;
  try {
    const before = sha(await fs.readFile(file));
    if (done.has(before)) {
      skipped += 1;
      settled.push(before);
      continue;
    }
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
        `${path.relative(ROOT, file)}: ${(result.from / 1e6).toFixed(2)}MB → ${((result.from - result.saved) / 1e6).toFixed(2)}MB${result.note ?? ""}`,
      );
    }
    settled.push(sha(await fs.readFile(file)));
  } catch (err) {
    console.error(`SKIP ${file}: ${err.message}`);
  }
}

if (!DRY_RUN) {
  await fs.writeFile(MANIFEST, JSON.stringify(settled, null, 0));
}

console.log(
  `\n${DRY_RUN ? "[dry-run] " : ""}${touched} files optimized, ${skipped} already done, ${(totalSaved / 1e6).toFixed(1)}MB saved`,
);
