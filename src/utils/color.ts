import { clamp, clampByte } from "./math";

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export function hexToRgb(hex: string): RGB {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 0xff,
    g: (num >> 8) & 0xff,
    b: num & 0xff,
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (v: number) =>
    clampByte(Math.round(v)).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function rgbToHsl(r: number, g: number, b: number): HSL {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;

  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    if (max === rn) {
      h = ((gn - bn) / delta + (gn < bn ? 6 : 0)) * 60;
    } else if (max === gn) {
      h = ((bn - rn) / delta + 2) * 60;
    } else {
      h = ((rn - gn) / delta + 4) * 60;
    }
  }

  return { h, s, l };
}

export function hslToRgb(h: number, s: number, l: number): RGB {
  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hn = h / 360;

  return {
    r: Math.round(hue2rgb(p, q, hn + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, hn) * 255),
    b: Math.round(hue2rgb(p, q, hn - 1 / 3) * 255),
  };
}

export function luminance(r: number, g: number, b: number): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function tintBlend(
  srcR: number,
  srcG: number,
  srcB: number,
  tint: RGB,
  strength: number,
): RGB {
  const t = clamp(strength, 0, 1);
  return {
    r: clampByte(srcR + (tint.r - srcR) * t),
    g: clampByte(srcG + (tint.g - srcG) * t),
    b: clampByte(srcB + (tint.b - srcB) * t),
  };
}

export function applyTemperature(
  r: number,
  g: number,
  b: number,
  temperature: number,
): RGB {
  const t = clamp(temperature, -1, 1);
  return {
    r: clampByte(r + t * 20),
    g: clampByte(g + t * 10),
    b: clampByte(b - t * 20),
  };
}

export function adjustSaturation(
  r: number,
  g: number,
  b: number,
  amount: number,
): RGB {
  const lum = luminance(r, g, b);
  const factor = 1 + clamp(amount, -1, 1);
  return {
    r: clampByte(lum + (r - lum) * factor),
    g: clampByte(lum + (g - lum) * factor),
    b: clampByte(lum + (b - lum) * factor),
  };
}
