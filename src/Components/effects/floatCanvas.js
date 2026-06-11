/**
 * WebGL (ogl) displacement canvas for the roster INDEX hover preview.
 * One renderer, one plane: the hovered headshot warps with pointer velocity
 * — a wave + RGB-split driven by `uVelo`. Loaded lazily; callers must
 * capability-check first (WebGL2 + fine pointer + motion allowed).
 */
import { Renderer, Program, Mesh, Plane, Texture } from "ogl";

/* The 2x2 plane spans clip space exactly, so no camera matrices are needed —
   render() is called without a camera and would otherwise leave them unset. */
const VERTEX = /* glsl */ `
  attribute vec2 uv;
  attribute vec3 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  precision highp float;
  uniform sampler2D tMap;
  uniform float uVelo;
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    float bend = uVelo * 0.6;
    uv.x += sin(uv.y * 6.2831 + uTime * 2.0) * bend * 0.06;
    uv.y += sin(uv.x * 6.2831 + uTime * 1.4) * bend * 0.03;

    float split = bend * 0.04;
    float r = texture2D(tMap, uv + vec2(split, 0.0)).r;
    float g = texture2D(tMap, uv).g;
    float b = texture2D(tMap, uv - vec2(split, 0.0)).b;
    float a = texture2D(tMap, uv).a;
    gl_FragColor = vec4(r, g, b, a);
  }
`;

export function createFloatCanvas(container, { width, height }) {
  const renderer = new Renderer({
    alpha: true,
    dpr: Math.min(window.devicePixelRatio, 2),
    width,
    height,
  });
  const { gl } = renderer;
  container.appendChild(gl.canvas);

  const texture = new Texture(gl, { generateMipmaps: false });
  const program = new Program(gl, {
    vertex: VERTEX,
    fragment: FRAGMENT,
    uniforms: {
      tMap: { value: texture },
      uVelo: { value: 0 },
      uTime: { value: 0 },
    },
    transparent: true,
  });
  const mesh = new Mesh(gl, {
    geometry: new Plane(gl, { width: 2, height: 2 }),
    program,
  });

  let raf = null;
  let velo = 0;
  let targetVelo = 0;
  let running = false;
  const start = performance.now();

  const loop = () => {
    velo += (targetVelo - velo) * 0.08;
    targetVelo *= 0.9;
    program.uniforms.uVelo.value = velo;
    program.uniforms.uTime.value = (performance.now() - start) / 1000;
    renderer.render({ scene: mesh });
    raf = requestAnimationFrame(loop);
  };

  const images = new Map();

  return {
    setImage(src) {
      const cached = images.get(src);
      if (cached) {
        texture.image = cached;
        texture.needsUpdate = true;
        return;
      }
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        images.set(src, img);
        texture.image = img;
        texture.needsUpdate = true;
      };
      img.src = src;
    },
    kick(amount) {
      targetVelo = Math.min(targetVelo + amount, 1.2);
    },
    play() {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    },
    pause() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = null;
    },
    destroy() {
      this.pause();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      gl.canvas.remove();
    },
  };
}
