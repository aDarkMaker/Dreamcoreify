import type { ImageData, ChromaticAberrationOptions } from "../types";
import {
  clampByte,
  lerp,
  degToRad,
  clamp,
  normalizedCenterDistance,
} from "../utils/math";
import { cloneImageData } from "../utils/image-io";

const DEFAULTS: Required<ChromaticAberrationOptions> = {
  offset: 3,
  angle: 0,
  radial: true,
};

export function applyChromaticAberration(
  imageData: ImageData,
  options: ChromaticAberrationOptions = {},
  opacity: number = 1,
  globalIntensity: number = 1,
): ImageData {
  const opts = { ...DEFAULTS, ...options };
  const { data, width, height } = imageData;

  const baseOffset = opts.offset * globalIntensity;
  if (baseOffset < 0.5) return imageData;

  const original = cloneImageData(imageData);
  const origData = original.data;

  const rad = degToRad(opts.angle);
  const dx = Math.cos(rad);
  const dy = Math.sin(rad);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      let pixelOffset = baseOffset;
      if (opts.radial) {
        const dist = normalizedCenterDistance(x, y, width, height);
        pixelOffset *= dist;
      }

      const rx = clamp(Math.round(x + dx * pixelOffset), 0, width - 1);
      const ry = clamp(Math.round(y + dy * pixelOffset), 0, height - 1);
      const rIdx = (ry * width + rx) * 4;

      const bx = clamp(Math.round(x - dx * pixelOffset), 0, width - 1);
      const by = clamp(Math.round(y - dy * pixelOffset), 0, height - 1);
      const bIdx = (by * width + bx) * 4;

      const newR = origData[rIdx];
      const newG = origData[idx + 1];
      const newB = origData[bIdx + 2];

      data[idx] = clampByte(lerp(origData[idx], newR, opacity));
      data[idx + 1] = clampByte(lerp(origData[idx + 1], newG, opacity));
      data[idx + 2] = clampByte(lerp(origData[idx + 2], newB, opacity));
    }
  }

  return imageData;
}
