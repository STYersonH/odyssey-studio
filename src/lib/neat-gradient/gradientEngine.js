import {
  VERTEX_SHADER_GL1,
  FRAGMENT_SHADER_GL1,
  VERTEX_SHADER_GL2,
  FRAGMENT_SHADER_GL2,
} from "./shaders";

const PLANE_HEIGHT = 80;

const DEFAULTS = {
  colors: [],
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
  backgroundColor: "#ffffff",
  yOffset: 0,
  yOffsetWaveMultiplier: 1.5,
  yOffsetColorMultiplier: 1.8,
  resolution: 1,
};

function toUniforms(config) {
  return {
    speed: (config.speed ?? DEFAULTS.speed) / 20,
    colorPressure: [
      (config.horizontalPressure ?? DEFAULTS.horizontalPressure) / 4,
      (config.verticalPressure ?? DEFAULTS.verticalPressure) / 4,
    ],
    colorBlending: (config.colorBlending ?? DEFAULTS.colorBlending) / 10,
    saturation: (config.colorSaturation ?? DEFAULTS.colorSaturation) / 10,
    brightness: config.colorBrightness ?? DEFAULTS.colorBrightness,
    shadows: (config.shadows ?? DEFAULTS.shadows) / 100,
    highlights: (config.highlights ?? DEFAULTS.highlights) / 100,
    waveFreqX: (config.waveFrequencyX ?? DEFAULTS.waveFrequencyX) * 0.04,
    waveFreqY: (config.waveFrequencyY ?? DEFAULTS.waveFrequencyY) * 0.04,
    yOffsetWaveMult: (config.yOffsetWaveMultiplier ?? DEFAULTS.yOffsetWaveMultiplier) / 1000,
    yOffsetColorMult: (config.yOffsetColorMultiplier ?? DEFAULTS.yOffsetColorMultiplier) / 1000,
    yOffset: config.yOffset ?? DEFAULTS.yOffset,
  };
}

function hexToRgb(hex) {
  let h = String(hex).replace("#", "").trim();
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const int = parseInt(h, 16);
  if (Number.isNaN(int)) return [0, 0, 0];
  return [((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255];
}

function normalizeColors(colors) {
  return (colors || [])
    .map((c) => {
      if (typeof c === "string") return c;
      if (c && c.enabled === false) return null;
      return c ? c.color : null;
    })
    .filter(Boolean)
    .slice(0, 6);
}

function compileShader(gl, type, source, label) {
  if (!source || !String(source).trim()) {
    throw new Error(`Neat gradient ${label} shader source is empty`);
  }

  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error(`Neat gradient: failed to allocate ${label} shader`);
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader) || "(no compile log)";
    gl.deleteShader(shader);
    throw new Error(`Neat gradient ${label} shader error: ${info}`);
  }

  return shader;
}

function createContext(canvas) {
  const attrs = {
    alpha: false,
    antialias: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false,
  };

  const gl2 = canvas.getContext("webgl2", attrs);
  if (gl2) return { gl: gl2, version: 2 };

  const gl1 =
    canvas.getContext("webgl", attrs) || canvas.getContext("experimental-webgl", attrs);
  if (gl1) return { gl: gl1, version: 1 };

  return null;
}

