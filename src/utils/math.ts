export function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}

export function clampByte(value: number): number {
  return value < 0 ? 0 : value > 255 ? 255 : value;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function inverseLerp(a: number, b: number, value: number): number {
  if (a === b) return 0;
  return clamp((value - a) / (b - a), 0, 1);
}

export function remap(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  const t = inverseLerp(inMin, inMax, value);
  return lerp(outMin, outMax, t);
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export function distance(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
}

export function normalizedCenterDistance(
  x: number,
  y: number,
  width: number,
  height: number,
): number {
  const cx = width / 2;
  const cy = height / 2;
  const maxDist = distance(0, 0, cx, cy);
  return clamp(distance(x, y, cx, cy) / maxDist, 0, 1);
}

export function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export function gaussianRandom(
  rng: () => number,
  mean: number = 0,
  stddev: number = 1,
): number {
  const u1 = rng() || 1e-10; // 避免 log(0)
  const u2 = rng();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return z * stddev + mean;
}

export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}
