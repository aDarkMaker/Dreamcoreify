import type { ImageData, EdgeGlowOptions } from "../types";
import { clampByte, lerp, smoothstep } from "../utils/math";
import { luminance, hexToRgb, tintBlend } from "../utils/color";

const DEFAULTS: Required<EdgeGlowOptions> = {
  radius: 4,
  threshold: 18,
  exposureBoost: 0.22,
  shadowTint: "#c83030",
  highlightTint: "#4060d0",
  tintStrength: 0.18,
};

export function applyEdgeGlow(
  imageData: ImageData,
  options: EdgeGlowOptions = {},
  opacity: number = 1,
  globalIntensity: number = 1,
): ImageData {
  const opts = { ...DEFAULTS, ...options };
  const { data, width, height } = imageData;
  const boost = opts.exposureBoost * globalIntensity;
  const tint = opts.tintStrength * globalIntensity;
  const shadowRgb = hexToRgb(opts.shadowTint);
  const highlightRgb = hexToRgb(opts.highlightTint);
  const r = Math.max(1, Math.round(opts.radius));

  const lum = new Float32Array(width * height);
  for (let i = 0; i < data.length; i += 4) {
    lum[i >> 2] = luminance(data[i], data[i + 1], data[i + 2]);
  }

  const localAvg = new Float32Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      let count = 0;
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            sum += lum[ny * width + nx];
            count++;
          }
        }
      }
      localAvg[y * width + x] = sum / count;
    }
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const origR = data[idx];
      const origG = data[idx + 1];
      const origB = data[idx + 2];

      const pixLum = lum[y * width + x];
      const avg = localAvg[y * width + x];
      const diff = Math.abs(pixLum - avg);
      const edgeWeight = smoothstep(opts.threshold, opts.threshold * 2.5, diff);

      if (edgeWeight <= 0) continue;

      let r2 = origR;
      let g2 = origG;
      let b2 = origB;

      const expFactor = boost * edgeWeight;
      r2 = lerp(r2, 255, expFactor);
      g2 = lerp(g2, 255, expFactor);
      b2 = lerp(b2, 255, expFactor);

      if (pixLum < avg) {
        const t = tintBlend(r2, g2, b2, shadowRgb, tint * edgeWeight);
        r2 = t.r;
        g2 = t.g;
        b2 = t.b;
      } else {
        const t = tintBlend(r2, g2, b2, highlightRgb, tint * edgeWeight);
        r2 = t.r;
        g2 = t.g;
        b2 = t.b;
      }

      data[idx] = clampByte(lerp(origR, r2, opacity));
      data[idx + 1] = clampByte(lerp(origG, g2, opacity));
      data[idx + 2] = clampByte(lerp(origB, b2, opacity));
    }
  }

  return imageData;
}
