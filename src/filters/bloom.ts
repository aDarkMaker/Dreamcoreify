import type { ImageData, BloomOptions } from "../types";
import { clampByte, lerp } from "../utils/math";
import { luminance } from "../utils/color";
import { cloneImageData, gaussianBlur } from "../utils/image-io";

const DEFAULTS: Required<BloomOptions> = {
  intensity: 0.4,
  radius: 20,
  threshold: 180,
};

export async function applyBloom(
  imageData: ImageData,
  options: BloomOptions = {},
  opacity: number = 1,
  globalIntensity: number = 1,
): Promise<ImageData> {
  const opts = { ...DEFAULTS, ...options };
  const { data } = imageData;
  const intensity = opts.intensity * globalIntensity;

  const brightPass = cloneImageData(imageData);
  const bpData = brightPass.data;

  for (let i = 0; i < bpData.length; i += 4) {
    const lum = luminance(bpData[i], bpData[i + 1], bpData[i + 2]);
    if (lum < opts.threshold) {
      bpData[i] = 0;
      bpData[i + 1] = 0;
      bpData[i + 2] = 0;
    }
  }

  const blurred = await gaussianBlur(brightPass, opts.radius);
  const blurData = blurred.data;

  for (let i = 0; i < data.length; i += 4) {
    const origR = data[i];
    const origG = data[i + 1];
    const origB = data[i + 2];

    const bloomR = blurData[i] * intensity;
    const bloomG = blurData[i + 1] * intensity;
    const bloomB = blurData[i + 2] * intensity;

    const screenR = 255 - ((255 - origR) * (255 - bloomR)) / 255;
    const screenG = 255 - ((255 - origG) * (255 - bloomG)) / 255;
    const screenB = 255 - ((255 - origB) * (255 - bloomB)) / 255;

    data[i] = clampByte(lerp(origR, screenR, opacity));
    data[i + 1] = clampByte(lerp(origG, screenG, opacity));
    data[i + 2] = clampByte(lerp(origB, screenB, opacity));
  }

  return imageData;
}
