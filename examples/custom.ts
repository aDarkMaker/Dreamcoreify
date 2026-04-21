import fs from 'fs';
import path from 'path';
import { dreamcoreify } from '../src/index';

const INPUT = process.argv[2];
if (!INPUT) {
  console.log('Usage: npx tsx examples/custom.ts <input-image>');
  process.exit(1);
}

async function main() {
  const result = await dreamcoreify(INPUT, {
    globalIntensity: 0.8,

    adjustments: {
      options: { brightness: 0.08, contrast: -0.2, saturation: -0.15, temperature: 0.2 },
    },
    colorGrading: {
      options: {
        shadowsTint: '#1a0033',
        midtonesTint: '#996633',
        highlightsTint: '#ffddee',
        strength: 0.35,
      },
    },
    bloom: {
      options: { intensity: 0.5, radius: 25, threshold: 160 },
    },
    haze: {
      options: { intensity: 0.2, color: '#ffe8d0', distribution: 'gradient-bottom' },
    },
    chromaticAberration: {
      options: { offset: 4, angle: 15, radial: true },
    },
    grain: {
      options: { intensity: 0.35, size: 1, colored: false },
    },
    vignette: {
      options: { intensity: 0.6, color: '#0a0005', feather: 0.55 },
    },
    blur: {
      enabled: false,
    },
    overexposure: {
      options: { intensity: 0.25, threshold: 185 },
    },

    output: { format: 'png' },
  });

  const outDir = path.join(path.dirname(INPUT), 'dreamcore-output');
  fs.mkdirSync(outDir, { recursive: true });

  const baseName = path.basename(INPUT, path.extname(INPUT));
  const outPath = path.join(outDir, `${baseName}_custom.png`);
  fs.writeFileSync(outPath, result.buffer);

  console.log(`Saved: ${outPath} (${result.width}x${result.height})`);
}

main().catch(console.error);