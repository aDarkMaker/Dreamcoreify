import type {
  ImageData,
  DreamcoreifyOptions,
  FilterName,
  FilterLayer,
} from "../types";
import { applyAdjustments } from "../filters/adjustments";
import { applyColorGrading } from "../filters/color-grading";
import { applyOverexposure } from "../filters/overexposure";
import { applyBloom } from "../filters/bloom";
import { applyHaze } from "../filters/haze";
import { applyBlur } from "../filters/blur";
import { applyChromaticAberration } from "../filters/chromatic-aberration";
import { applyGrain } from "../filters/grain";
import { applyVignette } from "../filters/vignette";
import { applyEdgeGlow } from "../filters/edge-glow";
import { cloneImageData } from "../utils/image-io";
import { lerp, clampByte } from "../utils/math";

const DEFAULT_FILTER_ORDER: FilterName[] = [
  "adjustments",
  "edgeGlow",
  "colorGrading",
  "overexposure",
  "bloom",
  "haze",
  "blur",
  "chromaticAberration",
  "grain",
  "vignette",
];

type FilterApplyFn = (
  imageData: ImageData,
  options: Record<string, unknown>,
  opacity: number,
  globalIntensity: number,
) => ImageData | Promise<ImageData>;

const FILTER_MAP: Record<FilterName, FilterApplyFn> = {
  adjustments: applyAdjustments as FilterApplyFn,
  edgeGlow: applyEdgeGlow as FilterApplyFn,
  colorGrading: applyColorGrading as FilterApplyFn,
  overexposure: applyOverexposure as FilterApplyFn,
  bloom: applyBloom as FilterApplyFn,
  haze: applyHaze as FilterApplyFn,
  blur: applyBlur as FilterApplyFn,
  chromaticAberration: applyChromaticAberration as FilterApplyFn,
  grain: applyGrain as FilterApplyFn,
  vignette: applyVignette as FilterApplyFn,
};

function getFilterLayer(
  options: DreamcoreifyOptions,
  name: FilterName,
): FilterLayer | undefined {
  return options[name] as FilterLayer | undefined;
}

function mergeOptions(
  base: DreamcoreifyOptions,
  override: DreamcoreifyOptions,
): DreamcoreifyOptions {
  const result: DreamcoreifyOptions = { ...base, ...override };

  const filterNames: FilterName[] = [
    "adjustments",
    "edgeGlow",
    "colorGrading",
    "overexposure",
    "bloom",
    "haze",
    "blur",
    "chromaticAberration",
    "grain",
    "vignette",
  ];

  for (const name of filterNames) {
    const baseLayer = getFilterLayer(base, name);
    const overrideLayer = getFilterLayer(override, name);

    if (baseLayer && overrideLayer) {
      (result as Record<string, unknown>)[name] = {
        ...baseLayer,
        ...overrideLayer,
        options: {
          ...(baseLayer.options || {}),
          ...(overrideLayer.options || {}),
        },
      };
    }
  }

  return result;
}

export async function runPipeline(
  imageData: ImageData,
  options: DreamcoreifyOptions,
): Promise<ImageData> {
  const globalIntensity = options.globalIntensity ?? 1;
  const filterOrder = options.filterOrder ?? DEFAULT_FILTER_ORDER;

  for (const filterName of filterOrder) {
    const layer = getFilterLayer(options, filterName);

    if (!layer || layer.enabled === false) continue;

    const filterFn = FILTER_MAP[filterName];
    if (!filterFn) continue;

    const filterOptions = (layer.options ?? {}) as Record<string, unknown>;
    const opacity = layer.opacity ?? 1;

    imageData = await filterFn(
      imageData,
      filterOptions,
      opacity,
      globalIntensity,
    );
  }

  return imageData;
}

export async function runPipelineWithTransition(
  imageData: ImageData,
  options: DreamcoreifyOptions,
  frame: number,
): Promise<ImageData> {
  const totalFrames = options.transitionFrames ?? 1;

  if (totalFrames <= 1 || frame >= totalFrames) {
    return runPipeline(imageData, options);
  }

  const t = Math.max(0, Math.min(1, frame / (totalFrames - 1)));

  const original = cloneImageData(imageData);
  const processed = await runPipeline(cloneImageData(imageData), options);

  const { data } = imageData;
  const origData = original.data;
  const procData = processed.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = clampByte(lerp(origData[i], procData[i], t));
    data[i + 1] = clampByte(lerp(origData[i + 1], procData[i + 1], t));
    data[i + 2] = clampByte(lerp(origData[i + 2], procData[i + 2], t));
    data[i + 3] = origData[i + 3];
  }

  return imageData;
}

export { mergeOptions, DEFAULT_FILTER_ORDER };
