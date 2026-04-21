import fs from 'fs';
import path from 'path';
import { dreamcoreifyTransitionFrame } from '../src/index';

const INPUT = process.argv[2];
if (!INPUT) {
  console.log('Usage: npx tsx examples/transition.ts <input-image>');
  process.exit(1);
}

const TOTAL_FRAMES = 10;

async function main() {
  const outDir = path.join(path.dirname(INPUT), 'dreamcore-output', 'transition');
  fs.mkdirSync(outDir, { recursive: true });

  const baseName = path.basename(INPUT, path.extname(INPUT));

  console.log(`Generating ${TOTAL_FRAMES} transition frames...\n`);

  for (let frame = 0; frame < TOTAL_FRAMES; frame++) {
    const start = Date.now();

    const result = await dreamcoreifyTransitionFrame(INPUT, frame, {
      preset: 'classic',
      transitionFrames: TOTAL_FRAMES,
    });

    const elapsed = Date.now() - start;
    const outPath = path.join(outDir, `${baseName}_frame_${String(frame).padStart(3, '0')}.png`);
    fs.writeFileSync(outPath, result.buffer);

    const progress = Math.round(((frame + 1) / TOTAL_FRAMES) * 100);
    console.log(`  Frame ${frame}/${TOTAL_FRAMES - 1} (${progress}%) ${elapsed}ms → ${outPath}`);
  }

  console.log('\nDone! Use ffmpeg to combine into video:');
  console.log(`  ffmpeg -framerate 10 -i ${outDir}/${baseName}_frame_%03d.png -c:v libx264 output.mp4`);
}

main().catch(console.error);