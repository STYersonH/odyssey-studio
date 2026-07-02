/** Fallback renderer using @firecms/neat (Prussian / flat shading). */
export async function createFirecmsGradient(options = {}) {
  const { NeatGradient } = await import("@firecms/neat");

  const canvas = options.canvas;
  if (!canvas) throw new Error("createFirecmsGradient requires a `canvas`");

  let config = { ...options };
  delete config.canvas;

  const neat = new NeatGradient(toNeatConfig(canvas, config));

  return {
    setConfig(next) {
      config = { ...config, ...next };
      applyPatch(neat, next);
    },
    destroy() {
      neat.destroy();
    },
  };
}

function toNeatColors(colors) {
  return (colors || [])
    .map((c) => {
      if (typeof c === "string") return { color: c, enabled: true };
      if (c && c.enabled === false) return null;
      return c ? { color: c.color, enabled: true } : null;
    })
    .filter(Boolean)
    .slice(0, 6);
}

function toNeatConfig(canvas, config) {
  return {
    ref: canvas,
    colors: toNeatColors(config.colors),
    speed: config.speed ?? 2,
    horizontalPressure: config.horizontalPressure ?? 3,
    verticalPressure: config.verticalPressure ?? 4,
    waveFrequencyX: config.waveFrequencyX ?? 0,
    waveFrequencyY: config.waveFrequencyY ?? 0,
    waveAmplitude: config.waveAmplitude ?? 0,
    colorBlending: config.colorBlending ?? 10,
    colorSaturation: config.colorSaturation ?? 8,
    colorBrightness: config.colorBrightness ?? 1,
    shadows: config.shadows ?? 2,
    highlights: config.highlights ?? 7,
    backgroundColor: config.backgroundColor ?? "#ffffff",
    yOffset: config.yOffset ?? 0,
    yOffsetWaveMultiplier: config.yOffsetWaveMultiplier ?? 1.5,
    yOffsetColorMultiplier: config.yOffsetColorMultiplier ?? 1.8,
    resolution: config.resolution ?? 0.5,
    flowEnabled: false,
    flatShading: true,
    shapeType: "plane",
    enableProceduralTexture: false,
    grainIntensity: 0,
    domainWarpEnabled: false,
  };
}

function applyPatch(neat, patch) {
  if (patch.colors !== undefined) neat.colors = toNeatColors(patch.colors);
  if (patch.speed !== undefined) neat.speed = patch.speed;
  if (patch.horizontalPressure !== undefined) neat.horizontalPressure = patch.horizontalPressure;
  if (patch.verticalPressure !== undefined) neat.verticalPressure = patch.verticalPressure;
  if (patch.waveFrequencyX !== undefined) neat.waveFrequencyX = patch.waveFrequencyX;
  if (patch.waveFrequencyY !== undefined) neat.waveFrequencyY = patch.waveFrequencyY;
  if (patch.waveAmplitude !== undefined) neat.waveAmplitude = patch.waveAmplitude;
  if (patch.colorBlending !== undefined) neat.colorBlending = patch.colorBlending;
  if (patch.colorSaturation !== undefined) neat.colorSaturation = patch.colorSaturation;
  if (patch.colorBrightness !== undefined) neat.colorBrightness = patch.colorBrightness;
  if (patch.shadows !== undefined) neat.shadows = patch.shadows;
  if (patch.highlights !== undefined) neat.highlights = patch.highlights;
  if (patch.backgroundColor !== undefined) neat.backgroundColor = patch.backgroundColor;
  if (patch.yOffset !== undefined) neat.yOffset = patch.yOffset;
  if (patch.yOffsetWaveMultiplier !== undefined) {
    neat.yOffsetWaveMultiplier = patch.yOffsetWaveMultiplier;
  }
  if (patch.yOffsetColorMultiplier !== undefined) {
    neat.yOffsetColorMultiplier = patch.yOffsetColorMultiplier;
  }
  if (patch.resolution !== undefined) neat.resolution = patch.resolution;
}
