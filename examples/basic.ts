import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { dreamcoreify, getPresetNames } from '../src/index';

const INPUT = process.argv[2];
if (!INPUT) {
  console.log('Usage: npx tsx examples/basic.ts <input-image> [preset]');
  console.log(`Available presets: ${getPresetNames().join(', ')}`);
  process.exit(1);
}

const presetName = (process.argv[3] || 'classic') as Parameters<typeof dreamcoreify>[1] extends infer O ? O extends { preset?: infer P } ? NonNullable<P> : never : never;

const outDir = path.join(path.dirname(INPUT), 'dreamcore-output');
fs.mkdirSync(outDir, { recursive: true });

async function main() {
  console.log(`Processing: ${INPUT}`);
  console.log(`Preset: ${presetName}`);

  const result = await dreamcoreify(INPUT, { preset: presetName as any });

  const baseName = path.basename(INPUT, path.extname(INPUT));

  const [origMeta, origRaw] = await Promise.all([
    sharp(INPUT).metadata(),
    sharp(INPUT).png().toBuffer(),
  ]);

  const w = origMeta.width!;
  const h = origMeta.height!;

  const processedResized = await sharp(result.buffer)
    .resize(w, h, { fit: 'fill' })
    .png()
    .toBuffer();

  const comparePath = path.join(outDir, `${baseName}_${presetName}_compare.png`);

  await sharp({
    create: { width: w * 2, height: h, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 1 } },
  })
    .composite([
      { input: origRaw, left: 0, top: 0 },
      { input: processedResized, left: w, top: 0 },
    ])
    .png()
    .toFile(comparePath);

  console.log(`Saved compare: ${comparePath} (${w * 2}x${h})`);
}

main().catch(console.error);
