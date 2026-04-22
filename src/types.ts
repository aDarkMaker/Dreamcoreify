export type ImageInput = string | Buffer | Uint8Array;

export type OutputFormat = "png" | "jpg" | "webp";

export interface OutputOptions {
  format?: OutputFormat;
  quality?: number;
}

export interface BloomOptions {
  intensity?: number;
  radius?: number;
  threshold?: number;
}

export interface ColorGradingOptions {
  shadowsTint?: string;
  midtonesTint?: string;
  highlightsTint?: string;
  strength?: number;
}

export interface VignetteOptions {
  intensity?: number;
  color?: string;
  roundness?: number;
  feather?: number;
}

export interface HazeOptions {
  intensity?: number;
  color?: string;
  distribution?:
    | "uniform"
    | "radial-center"
    | "radial-edge"
    | "gradient-top"
    | "gradient-bottom";
}

export interface GrainOptions {
  intensity?: number;
  size?: number;
  colored?: boolean;
}

export interface OverexposureOptions {
  intensity?: number;
  threshold?: number;
}

export interface ChromaticAberrationOptions {
  offset?: number;
  angle?: number;
  radial?: boolean;
}

export interface BlurOptions {
  type?: "gaussian" | "radial" | "motion";
  radius?: number;
  angle?: number;
}

export interface AdjustmentsOptions {
  brightness?: number;
  contrast?: number;
  saturation?: number;
  temperature?: number;
  highlightsBrightness?: number;
  shadowsBrightness?: number;
}

export interface EdgeGlowOptions {
  radius?: number;
  threshold?: number;
  exposureBoost?: number;
  shadowTint?: string;
  highlightTint?: string;
  tintStrength?: number;
}

export interface FilterLayer<T = Record<string, unknown>> {
  enabled?: boolean;
  opacity?: number;
  options?: T;
}

export interface DreamcoreifyOptions {
  bloom?: FilterLayer<BloomOptions>;
  colorGrading?: FilterLayer<ColorGradingOptions>;
  vignette?: FilterLayer<VignetteOptions>;
  haze?: FilterLayer<HazeOptions>;
  grain?: FilterLayer<GrainOptions>;
  overexposure?: FilterLayer<OverexposureOptions>;
  chromaticAberration?: FilterLayer<ChromaticAberrationOptions>;
  blur?: FilterLayer<BlurOptions>;
  adjustments?: FilterLayer<AdjustmentsOptions>;
  edgeGlow?: FilterLayer<EdgeGlowOptions>;

  globalIntensity?: number;

  transitionFrames?: number;

  filterOrder?: FilterName[];

  output?: OutputOptions;
}

export type FilterName =
  | "bloom"
  | "colorGrading"
  | "vignette"
  | "haze"
  | "grain"
  | "overexposure"
  | "chromaticAberration"
  | "blur"
  | "adjustments"
  | "edgeGlow";

export type PresetName =
  | "classic"
  | "liminal"
  | "nostalgic"
  | "void"
  | "ethereal"
  | "vaporwave";

export type FilterFunction = (
  imageDate: ImageData,
  options: Record<string, unknown>,
  opacity: number,
  globalIntensity: number,
) => Promise<ImageData> | ImageData;

export interface ImageData {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}
