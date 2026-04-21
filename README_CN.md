# Dreamcoreify

将任意图片转化为梦核 / 阈限空间美学风格。

9 个可组合滤镜 · 6 套内置预设 · 过渡帧生成 · TypeScript + ESM/CJS

[English](./README.md)

## 安装

```bash
npm install dreamcoreify
```

> 需要 Node.js ≥ 18。

## 快速开始

```ts
import fs from 'fs';
import { dreamcoreify } from 'dreamcoreify';

const result = await dreamcoreify('./photo.jpg', { preset: 'classic' });
fs.writeFileSync('output.png', result.buffer);
```

## 预设

| 名称 | 风格 |
|------|------|
| `classic` | 经典梦核：暖黄泛光、低对比度、均匀雾化 |
| `liminal` | 阈限空间：冷绿色调、强暗角、荧光过曝 |
| `nostalgic` | 怀旧梦核：浓重噪点、褪色调、暖色温 |
| `void` | 深渊梦核：极低饱和、暗色雾气、深暗角 |
| `ethereal` | 空灵梦核：高泛光、柔模糊、彩色噪点 |
| `vaporwave` | 蒸汽波梦核：荧光绿暗部、亮粉中调、浓橙高光 |

```ts
import { getPresetNames } from 'dreamcoreify';
console.log(getPresetNames());
// ['classic', 'liminal', 'nostalgic', 'void', 'ethereal', 'vaporwave']
```

## 自定义参数

在预设基础上覆盖部分参数：

```ts
const result = await dreamcoreify('./photo.jpg', {
  preset: 'classic',
  globalIntensity: 0.8,
  bloom: { options: { intensity: 0.7, radius: 20 } },
  grain: { enabled: false },
  output: { format: 'webp', quality: 90 },
});
```

完全自定义（不使用预设）：

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

## 滤镜一览

| 滤镜 | 关键参数 |
|------|---------|
| **基础调整** | `brightness` `contrast` `saturation` `temperature` |
| **色彩分级** | `shadowsTint` `midtonesTint` `highlightsTint` `strength` |
| **过曝** | `intensity` `threshold` |
| **泛光** | `intensity` `radius` `threshold` |
| **雾化** | `intensity` `color` `distribution` |
| **模糊** | `type(gaussian/radial/motion)` `radius` `angle` |
| **色差** | `offset` `angle` `radial` |
| **噪点** | `intensity` `size` `colored` |
| **暗角** | `intensity` `color` `roundness` `feather` |

每个滤镜均支持 `enabled`（启用/禁用）、`opacity`（不透明度）和 `options`（具体参数）。

## API

### `dreamcoreify(input, options?) → Promise<DreamcoreifyResult>`

处理图片并返回编码后的 Buffer。

- `input` — 文件路径、`Buffer` 或 `Uint8Array`
- `options.preset` — 预设名称
- `options.globalIntensity` — 全局强度缩放（0–1）
- `options.output.format` — `'png'` | `'jpg'` | `'webp'`
- 返回 `{ buffer, width, height, format }`

### `dreamcoreifyRaw(input, options?) → Promise<ImageData>`

处理并返回原始 RGBA 像素数据，便于二次加工。

### `dreamcoreifyTransitionFrame(input, frame, options?) → Promise<DreamcoreifyResult>`

生成单帧过渡效果（第 0 帧 = 原图，最后一帧 = 完整效果），可用于制作渐变动画或视频。

```ts
for (let i = 0; i < 30; i++) {
  const frame = await dreamcoreifyTransitionFrame('./photo.jpg', i, {
    preset: 'classic',
    transitionFrames: 30,
  });
  fs.writeFileSync(`frame_${String(i).padStart(3, '0')}.png`, frame.buffer);
}
// 用 ffmpeg 合成视频：
// ffmpeg -framerate 10 -i frame_%03d.png -c:v libx264 output.mp4
```

## 开发

```bash
npm run build     # tsup 构建 → dist/
npm run test      # vitest 运行测试（30 个用例）
npm run dev       # 监听模式
```

## 许可证

MIT