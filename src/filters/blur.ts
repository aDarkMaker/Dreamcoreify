import type { ImageData, BlurOptions } from "../types";
import { clampByte, lerp, degToRad, clamp } from "../utils/math";
import { cloneImageData, gaussianBlur } from "../utils/image-io";

const DEFAULTS: Required<BlurOptions> = {
  type: "gaussian",
  radius: 2,
  angle: 0,
};

export async function applyBlur(
  imageData: ImageData,
  options: BlurOptions = {},
  opacity: number = 1,
  globalIntensity: number = 1,
): Promise<ImageData> {
  const opts = { ...DEFAULTS, ...options };
  const effectiveRadius = opts.radius * globalIntensity;

  if (effectiveRadius < 0.3) return imageData;

  const { data, width, height } = imageData;
  const original = cloneImageData(imageData);

  let blurred: ImageData;

  switch (opts.type) {
    case "radial": {
      blurred = applyRadialBlur(imageData, effectiveRadius);
      break;
    }
    case "motion": {
      blurred = applyMotionBlur(imageData, effectiveRadius, opts.angle);
      break;
    }
    case "gaussian":
    default: {
      blurred = await gaussianBlur(imageData, effectiveRadius);
      break;
    }
  }

  const blurData = blurred.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = clampByte(lerp(original.data[i], blurData[i], opacity));
    data[i + 1] = clampByte(
      lerp(original.data[i + 1], blurData[i + 1], opacity),
    );
    data[i + 2] = clampByte(
      lerp(original.data[i + 2], blurData[i + 2], opacity),
    );
  }

  return imageData;
}

function applyRadialBlur(imageData: ImageData, radius: number): ImageData {
  const { data, width, height } = imageData;
  const result = cloneImageData(imageData);
  const resultData = result.data;

  const cx = width / 2;
  const cy = height / 2;
  const samples = Math.max(4, Math.round(radius * 2));

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      let rSum = 0,
        gSum = 0,
        bSum = 0;

      for (let s = 0; s < samples; s++) {
        const t = s / samples;
        const scale = 1 + t * radius * 0.005;

        const sx = clamp(Math.round(cx + (x - cx) * scale), 0, width - 1);
        const sy = clamp(Math.round(cy + (y - cy) * scale), 0, height - 1);
        const si = (sy * width + sx) * 4;

        rSum += data[si];
        gSum += data[si + 1];
        bSum += data[si + 2];
      }

      resultData[idx] = clampByte(rSum / samples);
      resultData[idx + 1] = clampByte(gSum / samples);
      resultData[idx + 2] = clampByte(bSum / samples);
      resultData[idx + 3] = data[idx + 3];
    }
  }

  return result;
}

function applyMotionBlur(
  imageData: ImageData,
  radius: number,
  angle: number,
): ImageData {
  const { data, width, height } = imageData;
  const result = cloneImageData(imageData);
  const resultData = result.data;

  const rad = degToRad(angle);
  const dx = Math.cos(rad);
  const dy = Math.sin(rad);
  const samples = Math.max(3, Math.round(radius * 2));

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      let rSum = 0,
        gSum = 0,
        bSum = 0;

      for (let s = -samples; s <= samples; s++) {
        const sx = clamp(
          Math.round(x + dx * s * (radius / samples)),
          0,
          width - 1,
        );
        const sy = clamp(
          Math.round(y + dy * s * (radius / samples)),
          0,
          height - 1,
        );
        const si = (sy * width + sx) * 4;

        rSum += data[si];
        gSum += data[si + 1];
        bSum += data[si + 2];
      }

      const count = samples * 2 + 1;
      resultData[idx] = clampByte(rSum / count);
      resultData[idx + 1] = clampByte(gSum / count);
      resultData[idx + 2] = clampByte(bSum / count);
      resultData[idx + 3] = data[idx + 3];
    }
  }

  return result;
}