function createWebGLGradient(options = {}) {
  const canvas = options.canvas;
  if (!canvas) throw new Error("createNeatGradient requires a `canvas`");

  // Reset any previous context on this canvas (React Strict Mode / HMR).
  const w = canvas.width;
  const h = canvas.height;
  canvas.width = w || 1;
  canvas.height = h || 1;

  const ctx = createContext(canvas);
  if (!ctx) throw new Error("WebGL is not supported in this environment");

  const { gl, version } = ctx;
  const vertexSource = version === 2 ? VERTEX_SHADER_GL2 : VERTEX_SHADER_GL1;
  const fragmentSource = version === 2 ? FRAGMENT_SHADER_GL2 : FRAGMENT_SHADER_GL1;

  const vs = compileShader(gl, gl.VERTEX_SHADER, vertexSource, `vertex (WebGL${version})`);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource, `fragment (WebGL${version})`);

  const program = gl.createProgram();
  if (!program) throw new Error("Neat gradient: failed to create program");

  gl.attachShader(program, vs);
  gl.attachShader(program, fs);

  if (version === 2) {
    gl.bindAttribLocation(program, 0, "aPos");
  }

  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const linkLog = gl.getProgramInfoLog(program) || "(no link log)";
    throw new Error(`Neat gradient link error (WebGL${version}): ${linkLog}`);
  }

  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

  const aPos = version === 2 ? 0 : gl.getAttribLocation(program, "aPos");
  if (aPos < 0) throw new Error("Neat gradient: attribute aPos not found");

  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const U = {
    time: gl.getUniformLocation(program, "uTime"),
    colors: gl.getUniformLocation(program, "uColors[0]"),
    count: gl.getUniformLocation(program, "uColorCount"),
    pressure: gl.getUniformLocation(program, "uColorPressure"),
    blend: gl.getUniformLocation(program, "uColorBlending"),
    sat: gl.getUniformLocation(program, "uSaturation"),
    bright: gl.getUniformLocation(program, "uBrightness"),
    shadows: gl.getUniformLocation(program, "uShadows"),
    highlights: gl.getUniformLocation(program, "uHighlights"),
    yOffset: gl.getUniformLocation(program, "uYOffset"),
    yWaveMult: gl.getUniformLocation(program, "uYOffsetWaveMult"),
    yColorMult: gl.getUniformLocation(program, "uYOffsetColorMult"),
    waveFreqX: gl.getUniformLocation(program, "uWaveFreqX"),
    waveFreqY: gl.getUniformLocation(program, "uWaveFreqY"),
  };

  let config = { ...DEFAULTS };
  let uniforms = toUniforms(config);
  let colorData = new Float32Array(18);
  let colorCount = 0;
  let tick = 0;
  let lastTime = performance.now();

  function resize() {
    const scale = (config.resolution || 1) * Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.floor(canvas.clientWidth * scale));
    const h = Math.max(1, Math.floor(canvas.clientHeight * scale));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  function applyConfig(next) {
    config = { ...config, ...next };
    uniforms = toUniforms(config);
    const enabled = normalizeColors(config.colors);
    colorCount = enabled.length;
    colorData = new Float32Array(18);
    for (let i = 0; i < colorCount; i++) {
      const [r, g, b] = hexToRgb(enabled[i]);
      colorData[i * 3] = r;
      colorData[i * 3 + 1] = g;
      colorData[i * 3 + 2] = b;
    }
    resize();
  }

  let raf = 0;
  let running = true;

  function frame(now) {
    if (!running) return;
    resize();

    const dt = (now - lastTime) / 1000;
    lastTime = now;
    tick += dt * uniforms.speed;

    gl.useProgram(program);
    gl.uniform1f(U.time, tick);
    gl.uniform3fv(U.colors, colorData);
    gl.uniform1f(U.count, colorCount);
    gl.uniform2f(U.pressure, uniforms.colorPressure[0], uniforms.colorPressure[1]);
    gl.uniform1f(U.blend, uniforms.colorBlending);
    gl.uniform1f(U.sat, uniforms.saturation);
    gl.uniform1f(U.bright, uniforms.brightness);
    gl.uniform1f(U.shadows, uniforms.shadows);
    gl.uniform1f(U.highlights, uniforms.highlights);
    gl.uniform1f(U.yOffset, uniforms.yOffset);
    gl.uniform1f(U.yWaveMult, uniforms.yOffsetWaveMult);
    gl.uniform1f(U.yColorMult, uniforms.yOffsetColorMult);
    gl.uniform1f(U.waveFreqX, uniforms.waveFreqX);
    gl.uniform1f(U.waveFreqY, uniforms.waveFreqY);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
    raf = requestAnimationFrame(frame);
  }

  const resizeObserver =
    typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => resize()) : null;
  if (resizeObserver) resizeObserver.observe(canvas);

  applyConfig(options);
  raf = requestAnimationFrame(frame);

  return {
    setConfig(next) {
      applyConfig(next);
    },
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
      if (resizeObserver) resizeObserver.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    },
  };
}

/**
 * Prussian-type plane gradient using custom WebGL shaders.
 */
export function createNeatGradient(options = {}) {
  return createWebGLGradient(options);
}

export { PLANE_HEIGHT };
