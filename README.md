# Dreamcoreify

Transform any image into dreamcore / liminal aesthetic.

9 composable filters · 6 built-in presets · transition frame generation · TypeScript + ESM/CJS

[中文文档](./README_CN.md)

## Install

```bash
npm install dreamcoreify
```

> Requires Node.js ≥ 18.

## Quick Start

```ts
import fs from 'fs';
import { dreamcoreify } from 'dreamcoreify';

const result = await dreamcoreify('./photo.jpg', { preset: 'classic' });
fs.writeFileSync('output.png', result.buffer);
```

## Presets

| Name | Style |
|------|-------|
| `classic` | Warm yellow bloom, low contrast, uniform haze |
| `liminal` | Cold green tint, strong vignette, fluorescent overexposure |
| `nostalgic` | Heavy grain, faded tones, warm temperature |
| `void` | Ultra-low saturation, dark haze, deep vignette |
| `ethereal` | High bloom, soft blur, colored grain |
| `vaporwave` | Neon green shadows, hot pink midtones, orange highlights |

```ts
import { getPresetNames } from 'dreamcoreify';
console.log(getPresetNames());
// ['classic', 'liminal', 'nostalgic', 'void', 'ethereal', 'vaporwave']
```

## Custom Options

```ts
const result = await dreamcoreify('./photo.jpg', {
  preset: 'classic',
  globalIntensity: 0.8,
  bloom: { options: { intensity: 0.7, radius: 20 } },
  grain: { enabled: false },
  output: { format: 'webp', quality: 90 },
});
```

Fully custom (no preset):

```ts
const result = await dreamcoreify('./photo.jpg', {
  adjustments: { options: { brightness: 0.1, contrast: -0.2, saturation: -0.1, temperature: 0.15 } },
  colorGrading: { options: { shadowsTint: '#0a4a2a', midtonesTint: '#ff2090', highlightsTint: '#ffaa20', strength: 0.6 } },
  bloom: { options: { intensity: 0.5, radius: 15, threshold: 170 } },
  haze: { options: { intensity: 0.2, color: '#f5e6d3', distribution: 'gradient-top' } },
  blur: { options: { type: 'gaussian', radius: 1 } },
  chromaticAberration: { options: { offset: 4, angle: 15, radial: true } },
  overexposure: { options: { intensity: 0.3, threshold: 180 } },
  grain: { options: { intensity: 0.3, size: 1, colored: false } },
  vignette: { options: { intensity: 0.5, color: '#000000', roundness: 0.3, feather: 0.6 } },
});
```

## Filters

| Filter | Key Parameters |
|--------|---------------|
| **Adjustments** | `brightness` `contrast` `saturation` `temperature` |
| **Color Grading** | `shadowsTint` `midtonesTint` `highlightsTint` `strength` |
| **Overexposure** | `intensity` `threshold` |
| **Bloom** | `intensity` `radius` `threshold` |
| **Haze** | `intensity` `color` `distribution` |
| **Blur** | `type(gaussian/radial/motion)` `radius` `angle` |
| **Chromatic Aberration** | `offset` `angle` `radial` |
| **Grain** | `intensity` `size` `colored` |
| **Vignette** | `intensity` `color` `roundness` `feather` |

Each filter supports `enabled`, `opacity`, and `options`.

## API

### `dreamcoreify(input, options?) → Promise<DreamcoreifyResult>`

Process an image and return encoded buffer.

- `input` — file path, `Buffer`, or `Uint8Array`
- `options.preset` — preset name
- `options.globalIntensity` — scale all effects (0–1)
- `options.output.format` — `'png'` | `'jpg'` | `'webp'`
- Returns `{ buffer, width, height, format }`

### `dreamcoreifyRaw(input, options?) → Promise<ImageData>`

Process and return raw RGBA pixel data for further manipulation.

### `dreamcoreifyTransitionFrame(input, frame, options?) → Promise<DreamcoreifyResult>`

Generate a single transition frame (0 = original, `transitionFrames` = full effect).

```ts
for (let i = 0; i < 30; i++) {
  const frame = await dreamcoreifyTransitionFrame('./photo.jpg', i, {
    preset: 'classic',
    transitionFrames: 30,
  });
  fs.writeFileSync(`frame_${String(i).padStart(3, '0')}.png`, frame.buffer);
}
```

## Development

```bash
npm run build     # tsup → dist/
npm run test      # vitest (30 tests)
npm run dev       # watch mode
```

## License

MIT