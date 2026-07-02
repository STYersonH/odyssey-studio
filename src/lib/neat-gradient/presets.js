// Prussian-type presets (Neat "Prussian" algorithm — flat shading, no flow/waves).
// User-facing values match Neat editor exports.

/** Odyssey hero palette on Prussian settings */
export const apricotStorm = {
  colors: ["#95B5D4", "#DCBD95", "#EBDAC2", "#95ACC1", "#DEBE8E"],
  speed: 2,
  horizontalPressure: 3,
  verticalPressure: 4,
  waveFrequencyX: 0,
  waveFrequencyY: 0,
  waveAmplitude: 0,
  colorBlending: 10,
  colorSaturation: 8,
  colorBrightness: 1,
  shadows: 2,
  highlights: 7,
  backgroundColor: "#EEE3E1",
  yOffset: 7500,
  yOffsetWaveMultiplier: 1.5,
  yOffsetColorMultiplier: 1.8,
  resolution: 0.5,
};

/** Default Neat "Prussian" preset colors (reference) */
export const prussian = {
  colors: ["#0b3954", "#087e8b", "#bfd7ea", "#ff5a5f", "#c81d25"],
  speed: 4,
  horizontalPressure: 4,
  verticalPressure: 3,
  waveFrequencyX: 0,
  waveFrequencyY: 0,
  waveAmplitude: 0,
  colorBlending: 5,
  colorSaturation: 8,
  colorBrightness: 1,
  shadows: 2,
  highlights: 7,
  backgroundColor: "#FF0000",
  yOffset: 0,
  yOffsetWaveMultiplier: 1.5,
  yOffsetColorMultiplier: 1.8,
  resolution: 0.5,
};

export const presets = { apricotStorm, prussian };
