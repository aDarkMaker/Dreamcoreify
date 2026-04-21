import fs from 'fs';
import path from 'path';
import { dreamcoreify, getPresetNames } from '../src/index';

const INPUT = process.argv[2];
if (!INPUT) {
  console.log('Usage: npx tsx examples/all-presets.ts <input-image>');
  process.exit(1);
}

const outDir = path.join(path.dirname(INPUT), 'dreamcore-output');
fs.mkdirSync(outDir, { recursive: true });

async function main() {
  const presets = getPresetNames();
  console.log(`Processing ${INPUT} with ${presets.length} presets...\n`);

  for (const preset of presets) {
    const start = Date.now();
    const result = await dreamcoreify(INPUT, { preset });
    const elapsed = Date.now() - start;

    const baseName = path.basename(INPUT, path.extname(INPUT));
    const outPath = path.join(outDir, `${baseName}_${preset}.png`);
    fs.writeFileSync(outPath, result.buffer);

    console.log(`  [${preset}] ${elapsed}ms → ${outPath}`);
  }

  console.log('\nDone!');
}

main().catch(console.error);