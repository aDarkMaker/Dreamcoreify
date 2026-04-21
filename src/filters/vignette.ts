import type { ImageData, VignetteOptions } from "../types";
import { clampByte, lerp, smoothstep } from "../utils/math";
import { hexToRgb } from "../utils/color";

const DEFAULTS: Required<VignetteOptions> = {
  intensity: 0.5,
  color: "#000000",
  roundness: 0.3,
  feather: 0.6,
};

export function applyVignette(
  imageData: ImageData,
  options: VignetteOptions = {},
  opacity: number = 1,
  globalIntensity: number = 1,
): ImageData {
  const opts = { ...DEFAULTS, ...options };
  const { data, width, height } = imageData;

  const vigColor = hexToRgb(opts.color);
  const intensity = opts.intensity * globalIntensity;

  const cx = width / 2;
  const cy = height / 2;

  const aspectRatio = width / height;
  const rx = cx * (1 + opts.roundness * (aspectRatio - 1));
  const ry = cy * (1 + opts.roundness * (1 / aspectRatio - 1));

  const innerEdge = 1 - opts.feather;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      const ex = (x - cx) / rx;
      const ey = (y - cy) / ry;
      const ellipseDist = Math.sqrt(ex * ex + ey * ey);

      const vignetteFactor =
        smoothstep(innerEdge, 1.0, ellipseDist) * intensity;

      if (vignetteFactor > 0) {
        const origR = data[idx];
        const origG = data[idx + 1];
        const origB = data[idx + 2];

        const r = lerp(origR, vigColor.r, vignetteFactor);
        const g = lerp(origG, vigColor.g, vignetteFactor);
        const b = lerp(origB, vigColor.b, vignetteFactor);

        data[idx] = clampByte(lerp(origR, r, opacity));
        data[idx + 1] = clampByte(lerp(origG, g, opacity));
        data[idx + 2] = clampByte(lerp(origB, b, opacity));
      }
    }
  }

  return imageData;
}
