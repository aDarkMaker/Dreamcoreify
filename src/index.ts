import type {
  ImageInput,
  DreamcoreifyOptions,
  PresetName,
  OutputFormat,
  ImageData,
} from "./types";
import { decodeImage, encodeImage, cloneImageData } from "./utils/image-io";
import {
  runPipeline,
  runPipelineWithTransition,
  mergeOptions,
} from "./core/pipeline";
import { getPreset, getPresetNames } from "./core/presets";

export interface DreamcoreifyResult {
  buffer: Buffer;
  width: number;
  height: number;
  format: OutputFormat;
}

export async function dreamcoreify(
  input: ImageInput,
  options?: DreamcoreifyOptions & { preset?: PresetName },
): Promise<DreamcoreifyResult> {
  const imageData = await decodeImage(input);

  let finalOptions: DreamcoreifyOptions = {};

  if (options?.preset) {
    const presetOptions = getPreset(options.preset);
    const { preset: _, ...userOverrides } = options;
    finalOptions = mergeOptions(presetOptions, userOverrides);
  } else if (options) {
    finalOptions = options;
  }

  const processed = await runPipeline(imageData, finalOptions);

  const format = finalOptions.output?.format ?? "png";
  const quality = finalOptions.output?.quality ?? 85;
  const buffer = await encodeImage(processed, format, quality);

  return {
    buffer,
    width: processed.width,
    height: processed.height,
    format,
  };
}

export async function dreamcoreifyRaw(
  input: ImageInput,
  options?: DreamcoreifyOptions & { preset?: PresetName },
): Promise<ImageData> {
  const imageData = await decodeImage(input);

  let finalOptions: DreamcoreifyOptions = {};

  if (options?.preset) {
    const presetOptions = getPreset(options.preset);
    const { preset: _, ...userOverrides } = options;
    finalOptions = mergeOptions(presetOptions, userOverrides);
  } else if (options) {
    finalOptions = options;
  }

  return runPipeline(imageData, finalOptions);
}

export async function dreamcoreifyTransitionFrame(
  input: ImageInput,
  frame: number,
  options?: DreamcoreifyOptions & { preset?: PresetName },
): Promise<DreamcoreifyResult> {
  const imageData = await decodeImage(input);

  let finalOptions: DreamcoreifyOptions = {};

  if (options?.preset) {
    const presetOptions = getPreset(options.preset);
    const { preset: _, ...userOverrides } = options;
    finalOptions = mergeOptions(presetOptions, userOverrides);
  } else if (options) {
    finalOptions = options;
  }

  const processed = await runPipelineWithTransition(
    imageData,
    finalOptions,
    frame,
  );

  const format = finalOptions.output?.format ?? "png";
  const quality = finalOptions.output?.quality ?? 85;
  const buffer = await encodeImage(processed, format, quality);

  return {
    buffer,
    width: processed.width,
    height: processed.height,
    format,
  };
}

export { getPreset, getPresetNames, mergeOptions };

export { runPipeline, runPipelineWithTransition } from "./core/pipeline";
export { decodeImage, encodeImage, cloneImageData } from "./utils/image-io";

export type {
  ImageInput,
  ImageData,
  OutputFormat,
  OutputOptions,
  DreamcoreifyOptions,
  FilterName,
  FilterLayer,
  PresetName,
  BloomOptions,
  ColorGradingOptions,
  VignetteOptions,
  HazeOptions,
  GrainOptions,
  OverexposureOptions,
  ChromaticAberrationOptions,
  BlurOptions,
  AdjustmentsOptions,
  EdgeGlowOptions,
} from "./types";

export { applyAdjustments } from "./filters/adjustments";
export { applyColorGrading } from "./filters/color-grading";
export { applyOverexposure } from "./filters/overexposure";
export { applyBloom } from "./filters/bloom";
export { applyHaze } from "./filters/haze";
export { applyBlur } from "./filters/blur";
export { applyChromaticAberration } from "./filters/chromatic-aberration";
export { applyGrain } from "./filters/grain";
export { applyVignette } from "./filters/vignette";
export { applyEdgeGlow } from "./filters/edge-glow";
