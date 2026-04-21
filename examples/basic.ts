import fs from 'fs';
import path from 'path';
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

  const ext = result.format === 'jpg' ? 'jpg' : result.format;
  const baseName = path.basename(INPUT, path.extname(INPUT));
  const outPath = path.join(outDir, `${baseName}_${presetName}.${ext}`);

  fs.writeFileSync(outPath, result.buffer);
  console.log(`Saved: ${outPath} (${result.width}x${result.height}, ${(result.buffer.length / 1024).toFixed(1)}KB)`);
}

main().catch(console.error);