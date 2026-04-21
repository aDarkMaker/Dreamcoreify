import type { ImageData, HazeOptions } from "../types";
import {
  clampByte,
  lerp,
  normalizedCenterDistance,
  smoothstep,
} from "../utils/math";
import { hexToRgb } from "../utils/color";

const DEFAULTS: Required<HazeOptions> = {
  intensity: 0.25,
  color: "#f5e6d3",
  distribution: "uniform",
};

export function applyHaze(
  imageData: ImageData,
  options: HazeOptions = {},
  opacity: number = 1,
  globalIntensity: number = 1,
): ImageData {
  const opts = { ...DEFAULTS, ...options };
  const { data, width, height } = imageData;

  const fog = hexToRgb(opts.color);
  const intensity = opts.intensity * globalIntensity;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;

      let fogStrength = intensity;

      switch (opts.distribution) {
        case "radial-center": {
          const dist = normalizedCenterDistance(x, y, width, height);
          fogStrength *= 1 - smoothstep(0, 0.8, dist);
          break;
        }
        case "radial-edge": {
          const dist = normalizedCenterDistance(x, y, width, height);
          fogStrength *= smoothstep(0.2, 0.9, dist);
          break;
        }
        case "gradient-top": {
          fogStrength *= 1 - y / height;
          break;
        }
        case "gradient-bottom": {
          fogStrength *= y / height;
          break;
        }
        case "uniform":
        default:
          break;
      }

      const origR = data[i];
      const origG = data[i + 1];
      const origB = data[i + 2];

      const r = lerp(origR, fog.r, fogStrength);
      const g = lerp(origG, fog.g, fogStrength);
      const b = lerp(origB, fog.b, fogStrength);

      data[i] = clampByte(lerp(origR, r, opacity));
      data[i + 1] = clampByte(lerp(origG, g, opacity));
      data[i + 2] = clampByte(lerp(origB, b, opacity));
    }
  }

  return imageData;
}
