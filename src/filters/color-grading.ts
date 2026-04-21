import type { ImageData, ColorGradingOptions } from "../types";
import { clampByte, lerp, smoothstep } from "../utils/math";
import { hexToRgb, luminance, tintBlend } from "../utils/color";

const DEFAULTS: Required<ColorGradingOptions> = {
  shadowsTint: "#1a0533",
  midtonesTint: "#8b6914",
  highlightsTint: "#c9a8e8",
  strength: 0.3,
};

export function applyColorGrading(
  imageData: ImageData,
  options: ColorGradingOptions = {},
  opacity: number = 1,
  globalIntensity: number = 1,
): ImageData {
  const opts = { ...DEFAULTS, ...options };
  const { data } = imageData;

  const shadowRgb = hexToRgb(opts.shadowsTint);
  const midRgb = hexToRgb(opts.midtonesTint);
  const highRgb = hexToRgb(opts.highlightsTint);
  const strength = opts.strength * globalIntensity;

  for (let i = 0; i < data.length; i += 4) {
    const origR = data[i];
    const origG = data[i + 1];
    const origB = data[i + 2];

    const lum = luminance(origR, origG, origB) / 255;

    const shadowWeight = 1 - smoothstep(0.0, 0.4, lum);
    const midWeight =
      smoothstep(0.15, 0.4, lum) * (1 - smoothstep(0.6, 0.85, lum));
    const highWeight = smoothstep(0.6, 0.85, lum);

    let r = origR,
      g = origG,
      b = origB;

    if (shadowWeight > 0) {
      const t = tintBlend(r, g, b, shadowRgb, strength * shadowWeight);
      r = t.r;
      g = t.g;
      b = t.b;
    }
    if (midWeight > 0) {
      const t = tintBlend(r, g, b, midRgb, strength * midWeight);
      r = t.r;
      g = t.g;
      b = t.b;
    }
    if (highWeight > 0) {
      const t = tintBlend(r, g, b, highRgb, strength * highWeight);
      r = t.r;
      g = t.g;
      b = t.b;
    }

    data[i] = clampByte(lerp(origR, r, opacity));
    data[i + 1] = clampByte(lerp(origG, g, opacity));
    data[i + 2] = clampByte(lerp(origB, b, opacity));
  }

  return imageData;
}
