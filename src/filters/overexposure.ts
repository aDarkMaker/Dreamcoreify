import type { ImageData, OverexposureOptions } from "../types";
import { clampByte, lerp, smoothstep } from "../utils/math";
import { luminance } from "../utils/color";

const DEFAULTS: Required<OverexposureOptions> = {
  intensity: 0.2,
  threshold: 200,
};

export function applyOverexposure(
  imageData: ImageData,
  options: OverexposureOptions = {},
  opacity: number = 1,
  globalIntensity: number = 1,
): ImageData {
  const opts = { ...DEFAULTS, ...options };
  const { data } = imageData;

  const intensity = opts.intensity * globalIntensity;
  const threshold = opts.threshold;

  for (let i = 0; i < data.length; i += 4) {
    const origR = data[i];
    const origG = data[i + 1];
    const origB = data[i + 2];

    const lum = luminance(origR, origG, origB);
    const factor = smoothstep(threshold - 30, threshold + 10, lum) * intensity;

    if (factor > 0) {
      const r = lerp(origR, 255, factor);
      const g = lerp(origG, 255, factor);
      const b = lerp(origB, 255, factor);

      data[i] = clampByte(lerp(origR, r, opacity));
      data[i + 1] = clampByte(lerp(origG, g, opacity));
      data[i + 2] = clampByte(lerp(origB, b, opacity));
    }
  }

  return imageData;
}
