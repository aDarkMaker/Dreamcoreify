import sharp from "sharp";
import type { ImageInput, ImageData, OutputFormat } from "../types";

export async function decodeImage(input: ImageInput): Promise<ImageData> {
  let sharpInstance: sharp.Sharp;

  if (typeof input === "string") {
    sharpInstance = sharp(input);
  } else {
    sharpInstance = sharp(Buffer.from(input));
  }

  const { data, info } = await sharpInstance
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  return {
    data: new Uint8ClampedArray(data.buffer, data.byteOffset, data.byteLength),
    width: info.width,
    height: info.height,
  };
}

export async function encodeImage(
  imageData: ImageData,
  format: OutputFormat = "png",
  quality: number = 85,
): Promise<Buffer> {
  const { data, width, height } = imageData;

  let pipeline = sharp(Buffer.from(data.buffer), {
    raw: {
      width,
      height,
      channels: 4,
    },
  });

  switch (format) {
    case "jpg":
      pipeline = pipeline.jpeg({ quality });
      break;
    case "webp":
      pipeline = pipeline.webp({ quality });
      break;
    case "png":
    default:
      pipeline = pipeline.png();
      break;
  }

  return pipeline.toBuffer();
}

export function createImageData(width: number, height: number): ImageData {
  return {
    data: new Uint8ClampedArray(width * height * 4),
    width,
    height,
  };
}

export function cloneImageData(source: ImageData): ImageData {
  return {
    data: new Uint8ClampedArray(source.data),
    width: source.width,
    height: source.height,
  };
}

export function getPixel(
  imageData: ImageData,
  x: number,
  y: number,
): [number, number, number, number] {
  const idx = (y * imageData.width + x) * 4;
  return [
    imageData.data[idx],
    imageData.data[idx + 1],
    imageData.data[idx + 2],
    imageData.data[idx + 3],
  ];
}

export function setPixel(
  imageData: ImageData,
  x: number,
  y: number,
  r: number,
  g: number,
  b: number,
  a: number = 255,
): void {
  const idx = (y * imageData.width + x) * 4;
  imageData.data[idx] = r;
  imageData.data[idx + 1] = g;
  imageData.data[idx + 2] = b;
  imageData.data[idx + 3] = a;
}

export async function gaussianBlur(
  imageData: ImageData,
  sigma: number,
): Promise<ImageData> {
  if (sigma <= 0) return imageData;

  const { width, height, data } = imageData;
  const blurred = await sharp(Buffer.from(data.buffer), {
    raw: { width, height, channels: 4 },
  })
    .blur(sigma)
    .raw()
    .toBuffer();

  return {
    data: new Uint8ClampedArray(
      blurred.buffer,
      blurred.byteOffset,
      blurred.byteLength,
    ),
    width,
    height,
  };
}
