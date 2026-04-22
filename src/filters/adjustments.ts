import type { ImageData, AdjustmentsOptions } from "../types";
import { clampByte, lerp, smoothstep } from "../utils/math";
import { adjustSaturation, applyTemperature, luminance } from "../utils/color";

const DEFAULTS: Required<AdjustmentsOptions> = {
  brightness: 0.05,
  contrast: -0.15,
  saturation: -0.1,
  temperature: 0.1,
  highlightsBrightness: 0,
  shadowsBrightness: 0,
};

export function applyAdjustments(
  imageData: ImageData,
  options: AdjustmentsOptions = {},
  opacity: number = 1,
  globalIntensity: number = 1,
): ImageData {
  const opts = { ...DEFAULTS, ...options };
  const { data } = imageData;

  const bright = opts.brightness * globalIntensity;
  const cont = opts.contrast * globalIntensity;
  const sat = opts.saturation * globalIntensity;
  const temp = opts.temperature * globalIntensity;
  const hlBright = opts.highlightsBrightness * globalIntensity;
  const shBright = opts.shadowsBrightness * globalIntensity;

  const contrastFactor = Math.pow(2, cont * 1.5);

  for (let i = 0; i < data.length; i += 4) {
    const origR = data[i];
    const origG = data[i + 1];
    const origB = data[i + 2];

    let r = origR + bright * 255;
    let g = origG + bright * 255;
    let b = origB + bright * 255;

    r = (r - 128) * contrastFactor + 128;
    g = (g - 128) * contrastFactor + 128;
    b = (b - 128) * contrastFactor + 128;

    const satResult = adjustSaturation(clampByte(r), clampByte(g), clampByte(b), sat);
    r = satResult.r;
    g = satResult.g;
    b = satResult.b;

    const tempResult = applyTemperature(r, g, b, temp);
    r = tempResult.r;
    g = tempResult.g;
    b = tempResult.b;

    if (hlBright !== 0 || shBright !== 0) {
      const lum = luminance(clampByte(r), clampByte(g), clampByte(b)) / 255;
      const hlW = smoothstep(0.55, 0.85, lum);
      const shW = 1 - smoothstep(0.15, 0.45, lum);
      const zoneBright = hlBright * hlW + shBright * shW;
      r += zoneBright * 255;
      g += zoneBright * 255;
      b += zoneBright * 255;
    }

    data[i] = clampByte(lerp(origR, r, opacity));
    data[i + 1] = clampByte(lerp(origG, g, opacity));
    data[i + 2] = clampByte(lerp(origB, b, opacity));
  }

  return imageData;
}
