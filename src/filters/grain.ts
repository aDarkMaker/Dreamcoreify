import type { ImageData, GrainOptions } from "../types";
import { clampByte, lerp, seededRandom, gaussianRandom } from "../utils/math";

const DEFAULTS: Required<GrainOptions> = {
  intensity: 0.3,
  size: 1,
  colored: false,
};

export function applyGrain(
  imageData: ImageData,
  options: GrainOptions = {},
  opacity: number = 1,
  globalIntensity: number = 1,
): ImageData {
  const opts = { ...DEFAULTS, ...options };
  const { data, width, height } = imageData;

  const intensity = opts.intensity * globalIntensity * 80;
  const size = Math.max(1, Math.round(opts.size));

  const rng = seededRandom(width * height + 42);

  const grainWidth = Math.ceil(width / size);
  const grainHeight = Math.ceil(height / size);

  const noiseR = new Float32Array(grainWidth * grainHeight);
  const noiseG = new Float32Array(grainWidth * grainHeight);
  const noiseB = new Float32Array(grainWidth * grainHeight);

  for (let i = 0; i < noiseR.length; i++) {
    noiseR[i] = gaussianRandom(rng, 0, intensity);
    if (opts.colored) {
      noiseG[i] = gaussianRandom(rng, 0, intensity);
      noiseB[i] = gaussianRandom(rng, 0, intensity);
    } else {
      noiseG[i] = noiseR[i];
      noiseB[i] = noiseR[i];
    }
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const gi = Math.floor(y / size) * grainWidth + Math.floor(x / size);

      const origR = data[idx];
      const origG = data[idx + 1];
      const origB = data[idx + 2];

      const r = origR + noiseR[gi];
      const g = origG + noiseG[gi];
      const b = origB + noiseB[gi];

      data[idx] = clampByte(lerp(origR, r, opacity));
      data[idx + 1] = clampByte(lerp(origG, g, opacity));
      data[idx + 2] = clampByte(lerp(origB, b, opacity));
    }
  }

  return imageData;
}
