import type { DreamcoreifyOptions, PresetName } from "../types";

const PRESET_CLASSIC: DreamcoreifyOptions = {
  adjustments: {
    options: {
      brightness: 0.05,
      contrast: -0.15,
      saturation: -0.1,
      temperature: 0.15,
    },
  },
  colorGrading: {
    options: {
      shadowsTint: "#1a0533",
      midtonesTint: "#8b6914",
      highlightsTint: "#c9a8e8",
      strength: 0.3,
    },
  },
  overexposure: {
    options: { intensity: 0.2, threshold: 200 },
  },
  bloom: {
    options: { intensity: 0.4, radius: 20, threshold: 180 },
  },
  haze: {
    options: { intensity: 0.25, color: "#f5e6d3", distribution: "uniform" },
  },
  blur: {
    options: { type: "gaussian", radius: 1.5 },
  },
  chromaticAberration: {
    options: { offset: 2, angle: 0, radial: true },
  },
  grain: {
    options: { intensity: 0.25, size: 1, colored: false },
  },
  vignette: {
    options: { intensity: 0.5, color: "#000000", roundness: 0.3, feather: 0.6 },
  },
};

const PRESET_LIMINAL: DreamcoreifyOptions = {
  adjustments: {
    options: {
      brightness: 0.08,
      contrast: -0.05,
      saturation: -0.3,
      temperature: -0.2,
    },
  },
  colorGrading: {
    options: {
      shadowsTint: "#0a1628",
      midtonesTint: "#2a4a3a",
      highlightsTint: "#e8f0d0",
      strength: 0.35,
    },
  },
  overexposure: {
    options: { intensity: 0.35, threshold: 170 },
  },
  bloom: {
    options: { intensity: 0.5, radius: 30, threshold: 160 },
  },
  haze: {
    options: { intensity: 0.15, color: "#d4e8d0", distribution: "radial-edge" },
  },
  blur: {
    options: { type: "gaussian", radius: 1 },
  },
  chromaticAberration: {
    options: { offset: 4, angle: 45, radial: true },
  },
  grain: {
    options: { intensity: 0.2, size: 1, colored: false },
  },
  vignette: {
    options: { intensity: 0.7, color: "#050a0f", roundness: 0.2, feather: 0.5 },
  },
};

const PRESET_NOSTALGIC: DreamcoreifyOptions = {
  adjustments: {
    options: {
      brightness: 0.03,
      contrast: -0.2,
      saturation: -0.25,
      temperature: 0.25,
    },
  },
  colorGrading: {
    options: {
      shadowsTint: "#2a1a0a",
      midtonesTint: "#a08050",
      highlightsTint: "#f0e0c0",
      strength: 0.35,
    },
  },
  overexposure: {
    options: { intensity: 0.15, threshold: 210 },
  },
  bloom: {
    options: { intensity: 0.3, radius: 15, threshold: 190 },
  },
  haze: {
    options: {
      intensity: 0.2,
      color: "#e8d8c0",
      distribution: "gradient-bottom",
    },
  },
  blur: {
    options: { type: "gaussian", radius: 1.2 },
  },
  chromaticAberration: {
    options: { offset: 1.5, angle: 0, radial: true },
  },
  grain: {
    options: { intensity: 0.45, size: 2, colored: false },
  },
  vignette: {
    options: {
      intensity: 0.55,
      color: "#1a0f00",
      roundness: 0.4,
      feather: 0.65,
    },
  },
};

const PRESET_VOID: DreamcoreifyOptions = {
  adjustments: {
    options: {
      brightness: -0.05,
      contrast: -0.1,
      saturation: -0.5,
      temperature: -0.1,
    },
  },
  colorGrading: {
    options: {
      shadowsTint: "#0a0012",
      midtonesTint: "#1a1025",
      highlightsTint: "#8070a0",
      strength: 0.4,
    },
  },
  overexposure: {
    options: { intensity: 0.1, threshold: 220 },
  },
  bloom: {
    options: { intensity: 0.2, radius: 25, threshold: 200 },
  },
  haze: {
    options: { intensity: 0.3, color: "#0a0a15", distribution: "radial-edge" },
  },
  blur: {
    options: { type: "gaussian", radius: 2 },
  },
  chromaticAberration: {
    options: { offset: 3, angle: 90, radial: true },
  },
  grain: {
    options: { intensity: 0.35, size: 1, colored: false },
  },
  vignette: {
    options: { intensity: 0.8, color: "#000000", roundness: 0.2, feather: 0.4 },
  },
};

const PRESET_ETHEREAL: DreamcoreifyOptions = {
  adjustments: {
    options: {
      brightness: 0.1,
      contrast: -0.2,
      saturation: -0.05,
      temperature: 0.05,
    },
  },
  colorGrading: {
    options: {
      shadowsTint: "#1a1030",
      midtonesTint: "#7060a0",
      highlightsTint: "#f0e8ff",
      strength: 0.25,
    },
  },
  overexposure: {
    options: { intensity: 0.3, threshold: 180 },
  },
  bloom: {
    options: { intensity: 0.6, radius: 35, threshold: 150 },
  },
  haze: {
    options: {
      intensity: 0.3,
      color: "#f0e8ff",
      distribution: "radial-center",
    },
  },
  blur: {
    options: { type: "gaussian", radius: 2.5 },
  },
  chromaticAberration: {
    options: { offset: 5, angle: 30, radial: true },
  },
  grain: {
    options: { intensity: 0.15, size: 1, colored: true },
  },
  vignette: {
    options: {
      intensity: 0.35,
      color: "#100820",
      roundness: 0.3,
      feather: 0.7,
    },
  },
};

const PRESET_VAPORWAVE: DreamcoreifyOptions = {
  adjustments: {
    options: {
      brightness: 0.12,
      contrast: -0.1,
      saturation: 0.5,
      temperature: 0.25,
    },
  },
  colorGrading: {
    options: {
      shadowsTint: '#00ff60',
      midtonesTint: '#ff2090',
      highlightsTint: '#ffaa20',
      strength: 0.7,
    },
  },
  overexposure: {
    options: { intensity: 0.35, threshold: 175 },
  },
  bloom: {
    options: { intensity: 0.35, radius: 10, threshold: 180 },
  },
  haze: {
    options: {
      intensity: 0.12,
      color: '#ff90c0',
      distribution: 'gradient-top',
    },
  },
  blur: {
    options: { type: 'gaussian', radius: 0.3 },
  },
  chromaticAberration: {
    options: { offset: 5, angle: 20, radial: true },
  },
  grain: {
    options: { intensity: 0.25, size: 1, colored: false },
  },
  vignette: {
    options: {
      intensity: 0.3,
      color: '#1a0a20',
      roundness: 0.3,
      feather: 0.65,
    },
  },
};

const PRESETS: Record<PresetName, DreamcoreifyOptions> = {
  classic: PRESET_CLASSIC,
  liminal: PRESET_LIMINAL,
  nostalgic: PRESET_NOSTALGIC,
  void: PRESET_VOID,
  ethereal: PRESET_ETHEREAL,
  vaporwave: PRESET_VAPORWAVE,
};

export function getPreset(name: PresetName): DreamcoreifyOptions {
  return PRESETS[name];
}

export function getPresetNames(): PresetName[] {
  return Object.keys(PRESETS) as PresetName[];
}
